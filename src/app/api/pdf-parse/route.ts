// app/api/parse-pdf/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import pdf from 'pdf-parse';

/**
 * POST endpoint to accept a PDF file, parse it, and return its text content.
 *
 * Expected request:
 * - Content-Type: multipart/form-data
 * - Field name for the file: "file"
 */
export async function POST(request: NextRequest) {
  try {
    // Extract the form data from the request
    const formData = await request.formData();

    // Retrieve the file from the form data. The field name should be "file".
    const fileField = formData.get('file');

    // Ensure a file is provided and it's not a string.
    if (!fileField || typeof fileField === 'string') {
      return NextResponse.json(
        { error: 'No file uploaded or wrong file format.' },
        { status: 400 },
      );
    }

    // The file received is a Blob (or File) object.
    // Convert it into an ArrayBuffer, then to a Node.js Buffer.
    const arrayBuffer = await fileField.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // Use pdf-parse to extract text from the PDF buffer.
    const data = await pdf(fileBuffer);

    // Return the extracted text in JSON format.
    return NextResponse.json({ text: data.text });
  } catch (error: any) {
    // Log and return any errors that occur during processing.
    console.error('Error processing PDF:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 },
    );
  }
}
