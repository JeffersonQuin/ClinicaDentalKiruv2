<template>
  <div class="purchase-page-container">
    <!-- Header Section -->
    <div class="purchase-page-header">
      <div class="purchase-header-background">
        <div class="purchase-header-shape purchase-header-shape-1"></div>
        <div class="purchase-header-shape purchase-header-shape-2"></div>
      </div>
      <div class="purchase-header-content">
        <div class="purchase-title-section">
          <div class="purchase-icon-wrapper">
            <i class="fa-solid fa-credit-card purchase-header-icon"></i>
          </div>
          <div>
            <h1 class="purchase-page-title">Gestión de Pagos</h1>
            <p class="purchase-page-subtitle">Administra los pagos y transacciones del sistema dental</p>
          </div>
        </div>
        
        <div class="purchase-header-actions">
          <q-btn
            class="purchase-primary-btn"
            icon="fa-solid fa-plus"
            label="Registrar Pago"
            @click="abrirDialogoPago"
            unelevated
            no-caps
            size="md"
          />
          
          <q-btn
            class="purchase-secondary-btn"
            icon="fa-solid fa-download"
            label="Exportar"
            @click="exportarDatos"
            outline
            no-caps
            size="md"
          />
        </div>
      </div>
    </div>

    <!-- Search & Filters Section -->
    <div class="purchase-search-section">
      <div class="purchase-search-container">
        <q-input
          v-model="filtros.busqueda"
          class="purchase-search-input"
          outlined
          type="search"
          placeholder="Buscar por paciente, concepto..."
          clearable
        >
          <template v-slot:prepend>
            <i class="fa-solid fa-search purchase-search-icon"></i>
          </template>
        </q-input>
        
        <div class="purchase-filter-group">
          <q-select
            v-model="filtros.estado"
            :options="opcionesEstado"
            label="Estado"
            outlined
            dense
            clearable
            emit-value
            map-options
            class="purchase-filter-select"
          />
          
          <q-select
            v-model="filtros.metodoPago"
            :options="opcionesMetodoPago"
            label="Método de Pago"
            outlined
            dense
            clearable
            emit-value
            map-options
            class="purchase-filter-select"
          />
          
          <q-input
            v-model="filtros.fechaInicio"
            type="date"
            label="Fecha Inicio"
            outlined
            dense
            class="purchase-filter-select"
          />
          
          <q-input
            v-model="filtros.fechaFin"
            type="date"
            label="Fecha Fin"
            outlined
            dense
            class="purchase-filter-select"
          />
        </div>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="purchase-stats-section">
      <div class="purchase-stat-card">
        <div class="purchase-stat-icon-container total">
          <i class="fa-solid fa-coins"></i>
        </div>
        <div class="purchase-stat-content">
          <div class="purchase-stat-value">Bs. {{ formatearMonto(resumenPagos.total) }}</div>
          <div class="purchase-stat-label">Total Recaudado</div>
        </div>
        <div class="purchase-stat-glow total"></div>
      </div>

      <div class="purchase-stat-card">
        <div class="purchase-stat-icon-container pending">
          <i class="fa-solid fa-clock"></i>
        </div>
        <div class="purchase-stat-content">
          <div class="purchase-stat-value">Bs. {{ formatearMonto(resumenPagos.pendiente) }}</div>
          <div class="purchase-stat-label">Pagos Pendientes</div>
        </div>
        <div class="purchase-stat-glow pending"></div>
      </div>

      <div class="purchase-stat-card">
        <div class="purchase-stat-icon-container month">
          <i class="fa-solid fa-calendar-alt"></i>
        </div>
        <div class="purchase-stat-content">
          <div class="purchase-stat-value">Bs. {{ formatearMonto(resumenPagos.mesActual) }}</div>
          <div class="purchase-stat-label">Este Mes</div>
        </div>
        <div class="purchase-stat-glow month"></div>
      </div>

      <div class="purchase-stat-card">
        <div class="purchase-stat-icon-container average">
          <i class="fa-solid fa-chart-line"></i>
        </div>
        <div class="purchase-stat-content">
          <div class="purchase-stat-value">Bs. {{ formatearMonto(resumenPagos.promedio) }}</div>
          <div class="purchase-stat-label">Promedio por Pago</div>
        </div>
        <div class="purchase-stat-glow average"></div>
      </div>
    </div>

    <!-- Table Section -->
    <div class="purchase-table-container">
      <div class="purchase-table-header">
        <div class="purchase-table-title-section">
          <h3 class="purchase-table-title">Lista de Pagos</h3>
          <div class="purchase-table-underline"></div>
        </div>
        <div class="purchase-table-actions">
          <div class="purchase-results-count">
            <span class="purchase-count-badge">
              <i class="fa-solid fa-receipt"></i>
              {{ pagosFiltrados.length }} pago{{ pagosFiltrados.length !== 1 ? 's' : '' }}
            </span>
          </div>
          <q-btn
            class="purchase-report-btn"
            flat
            icon="fa-solid fa-file-pdf"
            label="Reporte PDF"
            no-caps
            size="sm"
            @click="generarReportePDF"
          />
        </div>
      </div>

      <q-table
        class="purchase-data-table"
        flat
        :rows="pagosFiltrados"
        :columns="columnasPagos"
        row-key="id"
        :rows-per-page-options="[5, 10, 15, 20]"
        :pagination="{ rowsPerPage: 10 }"
        separator="cell"
        :loading="cargando"
      >
        <template v-slot:no-data>
          <div class="purchase-no-data-container">
            <div class="purchase-no-data-illustration">
              <i class="fa-solid fa-receipt purchase-no-data-icon"></i>
              <div class="purchase-no-data-circle purchase-no-data-circle-1"></div>
              <div class="purchase-no-data-circle purchase-no-data-circle-2"></div>
            </div>
            <p class="purchase-no-data-text">No se encontraron pagos registrados</p>
            <p class="purchase-no-data-subtext">Intenta ajustar los filtros de búsqueda o registra el primer pago</p>
            <q-btn
              class="purchase-primary-btn"
              label="Registrar Primer Pago"
              @click="abrirDialogoPago"
              unelevated
              no-caps
              style="margin-top: 16px;"
            />
          </div>
        </template>

        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <div class="purchase-status-badge" :class="getEstadoClass(props.value)">
              <i :class="getEstadoIcon(props.value)"></i>
              {{ formatearEstado(props.value) }}
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-monto="props">
          <q-td :props="props">
            <span class="purchase-amount-cell">Bs. {{ formatearMonto(props.value) }}</span>
          </q-td>
        </template>

        <template v-slot:body-cell-metodoPago="props">
          <q-td :props="props">
            <div class="purchase-method-badge">
              <i :class="getMetodoIcon(props.value)"></i>
              {{ formatearMetodoPago(props.value) }}
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-acciones="props">
          <q-td :props="props">
            <div class="purchase-action-buttons">
              <q-btn
                class="purchase-action-btn purchase-view-btn"
                flat
                dense
                round
                icon="fa-solid fa-eye"
                size="sm"
                @click="verDetallePago(props.row)"
                color="grey-8"
              >
                <q-tooltip>Ver detalles</q-tooltip>
              </q-btn>
              
              <q-btn
                class="purchase-action-btn purchase-edit-btn"
                flat
                dense
                round
                icon="fa-solid fa-edit"
                size="sm"
                @click="editarPago(props.row)"
                color="primary"
              >
                <q-tooltip>Editar</q-tooltip>
              </q-btn>
              
              <q-btn
                class="purchase-action-btn purchase-receipt-btn"
                flat
                dense
                round
                icon="fa-solid fa-receipt"
                size="sm"
                @click="generarRecibo(props.row)"
                color="secondary"
              >
                <q-tooltip>Generar recibo</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- Dialogs -->
    <!-- Dialog para Nuevo/Editar Pago -->
    <q-dialog v-model="dialogoPago" persistent>
      <q-card class="purchase-dialog">
        <q-card-section class="purchase-dialog-header">
          <div class="purchase-dialog-icon-container">
            <i class="fa-solid fa-credit-card purchase-dialog-icon"></i>
          </div>
          <h2 class="purchase-dialog-title">
            {{ editando ? 'Editar Pago' : 'Registrar Nuevo Pago' }}
          </h2>
        </q-card-section>

        <q-card-section class="purchase-dialog-body">
          <q-form @submit.prevent="guardarPago" class="purchase-form">
            <div class="purchase-form-grid">
              <q-select
                v-model="formPago.pacienteId"
                :options="opcionesPacientes"
                label="Paciente *"
                outlined
                emit-value
                map-options
                required
                class="purchase-form-field"
              />

              <q-input
                v-model="formPago.concepto"
                label="Concepto *"
                outlined
                required
                class="purchase-form-field"
              />

              <q-input
                v-model.number="formPago.monto"
                type="number"
                label="Monto (Bs.) *"
                outlined
                required
                min="0"
                step="0.01"
                class="purchase-form-field"
              />

              <q-select
                v-model="formPago.metodoPago"
                :options="opcionesMetodoPago"
                label="Método de Pago *"
                outlined
                emit-value
                map-options
                required
                class="purchase-form-field"
              />

              <q-input
                v-model="formPago.fecha"
                type="date"
                label="Fecha *"
                outlined
                required
                class="purchase-form-field"
              />

              <q-select
                v-model="formPago.estado"
                :options="opcionesEstado"
                label="Estado *"
                outlined
                emit-value
                map-options
                required
                class="purchase-form-field"
              />

              <q-input
                v-model="formPago.numeroTransaccion"
                label="Número de Transacción"
                outlined
                hint="Solo para pagos con tarjeta o transferencia"
                class="purchase-form-field"
              />

              <q-input
                v-model="formPago.observaciones"
                label="Observaciones"
                outlined
                type="textarea"
                rows="3"
                class="purchase-form-field purchase-form-textarea"
              />
            </div>
          </q-form>
        </q-card-section>

        <q-card-actions align="right" class="purchase-dialog-actions">
          <q-btn 
            flat 
            label="Cancelar" 
            @click="cerrarDialogoPago"
            class="purchase-dialog-btn purchase-dialog-cancel"
            no-caps
          />
          <q-btn 
            :label="editando ? 'Actualizar' : 'Guardar'" 
            @click="guardarPago"
            class="purchase-dialog-btn purchase-dialog-confirm"
            unelevated
            :loading="guardando"
            no-caps
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog para Detalle del Pago -->
    <q-dialog v-model="dialogoDetalle">
      <q-card class="purchase-detail-dialog">
        <q-card-section class="purchase-dialog-header">
          <div class="purchase-dialog-icon-container success">
            <i class="fa-solid fa-receipt purchase-dialog-icon"></i>
          </div>
          <h2 class="purchase-dialog-title">Detalle del Pago</h2>
          <q-btn
            flat
            round
            dense
            icon="fa-solid fa-times"
            @click="dialogoDetalle = false"
            class="purchase-close-btn"
          />
        </q-card-section>

        <q-card-section v-if="pagoSeleccionado" class="purchase-detail-body">
          <div class="purchase-detail-grid">
            <div class="purchase-detail-item">
              <span class="purchase-detail-label">ID:</span>
              <span class="purchase-detail-value">{{ pagoSeleccionado.id }}</span>
            </div>
            
            <div class="purchase-detail-item">
              <span class="purchase-detail-label">Paciente:</span>
              <span class="purchase-detail-value">{{ pagoSeleccionado.paciente }}</span>
            </div>
            
            <div class="purchase-detail-item">
              <span class="purchase-detail-label">Concepto:</span>
              <span class="purchase-detail-value">{{ pagoSeleccionado.concepto }}</span>
            </div>
            
            <div class="purchase-detail-item">
              <span class="purchase-detail-label">Monto:</span>
              <span class="purchase-detail-value purchase-amount-highlight">Bs. {{ formatearMonto(pagoSeleccionado.monto) }}</span>
            </div>
            
            <div class="purchase-detail-item">
              <span class="purchase-detail-label">Fecha:</span>
              <span class="purchase-detail-value">{{ formatearFecha(pagoSeleccionado.fecha) }}</span>
            </div>
            
            <div class="purchase-detail-item">
              <span class="purchase-detail-label">Método de Pago:</span>
              <span class="purchase-detail-value">
                <div class="purchase-method-badge">
                  <i :class="getMetodoIcon(pagoSeleccionado.metodoPago)"></i>
                  {{ formatearMetodoPago(pagoSeleccionado.metodoPago) }}
                </div>
              </span>
            </div>
            
            <div class="purchase-detail-item">
              <span class="purchase-detail-label">Estado:</span>
              <span class="purchase-detail-value">
                <div class="purchase-status-badge" :class="getEstadoClass(pagoSeleccionado.estado)">
                  <i :class="getEstadoIcon(pagoSeleccionado.estado)"></i>
                  {{ formatearEstado(pagoSeleccionado.estado) }}
                </div>
              </span>
            </div>
            
            <div class="purchase-detail-item" v-if="pagoSeleccionado.numeroTransaccion">
              <span class="purchase-detail-label">N° Transacción:</span>
              <span class="purchase-detail-value purchase-transaction-code">{{ pagoSeleccionado.numeroTransaccion }}</span>
            </div>
            
            <div class="purchase-detail-item purchase-detail-observations" v-if="pagoSeleccionado.observaciones">
              <span class="purchase-detail-label">Observaciones:</span>
              <span class="purchase-detail-value">{{ pagoSeleccionado.observaciones }}</span>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import pacientesData from '../../data/pacientes.json'

export default {
  name: 'PagosPage',
  setup() {
    const $q = useQuasar()
    
    // Estados reactivos
    const cargando = ref(false)
    const guardando = ref(false)
    const dialogoPago = ref(false)
    const dialogoDetalle = ref(false)
    const editando = ref(false)
    const pagoSeleccionado = ref(null)
    
    // Filtros
    const filtros = ref({
      busqueda: '',
      estado: null,
      metodoPago: null,
      fechaInicio: '',
      fechaFin: ''
    })
    
    // Datos de ejemplo basados en los pacientes reales
    const pagos = ref([
      {
        id: 1,
        paciente: `${pacientesData.pacientes[0]?.nombre} ${pacientesData.pacientes[0]?.apellidoPaterno}`,
        pacienteId: 1,
        concepto: 'Limpieza dental',
        monto: 150.00,
        fecha: '2025-11-10',
        metodoPago: 'efectivo',
        estado: 'completado',
        numeroTransaccion: null,
        observaciones: 'Pago completo'
      },
      {
        id: 2,
        paciente: `${pacientesData.pacientes[1]?.nombre} ${pacientesData.pacientes[1]?.apellidoPaterno}`,
        pacienteId: 2,
        concepto: 'Ortodoncia - Cuota 1',
        monto: 500.00,
        fecha: '2025-11-09',
        metodoPago: 'tarjeta',
        estado: 'completado',
        numeroTransaccion: 'TX123456789',
        observaciones: 'Primera cuota de tratamiento'
      },
      {
        id: 3,
        paciente: `${pacientesData.pacientes[2]?.nombre} ${pacientesData.pacientes[2]?.apellidoPaterno}`,
        pacienteId: 3,
        concepto: 'Extracción dental',
        monto: 200.00,
        fecha: '2025-11-08',
        metodoPago: 'transferencia',
        estado: 'pendiente',
        numeroTransaccion: 'TR987654321',
        observaciones: 'Pendiente de confirmación'
      }
    ])
    
    // Formulario de pago
    const formPagoInicial = {
      pacienteId: null,
      concepto: '',
      monto: 0,
      metodoPago: 'efectivo',
      fecha: new Date().toISOString().split('T')[0],
      estado: 'completado',
      numeroTransaccion: '',
      observaciones: ''
    }
    
    const formPago = ref({ ...formPagoInicial })
    
    // Opciones para los selects
    const opcionesEstado = [
      { label: 'Completado', value: 'completado' },
      { label: 'Pendiente', value: 'pendiente' },
      { label: 'Cancelado', value: 'cancelado' }
    ]
    
    const opcionesMetodoPago = [
      { label: 'Efectivo', value: 'efectivo' },
      { label: 'Tarjeta', value: 'tarjeta' },
      { label: 'Transferencia', value: 'transferencia' },
      { label: 'QR', value: 'qr' }
    ]
    
    const opcionesPacientes = computed(() => 
      pacientesData.pacientes.map(p => ({
        label: `${p.nombre} ${p.apellidoPaterno} ${p.apellidoMaterno}`,
        value: p.id
      }))
    )
    
    // Configuración de la tabla
    const paginacion = ref({
      page: 1,
      rowsPerPage: 10,
      rowsNumber: 0
    })
    
    const columnasPagos = [
      {
        name: 'id',
        required: true,
        label: 'ID',
        align: 'left',
        field: 'id',
        sortable: true,
        style: 'width: 80px'
      },
      {
        name: 'paciente',
        required: true,
        label: 'Paciente',
        align: 'left',
        field: 'paciente',
        sortable: true
      },
      {
        name: 'concepto',
        label: 'Concepto',
        field: 'concepto',
        sortable: true,
        align: 'left'
      },
      {
        name: 'monto',
        label: 'Monto',
        field: 'monto',
        sortable: true,
        align: 'right',
        style: 'width: 120px'
      },
      {
        name: 'fecha',
        label: 'Fecha',
        field: 'fecha',
        sortable: true,
        align: 'center',
        style: 'width: 120px'
      },
      {
        name: 'metodoPago',
        label: 'Método',
        field: 'metodoPago',
        sortable: true,
        align: 'center',
        style: 'width: 120px'
      },
      {
        name: 'estado',
        label: 'Estado',
        field: 'estado',
        sortable: true,
        align: 'center',
        style: 'width: 120px'
      },
      {
        name: 'acciones',
        label: 'Acciones',
        field: 'acciones',
        align: 'center',
        style: 'width: 150px'
      }
    ]
    
    // Computed properties
    const pagosFiltrados = computed(() => {
      let resultado = pagos.value
      
      if (filtros.value.busqueda) {
        const busqueda = filtros.value.busqueda.toLowerCase()
        resultado = resultado.filter(pago =>
          pago.paciente.toLowerCase().includes(busqueda) ||
          pago.concepto.toLowerCase().includes(busqueda)
        )
      }
      
      if (filtros.value.estado) {
        resultado = resultado.filter(pago => pago.estado === filtros.value.estado)
      }
      
      if (filtros.value.metodoPago) {
        resultado = resultado.filter(pago => pago.metodoPago === filtros.value.metodoPago)
      }
      
      if (filtros.value.fechaInicio) {
        resultado = resultado.filter(pago => pago.fecha >= filtros.value.fechaInicio)
      }
      
      if (filtros.value.fechaFin) {
        resultado = resultado.filter(pago => pago.fecha <= filtros.value.fechaFin)
      }
      
      return resultado
    })
    
    const resumenPagos = computed(() => {
      const pagosCompletados = pagos.value.filter(p => p.estado === 'completado')
      const pagosPendientes = pagos.value.filter(p => p.estado === 'pendiente')
      
      const total = pagosCompletados.reduce((sum, pago) => sum + pago.monto, 0)
      const pendiente = pagosPendientes.reduce((sum, pago) => sum + pago.monto, 0)
      
      const fechaActual = new Date()
      const mesActual = fechaActual.getMonth() + 1
      const añoActual = fechaActual.getFullYear()
      
      const pagosMesActual = pagosCompletados.filter(pago => {
        const fechaPago = new Date(pago.fecha)
        return fechaPago.getMonth() + 1 === mesActual && fechaPago.getFullYear() === añoActual
      })
      
      const mesActualTotal = pagosMesActual.reduce((sum, pago) => sum + pago.monto, 0)
      const promedio = pagosCompletados.length > 0 ? total / pagosCompletados.length : 0
      
      return {
        total,
        pendiente,
        mesActual: mesActualTotal,
        promedio
      }
    })
    
    // Métodos de formateo
    const formatearMonto = (monto) => {
      return new Intl.NumberFormat('es-BO', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(monto)
    }
    
    const formatearFecha = (fecha) => {
      return new Date(fecha).toLocaleDateString('es-BO')
    }
    
    const formatearEstado = (estado) => {
      const estados = {
        'completado': 'Completado',
        'pendiente': 'Pendiente',
        'cancelado': 'Cancelado'
      }
      return estados[estado] || estado
    }
    
    const formatearMetodoPago = (metodo) => {
      const metodos = {
        'efectivo': 'Efectivo',
        'tarjeta': 'Tarjeta',
        'transferencia': 'Transferencia',
        'qr': 'QR'
      }
      return metodos[metodo] || metodo
    }
    
    const getEstadoClass = (estado) => {
      return `purchase-status-${estado}`
    }
    
    const getEstadoIcon = (estado) => {
      const iconos = {
        'completado': 'fa-solid fa-check-circle',
        'pendiente': 'fa-solid fa-clock',
        'cancelado': 'fa-solid fa-times-circle'
      }
      return iconos[estado] || 'fa-solid fa-question-circle'
    }
    
    const getMetodoIcon = (metodo) => {
      const iconos = {
        'efectivo': 'fa-solid fa-money-bill',
        'tarjeta': 'fa-solid fa-credit-card',
        'transferencia': 'fa-solid fa-exchange-alt',
        'qr': 'fa-solid fa-qrcode'
      }
      return iconos[metodo] || 'fa-solid fa-money-bill'
    }
    
    // Métodos de acción
    const abrirDialogoPago = () => {
      editando.value = false
      formPago.value = { ...formPagoInicial }
      dialogoPago.value = true
    }
    
    const editarPago = (pago) => {
      editando.value = true
      formPago.value = { ...pago }
      dialogoPago.value = true
    }
    
    const cerrarDialogoPago = () => {
      dialogoPago.value = false
      formPago.value = { ...formPagoInicial }
      editando.value = false
    }
    
    const guardarPago = async () => {
      guardando.value = true
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        if (editando.value) {
          const index = pagos.value.findIndex(p => p.id === formPago.value.id)
          if (index > -1) {
            pagos.value[index] = { ...formPago.value }
          }
          $q.notify({
            type: 'positive',
            message: 'Pago actualizado exitosamente',
            position: 'top-right'
          })
        } else {
          const nuevoPago = {
            ...formPago.value,
            id: pagos.value.length + 1,
            paciente: opcionesPacientes.value.find(p => p.value === formPago.value.pacienteId)?.label || 'Desconocido'
          }
          pagos.value.push(nuevoPago)
          $q.notify({
            type: 'positive',
            message: 'Pago registrado exitosamente',
            position: 'top-right'
          })
        }
        
        cerrarDialogoPago()
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: 'Error al guardar el pago' + error.message,
          position: 'top-right'
        })
      } finally {
        guardando.value = false
      }
    }
    
    const verDetallePago = (pago) => {
      pagoSeleccionado.value = pago
      dialogoDetalle.value = true
    }
    
    const generarRecibo = (pago) => {
      $q.notify({
        type: 'info',
        message: 'Generando recibo...' + pago.id,
        position: 'top-right'
      })
      
      // Aquí implementarías la lógica para generar el recibo
      setTimeout(() => {
        $q.notify({
          type: 'positive',
          message: 'Recibo generado exitosamente',
          position: 'top-right'
        })
      }, 1500)
    }
    
    const exportarDatos = () => {
      $q.notify({
        type: 'info',
        message: 'Exportando datos...',
        position: 'top-right'
      })
      
      // Aquí implementarías la lógica para exportar los datos
      setTimeout(() => {
        $q.notify({
          type: 'positive',
          message: 'Datos exportados exitosamente',
          position: 'top-right'
        })
      }, 2000)
    }
    
    const generarReportePDF = async () => {
      try {
        $q.loading.show({
          message: 'Generando reporte PDF...'
        })

        // Simular generación de PDF
        await new Promise(resolve => setTimeout(resolve, 3000))

        $q.notify({
          type: 'positive',
          message: 'Reporte PDF generado exitosamente',
          position: 'top-right'
        })
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: 'Error al generar el reporte PDF' + error.message,
          position: 'top-right'
        })
      } finally {
        $q.loading.hide()
      }
    }
    
    onMounted(() => {
      paginacion.value.rowsNumber = pagos.value.length
    })
    
    return {
      // Estados
      cargando,
      guardando,
      dialogoPago,
      dialogoDetalle,
      editando,
      pagoSeleccionado,
      filtros,
      formPago,
      paginacion,
      
      // Datos
      pagos,
      columnasPagos,
      opcionesEstado,
      opcionesMetodoPago,
      opcionesPacientes,
      
      // Computed
      pagosFiltrados,
      resumenPagos,
      
      // Métodos
      formatearMonto,
      formatearFecha,
      formatearEstado,
      formatearMetodoPago,
      getEstadoClass,
      getEstadoIcon,
      getMetodoIcon,
      abrirDialogoPago,
      editarPago,
      cerrarDialogoPago,
      guardarPago,
      verDetallePago,
      generarRecibo,
      exportarDatos,
      generarReportePDF
    }
  }
}
</script>

