import { db } from '../config/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  updateDoc 
} from 'firebase/firestore';
import { Business } from '../types/user';

export const businessService = {
  async createBusiness(businessData: Omit<Business, 'id' | 'createdAt' | 'updatedAt'>): Promise<Business> {
    const businessRef = doc(collection(db, 'businesses'));
    const now = new Date();
    const newBusiness: Business = {
      id: businessRef.id,
      ...businessData,
      createdAt: now,
      updatedAt: now
    };

    await setDoc(businessRef, newBusiness);
    return newBusiness;
  },

  async getBusinessById(id: string): Promise<Business | null> {
    const docRef = doc(db, 'businesses', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() as Business : null;
  },

  async updateBusiness(id: string, businessData: Partial<Business>): Promise<void> {
    const businessRef = doc(db, 'businesses', id);
    await updateDoc(businessRef, {
      ...businessData,
      updatedAt: new Date()
    });
  },

  async getBusinessesByUser(userId: string) {
    const userDoc = await getDoc(doc(db, 'users', userId));
    const userData = userDoc.data();
    
    if (!userData) return [];
    
    if (userData.role === 'superAdmin') {
      // Obtener todos los negocios para superAdmin
      const snapshot = await getDocs(collection(db, 'businesses'));
      return snapshot.docs.map(doc => doc.data() as Business);
    } else {
      // Obtener solo los negocios asignados
      const businessIds = userData.businessIds || [];
      const businesses: Business[] = [];
      
      for (const id of businessIds) {
        const businessDoc = await getDoc(doc(db, 'businesses', id));
        if (businessDoc.exists()) {
          businesses.push(businessDoc.data() as Business);
        }
      }
      
      return businesses;
    }
  },

  async deleteBusiness(businessId: string) {
    await deleteDoc(doc(db, 'businesses', businessId));
    // TODO: También deberíamos eliminar las referencias en los usuarios
  }
}; 