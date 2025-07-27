import {
  CredentialVerifier,
  CredentialVerifierOptions,
  CredentialVerifierPresentationRequest,
  CredentialVerifierRequestOptions,
  VerificationResult,
  VerifyOptions,
} from "./interfaces";
import { VerifiablePresentation } from "./vc-vp";

export class Verifier implements CredentialVerifier {
  constructor(options: CredentialVerifierOptions) {}

  createRequest(
    options: CredentialVerifierRequestOptions
  ): CredentialVerifierPresentationRequest {
    const policies = options.policies?.map((policy) => {
      if (typeof policy === "function") {
        return new policy();
      }
      return policy;
    });
    return {
      id: Math.random().toString(36).substring(2),
      credentials:
        policies?.map((policy) => {
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
    presentationRequest: CredentialVerifierPresentationRequest,
    options?: VerifyOptions
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
