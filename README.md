# Clip & Fade — Barbería

Sitio web para barbería desarrollado con Express y EJS, con diseño responsive y accesible.

## Estructura del proyecto

```
├── public/             # Archivos estáticos
│   ├── css/
│   │   └── styles.css  # Estilos mobile-first con CSS Grid
│   ├── js/
│   │   └── scripts.js  # Validación de formularios
│   ├── images/         # Imágenes del sitio
│   └── logo.svg        # Logo de la barbería
├── views/              # Plantillas EJS
│   ├── partials/       # Header, footer, head compartidos
│   └── *.ejs          # Vistas de páginas (index, services, gallery, booking, contact)
├── server.js          # Servidor Express
└── package.json       # Dependencias (express, ejs)
```

## Páginas disponibles

- `/` — Página principal con hero
- `/services` — Servicios y precios
- `/gallery` — Galería de trabajos
- `/booking` — Formulario de reservas
- `/contact` — Ubicación y contacto
