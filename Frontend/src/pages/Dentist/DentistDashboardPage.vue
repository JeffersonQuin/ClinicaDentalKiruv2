// pages/Dentist/DentistDashboardPage.vue
<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h1 class="q-ma-none text-h4">
          <q-icon name="person_health" class="text-primary" />
          Dentist Dashboard
        </h1>
        <p class="text-subtitle2 text-grey-7 q-mt-sm">
          Manage your patients and appointments
        </p>
      </div>
      <div class="col-auto">
        <q-chip
          color="primary"
          text-color="white"
          icon="verified"
        >
          <div v-text="authStore.userName"></div>
        </q-chip>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stat-card">
          <q-card-section>
            <div class="text-h6">24</div>
            <div class="text-subtitle2 text-grey-7">Today's Appointments</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stat-card">
          <q-card-section>
            <div class="text-h6">145</div>
            <div class="text-subtitle2 text-grey-7">Active Patients</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stat-card">
          <q-card-section>
            <div class="text-h6">8</div>
            <div class="text-subtitle2 text-grey-7">Pending Quotes</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stat-card">
          <q-card-section>
            <div class="text-h6">3</div>
            <div class="text-subtitle2 text-grey-7">Specialist Referrals</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Main Actions -->
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section class="bg-primary text-white">
            <div class="text-h6">Patient Care</div>
          </q-card-section>
          <q-card-section>
            <q-btn
              flat
              color="primary"
              label="View Patients"
              icon="group"
              to="/patients"
              class="full-width q-mb-md"
            />
            <q-btn
              flat
              color="primary"
              label="My Calendar"
              icon="calendar_month"
              to="/Calendar-Month"
              class="full-width q-mb-md"
            />
            <q-btn
              flat
              color="primary"
              label="Odontogram"
              icon="mms"
              to="/Odontogram"
              class="full-width"
            />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card>
          <q-card-section class="bg-secondary text-white">
            <div class="text-h6">Administration</div>
          </q-card-section>
          <q-card-section>
            <q-btn
              flat
              color="secondary"
              label="Manage Reserves"
              icon="event_available"
              to="/reserves"
              class="full-width q-mb-md"
            />
            <q-btn
              flat
              color="secondary"
              label="Create Quote"
              icon="description"
              to="/quotes"
              class="full-width q-mb-md"
            />
            <q-btn
              flat
              color="secondary"
              label="View History"
              icon="history"
              to="/HistoryQuotes"
              class="full-width"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useAuthStore } from 'stores/authStore'

const authStore = useAuthStore()
</script>

<!-- Los estilos están en app.scss global -->