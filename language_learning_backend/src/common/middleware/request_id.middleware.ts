import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';

export type RequestWithId = Request & {
  requestId: string;
};

export function requestIdMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const requestWithId = request as RequestWithId;
  const requestId = randomUUID();

  requestWithId.requestId = requestId;
  response.setHeader('X-Request-Id', requestId);

  next();
}
