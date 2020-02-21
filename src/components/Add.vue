<template>
  <div class="add container">
    <h1 class="page-header">Add Customer</h1>
    <form v-on:submit="addCustomer">
      <div class="well">
        <h4>Customer Info</h4>
        <div class="form-group">
          <label>Name</label>
          <input type="text" class="form-control" placeholder="Name" v-model="customer.name" />
        </div>
        <div class="form-group">
          <label>Api User Name</label>
          <input
            type="text"
            class="form-control"
            placeholder="Api User Name"
            v-model="customer.apiUserName"
          />
        </div>
        <div class="form-group">
          <label>Host Url</label>
          <input type="text" class="form-control" placeholder="Host Url" v-model="customer.hostUrl" />
        </div>

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
        <div class="form-group">
          <label>Customer Color</label>
          <input type="color" value="#CCFF99" id="customercolor" style="width:21px;" />
        </div>
        <div class="well">
          <div class="form-group">
            <label>Profile Image</label>
            <input id="addimgInput" type="file" name="file" @change="readURL($event)" />
            <img id="addimagePreview" src="../default.png" alt="Item Image" width="96" height="80" />
          </div>
        </div>
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "add",
  inject: ["customerServiceRepository"],
  data() {
    return {
      customer: {},
      alert: "",
      type: "password",
      btnText: "Show Password"
    };
  },
  methods: {
    togglePassword() {
      if (this.type === "password") {
        this.type = "text";
        this.btnText = "Hide Password";
      } else {
        this.type = "password";
        this.btnText = "Show Password";
      }
    },
    readURL(input) {
      console.log(input.target.files);
      if (input.target.files && input.target.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
          $("#addimagePreview").attr("src", e.target.result);
        };

        reader.readAsDataURL(input.target.files[0]);
      }
    },
    addCustomer(e) {
      if (!this.customer.name) {
        this.alert = "Please fill in all required fields";
      } else {
        var images = $("#addimagePreview").attr("src");

        let newCustomer = {
          name: this.customer.name,
          apiUserName: this.customer.apiUserName,
          hostUrl: this.customer.hostUrl,
          apiPassword: this.customer.apiPassword,
          removed: false,
          customerColor: document.getElementById("customercolor").value,
          image: images
        };
        this.customerServiceRepository.addCustomer(newCustomer);
        this.$router.push({
          path: "/",
          query: { alert: "Customer Added" }
        });

        e.preventDefault();
      }
      e.preventDefault();
    }
  },
  components: {}
};
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
</style>
