<template>
  <v-container>
    <v-card class="px5 py5">
      <v-row>
        <v-col :cols="12" v-for="(i, k) in sheets" :key="k">
          <v-row>
            <v-col :cols="3">
              <v-img :height="200" :src="i.r_cover.extra"></v-img>
            </v-col>
            <v-col :cols="9">
              <div class="text-20">{{ i.name }}</div>
              <div class="text-grey">
                发布时间：{{ new Date(i.time * 1000) }}
              </div>
              <div class="text-grey">教师：{{ i.r_owner }}</div>
              <div class="py3">
                <v-btn color="primary" @click="detail(i.id)">进入</v-btn>
                <v-btn color="green" @click="subcribe(i.id)" dark>订阅</v-btn>
              </div>
            </v-col>
          </v-row>
        </v-col>
        <v-col :cols="12">
          <v-pagination
            v-model="page"
            :length="99999"
            :total-visible="10"
          ></v-pagination>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import { openErrorMessageBox, openErrorSnackbar, openSuccessSnackbar } from "../../concat/bus";
import {
  api_course_sheet_list_public,
  api_course_subcribe_sheet,
} from "../../interface/course";

export default {
  data: () => ({
    sheets: [],
    page: 1,
  }),
  watch: {
    page: {
      handler() {
        this.getSheets();
      },
      immediate: true,
    },
  },
  methods: {
    detail(id) {
        this.$router.push(`/knowledge/course/sheet/${id}`)
    },
    async subcribe(id) {
      const { data } = await api_course_subcribe_sheet(id);
      if (!data) {
        openErrorMessageBox("错误", "网络异常");
      } else {
        if (data["res"] != 0) {
          openErrorSnackbar(data["err"]);
        } else {
            openSuccessSnackbar("订阅成功")
        }
      }
    },
    async getSheets() {
      const { data } = await api_course_sheet_list_public(this.page, 20);
      if (!data) {
        openErrorMessageBox("错误", "网络异常");
      } else {
        if (data["res"] != 0) {
          openErrorMessageBox("错误", data["err"]);
        } else {
          this.sheets = data["data"]["sheets"];
        }
      }
    },
  },
};
</script>

<style>
</style>