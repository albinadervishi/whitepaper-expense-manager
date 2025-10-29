import { useState } from "react";
import {
  ExpensesTable,
  Navbar,
  Pagination,
  AddExpenseDialog,
  ExpensesFiltering,
  ExpensesPageSkeleton,
} from "@/components/index";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useExpenses,
  useDeleteExpense,
  usePagination,
  useTeams,
  useExpensesFilters,
} from "@/hooks";
import { type Expense } from "@/types";

export function ExpensesPage() {
  const [isAddExpenseDialogOpen, setIsAddExpenseDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const { data: expenses, isLoading } = useExpenses();
  const { mutate: deleteExpenseMutation } = useDeleteExpense();
  const { data: teams } = useTeams();

  const {
    descriptionFilter,
    setDescriptionFilter,
    teamFilter,
    setTeamFilter,
    categoryFilter,
    setCategoryFilter,
    dateRange,
    setDateRange,
    filteredExpenses,
  } = useExpensesFilters(expenses ?? []);

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems,
    itemsPerPage,
  } = usePagination(filteredExpenses ?? []);

  if (isLoading) return <ExpensesPageSkeleton />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        onClick={() => {
          setSelectedExpense(null);
          setIsAddExpenseDialogOpen(true);
        }}
      />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <ExpensesFiltering
          descriptionFilter={descriptionFilter}
          onDescriptionFilterChange={setDescriptionFilter}
          teamFilter={teamFilter}
          onTeamFilterChange={setTeamFilter}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          teams={teams || []}
        />
        <Card>
          <CardHeader>
            <CardTitle>Expenses ({expenses?.length})</CardTitle>
          </CardHeader>
          <ExpensesTable
            expenses={paginatedItems}
            deleteExpense={deleteExpenseMutation}
            editExpense={(expense) => {
              setSelectedExpense(expense);
              setIsAddExpenseDialogOpen(true);
            }}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={expenses?.length ?? 0}
            onPageChange={setCurrentPage}
          />
        </Card>
      </main>
      <AddExpenseDialog
        isOpen={isAddExpenseDialogOpen}
        onClose={() => {
          setIsAddExpenseDialogOpen(false);
          setSelectedExpense(null);
        }}
        expense={selectedExpense || undefined}
        teams={teams || []}
      />
    </div>
  );
}
