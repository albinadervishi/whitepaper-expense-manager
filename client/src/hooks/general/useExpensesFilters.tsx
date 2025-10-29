import { useState, useMemo } from "react";
import type { Expense } from "@/types";

export function useExpensesFilters(expenses: Expense[]) {
  const [descriptionFilter, setDescriptionFilter] = useState("");
  const [teamFilter, setTeamFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateRange, setDateRange] = useState<{
    start: string;
    end: string;
  } | null>(null);

  const filteredExpenses = useMemo(() => {
    let result = [...expenses];

    if (descriptionFilter) {
      result = result.filter((t) =>
        t.description.toLowerCase().includes(descriptionFilter.toLowerCase())
      );
    }
    if (teamFilter !== "all") {
      result = result.filter((t) => {
        if (typeof t.teamId === "string") {
          return t.teamId === teamFilter;
        }
        return t.teamId?._id === teamFilter;
      });
    }

    if (categoryFilter !== "all") {
      result = result.filter((t) => t.category === categoryFilter);
    }

    if (dateRange) {
      const start = new Date(dateRange.start);
      const end = new Date(dateRange.end);
      end.setHours(23, 59, 59, 999);
      result = result.filter((t) => {
        const transDate = new Date(t.date);
        return transDate >= start && transDate <= end;
      });
    }

    return result;
  }, [expenses, descriptionFilter, teamFilter, categoryFilter, dateRange]);

  return {
    descriptionFilter,
    setDescriptionFilter,
    teamFilter,
    setTeamFilter,
    categoryFilter,
    setCategoryFilter,
    dateRange,
    setDateRange,
    filteredExpenses,
  };
}
