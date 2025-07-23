import { createVerifier } from ".";
import {
  CredentialConstraints,
  CredentialPolicy,
  PolicyResult,
  VerificationData,
} from "./policy";
import { VerifiablePresentation } from "./vc-vp";

class IsOver18Policy implements CredentialPolicy {
  getCredentialConstraints(): CredentialConstraints {
    return {
      type: "DriversLicense",
      required: true,
      constraints: {
        birthDate: {
          type: "date-time",
          greaterThan: new Date(
            Date.now() - 18 * 365 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
      },
      format: "jwt-vc",
    };
  }

  execute(verificationData: VerificationData): PolicyResult {
    return {
      compliant:
        verificationData.credentialSubject.birthDate <
        new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000).toISOString(),
    };
  }
}

async function main() {
  const verifier = createVerifier({
    didResolver: {},
    logger: console.log as any,
    schemaValidator: {
      validate: () => Promise.resolve({ valid: true }),
    },
    cryptosuites: {
      "eddsa-rdfc-2022": {
        verify: () => Promise.resolve(true),
      },
    } as any,
  });

  const presentationRequest = verifier.createRequest({
    policies: [new IsOver18Policy()],
    proofOptions: {
      purpose: "authentication",
      challengeGenerator: () => Math.random().toString(36).substring(2),
      domain: "security-domain",
      type: ["eddsa-rdfc-2022"],
    },
  });

  console.log(presentationRequest);
  // HERE WE SHOULD USE AN ADAPTER TO TRANSLATE REQUEST TO EXCHANGE PROTOCOL FORMAT ===>

  // AND LATER HERE, WE SHOULD USE AN ADAPTER AGAIN TO TRANSLATE FROM THE EXCHANGE PROTOCOL FORMAT TO THE RAW PRESENTATION <===

  const receivedPresentation = {
    id: "presentation-id",
    holder: "did:example:123",
    verifier: "did:example:456",
    proof: {
      type: "eddsa-rdfc-2022",
      proofValue: "proof-value",
    },
    credential: [{}],
  } as unknown as VerifiablePresentation;

  const verificationResult = await verifier.verify(
    receivedPresentation,
    presentationRequest
  );
}
