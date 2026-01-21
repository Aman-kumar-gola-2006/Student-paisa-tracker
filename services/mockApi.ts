
import { User, Budget, Expense, BorrowRecord, Category, BorrowType, BorrowStatus } from '../types';

const STORAGE_KEYS = {
  USER: 'tracker_user',
  BUDGETS: 'tracker_budgets',
  EXPENSES: 'tracker_expenses',
  BORROW: 'tracker_borrow'
};

const getFromStorage = <T,>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

const saveToStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const apiService = {
  // Auth
  getCurrentUser: (): User | null => getFromStorage<User | null>(STORAGE_KEYS.USER, null),
  login: (email: string, name: string, contact?: string, provider: 'Email' | 'Google' = 'Email'): User => {
    const user: User = { 
      id: Math.random().toString(36).substr(2, 9), 
      name, 
      email, 
      contactNumber: contact,
      authProvider: provider,
      profilePic: provider === 'Google' ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}` : undefined
    };
    saveToStorage(STORAGE_KEYS.USER, user);
    return user;
  },
  logout: () => localStorage.removeItem(STORAGE_KEYS.USER),

  // Budget
  getBudgets: (): Budget[] => getFromStorage<Budget[]>(STORAGE_KEYS.BUDGETS, []),
  saveBudget: (budget: Partial<Budget>): Budget => {
    const budgets = getFromStorage<Budget[]>(STORAGE_KEYS.BUDGETS, []);
    const newBudget = {
      ...budget,
      id: budget.id || Math.random().toString(36).substr(2, 9),
      userId: apiService.getCurrentUser()?.id || '1'
    } as Budget;
    
    const index = budgets.findIndex(b => b.id === newBudget.id);
    if (index > -1) budgets[index] = newBudget;
    else budgets.push(newBudget);
    
    saveToStorage(STORAGE_KEYS.BUDGETS, budgets);
    return newBudget;
  },

  // Expenses
  getExpenses: (budgetId?: string): Expense[] => {
    const expenses = getFromStorage<Expense[]>(STORAGE_KEYS.EXPENSES, []);
    return budgetId ? expenses.filter(e => e.budgetId === budgetId) : expenses;
  },
  addExpense: (expense: Omit<Expense, 'id'>): Expense => {
    const expenses = getFromStorage<Expense[]>(STORAGE_KEYS.EXPENSES, []);
    const newExpense = { ...expense, id: Math.random().toString(36).substr(2, 9) };
    expenses.push(newExpense);
    saveToStorage(STORAGE_KEYS.EXPENSES, expenses);
    return newExpense;
  },
  deleteExpense: (id: string) => {
    const expenses = getFromStorage<Expense[]>(STORAGE_KEYS.EXPENSES, []);
    saveToStorage(STORAGE_KEYS.EXPENSES, expenses.filter(e => e.id !== id));
  },

  // Borrow/Lend
  getBorrowRecords: (): BorrowRecord[] => getFromStorage<BorrowRecord[]>(STORAGE_KEYS.BORROW, []),
  addBorrowRecord: (record: Omit<BorrowRecord, 'id'>): BorrowRecord => {
    const records = getFromStorage<BorrowRecord[]>(STORAGE_KEYS.BORROW, []);
    const newRecord = { ...record, id: Math.random().toString(36).substr(2, 9) };
    records.push(newRecord);
    saveToStorage(STORAGE_KEYS.BORROW, records);
    return newRecord;
  },
  updateBorrowStatus: (id: string, status: BorrowStatus) => {
    const records = getFromStorage<BorrowRecord[]>(STORAGE_KEYS.BORROW, []);
    const index = records.findIndex(r => r.id === id);
    if (index > -1) {
      records[index].status = status;
      saveToStorage(STORAGE_KEYS.BORROW, records);
    }
  }
};
