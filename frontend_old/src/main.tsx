import './index.css'
import ReactDOM from 'react-dom/client'
import { Theme } from '@radix-ui/themes'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Theme>
    <App />
  </Theme>
)
