import { inject, ref, type InjectionKey, type Ref } from 'vue'

export type Toast = { title: string; view?: 'base' | 'danger' | 'primary'; animation?: 'stack' | 'toggle'; duration?: number }
export type ToastItem = Toast & { id: number; view: NonNullable<Toast['view']> }
export type ToasterContext = { list: Ref<ToastItem[]>; show(input: Toast | string): number; showError(text?: string): number; remove(id: number): void; clear(): void; pause(): void; resume(): void }
export const TOASTER_KEY: InjectionKey<ToasterContext> = Symbol('CustomToaster')
export function useToaster(): ToasterContext {
  const context = inject(TOASTER_KEY)
  if (!context) throw new Error('Wrap this component in <ToasterProvider>')
  return context
}

export function createToaster({ max = 3, duration = 5000 }: { max?: number; duration?: number } = {}): ToasterContext {
  const list = ref<ToastItem[]>([])
  const timers = new Map<number, ReturnType<typeof setTimeout>>()
  const remaining = new Map<number, number>()
  const started = new Map<number, number>()
  let nextId = 1
  let paused = false
  function remove(id: number) {
    clearTimeout(timers.get(id)); timers.delete(id); remaining.delete(id); started.delete(id)
    list.value = list.value.filter((item) => item.id !== id)
  }
  function schedule(id: number) {
    if (paused) return
    started.set(id, Date.now())
    timers.set(id, setTimeout(() => remove(id), remaining.get(id) ?? duration))
  }
  function refresh(id: number, ms: number) {
    clearTimeout(timers.get(id)); remaining.set(id, ms); schedule(id)
  }
  function show(input: Toast | string) {
    const toast: Toast = typeof input === 'string' ? { title: input } : input
    const view = toast.view ?? 'base'
    const first = list.value[0]
    if (first && ((first.title === toast.title && first.view === view) || toast.animation === 'toggle')) {
      first.title = toast.title; first.view = view; first.animation = toast.animation
      refresh(first.id, toast.duration ?? duration)
      return first.id
    }
    const id = nextId++
    list.value.unshift({ ...toast, view, id })
    remaining.set(id, toast.duration ?? duration)
    while (list.value.length > max) remove(list.value[list.value.length - 1]!.id)
    schedule(id)
    return id
  }
  return { list, show, showError: (text = 'Что-то пошло не так') => show({ title: text, view: 'danger' }), remove,
    clear: () => { for (const item of [...list.value]) remove(item.id) },
    pause: () => { paused = true; for (const [id, timer] of timers) { clearTimeout(timer); remaining.set(id, Math.max(0, (remaining.get(id) ?? duration) - (Date.now() - (started.get(id) ?? Date.now())))) } timers.clear() },
    resume: () => { if (!paused) return; paused = false; for (const item of list.value) schedule(item.id) }
  }
}
