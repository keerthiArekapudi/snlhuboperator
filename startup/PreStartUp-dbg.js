/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
/**
 * Anonymous function to launch the SPL project in debug mode and support mode.
 * Using local storage as UI5 libraries are not loaded yet.
 * @returns void
 */
(function() {
	var sSupportKey = "SPLSupport";
	var sDebugKey = "sap-ui-debug";
	var bEnableDebugMode = false;

	try {
		if (window) {

			/*Set application header. Read this from configuration. Make synchronous ajax for this*/
			/*Firefox does not have a own property in document object called title. Hence this was failing in FF.
			 * Removing this check*/
			if (document) {
				document.title = "SAP Networked Logistics Hub 1.0";
			} else {
				jQuery.sap.log.error("SAP Connected Logistics Pre startup", "INVALID OBJECT. Aborting!!!!!", "SAPSCL");
				return;
			}

			if (window.location) {
				var sMode = window.location.search;
				var aMode = sMode.split("&");
				for ( var i = 0; i < aMode.length; i++) {
					var aParams = aMode[i].split("=");
					if ((aParams[0] === "?spl-mode" || aParams[0] === "spl-mode") && aParams[1] === "debug") {
						bEnableDebugMode = true;
					}
				}
				if (bEnableDebugMode) {
					if (window.localStorage) {

						/*Using sap-ui-debug to run the project in debug mode*/
						if (!(window.localStorage.getItem(sDebugKey) && window.localStorage.getItem(sDebugKey) === "X")) {
							window.localStorage.setItem(sDebugKey, "X");
						}

						/*Using support key to run the project in support mode-for performance logging*/
						if (!(window.localStorage.getItem(sSupportKey) && window.localStorage.getItem(sSupportKey) === "X")) {
							window.localStorage.setItem(sSupportKey, "X");
						}
					} else { /*Local storage reference error*/
						throw new Error();
					}
				} else {
					if (window.localStorage) {
						window.localStorage.setItem(sDebugKey, "");
						window.localStorage.setItem(sSupportKey, "");
					} else { /*Local storage reference error*/
						throw new Error();
					}
				}
			} else { /*location object doesn't exist*/
				throw new Error();
			}
		} else { /*window object doesn't exist*/
			throw new Error();
		}
	} catch (oEvent) {
		if (oEvent.constructor === Error()) {
			jQuery.sap.log.error(oEvent.message, "Error In PreStartUp", "PreStartUp.js");
		}
	}
}());
