<template>
  <v-container>
    <v-row>
      <v-col :cols="12" :sm="12" :md="6" :lg="4" :xl="3">
        <v-text-field label="作业标题" v-model="homework_title"></v-text-field>
      </v-col>
      <v-col :cols="12" :sm="12" :md="6" :lg="4" :xl="3">
        <v-menu
          v-model="date_picker_menu"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="end_at"
              label="截止时间"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="end_at"
            @input="date_picker_menu = false"
            :min="new Date().formatDate('Y-M-D')"
            locale="zh-cn"
          ></v-date-picker>
        </v-menu>
      </v-col>
      <v-col :cols="12" :sm="12" :md="6" :lg="4" :xl="3">
        <v-select
          label="发布到班级"
          :items="orgs"
          item-text="name"
          item-value="id"
          menu-props="auto"
          single-line
          v-model="target_org"
        ></v-select>
      </v-col>
      <v-col :cols="12" :sm="12" :md="12" :lg="12" :xl="12">
        <rich-editor v-model="homework_desc"></rich-editor>
      </v-col>
      <v-col :cols="12">
        <v-btn color="primary" @click="publishHomework">发布</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {
  api_homework_publish,
  api_organization_manage_list_orgs,
} from "../../interface/api";
import RichEditor from "../../components/common/RichEditor.vue";
import { openErrorMessageBox, openInfoMessageBox } from "../../concat/bus";

export default {
  components: { RichEditor },
  data: () => ({
    target_org: 0,
    orgs: [],
    homework_title: "",
    homework_desc: "",
    end_at: "",
    date_picker_menu: false,
  }),
  computed: {
    endtime() {
      return parseInt(new Date(this.end_at).getTime() / 1000);
    },
  },
  methods: {
    async publishHomework() {
      const { data } = await api_homework_publish(
        this.target_org,
        this.homework_title,
        this.endtime,
        this.homework_desc
      );
      if (!data) {
        openErrorMessageBox("错误", "网络异常");
      } else {
        if (data["res"] != 0) {
          openErrorMessageBox("错误", data["err"]);
        } else {
          openInfoMessageBox("成功", "发布成功");
        }
      }
    },
    async loadOrganizations() {
      const { data } = await api_organization_manage_list_orgs();
      if (!data) {
        openErrorMessageBox("错误", "网络异常");
      } else {
        if (data["res"] != 0) {
          openErrorMessageBox("错误", data["err"]);
        } else {
          this.orgs = data["data"];
        }
      }
    },
  },
  mounted() {
    this.loadOrganizations();
  },
};
</script>

<style>
</style>