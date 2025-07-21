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

- **Protocol Adapters:** Pluggable adapters for OID4VP, DIDComm, CHAPI, WACI, SIOP, and VC-API.
- **Handlers:** Modular handlers for each credential format (W3C, mDL, SD-JWT).
- **Crypto Suites:** Modular cryptographic suites for W3C Data Integrity, JWS, SD-JWT, and mDL (mobile driver’s license).
- **Status Checker:** Pluggable revocation/status modules (e.g., StatusList2021, Bitstring, Token).
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
│   ├── status/                # Status checkers (StatusList2021, Bitstring, Token)
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

## 🧩 Handlers

Handlers encapsulate format-specific logic:

- **W3cHandler:** For W3C Verifiable Credentials and Presentations (`src/handlers/w3c-handler.ts`)
- **MdlHandler:** For Mobile Driver’s License (mDL) credentials (`src/handlers/mdl-handler.ts`)
- **SdJwtHandler:** For SD-JWT credentials and presentations (`src/handlers/sd-jwt-handler.ts`)

---

## 🔑 Crypto Suites

Crypto suites provide cryptographic operations for different credential formats:

- **Ed25519Suite:** Ed25519 Data Integrity proofs (`src/crypto/ed25519-suite.ts`)
- **JwsSuite:** JSON Web Signature proofs (`src/crypto/jws-suite.ts`)
- **EcdsaR1Suite:** ECDSA secp256r1 proofs (`src/crypto/ecdsa-r1-suite.ts`)
- **EcdsaR2Suite:** ECDSA secp256k1 proofs (`src/crypto/ecdsa-r2-suite.ts`)
- **BbsSuite:** BBS+ signature proofs (`src/crypto/bbs-suite.ts`)
- **MdocDeviceAuthSuite:** mDL (mobile driver’s license) device authentication (`src/crypto/mdoc-suite.ts`)
- **SdJwtSuite:** SD-JWT selective disclosure proofs (`src/handlers/sd-jwt-handler.ts`)

---

## 🛡️ Status Checker

The Status Checker is a pluggable component for credential status and revocation checking. It is injected into handlers (such as W3cHandler) and supports multiple mechanisms:

- **StatusList2021Checker:** Checks revocation using the W3C StatusList2021 bitstring mechanism (`src/status/statuslist2021-checker.ts`)
- **BitstringStatusListChecker:** Checks custom bitstring-based status lists (`src/status/bitstring-statuslist-checker.ts`)
- **TokenStatusListChecker:** Checks token-based status lists (`src/status/token-statuslist-checker.ts`)

You can implement your own status checker by following the `StatusChecker` interface in `src/types/interfaces.ts` and inject it into handlers for custom revocation logic.

---

## 🛡️ Policy Modules

Policies are post-verification business rules:

- **AgeVerificationPolicy:** Age/ARF compliance
- **ValidityPolicy:** Expiration and validity
- **Over18Policy:** Simple age >= 18 check
- **EudiPolicy:** EUDI credential compliance

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add your changes and tests
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details. 