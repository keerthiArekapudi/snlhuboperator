/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
/*global oSapSplEventDefiners*/
jQuery.sap.declare("splReusable.events.SessionTimeoutEvent");

(function(window, oSapSplUtils, undefined){
	if (!oSapSplEventDefiners["sessiontimeout"] || oSapSplEventDefiners["sessiontimeout"] === null) {
		oSapSplEventDefiners["sessiontimeout"] = new CustomEvent("sessiontimeout",{detail:{data:"Timeout"}});
	}
}(window, oSapSplUtils));