'use server';

import pdf from 'pdf-parse';

/**
 * Server Action to parse a PDF File and return its text content.
 *
 * @param file - The PDF file to parse.
 * @returns The extracted text from the PDF.
 * @throws Will throw an error if no file is provided or if parsing fails.
 */
export async function parsePdf(file: File): Promise<string> {
  if (!file) {
    throw new Error('No file provided.');
  }

  // Convert the File to an ArrayBuffer and then to a Buffer.
  const arrayBuffer = await file.arrayBuffer();
  const fileBuffer = Buffer.from(arrayBuffer);

  // Parse the PDF and extract its text content.
  const data = await pdf(fileBuffer);
  return data.text;
}
