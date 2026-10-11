/**
 * Case Store - In-memory + localStorage persistence
 * Modular and independent (Airplane Principle)
 * For demo / testing purposes before real backend
 */

import {
  Case,
  CaseSection,
  CaseDocument,
  CaseCardView,
  CaseStatus,
  RiskLevel,
} from '../../../types/case';
import { MetisAnalysisResult } from '../../metis/mockMetisEngine';

export interface StoredCase extends Case {
  sections: CaseSection[];
  documents: CaseDocument[];
  metisResult?: MetisAnalysisResult;
  userAnswers?: Record<string, string>;
}

const STORAGE_KEY = 'mehr4_cases_v1';

function loadFromStorage(): StoredCase[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as StoredCase[];
  } catch {
    return [];
  }
}

function saveToStorage(cases: StoredCase[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
  } catch (e) {
    console.warn('Failed to save cases to localStorage', e);
  }
}

let cases: StoredCase[] = loadFromStorage();
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
  saveToStorage(cases);
}

export const caseStore = {
  getAll(): StoredCase[] {
    return [...cases];
  },

  getById(id: string): StoredCase | undefined {
    return cases.find((c) => c.id === id);
  },

  getCardViews(): CaseCardView[] {
    return cases
      .map((c) => ({
        id: c.id,
        title: c.title,
        category: c.category,
        status: c.status,
        riskLevel: c.riskLevel,
        lastActivityAt: c.lastActivityAt,
        summarySnippet: c.freeTextDescription?.slice(0, 120) + (c.freeTextDescription?.length > 120 ? '...' : ''),
      }))
      .sort((a, b) => new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime());
  },

  create(data: {
    title: string;
    category: string;
    freeTextDescription: string;
    analysisLevel: 1 | 2 | 3 | 4;
    sections?: CaseSection[];
  }): StoredCase {
    const now = new Date().toISOString();
    const newCase: StoredCase = {
      id: crypto.randomUUID(),
      userId: 'demo-user',
      title: data.title || 'پرونده بدون عنوان',
      category: data.category || 'حقوقی عمومی',
      status: 'in_progress',
      freeTextDescription: data.freeTextDescription || '',
      analysisLevel: data.analysisLevel || 3,
      riskLevel: 'unknown',
      createdAt: now,
      updatedAt: now,
      lastActivityAt: now,
      sections: data.sections || [],
      documents: [],
      userAnswers: {},
    };
    cases = [newCase, ...cases];
    notify();
    return newCase;
  },

  update(id: string, patch: Partial<StoredCase>) {
    cases = cases.map((c) =>
      c.id === id
        ? { ...c, ...patch, updatedAt: new Date().toISOString(), lastActivityAt: new Date().toISOString() }
        : c
    );
    notify();
  },

  addDocument(caseId: string, doc: Omit<CaseDocument, 'id' | 'caseId' | 'uploadedAt'>) {
    const fullDoc: CaseDocument = {
      ...doc,
      id: crypto.randomUUID(),
      caseId,
      uploadedAt: new Date().toISOString(),
    };
    cases = cases.map((c) =>
      c.id === caseId
        ? {
            ...c,
            documents: [...c.documents, fullDoc],
            updatedAt: new Date().toISOString(),
            lastActivityAt: new Date().toISOString(),
          }
        : c
    );
    notify();
    return fullDoc;
  },

  setMetisResult(caseId: string, result: MetisAnalysisResult) {
    this.update(caseId, {
      metisResult: result,
      riskLevel: result.riskLevel as RiskLevel,
      status: result.missing.length > 0 ? 'in_progress' : 'ready',
    });
  },

  setUserAnswers(caseId: string, answers: Record<string, string>) {
    this.update(caseId, { userAnswers: answers });
  },

  delete(id: string) {
    cases = cases.filter((c) => c.id !== id);
    notify();
  },

  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  // For testing: clear all
  clearAll() {
    cases = [];
    notify();
  },
};
