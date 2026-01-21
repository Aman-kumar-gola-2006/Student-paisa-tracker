
import React, { useState } from 'react';
import { MONTHS } from '../constants';
import { Budget } from '../types';

interface BudgetSetupProps {
  onSave: (budget: Partial<Budget>) => void;
}

const BudgetSetup: React.FC<BudgetSetupProps> = ({ onSave }) => {
  const [month, setMonth] = useState(MONTHS[new Date().getMonth()]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [income, setIncome] = useState('');
  const [rent, setRent] = useState('');
  const [savings, setSavings] = useState('');
  const [threshold, setThreshold] = useState('500'); // Default suggestion

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      month,
      year,
      totalIncome: Number(income),
      fixedRent: Number(rent),
      savingsGoal: Number(savings) || 0,
      lowBalanceThreshold: Number(threshold) || 0
    });
  };

  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Monthly Budget Setup</h2>
      <p className="text-slate-500 mb-8">Set your financial goals for the month.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Month</label>
            <select 
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            >
              {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Year</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Total Money Aaya (Allowance)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="e.g. 10000"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Fixed Rent</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
              <input
                type="number"
                value={rent}
                onChange={(e) => setRent(e.target.value)}
                className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="e.g. 4000"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Alert Threshold</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
              <input
                type="number"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="Low balance alert"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Savings Goal (Optional)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
            <input
              type="number"
              value={savings}
              onChange={(e) => setSavings(e.target.value)}
              className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="How much you want to save?"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-100 transition-all"
        >
          Activate Monthly Budget
        </button>
      </form>
    </div>
  );
};

export default BudgetSetup;
