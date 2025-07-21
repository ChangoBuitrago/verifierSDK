/**
 * Over 18 Policy (compact)
 * Passes if a birthdate claim is present and subject is at least 18 years old
 */

import { Policy, PolicyResult, VerificationData } from '../types';

export class Over18Policy implements Policy {
  execute(verificationData: VerificationData): PolicyResult {
    const { claims } = verificationData;
    const birthdate = claims.birthdate || claims.birth_date || claims.dateOfBirth;
    if (!birthdate) {
      return {
        compliant: false,
        errors: ['Missing required birthdate claim'],
        details: { policyName: 'Over 18', hasBirthdate: false }
      };
    }
    const birth = new Date(birthdate);
    const now = new Date();
    const age = now.getFullYear() - birth.getFullYear() - (now < new Date(now.getFullYear(), birth.getMonth(), birth.getDate()) ? 1 : 0);
    const compliant = age >= 18;
    return {
      compliant,
      errors: compliant ? undefined : [`Subject is not over 18 (age: ${age})`],
      details: { policyName: 'Over 18', hasBirthdate: true, age }
    };
  }
} 