<template>
  <v-container>
    <v-data-table
      :headers="homework_table_headers"
      :loading="homework_table_loading"
      :items="homework_table_data"
      :server-items-length="homework_table_tot_len"
      :options.sync="homework_table_options"
      :page.sync="homework_table_page"
      :items-per-page="10"
    >
      <template v-slot:item.actions="{ item }">
        <v-icon small @click="homeworkCommits(item)">
          mdi-chart-box-outline
        </v-icon>
      </template>
      <template v-slot:item.send="{ item }">
        <v-icon small @click="republishHomework(item.id)"> mdi-send </v-icon>
      </template>
      <template v-slot:item.time="{ item }">
        {{ new Date(item.time * 1000).formatDate("Y-M-D h:m:s") }}
      </template>
      <template v-slot:item.endtime="{ item }">
        {{ new Date(item.endtime * 1000).formatDate("Y-M-D h:m:s") }}
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import {
  api_homework_publish_list,
  api_homework_republish,
} from "../../interface/api";
import {
  closeLoadingOverlay,
  openErrorMessageBox,
  openErrorSnackbar,
  openLoadingOverlay,
  openSuccessSnackbar,
} from "../../concat/bus";

export default {
  data: () => ({
    homework_table_headers: [
      {
        text: "id",
        value: "id",
      },
      {
        text: "标题",
        value: "title",
      },
      {
        text: "组织",
        value: "org",
      },
      {
        text: "发布者",
        value: "owner",
      },
      {
        text: "发布时间",
        value: "time",
      },
      {
        text: "结束时间",
        value: "endtime",
      },
      {
        text: "提交情况",
        value: "actions",
      },
      {
        text: "再次推送",
        value: "send",
      },
    ],
    homework_table_options: {},
    homework_table_data: [],
    homework_table_loading: false,
    homework_table_tot_len: 99999,
    homework_table_page: 1,
  }),
  methods: {
    async loadPublishList() {
      const { page } = this.homework_table_options;
      const { data } = await api_homework_publish_list(page, 10);
      if (!data) {
        openErrorMessageBox("错误", "网络异常");
      } else {
        if (data["res"] != 0) {
          openErrorMessageBox("错误", data["err"]);
        } else if (data["data"]) {
          this.homework_table_data.splice(0, this.homework_table_data.length);
          for (const i of data["data"]) {
            this.homework_table_data.push({
              id: i.id,
              title: i.title,
              org: i.r_organization.name,
              owner: i.r_owner.name,
              time: i.time,
              endtime: i.endtime,
            });
          }
        }
      }
    },
    async republishHomework(hid) {
      openLoadingOverlay();
      const { data } = await api_homework_republish(hid);
      if (!data) {
        openErrorSnackbar("网络异常");
      } else {
        if (data["res"] != 0) {
          openErrorSnackbar(data["err"]);
        } else {
          openSuccessSnackbar("重新推送成功");
        }
      }
      closeLoadingOverlay();
    },
    homeworkCommits(item) {
      this.$router.push(`/homework/commits/${item.id}`);
    },
  },
  watch: {
    homework_table_options: {
      handler() {
        this.loadPublishList();
      },
      deep: true,
    },
  },
  mounted() {
    this.loadPublishList();
  },
};
</script>

<style>
</style>