import { Card, CardContent, CardHeader, Progress } from "@/components/ui";
import { Text } from "@/components";
import { type Team } from "@/types";
import { cn } from "@/lib/utils";

export function TeamCards({
  onCardClick,
  teams,
}: {
  onCardClick: (id: string) => void;
  teams: Team[];
}) {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      {teams?.map((team) => {
        const percentageUsed =
          team.budgetStatus?.percentageUsed ||
          Math.round((team.totalSpent / team.budget) * 100);
        const isOverBudget = percentageUsed >= 80;

        return (
          <Card
            key={team._id}
            onClick={() => onCardClick(team._id)}
            className="cursor-pointer hover:shadow-lg transition-shadow"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Text size="xl" weight="bold" color="foreground">
                {team.name}
              </Text>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2 items-baseline">
                <Text size="base" weight="bold" color="foreground">
                  Budget {team.budget} $
                </Text>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Spent {team.totalSpent} ${" "}
                  </span>
                  <span
                    className={cn(
                      "font-medium ",
                      isOverBudget ? "text-red-600" : "text-green-600"
                    )}
                  >
                    ({Math.round(percentageUsed)}%)
                  </span>
                </div>
                <Progress
                  value={percentageUsed}
                  className={cn(
                    "h-6 [&>div]:bg-current rounded-none",
                    isOverBudget
                      ? "bg-red-200 text-red-600"
                      : "bg-green-200 text-green-600"
                  )}
                />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
