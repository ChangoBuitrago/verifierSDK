/**
 * Credential Verifier SDK - Main Entry Point
 * Exports the key components for easy importing
 */

// Core verifier
export { createVerifier, VerifierImpl, CredentialHandler } from './src/core/index';

// Handlers
export { W3cHandler, W3cHandlerOptions } from './src/handlers/w3c-credential';
export { MdlHandler, MdlHandlerOptions, MdlPresentation } from './src/handlers/mobile-license';

// Crypto suites
export { ed25519Suite, Ed25519Proof } from './src/crypto/ed25519-suite';
export { mdocDeviceAuthSuite, DeviceAuth, ReaderAuth, SessionData } from './src/crypto/mdoc-suite';

// Protocol adapters
export { OID4VP_Adapter, OID4VPRequest, OID4VPResponse, SessionData as OID4VPSessionData, ValidationResult } from './src/protocol-adapters/oid4vp';

// Policies
export { AgeVerificationPolicy, ValidityPolicy } from './src/policies';

// Note: The main handlers and verifier implementations are now in TypeScript
// The factory functions from sdk-types.ts provide the interface-compliant implementations

// Factory functions
export { createCredentialVerifier, createCredentialIssuer } from './src/core';

// Core types
export * from './src/types';

// Version info
export const VERSION = '1.0.0'; 