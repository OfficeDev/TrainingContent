/* 
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

<template>
<div>
    <div class="overlay"></div>
    <img class="spinner" src="/assets/spinner.gif"/>
</div>
</template>

<script lang="ts">
import * as Vue from "vue";
import Component from 'vue-class-component';

@Component({})
export default class waiting extends Vue {
    name: 'waiting'
}
</script>