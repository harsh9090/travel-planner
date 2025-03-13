import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcryptjs';

interface IUser {
  email: string;
  password: string;
  name: string;
  location: string;
  favoriteDestinations: string[];
  travelPreferences: {
    preferredTransport: string;
    accommodationType: string;
    budget: string;
  };
  bio: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IUserDocument extends IUser, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  location: {
    type: String,
    trim: true,
    default: ''
  },
  favoriteDestinations: {
    type: [String],
    default: []
  },
  travelPreferences: {
    preferredTransport: {
      type: String,
      enum: ['plane', 'train', 'car', 'bus', 'any'],
      default: 'any'
    },
    accommodationType: {
      type: String,
      enum: ['hotel', 'hostel', 'apartment', 'resort', 'any'],
      default: 'any'
    },
    budget: {
      type: String,
      enum: ['budget', 'moderate', 'luxury'],
      default: 'moderate'
    }
  },
  bio: {
    type: String,
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(this: IUserDocument, next: mongoose.CallbackWithoutResultAndOptionalError) {
  try {
    if (!this.isModified('password')) {
      console.log('Password not modified, skipping hash');
      return next();
    }

    console.log('Password hashing debug:', {
      email: this.email,
      originalPasswordLength: this.password.length
    });
    
    const salt = await bcrypt.genSalt(10);
    console.log('Generated salt:', salt);
    
    this.password = await bcrypt.hash(this.password, salt);
    console.log('Password hashing result:', {
      email: this.email,
      hashedPasswordLength: this.password.length,
      hash: this.password
    });
    next();
  } catch (error) {
    console.error('Error hashing password:', error);
    next(error as Error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(
  this: IUserDocument,
  candidatePassword: string
): Promise<boolean> {
  console.log('Password comparison debug:', {
    email: this.email,
    storedHash: this.password,
    providedPassword: candidatePassword
  });
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log('Password comparison details:', {
      isMatch,
      passwordLength: candidatePassword.length,
      hashLength: this.password.length
    });
    return isMatch;
  } catch (error) {
    console.error('Error comparing passwords:', error);
    throw error;
  }
};

export const User = mongoose.model<IUserDocument>('User', userSchema); 