import { createVerifier } from ".";
import {
  CredentialConstraints,
  CredentialPolicy,
  PolicyResult,
  VerificationData,
} from "./policy";
import { VerifiablePresentation } from "./vc-vp";

class DriversLicenseCredentialSchemaPolicy implements CredentialPolicy {
  _NAME = "DriversLicenseCredentialSchemaPolicy";

  getCredentialConstraints(): CredentialConstraints {
    return {
      type: "DriversLicense",
      schema: {
        uri: "urn:hedera:0.0.2823411",
      },
    };
  }

  execute(verificationData: VerificationData): PolicyResult {
    return {
      compliant: true,
    };
  }
}

class IsOver18Policy implements CredentialPolicy {
  _NAME = "IsOver18Policy";

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
      compliant: true,
    };
  }
}

async function main() {
  const verifier = createVerifier({
    didResolver: {},
    logger: console.log as any,
    cryptosuites: {
      "eddsa-rdfc-2022": {
        verify: () => Promise.resolve(true),
      },
    } as any,
  });

  const presentationRequest = verifier.createRequest({
    policies: [DriversLicenseCredentialSchemaPolicy, new IsOver18Policy()],
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
    presentationRequest,
    {
      policies: [DriversLicenseCredentialSchemaPolicy, new IsOver18Policy()],
      presentationHandler: () =>
        Promise.resolve({
          credentialSubject: {
            id: "did:example:123",
          },
          credentialType: ["DriversLicense"],
          issuer: "did:example:123",
          holder: "did:example:123",
        }),
    }
  );
}
