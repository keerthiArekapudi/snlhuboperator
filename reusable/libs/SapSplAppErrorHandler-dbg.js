/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("splReusable.libs.SapSplAppErrorHandler");
jQuery.sap.require("sap.ca.ui.message.message");

/*
 * A simple error handler dialog which can be consumed by individual SPL applications.
 * Garbage collection handled within local scope
 * Revealing module pattern
 */
var oSapSplAppErrorHandler = (function () {

    /***************************************************/
    /*Declare variables here. Do NOT DEPEND on hoisting*/
    /***************************************************/
    /* Incident: 1570152443 */
    var oDummyErrorObject = null,
        _oErrorObject = null,
        sDefaultErrorType = sap.ca.ui.message.Type.ERROR,
        oParameters = {
            0: {},
            1: true,
            2: {},
            3: function(){}
        };

    /*
     * Garbage collection
     */
    function __gc__(fnDone) {
        oDummyErrorObject = null;
        _oErrorObject = null;
        fnDone();
    }

    /**
     * Check the parameters being passed. If type mismatch, just throw error and break
     */
    function __validateParameters__(aParameters) {

        for (var key in oParameters) {
            if (oParameters.hasOwnProperty(key)) {
                if (aParameters[key] !== null) {
                    /* Incident: 1570152443 */
                    /* constructor.name gives undefined in IE */
                    if (oParameters[key].constructor !== aParameters[key].constructor) {
                        jQuery.sap.log.error(key + "\n" + aParameters[key] + "\n" + oParameters[key]);
                    }
                }
            }
        }

    }

    function __renderErrorInterface__(oErrorObject, onDialogClose) {
        sap.ca.ui.message.showMessageBox(oDummyErrorObject, function () {
            __gc__(function () {
                onDialogClose({
                    m: "Error handler closed"
                });
            });
        });
    }


    /**
     * @description Handler to display Fiori like Message Dialog
     * @since 1.0.1
     * @param oXhr {Object} The XML HTTP Response object
     * @param bIsAppError {Boolean} If true the Xhr.responseJSON is parsed as if it is SPL Business Error object. If False, it is stringified and rendered as Technical error
     * @oaram oOptions {Object} Options. Can be used in future
     * @param onDialogClose {Function} Callback function on close of this dialog
     * @param ?onDialogAfterClose {Function} Future use. Ignored for now
     * @param ?onDialogBeforeClose {Function} Future use. Ignored for now
     */
    var show = function (oXhr, bIsAppError, oOptions, onDialogClose, onDialogAfterClose, onDialogBeforeClose) {

        __validateParameters__(arguments);

        if (!oDummyErrorObject || oDummyErrorObject === null) {
            oDummyErrorObject = {
                type: "",
                message: "",
                details: ""
            };
        }

        /*Forbidden. Could be session related. Dispatch session timeout*/
        if (oXhr.status === 403) {
            oSapSplEventFactory.dispatch("sessiontimeout");
            return;
        }

        if (bIsAppError && oXhr.responseJSON && oXhr.responseJSON.hasOwnProperty("Error")) {
            _oErrorObject = oSapSplUtils.getErrorMessagesfromErrorPayload(oXhr.responseJSON);
            oDummyErrorObject.type = _oErrorObject["messageTitle"];
            oDummyErrorObject.message = _oErrorObject["errorWarningString"];
            oDummyErrorObject.details = _oErrorObject["ufErrorObject"];
        } else {
            oDummyErrorObject.type = sDefaultErrorType;
            oDummyErrorObject.message = oSapSplUtils.getBundle().getText("GENERIC_ERROR_MESSAGE");
            oDummyErrorObject.details = JSON.stringify(oXhr.responseText);
        }

        __renderErrorInterface__(oDummyErrorObject, onDialogClose, onDialogAfterClose, onDialogBeforeClose);

    };

    return {
        show: show
    };
}());
