import { User, Budget, Expense, BorrowRecord, BorrowStatus } from '../types';

const API_URL = 'http://localhost:5000/api';

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Something went wrong');
    }
    return response.json();
};

export const apiService = {
    // Auth
    getCurrentUser: (): User | null => {
        const userStr = localStorage.getItem('tracker_user_sess');
        if (!userStr) return null;

        try {
            const user = JSON.parse(userStr);
            // Basic check if ID exists
            if (user.id) {
                return user;
            } else {
                // Invalid user object
                localStorage.removeItem('tracker_user_sess');
                return null;
            }
        } catch (e) {
            return null;
        }
    },

    login: async (email: string, password?: string, name?: string, contact?: string, provider: 'Email' | 'Google' = 'Email'): Promise<User> => {
        const body = provider === 'Google'
            ? { email, name, contactNumber: contact, authProvider: provider }
            : { email, password };

        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const user = await handleResponse(response);
        localStorage.setItem('tracker_user_sess', JSON.stringify(user));
        return user;
    },

    register: async (name: string, email: string, password: string, contact?: string): Promise<User> => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, contactNumber: contact })
        });
        const user = await handleResponse(response);
        localStorage.setItem('tracker_user_sess', JSON.stringify(user));
        return user;
    },

    logout: () => {
        localStorage.removeItem('tracker_user_sess');
    },

    // Budget
    getBudgets: async (userId: string): Promise<Budget[]> => {
        const response = await fetch(`${API_URL}/budgets?userId=${userId}`);
        return handleResponse(response);
    },

    saveBudget: async (budget: Partial<Budget>): Promise<Budget> => {
        const response = await fetch(`${API_URL}/budgets`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(budget)
        });
        return handleResponse(response);
    },

    // Expenses
    getExpenses: async (budgetId: string): Promise<Expense[]> => {
        const response = await fetch(`${API_URL}/expenses?budgetId=${budgetId}`);
        return handleResponse(response);
    },

    addExpense: async (expense: Omit<Expense, 'id'>): Promise<Expense> => {
        const response = await fetch(`${API_URL}/expenses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(expense)
        });
        return handleResponse(response);
    },

    deleteExpense: async (id: string): Promise<void> => {
        const response = await fetch(`${API_URL}/expenses/${id}`, {
            method: 'DELETE'
        });
        await handleResponse(response);
    },

    // Borrow/Lend
    getBorrowRecords: async (): Promise<BorrowRecord[]> => {
        const response = await fetch(`${API_URL}/borrow`);
        return handleResponse(response);
    },

    addBorrowRecord: async (record: Omit<BorrowRecord, 'id'>): Promise<BorrowRecord> => {
        const response = await fetch(`${API_URL}/borrow`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(record)
        });
        return handleResponse(response);
    },

    updateBorrowStatus: async (id: string, status: BorrowStatus): Promise<void> => {
        const response = await fetch(`${API_URL}/borrow/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        await handleResponse(response);
    }
};
