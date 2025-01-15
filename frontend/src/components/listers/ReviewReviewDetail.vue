<template>
    <v-card outlined>
        <v-card-title>
            Review # {{item._links.self.href.split("/")[item._links.self.href.split("/").length - 1]}}
        </v-card-title>

        <v-card-text>
            <div>
                <Number label="ItemId" v-model="item.itemId" :editMode="editMode" @change="change" />
            </div>
            <div>
                <Number label="Rating" v-model="item.rating" :editMode="editMode" @change="change" />
            </div>
            <div>
                <String label="Text" v-model="item.text" :editMode="editMode" @change="change" />
            </div>
            <div>
                <String label="UserId" v-model="item.userId" :editMode="editMode" @change="change" />
            </div>
        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="edit" v-if="!editMode">
                Edit
            </v-btn>
            <v-btn color="primary" text @click="save" v-else>
                Save
            </v-btn>
            <v-btn v-if="!editMode" color="primary" text @click="remove">
                Delete
            </v-btn>
            <v-btn v-if="editMode" color="primary" text @click="editMode = false">
                Cancel
            </v-btn>
        </v-card-actions>
    </v-card>
</template>


<script>
const axios = require('axios').default;

export default {
    name: 'ReviewReviewDetail',
    components:{},
    props: {
        data: Object
    },
    data: () => ({
        item: null,
        editMode: false,
    }),
    async created() {
        var me = this;
        var params = this.data
        var temp = await axios.get(axios.fixUrl('/reviews/' + params.itemId))
        if(temp.data) {
            me.item = temp.data
        }
    },
    methods: {
        edit() {
            this.editMode = true;
        },
        async remove(){
            try {
                await axios.delete(axios.fixUrl(this.item._links.self.href))
                this.editMode = false;

                this.$emit('input', this.item);
                this.$emit('delete', this.item);

            } catch(e) {
                console.log(e)
            }
        },
    },
};
</script>
