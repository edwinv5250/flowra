"use client"

import { useMemo, useState } from "react"
import { Plus, Search } from "lucide-react"
import type { ReactNode } from "react"

import {
  createExpense,
  updateExpense,
} from "@/features/expenses/expense-actions"
import { ExpenseForm } from "@/features/expenses/expense-form"
import { ExpenseTable } from "@/features/expenses/expense-table"
import type {
  ExpenseCampaignOption,
  ExpenseWithCampaign,
} from "@/features/expenses/expense-types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

type ExpensesPageProps = {
  campaignOptions: ExpenseCampaignOption[]
  expenses: ExpenseWithCampaign[]
  invoiceSection?: ReactNode
}

export function ExpensesPage({ campaignOptions, expenses, invoiceSection }: ExpensesPageProps) {
  const [editingExpense, setEditingExpense] = useState<ExpenseWithCampaign | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredExpenses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    if (!query) return expenses

    return expenses.filter((expense) => {
      return (
        expense.title.toLowerCase().includes(query) ||
        expense.category.toLowerCase().includes(query) ||
        expense.campaign?.brand_name.toLowerCase().includes(query) ||
        expense.campaign?.campaign_title.toLowerCase().includes(query)
      )
    })
  }, [expenses, searchQuery])

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  function openCreateForm() {
    setEditingExpense(null)
    setIsFormOpen(true)
  }

  function openEditForm(expense: ExpenseWithCampaign) {
    setEditingExpense(expense)
    setIsFormOpen(true)
  }

  function closeForm() {
    setIsFormOpen(false)
    setEditingExpense(null)
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Expenses</h1>
          <p className="text-muted-foreground">
            Track creator business costs and optionally link them to campaigns.
          </p>
        </div>
        <Button onClick={openCreateForm}>
          <Plus className="h-4 w-4" />
          New expense
        </Button>
      </div>

      {invoiceSection}

      <Card>
        <CardHeader className="gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-base">Expense Records</CardTitle>
            <p className="text-sm text-muted-foreground">
              RM {totalExpenses.toLocaleString("en-MY")} tracked across {expenses.length} expense
              {expenses.length === 1 ? "" : "s"}.
            </p>
          </div>
          <div className="relative md:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search expenses..."
              className="pl-9"
            />
          </div>
        </CardHeader>
        <CardContent>
          <ExpenseTable expenses={filteredExpenses} onEdit={openEditForm} />
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingExpense ? "Edit expense" : "Create expense"}</DialogTitle>
            <DialogDescription>
              Add simple expense records now. Receipt uploads will come later.
            </DialogDescription>
          </DialogHeader>
          <ExpenseForm
            key={editingExpense?.id ?? "create"}
            action={editingExpense ? updateExpense : createExpense}
            campaignOptions={campaignOptions}
            expense={editingExpense ?? undefined}
            onCancel={closeForm}
            onSuccess={closeForm}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
