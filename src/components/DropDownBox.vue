<template>
    <div class="select-container">
        <input type="text" class="input" readonly="readonly" :value="Reset" @click="click" @blur="blur">
        <div class="select">
            <div class="option" v-if="option">
                <template v-for="(item, index) in list" :key="index">
                    <div @click="optionfun(item)">{{item.name}}</div>
                </template>
            </div>
        </div>
    </div>
</template>
<script>
    import {
        ref,
        watch,
        toRefs,
        reactive,
        defineComponent,
        getCurrentInstance,
    } from 'vue';
    export default {
        props: {
            list: {
                type: Array,
                default: () => ([])
            },
            value: {
                type: Number
            }
        },
        setup(props, ctx) {
            const { proxy } = getCurrentInstance();
            const state = reactive({
                option: false,
                Reset: ''
            })
            const click = () => {
                state.option = !state.option
            }
            const blur = () => {
                setTimeout(function () {
                    state.option = false
                }, 500)
            }
            const optionfun = (eve) => {
                state.Reset = eve.name
                ctx.emit("DropDownBox", eve.value);
            }
            watch(
                props,
                (newProps) => {
                    state.Reset=''
                }
            );
            return {
                ...toRefs(state),
                click,
                blur,
                optionfun,
            }
        },
    }
</script>
<style scoped>
    .input {
        height: 25px;
        border-radius: 5px;
        border: 0.75px solid #696969;
        width: 170px;
    }

    .select {
        position: relative;
        top: 0;
        left: 0;
    }

    .option {
        position: absolute;
        top: 1px;
        left: 0;
        border: 1px solid #c5c5c5;
        border-radius: 5px;
        background-color: #fff;
    }

    .option div {
        background-color: #fff;
        width: 170px;
        padding: 3px;
        color: #8f8f8f;
        border-radius: 5px;

    }

    .option div:hover {
        color: #ffffff;
        background-color: #42A5F5;
    }

    .option div:active {
        color: #ffffff;
        background-color: #a1d5ff;
    }
</style>