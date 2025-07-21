import { VerifiableCredential, StatusChecker, StatusResult } from '../types/index.ts';

export class StatusList2021Checker implements StatusChecker {
  canHandle(credential: VerifiableCredential): boolean {
    return credential.status?.type === 'StatusList2021';
  }
  async checkStatus(credential: VerifiableCredential): Promise<StatusResult> {
    // Example logic: fetch status list, decode bitstring, check index
    // This is a stub/mock implementation
    if (!credential.status) return { active: true };
    // In real code, fetch credential.status.statusListCredential, decode, check index
    return { active: true };
  }
} 