// Defines abstract fault
export abstract class GenericFault extends Error {
    abstract readonly code: string;
    abstract readonly message: string;
    abstract readonly status: number;
    readonly name: string = "Fault";
}

// Defines implemented faults
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
    GenericFault,
    MissingAsset,
    MissingEndpoint,
    RouteAbort,
    ServerFailure
};
