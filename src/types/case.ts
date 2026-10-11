/**
 * MEHR 4 - Case Module Types
 * Fully modular according to Airplane Principle
 * Date: 2026-10-10
 */

export type CaseStatus = 'draft' | 'in_progress' | 'ready' | 'high_risk' | 'closed';
export type RiskLevel = 'unknown' | 'low' | 'medium' | 'high';
export type SectionType = 'timeline' | 'parties' | 'claims' | 'communications' | 'other' | 'custom';
export type MetisRole = 'system' | 'user' | 'metis';
export type MessageType = 'question' | 'answer' | 'summary' | 'analysis' | 'note';

export interface Case {
  id: string;
  userId: string;
  title: string;
  category: string;
  status: CaseStatus;
  freeTextDescription: string;
  analysisLevel: 1 | 2 | 3 | 4;
  riskLevel: RiskLevel;
  createdAt: string;
  updatedAt: string;
  lastActivityAt: string;
}

export interface CaseSection {
  id: string;
  caseId: string;
  sectionType: SectionType;
  customTitle?: string;
  content: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CaseDocument {
  id: string;
  caseId: string;
  originalFilename: string;
  storagePath: string;
  fileHash: string;
  mimeType: string;
  title: string;
  subject: string;
  evidentiaryImpact: string;
  notes: string;
  uploadedAt: string;
}

export interface DocumentHighlight {
  id: string;
  documentId: string;
  startOffset: number;
  endOffset: number;
  selectedText: string;
  userNote: string;
  createdAt: string;
}

export interface MetisState {
  id: string;
  caseId: string;
  facts: string[];
  doubts: string[];
  missing: string[];
  currentLevel: 1 | 2 | 3 | 4;
  lastAnalysisAt: string;
  needsUserReview: boolean;
  updatedAt: string;
}

export interface MetisMessage {
  id: string;
  caseId: string;
  role: MetisRole;
  content: string;
  messageType: MessageType;
  createdAt: string;
}

export interface EvidenceMatrixItem {
  id: string;
  caseId: string;
  claim: string;
  existingEvidence: string;
  evidenceWeakness: string;
  opposingAttack: string;
  remediation: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CaseAuditLog {
  id: string;
  caseId: string;
  actor: 'user' | 'system' | 'metis';
  action: string;
  details: Record<string, unknown>;
  createdAt: string;
}

/** Combined view for Dashboard cards */
export interface CaseCardView {
  id: string;
  title: string;
  category: string;
  status: CaseStatus;
  riskLevel: RiskLevel;
  lastActivityAt: string;
  summarySnippet?: string;
}
