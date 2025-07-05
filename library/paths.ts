// Imports
import nodePath from "node:path";
import system from "../bunsvr/system";

// Defines paths
export const assets = nodePath.resolve(system.basepath, "./assets/");
export const base = system.basepath;
export const resources = nodePath.resolve(system.basepath, "./resources/");

// Exports
export default {
    assets,
    base,
    resources
};
