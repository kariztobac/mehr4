import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MEHR 4 | پلتفرم حقوقی هوشمند",
  description: "پلتفرم حقوقی هوشمند ایران - پروتکل متیس",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className="antialiased bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}
