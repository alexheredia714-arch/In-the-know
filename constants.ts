import { JobPost, JobCategory, BudgetType, Conversation, Review } from './types';

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    jobId: '101',
    jobTitle: 'Fix Leaky Kitchen Sink',
    reviewerName: 'Sarah J.',
    reviewerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    rating: 5,
    comment: "Alex was fantastic! He came over within an hour, fixed the leak, and was very polite. Highly recommended for any plumbing needs.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    metrics: {
      punctuality: 5,
      professionalism: 5,
      broughtTools: true
    }
  },
  {
    id: 'r2',
    jobId: '102',
    jobTitle: 'Assemble Bookshelf',
    reviewerName: 'Emily R.',
    reviewerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    rating: 4,
    comment: "Did a solid job assembling my IKEA shelves. Took a bit longer than expected but the result is sturdy.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15), // 15 days ago
    metrics: {
      punctuality: 4,
      professionalism: 5,
      broughtTools: true
    }
  },
   {
    id: 'r3',
    jobId: '103',
    jobTitle: 'Garage Cleanup',
    reviewerName: 'David K.',
    reviewerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    rating: 5,
    comment: "Hard worker. Helped me clear out years of junk from my garage. Very efficient and took everything to the recycling center for me.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
    metrics: {
      punctuality: 5,
      professionalism: 4,
      broughtTools: false // Maybe tools weren't needed or provided by owner
    }
  }
];

export const MOCK_USER = {
  name: "Alex Rivera",
  location: "North Hills",
  memberSince: "March 2024",
  bio: "Handy with a wrench, terrible with a paintbrush. Always looking to trade plumbing work for gardening help!",
  avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  skills: ["Pipe Fitting", "Drain Cleaning", "Furniture Assembly"],
  reviews: MOCK_REVIEWS,
  stats: {
    jobsPosted: 12,
    jobsCompleted: 8,
    rating: 4.7
  }
};

export const MOCK_JOBS: JobPost[] = [
  {
    id: '1',
    title: 'Fix Leaky Kitchen Sink',
    description: 'My kitchen sink drips constantly. I have the washer but need someone with a wrench and know-how to swap it out. I can bake you a pie in exchange!',
    category: JobCategory.PLUMBING,
    budgetType: BudgetType.BARTER,
    barterDescription: 'Homemade Apple Pie & Coffee',
    location: 'Downtown Community',
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    authorName: 'Sarah J.'
  },
  {
    id: '2',
    title: 'Paint Nursery Room',
    description: 'Need help painting a small 10x10 room. I have the paint and brushes, just need an extra hand to get it done faster.',
    category: JobCategory.PAINTING,
    budgetType: BudgetType.FIXED,
    budgetAmount: 50,
    location: 'Westside',
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    authorName: 'Mike T.'
  },
  {
    id: '3',
    title: 'Assemble Bookshelf',
    description: 'Bought a large bookshelf from IKEA. Overwhelmed by the instructions. Need someone to assemble it.',
    category: JobCategory.GENERAL_LABOR,
    budgetType: BudgetType.HOURLY,
    budgetAmount: 20,
    location: 'North Hills',
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    authorName: 'Emily R.'
  },
  {
    id: '4',
    title: 'Community Garden Cleanup',
    description: 'We need 3-4 people to help weed the community garden this Saturday. Lunch provided!',
    category: JobCategory.YARD_WORK,
    budgetType: BudgetType.VOLUNTEER,
    location: 'Central Park Area',
    postedAt: new Date(Date.now() - 1000 * 60 * 30),
    authorName: 'Green Thumb Org'
  }
];

export const CATEGORY_COLORS: Record<JobCategory, string> = {
  [JobCategory.PLUMBING]: 'bg-blue-100 text-blue-800',
  [JobCategory.ELECTRICAL]: 'bg-yellow-100 text-yellow-800',
  [JobCategory.CARPENTRY]: 'bg-orange-100 text-orange-800',
  [JobCategory.PAINTING]: 'bg-purple-100 text-purple-800',
  [JobCategory.CLEANING]: 'bg-teal-100 text-teal-800',
  [JobCategory.YARD_WORK]: 'bg-green-100 text-green-800',
  [JobCategory.GENERAL_LABOR]: 'bg-gray-100 text-gray-800',
  [JobCategory.OTHER]: 'bg-pink-100 text-pink-800',
};

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    recipientName: 'Sarah J.',
    recipientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    lastMessage: 'Does 2pm work for you?',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30),
    unreadCount: 1,
    relatedJobTitle: 'Fix Leaky Kitchen Sink',
    messages: [
      { id: 'm1', senderId: 'me', text: 'Hi Sarah, I saw your post about the sink. I can help with that!', timestamp: new Date(Date.now() - 1000 * 60 * 60) },
      { id: 'm2', senderId: 'Sarah J.', text: 'Oh that would be amazing! The apple pie is ready.', timestamp: new Date(Date.now() - 1000 * 60 * 45) },
      { id: 'm3', senderId: 'Sarah J.', text: 'Does 2pm work for you?', timestamp: new Date(Date.now() - 1000 * 60 * 30) },
    ]
  },
  {
    id: 'c2',
    recipientName: 'Mike T.',
    recipientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    lastMessage: 'Thanks for the offer, but I found someone.',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24),
    unreadCount: 0,
    relatedJobTitle: 'Paint Nursery Room',
    messages: [
      { id: 'm4', senderId: 'me', text: 'Hey Mike, do you still need help painting?', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25) },
      { id: 'm5', senderId: 'Mike T.', text: 'Thanks for the offer, but I found someone.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) },
    ]
  }
];
