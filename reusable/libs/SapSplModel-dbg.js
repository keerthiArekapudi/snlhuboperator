/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("splReusable.libs.SapSplModel");
jQuery.sap.require("sap.ui.model.odata.ODataModel");

try {
    /**
     * @description Extends sap.ui.model.odata.ODataModel to implement the feature of capturing OData timeout. 
     * accessible after instantiation.
     * @constructor
     * @requires sap.ui.model.odata.ODataModel 
     * @since 1.0
     * @throws ReferenceError
     * @namespace Custom model namespace
     * @param oParamObject - A parameter object with the following keys, and their corresponding values.
     *{string}	sUrl							base uri of the service to request data from; additional URL parameters appended here will be appended to every request
     *{boolean}	?bJSON							true to request data as JSON or an object which contains the following parameter properties: json, user, password, headers,
     **   tokenHandling, withCredentials, loadMetadataAsync, maxDataServiceVersion (default = '2.0'; please use the following string format e.g. '2.0' or '3.0'. Currently supported: '2.0' and '3.0'),
     **   useBatch (all requests will be sent in batch requests default = false), refreshAfterChange (enable/disable automatic refresh after change operations: default = true)
     *{string} ?sUser user
     *{string} ?sPassword password
     *{object} ?mHeaders map of custom headers which should be set in each request.
     *{boolean} ?bTokenHandling enable/disable XCSRF-Token handling
     *{boolean} ?bWithCredentials (experimental) true when user credentials are to be included in a cross-origin request. Please note that this works only if all requests are asynchronous.
     *{boolean} ?bLoadMetadataAsync determined if the service metadata request is sent synchronous or asynchronous. Default is false. Please note that if this is set to true attach to the 
     ** metadataLoaded event to get notified when the metadata has been loaded before accessing the service metadata.
     *{boolean} bHandleTimeOut required - true to handle timeOut Event. This class will fire TimeOut event only if this flag is set.
     *{int} iNumberOfSecondsBeforeTimeOut required - if bHandleTimeOut is true, the TimeOut event will be fired after iNumberOfSecondsBeforeTimeOut mili seconds.
     * @example 
     * new splModels.odata.ODataModel({
					url : "URL"), 
					json : true,
					user : undefined,
					password : undefined,
					headers : {"Cache-Control":"max-age=0"},
					tokenHandling : true,
					withCredentials : false,
					loadMetadataAsync : true,
					handleTimeOut : true,
					numberOfSecondsBeforeTimeOut : 10000
				});
     */

    sap.ui.model.odata.ODataModel.extend("splModels.odata.ODataModel", {

        constructor: function (oParamObject) {
            var sUrl = oParamObject["url"];
            var bHandleTimeOut = oParamObject["handleTimeOut"];
            var iNumberOfSecondsBeforeTimeOut = oParamObject["numberOfSecondsBeforeTimeOut"];

            if (sUrl !== undefined && sUrl !== null && typeof (sUrl) === "string" && sUrl.length !== 0) {
                var sParamArray = this.fnConvertObjectToArray(oParamObject);
                sap.ui.model.odata.ODataModel.apply(this, sParamArray); // call super-constructor
                /*
                 * Initiating setTimeout, only if iNumberOfSecondsBeforeTimeOut is set by the user, and bHandleTimeOut is true.
                 */
                if (bHandleTimeOut === true && iNumberOfSecondsBeforeTimeOut !== undefined) {
                    window.setTimeout(jQuery.proxy(this.fnCheckForMetaDataLoadComplete, this), iNumberOfSecondsBeforeTimeOut);
                    this.attachEvent("metadataLoaded", this.handleMetadataLoadEvent);
                } else {
                    throw new ReferenceError();
                }
            } else {
                throw new ReferenceError();
            }
        },

        /**
         * @description Function to convert the param list - as object, to a param list as array.
         * This is implemented for easy and meaningful consumption. (object will give the parameters, a meaning - because of the key : value pairs)
         * @function
         * @private
         *
         **/
        fnConvertObjectToArray: function (oParamObject) {
            var aParamArray = [];
            aParamArray.push(((oParamObject["url"]) ? oParamObject["url"] : ""));
            aParamArray.push(((oParamObject["json"]) ? oParamObject["json"] : undefined));
            aParamArray.push(((oParamObject["user"]) ? oParamObject["user"] : undefined));
            aParamArray.push(((oParamObject["password"]) ? oParamObject["password"] : undefined));
            aParamArray.push(((oParamObject["headers"]) ? oParamObject["headers"] : undefined));
            aParamArray.push(((oParamObject["tokenHandling"]) ? oParamObject["tokenHandling"] : undefined));
            aParamArray.push(((oParamObject["withCredentials"]) ? oParamObject["withCredentials"] : undefined));
            /*
             * Making bLoadMetadataAsync as true - to ensure, metadataLoaded event is available to check timeout.
             */
            aParamArray.push(((oParamObject["loadMetadataAsync"] || oParamObject["handleTimeOut"]) ? true : false));
            aParamArray.push(((oParamObject["handleTimeOut"]) ? oParamObject["handleTimeOut"] : undefined));
            aParamArray.push(((oParamObject["numberOfSecondsBeforeTimeOut"]) ? oParamObject["numberOfSecondsBeforeTimeOut"] : undefined));

            return aParamArray;
        },

        /**
         * @description Function to check if the metadata is loaded successfully, after a time period of 10 seconds.
         * Fires the "timeOut" event if the metadata is not loaded after 10 seconds.
         * @function
         * @private
         *
         **/
        fnCheckForMetaDataLoadComplete: function () {
            if (!this.oDataMetadataLoadcomplete) {
                this.fireEvent("timeOut");
            }
        },

        /**
         * @description Fired once the model metadata is loaded.
         * @function
         * @private
         **/
        handleMetadataLoadEvent: function () {
            this.oDataMetadataLoadcomplete = true;
        }

    });
} catch (errorObject) {
    if (errorObject.constructor === ReferenceError()) {
        jQuery.sap.log.error(errorObject.message, "Parameters to the SapSplOdataModel not as expected.", "SapSplModelFormatters.js");
    }
}
