import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import NewsTable from "@/components/tables/NewsTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Basic Table | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Basic Table  page for TailAdmin  Tailwind CSS Admin Dashboard Template",
  // other metadata
};

export default function NewsTablePage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="News Table" />
      <div className="space-y-6">
        <NewsTable />
      </div>
    </div>
  );
}
