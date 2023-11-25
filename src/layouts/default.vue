<template>
  <div class="container">
    <div class="row">
      <div class="col-xs-12 header p-5">
        <h2 class="text-light m-0 p-0 fw-bold">Authentication page</h2>
        <p class="text-light fs-6 fw-light mt-2 fs-8">Use your account details to get access</p>
      </div>
      <nuxt/>
    </div>
  </div>
</template>
<style>
  body{
    font-family: 'Roboto Condensed', sans-serif;
  }
  .header{
    background: #35393e
  }
  .myBtnColor{
    background:#f1a852;
    color:#ffffff
  }
  .myBtnColor:hover{
    background:#ffd267;
    color:#ffffff
  }
  label{
    color:#f1a852;
    font-weight:700
  }

</style>
<script>
import { getToken } from '~/helper/AuthHelper';
export default {
  mounted() {
    if (getToken()) {
      this.$router.push('/mytimeline');
    }
  },
}
</script>
