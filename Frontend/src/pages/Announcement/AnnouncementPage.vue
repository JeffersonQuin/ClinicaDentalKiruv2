<template>
  <div class="announcement-page-container">
    <!-- Header Section -->
    <div class="announcement-page-header">
      <div class="announcement-header-background">
        <div class="announcement-header-shape announcement-header-shape-1"></div>
        <div class="announcement-header-shape announcement-header-shape-2"></div>
      </div>
      <div class="announcement-header-content">
        <div class="announcement-title-section">
          <div class="announcement-icon-wrapper">
            <i class="fa-solid fa-bullhorn announcement-header-icon"></i>
          </div>
          <div>
            <h1 class="announcement-page-title">Gestión de Anuncios</h1>
            <p class="announcement-page-subtitle">Administra las promociones y eventos de tu clínica</p>
          </div>
        </div>
        <q-btn
          class="announcement-primary-btn"
          color="primary"
          icon="fa-solid fa-plus"
          label="Nuevo Anuncio"
          @click="anuncioStore.openNewDialog()"
          unelevated
          no-caps
          size="md"
        />
      </div>
    </div>

    <!-- Stats Section -->
    <div class="announcement-stats-section">
      <div class="announcement-stat-card">
        <div class="announcement-stat-icon-container active">
          <i class="fa-solid fa-circle-check"></i>
        </div>
        <div class="announcement-stat-content">
          <div class="announcement-stat-value">{{ anuncioStore.anunciosActivos.length }}</div>
          <div class="announcement-stat-label">Anuncios Activos</div>
        </div>
        <div class="announcement-stat-glow active"></div>
      </div>
      
      <div class="announcement-stat-card">
        <div class="announcement-stat-icon-container inactive">
          <i class="fa-solid fa-circle-xmark"></i>
        </div>
        <div class="announcement-stat-content">
          <div class="announcement-stat-value">{{ anuncioStore.anunciosInactivos.length }}</div>
          <div class="announcement-stat-label">Anuncios Inactivos</div>
        </div>
        <div class="announcement-stat-glow inactive"></div>
      </div>
      
      <div class="announcement-stat-card">
        <div class="announcement-stat-icon-container admin">
          <i class="fa-solid fa-tags"></i>
        </div>
        <div class="announcement-stat-content">
          <div class="announcement-stat-value">{{ anuncioStore.categoriasUnicas.length }}</div>
          <div class="announcement-stat-label">Categorías</div>
        </div>
        <div class="announcement-stat-glow admin"></div>
      </div>
      
      <div class="announcement-stat-card">
        <div class="announcement-stat-icon-container total">
          <i class="fa-solid fa-bullhorn"></i>
        </div>
        <div class="announcement-stat-content">
          <div class="announcement-stat-value">{{ anuncioStore.anuncios.length }}</div>
          <div class="announcement-stat-label">Total de Anuncios</div>
        </div>
        <div class="announcement-stat-glow total"></div>
      </div>
    </div>

    <!-- Search Section -->
    <div class="announcement-search-section">
      <div class="announcement-search-container">
        <q-input
          v-model="anuncioStore.search"
          class="announcement-search-input"
          outlined
          type="search"
          placeholder="Buscar por título, descripción o categoría..."
          @update:model-value="anuncioStore.setSearch"
          clearable
        >
          <template v-slot:prepend>
            <i class="fa-solid fa-search announcement-search-icon"></i>
          </template>
        </q-input>
      </div>
    </div>

    <!-- Table Section -->
    <div class="announcement-table-container">
      <q-table
        class="announcement-data-table"
        flat
        :rows="anuncioStore.filteredAnuncios"
        :columns="columns"
        row-key="id"
        :rows-per-page-options="[5, 10, 15, 20, 0]"
        :pagination="{ rowsPerPage: 10 }"
        separator="cell"
      >
        <template v-slot:body-cell-imagen="props">
          <q-td :props="props">
            <div class="announcement-image-container">
              <q-img
                v-if="props.row.imagen"
                :src="anuncioStore.getImagePath(props.row.imagen)"
                :alt="props.row.titulo"
                class="announcement-table-image"
                @error="anuncioStore.handleImageError"
              />
              <div v-else class="announcement-no-image-placeholder">
                <i class="fa-solid fa-image"></i>
                <span>Sin imagen</span>
              </div>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              flat
              dense
              round
              icon="fa-solid fa-eye"
              @click="anuncioStore.openDetailDialog(props.row)"
              color="grey-8"
            />
            <q-btn
              flat
              dense
              round
              icon="fa-solid fa-edit"
              @click="anuncioStore.openEditDialog(props.row)"
              color="primary"
            />
            <q-btn
              flat
              dense
              round
              icon="fa-solid fa-trash"
              @click="anuncioStore.confirmDeleteAnuncio(props.row)"
              color="negative"
            />
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- Dialogs -->
    <DetailAnuncioDialog
      v-model="anuncioStore.showDetailDialog"
      :anuncio-data="anuncioStore.selectedAnuncio"
      @edit-anuncio="anuncioStore.openEditDialog"
    />

    <EditAnuncioDialog
      v-model="anuncioStore.showEditDialog"
      :anuncio-data="anuncioStore.selectedAnuncio"
      @anuncio-updated="anuncioStore.actualizar"
    />

    <NewAnuncioDialog
      v-model="anuncioStore.showNewDialog"
    />

    <!-- Delete Dialog -->
    <q-dialog v-model="anuncioStore.showDeleteDialog" persistent>
      <q-card>
        <q-card-section>
          <h3>Confirmar Eliminación</h3>
          <p>¿Desea eliminar el anuncio <strong>{{ anuncioStore.selectedAnuncio?.titulo }}</strong>?</p>
        </q-card-section>
        <q-card-actions>
          <q-btn flat label="Cancelar" @click="anuncioStore.closeDeleteDialog" />
          <q-btn unelevated label="Eliminar" color="negative" :loading="deleting" @click="handleDeleteAnuncio" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAnuncioStore } from 'src/stores/anuncioStore'
import DetailAnuncioDialog from './DetailAnnouncementDialog.vue'
import EditAnuncioDialog from './EditAnnouncementDialog.vue'
import NewAnuncioDialog from './NewAnnouncementDialog.vue'

const anuncioStore = useAnuncioStore()
const deleting = ref(false)

const columns = [
  { name: 'imagen', label: 'Imagen', align: 'center', field: 'imagen', sortable: false, style: 'width: 120px' },
  { name: 'titulo', label: 'Título', align: 'left', field: 'titulo', sortable: true },
  { name: 'categoria', label: 'Categoría', align: 'center', field: 'categoria', sortable: true },
  { name: 'estado', label: 'Estado', align: 'center', field: 'estado', sortable: true },
  { name: 'actions', label: 'Acciones', align: 'center', field: 'actions', sortable: false }
]

const handleDeleteAnuncio = async () => {
  if (!anuncioStore.selectedAnuncio?.id) return
  deleting.value = true
  try {
    await anuncioStore.eliminar(anuncioStore.selectedAnuncio.id)
    anuncioStore.closeDeleteDialog()
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  anuncioStore.listar()
})
</script>
