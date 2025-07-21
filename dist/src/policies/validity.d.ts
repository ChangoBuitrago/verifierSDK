/**
 * Expiration Policy
 * Ensures credentials are not expired and are within acceptable validity periods
 */
import { Policy, PolicyResult, VerificationData } from '../types';
export declare class ValidityPolicy implements Policy {
    /**
     * Executes the expiration policy
     * @param verificationData - The verification data from the handler
     * @returns PolicyResult - Whether the credential is within valid dates
     */
    execute(verificationData: VerificationData): PolicyResult;
    /**
     * Gets the maximum age in years for a credential type
     * @param credentialType - The type of credential
     * @returns number - Maximum age in years
     */
    private getMaxAgeForCredentialType;
}
//# sourceMappingURL=validity.d.ts.map