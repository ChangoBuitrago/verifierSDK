/**
 * Mobile Driver's License (mDL) Handler
 * Self-contained handler for mDL verifiable presentations
 */
import { DeviceAuth, ReaderAuth } from '../crypto/mdoc-suite';
import { VerifiablePresentation, PresentationRequest } from '../types';
export interface MdlPresentation {
    type?: string;
    deviceResponse?: {
        deviceAuth: DeviceAuth;
        readerAuth?: ReaderAuth;
        mdoc: {
            dataElements: Record<string, any>;
        };
    };
}
export interface MdlHandlerOptions {
    enableReaderAuth?: boolean;
}
export declare class MdlHandler {
    private cryptoSuite;
    private enableReaderAuth;
    constructor(options?: MdlHandlerOptions);
    /**
     * Determines if this handler can process the given presentation
     * @param presentation - The presentation to check
     * @returns boolean - True if this handler can process the presentation
     */
    canHandle(presentation: VerifiablePresentation | MdlPresentation): boolean;
    /**
     * Verifies an mDL presentation
     * @param presentation - The presentation to verify
     * @param originalRequest - The original verification request
     * @returns Promise<VerificationResult> - Verification result
     */
    verify(presentation: VerifiablePresentation | MdlPresentation, originalRequest?: PresentationRequest): Promise<{
        status: 'verified' | 'rejected';
        claims?: Record<string, any>;
        credentialType?: string;
        issuer?: string;
        holder?: string;
        error?: string;
    }>;
    /**
     * Gets the supported mDL features for this handler
     * @returns Object - Object describing supported features
     */
    getSupportedFeatures(): Record<string, boolean>;
}
//# sourceMappingURL=mobile-license.d.ts.map