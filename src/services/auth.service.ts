import { auth } from '../config/firebase';
import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  User as FirebaseUser 
} from 'firebase/auth';
import { createUserProfile } from './userService';
import { UserRole } from '../types/user';

interface AuthUser {
  uid: string;
  email: string | null;
  role: UserRole;
}

export const signIn = async (email: string, password: string): Promise<FirebaseUser> => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  if (result.user.email) {
    await createUserProfile(result.user.uid, result.user.email);
  }
  return result.user;
};

export const signOut = async (): Promise<void> => {
  await firebaseSignOut(auth);
};

export const authService = {
  async getCurrentUser(): Promise<AuthUser | null> {
    return auth.currentUser as AuthUser | null;
  }
};