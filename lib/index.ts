import { CredentialVerifier, CredentialVerifierOptions } from "./interfaces";
import { Verifier } from "./verifier";

export function createVerifier(
  options: CredentialVerifierOptions
): CredentialVerifier {
  return new Verifier(options);
}
