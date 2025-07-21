/**
 * ARF Compliance Policy
 * Ensures credentials meet ARF (Age-Related Fraud) compliance requirements
 */
import { Policy, PolicyResult, VerificationData } from '../types';
export declare class AgeVerificationPolicy implements Policy {
    /**
     * Executes the ARF compliance policy
     * @param verificationData - The verification data from the handler
     * @returns PolicyResult - Whether the credential is ARF compliant
     */
    execute(verificationData: VerificationData): PolicyResult;
    /**
     * Checks if an issuer is trusted for ARF compliance
     * @param issuer - The issuer DID or identifier
     * @returns boolean - Whether the issuer is trusted
     */
    private isTrustedIssuer;
}
//# sourceMappingURL=age-verification.d.ts.map