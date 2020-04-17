import {task, src, dest, series} from 'gulp'
import {getDirs} from '../util/task-helpers'

/**
 * Moves the hello-world project into the
 * `boilerplate/*` dirs.
 */
function move () {
  // const boilerplateDirs = getDirs('./boilerplate');
  // // const distFiles = src(['sample/hello-world/**/*', '!sample/hello-world/node_modules/**/*'])
  // const distFiles = src(['./config/**/*'])
  // console.log('boilerplateDirs', boilerplateDirs.length)
  // console.log('distFile', distFiles.length)
  // return boilerplateDirs
  //   .reduce(
  //     (distFile, dir) => {
  //       return distFile.pipe(dest(dir))
  //     },
  //     distFiles
  //   )

  return src(['sample/hello-world/**/*', '!sample/hello-world/node_modules/**/*'])
    .pipe(dest('boilerplate/'))
}

task('move:boilerplate', move)
task('move', series('clean', 'move:boilerplate'))
