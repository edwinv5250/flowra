import type { ExpenseCategory } from "@/features/expenses/expense-types"

export const expenseCategoryOptions: Array<{ label: string; value: ExpenseCategory }> = [
  { label: "Equipment", value: "equipment" },
  { label: "Software", value: "software" },
  { label: "Meals", value: "meals" },
  { label: "Transport", value: "transport" },
  { label: "Props", value: "props" },
  { label: "Services", value: "services" },
  { label: "Other", value: "other" },
]

export function getExpenseCategoryLabel(category: ExpenseCategory) {
  return expenseCategoryOptions.find((option) => option.value === category)?.label ?? category
}
