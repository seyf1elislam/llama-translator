'use server';

import mammoth from 'mammoth';
import { OpenAI } from 'openai';

import { parsePdfFileSSA } from './parsepdf';

type OpenAIConfigType = {
  model: string;
  temperature: number;
  max_tokens: number;
};

export async function translate(formData: FormData): Promise<{
  translatedText?: string;
  fileName?: string; // Keep filename for potential download naming
  sourceLang?: string;
  targetLang?: string;
  error?: string;
}> {
  try {
    // Prioritize textContent if sent, otherwise fall back to file processing
    const textContent = formData.get('textContent') as string | null;
    const file = formData.get('file') as File | null; // File might still be sent for metadata

    const sourceLang = formData.get('sourceLang') as string;
    const targetLang = formData.get('targetLang') as string;
    const openaiBaseUrl = formData.get('openaiBaseUrl') as string;
    const openaiToken = formData.get('openaiToken') as string;
    const modelName = formData.get('modelName') as string;
    const temperature = parseFloat(formData.get('temperature') as string);
    const maxSeq = parseInt(formData.get('maxSeq') as string, 10);

    if (
      (!textContent && !file) || // Need either content or a file
      !sourceLang ||
      !targetLang ||
      !openaiBaseUrl ||
      !openaiToken ||
      !modelName ||
      isNaN(temperature) || // Check if parsing succeeded
      isNaN(maxSeq)
    ) {
      console.error('Missing required fields:', {
        textContentExists: !!textContent,
        fileExists: !!file,
        sourceLang,
        targetLang,
        openaiBaseUrl,
        openaiTokenExists: !!openaiToken,
        modelName,
        temperature,
        maxSeq,
      });
      return { error: 'Missing or invalid required fields for translation.' };
    }

    let textToTranslate: string;

    // If textContent is provided, use it directly
    if (textContent) {
      textToTranslate = textContent;
    } else if (file) {
      // If only file is provided, extract text (fallback)
      const buffer = Buffer.from(await file.arrayBuffer());
      switch (file.type) {
        case 'text/plain':
          textToTranslate = buffer.toString('utf-8');
          break;
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          const docxResult = await mammoth.extractRawText({ buffer });
          textToTranslate = docxResult.value;
          break;
        case 'application/pdf':
          const pdfData = await parsePdfFileSSA(buffer);
          textToTranslate = pdfData.text;
          break;
        default:
          return { error: 'Unsupported file type' };
      }
    } else {
      // Should not happen due to initial check, but safeguard
      return { error: 'No content or file provided for translation.' };
    }

    // OpenAI client setup
    const openaiConfig: OpenAIConfigType = {
      model: modelName,
      temperature: temperature,
      max_tokens: maxSeq,
    };

    const openai = new OpenAI({
      apiKey: openaiToken,
      baseURL: openaiBaseUrl,
      dangerouslyAllowBrowser: true,
    });

    // Split text into manageable chunks
    // Consider a more robust chunking strategy if needed (e.g., sentence boundaries)
    const chunks = splitTextIntoChunks(textToTranslate);

    // Translate each chunk
    let translatedText = '';
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const translatedChunk = await translateText(
        openai,
        chunk,
        sourceLang,
        targetLang,
        openaiConfig,
      );
      if (translatedChunk === undefined) {
        // Handle potential error from translateText if needed
        console.warn(`Warning: Chunk ${i + 1} translation failed.`);
        // Optionally append original chunk or placeholder
        // translatedText += `\n--- ERROR TRANSLATING CHUNK ${i+1} ---\n${chunk}\n`;
      } else {
        translatedText += translatedChunk + (i < chunks.length - 1 ? '\n' : ''); // Add newline between chunks
      }
    }

    return {
      translatedText,
      fileName: file?.name, // Pass filename back if file was provided
      sourceLang,
      targetLang,
    };
  } catch (error: any) {
    console.error('Translation server action error:', error);
    // Provide more specific error messages if possible
    let errorMessage = 'Failed to process translation.';
    if (error.response && error.response.status === 401) {
      errorMessage = 'Authentication error. Please check your API token.';
    } else if (error.response && error.response.status === 429) {
      errorMessage = 'Rate limit exceeded. Please try again later.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    return { error: errorMessage };
  }
}

function splitTextIntoChunks(text: string, maxChunkSize = 32000): string[] {
  // Simple split by length, respecting newlines where possible
  const chunks: string[] = [];
  let remainingText = text;

  while (remainingText.length > 0) {
    if (remainingText.length <= maxChunkSize) {
      chunks.push(remainingText);
      break;
    }

    let chunkEnd = maxChunkSize;
    // Try to find a newline near the max size to split cleanly
    const lastNewline = remainingText.lastIndexOf('\n', maxChunkSize);
    if (lastNewline > maxChunkSize / 2) {
      // Avoid tiny chunks if newline is too early
      chunkEnd = lastNewline + 1; // Include the newline in the previous chunk
    }

    chunks.push(remainingText.substring(0, chunkEnd));
    remainingText = remainingText.substring(chunkEnd);
  }

  return chunks.filter((chunk) => chunk.trim().length > 0); // Remove empty chunks
}

export async function translateText(
  openai: OpenAI,
  text: string,
  sourceLang: string, // 'auto' means auto-detect
  targetLang: string,
  config: OpenAIConfigType,
): Promise<string | undefined> {
  const systemPrompt = `You are a professional, highly accurate translator. Translate the following text${sourceLang !== 'auto' ? ` from ${sourceLang}` : ''} to ${targetLang}. Preserve all original formatting, including line breaks, spacing, markdown, and special characters. Maintain the original tone and style. Respond ONLY with the translated text, without any additional comments, introductions, or explanations.`;

  try {
    const completion = await openai.chat.completions.create({
      ...config,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text },
      ],
    });

    return completion.choices[0].message.content?.trim() ?? ''; // Trim potential leading/trailing whitespace from API response
  } catch (error) {
    console.error('OpenAI API error during translation:', error);
    // Re-throw or handle specific API errors (like 401, 429) if needed upstream
    throw error; // Propagate the error to be caught in handleTranslate
  }
}
