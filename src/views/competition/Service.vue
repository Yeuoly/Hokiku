<template>
    <v-container>
        <v-row>
            <v-col
                :cols="12"
                v-for="(i, index) in list"
                :key="index"
            >
                <service-card
                    :id="i.id"
                    :author="i.author"
                    :name="i.name"
                    :description="i.description"
                    :price="i.price"
                    :score="i.score"
                    :container_count="i.container_count"
                    :network_count="i.network_count"
                ></service-card>
                <v-divider></v-divider>
            </v-col>
            <v-col>
                <div class="text-center mt2">
                    <v-pagination
                        v-model="page"
                        :length="999"
                        :total-visible="5"
                    ></v-pagination>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import ServiceCard from '../../components/common/ServiceCard.vue';
import { openErrorSnackbar } from '../../concat/bus';
import {
    api_comp_service_public_list
} from '../../interface/service'

export default {
  components: { ServiceCard },
    data : () => ({
        page : 1,
        list : []
    }),
    watch : {
        page() {
            this.load()
        }
    },
    methods : {
        async load() {
            const { data } = await api_comp_service_public_list(this.page, 20);
            if (!data || data.res != 0) {
                openErrorSnackbar(data ? data['err'] : '请检查网络');
                return
            }

            this.list = data['data']['services'] || []
        },
    },
    mounted() {
        this.load()
    }
}
</script>

<style>

</style>