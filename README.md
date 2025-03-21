# Tink.ai App  

An AI-powered career coaching application built with Next.js 15, Inngest, Tailwind CSS, Prisma, Neon, Firebase, ShadCN, Cloudinary, and Gemini AI.  

## 🚀 Features  
- **AI Career Guidance** – Get AI-powered career advice and interview coaching using Gemini AI.  
- **Resume Builder** – Design tailored resumes with features that generate scores for Applicant Tracking Systems (ATS) optimization.  
- **PDF Export** – Convert resumes to PDFs using HTML2PDF.  
- **Database Management** – Prisma ORM with Neon as the PostgreSQL database provider.  
- **Authentication** – Secure user authentication with Firebase.  
- **Event-Driven Actions** – Background job processing with Inngest.  
- **Modern UI** – Responsive and accessible UI with Tailwind CSS and ShadCN components.
- **Profile Image Management** – Upload and change profile picture using Cloudinary.  

## 🛠️ Tech Stack  
- **Framework:** Next.js 15 (App Router)  
- **Styling:** Tailwind CSS, ShadCN  
- **Database:** Prisma, Neon  
- **Authentication:** Firebase  
- **AI Integration:** Gemini AI  
- **Background Jobs:** Inngest  
- **PDF Generation:** HTML2PDF  
- **Drag & Drop:** @hello-pangea/dnd
- **Profile Image Upload:** Cloudinary

## 📦 Installation  
1. Clone the repository:  
   ```bash
   git clone https://github.com/Mikael-duru/tink.ai.git
   cd tink.ai
   ```
2. Install dependencies:  
   ```bash
   npm install
   ```
3. Set up environment variables in a `.env` file:  
   ```env
   # Firebase
    NEXT_PUBLIC_FIREBASE_API_KEY=
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
    NEXT_PUBLIC_FIREBASE_APP_ID=
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

    # Firebase Admin
    FIREBASE_PROJECT_ID=
    FIREBASE_CLIENT_EMAIL=
    FIREBASE_PRIVATE_KEY=
    
    # Clodinary
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
    CLOUDINARY_API_SECRET=
    CLOUDINARY_API_KEY=
    
    # Neon Postgresql
    DATABASE_URL=
    
    # Gemini API
    GEMINI_API_KEY=
   ```
4. Run the development server:  
   ```bash
   npm run dev
   ```
5. Open `http://localhost:3000` in your browser.  

## 🏗️ Usage  
- Sign in with Firebase authentication.  
- Use AI-powered coaching for career insights and interview preparation.
- Generate industry-specific cover letter.  
- Build, customize, and rearrange resume sections using drag-and-drop.  
- Export resumes as PDFs.  
---  
Built with ❤️ using Next.js and AI.  
