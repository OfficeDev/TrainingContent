<template>
  <div>
    <div class="ms-bgColor-greenDark header">
      <span class="ms-font-su ms-fontColor-white">{{title}}</span>
    </div>
    <div class="ms-MessageBanner" v-if="error">
      <div class="ms-MessageBanner-content" style="text-align: left; margin-left: 40px;">
        <div class="ms-MessageBanner-text ms-font-s-plus">
          <div class="ms-MessageBanner-clipper">
            <i class="ms-Icon ms-Icon--Error"></i>
            <span style="vertical-align: top;">&nbsp;{{error}}</span>
          </div>
        </div>
      </div>
      <button class="ms-MessageBanner-close" v-on:click="error = null;">
        <i class="ms-Icon ms-Icon--Clear"></i>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
  props: {
    title: String,
    error: String
  }
})
export default class headerComponent extends Vue {
  name: 'headerComponent';
  title: String;
  error: String;
}
</script>
