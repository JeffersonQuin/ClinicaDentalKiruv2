<template>
  <div class="search-section">
    <!-- Input con datalist -->
    <q-input
      :model-value="searchTerm"
      @update:model-value="actualizarBusqueda"
      class="search-input"
      outlined
      type="search"
      placeholder="Ingresa el CI del Paciente (ej: 12345678)"
      clearable
      dense
      list="pacientes-list"
      @vue:updated="validarYSeleccionar"
    >
      <template v-slot:prepend>
        <i class="fa-solid fa-search"></i>
      </template>
    </q-input>

    <!-- Datalist HTML con sugerencias -->
    <datalist id="pacientes-list">
      <option
        v-for="paciente in sugerenciasPacientes"
        :key="paciente.id"
        :value="paciente.ci"
        :label="`${paciente.ci} - ${paciente.nombre} ${paciente.apellidoPaterno}`"
      />
    </datalist>

    <!-- Mostrar paciente seleccionado -->
    <div v-if="pacienteSeleccionado" class="paciente-info q-mt-md">
      <q-card>
        <q-card-section>
          <div class="row items-center q-gutter-md">
            <div class="col">
              <p class="text-h6">{{ pacienteSeleccionado.nombre }} {{ pacienteSeleccionado.apellidoPaterno }}</p>
              <p class="text-subtitle2 text-grey-7">CI: {{ pacienteSeleccionado.ci }}</p>
            </div>
            <div class="col-auto">
              <q-btn
                flat
                round
                dense
                icon="fa-solid fa-times"
                @click="limpiarSeleccion"
                color="negative"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { usePacientesStore } from 'src/stores/pacientes'

// Definir el emit para el evento paciente-seleccionado
const emit = defineEmits(['paciente-seleccionado'])

const store = usePacientesStore()

// Computed properties del store
const searchTerm = computed(() => store.searchTerm)
const sugerenciasPacientes = computed(() => store.sugerenciasPacientes)
const pacienteSeleccionado = computed(() => store.pacienteSeleccionado)

// Watch para emitir evento cuando se selecciona un paciente
watch(pacienteSeleccionado, (nuevoPaciente) => {
  if (nuevoPaciente) {
    console.log('Paciente seleccionado en SearchPatien:', nuevoPaciente)
    emit('paciente-seleccionado', nuevoPaciente)
  }
})

// Métodos
const actualizarBusqueda = (valor) => {
  store.actualizarBusqueda(valor)
}

const validarYSeleccionar = () => {
  const ci = searchTerm.value.trim()
  if (ci) {
    store.seleccionarPacientePorCI(ci)
  }
}

const limpiarSeleccion = () => {
  store.limpiarSeleccion()
}
</script>