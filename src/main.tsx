import { setAssetPath as setCalciteComponentsAssetPath } from '@esri/calcite-components/dist/components';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.min.css';
setCalciteComponentsAssetPath("https://js.arcgis.com/calcite-components/2.13.2/assets");


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
