/**
 * Expiration Policy
 * Ensures credentials are not expired and are within acceptable validity periods
 */
export class ValidityPolicy {
    /**
     * Executes the expiration policy
     * @param verificationData - The verification data from the handler
     * @returns PolicyResult - Whether the credential is within valid dates
     */
    execute(verificationData) {
        console.log("--> Applying Expiration Policy...");
        const { claims, credentialType } = verificationData;
        const errors = [];
        const now = new Date();
        // Check issuance date
        if (claims.issuanceDate) {
            const issuanceDate = new Date(claims.issuanceDate);
            if (issuanceDate > now) {
                errors.push('Credential issuance date is in the future.');
            }
        }
        // Check expiration date
        if (claims.expirationDate) {
            const expirationDate = new Date(claims.expirationDate);
            if (expirationDate < now) {
                errors.push('Credential has expired.');
            }
        }
        // Check if credential is too old (e.g., older than 10 years for driver's license)
        if (claims.issuanceDate) {
            const issuanceDate = new Date(claims.issuanceDate);
            const maxAge = this.getMaxAgeForCredentialType(credentialType);
            const ageInYears = (now.getTime() - issuanceDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
            if (ageInYears > maxAge) {
                errors.push(`Credential is too old (${Math.floor(ageInYears)} years). Maximum age for ${credentialType} is ${maxAge} years.`);
            }
        }
        const compliant = errors.length === 0;
        return {
            compliant,
            errors: compliant ? undefined : errors,
            details: {
                policyName: 'Expiration',
                credentialType,
                issuanceDate: claims.issuanceDate,
                expirationDate: claims.expirationDate,
                isExpired: claims.expirationDate ? new Date(claims.expirationDate) < now : false
            }
        };
    }
    /**
     * Gets the maximum age in years for a credential type
     * @param credentialType - The type of credential
     * @returns number - Maximum age in years
     */
    getMaxAgeForCredentialType(credentialType) {
        const maxAges = {
            'DriverLicense': 10,
            'Passport': 10,
            'NationalID': 15,
            'mDL': 10,
            'VerifiableCredential': 5
        };
        for (const [type, maxAge] of Object.entries(maxAges)) {
            if (credentialType.includes(type)) {
                return maxAge;
            }
        }
        return 5; // Default max age
    }
}
//# sourceMappingURL=validity.js.map