/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
splReusable.libs.SapSplStyleSheetLoader.loadStyle("./resources/styles/Help","css");

sap.ui.controller("splController.help.Help", {

	onInit: function () {

		var sIframeString;

		var sPdfFileName = "./help/SCLMainStru" + "_" + sap.ui.getCore().getConfiguration().getLocale().getLanguage() + ".pdf";

		if (oSapSplUtils.getHelpType() === SapSplEnums.HTMLHELP) {
			sIframeString = "<iframe style=\"overflow-y: hidden;width:100%;height:100%\" seamless=\"seamless\" frameborder=\"0\" scrolling=\"no\" src='http://aiokeh.wdf.sap.corp:50000/SAPIKS2/contentShow.sap?IWB_INDUSTRY=SCL&TMP_IWB_TASK=PREVIEW2&_CLASS=BCO_COMMON&_LOIO=D997D853E9A21E4EE10000000A423F68&_SLOIO=B78EE25341D61E4EE10000000A423F68&LANGUAGE=EN&RELEASE=100_SP00&_SCLASS=XDP_STRUCT' class=\"iframe_help\"></iframe>";
			this.byId("iframe_wrapper").setContent(sIframeString);
		} else if (oSapSplUtils.getHelpType() === SapSplEnums.PDFHELP) {
			sIframeString = "<iframe style=\"overflow-y: hidden;width:100%;height:100%\" seamless=\"seamless\" frameborder=\"0\" scrolling=\"no\" src=" + "\"" + sPdfFileName + "\"" + " class=\"iframe_help\"></iframe>";
			this.byId("iframe_wrapper").setContent(sIframeString);
		} else {
			throw new Error("Unsupported help parameter");
		}

		this.byId("sapSplHelpPage").setTitle(oSapSplUtils.getBundle().getText("SAP_CONNECTED_LOGISTICS_HELP"));
	},

	fnRenderStyle: function () {
		this.iWindowWidth = jQuery(window).width();
		this.iWindowHeight = jQuery(window).height();
		jQuery(".iframe_help").css("width", (this.iWindowWidth) + "px");
		jQuery(".iframe_help").css("height", (this.iWindowHeight * 0.88) + "px");
	},

	onAfterRendering: function () {
		this.fnRenderStyle();
	},

	onBeforeShow: function () {

	},

	fnHandleAppHeplButtonPress: function (oEvent) {
		oSapSplUtils.fnHandleAppHeplButtonPress(oEvent);
	},

	handleGoBackToLaunchPad: function () {
		oSplBaseApplication.getAppInstance().back();
	}

});
