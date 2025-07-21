import {
  CredentialHandler,
  CredentialVerifier,
  CredentialVerifierOptions,
  Policy,
  VerifiableCredential,
  VerifiablePresentation,
  VerificationResult,
} from "./interfaces";

export class Verifier implements CredentialVerifier {
  constructor(options: CredentialVerifierOptions) {}

  async verify(
    credential: VerifiableCredential | VerifiablePresentation | string,
    options?: {
      policies?: Policy[];
      handler?: CredentialHandler;
      domain?: string;
      challenge?: string;
    }
  ): Promise<VerificationResult> {
    return {
      verified: false,
      credentials: [],
      policyResults: {},
    };
  }
}
