// app/api/census/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Census from '@/models/Census';

export async function GET() {
  await dbConnect();
  const censusRecords = await Census.find({}).sort({ createdAt: -1 });
  return NextResponse.json(censusRecords, { status: 200 });
}

export async function POST(request) {
  await dbConnect();
  const body = await request.json();
  const census = await Census.create(body);
  return NextResponse.json({ success: true, data: census }, { status: 201 });
}
