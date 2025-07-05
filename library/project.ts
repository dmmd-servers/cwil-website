// Imports
import system from "../bunsvr/system";

// Defines project constants
export const log = system.output;
export const port = +(process.env.PORT ?? "3000");

// Exports
export default {
    log,
    port
};
