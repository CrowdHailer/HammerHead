module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'bower_components/**/*.js',
      'src/**/*.js',
      'spec/**/*spec.js'
    ],
    exclude: [
      'bower_components/jasmine-jquery.js',
      'bower_components/jasmine-fixture.min.js',
      'bower_components/jquery-2.1.0.min.js',
      'bower_components/hammer.fakemultitouch.js',
      'bower_components/hammer.showtouches.js'
    ],
    reporters: ['spec'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['PhantomJS'],
    captureTimeout: 60000,
    singleRun: true
  });
};