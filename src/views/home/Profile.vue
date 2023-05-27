<template>
  <v-row class="px5">
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
      <v-col cols="12" sm="12" md="6" lg="4" xl="3" class="px5">
        <NormalInfoCard title="UID" :content="profile.uid.toString()" icon="mdi-card-account-details-outline" />
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4" xl="3" class="px5">
        <NormalInfoCard title="注册时间" :content="new Date(profile.regtime * 1000).toLocaleDateString()" icon="mdi-calendar-range" />
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4" xl="3" class="px5">
        <NormalInfoCard title="邮箱" :content="profile.email" icon="mdi-email-outline" />
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4" xl="3" class="px5">
        <NormalInfoCard title="可用金币" :content="profile.coin.value.toString() + '￥'" icon="mdi-currency-btc" />
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4" xl="3" class="px5">
        <NormalInfoCard title="冻结金币" :content="profile.coin.freeze.toString() + '￥'" icon="mdi-lock-outline" />
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4" xl="3" class="px5">
        <NormalInfoCard title="累计在线时长" :content="total_living_time" icon="mdi-clock-outline" />
      </v-col>
      <v-col :cols="12">
        <v-divider></v-divider>
      </v-col>
      <v-col :cols="12">
        <v-card-text class="blue--text" style="font-weight: 600;">
          <v-icon color="blue">
            mdi-account-multiple
          </v-icon>
          第三方账号绑定
        </v-card-text>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4" xl="3" class="px5" style="padding-top: 0%;">
        <v-card>
          <v-card-text @click="bindGithub()" class="clickable">
              <v-icon size="60" class="pr3 left" :color="profile.bind.github.id ? 'primary' : 'grey'">
                mdi-github
              </v-icon>
              <div class="left pt3">
                <span class="text-primary text-12"> {{ profile.bind.github.id ? '已绑定' : '未绑定' }} </span><br>
                <span class="text-grey text-12"> {{ profile.bind.github.id ? 'Github账户' + profile.bind.github.name : '' }} </span>
              </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4" xl="3" class="px5" style="padding-top: 0%;">
        <v-card>
          <v-card-text>
              <v-icon size="60" class="pr3" :color="profile.bind.wechat.id ? 'green' : 'grey'">
                mdi-wechat
              </v-icon>
              {{ profile.bind.wechat.id || '未绑定' }}
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="4" xl="3" class="px5" style="padding-top: 0%;">
        <v-card>
          <v-card-text>
              <v-icon size="60" class="pr3" :color="profile.bind.qq.id ? 'green' : 'grey'">
                mdi-qqchat
              </v-icon>
              {{ profile.bind.qq.id || '未绑定' }}
          </v-card-text>
        </v-card>
      </v-col>
      <v-col :cols="12">
        <v-divider></v-divider>
      </v-col>
      <v-col cols="12" style="height: 400px">
        <today-date-value-smooth-chart
          title="今日在线时间"
          subtext="今天你卷了多久呢？"
          :model="living_continus_list"
        ></today-date-value-smooth-chart>
      </v-col>
      <v-col cols="12">
        <span class="text-grey text-14"> 储存空间: {{ percent_text }} </span>
        <v-progress-linear :value="profile.resource.percent_space"></v-progress-linear>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog.changeAvatar" width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">上传头像</span>
        </v-card-title>
        <v-card-actions>
          <div class="upload-avatar">
            <UploadImage :height="200" v-model="profile.upload_avatar_mid" />
          </div>
        </v-card-actions>
        <v-card-actions>
          <v-btn color="primary" dark @click="commitAvatar">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { openErrorMessageBox, openErrorSnackbar } from '../../concat/bus'
import { api_user_profile, api_user_change_avatar } from '../../interface/api'
import { isAvaliableNameFormat, visitableMemberSpace } from '../../util/index'
import {
  api_user_living_continus_list
} from '../../interface/user'

import NormalInfoCard from '../../components/common/NormalInfoCard.vue'
import UploadImage from '../../components/common/UploadImage.vue'
import TodayDateValueSmoothChart from '../../components/charts/TodayDateValueSmoothChart.vue'

export default {
  name: 'Profile',
  components: { NormalInfoCard, UploadImage, TodayDateValueSmoothChart },
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
      living : {
        total : 0,
        logs : [],
        page : 1
      },
      regtime: 0,
      email : '',
      bind : {
        github : {
          id : '',
          name : '',
        },
        wechat : {
          id : '',
          name : '',
        },
        qq : {
          id : '',
          name : '',
        }
      }
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
          this.profile.living.total = data['data']['r_living_time']
          this.profile.regtime = data['data']['r_user']['regtime']
          this.profile.email = data['data']['r_user']['email']

          if (data['data']['account_bind']['github']) {
            this.profile.bind.github.id = data['data']['account_bind']['github']['github_id']
            this.profile.bind.github.name = data['data']['account_bind']['github']['github_name']
          }
        }
      }
    },
    async loadLivingTime() {
      const { data } = await api_user_living_continus_list(this.profile.living.page, 50)
      if (!data) {
        openErrorMessageBox('错误', '获取个人信息失败')
      } else {
        if (data['res'] != 0) {
          openErrorMessageBox('错误', data['err'])
        } else if (data['data']) {
          this.profile.living.logs = [...this.profile.living.logs, ...data['data']['users']]
        }
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
    bindGithub() {
      if (this.profile.bind.github.id) {
        location.href = 'https://github.com/' + this.profile.bind.github.name
      } else {
        let redirect_uri = ''
        if (process.env.NODE_ENV == 'development') {
          redirect_uri = encodeURIComponent('http://iotshield.dev.fe.srmxy.cn/redirect?method=bind&type=github')
        } else {
          redirect_uri = encodeURIComponent('http://iotshield.srmxy.cn/redirect?method=bind&type=github')
        }
        
        console.log(redirect_uri)
        if (process.env.NODE_ENV == 'development') {
          location.href = 'https://github.com/login/oauth/authorize?client_id=ccc253ed568ac83adce5&redirect_uri=' + redirect_uri
        } else {
          location.href = 'https://github.com/login/oauth/authorize?client_id=233a2340b9410297d6a2&redirect_uri=' + redirect_uri
        }
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
    living_continus_list() {
      const list = {
        time : [],
        value : []
      }
      for (let i = 0; i < this.profile.living.logs.length; i++) {
        const item = this.profile.living.logs[i]
        const start_time = item.created_at
        const end_time = item.updated_at
        console.log(start_time, end_time)
        for (let j = start_time; j <= end_time; j += 60) {
          list.time.push(j)
          list.value.push(1)
        }
      }
      return list
    },
    total_living_time() {
      const total = this.profile.living.total
      const hour = Math.floor(total / 3600)
      const minute = Math.floor((total - hour * 3600) / 60)
      const second = total - hour * 3600 - minute * 60
      return `${hour}时 ${minute}分 ${second}秒`
    }
  },
  mounted() {
    this.profile.id = this.$store.getters.getUserName
    this.profile.uid = this.$store.getters.getUserUid
    this.profile.avatar = this.$store.getters.getUserAvatar

    this.loadProfile()
    this.loadLivingTime()
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
