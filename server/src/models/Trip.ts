import mongoose, { Document } from 'mongoose';

interface ITrip {
  userId: mongoose.Types.ObjectId;
  title: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  description?: string;
  activities?: Array<{
    name: string;
    date: Date;
    cost: number;
    notes?: string;
  }>;
  expenses?: Array<{
    category: 'accommodation' | 'transport' | 'food' | 'activities' | 'shopping' | 'other';
    amount: number;
    date: Date;
    description?: string;
  }>;
  tips?: Array<{
    content: string;
    category: 'accommodation' | 'transport' | 'food' | 'activities' | 'safety' | 'general';
    createdAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

interface ITripDocument extends ITrip, Document {}

const tripSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  destination: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  budget: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  description: {
    type: String,
    trim: true
  },
  activities: [{
    name: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    cost: {
      type: Number,
      required: true,
      min: 0
    },
    notes: String
  }],
  expenses: [{
    category: {
      type: String,
      enum: ['accommodation', 'transport', 'food', 'activities', 'shopping', 'other'],
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    date: {
      type: Date,
      required: true
    },
    description: String
  }],
  tips: [{
    content: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ['accommodation', 'transport', 'food', 'activities', 'safety', 'general'],
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Add index for better query performance
tripSchema.index({ userId: 1, status: 1 });
tripSchema.index({ startDate: 1 });
tripSchema.index({ destination: 1 });

// Middleware to automatically update status based on dates
tripSchema.pre('save', function(next) {
  const trip = this as ITripDocument;
  const now = new Date();
  
  if (now < trip.startDate) {
    trip.status = 'upcoming';
  } else if (now >= trip.startDate && now <= trip.endDate) {
    trip.status = 'ongoing';
  } else if (now > trip.endDate) {
    trip.status = 'completed';
  }
  
  next();
});

export const Trip = mongoose.model<ITripDocument>('Trip', tripSchema);