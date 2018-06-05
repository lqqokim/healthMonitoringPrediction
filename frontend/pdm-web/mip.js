#! /usr/bin/env node

/**
 * First, execute 'npm link'
 */
if (process.argv.length < 3) {
    console.log('');
    console.log('--------------------------------------------------');
    console.log('-------------- usage for plugin ------------------');
    console.log('');
    console.log('--------------------------------------------------');
    console.log('-------------- usage for plugin ------------------');
    console.log('You should call \"npm link\" at the first');
    console.log('mip create|build <plugin-type> <plugin-name> or');
    console.log('mip c|b <plugin-type> <plugin-name>');
    console.log('e.g) plugin create w|t dfd-widget');
} else {
    var argv = [process.argv[2], process.argv[3], process.argv[4]];

    /**
     * create.plugin --type=<plugin-type> --name=<plugin-name>
     * build.plugin --type=<plugin-type> --name=<plugin-name>
     * type is create (c) or build (b)
     */
    var type = argv[0];
    var pluginType = argv[1];
    var pluginName = argv[2];
    console.log('--------------------------------------------------');
    console.log('  pluginType', pluginType, ', pluginName', pluginName);
    console.log('--------------------------------------------------');

    var exec = require('child_process').exec;
    var execCb = function (error, stdout, stderr) {
        if (error) console.log("exec error: " + error);
        if (stdout) console.log("Result: " + stdout);
        if (stderr) console.log("shell error: " + stderr);
    };

    // var fs = require('fs'),
    //   spawn = require('child_process').spawn,
    //   out = fs.openSync('./mip-out.log', 'a'),
    //   err = fs.openSync('./mip-err.log', 'a');
    if (pluginType && pluginName && (type === 'create' || type === 'c')) {
        exec('gulp create.plugin --type=' + pluginType + ' --name=' + pluginName, execCb);
    } else if (pluginType && pluginName && (type === 'build' || type === 'b')) {
        exec('gulp build.plugin --type=' + pluginType + ' --name=' + pluginName, execCb);
    } else {
        console.log('');
        console.log('--------------------------------------------------');
        console.log('-------------- usage for plugin ------------------');
        console.log('You should call \"npm link\" at the first');
        console.log('mip create|build <plugin-type> <plugin-name> or');
        console.log('mip c|b <plugin-type> <plugin-name>');
        console.log('e.g) plugin create w|t dfd-widget');
    }

}
