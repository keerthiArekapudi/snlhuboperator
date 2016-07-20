/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
$.sap.declare("splReusable.libs.SapSplHelpHandler");
$.sap.require("splReusable.libs.Utils");

/**
 * @description Constructor for SAP SPL Help Handler Utility
 * @since 1.0
 * @namespace SAP Connected Logistics Help Handler
 *
 */
splReusable.libs.SapSplHelpHandler = function () {
    this.oAppHelpInfo = {
        appId: null,
        appName: null,
        appDescription: null,
        appPath: null,
        iUrl: null,
        eUrl: null
    };
};

/**
 * @description Help Launcher handler
 * @param oEvent
 * @public
 * @param fnAfterDialogClose {Function} [null] Handler for dialog close
 * @param fnAfterDialogOpen {Function} [null] Handler for dialog after open
 * @param fnBeforeDialogClose {Function} [null] Handler for dialog before close
 * @param fnBeforeDialogOpen {Function} [null] Handler for Dialog before open
 * @param fnDialogButtonPress {Function} [null] Callback for button press (on dialog close)
 * @since 1.0
 */
splReusable.libs.SapSplHelpHandler.prototype.launchHelp = function () {
    var _appInfoObject = this.oAppHelpInfo,
        oHelpIframeContent = null,
        oHelpDialog = null,
        sContentHeight = ($(".sapUiBody").height() * 1).toString() + "px",
        sContentWidth = ($(".sapUiBody").width() * 1).toString() + "px";



    /**
     * @description Internal function to resolve the file name based on Locale
     * No adoption needed from application
     * @private
     */

    function getLocalizedHelpFileName() {
        var helpFileUrl = _appInfoObject["iUrl"],
            helpFile = helpFileUrl.split("/"),
            helpFileNameWithExtension = helpFile[helpFile.length - 1],
            helpFileName = helpFileNameWithExtension.split(".")[0],
            helpFileExtension = helpFileNameWithExtension.split(".")[1],
            finalHelpFileName = helpFileName + "_" + sap.ui.getCore().getConfiguration().getLocale().getLanguage(),
            finalHelpFileNameWithExtension = finalHelpFileName + "." + helpFileExtension;

        return helpFileUrl.replace(helpFileNameWithExtension, finalHelpFileNameWithExtension);

    }

    /*Check for help Type. If PDF load from iUrl of application configuration. Else from eUrl*/
    if (oSapSplUtils.getHelpType() === SapSplEnums.PDFHELP) {
        oHelpIframeContent = "<iframe style=\"overflow-y: hidden\" seamless=\"seamless\" frameborder=\"0\" scrolling=\"no\" class='sapSplHelpDialogIFrame' src=" + "\"" + getLocalizedHelpFileName() + "\"" + "/>";
    } else {
        oHelpIframeContent = "<iframe style=\"overflow-y: hidden\" seamless=\"seamless\" frameborder=\"0\" scrolling=\"no\" class='sapSplHelpDialogIFrame' src=" + "\"" + _appInfoObject["eUrl"] + "\"" + "/>";
    }

    oHelpDialog = new sap.m.Dialog({
        title: _appInfoObject["appDescription"],
        contentHeight: sContentHeight,
        contentWidth: sContentWidth,
        content: [new sap.ui.core.HTML({
            content: oHelpIframeContent
        })],
        endButton: new sap.m.Button({
            text: oSapSplUtils.getBundle().getText("CLOSE"),
            id:"SapSplHelpCloseButton",
            press: function () {
            	oHelpDialog.close();
                oHelpDialog.destroy();
            }
        })
    }).addStyleClass("sapSplHelpDialog");
    oHelpDialog.open(true);
    // CSN FIX : 0120031469 637331     2014
    oHelpDialog.attachAfterOpen(function () {
        oSapSplUtils.fnSyncStyleClass(oHelpDialog);
        var iDialogWidth = jQuery(".sapSplHelpDialog").width();
        var iDialogHeight = jQuery(".sapSplHelpDialog").height();
        jQuery(".sapSplHelpDialogIFrame").css("width", (iDialogWidth - 35) + "px");
        // CSN FIX : 0120031469 0000680367 2014
        jQuery(".sapSplHelpDialogIFrame").css("height", (iDialogHeight - 35 - 2 * jQuery(".sapSplHelpDialog .sapMBarContainer").height() + "px"));
    });
    
    // Fix for Internal Incident : 1580233800
    oHelpDialog.attachAfterClose(function() {
	this.destroy();
});
};

/**
 * @description First point to set the app context for help button to understand
 * @param oAppHelpInfo
 * @param oEvent {Object} Event handler
 * @this splReusable.libs.SapSplHelpHandler
 * @returns this
 */
splReusable.libs.SapSplHelpHandler.prototype.setAppHelpInfo = function (oAppHelpInfo, oEvent) {
    if (!oAppHelpInfo.hasOwnProperty("eUrl")) {
        sap.ui.getCore().getModel("helpModel").getData()["helpVisible"] = false;
        sap.ui.getCore().getModel("helpModel").refresh();
        return this.oAppHelpInfo;
    }

    sap.ui.getCore().getModel("helpModel").getData()["helpVisible"] = true;

    sap.ui.getCore().getModel("helpModel").refresh();

    if (!oSapSplUtils.getAppToLoad().hasOwnProperty("AppID")) {
        this.oAppHelpInfo = {
            appId: (oEvent && oEvent.hasOwnProperty("toId")) ? oEvent.toId : null,
            appName: (oEvent && oEvent.hasOwnProperty("data") && oEvent.data.hasOwnProperty("context") && oEvent.data.context.getProperty("AppName") !== null) ? oEvent.data.context.getProperty("AppName") : "SAP Networked Logistics Hub",
            appPath: (oEvent && oEvent.hasOwnProperty("toId")) ? oEvent.toId : null,
            appDescription: (oEvent && oEvent.hasOwnProperty("data") && oEvent.data.hasOwnProperty("context") && oEvent.data.context.getProperty("AppName.description") !== null) ? oEvent.data.context.getProperty("AppName.description") : "SAP Networked Logistics Hub",
            iUrl: oAppHelpInfo["iUrl"],
            eUrl: oAppHelpInfo["eUrl"]
        };

    } else {
        this.oAppHelpInfo = {
            appId: oSapSplUtils.getAppToLoad()["AppID"],
            appName: oSapSplUtils.getAppToLoad()["AppName"],
            appDescription: oSapSplUtils.getAppToLoad()["AppName.description"],
            appPath: oSapSplUtils.getAppToLoad()["AppPath"],
            iUrl: oAppHelpInfo["iUrl"],
            eUrl: oAppHelpInfo["eUrl"]
        };
    }
    return this;
};


var oSapSplHelpHandler = new splReusable.libs.SapSplHelpHandler();
