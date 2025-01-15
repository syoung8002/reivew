import Vue from 'vue';
import App from "./App.vue";
// import VueRouter from 'vue-router';
import Managing from "./components";
import Vuetify from "vuetify/lib";
import 'vuetify/dist/vuetify.min.css';

Vue.config.productionTip = false;

// import ReviewReviewManager from "./components/listers/ReviewReviewCards"
// import ReviewReviewDetail from "./components/listers/ReviewReviewDetail"

Vue.use(Managing);
Vue.use(Vuetify);
// Vue.use(VueRouter);

// const routes = [
//     {
//         path: '/',
//         alias: '/reviews/reviews',
//         component: ReviewReviewManager
//     },
//     {
//         path: '/reviews/reviews',
//         component: ReviewReviewManager
//     },
//     {
//         path: '/reviews/reviews/:id',
//         component: ReviewReviewDetail
//     },
// ];

const vuetify = new Vuetify({});
// const appRouter = new VueRouter({ routes: routes });

const axios = require("axios").default;
// backend host url
axios.fixUrl = function(path) {
    const url = `http://localhost:8088${path}`;
    return url;
}


class ReviewElement extends HTMLElement {
    constructor() {
        super();
        this.vueInstance = null;
    }

    static get observedAttributes() {
        return ['data'];
    }
    
    attributeChangedCallback(name, oldValue, newValue) {
        if (this.vueInstance) {
            if (newValue || oldValue !== newValue) {
                this.vueInstance.$props[name] = newValue;
            }
        }
    }

    connectedCallback() {
        const data = this.getAttribute('data') || null;
        const parsedData = JSON.parse(data);

        this.vueInstance = new Vue({
            render: (h) => h(App, { props: { data: parsedData } }),
            // router: appRouter,
            vuetify,
        }).$mount();

        this.appendChild(this.vueInstance.$el);

        // if (parsedData && parsedData.itemId) {
        //     appRouter.push(`/reviews/reviews/${parsedData.itemId}`);
        // }
    }

    disconnectedCallback() {
        if (this.vueInstance) {
            this.vueInstance.$destroy();
        }
    }
}

window.customElements.define('review-app', ReviewElement);
