<template>
  <div class="transactions">
    <h2>Transactions</h2>
    <div class="head">
      <div class="row">
        <div class="col">id</div>
        <div class="col">date</div>
        <div class="col">amount</div>
        <div class="col">type</div>
      </div>
    </div>
    <hr />
    <div class="items">
      <div
        class="row"
        v-for="(transaction, index) in paginatedData"
        :key="index"
      >
        <div class="col">{{ transaction.id }}</div>
        <div class="col">{{ transaction.date }}</div>
        <div class="col">${{ transaction.amount }}</div>
        <div class="col" v-if="transaction.type === 'success'">
          <span style="color: green">{{ transaction.type }}</span>
        </div>
        <div class="col" v-if="transaction.type === 'error'">
          <span style="color: red">{{ transaction.type }}</span>
        </div>
        <div class="col" v-if="transaction.type === 'processing'">
          <span style="color: silver">{{ transaction.type }}</span>
        </div>
      </div>
    </div>

    <ul class="pagination" v-if="data.length > 5 || currentPage > 1">
      <li class="pagination-item" title="Первая страница">
        <button
          type="button"
          @click="onClickFirstPage"
          :disabled="isInFirstPage"
        >
          <i class="fas fa-chevron-left"></i>
          <i class="fas fa-chevron-left"></i>
        </button>
      </li>

      <li class="pagination-item" title="Предыдущая страница">
        <button
          type="button"
          @click="onClickPreviousPage"
          :disabled="isInFirstPage"
        >
          <i class="fas fa-chevron-left"></i>
        </button>
      </li>

      <li class="pagination-item" v-for="(page, index) in pages" :key="index">
        <button
          type="button"
          @click="onClickPage(page.number)"
          :disabled="page.isDisabled"
          :class="{ active: isPageActive(page.number) }"
        >
          {{ page.number }}
        </button>
      </li>

      <li class="pagination-item" title="Следующая страница">
        <button type="button" @click="onClickNextPage" :disabled="isInLastPage">
          <i class="fas fa-chevron-right"></i>
        </button>
      </li>
      <li class="pagination-item" title="Последняя страница">
        <button type="button" @click="onClickLastPage" :disabled="isInLastPage">
          <i class="fas fa-chevron-right"></i>
          <i class="fas fa-chevron-right"></i>
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Paginated",
  props: {
    data: {
      type: Array,
      required: true
    },
    maxVisibleButtons: {
      type: Number,
      required: false,
      default: 3
    },
    totalPages: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    },
    perPage: {
      type: Number,
      required: true
    },
    currentPage: {
      type: Number,
      required: true
    }
  },
  computed: {
    paginatedData() {
      let start = (this.currentPage - 1) * this.perPage,
        end = start + this.perPage;
      return this.data.slice(start, end);
    },
    startPage() {
      if (this.currentPage === 1) return 1;
      if (this.currentPage === this.totalPages)
        return (
          this.totalPages -
          this.maxVisibleButtons +
          (this.maxVisibleButtons - 1)
        );
      return this.currentPage - 1;
    },
    endPage() {
      return Math.min(
        this.startPage + this.maxVisibleButtons - 1,
        this.totalPages
      );
    },
    pages() {
      let range = [];
      for (let i = this.startPage; i <= this.endPage; i += 1) {
        range.push({
          number: i,
          isDisabled: i === this.currentPage
        });
      }
      return range;
    },
    isInFirstPage() {
      return this.currentPage === 1;
    },
    isInLastPage() {
      return this.currentPage === this.totalPages;
    }
  },
  methods: {
    onClickFirstPage() {
      this.$emit("pagechanged", 1);
    },
    onClickPreviousPage() {
      this.$emit("pagechanged", this.currentPage - 1);
    },
    onClickPage(page) {
      this.$emit("pagechanged", page);
    },
    onClickNextPage() {
      this.$emit("pagechanged", this.currentPage + 1);
    },
    onClickLastPage() {
      this.$emit("pagechanged", this.totalPages);
    },
    isPageActive(page) {
      return this.currentPage === page;
    },

    onPageChange(page) {
      this.currentPage = page;
    }
  }
};
</script>
<!-- END COMPONENT -->
