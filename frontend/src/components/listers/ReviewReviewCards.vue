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
        newValue: {
            'itemId': '',
            'rating': 0,
            'text': '',
            'userId': '',
            'userImg': '',
        },
        openDialog : false,
        itemId: '',
    }),
    created() {
        var me = this;
        me.itemId = '';
        me.getReviewList();
    },
    methods:{
        async getReviewList() {
            var me = this;
            try {
                var temp = null;
                var url = '/reviews';
                if (me.data && me.data.itemId) {
                    me.itemId = me.data.itemId;
                    url = '/reviews/search/findByItemId?itemId=' + me.itemId;
                }
                temp = await axios.get(axios.fixUrl(url));
                if (temp.data) {
                    me.values = temp.data._embedded.reviews;
                } else {
                    me.value = [];
                }
            } catch(e) {
                console.log(e);
            }
        },
        append(){
            this.getReviewList();
            this.newValue = {
                'itemId': this.itemId,
                'rating': 0,
                'text': '',
                'userId': '',
                'userImg': '',
            };
        },
        remove() {
            this.getReviewList();
        },
        edit() {
            this.getReviewList();
        }
    }
};
</script>

<style>
</style>

