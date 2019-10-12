#!/usr/bin/env node

const co = require('co');
const fs = require('fs');
const path = require('path');
const OSS = require('ali-oss');
const CDN = require('refresh-aliyun-cdn').co;

const client = new OSS({
  region: 'oss-us-west-1',
  accessKeyId: 'iazHySmLjDuwjpTH',
  accessKeySecret: 'tQJpZjeln7lrGAgkZ6THjCVcqJmze7',
  bucket: 'kayak-test'
});

var walk = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var i = 0;
    (function next() {
      var file = list[i++];
      if (!file) return done(null, results);
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          results.push(file);
          next();
        }
      });
    })();
  });
};


const cdn = new CDN({
    accessKeyId: 'iazHySmLjDuwjpTH',
    secretAccessKey: 'tQJpZjeln7lrGAgkZ6THjCVcqJmze7',
    endpoint: 'https://cdn.aliyuncs.com'
});

walk('../dist', (err, result)=> {
    co(function *() {
        result.forEach((file) => {
            co(function *(){
                yield client.put(file.substr(8), file)
                console.log("put file",file,file.substr(8));
                if (file == result[result.length-1]) {
                    yield cdn.refreshDir('http://noahcstest.ofo.com/');
                    console.log('Successfully uploaded:');
                }
                return 0;
            })
        })
    }).catch(err => {
        console.error('ERROR: ' + err);
    });

})
