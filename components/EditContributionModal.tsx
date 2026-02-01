'use client'

import React, { useState } from 'react'
import { X, Save, Loader2 } from 'lucide-react'
import { Button } from "./ui/button"
import { Input } from "./ui/input"

interface EditProps {
  isOpen: boolean;
  onClose: () => void;
  contribution: any;
}

export default function EditContributionModal({ isOpen, onClose, contribution }: EditProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !contribution) return null;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulating API call
    setTimeout(() => {
      setLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-50">
          <div>
            <h3 className="text-18 font-black text-blue-900 uppercase tracking-tight">Kemaskini Rekod</h3>
            <p className="text-11 text-gray-400 font-mono mt-1">ID: {contribution.$id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleUpdate} className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-11 font-bold text-gray-500 uppercase tracking-widest">Nama Penyumbang</label>
            <Input 
              defaultValue={contribution.namaPenyumbang} 
              className="h-11 border-gray-200 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-11 font-bold text-gray-500 uppercase tracking-widest">Jumlah (RM)</label>
              <Input 
                type="number" 
                defaultValue={contribution.jumlah} 
                className="h-11 border-gray-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-11 font-bold text-gray-500 uppercase tracking-widest">Tarikh</label>
              <Input 
                type="date" 
                defaultValue={contribution.tarikhMasuk ? new Date(contribution.tarikhMasuk).toISOString().split('T')[0] : ''} 
                className="h-11 border-gray-200"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onClose} 
              className="flex-1 font-bold text-gray-400 hover:text-gray-600"
            >
              Batal
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 rounded-xl shadow-lg shadow-blue-200 flex gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              Kemaskini
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}