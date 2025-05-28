import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Census from '@/models/Census';

export async function POST(request) {
  try {
    await dbConnect();
    
    const data = await request.json();
    
    // Create new census record
    const census = new Census(data);
    const savedCensus = await census.save();
    
    return NextResponse.json(
      { success: true, data: savedCensus },
      { status: 201 }
    );
  } catch (error) {
    console.error('Census save error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    
    const censusRecords = await Census.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json(
      { success: true, data: censusRecords },
      { status: 200 }
    );
  } catch (error) {
    console.error('Census fetch error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}