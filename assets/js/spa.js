/* SPA v1.1.1 @ DmmD GM */

// Initializes spa
void async function() {
    // Handles redirect
    if(location.pathname === "/home") window.location.replace("/");

    // Fetches main element
    const main = document.getElementsByTagName("main").item(0);
    if(main === null) throw new Error("Unable to resolve main element.");

    // Creates cache
    const cache = new Map();

    // Creates listeners
    window.addEventListener("click", async (event) => {
        // Overrides redirect
        if(event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
        if(event.button !== 0) return;
        if(event.defaultPrevented) return;
        const target = event.target;
        if(!(target instanceof HTMLAnchorElement)) return;
        if(target.origin !== window.location.origin) return;
        if(target.attributes.getNamedItem("data-ignore-spa") !== null) return;
        event.preventDefault();
        if(target.pathname === location.pathname) return;
        
        // Resolves page
        let page;
        try {
            page = await resolve(target.pathname);
        }
        catch {
            page = await resolve("/error");
        }

        // Executes render
        const state = {
            page: page
        };
        window.history.pushState(state, "", target.pathname);
        paint(state.page);
    });
    window.addEventListener("popstate", async (event) => {
        // Executes render
        const state = event.state;
        paint(state.page);
    });

    // Executes first render
    try {
        paint(await resolve(location.pathname));
    }
    catch {
        paint(await resolve("/error"));
    }

    // Defines spa handlers
    async function resolve(pathname) {
        // Checks cache
        const pagename = pathname === "/" ? "/home" : pathname; 
        const hit = cache.get(pagename);
        if(typeof hit !== "undefined") return hit;

        // Requests page
        const result = await fetch("/assets/pages" + pagename + ".html");
        if(!result.ok) throw new Error("Failed to request page.");
        const page = await result.text();
        cache.set(pagename, page);
        return page;
    }
    function paint(page) {
        // Overwrites main
        main.innerHTML = page;

        // Loads scripts
        const scripts = main.querySelectorAll("script");
        scripts.forEach((script) => {
            const clone = document.createElement("script");
            for(let i = 0; i < script.attributes.length; i++) {
                const attribute = script.attributes[i];
                clone.setAttribute(attribute.name, attribute.value);
            }
            clone.text = script.text;
            script.parentNode.replaceChild(clone, script);
        });
    }
}();
