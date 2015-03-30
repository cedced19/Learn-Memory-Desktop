var path = require('path');
module.exports = function(grunt) {

  var config = {
    copy: {
      src: {
        files: [{
          expand: true,
          src: [
            'index.html',
            'vendor/**/*.*',
            'package.json',
            'favicon.png'
          ],
          dest: 'minified/'
        }]
      }
    },
  useminPrepare: {
      html: 'index.html',
      options: {
                    flow: {
                      html: {
                          steps: {
                            js: ['concat', 'uglifyjs'],
                              css: [
                                  {
                                      name: 'uncss',
                                      createConfig: function (context, block) {
                                          context.outFiles = [block.dest];
                                          return {
                                              files: [{
                                                  dest: path.join(context.outDir, block.dest),
                                                  src: ['uncss.html']
                                              }]
                                          };
                                      }
                                  },
                                  {
                                    name: 'autoprefixer',
                                    createConfig: function (context, block) {
                                        context.outFiles = [block.dest];
                                        return {
                                          options: {
                                              browsers: ['last 2 versions', 'ie 8', 'ie 9']
                                            },
                                            files: [{
                                                src: path.join(context.inDir, block.dest),
                                                dest: path.join(context.outDir, block.dest)
                                            }]
                                        };
                                    }
                                },
                                'cssmin'
                              ]
                          },
                          post: {}
                      }
                  },
                  dest: 'minified'
              }
          },
  usemin: {
    html: 'minified/*.html'
  },
  htmlmin: {
        minified: {
          options: {
            removeComments: true,
            collapseWhitespace: true
          },
          files: {
            'minified/index.html': 'minified/index.html',
            'minified/vendor/views/lesson.html': 'minified/vendor/views/lesson.html',
            'minified/vendor/views/creation.html': 'minified/vendor/views/creation.html',
            'minified/vendor/views/list.html': 'minified/vendor/views/list.html'
          }
      }
  },
  nodewebkit: {
    options: {
        platforms: ['win32','osx', 'linux'],
        buildDir: './build', // Where the build version of my node-webkit app is saved
    },
    src: ['./minified/**/*'] // Your node-webkit app
  },
  'install-dependencies': {
      options: {
          cwd: './minified/'
      }
  }
};

  grunt.initConfig(config);

  // Load all Grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.registerTask('default', ['copy', 'useminPrepare', 'concat', 'uglify', 'uncss', 'autoprefixer', 'cssmin', 'usemin', 'htmlmin', 'install-dependencies', 'nodewebkit']);
};