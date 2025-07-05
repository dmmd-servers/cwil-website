// Defines abstract fault class
export abstract class Fault extends Error {
    // Defines fields
    abstract readonly code: string;
    abstract readonly message: string;
    abstract readonly status: number;
    readonly name: string = "Fault";
}

// Exports
export default Fault;
