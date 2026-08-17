import * as migration_20260810_223909_initial from './20260810_223909_initial';
import * as migration_20260811_231858_remove_course_level from './20260811_231858_remove_course_level';
import * as migration_20260816_173220_add_cover_images from './20260816_173220_add_cover_images';

export const migrations = [
  {
    up: migration_20260810_223909_initial.up,
    down: migration_20260810_223909_initial.down,
    name: '20260810_223909_initial',
  },
  {
    up: migration_20260811_231858_remove_course_level.up,
    down: migration_20260811_231858_remove_course_level.down,
    name: '20260811_231858_remove_course_level',
  },
  {
    up: migration_20260816_173220_add_cover_images.up,
    down: migration_20260816_173220_add_cover_images.down,
    name: '20260816_173220_add_cover_images'
  },
];

// Relanzamiento del workflow de migraciones (2026-08-17): la zona de alumnos
// daba 500 en producción, compatible con migración add_cover_images sin aplicar.
