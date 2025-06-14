// Defines abstract fault
export abstract class GenericFault extends Error {
    // Defines constructor
    abstract readonly code: string;
    abstract readonly message: string;
    abstract readonly status: number;
    readonly name: string = "Fault";
}

// Defines implemented faults
export class MissingEndpoint extends GenericFault {
    // Defines constructor
    readonly code: string = "MISSING_ENDPOINT";
    readonly message: string = "The requested endpoint does not exist.";
    readonly status: number = 404;
}
export class RouteAbort extends GenericFault {
    // Defines constructor
    readonly code: string = "ROUTE_ABORT";
    readonly message: string = "Route handler aborted.";
    readonly status: number = 500;
}
export class ServerFailure extends GenericFault {
    // Defines constructor
    readonly code: string = "SERVER_FAILURE";
    readonly message: string = "Internal error occurred.";
    readonly status: number = 500;
}

// Exports
export default {
    GenericFault,
    MissingEndpoint,
    RouteAbort,
    ServerFailure
};
