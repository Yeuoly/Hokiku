<template>
  <div class="file-manager-editor">
    <div class="file-manager">
      <v-treeview
        v-model="tree"
        :open="initiallyOpen"
        :items="files"
        activatable
        item-key="name"
        open-on-click
        dense
      >
        <template v-slot:prepend="{ item, open }">
          <v-icon v-if="!item.file">
            {{ open ? "mdi-folder-open" : "mdi-folder" }}
          </v-icon>
          <v-icon v-else>
            {{ file_icons[item.file] }}
          </v-icon>
        </template>
        <template v-slot:label="{ item }">
          <span v-if="item.file" @click="selectFile(item)">{{
            item.name
          }}</span>
          <span v-else @drop="appendFile($event, item)" @dragover.prevent>{{
            item.name
          }}</span>
        </template>
        <template v-slot:append="{ item }">
          <v-menu
            v-if="!item.file"
            bottom
            origin="center center"
            transition="scale-transition"
            :close-on-content-click="false"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                dark
                v-bind="attrs"
                v-on="on"
                v-if="!item.file"
                icon
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item>
                <v-text-field
                  v-model="newFileName"
                  label="文件名"
                  prepend-icon="mdi-file"
                >
                  <template v-slot:append>
                    <v-btn
                      color="primary"
                      dark
                      @click="createFolder(item, newFileName)"
                    >
                      创建
                    </v-btn>
                  </template>
                </v-text-field>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-icon @click="deleteFile(item)" v-else>
            mdi-delete
          </v-icon>
        </template>
      </v-treeview>
    </div>
    <div class="editor">
      <CodeEditor
        v-if="selectedFile"
        :language="getLanguage(selectedFile.name)"
        v-model="selectedFile.content"
      />
    </div>
  </div>
</template>

<script>
import CodeEditor from "./CodeEditor.vue";
import JSZip from "jszip";

export default {
  name: "FileManagerEditor",
  components: {
    CodeEditor,
  },
  props: {
    zipFile() {
        return {
            type: Object | File | Blob,
        }
    },
  },
  watch: {
    zipFile: {
      handler: function (newVal) {
        if (newVal) {
          // unzip file and overwrite files
          const zip = new JSZip();
          this.files = [];
          zip.loadAsync(this.zipFile).then((zip) => {
            zip.forEach((relativePath, file) => {
              if (file.dir) {
                return;
              }
              file.async("string").then((content) => {
                const path = relativePath.split("/");
                const name = path.pop();
                let current = this.files;
                
                path.forEach((dir) => {
                  let found = false;
                  current.forEach((item) => {
                    if (item.name === dir) {
                      found = true;
                      current = item.children;
                    }
                  });
                  if (!found) {
                    const newDir = {
                      name: dir,
                      children: [],
                    };
                    current.push(newDir);
                    current = newDir.children;
                  }
                });

                current.push({
                  name,
                  file: this.getFileType(name),
                  content,
                });
              });
            });
          });
        }
      },
      immediate: true,
    },
    files: {
      handler: function () {
        //check if root changed, if so, commit zip to parent
        const zip = new JSZip();
        //cycle through files
        const walker = (files, path) => {
          files.forEach((file) => {
            if (file.file) {
              zip.file(path + file.name, file.content);
            } else {
              walker(file.children, path + file.name + "/");
            }
          });
        };
        walker(this.files, "");
        zip.generateAsync({ type: "blob" }).then((content) => {
          this.$emit("change", content);
        });
      },
      deep: true,
    },
  },
  data() {
    return {
      selectedFile: null,
      initiallyOpen: [],
      newFileName: "",
      files: [
        {
          name: "root",
        },
      ],
      tree: [],
      file_icons: {
        html: "mdi-language-html5",
        js: "mdi-nodejs",
        json: "mdi-code-json",
        md: "mdi-language-markdown",
        pdf: "mdi-file-pdf",
        png: "mdi-file-image",
        txt: "mdi-file-document-outline",
        xls: "mdi-file-excel",
        sql: "mdi-database",
        binary: "mdi-file",
        php: "mdi-language-php",
        py: "mdi-language-python",
      },
    };
  },
  methods: {
    deleteFile(item) {
      const walker = (files, path) => {
        files.forEach((file, index) => {
          if (file.file) {
            if (file === item) {
              files.splice(index, 1);
            }
          } else {
            walker(file.children, path + file.name + "/");
          }
        });
      };
      walker(this.files, "");
    },
    appendFile(event, item) {
      event.preventDefault();
      const files = event.dataTransfer.files;
      // check if item has children, if not, add it
      if (!item.children) {
        this.$set(item, "children", []);
      }
      // loop through files
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileItem = {
          name: file.name,
          file: this.getFileType(file.name),
          children: [],
        };
        // read file content
        const reader = new FileReader();
        reader.onload = (e) => {
          fileItem.content = e.target.result;
          item.children.push(fileItem);
        };
        reader.readAsArrayBuffer()
      }
    },
    selectFile(item) {
      this.selectedFile = item;
    },
    getLanguage(fileName) {
      const ext = fileName.split(".").pop().toLowerCase();
      switch (ext) {
        case "js":
          return "javascript";
        case "html":
          return "html";
        case "css":
          return "css";
        case "json":
          return "json";
        case "md":
          return "markdown";
        case "sql":
          return "sql";
        case "php":
          return "php";
        case "py":
          return "python";
        default:
          return "";
      }
    },
    getFileType(fileName) {
      const ext = fileName.split(".").pop().toLowerCase();
      switch (ext) {
        case "js":
          return "js";
        case "html":
        case "htm":
        case "xhtml":
          return "html";
        case "css":
          return "css";
        case "json":
          return "json";
        case "md":
          return "md";
        case "sql":
          return "sql";
        case "php":
        case "php3":
        case "php4":
        case "php5":
        case "phtml":
          return "php";
        case "png":
        case "jpg":
        case "jpeg":
        case "gif":
        case "ico":
        case "svg":
          return "png";
        case "pdf":
          return "pdf";
        case "xls":
          return "xls";
        case "txt":
          return "txt";
        default:
          return "binary";
      }
    },
    openFile(file) {
      this.selectedFile = file;
    },
    createFolder(item, name) {
      // check if item has children, if not, add it
      if (!item.children) {
        this.$set(item, "children", []);
      }
      item.children.push({
        name: name,
        children: [],
      });
    },
  },
};
</script>

<style>
.file-manager-editor {
  display: flex;
  height: 100%;
  overflow: hidden;
}

.file-manager {
  display: flex;
  flex-direction: column;
  width: 300px;
  height: 100%;
  overflow-y: auto;
  background-color: #f0f0f0;
  margin-right: 10px;
}

.file-list {
  flex: 1;
  overflow-y: auto;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 8px;
  cursor: pointer;
}

.file-item:hover {
  background-color: #e0e0e0;
}

.file-name {
  flex: 1;
  margin-right: 8px;
}

.editor {
  flex: 1;
  height: 100%;
  overflow-y: auto;
}
</style>
