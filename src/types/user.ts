export type UserRole = 'superAdmin' | 'admin' | 'user';

export interface SocialMedia {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  website?: string;
}

export interface Location {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface BusinessHours {
  monday: { open: string; close: string } | null;
  tuesday: { open: string; close: string } | null;
  wednesday: { open: string; close: string } | null;
  thursday: { open: string; close: string } | null;
  friday: { open: string; close: string } | null;
  saturday: { open: string; close: string } | null;
  sunday: { open: string; close: string } | null;
}

export interface Business {
  id: string;
  name: string;
  description: string;
  type: 'restaurant' | 'bar' | 'cafe';
  cuisine: string[];
  priceRange: '€' | '€€' | '€€€' | '€€€€';
  location: Location;
  contact: {
    phone: string;
    email: string;
    whatsapp?: string;
  };
  socialMedia: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    website?: string;
  };
  businessHours: BusinessHours;
  features: string[];
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'inactive' | 'pending';
}

export interface User {
  uid: string;
  email: string | null;
  role: UserRole;
  businessIds: string[];
  createdAt: Date;
  lastLogin: Date;
}

export interface RolePermissions {
  canUseBusinessTools: boolean;
  canViewBusinessData: boolean;
  canManageAssignedBusinesses?: boolean;
  canManageBusinessUsers?: boolean;
  canConfigureBusiness?: boolean;
  canManageAllBusinesses?: boolean;
  canManageUsers?: boolean;
  canAssignBusinesses?: boolean;
  canManageRoles?: boolean;
}

const baseUserPermissions: RolePermissions = {
  canUseBusinessTools: true,
  canViewBusinessData: true
};

const baseAdminPermissions: RolePermissions = {
  ...baseUserPermissions,
  canManageAssignedBusinesses: true,
  canManageBusinessUsers: true,
  canConfigureBusiness: true
};

export const rolePermissions: Record<UserRole, RolePermissions> = {
  user: baseUserPermissions,
  admin: baseAdminPermissions,
  superAdmin: {
    ...baseUserPermissions,
    ...baseAdminPermissions,
    canManageAllBusinesses: true,
    canManageUsers: true,
    canAssignBusinesses: true,
    canManageRoles: true
  }
};

export const roleHierarchy: Record<UserRole, number> = {
  user: 1,
  admin: 2,
  superAdmin: 3
};