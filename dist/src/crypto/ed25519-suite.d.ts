/**
 * Ed25519 Crypto Suite for W3C Verifiable Credentials
 * Provides cryptographic verification logic for Ed25519 signatures
 */
export interface Ed25519Proof {
    type: string;
    created: string;
    verificationMethod: string;
    signature?: string;
}
export declare const ed25519Suite: {
    /**
     * Verifies a W3C proof using Ed25519 signature
     * @param proof - The proof object from the verifiable credential
     * @returns Promise<boolean> - True if proof is valid, false otherwise
     */
    verifyProof: (proof: Ed25519Proof) => Promise<boolean>;
    /**
     * Creates a new Ed25519 key pair
     * @returns Promise<Object> - Object containing public and private keys
     */
    generateKeyPair: () => Promise<{
        publicKey: string;
        privateKey: string;
    }>;
};
//# sourceMappingURL=ed25519-suite.d.ts.map