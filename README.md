# Prueba Técnica - Fullstack Developer

Este repositorio contiene la solución para la prueba técnica de gestión de tarjetas de crédito y pagos. El proyecto está dividido en un backend desarrollado en .NET 8 y un frontend desarrollado en React + Vite.

![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet) ![C#](https://img.shields.io/badge/C%23-12.0-239120?logo=csharp) ![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript) ![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite)

## Requisitos Previos

- .NET SDK 8.0 o superior
- Node.js (v18 o superior)
- npm o yarn

## Estructura del Proyecto

- `src/backend`: API REST desarrollada con Arquitectura Hexagonal y Domain-Driven Design (DDD).
- `src/frontend`: Aplicación SPA desarrollada con React, TypeScript y Tailwind CSS.

## Instrucciones de Configuración Local

### 1. Configuración del Backend

Desde la carpeta raíz del proyecto:

```bash
cd src/backend
```

**Base de Datos (SQLite):**
La aplicación está configurada para inicializar la base de datos y crear todas las tablas necesarias automáticamente en el primer arranque. No es necesario ejecutar migraciones manuales.

**Ejecución:**

```bash
dotnet run --project CardManagement.Api
```

La API estará disponible por defecto en `http://localhost:5269`. Puedes acceder a la documentación Swagger en `http://localhost:5269/swagger`.

### 2. Configuración del Frontend

Desde la carpeta raíz del proyecto:

```bash
cd src/frontend
```

**Instalación de dependencias:**

```bash
npm install
```

**Variables de Entorno:**
Asegúrate de tener un archivo `.env` en `src/frontend/` (puedes copiar el `.env.example` si existe o crearlo):

```env
VITE_API_URL=http://localhost:5269/api
```

**Ejecución:**

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

## Funcionalidades Implementadas

- Registro e inicio de sesión seguro con JWT.
- Gestión de tarjetas de crédito (crear, editar, eliminar).
- Validación de negocio: máximo 3 tarjetas por usuario.
- Procesamiento de pagos con verificación de cupo disponible.
- Prevención de ajuste de cupo inferior a la deuda actual.
- Interfaz moderna con animaciones y componentes personalizados.
- Encriptación AES-256 para datos sensibles.
