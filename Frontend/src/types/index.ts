export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  error: ApiError | null;
  meta: ApiMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details: Record<string, unknown>;
  traceId: string;
}

export interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export type Language = 'vi' | 'en' | 'ko';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
}

export type TransactionType = 'income' | 'expense';
export type DebtDirection = 'I_OWE' | 'OWES_ME';
export type DebtStatus = 'OPEN' | 'SETTLED';
export type TodoStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TodoPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
export type GoalStatus = 'ACTIVE' | 'COMPLETED' | 'PAUSED' | 'ABANDONED';
export type LearningLanguage = 'IELTS' | 'TOPIK';
export type LearningSkill = 'LISTENING' | 'READING' | 'WRITING' | 'SPEAKING' | 'VOCABULARY' | 'GRAMMAR';
export type Mood = 'AMAZING' | 'GOOD' | 'NEUTRAL' | 'SAD' | 'TERRIBLE';
export type TimelineEventType = 'EDUCATION' | 'WORK' | 'PROJECT' | 'MILESTONE' | 'MEMORY';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  category: string;
  wallet: string;
  note?: string;
  occurredAt: string;
  createdAt: string;
}

export interface DebtPerson {
  id: string;
  name: string;
  avatar?: string;
  contact?: string;
}

export interface DebtRecord {
  id: string;
  personId: string;
  personName: string;
  direction: DebtDirection;
  amount: number;
  currency: string;
  note?: string;
  occurredAt: string;
  status: DebtStatus;
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  priority: TodoPriority;
  status: TodoStatus;
  dueDate?: string;
  repeat?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  targetDate?: string;
  progress: number;
  status: GoalStatus;
  milestones: Milestone[];
  createdAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  done: boolean;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  type: TimelineEventType;
  media?: string[];
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  title?: string;
  content: string;
  mood?: Mood;
  tags: string[];
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VocabularyItem {
  id: string;
  word: string;
  meaning: string;
  example?: string;
  language: LearningLanguage;
  skill: LearningSkill;
  mastered: boolean;
  createdAt: string;
}

export interface DashboardSummary {
  finance: {
    incomeThisMonth: number;
    expenseThisMonth: number;
    balance: number;
    currency: string;
  };
  debts: {
    totalIOwe: number;
    totalOwedToMe: number;
    currency: string;
  };
  todos: {
    todayCount: number;
    doneToday: number;
  };
  learning: {
    streak: number;
    language: LearningLanguage;
  };
  lastMood?: Mood;
  lastTimelineEvent?: TimelineEvent;
}
