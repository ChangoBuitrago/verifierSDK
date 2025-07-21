/**
 * W3C Verifiable Credential Handler
 * Self-contained handler for W3C verifiable presentations
 */

import { ed25519Suite, Ed25519Proof } from '../crypto/ed25519-suite';
import { VerifiablePresentation, PresentationRequest, VerificationResult, VerifiableCredential } from '../types';

export interface W3cHandlerOptions {
  supportedProofTypes?: string[];
}

export class W3cHandler {
  private cryptoSuites: Record<string, any>;
  private supportedProofTypes: string[];

  constructor(options: W3cHandlerOptions = {}) {
    this.supportedProofTypes = options.supportedProofTypes || ['Ed25519Signature2020', 'Ed25519Signature2018'];
    // Each handler manages its own crypto dependencies
    this.cryptoSuites = { 
      'Ed25519Signature2020': ed25519Suite,
      'Ed25519Signature2018': ed25519Suite 
    };
  }

  /**
   * Determines if this handler can process the given presentation
   * @param presentation - The presentation to check
   * @returns boolean - True if this handler can process the presentation
   */
  canHandle(presentation: VerifiablePresentation): boolean {
    // Check if this is a W3C verifiable presentation
    return !!presentation.verifiableCredential || 
           !!presentation['@context'] ||
           presentation.type.includes('VerifiablePresentation');
  }

  /**
   * Verifies a W3C verifiable presentation
   * @param presentation - The presentation to verify
   * @param originalRequest - The original verification request
   * @returns Promise<VerificationResult> - Verification result
   */
  async verify(presentation: VerifiablePresentation, originalRequest?: PresentationRequest): Promise<{
    status: 'verified' | 'rejected';
    claims?: Record<string, any>;
    credentialType?: string;
    issuer?: string;
    holder?: string;
    error?: string;
  }> {
    console.log("-> Verifying with W3cHandler...");
    console.log(`   Presentation type: ${presentation.type.join(', ')}`);
    
    try {
      // Extract the verifiable credential
      const credential = presentation.verifiableCredential?.[0];
      
      if (!credential) {
        console.log("   No verifiable credential found");
        return { status: 'rejected', error: 'No verifiable credential' };
      }

      // Get the proof from the credential
      const proof = credential.proof;
      
      if (!proof) {
        console.log("   No proof found in credential");
        return { status: 'rejected', error: 'No proof found' };
      }

      // Check if we support this proof type
      if (!proof.type) {
        console.log("   Proof type not specified");
        return { status: 'rejected', error: 'Proof type not specified' };
      }

      const cryptoSuite = this.cryptoSuites[proof.type];
      if (!cryptoSuite) {
        console.log(`   Unsupported proof type: ${proof.type}`);
        return { 
          status: 'rejected', 
          error: `Unsupported proof type: ${proof.type}` 
        };
      }

      // Verify the proof using the appropriate crypto suite
      const isProofValid = await cryptoSuite.verifyProof(proof as Ed25519Proof);
      
      if (isProofValid) {
        console.log("   W3C verification successful");
        const credential = presentation.verifiableCredential?.[0];
        return { 
          status: 'verified',
          claims: credential?.credentialSubject || {},
          credentialType: credential?.type?.join(', ') || 'VerifiableCredential',
          issuer: credential?.issuer,
          holder: presentation.holder
        };
      } else {
        console.log("   W3C verification failed");
        return { 
          status: 'rejected', 
          error: 'Proof verification failed' 
        };
      }
    } catch (error) {
      console.log(`   W3C verification error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return { 
        status: 'rejected', 
        error: error instanceof Error ? error.message : 'Unknown error during W3C verification' 
      };
    }
  }

  /**
   * Gets supported proof types for this handler
   * @returns string[] - Array of supported proof types
   */
  getSupportedProofTypes(): string[] {
    return this.supportedProofTypes;
  }
} 