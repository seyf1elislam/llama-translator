// import pdfParse from 'pdf-parse';
import {  createWriteStream } from 'fs';
import { unlink } from 'fs/promises';
import mammoth from 'mammoth';
import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { tmpdir } from 'os';
import { join } from 'path';

const MODEL_NAME = 'gemini-2.0-pro-exp-02-05';
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL, // Your custom base URL
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const sourceLang = formData.get('sourceLang') as string;
    const targetLang = formData.get('targetLang') as string;

    if (!file || !sourceLang || !targetLang) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // Save temporary file
    const tempPath = join(tmpdir(), file.name);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(tempPath, buffer);

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
      // case 'application/pdf':
      //   const pdfData = await pdfParse(buffer);
      //   text = pdfData.text;
      //   break;
      default:
        return NextResponse.json(
          { error: 'Unsupported file type' },
          { status: 400 },
        );
    }

    // Split text into manageable chunks
    const chunks = splitTextIntoChunks(text);

    // Translate each chunk
    let translatedText = '';
    for (const chunk of chunks) {
      const completion = await openai.chat.completions.create({
        model: MODEL_NAME,
        messages: [
          {
            role: 'system',
            content: `You are a professional translator. Translate the following text from ${sourceLang} to ${targetLang}. Preserve all formatting, special characters, and technical terms. Respond only with the translation.`,
          },
          {
            role: 'user',
            content: chunk,
          },
        ],
        temperature: 0.1,
        max_tokens: 4096,
      });

      translatedText += completion.choices[0].message.content + '\n';
    }

    // Clean up temp file
    await unlink(tempPath);

    return NextResponse.json({
      translatedText,
      fileName: file.name,
      sourceLang,
      targetLang,
    });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Failed to process translation' },
      { status: 500 },
    );
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

async function writeFile(path: string, data: Buffer): Promise<void> {
  return new Promise((resolve, reject) => {
    const stream = createWriteStream(path);
    stream.write(data);
    stream.end();
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
}
