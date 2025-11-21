const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define MONGODB_URI in .env file');
  process.exit(1);
}

const ProjectSchema = new mongoose.Schema({
  title: String,
  description: String,
  longDescription: String,
  imageUrl: String,
  category: String,
  tags: [String],
  featured: Boolean,
  order: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const AboutSchema = new mongoose.Schema({
  name: String,
  title: String,
  bio: String,
  longBio: String,
  email: String,
  phone: String,
  location: String,
  profileImage: String,
  resumeUrl: String,
  socialLinks: {
    linkedin: String,
    github: String,
    twitter: String,
    instagram: String,
  },
  skills: [String],
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
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  name: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
const About = mongoose.models.About || mongoose.model('About', AboutSchema);
const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Project.deleteMany({});
    await About.deleteMany({});

    // Seed Projects
    const projects = [
      {
        title: 'Lorem Ipsum Project One',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        longDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
        category: 'Recruitment',
        tags: ['HR', 'Talent', 'Recruitment'],
        featured: true,
        order: 1,
      },
      {
        title: 'Lorem Ipsum Project Two',
        description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        longDescription: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
        category: 'Training',
        tags: ['Training', 'Development', 'HR'],
        featured: true,
        order: 2,
      },
      {
        title: 'Lorem Ipsum Project Three',
        description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
        longDescription: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
        imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800',
        category: 'Strategy',
        tags: ['Strategy', 'Planning', 'HR'],
        featured: false,
        order: 3,
      },
      {
        title: 'Lorem Ipsum Project Four',
        description: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur.',
        longDescription: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
        imageUrl: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800',
        category: 'Recruitment',
        tags: ['Recruitment', 'Talent'],
        featured: false,
        order: 4,
      },
      {
        title: 'Lorem Ipsum Project Five',
        description: 'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
        longDescription: 'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.',
        imageUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800',
        category: 'Training',
        tags: ['Training', 'Development'],
        featured: false,
        order: 5,
      },
      {
        title: 'Lorem Ipsum Project Six',
        description: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.',
        longDescription: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.',
        imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800',
        category: 'Strategy',
        tags: ['Strategy', 'Planning'],
        featured: false,
        order: 6,
      },
    ];

    await Project.insertMany(projects);
    console.log('✓ Projects seeded');

    // Seed About
    const about = {
      name: 'Aleksandra Petronijević',
      title: 'Marketing Student | Budući HR Specijalista',
      bio: 'Studentkinja Fakulteta organizacionih nauka, smer Marketing. Strastvena o ljudskim resursima i talent managementu, sa fokusom na povezivanje marketing strategija sa HR praksama.',
      longBio: 'Ja sam Aleksandra Petronijević, studentkinja Fakulteta organizacionih nauka na smeru Marketing. Tokom studija sam razvila duboku strast prema ljudskim resursima i upravljanju talentima, shvativši koliko je važno povezati marketing strategije sa HR praksama kako bi se privukli i zadržali najbolji talenti.\n\nMoja edukacija na FON-u mi je pružila solidnu osnovu u oblasti marketinga, ali moj pravi interes leži u ljudskim resursima. Verujem da je ključ uspeha svake organizacije u njenim ljudima, i zato se fokusiram na razumevanje kako se najbolji talenti privlače, razvijaju i zadržavaju.\n\nTokom studija sam učestvovala u različitim projektima koji su mi omogućili da razvijem veštine u komunikaciji, timskom radu i strateškom razmišljanju. Moja kombinacija marketing znanja i HR interesovanja čini me idealnom kandidatkinjom za pozicije koje zahtevaju razumevanje kako se brendovi grade i kako se privlače pravi ljudi.\n\nU slobodno vreme volim da čitam o najnovijim trendovima u HR-u, učestvujem u radionicama i konferencijama, i razvijam svoje veštine kroz praktične projekte.',
      email: 'aleksandra.petronijevic@example.com',
      phone: '+381 60 123 4567',
      location: 'Belgrade, Serbia',
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      resumeUrl: '/cv/aleksandra-petronijevic-cv.pdf',
      socialLinks: {
        linkedin: 'https://linkedin.com/in/aleksandra-petronijevic',
        github: '',
        twitter: '',
        instagram: '',
      },
      skills: [
        'Marketing Strategy',
        'Talent Acquisition',
        'Employer Branding',
        'Communication',
        'Teamwork',
        'Strategic Thinking',
        'Analytical Thinking',
        'Project Management',
      ],
      experience: [
        {
          company: 'Faculty of Organizational Sciences',
          position: 'Marketing Student',
          duration: '2021 - Present',
          description: 'Studying Marketing with a focus on digital marketing, branding, and communication. Active participation in projects and workshops.',
        },
        {
          company: 'Student Organizations',
          position: 'Volunteer - Marketing Projects',
          duration: '2022 - Present',
          description: 'Participation in organizing student events, working on marketing campaigns, and developing communication strategies.',
        },
      ],
      education: [
        {
          institution: 'Faculty of Organizational Sciences',
          degree: 'Bachelor of Science - Marketing',
          duration: '2021 - Present',
        },
      ],
    };

    await About.create(about);
    console.log('✓ About seeded');

    // Seed Admin User
    await User.deleteMany({});
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = {
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
    };
    await User.create(adminUser);
    console.log('✓ Admin user seeded (email: admin@example.com, password: admin123)');

    console.log('\n✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();

