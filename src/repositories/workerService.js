import axios from "axios";

export default {
  customSort(value) {
    return value.sort((a, b) => {
      const sortBy = this.currentSort;

      if (this.currentSortOrder === "desc") {
        return a[sortBy].localeCompare(b[sortBy]);
      }

      return b[sortBy].localeCompare(a[sortBy]);
    });
  },
  getLogs() {
    var logarr = [];
    var Logs = [];
    let ss = 0;

    return axios
      .get(process.env.VUE_APP_BASE_URL + "api/workerServiceLog/")

      .then(function(response) {
        logarr = response.data;
        // console.log(
        //   "logarr :",
        //   Object.keys(JSON.parse(JSON.stringify(response.data))).length
        // );
        ss = Object.keys(Logs).length;

        logarr.forEach(function(l) {
          var guiLog = {
            id: l.id,
            start_time: l.start_time,
            end_time: l.end_time,
            exception: l.exception
          };
          var s = new Date(l.start_time);
          var e = new Date(l.end_time);
          var diffMs = e - s;
          //  console.log(diffMs);
          var diffDays = Math.floor(diffMs / 86400000); // days
          var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
          var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
          var diffStr =
            diffDays +
            " Days, " +
            diffHrs +
            " Hours, " +
            diffMins +
            " Minutes, " +
            diffMs +
            " MiliSeconds";
          guiLog.exe_diff = diffStr;

          Logs.push(guiLog);
        });
        return Logs;

        // console.log("Service Size  In : ", Object.keys(Logs).length);
      })
      .catch(e => {
        this.errors.push(e);
        return [];
      });
  }
};
