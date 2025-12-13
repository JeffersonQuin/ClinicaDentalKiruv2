<template>
  <q-card class="ad-card" @click="$emit('click')">
    <!-- Imagen del anuncio -->
    <q-img
      :src="ad.image"
      :alt="ad.title"
      height="250px"
    >
      <!-- Overlay con información -->
      <div class="absolute-full overlay">
        <div class="absolute-top-right q-ma-sm">
          <q-chip 
            :color="ad.categoryColor" 
            text-color="white" 
            size="sm"
          >
            {{ ad.category }}
          </q-chip>
        </div>
        
        <!-- Información de contacto -->
        <div class="absolute-bottom-left q-ma-md">
          <div class="text-white text-weight-bold">
            {{ ad.contactInfo }}
          </div>
        </div>
      </div>
    </q-img>
    
    <q-card-section>
      <div class="text-h6 text-weight-bold q-mb-sm">
        {{ ad.title }}
      </div>
      
      <!-- Indicador de antes/después -->
      <div v-if="ad.beforeAfter" class="q-mb-sm">
        <q-chip 
          color="green" 
          text-color="white" 
          size="sm"
          icon="compare"
        >
          Antes y Después
        </q-chip>
      </div>
      
      <p class="text-grey-7 q-mb-md">
        {{ ad.description }}
      </p>
      
      <!-- Redes sociales si las tiene -->
      <div v-if="ad.socialMedia" class="q-mb-md">
        <div class="row q-gutter-xs">
          <q-btn 
            v-for="social in ad.socialMedia" 
            :key="social"
            :icon="getSocialIcon(social)"
            round
            dense
            size="sm"
            color="primary"
            flat
          />
        </div>
      </div>
      
      <div class="row items-center justify-end">
        <q-btn 
          color="primary" 
          label="Más información" 
          flat
          icon="arrow_forward"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
defineProps({
  ad: {
    type: Object,
    required: true,
    default: () => ({
      title: '',
      description: '',
      image: '',
      price: '',
      category: '',
      categoryColor: 'primary',
      beforeAfter: false,
      contactInfo: '',
      socialMedia: []
    })
  }
})

defineEmits(['click'])

// Método para obtener iconos de redes sociales
const getSocialIcon = (social) => {
  const icons = {
    facebook: 'facebook',
    instagram: 'camera_alt',
    twitter: 'twitter',
    youtube: 'play_circle',
    linkedin: 'linkedin'
  }
  return icons[social] || 'share'
}
</script>

<!-- Los estilos están en app.scss global -->
