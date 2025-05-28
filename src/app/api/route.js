// pages/api/census/index.js
import dbConnect from '../../../lib/mongodb';
import Census from '../../../models/Census';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const censusRecords = await Census.find({}).sort({ createdAt: -1 });
        res.status(200).json(censusRecords);
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'POST':
      try {
        const census = await Census.create(req.body);
        res.status(201).json({ success: true, data: census });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}

// pages/api/census/[id].js
import dbConnect from '../../../lib/mongodb';
import Census from '../../../models/Census';

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const census = await Census.findById(id);
        if (!census) {
          return res.status(404).json({ success: false, error: 'Census record not found' });
        }
        res.status(200).json({ success: true, data: census });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'PUT':
      try {
        const census = await Census.findByIdAndUpdate(
          id,
          { ...req.body, updatedAt: new Date() },
          {
            new: true,
            runValidators: true,
          }
        );
        if (!census) {
          return res.status(404).json({ success: false, error: 'Census record not found' });
        }
        res.status(200).json({ success: true, data: census });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'DELETE':
      try {
        const deletedCensus = await Census.deleteOne({ _id: id });
        if (!deletedCensus.deletedCount) {
          return res.status(404).json({ success: false, error: 'Census record not found' });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}

// lib/mongodb.js (Database connection utility)
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}