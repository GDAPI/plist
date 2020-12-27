module.exports = config => {
  config.set({
    frameworks: ['jasmine'],
    files: [
      {
        pattern: 'test/**/*.js',
        type: 'module'
      },
      {
        pattern: 'build/*.js',
        type: 'module',
        watched: false
      },
      {
        pattern: 'build/*.js.map',
        included: false,
        served: true,
        watched: false
      },
      {
        pattern: 'test/resource/*',
        included: false,
        served: true,
        watched: false
      }
    ],
    reporters: ['mocha'],
    colors: true,
    port: 9876,
    browsers: ['ChromeDebug'],
    logLevel: config.LOG_ERROR,
    customLaunchers: {
      ChromeDebug: {
        base: 'ChromeHeadless',
        flags: ['--remote-debugging-port=1234', 'http://localhost:9876/debug.html'],
        debug: true
      }
    }
  })
}
