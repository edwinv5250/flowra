import type { Database } from "@/lib/database.types"

export type Expense = Database["public"]["Tables"]["expenses"]["Row"]
export type ExpenseCategory = Database["public"]["Enums"]["expense_category"]

export type ExpenseWithCampaign = Expense & {
  campaign: {
    brand_name: string
    campaign_title: string
    id: string
  } | null
}

export type ExpenseCampaignOption = {
  brand_name: string
  campaign_title: string
  id: string
}

export type ExpenseFormField =
  | "amount"
  | "campaign_id"
  | "category"
  | "expense_date"
  | "title"

export type ExpenseFormState = {
  errors?: Partial<Record<ExpenseFormField, string>>
  message?: string
  success?: boolean
}

export type ExpenseFormValues = {
  amount: number
  campaign_id: string | null
  category: ExpenseCategory
  expense_date: string
  notes: string | null
  title: string
}
