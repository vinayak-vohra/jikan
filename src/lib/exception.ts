import { HTTPException } from "hono/http-exception";
import { StatusCode } from "hono/utils/http-status";
import { AppwriteException } from "node-appwrite";

export class APIException extends HTTPException {
  constructor(error: unknown) {
    let status = 500;
    let message = "Internal Server Error";

    if (error instanceof AppwriteException) {
      status = error.code;
      message = error.type
        .replace(/_/g, " ")
        .replace(/(^.|\s.)/g, (x) => x.toUpperCase());
    }

    super(status as StatusCode, { message });
  }
}

export class UnauthorizedError extends HTTPException {
  constructor(message: string = "Unauthorized Access") {
    super(401, { message });
  }
}

export class NotFoundError extends HTTPException {
  constructor(message: string = "Resource Not Found") {
    super(404, { message });
  }
}

export class BadRequestError extends HTTPException {
  constructor(message: string = "Bad Request") {
    super(400, { message });
  }
}
