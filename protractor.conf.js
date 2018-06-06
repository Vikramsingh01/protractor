let SpecReporter = require('jasmine-spec-reporter').SpecReporter;
let  jasmineReporters = require('jasmine-reporters');
let HTMLReport = require('protractor-html-reporter');
//let HTMLReport = require('protractor-jasmine2-html-reporter');
let jasmine2ProtractorUtils = require('jasmine2-protractor-utils');




exports.config = {

   plugins: [{
    
        package: 'jasmine2-protractor-utils',
        disableHTMLReport: false,
        disableScreenshot: false,
        screenshotPath:'./reports/screenshots',
        screenshotOnExpectFailure:true,
        screenshotOnSpecFailure:true,
        clearFoldersBeforeTest: true,
        htmlReportDir: './reports/htmlReports',
        failTestOnErrorLog: {
                    failTestOnErrorLogLevel: 1000,
                    //excludeKeywords: ['keyword1', 'keyword2']
                }
      }],
 
 // seleniumAddress: 'http://localhost:4444/wd/hub',
  allScriptsTimeout: 11000,
  
  specs: [
    './e2e/test/*_spec.ts'   
  ],
  suites: {
somke:[],
functional:[],
regressopm:[]
  },
  
   capabilities: {
    'browserName': 'chrome',
    'chromeOptions': { 'args': ['incognito'] }
   },
  
 //Options to pass to Jasmine node. 
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {}
  },
 useAllAngular2AppRoots: true,
  beforeLaunch: function() {
    require('ts-node').register({
      project: './e2e/tsconfig.json'
    });
  },
  framework: 'jasmine2',

  onPrepare() {

    var jasmineReporters =require('jasmine-reporters');
  jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
      consolidateAll: true,
      savePath: 'testresults',
      filePrefix: 'xmloutput'
  }));

  browser.manage().window().maximize();
  browser.ignoreSynchronization = true;
  jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
} ,


onComplete: function() {
     var browserName, browserVersion;
     var capsPromise = browser.getCapabilities();
 
     capsPromise.then(function (caps) {
        browserName = caps.get('browserName');
        browserVersion = caps.get('version');
 
      //  var HTMLReport;
 
         testConfig = {
            reportTitle: 'Test Execution Report',
            outputPath: './reports',
            screenshotPath: './screenshots/',
            testBrowser: browserName,
            browserVersion: browserVersion,
            modifiedSuiteName: false,
            screenshotsOnlyOnFailure: true
        };
       
    });
 }


  };