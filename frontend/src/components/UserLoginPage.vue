<template>
  <div>
    <h2>User Login</h2>
    <form @submit.prevent="login">
      <label for="username">Username:</label>
      <input type="text" id="username" v-model="username" @input="updateUsername" required />
      <button type="submit">Log In</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
    };
  },
  methods: {
    updateUsername() {
      console.log('Username:', this.username);
      // You can perform additional logic as the username changes, if needed
    },
    async login() {
      try {
        const response = await axios.post('http://localhost:3000/user-login', {
          username: this.username,
        });

        // Assuming the login is successful, you can handle the JWT and set the authenticated status
        const jwtToken = response.data.token;

        // Store the JWT token in a secure way, such as using vuex or localStorage
        localStorage.setItem('jwtToken', jwtToken);

        // Set the authenticated status in App.vue
        this.$root.authenticated = true;

        // Redirect to the upload image page
        this.$router.push('/upload');
      } catch (error) {
        console.error('User login error:', error.response.data.error);
        // Handle login error (display a message, etc.)
      }
    },
  },
};
</script>
