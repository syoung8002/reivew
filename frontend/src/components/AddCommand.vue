<template>
    <v-card outlined>
        <v-card-title>
            Add
        </v-card-title>

        <v-card-text>
        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="addCommand">
                Add
            </v-btn>
            <v-btn color="primary" text @click="close">
                Close
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    name: 'AddCommand',
    components:{},
    props: {},
    data: () => ({
        editMode: true,
        value: {},
    }),
    created() {
    },
    watch: {
    },
    methods: {
        addCommand() {
            this.$emit('add', this.value);
        },
        close() {
            this.$emit('closeDialog');
        },
        change() {
            this.$emit('input', this.value);
        },
    }
}
</script>

