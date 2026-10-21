import test from 'node:test'
import assert from 'node:assert/strict'
import { createToaster } from '../dist/index.js'

test('deduplicates and toggles the latest toast', () => {
  const toast = createToaster({ duration: 10000 })
  const id = toast.show('one')
  assert.equal(toast.show('one'), id)
  assert.equal(toast.show({ title: 'two', animation: 'toggle' }), id)
  assert.equal(toast.list.value[0].title, 'two')
  toast.clear()
})
