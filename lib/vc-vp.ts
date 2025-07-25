/**
 * Represents a cryptographic proof attached to a credential or presentation. Should come from crypto library.
 */
export interface Proof {
  type: string;
  created: string;
  verificationMethod: string;
  proofPurpose: string;
  proofValue?: string;
  [key: string]: any; // Allow custom properties like sdJwt
}

/**
 * Represents the subject of a credential (the entity the credential is about).
 */
export interface CredentialSubject {
  id: string; // Holder's DID
  [key: string]: any;
}

/**
 * Represents the status/revocation information for a credential.
 */
export interface CredentialStatus {
  id: string; // URL or DID for the status list or registry
  type: string; // e.g., "StatusList2021", "BitstringStatusList", "TokenStatusList"
  [key: string]: any; // Allow for mechanism-specific fields
}

/**
 * Represents a W3C Verifiable Credential.
 */
export interface VerifiableCredential {
  "@context": string[];
  id: string;
  type: string[];
  issuer: string; // Issuer's DID
  issuanceDate: string;
  credentialSubject: CredentialSubject;
  proof: Proof;
  status?: CredentialStatus;
}

/**
 * Represents a W3C Verifiable Presentation (a collection of credentials shared by a holder).
 */
export interface VerifiablePresentation {
  "@context": string[];
  type: string[];
  verifiableCredential: VerifiableCredential[];
  holder: string; // Holder's DID
  proof: Proof;
}

export type Format =
  | "jwt"
  | "jwt-vc"
  | "jwt-vp"
  | "ldp-vc"
  | "ldp-vp"
  | "ldp"
  | "sd-jwt"
  | "mso-mdoc"
  | "dc+sd-jwt"
  | "ac-vc"
  | "ac-vp";
