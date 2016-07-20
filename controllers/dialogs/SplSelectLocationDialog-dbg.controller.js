/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.controller ( "splController.dialogs.SplSelectLocationDialog", {

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 */
	onInit : function ( ) {
		this.oViewData = this.getView ( ).getViewData ( );
		var that = this;

		this.oFilteredColumnsForStops = {

			"SapSplStopTypeButton_1" : {
				"BuildingID" : {
					selected : false,
					query : ""
				},
				"CityName" : {
					selected : false,
					query : ""
				},
				"CountryName" : {
					selected : false,
					query : ""
				},
				"StreetPostalCode" : {
					selected : false,
					query : ""
				},
				"StreetName" : {
					selected : false,
					query : ""
				},
				"RegionName" : {
					selected : false,
					query : ""
				}
			},
			"SapSplStopTypeButton_2" : {
				"BuildingID" : {
					selected : false,
					query : ""
				},
				"CityName" : {
					selected : false,
					query : ""
				},
				"CountryName" : {
					selected : false,
					query : ""
				},
				"StreetPostalCode" : {
					selected : false,
					query : ""
				},
				"StreetName" : {
					selected : false,
					query : ""
				},
				"RegionName" : {
					selected : false,
					query : ""
				}
			}
		};

		this.getView ( ).setModel ( sap.ui.getCore ( ).getModel ( "ToursOverviewODataModel" ) );

		/* Filters for Previous Stops and Container Terminals */
		this.aFiltersForPreviousStops = [new sap.ui.model.Filter ( "isDeleted", sap.ui.model.FilterOperator.EQ, "0" ), new sap.ui.model.Filter ( "Type", sap.ui.model.FilterOperator.EQ, "L00004" ),
				new sap.ui.model.Filter ( "Tag", sap.ui.model.FilterOperator.EQ, "LC0005" )];
		this.aFiltersForContainerTerminals = [new sap.ui.model.Filter ( "isDeleted", sap.ui.model.FilterOperator.EQ, "0" ), new sap.ui.model.Filter ( "Type", sap.ui.model.FilterOperator.EQ, "L00001" ),
				new sap.ui.model.Filter ( "Tag", sap.ui.model.FilterOperator.EQ, "LC0003" )];

		/* Localization */
		this.fnDefineControlLabelsFromLocalizationBundle ( );
		this.getView ( ).byId ( "SapSplSelectLocationDialogTable" ).getBinding ( "rows" )
				.filter (
						[new sap.ui.model.Filter ( "isDeleted", sap.ui.model.FilterOperator.EQ, "0" ), new sap.ui.model.Filter ( "Type", sap.ui.model.FilterOperator.EQ, "L00004" ),
								new sap.ui.model.Filter ( "Tag", sap.ui.model.FilterOperator.EQ, "LC0005" )] );
		this.byId ( "SapSplStopTypeButton_1" ).setType ( "Emphasized" );

		/* To check the selected Button for filtering */
		this.sSelectedButton = "SapSplStopTypeButton_1";

		this.appliedFilters = this.getView ( ).byId ( "SapSplSelectLocationDialogTable" ).getBinding ( "rows" ).aFilters;
		this.appliedSorters = this.getView ( ).byId ( "SapSplSelectLocationDialogTable" ).getBinding ( "rows" ).aSorters;

		sap.ui.getCore ( ).getModel ( "ToursOverviewODataModel" ).attachRequestCompleted ( function ( e ) {
			if ( !e.getParameters ( ).errorobject ) {
				this.byId ( "SapSplSelectLocationDialogTable" ).setBusy ( false );
			}
		}.bind ( this ) );

		sap.ui.getCore ( ).getModel ( "ToursOverviewODataModel" ).attachRequestFailed ( function ( e ) {
			if ( !e.getParameters ( ).errorobject ) {
				this.byId ( "SapSplSelectLocationDialogTable" ).setBusy ( false );
			}
		}.bind ( this ) );

	},

	/**
	 * @description Method to handle localization of all the hard code texts in the view.
	 * @param void.
	 * @returns void.
	 * @since 1.0
	 */
	fnDefineControlLabelsFromLocalizationBundle : function ( ) {

		this.byId ( "SapSplSelectLocationDialogTableColumnHeader_AddressField1" ).setText ( oSapSplUtils.getBundle ( ).getText ( "HOUSE_NUMBER" ) );
		this.byId ( "SapSplSelectLocationDialogTableColumnHeader_AddressField2" ).setText ( oSapSplUtils.getBundle ( ).getText ( "STREET_NAME" ) );
		this.byId ( "SapSplSelectLocationDialogTableColumnHeader_City" ).setText ( oSapSplUtils.getBundle ( ).getText ( "NEW_LOCATION_CITY_LABEL" ) );
		this.byId ( "SapSplSelectLocationDialogTableColumnHeader_ZipCode" ).setText ( oSapSplUtils.getBundle ( ).getText ( "NEW_LOCATION_ZIPCODE_LABEL" ) );
		this.byId ( "SapSplSelectLocationDialogTableColumnHeader_Region" ).setText ( oSapSplUtils.getBundle ( ).getText ( "NEW_LOCATION_REGION_LABEL" ) );
		this.byId ( "SapSplSelectLocationDialogTableColumnHeader_Country" ).setText ( oSapSplUtils.getBundle ( ).getText ( "NEW_LOCATION_COUNRTY_LABEL" ) );
		this.byId ( "SapSplSelectLocationDialogTable" ).setNoDataText ( oSapSplUtils.getBundle ( ).getText ( "NO_STOPS_TEXT" ) );

		this.byId ( "SapSplStopTypeButton_1" ).setText ( oSapSplUtils.getBundle ( ).getText ( "MY_PREVIOUS_STOPS" ) );
		this.byId ( "SapSplStopTypeButton_2" ).setText ( oSapSplUtils.getBundle ( ).getText ( "CONTAINER_TERMINALS" ) );

	},

	/**
	 * @description Method to save dialog instance & set buttons for dialog.
	 * @param {Object} oParentDialog.
	 * @returns void.
	 * @since 1.0
	 */
	setParentDialogInstance : function ( oParentDialog ) {
		this.oParentDialogInstance = oParentDialog;
		this.setButtonForDialog ( );
	},

	/**
	 * @description Method for custom filtering
	 * @param oEvent Filter Event
	 */
	fnHandleFilterOfSelectionLocations : function ( oEvent ) {

		this.byId ( "SapSplSelectLocationDialogTable" ).setBusy ( true );
		var that = this;
		var sFilterColumn = oEvent.getParameter ( "column" ).getFilterProperty ( );
		var sFilterQuery = oEvent.getParameter ( "value" );
		var aFilterInstances = [];
		var oQueryFilter = {};

		oQueryFilter = new sap.ui.model.Filter ( sFilterColumn, sap.ui.model.FilterOperator.Contains, sFilterQuery );
		aFilterInstances.push ( oQueryFilter );
		/* Preventing default to prevent UI5 filtering - as binding objects aFilters were getting cleared from UI5 */
		oEvent.preventDefault ( );

		if ( sFilterQuery !== "" ) {
			this.oFilteredColumnsForStops[this.sSelectedButton][sFilterColumn].selected = true;
			this.oFilteredColumnsForStops[this.sSelectedButton][sFilterColumn].query = sFilterQuery;
			$.each ( that.getView ( ).byId ( "SapSplSelectLocationDialogTable" ).getBinding ( "rows" ).aFilters, function ( key, value ) {
				if ( value.sPath !== sFilterColumn ) {
					aFilterInstances.push ( value );
				}
			} );
		} else {
			this.oFilteredColumnsForStops[this.sSelectedButton][sFilterColumn].selected = false;
			this.oFilteredColumnsForStops[this.sSelectedButton][sFilterColumn].query = sFilterQuery;
			aFilterInstances = [];
			$.each ( that.getView ( ).byId ( "SapSplSelectLocationDialogTable" ).getBinding ( "rows" ).aFilters, function ( key, value ) {
				if ( value.sPath !== sFilterColumn ) {
					aFilterInstances.push ( value );
				}
			} );
		}
		
		$.each ( that.byId ( "SapSplSelectLocationDialogTable" ).getColumns ( ), function ( key, value ) {
			value.setFiltered ( that.oFilteredColumnsForStops[that.sSelectedButton][value.getFilterProperty ( )].selected );
			value.setFilterValue ( that.oFilteredColumnsForStops[that.sSelectedButton][value.getFilterProperty ( )].query );
		} );
		
		this.getView ( ).byId ( "SapSplSelectLocationDialogTable" ).getBinding ( "rows" ).filter ( aFilterInstances );
		this.getView ( ).byId ( "SapSplSelectLocationDialogTable" ).getBinding ( "rows" ).sort ( this.appliedSorters );
	},

	/**
	 * @description Method to set Begin for dialog & set localized text for it.
	 * @param void.
	 * @returns void.
	 * @since 1.0
	 */
	setButtonForDialog : function ( ) {
		this.oSapSplNewLocationCancelButton = new sap.m.Button ( {
			id : "sapSplNewLocationDialogCancel",
			press : jQuery.proxy ( this.fnHandlePressOfNewLocationDialogCancel, this )
		} );
		this.oSapSplNewLocationCancelButton.setText ( oSapSplUtils.getBundle ( ).getText ( "CANCEL" ) );
		this.oParentDialogInstance.setBeginButton ( this.oSapSplNewLocationCancelButton );
	},

	fnHandlePressOfLocationListItem : function ( oEvent ) {
		var modelData = $.extend ( true, {}, sap.ui.getCore ( ).getModel ( "SplCreateNewTourModel" ).getData ( ) );
		var selectedItem = oEvent.getParameter ( "rowContext" ).getProperty ( );
		var jIndex, affectedFreightItems = [];

		for ( var sIndex = 0 ; sIndex < modelData.stopsRow.length ; sIndex++ ) {
			if ( sIndex !== this.oViewData.rowIndex && modelData.stopsRow[this.oViewData.rowIndex].items.length !== 0 ) {
				if ( selectedItem.LocationID === modelData.stopsRow[sIndex].LocationUUID ) {
					for ( jIndex = 0 ; jIndex < modelData.Items.length ; jIndex++ ) {
						if ( modelData.Items[jIndex].pickStopIndex === sIndex && modelData.Items[jIndex].dropStopIndex === this.oViewData.rowIndex ) {
							affectedFreightItems.push ( {
								ItemID : modelData.Items[jIndex].ItemID,
								UUID : modelData.Items[jIndex].UUID
							} );
						}
						if ( modelData.Items[jIndex].pickStopIndex === this.oViewData.rowIndex && modelData.Items[jIndex].dropStopIndex === sIndex ) {
							affectedFreightItems.push ( {
								ItemID : modelData.Items[jIndex].ItemID,
								UUID : modelData.Items[jIndex].UUID
							} );
						}
					}
				}
			}
		}

		if ( affectedFreightItems.length > 0 ) {
			var text1 = oSapSplUtils.getBundle ( ).getText ( "SAME_STOP_SELECTION_DIALOG_MSG" );
			var text2 = oSapSplUtils.getBundle ( ).getText ( "LIST_OF_FREIGHT_ITEMS_MSG" ) + ":";

			this.affectedFreightItems = $.extend ( true, [], affectedFreightItems );

			splReusable.libs.SapSplStyleSheetLoader.loadStyle ( "./resources/styles/splDeleteRearrangingStopsWarningDialog", "css" );

			var deleteWarningDialogView = sap.ui.view ( {
				viewName : "splView.dialogs.SplDeleteRearrangingStopsWarningDialog",
				type : sap.ui.core.mvc.ViewType.XML,
				viewData : {
					DialogText1 : text1,
					DialogText2 : text2,
					AffectedFreightItems : affectedFreightItems,
					dialogType : "S"
				}
			} );

			var deleteWarningDialog = new sap.m.Dialog ( {
				content : deleteWarningDialogView,
				title : oSapSplUtils.getBundle ( ).getText ( "WARNING" ),
				icon : "sap-icon://warning2"
			} ).addStyleClass ( "SapSplDeleteRearrangingWarningDialog" ).open ( );

			function fnHandleClose ( oEvent ) {
				oEvent.getSource ( ).destroy ( );
				if ( oEvent.getParameters ( ).origin.getId ( ).indexOf ( "sapSplDeleteRearrangingStopsWarningDialogCancel" ) === -1 ) {
					modelData = this.fnChangeStopToNewSelectedItem ( modelData, selectedItem );
					modelData = this.fnDeleteFreightItemAssignments ( this.affectedFreightItems, modelData );
					sap.ui.getCore ( ).getModel ( "SplCreateNewTourModel" ).setData ( modelData );
				}
			}

			deleteWarningDialog.attachAfterClose ( jQuery.proxy ( fnHandleClose, this ) );
			deleteWarningDialogView.getController ( ).setParentDialogInstance ( deleteWarningDialog );
		} else {
			modelData = this.fnChangeStopToNewSelectedItem ( modelData, selectedItem );
			sap.ui.getCore ( ).getModel ( "SplCreateNewTourModel" ).setData ( modelData );
		}
	},

	fnChangeStopToNewSelectedItem : function ( modelData, selectedItem ) {
		modelData.stopsRow[this.oViewData.rowIndex]["LocationUUID"] = selectedItem["LocationID"];
		modelData.stopsRow[this.oViewData.rowIndex]["Address.Name1"] = selectedItem["BuildingID"];
		modelData.stopsRow[this.oViewData.rowIndex]["Address.Town"] = selectedItem["CityName"];
		modelData.stopsRow[this.oViewData.rowIndex]["Address.Name2"] = selectedItem["StreetName"];
		modelData.stopsRow[this.oViewData.rowIndex]["Address.PostalCode"] = selectedItem["StreetPostalCode"];
		modelData.stopsRow[this.oViewData.rowIndex]["Address.Country"] = selectedItem["CountryName"];
		modelData.stopsRow[this.oViewData.rowIndex]["Address.Region"] = selectedItem["RegionName"];
		modelData.stopsRow[this.oViewData.rowIndex]["AddressUUID"] = selectedItem["AddressUUID"];
		modelData.stopsRow[this.oViewData.rowIndex]["Name"] = selectedItem["Name"];

		// set tag, owner name and UUID
		if ( selectedItem["Tag"] && selectedItem["Tag"] === "LC0003" ) {
			modelData.stopsRow[this.oViewData.rowIndex]["Tag"] = selectedItem["Tag"];
			modelData.stopsRow[this.oViewData.rowIndex]["StopPartnerName"] = selectedItem["OwnerName"];
			modelData.stopsRow[this.oViewData.rowIndex]["StopPartnerUUID"] = selectedItem["OwnerID"];

		} else {
			modelData.stopsRow[this.oViewData.rowIndex]["Tag"] = null;
			modelData.stopsRow[this.oViewData.rowIndex]["StopPartnerName"] = null;
			modelData.stopsRow[this.oViewData.rowIndex]["StopPartnerUUID"] = null;
		}

		// Fix to Incident 1570173762
		if ( selectedItem["isEditable"] !== null && selectedItem["isEditable"] !== undefined && selectedItem["isEditable"] === 1 ) {
			modelData.stopsRow[this.oViewData.rowIndex]["canEditStopLocation"] = "1";
		} else {
			modelData.stopsRow[this.oViewData.rowIndex]["canEditStopLocation"] = "0";
		}

		// set fields as null for new stop selection
		for ( var i = 0 ; i < modelData.stopsRow[this.oViewData.rowIndex].items.length ; i++ ) {
			modelData.stopsRow[this.oViewData.rowIndex].items[i].PartnerOrderID = null;
			modelData.stopsRow[this.oViewData.rowIndex].items[i].ExternalStopDestination = null;
		}

		modelData.stopsRow[this.oViewData.rowIndex].labels.newlocationlink = oSapSplUtils.getBundle ( ).getText ( "EDIT_STOP" );

		this.fnToCaptureLiveChangeToSetFlag ( );
		this.getView ( ).getParent ( ).close ( );
		return modelData;
	},

	fnDeleteFreightItemAssignments : function ( fItems, modelData ) {
		var jIndex, kIndex;
		for ( jIndex = 0 ; jIndex < modelData.Items.length ; jIndex++ ) {
			for ( kIndex = 0 ; kIndex < fItems.length ; kIndex++ ) {
				if ( fItems[kIndex].UUID === modelData.Items[jIndex].UUID ) {
					for ( kIndex = 0 ; kIndex < modelData.stopsRow[modelData.Items[jIndex].pickStopIndex].items.length ; kIndex++ ) {
						if ( modelData.stopsRow[modelData.Items[jIndex].pickStopIndex].items[kIndex].ItemUUID === modelData.Items[jIndex].UUID ) {
							modelData.stopsRow[modelData.Items[jIndex].pickStopIndex].items[kIndex].IsDeleted = "1";
							modelData.stopsRow[modelData.Items[jIndex].pickStopIndex].items[kIndex].Action = "N";
							break;
						}
					}

					for ( kIndex = 0 ; kIndex < modelData.stopsRow[modelData.Items[jIndex].dropStopIndex].items.length ; kIndex++ ) {
						if ( modelData.stopsRow[modelData.Items[jIndex].dropStopIndex].items[kIndex].ItemUUID === modelData.Items[jIndex].UUID ) {
							modelData.stopsRow[modelData.Items[jIndex].dropStopIndex].items[kIndex].IsDeleted = "1";
							modelData.stopsRow[modelData.Items[jIndex].dropStopIndex].items[kIndex].Action = "N";
							break;
						}
					}

					modelData.Items[jIndex].pickStopIndex = -1;
					modelData.Items[jIndex].pickActionHappened = "N";

					modelData.Items[jIndex].dropStopIndex = -1;
					modelData.Items[jIndex].dropActionHappened = "N";

					break;
				}
			}
		}
		return modelData;
	},

	/**
	 * @description Called to set isDirtyFlag to true in Utils
	 * @returns void.
	 * @since 1.0
	 * */
	fnToCaptureLiveChangeToSetFlag : function ( ) {
		if ( !oSapSplUtils.getIsDirty ( ) ) {
			oSapSplUtils.setIsDirty ( true );
		}
	},

	fnHandlePressOfNewLocationDialogCancel : function ( ) {
		this.getView ( ).getParent ( ).close ( );
	},

	fnHandelStopTypesSegmentedButton : function ( oEvent ) {
		var that = this;
		if ( oEvent.getParameters ( ).id.indexOf ( "SapSplStopTypeButton_1" ) !== -1 ) {
			this.aFiltersForContainerTerminals = this.getView ( ).byId ( "SapSplSelectLocationDialogTable" ).getBinding ( "rows" ).aFilters;
			this.getView ( ).byId ( "SapSplSelectLocationDialogTable" ).getBinding ( "rows" ).filter ( this.aFiltersForPreviousStops );
			this.byId ( "SapSplStopTypeButton_1" ).setType ( "Emphasized" );
			/* Fix CSN 0120031469 773360 2014 */
			this.byId ( "SapSplStopTypeButton_2" ).setType ( "Default" );

			/* To check the selected Button for filtering */
			this.sSelectedButton = "SapSplStopTypeButton_1";

		} else {
			this.aFiltersForPreviousStops = this.getView ( ).byId ( "SapSplSelectLocationDialogTable" ).getBinding ( "rows" ).aFilters;
			this.getView ( ).byId ( "SapSplSelectLocationDialogTable" ).getBinding ( "rows" ).filter ( this.aFiltersForContainerTerminals );
			this.byId ( "SapSplStopTypeButton_2" ).setType ( "Emphasized" );
			/* Fix CSN 0120031469 773360 2014 */
			this.byId ( "SapSplStopTypeButton_1" ).setType ( "Default" );

			/* To check the selected Button for filtering */
			this.sSelectedButton = "SapSplStopTypeButton_2";
		}
		this.appliedFilters = this.getView ( ).byId ( "SapSplSelectLocationDialogTable" ).getBinding ( "rows" ).aFilters;
		$.each ( that.byId ( "SapSplSelectLocationDialogTable" ).getColumns ( ), function ( key, value ) {
			value.setFiltered ( that.oFilteredColumnsForStops[that.sSelectedButton][value.getFilterProperty ( )].selected );
			value.setFilterValue ( that.oFilteredColumnsForStops[that.sSelectedButton][value.getFilterProperty ( )].query );
		} );
	},

	/**
	 * @description Search of Vehicles on Press of Search icon or enter
	 * @param {object} event
	 */
	fnToHandleSearchOfAddress : function ( oEvent ) {
		var searchString = oEvent.getParameters ( ).query;
		var oSapSplAddressList;
		var payload, that = this;

		oSapSplAddressList = this.getView ( ).byId ( "SapSplSelectLocationDialogTable" );

		if ( searchString.length > 2 ) {
			payload = this.prepareSearchPayload ( searchString );
			this.callSearchService ( payload );

		} else if ( oSapSplAddressList.getBinding ( "rows" ) === undefined || oSapSplAddressList.getBinding ( "rows" ).aFilters.length > 1 ) {

			oSapSplAddressList.unbindAggregation ( "rows" );
			oSapSplAddressList.bindRows ( {
				path : "/MyLocations",
				template : that.getView ( ).byId ( "oSapSplSearchTemplate" )
			} );
			oSapSplAddressList.getBinding ( "rows" ).filter ( this.appliedFilters );
		}
	},

	prepareSearchPayload : function ( searchTerm ) {
		var payload = {};
		payload.UserID = oSapSplUtils.getLoggedOnUserDetails ( ).usreID;
		payload.ObjectType = "Location";
		payload.SearchTerm = searchTerm;
		payload.FuzzinessThershold = SapSplEnums.fuzzyThreshold;
		payload.MaximumNumberOfRecords = SapSplEnums.numberOfRecords;
		payload.ProvideDetails = false;
		payload.SearchInNetwork = true;

		if ( this.byId ( "SapSplStopTypeButton_1" ).getType ( ) === "Emphasized" ) {
			payload.AdditionalCriteria = {
				TypeFilter : ["L00004"],
				tagFilter : [" LC0005"]
			};
		} else {
			payload.AdditionalCriteria = {
				TagFilter : ["LC0003"],
				TypeFilter : ["L00001"]
			};

		}
		return payload;
	},

	callSearchService : function ( payload ) {
		var oSapSplSearchFilters, oSapSplAddressFilters = [], oSapSplAddressList;
		var that = this;

		oSapSplAjaxFactory.fireAjaxCall ( {
			url : oSapSplUtils.getFQServiceUrl ( "/sap/spl/xs/app/services/Search.xsjs" ),
			method : "POST",
			async : false,
			data : JSON.stringify ( payload ),
			success : function ( data, success, messageObject ) {
				oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
				if ( data.constructor === Object ) {
					data = JSON.parse ( data );
				}
				if ( messageObject["status"] === 200 ) {

					oSapSplAddressList = that.getView ( ).byId ( "SapSplSelectLocationDialogTable" );
					oSapSplAddressFilters.push ( new sap.ui.model.Filter ( "isDeleted", sap.ui.model.FilterOperator.EQ, "0" ) );
					if ( that.byId ( "SapSplStopTypeButton_1" ).getType ( ) === "Emphasized" ) {
						oSapSplAddressFilters.concat ( [new sap.ui.model.Filter ( "Type", sap.ui.model.FilterOperator.EQ, "L00004" ), new sap.ui.model.Filter ( "Tag", sap.ui.model.FilterOperator.EQ, "LC005" )] );
					} else {
						oSapSplAddressFilters.concat ( [new sap.ui.model.Filter ( "Type", sap.ui.model.FilterOperator.EQ, "L00001" ), new sap.ui.model.Filter ( "Tag", sap.ui.model.FilterOperator.EQ, "LC0003" )] );

					}

					oSapSplAddressList.unbindAggregation ( "rows" );
					if ( data.length > 0 ) {

						oSapSplSearchFilters = oSapSplUtils.getSearchItemFilters ( data, "LocationID" );
						if ( oSapSplSearchFilters.aFilters.length > 0 ) {
							oSapSplAddressFilters.push ( oSapSplSearchFilters );
						}

						oSapSplAddressList.bindRows ( {
							path : "/MyLocations",
							template : that.getView ( ).byId ( "oSapSplSearchTemplate" )
						} );

						oSapSplAddressList.getBinding ( "rows" ).filter ( oSapSplAddressFilters );

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
			error : function ( error ) {
				oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );

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
			complete : function ( ) {

			}
		} );
	}
/**
 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
 */
//	onExit: function() {
//	}
} );
