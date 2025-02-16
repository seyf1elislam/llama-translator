'use server';

import type PdfParse from 'pdf-parse';
//! this solves the 404 error when importing  pdf from pdf-parse directly
//@ts-expect-error df-parse does not have declaration
import pdf from 'pdf-parse/lib/pdf-parse';

// export async function parsePdf(file: File): Promise<string> {
export async function parsePdfFileSSA(
  file: File | Buffer,
): Promise<PdfParse.Result> {
  if (!file) {
    // throw new Error('No file provided.');
    console.error('No file provided.');
    return {
      text: '',
      numpages: 0,
      numrender: 0,
      info: {},
      metadata: {},
      version: Object.create(null),
    };
  }

  // Convert the File to an ArrayBuffer and then to a Buffer.

  let fileBuffer: Buffer;
  if (file instanceof File) {
    const arrayBuffer = await file.arrayBuffer();
    fileBuffer = Buffer.from(arrayBuffer);
  } else {
    fileBuffer = file;
  }

  // Parse the PDF and extract its text content.
  const data = await pdf(fileBuffer);
  return data;
}
