<template>
  <div class="floating-button-container">
    <q-btn
      fab
      color="primary"
      icon="medical_services"
      size="lg"
      class="floating-button"
      @click="doctorDialog = true"
    >
      <q-tooltip class="bg-primary text-white">
        Agendar Cita
      </q-tooltip>
    </q-btn>

    <!-- Modal de selección de usuario/doctor -->
    <q-dialog v-model="doctorDialog">
      <q-card class="responsive-modal">
        <q-card-section class="row items-center justify-between">
          <div class="text-subtitle1">
            Usuario {{ userEmail }}
          </div>
          <q-btn flat label="Cancelar" color="primary" @click="doctorDialog = false" />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="row q-col-gutter-md q-mt-md">
            <div
              v-for="(doctor, idx) in doctors"
              :key="idx"
              class="col-12 col-sm-6 flex flex-center"
            >
              <q-card flat bordered class="full-width">
                <q-img
                  src="https://cdn.quasar.dev/img/avatar.png"
                  alt="Doctor"
                  style="height:100px;object-fit:contain;"
                />
                <q-card-actions align="center">
                  <q-btn
                    :label="idx === 3 ? 'Abrir' : 'Ver'"
                    color="primary"
                    flat
                    class="full-width"
                    @click="openPatientModal"
                  />
                </q-card-actions>
              </q-card>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Modal de opciones del paciente (como la imagen) -->
    <q-dialog v-model="patientDialog">
      <q-card class="responsive-modal">
        <q-card-section class="row items-center justify-between">
          <div class="text-subtitle1">
            Paciente {{ userEmail }}
          </div>
          <q-btn flat label="Cancelar" color="primary" @click="patientDialog = false" />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="row q-col-gutter-md q-mt-md">
            <div
              v-for="(item, idx) in patientOptions"
              :key="idx"
              class="col-12 col-sm-6 flex flex-center"
            >
              <q-card flat bordered class="full-width">
                <div class="flex flex-center q-mt-md">
                  <q-icon :name="item.icon" size="48px" />
                </div>
                <div class="text-center q-mt-sm q-mb-xs">
                  <div>{{ item.label }}</div>
                </div>
                <q-card-actions align="center">
                  <q-btn
                    :label="idx === 3 ? 'Abrir' : 'Ver'"
                    color="primary"
                    flat
                    class="full-width"
                    @click="onPatientOption(item)"
                  />
                </q-card-actions>
              </q-card>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const doctorDialog = ref(false)
const patientDialog = ref(false)
const userEmail = 'Client@gmail.com'
const doctors = [{}, {}, {}, {}]

const patientOptions = [
  { label: 'Recetas', icon: 'mdi-file-document-outline' },
  { label: 'Tratamiento', icon: 'mdi-clipboard-text-outline' },
  { label: 'Imagenes', icon: 'mdi-image-outline' },
  { label: 'Historial citas', icon: 'mdi-file-clock-outline' }
]

function openPatientModal() {
  doctorDialog.value = false
  patientDialog.value = true
}

function onPatientOption(item) {
  patientDialog.value = false
  console.log('Opción seleccionada:', item)
}
</script>

<style scoped>
.responsive-modal {
  min-width: 320px;
  max-width: 400px;
  width: 95vw;
}
@media (max-width: 600px) {
  .responsive-modal {
    min-width: 0;
    max-width: 98vw;
    width: 98vw;
    padding: 0;
  }
  .q-card-section {
    padding-left: 8px !important;
    padding-right: 8px !important;
  }
}
</style>
