import { CredentialSubject } from "./vc-vp";

export interface SchemaValidationResult {
  valid: boolean;
  errors?: string[];
}

/**
 * Interface for a schema validator dependency. It's a special type of policy that validates the schema of the credential.
 */
export interface SchemaValidator {
  validate(
    credentialType: string,
    credentialSubject: CredentialSubject
  ): Promise<SchemaValidationResult>;
}
