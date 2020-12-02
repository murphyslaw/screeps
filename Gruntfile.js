module.exports = function (grunt) {
  require('time-grunt')(grunt);

  const config = require('./.screeps.json')

  const local_directory = grunt.option('local_directory') || config.local_directory;
  const email = grunt.option('email') || config.email;
  const password = grunt.option('password') || config.password;
  const branch = grunt.option('branch') || config.branch;
  const ptr = grunt.option('ptr') ? true : config.ptr

  grunt.loadNpmTasks('grunt-screeps');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-file-append');
  grunt.loadNpmTasks('grunt-rsync');
  grunt.loadNpmTasks('grunt-jsbeautifier');

  var currentdate = new Date();

  // Output the current date and branch.
  grunt.log.subhead('Task Start: ' + currentdate.toLocaleString());
  grunt.log.writeln('Branch: ' + branch);

  grunt.initConfig({
    screeps: {
      options: {
        email: email,
        password: password,
        branch: branch,
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
          dest: local_directory
        }
      }
    },

    // Apply code styling rules.
    jsbeautifier: {
      modify: {
        src: ['src/**/*.js'],
        options: {
          config: '.jsbeautifyrc'
        }
      },

      verify: {
        src: ['src/**/*.js'],
        options: {
          mode: 'VERIFY_ONLY',
          config: '.jsbeautifyrc'
        }
      }
    }
  });

  grunt.registerTask('default', [
    'clean',
    'copy:screeps',
    'file_append:versioning',
    'screeps'
  ]);

  grunt.registerTask('local', [
    'clean',
    'copy:screeps',
    'file_append:versioning',
    'rsync:local'
  ]);

  grunt.registerTask('test', ['jsbeautifier:verify']);
  grunt.registerTask('pretty', ['jsbeautifier:modify']);
};

  // grunt.registerTask('main', ['test', 'merge', 'write']);
  // grunt.registerTask('sandbox', ['merge', 'write-private']);
  // grunt.registerTask('merge', 'mergeFiles');
  // grunt.registerTask('write', 'screeps');
  // grunt.registerTask('write-private', 'copy');
