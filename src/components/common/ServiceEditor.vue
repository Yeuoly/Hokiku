<template>
  <div>
    <v-btn color="primary" @click="addNode()"> 新建节点 </v-btn>
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
            <v-text-field
              v-model="dailog.current_container.flag_command"
              label="flag"
            ></v-text-field>
            <v-divider class="py2"></v-divider>
            <v-btn color="success" @click="addSubnet(dailog.current_container)">
              添加网络
            </v-btn>
            <div
              v-for="(network, index) in dailog.current_container.networks"
              :key="index"
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
                <v-col :cols="4">
                    <v-select
                        v-model="port.subnet"
                        :items="networks"
                        label="子网"
                    ></v-select>
                </v-col>
                <v-col :cols="4">
                  <v-text-field v-model="port.protocol" label="协议">
                  </v-text-field>
                </v-col>
                <v-col :cols="4">
                  <v-text-field v-model="port.port" label="容器端口">
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
import Vue from "vue";
Vue.component("network", Network);
import "vue-vis-network/node_modules/vis-network/dist/vis-network.css";

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
    addNode() {
      const id = new Date().getTime();
      this.containers.push({
        id: id,
        name: "Service " + id,
        flag_command: "echo $flag > /tmp/flag",
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
    deletePort(container, index) {
      container.ports.splice(index, 1);
    },
    addPort(container) {
      container.ports.push({
        port: "",
        protocol: "",
        subnet : ""
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