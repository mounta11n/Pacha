var blessed = require('blessed')
  , contrib = require('blessed-contrib');
screen = blessed.screen();


var log = contrib.log(
      { fg: "green"
      , selectedFg: "green"
      , label: 'Server Log'})
   log.log("new log line")