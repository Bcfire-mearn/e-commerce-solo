import mongoose from 'mongoose';
import { config } from 'dotenv';
config();

mongoose.set('strictQuery', false);

mongoose.connect(process.env.MONGO_URI)

const db = mongoose.connection;

export default db;
