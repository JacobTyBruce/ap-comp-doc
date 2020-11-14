<template>
  <v-container>
    <v-container v-if="selecting">
      <v-row>
        <v-col cols="4" class="text-center">
          <v-btn
            @click="
              type = 'docs';
              getData();
            "
            >Docs</v-btn
          >
        </v-col>
        <v-col cols="4" class="text-center">
          <v-btn
            @click="
              type = 'posts';
              getData();
            "
            >Posts</v-btn
          >
        </v-col>
        <v-col cols="4" class="text-center">
          <v-btn
            @click="
              type = 'challenges';
              getData();
            "
            >Challenges</v-btn
          >
        </v-col>
      </v-row>
      <v-row justify="center" v-if="selecting && type != null">
        <v-col cols="6" md="2">
          <v-select
            v-if="type == 'docs'"
            :items="docSelect"
            v-model="filterProp"
          ></v-select>
          <v-select
            v-if="type == 'posts'"
            :items="postSelect"
            v-model="filterProp"
          ></v-select>
          <v-select
            v-if="type == 'challenges'"
            :items="challengeSelect"
            v-model="filterProp"
          ></v-select>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field label="Search..." @input="filterData()" v-model="filterString"></v-text-field>
        </v-col>
      </v-row>
      <v-row justify="space-around">
        <v-hover v-slot:default="{ hover }" v-if="type != null">
          <v-card width="99%" class="mb-3 text-center">
            <v-card-title
              >Create New
              {{
                type.charAt(0).toUpperCase() +
                type.substring(1, type.length - 1)
              }}</v-card-title
            >
            <v-overlay :value="hover" absolute opacity=".2" color="orange">
              <v-btn @click="setData(emptyTemplate)">Create</v-btn>
            </v-overlay>
          </v-card>
        </v-hover>
        <v-hover
          v-slot:default="{ hover }"
          v-for="item in filteredData"
          :key="item._id"
        >
          <v-card
            width="32%"
            max-height="350px"
            min-height="200px"
            class="mb-6"
            style="overflow: hidden"
          >
            <v-card-title>{{ item.title }}</v-card-title>
            <v-card-subtitle>{{ item.desc }}</v-card-subtitle>
            <v-card-text v-html="item.text.substring(0, 256)"></v-card-text>
            <v-overlay :value="hover" absolute opacity=".2" color="orange">
              <v-btn @click="setData(item)">Edit</v-btn>
            </v-overlay>
          </v-card>
        </v-hover>
      </v-row>
    </v-container>
    <v-container v-if="editing == true">
      <v-row justify="space-between">
        <v-col cols="4"
          ><v-btn
            @click="
              selecting = true;
              editing = false;
              currentData = null;
              newData = {};
              saveTitle = null;
              select = null
            "
            >Back</v-btn
          ></v-col
        >
        <v-col cols="4">
          <v-dialog v-model="preview">
            <template v-slot:activator="{ on }">
              <v-btn color="orange" v-on="on"> Open Preview </v-btn>
            </template>
            <v-card>
              <v-card-title
                >{{ currentData.title }}<v-spacer /><v-btn
                  @click.stop="preview = !preview"
                  icon
                  ><v-icon>mdi-close</v-icon></v-btn
                ></v-card-title
              >
              <v-card-text
                v-if="currentData.hasOwnProperty('desc')"
                v-html="currentData.desc"
              ></v-card-text>
              <v-divider></v-divider>
              <pre
                v-if="currentData.hasOwnProperty('challenge')"
                v-html="currentData.challenge"
              ></pre>
              <v-card-text v-html="currentData.text"></v-card-text>
              <v-card-subtitle v-if="currentData.hasOwnProperty('tags')"
                ><strong
                  v-for="(tag, index) in this.currentData.tags"
                  :key="index"
                  class="ma-2"
                >
                  {{ tag }}
                </strong></v-card-subtitle
              >
            </v-card>
          </v-dialog>
        </v-col>
        <v-col cols="4">
          <v-select
            v-if="type == 'docs'"
            :items="docSelect"
            v-model="select"
          ></v-select>
          <v-select
            v-if="type == 'posts'"
            :items="postSelect"
            v-model="select"
          ></v-select>
          <v-select
            v-if="type == 'challenges'"
            :items="challengeSelect"
            v-model="select"
          ></v-select>
        </v-col>
      </v-row>
      <v-row v-if="select == 'title' || select == 'description' || select == 'text' || select == 'challenge'">
        <v-col cols="1">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn icon @click="insertFormat($event,'strong')" v-on="{ on }"><v-icon>mdi-format-bold</v-icon></v-btn>
          </template>
          <span>Bold</span>
          </v-tooltip>
          
        </v-col>
        <v-col cols="1">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn icon @click="insertFormat($event,'i')" v-on="{ on }"><v-icon>mdi-format-italic</v-icon></v-btn>
          </template>
          <span>Italicize</span>
          </v-tooltip>
          
          </v-col>
        <v-col cols="1">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn icon @click="insertFormat($event,'code')" v-on="{ on }"><v-icon>mdi-code-tags</v-icon></v-btn>
          </template>
          <span>Code Block</span>
          </v-tooltip>
          
          </v-col>
        <v-col cols="1">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn icon @click="insertFormat($event,'pre')" v-on="{ on }"><v-icon>mdi-text-box-outline</v-icon></v-btn>
          </template>
          <span>Pre-Formatted Text</span>
          </v-tooltip>
          
          </v-col>
        <v-col cols="1">
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn icon @click="insertFormat($event,'img')" v-on="{ on }"><v-icon>mdi-image</v-icon></v-btn>
            </template>
            <span>Insert Image</span>
          </v-tooltip>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="1">
          <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on"><v-icon>mdi-help</v-icon></v-btn>
              </template>
              <v-container>
                <v-row><v-icon small>mdi-format-bold</v-icon> - Bold</v-row>
                <v-row><v-icon small>mdi-format-italic</v-icon> - Italics</v-row>
                <v-row><v-icon small>mdi-code-tags</v-icon> - Code Block</v-row>
                <v-row><v-icon small>mdi-text-box-outline</v-icon> - Preformatted Text</v-row>
                <v-row><v-icon small>mdi-image</v-icon> - Insert Image</v-row>
              </v-container>
          </v-tooltip>
        </v-col>  
      </v-row>
      <v-row>
        <v-text-field
          id="title"
          ref="title"
          v-if="select == 'title'"
          :value="currentData.title"
          @input="
            newData.title = $event;
            currentData.title = $event;
            saveTitle = $event;
          "
        ></v-text-field>
        <v-text-field
          v-if="select == 'tags'"
          :value="currentData.tags"
          @input="
            newData.tags = $event.split(',');
            currentData.tags = $event.split(',');
          "
        ></v-text-field>
        <v-text-field
          v-if="select == 'ref'"
          label="Format: Title,URL;"
          :value="Object.entries(currentData.ref).join(';')"
          @input="
            newData.ref = {};
            currentData.ref = {};
            $event.split(';').forEach((item) => {
              newData.ref[item.split(',')[0]] = item.split(',')[1];
            });
            $event.split(';').forEach((item) => {
              currentData.ref[item.split(',')[0]] = item.split(',')[1];
            });
          "
        ></v-text-field>
        <v-textarea
          id="description"
          ref="description"
          v-if="select == 'description'"
          :value="currentData.desc"
          @input="
            newData.desc = $event;
            currentData.desc = $event;
          "
          @keydown.enter="
            newData.description += '<br/>';
            currentData.description += '<br/>';
          "
          auto-grow
        ></v-textarea>
        <v-textarea
          id="text"
          ref="text"
          v-if="select == 'text'"
          :value="currentData.text"
          @input="
            newData.text = $event;
            currentData.text = $event;
          "
          @keydown.enter="insertBreak($event)"
        ></v-textarea>
        <v-textarea
          id="challenge"
          ref="challenge"
          v-if="select == 'challenge'"
          :value="currentData.challenge"
          @input="
            newData.challenge = $event;
            currentData.challenge = $event;
          "
        ></v-textarea>
      </v-row>
      <v-row justify="center" align="center">
        <v-btn :color="saved" @click="saveData()" class="mr-5">Save</v-btn>
        <v-checkbox
          @click="newData.posted = !newData.posted"
          label="Post Immediately?"
        ></v-checkbox
      ></v-row>
    </v-container>
  </v-container>
</template>

<script>
export default {
  name: "TextEditor",
  data: function () {
    return {
      selecting: true,
      editing: false,
      preview: false,
      type: null,
      allData: null,
      currentData: null,
      filterString: "",
      filterProp: "",
      filteredData: [],
      saveTitle: null,
      newData: { posted: false },
      docSelect: ["title", "desc", "text", "tags", "ref"],
      postSelect: ["title", "text"],
      challengeSelect: ["title", "desc", "challenge", "text"],
      select: null,
      saved: "orange",
      emptyTemplate: {
        title: "",
        description: "",
        text: "",
        challenge: "",
        tags: [],
        ref: [],
      },
    };
  },
  methods: {
    insertBreak(e) {
      var sel = e.target.selectionStart;
      var firstHalf = e.target.value.substring(0,sel);
      var secondHalf = e.target.value.substring(sel,e.target.value.length);
      e.target.value = firstHalf+'<br/>'+secondHalf;
    },
    insertFormat(e, tag) {
      console.log(e)
      var text = document.getElementById(this.select)
      var startSel = text.selectionStart;
      var endSel = text.selectionEnd;
      var firstHalf = text.value.substring(0,startSel);
      var secondHalf = text.value.substring(endSel,text.value.length);
      var selection = text.value.substring(startSel, endSel);
      if (tag == 'img') {
        this.newData[this.select] = `${firstHalf}<${tag} src=" ">${selection}</${tag}>${secondHalf}`;
        this.currentData[this.select] = `${firstHalf}<${tag} src=" ">${selection}</${tag}>${secondHalf}`;
      } else {
        this.newData[this.select] = `${firstHalf}<${tag}>${selection}</${tag}>${secondHalf}`;
      this.currentData[this.select] = `${firstHalf}<${tag}>${selection}</${tag}>${secondHalf}`;
      }
      this.$nextTick(() => {
        this.$refs[this.select].focus()
      })
    },
    async getData() {
      try {
        var data = await this.$http.get(
          `${process.env.VUE_APP_API_URL}/api/get/${this.type}/all`
        );
        this.allData = data.data;
        this.filteredData = this.filteredData = this.allData.filter(content => {
        return content.text.toLowerCase().includes(this.filterString.toLowerCase())
        })
      } catch (error) {
        console.error(error);
      }
    },
    filterData() {
      this.filteredData = this.allData.filter(content => {
      //   var keys = Object.keys(content)
      //   console.log(keys)
      //   keys.forEach(key => {
      //     if (key == 'tags') {
      //       content.tags.forEach(item => {
      //         return item.toLowerCase().includes(this.filterString.toLowerCase())
      //       })
      //     } else if (key == 'ref' || key == '__v' || key == 'comments') {
      //       // skip over these
      //       return;
      //     } else {
      //       return content[key].toLowerCase().includes(this.filterString.toLowerCase())
      //     }
      //   })
        // add support for general search later? need to remove obs and id keys
        return content[this.filterProp].toLowerCase().includes(this.filterString.toLowerCase())
      })
    },
    setData(item) {
      console.log(item);
      this.selecting = false;
      this.editing = true;
      this.currentData = item;
      this.saveTitle = this.currentData.title;
    },
    async saveData() {
      var patchBody = {
        query: { title: this.saveTitle },
        replace: this.newData,
      };
      try {
        console.log(this.type);
        var result = await this.$http.patch(
          `${process.env.VUE_APP_API_URL}/api/update/${this.type}`,
          patchBody,
          {
            headers: {
              Authorization: `Bearer ${window.localStorage.getItem("token")}`,
            },
          }
        );
        console.log(result);
        this.saved = "green";
        this.saveTitle = this.currentData.title;
        setTimeout(() => {
          this.saved = "orange";
        }, 1000);
      } catch (err) {
        console.error = err;
        this.saved = "red";
        setTimeout(() => {
          this.saved = "orange";
        }, 1000);
      }
    },
  },
};
</script>