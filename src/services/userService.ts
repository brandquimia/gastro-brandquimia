import { db } from '../config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { User } from '../types/user';

export const createUserProfile = async (uid: string, email: string) => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);

  // Si el usuario ya existe, retornar el perfil existente
  if (userSnap.exists()) {
    return userSnap.data() as User;
  }

  // Solo crear nuevo perfil si no existe
  const userData: User = {
    uid,
    email,
    role: 'user', // rol por defecto solo para usuarios nuevos
    businessIds: [],
    createdAt: new Date(),
    lastLogin: new Date()
  };

  await setDoc(userRef, userData);
  return userData;
};

export const getUserProfile = async (uid: string) => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data() as User : null;
}; 