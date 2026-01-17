# Sistema de Gestión de Tarjetas de Crédito

Aplicación fullstack para la gestión de tarjetas de crédito y procesamiento de pagos.

![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet) ![C#](https://img.shields.io/badge/C%23-12.0-239120?logo=csharp) ![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript) ![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite)

## Inicio Rápido

### Requisitos
- .NET SDK 8.0 o superior
- Node.js v18 o superior

### Ejecución

**Backend** (en una terminal):
```bash
cd src/backend
dotnet run --project CardManagement.Api
```
 API disponible en `http://localhost:5269`  
 Documentación Swagger en `http://localhost:5269/swagger`

**Frontend** (en otra terminal):
```bash
cd src/frontend
npm install
npm run dev
```
Aplicación disponible en `http://localhost:5173`

---

##  Estructura

- `src/backend`: API REST con Arquitectura Hexagonal y DDD
- `src/frontend`: SPA con React, TypeScript y Tailwind CSS

##  Características

- **Autenticación JWT**: Registro y login seguros
- **Gestión de Tarjetas**: CRUD completo con validaciones (máx. 3 por usuario, Luhn, BIN 4532)
- **Procesamiento de Pagos**: Verificación de cupo disponible en tiempo real
- **Seguridad**: Encriptación AES-256 para datos sensibles
- **Interfaz Moderna**: Diseño responsive con animaciones y glassmorphism

## Tecnologías

**Backend**: .NET 8, Entity Framework Core, SQLite, JWT, BCrypt, FluentValidation  
**Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Zustand, React Hook Form, Zod

##  Documentación Detallada

- [Backend README](src/backend/README.md) - Arquitectura y patrones de diseño
- [Frontend README](src/frontend/README.md) - Estructura de features y componentes

---

**Nota**: La base de datos SQLite se crea automáticamente en el primer arranque con todas las migraciones aplicadas.
