// Imports
import listen from "./bunsvr/listen";
import pack from "./bunsvr/pack";
import inspect from "./library/inspect";
import project from "./library/project";
import router from "./library/router";

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
const server = listen(
    // Port
    project.port,

    // Pre-processor
    async (server, request) => {
        const ping = inspect.inspectPing(server, request);
        return ping;
    },

    // Router
    router,

    // Error handler
    async (server, request, thrown) => {
        const fault = inspect.inspectFault(server, request, thrown);
        const response = pack.resolveFault(fault);
        return response;
    },

    // Post-processor
    async (server, request, response) => {
        const access = inspect.inspectAccess(server, request, response);
        return access;
    }
);
inspect.inspectServer(server);
