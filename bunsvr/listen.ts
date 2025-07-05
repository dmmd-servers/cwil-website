// Defines server listener
export function listen(
    port: number,
    analyze: (server: Bun.Server, request: Request) => Request | Promise<Request>,
    route: (server: Bun.Server, request: Request) => Response | Promise<Response>,
    fix: (server: Bun.Server, request: Request | null, thrown: unknown) => Response | Promise<Response>,
    inspect: (server: Bun.Server, request: Request | null, response: Response) => Response | Promise<Response>
): Bun.Server {
    // Creates server
    const server = Bun.serve({
        development: false,
        error: async (thrown) => {
            // Resolves access
            const response = await fix(server, null, thrown);
            const outbound = await inspect(server, null, response);
            return outbound;
        },
        fetch: async (inbound) => {
            // Resolves access
            const request = await analyze(server, inbound);
            try {
                const response = await route(server, request);
                const outbound = await inspect(server, request, response);
                return outbound;
            }
            catch(thrown) {
                const response = await fix(server, request, thrown);
                const outbound = await inspect(server, request, response);
                return outbound;
            }
        },
        port: port
    });
    return server;
}

// Exports
export default listen;
