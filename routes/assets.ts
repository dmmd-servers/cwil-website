// Imports
import nodePath from "node:path";
import direct from "../core/direct";
import faults from "../core/faults";

// Defines route
export async function route(url: URL, request: Request, server: Bun.Server): Promise<Response> {
    // Resolves asset
    const pattern = url.pathname.match(/^\/assets\/(.*)$/);
    if(pattern === null) throw new faults.RouteAbort();
    const filepath = nodePath.resolve(direct.assets, pattern[1]!);
    if(!filepath.startsWith(direct.assets)) throw new faults.MissingAsset();
    const file = Bun.file(filepath);
    if(!(await file.exists())) throw new faults.MissingAsset();
    return new Response(file, {
        headers: {
            "cache-control": "max-age=86400"
        }
    });
}

// Exports
export default route;
