<template>
  <div>
    <h2>Main Page</h2>
    <ul>
      <li v-for="request in userRequests" :key="request.name">
        {{ request.username }} - Status: {{ request.status }}
        <p v-if="request.status === 'ready'">Detected Faces: {{ request.faces }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      userRequests: [],
    };
  },
  async created() {
    // Fetch user requests upon component creation
    await this.fetchUserRequests();
  },
  methods: {
    async fetchUserRequests() {
      try {
        const jwtToken = localStorage.getItem('jwtToken');

        const response = await axios.get('http://localhost:3000/requests', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${jwtToken}`, // Include the JWT token in the Authorization header
          },
        });

        // Assuming the fetch is successful, update userRequests
        this.userRequests = response.data;
      } catch (error) {
        console.error('Fetch user requests error:', error);
        // Handle fetch error (display a message, etc.)
      }
    },
  },
};
</script>
