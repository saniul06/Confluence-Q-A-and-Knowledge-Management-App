import { useCallback, useReducer, useRef } from "react";

import { apiReducer, createInitialState } from "../state";

import { getErrorMessage } from "../utils/helpers";
import type { ApiResponse } from "../../../../src/shared/types";

export function useApiRequest<TData, TArgs extends unknown[] = []>(
  asyncFunction: (...args: TArgs) => Promise<ApiResponse<TData>>,
) {
  const [state, dispatch] = useReducer(apiReducer<TData>, createInitialState());

  const requestIdRef = useRef(0);

  const request = useCallback(
    async (...args: TArgs): Promise<TData | undefined> => {
      const requestId = ++requestIdRef.current;

      const isLatestRequest = () => requestId === requestIdRef.current;

      dispatch({ type: "START" });

      try {
        const response = await asyncFunction(...args);

        // Ignore stale responses.
        if (!isLatestRequest()) {
          return response.success ? response.data : undefined;
        }

        if (!response.success) {
          dispatch({
            type: "ERROR",
            payload: response.error,
          });

          alert(`Error: ${response.error.message}`);

          return undefined;
        }

        dispatch({
          type: "SUCCESS",
          payload: response.data,
        });

        return response.data;
      } catch (error: unknown) {
        // Ignore stale errors too.
        if (!isLatestRequest()) {
          return undefined;
        }

        const message = getErrorMessage(error);

        alert(`Unknown Error: ${message}`);

        dispatch({
          type: "ERROR",
          payload: { message },
        });

        return undefined;
      }
    },
    [asyncFunction],
  );

  const updateState = useCallback((fn: (args: TData) => TData) => {
    dispatch({ type: "UPDATE_STATE", payload: fn });
  }, []);

  const resetError = useCallback(() => {
    dispatch({ type: "RESET_ERROR" });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  return {
    ...state,
    request,
    reset,
    updateState,
    resetError,
  };
}
