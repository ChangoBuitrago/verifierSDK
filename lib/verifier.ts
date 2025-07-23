import {
  CredentialVerifier,
  CredentialVerifierOptions,
  CredentialVerifierPresentationRequest,
  CredentialVerifierRequestOptions,
  VerificationResult,
} from "./interfaces";
import { VerifiablePresentation } from "./vc-vp";

export class Verifier implements CredentialVerifier {
  constructor(options: CredentialVerifierOptions) {}

  createRequest(
    options: CredentialVerifierRequestOptions
  ): CredentialVerifierPresentationRequest {
    return {
      id: Math.random().toString(36).substring(2),
      credentials:
        options.policies?.map((policy) => {
          return {
            ...policy.getCredentialConstraints(),
            proofOptions: {
              purpose: options.proofOptions.purpose,
              type: options.proofOptions.type,
            },
          };
        }) ?? [],
      proofOptions: options.proofOptions,
    };
  }

  async verify(
    presentation: VerifiablePresentation,
    presentationRequest: CredentialVerifierPresentationRequest
  ): Promise<VerificationResult> {
    // Based on the presentation request, the verifier will know what credentials to verify and what policies to use
    return {
      verified: false,
      credentials: [],
      policyResults: {},
      errors: {
        type: "NotImplemented",
        title: "Verification not implemented",
        details: "This is a stubbed response.",
      },
      warnings: [
        {
          type: "StubWarning",
          title: "Stubbed verification",
          details: "No actual verification was performed.",
        },
      ],
    };
  }
}
