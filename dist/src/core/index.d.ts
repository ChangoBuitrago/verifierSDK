/**
 * Agnostic Verifier SDK Core
 * Provides a clean, protocol-agnostic interface for credential verification
 */
import { VerifiablePresentation, PresentationRequest, VerificationResult, Policy, CredentialHandler } from '../types';
export { CredentialHandler };
/**
 * Core Verifier Implementation
 * Iterates through handlers to find one that can process the data
 */
export declare class VerifierImpl {
    private handlers;
    private policies;
    constructor(options: {
        handlers: CredentialHandler[];
        policies?: Record<string, Policy>;
    });
    /**
     * Verifies a presentation using the appropriate handler and policies
     * @param presentation - The presentation to verify
     * @param originalRequest - The original verification request (optional)
     * @returns Promise<VerificationResult> - Verification result
     */
    verify(presentation: VerifiablePresentation, originalRequest?: PresentationRequest): Promise<VerificationResult>;
    /**
     * Gets information about all registered handlers
     * @returns Object - Information about available handlers
     */
    getHandlerInfo(): Array<{
        name: string;
        supportedTypes?: string[];
        supportedFeatures?: Record<string, any>;
    }>;
    /**
     * Adds a new handler to the verifier
     * @param handler - The handler to add
     */
    addHandler(handler: CredentialHandler): void;
    /**
     * Removes a handler from the verifier
     * @param handler - The handler to remove
     */
    removeHandler(handler: CredentialHandler): void;
}
/**
 * Factory function to create a configured Verifier
 * @param options - Configuration options
 * @param options.handlers - Array of handler instances
 * @param options.policies - Map of policy names to policy instances
 * @returns VerifierImpl - A configured Verifier instance
 */
export declare function createVerifier(options: {
    handlers: CredentialHandler[];
    policies?: Record<string, Policy>;
}): VerifierImpl;
/**
 * Factory function to create a configured Verifier.
 */
export declare function createCredentialVerifier(options: {
    handlers: Record<string, any>;
    policies?: Record<string, any>;
}): any;
/**
 * Factory function to create a configured Issuer.
 */
export declare function createCredentialIssuer(options: {
    formatters: Record<string, any>;
    signers: Record<string, any>;
    policies?: Record<string, any>;
    issuerDid: string;
}): any;
//# sourceMappingURL=index.d.ts.map