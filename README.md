# Credential Verifier SDK

A decoupled, protocol-agnostic Verifier SDK for digital credentials. This SDK uses self-describing handlers, pluggable protocol adapters, and post-verification policy modules for flexible, modern credential verification.

---

## 🏗️ Architecture Overview

- **Crypto Suites:** Modular cryptographic suites for W3C Data Integrity, JWS, and mDL (mobile driver’s license).
- **Handlers:** Self-describing modules for each credential format (W3C, mDL).
- **Protocol Adapters:** Pluggable adapters for OID4VP, DIDComm, CHAPI, WACI, SIOP, and VC-API.
- **Policies:** Post-verification business rules (e.g., age, expiration).
- **TypeScript Interfaces:** Strongly-typed, extensible SDK contracts.

---

## 🔐 Crypto Suites

All crypto suites are in `src/crypto/` and exported from the main entry point:

- **Ed25519** (`ed25519Suite`): W3C Data Integrity, Ed25519 signatures
- **JWS** (`jwsSuite`): W3C JWS (JsonWebSignature2020)
- **ECDSA secp256r1** (`ecdsaR1Suite`): W3C Data Integrity
- **ECDSA secp256k1** (`ecdsaR2Suite`): W3C Data Integrity
- **BBS+** (`bbsSuite`): W3C Data Integrity, selective disclosure
- **mDoc** (`mdocDeviceAuthSuite`): Mobile Driver’s License (ISO 18013-5)

---

## 🧩 Handlers

Handlers are self-describing modules that encapsulate format-specific logic:

- **W3cHandler:** For W3C Verifiable Credentials and Presentations
- **MdlHandler:** For Mobile Driver’s License (mDL) credentials

Each handler implements:
```typescript
interface CredentialHandler {
  canHandle(presentation: VerifiablePresentation): boolean;
  verify(presentation: VerifiablePresentation, request?: PresentationRequest): Promise<VerificationResult>;
}
```

---

## 🔌 Protocol Adapters

Adapters in `src/protocol-adapters/` make the SDK protocol-agnostic:

- **OID4VP** (`OID4VP_Adapter`): OpenID for Verifiable Presentations
- **DIDComm** (`DIDCommAdapter`): Decentralized messaging
- **CHAPI** (`CHAPIAdapter`): Browser-based credential exchange
- **WACI** (`WACIAdapter`): Wallet and Credential Interactions
- **SIOP** (`SIOPAdapter`): Self-Issued OpenID Provider
- **VC-API** (`VCAPIAdapter`): W3C REST API

All adapters implement a common interface for receiving and responding to credential requests.

---

## 🛡️ Policy Modules

Policies are post-verification business rules:

- **AgeVerificationPolicy:** Age/ARF compliance
- **ValidityPolicy:** Expiration and validity

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

## 🚀 Usage Example

```typescript
import { createVerifier } from './src/core/index';
import { W3cHandler } from './src/handlers/w3c-credential';
import { MdlHandler } from './src/handlers/mobile-license';
import { AgeVerificationPolicy, ValidityPolicy } from './src/policies';

// Create handlers
const w3cHandler = new W3cHandler();
const mdlHandler = new MdlHandler();

// Create policies
const agePolicy = new AgeVerificationPolicy();
const validityPolicy = new ValidityPolicy();

// Create verifier
const verifier = createVerifier({
  handlers: [w3cHandler, mdlHandler],
  policies: {
    'age_verification': agePolicy,
    'validity': validityPolicy
  }
});

// Example verification (see examples/simple-usage.ts for full code)
const result = await verifier.verify(presentation, {
  id: 'request-1',
  policies: ['age_verification', 'validity'],
  request_credentials: [{ type: 'VerifiableCredential', required: true }],
  challenge: 'challenge-123'
});
```

---

## 📁 Project Structure

```
credential-verifier-sdk/
├── src/
│   ├── core/                  # Verifier implementation & factories
│   ├── crypto/                # Crypto suites (Ed25519, JWS, ECDSA, BBS+, mDoc)
│   ├── handlers/              # Credential handlers (W3C, mDL)
│   ├── policies/              # Policy modules (age, validity)
│   ├── protocol-adapters/     # Protocol adapters (OID4VP, DIDComm, etc)
│   └── types/                 # TypeScript interfaces
├── examples/
│   └── simple-usage.ts        # Usage example
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