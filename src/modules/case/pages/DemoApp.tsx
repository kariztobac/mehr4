/**
 * DemoApp - Main entry for testing
 * Manages navigation between Dashboard / Create / Detail
 * State is persisted in localStorage via caseStore
 */

import React, { useState } from 'react';
import { PersonalDashboard } from './PersonalDashboard';
import { CreateCasePage } from './CreateCasePage';
import { CaseDetailPage } from './CaseDetailPage';

type View = 'dashboard' | 'create' | 'detail';

export const DemoApp: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null);

  const goToDashboard = () => {
    setView('dashboard');
    setActiveCaseId(null);
  };

  const goToCreate = () => {
    setView('create');
  };

  const handleCreated = (caseId: string) => {
    setActiveCaseId(caseId);
    setView('detail');
  };

  const handleOpenCase = (id: string) => {
    setActiveCaseId(id);
    setView('detail');
  };

  return (
    <div className="min-h-screen">
      {/* Top navigation bar for testing */}
      <div
        className="bg-gray-900 text-white text-sm px-4 py-2 flex flex-wrap gap-4 items-center sticky top-0 z-30"
        dir="rtl"
      >
        <span className="font-bold text-emerald-400">MEHR 4 – تست</span>
        <button
          onClick={goToDashboard}
          className={view === 'dashboard' ? 'underline font-bold text-white' : 'text-gray-300 hover:text-white'}
        >
          صفحه شخصی
        </button>
        <button
          onClick={goToCreate}
          className={view === 'create' ? 'underline font-bold text-white' : 'text-gray-300 hover:text-white'}
        >
          تشکیل پرونده
        </button>
        {activeCaseId && (
          <button
            onClick={() => setView('detail')}
            className={view === 'detail' ? 'underline font-bold text-white' : 'text-gray-300 hover:text-white'}
          >
            جزئیات پرونده
          </button>
        )}
      </div>

      {view === 'dashboard' && (
        <PersonalDashboard onCreateNew={goToCreate} onOpenCase={handleOpenCase} />
      )}

      {view === 'create' && (
        <CreateCasePage onCreated={handleCreated} onCancel={goToDashboard} />
      )}

      {view === 'detail' && activeCaseId && (
        <CaseDetailPage caseId={activeCaseId} onBack={goToDashboard} />
      )}
    </div>
  );
};
