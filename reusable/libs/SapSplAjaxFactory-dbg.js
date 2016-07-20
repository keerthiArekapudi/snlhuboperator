/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("splReusable.libs.SapSplAjaxFactory");
jQuery.sap.require("sap.ca.ui.message.message");

var oSapSplAjaxFactory = (function ( ) {

	var oAppBusyIndicator = oSapSplBusyDialog.getBusyDialogInstance({
		title : oSapSplUtils.getBundle().getText("BUSY_DIALOG_MESSAGE")
	});
	var aSupportedSettings = [ {
		name : "url",
		isMandatory : true
	}, {
		name : "async",
		isMandatory : false,
		def : true
	}, {
		name : "cache",
		isMandatory : false,
		def : false
	}, {
		name : "method",
		isMandatory : true
	}, {
		name : "data",
		isMandatory : false
	}, {
		name : "timeout",
		isMandatory : false,
		def : 10000
	}, {
		name : "contentType",
		isMandatory : false,
		def : "application/json; charset=UTF-8"
	}, {
		name : "dataType",
		isMandatory : false,
		def : "json"
	}, {
		name : "beforeSend",
		isMandatory : false,
		type : "function"
	}, {
		name : "success",
		isMandatory : false,
		type : "function"
	}, {
		name : "error",
		isMandatory : false,
		type : "function"
	}, {
		name : "complete",
		isMandatory : false,
		type : "function"
	}, {
		name : "handleBusyIndicator",
		isMandatory : false,
		def : true
	} ];
	var bMandatoryCheckPassed = true;
	var bMethodExists = true;
	var aSupportedMethods = [ "GET", "POST", "PUT", "DELETE" ];

	/* Function checks if the passed method is supported */
	function checkForSupportedMethods ( oSettings ) {
		for ( var sSupportedMethod in aSupportedMethods ) {
			if ( oSettings["method"]
					&& (oSettings["method"].toString().toUpperCase() === aSupportedMethods[sSupportedMethod]) ) {
				bMethodExists = true;
				break;
			}
		}
		if ( bMethodExists !== true ) {
			/*
			 * throw new Error("Mandatory method not
			 * passed!"+oSettings["method"]);
			 */
			$.sap.log.error("Data Access Library", "AJAX Method not supported"
					+ oSettings["method"], "SapSplAjaxFactory");
		} else {
			return bMethodExists;
		}
	}

	/* Function checks if the all mandatory parameters are passed */
	function checkForMandatorySettings ( oSettings ) {
		for ( var sSupportedSetting in aSupportedSettings ) {
			if ( aSupportedSettings[sSupportedSetting].isMandatory ) {
				if ( !oSettings[aSupportedSettings[sSupportedSetting].name] ) {
					if ( aSupportedSettings[sSupportedSetting].name === "method" ) {
						continue;
					}
					bMandatoryCheckPassed = false;
					break;
				}
			}
		}
		if ( bMandatoryCheckPassed !== true ) {
			$.sap.log.error("Data Access Library",
					"Mandatory Paramater not passed"
							+ aSupportedSettings[sSupportedSetting].name,
					" SapSplAjaxFactory");
		} else {
			return bMandatoryCheckPassed;
		}
	}

	/* Ajax object is created using the parameters passed */
	function createAjaxSettingObject ( oSettings ) {
		var ajaxObjectSettings = {};
		for ( var i in aSupportedSettings ) {
			if ( aSupportedSettings[i].def !== undefined ) {
				ajaxObjectSettings[aSupportedSettings[i].name] = aSupportedSettings[i].def;
			} // not adding undefined parameters
		}
		$.each(oSettings, function ( sKey, sValue ) { // parameters sent from
														// the consumer is added
														// here. overrides above
														// values
			ajaxObjectSettings[sKey] = sValue;
		});

		// Default the beforesend function
		//Default Content-Type to charset=UTF-8
		if ( !oSettings["beforeSend"] ) {
			ajaxObjectSettings["beforeSend"] = function ( xhr ) {
				xhr.setRequestHeader("X-CSRF-Token", oSapSplUtils
						.getCSRFToken());
				xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
				/* CSNFIX : 0120031469 619381 2014 */
				// oAppBusyIndicator.open();
			};
		} else {
			ajaxObjectSettings["beforeSend"] = function ( xhr ) {
				xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
				oSettings["beforeSend"](xhr);
			};
		}

		ajaxObjectSettings["success"] = function ( data, success, oMessageObject ) {
			if ( oSettings["success"] ) {
				oSettings["success"](data, success, oMessageObject);
			}
		};

		ajaxObjectSettings["error"] = function ( xhr, testStatus, error ) {
			if ( oSettings["error"] ) {
				oSettings["error"](xhr, testStatus, error); // error handling to
															// be done here
			}
		};

		ajaxObjectSettings["complete"] = function ( xhr ) {
			if ( oSettings["complete"] ) {
				oSettings["complete"](xhr);
			}
			oAppBusyIndicator.close();
		};

		return ajaxObjectSettings;
	}

	/* Firing the ajax call */
	function fnCall ( oSettings ) {
		var oAjaxObjResult = {};
		if ( oSettings["type"] ) {
			oSettings["method"] = oSettings["type"];
		}
		if ( checkForMandatorySettings(oSettings)
				&& checkForSupportedMethods(oSettings) ) {
			if ( oSettings["handleBusyIndicator"] === true ) {
				oAppBusyIndicator.open();
			}
			oAjaxObjResult = $.ajax(createAjaxSettingObject(oSettings));
		}
		return oAjaxObjResult;
	}

	return {
		fireAjaxCall : fnCall
	};

})();
