/**
 * Protocol Adapters - Central Export Point
 * All protocol adapters implement a common interface for credential exchange
 */

// Existing OID4VP adapter
export { OID4VP_Adapter, OID4VPRequest, OID4VPResponse, SessionData, ValidationResult } from './oid4vp-adapter';

// New protocol adapters
export { DIDCommAdapter, DIDCommMessage, DIDCommResponse } from './didcomm-adapter';
export { CHAPIAdapter, CHAPIRequest, CHAPIResponse, CHAPICredentialRequest } from './chapi-adapter';
export { WACIAdapter, WACIRequest, WACIResponse } from './waci-adapter';
export { SIOPAdapter, SIOPRequest, SIOPResponse, SIOPIDToken } from './siop-adapter';
export { VCAPIAdapter, VCAPIRequest, VCAPIResponse, VCAPIVerificationRequest, VCAPIVerificationResponse } from './vc-api-adapter';

/**
 * Common Protocol Adapter Interface
 * All adapters should implement these core methods
 */
export interface ProtocolAdapter {
  receivePresentation(request: any): Promise<{
    presentation: any;
    originalRequest: any;
  }>;
  createResponse(result: any, options?: any): any;
  validateRequest?(request: any): { isValid: boolean; errors?: string[] };
} 