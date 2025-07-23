export type ProofPurpose =
  | "authentication"
  | "assertionMethod"
  | "keyAgreement"
  | "capabilityDelegation"
  | "capabilityInvocation";

export type EdDSACryptosuite =
  | "eddsa-rdfc-2022"
  | "eddsa-jcs-2022"
  | "Ed25519Signature2020";

export type ECDSACryptosuite =
  | "ecdsa-rdfc-2019"
  | "ecdsa-jcs-2019"
  | "ecdsa-sd-2023";

export type Cryptosuite = EdDSACryptosuite | ECDSACryptosuite;
