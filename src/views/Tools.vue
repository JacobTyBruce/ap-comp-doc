<template>
    <v-container>
        <v-row>
            <v-col><v-img src='../assets/ascii.png'></v-img></v-col>
        </v-row>
        <v-row>
            <v-col cols="6"><h1>Decimal To Binary</h1></v-col>
            <v-col cols="6"><h1>Binary To Decimal</h1></v-col>
            <v-col cols="6"><v-text-field v-model="decInput" type="number"></v-text-field></v-col>
            <v-col cols="6"><v-text-field v-model="binInput" type="number" :rules="rules.binRules"></v-text-field></v-col>
            <v-col cols="6"><h2>{{bin}}</h2></v-col>
            <v-col cols="6"><h2>{{dec}}</h2></v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: 'Tools',
    data: function() {
        return {
            decInput: "",
            binInput: "",
            rules:{
                binRules: [
                    v => {
                        if(/[2-9]/.test(v)){
                            console.log('Contains 2-9')
                            v.replaceAll(/[2-9]/g, "")
                            return "Value Must Be Binary"
                        } else {
                            return true
                        }
                    }
                ]
            }
        }
    },
    computed: {
        bin() {
            if (this.decInput.length < 1) {return ""}
            return parseInt(this.decInput, 10).toString(2)
        },
        dec() {
            if (this.binInput.length < 1) {return ""}
            return parseInt(this.binInput, 2)
            /*
            var str = this.binInput
            var inc = 0
            var total = 0;
            while (str.length > 0) {
                if (str.charAt(str.length-1) == '1') {
                    total += Math.pow(2, inc)
                }
                inc++
                str = str.substring(0,str.length-1)
            }
            return total
            */
        }
    }
}
</script>