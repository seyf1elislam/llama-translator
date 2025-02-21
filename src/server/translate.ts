'use server';

// import { createWriteStream } from 'fs';
// import { unlink } from 'fs/promises';
import mammoth from 'mammoth';
import { OpenAI } from 'openai';

// import { tmpdir } from 'os';
// import { join } from 'path';

import { parsePdfFileSSA } from './parsepdf';

type OpenAIConftype = {
  model: string;
  temperature: number;
  max_tokens: number;
};

export async function translate(formData: FormData): Promise<{
  translatedText?: string;
  fileName?: string;
  sourceLang?: string;
  targetLang?: string;
  error?: string;
}> {
  // const MODEL_NAME = 'gemini-2.0-pro-exp-02-05';
  // const openai = new OpenAI({
  //   apiKey: process.env.OPENAI_API_KEY,
  //   baseURL: process.env.OPENAI_BASE_URL, // Your custom base URL
  // });

  try {
    const file = formData.get('file') as File;
    const sourceLang = formData.get('sourceLang') as string;
    const targetLang = formData.get('targetLang') as string;
    const openaiBaseUrl = formData.get('openaiBaseUrl') as string;
    const openaiToken = formData.get('openaiToken') as string;
    const modelName = formData.get('modelName') as string;
    const temperature: number =
      parseFloat(formData.get('temperature') as string) ?? 0.2;
    const maxSeq: number = parseInt(formData.get('maxSeq') as string) ?? 0.2;

    if (
      !file ||
      !sourceLang ||
      !targetLang ||
      !openaiBaseUrl ||
      !openaiToken ||
      !modelName
    ) {
      return { error: 'Missing required fields' };
    }
    // ? -- OpenAI client
    const openaiConfig: OpenAIConftype = {
      model: modelName ?? 'gemini-2.0-pro-exp-02-05',
      temperature: temperature ?? 0.3,
      max_tokens: maxSeq ?? 8126,
    };

    const openai = new OpenAI({
      apiKey: openaiToken,
      baseURL: openaiBaseUrl,
      dangerouslyAllowBrowser: true,
    });

    // Save temporary file
    // const tempPath = join(tmpdir(), file.name);
    const buffer = Buffer.from(await file.arrayBuffer());
    // await writeFile(tempPath, buffer);

    // Extract text from file
    let text: string;
    switch (file.type) {
      case 'text/plain':
        text = buffer.toString();
        break;
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        const result = await mammoth.extractRawText({ buffer });
        text = result.value;
        break;
      case 'application/pdf':
        // const pdfData = await pdf(buffer);
        const pdfData = await parsePdfFileSSA(buffer);
        text = pdfData.text;
        break;
      default:
        return { error: 'Unsupported file type' };
    }

    // Split text into manageable chunks
    const chunks = splitTextIntoChunks(text);

    // Translate each chunk
    let translatedText = '';
    for (const chunk of chunks) {
      translatedText +=
        (await translateText(
          openai,
          // MODEL_NAME,
          chunk,
          sourceLang,
          targetLang,
          openaiConfig,
        )) + '\n';
    }

    // Clean up temp file
    // await unlink(tempPath);

    return {
      translatedText,
      fileName: file.name,
      sourceLang,
      targetLang,
    };
  } catch (error) {
    console.error('Translation error:', error);
    return { error: 'Failed to process translation' };
  }
}

function splitTextIntoChunks(text: string, maxChunkSize = 3000): string[] {
  const chunks = [];
  let currentChunk = '';

  const paragraphs = text.split('\n');
  for (const paragraph of paragraphs) {
    if (currentChunk.length + paragraph.length > maxChunkSize) {
      chunks.push(currentChunk);
      currentChunk = '';
    }
    currentChunk += paragraph + '\n';
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  return chunks;
}

// async function writeFile(path: string, data: Buffer): Promise<void> {
//   return new Promise((resolve, reject) => {
//     const stream = createWriteStream(path);
//     stream.write(data);
//     stream.end();
//     stream.on('finish', resolve);
//     stream.on('error', reject);
//   });
// }

export async function translateText(
  openai: OpenAI,
  text: string,
  sourceLang: string,
  targetLang: string,
  config: OpenAIConftype,
): Promise<string | undefined> {
  try {
    const completion = await openai.chat.completions.create({
      ...config,
      messages: [
        {
          role: 'system',
          content: `
You are a professional translator. Translate the following text from ${sourceLang} to ${targetLang}.
 Preserve all formatting, special characters, and technical terms. Respond only with the translation.`,
        },
        {
          role: 'user',
          content: text,
        },
      ],
    });

    return completion.choices[0].message.content ?? '';
  } catch (error) {
    console.error('Translation error:', error);
    return undefined;
  }
}
