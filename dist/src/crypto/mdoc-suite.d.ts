/**
 * mDoc Crypto Suite for Mobile Driver's License Verification
 * Provides cryptographic verification logic for mDL device authentication
 */
export interface DeviceAuth {
    deviceKey: string;
    sessionTranscript: string;
    authSignature: string;
}
export interface ReaderAuth {
    readerCertificate: string;
    readerSignature: string;
}
export interface SessionData {
    sessionId: string;
    timestamp: string;
    [key: string]: any;
}
export declare const mdocDeviceAuthSuite: {
    /**
     * Verifies mDL device authentication
     * @param deviceAuth - The device authentication object from mDL
     * @returns Promise<boolean> - True if device auth is valid, false otherwise
     */
    verifyDeviceAuth: (deviceAuth: DeviceAuth) => Promise<boolean>;
    /**
     * Verifies mDL reader authentication
     * @param readerAuth - The reader authentication object
     * @returns Promise<boolean> - True if reader auth is valid, false otherwise
     */
    verifyReaderAuth: (readerAuth: ReaderAuth) => Promise<boolean>;
    /**
     * Generates a session transcript for mDL communication
     * @param sessionData - Session initialization data
     * @returns Promise<string> - Session transcript hash
     */
    generateSessionTranscript: (sessionData: SessionData) => Promise<string>;
};
//# sourceMappingURL=mdoc-suite.d.ts.map