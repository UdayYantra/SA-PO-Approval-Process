/**
 * @NApiVersion 2.0
 * @NScriptType SuiteLet
 */
define(['N/record','N/http','N/search'], function(record, http, search) {
    function onRequest(context) 
    {
        log.debug({title: "Entered", details: "Entered"});
        var reqObj  = context.request;
        if(reqObj.method == http.Method.GET) {
            var l       = 0;
            var recId   = reqObj.parameters['recordId'];
            log.debug({title: "recId", details: recId});

            var recLoad     = record.load({type: "purchaseorder", id: recId});
            var requestorId = recLoad.getValue({fieldId: "custbody_yil_requestor"});
            var preparerId  = recLoad.getValue({fieldId: "custbody_yil_preparer"});
            var poAmount    = recLoad.getValue({fieldId: "total"});
            
            var aprTypeSetupSearchColumn    = [];
            var financeFilters              = [];
            var financeColumns              = [];
            var supervisorApr               = '';
            var segmentApr                  = '';
            var financeApr                  = '';
            var financePosition             = '';           

            aprTypeSetupSearchColumn.push(search.createColumn({name: "custrecord_yil_supervisor_app"}));
            aprTypeSetupSearchColumn.push(search.createColumn({name: "custrecord_yil_segment_app"}));
            aprTypeSetupSearchColumn.push(search.createColumn({name: "custrecord_finance_app"}));
            aprTypeSetupSearchColumn.push(search.createColumn({name: "custrecord_yil_finance_position"}));

            var searchObj   = search.create({type: "customrecord_yil_app_type_matrix", columns: aprTypeSetupSearchColumn});
            var count       = searchObj.runPaged().count;
            log.debug({title: "count", details: count});

            searchObj.run().each(function(result){
                supervisorApr   = result.getValue({name: "custrecord_yil_supervisor_app"});
                segmentApr      = result.getValue({name: "custrecord_yil_segment_app"});
                financeApr      = result.getValue({name: "custrecord_finance_app"});
                financePosition = result.getValue({name: "custrecord_yil_finance_position"});
            });
            log.debug({title: "supervisorApr", details: supervisorApr});
            log.debug({title: "financePosition", details: financePosition});
            
            l++;
            var approverFieldId = "custrecord_yil_approver_"+l;
            var statusFieldId   = "custrecord_yil_approval_status_"+l;

            if(requestorId != '' && preparerId != '')
            {
                var poRecObj    = record.load({type: "customrecord_yil_po_approval_flow", id: 4});
                if(requestorId == preparerId) {
                    poRecObj.setValue({fieldId: approverFieldId.toString(), value: requestorId});
                    poRecObj.setValue({fieldId: statusFieldId.toString(), value: 2});
                }
                else {
                    poRecObj.setValue({fieldId: approverFieldId.toString(), value: requestorId});
                    poRecObj.setValue({fieldId: statusFieldId.toString(), value: 1});
                }
                poRecObj.save();
            }

            if(financeApr && financePosition == 1)
            {
                log.debug({title: "Entered In Finance condition", details: "financePosition"});
                financeFilters.push([["custrecord_yil_fin_amount","greaterthan",poAmount], "OR", ["custrecord_yil_fin_above_amount","is","T"]]);
                financeColumns.push(search.createColumn({name: "custrecord_yil_fin_approver", label: "APPROVER"}));
                financeColumns.push(search.createColumn({name: "custrecord_yil_fin_amount", label: "Amount"}));
                financeColumns.push(search.createColumn({name: "custrecord_yil_fin_above_amount", sort: search.Sort.ASC, label: "And above"}));
                var searchFinance = search.create({type:"customrecord_yil_finance_app_matrix",filters: financeFilters, columns: financeColumns});
                var count = searchFinance.runPaged().count;
                var searchRange =searchFinance.run().getRange({start:0,end:1000});
                for(var i=0;i<searchRange.length;i++)
                {
                    var approvalFinance     =searchRange[0].getValue({name:'custrecord_yil_fin_approver'});
                    var approvalFinanceName =searchRange[0].getText({name:'custrecord_yil_fin_approver'});
                    var amountFinance       =searchRange[0].getValue({name:'custrecord_yil_fin_amount'});
                    var aboveFinance        =searchRange[0].getValue({name:'custrecord_yil_fin_above_amount'});      
                    log.debug({title: "approvalFinance", details: approvalFinance});
                    log.debug({title: "amountFinance", details: amountFinance});                                           
                }
            }

            if(supervisorApr)
            {

            }

            

        }
        context.response.writePage(true);
    }

    return {
        onRequest : onRequest
    }
});
