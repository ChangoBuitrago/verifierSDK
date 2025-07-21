/**
 * Credential Verifier SDK - Main Entry Point
 * Exports the key components for easy importing
 */
// Core verifier
export { createVerifier, VerifierImpl } from './src/core/index';
// Handlers
export { W3cHandler } from './src/handlers/w3c-credential';
export { MdlHandler } from './src/handlers/mobile-license';
// Crypto suites
export { ed25519Suite } from './src/crypto/ed25519-suite';
export { mdocDeviceAuthSuite } from './src/crypto/mdoc-suite';
// Protocol adapters
export { OID4VP_Adapter, DIDCommAdapter, CHAPIAdapter, WACIAdapter, SIOPAdapter, VCAPIAdapter } from './src/protocol-adapters';
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
//# sourceMappingURL=index.js.map