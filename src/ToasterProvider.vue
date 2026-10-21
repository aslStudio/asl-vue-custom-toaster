<template>
  <slot />
  <Teleport to="body">
    <div class="asl-custom-toaster" role="region" aria-label="Уведомления" @mouseenter="service.pause()" @mouseleave="service.resume()" @focusin="service.pause()" @focusout="service.resume()">
      <TransitionGroup name="asl-custom-toast" tag="div" class="asl-custom-toaster__list">
        <div v-for="(toast, index) in service.list.value" :key="toast.id" class="asl-custom-toaster__item" :class="[`asl-custom-toaster__item--${toast.view}`, { 'asl-custom-toaster__item--stacked': !expanded && index > 0 }]" :style="{ '--asl-stack-index': index }" :role="toast.view === 'danger' ? 'alert' : 'status'" tabindex="0" @click="onClick(toast.id)" @keydown.enter.prevent="onClick(toast.id)" @keydown.space.prevent="onClick(toast.id)">
          <slot name="toast" :toast="toast" :close="() => service.remove(toast.id)">
            <span class="asl-custom-toaster__text">{{ toast.title }}</span>
            <button type="button" class="asl-custom-toaster__close" :aria-label="`Закрыть: ${toast.title}`" @click.stop="service.remove(toast.id)">×</button>
          </slot>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
<script setup lang="ts">
import { provide, ref, onBeforeUnmount } from 'vue'
import { createToaster, TOASTER_KEY } from './model'
const props = withDefaults(defineProps<{ max?: number; duration?: number }>(), { max: 3, duration: 5000 })
const service = createToaster(props)
provide(TOASTER_KEY, service)
const expanded = ref(false)
let collapseTimer: ReturnType<typeof setTimeout> | undefined
function onClick(id: number) {
  if (service.list.value.length > 1 && !expanded.value) {
    expanded.value = true; service.pause()
    collapseTimer = setTimeout(() => { expanded.value = false; service.resume() }, 5000)
  } else service.remove(id)
}
onBeforeUnmount(() => { clearTimeout(collapseTimer); service.clear() })
</script>
<style>
.asl-custom-toaster{position:fixed;z-index:1000;top:24px;left:50%;transform:translateX(-50%);width:min(350px,calc(100vw - 32px));pointer-events:none}.asl-custom-toaster__list{display:grid;gap:8px}.asl-custom-toaster__item{display:flex;align-items:center;gap:12px;padding:12px 16px;min-height:48px;border-radius:16px;background:var(--asl-custom-toast-base,#167347);color:#fff;box-shadow:0 4px 16px #0002;font:500 14px/1.35 system-ui,sans-serif;pointer-events:auto;cursor:pointer;transition:transform .2s,opacity .2s;overflow-wrap:anywhere}.asl-custom-toaster__item--danger{background:var(--asl-custom-toast-danger,#bb3038)}.asl-custom-toaster__item--primary{background:var(--asl-custom-toast-primary,#242a36)}.asl-custom-toaster__item--stacked{transform:translateY(calc(var(--asl-stack-index) * -3px)) scale(calc(1 - var(--asl-stack-index) * .03));opacity:.8}.asl-custom-toaster__text{flex:1}.asl-custom-toaster__close{color:inherit;background:none;border:0;font:24px/1 system-ui;min-width:32px;min-height:32px;cursor:pointer}.asl-custom-toaster__close:focus-visible{outline:2px solid currentColor;outline-offset:2px}.asl-custom-toast-enter-active,.asl-custom-toast-leave-active{transition:transform .2s,opacity .2s}.asl-custom-toast-enter-from,.asl-custom-toast-leave-to{transform:translateY(-12px);opacity:0}@media(prefers-reduced-motion:reduce){.asl-custom-toaster__item,.asl-custom-toast-enter-active,.asl-custom-toast-leave-active{transition:none}}
</style>
