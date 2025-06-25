// Imports
import nodePath from "node:path";

// Defines root path
export const root = nodePath.resolve(import.meta.dir, "../");

// Defines relative paths
export const assets = nodePath.resolve(root, "./assets/");
export const contents = nodePath.resolve(root, "./static/");
export const gallery = nodePath.resolve(root, "./gallery/");
export const members = nodePath.resolve(root, "./members/");
export const mods = nodePath.resolve(root, "./mods/");
export const sqlites = nodePath.resolve(root, "./sqlites/");
export const worlds = nodePath.resolve(root, "./worlds/");

// Exports
export default {
    assets,
    contents,
    gallery,
    members,
    mods,
    root,
    sqlites,
    worlds
};
