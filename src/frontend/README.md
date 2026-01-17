# Card Management Frontend

Interfaz de usuario moderna y responsiva para la gestión de tarjetas de crédito y pagos, desarrollada con React, Vite y TypeScript, siguiendo una arquitectura modular por dominios.

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript) ![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite) ![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css) ![Zustand](https://img.shields.io/badge/Zustand-5.0-orange) ![Axios](https://img.shields.io/badge/Axios-1.7-5A29E4?logo=axios)

## Descripción

Esta aplicación permite a los usuarios gestionar sus tarjetas de crédito de forma intuitiva y segura. Ha sido diseñada con un enfoque en la experiencia de usuario (UX) y la calidad del código, utilizando patrones modernos de desarrollo frontend.

### Funcionalidades principales:

- **Autenticación Segura**: Sistema de login y registro integrado con JWT.
- **Dashboard Informativo**: Resumen de cuentas, carrusel de tarjetas y movimientos recientes.
- **Gestión de Tarjetas**: CRUD completo de tarjetas de crédito con validaciones en tiempo real.
- **Procesamiento de Pagos**: Flujo de pagos rápido con selección de tarjeta y validación de cupo.
- **Historial de Transacciones**: Consulta detallada de todos los movimientos realizados.

## Características Técnicas

### Arquitectura Modular (Feature-Based)
El proyecto está organizado por **Features** (características), lo que permite una escalabilidad superior:
- **Encapsulación**: Cada módulo (auth, cards, payments) contiene sus propios servicios, hooks, tipos y componentes.
- **Types Decentralization**: Tipos TypeScript localizados por feature para evitar dependencias circulares y mejorar la mantenibilidad.
- **Custom Hooks**: Lógica de negocio extraída en hooks reutilizables para mantener los componentes limpios (S.O.L.I.D).

### Estado y Datos
- **Zustand**: Gestión de estado global simplificada para la autenticación y persistencia de sesión.
- **Axios Interceptors**: Manejo centralizado de tokens JWT y errores 401 para una sesión fluida.
- **Zod + React Hook Form**: Validaciones de esquemas robustas tanto en cliente como pre-envío a API.

### Diseño y UI
- **Tailwind CSS**: Estilizado moderno con un sistema de diseño basado en utilidad.
- **Glassmorphism & Micro-animations**: Interfaz premium con desenfoques, gradientes y transiciones suaves.
- **Responsive Design**: Adaptabilidad total a dispositivos móviles y escritorio.

## Estructura del Proyecto

```
src/frontend/src/
├── api/                # Cliente Axios y configuraciones globales
├── components/         # Componentes comunes (Botones, Inputs, Layouts)
├── constants/          # Constantes globales y rutas
├── features/           # Módulos de la aplicación
│   ├── auth/           # Login, Registro, Lógica de sesión
│   ├── cards/          # Gestión de tarjetas (Lista, Creación, Edición)
│   ├── dashboard/      # Vistas de resumen y carruseles
│   └── payments/       # Flujo de pagos e historial
├── store/              # Estados globales (Zustand)
├── types/              # Tipos compartidos globales
└── utils/              # Formateadores y utilidades
```

## Inicio Rápido

### Prerrequisitos
- Node.js (v18 o superior)
- npm o yarn

### Instalación

**1. Clonar el repositorio**
```bash
git clone <repository-url>
cd interview-fullstack-dev-tuya/src/frontend
```

**2. Instalar dependencias**
```bash
npm install
```

**3. Configurar variables de entorno**
Crea un archivo `.env` basado en `.env.example`:
```env
VITE_API_URL=http://localhost:5269/api
```

**4. Ejecutar en desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en **http://localhost:5173**

