/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.controller("splController.incidents.IncidentsMasterView", {
	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 */
	onInit: function () {
		var oSapSplIncidentsListModel = null, that = this;
		try {

			/*SAPUI5 ODataModel - to be set to MyIncidentsMaster view*/
			//oSapSplIncidentsListModel = new sap.ui.model.odata.ODataModel(oSapSplUtils.getServiceMetadata("appl", true));
			oSapSplIncidentsListModel = sap.ui.getCore().getModel("IncidentsListODataModel");
			oSapSplIncidentsListModel.setCountSupported(false);

			this.oSapSplIncidentsSorterPriority = new sap.ui.model.Sorter("Priority", false);

			this.oSapSplIncidentsSorterPriorityWithGroup = new sap.ui.model.Sorter("Priority", false, function (oContext) {
				var sKey = oContext.getProperty("Priority.description");
				if (sKey) {
					return sKey;
				} else {
					return "";
				}
			});

			this.oSapSplIncidentsSorterName = new sap.ui.model.Sorter("InternalName", false);

			this.oSapSplIncidentsSorterCategory = new sap.ui.model.Sorter("Category.description", false, function (oContext) {
				var sKey = oContext.getProperty("Category.description");
				if (sKey) {
					return sKey;
				} else {
					return "";
				}
			});

			/*event registered to ensure that the first item is always selected. */
			oSapSplIncidentsListModel.attachRequestCompleted(jQuery.proxy(this.ODataModelRequestCompleted, this));

			oSapSplIncidentsListModel.attachRequestFailed(function () {
				/* Fix for incident : 1580111420 */
				if (sap.ui.getCore().getModel("SapSplIncidentsDetailModel")) {
					var oModelData = sap.ui.getCore().getModel("SapSplIncidentsDetailModel").getData();
					oModelData["noData"] = true;
					oModelData["isClicked"] = false;
					oModelData["isEditable"] = 0;
					sap.ui.getCore().getModel("SapSplIncidentsDetailModel").setData(oModelData);
				}
				oSapSplBusyDialog.getBusyDialogInstance().close();
				this.getView().byId("sapSplIncidentSearch").focus();
			});

			/*Setting the odata model on the list control*/
			this.getView().byId("SapSplIncidentsList").setModel(sap.ui.getCore().getModel("IncidentsListODataModel"));

			this.getView().byId("SapSplIncidentsList").getBinding("items").sort([this.oSapSplIncidentsSorterCategory, this.oSapSplIncidentsSorterName, this.oSapSplIncidentsSorterPriority]);

			this.getView().byId("SapSplIncidentsList").getBinding("items").filter(new sap.ui.model.Filter("isDeleted", sap.ui.model.FilterOperator.EQ, "0"));

			/*Method to prepare dialog for filters*/
			this.prepareDialogForFilters();

			/*Method to prepare popover for sorters*/
			this.preparePopOverForSorters();

			/*Localization*/
			this.fnDefineControlLabelsFromLocalizationBundle();

			this.byId("FilterStatusText").setText(oSapSplUtils.getBundle().getText("FILTER_LABEL_ALL"));

			this.appliedFilters = [];
			this.appliedSorters = [];

			this.appliedFilters = this.byId("SapSplIncidentsList").getBinding("items").aFilters;
			this.appliedSorters = this.byId("SapSplIncidentsList").getBinding("items").aSorters;
			
			/* fix for the incident 1580100686 */
			setTimeout( function () {
				that.getView().byId("sapSplIncidentSearch").focus();
			}, 1000 );
			

		} catch (e) {
			if (e instanceof Error) {
				jQuery.sap.log.error(e.message, "MyIncidentsList not defined", this.getView().getControllerName());
			}
		}
	},

	/***
	 * @description Method to capture the click of add incident button, and to check for dirty state of the app
	 * If the app is in dirty state, the data loss warning comes up, else
	 * The add new incident screen comes up.
	 * @since 1.0
	 * @returns void.
	 * @param {object} oEvent event object.
	 */
	fireSelectionOfIncidentsMode: function (oEvent) {

		var that = this;
		var e = jQuery.extend(true, {}, oEvent);

		if (oSapSplUtils.getIsDirty()) {
			sap.m.MessageBox.show(
					oSapSplUtils.getBundle().getText("DATA_LOSS_WARNING_TEXT"),
					sap.m.MessageBox.Icon.WARNING,
					oSapSplUtils.getBundle().getText("WARNING"), [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
					function (selection) {
						if (selection === "YES") {
							oSapSplUtils.setIsDirty(false);
							that.navigateToAddNewIncidentPage(e);
						}
					}, null, oSapSplUtils.fnSyncStyleClass( "messageBox" )
			);
		} else {
			this.navigateToAddNewIncidentPage(e);
		}
	},

	/**
	 * @description Method used to navigate to new incident page in detail pages.
	 * @param
	 * {object} oEvent event object.
	 * @returns void
	 * @since 1.0
	 */
	navigateToAddNewIncidentPage: function () {
		var oData = null;
		var that = this;
		var masterList = this.byId("SapSplIncidentsList");

		if (this.getSplitAppInstance() && this.getSplitAppInstance().getCurrentDetailPage().sId === "IncidentsDetails") {
			oData = this.getEmptyAddIncidentsData("create");
			sap.ui.getCore().getModel("SapSplIncidentsDetailModel").setData(oData);
			this.getSplitAppInstance().getCurrentDetailPage().getController().fnMakeChangesToDetailPageControlsBasedOnMode("Create", oData);
		}
		masterList.removeSelections();
		that.getSplitAppInstance().getCurrentDetailPage().byId("SapSplIncidentsNameInput").focus();
	},

	/**
	 * @description Method to return an empty incident object, used to bind the new incident page.
	 * @param
	 * void
	 * @returns {object} oEmptyData empty object to be bound.
	 * @since 1.0
	 */
	getEmptyAddIncidentsData: function (sMode) {
		var oEmptyData = {};
		oEmptyData["isDisplay"] = false;
		oEmptyData["isEdit"] = true;
		oEmptyData["isNotCreate"] = false;
		if (sMode && sMode === "create") {
			oEmptyData["isClicked"] = true;
			oEmptyData["noData"] = false;
			if (this.byId("SapSplIncidentsList").getSelectedItems().length > 0) {
				this.getSplitAppInstance().getCurrentDetailPage().getController().incidentSelected = this.byId("SapSplIncidentsList").getSelectedItem().getBindingContext().getProperty().UUID;
			}
		} else {
			oEmptyData["isClicked"] = false;
			oEmptyData["noData"] = true;
		}
		return oEmptyData;
	},

	/**
	 * @description Method to handle localization of all the hard code texts in the view.
	 * @param void.
	 * @returns void.
	 * @since 1.0
	 */
	fnDefineControlLabelsFromLocalizationBundle: function () {
		this.byId("IncidentsMasterPage").setTitle(oSapSplUtils.getBundle().getText("INCIDENTS_MASTER_PAGE_TITLE", "0"));
		/* CSNFIX : 0120031469 620551     2014 */
		this.byId("SapSplIncidentsList").setNoDataText(oSapSplUtils.getBundle().getText("NO_INCIDENTS_TEXT"));

		/* CSNFIX 0001295875 */
		this.byId("SapSplAddIncidentButton").setTooltip(oSapSplUtils.getBundle().getText("INCIDENTS_ADD_INCIDENTS"));
		this.byId("SapSplFilterIncidentsButton").setTooltip(oSapSplUtils.getBundle().getText("FILTER_BUTTON_TOOLTIP"));
		this.byId("SapSplGroupIncidentsButton").setTooltip(oSapSplUtils.getBundle().getText("GROUPBY_BUTTON_TOOLTIP"));
		this.byId("IncidentsMasters--sapSplIncidentSearch").setTooltip(oSapSplUtils.getBundle().getText("SEARCH_BUTTON_TOOLTIP"));
		this.byId("IncidentsMasters--sapSplIncidentSearch").setRefreshButtonTooltip(oSapSplUtils.getBundle().getText("REFRESH_BUTTON_TOOLTIP"));

	},

	/***
	 * @description method to prepare a dialog control to show the available filters for trucks.
	 * @returns void.
	 * since 1.0
	 * @param e event object
	 */
	prepareDialogForFilters: function () {

		var that = this;
		this.oSapSplIncidentsDialogForFilters = new sap.m.ViewSettingsDialog({
			filterItems: [
			              new sap.m.ViewSettingsFilterItem({
			            	  key: "priority",
			            	  text: oSapSplUtils.getBundle().getText("INCIDENTS_PRIORITY"),
			            	  multiSelect: true,
			            	  items: {
			            		  path: "/Priority",
			            		  template: new sap.m.ViewSettingsItem({
			            			  text: "{Name}",
			            			  key: "{Key}"
			            		  })
			            	  }
			              }),
			              new sap.m.ViewSettingsFilterItem({
			            	  key: "category",
			            	  text: oSapSplUtils.getBundle().getText("INCIDENTS_CATEGORY"),
			            	  multiSelect: true,
			            	  items: {
			            		  path: "/Category",
			            		  template: new sap.m.ViewSettingsItem({
			            			  text: "{Name}",
			            			  key: "{Key}"
			            		  })
			            	  }
			              })
			              ],
			              confirm: function (oEvent) {
			            	  var aSelectedFilters = [],
			            	  aResultFilters = [];
			            	  aSelectedFilters = oEvent.getParameters()["filterItems"];
			            	  if (aSelectedFilters.length === 0) {
			            		  that.byId("FilterStatusText").setText(oSapSplUtils.getBundle().getText("FILTER_LABEL_ALL"));
			            	  } else {
			            		  that.byId("FilterStatusText").setText(oEvent.getParameters().filterString.split(": ")[1]);
			            	  }
			            	  for (var i = 0; i < aSelectedFilters.length; i++) {
			            		  var sItemKey = aSelectedFilters[i].getKey();
			            		  var aFilterParts = sItemKey.split("_");
			            		  aResultFilters.push(new sap.ui.model.Filter(aFilterParts[0], sap.ui.model.FilterOperator.EQ, aFilterParts[1]));
			            	  }

			            	  that.handleSelectOfFilter(aResultFilters);

			              },
						 cancel: function(oEvent) {
							that.getView().byId("sapSplIncidentSearch").focus();
						 }
		}).addStyleClass("sapUiSizeCompact");

		var oData = {
				Priority: [{
					Name: oSapSplUtils.getBundle().getText("INCIDENTS_PRIORITY_1"),
					Key: "Priority_1"
				}, {
					Name: oSapSplUtils.getBundle().getText("INCIDENTS_PRIORITY_2"),
					Key: "Priority_2"
				}, {
					Name: oSapSplUtils.getBundle().getText("INCIDENTS_PRIORITY_3"),
					Key: "Priority_3"
				}, {
					Name: oSapSplUtils.getBundle().getText("INCIDENTS_PRIORITY_4"),
					Key: "Priority_4"
				}],
				Category: [{
					Name: oSapSplUtils.getBundle().getText("INCIDENTS_CATEGORY_INTERFERENCE"),
					Key: "Category_I"
				}, {
					Name: oSapSplUtils.getBundle().getText("INCIDENTS_CATEGORY_CONTAINER"),
					Key: "Category_C"
				}, {
					Name: oSapSplUtils.getBundle().getText("INCIDENTS_CATEGORY_PARKING"),
					Key: "Category_P"
				}]
		};
		this.oSapSplIncidentsDialogForFilters.setModel(new sap.ui.model.json.JSONModel(oData));

	},

	/***
	 * @description method to prepare a popover control to show the available sorters for devices.
	 * @returns void.
	 * @since 1.0
	 * @param e event object
	 */

	preparePopOverForSorters: function () {
		var oSapSplIncidentsPopOverForSortersLayout = null;
		this.oSapSplIncidentsPopOverForSorters = new sap.m.Popover({
			placement: sap.m.PlacementType.Top,
			showHeader: false
		});
		oSapSplIncidentsPopOverForSortersLayout = new sap.ui.commons.layout.VerticalLayout().addStyleClass("sapSplIncidentsGroupPopover");

		/* 0120031469 670747     2014 - Changed the text from All to None */

		oSapSplIncidentsPopOverForSortersLayout
		.addContent(new sap.m.RadioButton({
			id: "all",
			selected: false,
			groupName: "sort"
		}).setText(oSapSplUtils.getBundle().getText("FILTER_LABEL_NONE")).attachSelect(jQuery.proxy(this.handleSelectOfSorterRadioButton, this)))
		.addContent(new sap.m.RadioButton({
			id: "category",
			selected: true,
			groupName: "sort"
		}).setText(oSapSplUtils.getBundle().getText("INCIDENTS_CATEGORY")).attachSelect(jQuery.proxy(this.handleSelectOfSorterRadioButton, this)))
		.addContent(new sap.m.RadioButton({
			id: "priority",
			selected: false,
			groupName: "sort"
		}).setText(oSapSplUtils.getBundle().getText("INCIDENTS_PRIORITY")).attachSelect(jQuery.proxy(this.handleSelectOfSorterRadioButton, this))) /*
            .addContent(new sap.m.RadioButton({ //fix for the incident 1570019805 
                id: "name",
                selected: false,
                groupName: "sort"
            }).setText(oSapSplUtils.getBundle().getText("INCIDENTS_NAME")).attachSelect(jQuery.proxy(this.handleSelectOfSorterRadioButton, this))) */;
		this.oSapSplIncidentsPopOverForSorters.addContent(oSapSplIncidentsPopOverForSortersLayout);

	},

	/**
	 * @description Handler for the select event on the list of my incidents.
	 * @param {object} evt select event object.
	 * @returns void.
	 * @since 1.0
	 */
	onSelectOfIncidents: function (evt) {
		this.handleMyIncidentsSelect(evt.getParameter("listItem").getBindingContext().getProperty());
	},

	/**
	 * @description select event handler of the "myIncidents" list. Results in navigation of the detail page - to Incidents detail page.
	 * @param {object} oSelectedListItemData bound object to the selected incident.
	 * @returns void.
	 * @since 1.0
	 */
	handleMyIncidentsSelect: function (oSelectedListItemData) {

		var that = this,
		masterList,
		sIndex,
		currentUser;
		if (oSapSplUtils.getIsDirty()) {
			sap.m.MessageBox.show(
					oSapSplUtils.getBundle().getText("DATA_LOSS_WARNING_TEXT"), sap.m.MessageBox.Icon.WARNING, oSapSplUtils.getBundle().getText("WARNING"), [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL], function (selection) {

						if (selection === "YES") {

							that.updateIncidentDetailPage(oSelectedListItemData);
							oSapSplUtils.setIsDirty(false);

						} else {
							currentUser = sap.ui.getCore().getModel("SapSplIncidentsDetailModel").getData();
							masterList = that.byId("SapSplIncidentsList");
							if (currentUser.UUID) {
								for (sIndex = 0; sIndex < masterList.getItems().length; sIndex++) {
									if (masterList.getItems()[sIndex].sId.indexOf("oSapSplIncidentListItem") !== -1) {
										if (masterList.getItems()[sIndex].getBindingContext().getProperty().UUID === currentUser.UUID) {
											masterList.setSelectedItem(masterList.getItems()[sIndex]);
											break;
										}
									}
								}
							} else {
								masterList.removeSelections();
							}
						}
					}, null, oSapSplUtils.fnSyncStyleClass( "messageBox" ));
		} else {
			that.updateIncidentDetailPage(oSelectedListItemData);
		}


	},

	updateIncidentDetailPage: function (oSelectedListItemData) {
		try {
			oSelectedListItemData = jQuery.extend({}, oSelectedListItemData);
			oSelectedListItemData["isEdit"] = false;
			oSelectedListItemData["isDisplay"] = true;
			oSelectedListItemData["isClicked"] = true;
			oSelectedListItemData["noData"] = false;
			var sMetadataURL = oSelectedListItemData["__metadata"]["uri"];
			var aSplitArray = sMetadataURL.split("xsodata/");
			var sSelectedIncidentsURL = aSplitArray[aSplitArray.length - 1];
			sSelectedIncidentsURL = encodeURIComponent(sSelectedIncidentsURL.replace("SearchIncidentDetails", "IncidentDetails")) + "/AssignedLocations";

			oSelectedListItemData["Geofences"] = this.getAssignedLocations(sSelectedIncidentsURL);

			/*
			 * If the current Detail page of the SplitAppBase control, is the incidents details page, then just change the myIncidentsDetailModel's data,
			 * else navigate to the incidents details page and change the model data in onBeforeShow of the respective view's controller.
			 **/
			if (this.getSplitAppInstance()) {
				if (this.getSplitAppInstance().getCurrentDetailPage().sId === "IncidentsDetails") {

					oSelectedListItemData["Geometry"] = JSON.parse(oSelectedListItemData["IncidentLocationGeometry"]); //oSapSplMapsDataMarshal.convertStringToGeoJSON(oSelectedListItemData["IncidentLocationGeometry"]);
					if (oSelectedListItemData["IncidentLocationGeometry"]) {
						oSelectedListItemData["IncidentLocationGeometry"] = oSapSplMapsDataMarshal.convertGeoJSONToString(JSON.parse(oSelectedListItemData["IncidentLocationGeometry"]));
					}
					this.getSplitAppInstance().getCurrentDetailPage().getController().fnSetSelectedMasterItemData(oSelectedListItemData); /*The object bound to the selected listItem.*/
					sap.ui.getCore().getModel("SapSplIncidentsDetailModel").setData(oSelectedListItemData);
					this.getSplitAppInstance().getCurrentDetailPage().getController().fnMakeChangesToDetailPageControlsBasedOnMode("Display", oSelectedListItemData);
				}
			} else {
				throw new Error();
			}
		} catch (e) {
			if (e instanceof Error) {
				jQuery.sap.log.error(e.message, "There is no current Detail Page in MyIncidents SplitApp.", this.getView().getControllerName());
			}
		}
	},

	/**
	 * @description Method to get the assigned locations to the selected incident.
	 * @param
	 * {string} sSelectedIncidentsURL the URL needed to get the assigned locations of the selected incident.
	 * @returns {array} aAssignedGeofences Array of all the assigned geofences to the selected incident.
	 * @since 1.0
	 */
	getAssignedLocations: function (sSelectedIncidentsURL) {

		var aAssignedGeofences = [];
		if (!this.oDataModel) {
			this.oDataModel = sap.ui.getCore().getModel("IncidentsToLocationMapODataModel");
		}
		this.oDataModel.read("/" + sSelectedIncidentsURL, null, [], false, function (results) {
			aAssignedGeofences = results.results;
			for (var i = 0; i < aAssignedGeofences.length; i++) {
				aAssignedGeofences[i]["isDeleted"] = false;
				aAssignedGeofences[i]["CHANGEMODE"] = null;
			}
		}, function () {

		});
		return aAssignedGeofences;
	},

	/***
	 * @description Method to set SpiltApp Instance .
	 * @since 1.0
	 * @returns void.
	 * @param {object} oSplitApp instance of sap.m.SpiltApp
	 */
	setSplitAppInstance: function (oSplitApp) {
		if (oSplitApp) {
			this.oSplitAppInstance = oSplitApp;
		}
	},

	/***
	 * @description Method to set SpiltApp Instance .
	 * @since 1.0
	 * @param void.
	 * @returns {object} oSplitApp instance of sap.m.SpiltApp
	 */
	getSplitAppInstance: function () {
		if (this.oSplitAppInstance) {
			return this.oSplitAppInstance;
		}
	},


	/***
	 * @description Method to open the Action Sheet which contains the set of roles which the logged user can assign.
	 * @since 1.0
	 * @param evt event object of press
	 * @returns void.
	 */
	openSapSplAddIncidentsActionSheet: function () {
		this.fireSelectionOfIncidentsMode();
	},

	/***
	 * @description method to handle the request completed event of the ODataModel.
	 * @param void.
	 * @returns void.
	 * @since 1.0
	 */
	ODataModelRequestCompleted: function () {
		if (arguments[0].getParameters().success) {
			oSapSplBusyDialog.getBusyDialogInstance().close();
			this.onAfterListRendering();
		}
	},

	onAfterRendering: function () {
		oSapSplQuerySelectors.getInstance().setBackButtonTooltip();
	},

	/***
	 * @description method to handle the onAfterRendering event of the oSapSplIncidentsList control.
	 * This is useful to select the first element of the list after either sorting or filtering.
	 * @returns void.
	 * since 1.0
	 * @param e event object
	 * @throws new Error();
	 */
	onAfterListRendering: function () {
		//      oSapSplBusyDialog.getBusyDialogInstance().close();
		var aSapSplIncidentsListItems = [],
		oDetailModelData = null;
		var oListCustomData = (this.byId("SapSplIncidentsList").getCustomData().length > 0) ?
				this.byId("SapSplIncidentsList").getCustomData()[this.byId("SapSplIncidentsList").getCustomData().length - 1].getKey() : null,
				_iCount = 1;

				try {
					if (this.byId("SapSplIncidentsList")) {
						aSapSplIncidentsListItems = this.byId("SapSplIncidentsList").getItems();
						if (aSapSplIncidentsListItems.length) {

							this.byId("IncidentsMasterPage").setTitle(oSapSplUtils.getBundle().getText("INCIDENTS_MASTER_PAGE_TITLE", [splReusable.libs.Utils.prototype.getListCount(this.byId("SapSplIncidentsList"))]));

							if (oListCustomData !== null) {
								for (var iCount = 0; iCount < aSapSplIncidentsListItems.length; iCount++) {

									/*First item is always GroupHeaderListItem, so ignore and go to the next item*/
									if (aSapSplIncidentsListItems[iCount].constructor !== sap.m.GroupHeaderListItem) {
										if (oListCustomData === aSapSplIncidentsListItems[iCount].getBindingContext().getProperty("UUID")) {
											//Match found. Select the item and break;
											_iCount = iCount;
											break;
										}
									}
								}
							}
						}
						if (aSapSplIncidentsListItems.length > 0) {
							this.selectFirstItem(_iCount);
							/* CSNFIX : 0120031469 620551     2014 */
							if (sap.ui.getCore().getModel("SapSplIncidentsDetailModel")) {
								oDetailModelData = sap.ui.getCore().getModel("SapSplIncidentsDetailModel").getData();
							}
							oDetailModelData["noData"] = false;
							oDetailModelData["isClicked"] = true;
							sap.ui.getCore().getModel("SapSplIncidentsDetailModel").setData(oDetailModelData);
						}
					} else {
						throw new Error();
					}
				} catch (e) {
					if (e instanceof Error) {
						jQuery.sap.log.error(e.message, "MyIncidentsList not defined", this.getView().getControllerName());
					}
				}
				this.getView().byId("sapSplIncidentSearch").focus();
	},

	/***
	 * @description method to handle the select event of one of the filters.
	 * This will trigger the filter action on the oSapSplIncidentsList
	 * @since 1.0
	 * @throws new Error();
	 * @param e
	 * @returns void.
	 */
	handleSelectOfFilter: function (aFilters) {
		var oSapSplIncidentsList = null,
		oSapSplIncidentsListItemsBinding = null,
		oSapSplIncidentSorter = null,
		oSelectedListItemData = {};

		// fix for internal incident 1482000407
		oSelectedListItemData["noData"] = true;
		oSelectedListItemData["isClicked"] = false;
		oSelectedListItemData["isEdit"] = false;
		oSelectedListItemData["isDisplay"] = true;


		sap.ui.getCore().getModel("SapSplIncidentsDetailModel").setData(oSelectedListItemData);

		try {
			if (this.byId("SapSplIncidentsList")) {
				oSapSplIncidentsList = this.byId("SapSplIncidentsList");
				oSapSplIncidentsListItemsBinding = oSapSplIncidentsList.getBinding("items");
				oSapSplIncidentSorter = oSapSplIncidentsList.getBinding("items").aSorters;
				if (oSapSplIncidentsListItemsBinding) {
					oSapSplIncidentsListItemsBinding.filter([]);
				} else {
					throw new Error();
				}
			} else {
				throw new Error();
			}

			/* CSNFIX 0120061532 1314263    2014 */
			aFilters.push(new sap.ui.model.Filter("isDeleted", sap.ui.model.FilterOperator.EQ, "0"));

			oSapSplIncidentsListItemsBinding.filter(aFilters);
			oSapSplIncidentsListItemsBinding.sort(oSapSplIncidentSorter);

			this.appliedFilters = oSapSplIncidentsListItemsBinding.aFilters;

		} catch (e) {
			if (e instanceof Error) {
				jQuery.sap.log.error(e.message, "undefined", this.getView().getControllerName());
			}
		}
	},

	/***
	 * @description method to handle the select event on the radioButton group "sorters".
	 * This will trigger the sort action on the oSapSplIncidentsList
	 * @since 1.0
	 * @throws new Error();
	 * @param e
	 * @returns void.
	 */

	handleSelectOfSorterRadioButton: function (oEvent) {

		var e = jQuery.extend(true, {}, oEvent);
		var that = this;
		if (oEvent.getParameter("selected")) {
			if (oSapSplUtils.getIsDirty()) {
				sap.m.MessageBox.show(
						oSapSplUtils.getBundle().getText("DATA_LOSS_WARNING_TEXT"),
						sap.m.MessageBox.Icon.WARNING,
						oSapSplUtils.getBundle().getText("WARNING"), [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
						function (selection) {
							if (selection === "YES") {

								oSapSplUtils.setIsDirty(false);
								that.sortMasterListBasedOnSortTypeSelection(e);

							}
						}, null, oSapSplUtils.fnSyncStyleClass( "messageBox" )
				);
			} else {
				this.sortMasterListBasedOnSortTypeSelection(e);
			}
		}

	},

	/**
	 * @description Method to handle sorting of the master list based on the sorting criteria selected..
	 * @param
	 * {object} oEvent event object.
	 * @returns void
	 * @since 1.0
	 */
	sortMasterListBasedOnSortTypeSelection: function (oEvent) {
		var oSapSplIncidentsList = null,
		sId = "",
		oSapSplIncidentsListItemsBinding = null,
		aAppliedFilters = [];
		try {
			if (this.oSapSplIncidentsPopOverForSorters) {
				this.oSapSplIncidentsPopOverForSorters.close();
			} else {
				throw new Error();
			}

			sId = oEvent.getSource().sId;

			if (this.byId("SapSplIncidentsList")) {
				oSapSplIncidentsList = this.byId("SapSplIncidentsList");
				oSapSplIncidentsListItemsBinding = oSapSplIncidentsList.getBinding("items");
				aAppliedFilters = oSapSplIncidentsListItemsBinding.aFilters;
				this.byId("SapSplIncidentsList").unbindAggregation("items");
				this.byId("SapSplIncidentsList").bindItems({
					path: "/IncidentDetails",
					template: this.byId("oSapSplIncidentListItem")
				});
				oSapSplIncidentsListItemsBinding = this.byId("SapSplIncidentsList").getBinding("items");

				if (!oSapSplIncidentsListItemsBinding) {
					throw new Error();
				}
			} else {
				throw new Error();
			}

			if (sId === "category") {
				if (this.oSapSplIncidentsSorterCategory) {
					oSapSplIncidentsListItemsBinding.sort([this.oSapSplIncidentsSorterCategory, this.oSapSplIncidentsSorterName, this.oSapSplIncidentsSorterPriority]);
					oSapSplIncidentsListItemsBinding.filter(aAppliedFilters);
				} else {
					throw new Error();
				}
			} else if (sId === "priority") {
				oSapSplIncidentsListItemsBinding.sort([this.oSapSplIncidentsSorterPriorityWithGroup, this.oSapSplIncidentsSorterName]);
				oSapSplIncidentsListItemsBinding.filter(aAppliedFilters);
			} else if (sId === "all") {
				oSapSplIncidentsListItemsBinding.sort([this.oSapSplIncidentsSorterName]);
				oSapSplIncidentsListItemsBinding.filter(aAppliedFilters);
			}
			else {
				oSapSplIncidentsListItemsBinding.filter(aAppliedFilters);
			}

			this.appliedSorters = oSapSplIncidentsListItemsBinding.aSorters;
		} catch (error) {
			if (error instanceof Error) {
				jQuery.sap.log.error(error.message, "undefined", this.getView().getControllerName());
			}
		}
	},

	/***
	 * @description method to handle the press event on "filter" button in the master page footer.
	 * this will open the popOver prepared earlier, to the top of this button.
	 * @returns void.
	 * @param e
	 * @since 1.0
	 * @throws new Error();
	 */
	openSapSplIncidentFilterPopover: function () {

		var that = this;
		if (oSapSplUtils.getIsDirty()) {
			sap.m.MessageBox.show(
					oSapSplUtils.getBundle().getText("DATA_LOSS_WARNING_TEXT"),
					sap.m.MessageBox.Icon.WARNING,
					oSapSplUtils.getBundle().getText("WARNING"), [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
					function (selection) {
						if (selection === "YES") {

							oSapSplUtils.setIsDirty(false);


							try {
								if (that.oSapSplIncidentsDialogForFilters) {
									that.oSapSplIncidentsDialogForFilters.open();
								} else {
									throw new Error();
								}
							} catch (e) {
								if (e instanceof Error) {
									jQuery.sap.log.error(e.message, "Filter Dialog not defined", that.getView().getControllerName());
								}
							}
						}
					}, null, oSapSplUtils.fnSyncStyleClass( "messageBox" )
			);
		} else {
			try {
				if (this.oSapSplIncidentsDialogForFilters) {
					this.oSapSplIncidentsDialogForFilters.open();
				} else {
					throw new Error();
				}
			} catch (e) {
				if (e instanceof Error) {
					jQuery.sap.log.error(e.message, "Filter Dialog not defined", this.getView().getControllerName());
				}
			}
		}


	},

	/***
	 * @description method to handle the press event on "sort" button in the master page footer.
	 * this will open the popOver prepared earlier, to the top of this button.
	 * @returns void.
	 * @param e
	 * @since 1.0
	 * @throws new Error();
	 */
	openSapSplIncidentSortPopover: function (e) {
		try {
			if (this.oSapSplIncidentsPopOverForSorters) {
				this.oSapSplIncidentsPopOverForSorters.openBy(e.getSource());
			} else {
				throw new Error();
			}
		} catch (error) {
			if (error instanceof Error) {
				jQuery.sap.log.error(error.message, "Sort Popover not defined", this.getView().getControllerName());
			}
		}
	},

	/***
	 * @description Method to set the first list item as selected, and also fire the event to bring changes in the corresponding detail page.
	 * @returns void.
	 */
	selectFirstItem: function (iCount) {

		var oSelectedListItemData = null,
		incidentsList = null,
		aIncidentsListItems = [],
		selectedId;
		try {
			incidentsList = this.getView().byId("SapSplIncidentsList");
			aIncidentsListItems = incidentsList.getItems();
			selectedId = aIncidentsListItems[iCount].getId();

			if (aIncidentsListItems.length > 0) {
				if (iCount === 1 && aIncidentsListItems[0] instanceof sap.m.StandardListItem) {
					aIncidentsListItems[0].setSelected(true);
					oSelectedListItemData = aIncidentsListItems[0].getBindingContext().getProperty();
				} else {
					aIncidentsListItems[iCount].setSelected(true);
					oSelectedListItemData = aIncidentsListItems[iCount].getBindingContext().getProperty();
					var prevHeader = 0;
					for (var iListItemCount = 1; iListItemCount < aIncidentsListItems.length; iListItemCount++) {
						if (aIncidentsListItems[iListItemCount] instanceof sap.m.GroupHeaderListItem) {
							aIncidentsListItems[prevHeader].setCount(iListItemCount - 1 - prevHeader);
							prevHeader = iListItemCount;
						}
					}

					/* CSNFIX :  1482000407 */
					if (aIncidentsListItems[prevHeader].constructor === sap.m.GroupHeaderListItem) {
						aIncidentsListItems[prevHeader].setCount(aIncidentsListItems.length - 1 - prevHeader);
					}

					window.setTimeout(function () {
						aIncidentsListItems[0].rerender();
					}, 100);
					window.setTimeout(function () {
						aIncidentsListItems[prevHeader].rerender();
					}, 100);

					if (iCount === 0 || iCount === 1) {
						document.getElementById(this.getView().byId("sapSplIncidentSearch").getId()).scrollIntoView(true);
					} else {
						/*HOTFIX An issue where the getElementById on the selected ID is unable to get the 
						 * DOM element immediately. So asyncing it so that the DOM is prepared and then
						 * scroll into it*/
						window.setTimeout(function () {
							document.getElementById(selectedId).scrollIntoView(true);
						}, 10);
					}
				}
			} else {
				throw new Error();
			}

			oSelectedListItemData["rerender"] = true;
			this.handleMyIncidentsSelect(oSelectedListItemData);
		} catch (e) {
			if (e instanceof Error) {
				jQuery.sap.log.error(e.message, "Cannot select first item of MyIncidentsList", this.getView().getControllerName());
			}
		}
	},

	/**
	 * @description Search of My Users on Press of Search icon or enter
	 * @param {object} event
	 */
	fnToHandleSearchOfIncidents: function (event) {
		var searchString = event.getParameters().query;
		var oSapSplIncidentsList;
		var payload, that = this,
		modelData;

		oSapSplIncidentsList = this.getView().byId("SapSplIncidentsList");

		if (searchString.length > 2) {

			payload = this.prepareSearchPayload(searchString);
			this.callSearchService(payload);

		} else if (oSapSplIncidentsList.getBinding("items") === undefined || oSapSplIncidentsList.getBinding("items").aFilters.length > 1 || event.getParameters().refreshButtonPressed === true) {

			sap.ui.getCore().getModel("SapSplIncidentsDetailModel").setData(this.getEmptyAddIncidentsData());

			oSapSplIncidentsList.unbindAggregation("items");
			oSapSplIncidentsList.bindItems({
				path: "/IncidentDetails",
				template: that.getView().byId("oSapSplIncidentListItem")
			});

			oSapSplIncidentsList.getBinding("items").filter(this.appliedFilters);

			oSapSplIncidentsList.getBinding("items").sort(this.appliedSorters);

			modelData = sap.ui.getCore().getModel("SapSplIncidentsDetailModel").getData();
			modelData["noData"] = true;
			modelData["isClicked"] = false;
			sap.ui.getCore().getModel("SapSplIncidentsDetailModel").setData(modelData);
		}
	},

	/**
	 * @description Method to prepare payload for search.
	 * @param
	 * {string} sSearchTerm term searched for.
	 * @returns {object} oPayload the payload to be used for search.
	 * @since 1.0
	 */
	prepareSearchPayload: function (sSearchTerm) {
		var payload = {};
		payload.UserID = oSapSplUtils.getLoggedOnUserDetails().usreID;
		payload.ObjectType = "Message";
		payload.SearchTerm = sSearchTerm;
		payload.FuzzinessThershold = SapSplEnums.fuzzyThreshold;
		payload.MaximumNumberOfRecords = SapSplEnums.numberOfRecords;
		payload.ProvideDetails = false;
		payload.SearchInNetwork = true;
		payload.AdditionalCriteria = {};
		payload.AdditionalCriteria.MessageObjectType = "I";

		return payload;
	},

	/**
	 * @description Method to call the service for search.
	 * @param
	 * {object} payload payload used for POST ajax call.
	 * @returns void.
	 * @since 1.0
	 */
	callSearchService: function (payload) {
		var oSapSplSearchFilters, oSapSplIncidentsFilters = [],
		oSapSplIncidentsList;
		var that = this,
		index,
		modelData;

		oSapSplAjaxFactory.fireAjaxCall({
			url: oSapSplUtils.getFQServiceUrl("/sap/spl/xs/app/services/Search.xsjs"),
			method: "POST",
			async: false,
			data: JSON.stringify(payload),
			success: function (data, success, messageObject) {
				oSapSplBusyDialog.getBusyDialogInstance().close();

				if (messageObject["status"] === 200) {

					oSapSplIncidentsList = that.getView().byId("SapSplIncidentsList");
					sap.ui.getCore().getModel("SapSplIncidentsDetailModel").setData(that.getEmptyAddIncidentsData());

					oSapSplIncidentsList.unbindAggregation("items");

					if (data.length > 0) {

						oSapSplSearchFilters = oSapSplUtils.getSearchItemFilters(data);

						if (oSapSplSearchFilters.aFilters.length > 0) {
							oSapSplIncidentsFilters.push(oSapSplSearchFilters);
						}

						for (index = 0; index < that.appliedFilters.length; index++) {
							oSapSplIncidentsFilters.push(that.appliedFilters[index]);
						}


						oSapSplIncidentsList.bindItems({
							path: "/IncidentDetails",
							template: that.getView().byId("oSapSplIncidentListItem")
						});

						oSapSplIncidentsList.getBinding("items").filter(oSapSplIncidentsFilters);
						oSapSplIncidentsList.getBinding("items").sort(that.appliedSorters);

						modelData = sap.ui.getCore().getModel("SapSplIncidentsDetailModel").getData();
						/* Incident Fix : 1570148765 */
						modelData["noData"] = true;
						modelData["isClicked"] = false;
						modelData["isEdit"] = false;
						modelData["isDisplay"] = true;
						sap.ui.getCore().getModel("SapSplIncidentsDetailModel").setData(modelData);

					} else {
						modelData = sap.ui.getCore().getModel("SapSplIncidentsDetailModel").getData();
						modelData["noData"] = true;
						modelData["isClicked"] = false;
						modelData["isEditable"] = 0;
						sap.ui.getCore().getModel("SapSplIncidentsDetailModel").setData(modelData);

						that.byId("IncidentsMasterPage").setTitle(oSapSplUtils.getBundle().getText("INCIDENTS_MASTER_PAGE_TITLE", "0"));
					}

				} else if (data["Error"] && data["Error"].length > 0) {

					var errorMessage = oSapSplUtils.getErrorMessagesfromErrorPayload(data)["ufErrorObject"];
					sap.ca.ui.message.showMessageBox({
						type: sap.ca.ui.message.Type.ERROR,
						message: oSapSplUtils.getErrorMessagesfromErrorPayload(data)["errorWarningString"],
						details: errorMessage
					});
				}
			},
			error: function (error) {
				oSapSplBusyDialog.getBusyDialogInstance().close();

				modelData = sap.ui.getCore().getModel("SapSplIncidentsDetailModel").getData();
				modelData["noData"] = true;
				modelData["isClicked"] = false;
				modelData["isEditable"] = 0;
				sap.ui.getCore().getModel("SapSplIncidentsDetailModel").setData(modelData);

				if (error && error["status"] === 500) {
					sap.ca.ui.message.showMessageBox({
						type: sap.ca.ui.message.Type.ERROR,
						message: error["status"] + "\t" + error.statusText,
						details: error.responseText
					});
				} else {
					sap.ca.ui.message.showMessageBox({
						type: sap.ca.ui.message.Type.ERROR,
						message: oSapSplUtils.getErrorMessagesfromErrorPayload(JSON.parse(error.responseText))["errorWarningString"],
						details: oSapSplUtils.getErrorMessagesfromErrorPayload(JSON.parse(error.responseText))["ufErrorObject"]
					});
				}
			},
			complete: function () {

			}
		});
	},

	/***
	 * @description handler for the back navigation event, in case of App to App navigation.
	 * Method to go back 1 page in the baseApp.
	 * @param oEvent event object
	 * @since 1.0
	 * @returns void.
	 */
	fnHandleBackNavigation: function () {

		var oBaseApp = null;
		oBaseApp = oSplBaseApplication.getAppInstance();

		// back navigation when the App is not launched through DAL
		if (oBaseApp.getPreviousPage()) {

			if (oBaseApp.getPreviousPage().sId === "splView.tileContainer.MasterTileContainer") {
				sap.ui.getCore().byId("sapSplBaseUnifiedShell").removeAllHeadItems();
			}
			oBaseApp.back();

		} else {

			// back navigation when the App is launched through DAL and navToHome = true
			oBaseApp.to("splView.tileContainer.MasterTileContainer");
			sap.ui.getCore().byId("sapSplBaseUnifiedShell").removeAllHeadItems();
		}
	},

	/**
	 * @description listens to event handling channel which is previously subscribed. This is the default call back when any navigation happens to this view.
	 * It is called even before the onBeforeRendering life cycle method of the view.
	 * @param evt event object of the navigation event.
	 * @returns void.
	 * @since 1.0
	 */
	onBeforeShow: function () {
		var sNavToHome = "",
		sGoto = "",
		oMasterPage = null;
		sNavToHome = jQuery.sap.getUriParameters().get("navToHome");
		sGoto = jQuery.sap.getUriParameters().get("goto");
		oMasterPage = this.byId("IncidentsMasterPage");

		// if DAL : check for navToHome
		if (sGoto) {
			if (sNavToHome && sNavToHome === "false") {
				oMasterPage.setShowNavButton(false);
			} else if (sNavToHome && sNavToHome === "true") {
				oMasterPage.setShowNavButton(true);
			} else {
				// if navToHome is anything other than true or false.
				oMasterPage.setShowNavButton(false);
			}
		} else {

			// not DAL
			oMasterPage.setShowNavButton(true);
		}
	}
});