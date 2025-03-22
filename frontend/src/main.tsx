import '@fontsource/londrina-solid/400.css'
import '@fontsource/chivo/400.css'
import '@fontsource/chivo/500.css'
import '@fontsource/chivo/600.css'
import './index.css'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { Theme } from '@radix-ui/themes'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Theme>
      <App />
    </Theme>
  </StrictMode>
)

