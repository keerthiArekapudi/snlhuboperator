/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("splDemoStartup.Vehicles");
jQuery.sap.require("splReusable.libs.Utils");
jQuery.sap.require("splReusable.libs.SapSplModelFormatters");
jQuery.sap.require("splDemoFormatter.UIFormatter");
jQuery.sap.require("splDemoConfiguration.ConfigurationBuilder");

(function (w, $, d, undefined){
	if (!w || !$ || !d) {
		throw new Error("Vital parameters missing. This could be due to an unsupported browser version");
	}
	
	w["oSapSplDemoShell"] = new sap.ui.unified.Shell({icon:"../resources/icons/sap_logo.png"});
	w["oSapSplDemoAppContainer"] = new sap.m.App();
	
	var oDemoHomeView = sap.ui.view({
		viewName:"splDemoView.SPLDemoAppHomeView",
		id:"splDemoView.SPLDemoAppHomeView",
		type:sap.ui.core.mvc.ViewType.XML
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