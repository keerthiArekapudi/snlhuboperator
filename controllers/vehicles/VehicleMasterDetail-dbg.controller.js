/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.controller("splController.vehicles.VehicleMasterDetail", {

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 */
	onInit: function () {

		var that = this;

		this.oMyVehiclesSplitApp = this.getView().byId("SapSplVehicleMasterDetailSplitApp");

		this.aSplViewsRegistry = this.getViewRegistry();

		/*Subscribe navigation events to an appropriate channel - which can be published later.*/
		this.subscribeNavigationEvents();

		/*To instantiate all the required views*/
		this.instantiatePages();

		/*To set the initial master and initial detail page of the SplitAppBase.*/
		this.setInitialState();

		oSapSplUtils.setSplitAppBaseVehicle(this);
		this.getView().addEventDelegate({
			onAfterShow : function(){
				that.oMyVehiclesSplitApp.getCurrentMasterPage().byId("sapSplVehicleSearch").focus();
			}
		});

	},

	/**
	 * @description Subscribes navigation event handling methods under two channels (navInMasterVehicle, navInDetailVehicle) - to be published later.
	 * @param void
	 * @returns void
	 * @since 1.0
	 */
	/**
	 * TODO : move to seperate js
	 */
	subscribeNavigationEvents: function () {
		/*instance of the SAPUI5 event bus - used to sunscribe or publish events accross the application*/
		var bus = sap.ui.getCore().getEventBus();
		/*Forward navigation handler in Master App : channel - navInMasterVehicle*/
		bus.subscribe("navInMasterVehicle", "to", jQuery.proxy(this.navInMasterVehicle_To, this));
		/*Forward navigation handler in Detail App : channel - navInDetailVehicle*/
		bus.subscribe("navInDetailVehicle", "to", jQuery.proxy(this.navInDetailVehicle_To, this));
		/*Back navigation handler in Detail App : channel - navInDetailVehicle*/
		bus.subscribe("navInDetailVehicle", "back", jQuery.proxy(this.navInDetailVehicle_Back, this));
		/*Back navigation handler in Detail App : channel - navInMasterVehicle*/
		bus.subscribe("navInMasterVehicle", "back", jQuery.proxy(this.navInMasterVehicle_Back, this));
	},
	/**
	 * @description Method to set the initial master and initial detail page of the SplitApp control.
	 * @param evt void.
	 * @returns void.
	 * @since 1.0
	 * TODO : The initial master and detail page can come from a configuration file - which can be handled from utils.js [DISCUSS WITH NIRANJAN]
	 */
	setInitialState: function () {
		try {
			if (this.oMyVehiclesSplitApp) {
				this.oMyVehiclesSplitApp.setInitialMaster("MyVehiclesMaster");
				this.oMyVehiclesSplitApp.setInitialDetail("MyVehiclesDetail");

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
			if (e instanceof Error) {
				jQuery.sap.log.error(e.message, "MyVehicles SplitApp not defined", this.getView().getControllerName());
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

		splReusable.libs.SapSplStyleSheetLoader.loadStyle("./resources/styles/splVehicles");

		var myVehiclesMaster = null,
		myVehiclesDetailAddVehicle = null,
		myVehiclesDetail = null;

		/*instantiate views*/
		myVehiclesMaster = sap.ui.view({
			id: "MyVehiclesMaster",
			viewName: "splView.vehicles.MyVehiclesMaster",
			type: sap.ui.core.mvc.ViewType.XML,
			viewData: this.getView()
		});

		myVehiclesDetail = sap.ui.view({
			id: "MyVehiclesDetail",
			viewName: "splView.vehicles.MyVehiclesDetail",
			type: sap.ui.core.mvc.ViewType.XML
		});

		myVehiclesDetailAddVehicle = sap.ui.view({
			id: "MyVehiclesDetailAddVehicle",
			viewName: "splView.vehicles.MyVehiclesDetailAddVehicle",
			type: sap.ui.core.mvc.ViewType.XML
		});

		/*Register "onBeforeShow" event handlers - to listen to navigation events.*/
		myVehiclesMaster.addEventDelegate({
			onBeforeShow: jQuery.proxy(myVehiclesMaster.getController().onBeforeShow, myVehiclesMaster.getController())
		});

		myVehiclesDetail.addEventDelegate({
			onBeforeShow: jQuery.proxy(myVehiclesDetail.getController().onBeforeShow, myVehiclesDetail.getController())
		});

		myVehiclesDetailAddVehicle.addEventDelegate({
			onBeforeShow: jQuery.proxy(myVehiclesDetailAddVehicle.getController().onBeforeShow, myVehiclesDetailAddVehicle.getController())
		});

		try {
			if (this.oMyVehiclesSplitApp) {
				this.oMyVehiclesSplitApp.addMasterPage(myVehiclesMaster);
				this.oMyVehiclesSplitApp.addDetailPage(myVehiclesDetail);
				this.oMyVehiclesSplitApp.addDetailPage(myVehiclesDetailAddVehicle);
			}
		} catch (e) {
			if (e instanceof Error) {
				jQuery.sap.log.error(e.message, "SplitApp not defined", this.getView().getControllerName());
			}
		}

		window.setTimeout(function () {
			oSapSplBusyDialog.getBusyDialogInstance().close();
		}, 10);

	},

	/**
	 * @description Method to Configure the navigation path.
	 * @param void
	 * @returns void
	 * @since 1.0
	 **/
	/**
	 * TODO : move to seperate js
	 */
	getViewRegistry: function () {
		return [{
			"from": "MyVehiclesMaster",
			"to": "MyVehiclesDetail"
		}, {
			"from": "MyVehiclesDetail",
			"to": "MyVehiclesDetailAddVehicle"
		}, {
			"from": "MyVehiclesMaster--SapSplAddNewTruck",
			"to": "MyVehiclesDetailAddVehicle"
		}, {
			"from": "MyVehiclesDetailAddVehicle",
			"to": "MyVehiclesDetail"
		}];
	},

	/**
	 * @description Forward Navigation handler in Master App under the channel - navInMasterVehicle.
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
	navInMasterVehicle_To: function (oEvent, sDir, oData) {
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
						this.oMyVehiclesSplitApp.toMaster(sTarget, "fade", oData.data);
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
	 * @description Forward Navigation handler in Detail App under the channel - navInDetailVehicle.
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
	navInDetailVehicle_To: function (oEvent, sDir, oData) {
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
						this.oMyVehiclesSplitApp.toDetail(sTarget, "fade", oData.data);
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
	 * @description Back Navigation handler in Detail App under the channel - navInDetailVehicle.
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
	navInDetailVehicle_Back: function (oEvent, sDir, oData) {

		if (!oData.data) {
			oData.data = null;
		}
		try {
			if (sDir && typeof sDir === "string") {
				this.oMyVehiclesSplitApp.backDetail(oData.data);
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
	 * @description Back Navigation handler in Master App under the channel - navInMasterVehicle.
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
	navInMasterVehicle_Back: function (oEvent, sDir, oData) {
		if (!oData.data) {
			oData.data = null;
		}
		try {
			if (sDir && typeof sDir === "string") {
				this.oMyVehiclesSplitApp.backMaster(oData.data);
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
	 * @example
	 * var sTargetViewId = oSapSplUtils.getSplViewsRegistry(sViewId);
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
	},

	/**
	 * @description listens to event handling channel which is previously subscribed. This is the default call back when any navigation happens to this view.
	 * It is called even before the onBeforeRendering life cycle method of the view.
	 * @param evt event object of the navigation event.
	 * @returns void.
	 * @since 1.0
	 */
	onBeforeShow: function (oEvent) {
		var sVehicleRegNumber = null;
		sap.ui.getCore().getModel("myVehiclesListODataModel").refresh();
		this.setCurrentAppInfo(oEvent);
		this.appID = "vehicles";
		sap.ui.getCore().getModel("sapSplAppConfigDataModel").setData(oSapSplUtils.getAppConfigObjectFromAllowedTiles(this.appID)[0]);
		/* CSNFIX :  0120031469 0000788098 2014 */
		if (sap.ui.getCore().getModel("SapSplMyVehicleDetailModel") && this.oMyVehiclesSplitApp) {
			this.oMyVehiclesSplitApp.toDetail("MyVehiclesDetail");
			var oModelData = sap.ui.getCore().getModel("SapSplMyVehicleDetailModel").getData();
			oModelData["isClicked"] = false;
			oModelData["noData"] = true;
			oModelData["showFooterButtons"] = false;
			oModelData["isEdit"] = false;
			oModelData["isEditable"] = false;
			sap.ui.getCore().getModel("SapSplMyVehicleDetailModel").setData(oModelData);
		}

		if (oEvent.data && oEvent.data["FromApp"] === "profile" || oEvent.data["FromApp"] === "Notifications") {
			sVehicleRegNumber = oEvent.data["RegistrationNumber"];
		}

		this.byId("SapSplVehicleMasterDetailSplitApp").getMasterPages()[0].getController().fnHandleNavigationSearch(sVehicleRegNumber);

	},

	setCurrentAppInfo: function (oEvent) {
		oSapSplHelpHandler.setAppHelpInfo({
			iUrl: "./help/SCLTrucks.pdf",
			eUrl: "//help.sap.com/saphelp_scl10/helpdata/en/e2/cde153cafa9117e10000000a44176d/content.htm?frameset=/en/a6/92e453477d9438e10000000a44176d/frameset.htm&current_toc=/en/b7/8ee25341d61e4ee10000000a423f68/plain.htm&node_id=15&show_children=false"
		}, oEvent);
	},

	onAfterRendering: function () {}


});
