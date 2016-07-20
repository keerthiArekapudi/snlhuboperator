/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("splStartup.Startup");
/*eslint no-inner-declarations:1*/
(function () {

    /*
     *Handle the includePsp scenario. Negative condition. State maintained in utis. Logging on exception and resetting the value.
     */
    (function () {
        try {
            if (jQuery.sap.getUriParameters().mParams.hasOwnProperty("includePsp")) {
                oSapSplUtils.setIncludePsp();
            }else if(jQuery.sap.getUriParameters().mParams.hasOwnProperty("deviceId")){
                oSapSplUtils.setDeviceID(jQuery.sap.getUriParameters().mParams["deviceId"][0]);
                if(jQuery.sap.getUriParameters().mParams.hasOwnProperty("registrationNumber")){
                	oSapSplUtils.setRegistrationNumber(jQuery.sap.getUriParameters().mParams["registrationNumber"][0]);
                }
                
            }
        } catch (e) {
            jQuery.sap.log.error("Welcome startup exception", e.message, "SAPSCL");
        }

    }());

    var oApp = new sap.m.App("sapSplSelfRegAppContainer", {
        height: "100%",
        width: "100%"
    });
    var oWelcomeHomePage = sap.ui.view({
        viewName: "views.WelcomePage",
        id: "views.WelcomePage",
        type: sap.ui.core.mvc.ViewType.XML
    });

    oApp.addPage(oWelcomeHomePage);
    oApp.placeAt("content");

}());
