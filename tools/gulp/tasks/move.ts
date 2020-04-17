import {task, src, dest, series} from 'gulp'
import {getDirs} from '../util/task-helpers'

/**
 * Moves the hello-world project into the
 * `boilerplate/*` dirs.
 */
function move () {
  return src(['sample/hello-world/**/*', '!sample/hello-world/node_modules/**/*', '!sample/hello-world/dist/**/*'])
    .pipe(dest('template/boilerplate/'))
}

task('move:boilerplate', move)
task('move:template', series('clean:template', 'move:boilerplate'))
