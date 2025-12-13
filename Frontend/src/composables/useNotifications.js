// src/composables/useNotifications.js

import { useQuasar } from 'quasar'

export function useNotifications() {
  const $q = useQuasar()

  const notifySuccess = (message, caption = '') => {
    $q.notify({
      type: 'positive',
      message,
      caption,
      icon: 'check_circle',
      position: 'top-right',
      timeout: 3000,
      progress: true,
      actions: [{ icon: 'close', color: 'white' }]
    })
  }

  const notifyError = (message, caption = '') => {
    $q.notify({
      type: 'negative',
      message,
      caption,
      icon: 'error',
      position: 'top-right',
      timeout: 4000,
      progress: true,
      actions: [{ icon: 'close', color: 'white' }]
    })
  }

  const notifyWarning = (message, caption = '') => {
    $q.notify({
      type: 'warning',
      message,
      caption,
      icon: 'warning',
      position: 'top-right',
      timeout: 3500,
      progress: true,
      actions: [{ icon: 'close', color: 'white' }]
    })
  }

  const notifyInfo = (message, caption = '') => {
    $q.notify({
      type: 'info',
      message,
      caption,
      icon: 'info',
      position: 'top-right',
      timeout: 3000,
      progress: true,
      actions: [{ icon: 'close', color: 'white' }]
    })
  }

  const showLoading = (message = 'Cargando...') => {
    $q.loading.show({
      message,
      spinnerSize: 80,
      spinnerColor: 'primary',
      messageColor: 'white',
      backgroundColor: 'dark'
    })
  }

  const hideLoading = () => {
    $q.loading.hide()
  }

  const confirmDialog = ({ title, message, onConfirm, onCancel }) => {
    $q.dialog({
      title,
      message,
      cancel: {
        label: 'Cancelar',
        color: 'grey',
        flat: true
      },
      ok: {
        label: 'Confirmar',
        color: 'primary',
        push: true
      },
      persistent: true
    }).onOk(() => {
      if (onConfirm) onConfirm()
    }).onCancel(() => {
      if (onCancel) onCancel()
    })
  }

  return {
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo,
    showLoading,
    hideLoading,
    confirmDialog
  }
}