import * as migration_20260810_223909_initial from './20260810_223909_initial'

export const migrations = [
  {
    up: migration_20260810_223909_initial.up,
    down: migration_20260810_223909_initial.down,
    name: '20260810_223909_initial',
  },
]
