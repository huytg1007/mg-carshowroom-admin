import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BannerTable from "@/components/tables/BannerTable";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Basic Table | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Basic Table  page for TailAdmin  Tailwind CSS Admin Dashboard Template",
  // other metadata
};

export default function BannerTablePage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Banner Table" />
      <div className="space-y-6">
        <BannerTable />
      </div>
    </div>
  );
}
