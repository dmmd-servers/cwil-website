// Imports
import chalk from "chalk";

// Defines audit handler
export function audit(
    head: string,
    body: string,
    style: typeof chalk,
    output: Bun.FileSink
): void {
    // Formats now
    const now = new Date();
    const year = now.getFullYear().toString().padStart(4, "0");
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const hour = (now.getHours() % 12 || 12).toString().padStart(2, "0");
    const minute = now.getMinutes().toString().padStart(2, "0");
    const second = now.getSeconds().toString().padStart(2, "0");
    const millisecond = now.getMilliseconds().toString().padStart(3, "0");
    const meridian = now.getHours() < 12 ? "AM" : "PM";

    // Writes message
    const clock = `[${year}-${month}-${day} @ ${hour}:${minute}:${second}.${millisecond} ${meridian}]`;
    const content = `${head.toUpperCase()} | ${body}`;
    const message = style(`${clock} ${content}\n`);
    output.write(message);
}

// Exports
export default audit;
