<template>
  <div id="app">
    <h1>Welcome to the Face Detection App</h1>
    <div v-if="!authenticated">
      <!-- Show navigation buttons for log in -->
      <button @click="redirectToUserLogin">Log In as User</button>
      <button @click="redirectToAdminLogin">Log In as Admin</button>
    </div>
    <div v-else>
      <!-- Show navigation for authenticated user -->
      <router-link to="/main">Main Page</router-link>
      <router-link to="/upload">Upload Image</router-link>
      <button @click="signOut">Sign Out</button>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  data() {
    return {
      authenticated: false, // Set this to true upon successful login
    };
  },
  methods: {
    redirectToUserLogin() {
      // Redirect to user login page
      this.$router.push('/user-login');
    },
    redirectToAdminLogin() {
      // Redirect to admin login page
      this.$router.push('/admin-login');
    },
     signOut() {
      // Clear JWT from local storage
      localStorage.removeItem('jwt');

      // Update authenticated status
      this.authenticated = false;

      // Redirect to user login page
      this.$router.push('/user-login');
    },
  },
  watch: {
    // Watch for changes in authenticated status
    authenticated: function (newValue) {
      // Redirect to the appropriate page based on authentication status
      if (newValue) {
        this.$router.push('/main'); // Redirect to user main page upon authentication
      } else {
        this.$router.push('/'); // Redirect to the default landing page when not authenticated
      }
    },
  },
};
</script>

<style>
#app {
  text-align: center;
  margin-top: 60px;
}

button {
  padding: 10px;
  margin: 10px;
  cursor: pointer;
}
</style>
