/**
 * Temporary home page
 * Later this will redirect or show the real dashboard
 */

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6" dir="rtl">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-sm border p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">MEHR 4</h1>
        <p className="text-gray-500 mb-6">پلتفرم حقوقی هوشمند • پروتکل متیس</p>

        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="block w-full py-3 px-4 bg-emerald-700 text-white rounded-xl font-medium hover:bg-emerald-800 transition"
          >
            ورود به صفحه شخصی (داشبورد)
          </Link>

          <p className="text-sm text-gray-400 mt-6">
            نسخه فعلی: اسکلت اولیه + پشتیبانی از چند مدل (AI Gateway)
          </p>
        </div>
      </div>
    </div>
  );
}
