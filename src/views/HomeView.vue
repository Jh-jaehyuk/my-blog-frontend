<template>
  <post-list />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

// Components
import PostList from '../components/posts/PostList.vue';

export default defineComponent({
  name: 'HomeView',

  components: {
    PostList,
  },
});
</script>
