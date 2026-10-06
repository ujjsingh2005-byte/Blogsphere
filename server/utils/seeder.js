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
    name: 'Chief Administrator',
    email: 'admin@blogsphere.com',
    password: 'password123',
    role: 'admin',
    isBlocked: false,
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bio: 'Platform Overseer and Lead Administrator. Managing content safety, site categories, and user integrity.'
  },
  {
    name: 'Alex Rivera',
    email: 'alex@blogsphere.com',
    password: 'password123',
    role: 'user',
    isBlocked: false,
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
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
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    bio: 'Senior Frontend Developer & UI/UX enthusiast. Building joyful web applications with React, Tailwind, and WebGL.'
  },
  {
    name: 'Sarah Jenkins',
    email: 'sarah@blogsphere.com',
    password: 'password123',
    role: 'user',
    isBlocked: false,
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    bio: 'Career coach, writer, and tech community advocate. Helping engineers navigate tech transitions and remote leadership.'
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
    title: 'Architecting Resilient Distributed Systems in 2026',
    category: 'Technology',
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    readTime: 6,
    content: `Building scalable distributed systems requires a mindset shift from monolithic single-point-of-failure designs to decentralized, fault-tolerant architectures.

### The Evolution of Fault Tolerance
In the early days of microservices, service-to-service communication was synchronous and tightly coupled. Modern cloud-native architectures prioritize event-driven architectures utilizing Apache Kafka, RabbitMQ, and gRPC.

#### Key Principles:
1. **Circuit Breakers & Retries with Exponential Backoff**: Prevent cascading failures across downstream microservices.
2. **Idempotent Consumers**: Ensure that duplicate network requests or retried messages produce identical state modifications.
3. **Observability First**: Implement distributed tracing (OpenTelemetry), structured logging, and real-time metric thresholds.

As systems grow in complexity, continuous chaos engineering and automated failover simulations are no longer optional—they are the bedrock of 99.99% uptime guarantees.`
  },
  {
    title: 'Mastering Modern React 19 and Concurrent Rendering',
    category: 'Web Development',
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80',
    readTime: 5,
    content: `React continues to redefine how developers compose dynamic, high-performance user interfaces. With server actions, automatic memoization compilers, and concurrent transitions, the developer experience has reached new heights.

### Why Concurrency Matters
Concurrency is not a feature you turn on and off; it's a foundational rethink of how React processes updates. By interrupting non-urgent renders to prioritize urgent user interactions (such as keystrokes and button clicks), applications remain fluid and responsive even under heavy computational load.

### Key Takeaways:
- Use **Transitions** for expensive state updates to prevent UI freezing.
- Optimize asset loading using modern streaming SSR pipelines.
- Simplify state management using standard React Context and custom composable hooks.

Start leveraging these paradigms today to give your users lightning-fast experiences!`
  },
  {
    title: 'The Rise of Autonomous AI Agents in Production',
    category: 'AI',
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=80',
    readTime: 7,
    content: `We are witnessing a monumental transition from passive prompt-and-response chatbots to proactive, tool-calling autonomous AI agents.

### Anatomy of an Autonomous Agent
An intelligent agent consists of four core subsystems:
1. **Planning & Decomposition**: Breaking multi-step goals into executable sub-tasks.
2. **Memory & Context Retrieval**: Leveraging vector databases and short-term conversation state.
3. **Tool Execution Engine**: Interacting with external APIs, databases, sandboxes, and file systems.
4. **Self-Correction & Reflection**: Evaluating execution outputs and dynamically adjusting actions when errors occur.

The future of engineering workflows will see human developers collaborating seamlessly alongside specialized subagents to deliver software faster and more reliably.`
  },
  {
    title: 'Clean Code Practices Every Junior Developer Should Adopt',
    category: 'Programming',
    coverImage: 'https://images.unsplash.com/photo-1516116211227-bbc1418beab7?auto=format&fit=crop&w=1200&q=80',
    readTime: 4,
    content: `Writing code that computers understand is easy; writing code that humans can effortlessly read, maintain, and extend is an art form.

### Fundamental Clean Code Rules:
- **Descriptive Naming**: Avoid cryptic abbreviations. A variable named \`totalInvoiceAmount\` is infinitely better than \`totAmt\`.
- **Single Responsibility Principle (SRP)**: Each function and module should do one thing and do it exceptionally well.
- **Fail Fast & Guard Clauses**: Eliminate nested if-else ladders by validating pre-conditions early and returning immediately.
- **Self-Documenting Code**: Write code that explains its intent so clearly that extensive comments become redundant.

Remember: Good code is its own best documentation!`
  },
  {
    title: 'Navigating Remote Work Burnout and Building Sustainable Habits',
    category: 'Lifestyle',
    coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
    readTime: 4,
    content: `Remote work offers unmatched flexibility, but without deliberate boundaries, the lines between work life and personal well-being quickly blur.

### Practical Strategies for Sustainable Productivity:
1. **Establish a Physical Transition Ritual**: A morning walk, making coffee, or closing your laptop at 6 PM marks a clear mental boundary.
2. **Defend Asynchronous Focus Time**: Block out uninterrupted 2-hour deep work sessions without Slack or email pings.
3. **Ergonomics & Movement**: Invest in a comfortable chair, monitor arm, and step away every 45 minutes to stretch.

Your career is a marathon, not a sprint. Prioritize your mental clarity and recharge guilt-free.`
  },
  {
    title: 'From Junior to Staff Engineer: The Unspoken Blueprint',
    category: 'Career',
    coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    readTime: 6,
    content: `What separates senior engineers from staff-plus leaders is rarely just raw coding speed—it is influence, technical vision, and multiplicative impact.

### Key Milestones:
- **Broadening Scope**: Shifting from individual features to cross-team architectural alignment.
- **Writing Clear RFCs**: Clarifying ambiguous requirements into structured architectural decision records (ADRs).
- **Mentorship & Sponsorship**: Elevating everyone around you through constructive code reviews and project opportunities.

Focus on solving the problems that unlock the greatest leverage for your engineering organization.`
  }
];

const sampleComments = [
  'Fantastic breakdown! The explanation of circuit breakers and idempotent consumers was crystal clear.',
  'Really enjoyed reading this! The practical takeaways will help our team refactor our upcoming microservices.',
  'Great insights on React 19. The concurrency improvements have drastically enhanced user experience.',
  'Spot on! Code readability and meaningful variable names save countless hours during debugging sessions.',
  'This resonated deeply with me. Setting clear work-from-home boundaries transformed my energy levels.'
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/blogsphere';
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
    console.log(`[Seeder] Created ${createdUsers.length} users (including 1 Administrator)`);

    // Create posts
    const createdPosts = [];
    // User authors (skip admin as post author for realism, use user accounts)
    const authorUsers = createdUsers.filter(u => u.role === 'user');
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
        const commenter = createdUsers[(i + j) % createdUsers.length];
        await Comment.create({
          content: sampleComments[(i + j) % sampleComments.length],
          postId: post._id,
          author: commenter._id
        });
        commentCount++;
      }
    }
    console.log(`[Seeder] Created ${commentCount} comments`);

    // Create Sample Moderation Reports
    const adminUser = createdUsers.find(u => u.role === 'admin');
    const normalUser = createdUsers.find(u => u.role === 'user');

    await Report.create({
      reporter: normalUser._id,
      targetType: 'post',
      targetId: createdPosts[0]._id.toString(),
      targetTitle: createdPosts[0].title,
      reason: 'Spam',
      details: 'Please verify the external reference links in this post.',
      status: 'pending'
    });

    await Report.create({
      reporter: normalUser._id,
      targetType: 'comment',
      targetId: createdPosts[1]._id.toString(),
      targetTitle: 'Great insights on React 19...',
      reason: 'Inappropriate Content',
      details: 'Flagged for moderation check.',
      status: 'resolved',
      adminNotes: 'Reviewed content, verified compliant with community standards.'
    });

    console.log('[Seeder] Created sample moderation reports');

    console.log('\n========================================');
    console.log(' SEEDING COMPLETED ON MONGODB ATLAS!');
    console.log(' Accounts for testing:');
    console.log(' 👑 ADMIN: admin@blogsphere.com | password123 | Chief Administrator');
    console.log(' 👤 USER:  alex@blogsphere.com  | password123 | Alex Rivera');
    console.log(' 👤 USER:  elena@blogsphere.com | password123 | Elena Rostova');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error] ${error.message}`);
    process.exit(1);
  }
};

seedDB();
