export interface PagionationType {
    currentPage: number | 1,
    prevPage: number,
    nextPage: number
}
export interface PaginateType {
    currentPage: number | 1,
    prevPage: number,
    nextPage: number
}
export interface PaginationMeta {
    current_page: number;
    from: number;
    last_page: number;
    path: string; //"http://example.com/users",
    per_page: number,
    to: number,
    total: number
}