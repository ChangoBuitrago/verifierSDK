import { VerifiableCredential, StatusChecker, StatusResult } from '../types/index.ts';

export class BitstringStatusListChecker implements StatusChecker {
  canHandle(credential: VerifiableCredential): boolean {
    return credential.status?.type === 'BitstringStatusList';
  }
  async checkStatus(credential: VerifiableCredential): Promise<StatusResult> {
    // Example logic for custom bitstring status list
    if (!credential.status) return { active: true };
    return { active: true };
  }
} 