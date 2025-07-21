/**
 * OID4VP Protocol Adapter
 * Handles OpenID Connect for Verifiable Presentations protocol specifics
 */
import { VerifiablePresentation, PresentationRequest, VerificationResult } from '../types';
export interface OID4VPRequest {
    body?: {
        vp_token?: string | VerifiablePresentation;
        client_id?: string;
        redirect_uri?: string;
        response_type?: string;
        scope?: string;
    };
    sessionID?: string;
}
export interface OID4VPResponse {
    status: 'verified' | 'rejected';
    type?: string;
    timestamp: string;
    sessionId?: string;
    verified?: boolean;
    credentialType?: string;
    credential?: any;
    mdoc?: any;
    dataElements?: any;
    reason?: string;
}
export interface SessionData {
    presentationDefinition: PresentationRequest;
    clientId: string;
    state: string;
    nonce: string;
}
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}
export declare class OID4VP_Adapter {
    /**
     * Receives and parses an OID4VP presentation request
     * @param httpRequest - The HTTP request object
     * @returns Promise<Object> - Parsed presentation and original request
     */
    static receivePresentation(httpRequest: OID4VPRequest): Promise<{
        vp: VerifiablePresentation;
        originalRequest?: PresentationRequest;
        sessionId?: string;
        clientId?: string;
    }>;
    /**
     * Creates an OID4VP response
     * @param verificationResult - The verification result from the SDK
     * @param options - Response options
     * @returns OID4VPResponse - Formatted OID4VP response
     */
    static createResponse(verificationResult: VerificationResult, options?: {
        sessionId?: string;
    }): OID4VPResponse;
    /**
     * Validates OID4VP request parameters
     * @param request - The request to validate
     * @returns ValidationResult - Validation result
     */
    static validateRequest(request: OID4VPRequest): ValidationResult;
    /**
     * Simulates retrieving session data (in a real implementation, this would access a database)
     * @param sessionId - The session ID
     * @returns Promise<SessionData|null> - Session data or null
     */
    static getSessionData(sessionId?: string): Promise<SessionData | null>;
    /**
     * Extracts client information from the request
     * @param request - The HTTP request
     * @returns Object - Client information
     */
    static extractClientInfo(request: OID4VPRequest): {
        clientId?: string;
        redirectUri?: string;
        responseType?: string;
        scope?: string;
    };
}
//# sourceMappingURL=oid4vp.d.ts.map