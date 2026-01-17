# Card Management API

Sistema backend de gestión de tarjetas de crédito y pagos, desarrollado con .NET 8 siguiendo Arquitectura Hexagonal y DDD.

![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet) ![C#](https://img.shields.io/badge/C%23-12.0-239120?logo=csharp) ![EF Core](https://img.shields.io/badge/EF%20Core-8.0-512BD4) ![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite) ![JWT](https://img.shields.io/badge/JWT-Auth-000000?logo=jsonwebtokens) ![Swagger](https://img.shields.io/badge/Swagger-OpenAPI-85EA2D?logo=swagger)

## Inicio Rápido

### Requisitos
- .NET 8 SDK

### Ejecución Local

1. Navegar al proyecto API:
```bash
cd src/backend/CardManagement.Api
```

2. Ejecutar la aplicación:
```bash
dotnet run
```

La aplicación inicializará automáticamente la base de datos SQLite, aplicará las migraciones y estará disponible en `http://localhost:5269`. Puedes acceder a la documentación interactiva en `http://localhost:5269/swagger`.

## Descripción

API RESTful para gestión completa de tarjetas de crédito que incluye:

- **Gestión de Usuarios**: Registro, autenticación JWT, perfiles y validación de correo.
- **Administración de Tarjetas**: CRUD, activación/bloqueo, balance y límites de crédito.
- **Sistema de Pagos**: Procesamiento de transacciones, historial y validaciones de negocio.
- **Value Objects DDD**: Implementación de objetos de valor como CardNumber (Luhn), Money y Email.

## Características Técnicas

### Arquitectura Hexagonal (Ports & Adapters)
Separación clara entre la lógica de negocio (Dominio) y los detalles técnicos (Infraestructura), permitiendo:
- Independencia de frameworks.
- Testabilidad sin necesidad de infraestructura.
- Flexibilidad para cambiar componentes técnicos sin afectar reglas de negocio.

### Monolito Modular
Organizado en módulos independientes (User, Card, Payment) inspirados en Bounded Contexts de DDD:
- Cohesión por contexto.
- Bajo acoplamiento mediante Facades e interfaces.
- Preparado para escalabilidad a microservicios.

### Seguridad y Protección de Datos
- **AES-256 Encryption**: Cifrado de números de tarjeta para cumplimiento normativo.
- **JWT Authentication**: Tokens sin estado con expiración controlada.
- **BCrypt Hashing**: Almacenamiento seguro de contraseñas con sal automática.
- **Validation**: Validación robusta en múltiples capas (FluentValidation + Value Objects).

### Domain-Driven Design (DDD)
- **Value Objects**: Validaciones en el constructor para garantizar estados válidos (fail-fast).
- **Domain Exceptions**: Manejo de errores de negocio con excepciones específicas.
- **Backing Fields**: Encapsulación de estados internos de objetos de valor para persistencia con EF Core.

## Estructura del Proyecto

```
src/backend/
├── CardManagement.Api/        # Capa de Presentación (Controladores y Middleware)
├── Infrastructure/            # Capa de Infraestructura (Persistencia, Seguridad, Datos)
├── Modules/                   # Módulos de dominio independientes
│   ├── User/                  # Contexto de Usuarios y Autenticación
│   ├── Card/                  # Contexto de Tarjetas de Crédito
│   └── Payment/               # Contexto de Pagos y Transacciones
└── Shared/                    # Componentes de dominio compartidos entre módulos
```

## Tecnologías Utilizadas

- **Runtime**: .NET 8 / C# 12
- **ORM**: Entity Framework Core 8.0
- **Base de Datos**: SQLite 3
- **Documentación**: Swagger / OpenAPI
- **Validación**: FluentValidation
- **Mapeo**: AutoMapper

---
Proyecto desarrollado como parte de una evaluación técnica. Todos los derechos reservados.
