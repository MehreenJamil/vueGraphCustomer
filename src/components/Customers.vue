<template>
  <div class="customers container">
    <Alert v-if="alert" v-bind:message="alert" />
    <h1 class="page-header">Manage Customer</h1>

    <br />
    <br />
    <div class="row">
      <!-- <router-link to="/activeUserChart" class="col-3">
      <div>
        <md-card class="md-primary" md-theme="green-card">
          <md-card-header>
            <md-card-header-text>
              <div class="md-title">
                <strong>Active Users(Year)</strong>
              </div>
              <div class="md-subhead">{{ totalActiveUserCount }}</div> 
            </md-card-header-text>
          </md-card-header>
        </md-card>
      </div>
      </router-link>-->
      <div class="col-2">
        <input
          class="form-control"
          placeholder="Search Customer"
          v-model="filterInput"
          style="width:300px;"
        />
      </div>
    </div>

    <br />

    <section v-if="activeUserChartdataCurrent.length>0">
      <div class="row" id="spinnerContainer" style="margin-left:50%;color:#947c36ab;" hidden="true">
        <b-spinner style="width: 3rem; height: 3rem;" label="Large Spinner"></b-spinner>
      </div>
      <div class="row" id="chartContainer">
        <line-chart
          :data="activeUserChartdataCurrent"
          :messages="{ empty: 'No data' }"
          curve="true"
          xtitle="Day"
          ytitle="User(s)"
          title="Active User (Month)"
        ></line-chart>
        <br />
        <br />
        <br />
        <div class="form-control border-0">
          <input
            type="button"
            class="btn btn-info float-right"
            value="Next"
            @click="changeChartData($event)"
            id="nextChartData"
            hidden="true"
          />
          <input
            type="button"
            class="btn btn-info float-left"
            value="Prev"
            @click="changeChartData($event)"
            id="prevChartData"
            :hidden="!activeUserChartdataCurrent.length > 0"
            style="margin-left:45px;"
          />
        </div>
        <br />
        <br />
        <br />
        <br />
      </div>
      <!-- <div class="row">
        <bar-chart :data="inspectionChartdata" :stacked="true" title="Import Schedule Today"></bar-chart>
      </div>
      <br />
      <br />
      <br />
      <br />-->

      <div class="row">
        <bar-chart
          :data="activeUserChartData"
          title="Customer(s) Info (Today)"
          xAxis="{allowDecimals: false }"
          :min="0"
          :max="35"
        ></bar-chart>
      </div>
      <br />
      <br />
      <br />
      <br />
    </section>
    <section>
      <div class="row" style="a:hover:text-decoration: none;">
        <div
          v-for="customer in filterBy(customizedCustomerInfoArr, filterInput)"
          :key="customer.Id"
          class="mb-3 col-md-6 col-xl-3"
          style="margin-left:15px;"
        >
          <div
            class="classic-admin-card primary-color card"
            :id="'{{customer.Id}}'"
            :style="{
                backgroundColor: isEmpty(customer.Customercolor)
                  ? colorGenerator()
                  : customer.Customercolor,
                width: '275px',
                height:'475px',
                position:'relative'
               
              }"
          >
            <router-link class="btn btn-default" :to="{ path: '/detail/' + customer.Id }">
              <div style="heigh:50% ; ttext-align:center;">
                <img
                  :src="customer.image"
                  alt="Card image cap"
                  style="margin-top:10px; max-width:255px; max-height:128px;"
                />
              </div>
            </router-link>

            <div class="card-body" style="position:absolute;bottom:-17px;text-align:center;">
              <!-- <h4>
                  <strong>{{ customer.Name }}</strong>
              </h4>-->

              <div
                :id="'tooltipInfoContainer' + customer.Id"
                class="tooltip"
                style="margin: 20px; opacity: 0.8;  color: white;  font-weight: bold;"
              ></div>

              <div style="height:100%;" @mouseleave="removetooltip">
                <pie-chart
                  :donut="true"
                  v-if="customer.AllImportCount"
                  :data="[['InCompleted Import(s)',customer.AllImportCount-customer.GoodImportCount], ['Completed Import(s)', customer.GoodImportCount]]"
                  :colors="['red', 'green']"
                  :library="{
                    tooltips:{
                      useHTML: true,
                      mode: 'nearest',
                      enable:true,
                      bodyFontColor:'orange',
                    
                      callbacks:{
                        label:function(tooltipItem, data){
                          return chartCustomisedToolTip(tooltipItem, data,customer.importsNameArr,customer.Id);

                    }

                    }},
                    onClick : function(e, legendItem){
                   
                  }
                  ,
                    elements: {arc: {borderWidth: 0}},legend:{position:'bottom',labels:{ fontColor: 'white'}}}"
                  :borderColor="['#b00', '#666']"
                ></pie-chart>
              </div>
            </div>
            <!-- <div class="progress">
                <div
                  :aria-valuemax="'{{customer.AllImportCount}}'"
                  aria-valuemin="0"
                  :aria-valuenow="'{{customer.GoodImportCount}}'"
                  role="progressbar"
                  class="progress-bar bg grey darken-3"
                  :style="
                    'width: {{(customer.GoodImportCount/customer.AllImportCount)*100}}%;'
                  "
                ></div>
            </div>-->
            <!-- <div class="card-body">
                <b>Import Schedule :</b>
                {{ customer.GoodImportCount }}/{{ customer.AllImportCount }}
                <br />
                <b>Inspections (Today) :</b>
                {{ customer.TodayInspection }}
                <p>
                  <b>Active user(Today) :</b>
                  {{ customer.activeUserToday }}
                </p>
            </div>-->
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import Alert from "./Alert";

const totalActiveUserArr = [];

export default {
  name: "customers",
  inject: ["customerServiceRepository"],

  data() {
    return {
      activeUserChartdataCurrent: [],
      inspectionChartdata: [],
      activeUserChartData: [],

      chartPaginationText: "Prev",
      currentMonth: null,
      currentYear: null,

      mycustomers: [],
      customizedCustomerInfoArr: [],
      alert: "",
      filterInput: "",
      totalActiveUserArr: totalActiveUserArr,
      totalActiveUserCount: 0
    };
  },
  components: {
    Alert
  },
  methods: {
    removetooltip(event) {
      //  console.log(event.target.innerHTML);

      var tootipElementsArr = document.getElementsByClassName("tooltip");

      for (var i = 0; i < tootipElementsArr.length; i++) {
        tootipElementsArr[i].innerHTML = "";
      }
    },
    chartCustomisedToolTip(
      tooltipItem,
      data,
      customerImportsNameArr,
      customerId
    ) {
      var labelNum = data.datasets[0].data[tooltipItem.index] + " ";
      var label = data.labels[tooltipItem.index] || "";

      if (label.localeCompare("InCompleted Import(s)") == 0) {
        label += " : ";
        customerImportsNameArr.inCompletedImportArr.forEach(function(
          importName
        ) {
          label += importName + " ,";
        });
      } else {
        customerImportsNameArr.completedImportArr.forEach(function(importName) {
          label += " , " + importName;
        });
      }

      label = labelNum + " " + label;
      var tootipElementsArr = document.getElementsByClassName("tooltip");

      for (var i = 0; i < tootipElementsArr.length; i++) {
        if (tootipElementsArr[i].id == "tooltipInfoContainer" + customerId) {
          tootipElementsArr[i].innerHTML = label;
        } else {
          tootipElementsArr[i].innerHTML = "";
        }
      }

      return "";
    },
    changeChartData(event) {
      document.getElementById("chartContainer").hidden = true;
      document.getElementById("spinnerContainer").hidden = false;

      var delayInMilliseconds = 200; //1 second

      setTimeout(() => {
        if (event.target.value.localeCompare("Prev") == 0) {
          if (this.currentMonth == 1) {
            this.currentMonth = 12;
            this.currentYear = this.currentYear - 1;
          } else {
            this.currentMonth = this.currentMonth - 1;
          }
        } else {
          if (this.currentMonth == 12) {
            this.currentMonth = 1;
            this.currentYear = this.currentYear + 1;
          } else {
            this.currentMonth = this.currentMonth + 1;
          }
        }
        var todayDate = new Date();

        if (
          this.currentMonth == todayDate.getMonth() + 1 &&
          this.currentYear == todayDate.getFullYear()
        ) {
          document.getElementById("nextChartData").hidden = true;
          document.getElementById("prevChartData").hidden = false;
        } else {
          document.getElementById("nextChartData").hidden = false;
          document.getElementById("prevChartData").hidden = false;
        }
        this.getChartDataByMonth();
        document.getElementById("chartContainer").hidden = false;
        document.getElementById("spinnerContainer").hidden = true;
      }, delayInMilliseconds);
      //debugger;
    },
    isEmpty(val) {
      return val === "";
    },
    filterBy(list, value) {
      return list.filter(function(customer) {
        return customer.Name.toUpperCase().indexOf(value.toUpperCase()) > -1;
      });
    },
    daysInMonth(month, year) {
      return new Date(year, month, 0).getDate();
    },

    getChartDataByMonth() {
      var tempActiveArr = this.totalActiveUserArr;
      var tempChartData = [];

      var daysCounter = this.daysInMonth(this.currentMonth, this.currentYear);
      //****************************Get All Active User Start******************************************************** */

      for (; daysCounter >= 0; daysCounter--) {
        var activeUser = [];
        var sumOfCountByDate = 0;
        var date = new Date(this.currentYear, this.currentMonth);
        var last = new Date(date.getTime() - daysCounter * 24 * 60 * 60 * 1000);

        activeUser.push(last.toDateString());

        var cutomerActiveUserBydate = tempActiveArr.filter(
          ex =>
            new Date(ex.userActiveDate).toDateString() == last.toDateString()
        );

        if (cutomerActiveUserBydate.length > 0) {
          cutomerActiveUserBydate.forEach(function(ActiveItem) {
            sumOfCountByDate += ActiveItem.count;
          });
        }

        activeUser.push(sumOfCountByDate);
        tempChartData.push(activeUser);
      }

      this.activeUserChartdataCurrent = tempChartData;

      //***************************Get All Active User End********************************************************* */
    },

    async fetchCustomers() {
      var self = this;
      this.mycustomers = await this.customerServiceRepository.fetchCustomerData();
      var AllcustmerImports = await this.customerServiceRepository.fetchCustomerImport();
      this.mycustomers.forEach(function(element) {});
      // console.log("MY Customer ::", this.mycustomers);
      // console.log("MY AllcustmerImports ::", AllcustmerImports);

      for (const element of this.mycustomers) {
        console.log(element.id);
        var guiCustomer = {
          Id: element.id,
          Name: element.name,
          GoodImportCount: 0,
          AllImportCount: 0,
          apiUserName: element.apiUserName,
          hostUrl: element.hostUrl,
          TodayInspection: 0,
          activeUserToday: 0,
          Customercolor: element.customerColor,
          image: element.image,
          importsNameArr: []
        };

        guiCustomer.importsNameArr.completedImportArr = [];
        guiCustomer.importsNameArr.inCompletedImportArr = [];
        //-----------------------Get Today ActiveUser's Count By Customer Id------------------------------
        var cutomerActiveUserToday = self.totalActiveUserArr.filter(
          ex =>
            new Date(ex.userActiveDate).toDateString() ==
              new Date().toDateString() && ex.customerId == element.id
        );
        if (cutomerActiveUserToday.length > 0) {
          guiCustomer.activeUserToday = cutomerActiveUserToday[0].count;
        }

        //-----------------------End Get Today ActiveUser's Count By Customer Id------------------------------

        //-----------------------Start Get Today Inspection By Customer Id------------------------------

        var inspectionData = await self.customerServiceRepository.getCustomerInspection(
          element.id
        );

        var cutomerInspectionToday = inspectionData.filter(
          ex =>
            new Date(ex.completedDatetime).toDateString() ==
            new Date().toDateString()
        );

        if (cutomerInspectionToday.length > 0) {
          guiCustomer.TodayInspection = cutomerInspectionToday[0].count;
        }

        //-----------------------End Get Today Inspection By Customer Id------------------------------
        AllcustmerImports.forEach(function(imp) {
          var d = new Date(imp.nextImport);
          var currentDate = new Date();

          if (element.id == imp.customerId) {
            guiCustomer.AllImportCount++;
            if (d > currentDate) {
              guiCustomer.GoodImportCount++;
              guiCustomer.importsNameArr.completedImportArr.push(
                imp.name === "" ? "NO Name" : imp.name
              );
            } else {
              guiCustomer.importsNameArr.inCompletedImportArr.push(
                imp.name === "" ? "No Name" : imp.name
              );
            }
          }
        });

        // --------------------- Set Import Schedule Chart Data ---------------------------------------------
        self.inspectionChartdata.push({
          name: guiCustomer.Name,
          data: {
            Total: guiCustomer.AllImportCount,
            Completed: guiCustomer.GoodImportCount
          },
          color: guiCustomer.Customercolor
        });
        // --------------------- Set Import Schedule Chart Data ---------------------------------------------

        // --------------------- Set Active User Chart Data For Today ---------------------------------------------

        self.activeUserChartData.push({
          name: guiCustomer.Name,
          data: {
            ActivUser: guiCustomer.activeUserToday,
            Inspection: guiCustomer.TodayInspection
          },
          color: guiCustomer.Customercolor
        });
        // --------------------- Set Import Schedule Chart Data ---------------------------------------------
        self.customizedCustomerInfoArr.push(guiCustomer);
      }
      console.log(
        "self.customizedCustomerInfoArr ::",
        self.customizedCustomerInfoArr
      );
      this.getChartDataByMonth();
    }
  },
  async created() {
    if (this.$route.query.alert) {
      this.alert = this.$route.query.alert;
    }

    this.currentMonth = new Date().getMonth() + 1;
    this.currentYear = new Date().getFullYear();
    var daysCounter = this.daysInMonth(this.currentMonth, this.currentYear);
    var tempActiveUserArr = [];
    var self = this;
    self.totalActiveUserArr = await self.customerServiceRepository.getActiveUser();
    //console.log("Active User Arr :: ", self.totalActiveUserArr);
    self.fetchCustomers();
  }
};
</script>
<style scoped>
div.row a:hover {
  text-decoration: none;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
