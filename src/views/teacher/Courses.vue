<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="data"
      :items-per-page="999999"
      :server-items-length="99999999"
      :options.sync="options"
      :expanded.sync="expanded.course"
      show-expand
      single-expand
    >
      <template v-slot:item.time="{ item }">
        {{ new Date(item.time * 1000).formatDate("Y-M-D h:m:s") }}
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn small text color="primary" @click="toEdit(item)">详情</v-btn>
      </template>
      <template v-slot:expanded-item="{ headers }">
        <td :colspan="headers.length">
          <div class="px2 py2">
            <v-btn small color="primary" @click="openNewUnitDialog"
              >添加章节</v-btn
            >
            <v-simple-table>
              <thead>
                <tr>
                  <th class="text-left">章节名</th>
                  <th class="text-left">创建时间</th>
                  <th class="text-left">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in expanded.units" :key="item.id">
                  <td>{{ item.name }}</td>
                  <td>
                    {{ new Date(item.time * 1000).formatDate("Y-M-D h:m:s") }}
                  </td>
                  <td>
                    <v-btn
                      color="primary"
                      class="mr2"
                      small
                      @click="openUpdateUnitDialog(item)"
                      >编辑</v-btn
                    >
                  </td>
                  <!--
                    <v-btn color="red" class="text-white" small>删除</v-btn>
                  </td> -->
                </tr>
              </tbody>
            </v-simple-table>
          </div>
        </td>
      </template>
    </v-data-table>
    <v-dialog v-model="new_unit" width="800">
      <v-card>
        <v-toolbar color="primary">
          <v-toolbar-title class="text-white"> 创建章节 </v-toolbar-title>
        </v-toolbar>
        <div class="px5 py2">
          <v-text-field
            label="标题"
            v-model="new_unit_model.name"
          ></v-text-field>
          <span class="text-grey">上传封面</span>
          <UploadImage v-model="new_unit_model.cover_rid" :height="100" />
          <span class="text-grey">上传ppt</span>
          <UploadAny v-model="new_unit_model.ppt_rid" :height="100" />
          <span class="text-grey">上传视频</span>
          <UploadStream v-model="new_unit_model.media_rid" :height="100" />
          <v-btn color="primary" @click="commitUnit">提交</v-btn>
        </div>
      </v-card>
    </v-dialog>
    <v-dialog v-model="update_unit" width="800">
      <v-card>
        <v-toolbar color="primary">
          <v-toolbar-title class="text-white"> 编辑 </v-toolbar-title>
        </v-toolbar>
        <div class="px5 py2">
          <v-text-field
            label="标题"
            v-model="update_unit_model.name"
          ></v-text-field>
          <span class="text-grey">上传封面</span>
          <UploadImage v-model="update_unit_model.cover_rid" :height="100" />
          <span class="text-grey">上传ppt</span>
          <UploadAny v-model="update_unit_model.ppt_rid" :height="100" />
          <span class="text-grey">上传视频</span>
          <UploadStream v-model="update_unit_model.media_rid" :height="100" />
          <v-btn color="primary" @click="commitUpdateUnit">提交</v-btn>
        </div>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { openErrorMessageBox, openInfoMessageBox } from "../../concat/bus";
import { api_course_list_own } from "../../interface/course";
import {
  api_course_admin_list_unit_own,
  api_course_update_unit,
  api_course_unit_create,
} from "../../interface/api";
import UploadImage from '../../components/common/UploadImage.vue'
import UploadAny from '../../components/common/UploadAttachment.vue'
import UploadStream from '../../components/common/UploadStream.vue'

export default {
  components : {
    UploadImage,
    UploadAny,
    UploadStream
  },
  data: () => ({
    headers: [
      {
        text: "ID",
        value: "id",
      },
      {
        text: "标题",
        value: "title",
      },
      {
        text: "创建人",
        value: "owner",
      },
      {
        text: "创建日期",
        value: "time",
      },
      {
        text: "操作",
        value: "actions",
      },
    ],
    expanded: {
      course: [],
      units: [],
    },
    options: {},
    data: [],
    new_unit_model: {
      ppt_rid: 0,
      media_rid: 0,
      cover_rid: 0,
      name: "",
    },
    update_unit_model: {
      id: 0,
      ppt_rid: 0,
      media_rid: 0,
      cover_rid: 0,
      name: "",
    },
    new_unit: false,
    update_unit: false,
  }),
  watch: {
    options: {
      handler() {
        this.load();
      },
      deep: true,
    },
    "expanded.course": {
      handler(v) {
        if (v.length > 0) {
          this.loadUnits(v[0]);
        }
      },
      deep: true,
    },
  },
  methods: {
    toEdit(item) {
      this.$router.push(`/admin/course/edit/${item.id}`);
    },
    async commitUnit() {
      const cid = this.expanded.course[0].id;
      const { data } = await api_course_unit_create(
        cid,
        this.new_unit_model.name,
        this.new_unit_model.cover_rid,
        this.new_unit_model.ppt_rid,
        this.new_unit_model.media_rid
      );
      if (!data) {
        openErrorMessageBox("错误", "网络错误");
      } else {
        if (data["res"] != 0) {
          openErrorMessageBox("错误", data["err"]);
        } else {
          openInfoMessageBox("成功", "创建成功");
        }
      }
    },
    async loadUnits(v) {
      this.expanded.units = [];
      const { data } = await api_course_admin_list_unit_own(v.id);
      if (!data) {
        openErrorMessageBox("错误", "网络错误");
      } else {
        if (data["res"] != 0) {
          openErrorMessageBox("错误", data["err"]);
        } else {
          if (data["data"] != null) {
            this.expanded.units = data["data"];
          }
        }
      }
    },
    async load() {
      const { data } = await api_course_list_own();
      if (!data) {
        openErrorMessageBox("错误", "网络错误");
      } else {
        if (data["res"] != 0) {
          openErrorMessageBox("错误", data["err"]);
        } else {
          if (data["data"] != null) {
            this.data = data["data"];
          }
        }
      }
    },
    async commitUpdateUnit() {
      const { data } = await api_course_update_unit(
        this.update_unit_model.id,
        this.update_unit_model.cover_rid,
        this.update_unit_model.media_rid,
        this.update_unit_model.ppt_rid,
        this.update_unit_model.name
      );
      if (!data) {
        openErrorMessageBox("错误", "请检查网络连接");
      } else {
        if (data["res"] != 0) {
          openErrorMessageBox("错误", data["err"]);
        } else {
          openInfoMessageBox("成功", "更新成功");
        }
      }
    },
    openNewUnitDialog() {
      this.new_unit_model.ppt_rid = 0;
      this.new_unit_model.media_rid = 0;
      this.new_unit_model.cover_rid = 0;
      this.new_unit_model.name = "";

      this.new_unit = true;
    },
    openUpdateUnitDialog(item) {
      this.update_unit_model.ppt_rid = item.ppt_rid;
      this.update_unit_model.media_rid = item.media_rid;
      this.update_unit_model.cover_rid = item.cover_rid;
      this.update_unit_model.name = item.name;
      this.update_unit_model.id = item.id;

      this.update_unit = true;
    },
    async del(item) {
      console.log(item);
    },
  },
};
</script>

<style>
</style>