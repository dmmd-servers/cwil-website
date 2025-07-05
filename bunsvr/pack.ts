// Imports
import type Fault from "./fault";

// Defines response resolvers
export function resolveEmpty(): Response {
    // Packs response
    const options = {
        status: 204
    };
    const response = new Response(null, options);
    return response;
}
export function resolveFault(fault: Fault): Response {
    // Packs fault
    const data = {
        code: fault.code,
        message: fault.message
    };
    const options = {
        status: fault.status
    };
    const response = Response.json(data, options);
    return response;
}
export function resolveFile(file: Bun.BunFile): Response {
    // Packs file
    const options = {
        headers: {
            "cache-control": "max-age=86400"
        }
    };
    const response = new Response(file, options);
    return response;
}
export function resolveJSON(data: object): Response {
    // Packs JSON
    const options = {
        headers: {
            "cache-control": "max-age=86400"
        }
    };
    const response = Response.json(data, options);
    return response;
}
export function resolveOK(): Response {
    // Packs response
    const response = new Response("OK");
    return response;
}
export function resolveRedirect(location: string): Response {
    // Packs redirect
    const options = {
        headers: {
            "location": location
        },
        status: 301
    };
    const response = new Response(null, options);
    return response;
}

// Exports
export default {
    resolveEmpty,
    resolveFault,
    resolveFile,
    resolveJSON,
    resolveOK,
    resolveRedirect
};
