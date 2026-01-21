
import React, { useState, useRef } from 'react';
import { BorrowRecord, BorrowType, BorrowStatus } from '../types';
import toast from 'react-hot-toast';

interface BorrowTrackerProps {
  records: BorrowRecord[];
  onAdd: (record: Omit<BorrowRecord, 'id'>) => void;
  onUpdateStatus: (id: string, status: BorrowStatus) => void;
}

const BorrowTracker: React.FC<BorrowTrackerProps> = ({ records, onAdd, onUpdateStatus }) => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<BorrowType>(BorrowType.BORROWED);
  const [proof, setProof] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size must be under 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProof(reader.result as string);
        toast.success("Proof image attached!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount) {
      toast.error("Please fill required fields");
      return;
    }
    
    onAdd({
      userId: '1',
      personName: name,
      amount: Number(amount),
      type,
      status: BorrowStatus.PENDING,
      date: new Date().toISOString().split('T')[0],
      proofUrl: proof || undefined
    });
    
    setName('');
    setAmount('');
    setProof(null);
    setShowForm(false);
    toast.success("Udhaar record saved successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Udhaar Khata (Proof Based)</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all flex items-center gap-2"
        >
          {showForm ? 'Cancel' : 'Add Udhaar Entry'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Person Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                placeholder="Friend's Name"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Amount (₹)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                placeholder="0"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as BorrowType)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
              >
                <option value={BorrowType.BORROWED}>I Borrowed (Paisa Liya)</option>
                <option value={BorrowType.LENT}>I Lent (Paisa Diya)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Payment Proof (Screenshot)</label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-3 bg-slate-100 border border-dashed border-slate-300 rounded-xl text-slate-500 text-sm hover:bg-slate-200 transition-colors truncate"
                >
                  {proof ? 'Image Selected ✅' : 'Upload Proof (JPG/PNG)'}
                </button>
              </div>
            </div>
          </div>

          {proof && (
            <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200">
              <img src={proof} alt="Proof preview" className="w-full h-full object-cover" />
              <button 
                type="button" 
                onClick={() => setProof(null)}
                className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl-lg"
              >
                ×
              </button>
            </div>
          )}

          <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-all">
            Save Udhaar Entry
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4">
        {records.length === 0 ? (
          <div className="py-12 text-center text-slate-400 bg-white border border-dashed border-slate-200 rounded-2xl">
            No udhaar records found.
          </div>
        ) : (
          records.map(record => (
            <div key={record.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex gap-4 items-center">
                <div className={`p-3 rounded-xl ${record.type === BorrowType.BORROWED ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'}`}>
                  {record.type === BorrowType.BORROWED ? '↓' : '↑'}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{record.personName}</h4>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-slate-500">{record.date} • {record.type}</p>
                    {record.proofUrl && (
                      <span 
                        className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold cursor-pointer hover:bg-slate-200"
                        onClick={() => window.open(record.proofUrl, '_blank')}
                      >
                        VIEW PROOF
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-0 pt-4 md:pt-0">
                <div className="text-right">
                  <p className={`font-bold text-lg ${record.status === BorrowStatus.RETURNED ? 'text-slate-300 line-through' : 'text-slate-800'}`}>
                    ₹ {record.amount}
                  </p>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${record.status === BorrowStatus.RETURNED ? 'text-green-500' : 'text-amber-500'}`}>
                    {record.status}
                  </span>
                </div>
                {record.status === BorrowStatus.PENDING && (
                  <button 
                    onClick={() => {
                      onUpdateStatus(record.id, BorrowStatus.RETURNED);
                      toast.success(`Settled with ${record.personName}`);
                    }}
                    className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors"
                  >
                    Mark Settled
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BorrowTracker;
