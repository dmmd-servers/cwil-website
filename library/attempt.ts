// Defines attempt methods
export function now<Value>(
    invoke: () => Value,
    fallback: Value
): Value {
    // Attempts value
    try {
        return invoke();
    }
    catch {
        return fallback;
    }
}
export async function wait<Value>(
    invoke: () => Value | Promise<Value>,
    fallback: Value
): Promise<Value> {
    // Atttempts value
    try {
        return await invoke();
    }
    catch {
        return fallback;
    }
}

// Exports
export default {
    now,
    wait
};
