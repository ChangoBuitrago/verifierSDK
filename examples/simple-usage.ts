/**
 * Simple Usage Example
 * Demonstrates basic SDK functionality without protocol integration
 */

import { createVerifier } from '../src/core/index';
import { W3cHandler } from '../src/handlers/w3c-credential';
import { MdlHandler, MdlPresentation } from '../src/handlers/mobile-license';
import { VerifiablePresentation } from '../src/types';
import { AgeVerificationPolicy, ValidityPolicy } from '../src/policies';

console.log("🚀 Simple Usage Example\n");

// 1. Create handlers
const w3cHandler = new W3cHandler();
const mdlHandler = new MdlHandler();

// 2. Create policies
const agePolicy = new AgeVerificationPolicy();
const validityPolicy = new ValidityPolicy();

// 3. Create verifier with handlers and policies
const verifier = createVerifier({
  handlers: [w3cHandler, mdlHandler],
  policies: {
    'age_verification': agePolicy,
    'validity': validityPolicy
  }
});

// 3. Example W3C credential
const w3cCredential: VerifiablePresentation = {
  '@context': ['https://www.w3.org/2018/credentials/v1'],
  type: ['VerifiablePresentation'],
  verifiableCredential: [
    {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      id: 'credential:example:123',
      type: ['VerifiableCredential'],
      issuer: 'did:example:issuer',
      issuanceDate: '2023-01-01T00:00:00Z',
      credentialSubject: {
        id: 'did:example:123',
        givenName: 'Alice',
        familyName: 'Smith',
        email: 'alice@example.com'
      },
      proof: {
        type: 'Ed25519Signature2020',
        created: '2023-01-01T00:00:00Z',
        verificationMethod: 'did:example:123#key-1',
        proofPurpose: 'assertionMethod',
        proofValue: 'valid-signature-data'
      }
    }
  ],
  holder: 'did:example:holder',
  proof: {
    type: 'Ed25519Signature2020',
    created: '2023-01-01T00:00:00Z',
    verificationMethod: 'did:example:holder#key-1',
    proofPurpose: 'authentication',
    proofValue: 'valid-presentation-signature'
  }
};

// 4. Example mDL credential
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
          'license_number': 'DL123456789'
        }
      }
    }
  }
};

// 5. Verify credentials
async function verifyCredentials(): Promise<void> {
  console.log("Verifying W3C credential...");
  try {
    const w3cResult = await verifier.verify(w3cCredential, {
      id: 'w3c-request',
      policies: ['age_verification', 'validity'],
      request_credentials: [{ type: 'VerifiableCredential', required: true }],
      challenge: 'w3c-challenge'
    });
    console.log(`✅ W3C Result: ${w3cResult.status}`);
    if (w3cResult.status === 'verified') {
      console.log(`   Subject: ${w3cCredential.verifiableCredential[0].credentialSubject.givenName} ${w3cCredential.verifiableCredential[0].credentialSubject.familyName}`);
      if (w3cResult.policyResults) {
        console.log(`   Policy Results: ${Object.keys(w3cResult.policyResults).join(', ')}`);
      }
    } else {
      console.log(`   Error: ${w3cResult.error}`);
      if (w3cResult.policyResults) {
        console.log(`   Policy Results:`, w3cResult.policyResults);
      }
    }
  } catch (error) {
    console.log(`❌ W3C Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  console.log("\nVerifying mDL credential...");
  try {
    const mdlResult = await verifier.verify(mdlCredential as unknown as VerifiablePresentation, {
      id: 'mdl-request',
      policies: ['age_verification'],
      request_credentials: [{ type: 'mDL', required: true }],
      challenge: 'mdl-challenge'
    });
    console.log(`✅ mDL Result: ${mdlResult.status}`);
    if (mdlResult.status === 'verified' && mdlCredential.deviceResponse?.mdoc.dataElements) {
      const data = mdlCredential.deviceResponse.mdoc.dataElements['org.iso.18013.5.1'];
      console.log(`   Subject: ${data.given_name} ${data.family_name}`);
      console.log(`   License: ${data.license_number}`);
      if (mdlResult.policyResults) {
        console.log(`   Policy Results: ${Object.keys(mdlResult.policyResults).join(', ')}`);
      }
    } else {
      console.log(`   Error: ${mdlResult.error}`);
      if (mdlResult.policyResults) {
        console.log(`   Policy Results:`, mdlResult.policyResults);
      }
    }
  } catch (error) {
    console.log(`❌ mDL Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// 6. Run the example
verifyCredentials().catch(console.error); 