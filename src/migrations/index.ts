import * as migration_20260810_223909_initial from './20260810_223909_initial';
import * as migration_20260811_231858_remove_course_level from './20260811_231858_remove_course_level';

export const migrations = [
  {
    up: migration_20260810_223909_initial.up,
    down: migration_20260810_223909_initial.down,
    name: '20260810_223909_initial',
  },
  {
    up: migration_20260811_231858_remove_course_level.up,
    down: migration_20260811_231858_remove_course_level.down,
    name: '20260811_231858_remove_course_level'
  },
];
