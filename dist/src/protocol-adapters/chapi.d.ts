/**
 * CHAPI (Credential Handler API) Protocol Adapter
 * Handles browser-based credential exchange for web applications
 */
import { VerifiablePresentation, PresentationRequest, VerificationResult } from '../types';
/**
 * CHAPI request structure
 */
export interface CHAPIRequest {
    type: string;
    credentialType?: string[];
    challenge?: string;
    domain?: string;
    [key: string]: any;
}
/**
 * CHAPI response structure
 */
export interface CHAPIResponse {
    type: string;
    dataType: string;
    data: any;
    [key: string]: any;
}
/**
 * CHAPI credential request
 */
export interface CHAPICredentialRequest {
    web: {
        VerifiablePresentation: {
            query: {
                type: string[];
                [key: string]: any;
            };
            challenge?: string;
            domain?: string;
        };
    };
}
/**
 * CHAPI Protocol Adapter
 * Handles CHAPI credential requests for web applications
 */
export declare class CHAPIAdapter {
    /**
     * Receives a CHAPI credential request
     * @param request - The CHAPI request from the browser
     * @returns Promise with presentation and original request
     */
    static receivePresentation(request: CHAPIRequest): Promise<{
        presentation: VerifiablePresentation;
        originalRequest: PresentationRequest;
    }>;
    /**
     * Creates a CHAPI response
     * @param result - The verification result
     * @param options - Additional options for response formatting
     * @returns CHAPI response
     */
    static createResponse(result: VerificationResult, options?: {
        domain?: string;
        challenge?: string;
    }): CHAPIResponse;
    /**
     * Validates a CHAPI request
     * @param request - The request to validate
     * @returns Validation result
     */
    static validateRequest(request: CHAPIRequest): {
        isValid: boolean;
        errors?: string[];
    };
    /**
     * Creates a CHAPI credential request for the browser
     * @param options - Request options
     * @returns CHAPI credential request
     */
    static createCredentialRequest(options: {
        credentialTypes: string[];
        challenge?: string;
        domain?: string;
    }): CHAPICredentialRequest;
}
//# sourceMappingURL=chapi.d.ts.map