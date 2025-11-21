import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import About from '@/models/About';

export async function GET() {
  try {
    await dbConnect();
    let about = await About.findOne();
    if (!about) {
      // Create default about if none exists
      about = await About.create({
        name: 'Aleksandra Petronijević',
        title: 'Marketing Student | Future HR Specialist',
        bio: 'Student at the Faculty of Organizational Sciences, Marketing major. Passionate about human resources and talent management.',
        longBio: 'I am Aleksandra Petronijević, a student at the Faculty of Organizational Sciences majoring in Marketing. During my studies, I have developed a deep passion for human resources and talent management.',
        email: 'aleksandra.petronijevic@example.com',
        profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
        resumeUrl: '/cv/aleksandra-petronijevic-cv.pdf',
        skills: ['Marketing Strategy', 'Talent Acquisition', 'Employer Branding'],
        experience: [],
        education: [],
        socialLinks: {},
      });
    }
    return NextResponse.json({ success: true, data: about });
  } catch (error: any) {
    console.error('Error in GET /api/about:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch about data',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Validate Cloudinary URL if profileImage is provided (allow placeholder for testing)
    if (body.profileImage && !body.profileImage.includes('res.cloudinary.com') && !body.profileImage.includes('via.placeholder.com') && !body.profileImage.includes('images.unsplash.com')) {
      console.warn('Profile image URL is not from Cloudinary:', body.profileImage);
      // Don't block, just log a warning
    }
    
    // Validate Cloudinary URL if heroImage is provided (allow placeholder for testing)
    if (body.heroImage && !body.heroImage.includes('res.cloudinary.com') && !body.heroImage.includes('via.placeholder.com') && !body.heroImage.includes('images.unsplash.com')) {
      console.warn('Hero image URL is not from Cloudinary:', body.heroImage);
      // Don't block, just log a warning
    }
    
    let about = await About.findOne();
    if (about) {
      about = await About.findByIdAndUpdate(about._id, body, {
        new: true,
        runValidators: true,
      });
    } else {
      about = await About.create(body);
    }
    return NextResponse.json({ success: true, data: about });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

