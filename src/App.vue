<template> </template>
<script>
export default {
  name: "App",

  data: () => ({
    //
  }),
  created: function() {
    this.$router.push({
      path: "/customers"
    });
  }
};
$(document).ready(function() {});
</script>
