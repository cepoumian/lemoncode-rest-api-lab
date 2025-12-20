# Backend REST API – Listings & Reviews

Este proyecto es una API REST desarrollada como parte del laboratorio del **Módulo de APIs REST** del bootcamp de backend de LemonCode.

La API expone endpoints para consultar y gestionar alojamientos (listings), reseñas (reviews) y autenticación de usuarios, siguiendo una arquitectura modular y escalable basada en el boilerplate de referencia del curso.

---

## Arquitectura

El proyecto sigue una arquitectura en capas:

src/
core/ # Infraestructura transversal (server, security, env, etc.)
common/ # Helpers, middlewares comunes
dals/ # Data Access Layer (MongoDB / Mock)
pods/ # Features / dominios (listing, security)
console-runners/

### Principios clave

- Separación clara entre API, mappers y acceso a datos.
- Repositorios intercambiables (Mongo / Mock) mediante `IS_API_MOCK`.
- Endpoints protegidos mediante middleware de autenticación.
- Tests unitarios e integración reales con MongoDB in-memory.

---

## Funcionalidad principal

### Listings

- `GET /api/listings`
  - Filtros: `country`
  - Paginación: `page`, `pageSize`
- `GET /api/listings/:id`
- `PUT /api/listings/:id` (requiere autenticación)
- `POST /api/listings/:id/reviews` (requiere autenticación)

### Seguridad

- `POST /api/security/login`
  - Autenticación con email y password
  - Devuelve cookie `authorization` con JWT
- `POST /api/security/logout`

---

## Autenticación

- Autenticación basada en JWT.
- El token se almacena en una cookie `httpOnly`.
- Middleware `authenticationMiddleware`:
  - Lee cookie `authorization`
  - Verifica JWT
  - Inyecta `req.userSession`
- Rutas protegidas devuelven `401` si no hay sesión válida.

---

## Tests

El proyecto incluye:

- Tests unitarios (mappers).
- Tests de integración:
  - Listings
  - Login
  - Rutas protegidas
- MongoDB en memoria para tests (`mongodb-memory-server`).

### Ejecutar tests

```bash
npm test
```

## Base de datos

MongoDB

Dataset de Airbnb (listingsAndReviews)

Colección adicional: users

### Seed de datos

El proyecto incluye console runners interactivos:

```bash
npm run console-runners
```

Opciones disponibles:

- seed-data → restaura dataset Airbnb (via Docker + mongorestore)
- seed-users → crea usuarios para autenticación

## Variables de entorno

Ejemplo:

```
NODE_ENV=development
PORT=3000
MONGODB_URL=mongodb://localhost:27017/airbnb

AUTH_SECRET=super-secret
IS_API_MOCK=false

```

## Scripts útiles

```
npm start              # Arranca el servidor
npm test                 # Ejecuta tests
npm run console-runners  # Ejecuta runners interactivos

```
