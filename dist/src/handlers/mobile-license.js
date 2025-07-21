/**
 * Mobile Driver's License (mDL) Handler
 * Self-contained handler for mDL verifiable presentations
 */
import { mdocDeviceAuthSuite } from '../crypto/mdoc-suite';
export class MdlHandler {
    constructor(options = {}) {
        this.enableReaderAuth = options.enableReaderAuth ?? true;
        // Each handler manages its own crypto dependencies
        this.cryptoSuite = mdocDeviceAuthSuite;
    }
    /**
     * Determines if this handler can process the given presentation
     * @param presentation - The presentation to check
     * @returns boolean - True if this handler can process the presentation
     */
    canHandle(presentation) {
        // Check if this is an mDL presentation
        return !!presentation.deviceResponse ||
            presentation.type === 'mDL';
    }
    /**
     * Verifies an mDL presentation
     * @param presentation - The presentation to verify
     * @param originalRequest - The original verification request
     * @returns Promise<VerificationResult> - Verification result
     */
    async verify(presentation, originalRequest) {
        console.log("-> Verifying with MdlHandler...");
        console.log(`   Presentation type: ${presentation.type || 'mDL'}`);
        try {
            // Extract the device response from the presentation
            const mdlPresentation = presentation;
            const deviceResponse = mdlPresentation.deviceResponse;
            if (!deviceResponse) {
                console.log("   No device response found");
                return { status: 'rejected', error: 'No device response' };
            }
            // Get the device authentication from the response
            const deviceAuth = deviceResponse.deviceAuth;
            if (!deviceAuth) {
                console.log("   No device authentication found");
                return { status: 'rejected', error: 'No device authentication' };
            }
            // Verify the device authentication using the crypto suite
            const isDeviceAuthValid = await this.cryptoSuite.verifyDeviceAuth(deviceAuth);
            if (!isDeviceAuthValid) {
                console.log("   Device authentication failed");
                return {
                    status: 'rejected',
                    error: 'Device authentication failed'
                };
            }
            // If reader authentication is present and enabled, verify it too
            if (deviceResponse.readerAuth && this.enableReaderAuth) {
                console.log("   Verifying reader authentication...");
                const isReaderAuthValid = await this.cryptoSuite.verifyReaderAuth(deviceResponse.readerAuth);
                if (!isReaderAuthValid) {
                    console.log("   Reader authentication failed");
                    return {
                        status: 'rejected',
                        error: 'Reader authentication failed'
                    };
                }
            }
            // Verify the mDL data structure
            const mdoc = deviceResponse.mdoc;
            if (!mdoc) {
                console.log("   No mDoc data found");
                return { status: 'rejected', error: 'No mDoc data' };
            }
            // Check if the mDoc contains the required data elements
            const dataElements = mdoc.dataElements;
            if (!dataElements || Object.keys(dataElements).length === 0) {
                console.log("   No data elements found in mDoc");
                return { status: 'rejected', error: 'No data elements' };
            }
            console.log("   mDL verification successful");
            const claims = dataElements?.['org.iso.18013.5.1'] || {};
            return {
                status: 'verified',
                claims,
                credentialType: 'mDL',
                issuer: 'mDL Device',
                holder: 'mDL Holder'
            };
        }
        catch (error) {
            console.log(`   mDL verification error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            return {
                status: 'rejected',
                error: error instanceof Error ? error.message : 'Unknown error during mDL verification'
            };
        }
    }
    /**
     * Gets the supported mDL features for this handler
     * @returns Object - Object describing supported features
     */
    getSupportedFeatures() {
        return {
            deviceAuthentication: true,
            readerAuthentication: this.enableReaderAuth,
            dataElementVerification: true
        };
    }
}
//# sourceMappingURL=mobile-license.js.map