/**
 * Protocol Adapters - Central Export Point
 * All protocol adapters implement a common interface for credential exchange
 */
// Existing OID4VP adapter
export { OID4VP_Adapter } from './oid4vp';
// New protocol adapters
export { DIDCommAdapter } from './didcomm';
export { CHAPIAdapter } from './chapi';
export { WACIAdapter } from './waci';
export { SIOPAdapter } from './siop';
export { VCAPIAdapter } from './vc-api';
//# sourceMappingURL=index.js.map