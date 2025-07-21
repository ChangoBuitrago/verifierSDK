# Credential Verifier SDK

A decoupled, protocol-agnostic Verifier SDK for digital credentials. This SDK uses modular handlers, pluggable protocol adapters, and post-verification policy modules for flexible, modern credential verification.

---

## 🏗️ Architecture Overview

- **Crypto Suites:** Modular cryptographic suites for W3C Data Integrity, JWS, SD-JWT, and mDL (mobile driver’s license).
- **Handlers:** Modular handlers for each credential format (W3C, mDL, SD-JWT).
- **Protocol Adapters:** Pluggable adapters for OID4VP, DIDComm, CHAPI, WACI, SIOP, and VC-API.
- **Policies:** Post-verification business rules (e.g., age, validity, EUDI).
- **TypeScript Interfaces:** Strongly-typed, extensible SDK contracts.

---

## 🔐 Crypto Suites

All crypto suites are in `src/crypto/` and exported from the main entry point:

- **Ed25519** (`ed25519Suite`): W3C Data Integrity, Ed25519 signatures (mocked)
- **JWS** (`jwsSuite`): W3C JWS (JsonWebSignature2020)
- **ECDSA secp256r1** (`ecdsaR1Suite`)
- **ECDSA secp256k1** (`ecdsaR2Suite`)
- **BBS+** (`bbsSuite`)
- **mDoc** (`mdocDeviceAuthSuite`): Mobile Driver’s License (ISO 18013-5)

---

## 🧩 Handlers

Handlers encapsulate format-specific logic:

- **W3cHandler:** For W3C Verifiable Credentials and Presentations (`src/handlers/w3c-handler.ts`)
- **MdlHandler:** For Mobile Driver’s License (mDL) credentials (`src/handlers/mdl-handler.ts`)
- **SdJwtHandler:** For Selective Disclosure JWT credentials (`src/handlers/sd-jwt-handler.ts`)

---

## 🔌 Protocol Adapters

Adapters in `src/protocol-adapters/` make the SDK protocol-agnostic:

- **OID4VP** (`oid4vp-adapter.ts`)
- **DIDComm** (`didcomm-adapter.ts`)
- **CHAPI** (`chapi-adapter.ts`)
- **WACI** (`waci-adapter.ts`)
- **SIOP** (`siop-adapter.ts`)
- **VC-API** (`vc-api-adapter.ts`)

All adapters implement a common interface for receiving and responding to credential requests.

---

## 🛡️ Policy Modules

Policies are post-verification business rules:

- **AgeVerificationPolicy:** Age/ARF compliance (`src/policies/age-policy.ts`)
- **ValidityPolicy:** Expiration and validity (`src/policies/validity-policy.ts`)
- **EudiPolicy:** EUDI credential compliance (`src/policies/eudi-policy.ts`)

---

## 📋 TypeScript Interfaces

All interfaces are in `src/types/interfaces.ts`:

```typescript
export interface CredentialVerifier {
  createRequest(options: { comment: string }): PresentationRequest;
  verify(vp: VerifiablePresentation, request: PresentationRequest): Promise<VerificationResult>;
}

export interface CredentialIssuer {
  issue(request: CredentialRequest): Promise<VerifiableCredential>;
}

export interface CredentialHolderWallet {
  requestCredential(issuerEndpoint: URL, request: CredentialRequest): Promise<VerifiableCredential>;
  storeCredential(vc: VerifiableCredential): Promise<{ id: string }>;
  createPresentation(request: PresentationRequest): Promise<VerifiablePresentation>;
}
```

---

## 🚀 Usage Examples

### W3C + EUDI + Age Verification

```typescript
import { createVerifier } from '../src/core/index.ts';
import { W3cHandler } from '../src/handlers/w3c-handler.ts';
import { EudiPolicy, AgeVerificationPolicy } from '../src/policies/index.ts';
import { VerifiablePresentation } from '../src/types/index.ts';

const w3cHandler = new W3cHandler();
const verifier = createVerifier({
  handlers: [w3cHandler],
  policies: {
    'eudi': new EudiPolicy(),
    'age_verification': new AgeVerificationPolicy()
  }
});

const eudiCredential: VerifiablePresentation = { /* ...see examples/w3c-eudi-age-example.ts... */ };

const result = await verifier.verify(eudiCredential, {
  id: 'eudi-request',
  policies: ['eudi', 'age_verification'],
  request_credentials: [{ type: 'EuropeanDigitalIdentityCredential', required: true }],
  challenge: 'eudi-challenge'
});
console.log('EUDI + Age Verification Result:', result);
```

### mDL + Validity

```typescript
import { createVerifier } from '../src/core/index.ts';
import { MdlHandler, MdlPresentation } from '../src/handlers/mdl-handler.ts';
import { ValidityPolicy } from '../src/policies/index.ts';

const mdlHandler = new MdlHandler();
const verifier = createVerifier({
  handlers: [mdlHandler],
  policies: { 'validity': new ValidityPolicy() }
});

const mdlCredential: MdlPresentation = { /* ...see examples/mdl-validity-example.ts... */ };

const result = await verifier.verify(mdlCredential as any, {
  id: 'mdl-validity-request',
  policies: ['validity'],
  request_credentials: [{ type: 'mDL', required: true }],
  challenge: 'mdl-validity-challenge'
});
console.log('mDL + Validity Result:', result);
```

---

## 📁 Project Structure

```
credential-verifier-sdk/
├── src/
│   ├── core/                  # Verifier implementation & factories
│   ├── crypto/                # Crypto suites
│   ├── handlers/              # Credential handlers
│   ├── policies/              # Policy modules
│   ├── protocol-adapters/     # Protocol adapters
│   └── types/                 # TypeScript interfaces
├── examples/
│   ├── w3c-eudi-age-example.ts
│   └── mdl-validity-example.ts
├── index.ts                   # Main entry point
├── package.json
└── README.md
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add your changes and tests
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details. 