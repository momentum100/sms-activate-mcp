# SMS-Activate MCP Server

[English](#english) | [Русский](#russian)

---

<a name="english"></a>
## English

MCP (Model Context Protocol) server for integrating with [SMS-Activate](https://sms-activate.io/) service - a platform for receiving SMS verification codes and temporary email addresses.

### Features

- 📱 **Phone Number Operations**: Request virtual numbers, check SMS codes, manage activations
- 📧 **Email Activations**: Purchase temporary emails, check inbox, manage email sessions
- 💰 **Account Management**: Check balance, view activation history
- 🌍 **Service Information**: Get available countries, operators, services, and prices
- 🔄 **Real-time Status**: Track activation status and retrieve verification codes

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- SMS-Activate API key (get it from [sms-activate.io](https://sms-activate.io/))

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/momentum100/sms-activate-mcp.git
cd sms-activate-mcp
```

#### 2. Install dependencies

```bash
npm install
```

#### 3. Configure environment

Create a `.env` file in the project root:

```env
SMS_ACTIVATE_API_KEY=your_api_key_here
SMS_ACTIVATE_BASE_URL=https://api.sms-activate.ae
```

#### 4. Build the project

```bash
npm run build
```

#### 5. Test the server

```bash
npm start
```

### Configuration for Claude Desktop

Add this configuration to your Claude Desktop settings:

#### Windows
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

#### macOS
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

#### Linux
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

### Available Tools

#### Phone Number Operations

- **`request_number`** - Request a virtual phone number for SMS verification
  - `service` (required): Service code or name (e.g., "tg" or "Telegram")
  - `country` (optional): Country ID (0=Russia, 1=Ukraine, etc.)
  - `operator` (optional): Mobile operator
  - `forward` (optional): Enable forwarding (0 or 1)
  - `ref` (optional): Referral code

- **`get_status`** - Check activation status and retrieve SMS code
  - `activationId` (required): The activation ID from request_number

- **`set_status`** - Change activation status
  - `activationId` (required): The activation ID
  - `status` (required): Status code (1=resend, 3=new code, 6=complete, 8=cancel)

- **`get_active_activations`** - Get list of all active activations

- **`get_activation_history`** - View activation history

#### Email Operations

- **`purchase_email`** - Purchase a temporary email address
  - `site` (required): Target website (e.g., "telegram.com")
  - `mailDomain` (required): Email domain (e.g., "gmail.com")

- **`get_email_status`** - Check email activation status and inbox
  - `emailId` (required): Email activation ID

- **`cancel_email`** - Cancel email activation
  - `emailId` (required): Email activation ID

- **`reorder_email`** - Reorder the same email activation
  - `emailId` (required): Email activation ID

- **`get_email_domains`** - Get available email domains for a website
  - `site` (optional): Target website

#### Information Tools

- **`get_balance`** - Check account balance
- **`get_numbers_status`** - Get available phone numbers count
- **`get_countries`** - Get list of all available countries
- **`get_services`** - Get list of all available services
- **`get_operators`** - Get operators for a specific country
- **`get_prices`** - Get service prices
- **`get_top_countries`** - Get top countries for a specific service

### Common Service Codes

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

### Common Country IDs

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

### Development

```bash
# Run in development mode
npm run dev

# Build the project
npm run build

# Start the server
npm start
```

### Troubleshooting

- **"SMS_ACTIVATE_API_KEY environment variable is required"** - Create `.env` file with your API key
- **"BAD_KEY" or "ERROR_SQL"** - Verify API key and account balance
- **Connection errors** - Check internet connection and API availability

---

<a name="russian"></a>
## Русский

MCP (Model Context Protocol) сервер для интеграции с сервисом [SMS-Activate](https://sms-activate.io/) - платформой для получения SMS кодов верификации и временных email адресов.

### Возможности

- 📱 **Операции с номерами**: Запрос виртуальных номеров, проверка SMS кодов, управление активациями
- 📧 **Email активации**: Покупка временных email адресов, проверка входящих, управление сессиями
- 💰 **Управление аккаунтом**: Проверка баланса, просмотр истории активаций
- 🌍 **Информация о сервисах**: Получение доступных стран, операторов, сервисов и цен
- 🔄 **Статус в реальном времени**: Отслеживание статуса активации и получение кодов верификации

### Требования

- Node.js 18 или выше
- npm или yarn
- API ключ SMS-Activate (получите на [sms-activate.io](https://sms-activate.io/))

### Установка

#### 1. Клонирование репозитория

```bash
git clone https://github.com/momentum100/sms-activate-mcp.git
cd sms-activate-mcp
```

#### 2. Установка зависимостей

```bash
npm install
```

#### 3. Настройка окружения

Создайте файл `.env` в корне проекта:

```env
SMS_ACTIVATE_API_KEY=ваш_api_ключ
SMS_ACTIVATE_BASE_URL=https://api.sms-activate.ae
```

#### 4. Сборка проекта

```bash
npm run build
```

#### 5. Тестирование сервера

```bash
npm start
```

### Конфигурация для Claude Desktop

Добавьте эту конфигурацию в настройки Claude Desktop:

#### Windows
Расположение: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "sms-activate": {
      "command": "node",
      "args": ["C:/путь/к/sms-activate-mcp/dist/index.js"],
      "env": {
        "SMS_ACTIVATE_API_KEY": "ваш_api_ключ"
      }
    }
  }
}
```

#### macOS
Расположение: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "sms-activate": {
      "command": "node",
      "args": ["/Users/username/путь/к/sms-activate-mcp/dist/index.js"],
      "env": {
        "SMS_ACTIVATE_API_KEY": "ваш_api_ключ"
      }
    }
  }
}
```

#### Linux
Расположение: `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "sms-activate": {
      "command": "node",
      "args": ["/home/username/путь/к/sms-activate-mcp/dist/index.js"],
      "env": {
        "SMS_ACTIVATE_API_KEY": "ваш_api_ключ"
      }
    }
  }
}
```

### Доступные инструменты

#### Операции с телефонными номерами

- **`request_number`** - Запрос виртуального номера телефона для SMS верификации
  - `service` (обязательный): Код или название сервиса (например, "tg" или "Telegram")
  - `country` (опциональный): ID страны (0=Россия, 1=Украина и т.д.)
  - `operator` (опциональный): Мобильный оператор
  - `forward` (опциональный): Включить переадресацию (0 или 1)
  - `ref` (опциональный): Реферальный код

- **`get_status`** - Проверка статуса активации и получение SMS кода
  - `activationId` (обязательный): ID активации из request_number

- **`set_status`** - Изменение статуса активации
  - `activationId` (обязательный): ID активации
  - `status` (обязательный): Код статуса (1=переотправить, 3=новый код, 6=завершить, 8=отменить)

- **`get_active_activations`** - Получить список всех активных активаций

- **`get_activation_history`** - Просмотр истории активаций

#### Операции с Email

- **`purchase_email`** - Покупка временного email адреса
  - `site` (обязательный): Целевой сайт (например, "telegram.com")
  - `mailDomain` (обязательный): Email домен (например, "gmail.com")

- **`get_email_status`** - Проверка статуса email активации и входящих сообщений
  - `emailId` (обязательный): ID email активации

- **`cancel_email`** - Отмена email активации
  - `emailId` (обязательный): ID email активации

- **`reorder_email`** - Повторный заказ той же email активации
  - `emailId` (обязательный): ID email активации

- **`get_email_domains`** - Получить доступные email домены для сайта
  - `site` (опциональный): Целевой сайт

#### Информационные инструменты

- **`get_balance`** - Проверка баланса аккаунта
- **`get_numbers_status`** - Получить количество доступных номеров
- **`get_countries`** - Получить список всех доступных стран
- **`get_services`** - Получить список всех доступных сервисов
- **`get_operators`** - Получить операторов для конкретной страны
- **`get_prices`** - Получить цены на сервисы
- **`get_top_countries`** - Получить топ стран для конкретного сервиса

### Основные коды сервисов

| Код | Сервис |
|------|---------|
| `tg` | Telegram |
| `wa` | WhatsApp |
| `ig` | Instagram |
| `fb` | Facebook |
| `go` | Google |
| `tw` | Twitter |
| `vi` | Viber |
| `ub` | Uber |
| `ot` | Любой другой |

### Основные ID стран

| ID | Страна |
|----|---------|
| 0 | Россия |
| 1 | Украина |
| 2 | Казахстан |
| 3 | Китай |
| 4 | Филиппины |
| 5 | Мьянма |
| 6 | Индонезия |
| 10 | Вьетнам |
| 12 | США (Виртуальный) |
| 16 | Англия |
| 22 | Индия |

### Разработка

```bash
# Запуск в режиме разработки
npm run dev

# Сборка проекта
npm run build

# Запуск сервера
npm start
```

### Решение проблем

- **"SMS_ACTIVATE_API_KEY environment variable is required"** - Создайте файл `.env` с вашим API ключом
- **"BAD_KEY" или "ERROR_SQL"** - Проверьте API ключ и баланс аккаунта
- **Ошибки подключения** - Проверьте интернет-соединение и доступность API

---

## Project Structure

```
sms-activate-mcp/
├── src/
│   ├── index.ts              # Main MCP server / Основной MCP сервер
│   └── sms-activate-client.ts # SMS-Activate API client / Клиент API
├── dist/                     # Compiled JavaScript / Скомпилированный код
├── docs/                     # API documentation / Документация API
│   ├── SMS-ACTIVATE.postman_collection.json
│   ├── api-protocol-for-working-with-sms-activate.json
│   └── services.json
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## Support / Поддержка

- **Issues**: [GitHub Issues](https://github.com/momentum100/sms-activate-mcp/issues)
- **SMS-Activate Support**: [sms-activate.io/support](https://sms-activate.io/support)
- **API Documentation**: [sms-activate.io/api2](https://sms-activate.io/api2)

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Author

Created by [momentum100](https://github.com/momentum100)

## Acknowledgments

- [SMS-Activate](https://sms-activate.io/) for providing the SMS verification service
- [Anthropic](https://anthropic.com/) for the MCP protocol specification