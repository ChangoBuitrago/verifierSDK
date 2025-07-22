import {
  CredentialVerifier,
  CredentialVerifierOptions,
  VerifiablePresentation,
  VerificationResult,
  PresentationRequest,
  VerifyOptions,
} from "./interfaces";

export class Verifier implements CredentialVerifier {
  constructor(options: CredentialVerifierOptions) {}

  createRequest(options: { policies?: string[]; challenge: string }): PresentationRequest {
    return {
      id: Math.random().toString(36).substring(2),
      challenge: options.challenge,
      policies: options.policies,
      request_credentials: [],
    };
  }

  async verify(
    presentation: VerifiablePresentation,
    originalRequest?: PresentationRequest,
    options?: VerifyOptions
  ): Promise<VerificationResult> {
    return {
      verified: false,
      credentials: [],
      policyResults: {},
      errors: {
        type: "NotImplemented",
        title: "Verification not implemented",
        details: "This is a stubbed response."
      },
      warnings: [
        {
          type: "StubWarning",
          title: "Stubbed verification",
          details: "No actual verification was performed."
        }
      ]
    };
  }
}
