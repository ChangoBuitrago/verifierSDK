/**
 * WACI (Wallet and Credential Interactions) Protocol Adapter
 * Handles DIF standard for wallet/mobile credential interactions
 */
import { VerifiablePresentation, PresentationRequest, VerificationResult } from '../types';
/**
 * WACI request structure
 */
export interface WACIRequest {
    type: string;
    id: string;
    from: string;
    to: string;
    body: {
        goal_code?: string;
        accept?: string[];
        [key: string]: any;
    };
    created_time?: number;
    expires_time?: number;
}
/**
 * WACI response structure
 */
export interface WACIResponse {
    type: string;
    id: string;
    from: string;
    to: string;
    body: {
        goal_code?: string;
        verificationResult: VerificationResult;
        [key: string]: any;
    };
    created_time: number;
    thid?: string;
}
/**
 * WACI Protocol Adapter
 * Handles WACI protocol for mobile wallet interactions
 */
export declare class WACIAdapter {
    /**
     * Receives a WACI presentation request
     * @param request - The WACI request from the wallet
     * @returns Promise with presentation and original request
     */
    static receivePresentation(request: WACIRequest): Promise<{
        presentation: VerifiablePresentation;
        originalRequest: PresentationRequest;
    }>;
    /**
     * Creates a WACI response
     * @param result - The verification result
     * @param options - Additional options for response formatting
     * @returns WACI response
     */
    static createResponse(result: VerificationResult, options?: {
        from: string;
        to: string;
        threadId?: string;
        goalCode?: string;
    }): WACIResponse;
    /**
     * Validates a WACI request
     * @param request - The request to validate
     * @returns Validation result
     */
    static validateRequest(request: WACIRequest): {
        isValid: boolean;
        errors?: string[];
    };
    /**
     * Creates a WACI presentation request
     * @param options - Request options
     * @returns WACI request
     */
    static createPresentationRequest(options: {
        from: string;
        to: string;
        goalCode?: string;
        accept?: string[];
        challenge?: string;
    }): WACIRequest;
}
//# sourceMappingURL=waci.d.ts.map