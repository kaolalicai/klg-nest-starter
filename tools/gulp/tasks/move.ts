import {task, src, dest} from 'gulp'
import * as rename from 'gulp-rename'
import {getDirs} from '../util/task-helpers'
import {samplePath} from '../config'

/**
 * Moves the base config filesfiles into the
 * `samples/*` dirs.
 */
function moveCommonFile () {
  const directories = getDirs(samplePath)
  const distFiles = src([
    './.gitignore',
    './.dockerignore',
    './nest-cli.json',
    './README_BASE.md',
    './tslint.json',
    './tsconfig.json',
    './tsconfig.build.json'
  ])
  return directories.reduce(
    (distFile, dir) => {
      console.log('distFile', distFile)
      return distFile.pipe(rename(function (path) {
        console.log('path', path)
        path.basename = path.basename.replace('_BASE', '')
      })).pipe(dest(dir))
    },
    distFiles
  )
}

task('move', moveCommonFile)
