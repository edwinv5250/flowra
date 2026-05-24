"use server"

import { revalidatePath } from "next/cache"

import { validateInvoiceForm } from "@/features/invoices/invoice-validation"
import type { InvoiceFormState } from "@/features/invoices/invoice-types"
import { requireUserId } from "@/lib/auth/require-user"
import { createClient } from "@/lib/supabase/server"

const financePath = "/finance"

function invoiceErrorMessage(message: string) {
  if (message.toLowerCase().includes("duplicate")) {
    return "Invoice number already exists. Use a unique invoice number for this account."
  }

  return message
}

export async function createInvoice(
  _previousState: InvoiceFormState,
  formData: FormData,
): Promise<InvoiceFormState> {
  const validated = validateInvoiceForm(formData)

  if ("state" in validated) {
    return validated.state
  }

  const userId = await requireUserId()
  const supabase = await createClient()
  const { error } = await supabase.from("invoices").insert({
    ...validated.data,
    user_id: userId,
  })

  if (error) {
    return { message: invoiceErrorMessage(error.message) }
  }

  revalidatePath(financePath)
  return { message: "Invoice created.", success: true }
}

export async function updateInvoice(
  _previousState: InvoiceFormState,
  formData: FormData,
): Promise<InvoiceFormState> {
  const id = formData.get("id")

  if (typeof id !== "string" || !id) {
    return { message: "Missing invoice id." }
  }

  const validated = validateInvoiceForm(formData)

  if ("state" in validated) {
    return validated.state
  }

  const userId = await requireUserId()
  const supabase = await createClient()
  const { error } = await supabase
    .from("invoices")
    .update(validated.data)
    .eq("id", id)
    .eq("user_id", userId)

  if (error) {
    return { message: invoiceErrorMessage(error.message) }
  }

  revalidatePath(financePath)
  return { message: "Invoice updated.", success: true }
}

export async function deleteInvoice(formData: FormData) {
  const id = formData.get("id")

  if (typeof id !== "string" || !id) {
    throw new Error("Missing invoice id.")
  }

  const userId = await requireUserId()
  const supabase = await createClient()
  const { error } = await supabase
    .from("invoices")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)

  if (error) {
    throw new Error(`Could not delete invoice: ${error.message}`)
  }

  revalidatePath(financePath)
}
