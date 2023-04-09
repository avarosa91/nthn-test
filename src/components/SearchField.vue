<template>
  <div class="header">
    <b-form-input v-model="text" placeholder="Search"></b-form-input>
    <b-button>Search</b-button>
  </div>
</template>

<script>
export default {
  name: 'Header',
  props: {
    msg: String,
  },
  data() {
    return {
      text: '',
    };
  },
};
</script>

<style scoped lang="scss">
.header {
  width: 100%;
  height: 150px;
}
</style>
