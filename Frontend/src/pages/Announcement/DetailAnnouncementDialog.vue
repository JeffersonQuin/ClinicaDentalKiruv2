<template>
  <q-dialog v-model="showDialog" maximized transition-show="slide-up" transition-hide="slide-down">
    <q-card class="detail-dialog">
      <!-- Header -->
      <q-card-section class="dialog-header bg-primary text-white">
        <div class="row items-center">
          <div class="col">
            <div class="text-h6">Detalles del Anuncio</div>
            <div v-if="anuncioData" class="text-caption">{{ anuncioData.categoria }}</div>
          </div>
          <div class="col-auto">
            <q-btn icon="close" flat round dense @click="closeDialog" color="white" />
          </div>
        </div>
      </q-card-section>

      <q-card-section class="dialog-content q-pt-lg">
        <div v-if="anuncioData" class="row q-col-gutter-xl">
          <!-- Columna Imagen -->
          <div class="col-12 col-md-5">
            <div class="image-section">
              <div v-if="imageUrl" class="image-container">
                <q-img
                  :src="imageUrl"
                  :alt="anuncioData.titulo"
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
                    <q-item-label class="text-weight-bold">{{ anuncioData.categoria }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section avatar>
                    <q-icon name="person" color="primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label caption>Creado por</q-item-label>
                    <q-item-label class="text-weight-bold">{{ getUserName(anuncioData.userId) }}</q-item-label>
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
                        :color="anuncioData.estado === 'activo' ? 'positive' : 'negative'"
                        :label="anuncioStore.formatState(anuncioData.estado)"
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
                    <q-item-label caption>ID del Anuncio</q-item-label>
                    <q-item-label class="text-weight-bold text-grey-7">#{{ anuncioData.id }}</q-item-label>
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
                <h2 class="text-h4 text-weight-bold q-mb-sm">{{ anuncioData.titulo }}</h2>
                <div class="text-caption text-grey-6">
                  <q-icon name="schedule" size="14px" class="q-mr-xs" />
                  Última actualización: {{ formatLastUpdate(anuncioData.updatedAt || anuncioData.createdAt) }}
                </div>
              </div>
              
              <!-- Fechas -->
              <div class="dates-section q-mb-lg">
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-sm-6">
                    <q-card flat bordered class="date-card">
                      <q-card-section class="q-py-sm">
                        <div class="row items-center no-wrap">
                          <div class="col-auto">
                            <q-icon name="event_available" color="positive" size="24px" />
                          </div>
                          <div class="col q-ml-md">
                            <div class="text-caption text-grey-7">Publicación</div>
                            <div class="text-weight-bold">{{ anuncioStore.formatDate(anuncioData.fecha_publicacion) }}</div>
                          </div>
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>
                  
                  <div class="col-12 col-sm-6">
                    <q-card flat bordered class="date-card">
                      <q-card-section class="q-py-sm">
                        <div class="row items-center no-wrap">
                          <div class="col-auto">
                            <q-icon name="event_busy" color="negative" size="24px" />
                          </div>
                          <div class="col q-ml-md">
                            <div class="text-caption text-grey-7">Expiración</div>
                            <div class="text-weight-bold">
                              {{ anuncioData.fecha_expiracion ? anuncioStore.formatDate(anuncioData.fecha_expiracion) : 'Sin fecha' }}
                            </div>
                          </div>
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>
                </div>
              </div>

              <!-- Descripción -->
              <div class="description-section q-mb-lg">
                <q-card flat bordered>
                  <q-card-section>
                    <div class="text-h6 text-weight-bold q-mb-md">Descripción</div>
                    <div class="description-text q-mb-md">
                      {{ anuncioData.descripcion }}
                    </div>
                    
                    <!-- Información adicional si existe -->
                    <div v-if="anuncioData.informacion_adicional" class="additional-info q-mt-md">
                      <div class="text-subtitle2 text-weight-bold q-mb-xs">Información Adicional</div>
                      <div class="text-body2">{{ anuncioData.informacion_adicional }}</div>
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
                      @click="editAnuncio"
                      unelevated
                      no-caps
                    />
                  </div>
                  <div class="col-auto">
                    <q-btn
                      color="secondary"
                      icon="share"
                      label="Compartir"
                      outline
                      no-caps
                      @click="shareAnuncio"
                    />
                  </div>
                  <div class="col-auto">
                    <q-btn
                      color="negative"
                      icon="delete"
                      label="Eliminar"
                      outline
                      no-caps
                      @click="deleteAnuncio"
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
import { useAnuncioStore } from 'src/stores/anuncioStore'

export default {
  name: 'DetailAnuncioDialog',
  
  props: {
    modelValue: { type: Boolean, required: true },
    anuncioData: { type: Object, default: () => ({}) }
  },

  emits: ['update:modelValue', 'edit-requested', 'delete-requested'],

  setup(props, { emit }) {
    const $q = useQuasar()
    const anuncioStore = useAnuncioStore()
    const loading = ref(false)

    const showDialog = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value)
    })

    // Obtener la URL completa de la imagen usando el store
    const imageUrl = computed(() => {
      if (!props.anuncioData || !props.anuncioData.imagen) return null
      return anuncioStore.getImagePath(props.anuncioData.imagen)
    })

    const closeDialog = () => {
      showDialog.value = false
    }

    const handleImageError = (event) => {
      console.error('Error cargando imagen:', event)
      // El store ya tiene handleImageError, pero podemos mostrar un mensaje
      anuncioStore.handleImageError(event)
    }

    // Helper function to get user name
    const getUserName = (userId) => {
      // Puedes implementar lógica para obtener el nombre del usuario
      // Por ahora, retornamos un valor por defecto
      return `Usuario #${userId}`
    }

    // Formatear última actualización
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

    // Acciones
    const editAnuncio = () => {
      emit('edit-requested', props.anuncioData)
      closeDialog()
    }

    const deleteAnuncio = () => {
      $q.dialog({
        title: 'Confirmar eliminación',
        message: `¿Estás seguro de que quieres eliminar el anuncio "${props.anuncioData.titulo}"?`,
        cancel: true,
        persistent: true,
        color: 'negative'
      }).onOk(async () => {
        loading.value = true
        try {
          await anuncioStore.eliminarAnuncio(props.anuncioData.id)
          $q.notify({
            type: 'positive',
            message: 'Anuncio eliminado correctamente',
            position: 'top-right'
          })
          emit('delete-requested', props.anuncioData.id)
          closeDialog()
        } catch (error) {
          console.error('Error eliminando anuncio:', error)
          $q.notify({
            type: 'negative',
            message: 'Error al eliminar el anuncio',
            position: 'top-right'
          })
        } finally {
          loading.value = false
        }
      })
    }

    const shareAnuncio = () => {
      if (navigator.share) {
        navigator.share({
          title: props.anuncioData.titulo,
          text: props.anuncioData.descripcion,
          url: window.location.href
        })
      } else {
        // Fallback: copiar al portapapeles
        navigator.clipboard.writeText(
          `${props.anuncioData.titulo}\n${props.anuncioData.descripcion}\n${window.location.href}`
        )
        $q.notify({
          type: 'info',
          message: 'Enlace copiado al portapapeles',
          position: 'top-right'
        })
      }
    }

    return { 
      showDialog,
      imageUrl,
      loading,
      anuncioStore, 
      closeDialog,
      handleImageError,
      getUserName,
      formatLastUpdate,
      editAnuncio,
      deleteAnuncio,
      shareAnuncio
    }
  }
}
</script>

