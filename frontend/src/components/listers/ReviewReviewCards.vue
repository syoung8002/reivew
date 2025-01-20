<template>
    <div>
        <v-row class="ma-0 pa-0 justify-center align-center">
            <v-col cols="auto" class="text-center">
                <div style="font-size:64px; font-weight: 500;">{{ averageRating }}</div>
                <v-rating
                    v-model="averageRating"
                    color="blue"
                    background-color="grey"
                    dense
                    readonly
                    length="5"
                ></v-rating>
            </v-col>
            <div>
                <div v-for="(count, rating) in ratingCounts" :key="rating">
                    <v-row class="ma-0 pa-0 justify-center align-center">
                        <div style="font-weight: 700;">{{ rating }}점</div>
                        <div class="ml-2 mr-2">
                            <v-progress-linear
                                style="width:100px;"
                                :value="(count / values.length) * 100"
                                height="5"
                                color="blue"
                                rounded
                            ></v-progress-linear>
                        </div>
                        <div style="opacity: 0.7;">{{ count }}</div>
                    </v-row>
                </div>
            </div>
            <v-divider vertical class="mx-4"></v-divider>
            <v-col cols="auto" class="text-center align-center">
                <div style="font-size:12px; font-weight: 700;">전체 리뷰수</div>
                <v-img src="/assets/icon/chat.svg" width="48" height="48" class="mx-auto"></v-img>
                <div style="font-size:32px; font-weight: 700;">{{ values.length }}</div>
            </v-col>
        </v-row>
        <v-row class="justify-center">
            <v-col v-for="(value, index) in values" :key="index" cols="auto">
                <ReviewReview :isNew="false" :value="value" @delete="remove" @edit="edit" class="mx-auto" />
            </v-col>
            <v-col cols="auto">
                <ReviewReview :isNew="true" v-model="newValue" @add="append" class="mx-auto" />
            </v-col>
        </v-row>
    </div>
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
        averageRating: 0,
        ratingCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
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
                    me.calculateAverageRating(); // 데이터 로드 후 평균 계산
                } else {
                    me.values = [];
                }
            } catch(e) {
                console.log(e);
            }
        },
        append() {
            this.getReviewList();
            this.calculateAverageRating();
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
            this.calculateAverageRating(); // 데이터 변경 후 평균 계산
        },
        edit() {
            this.getReviewList();
            this.calculateAverageRating(); // 데이터 변경 후 평균 계산
        },
        calculateAverageRating() {
            if (this.values.length === 0) {
                this.averageRating = 0;
                this.ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
                return;
            }
            const total = this.values.reduce((sum, review) => sum + (review.rating || 0), 0);
            this.averageRating = (total / this.values.length).toFixed(1);

            // 각 점수별 제출자 수 계산
            this.ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
            this.values.forEach(review => {
                if (review.rating >= 1 && review.rating <= 5) {
                    this.ratingCounts[review.rating]++;
                }
            });
        },
    }
};
</script>

<style>
</style>

