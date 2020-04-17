import {task, src, dest, series} from 'gulp'
import {getDirs} from '../util/task-helpers'
import {samplePath, packagesPath} from '../config'

/**
 * Moves the base config filesfiles into the
 * `samples/*` dirs.
 */
function copyMiscToSample () {
  const directories = getDirs(samplePath)
  const distFiles = src(['./','./common/**/*', './common/**/.*'])
  return directories.reduce(
    (distFile, dir) => {
      return distFile.pipe(dest(dir))
    },
    distFiles
  )
}

function copyMiscToPackages () {
  const directories = getDirs(packagesPath)
  const distFiles = src(['./packages/Readme.md', './packages/.npmignore'])
  return directories.reduce(
    (distFile, dir) => {
      return distFile.pipe(dest(dir))
    },
    distFiles
  )
}

task('copy-misc', series(copyMiscToSample, copyMiscToPackages))
