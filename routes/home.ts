// Imports
import nodePath from "node:path";
import direct from "../core/direct";

// Defines route
export async function route(request: Request, server: Bun.Server): Promise<Response> {
    // Resolves home
    const filepath = nodePath.resolve(direct.root, "./assets/html/index.html");
    const file = Bun.file(filepath);
    return new Response(file);
}

// Exports
export default route;
