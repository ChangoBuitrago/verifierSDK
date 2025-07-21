/**
 * Agnostic Verifier SDK Core
 * Provides a clean, protocol-agnostic interface for credential verification
 */

import { VerifiablePresentation, PresentationRequest, VerificationResult, Policy, VerificationData, CredentialHandler, CredentialVerifier } from '../types';
import type { CredentialVerifierOptions } from '../types';

// Re-export the interface for convenience
export { CredentialHandler };

/**
 * Core Verifier Implementation
 * Iterates through handlers to find one that can process the data
 */
export class VerifierImpl implements CredentialVerifier {
  private handlers: CredentialHandler[];
  private policies: Record<string, Policy>;
  
  constructor(options: CredentialVerifierOptions) {
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
  async verify(presentation: VerifiablePresentation, originalRequest?: PresentationRequest): Promise<VerificationResult> {
    console.log("=== Starting verification process ===");
    console.log(`Presentation type: ${Array.isArray(presentation.type) ? presentation.type.join(', ') : presentation.type}`);
    
    if (!presentation) {
      throw new Error('No presentation provided for verification');
    }

    // Step 1: Find and run the appropriate handler
    const handler = this.handlers.find(h => h.canHandle(presentation));
    
    if (!handler) {
      const supportedTypes = this.handlers.map(h => h.constructor.name).join(', ');
      throw new Error(
        `No suitable handler found for the presentation format. ` +
        `Available handlers: ${supportedTypes || 'None'}`
      );
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
    const policyResults: Record<string, any> = {};
    const requestedPolicies = originalRequest?.policies || [];
    
    if (requestedPolicies.length > 0) {
      console.log(`Running ${requestedPolicies.length} policies: ${requestedPolicies.join(', ')}`);
      
      for (const policyName of requestedPolicies) {
        const policy = this.policies[policyName];
        if (policy) {
          const verificationData: VerificationData = {
            claims: handlerResult.claims || {},
            credentialType: handlerResult.credentialType || 'Unknown',
            issuer: handlerResult.issuer,
            holder: handlerResult.holder
          };
          
          policyResults[policyName] = policy.execute(verificationData);
        } else {
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

  createRequest(options: { comment: string }): PresentationRequest {
    // Minimal stub implementation for interface compliance
    return {
      id: 'request-id',
      comment: options.comment,
      policies: [],
      request_credentials: [],
      challenge: 'challenge-string'
    };
  }

  getHandlerInfo?(): Record<string, any> {
    // Optional stub for interface compliance
    return { handlerCount: this.handlers.length };
  }
}

/**
 * Factory function to create a configured Verifier
 * @param options - Configuration options
 * @param options.handlers - Array of handler instances
 * @param options.policies - Map of policy names to policy instances
 * @returns VerifierImpl - A configured Verifier instance
 */
export function createVerifier(options: CredentialVerifierOptions): VerifierImpl {
  return new VerifierImpl(options);
} 