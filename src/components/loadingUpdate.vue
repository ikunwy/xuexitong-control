<script setup>
import { onMounted, useTemplateRef } from 'vue'
import { useLoadingStore } from '@/stores/loadingUpdateStore'
import router from '@/router'

const LoadingStore = useLoadingStore()

const loadingStart = useTemplateRef('loadingStart')
const loadingEnd = useTemplateRef('loadingEnd')

onMounted(() => LoadingStore.setContainer(loadingStart.value, loadingEnd.value))
onMounted(() => LoadingStore.isLoading())

router.beforeEach((to, from, next) => {
    LoadingStore.loadingIn(next)
})
</script>

<template>
    <div class="containerLoading" :style="{
        '--startDuration': LoadingStore.startDuration,
        '--endDuration': LoadingStore.endDuration
    }">
        <div class="start" ref="loadingStart">
            <div class="content">
                <div class="circle"></div>
                <div class="circleText">学</div>
                <div class="text">
                    <div class="layer1">
                        <span>M</span>
                        <span>O</span>
                        <span>Z</span>
                        <span>Z</span>
                        <span>O</span>
                    </div>
                    <div class="layer2">
                        <span style="--delay: 0s;">M</span>
                        <span style="--delay: .2s;">O</span>
                        <span style="--delay: .4s;">Z</span>
                        <span style="--delay: .6s;">Z</span>
                        <span style="--delay: .8s;">O</span>
                    </div>
                    <div class="linr">占位</div>
                </div>
                <div class="text_">LOADING</div>
            </div>
            <div class="progressContainer">
                <div class="text" :style="`--progress: ${LoadingStore.progress}%`">{{ LoadingStore.progress }}%</div>
                <div class="progress" :style="`width: ${LoadingStore.progress}%`"></div>
            </div>
        </div>
        <div class="end" ref="loadingEnd" :style="{ '--num': LoadingStore.portionNum }">
            <div class="portion" v-for="(portion, index) in LoadingStore.portionNum" :key="index"></div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.containerLoading {
    $start: var(--startDuration);
    $end: var(--endDuration);

    .start {
        position: fixed;
        width: 100vw;
        height: 100vh;
        background-color: #fff;
        z-index: 9999;

        .progressContainer {
            position: absolute;
            right: 6%;
            bottom: 5%;
            width: 210px;
            height: 16px;
            border: 1px solid #333;
            border-radius: 12px;
            padding: 1px;

            .text {
                position: absolute;
                left: calc(var(--progress, 0) + 5px);
                top: 50%;
                transform: translateY(-50%);
                font-size: 11px;
            }

            .progress {
                height: 100%;
                background-color: $primary;
                transition: all .1s linear;
                border-radius: 12px;
            }
        }

        .content {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            .text {
                position: relative;

                .linr {
                    font-size: 5rem;
                    opacity: 0;
                    margin-top: 40%;
                }

                .layer1,
                .layer2 {
                    position: absolute;
                    top: 40%;
                    left: 50%;
                    transform: translateX(-50%);
                    display: flex;
                    align-items: center;
                    font-size: 6rem;
                    font-weight: bold;

                    span {
                        margin-right: 16px;
                        color: $primary;

                        &:last-child {
                            margin-right: 0;
                        }
                    }
                }

                .layer2 {
                    top: calc(40% - 3px);

                    span {
                        color: #000;
                        transform-origin: center center;
                        animation: text 1.2s ease-in-out infinite alternate;
                        animation-delay: calc(var(--delay) + 0.2s);
                    }

                    @keyframes text {
                        100% {
                            transform: scaleX(0);
                            opacity: 0;
                        }
                    }
                }
            }

            .text_ {
                font-size: 1rem;
                margin-top: 10%;
                color: $primary;
                letter-spacing: .5rem;
                font-weight: bold;
            }
        }

        &.startOut {
            animation: startOut $start ease-in-out forwards;
        }

        @keyframes startOut {
            0% {
                opacity: 1;
            }

            100% {
                opacity: 0;
                display: none;
            }
        }

        .circleText {
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 200px;
            height: 200px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: $primary;
            font-size: 60px;
            font-weight: bold;
        }

        .circle {
            position: relative;
            width: 200px;
            height: 200px;
            border-radius: 50%;
            border: 3px solid rgba($color: #000000, $alpha: 0.3);
            border-bottom: 3px solid $primary;
            transition: all $start ease-in-out;
            animation: circle 1s linear infinite;


            @keyframes circle {
                0% {
                    transform: rotate(0);
                }

                100% {
                    transform: rotate(360deg);
                }
            }
        }
    }

    .end {
        position: fixed;
        width: 100vw;
        height: 100vh;
        z-index: 9998;
        display: grid;
        grid-template-columns: repeat(var(--num), 1fr);

        &.endOut {
            animation: endOut $end ease-in-out forwards;
            animation-delay: $start;

            &>div {
                animation: portionZoom $end ease-in-out forwards;
                animation-delay: $start;
            }
        }

        &>div {
            background-color: #fff;
        }

        @keyframes portionZoom {
            0% {
                width: 100%;
            }

            100% {
                width: 0;
            }
        }

        @keyframes endOut {
            100% {
                display: none;
            }
        }
    }
}
</style>

<style lang="scss">
.containerLoading {
    z-index: 999;
}
</style>

<style lang="scss" scoped>
@media (max-width: 768px) {
    .containerLoading {
        .circle {}
    }
}
</style>