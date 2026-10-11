/**
 * React hook for Case Store
 */

import { useState, useEffect } from 'react';
import { caseStore, StoredCase } from '../store/caseStore';
import { CaseCardView } from '../../../types/case';

export function useCases() {
  const [cases, setCases] = useState<StoredCase[]>(() => caseStore.getAll());
  const [cards, setCards] = useState<CaseCardView[]>(() => caseStore.getCardViews());

  useEffect(() => {
    const unsubscribe = caseStore.subscribe(() => {
      setCases(caseStore.getAll());
      setCards(caseStore.getCardViews());
    });
    return unsubscribe;
  }, []);

  return {
    cases,
    cards,
    create: caseStore.create.bind(caseStore),
    update: caseStore.update.bind(caseStore),
    getById: caseStore.getById.bind(caseStore),
    addDocument: caseStore.addDocument.bind(caseStore),
    setMetisResult: caseStore.setMetisResult.bind(caseStore),
    setUserAnswers: caseStore.setUserAnswers.bind(caseStore),
    remove: caseStore.delete.bind(caseStore),
    clearAll: caseStore.clearAll.bind(caseStore),
  };
}
