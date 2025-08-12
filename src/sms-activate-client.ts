import axios, { AxiosInstance } from 'axios';

export interface ActivationRequest {
  service: string;
  country?: number;
  operator?: string;
  forward?: number;
  ref?: string;
}

export interface Activation {
  id: string;
  phone: string;
  activationId: string;
  service: string;
  status: string;
  code?: string;
  createdAt: string;
}

export interface Balance {
  balance: number;
  currency: string;
}

export interface ServicePrice {
  service: string;
  country: number;
  price: number;
  count: number;
}

export class SMSActivateClient {
  private client: AxiosInstance;
  private apiKey: string;

  constructor(apiKey: string, baseURL: string = 'https://api.sms-activate.ae') {
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL,
      timeout: 30000,
    });
  }

  private async makeRequest(params: Record<string, any>): Promise<any> {
    try {
      const response = await this.client.get('/stubs/handler_api.php', {
        params: {
          api_key: this.apiKey,
          ...params,
        },
      });
      
      const data = response.data;
      
      if (typeof data === 'string') {
        // Special case for ACCESS_BALANCE - return as-is for getBalance to handle
        if (data.startsWith('ACCESS_BALANCE')) {
          return data;
        }
        
        if (data.startsWith('ACCESS_')) {
          const parts = data.split(':');
          return {
            activationId: parts[0].replace('ACCESS_', ''),
            phone: parts[1],
          };
        }
        
        if (data.startsWith('STATUS_')) {
          return { status: data };
        }
        
        if (data.startsWith('BAD_') || data.startsWith('NO_') || data.startsWith('ERROR_')) {
          throw new Error(data);
        }
      }
      
      return data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(`API Error: ${error.response.data}`);
      }
      throw error;
    }
  }

  async getBalance(): Promise<Balance> {
    const response = await this.makeRequest({ action: 'getBalance' });
    
    if (typeof response === 'string') {
      const parts = response.split(':');
      if (parts[0] === 'ACCESS_BALANCE') {
        return {
          balance: parseFloat(parts[1]),
          currency: 'RUB',
        };
      }
    }
    
    throw new Error('Invalid balance response');
  }

  async getNumbersStatus(country?: number, operator?: string): Promise<Record<string, any>> {
    const params: any = { action: 'getNumbersStatus' };
    if (country) params.country = country;
    if (operator) params.operator = operator;
    
    return await this.makeRequest(params);
  }

  async getTopCountriesByService(service: string): Promise<any> {
    return await this.makeRequest({
      action: 'getTopCountriesByService',
      service,
    });
  }

  async getOperators(country: number): Promise<any> {
    return await this.makeRequest({
      action: 'getOperators',
      country,
    });
  }

  async getNumber(request: ActivationRequest): Promise<{ activationId: string; phone: string }> {
    const params: any = {
      action: 'getNumber',
      service: request.service,
    };
    
    if (request.country) params.country = request.country;
    if (request.operator) params.operator = request.operator;
    if (request.forward !== undefined) params.forward = request.forward;
    if (request.ref) params.ref = request.ref;
    
    return await this.makeRequest(params);
  }

  async setStatus(activationId: string, status: number): Promise<{ status: string }> {
    return await this.makeRequest({
      action: 'setStatus',
      id: activationId,
      status,
    });
  }

  async getStatus(activationId: string): Promise<{ status: string; code?: string }> {
    const response = await this.makeRequest({
      action: 'getStatus',
      id: activationId,
    });
    
    if (typeof response === 'string') {
      if (response.startsWith('STATUS_WAIT_CODE')) {
        return { status: 'WAIT_CODE' };
      }
      
      if (response.startsWith('STATUS_WAIT_RETRY')) {
        const parts = response.split(':');
        return { status: 'WAIT_RETRY', code: parts[1] };
      }
      
      if (response.startsWith('STATUS_OK')) {
        const parts = response.split(':');
        return { status: 'OK', code: parts[1] };
      }
      
      if (response.startsWith('STATUS_CANCEL')) {
        return { status: 'CANCEL' };
      }
    }
    
    return response;
  }

  async getActiveActivations(): Promise<any> {
    return await this.makeRequest({ action: 'getActiveActivations' });
  }

  async getActivationHistory(): Promise<any> {
    return await this.makeRequest({ action: 'getActivationHistory' });
  }

  async getPrices(country?: number, service?: string): Promise<any> {
    const params: any = { action: 'getPrices' };
    if (country) params.country = country;
    if (service) params.service = service;
    
    return await this.makeRequest(params);
  }

  async getCountries(): Promise<any> {
    return await this.makeRequest({ action: 'getCountries' });
  }

  async getServices(): Promise<any> {
    return await this.makeRequest({ action: 'getServices' });
  }

  async getEmailDomains(site?: string): Promise<any> {
    try {
      const params: any = {};
      if (site) params.site = site;
      
      const response = await this.client.get('/api/v2/emails/domains', {
        headers: {
          'X-API-Key': this.apiKey,
        },
        params,
      });
      
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(`API Error: ${JSON.stringify(error.response.data)}`);
      }
      throw error;
    }
  }

  async purchaseEmail(site: string, mailDomain: string): Promise<any> {
    try {
      const response = await this.client.post(
        '/api/v2/emails',
        {
          site,
          mailDomain,
        },
        {
          headers: {
            'X-API-Key': this.apiKey,
            'Content-Type': 'application/json',
          },
        }
      );
      
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(`API Error: ${JSON.stringify(error.response.data)}`);
      }
      throw error;
    }
  }

  async getEmailStatus(emailId: number): Promise<any> {
    try {
      const response = await this.client.get(`/api/v2/emails/${emailId}`, {
        headers: {
          'X-API-Key': this.apiKey,
        },
      });
      
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(`API Error: ${JSON.stringify(error.response.data)}`);
      }
      throw error;
    }
  }

  async cancelEmail(emailId: number): Promise<void> {
    try {
      await this.client.delete(`/api/v2/emails/${emailId}`, {
        headers: {
          'X-API-Key': this.apiKey,
        },
      });
    } catch (error: any) {
      if (error.response) {
        throw new Error(`API Error: ${JSON.stringify(error.response.data)}`);
      }
      throw error;
    }
  }

  async reorderEmail(emailId: number): Promise<any> {
    try {
      const response = await this.client.post(
        `/api/v2/emails/${emailId}/reorder`,
        {},
        {
          headers: {
            'X-API-Key': this.apiKey,
          },
        }
      );
      
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(`API Error: ${JSON.stringify(error.response.data)}`);
      }
      throw error;
    }
  }
}