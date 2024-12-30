import { db, auth } from '../config/firebase';
import { collection, doc, updateDoc, arrayUnion, arrayRemove, getDocs } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { User, UserRole } from '../types/user';
import { createUserProfile } from './userService';

export const adminService = {
  async getAllUsers() {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    return snapshot.docs.map(doc => doc.data() as User);
  },

  async createUser({ email, password, role }: { email: string; password: string; role: UserRole }) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await createUserProfile(userCredential.user.uid, email);
    if (role !== 'user') {
      await this.updateUserRole(userCredential.user.uid, role);
    }
    return userCredential.user;
  },

  async updateUserRole(userId: string, newRole: UserRole) {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      role: newRole,
      updatedAt: new Date()
    });
  },

  async assignBusinessToUser(userId: string, businessId: string) {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      businessIds: arrayUnion(businessId)
    });
  },

  async removeBusinessFromUser(userId: string, businessId: string) {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      businessIds: arrayRemove(businessId)
    });
  }
}; 