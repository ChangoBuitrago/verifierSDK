/**
 * Agnostic Verifier SDK Core
 * Provides a clean, protocol-agnostic interface for credential verification
 */
/**
 * Core Verifier Implementation
 * Iterates through handlers to find one that can process the data
 */
export class VerifierImpl {
    constructor(options) {
        this.handlers = options.handlers || [];
        this.policies = options.policies || {};
        if (this.handlers.length === 0) {
            console.warn("Warning: No handlers provided to VerifierImpl");
        }
        console.log(`Verifier initialized with ${this.handlers.length} handlers and ${Object.keys(this.policies).length} policies`);
    }
    /**
     * Verifies a presentation using the appropriate handler and policies
     * @param presentation - The presentation to verify
     * @param originalRequest - The original verification request (optional)
     * @returns Promise<VerificationResult> - Verification result
     */
    async verify(presentation, originalRequest) {
        console.log("=== Starting verification process ===");
        console.log(`Presentation type: ${presentation.type.join(', ')}`);
        if (!presentation) {
            throw new Error('No presentation provided for verification');
        }
        // Step 1: Find and run the appropriate handler
        const handler = this.handlers.find(h => h.canHandle(presentation));
        if (!handler) {
            const supportedTypes = this.handlers.map(h => h.constructor.name).join(', ');
            throw new Error(`No suitable handler found for the presentation format. ` +
                `Available handlers: ${supportedTypes || 'None'}`);
        }
        console.log(`Selected handler: ${handler.constructor.name}`);
        const handlerResult = await handler.verify(presentation, originalRequest);
        if (handlerResult.status === 'rejected') {
            console.log(`=== Verification failed: ${handlerResult.error} ===`);
            return {
                status: 'rejected',
                error: handlerResult.error || 'Cryptographic verification failed'
            };
        }
        // Step 2: Run all requested post-verification policies
        const policyResults = {};
        const requestedPolicies = originalRequest?.policies || [];
        if (requestedPolicies.length > 0) {
            console.log(`Running ${requestedPolicies.length} policies: ${requestedPolicies.join(', ')}`);
            for (const policyName of requestedPolicies) {
                const policy = this.policies[policyName];
                if (policy) {
                    const verificationData = {
                        claims: handlerResult.claims || {},
                        credentialType: handlerResult.credentialType || 'Unknown',
                        issuer: handlerResult.issuer,
                        holder: handlerResult.holder
                    };
                    policyResults[policyName] = policy.execute(verificationData);
                }
                else {
                    console.warn(`Policy '${policyName}' not found in verifier configuration`);
                }
            }
        }
        // Step 3: Determine final status based on policy compliance
        const allPoliciesCompliant = Object.values(policyResults).every(r => r.compliant);
        if (!allPoliciesCompliant) {
            console.log("=== Verification failed: Policy compliance check failed ===");
            return {
                status: 'rejected',
                policyResults,
                error: 'Policy compliance check failed'
            };
        }
        console.log("=== Verification complete: verified ===");
        return {
            status: 'verified',
            policyResults: Object.keys(policyResults).length > 0 ? policyResults : undefined
        };
    }
    /**
     * Gets information about all registered handlers
     * @returns Object - Information about available handlers
     */
    getHandlerInfo() {
        return this.handlers.map(handler => ({
            name: handler.constructor.name,
            supportedTypes: handler.getSupportedProofTypes ? handler.getSupportedProofTypes() : undefined,
            supportedFeatures: handler.getSupportedFeatures ? handler.getSupportedFeatures() : undefined
        }));
    }
    /**
     * Adds a new handler to the verifier
     * @param handler - The handler to add
     */
    addHandler(handler) {
        if (!handler || typeof handler.canHandle !== 'function' || typeof handler.verify !== 'function') {
            throw new Error('Handler must implement canHandle() and verify() methods');
        }
        this.handlers.push(handler);
        console.log(`Added handler: ${handler.constructor.name}`);
    }
    /**
     * Removes a handler from the verifier
     * @param handler - The handler to remove
     */
    removeHandler(handler) {
        const index = this.handlers.indexOf(handler);
        if (index > -1) {
            this.handlers.splice(index, 1);
            console.log(`Removed handler: ${handler.constructor.name}`);
        }
    }
}
/**
 * Factory function to create a configured Verifier
 * @param options - Configuration options
 * @param options.handlers - Array of handler instances
 * @param options.policies - Map of policy names to policy instances
 * @returns VerifierImpl - A configured Verifier instance
 */
export function createVerifier(options) {
    return new VerifierImpl(options);
}
/**
 * Factory function to create a configured Verifier.
 */
export function createCredentialVerifier(options) {
    // Note: This would import the actual implementation
    // For now, we'll return a mock implementation
    return {
        createRequest: (options) => ({
            id: `request_${Date.now()}`,
            comment: options.comment,
            request_credentials: [{ type: 'VerifiableCredential', required: true, constraints: {} }],
            challenge: `challenge_${Date.now()}`
        }),
        verify: async (vp, request) => ({
            status: 'verified'
        })
    };
}
/**
 * Factory function to create a configured Issuer.
 */
export function createCredentialIssuer(options) {
    // Note: This would import the actual implementation
    // For now, we'll return a mock implementation
    return {
        issue: async (request) => ({
            '@context': ['https://www.w3.org/2018/credentials/v1'],
            id: `credential:${options.issuerDid}:${Date.now()}`,
            type: request.type,
            issuer: options.issuerDid,
            issuanceDate: new Date().toISOString(),
            credentialSubject: request.credentialSubject,
            proof: {
                type: 'Ed25519Signature2020',
                created: new Date().toISOString(),
                verificationMethod: `${options.issuerDid}#key-1`,
                proofPurpose: 'assertionMethod',
                proofValue: 'mock-signature'
            }
        })
    };
}
//# sourceMappingURL=index.js.map