# SMS-Activate MCP Server

[Русская версия](README.ru.md)

MCP (Model Context Protocol) server for integrating with [SMS-Activate](https://sms-activate.io/) service - a platform for receiving SMS verification codes and temporary email addresses.

## Features

- 📱 **Phone Number Operations**: Request virtual numbers, check SMS codes, manage activations
- 📧 **Email Activations**: Purchase temporary emails, check inbox, manage email sessions
- 💰 **Account Management**: Check balance, view activation history
- 🌍 **Service Information**: Get available countries, operators, services, and prices
- 🔄 **Real-time Status**: Track activation status and retrieve verification codes

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- SMS-Activate API key (get it from [sms-activate.io](https://sms-activate.io/))

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/momentum100/sms-activate-mcp.git
cd sms-activate-mcp
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Create a `.env` file in the project root:

```env
SMS_ACTIVATE_API_KEY=your_api_key_here
SMS_ACTIVATE_BASE_URL=https://api.sms-activate.ae
```

### 4. Build the project

```bash
npm run build
```

### 5. Test the server

```bash
npm start
```

## Configuration for Claude Desktop

Add this configuration to your Claude Desktop settings:

### Windows
Location: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "sms-activate": {
      "command": "node",
      "args": ["C:/path/to/sms-activate-mcp/dist/index.js"],
      "env": {
        "SMS_ACTIVATE_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

### macOS
Location: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "sms-activate": {
      "command": "node",
      "args": ["/Users/username/path/to/sms-activate-mcp/dist/index.js"],
      "env": {
        "SMS_ACTIVATE_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

### Linux
Location: `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "sms-activate": {
      "command": "node",
      "args": ["/home/username/path/to/sms-activate-mcp/dist/index.js"],
      "env": {
        "SMS_ACTIVATE_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

## Available Tools

### Phone Number Operations

#### `request_number`
Request a virtual phone number for SMS verification.

**Parameters:**
- `service` (required): Service code or name (e.g., "tg" or "Telegram")
- `country` (optional): Country ID (0=Russia, 1=Ukraine, etc.)
- `operator` (optional): Mobile operator
- `forward` (optional): Enable forwarding (0 or 1)
- `ref` (optional): Referral code

**Example:**
```
Request a Telegram number from Russia
```

#### `get_status`
Check activation status and retrieve SMS code.

**Parameters:**
- `activationId` (required): The activation ID from request_number

#### `set_status`
Change activation status.

**Parameters:**
- `activationId` (required): The activation ID
- `status` (required): Status code
  - 1 = Report SMS sent (resend)
  - 3 = Request another code
  - 6 = Complete activation
  - 8 = Cancel activation

#### `get_active_activations`
Get list of all active activations.

#### `get_activation_history`
View activation history.

### Email Operations

#### `purchase_email`
Purchase a temporary email address.

**Parameters:**
- `site` (required): Target website (e.g., "telegram.com")
- `mailDomain` (required): Email domain (e.g., "gmail.com")

#### `get_email_status`
Check email activation status and inbox.

**Parameters:**
- `emailId` (required): Email activation ID

#### `cancel_email`
Cancel email activation.

**Parameters:**
- `emailId` (required): Email activation ID

#### `reorder_email`
Reorder the same email activation.

**Parameters:**
- `emailId` (required): Email activation ID

#### `get_email_domains`
Get available email domains for a website.

**Parameters:**
- `site` (optional): Target website

### Information Tools

#### `get_balance`
Check account balance.

#### `get_numbers_status`
Get available phone numbers count by service and country.

**Parameters:**
- `country` (optional): Country ID
- `operator` (optional): Operator name

#### `get_countries`
Get list of all available countries.

#### `get_services`
Get list of all available services.

#### `get_operators`
Get operators for a specific country.

**Parameters:**
- `country` (required): Country ID

#### `get_prices`
Get service prices.

**Parameters:**
- `country` (optional): Country ID
- `service` (optional): Service code

#### `get_top_countries`
Get top countries for a specific service.

**Parameters:**
- `service` (required): Service code

## Common Service Codes

| Code | Service |
|------|---------|
| `tg` | Telegram |
| `wa` | WhatsApp |
| `ig` | Instagram |
| `fb` | Facebook |
| `go` | Google |
| `tw` | Twitter |
| `vi` | Viber |
| `ub` | Uber |
| `ot` | Any other |

## Common Country IDs

| ID | Country |
|----|---------|
| 0 | Russia |
| 1 | Ukraine |
| 2 | Kazakhstan |
| 3 | China |
| 4 | Philippines |
| 5 | Myanmar |
| 6 | Indonesia |
| 10 | Vietnam |
| 12 | USA (Virtual) |
| 16 | England |
| 22 | India |

## Usage Examples

### Basic Workflow

1. **Check balance**: "What's my SMS-Activate balance?"
2. **Request number**: "Get me a Telegram number from Russia"
3. **Check status**: "Check the status of activation 123456789"
4. **Complete activation**: "Mark activation 123456789 as complete"

### Email Workflow

1. **Get domains**: "What email domains are available for telegram.com?"
2. **Purchase email**: "Buy a gmail.com email for telegram.com"
3. **Check inbox**: "Check email 123456 for new messages"

## Development

### Run in development mode

```bash
npm run dev
```

### Build the project

```bash
npm run build
```

### Project Structure

```
sms-activate-mcp/
├── src/
│   ├── index.ts              # Main MCP server
│   └── sms-activate-client.ts # SMS-Activate API client
├── dist/                     # Compiled JavaScript (generated)
├── docs/                     # API documentation
│   ├── SMS-ACTIVATE.postman_collection.json
│   ├── api-protocol-for-working-with-sms-activate.json
│   └── services.json
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## Troubleshooting

### "SMS_ACTIVATE_API_KEY environment variable is required"

Make sure you've created a `.env` file with your API key or set it in the Claude Desktop configuration.

### "BAD_KEY" or "ERROR_SQL" responses

- Verify your API key is correct
- Check your account balance
- Ensure the API key has proper permissions

### Connection errors

- Check your internet connection
- Verify the SMS-Activate API is accessible
- Try changing `SMS_ACTIVATE_BASE_URL` in your `.env` file

## Security

- Never commit your `.env` file or expose your API key
- Use environment variables for sensitive data
- Regularly rotate your API keys
- Monitor your account for unusual activity

## Support

- **Issues**: [GitHub Issues](https://github.com/momentum100/sms-activate-mcp/issues)
- **SMS-Activate Support**: [sms-activate.io/en/support](https://sms-activate.io/en/support)
- **API Documentation**: [sms-activate.io/en/api2](https://sms-activate.io/en/api2)

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Author

Created by [momentum100](https://github.com/momentum100)

## Acknowledgments

- [SMS-Activate](https://sms-activate.io/) for providing the SMS verification service
- [Anthropic](https://anthropic.com/) for the MCP protocol specification