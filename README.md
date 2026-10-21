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

## Разработка и публикация

Этот каталог является отдельным Git-репозиторием и самостоятельным npm-пакетом. Команды выполняются из его корня.

```bash
npm ci
npm test
npm run pack:check
npm login
npm publish --access public
```

Перед публикацией проверьте право на использование исходного кода и выберите лицензию. Сейчас в `package.json` указано `UNLICENSED`. Проверьте, что имя пакета доступно в npm; при необходимости измените `name` и заново выполните `npm install`. Для следующего релиза повысьте версию через `npm version patch`.

Для GitHub создайте пустой репозиторий с таким же именем, затем добавьте его как `origin` и отправьте ветку: `git remote add origin <адрес>`, `git push -u origin main`.
