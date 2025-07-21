/**
 * VC-API (Verifiable Credentials API) Protocol Adapter
 * Handles W3C REST API for credential operations
 */
/**
 * VC-API Protocol Adapter
 * Handles VC-API REST operations for credential verification
 */
export class VCAPIAdapter {
    /**
     * Receives a VC-API verification request
     * @param request - The VC-API request
     * @returns Promise with presentation and original request
     */
    static async receivePresentation(request) {
        console.log("--- VC-API Request Received ---");
        console.log(`Method: ${request.method}`);
        console.log(`URL: ${request.url}`);
        console.log(`Content-Type: ${request.headers['content-type']}`);
        // Parse VC-API request
        let vcApiRequest;
        if (request.method === 'POST' && request.body) {
            vcApiRequest = request.body;
        }
        else {
            throw new Error('Invalid VC-API request format');
        }
        // Extract presentation from VC-API request
        const presentation = vcApiRequest.verifiablePresentation;
        if (!presentation) {
            throw new Error('No verifiable presentation found in VC-API request');
        }
        // Convert to standard request format
        const originalRequest = {
            id: `vc-api-${Date.now()}`,
            comment: 'VC-API verification request',
            request_credentials: [{ type: 'VerifiableCredential', required: true }],
            challenge: vcApiRequest.options?.challenge || `vc-api-challenge-${Date.now()}`
        };
        return { presentation, originalRequest };
    }
    /**
     * Creates a VC-API response
     * @param result - The verification result
     * @param options - Additional options for response formatting
     * @returns VC-API response
     */
    static createResponse(result, options) {
        console.log("--- Creating VC-API Response ---");
        const verificationResponse = {
            verified: result.status === 'verified',
            verificationResult: result,
            checks: options?.includeChecks ? [
                'proof',
                'expiration',
                'revocation',
                'schema'
            ] : [],
            ...(result.error && { errors: [result.error] }),
            ...(options?.includeWarnings && { warnings: [] })
        };
        const response = {
            status: result.status === 'verified' ? 200 : 400,
            headers: {
                'content-type': 'application/json',
                'cache-control': 'no-cache'
            },
            body: verificationResponse
        };
        return response;
    }
    /**
     * Validates a VC-API request
     * @param request - The request to validate
     * @returns Validation result
     */
    static validateRequest(request) {
        const errors = [];
        if (!request.method) {
            errors.push('HTTP method is required');
        }
        if (!request.url) {
            errors.push('URL is required');
        }
        if (request.method !== 'POST') {
            errors.push('Only POST method is supported for verification');
        }
        if (!request.headers['content-type']?.includes('application/json')) {
            errors.push('Content-Type must be application/json');
        }
        if (!request.body) {
            errors.push('Request body is required');
        }
        return {
            isValid: errors.length === 0,
            errors: errors.length > 0 ? errors : undefined
        };
    }
    /**
     * Creates a VC-API verification request
     * @param options - Request options
     * @returns VC-API request
     */
    static createVerificationRequest(options) {
        const vcApiRequest = {
            verifiablePresentation: options.presentation,
            options: {
                ...(options.challenge && { challenge: options.challenge }),
                ...(options.domain && { domain: options.domain })
            }
        };
        return {
            method: 'POST',
            url: options.endpoint,
            headers: {
                'content-type': 'application/json',
                'accept': 'application/json'
            },
            body: vcApiRequest
        };
    }
    /**
     * Handles VC-API error responses
     * @param error - The error to handle
     * @returns VC-API error response
     */
    static createErrorResponse(error) {
        return {
            status: 400,
            headers: {
                'content-type': 'application/json',
                'cache-control': 'no-cache'
            },
            body: {
                error: error.message,
                timestamp: new Date().toISOString()
            }
        };
    }
}
//# sourceMappingURL=vc-api.js.map