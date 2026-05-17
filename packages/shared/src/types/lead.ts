import { LeadStatus, LeadSource } from '../constants/lead';

export interface IActivityTimeline {
  action: string;
  timestamp: Date;
  performedBy: string; // User ID
}

export interface ILead {
  id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
  assignedTo?: string; // User ID
  activityTimeline: IActivityTimeline[];
  createdAt?: Date;
  updatedAt?: Date;
}
