const shell = require('shelljs');
const Rsync = require('rsync');
const path = require('path');
const fs = require('fs');

if(shell.exec('npm run build:prod').code !== 0) {
  shell.echo('error build:prod error')
  shell.exit(1);
}

var rsync = Rsync.build({
  source: path.resolve(__dirname, '../dist/*.*'),
  destination: 'root@47.100.202.222:/opt/resource/nginx/www/bf-plat',
  flags: 'avz',
  shell: 'ssh'
});

rsync.execute(function (err, code, cmd) {
  console.log(err, code, cmd);
})