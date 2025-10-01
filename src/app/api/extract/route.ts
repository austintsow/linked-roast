import { NextRequest, NextResponse } from 'next/server';
import pdf from 'pdf-parse';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    // Handle JSON input (pasted text)
    if (contentType.includes('application/json')) {
      const body = await req.json();
      const { rawText } = body;

      if (!rawText || typeof rawText !== 'string') {
        return NextResponse.json(
          { error: 'rawText field is required' },
          { status: 400 }
        );
      }

      return NextResponse.json({ rawText: rawText.trim() });
    }

    // Handle multipart/form-data (PDF upload)
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        return NextResponse.json(
          { error: 'No file uploaded' },
          { status: 400 }
        );
      }

      // Validate file type
      if (file.type !== 'application/pdf') {
        return NextResponse.json(
          { error: 'Only PDF files are supported' },
          { status: 400 }
        );
      }

      // Validate file size (5MB limit)
      const MAX_SIZE = 5 * 1024 * 1024; // 5MB
      if (file.size > MAX_SIZE) {
        return NextResponse.json(
          { error: 'File size exceeds 5MB limit' },
          { status: 400 }
        );
      }

      // Convert file to buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Parse PDF
      const data = await pdf(buffer);
      const rawText = data.text.trim();

      if (!rawText) {
        return NextResponse.json(
          { error: 'Could not extract text from PDF' },
          { status: 400 }
        );
      }

      return NextResponse.json({ rawText });
    }

    return NextResponse.json(
      { error: 'Invalid content type. Use application/json or multipart/form-data' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in extract API:', error);
    return NextResponse.json(
      { error: 'Failed to process file' },
      { status: 500 }
    );
  }
}
