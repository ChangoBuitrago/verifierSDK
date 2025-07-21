// src/types/interfaces.ts

// =========================
// 1. Core Data Structures
// =========================

/**
 * Represents a cryptographic proof attached to a credential or presentation.
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
  '@context': string[];
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
  '@context': string[];
  type: string[];
  verifiableCredential: VerifiableCredential[];
  holder: string; // Holder's DID
  proof: Proof;
}

// =========================
// 2. Flow-Specific Data Structures
// =========================

/**
 * Represents a request for a verifiable presentation sent by a verifier to a holder.
 */
export interface PresentationRequest {
  id: string;
  comment?: string;
  policies?: string[]; // The policies to run for this request
  request_credentials: {
    type: string;
    required?: boolean;
    constraints?: any;
  }[];
  challenge: string;
}

/**
 * Represents the result of a verification process.
 */
export interface VerificationResult {
  status: 'verified' | 'rejected';
  policyResults?: Record<string, PolicyResult>;
  error?: string;
}

/**
 * Represents the result of a policy execution.
 */
export interface PolicyResult {
  compliant: boolean;
  errors?: string[];
  details?: any;
}

/**
 * Interface for a policy module that evaluates business rules after cryptographic verification.
 */
export interface Policy {
  execute(verificationData: VerificationData): PolicyResult;
}

/**
 * Data passed to policies for evaluation.
 */
export interface VerificationData {
  claims: Record<string, any>;
  credentialType: string;
  issuer?: string;
  holder?: string;
  [key: string]: any;
}

/**
 * Interface for a handler that processes a specific credential format.
 */
export interface CredentialHandler {
  canHandle(presentation: VerifiablePresentation): boolean;
  verify(presentation: VerifiablePresentation, originalRequest?: PresentationRequest): Promise<{
    status: 'verified' | 'rejected';
    claims?: Record<string, any>;
    credentialType?: string;
    issuer?: string;
    holder?: string;
    error?: string;
  }>;
}

// =========================
// 3. Status Checking Interfaces
// =========================

/**
 * Result of a credential status check (e.g., revocation, suspension).
 */
export interface StatusResult {
  active: boolean; // true if not revoked/suspended
  reason?: string;
}

/**
 * Interface for a pluggable status checker (e.g., StatusList2021, Bitstring, Token).
 */
export interface StatusChecker {
  checkStatus(credential: VerifiableCredential): Promise<StatusResult>;
  canHandle?(credential: VerifiableCredential): boolean; // Optional for multi-mechanism checkers
}

// =========================
// 4. Verifier Interfaces & Options
// =========================

/**
 * Interface for a credential verifier (main SDK entry point).
 */
export interface CredentialVerifier {
  createRequest(options: { comment: string }): PresentationRequest;
  verify(vp: VerifiablePresentation, request?: PresentationRequest): Promise<VerificationResult>;
  getHandlerInfo?(): Record<string, any>;
}

/**
 * Options for creating a credential verifier instance.
 */
export interface CredentialVerifierOptions {
  handlers: CredentialHandler[];
  policies?: Record<string, Policy>;
}

// =========================
// 5. Dependency Injection Types
// =========================

/**
 * Interface for a DID resolver dependency.
 */
export interface DidResolver {
  resolve(did: string): Promise<any>;
}

/**
 * Interface for a logger dependency.
 */
export interface Logger {
  log(...args: any[]): void;
  error(...args: any[]): void;
}

/**
 * Interface for a schema registry dependency.
 */
export interface SchemaRegistry {
  getSchema(type: string): Promise<any>;
}

 