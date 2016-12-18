var FS = require( 'fs' );
var Parser = require( '../lib/index' );

var win_wmic = './wmic.log';
var linux_ps = './ps.log';

//var data = FS.readFileSync( linux_ps ).toString();
var data = FS.readFileSync( win_wmic ).toString();
var parsedData = Parser.parse( data );

console.log( parsedData );