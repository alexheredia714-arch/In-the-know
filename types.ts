export enum JobCategory {
  PLUMBING = 'Plumbing',
  ELECTRICAL = 'Electrical',
  CARPENTRY = 'Carpentry',
  PAINTING = 'Painting',
  CLEANING = 'Cleaning',
  YARD_WORK = 'Yard Work',
  GENERAL_LABOR = 'General Labor',
  OTHER = 'Other'
}

export enum BudgetType {
  FIXED = 'Fixed Price',
  HOURLY = 'Hourly',
  BARTER = 'Barter/Trade',
  VOLUNTEER = 'Volunteer Request'
}

export interface JobPost {
  id: string;
  title: string;
  description: string;
  category: JobCategory;
  budgetType: BudgetType;
  budgetAmount?: number; // Optional for Barter/Volunteer
  barterDescription?: string;
  location: string;
  postedAt: Date;
  authorName: string;
  status: 'active' | 'completed' | 'cancelled';
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export interface DirectMessage {
  id: string;
  senderId: string; // 'me' or recipientName
  text: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  recipientName: string;
  recipientAvatar?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  relatedJobTitle?: string;
  messages: DirectMessage[];
}

export interface ReviewMetrics {
  punctuality: number; // 1-5
  professionalism: number; // 1-5
  broughtTools: boolean;
}

export interface Review {
  id: string;
  jobId: string;
  jobTitle: string;
  dealType: BudgetType;
  dealValue?: string; // e.g. "$50" or "Garden work"
  reviewerName: string;
  reviewerAvatar: string;
  rating: number; // 1-5
  comment: string;
  date: Date;
  metrics?: ReviewMetrics;
}

export interface UserProfile {
  id: string;
  name: string;
  location: string;
  memberSince: string;
  bio: string;
  avatarUrl: string;
  skills: string[];
  stats: {
    jobsPosted: number;
    jobsCompleted: number;
    rating: number;
  };
  reviews: Review[];
}
