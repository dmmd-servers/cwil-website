// Imports
import nodePath from "node:path";

// Defines root path
export const root = nodePath.resolve(import.meta.dir, "../");

// Defines relative paths
export const assets = nodePath.resolve(root, "./assets/");
export const contents = nodePath.resolve(root, "./static/");

// Exports
export default {
    assets,
    contents,
    root
};
