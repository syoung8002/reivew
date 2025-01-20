<template>
    <v-app>
        <v-main>
            <v-container fluid class="pa-0">
                <component v-bind:is="componentName" :data="data"></component>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import ReviewReviewManager from "./components/listers/ReviewReviewCards"
import ReviewReviewDetail from "./components/listers/ReviewReviewDetail"

export default {
    name: "App",
    components: {
        "review-review-manager": ReviewReviewManager,
        "review-review-detail": ReviewReviewDetail
    },
    props: {
        data: Object
    },
    data() {
        return {
            componentName: "review-review-manager"
        }
    },
    mounted() {
        if (this.data) {
            if (this.data.id) {
                this.componentName = "review-review-detail";
            } else {
                this.componentName = "review-review-manager";
            }
        }
    },
};
</script>


<style>
html {
    overflow: hidden;
}
</style>