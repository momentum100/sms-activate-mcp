# SMS-Activate MCP Сервер

[English version](README.md)

MCP (Model Context Protocol) сервер для интеграции с сервисом [SMS-Activate](https://sms-activate.io/) - платформой для получения SMS кодов верификации и временных email адресов.

## Возможности

- 📱 **Операции с номерами**: Запрос виртуальных номеров, проверка SMS кодов, управление активациями
- 📧 **Email активации**: Покупка временных email адресов, проверка входящих, управление сессиями
- 💰 **Управление аккаунтом**: Проверка баланса, просмотр истории активаций
- 🌍 **Информация о сервисах**: Получение доступных стран, операторов, сервисов и цен
- 🔄 **Статус в реальном времени**: Отслеживание статуса активации и получение кодов верификации

## Требования

- Node.js 18 или выше
- npm или yarn
- API ключ SMS-Activate (получите на [sms-activate.io](https://sms-activate.io/))

## Установка

### 1. Клонирование репозитория

```bash
git clone https://github.com/momentum100/sms-activate-mcp.git
cd sms-activate-mcp
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Настройка окружения

Создайте файл `.env` в корне проекта:

```env
SMS_ACTIVATE_API_KEY=ваш_api_ключ
SMS_ACTIVATE_BASE_URL=https://api.sms-activate.ae
```

### 4. Сборка проекта

```bash
npm run build
```

### 5. Тестирование сервера

```bash
npm start
```

## Конфигурация для Claude Desktop

Добавьте эту конфигурацию в настройки Claude Desktop:

### Windows
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

### macOS
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

### Linux
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

## Доступные инструменты

### Операции с телефонными номерами

#### `request_number`
Запрос виртуального номера телефона для SMS верификации.

**Параметры:**
- `service` (обязательный): Код или название сервиса (например, "tg" или "Telegram")
- `country` (опциональный): ID страны (0=Россия, 1=Украина и т.д.)
- `operator` (опциональный): Мобильный оператор
- `forward` (опциональный): Включить переадресацию (0 или 1)
- `ref` (опциональный): Реферальный код

**Пример:**
```
Запросить номер для Telegram из России
```

#### `get_status`
Проверка статуса активации и получение SMS кода.

**Параметры:**
- `activationId` (обязательный): ID активации из request_number

#### `set_status`
Изменение статуса активации.

**Параметры:**
- `activationId` (обязательный): ID активации
- `status` (обязательный): Код статуса
  - 1 = Сообщить, что SMS отправлен (переотправить)
  - 3 = Запросить другой код
  - 6 = Завершить активацию
  - 8 = Отменить активацию

#### `get_active_activations`
Получить список всех активных активаций.

#### `get_activation_history`
Просмотр истории активаций.

### Операции с Email

#### `purchase_email`
Покупка временного email адреса.

**Параметры:**
- `site` (обязательный): Целевой сайт (например, "telegram.com")
- `mailDomain` (обязательный): Email домен (например, "gmail.com")

#### `get_email_status`
Проверка статуса email активации и входящих сообщений.

**Параметры:**
- `emailId` (обязательный): ID email активации

#### `cancel_email`
Отмена email активации.

**Параметры:**
- `emailId` (обязательный): ID email активации

#### `reorder_email`
Повторный заказ той же email активации.

**Параметры:**
- `emailId` (обязательный): ID email активации

#### `get_email_domains`
Получить доступные email домены для сайта.

**Параметры:**
- `site` (опциональный): Целевой сайт

### Информационные инструменты

#### `get_balance`
Проверка баланса аккаунта.

#### `get_numbers_status`
Получить количество доступных номеров по сервису и стране.

**Параметры:**
- `country` (опциональный): ID страны
- `operator` (опциональный): Название оператора

#### `get_countries`
Получить список всех доступных стран.

#### `get_services`
Получить список всех доступных сервисов.

#### `get_operators`
Получить операторов для конкретной страны.

**Параметры:**
- `country` (обязательный): ID страны

#### `get_prices`
Получить цены на сервисы.

**Параметры:**
- `country` (опциональный): ID страны
- `service` (опциональный): Код сервиса

#### `get_top_countries`
Получить топ стран для конкретного сервиса.

**Параметры:**
- `service` (обязательный): Код сервиса

## Основные коды сервисов

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

## Основные ID стран

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

## Примеры использования

### Базовый процесс работы

1. **Проверка баланса**: "Какой у меня баланс на SMS-Activate?"
2. **Запрос номера**: "Получи мне номер для Telegram из России"
3. **Проверка статуса**: "Проверь статус активации 123456789"
4. **Завершение активации**: "Отметь активацию 123456789 как завершенную"

### Процесс работы с Email

1. **Получение доменов**: "Какие email домены доступны для telegram.com?"
2. **Покупка email**: "Купи gmail.com email для telegram.com"
3. **Проверка входящих**: "Проверь email 123456 на новые сообщения"

## Разработка

### Запуск в режиме разработки

```bash
npm run dev
```

### Сборка проекта

```bash
npm run build
```

### Структура проекта

```
sms-activate-mcp/
├── src/
│   ├── index.ts              # Основной MCP сервер
│   └── sms-activate-client.ts # Клиент API SMS-Activate
├── dist/                     # Скомпилированный JavaScript (генерируется)
├── docs/                     # Документация API
│   ├── SMS-ACTIVATE.postman_collection.json
│   ├── api-protocol-for-working-with-sms-activate.json
│   └── services.json
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## Решение проблем

### "SMS_ACTIVATE_API_KEY environment variable is required"

Убедитесь, что вы создали файл `.env` с вашим API ключом или установили его в конфигурации Claude Desktop.

### Ответы "BAD_KEY" или "ERROR_SQL"

- Проверьте правильность API ключа
- Проверьте баланс аккаунта
- Убедитесь, что API ключ имеет необходимые разрешения

### Ошибки подключения

- Проверьте интернет-соединение
- Убедитесь, что API SMS-Activate доступен
- Попробуйте изменить `SMS_ACTIVATE_BASE_URL` в файле `.env`

## Безопасность

- Никогда не коммитьте файл `.env` и не раскрывайте API ключ
- Используйте переменные окружения для конфиденциальных данных
- Регулярно меняйте API ключи
- Отслеживайте аккаунт на предмет необычной активности

## Поддержка

- **Проблемы**: [GitHub Issues](https://github.com/momentum100/sms-activate-mcp/issues)
- **Поддержка SMS-Activate**: [sms-activate.io/ru/support](https://sms-activate.io/ru/support)
- **Документация API**: [sms-activate.io/ru/api2](https://sms-activate.io/ru/api2)

## Лицензия

MIT License - см. файл [LICENSE](LICENSE) для подробностей.

## Вклад в проект

Вклад приветствуется! Пожалуйста, не стесняйтесь отправлять Pull Request.

1. Форкните репозиторий
2. Создайте ветку для функции (`git checkout -b feature/AmazingFeature`)
3. Закоммитьте изменения (`git commit -m 'Add some AmazingFeature'`)
4. Отправьте в ветку (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request

## Автор

Создано [momentum100](https://github.com/momentum100)

## Благодарности

- [SMS-Activate](https://sms-activate.io/) за предоставление сервиса SMS верификации
- [Anthropic](https://anthropic.com/) за спецификацию протокола MCP