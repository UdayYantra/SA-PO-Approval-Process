/**
* @NApiVersion 2.0
* @NScriptType UserEventScript
**/
define(['N/record','N/search', 'N/ui/serverWidget', 'N/error','N/url', 'N/runtime'], function(record, search, server, error, url, runtime) {
	function beforeLoad(context) {
		var form				= context.form;
		var recObj				= context.newRecord;
		var recType				= recObj.type;
		var searchSegSetupFilter= [];
		var searchSegSetupColumn= [];
		var subId				= '';
		var depId				= '';
		var locId				= '';
		var classId				= '';
		var checkSub			= form.getField({id: 'custrecord_yil_seg_subsidiary'});
		var checkDep			= form.getField({id: 'custrecord_yil_seg_department'});
		var checkLoc			= form.getField({id: 'custrecord_yil_seg_location'});
		var checkClass			= form.getField({id: 'custrecord_yil_seg_class'});
		
		//if( context.type == context.UserEventType.CREATE ) {
			searchSegSetupFilter.push(search.createFilter({name: 'isinactive', operator: search.Operator.IS, values: "F"}));
			searchSegSetupColumn.push(search.createColumn({name: "custrecord_yil_subsidiary", label: "Subsidiary"}));
			searchSegSetupColumn.push(search.createColumn({name: "custrecord_yil_departments", label: "Department"}));
			searchSegSetupColumn.push(search.createColumn({name: "custrecord_yil_location", label: "Location"}));
			searchSegSetupColumn.push(search.createColumn({name: "custrecord_yil_classes", label: "Class"}));
			
			var searchObj	= search.create({type: "customrecord_yil_seg_app_setup_matrix", columns: searchSegSetupColumn, filters: searchSegSetupFilter});
			var count		= searchObj.runPaged().count;
			//log.debug({title: "count", details: count});
			searchObj.run().each(function(result){
				subId	= result.getValue({name: 'custrecord_yil_subsidiary'});
				depId	= result.getValue({name: 'custrecord_yil_departments'});
				locId	= result.getValue({name: 'custrecord_yil_location'});
				classId	= result.getValue({name: 'custrecord_yil_classes'});
				return true;
			});
			log.debug({title: 'subId', details: subId});
			log.debug({title: 'depId', details: depId});
			log.debug({title: 'locId', details: locId});
			log.debug({title: 'classId', details: classId});
			
			
			if(!subId) {
				checkSub.updateDisplayType({displayType : server.FieldDisplayType.DISABLED});
			}
			else {
				checkSub.isMandatory = true;
			}
			if(!depId) {
				checkDep.updateDisplayType({displayType : server.FieldDisplayType.DISABLED});
			}
			else {
				checkDep.isMandatory = true;
			}
			if(!locId) {
				checkLoc.updateDisplayType({displayType : server.FieldDisplayType.DISABLED});
			}
			else {
				checkLoc.isMandatory	= true;
			}
			if(!classId) {
				checkClass.updateDisplayType({displayType : server.FieldDisplayType.DISABLED});
			}
			else {
				checkClass.isMandatory	= true;
			}
			
		//}
		
		//log.debug({title: "segIntId", details: segIntId});
		//if(segIntId) {
			//var recLoad		= record.load({type: "customrecord_yil_seg_app_matrix", id: segIntId});
			//og.debug({title: "recLoad", details: recLoad});
			
			
			/**if(!subId && recLoad){
				log.debug({title: "Inside If subId", details:subId });
				recLoad.setValue({fieldId: 'custrecord_yil_seg_subsidiary', value: null});
				recLoad.save();
			}
			if(!depId && recLoad) {
				log.debug({title: "Inside If depId", details: depId});
				recLoad.setValue({fieldId: 'custrecord_yil_seg_department', value: null});
				//recLoad.save();
			}
			if(!locId && recLoad) {
				log.debug({title: "Inside If locId", details: locId});
				recLoad.setValue({fieldId: 'custrecord_yil_seg_class', value: null});
				//recLoad.save();
			}
			if(!classId && recLoad) {
				log.debug({title: "Inside If classId", details: classId});
				recLoad.setValue({fieldId: 'custrecord_yil_seg_location', value: null});
				//recLoad.save();
			}
			recLoad.save();
		}*/
	}
	/*function beforeSubmit(context)
	{
		var recObj				= context.newRecord;
		var recId				= recObj.id;
		var searchSegApprFilter	= [];
		var searchSegApprColumn	= [];
		var subsidiaryId		= recObj.getValue({fieldId : "custrecord_yil_seg_subsidiary"});
		var departmentId		= recObj.getValue({fieldId : "custrecord_yil_seg_department"});
		var locationID			= recObj.getValue({fieldId : "custrecord_yil_seg_location"});
		var claId				= recObj.getValue({fieldId : "custrecord_yil_seg_class"});
		var segSubId			= '';
		var segDepId			= '';
		var segLocId			= '';
		var segClassId			= '';
		var segIntId			= '';
		
		
		if(recId) {
			searchSegApprFilter.push(search.createFilter({name: 'internalid', operator: search.Operator.NONEOF, values: recId}));
		}
				
		if(subsidiaryId) {
			searchSegApprFilter.push(search.createFilter({name: 'custrecord_yil_seg_subsidiary', operator: search.Operator.ANYOF, values: subsidiaryId}));
		}
		else {
			searchSegApprFilter.push(search.createFilter({name: 'custrecord_yil_seg_subsidiary', operator: search.Operator.ANYOF, values: "@NONE@"}));
		}
		
		if(departmentId) {
			searchSegApprFilter.push(search.createFilter({name: 'custrecord_yil_seg_department', operator: search.Operator.ANYOF, values: departmentId}));
		}
		else {
			searchSegApprFilter.push(search.createFilter({name: 'custrecord_yil_seg_department', operator: search.Operator.ANYOF, values: "@NONE@"}));
		}
		
		if(locationID) {
			searchSegApprFilter.push(search.createFilter({name: 'custrecord_yil_seg_location', operator: search.Operator.ANYOF, values: locationID}));
		}
		else {
			searchSegApprFilter.push(search.createFilter({name: 'custrecord_yil_seg_location', operator: search.Operator.ANYOF, values: "@NONE@"}));
		}
		
		if(claId) {
			searchSegApprFilter.push(search.createFilter({name: 'custrecord_yil_seg_class', operator: search.Operator.ANYOF, values: claId}));
		}
		else {
			searchSegApprFilter.push(search.createFilter({name: 'custrecord_yil_seg_class', operator: search.Operator.ANYOF, values: "@NONE@"}));
		}
		
		searchSegApprColumn.push(search.createColumn({name: 'custrecord_yil_seg_subsidiary'}));
		searchSegApprColumn.push(search.createColumn({name: 'custrecord_yil_seg_department'}));
		searchSegApprColumn.push(search.createColumn({name: 'custrecord_yil_seg_class'}));
		searchSegApprColumn.push(search.createColumn({name: 'custrecord_yil_seg_location'}));
		searchSegApprColumn.push(search.createColumn({name: 'internalid'}));
		
		var searchSegObj	= search.create({type: "customrecord_yil_seg_app_matrix", filters: searchSegApprFilter, columns: searchSegApprColumn});
		var segCount		= searchSegObj.runPaged().count;
		log.debug({title: "segCount", details: segCount});
		
		if(segCount > 0) {
			throw error.create({name: 'DUPLICATE_RECORD', message: 'Please check it.'});
			return false;
		}
	}*/
	
	function afterSubmit(context) 
	{
		if( context.type != context.UserEventType.DELETE ) {
			var recObj				= context.newRecord;
			var recId				= recObj.id;
			log.debug({title: "recId", details: recId});
			var recLoad				= record.load({type: "customrecord_yil_seg_app_matrix", id: recId});
			recLoad.setValue({fieldId: "custrecord_yil_seg_and_above", value: true});
			var subsidiaryId		= recLoad.getValue({fieldId: "custrecord_yil_seg_subsidiary"});
			var departmentId		= recLoad.getValue({fieldId: "custrecord_yil_seg_department"});
			var classId				= recLoad.getValue({fieldId: "custrecord_yil_seg_class"});
			var locationId			= recLoad.getValue({fieldId: "custrecord_yil_seg_location"});
			if( runtime.executionContext != runtime.ContextType.SUITELET ) {		
				var searchAfterSubFilter= [];
				var searchAfterSubColumn= [];
				var amountLimit			= recObj.getValue({fieldId: "custrecord_yil_seg_amount"});
				log.debug({title: "amountLimit", details: amountLimit});
				var internalId			= '';
				var andAbove			= '';
				var amount				= '';
				if(recId) {
					searchAfterSubFilter.push(search.createFilter({name: "internalid", operator: search.Operator.NONEOF, values: recId}));
				}
				
				if(subsidiaryId) {
					searchAfterSubFilter.push(search.createFilter({name: 'custrecord_yil_seg_subsidiary', operator: search.Operator.ANYOF, values: subsidiaryId}));
				}
				else {
					searchAfterSubFilter.push(search.createFilter({name: 'custrecord_yil_seg_subsidiary', operator: search.Operator.ANYOF, values: "@NONE@"}));
				}
				
				if(departmentId) {
					searchAfterSubFilter.push(search.createFilter({name: 'custrecord_yil_seg_department', operator: search.Operator.ANYOF, values: departmentId}));
				}
				else {
					searchAfterSubFilter.push(search.createFilter({name: 'custrecord_yil_seg_department', operator: search.Operator.ANYOF, values: "@NONE@"}));
				}
				
				if(locationId) {
					searchAfterSubFilter.push(search.createFilter({name: 'custrecord_yil_seg_location', operator: search.Operator.ANYOF, values: locationId}));
				}
				else {
					searchAfterSubFilter.push(search.createFilter({name: 'custrecord_yil_seg_location', operator: search.Operator.ANYOF, values: "@NONE@"}));
				}
				
				if(classId) {
					searchAfterSubFilter.push(search.createFilter({name: 'custrecord_yil_seg_class', operator: search.Operator.ANYOF, values: classId}));
				}
				else {
					searchAfterSubFilter.push(search.createFilter({name: 'custrecord_yil_seg_class', operator: search.Operator.ANYOF, values: "@NONE@"}));
				}
				
				searchAfterSubColumn.push(search.createColumn({name: "internalid"}));
				searchAfterSubColumn.push(search.createColumn({name: "custrecord_yil_seg_amount", sort: search.Sort.DESC}));
				searchAfterSubColumn.push(search.createColumn({name: "custrecord_yil_seg_and_above"}));
				log.debug({title: "searchAfterSubColumn", details: searchAfterSubColumn});
				var afterSubSearchObj	= search.create({type: "customrecord_yil_seg_app_matrix", filters: searchAfterSubFilter, columns: searchAfterSubColumn});
				
				var count		= afterSubSearchObj.runPaged().count;
				log.debug({title: "Count for AfterSubmit", details: count});
				afterSubSearchObj.run().each(function(result){
					internalId	= result.getValue({name: "internalid"});
					andAbove	= result.getValue({name: "custrecord_yil_seg_and_above"});
					amount		= result.getValue({name: "custrecord_yil_seg_amount"});
					log.debug({title: "amount for AfterSubmit", details: amount});
					log.debug({title: "internalId for AfterSubmit", details: internalId});
				});
				if(internalId) {
					var searchRecLoad	= record.load({type: "customrecord_yil_seg_app_matrix", id: internalId});
				}
				if((recLoad || searchRecLoad) && amount && amountLimit) {
					if(amountLimit > amount) {
						searchRecLoad.setValue({fieldId: "custrecord_yil_seg_and_above", value: false});
						searchRecLoad.save();
					}
					else {
						recLoad.setValue({fieldId: "custrecord_yil_seg_and_above", value: false});
						searchRecLoad.setValue({fieldId: "custrecord_yil_seg_and_above", value: true});
						searchRecLoad.save();
					}
				}
				recLoad.save();
				
			}
		}
		if( context.type == context.UserEventType.DELETE ) {
			var recObj				= context.newRecord;
			var oldRecObj			= context.oldRecord;
			var recId				= recObj.id;
			log.debug({title: "recId", details: recId});
			//var recLoad				= record.load({type: "customrecord_yil_seg_app_matrix", id: recId});
			var subsidiaryId		= recObj.getValue({fieldId: "custrecord_yil_seg_subsidiary"});
			var departmentId		= recObj.getValue({fieldId: "custrecord_yil_seg_department"});
			var classId				= recObj.getValue({fieldId: "custrecord_yil_seg_class"});
			var locationId			= recObj.getValue({fieldId: "custrecord_yil_seg_location"});
			if( runtime.executionContext != runtime.ContextType.SUITELET ) {		
				var searchAfterSubFilter= [];
				var searchAfterSubColumn= [];
				var amountLimit			= recObj.getValue({fieldId: "custrecord_yil_seg_amount"});
				log.debug({title: "amountLimit", details: amountLimit});
				var internalId			= [];
				var andAbove			= [];
				var amount				= [];
				if(recId) {
					searchAfterSubFilter.push(search.createFilter({name: "internalid", operator: search.Operator.NONEOF, values: recId}));
				}
				
				if(subsidiaryId) {
					searchAfterSubFilter.push(search.createFilter({name: 'custrecord_yil_seg_subsidiary', operator: search.Operator.ANYOF, values: subsidiaryId}));
				}
				else {
					searchAfterSubFilter.push(search.createFilter({name: 'custrecord_yil_seg_subsidiary', operator: search.Operator.ANYOF, values: "@NONE@"}));
				}
				
				if(departmentId) {
					searchAfterSubFilter.push(search.createFilter({name: 'custrecord_yil_seg_department', operator: search.Operator.ANYOF, values: departmentId}));
				}
				else {
					searchAfterSubFilter.push(search.createFilter({name: 'custrecord_yil_seg_department', operator: search.Operator.ANYOF, values: "@NONE@"}));
				}
				
				if(locationId) {
					searchAfterSubFilter.push(search.createFilter({name: 'custrecord_yil_seg_location', operator: search.Operator.ANYOF, values: locationId}));
				}
				else {
					searchAfterSubFilter.push(search.createFilter({name: 'custrecord_yil_seg_location', operator: search.Operator.ANYOF, values: "@NONE@"}));
				}
				
				if(classId) {
					searchAfterSubFilter.push(search.createFilter({name: 'custrecord_yil_seg_class', operator: search.Operator.ANYOF, values: classId}));
				}
				else {
					searchAfterSubFilter.push(search.createFilter({name: 'custrecord_yil_seg_class', operator: search.Operator.ANYOF, values: "@NONE@"}));
				}
				
				searchAfterSubColumn.push(search.createColumn({name: "internalid"}));
				searchAfterSubColumn.push(search.createColumn({name: "custrecord_yil_seg_amount", sort: search.Sort.DESC}));
				searchAfterSubColumn.push(search.createColumn({name: "custrecord_yil_seg_and_above"}));
				log.debug({title: "searchAfterSubColumn", details: searchAfterSubColumn});
				var afterSubSearchObj	= search.create({type: "customrecord_yil_seg_app_matrix", filters: searchAfterSubFilter, columns: searchAfterSubColumn});
				
				var count		= afterSubSearchObj.runPaged().count;
				log.debug({title: "Count for AfterSubmit", details: count});
				afterSubSearchObj.run().each(function(result){
					internalId	= result.getValue({name: "internalid"});
					andAbove	= result.getValue({name: "custrecord_yil_seg_and_above"});
					amount		= result.getValue({name: "custrecord_yil_seg_amount"});
					log.debug({title: "amount for AfterSubmit", details: amount});
					log.debug({title: "internalId for AfterSubmit", details: internalId});
					var testVar1 = record.submitFields({type: "customrecord_yil_seg_app_matrix", id: internalId, values: {"custrecord_yil_seg_and_above": true}});
				});
				/*if(internalId) {
					var searchRecLoad	= record.load({type: "customrecord_yil_seg_app_matrix", id: internalId});
				}
				if((recLoad || searchRecLoad) && amount && amountLimit) {
					if(amountLimit > amount) {
						searchRecLoad.setValue({fieldId: "custrecord_yil_seg_and_above", value: false});
						searchRecLoad.save();
					}
					else {
						recLoad.setValue({fieldId: "custrecord_yil_seg_and_above", value: false});
						searchRecLoad.setValue({fieldId: "custrecord_yil_seg_and_above", value: true});
						searchRecLoad.save();
					}
				}*/
				//recLoad.save();
				
			}
		}
	}

	
		
			
	return {
		beforeLoad : beforeLoad,
		//beforeSubmit : beforeSubmit,
		afterSubmit : afterSubmit
	}
	
});
