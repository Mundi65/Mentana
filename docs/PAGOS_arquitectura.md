# PAGOS — Arquitectura del módulo (enrutador por región)

Documento de diseño para construir el pago sin que se vuelva un cuello de botella.
Se diseña completo desde el inicio; se IMPLEMENTA por etapas.

---

## 1. Idea central

El usuario está en un país. Cada país se cobra mejor con una pasarela distinta.
Entonces: **detectamos el país y un "enrutador" elige la pasarela configurada para
esa región.** Cada pasarela es un **adaptador** que cumple la MISMA interfaz, así
agregar una pasarela nueva no toca el resto del sistema.

```
país del usuario ──> enrutador ──> adaptador de pasarela ──> cobro
   (encuesta/IP)        (mapa región→pasarela)   (PayPhone, Stripe, ...)
```

---

## 2. De dónde sale el país

1. **Primario:** la respuesta `pais` de la encuesta (`store.pais`).
2. **Respaldo / confirmación:** geolocalización por IP (un servicio que devuelve el
   código de país). Útil si el usuario no respondió o para detectar incoherencias.
3. Se guarda el código ISO del país (ej. `EC`, `MX`, `US`) en `store.paisISO`.

---

## 3. Interfaz única de una pasarela (adaptador)

Toda pasarela implementa exactamente esto. Nada más enchufa con el motor:

```js
// Forma de un adaptador de pasarela
{
  id: 'payphone',
  nombre: 'PayPhone',
  regiones: ['EC'],          // países/regiones que cubre (ISO)
  disponible: true,          // false = "próximamente", no se ofrece aún
  async intentarCobro(plan, ctx) {
    // plan: { id, nombre, precio, periodo, moneda }
    // ctx:  { paisISO, email, ... }
    // Devuelve SIEMPRE:
    return { estado: 'exito' | 'cancelado' | 'fallo', referencia?: '...' };
  }
}
```

El motor solo llama `intentarCobro(plan, ctx)` y reacciona al `estado`. No sabe
(ni le importa) qué pasarela es.

---

## 4. El enrutador

```js
// /engine/payments.js
router.seleccionar(paisISO) -> adaptador
```

Lógica: busca en el mapa `pasarelasPorRegion` (de `/config`) la pasarela del país;
si no hay o no está `disponible`, usa la **pasarela global de respaldo**; si ni esa
está lista, muestra "pago internacional próximamente" y ofrece la prueba gratis.

Mapa de configuración (en `/config/app.config.js`, NO en el motor):

```js
pagos: {
  paisPorDefecto: 'EC',
  respaldoGlobal: 'stripe',          // o 'paypal'
  pasarelasPorRegion: {
    EC: 'payphone',
    MX: 'mercadopago',
    CO: 'mercadopago',
    AR: 'mercadopago',
    CL: 'mercadopago',
    PE: 'mercadopago',
    ES: 'stripe',
    US: 'stripe'
    // los no listados -> respaldoGlobal
  }
}
```

---

## 5. Plan de implementación por etapas (evita el cuello de botella)

- **v1 (ahora):** se construye el **enrutador + la interfaz de adaptador + la
  detección de país**, con UN adaptador STUB (devuelve 'cancelado' → activa prueba
  gratis). Todo el flujo se puede probar sin cobrar de verdad.
- **Etapa PayPhone (Ecuador):** se implementa el adaptador real de PayPhone (con un
  backend mínimo en Render, como en Lumina). Solo se crea ese archivo de adaptador
  y se marca `disponible: true`. Nada más cambia.
- **Etapa internacional:** se implementa el adaptador global (Stripe o PayPal) para
  todos los países fuera de Ecuador. Se enchufa igual.
- **Etapa local LatAm (opcional):** Mercado Pago por país, SOLO si el volumen de ese
  mercado lo justifica.

Cada etapa = crear un archivo de adaptador + activar una línea en el mapa. Cero
reescritura del motor o de las pantallas.

---

## 6. Sobre las cuentas (tu pregunta) — realidad práctica

- Las cuentas de cobro se abren **por pasarela y según el país de TU negocio**, no
  por país del cliente. No necesitas una cuenta por cada país de usuario.
- **PayPhone:** cuenta ecuatoriana; ideal para cobrar en Ecuador.
- **Pasarela global (Stripe / PayPal):** una sola cuenta puede aceptar clientes de
  muchos países. El punto a VERIFICAR al configurar: desde qué país se permite
  *abrir* la cuenta del negocio y a qué banco llegan los retiros. (Aquí está el
  inconveniente que anticipaste; depende de tu entidad legal y banco.)
- **Mercado Pago:** suele ser cuenta separada POR país. Solo abrir donde haya
  volumen real. No al inicio.

Estrategia recomendada para no trabarte: **arrancar con PayPhone (Ecuador)** y una
**pasarela global** para el resto; abrir cuentas locales solo cuando un mercado lo
amerite.

> ⚠️ Disponibilidad por país, requisitos (KYC), comisiones y soporte de cada
> pasarela CAMBIAN con el tiempo. Verifica los datos vigentes en el momento de
> configurar y desarrollar este módulo, no antes.

---

## 7. Seguridad (no negociable)

- NINGUNA clave secreta de pago en el frontend. Las claves viven en el backend.
- El frontend solo inicia el cobro y recibe el resultado; el backend confirma.
- Esto vale para PayPhone, Stripe, PayPal y cualquiera que se sume.
