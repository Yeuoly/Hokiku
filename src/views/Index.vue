<template>
  <v-container>
    <!-- 走马灯 -->
    <v-carousel>
    <v-carousel-item v-for="(item, i) in carouselItems" :key="i">
      <v-sheet height="100%" width="100%">
        <v-row align="center" justify="center">
          <v-col cols="12" class="text-center">
            <v-img :src="item.image" :contain="false" :cover="true"></v-img>
            <div class="text-overlay">
              <h3>{{ item.title }}</h3>
              <span>
                {{ item.content }}
              </span>
            </div>
          </v-col>
        </v-row>
      </v-sheet>
    </v-carousel-item>
  </v-carousel>
    <!-- 用户信息 -->
    <v-row justify="center" class="my-1">
      <v-col cols="12" sm="12" md="6" lg="3" xl="3">
        <v-card class="elevation-3">
          <v-card-text>
            <v-list>
              <v-list-item-group>
                <v-list-item v-for="(item, index) in userItems" :key="index" @click="$router.push(item.to)">
                  <v-list-item-icon>
                    <v-icon color="primary">{{ item.icon }}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="12" md="6" lg="9" xl="9">
        <v-card class="elevation-3">
          <v-card-title>系统公告</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item-group>
                <v-list-item v-for="(item, index) in noticeItems" :key="index">
                  <v-list-item-icon>
                    <v-icon color="primary">mdi-newspaper</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>{{ item.content }}</v-list-item-title>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <!-- 最新动态 -->
    <v-row justify="center" class="my-1">
      <v-col cols="12">
        <v-card class="elevation-3">
          <v-card-title>最新动态</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item-group>
                <v-list-item v-for="(item, index) in newsItems" :key="index">
                  <v-list-item-icon>
                    <v-icon color="primary">{{ item.icon }}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>{{ item.content }}</v-list-item-title>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { openErrorSnackbar } from '../concat/bus'
import {  
  api_boardcast_carousel_list,
  api_boardcast_newspost_list,
  api_boardcast_updatelog_list
} from '../interface/boardcast'

export default {
  data() {
    return {
        carouselItems: [],
        userItems: [
            { icon: 'mdi-account', title: '个人信息', to: '/home' },
            { icon: 'mdi-login', title: '登录', to: '/login' },
            { icon: 'mdi-account-plus', title: '注册', to: '/reg' },
            { icon: 'mdi-security', title: '安全工具', to: '/tools' },
            { icon: 'mdi-account-group', title: '博客', to: '/blog' },
        ],
        noticeItems: [],
        newsItems: []
    }
  },
  methods :{
    async loadCarousel() {
      const { data } = await api_boardcast_carousel_list(1)
      if (data) {
        if (data.res == 0) {
          this.carouselItems = data['data']['carousels']
        } else {
          openErrorSnackbar(data['err'])
        }
      } else {
        openErrorSnackbar('网络错误')
      }
    },
    async loadNews() {
      const { data } = await api_boardcast_newspost_list(1)
      if (data) {
        if (data.res == 0) {
          this.newsItems = data['data']['newsposts']
        } else {
          openErrorSnackbar(data['err'])
        }
      } else {
        openErrorSnackbar('网络错误')
      }
    },
    async loadUpdateLogs() {
      const { data } = await api_boardcast_updatelog_list(1)
      if (data) {
        if (data.res == 0) {
          this.noticeItems = data['data']['update_logs'].slice(0, 4)
        } else {
          openErrorSnackbar(data['err'])
        }
      } else {
        openErrorSnackbar('网络错误')
      }
    }
  },
  mounted() {
    this.loadCarousel()
    this.loadNews()
    this.loadUpdateLogs()
  }
}
</script>

<style scoped>
.v-list-item__icon {
  color: #1976d2;
}

.text-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #fff;
  font-size: 32px;
  font-weight: bold;
  text-shadow: 1px 1px #333;
}
</style>