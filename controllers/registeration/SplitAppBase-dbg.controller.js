/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.require("sap.ca.ui.message.message");

sap.ui.controller("splController.registeration.SplitAppBase", {

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     */
    onInit: function () {
    	
    	var that = this;
    	
        this.oSplitAppBase = this.getView().byId("SplitAppBase");

        this.aSplViewsRegistry = this.getViewRegistry();

        oSapSplUtils.setSplitAppBaseOne(this);

        /*Subscribe navigation events to an appropriate channel - which can be published later.*/
        this.subscribeNavigationEvents();

        /*OData Model to be used across "MyColleagues" application for read*/
        this.createODataModelForMyColleagues();

        /*To instantiate all the required views*/
        this.instantiatePages();

        /*To set the initial master and initial detail page of the SplitAppBase.*/
        this.setInitialState();
        
        this.getView().addEventDelegate({
        	onAfterShow : function(){
        		that.oSplitAppBase.getCurrentMasterPage().byId("sapSplSearchMyUsersMasterList").focus();
        	}
        });

    },

    createODataModelForMyColleagues: function () {
        //		var oSapSplMyColleaguesODataModel = null;
        //		if (oSapSplMyColleaguesODataModel === undefined || oSapSplMyColleaguesODataModel === null) {
        //		oSapSplMyColleaguesODataModel = new splModels.odata.ODataModel({
        //		url : oSapSplUtils.getFQServiceUrl("/sap/spl/xs/app/services/appl.xsodata/"),
        //		json : true,
        //		user : undefined,
        //		password : undefined,
        //		headers : {"Cache-Control":"max-age=0"},
        //		tokenHandling : true,
        //		withCredentials : false,
        //		loadMetadataAsync : true,
        //		handleTimeOut : true,
        //		numberOfSecondsBeforeTimeOut : 10000
        //		});
        //		oSapSplMyColleaguesODataModel.attachEvent("timeOut",function() {
        //		sap.ca.ui.message.showMessageBox({
        //		type: sap.ca.ui.message.Type.ERROR,
        //		message: oSapSplUtils.getBundle().getText("TIMEOUT_ALERT")
        //		});
        //		});
        //		sap.ui.getCore().setModel(oSapSplMyColleaguesODataModel,"myColleaguesODataModel");
        //		}
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
            if (this.getView().byId("SplitAppBase")) {
                this.getView().byId("SplitAppBase").setInitialMaster("MyContactsMaster");
                this.getView().byId("SplitAppBase").setInitialDetail("MyContactDetails");
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
                jQuery.sap.log.error(e.message, "SplitApp control not instantiated for MyContacts", this.getView().getControllerName());
            }
        }

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

        var myContactsMaster = null;
        var newContactRegistrationDetail = null;
        var myContactDetails = null;

        /*instantiate views*/
        myContactDetails = sap.ui.view({
            id: "MyContactDetails",
            viewName: "splView.registeration.MyContactDetails",
            type: sap.ui.core.mvc.ViewType.XML
        });
        myContactsMaster = sap.ui.view({
            id: "MyContactsMaster",
            viewName: "splView.registeration.MyContactsMaster",
            type: sap.ui.core.mvc.ViewType.XML,
            viewData: this.getView()
        });
        newContactRegistrationDetail = sap.ui.view({
            id: "NewContactRegistrationDetail",
            viewName: "splView.registeration.NewContactRegistrationDetail",
            type: sap.ui.core.mvc.ViewType.XML
        });

        /*Register "onBeforeShow" event handlers - to listen to navigation events.*/
        myContactsMaster.addEventDelegate({
            onBeforeShow: jQuery.proxy(myContactsMaster.getController().onBeforeShow, myContactsMaster.getController())
        });
        newContactRegistrationDetail.addEventDelegate({
            onBeforeShow: jQuery.proxy(newContactRegistrationDetail.getController().onBeforeShow, newContactRegistrationDetail.getController())
        });
        myContactDetails.addEventDelegate({
            onBeforeShow: jQuery.proxy(myContactDetails.getController().onBeforeShow, myContactDetails.getController())
        });

        /*Set the unified shell instance on all the views*/
        myContactsMaster.getController().setUnifiedShellInstance(this.getUnifiedShellInstance());
        newContactRegistrationDetail.getController().setUnifiedShellInstance(this.getUnifiedShellInstance());
        myContactDetails.getController().setUnifiedShellInstance(this.getUnifiedShellInstance());

        splReusable.libs.SapSplStyleSheetLoader.loadStyle("./resources/styles/splContactRegistration");

        try {
            if (this.getView().byId("SplitAppBase")) {
                /*Add the master and detail views to the SplitAppBase control
                 * TODO : can be handled in utils.js
                 * */
                this.getView().byId("SplitAppBase").addDetailPage(myContactDetails);
                this.getView().byId("SplitAppBase").addDetailPage(newContactRegistrationDetail);
                this.getView().byId("SplitAppBase").addMasterPage(myContactsMaster);
            } else {
                throw new Error();
            }
        } catch (e) {
            if (e instanceof Error) {
                jQuery.sap.log.error(e.message, "Cannot access SplitApp Control in MyContacts.", this.getView().getControllerName());
            }
        }

    },

    /**
     * @description listens to event handling channel which is previously subscribed. This is the default call back when any navigation happens to this view.
     * It is called even before the onBeforeRendering life cycle method of the view.
     * @param evt event object of the navigation event.
     * @returns void.
     * @since 1.0
     */
    onBeforeShow: function (oEvent) {

        sap.ui.getCore().getModel("myContactListODataModel").refresh();

        this.setCurrentAppInfo(oEvent);

        /* CSNFIX : 0120031469 0000808714 2014 */
        if (sap.ui.getCore().getModel("myContactDetailModel") && this.getView().byId("SplitAppBase")) {
            this.getView().byId("SplitAppBase").toDetail("MyContactDetails");
            var oModelData = sap.ui.getCore().getModel("myContactDetailModel").getData();
            oModelData["isClicked"] = false;
            oModelData["noData"] = true;
            oModelData["showFooterButtons"] = false;
            sap.ui.getCore().getModel("myContactDetailModel").setData(oModelData);
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
            iUrl: "./help/SCLUsers.pdf",
            eUrl: "//help.sap.com/saphelp_scl10/helpdata/en/77/93e453477d9438e10000000a44176d/content.htm?frameset=/en/e2/cde153cafa9117e10000000a44176d/frameset.htm&current_toc=/en/b7/8ee25341d61e4ee10000000a423f68/plain.htm&node_id=18"
        }, oEvent);
    },

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
     * @description Subscribes navigation event handling methods under two channels (navInMaster, navInDetail) - to be published later.
     * @param void
     * @returns void
     * @since 1.0
     */
    /**
     * TODO : move to seperate js
     */
    subscribeNavigationEvents: function () { /*instance of the SAPUI5 event bus - used to sunscribe or publish events accross the application*/
        var bus = sap.ui.getCore().getEventBus(); /*Forward navigation handler in Master App : channel - navInMaster*/
        bus.subscribe("navInMaster", "to", jQuery.proxy(this.navInMaster_To, this)); /*Forward navigation handler in Detail App : channel - navInDetail*/
        bus.subscribe("navInDetail", "to", jQuery.proxy(this.navInDetail_To, this)); /*Back navigation handler in Detail App : channel - navInDetail*/
        bus.subscribe("navInDetail", "back", jQuery.proxy(this.navInDetail_Back, this)); /*Back navigation handler in Detail App : channel - navInMaster*/
        bus.subscribe("navInMaster", "back", jQuery.proxy(this.navInMaster_Back, this));
    },

    /**
     * @description Method to configure navigation paths.
     * @param void
     * @returns void
     * @since 1.0
     **/
    /**
     * TODO : move to seperate js
     */
    getViewRegistry: function () {
        return [{
            "from": "MyContactsMaster",
            "to": "MyContactDetails"
        }, {
            "from": "MyContactDetails",
            "to": "NewContactRegistrationDetail"
        }, {
            "from": "MyContactsActionSheet",
            "to": "NewContactRegistrationDetail"
        }, {
            "from": "NewContactRegistrationDetail",
            "to": "MyContactDetails"
        }];
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
     * TODO : move to seperate js
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
            if (e instanceof Error) {
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
     * TODO : move to seperate js
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
            if (e instanceof Error) {
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
     * TODO : move to seperate js
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
            if (e instanceof Error) {
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
     * TODO : move to seperate js
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
            if (e instanceof Error) {
                jQuery.sap.log.error(e.message, "Parameters for navigation not in proper format", this.getView().getControllerName());
            }
        }
    },

    /**
     * @description Get the target view id based on the current view id
     * @param {string} sViewId
     * @returns Target view Id based on the current virew
     * @since 1.0
     */
    /**
     * TODO : move to seperate js
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
            if (e instanceof Error) {
                jQuery.sap.log.error(e.message, "View ID is not a string", this.getView().getControllerName());
            }
        }
    }

});
