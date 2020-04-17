import {task, src, dest} from 'gulp'
import * as rename from 'gulp-rename'
import {getDirs} from '../util/task-helpers'
import {samplePath} from '../config'

/**
 * Moves the base config filesfiles into the
 * `samples/*` dirs.
 */
function copyMisc () {
  const directories = getDirs(samplePath)
  const distFiles = src(['./common/**/*'])
  return directories.reduce(
    (distFile, dir) => {
      return distFile.pipe(rename(function (path) {
        path.basename = path.basename.replace('_BASE', '')
      })).pipe(dest(dir))
    },
    distFiles
  )
}

task('copy-misc', copyMisc)
