# Credential Verifier SDK

A decoupled, agnostic Verifier SDK with pluggable handlers for different credential formats. This SDK is built on the principle of **decoupled, self-describing handlers**, where each module is responsible for both identifying and verifying the specific credential format it supports.

## 🎯 **Two Implementation Approaches**

This SDK provides **both JavaScript and TypeScript implementations**:

1. **JavaScript Implementation** - Complete working example with OID4VP integration
2. **TypeScript Implementation** - Follows your interface specifications with full type safety

## 📋 **Your Interface Specifications**

The TypeScript implementation follows your exact interface definitions:

```typescript
// Core interfaces from sdk-types.ts
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

## 🏗️ Architecture

The SDK follows a modular architecture with these key components:

### 1. Crypto Suites (Internal Dependencies)
- **`src/crypto/ed25519-suite.ts`** - Ed25519 cryptographic operations for W3C credentials
- **`src/crypto/mdoc-suite.ts`** - mDoc cryptographic operations for mobile driver's licenses

### 2. Self-Describing Handlers
- **`src/handlers/w3c-credential.ts`** - Handles W3C Verifiable Credentials
- **`src/handlers/mobile-license.ts`** - Handles Mobile Driver's License (mDL) credentials

### 3. Core Implementation
- **`src/core/index.ts`** - Verifier implementation and factory functions

### 4. Type Definitions
- **`src/types/interfaces.ts`** - All TypeScript interfaces and data structures
- **`src/types/index.ts`** - Type exports

### 5. Protocol Adapters
- **`src/protocol-adapters/oid4vp.ts`** - OpenID Connect for Verifiable Presentations adapter

### 6. Policy Modules
- **`src/policies/age-verification.ts`** - Age verification and compliance policy
- **`src/policies/validity.ts`** - Credential expiration and validity policy

## 🚀 Quick Start

### Installation

```bash
npm install
```

### TypeScript Implementation

```typescript
import { createVerifier, W3cHandler, MdlHandler, AgeVerificationPolicy, ValidityPolicy } from './index';

// Create handlers
const w3cHandler = new W3cHandler();
const mdlHandler = new MdlHandler();

// Create policies
const agePolicy = new AgeVerificationPolicy();
const validityPolicy = new ValidityPolicy();

// Create verifier with handlers and policies
const verifier = createVerifier({
  handlers: [w3cHandler, mdlHandler],
  policies: {
    'age_verification': agePolicy,
    'validity': validityPolicy
  }
});

// Verify a credential with policies
const result = await verifier.verify(presentation, {
  id: 'request-1',
  policies: ['age_verification', 'validity'],
  request_credentials: [{ type: 'VerifiableCredential', required: true }],
  challenge: 'challenge-123'
});
```

### Running Examples

```bash
# Build the project
npm run build

# Clean build artifacts
npm run clean
```

**Note**: The `examples/simple-usage.ts` file contains a complete working example of the SDK with policies. You can run it directly with `ts-node --esm examples/simple-usage.ts` if you have ts-node installed globally.

## 📋 API Reference

### `createVerifier(options)`

Factory function to create a configured Verifier instance.

**Parameters:**
- `options.handlers` (Array) - Array of handler instances

**Returns:** VerifierImpl instance

### `VerifierImpl`

#### `verify(presentation, originalRequest?)`

Verifies a presentation using the appropriate handler.

**Parameters:**
- `presentation` (Object) - The presentation to verify
- `originalRequest` (Object, optional) - The original verification request

**Returns:** Promise<Object> - Verification result

#### `addHandler(handler)`

Adds a new handler to the verifier.

#### `removeHandler(handler)`

Removes a handler from the verifier.

#### `getHandlerInfo()`

Returns information about all registered handlers.

### Handler Interface

All handlers must implement:

```javascript
class CustomHandler {
  canHandle(presentation) {
    // Return true if this handler can process the presentation
  }
  
  async verify(presentation, originalRequest) {
    // Verify the presentation and return result
    return { status: 'verified' | 'rejected', type: 'CustomType' };
  }
}
```

## 🔧 Supported Credential Types

### W3C Verifiable Credentials

```javascript
const w3cCredential = {
  "@context": ["https://www.w3.org/2018/credentials/v1"],
  type: ["VerifiableCredential"],
  credentialSubject: {
    id: "did:example:123",
    givenName: "John",
    familyName: "Doe"
  },
  proof: {
    type: "Ed25519Signature2020",
    created: "2023-01-01T00:00:00Z",
    verificationMethod: "did:example:123#key-1",
    signature: "signature-data"
  }
};
```

## 📝 **TypeScript Implementation Details**

The TypeScript implementation provides full type safety and follows your exact interface specifications:

### **Core Interfaces Implemented**

✅ **CredentialVerifier** - Creates requests and verifies presentations  
✅ **CredentialIssuer** - Issues new verifiable credentials  
✅ **CredentialHolderWallet** - Manages credential storage and presentation creation  

### **Factory Functions**

```typescript
// Create a verifier with handlers and policies
const verifier = createCredentialVerifier({
  handlers: {
    'w3c': new W3cHandler(),
    'mdl': new MdlHandler()
  },
  policies: {
    'expiration': expirationPolicy
  }
});

// Create an issuer with formatters and signers
const issuer = createCredentialIssuer({
  formatters: { 'json': jsonFormatter },
  signers: { 'ed25519': ed25519Signer },
  issuerDid: 'did:example:issuer'
});
```

### **Handler Interface**

```typescript
interface CredentialHandler {
  canHandle(presentation: VerifiablePresentation): boolean;
  verify(presentation: VerifiablePresentation, request: PresentationRequest): Promise<VerificationResult>;
}
```

### Mobile Driver's License (mDL)

```javascript
const mdlCredential = {
  deviceResponse: {
    deviceAuth: {
      deviceKey: "device-key-certificate",
      sessionTranscript: "session-transcript-hash",
      authSignature: "device-auth-signature"
    },
    mdoc: {
      dataElements: {
        "org.iso.18013.5.1": {
          "given_name": "John",
          "family_name": "Doe"
        }
      }
    }
  }
};
```

## 🌐 Protocol Integration

### OID4VP Integration Example

```javascript
import { OID4VP_Adapter } from './src/protocol-adapters/oid4vp.js';

// In your Express.js route handler
async function handlePresentationRequest(req, res) {
  try {
    // Parse OID4VP request
    const { vp, originalRequest } = await OID4VP_Adapter.receivePresentation(req);
    
    // Verify using agnostic SDK
    const result = await verifier.verify(vp, originalRequest);
    
    // Create OID4VP response
    const response = OID4VP_Adapter.createResponse(result);
    
    res.json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
```

## 🧪 Testing

The SDK includes comprehensive tests demonstrating:

- Handler creation and configuration
- Handler capabilities detection
- Verifier creation and management
- W3C credential verification
- mDL credential verification
- Error handling for unsupported formats
- Dynamic handler management
- Input validation

Run tests with:

```bash
npm test
```

## 🔌 Extending the SDK

### Adding a New Handler

1. Create a new handler file:

```javascript
// src/handlers/custom.js
import { customCryptoSuite } from '../crypto/custom.js';

export class CustomHandler {
  constructor() {
    this.cryptoSuite = customCryptoSuite;
  }
  
  canHandle(presentation) {
    return presentation.type === 'CustomFormat';
  }
  
  async verify(presentation, originalRequest) {
    // Custom verification logic
    const isValid = await this.cryptoSuite.verify(presentation);
    return { 
      status: isValid ? 'verified' : 'rejected', 
      type: 'CustomFormat' 
    };
  }
}
```

2. Register the handler:

```javascript
import { CustomHandler } from './src/handlers/custom.js';

const customHandler = new CustomHandler();
verifier.addHandler(customHandler);
```

### Adding a New Protocol Adapter

1. Create a new adapter:

```javascript
// src/protocol-adapters/custom-protocol.js
export class CustomProtocolAdapter {
  static async receivePresentation(request) {
    // Parse custom protocol request
    return { presentation, originalRequest };
  }
  
  static createResponse(result, options) {
    // Format response for custom protocol
    return formattedResponse;
  }
}
```

## 📁 Project Structure

```
credential-verifier-sdk/
├── src/
│   ├── crypto/
│   │   ├── ed25519-suite.ts    # Ed25519 crypto operations
│   │   └── mdoc-suite.ts       # mDoc crypto operations
│   ├── handlers/
│   │   ├── w3c-credential.ts   # W3C credential handler
│   │   └── mobile-license.ts   # mDL credential handler
│   ├── policies/
│   │   ├── age-verification.ts # Age verification policy
│   │   ├── validity.ts         # Credential validity policy
│   │   └── index.ts            # Policy exports
│   ├── protocol-adapters/
│   │   └── oid4vp.ts           # OID4VP protocol adapter
│   ├── types/
│   │   ├── interfaces.ts       # All TypeScript interfaces
│   │   └── index.ts            # Type exports
│   └── core/
│       └── index.ts            # Verifier implementation & factories
├── examples/
│   └── simple-usage.ts         # Usage example
├── index.ts                    # Main entry point
├── package.json
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details. 