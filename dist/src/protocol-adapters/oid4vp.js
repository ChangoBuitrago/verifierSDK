/**
 * OID4VP Protocol Adapter
 * Handles OpenID Connect for Verifiable Presentations protocol specifics
 */
export class OID4VP_Adapter {
    /**
     * Receives and parses an OID4VP presentation request
     * @param httpRequest - The HTTP request object
     * @returns Promise<Object> - Parsed presentation and original request
     */
    static async receivePresentation(httpRequest) {
        console.log("=== OID4VP Adapter: Processing presentation request ===");
        try {
            // Extract the VP token from the request body
            const vpToken = httpRequest.body?.vp_token;
            if (!vpToken) {
                throw new Error('No vp_token found in request body');
            }
            console.log("   Extracted vp_token from request body");
            // Parse the VP token (in a real implementation, this might be JWT)
            let vp;
            try {
                if (typeof vpToken === 'string') {
                    vp = JSON.parse(vpToken);
                }
                else {
                    vp = vpToken;
                }
            }
            catch (parseError) {
                throw new Error(`Failed to parse vp_token: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
            }
            // Extract the original request from session or request parameters
            const sessionData = await this.getSessionData(httpRequest.sessionID);
            const originalRequest = sessionData?.presentationDefinition;
            if (!originalRequest) {
                console.log("   Warning: No original request found in session");
            }
            console.log("   Successfully parsed OID4VP request");
            return {
                vp,
                originalRequest,
                sessionId: httpRequest.sessionID,
                clientId: httpRequest.body?.client_id
            };
        }
        catch (error) {
            console.log(`   OID4VP parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            throw error;
        }
    }
    /**
     * Creates an OID4VP response
     * @param verificationResult - The verification result from the SDK
     * @param options - Response options
     * @returns OID4VPResponse - Formatted OID4VP response
     */
    static createResponse(verificationResult, options = {}) {
        console.log("=== OID4VP Adapter: Creating response ===");
        const response = {
            status: verificationResult.status,
            timestamp: new Date().toISOString(),
            sessionId: options.sessionId
        };
        // Add verification details based on the result
        if (verificationResult.status === 'verified') {
            response.verified = true;
            // Add credential-specific data
            if (verificationResult.credential) {
                response.credential = verificationResult.credential;
            }
            if (verificationResult.mdoc) {
                response.mdoc = verificationResult.mdoc;
            }
            if (verificationResult.dataElements) {
                response.dataElements = verificationResult.dataElements;
            }
        }
        else {
            response.verified = false;
            response.reason = verificationResult.error;
        }
        console.log(`   Response created: ${response.status}`);
        return response;
    }
    /**
     * Validates OID4VP request parameters
     * @param request - The request to validate
     * @returns ValidationResult - Validation result
     */
    static validateRequest(request) {
        console.log("=== OID4VP Adapter: Validating request ===");
        const errors = [];
        // Check required fields
        if (!request.body) {
            errors.push('Request body is required');
        }
        if (!request.body?.vp_token) {
            errors.push('vp_token is required');
        }
        if (!request.sessionID) {
            errors.push('Session ID is required');
        }
        const isValid = errors.length === 0;
        if (isValid) {
            console.log("   Request validation passed");
        }
        else {
            console.log(`   Request validation failed: ${errors.join(', ')}`);
        }
        return { isValid, errors };
    }
    /**
     * Simulates retrieving session data (in a real implementation, this would access a database)
     * @param sessionId - The session ID
     * @returns Promise<SessionData|null> - Session data or null
     */
    static async getSessionData(sessionId) {
        // In a real implementation, this would query a database or cache
        console.log(`   Retrieving session data for: ${sessionId}`);
        // Simulate session data
        const mockSessionData = {
            presentationDefinition: {
                id: "example-presentation-definition",
                request_credentials: [
                    {
                        type: "VerifiableCredential",
                        required: true,
                        constraints: {}
                    }
                ],
                challenge: "example-challenge"
            },
            clientId: "example-client",
            state: "example-state",
            nonce: "example-nonce"
        };
        return mockSessionData;
    }
    /**
     * Extracts client information from the request
     * @param request - The HTTP request
     * @returns Object - Client information
     */
    static extractClientInfo(request) {
        return {
            clientId: request.body?.client_id,
            redirectUri: request.body?.redirect_uri,
            responseType: request.body?.response_type,
            scope: request.body?.scope
        };
    }
}
//# sourceMappingURL=oid4vp.js.map