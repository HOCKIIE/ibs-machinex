export interface Meta {
    total: string | number,
    per_page: string | number,
    current_page: string | number,
    last_page: string | number,
    current_page_url: string,
    first_page_url: string,
    last_page_url: string,
    next_page_url: string,
    prev_page_url: string | null,
    path: string,
    from: string | number,
    to: string | number,
}
export interface PaginationType {
    meta: Meta;
    totalItems?: number;
    prevPage: () => void;
    nextPage: () => void;
    currentPage?: number;
    handlePageChange?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}