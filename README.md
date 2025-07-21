# Credential Verifier SDK

A decoupled, protocol-agnostic Verifier SDK for digital credentials. This SDK uses modular handlers, pluggable protocol adapters, and post-verification policy modules for flexible, modern credential verification.

---

## 🚀 Example Usage

You can run four example scripts using npm:

```sh
npm run example:mdl-validity    # mDL + Validity example
npm run example:w3c-eudi        # W3C EUDI + Over18 example
npm run example:w3c-over18      # W3C + Over18 example
npm run example:sd-jwt          # SD-JWT example
```

---

## 🏗️ Architecture Overview

- **Crypto Suites:** Modular cryptographic suites for W3C Data Integrity, JWS, SD-JWT, and mDL (mobile driver’s license).
- **Handlers:** Modular handlers for each credential format (W3C, mDL, SD-JWT).
- **Protocol Adapters:** Pluggable adapters for OID4VP, DIDComm, CHAPI, WACI, SIOP, and VC-API.
- **Policies:** Post-verification business rules (e.g., age, validity, EUDI).
- **TypeScript Interfaces:** Strongly-typed, extensible SDK contracts.

---

## 📁 Project Structure

```
credential-verifier-sdk/
├── src/
│   ├── core/                  # Verifier implementation & factories
│   ├── crypto/                # Crypto suites (Ed25519, JWS, ECDSA, BBS+, mDoc, SD-JWT)
│   ├── handlers/              # Credential handlers (W3C, mDL, SD-JWT)
│   ├── policies/              # Policy modules (age, validity, over18, eudi)
│   ├── protocol-adapters/     # Protocol adapters (OID4VP, DIDComm, etc)
│   └── types/                 # TypeScript interfaces
├── examples/
│   ├── mdl-validity-example.ts        # mDL + Validity example
│   ├── w3c-eudi-over18-example.ts     # W3C EUDI + Over18 example
│   ├── w3c-over18-example.ts          # W3C + Over18 example
│   └── sd-jwt-example.ts              # SD-JWT example
├── index.ts                   # Main entry point
├── package.json
└── README.md
```

---

## 🧩 Handlers

Handlers encapsulate format-specific logic:

- **W3cHandler:** For W3C Verifiable Credentials and Presentations (`src/handlers/w3c-handler.ts`)
- **MdlHandler:** For Mobile Driver’s License (mDL) credentials (`src/handlers/mdl-handler.ts`)
- **SdJwtHandler:** For SD-JWT credentials and presentations (`src/handlers/sd-jwt-handler.ts`)

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

- **AgeVerificationPolicy:** Age/ARF compliance
- **ValidityPolicy:** Expiration and validity
- **Over18Policy:** Simple age >= 18 check
- **EudiPolicy:** EUDI credential compliance

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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add your changes and tests
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details. 