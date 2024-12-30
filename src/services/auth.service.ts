import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
  } from 'firebase/auth';
  import { doc, setDoc, getDoc } from 'firebase/firestore';
  import { auth, db } from '../config/firebase';
  import { User } from '../types/auth';
  
  export const authService = {
    async signIn(email: string, password: string) {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', credential.user.uid));
      return userDoc.data() as User;
    },
  
    async signUp(email: string, password: string, firstName: string, lastName: string) {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      const user: User = {
        id: credential.user.uid,
        email,
        firstName,
        lastName,
        role: 'staff', // default role
        createdAt: new Date()
      };
      
      await setDoc(doc(db, 'users', user.id), user);
      await updateProfile(credential.user, {
        displayName: `${firstName} ${lastName}`
      });
      
      return user;
    },
  
    async signOut() {
      await signOut(auth);
    }
  };