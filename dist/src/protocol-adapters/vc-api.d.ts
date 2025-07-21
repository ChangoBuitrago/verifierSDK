/**
 * VC-API (Verifiable Credentials API) Protocol Adapter
 * Handles W3C REST API for credential operations
 */
import { VerifiablePresentation, PresentationRequest, VerificationResult } from '../types';
/**
 * VC-API request structure
 */
export interface VCAPIRequest {
    method: string;
    url: string;
    headers: Record<string, string>;
    body?: any;
    query?: Record<string, string>;
}
/**
 * VC-API response structure
 */
export interface VCAPIResponse {
    status: number;
    headers: Record<string, string>;
    body: any;
}
/**
 * VC-API verification request
 */
export interface VCAPIVerificationRequest {
    verifiablePresentation: VerifiablePresentation;
    options?: {
        challenge?: string;
        domain?: string;
        [key: string]: any;
    };
}
/**
 * VC-API verification response
 */
export interface VCAPIVerificationResponse {
    verified: boolean;
    verificationResult: VerificationResult;
    checks: string[];
    warnings?: string[];
    errors?: string[];
}
/**
 * VC-API Protocol Adapter
 * Handles VC-API REST operations for credential verification
 */
export declare class VCAPIAdapter {
    /**
     * Receives a VC-API verification request
     * @param request - The VC-API request
     * @returns Promise with presentation and original request
     */
    static receivePresentation(request: VCAPIRequest): Promise<{
        presentation: VerifiablePresentation;
        originalRequest: PresentationRequest;
    }>;
    /**
     * Creates a VC-API response
     * @param result - The verification result
     * @param options - Additional options for response formatting
     * @returns VC-API response
     */
    static createResponse(result: VerificationResult, options?: {
        includeChecks?: boolean;
        includeWarnings?: boolean;
    }): VCAPIResponse;
    /**
     * Validates a VC-API request
     * @param request - The request to validate
     * @returns Validation result
     */
    static validateRequest(request: VCAPIRequest): {
        isValid: boolean;
        errors?: string[];
    };
    /**
     * Creates a VC-API verification request
     * @param options - Request options
     * @returns VC-API request
     */
    static createVerificationRequest(options: {
        presentation: VerifiablePresentation;
        challenge?: string;
        domain?: string;
        endpoint: string;
    }): VCAPIRequest;
    /**
     * Handles VC-API error responses
     * @param error - The error to handle
     * @returns VC-API error response
     */
    static createErrorResponse(error: Error): VCAPIResponse;
}
//# sourceMappingURL=vc-api.d.ts.map