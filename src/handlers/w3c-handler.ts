/**
 * W3C Verifiable Credential Handler
 * Self-contained handler for W3C verifiable presentations
 */

import { DidResolver, Logger, SchemaRegistry } from '../types/index.ts';

export interface W3cHandlerOptions {
  didResolver?: DidResolver;
  logger?: Logger;
  schemaRegistry?: SchemaRegistry;
  statusChecker?: StatusChecker;
}

import { ed25519Suite, Ed25519Proof } from '../crypto/ed25519-suite.ts';
import { ecdsaR1Suite, EcdsaR1Proof } from '../crypto/ecdsa-r1-suite.ts';
import { ecdsaR2Suite, EcdsaR2Proof } from '../crypto/ecdsa-r2-suite.ts';
import { bbsSuite, BbsProof } from '../crypto/bbs-suite.ts';
import { jwsSuite, JwsProof } from '../crypto/jws-suite.ts';
import { VerifiablePresentation, PresentationRequest, VerificationResult, VerifiableCredential, StatusChecker } from '../types/index.ts';

export class W3cHandler {
  private didResolver?: DidResolver;
  private logger?: Logger;
  private schemaRegistry?: SchemaRegistry;
  private cryptoSuites: Record<string, any>;
  private statusChecker?: StatusChecker;

  constructor(options: W3cHandlerOptions = {}) {
    this.didResolver = options.didResolver;
    this.logger = options.logger;
    this.schemaRegistry = options.schemaRegistry;
    this.statusChecker = options.statusChecker;
    // Map all supported W3C Data Integrity proof types to their suites
    this.cryptoSuites = {
      'Ed25519Signature2020': ed25519Suite,
      'Ed25519Signature2018': ed25519Suite,
      'EcdsaSecp256r1Signature2019': ecdsaR1Suite,
      'EcdsaSecp256k1Signature2019': ecdsaR2Suite,
      'BbsBlsSignature2020': bbsSuite,
      'JsonWebSignature2020': jwsSuite
    };
  }

  /**
   * Determines if this handler can process the given presentation
   */
  canHandle(presentation: VerifiablePresentation): boolean {
    return !!presentation.verifiableCredential || 
           !!presentation['@context'] ||
           (Array.isArray(presentation.type) && presentation.type.includes('VerifiablePresentation'));
  }

  /**
   * Verifies a W3C verifiable presentation
   */
  async verify(presentation: VerifiablePresentation, originalRequest?: PresentationRequest): Promise<{
    status: 'verified' | 'rejected';
    claims?: Record<string, any>;
    credentialType?: string;
    issuer?: string;
    holder?: string;
    error?: string;
  }> {
    (this.logger || console).log("-> Verifying with W3cHandler...");
    (this.logger || console).log(`   Presentation type: ${Array.isArray(presentation.type) ? presentation.type.join(', ') : presentation.type}`);
    try {
      const credential = presentation.verifiableCredential?.[0];
      if (!credential) {
        (this.logger || console).log("   No verifiable credential found");
        return { status: 'rejected', error: 'No verifiable credential' };
      }
      // Status check (for each credential)
      if (this.statusChecker) {
        const statusResult = await this.statusChecker.checkStatus(credential);
        if (!statusResult.active) {
          (this.logger || console).log("   Credential is revoked or suspended");
          return { status: 'rejected', error: statusResult.reason || 'Credential revoked or suspended' };
        }
      }
      const proof = credential.proof;
      if (!proof) {
        (this.logger || console).log("   No proof found in credential");
        return { status: 'rejected', error: 'No proof found' };
      }
      if (!proof.type) {
        (this.logger || console).log("   Proof type not specified");
        return { status: 'rejected', error: 'Proof type not specified' };
      }
      const cryptoSuite = this.cryptoSuites[proof.type];
      if (!cryptoSuite) {
        (this.logger || console).log(`   Unsupported proof type: ${proof.type}`);
        return { status: 'rejected', error: `Unsupported proof type: ${proof.type}` };
      }
      // Example: use didResolver if available
      if (this.didResolver && credential.issuer) {
        await this.didResolver.resolve(credential.issuer);
      }
      // Example: use schemaRegistry if available
      if (this.schemaRegistry && credential.type) {
        await this.schemaRegistry.getSchema(Array.isArray(credential.type) ? credential.type[0] : credential.type);
      }
      const isProofValid = await cryptoSuite.verifyProof(proof as Ed25519Proof);
      if (isProofValid) {
        (this.logger || console).log("   W3C verification successful");
        return {
          status: 'verified',
          claims: credential?.credentialSubject || {},
          credentialType: Array.isArray(credential?.type) ? credential?.type?.join(', ') : credential?.type || 'VerifiableCredential',
          issuer: credential?.issuer,
          holder: presentation.holder
        };
      } else {
        (this.logger || console).log("   W3C verification failed");
        return { status: 'rejected', error: 'Proof verification failed' };
      }
    } catch (error) {
      (this.logger || console).error(`   W3C verification error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return { status: 'rejected', error: error instanceof Error ? error.message : 'Unknown error during W3C verification' };
    }
  }
} 