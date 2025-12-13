<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <div
      v-for="field in fields"
      :key="field.name"
      class="q-mb-md"
    >
      <!-- Campo de texto -->
      <q-input
        v-if="isTextType(field.type)"
        v-model="formData[field.name]"
        :label="field.label"
        :type="getInputType(field.type)"
        :rules="getValidationRules(field)"
        outlined
        dense
      />

      <!-- Campo numérico -->
      <q-input
        v-else-if="field.type === 'number'"
        v-model.number="formData[field.name]"
        :label="field.label"
        type="number"
        :rules="getValidationRules(field)"
        outlined
        dense
      />

      <!-- Campo de selección -->
      <q-select
        v-else-if="field.type === 'select'"
        v-model="formData[field.name]"
        :label="field.label"
        :options="field.options"
        :rules="getValidationRules(field)"
        outlined
        dense
        emit-value
        map-options
      />

      <!-- Campo de fecha -->
      <q-input
        v-else-if="field.type === 'date'"
        v-model="formData[field.name]"
        :label="field.label"
        :rules="getValidationRules(field)"
        outlined
        dense
      >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date v-model="formData[field.name]">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>

      <!-- Campo de área de texto -->
      <q-input
        v-else-if="field.type === 'textarea'"
        v-model="formData[field.name]"
        :label="field.label"
        :rules="getValidationRules(field)"
        outlined
        type="textarea"
        rows="3"
      />

      <!-- Campo checkbox -->
      <q-checkbox
        v-else-if="field.type === 'checkbox'"
        v-model="formData[field.name]"
        :label="field.label"
      />
    </div>

    <!-- Botones -->
    <div class="row q-gutter-md justify-end">
      <q-btn
        label="Cancelar"
        color="grey-6"
        flat
        @click="$emit('cancel')"
      />
      <q-btn
        :label="submitLabel"
        color="primary"
        type="submit"
        :loading="loading"
      />
    </div>
  </q-form>
</template>

<script>
import { VALIDATION_TYPES } from '/src/pages/fieldConfig.js'

export default {
  name: 'GenericForm',
  props: {
    fields: Array,
    modelValue: Object,
    loading: Boolean,
    submitLabel: { type: String, default: 'Guardar' }
  },
  data() {
    return {
      formData: { ...this.modelValue }
    }
  },
  watch: {
    modelValue: {
      handler(newVal) {
        this.formData = { ...newVal }
      },
      deep: true
    },
    formData: {
      handler(newVal) {
        this.$emit('update:modelValue', newVal)
      },
      deep: true
    }
  },
  methods: {
    isTextType(type) {
      return ['text', 'email', 'password'].includes(type)
    },
    
    getInputType(type) {
      return type === 'password' ? 'password' : 'text'
    },

    getValidationRules(field) {
      const rules = []

      if (!field.validations) return rules

      field.validations.forEach(validation => {
        switch (validation.type) {
          case VALIDATION_TYPES.REQUIRED:
            rules.push(val => !!val || validation.message || 'Campo requerido')
            break
          
          case VALIDATION_TYPES.MIN_LENGTH:
            rules.push(val => !val || val.length >= validation.value || 
              validation.message || `Mínimo ${validation.value} caracteres`)
            break
          
          case VALIDATION_TYPES.MAX_LENGTH:
            rules.push(val => !val || val.length <= validation.value || 
              validation.message || `Máximo ${validation.value} caracteres`)
            break
          
          case VALIDATION_TYPES.EMAIL:
            rules.push(val => !val || /\S+@\S+\.\S+/.test(val) || 
              validation.message || 'Email inválido')
            break
          
          case VALIDATION_TYPES.MIN_VALUE:
            rules.push(val => val >= validation.value || 
              validation.message || `Valor mínimo ${validation.value}`)
            break
          
          case VALIDATION_TYPES.MAX_VALUE:
            rules.push(val => val <= validation.value || 
              validation.message || `Valor máximo ${validation.value}`)
            break
          
          case VALIDATION_TYPES.CUSTOM:
            if (validation.validator) {
              rules.push(validation.validator)
            }
            break
        }
      })

      return rules
    },

    onSubmit() {
      this.$emit('submit', this.formData)
    }
  }
}
</script>