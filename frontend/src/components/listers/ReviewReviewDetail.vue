<template>
    <v-card outlined>
        <v-card-title>
            Review # {{ data && data.id ? data.id : '' }}
        </v-card-title>

        <v-card-text>
            <div>
                <String label="ItemId" v-model="item.itemId" :editMode="editMode" @change="change" />
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
            <div>
                <String label="UserImg" v-model="item.userImg" :editMode="editMode" @change="change" />
            </div>
        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="edit" v-if="!editMode">
                수정
            </v-btn>
            <v-btn color="primary" text @click="save" v-else>
                저장
            </v-btn>
            <v-btn v-if="!editMode" color="primary" text @click="remove">
                삭제
            </v-btn>
            <v-btn v-if="editMode" color="primary" text @click="editMode = false">
                취소
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
        var params = this.data;
        try {
            var temp = await axios.get(axios.fixUrl('/reviews/' + params.id))
            if(temp.data) {
                me.item = temp.data
            } else {
                me.item = null;
            }
        } catch (e) {
            console.log(e)
        }
    },
    methods: {
        edit() {
            this.editMode = true;
        },
        async remove() {
            try {
                await axios.delete(axios.fixUrl(this.item._links.self.href))
                this.editMode = false;
                this.$emit('delete', this.item);
            } catch(e) {
                console.log(e)
            }
        },
        change() {
            this.$emit('input', this.item);
        },
    },
};
</script>
