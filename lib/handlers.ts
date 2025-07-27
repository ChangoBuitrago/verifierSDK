import { VerificationInput } from "./interfaces";
import { VerificationData } from "./policy";

export type CredentialHandler = (
  presentation: VerificationInput
) => Promise<VerificationData>;
