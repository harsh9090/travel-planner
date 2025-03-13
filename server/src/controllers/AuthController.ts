import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { ILoginRequest, IRegisterRequest } from '../interfaces/IAuth';
import { config } from '../config';

interface IUpdateProfileRequest {
  name: string;
  location: string;
  bio: string;
  favoriteDestinations: string[];
  travelPreferences: {
    preferredTransport: string;
    accommodationType: string;
    budget: string;
  };
}

interface IChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export class AuthController {
  public register = async (req: Request<{}, {}, IRegisterRequest>, res: Response) => {
    try {
      const { email, password, name } = req.body;
      console.log('Registration debug:', {
        email,
        passwordLength: password.length,
        password,
        passwordCharCodes: Array.from(password).map(char => char.charCodeAt(0))
      });

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log('Registration failed: User already exists:', email);
        return res.status(400).json({ error: 'User already exists' });
      }

      // Create new user
      console.log('Creating new user:', { 
        email, 
        name,
        passwordToBeHashed: password  // Log the exact password being passed to hash
      });
      const user = new User({
        email,
        password,
        name
      });

      await user.save();
      console.log('User saved with hash:', {
        email: user.email,
        finalHash: user.password
      });

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        config.JWT_SECRET,
        { expiresIn: '24h' }
      );

      const response = {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      };
      console.log('Registration successful:', { userId: user.id, email: user.email });
      res.status(201).json(response);
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
      }
      res.status(500).json({ error: 'Error registering user' });
    }
  };

  public login = async (req: Request<{}, {}, ILoginRequest>, res: Response) => {
    try {
      const { email, password } = req.body;
      const normalizedEmail = email.toLowerCase();
      
      console.log('Login debug:', {
        originalEmail: email,
        normalizedEmail,
        receivedPasswordLength: password.length,
        receivedPassword: password,
        passwordCharCodes: Array.from(password).map(char => char.charCodeAt(0))
      });

      // Find user
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        console.log('Login failed: User not found for email:', normalizedEmail);
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      console.log('User found:', {
        id: user.id,
        email: user.email,
        storedPasswordHash: user.password,
        passwordMatch: password === 'Harsh@909090' // Direct comparison for debugging
      });

      // Verify password using the model's method
      const isMatch = await user.comparePassword(password);
      console.log('Password verification result:', isMatch);
      
      if (!isMatch) {
        console.log('Login failed: Invalid password for email:', normalizedEmail);
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        config.JWT_SECRET,
        { expiresIn: '24h' }
      );
      console.log('JWT token generated for user:', { id: user.id, email: user.email });

      // Send successful response
      const response = {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      };
      console.log('Sending successful login response:', response);
      res.json(response);
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
      }
      res.status(500).json({ error: 'Error logging in' });
    }
  };

  public getProfile = async (req: Request, res: Response) => {
    try {
      const user = await User.findById(req.user?.userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ message: 'Error fetching profile' });
    }
  };

  public updateProfile = async (req: Request<{}, {}, IUpdateProfileRequest>, res: Response) => {
    try {
      const { name, location, bio, favoriteDestinations, travelPreferences } = req.body;
      const userId = req.user?.userId;

      console.log('Profile update request:', {
        userId,
        updateData: { name, location, bio, favoriteDestinations, travelPreferences }
      });

      // Update user with all fields except email
      const user = await User.findByIdAndUpdate(
        userId,
        {
          name,
          location,
          bio,
          favoriteDestinations,
          travelPreferences
        },
        { new: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      console.log('Profile updated successfully:', {
        userId: user.id,
        updatedFields: {
          name: user.name,
          location: user.location,
          bio: user.bio,
          favoriteDestinations: user.favoriteDestinations,
          travelPreferences: user.travelPreferences
        }
      });

      // Generate new token with updated information
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        config.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({ 
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          location: user.location,
          bio: user.bio,
          favoriteDestinations: user.favoriteDestinations,
          travelPreferences: user.travelPreferences
        }, 
        token 
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: 'Error updating profile' });
    }
  };

  public changePassword = async (req: Request<{}, {}, IChangePasswordRequest>, res: Response) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user?.userId;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Verify current password
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      // Update password
      user.password = newPassword;
      await user.save(); // This will trigger the pre-save hook to hash the password

      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ error: 'Error changing password' });
    }
  };
} 