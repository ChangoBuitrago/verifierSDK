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
