# 🌙 Sistema de Modo Oscuro Global - KIRU Odontología

## 📁 Ubicación
Los estilos de modo oscuro están centralizados en: `src/css/app.scss`

## 🎯 ¿Por qué un archivo global?

### ✅ **Ventajas:**
- **Reutilización**: Los estilos se aplican automáticamente a todas las páginas
- **Consistencia**: Mismo comportamiento en toda la aplicación
- **Mantenimiento**: Un solo lugar para modificar estilos de modo oscuro
- **Performance**: Menos código duplicado
- **Escalabilidad**: Fácil agregar nuevas páginas sin duplicar estilos

## 🚀 Cómo usar

### 1. **Para Páginas Nuevas:**
```vue
<template>
  <q-page class="mi-pagina">
    <!-- Tu contenido aquí -->
  </q-page>
</template>

<style scoped>
.mi-pagina {
  /* Solo estilos específicos de la página */
  /* Los estilos de modo oscuro ya están en app.scss */
}
</style>
```

### 2. **Para Componentes Nuevos:**
```vue
<template>
  <div class="mi-componente">
    <!-- Tu contenido aquí -->
  </div>
</template>

<style scoped>
.mi-componente {
  /* Solo estilos específicos del componente */
  /* Los estilos de modo oscuro ya están en app.scss */
}
</style>
```

## 🎨 Clases CSS Disponibles

### **Clases Helper:**
```css
.force-light-text    /* Fuerza texto blanco */
.force-light-bg      /* Fuerza fondo gris oscuro */
.force-orange        /* Fuerza color naranja */
.force-orange-bg     /* Fuerza fondo naranja */
```

### **Clases de Quasar que ya tienen modo oscuro:**
- `.text-h1`, `.text-h2`, `.text-h3`, etc.
- `.text-body1`, `.text-body2`
- `.q-card`, `.q-card-section`
- `.q-btn--primary`
- `.q-field--outlined`
- `.q-chip`

## 📱 Responsive

Los estilos de modo oscuro incluyen media queries para:
- **Desktop**: Estilos completos
- **Tablet**: Ajustes menores
- **Mobile**: Optimizaciones para pantallas pequeñas

## 🔧 Personalización

### **Agregar nuevos estilos:**
```scss
/* En app.scss */
.body--dark .mi-clase-personalizada {
  background: #2a2a2a !important;
  color: #ffffff !important;
}
```

### **Modificar colores existentes:**
```scss
/* En app.scss */
:root {
  --primary-orange: #TU_COLOR_AQUI;
}
```

## 📋 Checklist para Nuevas Páginas

- [ ] Agregar clase única a la página (ej: `.mi-pagina`)
- [ ] Agregar estilos específicos en el `<style scoped>`
- [ ] **NO** agregar estilos de modo oscuro (ya están en app.scss)
- [ ] Probar en modo claro y oscuro
- [ ] Verificar responsive

## 🎯 Ejemplo Completo

```vue
<template>
  <q-page class="servicios-page">
    <section class="hero-servicios">
      <h1>Nuestros Servicios</h1>
      <p>Descubre lo que ofrecemos</p>
    </section>
    
    <section class="servicios-grid">
      <div class="servicio-card">
        <h3>Blanqueamiento</h3>
        <p>Descripción del servicio</p>
      </div>
    </section>
  </q-page>
</template>

<style scoped>
.servicios-page {
  /* Solo estilos específicos */
}

.hero-servicios {
  background: linear-gradient(135deg, #f0f0f0, #e0e0e0);
  padding: 2rem;
}

.servicio-card {
  background: white;
  border-radius: 10px;
  padding: 1rem;
}

/* Los estilos de modo oscuro ya están en app.scss global */
</style>
```

## 🚨 Importante

- **NO** duplicar estilos de modo oscuro en componentes individuales
- **SÍ** usar las clases helper cuando sea necesario
- **SÍ** probar siempre en ambos modos (claro y oscuro)
- **SÍ** mantener consistencia con el diseño existente

---

**💡 Tip**: Si necesitas un estilo muy específico que no está en el global, agrégalo a `app.scss` para que esté disponible en toda la aplicación.

