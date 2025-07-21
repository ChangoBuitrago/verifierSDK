/**
 * EUDI Credential Policy
 * Ensures credentials meet European Digital Identity (EUDI) requirements
 */

import { Policy, PolicyResult, VerificationData } from '../types';

export class EudiPolicy implements Policy {
  /**
   * Executes the EUDI compliance policy
   * @param verificationData - The verification data from the handler
   * @returns PolicyResult - Whether the credential is EUDI compliant
   */
  execute(verificationData: VerificationData): PolicyResult {
    const { claims, credentialType, issuer } = verificationData;
    const errors: string[] = [];

    // 1. Check type
    if (!credentialType.includes('EuropeanDigitalIdentityCredential')) {
      errors.push('Credential type is not EuropeanDigitalIdentityCredential.');
    }

    // 2. Check required EUDI claims
    const requiredClaims = ['family_name', 'given_name', 'birth_date'];
    for (const claim of requiredClaims) {
      if (!claims[claim]) {
        errors.push(`Missing required EUDI claim: ${claim}`);
      }
    }

    // 3. Check trusted issuer (example, adapt as needed)
    const trustedEUDI = [
      'did:example:eudi-authority',
      'did:eu:trusted-issuer'
    ];
    if (issuer && !trustedEUDI.includes(issuer)) {
      errors.push(`Issuer '${issuer}' is not a trusted EUDI issuer.`);
    }

    return {
      compliant: errors.length === 0,
      errors: errors.length ? errors : undefined,
      details: {
        policyName: 'EUDI Credential',
        credentialType,
        issuer,
        hasRequiredClaims: requiredClaims.every(claim => !!claims[claim])
      }
    };
  }
} 