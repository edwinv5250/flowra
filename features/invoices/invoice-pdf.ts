import { PDFDocument, type PDFPage, StandardFonts, rgb } from "pdf-lib"

import { getInvoiceStatusLabel } from "@/features/invoices/invoice-options"
import type { InvoiceWithCampaign } from "@/features/invoices/invoice-types"

type InvoicePdfInput = {
  creatorEmail?: string | null
  creatorHandle?: string | null
  creatorName: string
  invoice: InvoiceWithCampaign
}

const pageWidth = 595
const pageHeight = 842
const margin = 56
const contentWidth = pageWidth - margin * 2

export async function createInvoicePdf({
  creatorEmail,
  creatorHandle,
  creatorName,
  invoice,
}: InvoicePdfInput) {
  const pdf = await PDFDocument.create()
  const page = pdf.addPage([pageWidth, pageHeight])
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold)

  let y = pageHeight - margin

  page.drawRectangle({
    x: margin,
    y: y - 8,
    width: 30,
    height: 30,
    color: rgb(0.08, 0.09, 0.11),
  })
  page.drawText("F", {
    x: margin + 10,
    y: y + 1,
    size: 16,
    font: boldFont,
    color: rgb(1, 1, 1),
  })
  page.drawText("Flowra", {
    x: margin + 42,
    y: y + 9,
    size: 16,
    font: boldFont,
    color: rgb(0.08, 0.09, 0.11),
  })
  page.drawText("Creator Management", {
    x: margin + 42,
    y: y - 8,
    size: 9,
    font,
    color: rgb(0.38, 0.42, 0.48),
  })

  y -= 48

  page.drawText(creatorName, {
    x: margin,
    y,
    size: 11,
    font: boldFont,
    color: rgb(0.08, 0.09, 0.11),
  })

  if (creatorHandle) {
    page.drawText(formatHandle(creatorHandle), {
      x: margin,
      y: y - 16,
      size: 10,
      font,
      color: rgb(0.38, 0.42, 0.48),
    })
  }

  if (creatorEmail) {
    page.drawText(creatorEmail, {
      x: margin,
      y: y - (creatorHandle ? 32 : 16),
      size: 10,
      font,
      color: rgb(0.38, 0.42, 0.48),
    })
  }

  drawRightText(page, "INVOICE", pageWidth - margin, pageHeight - margin, 28, boldFont)
  drawRightText(page, invoice.invoice_number, pageWidth - margin, pageHeight - margin - 30, 11, font)
  drawRightText(
    page,
    getInvoiceStatusLabel(invoice.status),
    pageWidth - margin,
    pageHeight - margin - 48,
    10,
    boldFont,
  )

  y -= 44
  drawRule(page, y)
  y -= 34

  page.drawText("Bill To", {
    x: margin,
    y,
    size: 10,
    font,
    color: rgb(0.38, 0.42, 0.48),
  })

  page.drawText(invoice.client_name, {
    x: margin,
    y: y - 20,
    size: 13,
    font: boldFont,
    color: rgb(0.08, 0.09, 0.11),
  })

  let addressY = y - 38
  const billToLines = [
    invoice.client_email,
    invoice.client_phone,
    invoice.client_address,
  ].filter(Boolean)

  for (const value of billToLines) {
    const lines = wrapText(value || "", 38)

    for (const line of lines) {
      page.drawText(line, {
        x: margin,
        y: addressY,
        size: 10,
        font,
        color: rgb(0.27, 0.3, 0.35),
      })
      addressY -= 15
    }
  }

  const campaignLabel = invoice.campaign
    ? `${invoice.campaign.brand_name} - ${invoice.campaign.campaign_title}`
    : "-"

  const campaignSectionY = Math.min(y - 104, addressY - 16)

  page.drawText("Campaign / Description", {
    x: margin,
    y: campaignSectionY,
    size: 10,
    font,
    color: rgb(0.38, 0.42, 0.48),
  })
  drawWrappedText(page, campaignLabel, margin, campaignSectionY - 18, 10, font, 46)

  const metaRows: Array<[string, string]> = [
    ["Date", formatDate(invoice.issued_date)],
    ["Due date", formatDate(invoice.due_date)],
    ["Payment terms", invoice.payment_terms || "-"],
  ]

  let metaY = y
  for (const [label, value] of metaRows) {
    page.drawText(label, {
      x: 338,
      y: metaY,
      size: 10,
      font,
      color: rgb(0.38, 0.42, 0.48),
    })
    drawRightText(page, value, pageWidth - margin, metaY, 10, boldFont)
    metaY -= 20
  }

  y -= 164

  page.drawText("Balance Due", {
    x: 360,
    y,
    size: 11,
    font,
    color: rgb(0.38, 0.42, 0.48),
  })
  drawRightText(page, formatCurrency(invoice.amount), pageWidth - margin, y - 12, 24, boldFont)

  y -= 62
  drawTableHeader(page, y, font)
  y -= 28

  const itemDescription =
    invoice.item_description ||
    invoice.campaign?.campaign_title ||
    "Creator services"

  drawWrappedText(page, itemDescription, margin, y, 10, font, 34)
  drawRightText(page, formatQuantity(invoice.quantity), 338, y, 10, font)
  drawRightText(page, formatCurrency(invoice.rate), 438, y, 10, font)
  drawRightText(page, formatCurrency(invoice.amount), pageWidth - margin, y, 10, boldFont)

  y -= Math.max(34, wrapText(itemDescription, 34).length * 15 + 10)
  drawRule(page, y)
  y -= 28

  page.drawText("Total", {
    x: 380,
    y,
    size: 12,
    font: boldFont,
    color: rgb(0.08, 0.09, 0.11),
  })
  drawRightText(page, formatCurrency(invoice.amount), pageWidth - margin, y, 12, boldFont)

  y -= 58

  const notes = [invoice.bank_details, invoice.notes].filter(Boolean).join("\n\n")
  if (notes) {
    page.drawText("Notes", {
      x: margin,
      y,
      size: 12,
      font: boldFont,
      color: rgb(0.08, 0.09, 0.11),
    })
    drawWrappedText(page, notes, margin, y - 22, 10, font, 88)
  }

  page.drawText("Generated by Flowra", {
    x: margin,
    y: 42,
    size: 9,
    font,
    color: rgb(0.54, 0.58, 0.64),
  })

  return pdf.save()
}

export function createInvoicePdfFilename(invoiceNumber: string) {
  const safeInvoiceNumber = invoiceNumber
    .trim()
    .replace(/[^a-z0-9-]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()

  return `${safeInvoiceNumber || "invoice"}.pdf`
}

function drawRule(page: PDFPage, y: number) {
  page.drawLine({
    start: { x: margin, y },
    end: { x: pageWidth - margin, y },
    thickness: 1,
    color: rgb(0.9, 0.91, 0.93),
  })
}

function drawTableHeader(
  page: PDFPage,
  y: number,
  font: Awaited<ReturnType<PDFDocument["embedFont"]>>,
) {
  page.drawRectangle({
    x: margin,
    y: y - 8,
    width: contentWidth,
    height: 26,
    color: rgb(0.95, 0.96, 0.97),
  })
  page.drawText("Item", {
    x: margin + 10,
    y,
    size: 9,
    font,
    color: rgb(0.38, 0.42, 0.48),
  })
  page.drawText("Qty", {
    x: 320,
    y,
    size: 9,
    font,
    color: rgb(0.38, 0.42, 0.48),
  })
  page.drawText("Rate", {
    x: 410,
    y,
    size: 9,
    font,
    color: rgb(0.38, 0.42, 0.48),
  })
  page.drawText("Amount", {
    x: 500,
    y,
    size: 9,
    font,
    color: rgb(0.38, 0.42, 0.48),
  })
}

function drawRightText(
  page: PDFPage,
  text: string,
  rightX: number,
  y: number,
  size: number,
  font: Awaited<ReturnType<PDFDocument["embedFont"]>>,
) {
  page.drawText(text, {
    x: rightX - font.widthOfTextAtSize(text, size),
    y,
    size,
    font,
    color: rgb(0.08, 0.09, 0.11),
  })
}

function drawWrappedText(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  size: number,
  font: Awaited<ReturnType<PDFDocument["embedFont"]>>,
  maxLength: number,
) {
  let currentY = y

  for (const paragraph of text.split(/\n+/)) {
    for (const line of wrapText(paragraph, maxLength)) {
      page.drawText(line, {
        x,
        y: currentY,
        size,
        font,
        color: rgb(0.27, 0.3, 0.35),
      })
      currentY -= 15
    }
    currentY -= 6
  }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-MY", {
    currency: "MYR",
    style: "currency",
  }).format(value)
}

function formatHandle(value: string) {
  const handle = value.trim()
  return handle.startsWith("@") ? handle : `@${handle}`
}

function formatQuantity(value: number) {
  return new Intl.NumberFormat("en-MY", {
    maximumFractionDigits: 2,
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value)
}

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function wrapText(text: string, maxLength: number) {
  const words = text.trim().split(/\s+/)
  const lines: string[] = []
  let currentLine = ""

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word

    if (candidate.length > maxLength && currentLine) {
      lines.push(currentLine)
      currentLine = word
    } else {
      currentLine = candidate
    }
  }

  if (currentLine) {
    lines.push(currentLine)
  }

  return lines
}
