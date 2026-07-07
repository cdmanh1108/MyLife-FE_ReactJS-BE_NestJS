import { PaginationMetaDto, PaginatedResult } from '../dto/pagination.dto';

export function buildPaginationMeta(page: number, limit: number, total: number): PaginationMetaDto {
  return {
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export function paginated<T>(items: T[], page: number, limit: number, total: number): PaginatedResult<T> {
  return { items, meta: buildPaginationMeta(page, limit, total) };
}

export function skipOf(page: number, limit: number): number {
  return (page - 1) * limit;
}
