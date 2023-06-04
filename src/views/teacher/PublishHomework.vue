<template>
  <v-container>
    <v-row>
      <v-col :cols="12" :sm="12" :md="6" :lg="4" :xl="3">
        <v-text-field label="作业标题" v-model="homework_title"></v-text-field>
      </v-col>
      <v-col :cols="12" :sm="12" :md="6" :lg="4" :xl="3">
        <v-menu v-model="date_picker_menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition"
          offset-y min-width="auto">
          <template v-slot:activator="{ on, attrs }">
            <v-text-field v-model="end_at" label="截止时间" prepend-icon="mdi-calendar" readonly v-bind="attrs"
              v-on="on"></v-text-field>
          </template>
          <v-date-picker v-model="end_at" @input="date_picker_menu = false"
            locale="zh-cn"></v-date-picker>
        </v-menu>
      </v-col>
      <v-col :cols="12" :sm="12" :md="6" :lg="4" :xl="3">
        <v-select label="发布到班级" :items="orgs" item-text="name" item-value="id" menu-props="auto" single-line
          v-model="target_org"></v-select>
      </v-col>
      <v-col :cols="12">
        <v-radio-group v-model="homework_type" row label="作业类型：">
          <v-radio label="文本" value="text"></v-radio>
          <v-radio label="CTF" value="ctf"></v-radio>
        </v-radio-group>
      </v-col>
      <v-col :cols="12" v-if="homework_type == 'ctf'">
        <ul class="pb5 text-grey">
          <li>CTF类型的题目的截止日期将会根据用户完成时间进行计算，规定时间未完成指定题目将会认为作业未完成</li>
          <li>下方搜索框可以根据题目名称搜索对应的题目以设置为作业</li>
        </ul>
        <v-autocomplete v-model="current_challenge.select" :items="current_challenge.search_items"
          :loading="current_challenge.loading" :search-input.sync="current_challenge.search" cache-items class="mx-4" flat
          hide-no-data hide-details solo-inverted label="选择题目">
        </v-autocomplete>
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
import {
  api_homework_publish_train
} from '../../interface/homework'
import RichEditor from "../../components/common/RichEditor.vue";
import { openErrorMessageBox, openErrorSnackbar, openInfoMessageBox } from "../../concat/bus";
import {
  api_competition_train_title_search
} from '../../interface/api'

export default {
  components: { RichEditor },
  data: () => ({
    target_org: 0,
    orgs: [],
    homework_title: "",
    homework_desc: "",
    end_at: "",
    date_picker_menu: false,
    train_id: 0,
    homework_type: 'text',
    current_challenge: {
      dialog: false,
      id: 0,
      name: '',
      unit_id: 0,
      challenge_id: 0,
      challenge_type: 0,
      score: 0,
      desc: '',
      hint: '',
      search: null,
      search_items: [],
      loading: false,
      select: '',
      timer: null,
    }
  }),
  computed: {
    endtime() {
      return parseInt(new Date(this.end_at).getTime() / 1000);
    },
  },
  watch: {
    'current_challenge.select': function (val) {
      if (val) {
        const dis = val.split(':')
        const id = parseInt(dis[0])
        if (id) {
          this.current_challenge.challenge_id = id
        }
      }
    },
    'current_challenge.search': function (val) {
      const self = this;
      const searcher = async () => {
        if (val && val === self.current_challenge.select) {
          return
        }
        if (self.current_challenge.search.length > 0) {
          self.current_challenge.loading = true
          const { data } = await api_competition_train_title_search(self.current_challenge.search, 1, 20)
          if (!data) {
            openErrorSnackbar('请检查网络连接')
          } else {
            if (data['res'] != 0) {
              openErrorSnackbar(data['err'])
            } else {
              self.current_challenge.search_items = data['data'] ? data['data'].map(v => {
                return `${v.id}:${v.title}`
              }) : []
            }
          }
          self.current_challenge.loading = false
        }
        this.current_challenge.timer = null
      }
      if (this.current_challenge.timer) {
        clearTimeout(this.current_challenge.timer)
      }
      this.current_challenge.timer = setTimeout(searcher, 500)
    }
  },
  methods: {
    publishHomework() {
      if (this.homework_type == 'text') {
        this.publishHomeworkText()
      } else if (this.homework_type == 'ctf') {
        this.publishHomeworkCTF()
      }
    },
    async publishHomeworkText() {
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
    async publishHomeworkCTF() {
      const { data } = await api_homework_publish_train(
        this.target_org,
        this.homework_title,
        this.endtime,
        this.homework_desc,
        this.current_challenge.challenge_id
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

<style></style>