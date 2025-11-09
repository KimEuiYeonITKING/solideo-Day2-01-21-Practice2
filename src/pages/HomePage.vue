<template>
  <div class="home-page">
    <SearchForm />
  </div>
</template>

<script setup lang="ts">
import SearchForm from '../components/SearchForm.vue';
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 1rem;
}
</style>
