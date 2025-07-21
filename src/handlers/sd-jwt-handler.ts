// src/handlers/sd-jwt-handler.ts

/**
 * SD-JWT Handler
 * Self-contained handler for SD-JWT verifiable presentations
 */

// Minimal SD-JWT proof type
export interface SdJwtProof {
  type: 'SD-JWT';
  created: string;
  verificationMethod: string;
  proofPurpose: string;
  sdJwt: string; // The SD-JWT string
}

// Mock SD-JWT crypto suite
export const sdJwtSuite = {
  async verifyProof(proof: SdJwtProof): Promise<boolean> {
    // In a real implementation, verify the SD-JWT signature and disclosures
    console.log('--> Verifying SD-JWT proof (mock)');
    if (proof.type !== 'SD-JWT') return false;
    if (!proof.sdJwt) return false;
    // ... SD-JWT verification logic here ...
    return true;
  }
};

import { VerifiablePresentation, PresentationRequest } from '../types/index.ts';

export class SdJwtHandler {
  private cryptoSuite: typeof sdJwtSuite;

  constructor() {
    this.cryptoSuite = sdJwtSuite;
  }

  /**
   * Determines if this handler can process the given presentation
   */
  canHandle(presentation: VerifiablePresentation): boolean {
    // Check if the proof type is SD-JWT and has sdJwt property
    const proof = presentation.proof;
    return proof && typeof proof === 'object' && proof.type === 'SD-JWT' && 'sdJwt' in proof;
  }

  /**
   * Verifies an SD-JWT presentation
   */
  async verify(presentation: VerifiablePresentation, originalRequest?: PresentationRequest): Promise<{
    status: 'verified' | 'rejected';
    claims?: Record<string, any>;
    credentialType?: string;
    issuer?: string;
    holder?: string;
    error?: string;
  }> {
    console.log('-> Verifying with SdJwtHandler...');
    try {
      const proof = presentation.proof;
      if (!proof || typeof proof !== 'object' || proof.type !== 'SD-JWT' || !('sdJwt' in proof)) {
        console.log('   No SD-JWT proof found');
        return { status: 'rejected', error: 'No SD-JWT proof found' };
      }
      const isProofValid = await this.cryptoSuite.verifyProof(proof as SdJwtProof);
      if (isProofValid) {
        console.log('   SD-JWT verification successful');
        return {
          status: 'verified',
          claims: presentation.verifiableCredential?.[0]?.credentialSubject || {},
          credentialType: 'SD-JWT',
          issuer: presentation.verifiableCredential?.[0]?.issuer,
          holder: presentation.holder
        };
      } else {
        console.log('   SD-JWT verification failed');
        return { status: 'rejected', error: 'SD-JWT proof verification failed' };
      }
    } catch (error) {
      console.log(`   SD-JWT verification error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return { status: 'rejected', error: error instanceof Error ? error.message : 'Unknown error during SD-JWT verification' };
    }
  }
} 