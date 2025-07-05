// Imports
import grab from "../bunsvr/grab";
import pack from "../bunsvr/pack";
import faults from "../library/faults";
import paths from "../library/paths";

// Defines route
export async function route(server: Bun.Server, request: Request, url: URL): Promise<Response> {
    // Checks pathname
    const pattern = url.pathname.match(/^\/(.*)$/);
    if(pattern === null) throw new faults.RouteAbort();

    // Returns resource
    const file = await grab.resolveFile(pattern[1]!, paths.resources);
    if(file === null) throw new faults.RouteAbort();
    return pack.resolveFile(file);
}

// Exports
export default route;
