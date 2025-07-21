/**
 * SIOP (Self-Issued OpenID Provider) Protocol Adapter
 * Handles OIDC extension for self-issued credentials
 */
/**
 * SIOP Protocol Adapter
 * Handles SIOP authentication with self-issued credentials
 */
export class SIOPAdapter {
    /**
     * Receives a SIOP authentication request
     * @param request - The SIOP request from the client
     * @returns Promise with presentation and original request
     */
    static async receivePresentation(request) {
        console.log("--- SIOP Request Received ---");
        console.log(`Client ID: ${request.client_id}`);
        console.log(`Scope: ${request.scope}`);
        console.log(`Response Type: ${request.response_type}`);
        // Parse SIOP request into standard format
        const originalRequest = {
            id: `siop-${Date.now()}`,
            comment: `SIOP authentication for ${request.client_id}`,
            request_credentials: [{ type: 'VerifiableCredential', required: true }],
            challenge: request.nonce || `siop-challenge-${Date.now()}`
        };
        // In a real implementation, this would extract the presentation
        // from the SIOP request or wait for the user to present credentials
        // For demo purposes, we'll return a mock presentation
        const presentation = {
            '@context': ['https://www.w3.org/2018/credentials/v1'],
            type: ['VerifiablePresentation'],
            verifiableCredential: [],
            holder: 'did:example:holder',
            proof: {
                type: 'Ed25519Signature2020',
                created: new Date().toISOString(),
                verificationMethod: 'did:example:holder#key-1',
                proofPurpose: 'authentication',
                proofValue: 'mock-siop-signature'
            }
        };
        return { presentation, originalRequest };
    }
    /**
     * Creates a SIOP response
     * @param result - The verification result
     * @param options - Additional options for response formatting
     * @returns SIOP response
     */
    static createResponse(result, options) {
        console.log("--- Creating SIOP Response ---");
        if (!options?.clientId) {
            throw new Error('SIOP response requires client ID');
        }
        // Create ID token with verification result
        const idToken = {
            iss: 'did:example:siop-provider',
            sub: 'did:example:holder',
            aud: options.clientId,
            exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiry
            iat: Math.floor(Date.now() / 1000),
            ...(options.nonce && { nonce: options.nonce }),
            verificationResult: {
                status: result.status,
                ...(result.policyResults && { policyResults: result.policyResults }),
                ...(result.error && { error: result.error })
            }
        };
        const response = {
            token_type: 'Bearer',
            id_token: JSON.stringify(idToken), // In real implementation, this would be JWT
            ...(options.state && { state: options.state }),
            ...(options.accessToken && { access_token: options.accessToken }),
            expires_in: 3600
        };
        return response;
    }
    /**
     * Validates a SIOP request
     * @param request - The request to validate
     * @returns Validation result
     */
    static validateRequest(request) {
        const errors = [];
        if (!request.response_type) {
            errors.push('Response type is required');
        }
        if (!request.client_id) {
            errors.push('Client ID is required');
        }
        if (!request.scope) {
            errors.push('Scope is required');
        }
        if (request.response_type !== 'id_token') {
            errors.push('Only id_token response type is supported');
        }
        if (!request.scope.includes('openid')) {
            errors.push('OpenID scope is required');
        }
        return {
            isValid: errors.length === 0,
            errors: errors.length > 0 ? errors : undefined
        };
    }
    /**
     * Creates a SIOP authentication request
     * @param options - Request options
     * @returns SIOP request
     */
    static createAuthenticationRequest(options) {
        return {
            response_type: 'id_token',
            client_id: options.clientId,
            scope: options.scope || 'openid',
            ...(options.state && { state: options.state }),
            ...(options.nonce && { nonce: options.nonce }),
            ...(options.responseMode && { response_mode: options.responseMode })
        };
    }
    /**
     * Extracts verification result from SIOP ID token
     * @param idToken - The SIOP ID token
     * @returns Verification result
     */
    static extractVerificationResult(idToken) {
        return idToken.verificationResult || null;
    }
}
//# sourceMappingURL=siop.js.map