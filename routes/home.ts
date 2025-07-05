// Imports
import grab from "../bunsvr/grab";
import pack from "../bunsvr/pack";
import faults from "../library/faults";
import paths from "../library/paths";

// Defines route
export async function route(server: Bun.Server, request: Request, url: URL): Promise<Response> {
    // Returns page
    const file = await grab.resolveFile("html/index.html", paths.assets);
    if(file === null) throw new faults.RouteAbort();
    return pack.resolveFile(file);
}

// Exports
export default route;
