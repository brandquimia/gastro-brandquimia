export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'admin' | 'manager' | 'staff';
    createdAt: Date;
  }
  
  export interface Business {
    id: string;
    name: string;
    address: string;
    phone: string;
    googlePlaceId?: string;
    ownerId: string;
    managers: string[]; // user IDs
    staff: string[]; // user IDs
  }
  
  export interface UserBusiness {
    userId: string;
    businessId: string;
    role: 'owner' | 'manager' | 'staff';
  }