/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("splReusable.listeners.SessionTimeoutEventListener");

(function(window, document, location,$, undefined){
	/*
	 * Session Timeout Event Listener.
	 */
	document.addEventListener("sessiontimeout",function(){
		sap.m.MessageBox.show(
				oSapSplUtils.getBundle().getText("MESSAGE_FOR_SESSION_TIMEOUT_REFRESH"),
				sap.m.MessageBox.Icon.WARNING,
				oSapSplUtils.getBundle().getText("SPL_ERROR_WARNING_DIALOG_HEADER"), [sap.m.MessageBox.Action.OK],
				function(selection) {
					if (selection === "OK") {
						oSapSplEventFactory.dispatch("reloadApp");
					} else {
						return;
					}

				}
		);
	});

}(window, document, location,jQuery));