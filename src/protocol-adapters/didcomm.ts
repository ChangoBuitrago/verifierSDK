/**
 * DIDComm v2 Protocol Adapter
 * Handles decentralized messaging protocol for peer-to-peer credential exchange
 */

import { VerifiablePresentation, PresentationRequest, VerificationResult } from '../types';

/**
 * DIDComm v2 message structure
 */
export interface DIDCommMessage {
  id: string;
  type: string;
  from?: string;
  to?: string[];
  created_time?: number;
  expires_time?: number;
  body: any;
  attachments?: any[];
}

/**
 * DIDComm v2 presentation request
 */
export interface DIDCommPresentationRequest {
  message: DIDCommMessage;
  presentation: VerifiablePresentation;
  originalRequest: PresentationRequest;
}

/**
 * DIDComm v2 response
 */
export interface DIDCommResponse {
  message: DIDCommMessage;
  verificationResult: VerificationResult;
}

/**
 * DIDComm v2 Protocol Adapter
 * Handles DIDComm v2 messages for credential exchange
 */
export class DIDCommAdapter {
  /**
   * Receives a DIDComm v2 presentation message
   * @param message - The DIDComm v2 message containing the presentation
   * @returns Promise with presentation and original request
   */
  static async receivePresentation(message: DIDCommMessage): Promise<{
    presentation: VerifiablePresentation;
    originalRequest: PresentationRequest;
  }> {
    console.log("--- DIDComm v2 Message Received ---");
    console.log(`Message ID: ${message.id}`);
    console.log(`Message Type: ${message.type}`);
    
    // Extract presentation from DIDComm message body
    const presentation = message.body.presentation as VerifiablePresentation;
    const originalRequest = message.body.request as PresentationRequest;
    
    if (!presentation) {
      throw new Error('No presentation found in DIDComm message body');
    }
    
    return { presentation, originalRequest };
  }
  
  /**
   * Creates a DIDComm v2 response message
   * @param result - The verification result
   * @param options - Additional options for response formatting
   * @returns DIDComm v2 response message
   */
  static createResponse(result: VerificationResult, options?: {
    threadId?: string;
    from?: string;
    to?: string[];
  }): DIDCommResponse {
    console.log("--- Creating DIDComm v2 Response ---");
    
    const responseMessage: DIDCommMessage = {
      id: `response-${Date.now()}`,
      type: 'https://didcomm.org/verifiable-presentation/2.0/verification-response',
      created_time: Math.floor(Date.now() / 1000),
      body: {
        verificationResult: result,
        status: result.status,
        ...(result.policyResults && { policyResults: result.policyResults }),
        ...(result.error && { error: result.error })
      }
    };
    
    // Add threading if threadId is provided
    if (options?.threadId) {
      responseMessage.body.threadId = options.threadId;
    }
    
    // Add routing information
    if (options?.from) {
      responseMessage.from = options.from;
    }
    if (options?.to) {
      responseMessage.to = options.to;
    }
    
    return {
      message: responseMessage,
      verificationResult: result
    };
  }
  
  /**
   * Validates a DIDComm v2 message structure
   * @param message - The message to validate
   * @returns Validation result
   */
  static validateMessage(message: DIDCommMessage): { isValid: boolean; errors?: string[] } {
    const errors: string[] = [];
    
    if (!message.id) {
      errors.push('Message ID is required');
    }
    
    if (!message.type) {
      errors.push('Message type is required');
    }
    
    if (!message.body) {
      errors.push('Message body is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined
    };
  }
} 