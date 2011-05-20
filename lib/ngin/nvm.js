/*
 * Module dependencies.
 */

/*
 * Initialize node.js versions management component.
 *
 * @param {bin} Path to nvm bin.
 * @param {dir} Path to the directory which contains all the installed node binaries.
 */
var Nvm = function(bin, dir) {
	var self = this;
	
	self.bin = bin;
	self.dir = dir;
}