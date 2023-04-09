<template>
  <div class="row">
    <div class="col-6">
      <div class="per-pager--message">
        Visualizzazione di
        <fragment v-if="perPage <= total">{{ perPage }}</fragment
        ><fragment v-else>{{ total }}</fragment> voci su {{ total }}
      </div>
    </div>
    <div class="col-6">
      <b-pagination
        v-model="currentPage"
        pills
        :total-rows="total"
        :per-page="perPage"
        :aria-controls="tableId"
        align="right"
        last-number
        @change="onChangePageHandler"
      ></b-pagination>
    </div>
  </div>
</template>

<script>
import { Fragment } from "vue-fragment";

export const PER_PAGE_DEFAULT = 10;

export default {
  name: "TableFooter",
  components: {
    Fragment,
  },
  props: {
    tableId: {
      type: String,
      required: true,
    },
    perPage: {
      type: Number,
      default: PER_PAGE_DEFAULT,
      validator: (v) => [10, 25, 50, 100].includes(v),
    },
    total: {
      type: Number,
      required: true,
    },
    onChangePage: {
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
    onChangePageHandler(value) {
      this.onChangePage(value);
    },
  },
};
</script>

<style lang="scss" scoped>
.per-pager--message {
  font-size: 14px;
  font-weight: normal;
  margin-top: 8px;
}
::v-deep .pagination {
  .active {
    .page-link {
      background-color: $green;
      border-color: $green;
      color: $white;
    }
  }
  .page-link {
    color: $green;
  }
}
</style>
