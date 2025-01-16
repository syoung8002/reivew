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
            <v-col cols="auto">
                <div v-for="(count, rating) in ratingCounts" :key="rating" class="text-center align-center">
                    <v-row class="ma-0 pa-0">
                        <v-col class="pa-0">
                            <div>{{ rating }}</div>
                        </v-col>
                        <v-col class="pa-0 pt-2 pl-1 pr-1">
                            <v-progress-linear style="width:100px;"
                                :value="(count / values.length) * 100"
                                height="5"
                                color="blue"
                                rounded
                            ></v-progress-linear>
                        </v-col>
                        <v-col class="pa-0">
                            <div>{{ count }}</div>
                        </v-col>
                    </v-row>
                </div>
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
        newValue: {},
        openDialog : false,
        averageRating: 0,
        ratingCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
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
                me.calculateAverageRating(); // 초기 평균 계산
            } else {
                me.values = [];
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
    methods: {
        append(value) {
            this.newValue = {};
            this.values.push(value);
            this.calculateAverageRating(); // 평균 별점 및 제출자 수 계산
            this.$emit('input', this.values);
        },
        remove(value) {
            var where = -1;
            for (var i = 0; i < this.values.length; i++) {
                if (this.values[i]._links.self.href == value._links.self.href) {
                    where = i;
                    break;
                }
            }
            if (where > -1) {
                this.values.splice(i, 1);
                this.calculateAverageRating(); // 평균 별점 및 제출자 수 계산
                this.$emit('input', this.values);
            }
        },
        calculateAverageRating() {
            if (this.values.length === 0) {
                this.averageRating = 0;
                this.ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
                return;
            }
            const total = this.values.reduce((sum, review) => sum + (review.rating || 0), 0);
            this.averageRating = (total / this.values.length).toFixed(1); // 모든 등록된 별점의 평균 계산

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

