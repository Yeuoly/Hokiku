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
                    {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
                </v-icon>
                <v-icon v-else>
                    {{ file_icons[item.file] }}
                </v-icon>
            </template>
            <template v-slot:label="{ item }">
                <span v-if="item.file" @click="selectFile(item)">{{ item.name }}</span>
                <span v-else>{{ item.name }}</span>
            </template>
        </v-treeview>
    </div>
    <div class="editor">
      <CodeEditor v-if="selectedFile" :language="getLanguage(selectedFile.name)" v-model="selectedFile.content" />
    </div>
  </div>
</template>

<script>
import CodeEditor from './CodeEditor.vue'
import JSZip from 'jszip'

export default {
  name: 'FileManagerEditor',
  components: {
    CodeEditor
  },
  props: {
    zipFile: {
      type: Object,
    }
  },
  data() {
    return {
      selectedFile: null,
      initiallyOpen : [],
      files: [
        {
          name: '.git',
        },
        {
          name: 'node_modules',
        },
        {
          name: 'public',
          children: [
            {
              name: 'static',
              children: [{
                name: 'logo.png',
                file: 'png',
              }],
            },
            {
              name: 'favicon.ico',
              file: 'png',
            },
            {
              name: 'index.html',
              file: 'html',
              content: '<!DOCTYPE html>\n' +
                '<html lang="en">\n' +
                '<head>\n' +
                '  <meta charset="UTF-8">\n' +
                '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
                '  <meta http-equiv="X-UA-Compatible" content="ie=edge">\n' +
                '  <title>Document</title>\n' +
                '</head>\n' +
                '<body>\n' +
                '  <div id="app"></div>\n' +
                '</body>\n' +
                '</html>',
            },
          ],
        },
        {
          name: '.gitignore',
          file: 'txt',
          content: 'node_modules/\n'
        },
        {
          name: 'babel.config.js',
          file: 'js',
          content: 'module.exports = {\n' +
            '  presets: [\n' +
            '    \'@vue/cli-plugin-babel/preset\'\n' +
            '  ]\n' +
            '}\n'
        },
        {
          name: 'package.json',
          file: 'json',
          content: '{\n' +
            '  "name": "vue-cli3",\n' +
            '  "version": "0.1.0",\n' +
            '  "private": true,\n' +
            '  "scripts": {\n' +
            '    "serve": "vue-cli-service serve",\n' +
            '    "build": "vue-cli-service build",\n' +
            '    "lint": "vue-cli-service lint"\n' +
            '  },\n' +
            '  "dependencies": {\n' +
            '    "core-js": "^3.6.5",\n' +
            '    "vue": "^2.6.11",\n' +
            '    "vue-router": "^3.2.0"\n' +
            '  },\n' +
            '  "devDependencies": {\n' +
            '    "@vue/cli-plugin-babel": "^4.5.0",\n' +
            '    "@vue/cli-plugin-eslint": "^4.5.0",\n' +
            '    "@vue/cli-service": "^4.5.0",\n' +
            '    "@vue/eslint-config-prettier": "^6.0.0",\n' +
            '    "babel-eslint": "^10.1.0",\n' +
            '    "eslint": "^6.7.2",\n' +
            '    "eslint-plugin-prettier": "^3.1.3",\n' +
            '    "eslint-plugin-vue": "^6.2.2",\n' +
            '    "prettier": "^2.0.5",\n' +
            '    "sass": "^1.26.10",\n' +
            '    "sass-loader": "^8.0.2",\n' +
            '    "vue-template-compiler": "^2.6.11"\n' +
            '  },\n' +
            '  "browserslist": [\n' +
            '    "> 1%",\n' +
            '    "last 2 versions",\n' +
            '    "not ie <= 8"\n' +
            '  ]\n' +
            '}\n'
        },
        {
          name: 'README.md',
          file: 'md',
            content: '# vue-cli3\n' +
                '\n' +
                '## Project setup\n' +
                '```\n' +
                'yarn install\n' +
                '```\n' +
                '\n' +
                '### Compiles and hot-reloads for development\n' +
                '```\n' +
                'yarn serve\n' +
                '```\n' +
                '\n' +
                '### Compiles and minifies for production\n' +
                '```\n' +
                'yarn build\n' +
                '```\n' +
                '\n' +
                '### Lints and fixes files\n' +
                '```\n' +
                'yarn lint\n' +
                '```\n' +
                '\n' +
                '### Customize configuration\n' +
                'See [Configuration Reference](https://cli.vuejs.org/config/).\n'
        },
        {
          name: 'vue.config.js',
          file: 'js',
            content: 'module.exports = {\n' +
                '  css: {\n' +
                '    loaderOptions: {\n' +
                '      sass: {\n' +
                '        prependData: `@import "@/assets/scss/_variables.scss";`\n' +
                '      }\n' +
                '    }\n' +
                '  }\n' +
                '}\n'
        },
        {
          name: 'yarn.lock',
          file: 'txt',
            content: '# THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.\n' +
                '# yarn lockfile v1\n' +
                '\n' +
                '\n' +
                'ansi-regex@^2.0.0:\n'
        },
      ],
      tree: [],
      file_icons: {
        html: 'mdi-language-html5',
        js: 'mdi-nodejs',
        json: 'mdi-code-json',
        md: 'mdi-language-markdown',
        pdf: 'mdi-file-pdf',
        png: 'mdi-file-image',
        txt: 'mdi-file-document-outline',
        xls: 'mdi-file-excel',
      },
    }
  },
  mounted() {
  },
  methods: {
    selectFile(item) {
        this.selectedFile = item
    },
    unzipFiles() {
      const zip = new JSZip()
      zip.loadAsync(this.zipFile).then(zip => {
        Object.keys(zip.files).forEach(filename => {
          const file = zip.files[filename]
          if (!file.dir) {
            file.async('string').then(content => {
              this.files.push({ name: filename, size: file._data.uncompressedSize, content })
            })
          }
        })
      })
    },
    getFileSize(size) {
      if (size < 1024) {
        return size + 'B'
      } else if (size < 1024 * 1024) {
        return (size / 1024).toFixed(2) + 'KB'
      } else {
        return (size / 1024 / 1024).toFixed(2) + 'MB'
      }
    },
    getLanguage(fileName) {
      const ext = fileName.split('.').pop().toLowerCase()
      switch (ext) {
        case 'js':
          return 'javascript'
        case 'html':
          return 'html'
        case 'css':
          return 'css'
        default:
          return ''
      }
    },
    openFile(file) {
      this.selectedFile = file
    },
    createFolder() {
      if (this.newFolderName) {
        const folderName = this.newFolderName.trim()
        if (!this.files.find(f => f.name === folderName)) {
          this.files.push({ name: folderName, size: 0, content: null, type: 'folder' })
          this.newFolderName = ''
        }
      }
    }
  }
}
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
