<template>
    <v-container>
        <v-container v-if="selecting">
            <v-row>
                <v-col cols='4' class='text-center'>
                    <v-btn @click="type='docs';getData()">Docs</v-btn>
                </v-col>
                <v-col cols='4' class='text-center'>
                    <v-btn @click="type='posts';getData()">Posts</v-btn>
                </v-col>
                <v-col cols='4' class='text-center'>
                    <v-btn @click="type='challenges';getData()">Challenges</v-btn>
                </v-col>
            </v-row>
            <v-row justify="space-around">
                <v-hover v-slot:default="{hover}" v-for="item in allData" :key='item._id'>
                    <v-card width='32%' max-height='350px' min-height="200px" class="mb-6" style='overflow: hidden'>
                        <v-card-title>{{item.title}}</v-card-title>
                        <v-card-subtitle>{{item.desc}}</v-card-subtitle>
                        <v-card-text v-html="item.text.substring(0,256)"></v-card-text>
                        <v-overlay :value='hover' absolute opacity=".2" color="orange">
                            <v-btn @click="setData(item)">Edit</v-btn>
                        </v-overlay>
                    </v-card>
                </v-hover>
            </v-row>
        </v-container>
        <v-container v-if="editing==true">
            <v-row justify="space-between">
                <v-col cols='3'><v-btn @click="selecting=true;editing=false;currentData=null;newData={};saveTitle=null">Back</v-btn></v-col>
                <v-col cols='4'>
                    <v-select v-if="type=='docs'" :items="docSelect" v-model="select"></v-select>
                    <v-select v-if="type=='posts'" :items="postSelect" v-model="select"></v-select>
                    <v-select v-if="type=='challenges'" :items="challengeSelect" v-model="select"></v-select>
                </v-col>
            </v-row>
            <v-row>
                <v-text-field v-if="select=='title'" :value="currentData.title" @input='newData.title=$event;currentData.title=$event'></v-text-field>
                <v-text-field v-if="select=='tags'" :value="currentData.tags" @input='newData.tags=$event;currentData.tags=$event'></v-text-field>
                <v-text-field v-if="select=='references'" :value="currentData.refs" @input='newData.refs=$event;currentData.refs=$event'></v-text-field>
                <v-textarea v-if="select=='description'" :value="currentData.desc" @input='newData.desc=$event;currentData.desc=$event'></v-textarea>
                <v-textarea v-if="select=='text'" :value="currentData.text" @input='newData.text=$event;currentData.text=$event'></v-textarea>
                <v-textarea v-if="select=='challenge'" :value="currentData.challenge" @input='newData.challenge=$event;currentData.challenge=$event'></v-textarea>
            </v-row>
            <v-row justify="center"><v-btn :color='saved' @click="saveData();saved='green';">Save</v-btn></v-row>
        </v-container>
    </v-container>
</template>

<script>
export default {
    name: 'TextEditor',
    data: function() {
        return {
            selecting: true,
            editing: false,
            type: null,
            allData: null,
            currentData: null,
            saveTitle: null,
            newData: {},
            docSelect: ["title","description","text","tags","references"],
            postSelect: ["title","text"],
            challengeSelect: ["title","description","challenge","text"],
            select: null,
            saved: 'orange',
        }
    },
    methods: {
        async getData() {
            try {
                var data = await this.$http.get(`${process.env.VUE_APP_API_URL}/api/get/${this.type}/all`)
                this.allData = data.data
            } catch (error) {
                console.error(error)
            }
        },
        setData(item) {
            this.selecting = false;
            this.editing = true;
            this.currentData = item;
            this.saveTitle = this.currentData.title
        },
        async saveData() {
            var patchBody = {
                query: {title: this.saveTitle},
                replace: this.newData
            }
            try {
                console.log(this.type)
                var result = await this.$http.patch(`${process.env.VUE_APP_API_URL}/api/update/${this.type}`, patchBody, {
                    headers: {
                        'Authorization': `Bearer ${window.sessionStorage.getItem('token')}`
                    }
                })
                console.log(result)
            } catch (err) {
                console.error = err;
            }
        }
    }
}
</script>