import * as migration_20260810_223909_initial from './20260810_223909_initial'
import * as migration_20260811_231858_remove_course_level from './20260811_231858_remove_course_level'
import * as migration_20260816_173220_add_cover_images from './20260816_173220_add_cover_images'
import * as migration_20260817_ensure_cover_images from './20260817_ensure_cover_images'
import * as migration_20260903_112701_rename_content_concepts from './20260903_112701_rename_content_concepts'
import * as migration_20260903_113609_rename_audio_to_interview from './20260903_113609_rename_audio_to_interview'

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
    name: '20260816_173220_add_cover_images',
  },
  {
    up: migration_20260817_ensure_cover_images.up,
    down: migration_20260817_ensure_cover_images.down,
    name: '20260817_ensure_cover_images',
  },
  {
    up: migration_20260903_112701_rename_content_concepts.up,
    down: migration_20260903_112701_rename_content_concepts.down,
    name: '20260903_112701_rename_content_concepts',
  },
  {
    up: migration_20260903_113609_rename_audio_to_interview.up,
    down: migration_20260903_113609_rename_audio_to_interview.down,
    name: '20260903_113609_rename_audio_to_interview',
  },
]
