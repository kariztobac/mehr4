/**
 * Mock Metis Engine - for initial testing only
 * This simulates the Metis protocol without real AI calls.
 * Later it will be replaced by the real AI Gateway Adapter (Airplane Principle).
 */

export interface MetisAnalysisResult {
  facts: string[];
  doubts: string[];
  missing: string[];
  summary: string;
  suggestedQuestions: string[];
  riskLevel: 'unknown' | 'low' | 'medium' | 'high';
  level: 1 | 2 | 3 | 4;
}

/**
 * Very simple rule-based mock that extracts some signals from free text.
 * This is ONLY for UI testing. Real Metis will use full case memory.
 */
export function runMockMetisAnalysis(
  freeText: string,
  title: string,
  level: 1 | 2 | 3 | 4 = 3
): MetisAnalysisResult {
  const text = (freeText || '').toLowerCase();

  const facts: string[] = [];
  const doubts: string[] = [];
  const missing: string[] = [];
  const suggestedQuestions: string[] = [];

  // Simple pattern matching for demo purposes
  if (text.includes('قرارداد') || text.includes('پیمان')) {
    facts.push('وجود قرارداد یا رابطه پیمانکاری در شرح پرونده ذکر شده است.');
  }
  if (text.includes('پرداخت') || text.includes('وجه') || text.includes('مبلغ')) {
    facts.push('اختلاف مالی یا مطالبه وجه در پرونده مطرح است.');
  }
  if (text.includes('تاریخ') || /\d{4}\/\d{1,2}\/\d{1,2}/.test(freeText)) {
    facts.push('اشاره به تاریخ یا زمان‌بندی در شرح وجود دارد.');
  }

  if (!text.includes('طرف') && !text.includes('خوانده') && !text.includes('خواهان')) {
    missing.push('طرفین دعوا (خواهان و خوانده) به‌صورت واضح مشخص نشده‌اند.');
    suggestedQuestions.push('نام کامل طرف مقابل و نقش او در پرونده چیست؟');
  }

  if (!text.includes('خواسته') && !text.includes('تقاضا') && !text.includes('الزام')) {
    missing.push('خواسته دقیق کاربر هنوز مشخص نیست.');
    suggestedQuestions.push('خواسته اصلی شما از دادگاه یا طرف مقابل دقیقاً چیست؟');
  }

  if (text.length < 200) {
    doubts.push('شرح پرونده نسبتاً کوتاه است و ممکن است جزئیات مهمی ذکر نشده باشد.');
    suggestedQuestions.push('آیا اسناد یا مکاتبات مهمی وجود دارد که هنوز شرح نداده‌اید؟');
  }

  if (facts.length === 0) {
    facts.push('شرح اولیه دریافت شد. نیاز به استخراج دقیق‌تر واقعیت‌ها وجود دارد.');
  }

  // Risk heuristic
  let riskLevel: MetisAnalysisResult['riskLevel'] = 'unknown';
  if (text.includes('کلاهبرداری') || text.includes('کیفری') || text.includes('شکایت')) {
    riskLevel = 'high';
  } else if (text.includes('مطالبه') || text.includes('وجه')) {
    riskLevel = 'medium';
  } else if (facts.length > 2) {
    riskLevel = 'low';
  }

  const summary = `
تحلیل اولیه سطح ${level} برای پرونده «${title || 'بدون عنوان'}» انجام شد.
تعداد واقعیت‌های استخراج‌شده: ${facts.length}
تعداد ابهامات: ${doubts.length}
موارد مفقود: ${missing.length}
  `.trim();

  return {
    facts,
    doubts,
    missing,
    summary,
    suggestedQuestions,
    riskLevel,
    level,
  };
}
