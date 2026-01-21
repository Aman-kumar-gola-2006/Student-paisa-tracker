
export enum Category {
  RENT = 'Rent',
  FOOD = 'Food',
  TRAVEL = 'Travel',
  PERSONAL = 'Personal',
  MISC = 'Miscellaneous'
}

export enum BorrowType {
  LENT = 'Lent',
  BORROWED = 'Borrowed'
}

export enum BorrowStatus {
  PENDING = 'Pending',
  RETURNED = 'Returned'
}

export interface User {
  id: string;
  name: string;
  email: string;
  contactNumber?: string;
  authProvider: 'Email' | 'Google';
  profilePic?: string;
}

export interface Budget {
  id: string;
  userId: string;
  month: string;
  year: number;
  totalIncome: number;
  fixedRent: number;
  savingsGoal: number;
  lowBalanceThreshold?: number;
}

export interface Expense {
  id: string;
  userId: string;
  budgetId: string;
  category: Category;
  amount: number;
  date: string;
  notes: string;
}

export interface BorrowRecord {
  id: string;
  userId: string;
  personName: string;
  amount: number;
  type: BorrowType;
  status: BorrowStatus;
  date: string;
  proofUrl?: string; // Cloudinary URL or Base64
}

export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  remainingBalance: number;
  lentAmount: number;
  borrowedAmount: number;
  categoryData: { name: string; value: number }[];
}
