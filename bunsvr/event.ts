// Defines event class
export class Event<Table extends Record<string, (...parameters: any[]) => void | Promise<void>>> {
    // Defines field
    private readonly table: Partial<Record<keyof Table, Table[keyof Table][]>> = {};

    // Defines emit method
    emit<Name extends keyof Table>(
        name: Name,
        ...parameters: Parameters<Table[Name]>
    ): void {
        // Emits event
        const list = this.table[name];
        if(typeof list === "undefined") return;
        for(let i = 0; i < list.length; i++) list[i]!(...parameters);
    }

    // Defines listener methods
    off<Name extends keyof Table>(
        name: Name,
        listener: Table[Name]
    ): void {
        // Removes listener
        const list = this.table[name];
        if(typeof list === "undefined") return;
        for(let i = list.length - 1; i >= 0; i--)
            if(list[i]! === listener) list.splice(i, 1);
        if(list.length === 0) delete this.table[name];
    }
    on<Name extends keyof Table>(
        name: Name,
        listener: Table[Name]
    ): void {
        // Appends listener
        const list = this.table[name];
        if(typeof list === "undefined") this.table[name] = [ listener ];
        else list.push(listener);
    }
}

// Exports
export default Event;
