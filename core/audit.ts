// Imports
import chalk from "chalk";
import clock from "./clock";
import project from "./project";

// Defines audit function
export function audit(head: string, body: string, style: typeof chalk): void {
    // Writes message
    const now = new Date();
    const date = clock.resolveDate(now);
    const time = clock.resolveTime(now);
    const message = style(`[${date} @ ${time}] ${head.toUpperCase()} | ${body}\n`);
    project.log.write(message);
}

// Exports
export default audit;
