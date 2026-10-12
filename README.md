# MEHR 4

**پلتفرم حقوقی هوشمند ایران**  
Modular Monolith • PWA-First • Metis Protocol

## وضعیت فعلی (اکتبر ۲۰۲۶)

- نام موقت: **MEHR 4**
- هسته فعال: پروتکل متیس (Metis Consortium Protocol)
- معماری: Modular Monolith (Next.js 15 + TypeScript + Tailwind)
- اصل کلیدی: **Airplane Principle** (استقلال کامل ماژول‌ها)
- AI Gateway: آماده برای چند مدل (فعلاً فقط Grok فعال)

## ساختار پروژه

```
mehr4/
├── app/                    # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── dashboard/page.tsx
├── src/
│   ├── modules/
│   │   ├── case/           # ماژول پرونده (فعال)
│   │   ├── metis/          # موتور متیس (Mock فعلی)
│   │   └── ai-gateway/     # دروازه هوش مصنوعی (Multi-provider ready)
│   └── types/
├── docs/                   # مستندات پروژه
├── package.json
├── tsconfig.json
├── next.config.ts
└── tailwind.config.ts
```

## اجرای محلی (برای تست)

```bash
# ۱. نصب وابستگی‌ها
npm install

# ۲. اجرای حالت توسعه
npm run dev
```

سپس مرورگر را باز کنید: [http://localhost:3000](http://localhost:3000)

- صفحه اصلی → لینک به داشبورد
- `/dashboard` → جریان کامل کاربر عادی (تشکیل پرونده، متیس، آپلود مدارک و ...)

## نکات مهم معماری

- **Airplane Principle**: هر ماژول مستقل و قابل تعویض است.
- **AI Gateway**: تمام فراخوانی‌های هوش مصنوعی از یک نقطه عبور می‌کنند تا بعداً بتوان مدل را عوض کرد.
- **Case Memory**: هر پاسخ سیستم باید بر اساس کل سابقه پرونده باشد (تحلیل ایزوله ممنوع).
- سطوح کاربری آینده از الان در معماری جا دارند ولی غیرفعال هستند.

## اولویت فعلی

تجربه کامل پروتکل متیس برای کاربر عادی + تست جریان تشکیل پرونده و تحلیل.

---

**Owner:** kariztobac  
**Last update:** 2026-10-12
