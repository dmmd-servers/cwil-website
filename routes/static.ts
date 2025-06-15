// Imports
import nodePath from "node:path";
import direct from "../core/direct";
import faults from "../core/faults";

// Defines route
export async function route(request: Request, server: Bun.Server): Promise<Response> {
    // Parses url
    const url = new URL(request.url);
    const target = url.pathname.match(/^\/(.*)$/);
    if(target === null) throw new faults.RouteAbort();

    // Resolves static
    const filepath = nodePath.resolve(direct.contents, target[1]!);
    if(!filepath.startsWith(direct.contents)) throw new faults.MissingEndpoint();
    const file = Bun.file(filepath);
    if(!(await file.exists())) throw new faults.RouteAbort();
    return new Response(file);
}

// Exports
export default route;
