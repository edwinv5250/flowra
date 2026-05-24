import { notFound } from "next/navigation"

import { DashboardLayout } from "@/components/dashboard-layout"
import { InvoiceDetail } from "@/features/invoices/invoice-detail"
import { getInvoiceById } from "@/features/invoices/invoice-queries"
import { getSidebarProfile } from "@/features/profile/profile-queries"

type InvoiceDetailPageProps = {
  params: Promise<{
    invoiceId: string
  }>
}

export default async function InvoiceDetailPage({ params }: InvoiceDetailPageProps) {
  const { invoiceId } = await params
  const [invoice, sidebarProfile] = await Promise.all([
    getInvoiceById(invoiceId),
    getSidebarProfile(),
  ])

  if (!invoice) {
    notFound()
  }

  return (
    <DashboardLayout currentPage="finance" profile={sidebarProfile}>
      <InvoiceDetail invoice={invoice} />
    </DashboardLayout>
  )
}
