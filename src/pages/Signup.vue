<template>
    <div class="col-xs-12 col-sm-6 offset-sm-3 mt-5">
      <form @submit.prevent="submitForm">
        <div v-if="error_message != null" class="alert alert-danger">
          <h4 v-text="error_message"></h4>
        </div>
        <div class="form-group mb-4">
          <label for="userName">User Name</label>
          <input v-model="username" type="text" class="form-control" id="userName" placeholder="Enter your username" required>
        </div>
        <div class="form-group mb-4">
          <label for="userName">Password</label>
          <input v-model="password" type="password" class="form-control" id="password" placeholder="Password" required>
        </div>
        <!-- Add more form elements as needed -->
  
        <div class="form-group max-auto">
          <button type="submit" class="btn myBtnColor w-100 mb-2">Register</button>
          <span style="font-size: 12px;">Have an account already? </span>
          <nuxt-link to="/" style="font-size: 13px;">LOGIN</nuxt-link>
        </div>
        
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { setName, setToken } from '~/helper/AuthHelper';
  export default {
    data() {
      return {
        username: '',
        password: '',
        login_failed: false,
        error_message:null
        // Add more data properties as needed
      };
    },
    methods: {
      async submitForm(){
        this.login_failed = false;
        this.error_message = null;
        try {
          const response = await axios.post('http://localhost:3001/api/registration', {
            name: this.username,
            password: this.password,
          });
          if(response.data.error){
            this.error_message = response.data.message;
          }else{
            setToken(response.data.access_token);
            this.$router.push('mytimeline');
          }
          
        } catch (error) {
          console.log(error);
          this.error_message = error;
        }
      }
    }
  }
  </script>
  