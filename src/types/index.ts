export type CategorySlug = 'housing' | 'courses' | 'daily-life';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  studyProgram: string;
  role: 'student' | 'admin';
  isBlocked: boolean;
  joinedAt: string;
  bio?: string;
}

export interface Tip {
  id: string;
  title: string;
  text: string;
  category: CategorySlug;
  subtopic: string;
  studyProgram?: string;
  courseCode?: string;
  courseName?: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorProgram: string;
  createdAt: string;
  updatedAt: string;
  upvotes: number;
  coverImage: string;
  price?: string;
  neighborhood?: string;
  difficulty?: number; // 1-5 for courses
  workload?: string; // e.g. "6-8 hrs/week"
}

export type ReportReason = 'outdated' | 'wrong' | 'other';

export interface Report {
  id: string;
  tipId: string;
  tipTitle: string;
  tipCategory: CategorySlug;
  reporterId: string;
  reporterName: string;
  reason: ReportReason;
  comment?: string;
  createdAt: string;
  status: 'open' | 'dismissed';
}

export interface CourseSpotlight {
  code: string;
  name: string;
  studyProgram: string;
  difficulty: number; // 1 to 5
  workload: number; // hrs/week
  rating: number; // 1 to 5
  tipsCount: number;
  description: string;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}
