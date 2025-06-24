// Imports
import nodePath from "node:path";
import direct from "../core/direct";
import faults from "../core/faults";

// Defines route
export async function route(url: URL, request: Request, server: Bun.Server): Promise<Response> {
    // Resolves static
    const pattern = url.pathname.match(/^\/(.*)$/);
    if(pattern === null) throw new faults.RouteAbort();
    const filepath = nodePath.resolve(direct.contents, pattern[1]!);
    if(!filepath.startsWith(direct.contents)) throw new faults.RouteAbort();
    const file = Bun.file(filepath);
    if(!(await file.exists())) throw new faults.RouteAbort();
    return new Response(file, {
        headers: {
            "cache-control": "max-age=86400"
        }
    });
}

// Exports
export default route;
