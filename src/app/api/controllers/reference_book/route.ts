import { NextResponse } from 'next/server';
import pool from '@/app/api/controllers/connect_to_bd/conectToBd';
import { saveDocument } from '@/app/api/models/documents';

//занесения документов не смотреть 
/*
export async function POST(request: Request) {
  const client = await pool.connect();
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const ordel_id = Number(formData.get('ordel_id'));

    if (!file || !ordel_id) {
      return NextResponse.json(
        { error: 'File and ordel_id are required' },
        { status: 400 }
      );
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const document = await saveDocument(
      client,
      file.name,
      fileBuffer,
      ordel_id
    );

    return NextResponse.json({
      id: document.id,
      name: document.name,
      ordel_id: document.ordel_id
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}*/