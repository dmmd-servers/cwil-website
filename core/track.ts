// Defines privacy handlers
export function resolveConsent(request: Request): boolean {
    // Checks consent headers
    if(request.headers.get("DNT") === "1") return false;
    if(request.headers.get("Sec-GPC") === "1") return false;
    
    // Assumes consent
    return true;
}
export function resolveIp(server: Bun.Server, request: Request): string {
    // Anonymizes do-not-track requests
    const consent = resolveConsent(request);
    if(!consent) return "::anonymous";

    // Resolves ip
    const cloudflareIp = request.headers.get("CF-Connecting-IP");
    if(cloudflareIp !== null) return cloudflareIp;
    const serverIp = server.requestIP(request);
    if(serverIp !== null) return serverIp.address;

    // Returns unknown
    return "::unknown";
}

// Exports
export default {
    resolveConsent,
    resolveIp
};
