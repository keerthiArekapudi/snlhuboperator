/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.controller("splController.adminConsole.MaintenanceNotifierMasterDetailContainer", {

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     */
    onInit: function () {

        this.oSplitApp = this.getView().byId("SapSplMaintenanceNotifierSplitApp");

        /*To instantiate all the required views*/
        this.instantiatePages();

        /*To set the initial master and initial detail page of the SplitAppBase.*/
        this.setInitialState();

        /*Localization*/
        this.fnDefineControlLabelsFromLocalizationBundle();
        
        this.appID = "userNotification";
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

        var oMaintenanceNotifierAddNotificationDetail = null,
            oMaintenanceNotifierDetail = null,
            oMaintenanceNotifierMaster = null;

        /*instantiate views*/
        oMaintenanceNotifierMaster = sap.ui.view({
            id: "MaintenanceNotifierMaster",
            viewName: "splView.adminConsole.MaintenanceNotifierMaster",
            type: sap.ui.core.mvc.ViewType.XML,
            viewData: this.getView()
        });

        oMaintenanceNotifierDetail = sap.ui.view({
            id: "MaintenanceNotifierDetail",
            viewName: "splView.adminConsole.MaintenanceNotifierDetail",
            type: sap.ui.core.mvc.ViewType.XML
        });
        
        oMaintenanceNotifierAddNotificationDetail = sap.ui.view({
            id: "MaintenanceNotifierAddNotificationDetail",
            viewName: "splView.adminConsole.MaintenanceNotifierDetailAddNotification",
            type: sap.ui.core.mvc.ViewType.XML
        });
        /*Register "onBeforeShow" event handlers - to listen to navigation events.*/
        oMaintenanceNotifierDetail.addEventDelegate({
            onBeforeShow: jQuery.proxy(oMaintenanceNotifierDetail.getController().onBeforeShow, oMaintenanceNotifierDetail.getController())
        });
        
        oMaintenanceNotifierAddNotificationDetail.addEventDelegate({
            onBeforeShow: jQuery.proxy(oMaintenanceNotifierAddNotificationDetail.getController().onBeforeShow, oMaintenanceNotifierAddNotificationDetail.getController())
        });

        splReusable.libs.SapSplStyleSheetLoader.loadStyle("./resources/styles/splMaintenanceNotifier","css");

        try {
            if (this.oSplitApp) {
                this.oSplitApp.addMasterPage(oMaintenanceNotifierMaster);
                this.oSplitApp.addDetailPage(oMaintenanceNotifierDetail);
                this.oSplitApp.addDetailPage(oMaintenanceNotifierAddNotificationDetail);
            } else {
                throw new Error();
            }
        } catch (e) {
            if (e instanceof Error) {
                jQuery.sap.log.error(e.message, "Cannot access SplitApp Control in Maintenance Notifiers.", this.getView().getControllerName());
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
                this.oSplitApp.setInitialDetail("MaintenanceNotifierMaster");
                this.oSplitApp.setInitialDetail("MaintenanceNotifierDetail");
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
                jQuery.sap.log.error(e.message, "SplitApp control not instantiated for Maintenance Notifier", this.getView().getControllerName());
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
        sap.ui.getCore().getModel("UserNotificationListODataModel").refresh();

        sap.ui.getCore().getModel("sapSplAppConfigDataModel").setData(oSapSplUtils.getAppConfigObjectFromAllowedTiles(this.appID)[0]);
        
        this.setCurrentAppInfo(oEvent);
    },

    setCurrentAppInfo: function (oEvent) {
        oSapSplHelpHandler.setAppHelpInfo({
            iUrl: "./help/SCLNotification.pdf",
            eUrl: "./help/SCLNotification.pdf"
        }, oEvent);
    },
    
    onAfterShow: function () {
        /* CSNFIX : 0120061532 1490426    2014 */
        var oCustomData = new sap.ui.core.CustomData({
            key: "bRefreshTile",
            value: true
        });
        oSplBaseApplication.getAppInstance().getCurrentPage().destroyCustomData();
        oSplBaseApplication.getAppInstance().getCurrentPage().addCustomData(oCustomData);

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
