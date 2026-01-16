# Card Management API

Sistema backend de gestión de tarjetas de crédito y pagos, desarrollado con .NET 8 siguiendo Arquitectura Hexagonal y DDD.

![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet) ![C#](https://img.shields.io/badge/C%23-12.0-239120?logo=csharp) ![EF Core](https://img.shields.io/badge/EF%20Core-8.0-512BD4) ![SQLite](https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite) ![JWT](https://img.shields.io/badge/JWT-Auth-000000?logo=jsonwebtokens) ![Swagger](https://img.shields.io/badge/Swagger-OpenAPI-85EA2D?logo=swagger)

## Descripción

API RESTful para gestión completa de tarjetas de crédito que incluye:

- **Gestión de Usuarios**: Registro, autenticación JWT, perfiles y validación Email
- **Administración de Tarjetas**: CRUD, activación/bloqueo, balance y límite de crédito
- **Sistema de Pagos**: Procesamiento de transacciones, historial y validaciones
- **Value Objects DDD**: CardNumber con Luhn, Money con operaciones seguras, Email validado



## Características Destacadas

### Seguridad

### Arquitectura Hexagonal (Ports & Adapters)

Se implementó una separación clara entre la lógica de negocio (Dominio) y los detalles técnicos (Infraestructura). Esta decisión permite:

- **Independencia de frameworks**: El dominio no depende de Entity Framework, ASP.NET Core o ninguna librería externa.
- **Testabilidad**: Las capas de dominio y aplicación pueden testearse sin necesidad de infraestructura.
- **Flexibilidad**: Es posible cambiar la base de datos, el sistema de autenticación o cualquier detalle técnico sin afectar las reglas de negocio.

### Monolito Modular con Bounded Contexts

El sistema está organizado en módulos independientes (User, Card, Payment) inspirados en los Bounded Contexts de DDD, que pueden evolucionar hacia microservicios si el proyecto lo requiere:

- **Cohesión por contexto**: Cada módulo contiene su propio dominio, aplicación e infraestructura.
- **Bajo acoplamiento**: Los módulos se comunican a través de Facades e interfaces bien definidas.
- **Preparado para escalar**: La estructura permite extraer módulos a servicios independientes sin reescribir código.
- **Lenguaje ubicuo por módulo**: Cada contexto utiliza su propio vocabulario de negocio.

### Patrón CQRS (Simplificado)

Se utilizan Commands para operaciones de escritura y consultas directas para lectura:

- **Commands**: Representan intenciones del usuario (RegisterCommand, ProcessPaymentCommand).
- **Validación centralizada**: FluentValidation se aplica en la capa de aplicación.
- **DTOs específicos**: Separación clara entre modelos de entrada y salida.

### Seguridad

- **AES-256 Encryption**: Cifrado de números de tarjeta (PCI-DSS ready)
- **JWT Authentication**: Tokens stateless con expiración de 8 horas
- **BCrypt Hashing**: Passwords con salt automático (cost 14)
- **FluentValidation**: Validación robusta de inputs en Commands
- **Claims-based Authorization**: Verificación de permisos por usuario
- **Value Objects**: Validación de dominio (Luhn algorithm para tarjetas)

### Domain-Driven Design

- **Value Objects Tácticos**:
  - `CardNumber`: Validación Luhn, formato 16 dígitos, enmascaramiento (`****-****-****-1234`)
  - `Money`: Operaciones monetarias seguras, prevención de negativos, comparaciones currency-safe
  - `Email`: Validación regex, normalización automática, extracción de dominio
- **Bounded Contexts**: Separación clara (User, Card, Payment)
- **Anti-Corruption Layer**: Facades para comunicación inter-módulos
- **Domain Exceptions**: Manejo de errores de negocio con tipos específicos
- **Backing Fields Pattern**: Encapsulación de VOs en entidades con EF Core

### Arquitectura

- **Hexagonal Architecture**: Separación absoluta dominio/infraestructura
- **Clean Architecture**: Handlers → Services → Repositories
- *Tecnologías

- **Backend**: .NET 8 / C# 12
- **Framework**: ASP.NET Core Web API
- **ORM**: Entity Framework Core 8.0
- **Base de Datos**: SQLite 3 (portable, fácil cambio a SQL Server/PostgreSQL)
- **Autenticación**: JWT con Microsoft.IdentityModel.Tokens
- **Validación**: FluentValidation 12.1
- **Mapping**: AutoMapper 12.0
- **Passwords**: BCrypt.Net-Next 4.0
- **Documentación**: Swagger/OpenAPI con Swashbuckle
- **Testing**: (Próximamente)
- **Arquitectura**: Hexagonal + DDD por bounded contexts



## Inicio Rápido

### Prerrequisitos

- .NET SDK 8.0 o superior
- SQLite (incluido en .NET)
- Visual Studio 2022 / VS Code / Rider (opcional

## Guía de Inicio Rápido

### Requisitos

- .NET SDK 8.0 o superior
- Editor de código (Visual Studio, VS Code, Rider)

### Pasos de instalación
Instalación

**1. Clonar repositorio**

```bash
git clone <repository-url>
cd interview-fullstack-dev-tuya/src/backend
```

**2. Configurar appsettings (opcional)**

Editar `CardManagement.Api/appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=cardmanagement.db"
  },
  "Jwt": {
    "Key": "your-super-secret-key-min-32-chars",
    "Issuer": "CardManagementAPI",
    "Audience": "CardManagementClients",
    "ExpirationHours": 8
  },
  "Security": {
    "EncryptionKey": "another-secret-key-for-aes-encryption"
  },
  "AllowedOrigins": ["http://localhost:3000", "http://localhost:5173"]
}
```

**3. Restaurar dependencias**

```bash
dotnet restore
```

**4. Aplicar migraciones** (crear base de datos)

```bash
dotnet ef database update --project Infrastructure --startup-project CardManagement.Api
```

**5. Ejecutar aplicación**

```bash
cd CardManagement.Api
dotnet run
```

La API estará disponible en **http://localhost:5269**

### Documentación

- **Swagger UI**: http://localhost:5269/swagger
- **OpenAPI JSON**: http://localhost:5269/swagger/v1/swagger.json




## Estructura del Proyecto

```
src/backend/
├── CardManagement.Api/        # Capa de Presentación
│   ├── Controllers/           # Endpoints HTTP
│   ├── Middleware/            # Manejo global de excepciones
│   └── Program.cs             # Configuración de servicios y middleware
│
├── Infrastructure/            # Capa de Infraestructura
│   ├── Data/                  # DbContext y configuraciones EF Core
│   │   ├── AppDbContext.cs    # Configuración de entidades y VOs
│   │   └── Converters/        # EF Core value converters
│   ├── Repositories/          # Implementaciones de repositorios
│   │   └── *Repository.cs     # Queries sobre backing fields de VOs
│   ├── Security/              # Servicios de cifrado AES
│   └── Migrations/            # Migraciones de base de datos
│
├── Modules/                   # Módulos de dominio independientes
│   ├── User/
│   │   ├── Domain/            # Entidades, Value Objects (Email), Interfaces
│   │   │   ├── Entities/      # User entity
│   │   │   ├── Repositories/  # IUserRepository
│   │   │   └── ValueObjects/  # Email VO
│   │   ├── Application/       # Commands, DTOs, Services, Validators
│   │   └── Infrastructure/    # (Vacío - centralizado en Infrastructure/)
│   ├── Card/
│   │   ├── Domain/            # Entidad Card, CardStatus, Value Objects
│   │   │   ├── Entities/      # Card entity
│   │   │   ├── Enums/         # CardStatus
│   │   │   ├── Repositories/  # ICardRepository
│   │   │   └── ValueObjects/  # CardNumber VO
│   │   ├── Application/       # Facades, Mappings, Validators
│   │   └── Infrastructure/
│   └── Payment/
│       ├── Domain/            # Entidad Payment, PaymentStatus
│       ├── Application/       # Services, Commands, DTOs
│       └── Infrastructure/
│
└── Shared/                    # Contratos compartidos entre módulos
    ├── Domain/                # Elementos de dominio compartidos
    │   ├── ValueObject.cs     # Clase base abstracta para Value Objects
    │   └── ValueObjects/      # Value Objects reutilizables (Money)
    ├── Facades/               # Interfaces y DTOs para comunicación inter-módulos
   API Endpoints

### Autenticación

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Registro de nuevos usuarios | No |
| POST | `/api/auth/login` | Iniciar sesión (retorna JWT) | No |

**Request Body - Register**:
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "fullName": "John Doe"
}
```

**Response - Login**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

### Tarjetas

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/cards/{id}` | Obtener detalles de tarjeta | JWT |

**Response**:
```json
{
  "id": "uuid",
  "cardNumber": "****-****-****-1234",
  "balance": 5000.00,
  "status": "Active"
}
```

### Pagos

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/payments` | Procesar pago con tarjeta | JWT |
| GET | `/api/payments/{id}` | Obtener detalles de pago | JWT |
| GET | `/api/payments` | Listar pagos del usuario | JWT |

### Usuarios

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/users/{id}` | Obtener información de usuario | JWT |

### Autenticación en Swagger

1. Ejecutar `POST /api/auth/login` con credenciales válidas
2. Copiar el token del response
3. Clic en **"Authorize"** (botón candado)
4. Ingresar: `Bearer {tu-token}`
5. Los endpoints protegidos funcionarán automáticamente
- Listado de pagos del usuario autenticado
- Header: `Authorization: Bearer <token>`

#### Usuarios (Requiere autenticación JWT)

**GET** `/api/users/{id}`
- Consulta de información de usuario
- Header: `Authorization: Bearer <token>`

### Autenticación en Swagger

1. Value Objects (DDD Táctico)

### CardNumber

```csharp
var cardNumber = CardNumber.Create("4532015112830366");
Console.WriteLine(cardNumber.Masked());     
Console.WriteLine(cardNumber.Formatted());  
```

**Características**:
- Validación de 16 dígitos numéricos
- Algoritmo Luhn para integridad
- Enmascaramiento automático para seguridad
- Formato legible con espacios
- Inmutable (thread-safe)

### Money

```csharp
var price = Money.Create(1000.50m, "COP");
var discount = Money.Create(100m, "COP");
var final = price.Subtract(discount);  

price.Add(Money.Create(50m, "USD"));  
Money.Create(-10m, "COP");             
```

**Características**:
- Operaciones currency-safe (previene mezclar monedas)
- Previene cantidades negativas
- Métodos de comparación (`IsGreaterThan`, `IsLessThan`)
- Formato automático (`1,234.56 COP`)

### Email

```csharp
var email = Email.Create("JOHN@EXAMPLE.COM");
Console.WriteLine(email.Value);        
Console.WriteLine(email.GetDomain());  
Console.WriteLine(email.Masked());    
```

**Características**:
- Validación con regex completo
- Normalización automática (lowercase)
- Helpers para dominio y parte local
- Enmascaramiento para logs/UI

**Beneficios de VOs**:
- Validación en dominio (fail-fast)
- Código autodocumentado (`CardNumber` vs `string`)
- Reutilización de lógica de validación
- Prevención de estados inválidos
- Mejor testabilption, NotFoundException)
- **Backing fields pattern** para encapsular Value Objects en entidades

**Pendientes para DDD completo:**
- Aggregates con raíces de agregado y límites transaccionales explícitos
- Domain Events para comunicación entre contextos (pub/sub)
- Specifications para reglas de negocio complejas reutilizables
- Domain Services para lógica que no pertenece a una sola entidad

---

## Próximos Pasos Sugeridos

### Mejoras de seguridad

- Activar cifrado de tarjetas mediante migración
- Implementar rate limiting en endpoints de autenticación
- Agregar validación de complejidad de contraseñas
- Implementar refresh tokens para JWT

### Funcionalidades adicionales

- Historial completo de transacciones
- Reportes de gastos
- Límites de gasto configurables
- Notificaciones de transacciones
- Bloqueo temporal de tarjetas

### Infraestructura

- Health checks para monitoreo
- Logging estructurado (Serilog)
- Métricas y telemetría
- Caché distribuido para consultas frecuentes
- Tests unitarios e integración


## Comandos Útiles
Security Features

### Autenticación y Autorización

- **JWT Tokens**: Access tokens con 8 horas de expiración
- **Stateless Auth**: Sin sesiones en servidor (escalable)
- **Claims-based**: Autorización por permisos de usuario
- **BCrypt**: Password hashing con cost 14 y salt automático

### Validación de Inputs

- **FluentValidation**: Validación declarativa en Commands
- **Value Objects**: Validación de dominio (Luhn, Email regex)
- **SQL Injection**: Protección completa con Entity Framework ORM
- **XSS Protection**: Sanitización automática de inputs

### Protección de Datos

- **AES-256 Encryption**: Implementado para números de tarjeta (PCI-DSS ready)
- **Environment Variables**: Secrets fuera del código (appsettings.Production.json)
- **CORS Configurado**: Orígenes específicos por ambiente
- **Global Exception Handler**: Middleware de manejo centralizado

### Best Practices

- ✅ Passwords nunca en logs
- ✅ Connection strings en variables de entorno
- ✅ JWT secrets rotables sin rebuild
- ✅ Validación en múltiples capas (DTO → Command → Domain)
dotnDesarrollo

```bash
# Ejecutar aplicación
dotnet run --project CardManagement.Api

# Watch mode (hot reload)
dotnet watch run --project CardManagement.Api

# CDeployment

### Variables de Entorno (Producción)

Configurar en el hosting las siguientes variables:

```bash
# Database
ConnectionStrings__DefaultConnection="Server=...;Database=...;User=...;Password=..."

# JWT
Jwt__Key="your-super-secret-jwt-key-minimum-32-characters"
Jwt__Issuer="CardManagementAPI"
Jwt__Audience="CardManagementClients"
Jwt__ExpirationHours="8"

# Security
Security__EncryptionKey="another-secret-key-for-aes-256-encryption"

# CORS
AllowedOrigins__0="https://tudominio.com"
AllowedOrigins__1="https://www.tudominio.com"
```

### Cambiar Base de Datos

Para migrar de SQLite a SQL Server/PostgreSQL:

**1. Actualizar paquete NuGet** (`Infrastructure.csproj`):

```xml
<!-- Remover SQLite -->
<!-- <PackageReference Include="Microsoft.EntityFrameworkCore.Sqlite" Version="8.0.0" /> -->

<!-- Agregar SQL Server -->
<PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="8.0.0" />
```

**2. Actualizar `Program.cs`**:

```csharp
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));  
```

**3. Crear nueva migración**:

```bash
dotnet ef migrations add MigrateToSqlServer --project Infrastructure --startup-project CardManagement.Api
dotnet ef database update --project Infrastructure --startup-project CardManagement.Api
```



### Build y Deploy

```bash
# Build para producción
dotnet build -c Release

# Publicar aplicación
dotnet publish -c Release -o ./publish

# Ejecutar publicación
./publish/CardManagement.Api.exe  # Windows
./publish/CardManagement.Api      # Linux/Mac
### CORS en producción

Actualizar `appsettings.Production.json` con los dominios permitidos:

```json
"AllowedOrigins": [
  "https://tudominio.com",
  "https://www.tudominio.com"
]
```



## Contribución

Este proyecto fue desarrollado como parte de una evaluación técnica.



## Licencia

Proyecto propietario - Todos los derechos reservados.
