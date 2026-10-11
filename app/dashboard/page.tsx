"use client";

/**
 * Dashboard entry point
 * Currently renders the DemoApp which contains the full case flow
 * Later this will be replaced with proper authenticated layout
 */

import { DemoApp } from "@/src/modules/case/pages/DemoApp";

export default function DashboardPage() {
  return <DemoApp />;
}
