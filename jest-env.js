require('./src/utils/idx')

const XMLHttpRequest = require('xhr2')


global.XMLHttpRequest = XMLHttpRequest

global.dip = function(px){
  return px
}
global.fdip = function(px){
  return px
}
