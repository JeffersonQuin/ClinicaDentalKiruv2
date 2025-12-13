<template>
  <q-dialog v-model="showDialog" maximized transition-show="slide-up" transition-hide="slide-down">
    <q-card class="detail-dialog">
      <!-- Header -->
      <q-card-section class="dialog-header bg-primary text-white">
        <div class="row items-center">
          <div class="col">
            <div class="text-h6">Detalles del Servicio</div>
            <div v-if="servicioData" class="text-caption">{{ servicioData.category }}</div>
          </div>
          <div class="col-auto">
            <q-btn icon="close" flat round dense @click="closeDialog" color="white" />
          </div>
        </div>
      </q-card-section>

      <q-card-section class="dialog-content q-pt-lg">
        <div v-if="servicioData" class="row q-col-gutter-xl">
          <!-- Columna Imagen -->
          <div class="col-12 col-md-5">
            <div class="image-section">
              <div v-if="imageUrl" class="image-container">
                <q-img
                  :src="imageUrl"
                  :alt="servicioData.title"
                  class="detail-image"
                  style="max-height: 400px; border-radius: 8px;"
                  @error="handleImageError"
                >
                  <template v-slot:loading>
                    <div class="absolute-full flex flex-center bg-grey-2">
                      <q-spinner-gears color="primary" size="50px" />
                    </div>
                  </template>
                </q-img>
              </div>

              <div v-else class="no-image-placeholder large">
                <q-icon name="image" size="80px" color="grey-5" />
                <span class="text-grey-7 q-mt-md">No hay imagen disponible</span>
              </div>
            </div>

            <!-- Información rápida -->
            <div class="quick-info q-mt-md">
              <q-list bordered class="rounded-borders shadow-1">
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="category" color="primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label caption>Categoría</q-item-label>
                    <q-item-label class="text-weight-bold">{{ servicioData.category }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section avatar>
                    <q-icon name="info" color="primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label caption>Estado</q-item-label>
                    <q-item-label>
                      <q-badge 
                        :color="servicioData.estado === 'activo' ? 'positive' : 'negative'"
                        :label="servicioStore.formatState(servicioData.estado)"
                        class="q-px-sm q-py-xs"
                      />
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section avatar>
                    <q-icon name="tag" color="primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label caption>ID del Servicio</q-item-label>
                    <q-item-label class="text-weight-bold text-grey-7">#{{ servicioData.id }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>

          <!-- Columna Información -->
          <div class="col-12 col-md-7">
            <div class="info-section">
              <!-- Título -->
              <div class="q-mb-lg">
                <h2 class="text-h4 text-weight-bold q-mb-sm">{{ servicioData.title }}</h2>
                <div class="text-caption text-grey-6">
                  <q-icon name="schedule" size="14px" class="q-mr-xs" />
                  Última actualización: {{ formatLastUpdate(servicioData.updatedAt || servicioData.createdAt) }}
                </div>
              </div>
              
              <!-- Descripción -->
              <div class="description-section q-mb-lg">
                <q-card flat bordered>
                  <q-card-section>
                    <div class="text-h6 text-weight-bold q-mb-md">Descripción</div>
                    <div class="description-text q-mb-md">
                      {{ servicioData.descripcion }}
                    </div>
                    
                    <!-- Información adicional si existe -->
                    <div v-if="servicioData.informacion_adicional" class="additional-info q-mt-md">
                      <div class="text-subtitle2 text-weight-bold q-mb-xs">Información Adicional</div>
                      <div class="text-body2">{{ servicioData.informacion_adicional }}</div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>

              <!-- Acciones -->
              <div class="actions-section q-mt-xl">
                <div class="row q-col-gutter-sm">
                  <div class="col-auto">
                    <q-btn
                      color="primary"
                      icon="edit"
                      label="Editar"
                      @click="editServicio"
                      unelevated
                      no-caps
                    />
                  </div>
                  <div class="col-auto">
                    <q-btn
                      color="negative"
                      icon="delete"
                      label="Eliminar"
                      outline
                      no-caps
                      @click="deleteServicio"
                    />
                  </div>
                  <div class="col"></div>
                  <div class="col-auto">
                    <q-btn
                      color="grey-7"
                      icon="close"
                      label="Cerrar"
                      @click="closeDialog"
                      flat
                      no-caps
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading state -->
        <div v-else class="flex flex-center q-pa-xl">
          <q-spinner-gears color="primary" size="50px" />
          <div class="q-ml-md text-h6">Cargando detalles...</div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { computed, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useServicioStore } from 'src/stores/servicioStore'

export default {
  name: 'DetailServicioDialog',
  
  props: {
    modelValue: { type: Boolean, required: true },
    servicioData: { type: Object, default: () => ({}) }
  },

  emits: ['update:modelValue', 'edit-requested', 'delete-requested'],

  setup(props, { emit }) {
    const $q = useQuasar()
    const servicioStore = useServicioStore()
    const loading = ref(false)

    const showDialog = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    })

    const imageUrl = computed(() => {
      if (!props.servicioData || !props.servicioData.imagen) return null
      return servicioStore.getImagePath(props.servicioData.imagen)
    })

    const closeDialog = () => showDialog.value = false

    const handleImageError = (event) => {
      console.error('Error cargando imagen:', event)
    }

    const formatLastUpdate = (dateString) => {
      if (!dateString) return 'No disponible'
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const editServicio = () => {
      emit('edit-requested', props.servicioData)
      closeDialog()
    }

    const deleteServicio = () => {
      $q.dialog({
        title: 'Confirmar eliminación',
        message: `¿Estás seguro de que quieres eliminar el servicio "${props.servicioData.title}"?`,
        cancel: true,
        persistent: true,
        color: 'negative'
      }).onOk(async () => {
        loading.value = true
        try {
          await servicioStore.eliminarServicio(props.servicioData.id)
          $q.notify({ type: 'positive', message: 'Servicio eliminado correctamente', position: 'top-right' })
          emit('delete-requested', props.servicioData.id)
          closeDialog()
        } catch (error) {
          console.error('Error eliminando servicio:', error)
          $q.notify({ type: 'negative', message: 'Error al eliminar el servicio', position: 'top-right' })
        } finally {
          loading.value = false
        }
      })
    }

    return { 
      showDialog,
      imageUrl,
      loading,
      servicioStore, 
      closeDialog,
      handleImageError,
      formatLastUpdate,
      editServicio,
      deleteServicio
    }
  }
}
</script>
