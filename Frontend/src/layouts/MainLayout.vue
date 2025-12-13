<template>
  <q-layout view="lHh Lpr lFf">
    <HeaderLayout />
    
    <q-page-container>
      <router-view />
    </q-page-container>
    
    <FooterLayout />
    
    <FloatingButton />
  </q-layout>
</template>

<script setup>
import HeaderLayout from './HeaderLayout.vue'
import FloatingButton from '../components/FloatingButton.vue'
import FooterLayout from './FooterLayout.vue'

</script>
