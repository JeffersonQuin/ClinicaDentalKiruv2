<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card style="min-width: 400px; max-width: 500px">
      <q-card-section class="row items-center">
        <q-icon name="calendar_today" color="primary" size="2em" class="q-mr-sm" />
        <span class="text-h6">Agendar Cita</span>
      </q-card-section>
      
      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <!-- Información Personal -->
          <div class="text-subtitle1 text-weight-bold q-mb-sm">Información Personal</div>
          
          <q-input
            v-model="form.name"
            label="Nombre completo"
            :rules="[val => !!val || 'El nombre es requerido']"
            outlined
            :loading="loading"
          />
          
          <q-input
            v-model="form.phone"
            label="Teléfono"
            :rules="[val => !!val || 'El teléfono es requerido']"
            outlined
            :loading="loading"
          />
          
          <q-input
            v-model="form.email"
            label="Email"
            type="email"
            outlined
            :loading="loading"
          />
          
          <!-- Información de la Cita -->
          <div class="text-subtitle1 text-weight-bold q-mb-sm q-mt-md">Información de la Cita</div>
          
          <q-input
            v-model="form.date"
            label="Fecha preferida"
            type="date"
            :rules="[val => !!val || 'La fecha es requerida']"
            outlined
            :loading="loading"
          />
          
          <q-select
            v-model="form.time"
            :options="timeSlots"
            label="Hora preferida"
            outlined
            :loading="loading"
          />
          
          <q-select
            v-model="form.service"
            :options="services"
            label="Servicio de interés"
            outlined
            :loading="loading"
          />
          
          <q-input
            v-model="form.notes"
            label="Notas adicionales (opcional)"
            type="textarea"
            outlined
            rows="3"
            :loading="loading"
          />
        </q-form>
      </q-card-section>
      
      <q-card-actions align="right" class="q-pa-md">
        <q-btn 
          flat 
          label="Cancelar" 
          v-close-popup 
          :disable="loading"
        />
        <q-btn 
          color="primary" 
          label="Agendar Cita"
          :loading="loading"
          @click="onSubmit"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'submit'])

// Datos reactivos
const loading = ref(false)
const isOpen = ref(false)

const form = ref({
  name: '',
  phone: '',
  email: '',
  date: '',
  time: '',
  service: '',
  notes: ''
})

const services = [
  'Consulta general',
  'Limpieza dental',
  'Blanqueamiento dental',
  'Ortodoncia',
  'Implantes dentales',
  'Endodoncia',
  'Periodoncia',
  'Cirugía oral',
  'Prótesis dentales'
]

const timeSlots = [
  '08:00 AM',
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM'
]

// Watchers
watch(() => props.modelValue, (newVal) => {
  isOpen.value = newVal
})

watch(isOpen, (newVal) => {
  emit('update:modelValue', newVal)
})

// Métodos
const onSubmit = async () => {
  loading.value = true
  
  try {
    // Validar formulario
    if (!form.value.name || !form.value.phone || !form.value.date) {
      $q.notify({
        type: 'negative',
        message: 'Por favor completa todos los campos requeridos'
      })
      return
    }
    
    // Emitir evento con los datos del formulario
    emit('submit', { ...form.value })
    
    // Simular envío
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    $q.notify({
      type: 'positive',
      message: 'Cita agendada exitosamente. Te contactaremos pronto.'
    })
    
    // Cerrar dialog y limpiar formulario
    isOpen.value = false
    resetForm()
    
  } catch {
    $q.notify({
      type: 'negative',
      message: 'Error al agendar la cita. Inténtalo de nuevo.'
    })
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.value = {
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    service: '',
    notes: ''
  }
}
</script>

<style scoped>
.q-card {
  border-radius: 12px;
}
</style>
