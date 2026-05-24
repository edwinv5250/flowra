"use server"

import { revalidatePath } from "next/cache"

import { validateExpenseForm } from "@/features/expenses/expense-validation"
import type { ExpenseFormState } from "@/features/expenses/expense-types"
import { requireUserId } from "@/lib/auth/require-user"
import { createClient } from "@/lib/supabase/server"

const financePath = "/finance"

export async function createExpense(
  _previousState: ExpenseFormState,
  formData: FormData,
): Promise<ExpenseFormState> {
  const validated = validateExpenseForm(formData)

  if ("state" in validated) {
    return validated.state
  }

  const userId = await requireUserId()
  const supabase = await createClient()
  const { error } = await supabase.from("expenses").insert({
    ...validated.data,
    user_id: userId,
  })

  if (error) {
    return { message: error.message }
  }

  revalidatePath(financePath)
  return { message: "Expense created.", success: true }
}

export async function updateExpense(
  _previousState: ExpenseFormState,
  formData: FormData,
): Promise<ExpenseFormState> {
  const id = formData.get("id")

  if (typeof id !== "string" || !id) {
    return { message: "Missing expense id." }
  }

  const validated = validateExpenseForm(formData)

  if ("state" in validated) {
    return validated.state
  }

  const userId = await requireUserId()
  const supabase = await createClient()
  const { error } = await supabase
    .from("expenses")
    .update(validated.data)
    .eq("id", id)
    .eq("user_id", userId)

  if (error) {
    return { message: error.message }
  }

  revalidatePath(financePath)
  return { message: "Expense updated.", success: true }
}

export async function deleteExpense(formData: FormData) {
  const id = formData.get("id")

  if (typeof id !== "string" || !id) {
    throw new Error("Missing expense id.")
  }

  const userId = await requireUserId()
  const supabase = await createClient()
  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)

  if (error) {
    throw new Error(`Could not delete expense: ${error.message}`)
  }

  revalidatePath(financePath)
}
