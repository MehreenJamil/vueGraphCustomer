<template>
  <div class="container">
    <h1 class="page-header">Worker Service Log</h1>

    <br />

    <div fluid id="workerTable">
      <md-table
        v-model="currentLogsArr"
        md-sort-order="asc"
        md-card
        md-fixed-header
        table-hover
        class="my-table"
      >
        <md-table-row slot="md-table-row" slot-scope="{ item }" md-height="100%" class="md-custome">
          <md-table-cell md-label="ID" md-sort-by="id" md-numeric>{{ item.id }}</md-table-cell>
          <md-table-cell md-label="Start Date/Time" md-sort-by="start_time  ">{{ item.start_time }}</md-table-cell>
          <md-table-cell md-label="End Date/Time" md-sort-by="end_time">{{ item.end_time }}</md-table-cell>
          <md-table-cell md-label="Execution Time" md-sort-by="exe_diff">{{ item.exe_diff }}</md-table-cell>
          <md-table-cell md-label="Exception" md-sort-by="exception">{{ item.exception }}</md-table-cell>
        </md-table-row>
      </md-table>
    </div>
    <pagination :paginationInfo="paginationInfoArr" />
    <!-- <div class="row">
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
    </div>-->
  </div>
</template>

<script>
import Pagination from "./pagination.vue";
const Logs = [];
export default {
  name: "workerServiceLog",
  inject: ["workerServiceRepository"],
  components: {
    Pagination
  },
  data() {
    return {
      Logs: Logs,
      logsPerPage: 8,
      totalLogs: 0,
      pageNumbersArrSize: 0,
      currentLogsArr: [],
      prevSliceIndex: 0,
      currentSelectedPageNumber: 1,
      pageinationCounter: 5,
      headPointer: 0,
      paginationInfoArr: []
    };
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
  },
  async created() {
    // var self = this;

    this.Logs = await this.workerServiceRepository.getLogs();

    //console.log(this.Logs);
    //console.log(typeof this.Logs);

    //---------------------------- Set Pagination Params -------------------------------------
    this.totalLogs = Object.entries(this.Logs).length;

    if (this.totalLogs <= this.logsPerPage) {
      this.currentLogsArr = this.Logs;
    } else {
      this.pageNumbersArrSize = Math.floor(this.totalLogs / this.logsPerPage);
      if (this.totalLogs % this.logsPerPage != 0) {
        this.pageNumbersArrSize += 1;
      }

      this.currentLogsArr = this.Logs.slice(
        this.prevSliceIndex,
        this.logsPerPage
      );
      this.prevSliceIndex = this.logsPerPage;
    }
    this.paginationInfoArr.logsPerPage = this.logsPerPage;
    this.paginationInfoArr.totalLogs = this.totalLogs;
    this.paginationInfoArr.pageNumbersArrSize = this.pageNumbersArrSize;
    this.paginationInfoArr.currentLogsArr = this.currentLogsArr;
    this.paginationInfoArr.prevSliceIndex = this.prevSliceIndex;
    this.paginationInfoArr.currentSelectedPageNumber = this.currentSelectedPageNumber;
    this.paginationInfoArr.pageinationCounter = this.pageinationCounter;
    this.paginationInfoArr.headPointer = this.headPointer;

    // console.log(this.paginationInfoArr);

    //---------------------------- Set Pagination Params -------------------------------------

    var container = document.getElementById("workerTable");
    if (container.addEventListener) {
      container.addEventListener(
        "DOMSubtreeModified",
        this.OnSubtreeModified,
        false
      );
    }
  }
};
$(document).ready(function() {
  $("#mydatatable").DataTable();
  $(".dataTables_length").addClass("bs-select");
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.md-custome {
  max-height: 50px;
}
.md-select {
  min-width: 0;
  border-style: dotted;
}
.md-table-content {
  background-color: aqua;
}
</style>
