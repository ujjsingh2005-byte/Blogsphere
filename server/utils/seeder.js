import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import Category from '../models/Category.js';
import Report from '../models/Report.js';

dotenv.config();

const usersData = [
  {
    name: 'Ujjwal Singh',
    email: 'ujjsingh203@gmail.com',
    password: 'password123',
    role: 'admin',
    isBlocked: false,
    profileImage: '/avatars/ujjwal.jpg',
    bio: 'Full-Stack Developer & CSE Undergrad at AKTU Lucknow (Sep 2023 – May 2027). Creator of CourseHub, Smart Parking, and Bharat Sign AI.'
  },
  {
    name: 'Chief Administrator',
    email: 'admin@blogsphere.com',
    password: 'password123',
    role: 'admin',
    isBlocked: false,
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bio: 'Platform Overseer and Lead Administrator. Managing content safety, site categories, and user integrity.'
  },
  {
    name: 'Alex Rivera',
    email: 'alex@blogsphere.com',
    password: 'password123',
    role: 'user',
    isBlocked: false,
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    bio: 'Lead Architect & Tech Evangelist. Writing about scalable systems, distributed nodes, and modern web frameworks.'
  },
  {
    name: 'Elena Rostova',
    email: 'elena@blogsphere.com',
    password: 'password123',
    role: 'user',
    isBlocked: false,
    profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    bio: 'AI researcher and Machine Learning engineer. Passionate about LLMs, neural networks, and ethical artificial intelligence.'
  },
  {
    name: 'Marcus Chen',
    email: 'marcus@blogsphere.com',
    password: 'password123',
    role: 'user',
    isBlocked: false,
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    bio: 'Senior Frontend Developer & UI/UX enthusiast. Building joyful web applications with React, Tailwind, and WebGL.'
  }
];

const categoriesData = [
  {
    name: 'Technology',
    slug: 'technology',
    description: 'Hardware, infrastructure, cloud architecture, and tech trends.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    name: 'Web Development',
    slug: 'web-development',
    description: 'Frontend, backend, fullstack development, frameworks, and APIs.',
    color: 'from-violet-500 to-purple-600'
  },
  {
    name: 'AI',
    slug: 'ai',
    description: 'Artificial intelligence, machine learning, deep learning, and LLMs.',
    color: 'from-emerald-500 to-teal-600'
  },
  {
    name: 'Programming',
    slug: 'programming',
    description: 'Clean code principles, algorithms, data structures, and best practices.',
    color: 'from-amber-500 to-orange-600'
  },
  {
    name: 'Lifestyle',
    slug: 'lifestyle',
    description: 'Remote work, productivity, mental health, and work-life balance.',
    color: 'from-rose-500 to-pink-600'
  },
  {
    name: 'Career',
    slug: 'career',
    description: 'Engineering levels, mentorship, salary negotiations, and leadership.',
    color: 'from-indigo-500 to-blue-600'
  }
];

const postsData = [
  {
    title: 'Building CourseHub: Scaling MERN Applications to 1,000+ Concurrent Users',
    category: 'Web Development',
    coverImage: 'https://images.unsplash.com/photo-1516116211227-bbc1418beab7?auto=format&fit=crop&w=1200&q=80',
    readTime: 6,
    content: `Engineered **CourseHub**, a scalable online course management system using Node.js, Express.js, MongoDB, and React.js, supporting 1,000+ concurrent users with improved application performance and reliability.

### Key Architectural Highlights:
1. **API Optimization**: Reduced response times by 30% through optimized MongoDB aggregations and Cloudinary asset streaming pipelines.
2. **JWT & RBAC Security**: Implemented multi-tier role-based access control for students, instructors, and platform administrators.
3. **Automated Workflows**: Streamlined course enrollment and content delivery, slashing manual administrative overhead by 40%.
4. **Secure Payments**: Integrated multi-currency payment gateways with webhook idempotency to guarantee seamless course checkouts.`
  },
  {
    title: 'Bharat Sign AI: Multilingual Indian Sign Language Translation Engine',
    category: 'AI',
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=80',
    readTime: 7,
    content: `Breaking communication barriers through **Bharat Sign AI**—a multimodal AI communication platform bridging spoken languages and Indian Sign Language (ISL) using text, voice, and real-time computer vision gesture translation.

### Tech Stack & Architecture:
- **Frontend**: React, Next.js, Tailwind CSS, TypeScript
- **Backend & ML Services**: Python, FastAPI, Node.js, MediaPipe, OpenCV
- **Database & Realtime**: PostgreSQL, Supabase

### Key Innovations:
- Real-time hand landmark extraction using MediaPipe and custom gesture-classification models.
- English-to-ISL translation grammar mapper supporting regional Indian language expansion and bidirectional translation.`
  },
  {
    title: 'Architecting Resilient Distributed Systems in 2026',
    category: 'Technology',
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    readTime: 6,
    content: `Building scalable distributed systems requires a mindset shift from monolithic single-point-of-failure designs to decentralized, fault-tolerant architectures.

### The Evolution of Fault Tolerance
In modern cloud-native architectures, event-driven pipelines utilizing Kafka, RabbitMQ, and gRPC form the backbone of reliable services.

#### Key Principles:
1. **Circuit Breakers & Exponential Retries**: Prevent cascading failures across downstream microservices.
2. **Idempotent Consumers**: Ensure duplicate requests produce identical state modifications.
3. **Observability First**: Distributed tracing (OpenTelemetry), structured JSON logging, and real-time metric alarms.`
  },
  {
    title: 'Mastering Modern React 19 and Concurrent Rendering',
    category: 'Web Development',
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80',
    readTime: 5,
    content: `React continues to redefine dynamic web performance with server actions, automated compilers, and concurrent transitions.

### Key Takeaways:
- Use **useTransition** for heavy state updates to maintain fluid 60fps responsiveness.
- Stream components seamlessly with Suspense boundaries.
- Replace external state boilerplate with composable custom hooks.`
  },
  {
    title: 'Smart Parking System: IoT & Real-Time Slot Allocation',
    category: 'Technology',
    coverImage: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1200&q=80',
    readTime: 5,
    content: `Developed an automated smart parking management system for efficient slot allocation, live occupancy tracking, and self-service reservation workflows.

### Features:
- Real-time parking slot availability and instant booking engine.
- Responsive customer booking dashboard and administrative oversight console.
- Backend API integration using Node.js, Express.js, and MongoDB.`
  },
  {
    title: 'From CS Undergrad to Full-Stack Engineer: Lessons from AKTU',
    category: 'Career',
    coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    readTime: 5,
    content: `Navigating Computer Science & Engineering (B.Tech at AKTU Lucknow) while building real-world production projects taught me that theoretical foundations in Data Structures, Algorithms, and Database Management multiply in value when paired with hands-on full-stack development.

### My Top Recommendations:
1. **Build End-to-End Projects**: Go beyond tutorials—build systems with real authentication, databases, and deployments.
2. **Master Fundamentals**: Algorithms, OOP, and system design remain timeless across every framework shift.
3. **Contribute & Share**: Open source your code and write about your architectural decisions.`
  }
];

const sampleComments = [
  'Outstanding project breakdown! The CourseHub concurrency optimizations are impressive.',
  'Bharat Sign AI is a remarkable innovation for accessibility. Great work on the MediaPipe integration!',
  'The smart parking architecture is well structured. Clean code and great documentation!',
  'Inspiring journey from AKTU to full-stack systems engineering!',
  'Great insights on React 19 and scalable MongoDB indexing.'
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://ujjsingh2005_db_user:zS7ZBWEc4G2QAN0u@cluster0.oejf1vk.mongodb.net/blogsphere?retryWrites=true&w=majority&appName=Cluster0';
    await mongoose.connect(mongoUri, {
      dbName: 'blogsphere'
    });
    console.log(`[Seeder] Connected to MongoDB Atlas at ${mongoUri}`);

    // Clear existing collections
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    await Category.deleteMany({});
    await Report.deleteMany({});
    console.log('[Seeder] Cleared existing data');

    // Create Categories
    const createdCategories = await Category.insertMany(categoriesData);
    console.log(`[Seeder] Created ${createdCategories.length} categories`);

    // Create users
    const createdUsers = [];
    for (const userData of usersData) {
      const user = await User.create(userData);
      createdUsers.push(user);
    }
    console.log(`[Seeder] Created ${createdUsers.length} users (including Ujjwal Singh as Super Admin)`);

    // Create posts
    const createdPosts = [];
    const authorUsers = createdUsers;
    for (let i = 0; i < postsData.length; i++) {
      const author = authorUsers[i % authorUsers.length];
      const post = await Post.create({
        ...postsData[i],
        author: author._id,
        authorName: author.name
      });
      createdPosts.push(post);
    }
    console.log(`[Seeder] Created ${createdPosts.length} posts`);

    // Create comments
    let commentCount = 0;
    for (let i = 0; i < createdPosts.length; i++) {
      const post = createdPosts[i];
      for (let j = 0; j < 2; j++) {
        const commenter = createdUsers[(i + j + 1) % createdUsers.length];
        await Comment.create({
          content: sampleComments[(i + j) % sampleComments.length],
          postId: post._id,
          author: commenter._id
        });
        commentCount++;
      }
    }
    console.log(`[Seeder] Created ${commentCount} comments`);

    // Create sample reports
    const ujjwalUser = createdUsers.find(u => u.email === 'ujjsingh203@gmail.com');
    const normalUser = createdUsers.find(u => u.email === 'alex@blogsphere.com');

    await Report.create({
      reporter: normalUser._id,
      targetType: 'post',
      targetId: createdPosts[2]._id.toString(),
      targetTitle: createdPosts[2].title,
      reason: 'Spam',
      details: 'Please verify external reference links in this distributed systems post.',
      status: 'pending'
    });

    console.log('\n========================================');
    console.log(' SEEDING COMPLETED ON MONGODB ATLAS!');
    console.log(' Primary Super Admin Account:');
    console.log(' 👑 Name:     Ujjwal Singh');
    console.log(' 📧 Email:    ujjsingh203@gmail.com');
    console.log(' 🔒 Password: password123');
    console.log(' 🎓 College:  AKTU Lucknow (CSE, 2023-2027)');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error] ${error.message}`);
    process.exit(1);
  }
};

seedDB();
