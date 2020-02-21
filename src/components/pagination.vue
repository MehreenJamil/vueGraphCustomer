<template>
  <div class="row">
    <md-button
      class="md-primary md-mini"
      style="min-width:0px;"
      v-on:click="updateTablePaginatedPageNumber('prev')"
      v-if="headPointer!=0"
      id="prevPage"
    >Prev</md-button>
    <md-button
      class="md-primary md-mini md-select"
      v-for="n in pageinationCounter"
      :key="n"
      @click="updateTablePaginatedData(n+headPointer)"
      :id="n+headPointer"
    >{{n+headPointer}}</md-button>
    <md-button
      class="md-primary md-mini"
      style="min-width:0px;"
      v-on:click="updateTablePaginatedPageNumber('next')"
      v-if="headPointer+pageinationCounter<pageNumbersArrSize"
      id="nextPage"
    >Next</md-button>
  </div>
</template>
<script>
const Logs = [];
export default {
  name: "Pagination",
  props: {
    paginationInfo: Array,
    logsPerPage: 0,
    totalLogs: 0,
    pageNumbersArrSize: 0,
    currentLogsArr: [],
    prevSliceIndex: 0,
    currentSelectedPageNumber: 0,
    pageinationCounter: 0,
    headPointer: 0
  },
  watch: {
    paginationInfo: function() {
      console.log("34534535");
    }
  },
  data() {
    return {};
  },
  created: function() {
    // console.log("Props :: ", this.paginationInfo.logsPerPage);
    // console.log("Props :: ", this.paginationInfo["logsPerPage"]);
    // this.logsPerPage = this.paginationInfo.logsPerPage;
    // this.totalLogs = this.paginationInfo.totalLogs;
    // this.pageNumbersArrSize = this.paginationInfo.pageNumbersArrSize;
    // this.currentLogsArr = this.paginationInfo.currentLogsArr;
    // this.prevSliceIndex = this.paginationInfo.prevSliceIndex;
    // this.currentSelectedPageNumber = this.paginationInfo.currentSelectedPageNumber;
    // this.pageinationCounter = this.paginationInfo.pageinationCounter;
    // this.headPointer = this.paginationInfo.headPointer;
    console.log(this);
  },

  methods: {
    OnSubtreeModified() {
      var btnList = document.getElementsByClassName("md-select");

      for (var i = 0; i < btnList.length; i++) {
        btnList[i].style.removeProperty("border");
      }

      document.getElementById(this.currentSelectedPageNumber).style.border =
        "thick dotted #0000FF";
    },
    updateTablePaginatedPageNumber(action) {
      if (action == "prev") {
        this.headPointer -= 1;
        this.currentSelectedPageNumber -= 1;
        this.currentSelectedPageNumber =
          this.currentSelectedPageNumber > 0
            ? this.currentSelectedPageNumber
            : 1;
        if (this.headPointer < 0) {
          this.headPointer = 0;
        }
      } else if (action == "next") {
        this.headPointer += 1;
        this.currentSelectedPageNumber += 1;
        this.currentSelectedPageNumber =
          this.currentSelectedPageNumber >= this.pageNumbersArrSize
            ? this.pageNumbersArrSize
            : this.currentSelectedPageNumber;
        if (this.headPointer > this.pageNumbersArrSize) {
          this.headPointer = this.pageNumbersArrSize;
        }
      }

      this.updateTablePaginatedData(this.currentSelectedPageNumber);
    },
    updateTablePaginatedData(pageNumber) {
      var x, y;

      x = (pageNumber - 1) * this.logsPerPage;
      y = pageNumber * this.logsPerPage;
      this.currentLogsArr = this.Logs.slice(x, y);
      this.currentSelectedPageNumber = pageNumber;
    },

    customSort(value) {
      return value.sort((a, b) => {
        const sortBy = this.currentSort;

        if (this.currentSortOrder === "desc") {
          return a[sortBy].localeCompare(b[sortBy]);
        }

        return b[sortBy].localeCompare(a[sortBy]);
      });
    }
  }
};
</script>

