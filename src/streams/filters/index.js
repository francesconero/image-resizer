'use strict';

var path, fs, cwd, dir, files, modules, pluginDir;

path      = require('path');
fs        = require('fs');
cwd       = process.cwd();
dir       = path.parse(__dirname).base;
pluginDir = path.join(cwd, 'plugins', dir);
modules   = {};


// get all the files from this directory
files = require('glob').sync(__dirname + '/*.js');
for (var i=0; i < files.length; i++){
  var mod = path.basename(files[i], '.js');
  if ( mod !== 'index' ){
    modules[mod] = require(files[i]);
  }
}

// get all the files from the current working directory and override the local
// ones with any custom plugins
if (fs.existsSync(pluginDir)){
  files = require('glob').sync(pluginDir + '/*.js');
  for (var i=0; i < files.length; i++){
    var mod = path.basename(files[i], '.js');
    if ( mod !== 'index' ){
      modules[mod] = require(files[i]);
    }
  }
}


module.exports = modules;
