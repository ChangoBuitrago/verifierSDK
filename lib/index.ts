import { CredentialVerifier, CredentialVerifierOptions } from "./interfaces";
import { Verifier } from "./verifier";

export function createVerifier(
  options: CredentialVerifierOptions
): CredentialVerifier {
  return new Verifier(options);
}

// Usage example
// const verifier = createVerifier({
//   didResolver: new DidResolver(),
//   logger: new Logger(),
//   schemaValidator: new SchemaValidator(),
// });
// Credential can be a vc, vp, cose string, jose string, sd-jwt
// verifier.verify(credential, {
//   policies: [new Over18Policy()],
//   handler:
//     new W3CHandler() /
//     new COSEHandler() /
//     new JOSEHandler() /
//     new SDJWTHandler(),
//   domain: "https://example.com",
//   challenge: "1234567890",
// });
