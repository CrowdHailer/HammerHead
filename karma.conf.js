module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'src/**/*.js',
      'lib/**/*.js',
      'spec/**/*spec.js'
    ],
    exclude: [
      'lib/jasmine-jquery.js',
      'lib/jasmine-fixture.min.js',
      'lib/jquery-2.1.0.min.js'
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