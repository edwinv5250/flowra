"use client"

import { Edit, Trash2 } from "lucide-react"

import { deleteExpense } from "@/features/expenses/expense-actions"
import { getExpenseCategoryLabel } from "@/features/expenses/expense-options"
import type { ExpenseWithCampaign } from "@/features/expenses/expense-types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type ExpenseTableProps = {
  expenses: ExpenseWithCampaign[]
  onEdit: (expense: ExpenseWithCampaign) => void
}

export function ExpenseTable({ expenses, onEdit }: ExpenseTableProps) {
  if (expenses.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <h2 className="text-base font-medium">No expenses yet</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Add expenses to track campaign costs, software, transport, meals, and props.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Expense</TableHead>
              <TableHead className="hidden sm:table-cell">Category</TableHead>
              <TableHead className="hidden md:table-cell">Campaign</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[80px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-medium">{expense.title}</p>
                    {expense.notes && (
                      <p className="text-sm text-muted-foreground">{expense.notes}</p>
                    )}
                    <p className="text-xs text-muted-foreground sm:hidden">
                      {getExpenseCategoryLabel(expense.category)}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant="secondary">{getExpenseCategoryLabel(expense.category)}</Badge>
                </TableCell>
                <TableCell className="hidden text-muted-foreground md:table-cell">
                  {expense.campaign
                    ? `${expense.campaign.brand_name} - ${expense.campaign.campaign_title}`
                    : "General"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(expense.expense_date)}
                </TableCell>
                <TableCell className="text-right font-medium">
                  RM {Number(expense.amount).toLocaleString("en-MY")}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onEdit(expense)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit expense</span>
                    </Button>
                    <form
                      action={deleteExpense}
                      onSubmit={(event) => {
                        if (!window.confirm("Delete this expense?")) {
                          event.preventDefault()
                        }
                      }}
                    >
                      <input type="hidden" name="id" value={expense.id} />
                      <Button type="submit" variant="ghost" size="icon-sm">
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Delete expense</span>
                      </Button>
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}
