<template>
  <q-dialog v-model="dialogOpen" persistent>
    <q-card class="q-pa-none" style="width: 100%; max-width: 520px">

      <!-- HEADER -->
      <q-toolbar class="bg-primary text-white">
        <q-icon name="payments" class="q-mr-sm" />
        <q-toolbar-title>Pagar reserva</q-toolbar-title>
        <q-btn
          flat
          round
          dense
          icon="close"
          v-close-popup
          @click="cancelar"
          :disable="procesando"
        />
      </q-toolbar>

      <!-- CONTENIDO -->
      <q-card-section class="q-gutter-md">

        <!-- TOTAL -->
        <q-card flat bordered class="bg-grey-1">
          <q-card-section class="text-center">
            <div class="text-caption text-grey-7">Monto total</div>
            <div class="text-h5 text-weight-bold text-primary">
              Bs. 10.00
            </div>
          </q-card-section>
        </q-card>

        <!-- INFO STRIPE -->
        <q-banner dense rounded class="bg-info text-white">
          <template #avatar>
            <q-icon name="info" />
          </template>
          Tarjeta de prueba:
          <span class="text-weight-bold">
            4242 4242 4242 4242
          </span>
        </q-banner>

        <!-- MÉTODO DE PAGO -->
        <div>
          <div class="text-subtitle2 q-mb-xs text-grey-8">
            Datos de la tarjeta
          </div>

          <q-card flat bordered class="q-pa-sm">
            <div
              ref="cardElement"
              class="q-pa-sm"
            ></div>
          </q-card>
        </div>

        <!-- ERROR -->
        <q-banner
          v-if="error"
          dense
          rounded
          class="bg-negative text-white"
        >
          <template #avatar>
            <q-icon name="error" />
          </template>
          {{ error }}
        </q-banner>

      </q-card-section>

      <q-separator />

      <!-- ACCIONES -->
      <q-card-actions align="right" class="q-pa-md">
        <q-btn
          flat
          label="Cancelar"
          color="grey-7"
          @click="cancelar"
          :disable="procesando"
        />
        <q-btn
          unelevated
          color="primary"
          icon="lock"
          label="Pagar Bs. 10"
          @click="procesarPago"
          :loading="procesando"
        />
      </q-card-actions>

    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { loadStripe } from '@stripe/stripe-js'
import { paymentService } from 'src/services/paymentService'
import { useQuasar } from 'quasar'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  datosReserva: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'pago-exitoso', 'pago-cancelado'])

const $q = useQuasar()
const cardElement = ref(null)
const procesando = ref(false)
const error = ref('')

const dialogOpen = ref(props.modelValue)

let stripe = null
let elements = null
let card = null
let clientSecret = null
let paymentIntentId = null

watch(() => props.modelValue, async (newVal) => {
  dialogOpen.value = newVal
  if (newVal) {
    await nextTick()
    inicializarStripe()
  } else {
    limpiarStripe()
  }
})

watch(dialogOpen, (newVal) => {
  emit('update:modelValue', newVal)
})

const inicializarStripe = async () => {
  try {
    error.value = ''
    
    // Cargar Stripe
    const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
    if (!stripeKey) {
      throw new Error('Clave de Stripe no configurada')
    }

    stripe = await loadStripe(stripeKey)
    
    // Crear Payment Intent
    const response = await paymentService.createPaymentIntent(10)
    clientSecret = response.data.data.client_secret
    paymentIntentId = response.data.data.payment_intent_id

    // Crear Elements
    elements = stripe.elements()
    card = elements.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#32325d',
          fontFamily: '"Roboto", sans-serif',
          '::placeholder': {
            color: '#aab7c4'
          }
        },
        invalid: {
          color: '#fa755a',
          iconColor: '#fa755a'
        }
      }
    })

    // Montar el elemento de tarjeta
    if (cardElement.value) {
      card.mount(cardElement.value)
    }
  } catch (err) {
    console.error('Error inicializando Stripe:', err)
    error.value = err.response?.data?.message || 'Error al inicializar el sistema de pagos'
  }
}

const procesarPago = async () => {
  if (!stripe || !card) {
    error.value = 'Sistema de pagos no inicializado'
    return
  }
  
  procesando.value = true
  error.value = ''

  try {
    // Confirmar pago con Stripe
    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      { 
        payment_method: { 
          card,
          billing_details: {
            name: 'Cliente'
          }
        } 
      }
    )

    if (stripeError) {
      error.value = stripeError.message
      procesando.value = false
      return
    }

    if (paymentIntent.status !== 'succeeded') {
      error.value = 'El pago no se completó correctamente'
      procesando.value = false
      return
    }

    // Confirmar en backend y crear reserva
    const response = await paymentService.confirmarPago(
      paymentIntentId,
      props.datosReserva
    )

    if (response.data.success) {
      $q.notify({
        type: 'positive',
        message: '¡Pago exitoso! Reserva creada',
        icon: 'check_circle',
        timeout: 3000
      })
      emit('pago-exitoso', response.data.data)
      limpiarStripe()
      dialogOpen.value = false
    } else {
      error.value = response.data.message || 'Error al confirmar el pago'
    }
  } catch (err) {
    console.error('Error procesando pago:', err)
    error.value = err.response?.data?.message || 'Error al procesar el pago'
  } finally {
    procesando.value = false
  }
}

const cancelar = () => {
  if (procesando.value) return
  
  emit('pago-cancelado')
  limpiarStripe()
  dialogOpen.value = false
}

const limpiarStripe = () => {
  if (card) {
    card.unmount()
    card = null
  }
  elements = null
  stripe = null
  clientSecret = null
  paymentIntentId = null
  error.value = ''
}
</script>