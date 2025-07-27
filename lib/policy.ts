import { CredentialSubject, Format } from "./vc-vp";

export interface CredentialConstraints {
  type: string; // Type of the credential e.g. "VerifiableCredential"
  required?: boolean; // Whether the credential is required inside the VP
  constraints?: JSONSchema; // Constraints for the credential subject
  schema?: { uri: string }; // Schema of the credential e.g. "https://example.com/schemas/age_credential.json"
  format?: Format; // Format of the credential e.g. "jwt" or "ldp"
  issuer?: string[]; // Issuer of the credential e.g. "did:example:123"
}

/**
 * Data passed to policies for evaluation.
 */
export interface VerificationData {
  credentialSubject: CredentialSubject;
  credentialType: string[];
  issuer?: string;
  holder?: string;
  [key: string]: any;
}

/**
 * Interface for a policy module that evaluates business rules after cryptographic verification.
 */
export interface CredentialPolicy {
  _NAME: string;
  getCredentialConstraints(): CredentialConstraints;
  execute(verificationData: VerificationData): PolicyResult;
}

export type CredentialPolicyConstructor = new () => CredentialPolicy & {
  _NAME: string;
};

/**
 * Represents the result of a policy execution.
 */
export interface PolicyResult {
  compliant: boolean;
  errors?: string[];
  details?: any;
}
