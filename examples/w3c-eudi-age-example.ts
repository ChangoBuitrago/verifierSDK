import { createVerifier } from '../src/core/index';
import { W3cHandler } from '../src/handlers/w3c-credential';
import { EudiPolicy, AgeVerificationPolicy } from '../src/policies';
import { VerifiablePresentation } from '../src/types';

// Create handler
const w3cHandler = new W3cHandler();

// Create policies
const eudiPolicy = new EudiPolicy();
const agePolicy = new AgeVerificationPolicy();

// Create verifier
const verifier = createVerifier({
  handlers: [w3cHandler],
  policies: {
    'eudi': eudiPolicy,
    'age_verification': agePolicy
  }
});

// Example EUDI W3C credential
const eudiCredential: VerifiablePresentation = {
  '@context': ['https://www.w3.org/2018/credentials/v1'],
  type: ['VerifiablePresentation'],
  verifiableCredential: [
    {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      id: 'credential:eudi:001',
      type: ['VerifiableCredential', 'EuropeanDigitalIdentityCredential'],
      issuer: 'did:example:eudi-authority',
      issuanceDate: '2024-01-01T00:00:00Z',
      credentialSubject: {
        id: 'did:example:eudi-holder',
        family_name: 'Doe',
        given_name: 'Jane',
        birth_date: '1990-04-20',
        nationality: 'EU'
      },
      proof: {
        type: 'Ed25519Signature2020',
        created: '2024-01-01T00:00:00Z',
        verificationMethod: 'did:example:eudi-holder#key-1',
        proofPurpose: 'assertionMethod',
        proofValue: 'valid-eudi-signature'
      }
    }
  ],
  holder: 'did:example:eudi-holder',
  proof: {
    type: 'Ed25519Signature2020',
    created: '2024-01-01T00:00:00Z',
    verificationMethod: 'did:example:eudi-holder#key-1',
    proofPurpose: 'authentication',
    proofValue: 'valid-eudi-presentation-signature'
  }
};

async function run() {
  const result = await verifier.verify(eudiCredential, {
    id: 'eudi-request',
    policies: ['eudi', 'age_verification'],
    request_credentials: [{ type: 'EuropeanDigitalIdentityCredential', required: true }],
    challenge: 'eudi-challenge'
  });
  console.log('EUDI + Age Verification Result:', result);
}

run().catch(console.error); 