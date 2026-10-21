# asl-vue-custom-toaster

Vue provider с тремя уведомлениями, стеком, раскрытием по нажатию, обновлением дубликата и собственным шаблоном через слот.

```bash
npm install asl-vue-custom-toaster
```

```vue
<template>
  <ToasterProvider>
    <PageContent />
    <template #toast="{ toast, close }">
      <span>{{ toast.title }}</span>
      <button type="button" @click.stop="close">Закрыть</button>
    </template>
  </ToasterProvider>
</template>
<script setup lang="ts">
import { ToasterProvider } from 'asl-vue-custom-toaster'
import 'asl-vue-custom-toaster/style.css'
</script>
```

```ts
import { useToaster } from 'asl-vue-custom-toaster'
const toast = useToaster()
toast.show({ title: 'Сохранено', view: 'base' })
toast.show({ title: 'Обновляем', animation: 'toggle' })
toast.showError('Не удалось сохранить')
```

`useToaster` вызывайте в дочернем компоненте provider. Повтор последнего сообщения обновляет его таймер. `animation: 'toggle'` заменяет последнее сообщение. `max` и `duration` задаются props provider; цвета: `--asl-custom-toast-base`, `--asl-custom-toast-danger`, `--asl-custom-toast-primary`.

