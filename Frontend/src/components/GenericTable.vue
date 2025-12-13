<template>
  <div>
    <!-- Toolbar superior -->
    <q-toolbar class="q-mb-md">
      <q-toolbar-title>{{ title }}</q-toolbar-title>
      <q-btn
        v-if="showAdd"
        color="primary"
        icon="add"
        label="Agregar"
        @click="$emit('add')"
      />
    </q-toolbar>

    <!-- Filtros -->
    <q-card v-if="showFilters" class="q-mb-md">
      <q-card-section>
        <div class="row q-gutter-md">
          <q-input
            v-model="searchText"
            outlined
            dense
            placeholder="Buscar..."
            style="min-width: 200px"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </q-card-section>
    </q-card>

    <!-- Tabla -->
    <q-table
      :rows="filteredRows"
      :columns="columns"
      :loading="loading"
      :pagination="pagination"
      @request="onRequest"
      row-key="id"
      flat
      bordered
      
    >
      <!-- Slot para columnas personalizadas -->
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            v-for="action in actions"
            :key="action.name"
            :icon="action.icon"
            :color="action.color"
            :label="action.label"
            size="sm"
            flat
            dense
            @click="$emit('action', { action: action.name, row: props.row })"
            class="q-mr-xs"
          />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script>
export default {
  name: 'GenericTable',
  props: {
    title: String,
    rows: Array,
    columns: Array,
    actions: {
      type: Array,
      default: () => [
        { name: 'view', icon: 'visibility', color: 'primary', label: 'Ver' },
        { name: 'edit', icon: 'edit', color: 'secondary', label: 'Editar' },
        { name: 'delete', icon: 'delete', color: 'negative', label: 'Eliminar' }
      ]
    },
    loading: Boolean,
    showAdd: { type: Boolean, default: true },
    showFilters: { type: Boolean, default: true }
  },
  data() {
    return {
      searchText: '',
      pagination: {
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 0
      }
    }
  },
  computed: {
    filteredRows() {
      if (!this.searchText) return this.rows
      return this.rows.filter(row => 
        Object.values(row).some(val => 
          String(val).toLowerCase().includes(this.searchText.toLowerCase())
        )
      )
    }
  },
  methods: {
    onRequest(props) {
      this.$emit('request', props)
    }
  }
}
</script>
