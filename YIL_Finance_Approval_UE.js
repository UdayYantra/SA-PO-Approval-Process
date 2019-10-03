/**
*@NApiVersion 2.0
*@NScriptType UserEventScript
*/

define(['N/record'], function(record) {
    function afterSubmit(context) {
        var recObj      = context.newRecord;
        var recId       = recObj.id;
        var recLoad     = record.load({type: "customrecord_yil_finance_app_matrix", id: recId});  

    }
    return {
        afterSubmit : afterSubmit
    }
});
