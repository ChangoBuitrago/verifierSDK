import { Constraint } from "./constraints";
import { Cryptosuite, ProofPurpose } from "./cryptosuites";
import { CredentialPolicy, PolicyResult } from "./policy";
import { SchemaValidator } from "./schema-validator";
import { Format, VerifiableCredential, VerifiablePresentation } from "./vc-vp";

/**
 * Represents the result of a verification process.
 */
export interface VerificationResult {
  verified: boolean;
  credentials: VerifiableCredential[];
  policyResults?: Record<string, PolicyResult>;
  errors?: {
    type: string;
    title: string;
    details?: string;
  };
  warnings?: {
    type: string;
    title: string;
    details?: string;
  }[];
}

export interface CredentialVerifierRequestOptions {
  policies?: CredentialPolicy[]; // Policies that are used to verify the VP. Based on the policies, the requested credentials will be created in the presentation request.
  proofOptions: {
    purpose: ProofPurpose; // Expected purpose of the VP proof
    domain?: string; // Expected domain of the VP
    challengeGenerator?: () => Promise<string> | string; // This function will be called to generate a challenge value for the VP proof
    type: Cryptosuite[]; // Types of the proofs that are accepted for that VP
  };
}
export interface CredentialVerifierPresentationRequest {
  id: string;
  credentials: {
    type: string; // Type of the credential e.g. "VerifiableCredential"
    required?: boolean; // Whether the credential is required inside the VP
    constraints?: { [key: string]: Constraint }; // Constraints for the credential subject
    format?: Format; // Format of the credential e.g. "jwt" or "ldp"
    proofOptions: {
      purpose: ProofPurpose; // Expected purpose of the VC proof
      type: Cryptosuite[]; // Types of the proofs that are accepted for that VC
    }; // Same options as for the VP proof except challenge and domain
  }[];
  proofOptions: {
    purpose: ProofPurpose; // Expected purpose of the VP proof
    domain?: string; // Expected domain of the VP
    challenge?: string; // Challenge value used in VP proof
    type: Cryptosuite[]; // Types of the proofs that are accepted for that VP
  };
}

export interface ProofVerifier {
  verify(credential: any): Promise<boolean>; // come from crypto library
}

export interface CredentialVerifierOptions {
  didResolver: DidResolver;
  logger: Logger;
  schemaValidator: SchemaValidator;
  cryptosuites: {
    [key in Cryptosuite]: ProofVerifier;
  };
}

/**
 * Interface for a credential verifier (main SDK entry point).
 */
export interface CredentialVerifier {
  createRequest(
    options: CredentialVerifierRequestOptions
  ): CredentialVerifierPresentationRequest;

  verify(
    presentation: VerifiablePresentation,
    presentationRequest: CredentialVerifierPresentationRequest
  ): Promise<VerificationResult>;
}

/**
 * Interface for a DID resolver dependency.
 */
export interface DidResolver {
  [method: string]: (did: string) => Promise<any>;
}

/**
 * Interface for a logger dependency.
 */
export interface Logger {
  log(...args: any[]): void;
  debug(...args: any[]): void;
  info(...args: any[]): void;
  warn(...args: any[]): void;
  error(...args: any[]): void;
}

export interface PresentationRequest {
  id: string;
  comment?: string;
  policies?: string[];
  request_credentials: {
    type: string;
    required?: boolean;
    constraints?: any;
  }[];
  challenge: string;
}
