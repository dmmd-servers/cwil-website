// Imports
import chalk from "chalk";
import faults from "./faults";
import project from "./project";
import audit from "../bunsvr/audit";
import Fault from "../bunsvr/fault";
import track from "../bunsvr/track";

// Defines inspectors
export function inspectAccess(
    server: Bun.Server,
    request: Request | null,
    response: Response
): Response {    
    // Audit transparent access
    const known = request !== null;
    const url: URL = known ? new URL(request.url) : null;
    const ip = known ? (track.resolveIP(server, request) ?? "::-1") : "::-1";
    const endpoint = known ? `${request.method} ${url.pathname + url.search}` : "NULL ?";
    const status = response.ok ? "OK" : "FAILED";
    const style = response.ok ? chalk.green : chalk.red;
    audit(
        "access",
        `${chalk.cyan(ip)} accessed ${chalk.cyan(endpoint)}. (${response.status} ${status})`,
        style,
        project.log
    );
    return response;
}
export function inspectFault(
    server: Bun.Server,
    request: Request | null,
    thrown: unknown
): Fault {
    // Inspects fault
    if(thrown instanceof Fault) {
        audit(
            "fault",
            `${thrown.message} (${thrown.code})`,
            chalk.red,
            project.log
        );
        return thrown;
    }

    // Inspects error
    if(thrown instanceof Error) {
        audit(
            "error",
            `${thrown.message} (${thrown.name})`,
            chalk.red,
            project.log
        );
        return new faults.ServerFailure();
    }
    
    // Inspects exception
    {
        const error = new Error(String(thrown));
        audit(
            "error",
            `${error.message} (${error.name})`,
            chalk.red,
            project.log
        );
        return new faults.ServerFailure();
    }
}
export function inspectPing(
    server: Bun.Server,
    request: Request
): Request {
    // Inspects ping
    return request;
}
export function inspectServer(
    server: Bun.Server
): Bun.Server {
    // Inspects server
    audit(
        "server",
        `Server is listening on ${chalk.cyan(server.url.origin)}.`,
        chalk.green,
        project.log
    );
    return server;
}

// Exports
export default {
    inspectAccess,
    inspectFault,
    inspectPing,
    inspectServer
};
