var prompt = require('prompt');
var _ = require('lodash');
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

  grunt.task.registerTask('generate', 'Generate files from template', function(){
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
    
    // Get template's fields needed
    var templateFields = template.match(/<%=[A-Za-z0-9\{\}\s]*%>/gi);
    
    // Field parser
    function parseField(field){
      console.log(field);
      var fieldComplete = {};
      
      fieldComplete.required = field.indexOf(':o') !== -1 ? false : true;
      
      if(field.indexOf('{') !== -1){
        fieldComplete.type = 'array';
        fieldComplete.name = field.substring(0, field.indexOf('{'));
        
        var limits = field.substring(field.indexOf('{') + 1, field.indexOf('}')).split(',');
        
        if(limits[0])
          fieldComplete.maxItems = parseInt(limits[0]);
        
        if(limits[1])
          fieldComplete.minItems = parseInt(limits[1]);
        
      } else {
        fieldComplete.type = 'string';
        fieldComplete.name = field;
      }

      template = template.replace('<%= ' + field + ' %>', fieldComplete.name);
      console.log('<%= ' + field + ' %>');
      return fieldComplete;
    }
    
    for(var i = 0; i < templateFields.length; i++){
      templateFields[i] = parseField(templateFields[i].replace(/[<%%>=\s]/gi, ''));
    }
    
    var done = this.async();
    var args = arguments;
    
    // Prompt user for values
    var prompt = require('prompt');
    prompt.start();
    prompt.get(templateFields, function (err, result) {
      var fileExtension = config.templates[args[0]].split(".");
      fileExtension = "." + fileExtension[fileExtension.length - 1];
      // Write file
      grunt.file.write(args[1] + fileExtension, grunt.template.process(template, {data: result}));
      done();
    });
  });
};