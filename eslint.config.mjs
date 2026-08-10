import coreWebVitals from 'eslint-config-next/core-web-vitals'
import typescript from 'eslint-config-next/typescript'

const config = [
  { ignores: ['prototype/**', '.next/**', 'node_modules/**', 'project/**', 'src/generated/**'] },
  ...coreWebVitals,
  ...typescript,
]

export default config
