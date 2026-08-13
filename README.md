# ☕ Mi Cafetería — cuaderno de pedidos

Una app sencilla y visual para tomar pedidos de cafés, infusiones y copas,
llevar el control de quién ha pagado y editar la carta (nombres y precios).

Todo se guarda en el propio navegador (localStorage), así que no hace falta
base de datos ni servidor: funciona igual en el móvil, la tablet o el
ordenador donde se abra.

## Qué hace

- **Pedir**: toca los productos para añadirlos a la comanda, ajusta
  cantidades, pon el nombre de quién pidió y guarda.
- **Pedidos**: lista de tickets con fecha, contenido y total. Un botón para
  marcar cada uno como cobrado o pendiente, y filtros para verlos por estado.
- **Carta**: añadir, renombrar, cambiar de precio o borrar cualquier café,
  infusión o copa, con su icono.

## Desarrollo local

```bash
npm install
npm run dev
```

Abre la URL que muestre la terminal (normalmente http://localhost:5173).

## Desplegar en Vercel

**Opción más sencilla — sin usar la terminal:**

1. Sube esta carpeta a un repositorio de GitHub (puedes arrastrar los
   archivos desde github.com/new si no usas git).
2. Entra en [vercel.com](https://vercel.com), inicia sesión y pulsa
   **Add New → Project**.
3. Importa el repositorio. Vercel detecta automáticamente que es un
   proyecto Vite: deja los ajustes por defecto (Build Command
   `npm run build`, Output Directory `dist`) y pulsa **Deploy**.
4. En un par de minutos tendrás una URL pública para usar la app.

**Opción con la CLI de Vercel:**

```bash
npm install -g vercel
vercel
```

Sigue las preguntas (puedes aceptar todas las opciones por defecto) y al
terminar te dará la URL de la app.

## Notas

- Los datos (carta y pedidos) se guardan solo en el navegador que se use.
  Si se abre la app en otro dispositivo, empezará con la carta por defecto
  y sin pedidos — no comparten datos entre sí.
- Para borrar todo y empezar de cero, basta con borrar los datos del sitio
  desde los ajustes del navegador.
