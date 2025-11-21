import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';

export async function GET() {
  try {
    await dbConnect();
    const projects = await Project.find({}).sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ success: true, data: projects });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Warn if imageUrl is not from Cloudinary (but don't block - allow for flexibility)
    if (body.imageUrl && !body.imageUrl.includes('res.cloudinary.com') && !body.imageUrl.includes('via.placeholder.com')) {
      console.warn('Image URL is not from Cloudinary:', body.imageUrl);
      // Don't block, just log a warning - images should be uploaded via /api/upload
    }
    
    const project = await Project.create(body);
    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

