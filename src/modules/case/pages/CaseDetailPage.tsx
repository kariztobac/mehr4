/**
 * Case Detail Page - Fully connected to Case Store
 * Supports real document upload, persistent answers, matrix, and Metis state
 */

import React, { useState, useEffect, useRef } from 'react';
import { useCases } from '../hooks/useCases';
import { runMockMetisAnalysis, MetisAnalysisResult } from '../../metis/mockMetisEngine';
import { EvidenceMatrixItem, CaseDocument } from '../../../types/case';
import { StoredCase } from '../store/caseStore';

type TabId =
  | 'summary'
  | 'documents'
  | 'matrix'
  | 'analysis'
  | 'qa'
  | 'actions'
  | 'history';

interface CaseDetailPageProps {
  caseId: string;
  onBack: () => void;
}

const TABS: { id: TabId; label: string }[] = [
  { id: 'summary', label: 'خلاصه پرونده' },
  { id: 'documents', label: 'ادله و اسناد' },
  { id: 'matrix', label: 'ماتریس ادله' },
  { id: 'analysis', label: 'تحلیل متیس' },
  { id: 'qa', label: 'پرسش و پاسخ' },
  { id: 'actions', label: 'خروجی و اقدام' },
  { id: 'history', label: 'تاریخچه' },
];

export const CaseDetailPage: React.FC<CaseDetailPageProps> = ({ caseId, onBack }) => {
  const { getById, update, addDocument, setMetisResult, setUserAnswers } = useCases();
  const [activeTab, setActiveTab] = useState<TabId>('summary');
  const [caseData, setCaseData] = useState<StoredCase | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [localAnswers, setLocalAnswers] = useState<Record<string, string>>({});
  const [matrixItems, setMatrixItems] = useState<EvidenceMatrixItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load case from store
  useEffect(() => {
    const data = getById(caseId);
    if (data) {
      setCaseData(data);
      setLocalAnswers(data.userAnswers || {});
      // Restore matrix if we later store it; for now keep local
    }
  }, [caseId, getById]);

  // If no metisResult yet, run analysis once
  useEffect(() => {
    if (!caseData) return;
    if (caseData.metisResult) return;

    setIsAnalyzing(true);
    const timer = setTimeout(() => {
      const result = runMockMetisAnalysis(
        caseData.freeTextDescription || '',
        caseData.title || '',
        caseData.analysisLevel || 3
      );
      setMetisResult(caseId, result);
      // Refresh local state
      const updated = getById(caseId);
      if (updated) setCaseData(updated);
      setIsAnalyzing(false);
    }, 900);
    return () => clearTimeout(timer);
  }, [caseData, caseId, setMetisResult, getById]);

  const metisResult: MetisAnalysisResult | undefined = caseData?.metisResult;

  const handleAnswerChange = (question: string, answer: string) => {
    setLocalAnswers((prev) => ({ ...prev, [question]: answer }));
  };

  const saveAnswers = () => {
    setUserAnswers(caseId, localAnswers);
    alert('پاسخ‌ها ذخیره شد.');
  };

  // ----- Document Upload -----
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    for (const file of Array.from(files)) {
      // Read as base64 for demo persistence (in real app → upload to storage)
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const title = prompt(`نام مدرک برای «${file.name}»:`, file.name) || file.name;
      const subject = prompt('موضوع مدرک:', '') || '';
      const evidentiaryImpact = prompt('تأثیر اثباتی این مدرک چیست؟', '') || '';
      const notes = prompt('توضیحات مهم (اختیاری):', '') || '';

      addDocument(caseId, {
        originalFilename: file.name,
        storagePath: base64, // demo: store base64. Later → real storage path
        fileHash: `${file.name}-${file.size}-${file.lastModified}`,
        mimeType: file.type || 'application/octet-stream',
        title,
        subject,
        evidentiaryImpact,
        notes,
      });
    }

    // Refresh
    const updated = getById(caseId);
    if (updated) setCaseData(updated);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const addMatrixRow = () => {
    setMatrixItems([
      ...matrixItems,
      {
        id: crypto.randomUUID(),
        caseId,
        claim: '',
        existingEvidence: '',
        evidenceWeakness: '',
        opposingAttack: '',
        remediation: '',
        sortOrder: matrixItems.length + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);
  };

  if (!caseData) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <p className="text-gray-500 mb-4">پرونده یافت نشد.</p>
          <button onClick={onBack} className="px-4 py-2 bg-emerald-700 text-white rounded-lg">
            بازگشت به داشبورد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <h1 className="text-xl font-bold text-gray-800 line-clamp-1">{caseData.title}</h1>
            <p className="text-sm text-gray-500">
              {caseData.category} • سطح تحلیل: {caseData.analysisLevel} • وضعیت: {caseData.status}
            </p>
          </div>
          <div className="flex gap-2 items-center">
            {metisResult && (
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${
                  metisResult.riskLevel === 'high'
                    ? 'bg-red-100 text-red-700'
                    : metisResult.riskLevel === 'medium'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                ریسک: {metisResult.riskLevel}
              </span>
            )}
            <button onClick={onBack} className="text-sm px-3 py-1.5 border rounded-lg hover:bg-gray-50">
              بازگشت
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b overflow-x-auto">
        <div className="max-w-5xl mx-auto flex gap-1 px-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm whitespace-nowrap border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-emerald-600 text-emerald-700 font-medium'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto p-4 md:p-6">
        {/* SUMMARY */}
        {activeTab === 'summary' && (
          <div className="space-y-4">
            {isAnalyzing ? (
              <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                <div className="animate-pulse text-emerald-600 font-medium">
                  در حال اجرای پروتکل متیس...
                </div>
              </div>
            ) : metisResult ? (
              <>
                <div className="bg-white rounded-xl p-5 shadow-sm">
                  <h3 className="font-bold text-emerald-700 mb-3">واقعیت‌ها (Fact)</h3>
                  <ul className="space-y-2 text-sm">
                    {metisResult.facts.map((f, i) => (
                      <li key={i} className="bg-emerald-50 rounded-lg px-3 py-2">{f}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-xl p-5 shadow-sm">
                  <h3 className="font-bold text-yellow-700 mb-3">ابهامات (Doubt)</h3>
                  {metisResult.doubts.length === 0 ? (
                    <p className="text-sm text-gray-400">ابهام خاصی شناسایی نشد.</p>
                  ) : (
                    <ul className="space-y-2 text-sm">
                      {metisResult.doubts.map((d, i) => (
                        <li key={i} className="bg-yellow-50 rounded-lg px-3 py-2">{d}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="bg-white rounded-xl p-5 shadow-sm">
                  <h3 className="font-bold text-red-700 mb-3">موارد مفقود (Missing)</h3>
                  {metisResult.missing.length === 0 ? (
                    <p className="text-sm text-gray-400">مورد مفقودی شناسایی نشد.</p>
                  ) : (
                    <ul className="space-y-2 text-sm">
                      {metisResult.missing.map((m, i) => (
                        <li key={i} className="bg-red-50 rounded-lg px-3 py-2">{m}</li>
                      ))}
                    </ul>
                  )}
                </div>

                {metisResult.suggestedQuestions.length > 0 && (
                  <div className="bg-white rounded-xl p-5 shadow-sm">
                    <h3 className="font-bold text-blue-700 mb-3">پرسش‌های تکمیلی متیس</h3>
                    <div className="space-y-4">
                      {metisResult.suggestedQuestions.map((q, i) => (
                        <div key={i}>
                          <p className="text-sm font-medium mb-1">{q}</p>
                          <textarea
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                            rows={2}
                            placeholder="پاسخ خود را بنویسید..."
                            value={localAnswers[q] || ''}
                            onChange={(e) => handleAnswerChange(q, e.target.value)}
                          />
                        </div>
                      ))}
                      <button
                        onClick={saveAnswers}
                        className="mt-2 px-4 py-2 bg-emerald-700 text-white rounded-lg text-sm"
                      >
                        ذخیره پاسخ‌ها
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-400">در حال آماده‌سازی تحلیل...</p>
            )}
          </div>
        )}

        {/* DOCUMENTS */}
        {activeTab === 'documents' && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">ادله و اسناد ({caseData.documents?.length || 0})</h3>
              <div>
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.webp"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="text-sm px-3 py-1.5 bg-emerald-700 text-white rounded-lg disabled:opacity-60"
                >
                  {uploading ? 'در حال آپلود...' : '+ آپلود مدرک'}
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              می‌توانید چند فایل را همزمان انتخاب کنید. برای هر فایل نام، موضوع، تأثیر اثباتی و توضیحات پرسیده می‌شود.
            </p>

            {(caseData.documents?.length || 0) === 0 ? (
              <div className="border-2 border-dashed rounded-xl p-8 text-center text-gray-400">
                هنوز مدرکی آپلود نشده است.
              </div>
            ) : (
              <div className="space-y-3">
                {caseData.documents.map((doc: CaseDocument) => (
                  <div key={doc.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="font-medium text-sm">{doc.title}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      فایل اصلی: {doc.originalFilename} • {doc.mimeType}
                    </div>
                    {doc.subject && (
                      <div className="text-sm mt-2">
                        <span className="font-medium">موضوع:</span> {doc.subject}
                      </div>
                    )}
                    {doc.evidentiaryImpact && (
                      <div className="text-sm mt-1">
                        <span className="font-medium">تأثیر اثباتی:</span> {doc.evidentiaryImpact}
                      </div>
                    )}
                    {doc.notes && (
                      <div className="text-sm mt-1 text-gray-600">{doc.notes}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MATRIX */}
        {activeTab === 'matrix' && (
          <div className="bg-white rounded-xl p-6 shadow-sm overflow-x-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">ماتریس ادله</h3>
              <button
                onClick={addMatrixRow}
                className="text-sm px-3 py-1.5 bg-emerald-700 text-white rounded-lg"
              >
                + ردیف جدید
              </button>
            </div>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50 text-right">
                  <th className="border p-2">ادعا</th>
                  <th className="border p-2">دلیل موجود</th>
                  <th className="border p-2">نقطه ضعف</th>
                  <th className="border p-2">حمله طرف مقابل</th>
                  <th className="border p-2">راه ترمیم</th>
                </tr>
              </thead>
              <tbody>
                {matrixItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="border p-4 text-center text-gray-400">
                      هنوز ردیفی اضافه نشده.
                    </td>
                  </tr>
                ) : (
                  matrixItems.map((item) => (
                    <tr key={item.id}>
                      <td className="border p-1">
                        <textarea className="w-full text-sm p-1" rows={2} defaultValue={item.claim} />
                      </td>
                      <td className="border p-1">
                        <textarea className="w-full text-sm p-1" rows={2} defaultValue={item.existingEvidence} />
                      </td>
                      <td className="border p-1">
                        <textarea className="w-full text-sm p-1" rows={2} defaultValue={item.evidenceWeakness} />
                      </td>
                      <td className="border p-1">
                        <textarea className="w-full text-sm p-1" rows={2} defaultValue={item.opposingAttack} />
                      </td>
                      <td className="border p-1">
                        <textarea className="w-full text-sm p-1" rows={2} defaultValue={item.remediation} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ANALYSIS */}
        {activeTab === 'analysis' && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold mb-3">تحلیل متیس</h3>
            {metisResult ? (
              <div className="space-y-3 text-sm">
                <p className="bg-gray-50 rounded-lg p-3 whitespace-pre-wrap">{metisResult.summary}</p>
                <p className="text-gray-500">
                  این خروجی نسخه Mock است. در نسخه واقعی بر اساس کل حافظه پرونده تحلیل می‌شود.
                </p>
              </div>
            ) : (
              <p className="text-gray-400">هنوز تحلیلی انجام نشده است.</p>
            )}
          </div>
        )}

        {/* Q&A */}
        {activeTab === 'qa' && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold mb-4">پرسش و پاسخ با متیس</h3>
            <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
              {metisResult?.suggestedQuestions?.map((q, i) => (
                <div key={i} className="space-y-1">
                  <div className="bg-blue-50 rounded-lg px-3 py-2 text-sm">
                    <span className="font-medium text-blue-700">متیس: </span>
                    {q}
                  </div>
                  {localAnswers[q] && (
                    <div className="bg-emerald-50 rounded-lg px-3 py-2 text-sm mr-4">
                      <span className="font-medium text-emerald-700">شما: </span>
                      {localAnswers[q]}
                    </div>
                  )}
                </div>
              ))}
              {(!metisResult || metisResult.suggestedQuestions.length === 0) && (
                <p className="text-gray-400 text-sm">هنوز گفتگویی آغاز نشده است.</p>
              )}
            </div>
          </div>
        )}

        {/* ACTIONS */}
        {activeTab === 'actions' && (
          <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold">خروجی و اقدام</h3>
            <p className="text-sm text-gray-500">
              در نسخه‌های بعدی: پیشنهاد خواسته‌ها، پیش‌نویس لایحه و برنامه اجرایی اینجا نمایش داده می‌شود.
            </p>
            <div className="border rounded-lg p-4 bg-gray-50 text-sm text-gray-400">
              هنوز خروجی اجرایی تولید نشده است.
            </div>
          </div>
        )}

        {/* HISTORY */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-bold mb-3">تاریخچه</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between border-b pb-2">
                <span>ایجاد پرونده</span>
                <span className="text-gray-400">
                  {new Date(caseData.createdAt).toLocaleString('fa-IR')}
                </span>
              </li>
              {metisResult && (
                <li className="flex justify-between border-b pb-2">
                  <span>اجرای پروتکل متیس</span>
                  <span className="text-gray-400">انجام شده</span>
                </li>
              )}
              <li className="flex justify-between border-b pb-2">
                <span>تعداد مدارک</span>
                <span className="text-gray-400">{caseData.documents?.length || 0}</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
