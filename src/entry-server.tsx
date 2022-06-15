// TODO: not used currently

import React from 'react'
import ReactDOMServer from 'react-dom/server'
import App from './App'
import './index.css'

export function render (_url: any, _context: any) {
  return ReactDOMServer.renderToString(
    <React.StrictMode>
        <App />
    </React.StrictMode>
  )
}
