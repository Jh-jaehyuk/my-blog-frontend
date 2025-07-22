<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col class="text-center">
        <h1 class="text-h3 font-weight-bold mb-4">Welcome to Jh's Tech Blog!</h1>
        <p class="text-h6 font-weight-light">
          This is a space where I share my knowledge and experiences in software development.
        </p>
        <v-btn color="primary" class="mt-6" to="/posts" large>
          Explore Posts
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
// No script logic needed for this simple static page
</script>

<style scoped>
.fill-height {
  min-height: 80vh;
}
</style>
