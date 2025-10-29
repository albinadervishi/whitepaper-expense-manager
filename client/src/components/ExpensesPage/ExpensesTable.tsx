import { Button, Badge } from "@/components/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import type { Expense } from "@/types";

interface ExpensesTableProps {
  expenses: Expense[];
  deleteExpense: (id: string) => void;
  editExpense: (expense: Expense) => void;
}

export function ExpensesTable({
  expenses,
  deleteExpense,
  editExpense,
}: ExpensesTableProps) {
  return (
    <div className="overflow-x-auto px-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Team</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                No expenses found
              </TableCell>
            </TableRow>
          ) : (
            expenses.map((expense) => (
              <TableRow key={expense._id}>
                <TableCell className="font-medium">
                  {typeof expense.teamId === "string"
                    ? expense.teamId
                    : expense.teamId?.name}
                </TableCell>
                <TableCell>{expense.description}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal">
                    {expense.category}
                  </Badge>
                </TableCell>
                <TableCell>{expense.status}</TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {expense.amount.toFixed(2)}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {new Date(expense.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => editExpense(expense)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      onClick={() => deleteExpense(expense._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
