// Imports
import nodePath from "node:path";
import BunSqlite from "bun:sqlite";
import direct from "../core/direct";
import faults from "../core/faults";

// Creates database
const database = new BunSqlite(nodePath.resolve(direct.sqlites, "mods.sqlite"));
database.run(`
    CREATE TABLE IF NOT EXISTS mods (
        file UNIQUE PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        version TEXT NOT NULL,
        is_required INTEGER NOT NULL,
        is_optional INTEGER NOT NULL,
        is_client INTEGER NOT NULL,
        is_server INTEGER NOT NULL,
        is_active INTEGER NOT NULL,
        is_pending INTEGER NOT NULL,
        is_removed INTEGER NOT NULL,
        is_outdated INTEGER NOT NULL
    )    
`);

// Defines route
export async function route(url: URL, request: Request, server: Bun.Server): Promise<Response> {
    // Resolves asset
    if(url.pathname !== "/api/mods") throw new faults.RouteAbort();
    
    // Handles api
    switch(request.method) {
        case "GET": {
            const parameters = url.searchParams;
            const filters = [
                "is_required", "is_optional",
                "is_client", "is_server",
                "is_active", "is_pending",
                "is_removed", "is_outdated"
            ];
            const predicate = filters
                    .filter((filter) => parameters.get(filter) === "1")
                    .map((filter) => `${filter} = 1`)
                    .join(" AND ");
            const list = database.query(`
                SELECT * FROM mods
                ${predicate.length ? `WHERE ${predicate}` : ""}
            `).all();
            return Response.json(list, {
                headers: {
                    "cache-control": "max-age=86400"
                }
            });
        }
        case "POST": {
            try {
                const forms = await request.clone().formData();
                const jsonForm = forms.get("json");
                if(jsonForm === null) throw new faults.BadRequest();
                const fileForm = forms.get("file") as Bun.FormDataEntryValue | null;
                if(fileForm === null || !(fileForm instanceof Blob)) throw new faults.BadRequest();
                const jsonMold = {
                    file: "unspecified.jar",
                    name: "Unspecified Name",
                    description: "Unspecified description.",
                    version: "Unspecified Version",
                    is_required: 0,
                    is_optional: 0,
                    is_client: 0,
                    is_server: 0,
                    is_active: 0,
                    is_pending: 0,
                    is_removed: 0,
                    is_outdated: 0
                };
                const jsonKeys = Object.keys(jsonMold) as (keyof typeof jsonMold & string)[];
                const jsonData = Object.assign(jsonMold, JSON.parse(jsonForm.toString())) as typeof jsonMold;
                const filePath = nodePath.resolve(direct.mods, jsonData.file);
                if(!filePath.startsWith(direct.mods)) throw new faults.BadRequest();
                const fileData = Bun.file(filePath);
                if(await fileData.exists()) throw new faults.AlreadyExists();
                database.run(`
                    INSERT INTO mods (${jsonKeys.join(",")})
                    VALUES (${new Array(jsonKeys.length).fill("?").join(",")})
                `, jsonKeys.map((jsonKey) => jsonData[jsonKey]));
                await fileData.write(await (fileForm as Blob).arrayBuffer());
                return new Response(null, {
                    status: 201
                });
            }
            catch(thrown) {
                if(thrown instanceof faults.GenericFault) throw thrown;
                else throw new faults.BadRequest();
            }
        }
        case "PATCH": {
            try {
                const jsonData = await request.clone().json();
                if(!("file" in jsonData)) throw new faults.BadRequest();
                const filePath = nodePath.resolve(direct.mods, jsonData.file);
                if(!filePath.startsWith(direct.mods)) throw new faults.BadRequest();
                const jsonKeys = [
                    "name", "description", "version",
                    "is_required", "is_optional",
                    "is_client", "is_server",
                    "is_active", "is_pending",
                    "is_removed", "is_outdated"
                ].filter((jsonKey) => jsonKey in jsonData) as (keyof typeof jsonData & string)[];
                database.run(`
                    UPDATE mods
                    SET (${jsonKeys.map((jsonKey) => `${jsonKey} = ?`).join(",")})
                    WHERE file = ?
                `, jsonKeys.map((jsonKey) => jsonData[jsonKey]).concat([ jsonData.file ]));
                return new Response(null, {
                    status: 204
                });
            }
            catch(thrown) {
                console.log(thrown);
                if(thrown instanceof faults.GenericFault) throw thrown;
                else throw new faults.BadRequest();
            }
        }
        case "DELETE": {
            try {
                const jsonData = await request.clone().json();
                if(!("file" in jsonData)) throw new faults.BadRequest();
                const filePath = nodePath.resolve(direct.mods, jsonData.file);
                if(!filePath.startsWith(direct.mods)) throw new faults.BadRequest();
                const fileData = Bun.file(filePath);
                if(!await fileData.exists()) throw new faults.DoesntExist();
                database.run(`
                    DELETE FROM mods
                    WHERE file = ?
                `, [ jsonData.file ]);
                await fileData.delete();
                return new Response(null, {
                    status: 204
                });
            }
            catch(thrown) {
                if(thrown instanceof faults.GenericFault) throw thrown;
                else throw new faults.BadRequest();
            }
        }
        default: {
            throw new faults.MissingApi();
        }
    }
}

// Exports
export default route;
