<template>
  <div class="detail container">
    <form v-on:submit="updateCustomer">
      <div class="well">
        <h4>Customer Update</h4>
        <div class="form-group">
          <span class="pull-right">
            <button
              class="btn btn-sm btn-danger"
              v-on:click="deleteCustomer(customer.id)"
            >Delete Customer</button>
          </span>
        </div>

        <div class="form-group">
          <label>Name</label>
          <input type="text" class="form-control" v-text="customer.name" v-model="customer.name" />
        </div>
      </div>
      <div class="well">
        <div class="form-group">
          <label>Api User Name</label>
          <input
            type="text"
            class="form-control"
            v-text="customer.apiUserName"
            v-model="customer.apiUserName"
          />
        </div>
      </div>
      <div class="well">
        <div class="form-group">
          <label>Host Url</label>
          <input
            type="text"
            class="form-control"
            v-text="customer.hostUrl"
            v-model="customer.hostUrl"
          />
        </div>
      </div>
      <div class="well">
        <div class="form-group">
          <label>Host Api Password</label>
          <input
            :type="type"
            v-text="customer.apiPassword"
            v-model="customer.apiPassword"
            style="width:40%;"
          />
          <input
            type="button"
            @click="togglePassword"
            :value="btnText"
            class="btn btn-sm btn-info indigo"
          />
        </div>
      </div>
      <div class="well">
        <div class="form-group">
          <label>Customer Color</label>
          <input type="color" v-model="customer.customerColor" style="width:21px;" />
        </div>
      </div>
      <div class="well">
        <div class="form-group">
          <label>Profile Image</label>
          <input id="imgInput" type="file" name="file" @change="readURL($event)" />
          <img id="imagePreview" :src="fileSelected" alt="Item Image" width="96" height="80" />
        </div>
      </div>
      <a
        href="#"
        class="pull-left btn-sm btn-info"
        @click="displayPropertyInfo"
        v-if="markers.length>0"
      >{{propertyDisplayText}}</a>

      <br />
      <br />
      <br />
      <div class="well" id="propertyContainer">
        <h4>Customer Property(s)</h4>
        <div v-if="markers.length==0">No Data</div>
        <transition name="slide-fade">
          <GmapMap
            :center="center"
            :zoom="13"
            map-type-id="terrain"
            style="width: 100%; height: 700px"
            v-if="markers.length>0 && displayProperty"
          >
            <gmap-info-window
              :options="infoOptions"
              :position="infoWindowPos"
              :opened="infoWinOpen"
              @closeclick="infoWinOpen=false"
            >
              <strong>Name :</strong>
              {{infoName}}
              <br />
              <b>Address :</b>
              {{infoAddress}}
            </gmap-info-window>
            <GmapMarker
              :key="index"
              v-for="(m, index) in markers"
              :position="m.position"
              :draggable="false"
              :clickable="true"
              @click="toggleInfoWindow(m,index)"
              :icon="{ url: require('../assets/customerImg/'+m.icon),
            
            
            scaledSize: {width: 28, height: 28, f: 'px', b: 'px',}}"
            ></GmapMarker>
          </GmapMap>
        </transition>
      </div>
      <br />
      <br />
      <br />
      <div class="well">
        <h4>Customer Import</h4>
        <div class="form-group">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Import Name</th>
                <th>Last Import</th>
                <th>Next Import</th>
                <th>External Import Id</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="im in customerImports" :key="im.id">
                <td>
                  <input type="text" :name="im.id" v-model="im.name" />
                </td>
                <td>
                  {{
                  im.lastImport
                  ? new Date(im.lastImport).toLocaleDateString("sv", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit"
                  })
                  : ""
                  }}
                </td>
                <td>
                  {{
                  im.nextImport
                  ? new Date(im.nextImport).toLocaleDateString("sv", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit"
                  })
                  : ""
                  }}
                </td>
                <td>{{ im.externalImportId }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <br />
      <br />
      <br />
      <div class="well">
        <h4>Customer Module(s)</h4>
        <div class="form-group">
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Title</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="mod in customerModules" :key="mod.id">
                <td>{{mod.module.name}}</td>

                <td>{{ mod.title }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <button type="submit" class="btn btn-primary">Update</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "customerdetail",
  inject: ["customerServiceRepository"],
  data() {
    return {
      customer: [],
      customerImports: [],
      fileSelected: null,
      type: "password",
      btnText: "Show Password",
      customerModules: [],
      center: { lat: 59.3413601, lng: 18.0613966 },
      markers: [],
      infoContent: "",
      infoWindowPos: null,
      infoWinOpen: false,
      currentMidx: null,
      //optional: offset infowindow so it visually sits nicely on top of our marker
      infoOptions: {
        pixelOffset: {
          width: 0,
          height: -35
        }
      },
      infoName: "",
      infoAddress: "",
      displayProperty: false,
      propertyDisplayText: "Show Customer Property Info"
    };
  },

  methods: {
    displayPropertyInfo: function() {
      if (
        this.propertyDisplayText.localeCompare("Show Customer Property Info") ==
        0
      ) {
        this.displayProperty = true;
        this.propertyDisplayText = "Hide Customer Property Info";
      } else {
        this.displayProperty = false;
        this.propertyDisplayText = "Show Customer Property Info";
      }
      document.getElementById("propertyContainer").s;
    },
    toggleInfoWindow: function(marker, idx) {
      this.infoWindowPos = marker.position;
      var infoArr = marker.infoText.split("//");
      this.infoName = infoArr[0] != null ? infoArr[0] : "";
      this.infoAddress = infoArr[1] != null ? infoArr[1] : "";

      //check if its the same marker that was selected if yes toggle
      if (this.currentMidx == idx) {
        this.infoWinOpen = !this.infoWinOpen;
      }
      //if different marker set infowindow to open and reset current marker index
      else {
        this.infoWinOpen = true;
        this.currentMidx = idx;
      }
    },
    togglePassword() {
      if (this.type === "password") {
        this.type = "text";
        this.btnText = "Hide Password";
      } else {
        this.type = "password";
        this.btnText = "Show Password";
      }
    },
    async deleteCustomer(id) {
      alert = await this.customerServiceRepository.deleteCustomer(id);
      this.$router.push({
        path: "/",
        query: { alert: "Customer Deleted Successfully" }
      });
    },
    uploadImage(event) {
      this.fileSelected = event.target.files[0];
    },
    async fetchCustomer(id) {
      console.log("1");
      this.customer = await this.customerServiceRepository.getCustomerById(id);
      console.log("customer Info :: ", this.customer);
      this.fileSelected = this.customer.image;
      //console.log("customer", this.customer);

      this.customerImports = await this.customerServiceRepository.GetCustomerImportByCustomerId(
        id
      );
      //  console.log("Customer Import");

      this.customerModules = await this.customerServiceRepository.GetCustomerModuleByCustomerId(
        id
      );
      //  console.log("CustomerModule");
      //  console.log("Customer Modules : ", this.customerModules);

      var properties = await this.customerServiceRepository.GetCustomerPropertyByCustomerId(
        id
      );
      if (properties != null) {
        this.center = {
          lat: parseFloat(properties[0].latitude.replace(",", ".")),
          lng: parseFloat(properties[0].longitude.replace(",", "."))
        };
      }
      for (const pos of properties) {
        this.markers.push({
          position: {
            lat: parseFloat(pos.latitude.replace(",", ".")),
            lng: parseFloat(pos.longitude.replace(",", "."))
          },
          icon: !pos.enabled ? "marker_red_selected.png" : "marker_blue.png",
          infoText: pos.name + "//" + pos.address
        });
      }
      // properties.forEach(function(pos) {
      //   this.markers.push({
      //     position: {
      //       lat: parseFloat(pos.latitude.replace(",", ".")),
      //       lng: parseFloat(pos.longitude.replace(",", "."))
      //     },
      //     icon: !pos.enabled
      //       ? "marker_red_selected.png"
      //       : "marker_blue.png",
      //     infoText: pos.name + "//" + pos.address
      //   });
      // });
      // console.log(self.markers);
    },

    async updateCustomer(e) {
      e.preventDefault();
      var images = $("#imagePreview").attr("src");

      //console.log("Update Customer :" + images);

      let newCustomer = {
        name: this.customer.name,
        apiUserName: this.customer.apiUserName,
        hostUrl: this.customer.hostUrl,
        apiPassword: this.customer.apiPassword,
        removed: true,
        image: images,
        customerColor: this.customer.customerColor
      };

      await this.customerServiceRepository.updateCustomer(
        newCustomer,
        this.$route.params.id
      );
      //console.log(newCustomer);

      if (this.customerImports.length == 0) {
        this.$router.push({
          path: "/",
          query: { alert: "Customer Updated Successfully" }
        });
      } else {
        const [head, ...rest] = this.customerImports;
        let newImportdata = {
          CustomerId: parseInt(this.$route.params.id),
          Name: head.name,
          nextImport: head.nextImport,
          lastImport: head.lastImport,
          externalImportId: head.externalImportId
        };

        await this.customerServiceRepository.updateCustomerImport(
          newImportdata,
          head.id
        );
        this.updateCustomerImportFromArr(rest);
        e.preventDefault();
      }
    },
    updateCustomerImportFromArr(customerImportArr) {
      console.log("customerImportArr Size :: ", customerImportArr.length);
      if (customerImportArr.length == 0) {
        this.$router.push({
          path: "/",
          query: { alert: "Customer Updated Successfully" }
        });
      } else {
        this.updateCustomerImport(customerImportArr);
      }
    },

    async updateCustomerImport(myImports) {
      console.log("updateCustomerImport :: ", myImports);
      const [head, ...rest] = myImports;
      var restOfArr = rest;
      var newCustomerImport = {
        CustomerId: parseInt(this.$route.params.id),
        Name: head.name,
        nextImport: head.nextImport,
        lastImport: head.lastImport,
        externalImportId: head.externalImportId
      };
      await this.customerServiceRepository.updateCustomerImport(
        newCustomerImport,
        head.id
      );

      this.updateCustomerImportFromArr(rest);
    },
    readURL(input) {
      if (input.target.files && input.target.files[0]) {
        //console.log("readUrl");
        var reader = new FileReader();
        reader.onload = function(e) {
          //  console.log("File Reader On Load");
          $("#imagePreview").attr("src", e.target.result);
        };

        reader.readAsDataURL(input.target.files[0]);
      }
    }
  },

  created: function() {
    this.fetchCustomer(this.$route.params.id);
  }
};
// $(window).load(function () {
//   $(".toggle-password").click(function() {

//   $(this).toggleClass("fa-eye fa-eye-slash");
//   var input = $($(this).attr("toggle"));
//   if (input.attr("type") == "password") {
//     input.attr("type", "text");
//   } else {
//     input.attr("type", "password");
//   }
// });
// });
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.field-icon {
  float: right;
  margin-left: -25px;
  margin-top: -25px;
  position: relative;
  z-index: 2;
}

.container {
  padding-top: 50px;
  margin: auto;
}
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
