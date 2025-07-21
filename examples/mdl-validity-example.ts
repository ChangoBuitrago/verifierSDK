import { createVerifier } from '../src/core/index.ts';
import { MdlHandler, MdlPresentation } from '../src/handlers/mdl-handler.ts';
import { ValidityPolicy } from '../src/policies/index.ts';
import { VerifiablePresentation } from '../src/types/index.ts';

// Create handler
const mdlHandler = new MdlHandler();

// Create policy
const validityPolicy = new ValidityPolicy();

// Create verifier
const verifier = createVerifier({
  handlers: [mdlHandler],
  policies: {
    'validity': validityPolicy
  }
});

// Example mDL credential
const mdlCredential: MdlPresentation = {
  type: 'mDL',
  deviceResponse: {
    deviceAuth: {
      deviceKey: 'valid-device-key',
      sessionTranscript: 'session-transcript-hash',
      authSignature: 'valid-auth-signature'
    },
    mdoc: {
      dataElements: {
        'org.iso.18013.5.1': {
          'given_name': 'Bob',
          'family_name': 'Johnson',
          'birth_date': '1985-05-15',
          'license_number': 'DL123456789',
          'issuanceDate': '2020-01-01T00:00:00Z',
          'expirationDate': '2030-01-01T00:00:00Z'
        }
      }
    }
  }
};

async function run() {
  const result = await verifier.verify(mdlCredential as unknown as VerifiablePresentation, {
    id: 'mdl-validity-request',
    policies: ['validity'],
    request_credentials: [{ type: 'mDL', required: true }],
    challenge: 'mdl-validity-challenge'
  });
  console.log('mDL + Validity Result:', result);
}

run().catch(console.error); 