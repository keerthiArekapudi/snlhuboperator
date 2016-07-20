/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.require("sap.ca.ui.message.message");

sap.ui.controller("splController.registeration.SplitAppBaseBusinessPartners", {


    /**
     * @description Method to fetch splViewRegistryConfig from configuration file and store the array as a oSapSplUtils property, calls oSapSplUtils.setSplViewsRegistry internally.
     * @param void
     * @returns void
     * @since 1.0
     * @example
     * oSapSplUtils.getNavigationConfig();
     *  */
    /**
     * TODO : move to separate js
     */
    getViewRegistry: function () {
        return [{
            "from": "MyBusinessPartnerMaster",
            "to": "MyBusinessPartnerDetail"
        }, {
            "from": "MyBusinessPartnerDetail",
            "to": "NewBusinessPartnerRegistrationDetail"
        }, {
            "from": "MyBusinessPartnerActionSheet",
            "to": "NewBusinessPartnerRegistrationDetail"
        }, {
            "from": "FreelancerActionSheet",
            "to": "FreelancerConnectDetail"
        }, {
            "from": "NewBusinessPartnerRegistrationDetail",
            "to": "MyBusinessPartnerDetail"
        }, {
            "from": "FreelancerConnectDetail",
            "to": "MyBusinessPartnerDetail"
        }, {
            "from": "FreelancerActionSheetInvite",
            "to": "NewBusinessPartnerRegistrationDetail"
        }];
    },

    /**
     * @description listens to event handling channel which is previously subscribed. This is the default call back when any navigation happens to this view.
     * It is called even before the onBeforeRendering life cycle method of the view.
     * @param evt event object of the navigation event.
     * @returns void.
     * @since 1.0
     */
    onBeforeShow: function (oEvent) {

        sap.ui.getCore().getModel("myBusinessPartnerListODataModel").refresh();

        sap.ui.getCore().getModel("sapSplAppConfigDataModel").setData(oSapSplUtils.getAppConfigObjectFromAllowedTiles(this.appID)[0]);

        this.setCurrentAppInfo(oEvent);

        /* CSNFIX : 0120031469 0000808714 2014 */
        if (sap.ui.getCore().getModel("myBusinessPartnerDetailModel") && this.getView().byId("SplitAppBaseBusinessPartners")) {
            this.getView().byId("SplitAppBaseBusinessPartners").toDetail("MyBusinessPartnerDetail");
            var oModelData = sap.ui.getCore().getModel("myBusinessPartnerDetailModel").getData();
            oModelData["isClicked"] = false;
            oModelData["noData"] = true;
            oModelData["showFooterOptions"] = false;
            sap.ui.getCore().getModel("myBusinessPartnerDetailModel").setData(oModelData);
        }

    },

    onAfterShow: function () {
        /* CSNFIX : 0120061532 1490426    2014 */
        var oCustomData = new sap.ui.core.CustomData({
            key: "bRefreshTile",
            value: true
        });
        oSplBaseApplication.getAppInstance().getCurrentPage().destroyCustomData();
        oSplBaseApplication.getAppInstance().getCurrentPage().addCustomData(oCustomData);

    },

    setCurrentAppInfo: function (oEvent) {

        oSapSplHelpHandler.setAppHelpInfo({
            iUrl: "./help/SCLBuPa.pdf",
            eUrl: "//help.sap.com/saphelp_scl10/helpdata/en/d4/dbe153cafa9117e10000000a44176d/content.htm?frameset=/en/52/02e3537a0e9438e10000000a44176d/frameset.htm&current_toc=/en/b7/8ee25341d61e4ee10000000a423f68/plain.htm&node_id=9&show_children=false"
        }, oEvent);
    },

    /**
     * @description Subscribes navigation event handling methods under two channels (navInMaster, navInDetail) - to be published later.
     * @param void
     * @returns void
     * @since 1.0
     * @example
     * oSapSplUtils.subscribeNavigationEvents();
     */
    /**
     * TODO : move to separate js
     */
    subscribeNavigationEvents: function () { /*instance of the SAPUI5 event bus - used to subscribe or publish events across the application*/
        var bus = sap.ui.getCore().getEventBus(); /*Forward navigation handler in Master App : channel - navInMaster*/
        bus.subscribe("navInMasterBP", "to", jQuery.proxy(this.navInMaster_To, this)); /*Forward navigation handler in Detail App : channel - navInDetail*/
        bus.subscribe("navInDetailBP", "to", jQuery.proxy(this.navInDetail_To, this)); /*Back navigation handler in Detail App : channel - navInDetail*/
        bus.subscribe("navInDetailBP", "back", jQuery.proxy(this.navInDetail_Back, this)); /*Back navigation handler in Detail App : channel - navInMaster*/
        bus.subscribe("navInMasterBP", "back", jQuery.proxy(this.navInMaster_Back, this));
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

        splReusable.libs.SplTracer.trace(0, "BuPa instantiatePages()");

        var myBusinessPartnerMaster = null;
        var myBusinessPartnerDetails = null;

        myBusinessPartnerMaster = sap.ui.view({
            id: "MyBusinessPartnerMaster",
            viewName: "splView.registeration.MyBusinessPartnerMaster",
            type: sap.ui.core.mvc.ViewType.XML,
            viewData: this.getView()
        });

        myBusinessPartnerMaster.getController().setSplitAppInstance(this.byId("SplitAppBaseBusinessPartners")); /*Register "onBeforeShow" event handlers - to listen to navigation events.*/
        myBusinessPartnerMaster.addEventDelegate({
            onBeforeShow: jQuery.proxy(myBusinessPartnerMaster.getController().onBeforeShow, myBusinessPartnerMaster.getController())
        });


        /*Set the unified shell instance on all the views*/
        myBusinessPartnerMaster.getController().setUnifiedShellInstance(this.getUnifiedShellInstance());
        this.getView().byId("SplitAppBaseBusinessPartners").addMasterPage(myBusinessPartnerMaster);


        /*instantiate views*/
        myBusinessPartnerDetails = sap.ui.view({
            id: "MyBusinessPartnerDetail",
            viewName: "splView.registeration.MyBusinessPartnerDetail",
            type: sap.ui.core.mvc.ViewType.XML
        });
        myBusinessPartnerDetails.getController().setSplitAppInstance(this.byId("SplitAppBaseBusinessPartners"));
        myBusinessPartnerDetails.addEventDelegate({
            onBeforeShow: jQuery.proxy(myBusinessPartnerDetails.getController().onBeforeShow, myBusinessPartnerDetails.getController())
        });
        myBusinessPartnerDetails.getController().setUnifiedShellInstance(this.getUnifiedShellInstance());
        /*Add the master and detail views to the SplitAppBase control
         * TODO : can be handled in utils.js
         * */
        this.getView().byId("SplitAppBaseBusinessPartners").addDetailPage(myBusinessPartnerDetails);

        splReusable.libs.SapSplStyleSheetLoader.loadStyle("./resources/styles/splContactRegistration");

        splReusable.libs.SplTracer.trace(1, "BuPa instantiatePages()");


    },

    /**
     * @description Method to set the initial master and initial detail page of the SplitAppBase control.
     * @param evt void.
     * @returns void.
     * @since 1.0
     * TODO : The initial master and detail page can come from a configuration file - which can be handled from utils.js [DISCUSS WITH NIRANJAN]
     */
    setInitialState: function () {

        this.getView().byId("SplitAppBaseBusinessPartners").setInitialMaster("MyBusinessPartnerMaster");
        this.getView().byId("SplitAppBaseBusinessPartners").setInitialDetail("MyBusinessPartnerDetail");

        if (jQuery.sap.getUriParameters().get("navToHome") && jQuery.sap.getUriParameters().get("navToHome") === "true") {
            oSapSplUtils.showHeaderButton({
                showButton: true,
                sNavToPage: "splView.tileContainer.MasterTileContainer"
            });
        }

    },

    createODataModelForMyBusinessPartners: function () {
        var myBusinessPartnersODataModel = sap.ui.getCore().getModel("myBusinessPartnerListODataModel");

        splReusable.libs.SplTracer.trace(0, "BuPa createODataModelForMyBusinessPartners()");

        if (myBusinessPartnersODataModel === undefined || myBusinessPartnersODataModel === null) {
            myBusinessPartnersODataModel = new splModels.odata.ODataModel({
                url: oSapSplUtils.getFQServiceUrl("/sap/spl/xs/app/services/appl.xsodata/"),
                json: true,
                //                headers : {"Cache-Control":"max-age=0"},
                tokenHandling: true,
                withCredentials: false,
                loadMetadataAsync: true,
                handleTimeOut: true,
                numberOfSecondsBeforeTimeOut: 10000
            });
            myBusinessPartnersODataModel.attachEvent("timeOut", function () {
                sap.ca.ui.message.showMessageBox({
                    type: sap.ca.ui.message.Type.ERROR,
                    message: oSapSplUtils.getBundle().getText("TIMEOUT_ALERT")
                });
            });
            sap.ui.getCore().setModel(myBusinessPartnersODataModel, "myBusinessPartnerListODataModel");
        }
        splReusable.libs.SplTracer.trace(1, "BuPa createODataModelForMyBusinessPartners()");
    },

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     */
    onInit: function () {

        this.oSplitAppBase = this.getView().byId("SplitAppBaseBusinessPartners");

        this.aSplViewsRegistry = this.getViewRegistry();
        /**
         * TODO :remove
         */
        oSapSplUtils.setSplitAppBaseTwo(this);

        /*Subscribe navigation events to an appropriate channel - which can be published later.*/
        this.subscribeNavigationEvents();

        /*OData Model to be used across "MyBusinessPartners" application for read*/
        this.createODataModelForMyBusinessPartners();

        /*To instantiate all the required views*/
        this.instantiatePages();

        /*To set the initial master and initial detail page of the SplitAppBase.*/
        this.setInitialState();

        this.appID = "myBusinessPartners";

    },

    onAfterRendering: function () {},

    /**
     * @description Getter method to get the unified shell instance which is the super parent of this view.
     * @param void.
     * @returns this.unifiedShell the unified shell instance previously set to this view during instantiation.
     * @since 1.0
     */
    getUnifiedShellInstance: function () {
        return this.unifiedShell;
    },

    /**
     * @description Setter method to set the unified shell instance which is the super parent of this view.
     * @param void.
     * @returns void.
     * @since 1.0
     */
    setUnifiedShellInstance: function (oUnifiedShellInstance) {
        this.unifiedShell = oUnifiedShellInstance;
    },

    /**
     * @description Forward Navigation handler in Master App under the channel - navInMaster.
     * calls getSplViewsRegistry internally to get the id of target view for navigation.
     * @param
     * {object} oEvent event object of navigation.
     * {string} sDir signifies the type of navigation.
     * {object} oData data which is passed on to the target view after forward navigation.
     * @returns void
     * @since 1.0
     */
    /**
     * TODO : move to separate js
     */
    navInMaster_To: function (oEvent, sDir, oData) {
        var sFromId = "";
        try {
            if (typeof sDir === "string" && typeof oData === "object") {
                sFromId = oData.from.sId;
                if (!oData.data) {
                    oData.data = null;
                }
                if (sFromId && typeof sFromId === "string") {
                    var sTarget = this.getSplViewsRegistry(oData.from.sId);

                    if (sTarget && typeof sTarget === "string") {
                        this.oSplitAppBase.toMaster(sTarget, "fade", oData.data);
                    } else {
                        throw new Error();
                    }
                } else {
                    throw new Error();
                }
            } else {
                throw new Error();
            }
        } catch (e) {
            if (e.constructor === Error()) {
                jQuery.sap.log.error(e.message, "Parameters for navigation not in proper format", this.getView().getControllerName());
            }
        }
    },

    /**
     * @description Forward Navigation handler in Detail App under the channel - navInDetail.
     * calls getSplViewsRegistry internally to get the id of target view for navigation.
     * @param
     * {object} oEvent event object of navigation.
     * {string} sDir signifies the type of navigation.
     * {object} oData data which is passed on to the target view after forward navigation.
     * @returns void
     * @since 1.0
     */
    /**
     * TODO : move to separate js
     */
    navInDetail_To: function (oEvent, sDir, oData) {
        var sFromId = "";
        try {
            if (typeof sDir === "string" && typeof oData === "object") {
                sFromId = oData.from.sId;
                if (!oData.data) {
                    oData.data = null;
                }
                if (sFromId && typeof sFromId === "string") {
                    var sTarget = this.getSplViewsRegistry(oData.from.sId);

                    if (sTarget && typeof sTarget === "string") {
                        this.oSplitAppBase.toDetail(sTarget, "fade", oData.data);
                    } else {
                        throw new Error();
                    }
                } else {
                    throw new Error();
                }
            } else {
                throw new Error();
            }
        } catch (e) {
            if (e.constructor === Error()) {
                jQuery.sap.log.error(e.message, "Parameters for navigation not in proper format", this.getView().getControllerName());
            }
        }
    },

    /**
     * @description Back Navigation handler in Detail App under the channel - navInDetail.
     * @param
     * {object} oEvent event object of navigation.
     * {string} sDir signifies the type of navigation.
     * {object} oData data which is passed on to the target view after back navigation.
     * @returns void
     * @since 1.0
     */
    /**
     * TODO : move to separate js
     */
    navInDetail_Back: function (oEvent, sDir, oData) {

        if (!oData.data) {
            oData.data = null;
        }
        try {
            if (sDir && typeof sDir === "string") {
                this.oSplitAppBase.backDetail(oData.data);
            } else {
                throw new Error();
            }
        } catch (e) {
            if (e.constructor === Error()) {
                jQuery.sap.log.error(e.message, "Parameters for navigation not in proper format", this.getView().getControllerName());
            }
        }

    },

    /**
     * @description Back Navigation handler in Master App under the channel - navInMaster.
     * @param
     * {object} oEvent event object of navigation.
     * {string} sDir signifies the type of navigation.
     * {object} oData data which is passed on to the target view after back navigation.
     * @returns void
     * @since 1.0
     */
    /**
     * TODO : move to separate js
     */
    navInMaster_Back: function (oEvent, sDir, oData) {
        if (!oData.data) {
            oData.data = null;
        }
        try {
            if (sDir && typeof sDir === "string") {
                this.oSplitAppBase.backMaster(oData.data);
            } else {
                throw new Error();
            }
        } catch (e) {
            if (e.constructor === Error()) {
                jQuery.sap.log.error(e.message, "Parameters for navigation not in proper format", this.getView().getControllerName());
            }
        }
    },

    /**
     * @description Get the target view id based on the current view id
     * @param {string} sViewId
     * @returns Target view Id based on the current virew
     * @since 1.0
     * @example
     * var sTargetViewId = oSapSplUtils.getSplViewsRegistry(sViewId);
     */

    /**
     * TODO : move to separate js
     */
    getSplViewsRegistry: function (sViewId) {
        var _returnValue = null;
        try {
            if (sViewId && typeof sViewId === "string") {
                if (this.aSplViewsRegistry !== undefined) {
                    for (var i = 0, j = this.aSplViewsRegistry.length; i < j; i++) {
                        if (this.aSplViewsRegistry[i].from === sViewId) {
                            if (this.aSplViewsRegistry[i].to) {
                                _returnValue = this.aSplViewsRegistry[i].to;
                            } else {
                                throw new Error();
                            }
                        }
                    }
                } else {
                    throw new Error();
                }
            } else {
                throw new Error();
            }
            return _returnValue;

        } catch (e) {
            if (e.constructor === Error()) {
                jQuery.sap.log.error(e.message, "View ID is not string", this.getView().getControllerName());
            }
        }
    }


});
