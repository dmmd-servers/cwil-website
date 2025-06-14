// Imports
import chalk from "chalk";
import audit from "../core/audit";
import faults from "../core/faults";

// Defines subroutes
const subroutes = [
    await import("./assets"),
    await import("./static"),
    await import("./home")
].map((imported) => imported.default);

// Defines route
export async function route(request: Request, server: Bun.Server): Promise<Response> {
    // Resolves request
    try {
        // Attempts subroutes
        for(let i = 0; i < subroutes.length; i++) {
            const subroute = subroutes[i]!;
            try {
                const response = await subroute(request, server);
                return response;
            }
            catch(thrown) {
                if(thrown instanceof faults.RouteAbort) continue;
                throw thrown;
            }
        }
        throw new faults.MissingEndpoint();
    }
    catch(thrown) {            
        // Creates fallback response
        const fault = thrown instanceof faults.GenericFault ? thrown : new faults.ServerFailure();
        const error = thrown instanceof Error ? thrown : new Error(String(thrown));
        const response = Response.json({
            code: fault.code,
            message: fault.message
        }, fault.status);
        
        // Audits thrown
        if(thrown instanceof faults.GenericFault) {
            const body = `${fault.message} (${fault.code})`;
            audit("fault", body, chalk.red);
        }
        else {
            const body = `${error.message} (${error.name})`;
            audit("error", body, chalk.red);
        }

        // Returns response
        return response;
    }
}

// Exports
export default route;
