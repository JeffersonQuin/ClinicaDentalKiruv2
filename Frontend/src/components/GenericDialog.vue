<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card style="min-width: 400px">
      <q-card-section class="row items-center">
        <div class="text-h6">{{ title }}</div>
        <q-space />
        <q-btn
          v-if="showClose"
          icon="close"
          flat
          round
          dense
          @click="close"
        />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <slot>
          {{ message }}
        </slot>
      </q-card-section>

      <q-card-actions v-if="showActions" align="right">
        <q-btn
          v-for="action in actions"
          :key="action.name"
          :label="action.label"
          :color="action.color"
          :flat="action.flat"
          @click="handleAction(action)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'GenericDialog',
  props: {
    modelValue: Boolean,
    title: String,
    message: String,
    actions: {
      type: Array,
      default: () => [
        { name: 'cancel', label: 'Cancelar', color: 'grey', flat: true },
        { name: 'accept', label: 'Aceptar', color: 'primary' }
      ]
    },
    showActions: { type: Boolean, default: true },
    showClose: { type: Boolean, default: true }
  },
  computed: {
    showDialog: {
      get() { return this.modelValue },
      set(val) { this.$emit('update:modelValue', val) }
    }
  },
  methods: {
    handleAction(action) {
      this.$emit('action', action.name)
      if (action.close !== false) {
        this.close()
      }
    },
    close() {
      this.showDialog = false
    }
  }
}
</script>
