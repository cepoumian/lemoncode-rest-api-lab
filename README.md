## Base URL

`/api/listings`

---

## 1) GET `/api/listings`

### Propósito

Listado paginado de listings filtrado por país.

### Query params

- `country` _(string, required)_: país exacto como viene en DB (`address.country`)
- `page` _(number, optional, default = 1, min=1)_
- `pageSize` _(number, optional, default = 10, min=1, max=50)_

### Ejemplo

`GET /api/listings?country=Portugal&page=1&pageSize=10`

### Respuesta 200 (array)

```json
[
  {
    "id": "65097600a74000a4a4a22686",
    "name": "Ribeira Charming Duplex",
    "imageUrl": "https://a0.muscache.com/im/pictures/....jpg",
    "price": 80,
    "priceCurrency": "USD",
    "address": {
      "country": "Portugal"
    }
  }
]
```

### Errores

- 400 si falta `country` o `page/pageSize` inválidos.

> Nota: en DB price es Decimal128. En API conviene exponer number (o string). Yo recomiendo number si no te piden lo contrario.

---

## 2) GET `/api/listings/:id`

### Propósito

Detalle de un listing por su `_id`.

### Path param

- `id` _(string, required)_: ObjectId como string

### Ejemplo

`GET /api/listings/65097600a74000a4a4a22686`

### Respuesta 200

```json
{
  "id": "65097600a74000a4a4a22686",
  "name": "Ribeira Charming Duplex",
  "description": "Fantastic duplex apartment...",
  "imageUrl": "https://a0.muscache.com/im/pictures/....jpg",
  "amenities": ["TV", "Wifi", "Kitchen"],
  "address": {
    "country": "Portugal",
    "street": "Porto, Porto, Portugal"
  },
  "reviews": [
    {
      "id": "58663741",
      "date": "2016-01-03T05:00:00.000Z",
      "reviewerName": "Cátia",
      "comments": "A casa da Ana..."
    }
  ]
}
```

### Notas importantes

- `reviews` debe devolver **solo las últimas 5** (si hay más).
- `date` en API: string ISO (no Date raw).

### Errores

- 400 si `id` no es ObjectId válido.
- 404 si no existe.

---

## 3) POST `/api/listings/:id/reviews`

### Propósito

Añadir una review a un listing.

### Path param

- `id` _(string, required)_: ObjectId como string

### Body (JSON)

```json
{
  "reviewerName": "Cesar",
  "comments": "Testing review"
}
```

### Reglas

- El backend calcula `date` (now).
- Puedes generar `id` interno para la review (`ObjectId().toString()` o similar).

### Respuesta

Opción recomendable (simple y útil):

- **201** con la review creada:

```json
{
  "id": "6560c2b0c6b2b6e3d8a1a222",
  "date": "2025-12-15T18:30:00.000Z",
  "reviewerName": "Cesar",
  "comments": "Testing review"
}
```

### Errores

- 400 si `reviewerName/comments` faltan o vienen vacíos.
- 400 si `id` inválido.
- 404 si listing no existe.

---

# Checklist de consistencia (para el lab)

- ✅ Todos los IDs expuestos como **string**
- ✅ No se expone el documento completo (solo campos necesarios)
- ✅ `GET /api/listings` paginado
- ✅ `GET /api/listings/:id` devuelve últimas 5 reviews
- ✅ `POST review` calcula fecha en backend
