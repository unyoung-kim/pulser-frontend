import { Button } from '@/components/ui/button';
import type { Table } from '@tanstack/react-table';

interface PaginationControlsProps<TData> {
  table: Table<TData>;
}

export function PaginationControls<TData>({ table }: PaginationControlsProps<TData>) {
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();

  const pageNumbers = [];
  const maxVisiblePages = 5;

  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) {
        pageNumbers.push(i);
      }
      pageNumbers.push('...');
      pageNumbers.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pageNumbers.push(1);
      pageNumbers.push('...');
      for (let i = totalPages - 3; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      pageNumbers.push('...');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pageNumbers.push(i);
      }
      pageNumbers.push('...');
      pageNumbers.push(totalPages);
    }
  }

  return (
    <div className="flex items-center space-x-2">
      {pageNumbers.map((pageNumber, index) => (
        <Button
          key={index}
          variant={pageNumber === currentPage ? 'default' : 'outline'}
          size="sm"
          onClick={() => {
            if (typeof pageNumber === 'number') {
              table.setPageIndex(pageNumber - 1);
            }
          }}
          disabled={pageNumber === '...'}
        >
          {pageNumber}
        </Button>
      ))}
    </div>
  );
}
