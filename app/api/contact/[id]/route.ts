import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Contact from '@/models/Contact';

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
        { success: false, error: 'Invalid contact ID format' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const contact = await Contact.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!contact) {
      return NextResponse.json(
        { success: false, error: 'Contact not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: contact });
  } catch (error: any) {
    console.error('PUT contact error:', error);
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
        { success: false, error: 'Invalid contact ID format' },
        { status: 400 }
      );
    }
    
    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) {
      return NextResponse.json(
        { success: false, error: 'Contact not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    console.error('DELETE contact error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

