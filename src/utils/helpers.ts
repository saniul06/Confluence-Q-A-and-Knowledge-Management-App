import { z } from "zod";
import { ApiResponse, ErrorCode, ResolverContext } from "../shared/types";
import { AppError, ValidationError } from "./error";
import { DeepSnakeCase, toSnakeCase } from "./mapper";

export function validatePayload<T extends z.ZodType>(
  schema: T,
  payload: unknown,
): z.infer<T> {
  const result = schema.safeParse(payload);

  if (!result.success) {
    const errMsg = result.error.issues
      .map((issue) => `${issue.message} for "${issue.path}" field`)
      .join("\n\n");
    throw new ValidationError(errMsg);
  }

  return result.data;
}

export function success<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
  };
}

export function failure(error: any): ApiResponse<never> {
  console.error("Unexpected error:", error);

  if (error instanceof AppError) {
    return {
      success: false,
      error: {
        code: error.code as ErrorCode,
        message: error.message,
      },
    };
  }

  if (error?.code === "SQL_EXECUTION_ERROR") {
    if (error?.context?.debug?.code === "ER_DUP_ENTRY") {
      return {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Duplicate record creation.",
        },
      };
    }
  }

  return {
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: "Something went wrong.",
    },
  };
}

export function withResponse<TRequest, TResponse>(
  handler: (request: TRequest) => Promise<TResponse>,
) {
  return async (request: TRequest): Promise<ApiResponse<TResponse>> => {
    try {
      const data = await handler(request);
      return success(data);
    } catch (error) {
      return failure(error);
    }
  };
}

export function withContext<TRequest, TResponse>(
  handler: (request: TRequest, context: ResolverContext) => Promise<TResponse>,
) {
  return async (request: {
    payload: TRequest;
    context: ResolverContext;
  }): Promise<ApiResponse<TResponse>> => {
    try {
      const data = await handler(request.payload, request.context);

      return success(data);
    } catch (error) {
      return failure(error);
    }
  };
}

export function withResponseContext<TRequest, TResponse>(
  handler: (request: TRequest, Context: any) => Promise<TResponse>,
) {
  return async (
    request: TRequest,
    context: any,
  ): Promise<ApiResponse<TResponse>> => {
    try {
      const data = await handler(request, context);
      return success(data);
    } catch (error) {
      return failure(error);
    }
  };
}

export function createPayload<T extends Object>(
  input: T,
): { fields: string; placeholders: string; values: any[] } {
  const dbPayload = toSnakeCase(input);
  const keys = Object.keys(dbPayload);
  return {
    fields: keys.join(","),
    placeholders: keys.map((i) => "?").join(","),
    values: Object.values(dbPayload),
  };
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function buildFaqStorageBody(
  questionBody: string | null,
  acceptedAnswer: string,
): string {
  const questionContent = questionBody?.trim()
    ? `<p>${escapeXml(questionBody)}</p>`
    : "";

  return [
    questionContent,
    "<hr />",
    `<p>${escapeXml(acceptedAnswer)}</p>`,
  ].join("");
}
