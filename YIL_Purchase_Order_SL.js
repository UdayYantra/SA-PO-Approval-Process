/**
 * @NApiVersion 2.0
 * @NScriptType SuiteLet
 */
define(['N/record','N/http'], function(record, http) {
    function onRequest(context) 
    {
        log.debug({title: "Entered", details: "Entered"});
        var reqObj  = context.request;
        if(reqObj.method == http.Method.GET) {
            var recType = reqObj.parameters['recordType'];
            var recId   = reqObj.parameters['recordId'];
            log.debug({title: "recType", details: recType});
            log.debug({title: "recId", details: recId});

        }
    }

    return {
        onRequest : onRequest
    }
});
