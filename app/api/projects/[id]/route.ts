import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    
    // Validate MongoDB ObjectId format
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid project ID format' },
        { status: 400 }
      );
    }
    
    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: project });
  } catch (error: any) {
    console.error('GET project error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    
    // Validate MongoDB ObjectId format
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid project ID format' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    // Get old project to check if image changed
    const oldProject = await Project.findById(id);
    if (!oldProject) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }
    
    // Warn if imageUrl is not from Cloudinary (but don't block - allow for flexibility)
    if (body.imageUrl && !body.imageUrl.includes('res.cloudinary.com') && !body.imageUrl.includes('via.placeholder.com')) {
      console.warn('Image URL is not from Cloudinary:', body.imageUrl);
      // Don't block, just log a warning - images should be uploaded via /api/upload
    }
    
    const project = await Project.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: project });
  } catch (error: any) {
    console.error('PUT project error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    
    // Validate MongoDB ObjectId format
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid project ID format' },
        { status: 400 }
      );
    }
    
    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    console.error('DELETE project error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

