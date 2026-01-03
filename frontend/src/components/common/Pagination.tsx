import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';

interface AppPaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const AppPagination = ({
                                  page,
                                  totalPages,
                                  onPageChange,
                              }: AppPaginationProps) => {
    if (totalPages <= 1) return null;

    return (
        <Pagination>
            <PaginationContent>
                {/* Previous */}
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() => page > 1 && onPageChange(page - 1)}
                        className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                </PaginationItem>

                {/* Page numbers */}
                {Array.from({length: totalPages}).map((_, i) => {
                    const pageNumber = i + 1;

                    return (
                        <PaginationItem key={pageNumber}>
                            <PaginationLink
                                isActive={page === pageNumber}
                                onClick={() => onPageChange(pageNumber)}
                            >
                                {pageNumber}
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}

                {/* Next */}
                <PaginationItem>
                    <PaginationNext
                        onClick={() => page < totalPages && onPageChange(page + 1)}
                        className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};
