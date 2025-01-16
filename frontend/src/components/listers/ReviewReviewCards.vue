<template>
    <v-row class="justify-center">
        <v-col v-for="(value, index) in values" :key="index" cols="auto" >
            <ReviewReview :isNew="false" :value="value" @delete="remove" @edit="edit" class="mx-auto" />
        </v-col>
        <v-col cols="auto">
            <ReviewReview :isNew="true" v-model="newValue" @add="append" class="mx-auto" />
        </v-col>
    </v-row>
</template>

<script>
const axios = require('axios').default;
import ReviewReview from './../ReviewReview.vue';

export default {
    name: 'ReviewReviewManager',
    components: {
        ReviewReview,
    },
    props: {
        data: Object
    },
    data: () => ({
        values: [],
        newValue: {},
        openDialog : false,
    }),
    async created() {
        var me = this;
        try {
            var temp = null;
            var url = '/reviews';
            if (me.data && me.data.itemId) {
                url = '/reviews/search/findByItemId?itemId=' + me.data.itemId;
            }
            temp = await axios.get(axios.fixUrl(url));
            if (temp.data) {
                me.values = temp.data._embedded.reviews;
            } else {
                me.value = [];
            }
            me.newValue = {
                'itemId': '',
                'rating': 0,
                'text': '',
                'userId': '',
                'userImg': '',
            }
        } catch(e) {
            console.log(e);
        }
    },
    methods:{
        append(value){
            this.newValue = {}
            this.values.push(value)
            
            this.$emit('input', this.values);
        },
        remove(value){
            var where = -1;
            for(var i=0; i<this.values.length; i++){
                if(this.values[i]._links.self.href == value._links.self.href){
                    where = i;
                    break;
                }
            }
            if(where > -1){
                this.values.splice(i, 1);
                this.$emit('input', this.values);
            }
        },
    }
};
</script>

<style>
</style>

