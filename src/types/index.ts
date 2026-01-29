// Re-export database types for convenience
export type {
  User,
  NewUser,
  Contact,
  NewContact,
  Loan,
  NewLoan,
  Task,
  NewTask,
} from "@/db/schema";

// Status enums
export const ContactStatus = {
  NEW: "new",
  ACTIVE: "active",
  INACTIVE: "inactive",
  CLOSED: "closed",
} as const;

export type ContactStatus = (typeof ContactStatus)[keyof typeof ContactStatus];

export const LoanStatus = {
  PENDING: "pending",
  APPROVED: "approved",
  FUNDED: "funded",
  CLOSED: "closed",
  DENIED: "denied",
} as const;

export type LoanStatus = (typeof LoanStatus)[keyof typeof LoanStatus];

export const LoanType = {
  CONVENTIONAL: "conventional",
  FHA: "fha",
  VA: "va",
  JUMBO: "jumbo",
  USDA: "usda",
} as const;

export type LoanType = (typeof LoanType)[keyof typeof LoanType];

export const TaskStatus = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

// API response types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// Common utility types
export type Nullable<T> = T | null;

export type WithTimestamps = {
  createdAt: Date;
  updatedAt?: Date;
};

export type WithId<T extends string = string> = {
  id: T;
};
