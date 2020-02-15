const gulp = require('gulp');
const shell = require("shelljs");
const Rsync = require('rsync');
const path = require('path');

const { series } = gulp;

gulp.task('build:prod', function () { return exec('npm run build:prod'); })
gulp.task('build:test', function () { return exec('npm run build:test'); })

gulp.task('rsync:prod', function () {
  let dist = path.resolve(__dirname, './dist');
  return exec(`rsync -avz --rsh=ssh ${dist}/*.* root@47.100.202.222:/opt/resource/nginx/www/bf-plat`);
})

gulp.task('rsync:test', function () {
  let dist = path.resolve(__dirname, './dist');
  return exec(`rsync -avz --rsh=ssh ${dist}/*.* root@47.100.202.222:/opt/resource/nginx/www/bf-plat-test`);
})

gulp.task('deploy:test', series('build:test', 'rsync:test'));
gulp.task('deploy:prod', series('build:prod', 'rsync:prod'));

async function exec(sheel) {
  let t = Date.now();
  return new Promise((resolve, reject) => {
    shell.exec(sheel, (code, stdout, stderr) => {
      if (stderr) {
        console.log(stderr);
        resolve(stderr);
      }
      console.log(`执行成功:${sheel} 耗时:${Date.now() - t} 毫秒`);
      resolve(stderr);
    });
  });
}