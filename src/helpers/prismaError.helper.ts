import { Prisma } from "@prisma/client";
import createHttpError from "http-errors";

const PRISMA_ERROR_MAP: Record<
  Prisma.PrismaClientKnownRequestError["code"],
  {
    status: number;
    getClientMessage?: (error: Prisma.PrismaClientKnownRequestError) => string;
  }
> = {
  P2000: {
    status: 400,
    getClientMessage: (error) => {
      const fieldName = error.meta?.target as string[];
      return fieldName
        ? `Invalid input length for field: ${fieldName.join(", ")}`
        : "Invalid input length";
    },
  },
  P2002: {
    status: 400,
    getClientMessage: (error) => {
      const fields = error.meta?.target as string[];
      return fields
        ? `${fields} already exists`
        : `Unique constraint failed on fields: ${fields}`;
    },
  },
  P2003: {
    status: 400,
    getClientMessage: (error) => {
      const field = error.meta?.field_name;
      return field ? `Invalid data for field: ${field}` : "Invalid data";
    },
  },
  P2015: {
    status: 404,
    getClientMessage: (error) => {
      const record = error.meta?.path_in_schema;
      return record ? `Record not found in ${record}` : "Record not found";
    },
  },
  P2025: {
    status: 404,
    getClientMessage: (error) => {
      const cause = error.meta?.cause;
      return cause
        ? `Resource does not exist: ${cause}`
        : "Resource does not exist";
    },
  },
  P2033: { status: 503 },
};

export const prismaErrorHelper = (
  error: Prisma.PrismaClientKnownRequestError,
) => {
  const errorConfig = PRISMA_ERROR_MAP[error.code] || {
    status: 500,
  };

  let clientMessage = "Something went wrong";

  if (errorConfig.getClientMessage) {
    clientMessage = errorConfig.getClientMessage(error);
  } else if (error.message) {
    const messageParts = error.message.split("\n");
    if (messageParts.length > 1) {
      clientMessage = messageParts[messageParts.length - 1].trim();
    } else {
      clientMessage = error.message;
    }
  }

  return createHttpError(errorConfig.status, clientMessage);
};
