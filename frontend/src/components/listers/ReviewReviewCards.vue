<template>
    <div>
        <v-row class="ma-0 pa-0">
            <div>
                <h1 class="pa-4">치킨집</h1>
                <v-divider></v-divider>
                <div class="pa-4 d-flex">
                    <div class="text-center mr-8">
                        <div style="font-size:64px; font-weight: 500;">{{ averageRating }}</div>
                        <v-rating
                            v-model="averageRating"
                            color="blue"
                            background-color="grey"
                            dense
                            readonly
                            length="5"
                        ></v-rating>
                    </div>
                    <div class="mr-8">
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
                    <div class="text-center align-center">
                        <div style="font-size:12px; font-weight: 700;">전체 리뷰수</div>
                        <v-img src="/assets/icon/chat.svg" width="48" height="48" class="mx-auto"></v-img>
                        <div style="font-size:32px; font-weight: 700;">{{ values.length }}</div>
                    </div>
                </div>
                <div class="pa-4">
                    <v-select
                        v-model="selectedRating"
                        :items="[1, 2, 3, 4, 5]"
                        label="별점 선택"
                        @change="filterByRating"
                        clearable
                        :clear-icon="'mdi-close-circle'"
                        placeholder="전체"
                    ></v-select>
                </div>
            </div>
            
            <v-divider vertical></v-divider>
            <v-col class="pa-0" style="width: 100%; height: 100vh;">
                <div style="height: 70vh; overflow-y: auto;">
                    <v-col class="pa-4 d-flex justify-center align-center" style="height: 100%" v-if="filteredValues.length === 0">
                        <div>해당 별점의 리뷰는 없습니다</div>
                    </v-col>
                    <v-col class="pa-4" v-for="(value, index) in filteredValues" :key="index" v-else>
                        <ReviewReview :isNew="false" :value="value" @delete="remove" @edit="edit" class="mx-auto mt-2" />
                        <v-divider></v-divider>
                    </v-col>
                </div>
                <v-divider></v-divider>
                <div style="height: 30vh; overflow: auto;">
                    <v-col class="pa-4">
                        <ReviewReview :isNew="true" v-model="newValue" @add="append" class="mx-auto" />
                    </v-col>
                </div>
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
        filteredValues: [], // 필터링된 리뷰 목록
        selectedRating: null, // 선택된 별점
        newValue: {
            'itemId': '',
            'rating': 0,
            'text': '',
            'userId': '',
            'userImg': '',
        },
        openDialog: false,
        itemId: '',
        averageRating: 0,
        ratingCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    }),
    created() {
        var me = this;
        me.itemId = '';
        me.getReviewList();
        this.filteredValues = this.values; // 전체 리뷰가 기본으로 선택되도록 초기화
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
                    me.filteredValues = me.values; // 데이터 로드 후 전체 리뷰로 초기화
                    me.calculateAverageRating();
                } else {
                    me.values = [];
                    me.filteredValues = [];
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
        filterByRating() {
            if (this.selectedRating === null) {
                this.filteredValues = this.values;
            } else {
                this.filteredValues = this.values.filter(review => review.rating === this.selectedRating);
            }
        },
    }
};
</script>

<style>
</style>

