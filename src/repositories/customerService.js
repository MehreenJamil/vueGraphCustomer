import axios from "axios";

export default {
  addCustomer(customerData) {
    return axios
      .post(process.env.VUE_APP_BASE_URL + "api/customers", customerData)
      .then(function(response) {});
  },
  updateCustomer(customer, id) {
    return axios.put(
      process.env.VUE_APP_BASE_URL + "api/customers/" + id,
      customer
    );
  },
  updateCustomerImport(newImportdata, id) {
    axios
      .put(
        process.env.VUE_APP_BASE_URL + "api/customerimports/" + id,
        newImportdata
      )
      .then(function(res) {
        console.log("Service :: ", res);
      });
  },

  getCustomerById(id) {
    return axios
      .get(process.env.VUE_APP_BASE_URL + "api/customers/" + id)
      .then(function(response) {
        console.log(response);
        return response.data;
      });
  },
  GetCustomerPropertyByCustomerId(id) {
    return axios
      .get(
        process.env.VUE_APP_BASE_URL +
          "api/customerProperties/GetCustomerPropertyByCustomerId/" +
          id
      )
      .then(function(response) {
        return response.data;
      });
  },
  GetCustomerModuleByCustomerId(id) {
    return axios
      .get(
        process.env.VUE_APP_BASE_URL +
          "api/customermodule/GetCustomerModuleByCustomerId/" +
          id
      )
      .then(function(response) {
        return response.data;
      });
  },
  GetCustomerImportByCustomerId(id) {
    return axios
      .get(
        process.env.VUE_APP_BASE_URL +
          "api/customerimports/GetCustomerImportByCustomerId/" +
          id
      )
      .then(function(response) {
        return response.data;
      });
  },

  deleteCustomer(id) {
    return axios
      .delete(process.env.VUE_APP_BASE_URL + "api/customers/" + id)
      .then(function(response) {
        return (alert = "Customer Deleted Successfully");
        // location.reload();
      });
  },
  getActiveUser() {
    var totalActiveUserArr = [];
    //****************************Get All Active User Start******************************************************** */
    return axios
      .get(process.env.VUE_APP_BASE_URL + "api/activeuser/")
      .then(function(response) {
        //console.log("Responce data :: ", response.data.length);
        if (response.data.length > 0) {
          return (totalActiveUserArr = response.data);
        }
      });

    //debugger;
    //***************************Get All Active User End********************************************************* */

    // console.log(totalActiveUserArr);
    // return totalActiveUserArr;
  },
  fetchCustomerData() {
    return axios
      .get(process.env.VUE_APP_BASE_URL + "api/customers/")
      .then(function(response) {
        return response.data;
      });
  },
  fetchCustomerImport() {
    return axios
      .get(process.env.VUE_APP_BASE_URL + "api/customerimports")
      .then(function(customersimports) {
        return customersimports.data;
      });
  },
  getCustomerInspection(id) {
    return axios
      .get(
        process.env.VUE_APP_BASE_URL +
          "api/customerInspections/GetCustomerInspectionByCustomerId/" +
          id
      )
      .then(function(response) {
        console.log("Inspection", response.data);

        return response.data;
      });
  }
};
