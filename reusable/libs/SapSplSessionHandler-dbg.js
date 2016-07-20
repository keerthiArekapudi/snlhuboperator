/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("splReusable.libs.SapSplSessionHandler");
jQuery.sap.require("splReusable.libs.Utils");

/*
 * In case of Form login, when the session times out, for static resources or for business services,
 * the request status is 302. The response header has the x-sap-origin-location field with the path
 * to the redirection URL. Use this.
 * In case of SAML, static resources throw 4xx. Check for the flag:
 * X-DevTools-Emulate-Network-Conditions-Client-Id. If this exists, it is a session timeout. Reload the application
 * In case of SAML, business error response is 404 and the response header has the field "location". If location
 * exists, reload the application (session timeout)
 */

(function (window,document,jQuery) {
	$(document).ready(function () {

		function fnReloadAfterConfirm() {

			//oSapSplEventFactory.dispatch("sessiontimeout");
			sap.m.MessageBox.show(
					oSapSplUtils.getBundle().getText("MESSAGE_FOR_SESSION_TIMEOUT_REFRESH"),
					sap.m.MessageBox.Icon.WARNING,
					oSapSplUtils.getBundle().getText("SPL_ERROR_WARNING_DIALOG_HEADER"), [sap.m.MessageBox.Action.OK],
					function(selection) {
						if (selection === "OK") {
							oSapSplUtils.sLO4S = "app";
							window.location.reload();
						}
					}
			);

		}

		/**
		 * Explicitly handle error message raised by browser in case of a network error
		 */
		window.onerror = function (sErrorMessage, sRequestUrl, iLine, iCol, oErrorObject) {
			var aErrorMessagesToCheck = ["Reason: NetworkError", "Failed to execute \'send\' on \'XMLHttpRequest\'", "could not be loaded from"];
			var bIsError = false;
			if (oErrorObject) {
				//The browser supports error object through HTML5 spec. Proceed with checking network error
				if (oErrorObject.hasOwnProperty("statusCode")) {
					if (oErrorObject["statusCode"] === 0) {
						//Network Error
						fnReloadAfterConfirm();
					}
				}
			} else {
				//Error object does not exist. We have to regex on the error message
				for (var _sErrorMessageToCheck in aErrorMessagesToCheck) {
					if (new RegExp("\\b" + _sErrorMessageToCheck + "\\b").test(sErrorMessage)) {
						bIsError = true;
						break;
					}
				}
				if (bIsError) {
					fnReloadAfterConfirm();
				}

			}

		};

		$(document).ajaxComplete(function (oEvent, jqXhr, oOptions) {
			if (jqXhr.getResponseHeader("com.sap.cloud.security.login")) {
				fnReloadAfterConfirm();
		    }
			else {
				if (oSapSplUtils.getInitializerDetails()) {
					var bIsSAML, sURL, oXSReg, oUIReg, oUIReg1, oLogOutCSRFTokenReg;
					bIsSAML = oSapSplUtils.getInitializerDetails()["isSAML"];
					sURL = oOptions.url;
					oXSReg = /sap\/spl\/xs/i;
					oUIReg = /sap\/spl\/ui/i;
					oUIReg1 = /.\//;
					oLogOutCSRFTokenReg = /Required/;

					if (bIsSAML !== undefined && bIsSAML !== null) {
						if (bIsSAML === true) {
							if (jqXhr.status === 0) {
								if (oXSReg.test(sURL)) {
									fnReloadAfterConfirm();
								} else if (oUIReg1.test(sURL)) {
									fnReloadAfterConfirm();
								}
							} else if (jqXhr.status === 302) {
								if (jqXhr.getResponseHeader("location")) {
									if (oXSReg.test(sURL)) {
										fnReloadAfterConfirm();
									}
								}
							} else if (jqXhr.status === 403) {
								if (jqXhr.getResponseHeader("x-csrf-token") === "Required") {
									fnReloadAfterConfirm(true);
								}
							} else if (jqXhr.status === 408) {
								fnReloadAfterConfirm();
							}
						} else {
							if (jqXhr.status === 200) {
								if (jqXhr.getResponseHeader("x-sap-origin-location") && jqXhr.getResponseHeader("x-sap-login-page")) {
									if (oUIReg.test(jqXhr.getResponseHeader("x-sap-origin-location")) || oXSReg.test(jqXhr.getResponseHeader("x-sap-origin-location"))) {
										fnReloadAfterConfirm();
									}
								}
							} else if (jqXhr.status === 403) {
								if (jqXhr.getResponseHeader("x-csrf-token") && oLogOutCSRFTokenReg.test(jqXhr.getResponseHeader("x-csrf-token"))) {
									fnReloadAfterConfirm();
								}
							} else if (jqXhr.status === 408) {
								fnReloadAfterConfirm();
							}
						}
					}
				}
			}

//			})

		});
	});
}(window, document, jQuery));
