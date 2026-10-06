import mongoose from 'mongoose';

const DEFAULT_URI = 'mongodb+srv://ujjsingh2005_db_user:zS7ZBWEc4G2QAN0u@cluster0.oejf1vk.mongodb.net/blogsphere?retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || DEFAULT_URI;
    const conn = await mongoose.connect(mongoUri, {
      dbName: 'blogsphere'
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database Error] ${error.message}`);
    // Don't crash immediately so server can serve health checks and log error
  }
};

export default connectDB;
