var ghpages = require('gh-pages');
var path = require('path');

ghpages.publish(path.join(__dirname, 'dist'), {
  logger: function(message) {
    console.log(message);
  }
},function(err){console.log(err);});
