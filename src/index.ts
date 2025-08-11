import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import dotenv from 'dotenv';
import { SMSActivateClient } from './sms-activate-client.js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

const API_KEY = process.env.SMS_ACTIVATE_API_KEY;
const BASE_URL = process.env.SMS_ACTIVATE_BASE_URL || 'https://api.sms-activate.ae';

if (!API_KEY) {
  console.error('SMS_ACTIVATE_API_KEY environment variable is required');
  process.exit(1);
}

const client = new SMSActivateClient(API_KEY, BASE_URL);

const servicesData = JSON.parse(
  readFileSync(join(__dirname, '../docs/services.json'), 'utf-8')
);

const serviceMap = new Map<string, string>(servicesData.map((s: any) => [s.name.toLowerCase(), s.code]));

const server = new Server(
  {
    name: 'mcp-sms-activate',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const GetBalanceSchema = z.object({});

const GetNumbersStatusSchema = z.object({
  country: z.number().optional().describe('Country ID (e.g., 0 for Russia, 1 for Ukraine)'),
  operator: z.string().optional().describe('Operator name (e.g., "mts", "beeline")'),
});

const GetTopCountriesSchema = z.object({
  service: z.string().describe('Service code (e.g., "tg" for Telegram, "wa" for WhatsApp)'),
});

const GetOperatorsSchema = z.object({
  country: z.number().describe('Country ID'),
});

const RequestNumberSchema = z.object({
  service: z.string().describe('Service code or name (e.g., "tg", "Telegram", "wa", "WhatsApp")'),
  country: z.number().optional().describe('Country ID (e.g., 0 for Russia)'),
  operator: z.string().optional().describe('Operator name'),
  forward: z.number().optional().describe('Forward option (0 or 1)'),
  ref: z.string().optional().describe('Referral code'),
});

const SetStatusSchema = z.object({
  activationId: z.string().describe('Activation ID'),
  status: z.number().describe('Status code: 1=report SMS sent, 3=request another code, 6=complete activation, 8=cancel activation'),
});

const GetStatusSchema = z.object({
  activationId: z.string().describe('Activation ID'),
});

const GetActiveActivationsSchema = z.object({});

const GetActivationHistorySchema = z.object({});

const GetPricesSchema = z.object({
  country: z.number().optional().describe('Country ID'),
  service: z.string().optional().describe('Service code'),
});

const GetCountriesSchema = z.object({});

const GetServicesSchema = z.object({});

const GetEmailDomainsSchema = z.object({
  site: z.string().optional().describe('Website for which to get email domains (e.g., "telegram.com")'),
});

const PurchaseEmailSchema = z.object({
  site: z.string().describe('Website for activation (e.g., "telegram.com")'),
  mailDomain: z.string().describe('Email domain (e.g., "gmail.com")'),
});

const GetEmailStatusSchema = z.object({
  emailId: z.number().describe('Email activation ID'),
});

const CancelEmailSchema = z.object({
  emailId: z.number().describe('Email activation ID'),
});

const ReorderEmailSchema = z.object({
  emailId: z.number().describe('Email activation ID'),
});

const tools: Tool[] = [
  {
    name: 'get_balance',
    description: 'Get account balance',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_numbers_status',
    description: 'Get available phone numbers quantity by country and service',
    inputSchema: {
      type: 'object',
      properties: {
        country: { type: 'number', description: 'Country ID (e.g., 0 for Russia, 1 for Ukraine)' },
        operator: { type: 'string', description: 'Operator name (e.g., "mts", "beeline")' },
      },
    },
  },
  {
    name: 'get_top_countries',
    description: 'Get top countries for a specific service',
    inputSchema: {
      type: 'object',
      properties: {
        service: { type: 'string', description: 'Service code (e.g., "tg" for Telegram, "wa" for WhatsApp)' },
      },
      required: ['service'],
    },
  },
  {
    name: 'get_operators',
    description: 'Get available operators for a country',
    inputSchema: {
      type: 'object',
      properties: {
        country: { type: 'number', description: 'Country ID' },
      },
      required: ['country'],
    },
  },
  {
    name: 'request_number',
    description: 'Request a phone number for SMS verification',
    inputSchema: {
      type: 'object',
      properties: {
        service: { type: 'string', description: 'Service code or name (e.g., "tg", "Telegram", "wa", "WhatsApp")' },
        country: { type: 'number', description: 'Country ID (e.g., 0 for Russia)' },
        operator: { type: 'string', description: 'Operator name' },
        forward: { type: 'number', description: 'Forward option (0 or 1)' },
        ref: { type: 'string', description: 'Referral code' },
      },
      required: ['service'],
    },
  },
  {
    name: 'set_status',
    description: 'Change activation status',
    inputSchema: {
      type: 'object',
      properties: {
        activationId: { type: 'string', description: 'Activation ID' },
        status: { type: 'number', description: 'Status code: 1=report SMS sent, 3=request another code, 6=complete activation, 8=cancel activation' },
      },
      required: ['activationId', 'status'],
    },
  },
  {
    name: 'get_status',
    description: 'Get activation status and SMS code',
    inputSchema: {
      type: 'object',
      properties: {
        activationId: { type: 'string', description: 'Activation ID' },
      },
      required: ['activationId'],
    },
  },
  {
    name: 'get_active_activations',
    description: 'Get list of active activations',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_activation_history',
    description: 'Get activation history',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_prices',
    description: 'Get prices for services by country',
    inputSchema: {
      type: 'object',
      properties: {
        country: { type: 'number', description: 'Country ID' },
        service: { type: 'string', description: 'Service code' },
      },
    },
  },
  {
    name: 'get_countries',
    description: 'Get list of available countries',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_services',
    description: 'Get list of available services',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_email_domains',
    description: 'Get available email domains for a site',
    inputSchema: {
      type: 'object',
      properties: {
        site: { type: 'string', description: 'Website for which to get email domains (e.g., "telegram.com")' },
      },
    },
  },
  {
    name: 'purchase_email',
    description: 'Purchase an email activation',
    inputSchema: {
      type: 'object',
      properties: {
        site: { type: 'string', description: 'Website for activation (e.g., "telegram.com")' },
        mailDomain: { type: 'string', description: 'Email domain (e.g., "gmail.com")' },
      },
      required: ['site', 'mailDomain'],
    },
  },
  {
    name: 'get_email_status',
    description: 'Get email activation status',
    inputSchema: {
      type: 'object',
      properties: {
        emailId: { type: 'number', description: 'Email activation ID' },
      },
      required: ['emailId'],
    },
  },
  {
    name: 'cancel_email',
    description: 'Cancel email activation',
    inputSchema: {
      type: 'object',
      properties: {
        emailId: { type: 'number', description: 'Email activation ID' },
      },
      required: ['emailId'],
    },
  },
  {
    name: 'reorder_email',
    description: 'Reorder email activation',
    inputSchema: {
      type: 'object',
      properties: {
        emailId: { type: 'number', description: 'Email activation ID' },
      },
      required: ['emailId'],
    },
  },
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;

  try {
    switch (name) {
      case 'get_balance': {
        const balance = await client.getBalance();
        return {
          content: [
            {
              type: 'text',
              text: `Balance: ${balance.balance} ${balance.currency}`,
            },
          ],
        };
      }

      case 'get_numbers_status': {
        const params = GetNumbersStatusSchema.parse(args);
        const status = await client.getNumbersStatus(params.country, params.operator);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(status, null, 2),
            },
          ],
        };
      }

      case 'get_top_countries': {
        const params = GetTopCountriesSchema.parse(args);
        const countries = await client.getTopCountriesByService(params.service);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(countries, null, 2),
            },
          ],
        };
      }

      case 'get_operators': {
        const params = GetOperatorsSchema.parse(args);
        const operators = await client.getOperators(params.country);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(operators, null, 2),
            },
          ],
        };
      }

      case 'request_number': {
        const params = RequestNumberSchema.parse(args);
        
        let serviceCode = params.service;
        const serviceLower = params.service.toLowerCase();
        if (serviceMap.has(serviceLower)) {
          serviceCode = serviceMap.get(serviceLower)!;
        }
        
        const result = await client.getNumber({
          service: serviceCode,
          country: params.country,
          operator: params.operator,
          forward: params.forward,
          ref: params.ref,
        });
        
        return {
          content: [
            {
              type: 'text',
              text: `Phone number requested successfully!\nActivation ID: ${result.activationId}\nPhone: ${result.phone}`,
            },
          ],
        };
      }

      case 'set_status': {
        const params = SetStatusSchema.parse(args);
        const result = await client.setStatus(params.activationId, params.status);
        return {
          content: [
            {
              type: 'text',
              text: `Status updated: ${result.status}`,
            },
          ],
        };
      }

      case 'get_status': {
        const params = GetStatusSchema.parse(args);
        const result = await client.getStatus(params.activationId);
        
        let message = `Status: ${result.status}`;
        if (result.code) {
          message += `\nCode: ${result.code}`;
        }
        
        return {
          content: [
            {
              type: 'text',
              text: message,
            },
          ],
        };
      }

      case 'get_active_activations': {
        const activations = await client.getActiveActivations();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(activations, null, 2),
            },
          ],
        };
      }

      case 'get_activation_history': {
        const history = await client.getActivationHistory();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(history, null, 2),
            },
          ],
        };
      }

      case 'get_prices': {
        const params = GetPricesSchema.parse(args);
        const prices = await client.getPrices(params.country, params.service);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(prices, null, 2),
            },
          ],
        };
      }

      case 'get_countries': {
        const countries = await client.getCountries();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(countries, null, 2),
            },
          ],
        };
      }

      case 'get_services': {
        const services = await client.getServices();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(services, null, 2),
            },
          ],
        };
      }

      case 'get_email_domains': {
        const params = GetEmailDomainsSchema.parse(args);
        const domains = await client.getEmailDomains(params.site);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(domains, null, 2),
            },
          ],
        };
      }

      case 'purchase_email': {
        const params = PurchaseEmailSchema.parse(args);
        const result = await client.purchaseEmail(params.site, params.mailDomain);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_email_status': {
        const params = GetEmailStatusSchema.parse(args);
        const result = await client.getEmailStatus(params.emailId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'cancel_email': {
        const params = CancelEmailSchema.parse(args);
        await client.cancelEmail(params.emailId);
        return {
          content: [
            {
              type: 'text',
              text: 'Email activation cancelled successfully',
            },
          ],
        };
      }

      case 'reorder_email': {
        const params = ReorderEmailSchema.parse(args);
        const result = await client.reorderEmail(params.emailId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`,
        },
      ],
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('SMS-Activate MCP server running...');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});