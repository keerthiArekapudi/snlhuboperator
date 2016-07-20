/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.controller ( "splController.vehicles.MyVehiclesMaster", {
	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 */
	onInit : function ( ) {

		var oSapSplVehiclesListModel = null, oSapSplMyVehiclesListItemsBinding = null, oSapSplDriverListModel = null;
		var that = this;

		try {

			/* SAPUI5 ODataModel - to be set to MyVehiclesMaster view */
			oSapSplVehiclesListModel = sap.ui.getCore ( ).getModel ( "myVehiclesListODataModel" );

			oSapSplVehiclesListModel.setCountSupported ( false );

			/*
			 * event registered to ensure that the first item is always
			 * selected.
			 */
			oSapSplVehiclesListModel.attachRequestCompleted ( jQuery.proxy ( this.ODataModelRequestCompleted, this ) );

			/*
			 * event registered to ensure that the first item is always
			 * selected.
			 */
			oSapSplVehiclesListModel.attachRequestFailed ( function ( ) {
				oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
			} );

			oSapSplDriverListModel = sap.ui.getCore ( ).getModel ( "myDriversListODataModel" );

			oSapSplDriverListModel.setCountSupported ( false );

			/*
			 * event registered to ensure that the first item is always
			 * selected.
			 */
			oSapSplDriverListModel.attachRequestCompleted ( jQuery.proxy ( this.ODataModelRequestCompleted, this ) );

			/*
			 * event registered to ensure that the first item is always
			 * selected.
			 */
			oSapSplDriverListModel.attachRequestFailed ( function ( ) {
				oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
				/* CSNFIX: 0120061532 1314082 2014 */
				if ( sap.ui.getCore ( ).getModel ( "SapSplMyVehicleDetailModel" ) ) {
					oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
					var oEmptyObject = {};
					oEmptyObject["isClicked"] = false;
					oEmptyObject["noData"] = true;
					oEmptyObject["showFooterButtons"] = false;
					oEmptyObject["isEdit"] = false;
					oEmptyObject["isEditable"] = false;
					sap.ui.getCore ( ).getModel ( "SapSplMyVehicleDetailModel" ).setData ( oEmptyObject );
				}
			} );

			/* Making the model as a named model. */
			sap.ui.getCore ( ).setModel ( oSapSplVehiclesListModel, "myVehiclesListODataModel" );

			sap.ui.getCore ( ).setModel ( oSapSplVehiclesListModel, "myDriversListODataModel" );

			/* Setting the odata model on the list control */
			this.getView ( ).byId ( "SapSplVehiclesList" ).setModel ( sap.ui.getCore ( ).getModel ( "myVehiclesListODataModel" ) );

			this.oSapSplMyVehiclesFilterIsValidTruck = new sap.ui.model.Filter ( "isDeleted", sap.ui.model.FilterOperator.EQ, "0" );
			this.oSapSplMyVehiclesFilterIsNotSharedTruck = new sap.ui.model.Filter ( "isSharedWithMyOrg", sap.ui.model.FilterOperator.EQ, 0 );

			/*
			 * Applying the filter on the myVehicles list, by accessing the
			 * "items" binding of the list.
			 */
			oSapSplMyVehiclesListItemsBinding = this.getView ( ).byId ( "SapSplVehiclesList" ).getBinding ( "items" );
			oSapSplMyVehiclesListItemsBinding.filter ( [this.oSapSplMyVehiclesFilterIsValidTruck, this.oSapSplMyVehiclesFilterIsNotSharedTruck] );

			this.oSapSplDeviceSorterDevice = new sap.ui.model.Sorter ( "DeviceCategory", true, this.handleGroupingOfTrucks );
			this.oSapSplRegistrationNumberSorter = new sap.ui.model.Sorter ( "RegistrationNumber" );
			oSapSplMyVehiclesListItemsBinding.sort ( [this.oSapSplDeviceSorterDevice, this.oSapSplRegistrationNumberSorter] );

			/* 0120031469 670747 2014 - Changed the text from None to All */

			this.statusData = [{
				name : oSapSplUtils.getBundle ( ).getText ( "FILTER_LABEL_ALL" ),
				selected : true,
				id : "all"
			}, {
				name : oSapSplUtils.getBundle ( ).getText ( "FILTER_LABEL_ACTIVE" ),
				selected : false,
				id : "active"
			}, {
				name : oSapSplUtils.getBundle ( ).getText ( "FILTER_LABEL_INACTIVE" ),
				selected : false,
				id : "inactive"
			}, {
				name : oSapSplUtils.getBundle ( ).getText ( "FILTER_LABEL_DEREGISTERED" ),
				selected : false,
				id : "dereg"
			}];

			/* Method to prepare dialog for filters */
			this.prepareDialogForFilters ( );

			/* Method to prepare popover for sorters */
			this.preparePopOverForSorters ( );

			/* Instantiate Filters and Sorters */
			this.createFiltersAndSorters ( );

			/* Localization */
			this.fnDefineControlLabelsFromLocalizationBundle ( );
			/* CSNFIX 0120061532 0001313455 2014 */
			this.byId ( "FilterStatusText" ).setText ( oSapSplUtils.getBundle ( ).getText ( "FILTER_LABEL_ALL" ) );

			this.appliedFilters = [];
			this.appliedSorters = [];

			this.appliedFilters = this.byId ( "SapSplVehiclesList" ).getBinding ( "items" ).aFilters;
			this.appliedSorters = this.byId ( "SapSplVehiclesList" ).getBinding ( "items" ).aSorters;
			this.getView ( ).addEventDelegate ( {
				onAfterShow : function ( oEvent ) {
					window.setTimeout ( function ( ) {
						that.getView ( ).byId ( "sapSplVehicleSearch" ).focus ( );
					}, 100 );
				}
			} );
		} catch (e) {
			if ( e instanceof Error ) {
				jQuery.sap.log.error ( e.message, "MyVehiclesList not defined", this.getView ( ).getControllerName ( ) );
			}
		}
	},

	/**
	 * @description Method to handle the click of add truck button.
	 * @param {object} evt event object.
	 * @returns void.
	 * @since 1.0
	 */
	fireSelectionOfAddTruckMode : function ( evt ) {
		var that = this;
		var eventObject = jQuery.extend ( true, {}, evt );
		if ( oSapSplUtils.getIsDirty ( ) ) {
			sap.m.MessageBox.show ( oSapSplUtils.getBundle ( ).getText ( "DATA_LOSS_WARNING_TEXT" ), sap.m.MessageBox.Icon.WARNING, oSapSplUtils.getBundle ( ).getText ( "WARNING" ), [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
					function ( selection ) {
						if ( selection === "YES" ) {
							oSapSplUtils.setIsDirty ( false );
							oSapSplUtils.oSplitAppBaseVehicle._aMasterPages[0].getContent ( )[0].getFooter ( ).getContentRight ( )[2].firePress ( );
							that.navigateToAddNewTruck ( eventObject );
						}
					}, null, oSapSplUtils.fnSyncStyleClass ( "messageBox" ) );
		} else {
			this.navigateToAddNewTruck ( evt );
		}

	},

	/**
	 * @description Method to trigger a navigation in detail page, to the add new truck page.
	 * @param {object} oEvent event object.
	 * @returns void.
	 * @since 1.0
	 */
	navigateToAddNewTruck : function ( ) {
		oSapSplUtils.setIsDirty ( false );
		oSapSplUtils.getCurrentMasterPageVehicle ( ).byId ( "SapSplVehiclesList" ).removeSelections ( );
		if ( oSapSplUtils.getCurrentDetailPageVehicle ( ).sId === "MyVehiclesDetailAddVehicle" ) {
			var oData = sap.ui.getCore ( ).getModel ( "myVehiclesAddVehicleModel" ).getData ( );
			oData["data"] = this.getEmptyAddVehicleData ( "create" );
			sap.ui.getCore ( ).getModel ( "myVehiclesAddVehicleModel" ).setData ( oData );
			oSapSplUtils.getCurrentDetailPageVehicle ( ).byId ( "NewContactRegistrationDetailPage" ).setTitle ( oSapSplUtils.getBundle ( ).getText ( "ADD_VEHICLE_TITLE" ) );
			oSapSplUtils.getCurrentDetailPageVehicle ( ).byId ( "SapSplNewVehiclesVehicleRegistrationNumber" ).setEditable ( true );
			oSapSplUtils.getCurrentDetailPageVehicle ( ).byId ( "sapSplNewVehicleMobileDeviceID" ).setValue ( "" );
			oSapSplUtils.getCurrentDetailPageVehicle ( ).getController ( ).mode = "Create";
			oSapSplUtils.getCurrentDetailPageVehicle ( ).getController ( ).updateEnumsWithNone ( "remove" );
			oSapSplUtils.getCurrentDetailPageVehicle ( ).byId ( "sapSplNewVehiclesVehicleType" ).setSelectedItem ( null );
			oSapSplUtils.getCurrentDetailPageVehicle ( ).byId ( "sapSplNewVehiclesDeviceType" ).setSelectedItem ( null );
			oSapSplUtils.getCurrentDetailPageVehicle ( ).byId ( "sapSplNewVehiclesDeviceType" ).fireChange ( {
				selectedItem : oSapSplUtils.getCurrentDetailPageVehicle ( ).byId ( "sapSplNewVehiclesDeviceType" ).getItems ( )[0]
			} );
			oSapSplUtils.setIsDirty ( false );

		} else {
			/*
			 * instance of the SAPUI5 event bus - used to sunscribe or publish
			 * events accross the application
			 */
			var bus = sap.ui.getCore ( ).getEventBus ( );
			bus.publish ( "navInDetailVehicle", "to", {
				from : this.byId ( "SapSplAddNewTruck" ),
				data : {
					/* The object bound to the selected listItem. */
					context : this.getEmptyAddVehicleData ( "create" )
				}
			} );
		}

	},

	/**
	 * @description Method to prepare the empty vehicle object, to be bound in the add new truck screen.
	 * @param {boolean} bMode event object.
	 * @returns {object} oEmptyData object containing the truck fields.
	 * @since 1.0
	 */
	getEmptyAddVehicleData : function ( sMode ) {
		var oEmptyData = {};
		oEmptyData["RegistrationNumber"] = "";
		oEmptyData["Type"] = "";
		oEmptyData["VehicleDriverFirstName"] = "";
		oEmptyData["VehicleDriverLastName"] = "";
		oEmptyData["PublicName"] = "";
		oEmptyData["Status"] = "";
		oEmptyData["DeviceType"] = "";
		oEmptyData["DevicePublicName"] = "Select Device";
		oEmptyData["PublicName"] = "";
		oEmptyData["DeviceStatus"] = null;
		oEmptyData["VehicleChangeMode"] = "C";
		oEmptyData["SelectedKey"] = "info";

		if ( sMode && sMode === "create" ) {
			oEmptyData["isClicked"] = true;
			oEmptyData["noData"] = false;
			oEmptyData["showFooterButtons"] = true;
		} else {
			oEmptyData["isClicked"] = false;
			oEmptyData["noData"] = true;
			oEmptyData["showFooterButtons"] = false;
		}
		return oEmptyData;
	},

	/**
	 * @description Method to handle localization of all the hard code texts in the view.
	 * @param void.
	 * @returns void.
	 * @since 1.0
	 */
	fnDefineControlLabelsFromLocalizationBundle : function ( ) {
		this.byId ( "SapSplMyVehiclesMasterPage" ).setTitle ( oSapSplUtils.getBundle ( ).getText ( "MY_VEHICLES_MASTER_TITLE", "0" ) );
		/* CSNFIX : 0120031469 620551 2014 */
		this.byId ( "SapSplVehiclesList" ).setNoDataText ( oSapSplUtils.getBundle ( ).getText ( "NO_TRUCKS_TEXT" ) );
		/* CSNFIX : 0120031469 685224 2014 */
		this.byId ( "SapSplAddNewTruck" ).setTooltip ( oSapSplUtils.getBundle ( ).getText ( "MY_VEHICLES_ADD_TRUCK" ) );
		this.byId ( "sapSplFilterVehiclesButton" ).setTooltip ( oSapSplUtils.getBundle ( ).getText ( "FILTER_BUTTON_TOOLTIP" ) );
		this.byId ( "sapSplGroupVehiclesButton" ).setTooltip ( oSapSplUtils.getBundle ( ).getText ( "GROUPBY_BUTTON_TOOLTIP" ) );
	},

	/***
	 * @description method to prepare a dialog control to show the available filters for trucks.
	 * @returns void.
	 * since 1.0
	 * @param e event object
	 */
	prepareDialogForFilters : function ( ) {

		var that = this;
		/* Fix for incident : 1580118382 */
		this.oSapSplVehicleDialogForFilters = new sap.m.Dialog ( {
			title : oSapSplUtils.getBundle ( ).getText ( "FILTER_BY" ),
			content : new sap.m.List ( {
				mode : "SingleSelectLeft",
				items : {
					path : "/items",
					template : new sap.m.StandardListItem ( {
						title : "{name}",
						selected : "{selected}"
					} )
				}
			} ),
			leftButton : new sap.m.Button ( {
				text : oSapSplUtils.getBundle ( ).getText ( "OK_BUTTON_TEXT" ),
				press : function ( ) {
					that.oSapSplVehicleDialogForFilters.close ( );
				}
			} ),
			rightButton : new sap.m.Button ( {
				text : oSapSplUtils.getBundle ( ).getText ( "MY_COLLEAGUES_CANCEL_BUTTON" ),
				press : function ( ) {
					that.oSapSplVehicleDialogForFilters.close ( );
					that.getView ( ).byId ( "sapSplVehicleSearch" ).focus ( );

				}
			} )
		} ).addStyleClass ( "SapSplFilterDialog" ).attachAfterClose ( function ( evt ) {
			/* CSNFIX : 0120031469 684903 2014 */
			if ( evt.getParameters ( "origin" ).origin.getText ( ) !== oSapSplUtils.getBundle ( ).getText ( "MY_COLLEAGUES_CANCEL_BUTTON" ) ) {
				var sId = "";
				sId = evt.getSource ( ).getContent ( )[0].getSelectedItems ( )[0].getBindingContext ( ).getProperty ( "id" );
				jQuery.proxy ( that.handleSelectOfFilter ( sId ), that );
			}
		} ).attachAfterOpen ( function ( oEvent ) {
			oSapSplUtils.fnSyncStyleClass ( oEvent.getSource ( ) );
		} );

		this.oSapSplVehicleDialogForFilters.setModel ( new sap.ui.model.json.JSONModel ( {
			items : this.statusData
		} ) );

	},

	/***
	 * @description method to prepare a popover control to show the available sorters for devices.
	 * @returns void.
	 * since 1.0
	 * @param e event object
	 */
	preparePopOverForSorters : function ( ) {
		var oSapSplDevicePopOverForSortersLayout = null;
		this.oSapSplDevicePopOverForSorters = new sap.m.Popover ( {
			placement : sap.m.PlacementType.Top,
			showHeader : false
		} );
		oSapSplDevicePopOverForSortersLayout = new sap.ui.commons.layout.VerticalLayout ( ).addStyleClass ( "sapsplTruckMasterPopover" );

		oSapSplDevicePopOverForSortersLayout.addContent ( new sap.m.RadioButton ( {
			id : "all"
		} ).setText ( oSapSplUtils.getBundle ( ).getText ( "FILTER_LABEL_NONE" ) ).attachSelect ( jQuery.proxy ( this.handleSelectOfSorterRadioButton, this ) ) );
		oSapSplDevicePopOverForSortersLayout.addContent ( new sap.m.RadioButton ( {
			id : "device",
			selected : true
		} ).setText ( oSapSplUtils.getBundle ( ).getText ( "SORT_LABEL_DEVICE_TYPE" ) ).attachSelect ( jQuery.proxy ( this.handleSelectOfSorterRadioButton, this ) ) );

		this.oSapSplDevicePopOverForSorters.addContent ( oSapSplDevicePopOverForSortersLayout );
	},

	/**
	 * @description Handler for the select event on the list of my vehicles.
	 * @param {object} evt select event object.
	 * @returns void.
	 * @since 1.0
	 */
	onSelectOfVehicle : function ( evt ) {
		this.handleMyVehicleSelect ( evt.getParameter ( "listItem" ).getBindingContext ( ).getProperty ( ) );
	},

	/**
	 * @description select event handler of the "myVehicles" list. Results in navigation of the detail page - to Vehicle detail page.
	 * @param evt event object of the select event.
	 * @returns void.
	 * @since 1.0
	 */
	handleMyVehicleSelect : function ( oSelectedListItemData ) {
		var that = this, currentVehicle, masterList, sIndex;
		if ( oSapSplUtils.getIsDirty ( ) ) {
			sap.m.MessageBox.show ( oSapSplUtils.getBundle ( ).getText ( "DATA_LOSS_WARNING_TEXT" ), sap.m.MessageBox.Icon.WARNING, oSapSplUtils.getBundle ( ).getText ( "WARNING" ), [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
					function ( selection ) {
						if ( selection === "YES" ) {
							that.updateVehicleDetailPage ( oSelectedListItemData );
							oSapSplUtils.setIsDirty ( false );
						} else {

							currentVehicle = sap.ui.getCore ( ).getModel ( "myVehiclesAddVehicleModel" ).getData ( ).data;
							if ( !currentVehicle ) {
								currentVehicle = sap.ui.getCore ( ).getModel ( "SapSplMyVehicleDetailModel" ).getData ( );
							}
							masterList = oSapSplUtils.getCurrentMasterPageVehicle ( ).byId ( "SapSplVehiclesList" );
							masterList.removeSelections ( );

							if ( currentVehicle.UUID ) {
								for ( sIndex = 0 ; sIndex < masterList.getItems ( ).length ; sIndex++ ) {
									if ( masterList.getItems ( )[sIndex].sId.indexOf ( "SapSplVehiclesListItem" ) !== -1 ) {
										if ( masterList.getItems ( )[sIndex].getBindingContext ( ).getProperty ( ).UUID === currentVehicle.UUID ) {
											masterList.setSelectedItem ( masterList.getItems ( )[sIndex] );
											break;
										}
									}
								}
							} else {
								masterList.removeSelections ( );
							}

						}
					}, null, oSapSplUtils.fnSyncStyleClass ( "messageBox" ) );
		} else {
			that.updateVehicleDetailPage ( oSelectedListItemData );
		}

	},

	/**
	 * @description Method to update the truck detail screen, on a select event on the master list.
	 * @param {object} oSelectedListItemData object bound to the selected master list item.
	 * @returns void.
	 * @since 1.0
	 */
	updateVehicleDetailPage : function ( oSelectedListItemData ) {
		try {
			/*
			 * If the current Detail page of the SplitAppBase control, is the
			 * vehicles details page, then just change the
			 * myVehiclesDetailModel's data, else navigate to the vehicle
			 * details page and change the model data in onBeforeShow of the
			 * respective view's controller.
			 */
			oSelectedListItemData["SelectedKey"] = "info";
			oSelectedListItemData["isClicked"] = true;
			oSelectedListItemData["noData"] = false;
			oSelectedListItemData["showFooterButtons"] = true;
			oSelectedListItemData["isEdit"] = false;
			oSelectedListItemData["enableInfo"] = true;
			oSelectedListItemData["oSharedPermissionInfo"] = {};

			if ( oSapSplUtils.getCurrentDetailPageVehicle ( ) ) {
				if ( oSapSplUtils.getCurrentDetailPageVehicle ( ).sId === "MyVehiclesDetail" ) {
					var oSharedListData = this.getBupaPermissionsData ( oSelectedListItemData["UUID"] );
					oSelectedListItemData["BupaPermissions"] = oSharedListData.data;
					oSelectedListItemData["isClicked"] = true;
					oSelectedListItemData["noData"] = false;
					oSelectedListItemData["showFooterButtons"] = true;
					oSelectedListItemData["isEdit"] = false;
					oSelectedListItemData["enableInfo"] = true;
					if ( oSharedListData.count === 0 ) {
						oSelectedListItemData["isSharedByMyOrg"] = 0;
					} else {
						oSelectedListItemData["isSharedByMyOrg"] = 1;
					}
					/* The object bound to the selected listItem. */
					sap.ui.getCore ( ).getModel ( "SapSplMyVehicleDetailModel" ).setData ( oSelectedListItemData );

					var aDetailPageFooterButtons = oSapSplUtils.getCurrentDetailPageVehicle ( ).getContent ( )[0].getFooter ( ).getContentRight ( );
					var i;

					if ( aDetailPageFooterButtons.length === 5 ) {
						aDetailPageFooterButtons[0].setVisible ( true );
						aDetailPageFooterButtons[1].setVisible ( true );
						aDetailPageFooterButtons[2].setVisible ( true );
						aDetailPageFooterButtons[3].setVisible ( false );
						aDetailPageFooterButtons[4].setVisible ( false );
					}

					if ( aDetailPageFooterButtons.length > 2 ) {
						if ( oSelectedListItemData["Status"] === "A" ) {
							aDetailPageFooterButtons[1].setText ( oSapSplUtils.getBundle ( ).getText ( "MY_VEHICLES_DEACTIVATE" ) );
						} else {
							aDetailPageFooterButtons[1].setText ( oSapSplUtils.getBundle ( ).getText ( "MY_VEHICLES_ACTIVATE" ) );
						}
					}
					if ( oSelectedListItemData["isDeleted"] === "1" ) {
						for ( i = 0 ; i < aDetailPageFooterButtons.length ; i++ ) {
							aDetailPageFooterButtons[i].setEnabled ( false );
						}
					} else {
						for ( i = 0 ; i < aDetailPageFooterButtons.length ; i++ ) {
							aDetailPageFooterButtons[i].setEnabled ( true );
						}
					}
					/* Incident : 1570173428 */
					if ( sap.ui.getCore ( ).byId ( "MyVehiclesDetail--sapSplSharePermissionsLayout" ) ) {
						sap.ui.getCore ( ).byId ( "MyVehiclesDetail--sapSplSharePermissionsLayout" ).rerender ( );
					}
				} else {
					/*
					 * instance of the SAPUI5 event bus - used to subscribe or
					 * publish events across the application
					 */
					var bus = sap.ui.getCore ( ).getEventBus ( );
					bus.publish ( "navInDetailVehicle", "to", {
						from : this.getView ( ),
						data : {
							/* The object bound to the selected listItem. */
							context : oSelectedListItemData
						}
					} );
				}
			} else {
				throw new Error ( );
			}
		} catch (e) {
			if ( e instanceof Error ) {
				jQuery.sap.log.error ( e.message, "There is no current Detail Page in MyVehicles SplitApp.", this.getView ( ).getControllerName ( ) );
			}
		}
	},

	/***
	 * @description method to handle the request completed event of the ODataModel.
	 * @param void.
	 * @returns void.
	 * @since 1.0
	 */
	ODataModelRequestCompleted : function ( ) {

		if ( arguments[0].getParameters ( ).success ) {
			oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
			this.onAfterListRendering ( );

		} else {
			/* CSNFIX: 0120061532 1314082 2014 */
			if ( sap.ui.getCore ( ).getModel ( "SapSplMyVehicleDetailModel" ) ) {
				oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
				var oEmptyObject = {};
				oEmptyObject["isClicked"] = false;
				oEmptyObject["noData"] = true;
				oEmptyObject["showFooterButtons"] = false;
				oEmptyObject["isEdit"] = false;
				oEmptyObject["isEditable"] = false;
				sap.ui.getCore ( ).getModel ( "SapSplMyVehicleDetailModel" ).setData ( oEmptyObject );
			}
		}
	},

	onAfterRendering : function ( ) {},

	/***
	 * @description method to handle the onAfterRendering event of the oSapSplVehiclesList control.
	 * This is useful to select the first element of the list after either sorting or filtering.
	 * @returns void.
	 * since 1.0
	 * @param e event object
	 * @throws new Error();
	 */
	onAfterListRendering : function ( ) {
		oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
		var aSapSplVehiclesListItems = [];
		var oListCustomData = (this.byId ( "SapSplVehiclesList" ).getCustomData ( ).length > 0) ? this.byId ( "SapSplVehiclesList" ).getCustomData ( )[this.byId ( "SapSplVehiclesList" ).getCustomData ( ).length - 1].getKey ( ) : null, _iCount = 1;
		try {
			if ( this.byId ( "SapSplVehiclesList" ) ) {
				aSapSplVehiclesListItems = this.byId ( "SapSplVehiclesList" ).getItems ( );

				if ( aSapSplVehiclesListItems.length ) {

					this.byId ( "SapSplMyVehiclesMasterPage" ).setTitle ( oSapSplUtils.getBundle ( ).getText ( "MY_VEHICLES_MASTER_TITLE", [splReusable.libs.Utils.prototype.getListCount ( this.byId ( "SapSplVehiclesList" ) )] ) );

					if ( oListCustomData !== null ) {
						for ( var iCount = 0 ; iCount < aSapSplVehiclesListItems.length ; iCount++ ) {

							/*
							 * First item is always GroupHeaderListItem, so
							 * ignore and go to the next item
							 */
							if ( aSapSplVehiclesListItems[iCount].constructor !== sap.m.GroupHeaderListItem ) {
								if ( oListCustomData === aSapSplVehiclesListItems[iCount].getBindingContext ( ).getProperty ( "UUID" ) ) {
									// Match found. Select the item and break;
									_iCount = iCount;
									break;
								}
							}
						}
					}
				}

				if ( aSapSplVehiclesListItems.length > 0 ) {
					this.selectFirstItem ( _iCount );
					if ( sap.ui.getCore ( ).getModel ( "SapSplMyVehicleDetailModel" ) ) {
						var modelData = sap.ui.getCore ( ).getModel ( "SapSplMyVehicleDetailModel" ).getData ( );
						modelData["noData"] = false;
						modelData["isClicked"] = true;
						modelData["showFooterButtons"] = true;
						sap.ui.getCore ( ).getModel ( "SapSplMyVehicleDetailModel" ).setData ( modelData );
					}
				} else {
					if ( sap.ui.getCore ( ).getModel ( "SapSplMyVehicleDetailModel" ) ) {
						oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
						var oEmptyObject = {};
						oEmptyObject["isClicked"] = false;
						oEmptyObject["noData"] = true;
						oEmptyObject["showFooterButtons"] = false;
						oEmptyObject["isEdit"] = false;
						oEmptyObject["isEditable"] = false;
						sap.ui.getCore ( ).getModel ( "SapSplMyVehicleDetailModel" ).setData ( oEmptyObject );
					}
					this.byId ( "SapSplMyVehiclesMasterPage" ).setTitle ( oSapSplUtils.getBundle ( ).getText ( "MY_VEHICLES_MASTER_TITLE", "0" ) );
				}
			} else {
				throw new Error ( );
			}

		} catch (e) {
			if ( e instanceof Error ) {
				jQuery.sap.log.error ( e.message, "MyVehiclesList not defined", this.getView ( ).getControllerName ( ) );
			}
		}
		this.getView ( ).byId ( "sapSplVehicleSearch" ).focus ( );

	},

	/**
	 * @description Method to handle grouping of trucks.
	 * @param {object} oContext binding context to guide grouping.
	 * @returns {object} object containing the key and text - which would be used for the group header title.
	 * @since 1.0
	 */
	handleGroupingOfTrucks : function ( oContext ) {
		var sKey = oContext.getProperty ( "DeviceCategory" );
		if ( !sKey ) {
			return {
				key : "No Device",
				text : oSapSplUtils.getBundle ( ).getText ( "GROUP_HEADER_NO_DEVICE" )
			};
		}
		if ( sKey === "M" ) {
			return {
				key : "MOBILEIF",
				text : oSapSplUtils.getBundle ( ).getText ( "GROUP_HEADER_MOBILEIF" )
			};
		} else {
			return {
				key : "On Board Unit",
				text : oSapSplUtils.getBundle ( ).getText ( "GROUP_HEADER_OBU" )
			};
		}
	},
	/***
	 * @description method to instantiate all the required model filters and sorters for the oSapSplVehiclesList.
	 * @returns void.
	 * since 1.0
	 * @throws new Error()
	 * @param void.
	 */
	createFiltersAndSorters : function ( ) {
		this.oSapSplDeviceFilterActive = new sap.ui.model.Filter ( "Status", sap.ui.model.FilterOperator.EQ, "A" );
		this.oSapSplDeviceFilterInActive = new sap.ui.model.Filter ( "Status", sap.ui.model.FilterOperator.EQ, "I" );
		this.oSapSplDeviceFilterDeRegistered = new sap.ui.model.Filter ( "isDeleted", sap.ui.model.FilterOperator.EQ, "1" );
	},

	/***
	 * @description method to handle the select event of one of the filters.
	 * This will trigger the filter action on the oSapSplVehiclesList
	 * @since 1.0
	 * @throws new Error();
	 * @param e
	 * @returns void.
	 */
	handleSelectOfFilter : function ( sId ) {
		var oSapSplVehiclesList = null, oSapSplVehiclesListItemsBinding = null;
		if ( oSapSplUtils.getCurrentDetailPageVehicle ( ).sId === "MyVehiclesDetail" ) {
			sap.ui.getCore ( ).getModel ( "SapSplMyVehicleDetailModel" ).setData ( this.getEmptyAddVehicleData ( true ) );
			oSapSplUtils.getCurrentDetailPageVehicle ( ).byId ( "vehicleDetailEdit" ).setEnabled ( false );
			oSapSplUtils.getCurrentDetailPageVehicle ( ).byId ( "vehicleDetailDeRegister" ).setEnabled ( false );
			oSapSplUtils.getCurrentDetailPageVehicle ( ).byId ( "vehicleDetailActivate_DeActicate" ).setEnabled ( false );
		}

		try {
			if ( this.byId ( "SapSplVehiclesList" ) ) {
				oSapSplVehiclesList = this.byId ( "SapSplVehiclesList" );
				oSapSplVehiclesListItemsBinding = oSapSplVehiclesList.getBinding ( "items" );
				if ( oSapSplVehiclesListItemsBinding ) {
					oSapSplVehiclesListItemsBinding.filter ( [] );
				} else {
					throw new Error ( );
				}
			} else {
				throw new Error ( );
			}

			if ( sId === "active" ) {
				if ( this.oSapSplDeviceFilterActive ) {
					this.byId ( "FilterStatusText" ).setText ( oSapSplUtils.getBundle ( ).getText ( "FILTER_LABEL_ACTIVE" ) );
					oSapSplVehiclesListItemsBinding.filter ( [this.oSapSplMyVehiclesFilterIsValidTruck, this.oSapSplDeviceFilterActive, this.oSapSplMyVehiclesFilterIsNotSharedTruck] );
				} else {
					throw new Error ( );
				}
			} else if ( sId === "inactive" ) {
				if ( this.oSapSplDeviceFilterInActive ) {
					this.byId ( "FilterStatusText" ).setText ( oSapSplUtils.getBundle ( ).getText ( "FILTER_LABEL_INACTIVE" ) );
					oSapSplVehiclesListItemsBinding.filter ( [this.oSapSplMyVehiclesFilterIsValidTruck, this.oSapSplMyVehiclesFilterIsNotSharedTruck, this.oSapSplDeviceFilterInActive] );
				} else {
					throw new Error ( );
				}
			} else if ( sId === "dereg" ) {
				if ( this.oSapSplDeviceFilterDeRegistered ) {
					this.byId ( "FilterStatusText" ).setText ( oSapSplUtils.getBundle ( ).getText ( "FILTER_LABEL_DEREGISTERED" ) );
					oSapSplVehiclesListItemsBinding.filter ( [this.oSapSplDeviceFilterDeRegistered] );
				} else {
					throw new Error ( );
				}
			} else if ( sId === "all" ) {
				this.byId ( "FilterStatusText" ).setText ( oSapSplUtils.getBundle ( ).getText ( "FILTER_LABEL_ALL" ) );
				oSapSplVehiclesListItemsBinding.filter ( [this.oSapSplMyVehiclesFilterIsValidTruck, this.oSapSplMyVehiclesFilterIsNotSharedTruck] );
			} else {
				var sLabel = "GROUP_HEADER_" + sId;
				var deviceTypeFilter = new sap.ui.model.Filter ( "DeviceType", sap.ui.model.FilterOperator.EQ, sId );
				this.byId ( "FilterStatusText" ).setText ( oSapSplUtils.getBundle ( ).getText ( sLabel ) );
				oSapSplVehiclesListItemsBinding.filter ( [this.oSapSplMyVehiclesFilterIsValidTruck, this.oSapSplMyVehiclesFilterIsNotSharedTruck, deviceTypeFilter] );
			}

			this.appliedFilters = oSapSplVehiclesListItemsBinding.aFilters;

		} catch (e) {
			if ( e instanceof Error ) {
				jQuery.sap.log.error ( e.message, "undefined", this.getView ( ).getControllerName ( ) );
			}
		}
	},

	/***
	 * @description method to handle the select event on the radioButton group "sorters".
	 * This will trigger the sort action on the oSapSplVehiclesList
	 * @since 1.0
	 * @throws new Error();
	 * @param e
	 * @returns void.
	 */
	handleSelectOfSorterRadioButton : function ( oEvent ) {

		var e = jQuery.extend ( true, {}, oEvent );
		var that = this;
		if ( oEvent.getParameter ( "selected" ) ) {
			if ( oSapSplUtils.getCurrentDetailPageVehicle ( ).sId === "MyVehiclesDetail" ) {
				sap.ui.getCore ( ).getModel ( "SapSplMyVehicleDetailModel" ).setData ( this.getEmptyAddVehicleData ( true ) );
			}

			if ( oSapSplUtils.getIsDirty ( ) ) {
				sap.m.MessageBox.show ( oSapSplUtils.getBundle ( ).getText ( "DATA_LOSS_WARNING_TEXT" ), sap.m.MessageBox.Icon.WARNING, oSapSplUtils.getBundle ( ).getText ( "WARNING" ), [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
						function ( selection ) {
							if ( selection === "YES" ) {

								oSapSplUtils.setIsDirty ( false );
								that.sortMasterListBasedOnSortTypeSelection ( e );

							}
						}, null, oSapSplUtils.fnSyncStyleClass ( "messageBox" ) );
			} else {
				this.sortMasterListBasedOnSortTypeSelection ( e );
			}
		}

	},

	/**
	 * @description Method to handle sorting in trucks master list.
	 * @param {object} eventObject bound object to the selected sort option.
	 * @returns void.
	 * @since 1.0
	 */
	sortMasterListBasedOnSortTypeSelection : function ( eventObject ) {
		var oSapSplVehiclesList = null, sId = "", oSapSplVehiclesListItemsBinding = null, aAppliedFilters = [];
		try {
			if ( this.oSapSplDevicePopOverForSorters ) {
				this.oSapSplDevicePopOverForSorters.close ( );
			} else {
				throw new Error ( );
			}

			sId = eventObject.getSource ( ).sId;

			if ( this.byId ( "SapSplVehiclesList" ) ) {

				oSapSplVehiclesList = this.byId ( "SapSplVehiclesList" );
				oSapSplVehiclesListItemsBinding = oSapSplVehiclesList.getBinding ( "items" );
				aAppliedFilters = oSapSplVehiclesListItemsBinding.aFilters;

				this.byId ( "SapSplVehiclesList" ).unbindAggregation ( "items" );
				this.byId ( "SapSplVehiclesList" ).bindItems ( {
					path : "/MyTrackableObjects",
					template : this.byId ( "SapSplVehiclesListItem" )
				} );
				oSapSplVehiclesListItemsBinding = this.byId ( "SapSplVehiclesList" ).getBinding ( "items" );

				if ( !oSapSplVehiclesListItemsBinding ) {
					throw new Error ( );
				}
			} else {
				throw new Error ( );
			}

			if ( sId === "device" ) {
				if ( this.oSapSplDeviceSorterDevice ) {
					oSapSplVehiclesListItemsBinding.sort ( [this.oSapSplDeviceSorterDevice, this.oSapSplRegistrationNumberSorter] );
					oSapSplVehiclesListItemsBinding.filter ( aAppliedFilters );
					// this.oSapSplVehicleDialogForFilters.getModel().setData({items:this.deviceData});

				} else {
					throw new Error ( );
				}
			} else {
				oSapSplVehiclesListItemsBinding.filter ( aAppliedFilters );
				oSapSplVehiclesListItemsBinding.sort ( this.oSapSplRegistrationNumberSorter );
				this.oSapSplVehicleDialogForFilters.getModel ( ).setData ( {
					items : this.statusData
				} );

			}

			this.appliedSorters = oSapSplVehiclesListItemsBinding.aSorters;

		} catch (error) {
			if ( error instanceof Error ) {
				jQuery.sap.log.error ( error.message, "undefined", this.getView ( ).getControllerName ( ) );
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
	openSapSplDeviceFilterPopover : function ( ) {
		var that = this;
		var sIndex, currentVehicle, masterList, bus;
		if ( oSapSplUtils.getIsDirty ( ) ) {
			sap.m.MessageBox.show ( oSapSplUtils.getBundle ( ).getText ( "DATA_LOSS_WARNING_TEXT" ), sap.m.MessageBox.Icon.WARNING, oSapSplUtils.getBundle ( ).getText ( "WARNING" ), [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
					function ( selection ) {
						if ( selection === "YES" ) {

							oSapSplUtils.setIsDirty ( false );

							bus = sap.ui.getCore ( ).getEventBus ( );
							bus.publish ( "navInDetailVehicle", "to", {
								from : that.getView ( ),
								data : {
									context : jQuery.extend ( true, {}, sap.ui.getCore ( ).getModel ( "SapSplMyVehicleDetailModel" ).getData ( ) )
								}
							} );

							currentVehicle = sap.ui.getCore ( ).getModel ( "SapSplMyVehicleDetailModel" ).getData ( );
							masterList = oSapSplUtils.getCurrentMasterPageVehicle ( ).byId ( "SapSplVehiclesList" );
							for ( sIndex = 0 ; sIndex < masterList.getItems ( ).length ; sIndex++ ) {
								if ( masterList.getItems ( )[sIndex].sId.indexOf ( "SapSplVehiclesListItem" ) !== -1 ) {
									if ( masterList.getItems ( )[sIndex].getBindingContext ( ).getProperty ( ).UUID === currentVehicle.UUID ) {
										masterList.setSelectedItem ( masterList.getItems ( )[sIndex] );
										break;
									}
								}
							}

							try {
								if ( that.oSapSplVehicleDialogForFilters ) {
									that.oSapSplVehicleDialogForFilters.open ( );
								} else {
									throw new Error ( );
								}
							} catch (e) {
								if ( e instanceof Error ) {
									jQuery.sap.log.error ( e.message, "Filter Dialog not defined", that.getView ( ).getControllerName ( ) );
								}
							}
						}
					}, null, oSapSplUtils.fnSyncStyleClass ( "messageBox" ) );
		} else {
			try {
				if ( this.oSapSplVehicleDialogForFilters ) {
					this.oSapSplVehicleDialogForFilters.open ( );
				} else {
					throw new Error ( );
				}
			} catch (e) {
				if ( e instanceof Error ) {
					jQuery.sap.log.error ( e.message, "Filter Dialog not defined", this.getView ( ).getControllerName ( ) );
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
	openSapSplDeviceSortPopover : function ( e ) {
		try {
			if ( this.oSapSplDevicePopOverForSorters ) {
				this.oSapSplDevicePopOverForSorters.openBy ( e.getSource ( ) );
			} else {
				throw new Error ( );
			}
		} catch (error) {
			if ( error instanceof Error ) {
				jQuery.sap.log.error ( error.message, "Sort Popover not defined", this.getView ( ).getControllerName ( ) );
			}
		}
	},

	/***
	 * @description Method to set the first list item as selected, and also fire the event to bring changes in the corresponding detail page.
	 * @returns void.
	 */
	selectFirstItem : function ( iCount ) {

		var oSelectedListItemData = null, vehicleList = null, aVehicleListItems = [], selectedId;
		try {
			vehicleList = this.getView ( ).byId ( "SapSplVehiclesList" );
			aVehicleListItems = vehicleList.getItems ( );

			if ( aVehicleListItems.length > 0 ) {
				if ( iCount === 1 && aVehicleListItems[0].constructor === sap.m.StandardListItem ) {
					selectedId = aVehicleListItems[0].getId ( );
					aVehicleListItems[0].setSelected ( true );
					oSelectedListItemData = aVehicleListItems[0].getBindingContext ( ).getProperty ( );
				} else {
					selectedId = aVehicleListItems[iCount].getId ( );
					aVehicleListItems[iCount].setSelected ( true );
					oSelectedListItemData = aVehicleListItems[iCount].getBindingContext ( ).getProperty ( );

					var prevHeader = 0;
					for ( var iListItemCount = 1 ; iListItemCount < aVehicleListItems.length ; iListItemCount++ ) {
						if ( aVehicleListItems[iListItemCount].constructor === sap.m.GroupHeaderListItem ) {
							aVehicleListItems[prevHeader].setCount ( iListItemCount - 1 - prevHeader );
							prevHeader = iListItemCount;
						}
					}

					/* CSNFIX : 0120031469 0000805727 2014 */
					if ( aVehicleListItems[prevHeader].constructor === sap.m.GroupHeaderListItem ) {
						aVehicleListItems[prevHeader].setCount ( aVehicleListItems.length - 1 - prevHeader );
					}

					window.setTimeout ( function ( ) {
						aVehicleListItems[0].rerender ( );
					}, 100 );
					window.setTimeout ( function ( ) {
						aVehicleListItems[prevHeader].rerender ( );
					}, 100 );

					if ( iCount === 0 || iCount === 1 ) {
						document.getElementById ( this.getView ( ).byId ( "sapSplVehicleSearch" ).getId ( ) ).scrollIntoView ( true );
					} else {
						/*
						 * HOTFIX An issue where the getElementById on the
						 * selected ID is unable to get the DOM element
						 * immediately. So asyncing it so that the DOM is
						 * prepared and then scroll into it
						 */
						window.setTimeout ( function ( ) {
							if ( document.getElementById ( selectedId ) ) {
								document.getElementById ( selectedId ).scrollIntoView ( true );
							}
						}, 100 );
					}
				}
			} else {
				throw new Error ( );
			}

			oSelectedListItemData["rerender"] = true;
			this.updateVehicleDetailPage ( oSelectedListItemData );
		} catch (e) {
			if ( e instanceof Error ) {
				jQuery.sap.log.error ( e.message, "Cannot select first item of MyVehiclesList", this.getView ( ).getControllerName ( ) );
			}
		}
	},

	fnHandleNavigationSearch : function ( sVehicleRegistrationNumber ) {
		if ( sVehicleRegistrationNumber ) {
			this.byId ( "sapSplVehicleSearch" ).setValue ( sVehicleRegistrationNumber );
			var oEvent = {};
			oEvent.mParameters = {};
			oEvent.mParameters.query = "";
			this.fnToHandleSearchOfVehicles ( oEvent );
			oEvent.mParameters.query = "*" + sVehicleRegistrationNumber + "*";
			this.fnToHandleSearchOfVehicles ( oEvent );
		}
	},

	/**
	 * @description Search of Vehicles on Press of Search icon or enter
	 * @param {object} event
	 */
	fnToHandleSearchOfVehicles : function ( event ) {
		var searchString = event.mParameters.query;
		var oSapSplVehiclesList;
		var payload, that = this, modelData;

		oSapSplVehiclesList = this.getView ( ).byId ( "SapSplVehiclesList" );

		if ( searchString.length > 2 ) {
			payload = this.prepareSearchPayload ( searchString );
			this.callSearchService ( payload );

		} else if ( oSapSplVehiclesList.getBinding ( "items" ) === undefined || oSapSplVehiclesList.getBinding ( "items" ).aFilters.length > 1 || ( event.mParameters && event.mParameters.refreshButtonPressed ) === true ) {

			sap.ui.getCore ( ).getModel ( "SapSplMyVehicleDetailModel" ).setData ( this.getEmptyAddVehicleData ( true ) );

			oSapSplVehiclesList.unbindAggregation ( "items" );
			oSapSplVehiclesList.bindItems ( {
				path : "/MyTrackableObjects",
				template : that.getView ( ).byId ( "SapSplVehiclesListItem" )
			} );
			oSapSplVehiclesList.getBinding ( "items" ).filter ( this.appliedFilters );
			oSapSplVehiclesList.getBinding ( "items" ).sort ( this.appliedSorters );

			modelData = sap.ui.getCore ( ).getModel ( "SapSplMyVehicleDetailModel" ).getData ( );
			modelData["noData"] = true;
			modelData["isClicked"] = false;
			modelData["showFooterButtons"] = false;
			sap.ui.getCore ( ).getModel ( "SapSplMyVehicleDetailModel" ).setData ( modelData );
		}
	},

	/**
	 * @description Method to prepare payload for search.
	 * @param {string} searchTerm the string represented by the search field.
	 * @returns {object} payload the constructed payload to be used for search.
	 * @since 1.0
	 */
	prepareSearchPayload : function ( searchTerm ) {
		var payload = {};
		payload.UserID = oSapSplUtils.getLoggedOnUserDetails ( ).usreID;
		payload.ObjectType = "TrackableObject";
		payload.SearchTerm = searchTerm;
		payload.FuzzinessThershold = SapSplEnums.fuzzyThreshold;
		payload.MaximumNumberOfRecords = SapSplEnums.numberOfRecords;
		payload.ProvideDetails = false;
		payload.SearchInNetwork = true;

		return payload;
	},

	/**
	 * @description Method to handle the ajax call to fetch searched results.
	 * @param {object} payload payload for post.
	 * @returns void.
	 * @since 1.0
	 */
	callSearchService : function ( payload ) {
		var that = this, sUrl = "", ajaxObject = {};

		sUrl = oSapSplUtils.getFQServiceUrl ( "/sap/spl/xs/app/services/Search.xsjs" );
		ajaxObject = {
			url : sUrl,
			data : JSON.stringify ( payload ),
			contentType : "json; charset=UTF-8",
			async : false,
			beforeSend : function ( request ) {
				request.setRequestHeader ( "X-CSRF-Token", oSapSplUtils.getCSRFToken ( ) );
				request.setRequestHeader ( "Cache-Control", "max-age=0" );
			},
			success : jQuery.proxy ( that.onSuccess, that ),
			error : jQuery.proxy ( that.onError, that ),
			method : "POST"
		};

		// call Ajax factory function
		oSapSplAjaxFactory.fireAjaxCall ( ajaxObject );

	},

	onSuccess : function ( data, success, messageObject ) {
		var oSapSplSearchFilters, oSapSplVehiclesFilters = [], oSapSplVehiclesList;
		var that = this, modelData, index;
		oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
		if ( data.constructor === String ) {
			data = JSON.parse ( data );
		}
		if ( messageObject["status"] === 200 ) {

			oSapSplVehiclesList = that.getView ( ).byId ( "SapSplVehiclesList" );
			sap.ui.getCore ( ).getModel ( "SapSplMyVehicleDetailModel" ).setData ( that.getEmptyAddVehicleData ( true ) );

			oSapSplVehiclesList.unbindAggregation ( "items" );
			if ( data.length > 0 ) {

				oSapSplSearchFilters = oSapSplUtils.getSearchItemFilters ( data );

				if ( oSapSplSearchFilters.aFilters.length > 0 ) {
					oSapSplVehiclesFilters.push ( oSapSplSearchFilters );
				}

				for ( index = 0 ; index < that.appliedFilters.length ; index++ ) {
					oSapSplVehiclesFilters.push ( that.appliedFilters[index] );
				}

				oSapSplVehiclesList.bindItems ( {
					path : "/MyTrackableObjects",
					template : that.getView ( ).byId ( "SapSplVehiclesListItem" )
				} );

				oSapSplVehiclesList.getBinding ( "items" ).filter ( oSapSplVehiclesFilters );
				oSapSplVehiclesList.getBinding ( "items" ).sort ( that.appliedSorters );

				modelData = sap.ui.getCore ( ).getModel ( "SapSplMyVehicleDetailModel" ).getData ( );
				modelData["noData"] = false;
				modelData["isClicked"] = true;
				modelData["showFooterButtons"] = true;
				sap.ui.getCore ( ).getModel ( "SapSplMyVehicleDetailModel" ).setData ( modelData );

			} else {
				modelData = sap.ui.getCore ( ).getModel ( "SapSplMyVehicleDetailModel" ).getData ( );
				
				//fix to incident 1580181735
				oSapSplVehiclesList.setBusy(false);
				
				modelData["noData"] = true;
				modelData["isClicked"] = false;
				modelData["showFooterButtons"] = false;
				modelData["isEditable"] = 0;
				modelData["isDeleted"] = 0;
				sap.ui.getCore ( ).getModel ( "SapSplMyVehicleDetailModel" ).setData ( modelData );

				that.byId ( "SapSplMyVehiclesMasterPage" ).setTitle ( oSapSplUtils.getBundle ( ).getText ( "MY_VEHICLES_MASTER_TITLE", "0" ) );
			}

		} else if ( data["Error"] && data["Error"].length > 0 ) {

			var errorMessage = oSapSplUtils.getErrorMessagesfromErrorPayload ( data )["ufErrorObject"];
			sap.ca.ui.message.showMessageBox ( {
				type : sap.ca.ui.message.Type.ERROR,
				message : oSapSplUtils.getErrorMessagesfromErrorPayload ( data )["errorWarningString"],
				details : errorMessage
			} );
		}
	},
	onError : function ( error ) {

		var modelData;
		oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );

		modelData = sap.ui.getCore ( ).getModel ( "SapSplMyVehicleDetailModel" ).getData ( );
		modelData["noData"] = true;
		modelData["isClicked"] = false;
		modelData["showFooterButtons"] = false;
		modelData["isEditable"] = 0;
		modelData["isDeleted"] = 0;
		sap.ui.getCore ( ).getModel ( "SapSplMyVehicleDetailModel" ).setData ( modelData );

		if ( error && error["status"] === 500 ) {
			sap.ca.ui.message.showMessageBox ( {
				type : sap.ca.ui.message.Type.ERROR,
				message : error["status"] + "\t" + error.statusText,
				details : error.responseText
			} );
		} else {
			sap.ca.ui.message.showMessageBox ( {
				type : sap.ca.ui.message.Type.ERROR,
				message : oSapSplUtils.getErrorMessagesfromErrorPayload ( JSON.parse ( error.responseText ) )["errorWarningString"],
				details : oSapSplUtils.getErrorMessagesfromErrorPayload ( JSON.parse ( error.responseText ) )["ufErrorObject"]
			} );
		}
	},

	/**
	 * @description Method to fetch Bupa permissions for the selected truck in the master list.
	 * @param {string} UUID the UUID of the selected truck.
	 * @returns {array} aBupaPermissionsData array of bupa permission objects for the selected truck.
	 * @since 1.0
	 */
	getBupaPermissionsData : function ( UUID ) {
		var oModel = sap.ui.getCore ( ).getModel ( "myVehiclesListODataModel" );
		var aBupaPermissionsData = [], iSharedCount = 0;
		var oDataModelContext = null, oDataModelFilters = ["$filter=UUID eq X" + "'" + oSapSplUtils.base64ToHex ( UUID ) + "' and ShareDirection eq 'O' and Role eq 'FREIGHTFWD'"], bIsAsync = false;
		var sUrl = "/SharedList";
		if ( oModel ) {
			oModel.read ( sUrl, oDataModelContext, oDataModelFilters, bIsAsync, function ( oResults ) {
				aBupaPermissionsData = oResults.results;
				for ( var i = 0 ; i < aBupaPermissionsData.length ; i++ ) {
					if ( aBupaPermissionsData[i]["isShared"] === 1 ) {
						aBupaPermissionsData[i]["showBupa"] = true;
						iSharedCount++;
					} else {
						aBupaPermissionsData[i]["showBupa"] = false;
					}
				}
			}, function ( ) {} );
		}
		if ( aBupaPermissionsData ) {
			return {data: aBupaPermissionsData, count: iSharedCount};
		}
	},

	/***
	 * @description handler for the back navigation event, in case of App to App navigation.
	 * Method to go back 1 page in the baseApp.
	 * @param oEvent event object
	 * @since 1.0
	 * @returns void.
	 */
	fnHandleBackNavigation : function ( ) {

		var oBaseApp = null;
		oBaseApp = oSplBaseApplication.getAppInstance ( );

		// back navigation when the App is not launched through DAL
		if ( oBaseApp.getPreviousPage ( ) ) {

			oBaseApp.back ( );

		} else {

			// back navigation when the App is launched through DAL and navToHome = true
			oBaseApp.to ( "splView.tileContainer.MasterTileContainer" );
		}
	},

	// Refresh the assignmnet status after adding the device id
	refreshAssignmentStatus : function ( ) {
		oSapSplBusyDialog.getBusyDialogInstance ( ).open ( );
		sap.ui.getCore ( ).getModel ( "myVehiclesListODataModel" ).attachRequestCompleted ( function ( ) {
			oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
		} );
		sap.ui.getCore ( ).getModel ( "myVehiclesListODataModel" ).attachRequestFailed ( function ( ) {
			oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
		} );
		sap.ui.getCore ( ).getModel ( "myVehiclesListODataModel" ).refresh ( );
	},

	/**
	 * @description listens to event handling channel which is previously subscribed. This is the default call back when any navigation happens to this view.
	 * It is called even before the onBeforeRendering life cycle method of the view.
	 * @param evt event object of the navigation event.
	 * @returns void.
	 * @since 1.0
	 */
	onBeforeShow : function ( ) {
		var sNavToHome = "", sGoto = "", oMasterPage = null;
		sNavToHome = jQuery.sap.getUriParameters ( ).get ( "navToHome" );
		sGoto = jQuery.sap.getUriParameters ( ).get ( "goto" );
		oMasterPage = this.byId ( "SapSplMyVehiclesMasterPage" );

		// if DAL : check for navToHome
		if ( sGoto ) {
			if ( sNavToHome && sNavToHome === "false" ) {
				oMasterPage.setShowNavButton ( false );
			} else if ( sNavToHome && sNavToHome === "true" ) {
				oMasterPage.setShowNavButton ( true );
			} else {
				// if navToHome is anything other than true or false.
				oMasterPage.setShowNavButton ( false );
			}
		} else {

			// not DAL
			oMasterPage.setShowNavButton ( true );
		}
	}

} );
