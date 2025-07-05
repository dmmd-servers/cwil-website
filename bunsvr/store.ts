// Imports
import BunSqlite from "bun:sqlite";

// Defines store class
export class Store<Schema extends Record<string, Buffer | string | number | null>> {
    // Defines fields
    private readonly database: BunSqlite;
    private readonly table: string;

    // Defines constructor
    constructor(location: string, table: string) {
        // Initializes fields
        this.database = new BunSqlite(location);
        this.table = table;
    }

    // Defines table methods
    create(layout: Record<keyof Schema, string>): void {
        // Creates table
        const pairs = Object.entries(layout);
        this.database.run(`
            CREATE TABLE IF NOT EXISTS ${this.table}
            (${pairs.map((pair) => pair.join(" ")).join(",")})
        `);
    }
    drop(): void {
        // Drops table
        this.database.run(`
            DROP TABLE IF EXISTS ${this.table}
        `);
    }

    // Defines modification methods
    append(data: Schema): void {
        // Appends data
        const pairs = Object.entries(data);
        this.database.run(`
            INSERT INTO ${this.table}
            (${pairs.map((pair) => pair[0]).join(",")})
            VALUES (${new Array(pairs.length).fill("?").join(",")})
        `, pairs.map((pair) => pair[1]));
    }
    remove(
        conditions: string[],
        parameters: (Buffer | string | number | null)[]
    ): void {
        // Removes data
        this.database.run(`
            DELETE FROM ${this.table}
            ${conditions.join(" ")}
        `, parameters);
    }
    update(
        data: Partial<Schema>,
        conditions: string[],
        parameters: (Buffer | string | number | null)[]
    ): void {
        // Updates data
        const pairs = Object.entries(data);
        this.database.run(`
            UPDATE ${this.table}
            SET (${pairs.map((pair) => `${pair[0]} = ?`).join(",")})
            ${conditions.join(" ")}
        `, pairs.map((pair) => pair[1]).concat(...parameters));
    }

    // Defines retrieval methods
    pick<Keys extends (keyof Schema)[]>(
        keys: Keys,
        conditions: string[],
        parameters: (Buffer | string | number | null)[]
    ): Pick<Schema, Keys[number]> | null {
        // Retrieves data
        const data = this.database.query(`
            SELECT ${keys.join(",")}
            FROM ${this.table}
            ${conditions.join(" ")}
        `).get(...parameters);
        return data as Pick<Schema, Keys[number]> | null;
    }
    pickAll<Keys extends (keyof Schema)[]>(
        keys: Keys,
        conditions: string[],
        parameters: (Buffer | string | number | null)[]
    ): Pick<Schema, Keys[number]>[] {
        // Retrieves all data
        const data = this.database.query(`
            SELECT ${keys.join(",")}
            FROM ${this.table}
            ${conditions.join(" ")}
        `).all(...parameters);
        return data as Pick<Schema, Keys[number]>[];
    }
    query(
        conditions: string[],
        parameters: (Buffer | string | number | null)[]
    ): Schema | null {
        // Retrieves data
        const data = this.database.query(`
            SELECT *
            FROM ${this.table}
            ${conditions.join(" ")}
        `).get(...parameters);
        return data as Schema | null;
    }
    queryAll(
        conditions: string[],
        parameters: (Buffer | string | number | null)[]
    ): Schema[] {
        // Retrieves all data
        const data = this.database.query(`
            SELECT *
            FROM ${this.table}
            ${conditions.join(" ")}
        `).all(...parameters);
        return data as Schema[];
    }
}

// Exports
export default Store;
