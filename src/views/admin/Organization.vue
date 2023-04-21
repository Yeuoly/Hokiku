<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="6">
                <v-text-field v-model="keywords.name" label="搜索用户"></v-text-field>
                <v-btn color="primary" @click="searchUser">搜索</v-btn>
                <v-list>
                <v-list-item-group
                    color="primary"
                >
                    <v-list-item v-for="(user, index) in users" :key="index"
                        @click="selectUser(user)"
                    >
                        <v-list-item-avatar>
                            <v-checkbox
                                :value="selected_user && selected_user.uid == user.uid"
                            ></v-checkbox>
                        </v-list-item-avatar>
                        <v-list-item-content>
                            <v-list-item-icon>
                                <v-icon>mdi-account</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>{{ user.nickname }}</v-list-item-content>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
                </v-list>
            </v-col>
            <v-col cols="12" md="6">
                <v-text-field v-model="keywords.organization" label="搜索组织"></v-text-field>
                <v-btn color="primary" @click="searchOrganization">搜索</v-btn>
                <v-list>
                <v-list-item v-for="(org, index) in organization" :key="index">
                    <v-list-item-content>
                    <v-list-item-title>{{ org.name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ org.description }}</v-list-item-subtitle>
                    <v-btn color="primary" @click="appoint(selected_user.uid, org.id)">任命</v-btn>
                    </v-list-item-content>
                </v-list-item>
                </v-list>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { openErrorSnackbar } from '../../concat/bus'
import {
    api_admin_org_manager_appoint,
    api_admin_org_search
} from '../../interface/admin'
import {
    api_user_admin_search
} from '../../interface/user'

export default {
    data : () => ({
        users : [],
        organization : [],
        keywords : {
            name : '',
            organization : ''
        },
        selected_user : null,
    }),
    methods : {
        selectUser(user) {
            this.selected_user = user
        },
        async searchUser() {
            const { data } = await api_user_admin_search(1, 25, this.keywords.name)
            if (!data || data.res != 0) {
                openErrorSnackbar(data ? data['err'] : '请检查网络');
                return
            }
            this.users = data['data']['users'] || []
        },
        async searchOrganization() {
            const { data } = await api_admin_org_search(this.keywords.organization)
            if (!data || data.res != 0) {
                openErrorSnackbar(data ? data['err'] : '请检查网络');
                return
            }
            this.organization = data['data']['organizations'] || []
        },
        async appoint(uid, gid) {
            const { data } = await api_admin_org_manager_appoint(gid, uid)
            if (!data || data.res != 0) {
                openErrorSnackbar(data ? data['err'] : '请检查网络');
                return
            }
            this.searchUser()
            this.searchOrganization()
        }
    },
}
</script>

<style>

</style>