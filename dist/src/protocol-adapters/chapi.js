/**
 * CHAPI (Credential Handler API) Protocol Adapter
 * Handles browser-based credential exchange for web applications
 */
/**
 * CHAPI Protocol Adapter
 * Handles CHAPI credential requests for web applications
 */
export class CHAPIAdapter {
    /**
     * Receives a CHAPI credential request
     * @param request - The CHAPI request from the browser
     * @returns Promise with presentation and original request
     */
    static async receivePresentation(request) {
        console.log("--- CHAPI Request Received ---");
        console.log(`Request Type: ${request.type}`);
        console.log(`Domain: ${request.domain}`);
        // Parse CHAPI request into standard format
        const originalRequest = {
            id: `chapi-${Date.now()}`,
            comment: 'CHAPI credential request',
            request_credentials: request.credentialType ?
                request.credentialType.map(type => ({ type, required: true })) :
                [{ type: 'VerifiableCredential', required: true }],
            challenge: request.challenge || `challenge-${Date.now()}`
        };
        // In a real implementation, this would trigger the credential handler
        // and wait for the user to select and present credentials
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
                proofValue: 'mock-chapi-signature'
            }
        };
        return { presentation, originalRequest };
    }
    /**
     * Creates a CHAPI response
     * @param result - The verification result
     * @param options - Additional options for response formatting
     * @returns CHAPI response
     */
    static createResponse(result, options) {
        console.log("--- Creating CHAPI Response ---");
        const response = {
            type: 'VerifiablePresentation',
            dataType: 'VerifiablePresentation',
            data: {
                verificationResult: result,
                status: result.status,
                timestamp: new Date().toISOString(),
                ...(options?.domain && { domain: options.domain }),
                ...(options?.challenge && { challenge: options.challenge }),
                ...(result.policyResults && { policyResults: result.policyResults }),
                ...(result.error && { error: result.error })
            }
        };
        return response;
    }
    /**
     * Validates a CHAPI request
     * @param request - The request to validate
     * @returns Validation result
     */
    static validateRequest(request) {
        const errors = [];
        if (!request.type) {
            errors.push('Request type is required');
        }
        if (request.type !== 'VerifiablePresentation') {
            errors.push('Only VerifiablePresentation requests are supported');
        }
        return {
            isValid: errors.length === 0,
            errors: errors.length > 0 ? errors : undefined
        };
    }
    /**
     * Creates a CHAPI credential request for the browser
     * @param options - Request options
     * @returns CHAPI credential request
     */
    static createCredentialRequest(options) {
        return {
            web: {
                VerifiablePresentation: {
                    query: {
                        type: options.credentialTypes
                    },
                    ...(options.challenge && { challenge: options.challenge }),
                    ...(options.domain && { domain: options.domain })
                }
            }
        };
    }
}
//# sourceMappingURL=chapi.js.map