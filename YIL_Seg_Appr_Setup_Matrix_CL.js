/**
*@NApiVersion 2.0
*@NScriptType ClientScript
*/
define(['N/record'], function(record) {
	function validateField(context)
	{
		var currentRecObj	= context.currentRecord;
		var fieldIdTxt	= context.fieldId;
		var subsidiaryId	= currentRecObj.getValue({fieldId : "custrecord_yil_subsidiary"});
		var departmentId	= currentRecObj.getValue({fieldId : "custrecord_yil_departments"});
		var locationId		= currentRecObj.getValue({fieldId : "custrecord_yil_location"});
		var classId			= currentRecObj.getValue({fieldId : "custrecord_yil_classes"});
		var confFlag		= '';

		if(fieldIdTxt == "custrecord_yil_subsidiary") {
			if(subsidiaryId) {
				alert("After Checking this checkbox, User need to fill the Subsidiary field in YIL: Segment Approval Matrix");
				confFlag = true;
			}
			else {
				confFlag	=confirm("After Unchecking this checkbox, Subsidiary Column in the YIL: Segment Approval Matrix will be deleted");
			}
		}

		if(fieldIdTxt == "custrecord_yil_departments") {
			if(departmentId) {
				alert("After Checking this checkbox, User need to fill the Department field in YIL: Segment Approval Matrix");
				confFlag = true;
			}
			else {
				confFlag	=confirm("After Unchecking this checkbox, Department Column in the YIL: Segment Approval Matrix will be deleted");
			}
		}

		if(fieldIdTxt == "custrecord_yil_location") {
			if(locationId) {
				alert("After Checking this checkbox, User need to fill the Location field in YIL: Segment Approval Matrix");
				confFlag = true;
			}
			else {
				confFlag	=confirm("After Unchecking this checkbox, Location Column in the YIL: Segment Approval Matrix will be deleted");
			}
		}

		if(fieldIdTxt == "custrecord_yil_classes") {
			if(classId) {
				alert("After Checking this checkbox, User need to fill the Class field in YIL: Segment Approval Matrix");
				confFlag = true;
			}
			else {
				confFlag	=confirm("After Unchecking this checkbox, Class Column in the YIL: Segment Approval Matrix will be deleted");
			}
		}

		if(!confFlag) {
			return false;
		}

		
		return true;	
		
	}
	
	
	return {
		validateField : validateField
	}
});
	