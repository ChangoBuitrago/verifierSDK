/**
 * OID4VP Protocol Adapter
 * Handles OpenID Connect for Verifiable Presentations protocol specifics
 */

import { VerifiablePresentation, PresentationRequest, VerificationResult } from '../types';

export interface OID4VPRequest {
  body?: {
    vp_token?: string | VerifiablePresentation;
    client_id?: string;
    redirect_uri?: string;
    response_type?: string;
    scope?: string;
  };
  sessionID?: string;
}

export interface OID4VPResponse {
  status: 'verified' | 'rejected';
  type?: string;
  timestamp: string;
  sessionId?: string;
  verified?: boolean;
  credentialType?: string;
  credential?: any;
  mdoc?: any;
  dataElements?: any;
  reason?: string;
}

export interface SessionData {
  presentationDefinition: PresentationRequest;
  clientId: string;
  state: string;
  nonce: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class OID4VP_Adapter {
  /**
   * Receives and parses an OID4VP presentation request
   * @param httpRequest - The HTTP request object
   * @returns Promise<Object> - Parsed presentation and original request
   */
  static async receivePresentation(httpRequest: OID4VPRequest): Promise<{
    vp: VerifiablePresentation;
    originalRequest?: PresentationRequest;
    sessionId?: string;
    clientId?: string;
  }> {
    console.log("=== OID4VP Adapter: Processing presentation request ===");
    
    try {
      // Extract the VP token from the request body
      const vpToken = httpRequest.body?.vp_token;
      if (!vpToken) {
        throw new Error('No vp_token found in request body');
      }

      console.log("   Extracted vp_token from request body");

      // Parse the VP token (in a real implementation, this might be JWT)
      let vp: VerifiablePresentation;
      try {
        if (typeof vpToken === 'string') {
          vp = JSON.parse(vpToken) as VerifiablePresentation;
        } else {
          vp = vpToken as VerifiablePresentation;
        }
      } catch (parseError) {
        throw new Error(`Failed to parse vp_token: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
      }

      // Extract the original request from session or request parameters
      const sessionData = await this.getSessionData(httpRequest.sessionID);
      const originalRequest = sessionData?.presentationDefinition;
      
      if (!originalRequest) {
        console.log("   Warning: No original request found in session");
      }

      console.log("   Successfully parsed OID4VP request");
      
      return { 
        vp, 
        originalRequest,
        sessionId: httpRequest.sessionID,
        clientId: httpRequest.body?.client_id
      };
    } catch (error) {
      console.log(`   OID4VP parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  /**
   * Creates an OID4VP response
   * @param verificationResult - The verification result from the SDK
   * @param options - Response options
   * @returns OID4VPResponse - Formatted OID4VP response
   */
  static createResponse(verificationResult: VerificationResult, options: { sessionId?: string } = {}): OID4VPResponse {
    console.log("=== OID4VP Adapter: Creating response ===");
    
    const response: OID4VPResponse = {
      status: verificationResult.status,
      timestamp: new Date().toISOString(),
      sessionId: options.sessionId
    };

    // Add verification details based on the result
    if (verificationResult.status === 'verified') {
      response.verified = true;
      
      // Add credential-specific data
      if ((verificationResult as any).credential) {
        response.credential = (verificationResult as any).credential;
      }
      if ((verificationResult as any).mdoc) {
        response.mdoc = (verificationResult as any).mdoc;
      }
      if ((verificationResult as any).dataElements) {
        response.dataElements = (verificationResult as any).dataElements;
      }
    } else {
      response.verified = false;
      response.reason = verificationResult.error;
    }

    console.log(`   Response created: ${response.status}`);
    return response;
  }

  /**
   * Validates OID4VP request parameters
   * @param request - The request to validate
   * @returns ValidationResult - Validation result
   */
  static validateRequest(request: OID4VPRequest): ValidationResult {
    console.log("=== OID4VP Adapter: Validating request ===");
    
    const errors: string[] = [];
    
    // Check required fields
    if (!request.body) {
      errors.push('Request body is required');
    }
    
    if (!request.body?.vp_token) {
      errors.push('vp_token is required');
    }
    
    if (!request.sessionID) {
      errors.push('Session ID is required');
    }

    const isValid = errors.length === 0;
    
    if (isValid) {
      console.log("   Request validation passed");
    } else {
      console.log(`   Request validation failed: ${errors.join(', ')}`);
    }
    
    return { isValid, errors };
  }

  /**
   * Simulates retrieving session data (in a real implementation, this would access a database)
   * @param sessionId - The session ID
   * @returns Promise<SessionData|null> - Session data or null
   */
  static async getSessionData(sessionId?: string): Promise<SessionData | null> {
    // In a real implementation, this would query a database or cache
    console.log(`   Retrieving session data for: ${sessionId}`);
    
    // Simulate session data
    const mockSessionData: SessionData = {
      presentationDefinition: {
        id: "example-presentation-definition",
        request_credentials: [
          {
            type: "VerifiableCredential",
            required: true,
            constraints: {}
          }
        ],
        challenge: "example-challenge"
      },
      clientId: "example-client",
      state: "example-state",
      nonce: "example-nonce"
    };
    
    return mockSessionData;
  }

  /**
   * Extracts client information from the request
   * @param request - The HTTP request
   * @returns Object - Client information
   */
  static extractClientInfo(request: OID4VPRequest): {
    clientId?: string;
    redirectUri?: string;
    responseType?: string;
    scope?: string;
  } {
    return {
      clientId: request.body?.client_id,
      redirectUri: request.body?.redirect_uri,
      responseType: request.body?.response_type,
      scope: request.body?.scope
    };
  }
} 