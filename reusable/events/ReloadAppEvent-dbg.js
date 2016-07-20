/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
/*global oSapSplEventDefiners*/
jQuery.sap.declare("splReusable.events.ReloadAppEvent");

(function(window, oSapSplUtils, undefined){
	if (!oSapSplEventDefiners["reloadApp"] || oSapSplEventDefiners["reloadApp"] === null) {
		oSapSplEventDefiners["reloadApp"] = new CustomEvent("reloadApp",{detail:{data:"Reload"}});
	}
}(window, oSapSplUtils));