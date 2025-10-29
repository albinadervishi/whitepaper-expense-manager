import { Button } from "@/components/ui";
import { Text } from "@/components";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    return Array.from({ length: totalPages }, (_, i) => i + 1).filter(
      (page) => {
        return (
          page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1
        );
      }
    );
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t">
      <Text size="sm" color="foreground">
        Showing {startItem}-{endItem} of {totalItems} expenses
      </Text>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>

        <div className="flex gap-1">
          {getPageNumbers().map((page, idx, arr) => (
            <>
              {idx > 0 && arr[idx - 1] !== page - 1 && (
                <span
                  key={`ellipsis-${page}`}
                  className="px-2 flex items-center"
                >
                  ...
                </span>
              )}
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            </>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
