/**
 * SIOP (Self-Issued OpenID Provider) Protocol Adapter
 * Handles OIDC extension for self-issued credentials
 */
import { VerifiablePresentation, PresentationRequest, VerificationResult } from '../types';
/**
 * SIOP request structure
 */
export interface SIOPRequest {
    response_type: string;
    client_id: string;
    scope: string;
    state?: string;
    nonce?: string;
    response_mode?: string;
    request?: string;
    request_uri?: string;
    [key: string]: any;
}
/**
 * SIOP response structure
 */
export interface SIOPResponse {
    access_token?: string;
    token_type: string;
    expires_in?: number;
    id_token: string;
    state?: string;
    [key: string]: any;
}
/**
 * SIOP ID Token structure
 */
export interface SIOPIDToken {
    iss: string;
    sub: string;
    aud: string;
    exp: number;
    iat: number;
    nonce?: string;
    vp_token?: string;
    presentation_submission?: any;
    [key: string]: any;
}
/**
 * SIOP Protocol Adapter
 * Handles SIOP authentication with self-issued credentials
 */
export declare class SIOPAdapter {
    /**
     * Receives a SIOP authentication request
     * @param request - The SIOP request from the client
     * @returns Promise with presentation and original request
     */
    static receivePresentation(request: SIOPRequest): Promise<{
        presentation: VerifiablePresentation;
        originalRequest: PresentationRequest;
    }>;
    /**
     * Creates a SIOP response
     * @param result - The verification result
     * @param options - Additional options for response formatting
     * @returns SIOP response
     */
    static createResponse(result: VerificationResult, options?: {
        clientId: string;
        state?: string;
        nonce?: string;
        accessToken?: string;
    }): SIOPResponse;
    /**
     * Validates a SIOP request
     * @param request - The request to validate
     * @returns Validation result
     */
    static validateRequest(request: SIOPRequest): {
        isValid: boolean;
        errors?: string[];
    };
    /**
     * Creates a SIOP authentication request
     * @param options - Request options
     * @returns SIOP request
     */
    static createAuthenticationRequest(options: {
        clientId: string;
        scope?: string;
        state?: string;
        nonce?: string;
        responseMode?: string;
    }): SIOPRequest;
    /**
     * Extracts verification result from SIOP ID token
     * @param idToken - The SIOP ID token
     * @returns Verification result
     */
    static extractVerificationResult(idToken: SIOPIDToken): VerificationResult | null;
}
//# sourceMappingURL=siop.d.ts.map