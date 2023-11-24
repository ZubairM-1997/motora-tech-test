<template>
  <div>
    <h2>Admin Login</h2>
    <form @submit.prevent="login">
      <label for="adminUsername">Admin Username:</label>
      <input type="text" id="adminUsername" v-model="adminUsername" required />
      <label for="adminPassword">Password:</label>
      <input type="password" id="adminPassword" v-model="adminPassword" required />
      <button type="submit">Log In</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      adminUsername: '',
      adminPassword: '',
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('http://localhost:3000/admin-login', {
          username: this.adminUsername,
          password: this.adminPassword,
        });

        // Assuming the login is successful, you can handle the response as needed
        console.log('Admin login successful:', response.data);

        // Redirect to the main admin page or perform further actions
        // For example, you can use this.$router.push('/admin-main');
      } catch (error) {
        console.error('Admin login error:', error.response.data.error);
        // Handle login error (display a message, etc.)
      }
    },
  },
};
</script>
