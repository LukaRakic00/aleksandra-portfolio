import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAbout extends Document {
  name: string;
  title: string;
  bio: string;
  longBio: string;
  email: string;
  phone?: string;
  location?: string;
  profileImage: string;
  resumeUrl?: string;
  socialLinks: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    instagram?: string;
  };
  skills: string[];
  experience: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    duration: string;
  }>;
  updatedAt: Date;
}

const AboutSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    bio: {
      type: String,
      required: true,
    },
    longBio: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    profileImage: {
      type: String,
      required: true,
    },
    resumeUrl: {
      type: String,
    },
    socialLinks: {
      linkedin: String,
      github: String,
      twitter: String,
      instagram: String,
    },
    skills: {
      type: [String],
      default: [],
    },
    experience: [
      {
        company: String,
        position: String,
        duration: String,
        description: String,
      },
    ],
    education: [
      {
        institution: String,
        degree: String,
        duration: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const About: Model<IAbout> =
  mongoose.models.About || mongoose.model<IAbout>('About', AboutSchema);

export default About;

