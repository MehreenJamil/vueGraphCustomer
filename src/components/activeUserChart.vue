<template>
  <div class="customers container">
    <br />
    <br />
    <h1 class="page-header">Active User Chart</h1>

    <br />
    <br />
    <br />
    <br />

    <div class="row">
      <div class="btn-group">
        <vue-dropdown :config="config" @setSelectedOption="updateChart($event)"></vue-dropdown>
      </div>
    </div>
    <br />
    <br />
    <div class="row">
      <div id="spinnerContainer" style="margin-left:50%;color:#947c36ab;" hidden="true">
        <b-spinner style="width: 3rem; height: 3rem;" label="Large Spinner"></b-spinner>
      </div>
      <div id="chartContainer" style="width:100%;height:100%;">
        <line-chart :data="chartdata" curve="true" xtitle="Month" ytitle="User(s)"></line-chart>
      </div>

      <!-- <line-chart :data="chartdata" xtitle="Time" ytitle="Active User" /> -->
    </div>
  </div>
</template>
<script>
import { inject, injectable } from "inversify-props";

const customersData = [];
const totalActiveUserArr = [];

export default {
  name: "activeUserChart",
  inject: ["customerServiceRepository", "IUserService", "TuserService"],

  data() {
    return {
      customersData: customersData,
      totalActiveUserArr: totalActiveUserArr,
      customizedChatrData: [],
      chartdata: [],
      config: {
        options: [
          {
            value: "2019"
          },
          {
            value: "2020"
          },
          {
            value: "2021"
          }
        ],
        prefix: "Year",
        backgroundColor: "orange",
        width: 180
      }
    };
  },
  mounted() {},

  methods: {
    updateChart(event) {
      //console.log(event.value);
      document.getElementById("chartContainer").hidden = true;
      document.getElementById("spinnerContainer").hidden = false;
      this.chartdata = [];
      var delayInMilliseconds = 500; //1 second

      setTimeout(() => {
        this.calculateChartData(event.value);
        document.getElementById("chartContainer").hidden = false;
        document.getElementById("spinnerContainer").hidden = true;
      }, delayInMilliseconds);
    },
    getRandomInt() {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5;
    },
    calculateChartData(queryyear = "2020") {
      var self = this;
      var tempChartData = [];
      var tempCustomerArr = self.customersData;
      var tempActiveUserArr = self.totalActiveUserArr;
      // debugger;

      //  self.totalActiveUserArr = response.body;

      //****************************Start Get All Customer Start******************************************************** */

      tempCustomerArr.forEach(function(element) {
        var chartDataElement = {};

        chartDataElement.name = element.name;
        chartDataElement.data = {};
        chartDataElement.color = element.customerColor;
        var cutomerActiveUser = [];

        for (var x = 1; x <= 12; x++) {
          cutomerActiveUser = tempActiveUserArr.filter(
            ex =>
              new Date(ex.userActiveDate).getMonth() + 1 == x &&
              new Date(ex.userActiveDate).getFullYear() == queryyear &&
              ex.customerId == element.id
          );
          var monthCount = 0;
          if (cutomerActiveUser.length > 0) {
            cutomerActiveUser.forEach(function(ecount) {
              monthCount += ecount.count;
            });
          }
          var mothstr = {};

          var dateKey = "'" + queryyear + "-" + self.pad(x, 2) + "'";
          chartDataElement.data[dateKey] = monthCount;
        }
        tempChartData.push(chartDataElement);
      });
      // console.log(tempChartData);
      self.chartdata = tempChartData;

      //****************************End Get All Customer Start******************************************************** */
      // var this = this;
    },
    pad(n, width, z) {
      z = z || "0";
      n = n + "";
      return n.length >= width
        ? n
        : new Array(width - n.length + 1).join(z) + n;
    }
    // colorGenerator: function() {
    //   return "#" + ((Math.random() * 0xffffff) << 0).toString(16);
    // }
  },
  async created() {
    console.log(this.TUser.getCustomerById());
    console.log(this.UService.getCustomerById());

    var self = this;

    this.customersData = await this.customerServiceRepository.fetchCustomerData(); //****************************Start Get All Customers Start******************************************************** */
    this.totalActiveUserArr = await this.customerServiceRepository.getActiveUser(); //***************************Get All Active User End********************************************************* */
    this.calculateChartData();
  }
};
</script>
<style scoped>
body {
  font-family: "Source Sans Pro", "Helvetica Neue", Arial, sans-serif;
}

h1 {
  font-size: 26px;
  font-weight: 600;
  color: #2c3e5099;
  text-rendering: optimizelegibility;
  -moz-osx-font-smoothing: grayscale;
  -moz-text-size-adjust: none;
}
</style>
