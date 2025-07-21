// src/types/interfaces.ts

// 1. Core Data Structures
export interface Proof {
  type: string;
  created: string;
  verificationMethod: string;
  proofPurpose: string;
  proofValue: string;
}

export interface CredentialSubject {
  id: string; // Holder's DID
  [key: string]: any;
}

export interface VerifiableCredential {
  '@context': string[];
  id: string;
  type: string[];
  issuer: string; // Issuer's DID
  issuanceDate: string;
  credentialSubject: CredentialSubject;
  proof: Proof;
}

export interface VerifiablePresentation {
  '@context': string[];
  type: string[];
  verifiableCredential: VerifiableCredential[];
  holder: string; // Holder's DID
  proof: Proof;
}


// 2. Flow-Specific Data Structures
/**
 * Represents the "Presentation Request" sent by a Verifier to a Holder.
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
 * Represents the "Credential Request" sent by a Holder to an Issuer.
 */
export interface CredentialRequest {
  type: string[];
  credentialSubject: CredentialSubject;
}

/**
 * Represents the final result of a verification check.
 */
export interface VerificationResult {
  status: 'verified' | 'rejected';
  policyResults?: Record<string, PolicyResult>;
  error?: string;
}

/**
 * Represents the result of a policy execution
 */
export interface PolicyResult {
  compliant: boolean;
  errors?: string[];
  details?: any;
}

/**
 * Policy interface that all policies must implement
 */
export interface Policy {
  execute(verificationData: VerificationData): PolicyResult;
}

/**
 * Data passed to policies for evaluation
 */
export interface VerificationData {
  claims: Record<string, any>;
  credentialType: string;
  issuer?: string;
  holder?: string;
  [key: string]: any;
}

/**
 * Handler interface for different credential formats
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

// 3. Core Actor SDK Interfaces
export interface CredentialIssuer {
  issue(request: CredentialRequest): Promise<VerifiableCredential>;
  getConfigurationInfo?(): Record<string, any>;
}

export interface CredentialVerifier {
  createRequest(options: { comment: string }): PresentationRequest;
  verify(vp: VerifiablePresentation, request: PresentationRequest): Promise<VerificationResult>;
  getHandlerInfo?(): Record<string, any>;
}

export interface CredentialHolderWallet {
  requestCredential(issuerEndpoint: URL, request: CredentialRequest): Promise<VerifiableCredential>;
  storeCredential(vc: VerifiableCredential): Promise<{ id: string }>;
  createPresentation(request: PresentationRequest): Promise<VerifiablePresentation>;
}

// 4. SDK Factory Patterns & Options

/**
 * Configuration for creating a Verifier instance.
 * Note: Dependencies like the didResolver are injected into the handlers, not the core verifier.
 */
export interface CredentialVerifierOptions {
  handlers: Record<string, any>; // A map of handler names to pre-configured handler instances
  policies?: Record<string, any>;
}

/**
 * Configuration for creating an Issuer instance.
 * Note: The keyManager is a dependency of the signer, not the core issuer.
 */
export interface CredentialIssuerOptions {
  formatters: Record<string, any>; // A map of formatter names to formatter instances
  signers: Record<string, any>; // A map of signer names to pre-configured signer instances
  policies?: Record<string, any>;
}

 