/**
 * ARF Compliance Policy
 * Ensures credentials meet ARF (Age-Related Fraud) compliance requirements
 */
export class AgeVerificationPolicy {
    /**
     * Executes the ARF compliance policy
     * @param verificationData - The verification data from the handler
     * @returns PolicyResult - Whether the credential is ARF compliant
     */
    execute(verificationData) {
        console.log("--> Applying ARF Compliance Policy...");
        const { claims, credentialType } = verificationData;
        const errors = [];
        // Check if birthdate is present (required for ARF compliance)
        if (!claims.birthdate && !claims.birth_date && !claims.dateOfBirth) {
            errors.push('Missing required birthdate claim for ARF compliance.');
        }
        // Check if the credential type is appropriate for ARF
        const validTypes = ['DriverLicense', 'Passport', 'NationalID', 'VerifiableCredential'];
        if (!validTypes.some(type => credentialType.includes(type))) {
            errors.push(`Credential type '${credentialType}' is not suitable for ARF compliance.`);
        }
        // Check if issuer is trusted (in a real implementation, this would check against a trust registry)
        if (verificationData.issuer && !this.isTrustedIssuer(verificationData.issuer)) {
            errors.push(`Issuer '${verificationData.issuer}' is not in the trusted registry for ARF compliance.`);
        }
        const compliant = errors.length === 0;
        return {
            compliant,
            errors: compliant ? undefined : errors,
            details: {
                policyName: 'ARF Compliance',
                credentialType,
                issuer: verificationData.issuer,
                hasBirthdate: !!(claims.birthdate || claims.birth_date || claims.dateOfBirth)
            }
        };
    }
    /**
     * Checks if an issuer is trusted for ARF compliance
     * @param issuer - The issuer DID or identifier
     * @returns boolean - Whether the issuer is trusted
     */
    isTrustedIssuer(issuer) {
        // In a real implementation, this would query a trust registry
        const trustedIssuers = [
            'did:example:government',
            'did:example:dmv',
            'did:example:passport-office'
        ];
        return trustedIssuers.includes(issuer);
    }
}
//# sourceMappingURL=age-verification.js.map