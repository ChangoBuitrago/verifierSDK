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

export interface CredentialHandler {
  verify(
    presentation: VerifiablePresentation,
    originalRequest?: PresentationRequest
  ): Promise<VerificationResult>;
}

export interface CryptoSuite {
  verify(credential: any): Promise<boolean>; // come from crypto library
}

export interface CredentialVerifierOptions {
  didResolver: DidResolver;
  logger: Logger;
  schemaValidator: SchemaValidator;
  cryptosuites: {
    [key: string]: CryptoSuite;
  };
}

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

/**
 * Interface for a credential verifier (main SDK entry point).
 */
export interface CredentialVerifier {
  verify(
    presentation: VerifiablePresentation,
    originalRequest?: PresentationRequest,
    options?: VerifyOptions
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

export interface SchemaValidationResult {
  valid: boolean;
  errors?: string[];
}

/**
 * Interface for a schema validator dependency. It's a special type of policy that validates the schema of the credential.
 */
export interface SchemaValidator {
  validate(verificationData: VerificationData): Promise<SchemaValidationResult>;
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
  credentialType: string[];
  issuer?: string;
  holder?: string;
  [key: string]: any;
}

/**
 * Represents the result of a policy execution.
 */
export interface PolicyResult {
  compliant: boolean;
  errors?: string[];
  details?: any;
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

export interface VerifyOptions {
  policies?: Policy[];
  handler?: CredentialHandler;
}
