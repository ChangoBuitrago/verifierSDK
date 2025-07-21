/**
 * W3C Verifiable Credential Handler
 * Self-contained handler for W3C verifiable presentations
 */
import { VerifiablePresentation, PresentationRequest } from '../types';
export interface W3cHandlerOptions {
    supportedProofTypes?: string[];
}
export declare class W3cHandler {
    private cryptoSuites;
    private supportedProofTypes;
    constructor(options?: W3cHandlerOptions);
    /**
     * Determines if this handler can process the given presentation
     * @param presentation - The presentation to check
     * @returns boolean - True if this handler can process the presentation
     */
    canHandle(presentation: VerifiablePresentation): boolean;
    /**
     * Verifies a W3C verifiable presentation
     * @param presentation - The presentation to verify
     * @param originalRequest - The original verification request
     * @returns Promise<VerificationResult> - Verification result
     */
    verify(presentation: VerifiablePresentation, originalRequest?: PresentationRequest): Promise<{
        status: 'verified' | 'rejected';
        claims?: Record<string, any>;
        credentialType?: string;
        issuer?: string;
        holder?: string;
        error?: string;
    }>;
    /**
     * Gets supported proof types for this handler
     * @returns string[] - Array of supported proof types
     */
    getSupportedProofTypes(): string[];
}
//# sourceMappingURL=w3c-credential.d.ts.map