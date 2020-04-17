import {task, src, dest} from 'gulp'
import {getDirs} from '../util/task-helpers'
import {samplePath} from '../config'
import {join} from 'path'

/**
 * Moves the compiled aka files into the
 * `samples/*` and `integration/*` dirs.
 */
function move () {
  const directories = getDirs(samplePath)

  const distFiles = src(['node_modules/@akajs/**/*'])

  return directories.reduce(
    (distFile, dir) => distFile.pipe(dest(join(dir, '/node_modules/@akajs'))),
    distFiles
  )
}

function moveCommonFile () {
  const directories = getDirs(samplePath)

  const distFiles = src([
    './.gitignore',
    './.dockerignore',
    './nest-cli.json',
    './README_BASE.md',
    './tslint.json',
    './tsconfig.json',
    './tsconfig.build.json',
  ])

  return directories.reduce(
    (distFile, dir) => distFile.pipe(dest(dir)),
    distFiles
  )
}

task('move:common', moveCommonFile)
task('move', move)
