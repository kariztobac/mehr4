/**
 * Personal Dashboard - connected to Case Store + localStorage
 */

import React from 'react';
import { CaseCard } from '../components/CaseCard';
import { useCases } from '../hooks/useCases';

interface PersonalDashboardProps {
  onCreateNew: () => void;
  onOpenCase: (id: string) => void;
}

export const PersonalDashboard: React.FC<PersonalDashboardProps> = ({
  onCreateNew,
  onOpenCase,
}) => {
  const { cards, cases } = useCases();

  const stats = {
    total: cases.length,
    ready: cases.filter((c) => c.status === 'ready').length,
    highRisk: cases.filter((c) => c.status === 'high_risk' || c.riskLevel === 'high').length,
    documents: cases.reduce((sum, c) => sum + (c.documents?.length || 0), 0),
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6" dir="rtl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">پرونده‌های من</h1>
        <div className="flex gap-2">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-white border rounded-lg text-sm hover:bg-gray-50"
          >
            تازه‌سازی
          </button>
          <button
            onClick={onCreateNew}
            className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-sm font-medium hover:bg-emerald-800"
          >
            + تشکیل پرونده جدید
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
          <div className="text-sm text-gray-500">پرونده‌ها</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <div className="text-2xl font-bold text-emerald-600">{stats.ready}</div>
          <div className="text-sm text-gray-500">تحلیل آماده</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <div className="text-2xl font-bold text-red-600">{stats.highRisk}</div>
          <div className="text-sm text-gray-500">پرریسک</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.documents}</div>
          <div className="text-sm text-gray-500">سند ثبت‌شده</div>
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-4 text-gray-700">آخرین پرونده‌ها</h2>

      {cards.length === 0 ? (
        <div className="bg-white rounded-xl p-10 text-center shadow-sm">
          <p className="text-gray-500 mb-4">هنوز پرونده‌ای ثبت نشده است.</p>
          <button
            onClick={onCreateNew}
            className="px-5 py-2.5 bg-emerald-700 text-white rounded-lg text-sm font-medium"
          >
            تشکیل اولین پرونده
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((c) => (
            <CaseCard key={c.id} caseData={c} onClick={onOpenCase} />
          ))}
        </div>
      )}
    </div>
  );
};
