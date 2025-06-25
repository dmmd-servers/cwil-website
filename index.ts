// Imports
import nodeFile from "node:fs/promises";
import chalk from "chalk";
import audit from "./core/audit";
import direct from "./core/direct";
import faults from "./core/faults";
import project from "./core/project";
import track from "./core/track";

// Ensures files directory
{
    await ensureDirpath(direct.gallery);
    await ensureDirpath(direct.members);
    await ensureDirpath(direct.mods);
    await ensureDirpath(direct.sqlites);
    await ensureDirpath(direct.worlds);
    async function ensureDirpath(dirpath: string): Promise<void> {
        try {
            audit("ensure", `Ensuring directory "${dirpath}"...`, chalk.yellow);
            await nodeFile.mkdir(dirpath);
            audit("ensure", `Directory "${dirpath}" successfully created!`, chalk.green);
        }
        catch {
            audit("ensure", `Directory "${dirpath}" already created!`, chalk.green);
        }
    }
}

// Creates server
const server = Bun.serve({
    development: false,
    fetch: async (request) => {
        // Resolves access
        const url: URL = new URL(request.url);
        let response: Response;
        try {
            // Creates response
            response = await project.router(url, request, server);
        }
        catch(thrown) {            
            // Resolves thrown
            const fault = thrown instanceof faults.GenericFault ? thrown : new faults.ServerFailure();
            const error = thrown instanceof Error ? thrown : new Error(String(thrown));
            
            // Audits thrown
            if(thrown instanceof faults.GenericFault) {
                const body = `${fault.message} (${fault.code})`;
                audit("fault", body, chalk.red);
            }
            else {
                const body = `${error.message} (${error.name})`;
                audit("error", body, chalk.red);
            }
            
            // Creates response
            response = Response.json({
                code: fault.code,
                message: fault.message
            }, fault.status);
        }
            
        // Audits access
        {
            const ip = track.resolveIp(server, request);
            const endpoint = `${request.method} ${url.pathname + url.search}`;
            const status = `${response.status} ${response.ok ? "OK" : "FAILED"}`;
            const body = `${chalk.cyan(ip)} accessed ${chalk.cyan(endpoint)}. (${status})`;
            audit("access", body, response.ok ? chalk.green : chalk.red);
        }

        // Returns response
        return response;
    },
    port: project.port
});

// Audits server
{
    const lan = `http://localhost:${project.port}/`;
    const body = `Server is now listening on ${chalk.cyan(lan)}.`;
    audit("server", body, chalk.green);
}
