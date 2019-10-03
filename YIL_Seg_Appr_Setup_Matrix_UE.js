/**
*@NApiVersion 2.0
*@NScriptType UserEventScript
*/

define(['N/record','N/error', 'N/search', 'N/url', 'N/https'], function(record, error, search, url, https) {
	function beforeSubmit(context) 
	{
		var recObj				= context.newRecord;
		var recId				= recObj.id;
		var recType				= recObj.type;
		log.debug({title: "recId", details:recId});
		log.debug({title: "recType", details:recType});
		var subsidiaryId		= recObj.getValue({fieldId : "custrecord_yil_subsidiary"});
		var departmentId		= recObj.getValue({fieldId : "custrecord_yil_departments"});
		var locationID			= recObj.getValue({fieldId : "custrecord_yil_location"});
		var classId				= recObj.getValue({fieldId : "custrecord_yil_classes"});
		var searchSegSetupFilter= [];
		var searchSegSetupColumn= [];
		
		if(!subsidiaryId && !departmentId && !locationID && !classId)
		{
			throw error.create({name: 'ALL_CHECK_BOXES_ARE_EMPTY', message: 'Please check atleast one checkbox.'});
			return false;
		}
		
		if(recId) {
			searchSegSetupFilter.push(search.createFilter({name: 'internalid', operator: search.Operator.NONEOF, values: recId}));
		}
		searchSegSetupColumn.push(search.createColumn({name: "custrecord_yil_subsidiary", label: "Subsidiary"}));
		searchSegSetupColumn.push(search.createColumn({name: "custrecord_yil_departments", label: "Department"}));
		searchSegSetupColumn.push(search.createColumn({name: "custrecord_yil_location", label: "Location"}));
		searchSegSetupColumn.push(search.createColumn({name: "custrecord_yil_classes", label: "Class"}));
		
		var searchObj	= search.create({type: "customrecord_yil_seg_app_setup_matrix", columns: searchSegSetupColumn, filters: searchSegSetupFilter});
		var count		= searchObj.runPaged().count;
		log.debug({title: "count", details: count});
		
		if(count > 0){
			throw error.create({name: 'UNIQUE_RECORD_VALIDATION', message: 'There must be only one record of segment approval setup matrix.'});
			return false;
		}
		
	}

	function afterSubmit(context) 
	{
		var recObj				= context.newRecord;
		if(context.type != context.UserEventType.CREATE) {
			var oldRecObj			= context.oldRecord;
			log.debug({title: "oldRecObj", details: oldRecObj});
			var oldSubId			= oldRecObj.getValue({fieldId: "custrecord_yil_subsidiary"});
			var oldDepartId			= oldRecObj.getValue({fieldId: "custrecord_yil_departments"});
			var oldLocationId		= oldRecObj.getValue({fieldId: "custrecord_yil_location"});
			var oldClasdId			= oldRecObj.getValue({fieldId: "custrecord_yil_classes"});
		}

		var recId				= recObj.id;
		var recType				= recObj.type;
		log.debug({title: "recId", details: recId});
		log.debug({title: "recType", details: recType});
		var subsidiaryId		= recObj.getValue({fieldId : "custrecord_yil_subsidiary"});
		var departmentId		= recObj.getValue({fieldId : "custrecord_yil_departments"});
		var locationID			= recObj.getValue({fieldId : "custrecord_yil_location"});
		var classId				= recObj.getValue({fieldId : "custrecord_yil_classes"});
		var segSubId			= '';
		var segDepId			= '';
		var segLocId			= '';
		var segClassId			= '';
		var flagChange			= false;				
		var valesObj = {};
		//valesObj.custrecord_yil_seg_subsidiary	= null;
		//valesObj.custrecord_yil_departments		= null;
		//valesObj.custrecord_yil_location			= null;
		//valesObj.custrecord_yil_classes			= null;

		
		
		var searchSegApprColumn	= [];
		var searchSegApprFilter = [];
		
	
		if(oldSubId && !subsidiaryId) {
			searchSegApprFilter.push(search.createFilter({name: 'custrecord_yil_seg_subsidiary', operator: search.Operator.NONEOF, values: "@NONE@"}));
			valesObj.custrecord_yil_seg_subsidiary	= null;
			flagChange = true;
		}
		if(oldDepartId && !departmentId) {
			searchSegApprFilter.push(search.createFilter({name: 'custrecord_yil_seg_department', operator: search.Operator.NONEOF, values: "@NONE@"}));
			valesObj.custrecord_yil_seg_department	= null;
			flagChange = true;
		}
		if(oldLocationId && !locationID) {
			searchSegApprFilter.push(search.createFilter({name: 'custrecord_yil_seg_location', operator: search.Operator.NONEOF, values: "@NONE@"}));
			valesObj.custrecord_yil_seg_location		= null;
			flagChange = true;
		}
		if(oldClasdId && !classId) {
			searchSegApprFilter.push(search.createFilter({name: 'custrecord_yil_seg_class', operator: search.Operator.NONEOF, values: "@NONE@"}));
			valesObj.custrecord_yil_seg_class	= null;
			flagChange = true;
		}
		
		if(flagChange) {
			searchSegApprColumn.push(search.createColumn({name: 'custrecord_yil_seg_subsidiary'}));
			searchSegApprColumn.push(search.createColumn({name: 'custrecord_yil_seg_department'}));
			searchSegApprColumn.push(search.createColumn({name: 'custrecord_yil_seg_class'}));
			searchSegApprColumn.push(search.createColumn({name: 'custrecord_yil_seg_location'}));
			searchSegApprColumn.push(search.createColumn({name: 'internalid'}));
			
			var searchSegObj	= search.create({type: "customrecord_yil_seg_app_matrix", filters: searchSegApprFilter, columns: searchSegApprColumn});
			log.debug({title: "searchSegObj", details: searchSegObj});
			var segCount		= searchSegObj.runPaged().count;
			log.debug({title: "segCount", details: segCount});
			searchSegObj.run().each(function(result) {
				var segIntId	= result.getValue({name: "internalid"});
				log.debug({title: "Inside ForEach Condition segIntId", details: segIntId});
				
				if(segIntId) {
					record.submitFields({type: "customrecord_yil_seg_app_matrix", id: segIntId, values: valesObj});
				}

				return true;
			});
		}

		if(context.type != context.UserEventType.CREATE) { 
			if(oldSubId != subsidiaryId || oldDepartId != departmentId || oldLocationId !=  locationID || oldClasdId !=  classId) {		
				var suiteUrl	= url.resolveScript({scriptId: "customscript_yil_seg_app_setup_matrix_sl", deploymentId: "customdeploy_yil_seg_app_setup_matrix_sl", params: {recordType: recType,  recordId: recId} ,returnExternalUrl: true});
				var response	= https.get({url: suiteUrl});
				log.debug({title: "response", details: response});                 
				log.debug({title: "suiteUrl", details: "suiteUrl"});
			}
		}

		

	}
	
	return {
		beforeSubmit : beforeSubmit,
		afterSubmit : afterSubmit
	}
	
});