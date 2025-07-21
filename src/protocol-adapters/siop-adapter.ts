/**
 * SIOP (Self-Issued OpenID Provider) Protocol Adapter
 * Handles OIDC extension for self-issued credentials
 */

import { VerifiablePresentation, PresentationRequest, VerificationResult } from '../types';

/**
 * SIOP request structure
 */
export interface SIOPRequest {
  response_type: string;
  client_id: string;
  scope: string;
  state?: string;
  nonce?: string;
  response_mode?: string;
  request?: string;
  request_uri?: string;
  [key: string]: any;
}

/**
 * SIOP response structure
 */
export interface SIOPResponse {
  access_token?: string;
  token_type: string;
  expires_in?: number;
  id_token: string;
  state?: string;
  [key: string]: any;
}

/**
 * SIOP ID Token structure
 */
export interface SIOPIDToken {
  iss: string;
  sub: string;
  aud: string;
  exp: number;
  iat: number;
  nonce?: string;
  vp_token?: string;
  presentation_submission?: any;
  [key: string]: any;
}

/**
 * SIOP Protocol Adapter
 * Handles SIOP authentication with self-issued credentials
 */
export class SIOPAdapter {
  /**
   * Receives a SIOP authentication request
   * @param request - The SIOP request from the client
   * @returns Promise with presentation and original request
   */
  static async receivePresentation(request: SIOPRequest): Promise<{
    presentation: VerifiablePresentation;
    originalRequest: PresentationRequest;
  }> {
    console.log("--- SIOP Request Received ---");
    console.log(`Client ID: ${request.client_id}`);
    console.log(`Scope: ${request.scope}`);
    console.log(`Response Type: ${request.response_type}`);
    
    // Parse SIOP request into standard format
    const originalRequest: PresentationRequest = {
      id: `siop-${Date.now()}`,
      comment: `SIOP authentication for ${request.client_id}`,
      request_credentials: [{ type: 'VerifiableCredential', required: true }],
      challenge: request.nonce || `siop-challenge-${Date.now()}`
    };
    
    // In a real implementation, this would extract the presentation
    // from the SIOP request or wait for the user to present credentials
    // For demo purposes, we'll return a mock presentation
    const presentation: VerifiablePresentation = {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiablePresentation'],
      verifiableCredential: [],
      holder: 'did:example:holder',
      proof: {
        type: 'Ed25519Signature2020',
        created: new Date().toISOString(),
        verificationMethod: 'did:example:holder#key-1',
        proofPurpose: 'authentication',
        proofValue: 'mock-siop-signature'
      }
    };
    
    return { presentation, originalRequest };
  }
  
  /**
   * Creates a SIOP response
   * @param result - The verification result
   * @param options - Additional options for response formatting
   * @returns SIOP response
   */
  static createResponse(result: VerificationResult, options?: {
    clientId: string;
    state?: string;
    nonce?: string;
    accessToken?: string;
  }): SIOPResponse {
    console.log("--- Creating SIOP Response ---");
    
    if (!options?.clientId) {
      throw new Error('SIOP response requires client ID');
    }
    
    // Create ID token with verification result
    const idToken: SIOPIDToken = {
      iss: 'did:example:siop-provider',
      sub: 'did:example:holder',
      aud: options.clientId,
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiry
      iat: Math.floor(Date.now() / 1000),
      ...(options.nonce && { nonce: options.nonce }),
      verificationResult: {
        status: result.status,
        ...(result.policyResults && { policyResults: result.policyResults }),
        ...(result.error && { error: result.error })
      }
    };
    
    const response: SIOPResponse = {
      token_type: 'Bearer',
      id_token: JSON.stringify(idToken), // In real implementation, this would be JWT
      ...(options.state && { state: options.state }),
      ...(options.accessToken && { access_token: options.accessToken }),
      expires_in: 3600
    };
    
    return response;
  }
  
  /**
   * Validates a SIOP request
   * @param request - The request to validate
   * @returns Validation result
   */
  static validateRequest(request: SIOPRequest): { isValid: boolean; errors?: string[] } {
    const errors: string[] = [];
    
    if (!request.response_type) {
      errors.push('Response type is required');
    }
    
    if (!request.client_id) {
      errors.push('Client ID is required');
    }
    
    if (!request.scope) {
      errors.push('Scope is required');
    }
    
    if (request.response_type !== 'id_token') {
      errors.push('Only id_token response type is supported');
    }
    
    if (!request.scope.includes('openid')) {
      errors.push('OpenID scope is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined
    };
  }
  
  /**
   * Creates a SIOP authentication request
   * @param options - Request options
   * @returns SIOP request
   */
  static createAuthenticationRequest(options: {
    clientId: string;
    scope?: string;
    state?: string;
    nonce?: string;
    responseMode?: string;
  }): SIOPRequest {
    return {
      response_type: 'id_token',
      client_id: options.clientId,
      scope: options.scope || 'openid',
      ...(options.state && { state: options.state }),
      ...(options.nonce && { nonce: options.nonce }),
      ...(options.responseMode && { response_mode: options.responseMode })
    };
  }
  
  /**
   * Extracts verification result from SIOP ID token
   * @param idToken - The SIOP ID token
   * @returns Verification result
   */
  static extractVerificationResult(idToken: SIOPIDToken): VerificationResult | null {
    return idToken.verificationResult || null;
  }
} 