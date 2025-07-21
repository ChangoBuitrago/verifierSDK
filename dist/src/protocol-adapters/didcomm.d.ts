/**
 * DIDComm v2 Protocol Adapter
 * Handles decentralized messaging protocol for peer-to-peer credential exchange
 */
import { VerifiablePresentation, PresentationRequest, VerificationResult } from '../types';
/**
 * DIDComm v2 message structure
 */
export interface DIDCommMessage {
    id: string;
    type: string;
    from?: string;
    to?: string[];
    created_time?: number;
    expires_time?: number;
    body: any;
    attachments?: any[];
}
/**
 * DIDComm v2 presentation request
 */
export interface DIDCommPresentationRequest {
    message: DIDCommMessage;
    presentation: VerifiablePresentation;
    originalRequest: PresentationRequest;
}
/**
 * DIDComm v2 response
 */
export interface DIDCommResponse {
    message: DIDCommMessage;
    verificationResult: VerificationResult;
}
/**
 * DIDComm v2 Protocol Adapter
 * Handles DIDComm v2 messages for credential exchange
 */
export declare class DIDCommAdapter {
    /**
     * Receives a DIDComm v2 presentation message
     * @param message - The DIDComm v2 message containing the presentation
     * @returns Promise with presentation and original request
     */
    static receivePresentation(message: DIDCommMessage): Promise<{
        presentation: VerifiablePresentation;
        originalRequest: PresentationRequest;
    }>;
    /**
     * Creates a DIDComm v2 response message
     * @param result - The verification result
     * @param options - Additional options for response formatting
     * @returns DIDComm v2 response message
     */
    static createResponse(result: VerificationResult, options?: {
        threadId?: string;
        from?: string;
        to?: string[];
    }): DIDCommResponse;
    /**
     * Validates a DIDComm v2 message structure
     * @param message - The message to validate
     * @returns Validation result
     */
    static validateMessage(message: DIDCommMessage): {
        isValid: boolean;
        errors?: string[];
    };
}
//# sourceMappingURL=didcomm.d.ts.map