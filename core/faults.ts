// Defines abstract fault
export abstract class GenericFault extends Error {
    abstract readonly code: string;
    abstract readonly message: string;
    abstract readonly status: number;
    readonly name: string = "Fault";
}

// Defines implemented faults
export class AlreadyExists extends GenericFault {
    readonly code: string = "ALREADY_EXISTS";
    readonly message: string = "The data provided already exists.";
    readonly status: number = 409;
}
export class BadRequest extends GenericFault {
    readonly code: string = "BAD_REQUEST";
    readonly message: string = "The data provided is incomplete or structurely invalid.";
    readonly status: number = 400;
}
export class DoesntExist extends GenericFault {
    readonly code: string = "DOESNT_EXIST";
    readonly message: string = "The data provided doesn't exist.";
    readonly status: number = 404;
}
export class MissingApi extends GenericFault {
    readonly code: string = "MISSING_API";
    readonly message: string = "The requested api does not exist.";
    readonly status: number = 404;
}
export class MissingAsset extends GenericFault {
    readonly code: string = "MISSING_ASSET";
    readonly message: string = "The requested asset does not exist.";
    readonly status: number = 404;
}
export class MissingEndpoint extends GenericFault {
    readonly code: string = "MISSING_ENDPOINT";
    readonly message: string = "The requested endpoint does not exist.";
    readonly status: number = 404;
}
export class RouteAbort extends GenericFault {
    readonly code: string = "ROUTE_ABORT";
    readonly message: string = "Route handler aborted.";
    readonly status: number = 500;
}
export class ServerFailure extends GenericFault {
    readonly code: string = "SERVER_FAILURE";
    readonly message: string = "Internal error occurred.";
    readonly status: number = 500;
}

// Exports
export default {
    AlreadyExists,
    BadRequest,
    DoesntExist,
    GenericFault,
    MissingApi,
    MissingAsset,
    MissingEndpoint,
    RouteAbort,
    ServerFailure
};
