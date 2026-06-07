import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`==================================================`);
    console.log(`🔌 MongoDB Database Connected successfully!`);
    console.log(`📦 Host Node: ${conn.connection.host}`);
    console.log(`🗃️ Database Name: ${conn.connection.name}`);
    console.log(`==================================================`);
  } catch (error) {
    console.error(`❌ MongoDB Database Connection Failure!`);
    console.error(`Error details: ${error.message}`);
    process.exit(1); // Force terminate application on database failure
  }
};

export default connectDB;
