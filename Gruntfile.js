module.exports = function (grunt) {
  require('time-grunt')(grunt);

  const config = require('./.screeps.json');

  const email = grunt.option('email') || config.email;
  const password = grunt.option('password') || config.password;
  const ptr = grunt.option('ptr') ? true : config.ptr
  const season = grunt.option('season') ? true : config.season;
  const local_directory = grunt.option('local_directory') || config.local_directory;
  const grafana_api_key = grunt.option('grafana') || config.grafana_api_key;

  grunt.loadNpmTasks('grunt-screeps');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-file-append');
  grunt.loadNpmTasks('grunt-rsync');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-gitinfo');
  grunt.loadNpmTasks('grunt-http');
  grunt.loadNpmTasks('lodash');

  var currentdate = new Date();

  // Output the current date.
  grunt.log.subhead('Task Start: ' + currentdate.toLocaleString());

  grunt.initConfig({
    screeps: {
      options: {
        email: email,
        password: password,
        branch: '<%= gitinfo.local.branch.current.name %>',
        ptr: ptr
      },
      dist: {
        src: ['src/*.js']
      }
    },

    // Remove all files from the dist folder.
    clean: {
      'dist': ['dist']
    },

    // Copy all source files into the dist folder, flattening the folder
    // structure by converting path delimiters to underscores.
    copy: {
      // Pushes the game code to the dist folder so it can be modified before
      // being send to the screeps server.
      screeps: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: '**',
          dest: 'dist/',
          filter: 'isFile',
          rename: function (dest, src) {
            // Change the path name utilize underscores for folders.
            return dest + src.replace(/\//g, '_');
          }
        }],
      }
    },

    // Add version variable using current timestamp.
    file_append: {
      versioning: {
        files: [
          {
            append: "\nglobal.SCRIPT_VERSION = " + currentdate.getTime() + "\n",
            input: 'dist/version.js',
          }
        ]
      }
    },

    // Copy files to the folder the steam client uses to sync to the local
    // server. Use rsync so the steam client only uploads the changed files.
    rsync: {
      options: {
        args: ['--verbose', '--checksum'],
        exclude: ['.git*'],
        recursive: true
      },

      local: {
        options: {
          src: './dist/',
          dest: local_directory + (season ? 'screeps.com___season/' : 'screeps.com/') + '<%= gitinfo.local.branch.current.name %>'
        }
      }
    },

    http: {
      grafana: {
        options: {
          url: 'http://localhost:1337/api/annotations',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + grafana_api_key,
          },
          method: 'POST',
          body: {
            'text': 'Deployment',
            'tags': ['deployment']
          },
          json: true,
          timeout: 2000,
        },
      }
    },

    watch: {
      scripts: {
        files: ['src/**/*.js'],
        tasks: ['local'],
        options: {
          spawn: false,
          reload: true
        },
      },
    }
  });

  grunt.registerTask('prepare', [
    'gitinfo',
    'clean',
    'copy:screeps',
    'file_append:versioning',
    'http'
  ]);

  grunt.registerTask('default', [
    'prepare',
    'screeps'
  ]);

  grunt.registerTask('local', [
    'prepare',
    'rsync:local'
  ]);
};
