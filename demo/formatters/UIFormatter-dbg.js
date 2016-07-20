/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("splDemoFormatter.UIFormatter");

splDemoFormatter.UIFormatter = function() {
	
}

splDemoFormatter.UIFormatter.getMessageSpecificIcon = function (sMessageType) {
	var sReturnedIconUrl = null;
	if (sMessageType === "DM") {
		sReturnedIconUrl = "sap-icon://shipping-status";
	} else {
		sReturnedIconUrl = "sap-icon://map-2";
	}
	
	return sReturnedIconUrl;
};