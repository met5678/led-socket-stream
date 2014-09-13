module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    wiredep: {
      target: {
        src: [
          'index.html'
        ]
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-wiredep');

  // Default task(s).
  grunt.registerTask('default', ['wiredep']);

};
