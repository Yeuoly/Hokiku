<template>
  <v-container>
    <file-manager></file-manager>
  </v-container>
</template>

<script>
import FileManager from "../../components/common/FileManager.vue";

const jszip = require("js-zip");

export default {
  components: { FileManager },
  data: () => ({
    files: [],
    zip: new jszip(),
    zip_name: "image.zip",
  }),
  methods: {},
};
</script>

<style>
</style>