// examples/sd-jwt-example.ts
import { SdJwtHandler } from '../src/handlers/sd-jwt-handler.ts';
import { VerifiablePresentation } from '../src/types/index.ts';

// Mock SD-JWT presentation
const sdJwtPresentation: VerifiablePresentation = {
  '@context': ['https://www.w3.org/2018/credentials/v1'],
  type: ['VerifiablePresentation'],
  verifiableCredential: [
    {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      id: 'urn:uuid:1234',
      type: ['VerifiableCredential', 'SD-JWT'],
      issuer: 'did:example:issuer',
      issuanceDate: '2024-01-01T00:00:00Z',
      credentialSubject: {
        id: 'did:example:holder',
        givenName: 'Alice',
        familyName: 'Doe',
        age: 30
      },
      proof: {
        type: 'SD-JWT',
        created: '2024-01-01T00:00:00Z',
        verificationMethod: 'did:example:issuer#key-1',
        proofPurpose: 'assertionMethod',
        sdJwt: 'mock-sd-jwt-token'
      }
    }
  ],
  holder: 'did:example:holder',
  proof: {
    type: 'SD-JWT',
    created: '2024-01-01T00:00:00Z',
    verificationMethod: 'did:example:holder#key-1',
    proofPurpose: 'authentication',
    sdJwt: 'mock-sd-jwt-token'
  }
};

async function run() {
  const handler = new SdJwtHandler();
  if (handler.canHandle(sdJwtPresentation)) {
    const result = await handler.verify(sdJwtPresentation);
    console.log('SD-JWT Verification Result:', result);
  } else {
    console.log('Handler cannot process this presentation.');
  }
}

run(); 