<template>
  <b-form inline>
    <label for="per-pager" class="mr-sm-2">Show:</label>
    <b-select name="perPage" id="per-pager" v-model="value" class="mb-2 mr-sm-2 mb-sm-0" @change="onChangePerPageHandler">
      <option value="10">10</option>
      <option value="25">25</option>
      <option value="50">50</option>
      <option value="100">100</option>
    </b-select>
    <label>entries</label>
  </b-form>
</template>

<script>
export const PER_PAGE_DEFAULT = 10;
export const PER_PAGE_OPTIONS = Object.freeze({
  PER_PAGE_10: 10,
  PER_PAGE_25: 25,
  PER_PAGE_50: 50,
  PER_PAGE_100: 100,
});

export default {
  name: 'TableFooter',
  props: {
    perPage: {
      type: Number,
      default: PER_PAGE_DEFAULT,
      validator: (v) => Object.values(PER_PAGE_OPTIONS).includes(v),
    },
    total: {
      type: Number,
      required: true,
    },
    onChangePerPage: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      currentPage: 1,
      value: this.perPage,
    };
  },
  methods: {
    onChangePerPageHandler(value) {
      this.onChangePerPage(parseInt(value, 10));
    },
  },
};
</script>

<style lang="scss" scoped>
  label {
    font-size: .875rem;
    font-weight: normal;
  }
</style>
