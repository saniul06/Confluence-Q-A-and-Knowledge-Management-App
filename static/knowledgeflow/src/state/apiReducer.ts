import { createInitialState } from ".";
import type { ApiAction, ApiState } from "./types";

export function apiReducer<TData>(
  state: ApiState<TData>,
  action: ApiAction<TData>,
): ApiState<TData> {
  switch (action.type) {
    case "START":
      return {
        ...state,
        status: "loading",
        data: state.data,
        error: {},
      };

    case "SUCCESS":
      return {
        ...state,
        status: "success",
        data: action.payload,
        error: {},
      };

    case "ERROR":
      return {
        ...state,
        status: "error",
        error: action.payload,
      };

    case "UPDATE_STATE":
      return { ...state, data: action.payload(state.data) };

    case "RESET":
      return createInitialState<TData>();

    case "RESET_ERROR":
      return {
        ...state,
        error: {},
      };
  }
}
