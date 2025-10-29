import { Card, CardContent, CardHeader, Skeleton } from "@/components/ui";

export function ExpensesPageSkeleton() {
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
        <Skeleton className="h-12 w-48 mt-4 md:mt-0" />
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-12 flex-1" />
                <Skeleton className="h-12 w-24" />
                <Skeleton className="h-12 w-24" />
                <Skeleton className="h-12 w-32" />
                <Skeleton className="h-12 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
