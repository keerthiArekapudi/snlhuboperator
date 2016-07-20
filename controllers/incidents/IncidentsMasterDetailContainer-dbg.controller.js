/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.controller("splController.incidents.IncidentsMasterDetailContainer", {

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     */
    onInit: function () {

    	var that = this;
        this.oSplitApp = this.getView().byId("SapSplIncidentSplitApp");

        /*To instantiate all the required views*/
        this.instantiatePages();

        /*To set the initial master and initial detail page of the SplitAppBase.*/
        this.setInitialState();

        /*Localization*/
        this.fnDefineControlLabelsFromLocalizationBundle();
        
        this.getView().addEventDelegate({
        	onAfterShow : function(){
    			/* fix for the incident 1580100686 */
    			setTimeout( function () {
            		that.oSplitApp.getCurrentMasterPage().byId("sapSplIncidentSearch").focus();
    			}, 1000 );
        	}
        });
    },

    /**
     * @description Method to instantiate all the required views which will be a part of the application
     * Registering "onBeforeShow" events to all the instantiated views, to listen to navigation events
     * To set the unified shell instance on all the instantiated views, which is a super parent of all these views
     * Add the respective master pages and detail pages to the SplitAppBase control.
     * @param void.
     * @returns void.
     * @since 1.0
     * TODO : The instantiation of the master and detail views can be moved out of the controller - to utils.js and the view names can come from a configuration file [DISCUSS WITH NIRANJAN]
     */
    instantiatePages: function () {

        var oIncidentsDetail = null,
            oIncidentsMaster = null;

        /*instantiate views*/
        oIncidentsMaster = sap.ui.view({
            id: "IncidentsMasters",
            viewName: "splView.incidents.IncidentsMasterView",
            type: sap.ui.core.mvc.ViewType.XML,
            viewData: this.getView()
        });

        oIncidentsDetail = sap.ui.view({
            id: "IncidentsDetails",
            viewName: "splView.incidents.IncidentsDetailView",
            type: sap.ui.core.mvc.ViewType.XML
        });

        /*Register "onBeforeShow" event handlers - to listen to navigation events.*/
        oIncidentsDetail.addEventDelegate({
            onBeforeShow: jQuery.proxy(oIncidentsDetail.getController().onBeforeShow, oIncidentsDetail.getController())
        });

        oIncidentsMaster.getController().setSplitAppInstance(this.oSplitApp);

        splReusable.libs.SapSplStyleSheetLoader.loadStyle("./resources/styles/splIncidents","css");

        try {
            if (this.oSplitApp) {
                this.oSplitApp.addMasterPage(oIncidentsMaster);
                this.oSplitApp.addDetailPage(oIncidentsDetail);
            } else {
                throw new Error();
            }
        } catch (e) {
            if (e instanceof Error) {
                jQuery.sap.log.error(e.message, "Cannot access SplitApp Control in Incidents.", this.getView().getControllerName());
            }
        }

    },

    /**
     * @description Method to set the initial master and initial detail page of the SplitAppBase control.
     * @param evt void.
     * @returns void.
     * @since 1.0
     * TODO : The initial master and detail page can come from a configuration file - which can be handled from utils.js [DISCUSS WITH NIRANJAN]
     */
    setInitialState: function () {
        try {
            if (this.oSplitApp) {
                this.oSplitApp.setInitialDetail("IncidentsMasters");
                this.oSplitApp.setInitialDetail("IncidentsDetails");
                if (jQuery.sap.getUriParameters().get("navToHome") && jQuery.sap.getUriParameters().get("navToHome") === "true") {
                    oSapSplUtils.showHeaderButton({
                        showButton: true,
                        sNavToPage: "splView.tileContainer.MasterTileContainer"
                    });
                }
            } else {
                throw new Error();
            }
        } catch (e) {
            if (e.constructor === Error()) {
                jQuery.sap.log.error(e.message, "SplitApp control not instantiated for Incidents", this.getView().getControllerName());
            }
        }

    },

    /**
     * @description Method to handle localization of all the hard code texts in the view.
     * @param void.
     * @returns void.
     * @since 1.0
     */
    fnDefineControlLabelsFromLocalizationBundle: function () {

    },

    /**
     * @description listens to event handling channel which is previously subscribed. This is the default call back when any navigation happens to this view.
     * It is called even before the onBeforeRendering life cycle method of the view.
     * @param evt event object of the navigation event.
     * @returns void.
     * @since 1.0
     */
    onBeforeShow: function (oEvent) {
        sap.ui.getCore().getModel("IncidentsListODataModel").refresh();
        this.setCurrentAppInfo(oEvent);

        /* CSNFIX : 0120031469 0000808714 2014 */
        if (sap.ui.getCore().getModel("SapSplIncidentsDetailModel") && this.oSplitApp) {
            this.oSplitApp.toDetail("IncidentsDetails");
            var oModelData = sap.ui.getCore().getModel("SapSplIncidentsDetailModel").getData();
            oModelData["isClicked"] = false;
            oModelData["noData"] = true;
            sap.ui.getCore().getModel("SapSplIncidentsDetailModel").setData(oModelData);
        }

    },

    setCurrentAppInfo: function (oEvent) {
        oSapSplHelpHandler.setAppHelpInfo({
            iUrl: "./help/SCLIncidents.pdf",
            eUrl: "//help.sap.com/saphelp_scl10/helpdata/en/a6/92e453477d9438e10000000a44176d/content.htm?frameset=/en/ef/cce153cafa9117e10000000a44176d/frameset.htm&current_toc=/en/b7/8ee25341d61e4ee10000000a423f68/plain.htm&node_id=13&show_children=false"
        }, oEvent);
    }

    /**
     * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
     * (NOT before the first rendering! onInit() is used for that one!).
     */
    //  onBeforeRendering: function() {

    //  },

    /**
     * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
     * This hook is the same one that SAPUI5 controls get after being rendered.
     */
    //  onAfterRendering: function() {

    //  },

});
