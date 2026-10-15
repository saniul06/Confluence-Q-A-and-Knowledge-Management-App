import type { ApiError } from "../../../../src/shared/types";
import type { ApiState } from "./types";

export * from "./types";
export * from "./apiReducer";

export function createInitialState<TData>(): ApiState<TData> {
  return {
    status: "idle",
    data: undefined as TData,
    error: undefined as unknown as ApiError,
  };
}
