/**
 * @NApiVersion 2.0
 * @NScriptType SuiteLet
 */
define(['N/ui/serverWidget', 'N/log', 'N/http', 'N/record', 'N/search'], function(server, log, http, record, search) {
    function onRequest(context) 
    {
        log.debug({title: "Entered", details: "Hello"});
        var reqObj	= context.request;
	    if(reqObj.method == http.Method.GET) {
            var recType         = reqObj.parameters['recordType'];
            var recId           = reqObj.parameters['recordId'];
            var segSearchFilter = [];
            var segSearchColumn = [];
            var arrA            = [];
            var arrB            = [];
            var arrC            = [];
            var subId           = '';
            var departId        = '';
            var classId         = '';
            var locationId      = '';
            var amount          = '';
            var inteId          = '';
            //log.debug({title : "recType", details: recType});
            //log.debug({title : "recId", details: recId});

            /*var recObj            = record.load({type: recType , id: recId});
            var subsidiaryId		= recObj.getValue({fieldId : "custrecord_yil_subsidiary"});
		    var departmentId		= recObj.getValue({fieldId : "custrecord_yil_departments"});
		    var locationID			= recObj.getValue({fieldId : "custrecord_yil_location"});
		    var classId				= recObj.getValue({fieldId : "custrecord_yil_classes"});*/

            segSearchFilter.push(search.createFilter({name: 'custrecord_yil_seg_and_above', operator: search.Operator.IS, values: 'T'}));
            segSearchColumn.push(search.createColumn({name: 'custrecord_yil_seg_subsidiary', sort: search.Sort.ASC}));
            segSearchColumn.push(search.createColumn({name: 'custrecord_yil_seg_department', sort: search.Sort.ASC}));
            segSearchColumn.push(search.createColumn({name: 'custrecord_yil_seg_class', sort: search.Sort.ASC}));
            segSearchColumn.push(search.createColumn({name: 'custrecord_yil_seg_location', sort: search.Sort.ASC}));
            segSearchColumn.push(search.createColumn({name: 'custrecord_yil_seg_amount'}));
            segSearchColumn.push(search.createColumn({name: 'internalid'}));
            var searchObj   = search.create({type: 'customrecord_yil_seg_app_matrix', filters: segSearchFilter, columns: segSearchColumn});
            var count       = searchObj.runPaged().count;
            log.debug({title: "count", details: count});

            searchObj.run().each(function(result){
                subId       = result.getValue({name: "custrecord_yil_seg_subsidiary"});
                departId    = result.getValue({name: "custrecord_yil_seg_department"});
                classId     = result.getValue({name: "custrecord_yil_seg_class"});
                locationId  = result.getValue({name: "custrecord_yil_seg_location"});
                amount      = result.getValue({name: "custrecord_yil_seg_amount"});
                inteId      = result.getValue({name: "internalid"});

                /*log.debug({title: "subId", details: subId});
                log.debug({title: "departId", details: departId});
                log.debug({title: "classId", details: classId});
                log.debug({title: "locationId", details: locationId});
                log.debug({title: "amount", details: amount});*/
                var arrStr = '';

                if(!subId) { subId = 0; }
                if(!departId) { departId = 0; }
                if(!classId) { classId = 0; }
                if(!locationId) { locationId = 0; }


                if(subId) {
                    if(arrStr) {
                        arrStr += "_";
                    }
                    arrStr += subId;
                }
                if(departId) {
                    if(arrStr) {
                        arrStr += "_";
                    }
                    arrStr += departId;
                }
                if(classId) {
                    if(arrStr) {
                        arrStr += "_";
                    }
                    arrStr += classId;
                }
                if(locationId) {
                    if(arrStr) {
                        arrStr += "_";
                    }
                    arrStr += locationId;
                }
                if(arrA.length < 1) {
                    arrA.push(arrStr);
                    arrB.push(Number(amount));
                    arrC.push(inteId);
                }
                else {
                    log.debug({title: "arrA", details: arrA});
                    log.debug({title: "arrB", details: arrB});
                    log.debug({title: "arrC", details: arrC});
                    
                    var indexOfRec  = arrA.indexOf(arrStr);
                   // log.debug({title: "indexOfRec", details: indexOfRec});
                    if(indexOfRec < 0) {
                        arrA.push(arrStr);
                        arrB.push(Number(amount));
                        arrC.push(inteId);
                    }
                    else {
                        var arrBval = arrB[indexOfRec];
                        var arrCval = arrC[indexOfRec];

                        /*log.debug({title: "amount", details: amount});
                        log.debug({title: "inteId", details: inteId});
                        log.debug({title: "arrBval", details: Number(arrBval)});
                        log.debug({title: "arrCval", details: arrCval});*/
                        
                        if(Number(arrBval) > Number(amount)) {
                            //record.submitFields({type: "customrecord_yil_seg_app_matrix", id: arrCval, values: {"custrecord_yil_seg_and_above": true}});
                            var testVar1 = record.submitFields({type: "customrecord_yil_seg_app_matrix", id: inteId, values: {"custrecord_yil_seg_and_above": false}});
                           log.debug({title: "Inside Else", details:"Entered In Else 1st " });
                           log.debug({title: "testVar1", details: testVar1});
                        }
                        else {
                            record.submitFields({type: "customrecord_yil_seg_app_matrix", id: arrCval, values: {"custrecord_yil_seg_and_above": false}});
                            var testVar = record.submitFields({type: "customrecord_yil_seg_app_matrix", id: inteId, values: {"custrecord_yil_seg_and_above": true}});
                            arrB[indexOfRec]    = Number(amount);
                            arrC[indexOfRec]    = inteId;
                            log.debug({title: "testVar", details: testVar});
                            log.debug({title: "Inside Else", details:"Entered In Else 2nd" });

                        }
                    }
                }

                   /* var indexOfRecord    = arrA.indexOf(arrStr);
                    log.debug({title: "Inside else indexOfRec", details: indexOfRecord });
                    if(amount && inteId) {
                        arrB.push(amount);
                        arrC.push(inteId);
                        var indexOfAmount    = arrB.indexOf(amount);
                        var indexOfInternalID= arrC.indexOf(inteId);

                        log.debug({title: "inside else amount", details: amount});
                        log.debug({title: "inside else internalId", details: internalId});
                        log.debug({title: "inside else indexOfAmt", details: amount[indexOfAmount]});
                        log.debug({title: "inside else indexOfInteID", details: internalId[indexOfInternalID]});
                    }

                    if(arrA[indexOfRec] == arrA[indexOfRecord]) {
                        log.debug({title: "inside condition", details: internalId[indexOfInteID]});
                        log.debug({title: "inside condition", details: internalId[indexOfInternalID]});
                        if(amount[indexOfAmt] > amount[indexOfAmount]) {
                            record.submitFields({type: "customrecord_yil_seg_app_matrix", id: internalId[indexOfInteID], values: {"custrecord_yil_seg_amount": true}});
                            record.submitFields({type: "customrecord_yil_seg_app_matrix", id: internalId[indexOfInternalID], values: {"custrecord_yil_seg_amount": false}});
                   
                        }
                        else {
                            record.submitFields({type: "customrecord_yil_seg_app_matrix", id: internalId[indexOfInteID], values: {"custrecord_yil_seg_amount": false}});
                            record.submitFields({type: "customrecord_yil_seg_app_matrix", id: internalId[indexOfInternalID], values: {"custrecord_yil_seg_amount": true}});
                   
                        }
                    }*/
                



                /**if(arrStr) {
                    if(arrA.length == 0) {
                        arrA.push(arrStr);
                    }
                    else { 
                        arrB.push(arrStr)
                    }
                }*/
               
                //log.debug({title: "arrB", details: arrB});
                //log.debug({title: "amount", details: amount});
                //log.debug({title: "internalId", details: internalId});
               /* else {
                    if(subId) {
                        arrB.push(subId);
                    }
                    if(departId) {
                        arrB.push(departId);
                    }
                    if(classId) {
                        arrB.push(classId);
                    }
                    if(locationId) {
                        arrB.push(locationId);
                    }
                    if(andAbove && inteId) {
                        var secondCheckBox      = andAbove;
                        var storeInteIdSecond   = inteId;
                    }
                }*/

               return true;
            });


        }
        context.response.writePage(true);
    }

    return {
        onRequest : onRequest
    }
});