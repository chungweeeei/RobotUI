import { createRoot } from 'react-dom/client'

import WithReactQuery from './withReactQuery.tsx'
import WithoutReactQuery from './withoutReactQuery.tsx'


createRoot(document.getElementById('root')!).render(
    <WithReactQuery />
)
