<template>
  <div class="pagination-table--container">
    <div class="d-flex align-content-stretch">
      <div class="flex-grow-1">
        <div class="d-flex align-content-stretch flex-nowrap">
          <div v-if="hasActionsSlot" class="mr-3 text-nowrap">
            <slot name="actions" />
          </div>
          <div v-if="!hideNavigation" class="flex-grow-1">
            <table-per-page-selector
              :per-page="perPage"
              :total="total"
              :on-change-per-page="onChangePerPageHandler"
            />
          </div>
        </div>
      </div>
      <div>
        <div class="d-flex justify-content-end">
          <div v-if="hasSecondActionsSlot" class="ml-3">
            <slot name="secondActions" />
          </div>
          <div v-if="searchEnabled" class="ml-3">
            <b-form inline @submit.prevent="refetch">
              <label class="mr-sm-2 search-label" for="inline-form-search"
                >Search:</label
              >
              <b-input
                id="inline-form-search"
                v-model="search"
                class="mb-2 mb-sm-0"
              ></b-input>
            </b-form>
          </div>
        </div>
      </div>
    </div>
    <div v-if="hasFilterSlot" class="table-filter">
      <slot name="filter" />
    </div>
    <b-table
      :id="id"
      ref="table"
      striped
      hover
      responsive
      :items="items"
      :fields="fields"
      :busy="isBusy"
      :small="small"
      class="mt-2 text-left pagination-table--table"
      :tbody-tr-class="tbodyTrClass"
      :empty-html="`asdasd`"
      show-empty
    >
      <template
        v-for="(field, index) in fields"
        #[headName(field.key,index)]="data"
      >
        <fragment :key="field.key">
          <b-form-checkbox
            v-if="bulk && index === 0"
            v-model="selectAll"
            @change="toggleAll"
          />
          <slot v-else :name="headName(field.key)" v-bind="data" />
        </fragment>
      </template>
      <template
        v-for="(field, index) in fields"
        #[cellName(field.key,index)]="data"
      >
        <fragment :key="field.key">
          <b-form-checkbox
            v-if="bulk && index === 0"
            v-model="selection"
            :name="`${field.key}[]`"
            :value="data.value"
          />
          <slot v-else :name="cellName(field.key)" v-bind="data" />
        </fragment>
      </template>
      <template #table-busy>
        <b-spinner variant="warning" label="Spinning" />
      </template>
      <template #empty>
        <div class="emptyWrapper">
          <p>Siamo spiacenti, non abbiamo trovato nulla</p>
        </div>
      </template>
      <template
        v-for="slot in Object.keys($scopedSlots)"
        :slot="slot"
        slot-scope="scope"
        ><slot :name="slot" v-bind="scope"
      /></template>
    </b-table>
    <table-footer
      v-if="!hideNavigation"
      :table-id="id"
      :per-page="perPage"
      :total="total"
      :on-change-page="onChangePageHandler"
    />
  </div>
</template>

<script>
import map from "lodash/map";
import { Fragment } from "vue-fragment";
import TableFooter, { PER_PAGE_DEFAULT } from "./TableFooter.vue";
import TablePerPageSelector from "./TablePerPageSelector.vue";

export default {
  name: "PaginationTable",
  components: {
    TablePerPageSelector,
    TableFooter,
    Fragment,
  },
  props: {
    bulk: {
      type: Boolean,
      default: false,
    },
    searchEnabled: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
      required: true,
    },
    items: {
      type: Array,
      default: () => [],
    },
    fields: {
      type: Array,
      default: () => [],
    },
    isBusy: {
      type: Boolean,
      default: false,
    },
    selected: {
      type: Array,
      default: () => [],
    },
    small: {
      type: Boolean,
      default: false,
    },
    total: {
      type: Number,
      required: true,
    },
    fetchList: {
      type: Function,
      required: true,
    },
    tbodyTrClass: {
      type: Function,
      required: false,
    },
    tablePerPage: {
      type: Number,
      required: false,
      default: PER_PAGE_DEFAULT,
    },
    searchDelay: {
      type: Number,
      required: false,
      default: 1000,
    },
    hideNavigation: {
      type: Boolean,
      default: false,
    },
    hideFilterAfterSearch: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      selection: [],
      selectAll: false,
      currentPage: 1,
      perPage: this.tablePerPage,
      search: null,
      searchTimerId: false,
    };
  },
  computed: {
    hasSecondActionsSlot() {
      return !!this.$slots.secondActions;
    },
    hasActionsSlot() {
      return !!this.$slots.actions;
    },
    hasFilterSlot() {
      return !!this.$slots.filter;
    },
  },
  watch: {
    perPage() {
      if (this.currentPage === 1) {
        this.refetch();
      } else {
        this.currentPage = 1;
      }
    },
    currentPage() {
      this.$emit("toDefineCurrentPage", this.currentPage);
      this.refetch();
    },
    search() {
      clearTimeout(this.searchTimerId);
      this.searchTimerId = setTimeout(() => this.refetch(), this.searchDelay);
    },
    selection() {
      this.$emit("changeSelection", this.selection);
    },
    selected() {
      if (this.selection.length !== this.selected.length) {
        this.selection = [];
        this.selectAll = false;
      }
    },
  },
  methods: {
    cellName(name, index) {
      if (this.bulk && index === 0) {
        return `cell(${name})`;
      }

      return !!this.$slots[`cell(${name})`] ||
        !!this.$scopedSlots[`cell(${name})`]
        ? `cell(${name})`
        : name;
    },
    headName(name, index) {
      if (this.bulk && index === 0) {
        return `head(${name})`;
      }

      return !!this.$slots[`head(${name})`] ||
        !!this.$scopedSlots[`head(${name})`]
        ? `head(${name})`
        : name;
    },
    onChangePerPageHandler(value) {
      this.perPage = parseInt(value, 10);
    },
    onChangePageHandler(value) {
      this.currentPage = value;
    },
    toggleAll(selectAll) {
      this.selection = selectAll ? map(this.items, this.fields[0].key) : [];
    },
    searchHandler() {
      if (this.hideFilterAfterSearch) {
        this.$root.$emit("bv::toggle::collapse", "collapse-advanced-filter");
      }
      this.refetch();
    },
    refetch() {
      clearTimeout(this.searchTimerId);
      const params = {
        limit: this.perPage,
        offset: this.perPage * (this.currentPage - 1),
      };
      if (this.searchEnabled) {
        params.search = this.search ? this.search : null;
      }

      this.fetchList(params);
      this.selection = [];
    },
    reset() {
      this.search = "";
      this.$emit("reset");
    },
  },
};
</script>

<style lang="scss" scoped>
.pagination-table {
  &--container {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  &--table {
    flex-grow: 1;
  }
}

::v-deep .table-striped thead tr th {
  border-bottom: 0.5px solid $gray-200;
  border-top: 0.5px solid $gray-200;
}

::v-deep .table-striped tbody tr {
  td {
    border-top: none;
  }

  &:first-child td {
    border-top: 0.5px solid $gray-200;
  }

  &.b-table-empty-row,
  &.b-table-busy-slot {
    background-color: $white;
  }
}

::v-deep .table th,
::v-deep .table td {
  vertical-align: middle;
  color: $gray-300;
}

::v-deep .table th {
  font-weight: bold;
}
.filter-label,
.search-label {
  font-size: 14px;
  font-weight: normal;
}
.btn {
  border-radius: 2px;
  &-default {
    background: $gray-100;
    border: 0.5px solid $gray-300;
    box-sizing: border-box;
    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
    color: $text-gray;
  }
  &.resetBtn,
  &.searchBtn {
    width: 95px;
  }
}
.filter-btn {
  background-color: $white;
  border: 1px solid $gray-200;
  box-shadow: $shadow;
  min-width: 2.8rem;

  &:active,
  &:hover,
  &:focus {
    border: 1px solid $gray-300 !important;
    background-color: rgba(0, 0, 0, 0.025) !important;
    color: $gray-300 !important;
  }
  &.collapsed {
    color: $gray-300;
    &:active,
    &:hover,
    &:focus {
      color: $gray-300 !important;
    }
  }
  &.not-collapsed {
    color: $green;
    &:active,
    &:hover,
    &:focus {
      color: $green !important;
    }
  }
}
.emptyWrapper {
  height: 33vh;
  display: flex;
  flex-direction: column;
}
</style>
