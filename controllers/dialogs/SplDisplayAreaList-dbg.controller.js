/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.controller("splController.dialogs.SplDisplayAreaList", {

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 */
	onInit : function() {
		
		var that = this;
		var oSapSplDisplayAreaListModel = sap.ui.getCore().getModel("LiveAppODataModel");
		this.getView().setModel(oSapSplDisplayAreaListModel);

		var oSorter = new sap.ui.model.Sorter("isMyCompanyView", false, function(oContext) {
			var sOwnerName = oContext.getProperty("OwnerName");
			var iIsMyCompanyView = oContext.getProperty("isMyCompanyView");
			if (iIsMyCompanyView === 1) {
				return {
					key: "My Owner",
					text: "{splI18NModel>MY_COMPANY_DISPLAY_AREAS}"
				};
			} else {
				return {
					key: sOwnerName,
					text: sOwnerName
				};
			}
		});

		var displayAreaList = this.getView().byId("DisplayAreaList");
		displayAreaList.getBinding("items").sort(oSorter);
		displayAreaList.getBinding("items").filter([new sap.ui.model.Filter("Favourite", sap.ui.model.FilterOperator.EQ, "1")]);
		displayAreaList.addEventDelegate({
			onAfterRendering: function(oEvent) {
				oEvent.srcControl.setBusy(false);
				var sSelectedDisplayArea = that.getView().getViewData().oDisplayAreaLabel.getText();
				if (oEvent.srcControl.getItems().length > 0) {
					if (sSelectedDisplayArea !== oSapSplUtils.getBundle().getText("SELECT_DISPLAY_AREA")) {
						for (var i = 0; i < oEvent.srcControl.getItems().length; i++) {
							if (oEvent.srcControl.getItems()[i].getTitle() === sSelectedDisplayArea) {
								oEvent.srcControl.getItems()[i].setSelected(true);
								break;
							}
						}
					}
				}
			}
		});
		
		this.parentControllerInstance = this.getView().getViewData().parentControllerInstance;
	},

	handleSelectOfDisplayArea: function(oEvent) {
		var zoomObject = {};
		var sCoords = oSapSplMapsDataMarshal.convertGeoJSONToString(JSON.parse(oEvent.getParameters().listItem.getBindingContext().getProperty().DisplayArea_Center)).split(";");
		zoomObject.lon = parseFloat(sCoords[0], 10);
		zoomObject.lat = parseFloat(sCoords[1], 10);
		zoomObject.zoomLevel = parseFloat(oEvent.getParameters().listItem.getBindingContext().getProperty().DisplayArea_ZoomLevel, 10);
		oSapSplMapsDataMarshal.fnSetZoomAndCenter(this.parentControllerInstance.byId("oSapSplLiveAppMap"), zoomObject);
		this.getView().getViewData().oDisplayAreaLabel.setText(oEvent.getParameters().listItem.getTitle());
	},
	
	changeDefaultDisplayAreaOnCloseOfDialog: function(oObject) {
		if (this.getView().getViewData().oDisplayAreaLabel.getText() !== oSapSplUtils.getBundle().getText("SELECT_DISPLAY_AREA")) {
			var zoomObject = {};
			var sCoords = oSapSplMapsDataMarshal.convertGeoJSONToString(JSON.parse(oObject.DisplayArea_Center)).split(";");
			zoomObject.lon = parseFloat(sCoords[0], 10);
			zoomObject.lat = parseFloat(sCoords[1], 10);
			zoomObject.zoomLevel = parseFloat(oObject.DisplayArea_ZoomLevel, 10);
			oSapSplMapsDataMarshal.fnSetZoomAndCenter(this.parentControllerInstance.byId("oSapSplLiveAppMap"), zoomObject);
			this.getView().getViewData().oDisplayAreaLabel.setText(oObject.Name);
		}
	},
	
	setBeginButton: function(oButton) {
		var that = this;
		oButton.attachPress(function() {

			var createDisplayAreaDialogView = sap.ui.view({
				viewName: "splView.dialogs.SplCreateDisplayAreaDialog",
				type: sap.ui.core.mvc.ViewType.XML,
				viewData: that.getView().getViewData()
			});
			/* CSNFIX : 1570171472 */
			var createDisplayAreaDialog = new sap.m.Dialog({
				title: oSapSplUtils.getBundle().getText("CREATE_VIEW"),
				content: createDisplayAreaDialogView
			}).open().addStyleClass("sapSplDisplayAreaDialogContent");

			createDisplayAreaDialogView.getController().setParentDialogInstance(createDisplayAreaDialog);

			createDisplayAreaDialog.attachAfterOpen(function (oEvent) {
				oSapSplUtils.fnSyncStyleClass(createDisplayAreaDialog);
				that.parentControllerInstance.fnBlockUnblockLiveAppUI("Block", "createDisplayAreaDialog");
			});

			createDisplayAreaDialog.attachAfterClose(function (oEvent) {
				that.parentControllerInstance.fnBlockUnblockLiveAppUI("Unblock");
				oEvent.getSource().destroy();
				that.getView().getViewData().parentControllerInstance.fnShowHideLiveAppDisplayAreaBorder("hide");
//				that.changeDefaultDisplayAreaOnCloseOfDialog(that.getView().getViewData().oMapInstance.defaultDisplayArea);
			});

			createDisplayAreaDialog.addEventDelegate({
				onAfterRendering: function (oEvent) {
					that.parentControllerInstance.fnHandleDialogMove(oEvent.srcControl);
				}
			});

		});
		
	},
	setEndButton: function(oButton) {
		var that = this;
		oButton.attachPress(function() {

			var settingsDisplayAreaDialogView = sap.ui.view({
				viewName: "splView.dialogs.SplEditDisplayAreaSettings",
				type: sap.ui.core.mvc.ViewType.XML,
				viewData: that.getView().getViewData()
			});
			/* CSNFIX : 1570171497 */
			var settingsDisplayAreaDialog = new sap.m.Dialog({
				title: oSapSplUtils.getBundle().getText("DISPLAY_AREA_SETTINGS"),
				content: new sap.ui.layout.HorizontalLayout().addStyleClass("sapSplDisplayAreaSettingsDialog").addContent(settingsDisplayAreaDialogView)
			}).open().addStyleClass("sapSplDisplayAreaDialogContent");

			settingsDisplayAreaDialogView.getController().setParentDialogInstance(settingsDisplayAreaDialog);
			
			settingsDisplayAreaDialog.attachAfterOpen(function () {
				oSapSplUtils.fnSyncStyleClass(settingsDisplayAreaDialog);
				that.parentControllerInstance.fnPreventEnableMapRefresh("Prevent");
			});

			settingsDisplayAreaDialog.attachAfterClose(function (oEvent) {
				oEvent.getSource().destroy();
				that.parentControllerInstance.fnPreventEnableMapRefresh("Enable");
//				that.changeDefaultDisplayAreaOnCloseOfDialog(that.getView().getViewData().oMapInstance.defaultDisplayArea);
			});

		});
	}
});