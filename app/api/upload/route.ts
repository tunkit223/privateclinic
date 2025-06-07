// app/api/upload/route.ts

import { NextRequest } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { Readable } from 'stream';

// Biến Buffer → Stream (để Cloudinary đọc được)
function bufferToStream(buffer: Buffer): Readable {
  const readable = new Readable();
  readable._read = () => {}; // no-op
  readable.push(buffer);
  readable.push(null);
  return readable;
}

// Cấu hình API route: không cần bodyParser nữa vì Next 13 đã xử lý multipart/form-data
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return new Response(JSON.stringify({ error: 'No file uploaded' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const stream = bufferToStream(buffer);

    const result = await new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder: 'nextjs_uploads' },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve(result);
        }
      );
      stream.pipe(upload);
    });

    return new Response(JSON.stringify({ url: (result as any).secure_url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    return new Response(JSON.stringify({ error: 'Cloudinary upload failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
