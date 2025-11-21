# HR Portfolio Website

A modern, responsive portfolio website built with Next.js 14 for HR professionals. Features a brutal design aesthetic, MongoDB integration, Cloudinary image management, and a comprehensive admin panel for content management.

## 🚀 Features

- **Modern Design**: Brutal, modern UI with smooth animations using Framer Motion
- **Fully Responsive**: Optimized for all devices (mobile, tablet, desktop)
- **Admin Panel**: Complete content management system for:
  - Projects management (CRUD operations)
  - About section editing
  - Contact messages management
- **Image Management**: Cloudinary integration for image uploads and storage
- **Database**: MongoDB with Mongoose for data persistence
- **Authentication**: Secure JWT-based authentication for admin panel
- **Contact Form**: Functional contact form with message storage

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Database**: MongoDB with Mongoose
- **Image Storage**: Cloudinary
- **Authentication**: JWT (jsonwebtoken, jose)
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18+ or Bun
- MongoDB database (local or Atlas)
- Cloudinary account

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd aleksandraSajt
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

4. **Seed the database**
   ```bash
   npm run seed
   # or
   bun run seed
   ```
   
   This will create:
   - Initial projects data
   - About section content
   - Admin user (username: `Admin User`, password: `admin123`)

5. **Run the development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
aleksandraSajt/
├── app/
│   ├── admin/              # Admin panel pages
│   │   ├── login/         # Login page
│   │   ├── page.tsx       # Dashboard
│   │   ├── projects/      # Projects management
│   │   ├── about/         # About section editor
│   │   └── contacts/      # Contact messages
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── projects/      # Projects CRUD
│   │   ├── about/         # About section API
│   │   ├── contact/       # Contact form API
│   │   └── upload/        # Image upload to Cloudinary
│   ├── layout.tsx          # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── Navigation.tsx     # Main navigation
│   ├── Hero.tsx           # Hero section
│   ├── About.tsx          # About section
│   ├── Projects.tsx       # Projects showcase
│   ├── Contact.tsx        # Contact form
│   ├── Footer.tsx         # Footer
│   ├── AdminLayout.tsx    # Admin panel layout
│   └── ProjectModal.tsx   # Project edit modal
├── lib/
│   ├── mongodb.ts         # MongoDB connection
│   ├── cloudinary.ts      # Cloudinary config
│   └── auth.ts            # JWT utilities
├── models/
│   ├── Project.ts         # Project schema
│   ├── About.ts           # About schema
│   ├── Contact.ts         # Contact schema
│   └── User.ts            # User schema
├── public/                # Static assets
│   ├── favicon.ico
│   └── approved.png
├── scripts/
│   ├── seed.js            # Database seeding script
│   └── cleanup-users.js   # User cleanup utility
├── middleware.ts           # Route protection middleware
└── package.json
```

## 🔐 Admin Panel

### Accessing the Admin Panel

1. Navigate to `/admin/login`
2. Use the default credentials:
   - **Username**: `Admin User`
   - **Password**: `admin123`

### Admin Features

- **Dashboard**: Overview of projects and contact messages
- **Projects**: Create, edit, delete, and manage projects
- **About**: Edit personal information, bio, skills, experience, and education
- **Contacts**: View and manage contact form submissions

## 📝 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/[id]` - Get single project
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

### About
- `GET /api/about` - Get about section data
- `PUT /api/about` - Update about section

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contact messages
- `PUT /api/contact/[id]` - Update contact message
- `DELETE /api/contact/[id]` - Delete contact message

### Upload
- `POST /api/upload` - Upload image to Cloudinary

## 🎨 Customization

### Changing Colors

Edit `tailwind.config.js` to customize the color scheme:

```js
theme: {
  extend: {
    colors: {
      // Your custom colors
    }
  }
}
```

### Adding New Sections

1. Create a new component in `components/`
2. Add it to `app/page.tsx`
3. Create corresponding API routes if needed
4. Add admin panel page if content needs to be editable

## 🚢 Deployment

### Build for Production

```bash
npm run build
# or
bun run build
```

### Start Production Server

```bash
npm start
# or
bun start
```

### Environment Variables for Production

Make sure to set all environment variables in your hosting platform:
- Vercel: Add in Project Settings → Environment Variables
- Other platforms: Follow their specific instructions

## 📦 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed database with initial data
- `npm run cleanup-users` - Remove duplicate users (keeps first one)

## 🔒 Security Notes

- Change the default admin password after first login
- Use a strong `JWT_SECRET` in production
- Keep your MongoDB connection string secure
- Use environment variables for all sensitive data
- Enable HTTPS in production

## 🐛 Troubleshooting

### Database Connection Issues

- Verify `MONGODB_URI` is correct in `.env`
- Check if MongoDB is running (if local)
- Verify network access (if using Atlas)

### Image Upload Issues

- Verify Cloudinary credentials in `.env`
- Check Cloudinary dashboard for upload limits
- Ensure image file size is within limits

### Authentication Issues

- Clear browser cookies
- Verify `JWT_SECRET` is set correctly
- Check middleware configuration

## 📄 License

This project is private and proprietary.

## 👤 Author

Built for Aleksandra Petronijević - Marketing Student | Future HR Specialist

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Framer Motion for smooth animations
- All open-source contributors

---

For questions or support, please contact the project maintainer.
