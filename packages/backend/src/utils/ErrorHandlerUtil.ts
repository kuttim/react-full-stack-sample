import { ErrorRequestHandler } from "express";
import * as httpStatusCodes from "http-status-codes";
import { createLogger } from "./LoggerUtil";

const log = createLogger("api:errorHandlerUtil");

// Logs unhandled errors and calls the next error middleware.
export const errorLoggerMiddleware: ErrorRequestHandler = (error: Error, request, result, next) => {
    log(error.stack);
    next(error);
};

// Makes sure a request that caused an error is still resolved by sending a response, in our case an INTERNAL SERVER
// ERROR code to indicate something went awry.
export const errorMiddleware: ErrorRequestHandler = (error, request, result, next) => {
    result.sendStatus(httpStatusCodes.INTERNAL_SERVER_ERROR);
};
