
import React, { useState, useEffect } from 'react';
import { User, Budget, Expense, BorrowRecord, Category, BorrowStatus } from './types';
import { apiService } from './services/api';
import Dashboard from './components/Dashboard';
import BudgetSetup from './components/BudgetSetup';
import { AuthPage } from './components/AuthPage';
import ExpenseForm from './components/ExpenseForm';
import BorrowTracker from './components/BorrowTracker';
import { Icons, CATEGORIES } from './constants';
import { Toaster, toast } from 'react-hot-toast';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'udhaar'>('dashboard');
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();

  const currentBudget = budgets.find(b => b.month === currentMonth && b.year === currentYear) || null;

  useEffect(() => {
    const init = async () => {
      const u = apiService.getCurrentUser();
      if (u) {
        setUser(u);
        try {
          const fetchedBudgets = await apiService.getBudgets(u.id);
          const fetchedBorrows = await apiService.getBorrowRecords();
          setBudgets(fetchedBudgets);
          setBorrowRecords(fetchedBorrows);
        } catch (error) {
          console.error("Failed to load initial data", error);
        }
      }
    };
    init();
  }, []);

  useEffect(() => {
    const fetchExpenses = async () => {
      if (currentBudget) {
        try {
          const fetchedExpenses = await apiService.getExpenses(currentBudget.id);
          setExpenses(fetchedExpenses);
        } catch (error) {
          console.error("Failed to load expenses", error);
        }
      }
    };
    fetchExpenses();
  }, [currentBudget]);

  const handleAuthSuccess = (u: User) => {
    setUser(u);
    window.location.reload();
  };

  const saveBudget = async (budgetData: Partial<Budget>) => {
    try {
      const b = await apiService.saveBudget({ ...budgetData, userId: user!.id });
      setBudgets([...budgets.filter(x => x.id !== b.id), b]);
      toast.success(`${currentMonth} budget activated!`);
    } catch (error) {
      toast.error("Failed to save budget");
    }
  };

  const addExpense = async (data: { category: Category; amount: number; notes: string; date: string }) => {
    if (!currentBudget) return;
    try {
      const exp = await apiService.addExpense({
        ...data,
        userId: user!.id,
        budgetId: currentBudget.id
      });
      setExpenses([exp, ...expenses]);
      toast.success("Kharcha recorded!");
    } catch (error) {
      toast.error("Failed to add expense");
    }
  };

  const removeExpense = async (id: string) => {
    try {
      await apiService.deleteExpense(id);
      setExpenses(expenses.filter(e => e.id !== id));
      toast.success("Expense removed");
    } catch (error) {
      toast.error("Failed to remove expense");
    }
  };

  const addBorrow = async (record: Omit<BorrowRecord, 'id'>) => {
    try {
      const r = await apiService.addBorrowRecord({ ...record, userId: user!.id });
      setBorrowRecords([r, ...borrowRecords]);
    } catch (error) {
      toast.error("Failed to add record");
    }
  };

  const updateBorrowStatus = async (id: string, status: BorrowStatus) => {
    try {
      await apiService.updateBorrowStatus(id, status);
      setBorrowRecords(borrowRecords.map(r => r.id === id ? { ...r, status } : r));
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (!user) {
    return (
      <>
        <Toaster position="top-right" />
        <AuthPage onLogin={handleAuthSuccess} />
      </>
    );
  }


  return (
    <div className="min-h-screen bg-slate-50 max-w-4xl mx-auto px-4 md:px-6 py-6 pb-32">
      <Toaster position="top-center" />
      {/* Header */}
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">StudentPaisa.</h1>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">{currentMonth} {currentYear}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-slate-800">{user.name}</p>
            <button
              onClick={() => {
                apiService.logout();
                toast.success("Logged out safely");
                setTimeout(() => window.location.reload(), 800);
              }}
              className="text-[10px] text-red-500 font-black uppercase tracking-widest hover:underline"
            >
              Sign Out
            </button>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center border-2 border-white shadow-md overflow-hidden ring-4 ring-indigo-50">
            <img src={user.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} alt="Avatar" />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {!currentBudget && activeTab === 'dashboard' ? (
          <BudgetSetup onSave={saveBudget} />
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard
                currentBudget={currentBudget}
                expenses={expenses}
                borrowRecords={borrowRecords}
                user={user}
              />
            )}

            {activeTab === 'history' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-black text-slate-800">Kharcha History</h2>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{expenses.length} Records Found</div>
                </div>
                {expenses.length === 0 ? (
                  <div className="py-24 text-center bg-white rounded-[2rem] border border-slate-100">
                    <p className="text-slate-400 font-medium italic">No expenses recorded yet.</p>
                  </div>
                ) : (
                  expenses.map(exp => (
                    <div key={exp.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center hover:shadow-md transition-all hover:-translate-y-1">
                      <div className="flex gap-4 items-center">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center`} style={{ backgroundColor: `${CATEGORIES.find(c => c.id === exp.category)?.color}10`, color: CATEGORIES.find(c => c.id === exp.category)?.color }}>
                          <span className="font-black text-lg">{exp.category.charAt(0)}</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800">{exp.notes || exp.category}</h4>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{exp.date} • {exp.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <p className="font-black text-slate-900 text-lg">₹ {exp.amount}</p>
                        <button
                          onClick={() => removeExpense(exp.id)}
                          className="p-3 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'udhaar' && (
              <BorrowTracker
                records={borrowRecords}
                onAdd={addBorrow}
                onUpdateStatus={updateBorrowStatus}
              />
            )}
          </>
        )}
      </main>

      {/* Floating Action Button - Toggle Plus/Close */}
      {currentBudget && (
        <button
          onClick={() => setShowExpenseModal(!showExpenseModal)}
          className={`fixed bottom-32 right-8 w-16 h-16 rounded-3xl flex items-center justify-center text-white shadow-2xl transition-all hover:scale-110 active:scale-90 z-[60] ${showExpenseModal ? 'bg-red-500 shadow-red-200' : 'bg-indigo-600 shadow-indigo-200'}`}
        >
          {showExpenseModal ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          ) : (
            <Icons.Plus />
          )}
        </button>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-slate-900/90 backdrop-blur-xl border border-white/10 p-3 rounded-[2.5rem] flex justify-around items-center z-50 shadow-2xl">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all ${activeTab === 'dashboard' ? 'text-white bg-indigo-600 shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <Icons.Wallet />
          <span className="text-[10px] font-black uppercase tracking-widest">Dashboard</span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all ${activeTab === 'history' ? 'text-white bg-indigo-600 shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <Icons.History />
          <span className="text-[10px] font-black uppercase tracking-widest">Kharcha</span>
        </button>
        <button
          onClick={() => setActiveTab('udhaar')}
          className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all ${activeTab === 'udhaar' ? 'text-white bg-indigo-600 shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <Icons.User />
          <span className="text-[10px] font-black uppercase tracking-widest">Udhaar</span>
        </button>
      </div>

      {/* Expense Modal */}
      {showExpenseModal && currentBudget && (
        <ExpenseForm
          budgetId={currentBudget.id}
          onAdd={addExpense}
          onClose={() => setShowExpenseModal(false)}
        />
      )}
    </div>
  );
};

export default App;
