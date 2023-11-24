<template>
  <div>
    <h2>Upload Image</h2>
    <input type="file" ref="fileInput" accept="image/*" />
    <button @click="uploadImage">Upload</button>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  methods: {
    async uploadImage() {
      try {
        const fileInput = this.$refs.fileInput;
        const formData = new FormData();
        formData.append('image', fileInput.files[0]);

        // Retrieve the JWT token from storage (assuming you stored it in localStorage)
        const jwtToken = localStorage.getItem('jwtToken');

        const response = await axios.post('http://localhost:3000/create-request', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `${jwtToken}`, // Include the JWT token in the Authorization header
          },
        });

        // Assuming the upload is successful, handle the response (update UI, etc.)
        console.log('Upload response:', response);
      } catch (error) {
        console.error('Upload error:', error);
        // Handle upload error (display a message, etc.)
      }
    },
  },
};
</script>
