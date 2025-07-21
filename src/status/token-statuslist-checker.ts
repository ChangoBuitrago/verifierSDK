import { VerifiableCredential, StatusChecker, StatusResult } from '../types/index.ts';

export class TokenStatusListChecker implements StatusChecker {
  canHandle(credential: VerifiableCredential): boolean {
    return credential.status?.type === 'TokenStatusList';
  }
  async checkStatus(credential: VerifiableCredential): Promise<StatusResult> {
    // Example logic for token status list
    if (!credential.status) return { active: true };
    return { active: true };
  }
} 