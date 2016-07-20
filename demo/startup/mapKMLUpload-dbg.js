/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("splDemoStartup.Setup");
jQuery.sap.require("splReusable.libs.Utils");

(function (w, $, d) {
	if (!w || !$ || !d) {
		throw new Error("Vital parameters missing. This could be due to an unsupported browser version");
	}
	w["oSapSplDemoShell"] = new sap.ui.unified.Shell({icon:"../resources/icons/sap_logo.png"});
	w["oSapSplDemoAppContainer"] = new sap.m.App();
	
	var oDemoHomeView = sap.ui.view({
		viewName:"splDemoView.SPLDemoAppMapKMLUpload",
		id:"splDemoView.SPLDemoAppMapKMLUpload",
		type:sap.ui.core.mvc.ViewType.JS
	});
	
	oDemoHomeView.addEventDelegate({
		onBeforeShow : function (oEvent) {
			oDemoHomeView.getController().onBeforeShow(oEvent);
		}
	}, oDemoHomeView.getController());
	
	oSapSplDemoAppContainer.addPage(oDemoHomeView);
	oSapSplDemoShell.addContent(new sap.m.Shell({app:oSapSplDemoAppContainer}));
	oSapSplDemoShell.placeAt("demoContent");
	
}(window, jQuery, document));