/**
 * Create Case Page - connected to store
 * Creates case → runs mock Metis → navigates to detail
 */

import React, { useState } from 'react';
import { SectionType } from '../../../types/case';
import { useCases } from '../hooks/useCases';
import { runMockMetisAnalysis } from '../../metis/mockMetisEngine';

interface Section {
  id: string;
  type: SectionType;
  customTitle?: string;
  content: string;
}

interface CreateCasePageProps {
  onCreated: (caseId: string) => void;
  onCancel: () => void;
}

const sectionLabels: Record<SectionType, string> = {
  timeline: 'خط زمانی وقایع',
  parties: 'طرفین و قراردادها',
  claims: 'ادعاها و خواسته‌ها',
  communications: 'مکاتبات و اخطارها',
  other: 'سایر',
  custom: 'بخش سفارشی',
};

export const CreateCasePage: React.FC<CreateCasePageProps> = ({ onCreated, onCancel }) => {
  const { create, setMetisResult } = useCases();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('حقوقی عمومی');
  const [freeText, setFreeText] = useState('');
  const [sections, setSections] = useState<Section[]>([]);
  const [analysisLevel, setAnalysisLevel] = useState<1 | 2 | 3 | 4>(3);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addSection = (type: SectionType) => {
    setSections([
      ...sections,
      {
        id: crypto.randomUUID(),
        type,
        content: '',
        customTitle: type === 'custom' ? 'بخش جدید' : undefined,
      },
    ]);
  };

  const updateSectionContent = (id: string, content: string) => {
    setSections(sections.map((s) => (s.id === id ? { ...s, content } : s)));
  };

  const handleSubmit = () => {
    if (!title.trim() && !freeText.trim()) {
      alert('حداقل عنوان یا شرح پرونده را وارد کنید.');
      return;
    }

    setIsSubmitting(true);

    const newCase = create({
      title: title.trim() || 'پرونده بدون عنوان',
      category,
      freeTextDescription: freeText,
      analysisLevel,
      sections: sections.map((s, idx) => ({
        id: s.id,
        caseId: '',
        sectionType: s.type,
        customTitle: s.customTitle,
        content: s.content,
        sortOrder: idx + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })),
    });

    const result = runMockMetisAnalysis(freeText, newCase.title, analysisLevel);
    setMetisResult(newCase.id, result);

    setTimeout(() => {
      setIsSubmitting(false);
      onCreated(newCase.id);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6" dir="rtl">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">تشکیل پرونده جدید</h1>
        <p className="text-sm text-gray-500 mb-6">
          شرح اولیه فقط نقطه شروع است. پس از ایجاد، پروتکل متیس اجرا می‌شود.
        </p>

        <div className="bg-white rounded-xl p-5 shadow-sm mb-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">عنوان پرونده</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثلاً مطالبه وجه قرارداد"
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">دسته پرونده</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            >
              <option>حقوقی عمومی</option>
              <option>حقوقی ملکی</option>
              <option>کیفری</option>
              <option>خانواده</option>
              <option>تجاری</option>
              <option>سایر</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm mb-4">
          <label className="block text-sm font-medium mb-3">سطح تحلیل اولیه</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setAnalysisLevel(level as 1 | 2 | 3 | 4)}
                className={`py-3 rounded-lg text-sm font-medium border-2 transition ${
                  analysisLevel === level
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                    : 'border-gray-200 bg-white'
                }`}
              >
                سطح {level}
                <div className="text-xs mt-1 opacity-70">
                  {level === 1 && 'سریع'}
                  {level === 2 && 'قضایی'}
                  {level === 3 && 'استاندارد'}
                  {level === 4 && 'مگا آنالیز'}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm mb-4">
          <label className="block text-sm font-medium mb-2">
            شرح پرونده (آزاد) – ظرفیت بسیار بالا
          </label>
          <textarea
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            placeholder="وقایع، تاریخ‌ها، طرفین، خواسته، اسناد موجود و دفاع احتمالی طرف مقابل را بنویسید..."
            className="w-full border rounded-lg px-3 py-3 text-sm min-h-[220px] resize-y"
            rows={12}
          />
          <p className="text-xs text-gray-400 mt-1">
            {freeText.length.toLocaleString('fa-IR')} نویسه
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm mb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
            <label className="text-sm font-medium">بخش‌های ساختاریافته (اختیاری)</label>
            <div className="flex flex-wrap gap-1">
              {(Object.keys(sectionLabels) as SectionType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => addSection(type)}
                  className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
                >
                  + {sectionLabels[type]}
                </button>
              ))}
            </div>
          </div>

          {sections.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">
              هنوز بخشی اضافه نشده. می‌توانید فقط از شرح آزاد استفاده کنید.
            </p>
          )}

          {sections.map((section) => (
            <div key={section.id} className="mb-4 border rounded-lg p-3">
              <div className="font-medium text-sm mb-2">
                {section.type === 'custom' ? section.customTitle : sectionLabels[section.type]}
              </div>
              <textarea
                value={section.content}
                onChange={(e) => updateSectionContent(section.id, e.target.value)}
                className="w-full border rounded px-2 py-2 text-sm min-h-[100px]"
                placeholder="محتوای این بخش را بنویسید..."
              />
            </div>
          ))}
        </div>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 border rounded-lg text-sm"
            disabled={isSubmitting}
          >
            انصراف
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-2.5 bg-emerald-700 text-white rounded-lg text-sm font-medium disabled:opacity-60"
          >
            {isSubmitting ? 'در حال ایجاد و تحلیل...' : 'ایجاد پرونده و شروع تحلیل متیس'}
          </button>
        </div>
      </div>
    </div>
  );
};
