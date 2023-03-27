<template>
  <v-row>
    <v-row class="px5">
      <v-col cols="11" style="padding-top: 20px" class="pl5">
        <v-avatar size="72" class="mr5">
          <v-img :src="profile.avatar"></v-img>
        </v-avatar>
        <v-btn dark color="primary" @click="uploadAvatar">更换头像</v-btn>
      </v-col>
      <v-col cols="12" class="pl5">
        <v-text-field label="用户名" v-model="profile.id" counter="16" type="text">
          <template v-slot:append-outer>
            <v-btn @click="applyChangeName" :disabled="!isNameAvaliable">修改</v-btn>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12">
        <v-divider></v-divider>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4" xl="3" class="px5">
        <NormalInfoCard title="可用金币" :content="profile.coin.value.toString() + '￥'" />
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4" xl="3" class="px5">
        <NormalInfoCard title="冻结金币" :content="profile.coin.freeze.toString() + '￥'" />
      </v-col>
      <v-col cols="12">
        <v-divider></v-divider>
      </v-col>
      <v-col cols="12" sm="12" md="12" lg="6" xl="6" class="px4">
        <v-sheet height="550">
          <v-calendar ref="calendar" :event-overlap-threshold="30" locale="zh-cn" :events="profile.signins"></v-calendar>
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
      <v-col cols="12">
        <span class="text-grey text-14"> 储存空间: {{ percent_text }} </span>
        <v-progress-linear :value="profile.resource.percent_space"></v-progress-linear>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog.changeAvatar" width="800px">
      <v-card>
        <v-card-title>
          <span class="headline">上传头像</span>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <div class="upload-avatar">
            <UploadImage :height="200" v-model="profile.upload_avatar_mid" />
          </div>
          <v-spacer></v-spacer>
          <v-btn color="primary" dark @click="commitAvatar">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { openErrorMessageBox, openErrorSnackbar, openSuccessSnackbar } from '../../concat/bus'
import { api_signin, api_signin_list, api_user_profile, api_user_change_avatar } from '../../interface/api'
import { isAvaliableNameFormat, visitableMemberSpace } from '../../util/index'

import NormalInfoCard from '../../components/common/NormalInfoCard.vue'
import UploadImage from '../../components/common/UploadImage.vue'

export default {
  name: 'Profile',
  components: { NormalInfoCard, UploadImage },
  data: () => ({
    profile: {
      id: '',
      uid: 0,
      resource: {
        max_space: 0,
        current_space: 0,
        percent_space: 0,
      },
      avatar: '',
      upload_avatar_mid: '',
      coin: {
        value: 0,
        freeze: 0,
      },
      signins: [],
    },
    dialog: {
      changeAvatar: false,
    },
  }),
  watch: {
    'profile.resource.current_space': {
      handler() {
        this.profile.resource.percent_space = (this.profile.resource.current_space / this.profile.resource.max_space) * 100
      },
    },
    'profile.resource.max_space': {
      handler() {
        this.profile.resource.percent_space = (this.profile.resource.current_space / this.profile.resource.max_space) * 100
      },
    },
  },
  methods: {
    applyChangeName() {
      /* TODO */
    },
    async singin() {
      const { data } = await api_signin()
      if (data && data['res'] == 0) {
        openSuccessSnackbar('签到成功')
        this.loadSignin()
        this.loadProfile()
      } else {
        openErrorSnackbar(data ? data['err'] : '签到失败')
      }
    },
    async loadProfile() {
      const { data } = await api_user_profile()
      if (!data) {
        openErrorMessageBox('错误', '获取个人信息失败')
      } else {
        if (data['res'] != 0) {
          openErrorMessageBox('错误', data['err'])
        } else if (data['data']) {
          this.profile.resource.max_space = data['data']['r_resource']['max']
          this.profile.resource.current_space = data['data']['r_resource']['current']
          this.profile.coin.value = data['data']['r_trade_coin']['value']
          this.profile.coin.freeze = data['data']['r_trade_coin']['freeze']
        }
      }
    },
    async loadSignin() {
      const { data } = await api_signin_list()
      if (data && data['res'] == 0) {
        if (data['data']['logs']) {
          this.profile.signins = data['data']['logs'].map((item) => {
            return {
              name: '签到',
              start: new Date(item['time'] * 1000),
              color: 'green',
              timed: true,
            }
          })
        }
      } else {
        openErrorSnackbar(data ? data['err'] : '签到失败')
      }
    },
    uploadAvatar() {
      this.dialog.changeAvatar = true
    },
    async commitAvatar() {
      const { data } = await api_user_change_avatar(this.profile.upload_avatar_mid)
      if (data && data['res'] == 0) {
        location.href = '/home/profile'
      } else {
        openErrorSnackbar(data ? data['err'] : '上传失败')
      }
    },
  },
  computed: {
    isNameAvaliable() {
      return this.$store.getters.getUserName != this.profile.id && isAvaliableNameFormat(this.profile.id)
    },
    percent_text() {
      return `${visitableMemberSpace(this.profile.resource.current_space)} \\ ${visitableMemberSpace(this.profile.resource.max_space)}`
    },
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
    this.profile.id = this.$store.getters.getUserName
    this.profile.uid = this.$store.getters.getUserUid
    this.profile.avatar = this.$store.getters.getUserAvatar

    this.loadProfile()
    this.loadSignin()
  },
}
</script>

<style scoped>
.upload-avatar {
  width: 100%;
  height: 200px;
  background-color: #eee;
  border-radius: 5px;
  overflow: hidden;
  justify-content: center;
  align-items: center;
}
</style>
