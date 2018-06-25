<template>
<div>
    <div class="overlay"></div>
    <img class="spinner" src="assets/spinner.gif"/>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({})
export default class waiting extends Vue {
  name: 'waiting'
}
</script>
