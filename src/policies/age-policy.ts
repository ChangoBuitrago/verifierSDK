/**
 * Age Verification Policy (compact)
 * Passes if a birthdate claim is present
 */

import { Policy, PolicyResult, VerificationData } from '../types';

export class AgeVerificationPolicy implements Policy {
  execute(verificationData: VerificationData): PolicyResult {
    const { claims } = verificationData;
    const hasBirthdate = !!(claims.birthdate || claims.birth_date || claims.dateOfBirth);
    return {
      compliant: hasBirthdate,
      errors: hasBirthdate ? undefined : ['Missing required birthdate claim'],
      details: { policyName: 'Age Verification', hasBirthdate }
    };
  }
} 