import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './stores'
import App from './App'
import '@/design/index.less'

// register svg icon
import 'virtual:svg-icons-register'

self.MonacoEnvironment = {
  getWorker: async function (workerId, label) {
    switch (label) {
      case 'json': {
        // @ts-ignore
        const jsonWorker = (await import('monaco-editor/esm/vs/language/json/json.worker?worker')).default
        return (jsonWorker as Function)()
      }
      case 'css':
      case 'scss':
      case 'less': {
        // @ts-ignore
        const cssWorker = (await import('monaco-editor/esm/vs/language/css/css.worker?worker')).default
        return (cssWorker as Function)()
      }
      case 'html': {
        // @ts-ignore
        const htmlWorker = (await import('monaco-editor/esm/vs/language/html/html.worker?worker')).default
        return (htmlWorker as Function)()
      }
      case 'typescript':
      case 'javascript': {
        // @ts-ignore
        const tsWorker = (await import('monaco-editor/esm/vs/language/typescript/ts.worker?worker')).default
        return (tsWorker as Function)()
      }
      default: {
        // @ts-ignore
        const EditorWorker = (await import('monaco-editor/esm/vs/editor/editor.worker?worker')).default
        return (EditorWorker as Function)()
      }
    }
  }
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
)
