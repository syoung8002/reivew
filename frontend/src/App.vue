<template>
    <v-app>
        <v-main>
            <v-container fluid>
                <!-- <review-review-detail></review-review-detail> -->
                <review-review-manager :data="data"></review-review-manager>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import ReviewReviewManager from "./components/listers/ReviewReviewCards"
// import ReviewReviewDetail from "./components/listers/ReviewReviewDetail"

export default {
    name: "App",
    components: {
        "review-review-manager": ReviewReviewManager,
        // "review-review-detail": ReviewReviewDetail
    },
    props: {
        data: Object
    },
    mounted() {
        console.log(this.data)
        if (this.data) {
            if (this.data.itemId) {
                //
            } else if (this.data.reviewId) {
                //
            }
        }
    }
};
</script>

<style>
</style>