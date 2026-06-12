import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI environment variable is missing or empty. Please check your Render/Koyeb dashboard settings to ensure it is defined.');
    }

    // Clean potential surrounding quotes or extra whitespace
    uri = uri.trim();
    if ((uri.startsWith('"') && uri.endsWith('"')) || (uri.startsWith("'") && uri.endsWith("'"))) {
      uri = uri.slice(1, -1).trim();
    }

    if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
      throw new Error(`Invalid MONGODB_URI format: "${uri}". Expected connection string to start with "mongodb://" or "mongodb+srv://". Please ensure there are no leading/trailing quotes or special characters.`);
    }

    const conn = await mongoose.connect(uri);

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
