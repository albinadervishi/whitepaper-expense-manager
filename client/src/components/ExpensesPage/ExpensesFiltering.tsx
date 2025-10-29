import { useState } from "react";
import {
  Card,
  CardContent,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
  Calendar,
} from "@/components/ui";
import { Search, Calendar as CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";
import type { Team } from "@/types";
import { CATEGORIES } from "@/constants";

interface ExpensesFilteringProps {
  descriptionFilter: string;
  onDescriptionFilterChange: (description: string) => void;
  teamFilter: string;
  onTeamFilterChange: (team: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (category: string) => void;
  dateRange: { start: string; end: string } | null;
  onDateRangeChange: (range: { start: string; end: string } | null) => void;
  teams: Team[];
}

export function ExpensesFiltering({
  descriptionFilter,
  onDescriptionFilterChange,
  teamFilter,
  onTeamFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  dateRange,
  onDateRangeChange,
  teams,
}: ExpensesFilteringProps) {
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>();

  const handleDateSelect = (range: DateRange | undefined) => {
    setDate(range);
    if (range?.from && range?.to) {
      onDateRangeChange({
        start: range.from.toISOString().split("T")[0],
        end: range.to.toISOString().split("T")[0],
      });
    } else {
      onDateRangeChange(null);
    }
  };

  return (
    <Card className="mb-6 ">
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by description"
              className="pl-10 h-11"
              value={descriptionFilter}
              onChange={(e) => onDescriptionFilterChange(e.target.value)}
            />
          </div>

          <Select value={teamFilter} onValueChange={onTeamFilterChange}>
            <SelectTrigger className="w-full  h-11">
              <SelectValue placeholder="All teams" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All teams</SelectItem>
              {teams.map((team) => (
                <SelectItem key={team._id} value={team._id}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
            <SelectTrigger className="w-full  h-11">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {CATEGORIES.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Popover open={showCustomDate} onOpenChange={setShowCustomDate}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-11 gap-2 font-normal text-sm w-full justify-start overflow-hidden border border-input"
                >
                  <CalendarIcon className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">
                    {dateRange
                      ? `${dateRange.start.replace(
                          /-/g,
                          "/"
                        )} - ${dateRange.end.replace(/-/g, "/")}`
                      : "Select date range"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={date}
                  onSelect={handleDateSelect}
                  numberOfMonths={1}
                  initialFocus
                  className="w-fit"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
