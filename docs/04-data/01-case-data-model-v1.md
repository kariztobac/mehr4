# Case Data Model V1
**Project:** MEHR 4  
**Date:** 2026-10-10  
**Status:** Approved for Implementation  
**Principle:** Airplane Principle (هر موجودیت کاملاً مستقل و قابل تعویض)

---

## 1. اصول طراحی مدل داده

- هر موجودیت مسئولیت واحد دارد.
- روابط فقط از طریق کلید خارجی و Interface برقرار می‌شود.
- هیچ موجودیتی جزئیات داخلی موجودیت دیگر را نمی‌شناسد.
- تمام فیلدهای مهم دارای created_at و updated_at هستند.
- Soft Delete در صورت نیاز در آینده اضافه می‌شود (فعلاً Hard Delete ساده).
- تمام متن‌های طولانی از نوع TEXT یا JSONB استفاده می‌کنند.

---

## 2. موجودیت‌های اصلی

### 2.1 Case (پرونده)
هسته اصلی. هر پرونده یک رکورد مستقل است.

| فیلد                    | نوع              | توضیح |
|-------------------------|------------------|-------|
| id                      | UUID (PK)        | شناسه یکتا |
| user_id                 | UUID (FK)        | صاحب پرونده (فعلاً mock) |
| title                   | VARCHAR(300)     | عنوان پرونده |
| category                | VARCHAR(100)     | دسته (حقوقی عمومی، کیفری، خانواده و ...) |
| status                  | ENUM             | draft / in_progress / ready / high_risk / closed |
| free_text_description   | TEXT             | شرح آزاد (ظرفیت بسیار بالا) |
| analysis_level          | SMALLINT         | سطح تحلیل متیس (1 تا 4) – پیش‌فرض 3 |
| risk_level              | VARCHAR(20)      | unknown / low / medium / high |
| created_at              | TIMESTAMPTZ      | |
| updated_at              | TIMESTAMPTZ      | |
| last_activity_at        | TIMESTAMPTZ      | آخرین فعالیت |

### 2.2 CaseSection (بخش‌های ساختاریافته)
هر بخش کاملاً مستقل است.

| فیلد            | نوع          | توضیح |
|-----------------|--------------|-------|
| id              | UUID (PK)    | |
| case_id         | UUID (FK)    | |
| section_type    | VARCHAR(50)  | timeline / parties / claims / communications / other / custom |
| custom_title    | VARCHAR(200) | فقط برای نوع custom |
| content         | TEXT         | محتوای بخش |
| sort_order      | INTEGER      | ترتیب نمایش |
| created_at      | TIMESTAMPTZ  | |
| updated_at      | TIMESTAMPTZ  | |

### 2.3 CaseDocument (مدارک)
| فیلد                | نوع          | توضیح |
|---------------------|--------------|-------|
| id                  | UUID (PK)    | |
| case_id             | UUID (FK)    | |
| original_filename   | VARCHAR(500) | |
| storage_path        | VARCHAR(1000)| مسیر فایل (Interface ذخیره‌سازی) |
| file_hash           | VARCHAR(128) | برای یکتایی و امنیت |
| mime_type           | VARCHAR(100) | |
| title               | VARCHAR(300) | نام مدرک که کاربر می‌دهد |
| subject             | TEXT         | موضوع مدرک |
| evidentiary_impact  | TEXT         | تأثیر اثباتی |
| notes               | TEXT         | توضیحات مهم |
| uploaded_at         | TIMESTAMPTZ  | |

### 2.4 DocumentHighlight (هایلایت بخش‌های مهم)
| فیلد            | نوع         | توضیح |
|-----------------|-------------|-------|
| id              | UUID (PK)   | |
| document_id     | UUID (FK)   | |
| start_offset    | INTEGER     | شروع متن هایلایت‌شده |
| end_offset      | INTEGER     | پایان متن |
| selected_text   | TEXT        | متن انتخاب‌شده |
| user_note       | TEXT        | یادداشت کاربر روی هایلایت |
| created_at      | TIMESTAMPTZ | |

### 2.5 MetisState (وضعیت فعلی تحلیل متیس)
| فیلد                | نوع         | توضیح |
|---------------------|-------------|-------|
| id                  | UUID (PK)   | |
| case_id             | UUID (FK)   | یک به یک با Case |
| facts               | JSONB       | لیست واقعیت‌های استخراج‌شده |
| doubts              | JSONB       | ابهامات |
| missing             | JSONB       | اطلاعات مفقود |
| current_level       | SMALLINT    | سطح تحلیل فعال |
| last_analysis_at    | TIMESTAMPTZ | |
| needs_user_review   | BOOLEAN     | آیا نیاز به بازبینی کاربر دارد؟ |
| updated_at          | TIMESTAMPTZ | |

### 2.6 MetisMessage (تاریخچه پرسش و پاسخ)
| فیلد            | نوع         | توضیح |
|-----------------|-------------|-------|
| id              | UUID (PK)   | |
| case_id         | UUID (FK)   | |
| role            | VARCHAR(20) | system / user / metis |
| content         | TEXT        | |
| message_type    | VARCHAR(50) | question / answer / summary / analysis / note |
| created_at      | TIMESTAMPTZ | |

### 2.7 EvidenceMatrixItem (ماتریس ادله)
| فیلد                  | نوع         | توضیح |
|-----------------------|-------------|-------|
| id                    | UUID (PK)   | |
| case_id               | UUID (FK)   | |
| claim                 | TEXT        | ادعا |
| existing_evidence     | TEXT        | دلیل موجود |
| evidence_weakness     | TEXT        | نقطه ضعف دلیل |
| opposing_attack       | TEXT        | حمله طرف مقابل |
| remediation           | TEXT        | راه ترمیم |
| sort_order            | INTEGER     | |
| created_at            | TIMESTAMPTZ | |
| updated_at            | TIMESTAMPTZ | |

### 2.8 CaseAuditLog
| فیلد            | نوع         | توضیح |
|-----------------|-------------|-------|
| id              | UUID (PK)   | |
| case_id         | UUID (FK)   | |
| actor           | VARCHAR(50) | user / system / metis |
| action          | VARCHAR(100)| |
| details         | JSONB       | |
| created_at      | TIMESTAMPTZ | |

---

## 3. روابط (فقط از طریق Interface)

- Case 1 ─── * CaseSection
- Case 1 ─── * CaseDocument
- CaseDocument 1 ─── * DocumentHighlight
- Case 1 ─── 1 MetisState
- Case 1 ─── * MetisMessage
- Case 1 ─── * EvidenceMatrixItem
- Case 1 ─── * CaseAuditLog

هیچ رابطه دوطرفه یا وابستگی محکمی وجود ندارد.

---

## 4. نکات پیاده‌سازی

- در فاز فعلی از PostgreSQL استفاده می‌شود.
- تمام UUIDها از نوع gen_random_uuid() تولید می‌شوند.
- فیلدهای JSONB برای انعطاف‌پذیری آینده (مخصوصاً facts/doubts/missing) طراحی شده‌اند.
- Interface ذخیره‌سازی فایل جدا است تا بتوان بعداً به S3 یا هر سیستم دیگری مهاجرت کرد.

---

**وضعیت:** این مدل داده آماده پیاده‌سازی است و با اصل Airplane Principle کاملاً سازگار می‌باشد.
