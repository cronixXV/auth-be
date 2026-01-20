# 🔐 Auth Backend (Node.js + TypeScript + JWT)

Небольшой, но production‑ориентированный backend‑проект с полноценной системой аутентификации и авторизации.

Проект реализует:

- регистрацию и логин пользователей
- refresh / access токены
- logout с отзывом refresh токена
- middleware авторизации
- role guard (доступ по ролям)
- защиту от повторного использования refresh токена

---

## 🚀 Стек

- **Node.js 20**
- **TypeScript**
- **Express**
- **PostgreSQL**
- **Sequelize ORM**
- **JWT (access + refresh)**
- **Docker / Docker Compose**

---

## 📦 Установка и запуск

### 1️⃣ Клонирование

```bash
git clone <repo-url>
cd auth-be
```

---

### 2️⃣ Переменные окружения

Создай файл `.env` в корне проекта:

```env
PORT=3000

DB_HOST=postgres
DB_PORT=5432
DB_NAME=auth
DB_USER=postgres
DB_PASSWORD=postgres

JWT_ACCESS_SECRET=super_access_secret
JWT_REFRESH_SECRET=super_refresh_secret

NODE_ENV=development
```

---

### 3️⃣ Запуск через Docker

```bash
docker compose up --build
```

После запуска:

- API: [http://localhost:3000](http://localhost:3000)
- Healthcheck: [http://localhost:3000/health](http://localhost:3000/health)

---

### 4️⃣ Миграции

Если нужно применить миграции вручную:

```bash
docker compose exec api npx sequelize-cli db:migrate \
  --config src/config/config.js \
  --migrations-path src/migrations \
  --models-path src/models
```

---

## 🔐 Auth Flow

### ✅ Регистрация

`POST /auth/register`

- Создаёт пользователя
- Возвращает `accessToken`
- Устанавливает `refreshToken` в HttpOnly cookie

---

### ✅ Логин

`POST /auth/login`

- Проверяет email + пароль
- Возвращает новый `accessToken`
- Устанавливает новый `refreshToken` в cookie

---

### ✅ Обновление токена

`POST /auth/refresh`

- Берёт refreshToken из cookie
- Проверяет tokenVersion
- Генерирует новую пару токенов
- Обновляет cookie

---

### ✅ Logout

`POST /auth/logout`

- Увеличивает `tokenVersion`
- Делает все старые refresh токены невалидными
- Очищает cookie

---

## 🧱 Middleware

### 🔑 Auth Middleware

- Читает заголовок:

```
Authorization: Bearer <accessToken>
```

- Валидирует accessToken
- Кладёт payload в `req.user`

---

### 🛡️ Role Guard

```ts
roleGuard(["ADMIN"]);
```

- Проверяет роль пользователя
- Блокирует доступ, если роль не подходит

---

## 👤 Защищённые эндпоинты

### Получить профиль пользователя

`GET /profile`

- Требует валидный accessToken
- Использует `req.user.userId`

---

### Пример admin‑эндпоинта

`GET /admin/ping`

- Требует роль `ADMIN`

---

## 🧪 Примеры curl

### Регистрация

```bash
curl -i -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "example@example.com",
    "password": "Example12345",
    "name": "Bob"
  }'
```

---

### Логин

```bash
curl -i -c cookies.txt -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "example@example.com",
    "password": "Example12345"
  }'
```

---

### Refresh

```bash
curl -i -b cookies.txt -X POST http://localhost:3000/auth/refresh
```

---

### Logout

```bash
curl -i -b cookies.txt -X POST http://localhost:3000/auth/logout
```

---

### Защищённый запрос

```bash
curl -i http://localhost:3000/user/profile \
  -H "Authorization: Bearer ACCESS_TOKEN"
```

---

## 🛡️ Безопасность

- ✅ HttpOnly cookies
- ✅ SameSite=strict
- ✅ Access token живёт недолго
- ✅ Refresh token с версионированием
- ✅ Отзыв refresh токена при logout
- ✅ Защита от повторного использования refresh токена

---

## 🗂️ Структура проекта

```
src/
 ├─ modules/
 │   ├─ auth/
 │   ├─ user/
 │   └─ admin/
 ├─ middleware/
 ├─ config/
 ├─ models/
 ├─ migrations/
 └─ types/
```

Автор: Egor Gruzdev
