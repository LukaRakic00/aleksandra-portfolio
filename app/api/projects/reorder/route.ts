import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const { projectIds } = body;

    if (!Array.isArray(projectIds)) {
      return NextResponse.json(
        { success: false, error: 'projectIds must be an array' },
        { status: 400 }
      );
    }

    // Update order for each project
    const updatePromises = projectIds.map((id: string, index: number) =>
      Project.findByIdAndUpdate(id, { order: index }, { new: true })
    );

    await Promise.all(updatePromises);

    return NextResponse.json({ success: true, message: 'Order updated successfully' });
  } catch (error: any) {
    console.error('Reorder projects error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

