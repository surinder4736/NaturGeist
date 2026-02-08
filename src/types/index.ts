export type UserRole = 'ADMIN' | 'NGO' | 'CONTRIBUTOR' | 'GUEST';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId?: string;
  createdAt: string;
}

export interface Cause {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  urgency: string;
  status: string;
  images: string[];
  organization?: { id: string; name: string };
  campaign?: { id: string; title: string };
}

export interface Contribution {
  id: string;
  causeId: string;
  userId: string;
  type: 'MATERIAL' | 'MONETARY' | 'VOLUNTEER';
  amount?: number;
  description?: string;
  status: string;
  cause?: { id: string; title: string };
}
