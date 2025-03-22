import { z } from "zod";
import { paginationDto, paginationResponseDto } from "./pagination.dto";

export type PaginationDto = z.infer<typeof paginationDto>;
export type PaginationResponseDto<T> = z.infer<
  ReturnType<typeof paginationResponseDto<T>>
>;
