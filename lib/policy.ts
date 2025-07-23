import { Constraint } from "./constraints";
import { CredentialSubject, Format } from "./vc-vp";

export interface CredentialConstraints {
  type: string; // Type of the credential e.g. "VerifiableCredential"
  required?: boolean; // Whether the credential is required inside the VP
  constraints?: { [key: string]: Constraint }; // Constraints for the credential subject
  format?: Format; // Format of the credential e.g. "jwt" or "ldp"
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
  getCredentialConstraints(): CredentialConstraints;

  execute(
    verificationData: VerificationData
  ): PolicyResult | Promise<PolicyResult>;
}

/**
 * Represents the result of a policy execution.
 */
export interface PolicyResult {
  compliant: boolean;
  errors?: string[];
  details?: any;
}
