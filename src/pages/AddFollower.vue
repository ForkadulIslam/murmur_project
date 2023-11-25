<template>
  <div class="col-12 p-5">
    <nuxt-link to="/mytimeline" style="font-size: 13px;">Back to timeline</nuxt-link>
    <div v-if="message != null" class="alert alert-success">
        <h4 v-text="message"></h4>
    </div>
    <table class="table">
        <thead>
            <tr>
                <th>SL</th>
                <th>Name</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
        <tr v-for="(user, index) in userList" :key="user.id">
          <td>{{ index + 1 }}</td>
          <td>{{ user.name }}</td>
          <td>
            <button @click="addFollower(user.id)" class="btn btn-success btn-sm">Add To Follower</button>
          </td>
        </tr>
      </tbody>
        
    </table>
  </div>
</template>


<script>
import axios from 'axios';
import { getToken } from '~/helper/AuthHelper';
export default {
    layout: 'TimeLineLayout',
    data() {
        return {
            userList: [],
            message:null,
        };
    },
    mounted() {
        this.getUserList();
    },
    methods: {
        async getUserList() {
            try {
                const response = await axios.get('http://localhost:3001/api/get_user_list',{
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                });
                this.userList = response.data;
            } catch (error) {
                console.log(error);
            }
        },
        async addFollower(userId) {
            this.message = 'Please wait....'
            try {

                await axios.post('http://localhost:3001/api/add_follower', { user_id:userId },{
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                });
                this.getUserList();


                const response = await axios.get('http://localhost:3001/api/my_timeline',{
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                });
                let user_id = response.data.user_details.id;
                response.data.murmurs.map( item => {
                    if(item.user_id == user_id){
                        item.is_deletable = true;
                    }else{
                        item.is_deletable = false;
                    }
                })
                this.$store.commit('updateTimelineData', {
                    followers: response.data.user_details.UserFollowers,
                    murmurs:response.data.murmurs
                });

                this.$store.commit('updateFollowingCount', this.$store.state.followingCount + 1);
                this.message = 'User added in your following list';


            } catch (error) {
                this.message = error;
                console.log(error);
            }
        },
    },
}
</script>

<style>

</style>