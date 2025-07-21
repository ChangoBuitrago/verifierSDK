/**
 * Credential Verifier SDK - Main Entry Point
 * Exports the key components for easy importing
 */
export { createVerifier, VerifierImpl, CredentialHandler } from './src/core/index';
export { W3cHandler, W3cHandlerOptions } from './src/handlers/w3c-credential';
export { MdlHandler, MdlHandlerOptions, MdlPresentation } from './src/handlers/mobile-license';
export { ed25519Suite, Ed25519Proof } from './src/crypto/ed25519-suite';
export { mdocDeviceAuthSuite, DeviceAuth, ReaderAuth, SessionData } from './src/crypto/mdoc-suite';
export { OID4VP_Adapter, OID4VPRequest, OID4VPResponse, SessionData as OID4VPSessionData, ValidationResult, DIDCommAdapter, DIDCommMessage, DIDCommResponse, CHAPIAdapter, CHAPIRequest, CHAPIResponse, CHAPICredentialRequest, WACIAdapter, WACIRequest, WACIResponse, SIOPAdapter, SIOPRequest, SIOPResponse, SIOPIDToken, VCAPIAdapter, VCAPIRequest, VCAPIResponse, VCAPIVerificationRequest, VCAPIVerificationResponse, ProtocolAdapter } from './src/protocol-adapters';
export { AgeVerificationPolicy, ValidityPolicy } from './src/policies';
export { createCredentialVerifier, createCredentialIssuer } from './src/core';
export * from './src/types';
export declare const VERSION = "1.0.0";
//# sourceMappingURL=index.d.ts.map