// Imports
import nodePath from "node:path";
import direct from "../core/direct";
import faults from "../core/faults";

// Defines route
export async function route(url: URL, request: Request, server: Bun.Server): Promise<Response> {
    // Resolves home
    if(url.pathname !== "/") throw new faults.RouteAbort();
    const filepath = nodePath.resolve(direct.root, "./assets/html/index.html");
    const file = Bun.file(filepath);
    return new Response(file);
}

// Exports
export default route;
