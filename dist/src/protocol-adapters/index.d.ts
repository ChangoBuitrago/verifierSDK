/**
 * Protocol Adapters - Central Export Point
 * All protocol adapters implement a common interface for credential exchange
 */
export { OID4VP_Adapter, OID4VPRequest, OID4VPResponse, SessionData, ValidationResult } from './oid4vp';
export { DIDCommAdapter, DIDCommMessage, DIDCommResponse } from './didcomm';
export { CHAPIAdapter, CHAPIRequest, CHAPIResponse, CHAPICredentialRequest } from './chapi';
export { WACIAdapter, WACIRequest, WACIResponse } from './waci';
export { SIOPAdapter, SIOPRequest, SIOPResponse, SIOPIDToken } from './siop';
export { VCAPIAdapter, VCAPIRequest, VCAPIResponse, VCAPIVerificationRequest, VCAPIVerificationResponse } from './vc-api';
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
    validateRequest?(request: any): {
        isValid: boolean;
        errors?: string[];
    };
}
//# sourceMappingURL=index.d.ts.map