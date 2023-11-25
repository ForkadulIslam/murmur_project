

<template>
  <div class="container">
    <div class="row">
      <div class="col-xs-12 header ps-5 pe-5 pt-3 pb-4">
        <h2 class="text-light m-0 p-0 fw-bold" v-text="$store.state.name"></h2>
        <div class="follower-stats mb-3">
          <p class="text-light m-0 p-0">Followers: {{ followerCount }}</p>
          <p class="text-light m-0 p-0">Following: {{ followingCount }}</p>
        </div>
        <button @click.prevent="logout" class="btn btn-outline-light">Logout</button>
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

  .follower-stats {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
  }

</style>

<script>
import { removeToken, getToken } from '~/helper/AuthHelper';
import axios from 'axios';
export default {
  data() {
    return {
      name:null,
    }
  },
  computed: {
    followerCount() {
      return this.$store.state.followerCount || 0;
    },
    followingCount() {
      return this.$store.state.followingCount || 0;
    },
  },
  mounted() {
    this.checkAuth();
    this.getDetails();
    this.getFollowerStats();
  },
  methods:{
    async logout() {
      try {
        removeToken();
        this.$router.push('/');
      } catch (error) {
        console.error('Logout failed', error);
      }
    },
    checkAuth(){
      if (!getToken()) {
        this.$router.push('/');
      }
    },
    async getDetails(){
      
      try {
        
        const response = await axios.get('http://localhost:3001/api/my_timeline',{
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        
        this.$store.commit('updateName',response.data.user_details.name)
        this.$store.commit('updateTimelineData', {
          followers: response.data.user_details.UserFollowers,
          murmurs:response.data.murmurs
        });
        
        
      } catch (error) {
        console.log(error);
      }
    },

    async getFollowerStats(){
      const response = await axios.get('http://localhost:3001/api/follower_stats', {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const followerCount = response.data.followerCount;
      const followingCount = response.data.followingCount;
      this.$store.commit('updateFollowerCount', followerCount);
      this.$store.commit('updateFollowingCount', followingCount);
      
    }
    
  }
}
</script>
