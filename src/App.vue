<template>
    <div id="app">
        <b-container>
            <board></board>

        </b-container>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import Board from './components/Board.vue';

    @Component({
        components: {
            Board,
        },
    })
    export default class App extends Vue {
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>
