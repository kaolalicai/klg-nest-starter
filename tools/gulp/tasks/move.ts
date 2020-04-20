import {task, src, dest, series} from 'gulp'
import {getDirs} from '../util/task-helpers'
import {samplePath} from '../config'
import {join} from 'path'

/**
 * Moves the hello-world project into the
 * `boilerplate/*` dirs.
 */
function moveBoilerplate () {
  return src(['sample/hello-world/**/*', '!sample/hello-world/node_modules/**/*', '!sample/hello-world/dist/**/*'])
    .pipe(dest('template/boilerplate/'))
}

/**
 * Moves the compiled aka files into the
 * `samples/*` and `integration/*` dirs.
 */
function move () {
  const samplesDirs = getDirs(samplePath)
2
  const distFiles = src(['node_modules/@kalengo/**/*'])

  return samplesDirs.reduce(
    (distFile, dir) => distFile.pipe(dest(join(dir, '/node_modules/@kalengo'))),
    distFiles
  )
}

task('move:boilerplate', moveBoilerplate)
task('move:template', series('clean:template', 'move:boilerplate'))
task('move', move)
