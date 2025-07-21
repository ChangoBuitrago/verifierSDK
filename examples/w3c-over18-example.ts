import { createVerifier } from '../src/core/index.ts';
import { W3cHandler } from '../src/handlers/w3c-handler.ts';
import { Over18Policy } from '../src/policies/index.ts';
import { VerifiablePresentation } from '../src/types/index.ts';

// Create handler
const w3cHandler = new W3cHandler();

// Create policy
const over18Policy = new Over18Policy();

// Create verifier
const verifier = createVerifier({
  handlers: [w3cHandler],
  policies: {
    'over18': over18Policy
  }
});

// Example W3C credential with birthdate
const w3cCredential: VerifiablePresentation = {
  '@context': ['https://www.w3.org/2018/credentials/v1'],
  type: ['VerifiablePresentation'],
  verifiableCredential: [
    {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      id: 'credential:w3c:001',
      type: ['VerifiableCredential', 'ExampleCredential'],
      issuer: 'did:example:issuer',
      issuanceDate: '2024-01-01T00:00:00Z',
      credentialSubject: {
        id: 'did:example:holder',
        name: 'Alice Example',
        birthdate: '2000-04-20',
        nationality: 'EU'
      },
      proof: {
        type: 'Ed25519Signature2020',
        created: '2024-01-01T00:00:00Z',
        verificationMethod: 'did:example:holder#key-1',
        proofPurpose: 'assertionMethod',
        proofValue: 'valid-signature'
      }
    }
  ],
  holder: 'did:example:holder',
  proof: {
    type: 'Ed25519Signature2020',
    created: '2024-01-01T00:00:00Z',
    verificationMethod: 'did:example:holder#key-1',
    proofPurpose: 'authentication',
    proofValue: 'valid-presentation-signature'
  }
};

async function run() {
  try {
    const result = await verifier.verify(w3cCredential, {
      id: 'w3c-request',
      policies: ['over18'],
      request_credentials: [{ type: 'ExampleCredential', required: true }],
      challenge: 'w3c-challenge'
    });
    console.log('W3C + Over 18 Verification Result:', result);
  } catch (error) {
    console.error('Caught error:', error);
  }
}

run(); 