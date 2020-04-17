import {task, src} from 'gulp'
import * as clean from 'gulp-clean'
import {source} from '../config'

/**
 * Cleans the build output assets from the packages folders
 */
function cleanDirs () {
  // return del(`${ source }/**/*`, {force: true})
  return src(`${ source }/`, {read: false})
    .pipe(clean({force: true, allowEmpty : true}))
}


task('clean', cleanDirs)
