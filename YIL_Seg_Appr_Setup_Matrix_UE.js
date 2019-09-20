/**
*@NApiVersion 2.0
*@NScriptType UserEventScript
**/

define(['N/record','N/error', 'N/search'], function(record, error, search) {
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
		var searchSegApprFilter	= [];
		var searchSegApprColumn	= [];
		log.debug({title: "subsidiaryId", details:subsidiaryId});
		log.debug({title: "classId", details:classId});
		
		if(!subsidiaryId && !departmentId && !locationID && !classId)
		{
			throw error.create({name: 'ALL_CHECK_BOXES_ARE_EMPTY', message: 'Please Check Atleast One Check Box'});
			return false;
		}
		
		//searchSegApprFilter.push(search.createFilter({name: 'isinactive', operator: search.Operator.IS, values: "F"}));
		
		/*if(subsidiaryId) {
			searchSegApprFilter.push(search.createFilter({name: 'custrecord_yil_subsidiary', operator: search.Operator.ANYOF, values: subsidiaryId}));
		}
		else {
			searchSegApprFilter.push(search.createFilter({name: 'custrecord_yil_subsidiary', operator: search.Operator.ANYOF, values: "@NONE@"}));
		}
		
		if(departmentId) {
			searchSegApprFilter.push(search.createFilter({name: 'custrecord_yil_departments', operator: search.Operator.ANYOF, values: departmentId}));
		}
		else {
			searchSegApprFilter.push(search.createFilter({name: 'custrecord_yil_departments', operator: search.Operator.ANYOF, values: "@NONE@"}));
		}
		
		if(locationID) {
			searchSegApprFilter.push(search.createFilter({name: 'custrecord_yil_location', operator: search.Operator.ANYOF, values: locationID}));
		}
		else {
			searchSegApprFilter.push(search.createFilter({name: 'custrecord_yil_location', operator: search.Operator.ANYOF, values: "@NONE@"}));
		}
		
		if(classId) {
			searchSegApprFilter.push(search.createFilter({name: 'custrecord_yil_classes', operator: search.Operator.ANYOF, values: classId}));
		}
		else {
			searchSegApprFilter.push(search.createFilter({name: 'custrecord_yil_classes', operator: search.Operator.ANYOF, values: "@NONE@"}));
		}*/
		
		
		searchSegApprColumn.push(search.createColumn({name: 'custrecord_yil_seg_subsidiary'}));
		searchSegApprColumn.push(search.createColumn({name: 'custrecord_yil_seg_department'}));
		searchSegApprColumn.push(search.createColumn({name: 'custrecord_yil_seg_class'}));
		searchSegApprColumn.push(search.createColumn({name: 'custrecord_yil_seg_location'}));
		searchSegApprColumn.push(search.createColumn({name: 'internalid'}));
		
		var searchSegObj	= search.create({type: "customrecord_yil_seg_app_matrix", columns: searchSegApprColumn});//filters: searchSegApprFilter,
		log.debug({title: "searchSegObj", details: searchSegObj});
		var segCount		= searchSegObj.runPaged().count;
		log.debug({title: "segCount", details: segCount});
		searchSegObj.run().each(function(result) {
			var segSubId	= result.getValue({name: "custrecord_yil_seg_subsidiary"});
			var segDepId	= result.getValue({name: "custrecord_yil_seg_department"});
			var segLocId	= result.getValue({name: "custrecord_yil_seg_location"});
			var segClassId	= result.getValue({name: "custrecord_yil_seg_class"});
			var segIntId	= result.getValue({name: "internalid"});
			log.debug({title: "Inside ForEach Condition segIntId", details: segIntId});
			
			if(!subsidiaryId && segSubId) {
				var id = record.submitFields({type: "customrecord_yil_seg_app_matrix", id: segIntId, values: {"custrecord_yil_seg_subsidiary": null}});
			}
			else if(!departmentId && segDepId) {
				var id = record.submitFields({type: "customrecord_yil_seg_app_matrix", id: segIntId, values: {"custrecord_yil_seg_department": null}});
			}
			else if(!locationID && segLocId) {
				var id = record.submitFields({type: "customrecord_yil_seg_app_matrix", id: segIntId, values: {"custrecord_yil_seg_location": null}});
			}
			else if(!classId && segClassId) {
				var id = record.submitFields({type: "customrecord_yil_seg_app_matrix", id: segIntId, values: {"custrecord_yil_seg_class": null}});
			}
			return true;
			var suiteUrl	= 
		});
		
		
		
		
		//Search For Duplicate Record
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
			throw error.create({name: 'ONE_RECORD_IS_ALREADT_EXIST', message: 'Record Exist in Segment Approval Setup Matrix List.'});
			return false;
		}
		
	}
	
	return {
		beforeSubmit : beforeSubmit
	}
	
});