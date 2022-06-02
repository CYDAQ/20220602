<template>
    <div class="Prompt" v-if="Prompt">
        {{Visiable}}
    </div>
</template>
<script>
    import { defineComponent, } from 'vue';
    export default defineComponent({
        props: {
            Visiable: {
                default: false
            },
            Prompt:Boolean
        },
        setup() {
            return {
            }
        }
    })
</script>
<style scoped>
    @import "../style/style.css";

    .Prompt {
        text-align: center;
        position: fixed;
        left: 50%;
        top: 300px;
        width: 150px;
        margin-left: -95px;
        padding: 20px;
        background-color: rgb(255, 255, 255);
        border-radius: 15px;
        z-index: 9999;
        box-shadow: 1px 1px 10px rgba(190, 190, 190, 0.4);
    }
</style>