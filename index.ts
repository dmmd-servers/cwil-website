// Imports
import chalk from "chalk";
import access from "./core/access";
import audit from "./core/audit";
import project from "./core/project";

// Creates server
const server = Bun.serve({
    development: false,
    fetch: async (request) => {
        // Creates response
        const response = await access(request, server);
        return response;
    },
    port: project.port
});

// Audits server
const url = `http://localhost:${project.port}/`;
const body = `Server is now listening on ${chalk.cyan(url)}.`;
audit("server", body, chalk.green);
