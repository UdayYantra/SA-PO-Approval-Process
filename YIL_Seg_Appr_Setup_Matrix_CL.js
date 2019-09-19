/**
*@NApiVersion 2.0
*@NScriptType ClientScript
*/
define(['N/record'], function(record) {
	function validateField(context)
	{
		var currentRecObj	= context.currentRecord;
		var confFlag		= confirm("currentRecObj"+currentRecObj);
		if(!confFlag) {
			return false;
		}
		
		return true;
	}
	
	return {
		validateField : validateField
	}
});
	