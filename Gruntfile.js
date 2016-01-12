var prompt = require('prompt');
var fs = require('fs');
var _ = require('lodash');

module.exports = function(grunt) {
  
  grunt.loadNpmTasks('grunt-contrib-copy');
  
  // Do grunt-related things in here
  grunt.initConfig({
    generate: {
      templates: {
        class : 'templates/class.js',
        html5 : 'templates/html5.html'
      }
    },
    generateProject: {
      templates: {
        backbone : 'templates/Backbone'
      }
    }
  });

  grunt.task.registerTask('generate', 'Generate files from template', function(){
    // Check the parameters number
    if (arguments.length !== 2)
      throw new Error('Missing parameters!');
    
    // Get config options
    var config = grunt.config('generate');
    
    var file ;
    
    // Check the template is defined
    if(!config.templates[arguments[0]]){
      file = arguments[0];
    } else {
      file = config.templates[arguments[0]];
    }
    
    // Get template
    var template = grunt.file.read(file);
    
    // Get template's fields needed
    var templateFields = template.match(/<\$[A-Za-z0-9\[\]\s]*\$>/gi) || [];
    
    // Field parser
    function parseField(field){
      var fieldComplete = {};
      
      if(field.indexOf('[') !== -1){
        fieldComplete.type = 'array';
        fieldComplete.name = field.substring(0, field.indexOf('['));
        
        var limits = field.substring(field.indexOf('[') + 1, field.indexOf(']')).split(',');
        
        if(limits[0])
          fieldComplete.maxItems = parseInt(limits[0]);
        
        if(limits[1])
          fieldComplete.minItems = parseInt(limits[1]);
          
        template = template.replace('<$ ' + field + ' $>', fieldComplete.name);
        
      } else {
        fieldComplete.type = 'string';
        fieldComplete.name = field;
        template = template.replace('<$ ' + field + ' $>', '<%= ' + fieldComplete.name + ' %>');
      }

      return fieldComplete;
    }
    
    for(var i = 0; i < templateFields.length; i++){
      templateFields[i] = parseField(templateFields[i].replace(/[<$$>\s]/gi, ''));
    }

    var done = this.async();
    var args = arguments;
    
    // Prompt user for values
    prompt.start();
    prompt.get(templateFields, function (err, result) {
      var fileExtension = file.split(".");
      fileExtension = "." + fileExtension[fileExtension.length - 1];
      // Write file
      grunt.file.write('tmp/' + args[1] + fileExtension, grunt.template.process(template, {data: result}));
      done();
    });
  });
  
  grunt.task.registerTask('generateProject', 'Generate project from template', function(){
    // Check the parameters number
    if (arguments.length !== 2) throw new Error('Missing parameters!');
    
    var projectName = arguments[1];
    var projectTemplate = arguments[0];
    
    // Get config options
    var config = grunt.config('generateProject');
    
    if(!config.templates[projectTemplate]) throw new Error('No project matching "' + projectTemplate + '"!');
    
    var parseDir = function(dir){
      var founded = fs.readdirSync(dir);
      for(var f of founded){
        if(fs.lstatSync(dir + '/' + f).isFile()) grunt.task.run('generate:' + dir + '/' + f + ':' + f);
      }
    };
    
    console.log(parseDir(config.templates[projectTemplate]));
    
    /*grunt.config('copy', {
      files:{
        expand: true,
        cwd: config.templates[projectTemplate],
        src: ['**'],
        dest: projectName + '/',
      }
    });
    grunt.task.run('copy');*/
    
    grunt.task.run('generate:html5:index');
    
  });
};