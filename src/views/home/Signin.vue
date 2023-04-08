<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="12" md="12" class="px4">
        <v-sheet height="550">
          <v-calendar
            ref="calendar"
            :event-overlap-threshold="30"
            locale="zh-cn"
            :events="profile.signins"
          ></v-calendar>
        </v-sheet>
      </v-col>
      <v-col cols="12">
        <div class="text-center">
          <v-btn @click="singin" color="green" dark :disabled="isSigned">
            <v-icon>mdi-check</v-icon>
            签到
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { api_signin, api_signin_list } from "../../interface/api";
import { openErrorSnackbar, openSuccessSnackbar } from '../../concat/bus'

export default {
  data: () => ({
    profile : {
        signins: [],
        uid : 0
    }
  }),
  methods: {
    async singin() {
      const { data } = await api_signin();
      if (data && data["res"] == 0) {
        openSuccessSnackbar("签到成功");
        this.loadSignin();
        this.loadProfile();
      } else {
        openErrorSnackbar(data ? data["err"] : "签到失败");
      }
    },
    async loadSignin() {
      const { data } = await api_signin_list();
      if (data && data["res"] == 0) {
        if (data["data"]["logs"]) {
          this.profile.signins = data["data"]["logs"].map((item) => {
            return {
              name: "签到",
              start: new Date(item["time"] * 1000),
              color: "green",
              timed: true,
            };
          });
        }
      } else {
        openErrorSnackbar(data ? data["err"] : "签到失败");
      }
    },
  },
  computed : {
    isSigned() {
      let result = false
      for (let i = 0; i < this.profile.signins.length; i++) {
        const item = this.profile.signins[i]
        if (
          item.start.getFullYear() == new Date().getFullYear() &&
          item.start.getMonth() == new Date().getMonth() &&
          item.start.getDate() == new Date().getDate()
        ) {
          result = true
          break
        }
      }
      return result
    },
  },
  mounted() {
    this.profile.uid = this.$store.getters.getUserUid

    this.loadSignin()
  }
};
</script>

<style>
</style>