<template>
  <div class="row">
    <div class="col-4 p-5">
      <h4>Following</h4>
      <nuxt-link to="/addFollower" style="font-size: 13px;">Add follower</nuxt-link>
      <div v-if="followers && followers.length === 0" class="list-group-item mt-2">
          <h4 class="alert alert-success">No follower found.</h4>
      </div>
      <ul class="list-group">
        <li v-for="item in followers" :key="item.id" class="list-group-item">
          
          <p class="mb-1">{{ item.follower.name }}</p>
          
        </li>
      </ul>

    </div>
    <div class="col-8 p-5">
      <h4>My timeline</h4>
      <form @submit.prevent="createMurmur">
        <div class="mb-3">
          <textarea v-model="newMurmurContent" class="form-control" rows="2" placeholder="Type your murmur here"></textarea>
        </div>
        <div class="mb-3">
          <button type="submit" class="btn myBtnColor btn-xs">Post Murmur</button>
        </div>
      </form>
      <ul class="list-group">
        <li v-for="murmur in murmurs" :key="murmur.id" class="list-group-item">
          <!-- Display murmur details here -->
          <p class="mb-1">{{ murmur.content }}</p>
          <div class="">
            <p>Likes: {{ murmur.likes.length }}</p>
            <button @click="likeMurmur(murmur.id)" class="btn btn-primary btn-sm">Like</button>
            <button
              v-if="murmur.is_deletable"
              @click.prevent="deleteMurmur(murmur.id)"
              class="btn btn-danger btn-sm"
            >
              Delete
            </button>
          </div>
          <!-- You can display other murmur details as needed -->
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { getToken } from '~/helper/AuthHelper';
export default {
  layout: 'TimeLineLayout',
  computed: {
    murmurs() {
      return this.$store.state.timelineData.murmurs;
    },
    followers() {
      return this.$store.state.timelineData.followers;
    },
  },
  data() {
    return {
      newMurmurContent:null
    };
  },
  mounted() {},
  methods: {

    async createMurmur() {
      try {
        const response = await axios.post(
          'http://localhost:3001/api/add_murmur',
          {
            content: this.newMurmurContent,
          },
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          },
        );

        // Update the store with the new murmur
        this.$store.commit('updateTimelineData', {
          murmurs: response.data.murmurs,
        });

        // Clear the new murmur content after posting
        this.newMurmurContent = '';
      } catch (error) {
        console.error(error);
      }
    },

    async likeMurmur(murmurId) {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/murmurs/${murmurId}/like`,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );
        this.$store.commit('addLikeToMurmur', murmurId);
        
      } catch (error) {
        console.log(error);
      }
    },
    async deleteMurmur(murmurId) {
      try {

        await axios.delete(`http://localhost:3001/api/murmur/${murmurId}`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        const updatedMurmurs = this.$store.state.timelineData.murmurs.filter(
          murmur => murmur.id !== murmurId
        );

        this.$store.commit('updateTimelineData', {
          murmurs: updatedMurmurs,
        });
      } catch (error) {
        console.log(error);
      }
    },
    async refreshTimeline() {
      try {
        const response = await axios.get('http://localhost:3001/api/my_timeline', {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        this.$store.commit('updateTimelineData', {
          murmurs: response.data.murmurs,
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>