import { expenseCategoryOptions } from "@/features/expenses/expense-options"
import type {
  ExpenseCategory,
  ExpenseFormState,
  ExpenseFormValues,
} from "@/features/expenses/expense-types"

const noCampaignValue = "none"

function getString(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === "string" ? value.trim() : ""
}

function isExpenseCategory(value: string): value is ExpenseCategory {
  return expenseCategoryOptions.some((option) => option.value === value)
}

export function validateExpenseForm(formData: FormData):
  | { data: ExpenseFormValues }
  | { state: ExpenseFormState } {
  const amountValue = getString(formData, "amount")
  const category = getString(formData, "category")
  const campaignId = getString(formData, "campaign_id")
  const amount = Number(amountValue)

  const data = {
    amount,
    campaign_id: campaignId && campaignId !== noCampaignValue ? campaignId : null,
    category,
    expense_date: getString(formData, "expense_date"),
    notes: getString(formData, "notes") || null,
    title: getString(formData, "title"),
  }

  const errors: ExpenseFormState["errors"] = {}

  if (!data.title) errors.title = "Expense title is required."
  if (!data.expense_date) errors.expense_date = "Expense date is required."
  if (!Number.isFinite(amount) || amount < 0) {
    errors.amount = "Amount must be zero or more."
  }
  if (!isExpenseCategory(category)) errors.category = "Choose a valid category."

  if (Object.keys(errors).length > 0) {
    return {
      state: {
        errors,
        message: "Please fix the highlighted fields.",
      },
    }
  }

  return {
    data: {
      ...data,
      category: category as ExpenseCategory,
    },
  }
}
