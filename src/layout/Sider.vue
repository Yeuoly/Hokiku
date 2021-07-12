<template>
    <v-navigation-drawer
        temporary
        absolute
        v-model="open"
    >
        <v-list
            dense
            nav
        >
            <v-card color="blue">
                <v-list>
                    <v-list-item class="px-2">
                        <v-list-item-avatar>
                        <v-img src="https://randomuser.me/api/portraits/women/85.jpg"></v-img>
                        </v-list-item-avatar>
                    </v-list-item>

                    <v-list-item link>
                        <v-list-item-content>
                        <v-list-item-title class="text-h7" style="color: white;">
                            未登录
                        </v-list-item-title>
                        <v-list-item-subtitle style="color: white;">qwq@gmail.com</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-card>
            
            <v-list-item
                v-for="item in routes"
                v-show="item.meta.inNav"
                :key="item.name"
                link
            >
            <v-list-item-icon>
                <v-icon>{{ item.meta.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
                <v-list-item-title style="color: grey">{{ item.meta.title }}</v-list-item-title>
            </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
import { ui_trans_bus } from '../concat/bus'
import routes from '../router/routes'

export default {
    name : "Sider",
    data : () => ({
        open : false,
        routes : routes
    }),
    mounted(){
        ui_trans_bus.$on('change-navigation-status', () => {
            this.open = !this.open
        })
    }
}
</script>