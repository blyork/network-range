module.exports = function(grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),

        config: {
            banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                '* <%= pkg.homepage %>\n' +
                '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
                ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
            gruntFile: 'Gruntfile.js',
            sourceFiles: 'lib/**/*.js',
            testFiles: 'test/**/*.js'
        },

        // Task configuration.
        bump: {
            options: {
                files: ['bower.json', 'package.json'],
                updateConfigs: [],
                commit: true,
                commitMessage: 'Release v%VERSION%',
                commitFiles: ['bower.json', 'package.json'],
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: true,
                pushTo: 'origin',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d'
            }
        },

        jsbeautifier: {
            options: {},
            bower: {
                src: 'bower.json'
            },
            gruntfile: {
                src: '<%= config.gruntFile %>'
            },
            lib: {
                src: '<%= config.sourceFiles %>'
            },
            package: {
                src: 'package.json'
            },
            test: {
                src: '<%= config.testFiles %>'
            }
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            gruntfile: {
                src: '<%= config.gruntFile %>'
            },
            lib: {
                src: '<%= config.sourceFiles %>'
            },
            test: {
                options: {
                    jshintrc: 'test/.jshintrc'
                },
                src: '<%= config.testFiles %>'
            }
        },

        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: 'test/**/*.js'
            }
        },

        uglify: {
            options: {
                banner: '<%= config.banner %>',
                sourceMap: true
            },
            lib: {
                src: ['<%= config.sourceFiles %>'],
                dest: 'dist/network-range.min.js'
            }
        },

        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            lib: {
                files: '<%= jshint.lib.src %>',
                tasks: ['jsbeautifier:lib', 'jshint:lib', 'mochaTest', 'uglify:lib']
            },
            test: {
                files: '<%= jshint.test.src %>',
                tasks: ['jshint:test', 'mochaTest']
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.loadNpmTasks('grunt-mocha-test');

    // Default task.
    grunt.registerTask('default', ['jsbeautifier', 'jshint', 'mochaTest', 'uglify']);

    // Alias tasks.
    grunt.registerTask('format', ['jsbeautifier']);
    grunt.registerTask('minify', ['jsbeautifier']);
};
