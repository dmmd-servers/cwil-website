// Imports
import nodePath from "node:path";

// Defines paths constants
export const basepath = nodePath.resolve(import.meta.dir, "../");

// Defines sink constants
export const input = Bun.stdin.writer();
export const output = Bun.stdout.writer();

// Exports
export default {
    basepath,
    input,
    output
};
