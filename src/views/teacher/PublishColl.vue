<template>
  <v-container>
    <v-btn @click="toCreateCol"> 创建收集表 </v-btn>
    <v-data-table
      :headers="collection_table_headers"
      :loading="collection_table_loading"
      :items="collection_table_data"
      :server-items-length="collection_table_tot_len"
      :options.sync="collection_table_option"
      :page.sync="collection_table_page"
      :items-per-page="10"
      hide-default-footer
    >
      <template v-slot:item.actions="{ item }">
        <v-icon small @click="collectionCharts(item)">
          mdi-chart-box-outline
        </v-icon>
        <v-icon small @click="collectionDetail(item)"> mdi-details </v-icon>
      </template>
      <template v-slot:item.time="{ item }">
        {{ new Date(item.time * 1000).formatDate("Y-M-D h:m:s") }}
      </template>
    </v-data-table>
    <div class="text-center pt-2">
      <v-pagination
        v-model="collection_table_page"
        :length="Math.ceil(collection_table_tot_len / 10)"
      ></v-pagination>
    </div>
  </v-container>
</template>

<script>
import { openErrorMessageBox } from "../../concat/bus";
import { api_list_collection } from "../../interface/api";

export default {
  data: () => ({
    collection_table_headers: [
      {
        text: "标题",
        align: "start",
        value: "title",
      },
      {
        text: "cid",
        value: "cid",
      },
      {
        text: "类型",
        value: "type",
      },
      {
        text: "创建时间",
        value: "time",
      },
      {
        text: "操作",
        value: "actions",
      },
    ],
    collection_table_option: {},
    collection_table_loading: false,
    collection_table_data: [],
    collection_table_tot_len: 0,
    collection_table_page: 1,
  }),
  methods: {
    async getCollectionList() {
      this.collection_table_loading = true;
      const { page } = this.collection_table_option;
      const { data } = await api_list_collection(page, 10);
      if (!data) {
        openErrorMessageBox("错误", "网络异常");
      } else {
        if (data["res"] != 0) {
          openErrorMessageBox("错误", data["err"]);
        } else {
          this.collection_table_data = data["data"]["list"];
          this.collection_table_tot_len = data["data"]["count"];
        }
      }
      this.collection_table_loading = false;
    },
    toCreateCol() {
      this.$router.push("/coll/publish");
    },
    collectionCharts(item) {
      this.$router.push(`/coll/statistics/${item.cid}`);
    },
    collectionDetail(item) {
      this.$router.push(`/coll/info/${item.cid}`);
    },
  },
  watch: {
    collection_table_option: {
      handler() {
        this.getCollectionList();
      },
      deep: true,
    },
  },
  mounted() {
    this.getCollectionList();
  },
};
</script>

<style>
</style>