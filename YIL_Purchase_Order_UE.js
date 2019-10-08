/** 
 * @NApiVersion 2.0
 * @NScriptType UserEventScript
 */
define(['N/record','N/runtime','N/ui/serverWidget'], function(record, runtime, server) {
    function beforeLoad(context) 
    {
        var form            = context.form;
        var recObj          = context.newRecord;
        var recId           = recObj.id;
        var recType         = recObj.type;
        var userObj         = runtime.getCurrentUser();
        var currentUserRole = userObj.role;
        var currentUserId   = userObj.id;
        var stadStatusField = form.getField({id: "approvalstatus"});
      
        log.debug({title: "currentUserRole", details: currentUserRole});
        log.debug({title: "currentUserId", details: currentUserId});
        
        if(context.type == context.UserEventType.VIEW) {
            var recLoad     = record.load({type: recType, id: recId});
            var appFlowID   = recLoad.getValue({fieldId: "custbody_yil_po_approval_flow"});
            var appStatus   = recLoad.getValue({fieldId: "approvalstatus"});
            var requester   = recLoad.getValue({fieldId: "custbody_yil_requestor"});
            
            log.debug({title: "appFlowID", details: appFlowID});
            log.debug({title: "appStatus", details: appStatus});
            form.clientScriptModulePath = '/SuiteScripts/YIL_Procurement_Approval_CL.js';

            if(appStatus == 1) {
                if(!appFlowID) {
                    var subForAppButton = form.addButton({id : "custpage_subforapp", label: "Submit For Approval", functionName : "subForAppButtonFun('"+recId+"','"+requester+"')"});
                }
                else {
                    var nextLevel = '';
                    nextLevel = validateNextApprover(currentUserId, currentUserRole, appFlowID);
                    log.debug({title: "nextLevel", details:nextLevel});
                    if(nextLevel != '') {
                        var approveButton   = form.addButton({id : "custpage_approve", label: "Approve", functionName : "approveButtonFun('"+recId+"')"});
                        var rejectButton    = form.addButton({id : "custpage_reject", label: "Reject", functionName : "rejectButtonFun('"+recId+"')"});
                    }
                    var sendNotiButton  = form.addButton({id: "custpage_sentnoti", label: "Send Notification", functionName : "sendNotiButtonFun('"+recId+"')"});
                }
            }
            stadStatusField.updateDisplayType({displayType: server.FieldDisplayType.HIDDEN});
        }
        if(context.type == context.UserEventType.COPY) {
            recObj.setValue({fieldId: "custbody_yil_po_approval_flow", value : null});
            recObj.setValue({fieldId: "custbody_yil_po_approval_status", value : null});
            recObj.setValue({fieldId: "custbody_yil_requestor", value : null});
           // recObj.setValue({fieldId: "custbody_yil_po_approval_status", value : null});
        }	
    }

    function validateNextApprover(currentUserId, currentUserRole, appFlowID) 
    {
        var appFlowObj  = record.load({type: "customrecord_yil_po_approval_flow", id: appFlowID});
        var nextApprovalLevel   = '';
        var adminLevel          = '';

        if(appFlowObj != null) 
        {
            var noOfLevel           = appFlowObj.getValue({fieldId: "custrecord_yil_number_of_levels"});
            var empFound            = false;
            for(var l=1; l<=noOfLevel; l++)
            {
                var approverFieldId     = "custrecord_yil_approver_"+l;
                var statusFieldId       = "custrecord_yil_approval_status_"+l;
                log.debug({title: "approverFieldId", details : approverFieldId});
                log.debug({title: "statusFieldId", details: statusFieldId});

                var approverId      = appFlowObj.getValue({fieldId: approverFieldId.toString()});
                var approverStatus  = appFlowObj.getValue({fieldId: statusFieldId.toString()});
                
                log.debug({title: "approverId", details : approverId});
                log.debug({title: "approverStatus", details: approverStatus});


                if(approverStatus == 1)
                {
                    if(!adminLevel) {
                        adminLevel = l;
                    }
                    if(approverId == currentUserId)
                    {
                        empFound            = true;
                        nextApprovalLevel   = l;
                        break;
                    }
                }
            }
            if(!empFound && currentUserRole == 3) {
                nextApprovalLevel = adminLevel;
            }
            if(!empFound && currentUserRole != 3) {
                nextApprovalLevel = '';
            }
        }
        return nextApprovalLevel;
    }
    
    return {
        beforeLoad : beforeLoad
    }
});
