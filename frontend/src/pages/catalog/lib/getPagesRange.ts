export const PAGE_ELLIPSIS = '...' as const;
export const DEFAULT_SURROUND = 1;

export type PaginationItem = number | typeof PAGE_ELLIPSIS;

export function getPaginationRange(
  currentPage: number,
  totalPages: number,
  surround: number = DEFAULT_SURROUND,
): PaginationItem[] {
  if (totalPages <= 1) return [];

  const page = Math.min(Math.max(currentPage, 1), totalPages);

  const start = Math.max(2, page - surround);
  const end = Math.min(totalPages - 1, page + surround);

  const pages: PaginationItem[] = [1];

  if (start > 2) {
    pages.push(PAGE_ELLIPSIS);
  }

  for (let i = start; i <= end; i++) {
    if (i !== 1 && i !== totalPages) {
      pages.push(i);
    }
  }

  if (end < totalPages - 1) {
    pages.push(PAGE_ELLIPSIS);
  }

  if (totalPages !== 1) {
    pages.push(totalPages);
  }

  return pages;
}
