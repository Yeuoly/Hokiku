<template>
  <div>
    <v-btn color="primary" @click="addNode()"> 新建节点 </v-btn>
    <v-btn color="primary" @click="convertCompose()"> 转换DockerComopose </v-btn>
    <div
      :style="{
        height: height + 'px',
        width: '100%',
      }"
    >
      <network
        style="height: 100%; width: 100%"
        :nodes="nodes"
        :edges="edges"
        :options="networkOptions"
        @select-node="selectNode"
      >
      </network>
      <v-dialog v-model="dailog.show" max-width="800">
        <v-card v-if="dailog.current_container">
          <v-card-title class="headline">{{
            dailog.current_container.name
          }}</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="dailog.current_container.name"
              label="名称"
            ></v-text-field>
            <v-text-field
              v-model="dailog.current_container.image_name"
              label="镜像"
            ></v-text-field>
            <v-divider class="py2"></v-divider>
            <v-btn color="success" @click="addFlag(dailog.current_container)">
              添加flag
            </v-btn>
            <div
              v-for="(flag, index) in dailog.current_container.flags"
              :key="'flag' + index"
            >
              <v-row>
                <v-col :cols="4">
                  <v-text-field v-model="flag.flag_uuid" label="flag id"></v-text-field>
                </v-col>
                <v-col :cols="4">
                  <v-text-field v-model="flag.flag_command" label="flag command"></v-text-field>
                </v-col>
                <v-col :cols="4">
                  <v-text-field v-model.number="flag.flag_score" label="flag分值">
                    <template v-slot:append>
                      <v-btn
                        small
                        color="red"
                        dark
                        @click="deleteFlag(dailog.current_container, index)"
                      >
                        删除
                      </v-btn>
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>
            </div>
            <v-divider class="py2"></v-divider>
            <v-btn color="success" @click="addSubnet(dailog.current_container)">
              添加网络
            </v-btn>
            <div
              v-for="(network, index) in dailog.current_container.networks"
              :key="'network' + index"
            >
              <v-row>
                <v-col :cols="12">
                  <v-text-field v-model="network.subnet" label="子网">
                    <template v-slot:append>
                      <v-btn
                        small
                        color="red"
                        dark
                        @click="deleteSubnet(dailog.current_container, index)"
                      >
                        删除
                      </v-btn>
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>
            </div>
            <v-divider class="py2"></v-divider>
            <v-btn color="success" @click="addPort(dailog.current_container)">
              添加端口映射
            </v-btn>
            <div
              v-for="(port, index) in dailog.current_container.ports"
              :key="index"
            >
              <v-row>
                <v-col :cols="6">
                  <v-select
                    label="协议"
                    :items="['tcp', 'udp']"
                    v-model="port.protocol"
                  ></v-select>
                </v-col>
                <v-col :cols="6">
                  <v-text-field v-model.number="port.port" label="容器端口">
                    <template v-slot:append>
                      <v-btn
                        small
                        color="red"
                        dark
                        @click="deletePort(dailog.current_container, index)"
                      >
                        删除
                      </v-btn>
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="dailog.show = false">
              关闭
            </v-btn>
            <v-btn
              color="red darken-1"
              text
              @click="deleteContainer(dailog.current_container)"
            >
              删除
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import { Network } from "vue-vis-network";
import { getUuid } from '../../util/uuid'
import Vue from "vue";
Vue.component("network", Network);
import "vue-vis-network/node_modules/vis-network/dist/vis-network.css";

import {
  api_comp_service_compose_convert
} from '../../interface/service'
import { openErrorSnackbar, openSuccessSnackbar } from '../../concat/bus';

const parse_service_to_front_config = (servicex) => {
    console.log(servicex.containers)
    const containers = []
    let index = 0
    for(const container of servicex.containers) {
        const container_obj = {
            id : index,
            name : 'Service ' + index++,
            image_name : container.image,
            flags : [],
            ports : [],
            networks : []
        }
        if (container.flags) {
            for (const flag of container.flags) {
                const flag_obj = {
                    flag_command : flag.flag_command,
                    flag_score : flag.flag_score,
                    flag_uuid : flag.flag_uuid
                }
                container_obj.flags.push(flag_obj)
            }
        }
        if (container.ports) {
            for (const port of container.ports) {
                const port_obj = {
                    port : port.port,
                    protocol : port.protocol
                }
                container_obj.ports.push(port_obj)
            }
        }
        if (container.networks) {
            for (const network of container.networks) {
                const network_obj = {
                    subnet : network.subnet
                }
                container_obj.networks.push(network_obj)
            }
        }
        containers.push(container_obj)
    }
    return {
        total_score : servicex.total_score,
        network_count : servicex.network_count,
        container_count : servicex.container_count,
        containers
    }
}

export default {
  props: {
    height: {
      type: Number,
      default: 500,
    },
    containers : {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    networks() {
        const networks = [];
        this.containers.forEach((container) => {
            container.networks.forEach((network) => {
            if (!networks.includes(network.subnet)) {
                networks.push(network.subnet);
            }
            });
        });
        return networks;
    },
    nodes() {
      return this.containers.map((container) => {
        return {
          id: container.id,
          label:
            container.name +
            "\n" +
            container.image_name +
            "\n" +
            container.networks
              .map((network) => {
                return `子网：${network.subnet}`;
              })
              .join("\n") +
            (container.ports
              ? "\n" +
                container.ports
                  .map((port) => {
                    return `映射端口：${port.port}/${port.protocol}`;
                  })
                  .join("\n")
              : ""),
        };
      });
    },
    edges() {
      const edges = [];
      this.containers.forEach((container) => {
        container.networks.forEach((network) => {
          this.containers.forEach((container2) => {
            container2.networks.forEach((network2) => {
              if (
                network.subnet === network2.subnet &&
                container.id !== container2.id
              ) {
                // check if the edge already exists
                const edgeExists = edges.some((edge) => {
                  return (
                    (edge.from === container.id && edge.to === container2.id) ||
                    (edge.from === container2.id && edge.to === container.id)
                  );
                });
                if (edgeExists) return;
                edges.push({
                  from: container.id,
                  to: container2.id,
                });
              }
            });
          });
        });
      });
      return edges;
    },
  },
  data() {
    return {
      dailog: {
        show: false,
        current_container: null,
      },
      networkOptions: {
        physics: false,
        layout: {},
        nodes: {
          shape: "box",
          color: {
            background: "#ffffff",
            border: "#2B7CE9",
          },
        },
        edges: {
          color: "#2B7CE9",
          length: 200,
        },
      },
    };
  },
  methods: {
    async convertCompose() {
      // open a selector to select the compose file and read it
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".yml,.yaml";
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const text = await file.text();
        const { data } = await api_comp_service_compose_convert(text);
        if (data && data['res'] == 0) {
          openSuccessSnackbar('转换完成')
          const service = data['data']['Config']
          const config = parse_service_to_front_config(service)
          this.containers = config.containers
        } else {
          openErrorSnackbar(data ? data['err'] : '转换失败')
        }
      };
      input.click();
    },
    addNode() {
      const id = new Date().getTime();
      this.containers.push({
        id: id,
        name: "Service " + id,
        flags : [],
        image_name: "<none>:<none>",
        networks: [],
        ports: [],
      });
    },
    selectNode(item) {
      const nodes = item.nodes;
      if (nodes.length === 0) return;
      const id = nodes[0];
      this.dailog.current_container = this.containers.find((container) => {
        return container.id === id;
      });
      this.dailog.show = true;
    },
    deleteSubnet(container, index) {
      container.networks.splice(index, 1);
    },
    addSubnet(container) {
      container.networks.push({
        subnet: "",
      });
    },
    addFlag(container) {
      container.flags.push({
        flag_uuid : getUuid(),
        flag_command : "echo $flag > /tmp/flag",
        flag_score : 100,
      })
    },
    deleteFlag(container, index) {
      container.flags.splice(index, 1);
    },
    deletePort(container, index) {
      container.ports.splice(index, 1);
    },
    addPort(container) {
      container.ports.push({
        port: "",
        protocol: "",
      });
    },
    deleteContainer(container) {
      const index = this.containers.indexOf(container);
      this.containers.splice(index, 1);
      this.dailog.show = false;
    },
  },
};
</script>