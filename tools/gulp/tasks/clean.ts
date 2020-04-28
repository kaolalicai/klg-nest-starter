import {task, src, series} from 'gulp'
import * as clean from 'gulp-clean'
import * as deleteEmpty from 'delete-empty'
import {source} from '../config'


/**
 * Cleans the build output assets from the packages folders
 */
function cleanOutput () {
  return src(
    [
      `${source}/**/*.js`,
      `${source}/**/*.d.ts`,
      `${source}/**/*.js.map`,
      `${source}/**/*.d.ts.map`,
      `!${source}/node_modules/*`
    ],
    {
      read: false
    }
  ).pipe(clean())
}

/**
 * Cleans empty dirs
 */
function cleanDirs (done: () => void) {
  deleteEmpty.sync(`${source}/`)
  done()
}

/**
 * Cleans the build output assets from the packages folders
 */
function cleanTemplate () {
  // return del(`${ source }/**/*`, {force: true})
  return src('template/boilerplate', {read: false})
    .pipe(clean({force: true, allowEmpty : true}))
}


task('clean:output', cleanOutput)
task('clean:dirs', cleanDirs)
task('clean:bundle', series('clean:output', 'clean:dirs'))
task('clean:template', cleanTemplate)
