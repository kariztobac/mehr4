/**
 * CaseCard Component
 * Displays a single case in the personal dashboard
 * Color coding according to status (Airplane Principle: style is independent)
 */

import React from 'react';
import { CaseCardView, CaseStatus } from '../../../types/case';

interface CaseCardProps {
  caseData: CaseCardView;
  onClick?: (id: string) => void;
}

const statusColors: Record<CaseStatus, string> = {
  draft: 'bg-gray-100 border-gray-300 text-gray-700',
  in_progress: 'bg-yellow-50 border-yellow-400 text-yellow-800',
  ready: 'bg-green-50 border-green-400 text-green-800',
  high_risk: 'bg-red-50 border-red-400 text-red-800',
  closed: 'bg-gray-50 border-gray-400 text-gray-600',
};

const statusLabels: Record<CaseStatus, string> = {
  draft: 'پیش‌نویس',
  in_progress: 'در جریان',
  ready: 'تحلیل آماده',
  high_risk: 'پرریسک',
  closed: 'مختومه',
};

export const CaseCard: React.FC<CaseCardProps> = ({ caseData, onClick }) => {
  return (
    <div
      className={`rounded-xl border-2 p-4 cursor-pointer transition hover:shadow-md ${statusColors[caseData.status]}`}
      onClick={() => onClick?.(caseData.id)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-lg line-clamp-2">{caseData.title}</h3>
        <span className="text-xs px-2 py-1 rounded-full bg-white/70">
          {statusLabels[caseData.status]}
        </span>
      </div>
      <p className="text-sm opacity-80 mb-1">{caseData.category}</p>
      {caseData.summarySnippet && (
        <p className="text-sm line-clamp-2 opacity-70">{caseData.summarySnippet}</p>
      )}
      <p className="text-xs mt-3 opacity-60">
        آخرین فعالیت: {new Date(caseData.lastActivityAt).toLocaleDateString('fa-IR')}
      </p>
    </div>
  );
};
