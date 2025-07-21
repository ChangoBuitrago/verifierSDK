/**
 * WACI (Wallet and Credential Interactions) Protocol Adapter
 * Handles DIF standard for wallet/mobile credential interactions
 */

import { VerifiablePresentation, PresentationRequest, VerificationResult } from '../types';

/**
 * WACI request structure
 */
export interface WACIRequest {
  type: string;
  id: string;
  from: string;
  to: string;
  body: {
    goal_code?: string;
    accept?: string[];
    [key: string]: any;
  };
  created_time?: number;
  expires_time?: number;
}

/**
 * WACI response structure
 */
export interface WACIResponse {
  type: string;
  id: string;
  from: string;
  to: string;
  body: {
    goal_code?: string;
    verificationResult: VerificationResult;
    [key: string]: any;
  };
  created_time: number;
  thid?: string;
}

/**
 * WACI Protocol Adapter
 * Handles WACI protocol for mobile wallet interactions
 */
export class WACIAdapter {
  /**
   * Receives a WACI presentation request
   * @param request - The WACI request from the wallet
   * @returns Promise with presentation and original request
   */
  static async receivePresentation(request: WACIRequest): Promise<{
    presentation: VerifiablePresentation;
    originalRequest: PresentationRequest;
  }> {
    console.log("--- WACI Request Received ---");
    console.log(`Request ID: ${request.id}`);
    console.log(`From: ${request.from}`);
    console.log(`To: ${request.to}`);
    console.log(`Goal Code: ${request.body.goal_code}`);
    
    // Parse WACI request into standard format
    const originalRequest: PresentationRequest = {
      id: request.id,
      comment: `WACI request from ${request.from}`,
      request_credentials: request.body.accept ? 
        request.body.accept.map(type => ({ type, required: true })) :
        [{ type: 'VerifiableCredential', required: true }],
      challenge: `waci-challenge-${request.id}`
    };
    
    // In a real implementation, this would extract the presentation
    // from the WACI request body or attachments
    // For demo purposes, we'll return a mock presentation
    const presentation: VerifiablePresentation = {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiablePresentation'],
      verifiableCredential: [],
      holder: request.from,
      proof: {
        type: 'Ed25519Signature2020',
        created: new Date().toISOString(),
        verificationMethod: `${request.from}#key-1`,
        proofPurpose: 'authentication',
        proofValue: 'mock-waci-signature'
      }
    };
    
    return { presentation, originalRequest };
  }
  
  /**
   * Creates a WACI response
   * @param result - The verification result
   * @param options - Additional options for response formatting
   * @returns WACI response
   */
  static createResponse(result: VerificationResult, options?: {
    from: string;
    to: string;
    threadId?: string;
    goalCode?: string;
  }): WACIResponse {
    console.log("--- Creating WACI Response ---");
    
    if (!options?.from || !options?.to) {
      throw new Error('WACI response requires from and to addresses');
    }
    
    const response: WACIResponse = {
      type: 'https://didcomm.org/waci/2.0/verification-response',
      id: `response-${Date.now()}`,
      from: options.from,
      to: options.to,
      body: {
        goal_code: options.goalCode || 'streamlined-vp',
        verificationResult: result,
        status: result.status,
        ...(result.policyResults && { policyResults: result.policyResults }),
        ...(result.error && { error: result.error })
      },
      created_time: Math.floor(Date.now() / 1000)
    };
    
    // Add threading if threadId is provided
    if (options.threadId) {
      response.thid = options.threadId;
    }
    
    return response;
  }
  
  /**
   * Validates a WACI request
   * @param request - The request to validate
   * @returns Validation result
   */
  static validateRequest(request: WACIRequest): { isValid: boolean; errors?: string[] } {
    const errors: string[] = [];
    
    if (!request.id) {
      errors.push('Request ID is required');
    }
    
    if (!request.from) {
      errors.push('From address is required');
    }
    
    if (!request.to) {
      errors.push('To address is required');
    }
    
    if (!request.body) {
      errors.push('Request body is required');
    }
    
    if (!request.type || !request.type.includes('waci')) {
      errors.push('Invalid WACI message type');
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined
    };
  }
  
  /**
   * Creates a WACI presentation request
   * @param options - Request options
   * @returns WACI request
   */
  static createPresentationRequest(options: {
    from: string;
    to: string;
    goalCode?: string;
    accept?: string[];
    challenge?: string;
  }): WACIRequest {
    return {
      type: 'https://didcomm.org/waci/2.0/presentation-request',
      id: `request-${Date.now()}`,
      from: options.from,
      to: options.to,
      body: {
        goal_code: options.goalCode || 'streamlined-vp',
        ...(options.accept && { accept: options.accept }),
        ...(options.challenge && { challenge: options.challenge })
      },
      created_time: Math.floor(Date.now() / 1000),
      expires_time: Math.floor(Date.now() / 1000) + 3600 // 1 hour expiry
    };
  }
} 