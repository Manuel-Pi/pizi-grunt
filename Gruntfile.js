var prompt = require('prompt');
module.exports = function(grunt) {
  
  // Do grunt-related things in here
  grunt.initConfig({
    generate: {
      templates: {
        class : 'templates/class.js',
        html5 : 'templates/html5.html'
      }
    }
  });

  grunt.task.registerTask('gen', 'Generate files from template', function(){
    // Check the parameters number
    if (arguments.length !== 2)
      throw new Error('Missing parameters!');
    
    // Get config options
    var config = grunt.config('generate');
    
    // Check the template is defined
    if(!config.templates[arguments[0]])
      throw new Error('No templates matching!');
    
    // Get template
    var template = grunt.file.read(config.templates[arguments[0]]);
    
    // Get template's values needed
    var templateValues = template.match(/<%.*%>/gi);
    for(var i = 0; i < templateValues.length; i++){
      templateValues[i] = templateValues[i].replace(/[<%%>=\s]/gi, '');
    }
    
    var done = this.async();
    var args = arguments;
    
    // Prompt user for values
    var prompt = require('prompt');
    prompt.start();
    prompt.get(templateValues, function (err, result) {
      var fileExtension = config.templates[args[0]].split(".");
      fileExtension = "." + fileExtension[fileExtension.length - 1];
      console.log(result);
      // Write file
      grunt.file.write(args[1] + fileExtension, grunt.template.process(template, {data: result}));
      done();
    });
  });
};