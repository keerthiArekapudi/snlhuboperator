/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
(function () {

	splReusable.libs.SapSplStyleSheetLoader.loadStyle ( "./resources/styles/splUnifiedShellHeaderDALBackground", "css", "splUnifiedShellSearch", function ( ) {
		jQuery.sap.log.info ( "Loaded SPL Unified Shell styles in " + sap.ui.getCore ( ).getConfiguration ( ).getTheme ( ) );
	}, function ( ) {
		jQuery.sap.log.error ( "Failed to load SPL Unified Shell styles" );
	} );
	
    var oDALViewToAdd = new sap.ui.view({
        viewName: oSapSplUtils.getAppToLoad()["AppPath"],
        id: oSapSplUtils.getAppToLoad()["AppPath"],
        type: sap.ui.core.mvc.ViewType.XML
    });

    oDALViewToAdd.addEventDelegate({
        onBeforeShow: function (oEvent) {
            oDALViewToAdd.getController().onBeforeShow(oEvent);
        }
    }, oDALViewToAdd.getController());

    oSplBaseApplication.getAppInstance().addPage(oDALViewToAdd);

    oSplBaseApplication.getAppInstance().to(oSapSplUtils.getAppToLoad()["AppPath"]);

    oSapSplQuerySelectors.getInstance().changeUnifiedShellStyle(false);
    
    if (jQuery.sap.getUriParameters().get("navToHome") && jQuery.sap.getUriParameters().get("navToHome") === "true") {
        oSplBaseApplication.getAppInstance().addPage(new sap.ui.view({
            viewName: "splView.tileContainer.MasterTileContainer",
            id: "splView.tileContainer.MasterTileContainer",
            type: sap.ui.core.mvc.ViewType.XML
        }));
    }
}(window, oSplBaseApplication));
