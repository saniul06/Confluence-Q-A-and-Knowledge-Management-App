import type { ApiError } from "../../../../src/shared/types";

export type ApiStatus = "idle" | "loading" | "success" | "error";

export type ApiState<T> = {
  status: ApiStatus;
  data: T;
  error: ApiError;
};

export type ApiAction<T> =
  | {
      type: "START";
    }
  | {
      type: "SUCCESS";
      payload: T;
    }
  | {
      type: "ERROR";
      payload: ApiError;
    }
  | {
      type: "UPDATE_STATE";
      payload: (args: T) => T;
    }
  | {
      type: "RESET";
    }
  | {
      type: "RESET_ERROR";
    };
