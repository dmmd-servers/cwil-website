// Imports
import faults from "../library/faults";

// Defines subroutes
const subroutes = [
    await import("./api"),
    await import("./assets"),
    await import("./resources"),
    await import("./home")
].map((imported) => imported.default);

// Defines route
export async function route(server: Bun.Server, request: Request): Promise<Response> {
    // Resolves subroutes
    const url = new URL(request.url);
    for(let i = 0; i < subroutes.length; i++) {
        try {
            const subroute = subroutes[i]!;
            const response = await subroute(server, request, url);
            return response;
        }
        catch(thrown) {
            if(thrown instanceof faults.RouteAbort) continue;
            throw thrown;
        }
    }
    throw new faults.MissingEndpoint();
}

// Exports
export default route;
