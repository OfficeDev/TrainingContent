<template>
  <div class="pct100 itemRow">
    <div class="left ms-font-l">{{symbol}}</div>
    <div class="right">
      <div class="left icon"><i class="ms-Icon ms-Icon--Refresh" aria-hidden="true" v-on:click="refreshSymbol(index)"></i></div>
      <div class="left icon"><i class="ms-Icon ms-Icon--Delete" aria-hidden="true" v-on:click="deleteSymbol(index)"></i></div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
  props: {
    symbol: String,
    index: Number
  },
  methods: {
    refreshSymbol(index:Number) {
      this.$emit("refreshSymbol", index);
    },
    deleteSymbol(index:Number) {
      this.$emit("deleteSymbol", index);
    }
  }
})
export default class stock extends Vue {
  name: 'stock';
  symbol: string;
  index: Number;
}
</script>