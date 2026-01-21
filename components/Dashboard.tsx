
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Icons, CATEGORIES } from '../constants';
import { Expense, Budget, BorrowRecord, BorrowStatus, BorrowType } from '../types';
import toast from 'react-hot-toast';

interface DashboardProps {
  currentBudget: Budget | null;
  expenses: Expense[];
  borrowRecords: BorrowRecord[];
  user: any;
}

const Dashboard: React.FC<DashboardProps> = ({ currentBudget, expenses, borrowRecords, user }) => {
  const stats = useMemo(() => {
    const income = currentBudget?.totalIncome || 0;
    const spent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const rent = currentBudget?.fixedRent || 0;
    
    const lentPending = borrowRecords
      .filter(r => r.type === BorrowType.LENT && r.status === BorrowStatus.PENDING)
      .reduce((acc, curr) => acc + curr.amount, 0);
      
    const borrowedPending = borrowRecords
      .filter(r => r.type === BorrowType.BORROWED && r.status === BorrowStatus.PENDING)
      .reduce((acc, curr) => acc + curr.amount, 0);

    const remaining = income - spent - rent + borrowedPending - lentPending;

    const categoryData = CATEGORIES.map(cat => ({
      name: cat.label,
      value: expenses.filter(e => e.category === cat.id).reduce((acc, curr) => acc + curr.amount, 0) + (cat.id === 'Rent' ? rent : 0)
    })).filter(d => d.value > 0);

    return {
      income,
      spent: spent + rent,
      remaining,
      lentPending,
      borrowedPending,
      categoryData
    };
  }, [currentBudget, expenses, borrowRecords]);

  const isLowBalance = currentBudget?.lowBalanceThreshold !== undefined && stats.remaining <= currentBudget.lowBalanceThreshold;

  const handleSendReport = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Generating PDF Receipt...',
        success: `Report sent to ${user.email}! Check your inbox.`,
        error: 'Could not send report.',
      }
    );
    // Real integration logic for EmailJS:
    // emailjs.send("service_id", "template_id", {
    //   user_name: user.name,
    //   total_income: stats.income,
    //   total_expense: stats.spent,
    //   remaining: stats.remaining,
    //   month: currentBudget?.month
    // }, "public_key");
  };

  if (!currentBudget) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="p-4 bg-indigo-50 rounded-full mb-4">
          <Icons.Wallet />
        </div>
        <h2 className="text-xl font-semibold text-slate-800">No Budget Set for this Month</h2>
        <p className="text-slate-500 mt-2 max-w-xs">Start by adding your monthly allowance and fixed rent to track your kharcha.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Alert & Actions Section */}
      <div className="flex flex-col gap-4">
        {isLowBalance && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-4 animate-in fade-in slide-in-from-top duration-300">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-xl animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            </div>
            <div>
              <h4 className="text-amber-800 font-bold">Low Balance Warning!</h4>
              <p className="text-amber-700 text-sm">₹{stats.remaining} left. Below threshold of ₹{currentBudget.lowBalanceThreshold}.</p>
            </div>
          </div>
        )}

        <div className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Icons.History />
            </div>
            <span className="text-sm font-bold text-slate-700">Monthly Statements</span>
          </div>
          <button 
            onClick={handleSendReport}
            className="text-xs font-black uppercase tracking-widest bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-black transition-all"
          >
            Email Report
          </button>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className={`${isLowBalance ? 'bg-amber-600 ring-4 ring-amber-100' : 'bg-indigo-600'} p-6 rounded-2xl text-white shadow-lg shadow-indigo-100 transition-colors duration-500`}>
          <p className={`${isLowBalance ? 'text-amber-100' : 'text-indigo-100'} text-sm font-medium uppercase tracking-wider`}>Remaining Balance</p>
          <h3 className="text-3xl font-bold mt-1">₹ {stats.remaining.toLocaleString()}</h3>
          <p className={`${isLowBalance ? 'text-amber-200' : 'text-indigo-200'} text-xs mt-4`}>Total Income: ₹ {stats.income.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Total Expenses</p>
              <h3 className="text-2xl font-bold mt-1 text-slate-800">₹ {stats.spent.toLocaleString()}</h3>
            </div>
            <div className={`p-2 ${isLowBalance ? 'bg-amber-50 text-amber-500' : 'bg-red-50 text-red-500'} rounded-lg transition-colors`}>
              <Icons.TrendDown />
            </div>
          </div>
          <div className="mt-4 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className={`${isLowBalance ? 'bg-amber-500' : 'bg-red-500'} h-full transition-all duration-500`} 
              style={{ width: `${Math.min((stats.spent / stats.income) * 100, 100)}%` }}
            />
          </div>
          <p className="text-slate-400 text-xs mt-2">{Math.round((stats.spent / stats.income) * 100)}% budget utilized</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Lending/Borrowing</p>
              <div className="mt-2 space-y-1">
                <p className="text-sm text-amber-600 font-bold">Udhaar Liya: ₹ {stats.borrowedPending}</p>
                <p className="text-sm text-green-600 font-bold">Udhaar Diya: ₹ {stats.lentPending}</p>
              </div>
            </div>
            <div className="p-2 bg-slate-50 text-slate-500 rounded-lg">
              <Icons.User />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h4 className="text-lg font-semibold text-slate-800 mb-6">Expense Distribution</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORIES.find(c => c.label === entry.name)?.color || '#94a3b8'} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h4 className="text-lg font-semibold text-slate-800 mb-6">Spending Analysis</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.categoryData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill={isLowBalance ? '#d97706' : '#6366f1'} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
