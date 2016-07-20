jQuery.sap.require ( "splReusable.libs.SapSplTimeControl" );
sap.ui.controller ( "splController.managetours.CreateNewTour", {

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 */
	onInit : function ( ) {

		/* SAPUI5 JSONModel - to be set to CreateNewTour view */
		var SplCreateNewTourModel = new sap.ui.model.json.JSONModel ( {} );
		splReusable.libs.SapSplStyleSheetLoader.loadStyle ( "./resources/styles/sapCreateNewTour" );

		/*
		 * Making the SplCreateNewTourModel as a named model. 1. Easily
		 * accessible from other views and model data manipulation becomes easy.
		 * 2. To enable multiple model setting on the view.
		 */
		sap.ui.getCore ( ).setModel ( SplCreateNewTourModel, "SplCreateNewTourModel" );

		this.getView ( ).setModel ( sap.ui.getCore ( ).getModel ( "SplCreateNewTourModel" ) );

		/* Localization */
		this.fnDefineControlLabelsFromLocalizationBundle ( );

		this.factoryFunctiontoBindAggregationForMatrixLayout ( );
	},

	/**
	 *@description Method to getEmptyStopObject
	 *@param {boolean} isVisible
	 *@param {boolean} isEdit
	 *@returns {object} emptyStopObject
	 */
	getEmptyStopObject : function ( isVisible, isEdit ) {
		var emptyStopObject = {}, date, stops;

		stops = sap.ui.getCore ( ).getModel ( "SplCreateNewTourModel" ).getData ( ).stopsRow;

		if ( isEdit && stops && stops.length ) {
			date = stops[stops.length - 1]["Planned.ArrivalTime"];
		} else {
			date = new Date ( );
			date.setMilliseconds ( 0 );
			date.setSeconds ( 0 );
		}
		emptyStopObject = {
			"LocationUUID" : null,
			"AddressUUID" : null,
			"Address.Name1" : null,
			"Address.Name2" : null,
			"Address.Name3" : null,
			"Address.Name4" : null,
			"Address.PostalCode" : null,
			"Address.Country" : null,
			"Address.Region" : null,
			"Address.Town" : null,
			"Address.Street" : null,
			"Name" : null,
			"Planned.ArrivalTime" : date,
			"Planned.DepartureTime" : date,
			"leavesTimeVisible" : isVisible,
			"items" : [],
			"canEditStopLocation" : "1",
			"pickup" : oSapSplUtils.getBundle ( ).getText ( "FREIGHT_ITEM_ASSIGN_PICK_UP" ),
			"drop" : oSapSplUtils.getBundle ( ).getText ( "FREIGHT_ITEM_ASSIGN_DROP" )
		};

		// localization is set to model as label as part of dynamically added
		// rows to the matrix layout
		emptyStopObject.labels = this.fnLabelsFromLocalizationBundleForMatrixlayout ( );
		return emptyStopObject;
	},

	/**
	 * @description Method to handle localization of all the hard code texts in the view.
	 * @param void.
	 * @returns void.
	 * @since 1.0
	 */
	fnDefineControlLabelsFromLocalizationBundle : function ( ) {

		/* Freight Items */
		this.byId ( "sapSplFreightItemsLayoutLabel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "CARGO" ) );

		/* Localization for Add freight Items */
		this.byId ( "SapSplAddFreightItemsTableHeaderText" ).setText ( oSapSplUtils.getBundle ( ).getText ( "FREIGHT_ITEMS" ) );

		/* Tooltip for Delete of Freight Item from list */
		this.byId ( "splSapAddFreightItems_Delete" ).setTooltip ( oSapSplUtils.getBundle ( ).getText ( "DELETE" ) );

		/* Add Freight Items Link */
		this.byId ( "sapSplAddFreightItemLink" ).setText ( oSapSplUtils.getBundle ( ).getText ( "ADD_FREIGHT_ITEMS" ) );

		/* Stops Label */
		this.byId ( "sapSplStopsLayoutLabel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "LOCATIONS" ) );

		/* Add Stop Button */
		this.byId ( "sapSplAddStop" ).setText ( oSapSplUtils.getBundle ( ).getText ( "ADD_STOP" ) );

		/* Trucks */
		this.byId ( "sapSplTrucksLayoutLabel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "TRUCK" ) );

		/* Localization for selecting truck */
		this.byId ( "sapSplSelectTruckLabel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "SELECT_TRUCK_DIALOG_TITLE" ) + ":" );
		this.byId ( "sapSplSelectTruckInput" ).setPlaceholder ( oSapSplUtils.getBundle ( ).getText ( "PLEASE_SELECT_PLACEHOLDER" ) );

		/* Details */
		this.byId ( "sapSplTourDetailsLayoutLabel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "DETAILS_LABEL" ) );

		/* Localization for TourName */
		this.byId ( "sapSplTourNameLabel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "TOUR_NAME" ) + ":" );
		this.byId ( "SapSplRemoveTruck" ).setText ( oSapSplUtils.getBundle ( ).getText ( "REMOVE_TRUCK" ) );

		/* Localization for TourID */
		this.byId ( "sapSplTourIDLabel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "TOUR_ID" ) + ":" );

		/* Localization for Comments */
		this.byId ( "sapSplCommentsLabel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "COMMENTS" ) + ":" );

		/* Localization for Footer Buttons */
		this.byId ( "sapSplCreateTourSubmit" ).setText ( oSapSplUtils.getBundle ( ).getText ( "ASSIGN_NOW" ) );
		this.byId ( "sapSplCreateTourCancel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "CANCEL" ) );
		this.byId ( "sapSplCreateTourSaveForlater" ).setText ( oSapSplUtils.getBundle ( ).getText ( "SAVE_FOR_LATER" ) );

	},

	/**
	 * @description Method to handle localization of all label inside the FreightItems Stops matrix layout.
	 * @param void.
	 * @returns void.
	 * @since 1.0
	 */
	fnLabelsFromLocalizationBundleForMatrixlayout : function ( ) {
		/* Localization for Creating a Stop */
		return {
			"location" : oSapSplUtils.getBundle ( ).getText ( "STOP" ) + ":",
			"partner" : oSapSplUtils.getBundle ( ).getText ( "PARTNER" ) + ":",
			"arrivetime" : oSapSplUtils.getBundle ( ).getText ( "ARRIVE_HERE" ) + ":",
			"leavestime" : oSapSplUtils.getBundle ( ).getText ( "LEAVE_HERE" ) + ":",
			"newlocationlink" : oSapSplUtils.getBundle ( ).getText ( "ENTER_NEW_STOP" ),
			"AssignFreightItemsLabel" : oSapSplUtils.getBundle ( ).getText ( "FREIGHT_ITEMS" ),
			"MoveUp" : oSapSplUtils.getBundle ( ).getText ( "MOVE_UP" ),
			"MoveDown" : oSapSplUtils.getBundle ( ).getText ( "MOVE_DOWN" ),
			"DeleteStop" : oSapSplUtils.getBundle ( ).getText ( "DELETE_STOP" ),

			"AddStop" : oSapSplUtils.getBundle ( ).getText ( "ADD_STOP" ),
			"assignfreightitemlink" : oSapSplUtils.getBundle ( ).getText ( "ASSIGN_FREIGHT_ITEM" ),
			"dropfreightitemlink" : oSapSplUtils.getBundle ( ).getText ( "DROP_REMAINMING_FREIGHT_ITEMS" ),
			"stopPlaceholder" : oSapSplUtils.getBundle ( ).getText ( "PLEASE_SELECT_PLACEHOLDER" )
		};
	},

	/**
	 * @description listens to event handling channel which is previously subscribed. This is the default call back when any navigation happens to this view.
	 * It is called even before the onBeforeRendering life cycle method of the view.
	 * @param oEvent event object of the navigation event.
	 * @returns void.
	 * @since 1.0
	 */
	onBeforeShow : function ( oEvent ) {
		var data = {}, sIndex;
		var tourData;

		// Modifying Data to make it compatible for edit
		if ( oEvent.data && oEvent.data.isEdit ) {

			// Saving edit flag for creation of payload
			data.isEdit = oEvent.data.isEdit;

			tourData = oEvent.data.TourData.data;

			// Saving Tour data
			data.status = tourData.TourStatus;
			data.UUID = tourData.UUID;
			data.VehicleUUID = tourData.VehicleUUID;
			data.OwnerID = tourData.OwnerID;
			data.Actual_EndTime = tourData.Actual_EndTime;
			data.Actual_StartTime = tourData.Actual_StartTime;

			data.TourInputNameChanged = true;

			data.Items = [];
			// Getting items & saving in data.Items
			for ( sIndex = 0 ; sIndex < tourData.Items.results.length ; sIndex++ ) {
				data.Items[sIndex] = this.getItemObject ( tourData.Items.results[sIndex], tourData );
			}

			data.stopsRow = [];
			// Getting stops, AssignedItems & saving in data.stopsRow
			for ( sIndex = 0 ; sIndex < tourData.Stops.results.length ; sIndex++ ) {
				data.stopsRow[sIndex] = this.getStopObject ( tourData.Stops.results[sIndex], tourData );
			}
			// Making Leaves time of last stop to false
			data.stopsRow[sIndex - 1].leavesTimeVisible = false;

			// To get comments
			data.Text = tourData.Text;

			// to get Tour ID
			data.TourID = tourData.TourID;

			// to get Tour Name
			data.Name = tourData.Name;

			// To get Vehicle & driver Information
			data.VehicleUUID = tourData.VehicleUUID;
			data.DriverName = tourData.DriverName;
			data.RegistrationNumber = tourData.RegistrationNumber;

			/* Localization for Header Title */
			this.byId ( "sapSplCreateTourLabel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "EDIT_TITLE_OF_BUSINESS_PARTNER", tourData.Name ) );

			/* Localization for Footer Button */
			this.byId ( "sapSplCreateTourSaveForlater" ).setText ( oSapSplUtils.getBundle ( ).getText ( "NEW_CONTACT_SAVE" ) );

		} else { // Initializing data for creating a Tour

			data.status = "I";
			data.isEdit = 0;
			data.Items = [];
			data.stopsRow = [this.getEmptyStopObject ( true, false ), this.getEmptyStopObject ( false, false )];
			data.Text = "";
			data.Name = "";
			data.VehicleUUID = null;
			data.DriverName = null;
			data.RegistrationNumber = null;
			data.TourInputNameChanged = false;

			/* Localization for Header Title */
			this.byId ( "sapSplCreateTourLabel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "CREATE_NEW_TOUR" ) );

			/* Localization for Footer Button */
			this.byId ( "sapSplCreateTourSubmit" ).setText ( oSapSplUtils.getBundle ( ).getText ( "ASSIGN_NOW" ) );
			this.byId ( "sapSplCreateTourSaveForlater" ).setText ( oSapSplUtils.getBundle ( ).getText ( "SAVE_FOR_LATER" ) );
		}

		sap.ui.getCore ( ).getModel ( "SplCreateNewTourModel" ).setData ( data );

	},

	/**
	 *@description Method to get Freight Item Object
	 *@param {object} itemObject
	 *@param {object} tourObject
	 *@returns {object} aItemObject Freight Item
	 */
	getItemObject : function ( itemObject, tourObject ) {
		var aItemObject = {}, sIndex, sJIndex;
		aItemObject = {
			"UUID" : itemObject["ItemUUID"],
			"ItemID" : itemObject["ItemID"],

			"ContainerType" : itemObject["ContainerType"],
			"Description" : itemObject["Description"],

			"Quantity_Unit" : itemObject["Quantity_Unit"],
			"Quantity_Value" : itemObject["Quantity_Value"],

			"Volume_Unit" : itemObject["Volume_Unit"],
			"Volume_Value" : itemObject["Volume_Value"],

			"Weight_Unit" : itemObject["Weight_Unit"],
			"Weight_Value" : itemObject["Weight_Value"],

			"DangerGoodsClass" : itemObject["DangerGoodsClass"],
			"Type" : itemObject["Type"],
			"isEdit" : false,
			"pickActionHappened" : "N",
			"dropActionHappened" : "N",
			"pickStopIndex" : -1,
			"dropStopIndex" : -1
		};

		for ( sIndex = 0 ; sIndex < tourObject.Stops.results.length ; sIndex++ ) {

			for ( sJIndex = 0 ; sJIndex < tourObject.Stops.results[sIndex].AssignedItems.results.length ; sJIndex++ ) {

				if ( itemObject["ItemUUID"] === tourObject.Stops.results[sIndex].AssignedItems.results[sJIndex].ItemUUID ) {

					if ( tourObject.Stops.results[sIndex].AssignedItems.results[sJIndex].AssignmentType === "P" ) {
						aItemObject.pickActionHappened = "P";
						aItemObject.pickStopIndex = (tourObject.Stops.results[sIndex].Sequence - 1);
					} else {
						aItemObject.dropActionHappened = "D";
						aItemObject.dropStopIndex = (tourObject.Stops.results[sIndex].Sequence - 1);
					}
				}
			}
		}
		return aItemObject;
	},

	/**
	 *@description Method to get Stop Object
	 *@param {object} stopObject
	 */
	getStopObject : function ( stopObject, tourObject ) {
		var aStopObject = {}, sIndex, sJIndex, sKIndex, sLIndex;

		aStopObject = {
			"UUID" : stopObject["UUID"],
			"LastReportedEvent" : stopObject["LastReportedEvent"],
			"LocationUUID" : stopObject["LocationID"],
			"AddressUUID" : stopObject["AddressUUID"],
			"Status" : stopObject["Status"],
			"Address.Name1" : stopObject["BuildingID"],
			"Address.Name2" : stopObject["StreetName"],
			"Address.PostalCode" : stopObject["StreetPostalCode"],
			"Address.Country" : stopObject["CountryName"],
			"Address.Region" : stopObject["RegionName"],
			"Address.Town" : stopObject["CityName"],
			"Name" : stopObject["Name"],
			"Planned.ArrivalTime" : (typeof (stopObject["Planned_ArrivalTime"]) === "object") ? stopObject["Planned_ArrivalTime"] : new Date ( parseInt ( stopObject["Planned_ArrivalTime"].match ( /([0-9])+/g )[0], 10 ) ),
			"Planned.DepartureTime" : (typeof (stopObject["Planned_DepartureTime"]) === "object") ? stopObject["Planned_DepartureTime"] : new Date ( parseInt ( stopObject["Planned_DepartureTime"].match ( /([0-9])+/g )[0], 10 ) ),
			"Actual.ArrivalTime" : stopObject["Actual_ArrivalTime"],
			"Actual.DepartureTime" : stopObject["Actual_DepartureTime"],
			"leavesTimeVisible" : true,
			"Sequence" : stopObject["Sequence"],
			"StopPartnerUUID" : stopObject["StopPartnerUUID"],
			"StopPartnerName" : stopObject["StopPartnerName"],
			"canEditStopLocation" : stopObject["canEditStopLocation"],
			"Tag" : stopObject["Tag"],
			"items" : []
		};

		// localization is set to model as label as part of dynamically added
		// rows to the matrix layout
		aStopObject.labels = this.fnLabelsFromLocalizationBundleForMatrixlayout ( );

		if ( stopObject.Name ) {
			aStopObject.labels.newlocationlink = oSapSplUtils.getBundle ( ).getText ( "EDIT_STOP" );
		}

		// To get all items Assigned to the particular stop
		for ( sIndex = 0 ; sIndex < stopObject.AssignedItems.results.length ; sIndex++ ) {
			aStopObject.items[sIndex] = this.getAssignedItemObject ( stopObject.AssignedItems.results[sIndex] );
			aStopObject.items[sIndex].pickup = oSapSplUtils.getBundle ( ).getText ( "FREIGHT_ITEM_ASSIGN_PICK_UP" );
			aStopObject.items[sIndex].drop = oSapSplUtils.getBundle ( ).getText ( "FREIGHT_ITEM_ASSIGN_DROP" );
			aStopObject.items[sIndex]["delete"] = oSapSplUtils.getBundle ( ).getText ( "DELETE" );
		}

		// To get remaining freight items which have "do nothing" status for
		// this stop
		if ( aStopObject.items.length < tourObject.Items.results.length ) {
			// running loop of length (Total Items - Already assigned items to
			// this stop)
			for ( sJIndex = 0 ; sJIndex < (tourObject.Items.results.length - aStopObject.items.length) ; sJIndex++ ) {
				// running loop of length "Total Items"
				for ( sKIndex = 0 ; sKIndex < tourObject.Items.results.length ; sKIndex++ ) {
					// running loop of length "Already assigned items to this
					// stop"

					if ( aStopObject.items.length < 1 ) {
						aStopObject.items[sIndex] = this.getAssignedItemObject ( tourObject.Items.results[sKIndex] );
						aStopObject.items[sIndex].Action = "N";
						sIndex++;
					} else {
						for ( sLIndex = 0 ; sLIndex < aStopObject.items.length ; sLIndex++ ) {
							if ( tourObject.Items.results[sKIndex].ItemUUID === aStopObject.items[sLIndex].ItemUUID ) {
								break;
							} else {
								if ( sLIndex === (aStopObject.items.length - 1) ) {
									aStopObject.items[sIndex] = this.getAssignedItemObject ( tourObject.Items.results[sKIndex] );
									aStopObject.items[sIndex].Action = "N";
									sIndex++;
								}
							}
						}
					}
				}
			}
		}

		return aStopObject;
	},

	/**
	 *@description Method to get Assigned Item Object
	 *@param {object} itemObject
	 *@returns {object} aItemObject
	 */
	getAssignedItemObject : function ( itemObject ) {
		var aItemObject = {};

		aItemObject = {
			"ItemID" : itemObject["ItemID"],
			"ContainerType" : itemObject["ContainerType"],
			"Description" : itemObject["Description"],

			"Quantity_Unit" : itemObject["Quantity_Unit"],
			"Quantity_Value" : itemObject["Quantity_Value"],

			"Volume_Unit" : itemObject["Volume_Unit"],
			"Volume_Value" : itemObject["Volume_Value"],

			"Weight_Unit" : itemObject["Weight_Unit"],
			"Weight_Value" : itemObject["Weight_Value"],

			"DangerGoodsClass" : itemObject["DangerGoodsClass"],
			"Type" : itemObject["Type"],
			"ItemUUID" : itemObject["ItemUUID"],
			"IsDeleted" : "0",
			"Action" : itemObject["AssignmentType"],
			"PartnerOrderID" : itemObject["PartnerOrderID"],
			"ExternalStopDestination" : itemObject["ExternalStopDestination"],
			"isEdit" : false
		};

		return aItemObject;
	},
	/**
	 * @description Getter method to get the unified shell instance which is the super parent of this view.
	 * @param void.
	 * @returns this.unifiedShell the unified shell instance previously set to this view during instantiation.
	 * @since 1.0
	 */
	getUnifiedShellInstance : function ( ) {
		return this.unifiedShell;
	},

	/**
	 * @description Setter method to set the unified shell instance which is the super parent of this view.
	 * @param void.
	 * @returns void.
	 * @since 1.0
	 */
	setUnifiedShellInstance : function ( oUnifiedShellInstance ) {
		this.unifiedShell = oUnifiedShellInstance;
	},

	/**
	 * @description  Method is called when Identifier is pressed in Adding new Freight Items table.
	 * @param oEvent {object}.
	 * @returns void.
	 * @since 1.0
	 */
	fnHandlePressOfIdentifier : function ( oEvent ) {

		splReusable.libs.SapSplStyleSheetLoader.loadStyle ( "./resources/styles/sapSplNewFreightItem" );
		var oViewData = oEvent.getSource ( ).getBindingContext ( ).getProperty ( );
		oViewData.isEdit = true;
		var newFreightItemDialogView = sap.ui.view ( {
			viewName : "splView.dialogs.SplNewFreightItemDialog",
			type : sap.ui.core.mvc.ViewType.XML,
			viewData : oViewData
		} );

		var newFreightItemdialog = new sap.m.Dialog ( {
			title : "Edit " + oViewData.ItemID,
			content : newFreightItemDialogView
		} ).addStyleClass ( "sapSplNewFreightItemDialog" ).open ( );

		newFreightItemDialogView.getController ( ).setParentDialogInstance ( newFreightItemdialog );

		newFreightItemdialog.attachAfterOpen ( function ( oEvent ) {
			oSapSplUtils.fnSyncStyleClass ( newFreightItemdialog );
			oEvent.getSource ( ).getContent ( )[0].rerender ( );
			window.setTimeout ( function ( ) {
				newFreightItemdialog.getContent ( )[0].getController ( ).byId ( "SapSplNewFreightItemFormContainerIdInput" ).focus ( );
			}, 200 );
		} );

		function fnHandleClose ( oEvent ) {
			oEvent.getSource ( ).destroy ( );
			this.fnCheckTimeValidation ( this );
		}
		newFreightItemdialog.attachAfterClose ( jQuery.proxy ( fnHandleClose, this ) );
	},

	/**
	 * @description  Method is called when "Enter New Location" link is pressed in New Location row.
	 * @param oEvent {object}.
	 * @returns void.
	 * @since 1.0
	 */
	fnHandleClickOfEnterNewLocation : function ( oEvent ) {

		var modelDataIndex = parseInt ( oEvent.getSource ( ).getBindingContext ( ).sPath.split ( "/" )[2], 10 );
		var modelData = sap.ui.getCore ( ).getModel ( "SplCreateNewTourModel" ).getData ( );
		var locationObject = {}, dialogTitle = "";
		locationObject["Address.Name1"] = modelData.stopsRow[modelDataIndex]["Address.Name1"];
		locationObject["Address.Name2"] = modelData.stopsRow[modelDataIndex]["Address.Name2"];
		locationObject["Address.Name3"] = modelData.stopsRow[modelDataIndex]["Address.Name3"];
		locationObject["Address.Name4"] = modelData.stopsRow[modelDataIndex]["Address.Name4"];
		locationObject["Address.Street"] = modelData.stopsRow[modelDataIndex]["Address.Street"];
		locationObject["Address.PostalCode"] = modelData.stopsRow[modelDataIndex]["Address.PostalCode"];
		locationObject["Address.Country"] = modelData.stopsRow[modelDataIndex]["Address.Country"];
		locationObject["Address.Region"] = modelData.stopsRow[modelDataIndex]["Address.Region"];
		locationObject["Address.Town"] = modelData.stopsRow[modelDataIndex]["Address.Town"];
		locationObject.modelDataIndex = modelDataIndex;
		locationObject["Address.Street"] = modelData.stopsRow[modelDataIndex]["Address.Street"];

		splReusable.libs.SapSplStyleSheetLoader.loadStyle ( "./resources/styles/sapSplNewLocation" );

		if ( oEvent.getSource ( ).getText ( ) === oSapSplUtils.getBundle ( ).getText ( "ENTER_NEW_STOP" ) ) {
			dialogTitle = oSapSplUtils.getBundle ( ).getText ( "NEW_LOCATION_DIALOG_TITLE" );
		} else {
			dialogTitle = oSapSplUtils.getBundle ( ).getText ( "EDIT_LOCATION_DIALOG_TITLE" );
		}

		var newLocationDialogView = sap.ui.view ( {
			id : "SplNewLocationDialogView",
			viewName : "splView.dialogs.SplNewLocationDialog",
			type : sap.ui.core.mvc.ViewType.XML,
			viewData : locationObject
		} );

		var newLocationdialog = new sap.m.Dialog ( {
			title : dialogTitle,
			content : newLocationDialogView,
			contentWidth : "20%"
		} ).addStyleClass ( "sapSplNewLocationDialog" ).open ( );

		newLocationdialog.attachAfterOpen ( function ( oEvent ) {
			oEvent.getSource ( ).getContent ( )[0].rerender ( );
			oSapSplUtils.fnSyncStyleClass ( newLocationdialog );
			window.setTimeout ( function ( ) {
				newLocationdialog.getContent ( )[0].getController ( ).byId ( "SapSplNewLocationFormContainerAddress1Input" ).focus ( );
			}, 200 );
		} );

		function fnHandleClose ( oEvent ) {
			oEvent.getSource ( ).destroy ( );
			this.fnCheckTimeValidation ( this );
			sap.ui.getCore().byId("CreateNewTour--SapSplCreateNewTourVerticalLayout").rerender();
		}
		newLocationdialog.attachAfterClose ( jQuery.proxy ( fnHandleClose, this ) );

		newLocationDialogView.getController ( ).setParentDialogInstance ( newLocationdialog );
	},

	/**
	 * @description  Return an Empty object of Freight Item.
	 * @param void.
	 * @returns oEmptyObject {Object}.
	 * @since 1.0
	 */
	getEmptyObjectOfFreightItem : function ( ) {
		var oEmptyObject = {
			"ItemID" : "",

			"ContainerType" : "20ft",
			"Description" : "",

			"Quantity_Unit" : "",
			"Quantity_Value" : "",

			"Volume_Unit" : "",
			"Volume_Value" : "",

			"Weight_Unit" : "",
			"Weight_Value" : "",

			"DangerGoodsClass" : "",
			"Type" : "C",
			"isEdit" : false
		};
		return oEmptyObject;
	},

	/**
	 * @description  Method is called when "Add New Freight Item" link is pressed.
	 * @param void.
	 * @returns void.
	 * @since 1.0
	 */
	fnHandleCLickOfAddFreightItem : function ( ) {
		splReusable.libs.SapSplStyleSheetLoader.loadStyle ( "./resources/styles/sapSplNewFreightItem" );

		var newFreightItemDialogView = sap.ui.view ( {
			viewName : "splView.dialogs.SplNewFreightItemDialog",
			type : sap.ui.core.mvc.ViewType.XML,
			viewData : this.getEmptyObjectOfFreightItem ( )
		} );

		var newFreightItemdialog = new sap.m.Dialog ( {
			title : oSapSplUtils.getBundle ( ).getText ( "NEW_FREIGHT_ITEM_ADD_DIALOG_TITLE" ),
			content : newFreightItemDialogView
		} ).addStyleClass ( "sapSplNewFreightItemDialog" ).open ( );

		newFreightItemdialog.attachAfterOpen ( function ( oEvent ) {
			oSapSplUtils.fnSyncStyleClass ( newFreightItemdialog );
			oEvent.getSource ( ).getContent ( )[0].rerender ( );
			window.setTimeout ( function ( ) {
				newFreightItemdialog.getContent ( )[0].getController ( ).byId ( "SapSplNewFreightItemFormContainerIdInput" ).focus ( );
			}, 200 );
		} );

		function fnHandleClose ( oEvent ) {
			oEvent.getSource ( ).destroy ( );
			this.fnCheckTimeValidation ( this );
		}
		newFreightItemdialog.attachAfterClose ( jQuery.proxy ( fnHandleClose, this ) );

		newFreightItemDialogView.getController ( ).setParentDialogInstance ( newFreightItemdialog );
	},

	/**
	 * @description  Method is called when "Assign Freight Item" link is pressed in location row.
	 * @param oEvent {object} press event object
	 * @returns void.
	 * @since 1.0
	 */
	fnHandlePressOfAssignFreightItem : function ( oEvent ) {

		var sIndex = parseInt ( oEvent.getSource ( ).getBindingContext ( ).sPath.split ( "/" )[2], 10 );
		var sViewData = {};
		var modelData = $.extend ( true, [], sap.ui.getCore ( ).getModel ( "SplCreateNewTourModel" ).getData ( ) );
		var items = modelData.stopsRow[sIndex].items;
		var allItems = modelData.Items;
		sViewData.rowIndex = sIndex;
		sViewData.fItems = items;
		sViewData.allItems = allItems;
		sViewData.tableInstance = this.byId ( "AddStopsLayout" );
		sViewData.oSaveButtonInstance = this.byId ( "sapSplCreateTourSubmit" );
		splReusable.libs.SapSplStyleSheetLoader.loadStyle ( "./resources/styles/sapSplAssignFreightItems" );

		var assignFreightItemsDialog = sap.ui.view ( {
			viewName : "splView.dialogs.SplAssignFreightItemsDialog",
			type : sap.ui.core.mvc.ViewType.XML,
			viewData : sViewData
		} );

		var assignFreightItemsdialog = new sap.m.Dialog ( {
			title : oSapSplUtils.getBundle ( ).getText ( "ASSIGN_FREIGHT_ITEMS_DIALOG_TITLE" ),
			content : assignFreightItemsDialog,
			contentWidth : "70%",
			contentHeight : "30%"

		} ).addStyleClass ( "sapSplAssignFreightItemsDialog" ).open ( );

		assignFreightItemsdialog.attachAfterOpen ( function ( ) {
			oSapSplUtils.fnSyncStyleClass ( assignFreightItemsdialog );
		} );

		assignFreightItemsDialog.getController ( ).setParentDialogInstance ( assignFreightItemsdialog );
	},

	/**
	 * @description  Method is called when "Remove Stop" link is pressed in Truck row.
	 * @param oEvent {object} press event object
	 * @returns void.
	 * @since 1.0
	 */
	fnHandleCLickOfRemoveTruck : function ( ) {
		var modelData = $.extend ( true, [], sap.ui.getCore ( ).getModel ( "SplCreateNewTourModel" ).getData ( ) ), that = this;
		if ( modelData.RegistrationNumber ) {
			if ( !oSapSplUtils.getIsDirty ( ) ) {
				oSapSplUtils.setIsDirty ( true );
			}
		}
		modelData.RegistrationNumber = null;
		modelData.VehicleUUID = null;
		modelData.DriverName = null;

		sap.ui.getCore ( ).getModel ( "SplCreateNewTourModel" ).setData ( modelData );

		window.setTimeout ( function ( ) {
			that.fnCheckTimeValidation ( that );
		}, 200 );

		/* Formatter method called explicitly */
		this.getView ( ).byId ( "sapSplCreateTourSubmit" ).setEnabled ( splReusable.libs.SapSplModelFormatters.enableAssignTourButton ( modelData ) );
	},

	/**
	 * @description  Method is called when "Drop Remaining Freight Items" link is pressed in location row.
	 * @param oEvent {object} press event object
	 * @returns void.
	 * @since 1.0
	 */
	fnHandlePressOfDropFreightItemLink : function ( oEvent ) {
		var sIndex, jIndex, currentRowIndex = parseInt ( oEvent.getSource ( ).getBindingContext ( ).sPath.split ( "/" )[2], 10 );
		var modelData = $.extend ( true, [], sap.ui.getCore ( ).getModel ( "SplCreateNewTourModel" ).getData ( ) ), affectedFreightItems = [];
		var that = this, flag = 0;

		for ( sIndex = 0 ; sIndex < modelData.Items.length ; sIndex++ ) {
			if ( modelData.Items[sIndex].dropActionHappened === "N" && modelData.Items[sIndex].pickActionHappened === "P" ) {
				// New Code
				if ( modelData.stopsRow[modelData.Items[sIndex].pickStopIndex].LocationUUID === modelData.stopsRow[modelData.stopsRow.length - 1].LocationUUID ) {
					affectedFreightItems.push ( {
						ItemUUID : modelData.Items[sIndex].UUID,
						ItemID : modelData.Items[sIndex].ItemID
					} );
				}
			}
		}

		if ( affectedFreightItems.length > 0 ) {
			var text1 = oSapSplUtils.getBundle ( ).getText ( "DROP_REMAINING_ITEMS_MSG" );
			this.fnOpenDeleteRearrangingStopsWarningDialog ( "L", text1, "", affectedFreightItems, currentRowIndex );
		} else {
			for ( sIndex = 0 ; sIndex < modelData.Items.length ; sIndex++ ) {
				if ( modelData.Items[sIndex].dropActionHappened === "N" && modelData.Items[sIndex].pickActionHappened === "P" ) {
					modelData.Items[sIndex].dropActionHappened = "D";
					modelData.Items[sIndex].dropStopIndex = currentRowIndex;
					for ( jIndex = 0 ; jIndex < modelData.stopsRow[currentRowIndex].items.length ; jIndex++ ) {
						if ( modelData.Items[sIndex].UUID === modelData.stopsRow[currentRowIndex].items[jIndex].ItemUUID ) {
							modelData.stopsRow[currentRowIndex].items[jIndex].Action = "D";
							modelData.stopsRow[currentRowIndex].items[jIndex].IsDeleted = "0";
							modelData.stopsRow[currentRowIndex].items[jIndex].pickup = oSapSplUtils.getBundle ( ).getText ( "FREIGHT_ITEM_ASSIGN_PICK_UP" );
							modelData.stopsRow[currentRowIndex].items[jIndex].drop = oSapSplUtils.getBundle ( ).getText ( "FREIGHT_ITEM_ASSIGN_DROP" );
							modelData.stopsRow[currentRowIndex].items[jIndex]["delete"] = oSapSplUtils.getBundle ( ).getText ( "DELETE" );
							this.fnToCaptureLiveChangeToSetFlag ( );
							flag = 1;
						}
					}
				}
			}

			/* updating model */
			sap.ui.getCore ( ).getModel ( "SplCreateNewTourModel" ).setData ( modelData );

			window.setTimeout ( function ( ) {
				var stopsLength = that.byId ( "AddStopsLayout" ).getContent ( ).length;
				var outerLayoutIndex = that.byId ( "AddStopsLayout" ).getContent ( )[stopsLength - 1].getContent ( ).length - 2;
				var dropLinkIndex = that.byId ( "AddStopsLayout" ).getContent ( )[stopsLength - 1].getContent ( )[outerLayoutIndex].getContent ( ).length - 1;
				if ( flag ) {
					document.getElementById ( that.byId ( "AddStopsLayout" ).getContent ( )[stopsLength - 1].getContent ( )[outerLayoutIndex].getContent ( )[dropLinkIndex].getId ( ) ).scrollIntoView ( true );
				}
				that.fnCheckTimeValidation ( that );
				sap.ui.getCore().byId("CreateNewTour--SapSplCreateNewTourVerticalLayout").rerender();
			}, 100 );
		}

	},

	fnHandlePressOfShiftStopToDownButton : function ( oEvent ) {
		var modelData = $.extend ( true, {}, sap.ui.getCore ( ).getModel ( "SplCreateNewTourModel" ).getData ( ) ), sIndex = parseInt ( oEvent.getSource ( ).getBindingContext ( ).sPath.split ( "/" )[2], 10 );
		var sFirstAction, sSecondAction, jIndex, kIndex, flag = false, affectedFreightItems = [], that = this;

		if ( this.byId ( "AddStopsLayout" ).getContent ( )[sIndex].getContent ( )[2].getContent ( )[0].getItems ( ).length !== 0 &&
				this.byId ( "AddStopsLayout" ).getContent ( )[sIndex + 1].getContent ( )[2].getContent ( )[0].getItems ( ).length !== 0 ) {
			for ( jIndex = 0 ; jIndex < modelData.stopsRow[sIndex].items.length ; jIndex++ ) {
				sFirstAction = modelData.stopsRow[sIndex].items[jIndex].Action;
				if ( sFirstAction === "P" ) {
					for ( kIndex = 0 ; kIndex < modelData.stopsRow[sIndex + 1].items.length ; kIndex++ ) {
						sSecondAction = modelData.stopsRow[sIndex + 1].items[kIndex].Action;
						if ( sSecondAction === "D" ) {
							if ( modelData.stopsRow[sIndex].items[jIndex].ItemUUID === modelData.stopsRow[sIndex + 1].items[kIndex].ItemUUID ) {
								if ( !flag ) {
									flag = true;
								}
								affectedFreightItems.push ( {
									ItemID : modelData.stopsRow[sIndex].items[jIndex].ItemID,
									UUID : modelData.stopsRow[sIndex].items[jIndex].ItemUUID,
									fIndex : jIndex,
									sIndex : kIndex
								} );
							}
						}
					}
				}
			}
		}

		if ( flag ) {
			var text1 = oSapSplUtils.getBundle ( ).getText ( "REARRANGING_STOPS_MSG" );
			var text2 = oSapSplUtils.getBundle ( ).getText ( "LIST_OF_FREIGHT_ITEMS_MSG" ) + ":";
			this.fnOpenDeleteRearrangingStopsWarningDialog ( "R", text1, text2, affectedFreightItems, sIndex, sIndex + 1, "P" );
		} else {

			modelData = this.fnCorrectItemsOnStopsRearranging ( sIndex, modelData, sIndex + 1 );
			modelData = this.fnCorrectItemsOnStopsRearranging ( sIndex + 1, modelData, sIndex );

			modelData = this.fnSwapStops ( sIndex, sIndex + 1, modelData );

			this.fnToCaptureLiveChangeToSetFlag ( );

			/* updating model */
			sap.ui.getCore ( ).getModel ( "SplCreateNewTourModel" ).setData ( modelData );

			window.setTimeout ( function ( ) {
				document.getElementById ( that.byId ( "AddStopsLayout" ).getContent ( )[sIndex].sId ).scrollIntoView ( true );
				that.fnCheckTimeValidation ( that );
				sap.ui.getCore().byId("CreateNewTour--SapSplCreateNewTourVerticalLayout").rerender();
			}, 200 );
		}

	},

	fnHandlePressOfShiftStopToUpButton : function ( oEvent ) {
		var sIndex = parseInt ( oEvent.getSource ( ).getBindingContext ( ).sPath.split ( "/" )[2], 10 ), modelData = $.extend ( true, {}, sap.ui.getCore ( ).getModel ( "SplCreateNewTourModel" ).getData ( ) );
		var jIndex, kIndex, flag = false, affectedFreightItems = [], that = this, sFirstAction, sSecondAction;

		if ( this.byId ( "AddStopsLayout" ).getContent ( )[sIndex].getContent ( )[2].getContent ( )[0].getItems ( ).length !== 0 &&
				this.byId ( "AddStopsLayout" ).getContent ( )[sIndex - 1].getContent ( )[2].getContent ( )[0].getItems ( ).length !== 0 ) {
			for ( jIndex = 0 ; jIndex < modelData.stopsRow[sIndex].items.length ; jIndex++ ) {
				sFirstAction = modelData.stopsRow[sIndex].items[jIndex].Action;
				if ( sFirstAction === "D" ) {
					for ( kIndex = 0 ; kIndex < modelData.stopsRow[sIndex - 1].items.length ; kIndex++ ) {
						sSecondAction = modelData.stopsRow[sIndex - 1].items[kIndex].Action;
						if ( sSecondAction === "P" ) {
							if ( modelData.stopsRow[sIndex].items[jIndex].ItemUUID === modelData.stopsRow[sIndex - 1].items[kIndex].ItemUUID ) {
								if ( !flag ) {
									flag = true;
								}
								affectedFreightItems.push ( {
									ItemID : modelData.stopsRow[sIndex].items[jIndex].ItemID,
									UUID : modelData.stopsRow[sIndex].items[jIndex].ItemUUID,
									fIndex : jIndex,
									sIndex : kIndex
								} );
							}
						}
					}
				}
			}
		}

		if ( flag ) {
			var text1 = oSapSplUtils.getBundle ( ).getText ( "REARRANGING_STOPS_MSG" );
			var text2 = oSapSplUtils.getBundle ( ).getText ( "LIST_OF_FREIGHT_ITEMS_MSG" ) + ":";
			this.fnOpenDeleteRearrangingStopsWarningDialog ( "R", text1, text2, affectedFreightItems, sIndex, sIndex - 1, "D" );
		} else {
			modelData = this.fnCorrectItemsOnStopsRearranging ( sIndex, modelData, sIndex - 1 );
			modelData = this.fnCorrectItemsOnStopsRearranging ( sIndex - 1, modelData, sIndex );

			modelData = this.fnSwapStops ( sIndex, sIndex - 1, modelData );

			this.fnToCaptureLiveChangeToSetFlag ( );

			/* updating model */
			sap.ui.getCore ( ).getModel ( "SplCreateNewTourModel" ).setData ( modelData );

			window.setTimeout ( function ( ) {
				document.getElementById ( that.byId ( "AddStopsLayout" ).getContent ( )[sIndex - 1].sId ).scrollIntoView ( true );
				that.fnCheckTimeValidation ( that );
				sap.ui.getCore().byId("CreateNewTour--SapSplCreateNewTourVerticalLayout").rerender();
			}, 200 );
		}

	},

	fnOpenDeleteRearrangingStopsWarningDialog : function ( dialogType, dialogText1, dialogText2, affectedFreightItems, fIndex, sIndex, action ) {

		splReusable.libs.SapSplStyleSheetLoader.loadStyle ( "./resources/styles/splDeleteRearrangingStopsWarningDialog" );

		var deleteWarningDialogView = sap.ui.view ( {
			viewName : "splView.dialogs.SplDeleteRearrangingStopsWarningDialog",
			type : sap.ui.core.mvc.ViewType.XML,
			viewData : {
				DialogText1 : dialogText1,
				DialogText2 : dialogText2,
				AffectedFreightItems : affectedFreightItems,
				firstStopIndex : fIndex,
				secondStopIndex : sIndex,
				Action : action,
				dialogType : dialogType
			}
		} );

		var deleteWarningDialog = new sap.m.Dialog ( {
			content : deleteWarningDialogView,
			title : oSapSplUtils.getBundle ( ).getText ( "WARNING" ),
			icon : "sap-icon://warning2"
		} ).addStyleClass ( "SapSplDeleteRearrangingWarningDialog" ).open ( );

		deleteWarningDialog.attachAfterOpen ( function ( ) {
			oSapSplUtils.fnSyncStyleClass ( deleteWarningDialog );
		} );

		function fnHandleClose ( oEvent ) {
			oEvent.getSource ( ).destroy ( );
			this.fnCheckTimeValidation ( this );

			if ( oEvent.getParameters ( ).origin.getId ( ).indexOf ( "sapSplDeleteRearrangingStopsWarningDialogCancel" ) === -1 ) {
				if ( dialogType !== "D" ) {
					document.getElementById ( this.byId ( "AddStopsLayout" ).getContent ( )[fIndex].getId ( ) ).scrollIntoView ( true );
				} else {
					if ( fIndex === 0 ) {
						document.getElementById ( this.byId ( "AddStopsLayout" ).getContent ( )[fIndex].getId ( ) ).scrollIntoView ( true );
					} else {
						document.getElementById ( this.byId ( "AddStopsLayout" ).getContent ( )[fIndex - 1].getId ( ) ).scrollIntoView ( true );
					}
				}
			}
			sap.ui.getCore().byId("CreateNewTour--SapSplCreateNewTourVerticalLayout").rerender();
		}
		deleteWarningDialog.attachAfterClose ( jQuery.proxy ( fnHandleClose, this ) );

		deleteWarningDialogView.getController ( ).setParentDialogInstance ( deleteWarningDialog );
	},

	fnSwapStops : function ( fIndex, sIndex, modelData ) {

		var tempStop = modelData.stopsRow[fIndex];
		modelData.stopsRow[fIndex] = modelData.stopsRow[sIndex];
		modelData.stopsRow[sIndex] = tempStop;

		var flag = modelData.stopsRow[fIndex].leavesTimeVisible;
		modelData.stopsRow[fIndex].leavesTimeVisible = modelData.stopsRow[sIndex].leavesTimeVisible;
		modelData.stopsRow[sIndex].leavesTimeVisible = flag;

		return modelData;
	},

	fnCorrectItemsOnStopsRearranging : function ( sIndex, modelData, newIndex ) {
		var kIndex, jIndex;

		for ( kIndex = 0 ; kIndex < modelData.stopsRow[sIndex].items.length ; kIndex++ ) {
			if ( modelData.stopsRow[sIndex].items[kIndex].Action !== "N" ) {
				for ( jIndex = 0 ; jIndex < modelData.Items.length ; jIndex++ ) {
					if ( modelData.Items[jIndex].UUID === modelData.stopsRow[sIndex].items[kIndex].ItemUUID ) {
						if ( modelData.stopsRow[sIndex].items[kIndex].Action === "P" ) {
							modelData.Items[jIndex].pickStopIndex = newIndex;
						} else {
							modelData.Items[jIndex].dropStopIndex = newIndex;
						}
						break;
					}
				}
			}
		}
		return modelData;
	},

	fnCheckTimeValidation : function ( that, errorStopIndex, dateTimeIndex ) {
		var modelData = sap.ui.getCore ( ).getModel ( "SplCreateNewTourModel" ).getData ( );
		var sIndex, flag = 0;

		for ( sIndex = 0 ; sIndex < modelData.stopsRow.length ; sIndex++ ) {
			if ( sIndex !== 0 ) {
				if ( new Date ( modelData.stopsRow[sIndex]["Planned.ArrivalTime"] ) < new Date ( modelData.stopsRow[sIndex - 1]["Planned.DepartureTime"] ) ) {
					that.byId ( "AddStopsLayout" ).getContent ( )[sIndex].getContent ( )[0].getContent ( )[3].removeStyleClass ( "sapSPlCreateTourTimeControl sapSplCreateTourMarginLeftSpace" );
					that.byId ( "AddStopsLayout" ).getContent ( )[sIndex].getContent ( )[0].getContent ( )[3].addStyleClass ( "sapSPlCreateTourTimeControlError sapSplCreateTourMarginLeftSpace" );
					flag = 1;
				}
			}
			if ( new Date ( modelData.stopsRow[sIndex]["Planned.DepartureTime"] ) < new Date ( modelData.stopsRow[sIndex]["Planned.ArrivalTime"] ) ) {
				that.byId ( "AddStopsLayout" ).getContent ( )[sIndex].getContent ( )[0].getContent ( )[5].removeStyleClass ( "sapSPlCreateTourTimeControl sapSplCreateTourMarginLeftSpace" );
				that.byId ( "AddStopsLayout" ).getContent ( )[sIndex].getContent ( )[0].getContent ( )[5].addStyleClass ( "sapSPlCreateTourTimeControlError sapSplCreateTourMarginLeftSpace" );
				flag = 1;
			}
		}
		if ( errorStopIndex !== undefined && dateTimeIndex !== undefined ) {
			that.byId ( "AddStopsLayout" ).getContent ( )[errorStopIndex].getContent ( )[0].getContent ( )[dateTimeIndex].removeStyleClass ( "sapSPlCreateTourTimeControl sapSplCreateTourMarginLeftSpace" );
			that.byId ( "AddStopsLayout" ).getContent ( )[errorStopIndex].getContent ( )[0].getContent ( )[dateTimeIndex].addStyleClass ( "sapSPlCreateTourTimeControlError sapSplCreateTourMarginLeftSpace" );
			flag = 1;
		}

		//fix incident 1580118058
		if( flag === 1 ) {
			/* Formatter method called explicitly */
			that.getView ( ).byId ( "sapSplCreateTourSubmit" ).setEnabled ( false );
			that.getView ( ).byId ( "sapSplCreateTourSaveForlater" ).setEnabled ( false );
		} else {
			/* Formatter method called explicitly */
			that.getView ( ).byId ( "sapSplCreateTourSubmit" ).setEnabled ( splReusable.libs.SapSplModelFormatters.enableAssignTourButton ( modelData ) );
			that.getView ( ).byId ( "sapSplCreateTourSaveForlater" ).setEnabled ( splReusable.libs.SapSplModelFormatters.enableSaveTourButton ( modelData.RegistrationNumber ) );
		}
		

	},

	/**
	 * @description  Method is called when "Add Stop" button is pressed.
	 * @param void
	 * @returns void.
	 * @since 1.0
	 */
	fnHandlePressOfAddStop : function ( oEvent ) {
		var modelData = sap.ui.getCore ( ).getModel ( "SplCreateNewTourModel" ).getData ( ), sIndex = parseInt ( oEvent.getSource ( ).getBindingContext ( ).sPath.split ( "/" )[2], 10 ), itemsArray;
		var that = this, jIndex;

		/* Adding Intermediate stop */
		itemsArray = this.getItemsArray ( modelData );
		var emptyObj = this.getEmptyStopObject ( true, true );
		emptyObj.items = itemsArray;

		/* Making existing last stop's leaves here input field to visible true */
		if ( (sIndex + 1) === modelData.stopsRow.length ) {
			emptyObj.leavesTimeVisible = false;
			modelData.stopsRow[sIndex].leavesTimeVisible = true;
		}
		emptyObj["Planned.DepartureTime"] = modelData.stopsRow[sIndex]["Planned.DepartureTime"];
		emptyObj["Planned.ArrivalTime"] = modelData.stopsRow[sIndex]["Planned.DepartureTime"];

		// Checking for Last Stop
		if ( sIndex !== (modelData.stopsRow.length - 1) ) {
			// As intermediate stop is deleted next stop pick or drop index
			// should be decreased by 1
			for ( jIndex = 0 ; jIndex < modelData.Items.length ; jIndex++ ) {
				if ( modelData.Items[jIndex].pickStopIndex >= sIndex + 1 ) {
					modelData.Items[jIndex].pickStopIndex++;
				}
				if ( modelData.Items[jIndex].dropStopIndex >= sIndex + 1 ) {
					modelData.Items[jIndex].dropStopIndex++;
				}
			}
		}

		modelData.stopsRow.splice ( sIndex + 1, 0, emptyObj );

		this.fnToCaptureLiveChangeToSetFlag ( );

		/* updating model */
		sap.ui.getCore ( ).getModel ( "SplCreateNewTourModel" ).setData ( modelData );

		window.setTimeout ( function ( ) {
			document.getElementById ( that.byId ( "AddStopsLayout" ).getContent ( )[sIndex].getId ( ) ).scrollIntoView ( true );
			that.fnCheckTimeValidation ( that );
			sap.ui.getCore().byId("CreateNewTour--SapSplCreateNewTourVerticalLayout").rerender();
		}, 200 );
	},

	getItemsArray : function ( ) {

		var sIndex, itemsArray = $.extend ( true, [], sap.ui.getCore ( ).getModel ( "SplCreateNewTourModel" ).getData ( ).Items );
		for ( sIndex = 0 ; sIndex < itemsArray.length ; sIndex++ ) {
			itemsArray[sIndex].Action = "N";
			itemsArray[sIndex].IsDeleted = "0";
			itemsArray[sIndex].ItemUUID = sap.ui.getCore ( ).getModel ( "SplCreateNewTourModel" ).getData ( ).Items[sIndex].UUID;
			delete (itemsArray[sIndex].dropActionHappened);
			delete (itemsArray[sIndex].dropStopIndex);
			delete (itemsArray[sIndex].pickActionHappened);
			delete (itemsArray[sIndex].pickStopIndex);
			delete (itemsArray[sIndex].UUID);
			delete (itemsArray[sIndex].isEdit);
		}
		return itemsArray;
	},

	fnHandleValueHelpOfTrucks : function ( ) {

		splReusable.libs.SapSplStyleSheetLoader.loadStyle ( "./resources/styles/sapSplSelectTruckDialog" );
		var selectTruckDialogView = sap.ui.view ( {
			viewName : "splView.dialogs.SplSelectTruckDialog",
			type : sap.ui.core.mvc.ViewType.XML
		} ).addStyleClass ( "splSelectTruckDialogContainerView" );

		var selectTruckDialog = new sap.m.Dialog ( {
			content : new sap.ui.layout.VerticalLayout ( ).addStyleClass ( "viewHolderLayout" ).addContent ( selectTruckDialogView ),
			customHeader : new sap.m.Bar ( {
				contentMiddle : new sap.m.Label ( {
					text : oSapSplUtils.getBundle ( ).getText ( "SELECT_TRUCK_DIALOG_TITLE" )
				} )
			} ),
			contentWidth : "40%"
		} ).addStyleClass ( "splSapSelectTruckDialog" ).open ( );

		selectTruckDialog.attachAfterOpen ( function ( ) {
			oSapSplUtils.fnSyncStyleClass ( selectTruckDialog );
		} );

		selectTruckDialogView.getController ( ).setParentDialogInstance ( selectTruckDialog );
	},

	fnHandleValueHelpOfLocations : function ( oEvent ) {

		var stopIndex = parseInt ( oEvent.getSource ( ).getBindingContext ( ).sPath.split ( "/" )[2], 10 );

		splReusable.libs.SapSplStyleSheetLoader.loadStyle ( "./resources/styles/sapSplSelectLocation" );
		var selectLocationDialogView = sap.ui.view ( {
			viewName : "splView.dialogs.SplSelectLocationDialog",
			type : sap.ui.core.mvc.ViewType.XML,
			viewData : {
				rowIndex : stopIndex
			}
		} ).addStyleClass ( "splSelectLocationDialogContainerView" );

		var selectLocationDialog = new sap.m.Dialog ( {
			content : selectLocationDialogView,
			title : oSapSplUtils.getBundle ( ).getText ( "SELECT_STOP" ),
			contentWidth : "40%",
			contentHeight : "40%"
		} ).addStyleClass ( "splSapSelectLocationDialog" ).open ( );

		selectLocationDialog.attachAfterOpen ( function ( ) {
			oSapSplUtils.fnSyncStyleClass ( selectLocationDialog );
			window.setTimeout ( function ( ) {
				selectLocationDialog.getContent ( )[0].getController ( ).byId ( "SapSplSelectLocationSearch" ).focus ( );
			}, 200 );
		} );

		selectLocationDialogView.getController ( ).setParentDialogInstance ( selectLocationDialog );

		function fnHandleClose ( oEvent ) {
			oEvent.getSource ( ).destroy ( );
			this.fnCheckTimeValidation ( this );
			window.setTimeout ( function ( ) {
				sap.ui.getCore().byId("CreateNewTour--CreateNewTour").rerender();
			}, 20 );
			
			if ( !oEvent.getParameters ( ).origin ) {
				document.getElementById ( this.byId ( "AddStopsLayout" ).getContent ( )[stopIndex].getId ( ) ).scrollIntoView ( true );
			}

		}
		selectLocationDialog.attachAfterClose ( jQuery.proxy ( fnHandleClose, this ) );
	},

	/**
	 * @description  Method is called when delete icon is pressed in Freight Items row.
	 * @param oEvent {object} press event object
	 * @returns void.
	 * @since 1.0
	 */
	fnHandlePressOfDeleteAddFreightItemsRow : function ( oEvent ) {

		var sIndex, jIndex, kIndex, modelData = $.extend ( true, {}, sap.ui.getCore ( ).getModel ( "SplCreateNewTourModel" ).getData ( ) );
		var that = this;

		for ( sIndex = 0 ; sIndex < modelData.Items.length ; sIndex++ ) {
			if ( modelData.Items[sIndex].UUID === oEvent.getSource ( ).getBindingContext ( ).getProperty ( ).UUID ) {
				break;
			}
		}
		if ( sIndex !== modelData.Items.length ) {
			modelData.Items.splice ( sIndex, 1 );
			for ( jIndex = 0 ; jIndex < modelData.stopsRow.length ; jIndex++ ) {
				for ( kIndex = 0 ; kIndex < modelData.stopsRow[jIndex].items.length ; kIndex++ ) {
					if ( modelData.stopsRow[jIndex].items[kIndex].ItemUUID === oEvent.getSource ( ).getBindingContext ( ).getProperty ( ).UUID ) {
						modelData.stopsRow[jIndex].items.splice ( kIndex, 1 );
						break;
					}
				}
			}
		}
		this.fnToCaptureLiveChangeToSetFlag ( );

		sap.ui.getCore ( ).getModel ( "SplCreateNewTourModel" ).setData ( modelData );

		window.setTimeout ( function ( ) {
			that.fnCheckTimeValidation ( that );
			sap.ui.getCore().byId("CreateNewTour--SapSplCreateNewTourVerticalLayout").rerender();
		}, 200 );
	},

	fnHandlePressOfDeleteStop : function ( oEvent ) {
		var modelData = $.extend ( true, {}, sap.ui.getCore ( ).getModel ( "SplCreateNewTourModel" ).getData ( ) );
		var sIndex = parseInt ( oEvent.getSource ( ).getBindingContext ( ).sPath.split ( "/" )[2], 10 ), jIndex, affectedFreightItems = [];
		var that = this;

		for ( jIndex = 0 ; jIndex < modelData.stopsRow[sIndex].items.length ; jIndex++ ) {
			if ( modelData.stopsRow[sIndex].items[jIndex].Action !== "N" ) {
				affectedFreightItems.push ( {
					UUID : modelData.stopsRow[sIndex].items[jIndex].ItemUUID,
					ItemID : modelData.stopsRow[sIndex].items[jIndex].ItemID
				} );
			}
		}

		if ( affectedFreightItems.length > 0 ) {
			var text1 = oSapSplUtils.getBundle ( ).getText ( "DELETE_STOP_DIALOG_MSG" );
			var text2 = oSapSplUtils.getBundle ( ).getText ( "LIST_OF_FREIGHT_ITEMS_MSG" ) + ":";
			this.fnOpenDeleteRearrangingStopsWarningDialog ( "D", text1, text2, affectedFreightItems, sIndex );
		} else {

			if ( sIndex < (modelData.stopsRow.length - 1) ) {
				for ( jIndex = 0 ; jIndex < modelData.Items.length ; jIndex++ ) {
					if ( modelData.Items[jIndex].dropStopIndex > sIndex ) {
						modelData.Items[jIndex].dropStopIndex--;
					}

					if ( modelData.Items[jIndex].pickStopIndex > sIndex ) {
						modelData.Items[jIndex].pickStopIndex--;
					}
				}
			} else {
				modelData.stopsRow[sIndex - 1].leavesTimeVisible = false;
			}

			modelData.stopsRow.splice ( sIndex, 1 );
			this.fnToCaptureLiveChangeToSetFlag ( );

			sap.ui.getCore ( ).getModel ( "SplCreateNewTourModel" ).setData ( modelData );

			window.setTimeout ( function ( ) {
				that.fnCheckTimeValidation ( that );
				if ( sIndex === 0 ) {
					document.getElementById ( that.byId ( "AddStopsLayout" ).getContent ( )[sIndex + 1].getId ( ) ).scrollIntoView ( true );
				} else {
					document.getElementById ( that.byId ( "AddStopsLayout" ).getContent ( )[sIndex - 1].getId ( ) ).scrollIntoView ( true );
				}
				sap.ui.getCore().byId("CreateNewTour--SapSplCreateNewTourVerticalLayout").rerender();
			}, 200 );
		}

	},

	/**
	 * @description  Method is called when delete icon is pressed in Assign Freight Items row.
	 * @param oEvent {object} press event object
	 * @returns void.
	 * @since 1.0
	 */
	fnHandlePressOfDeleteAssignFreightItemsRow : function ( oEvent ) {

		var modelData = $.extend ( true, {}, sap.ui.getCore ( ).getModel ( "SplCreateNewTourModel" ).getData ( ) );
		var sIndex = parseInt ( oEvent.getSource ( ).getBindingContext ( ).sPath.split ( "/" )[2], 10 );
		var jIndex = parseInt ( oEvent.getSource ( ).getBindingContext ( ).sPath.split ( "/" )[4], 10 );
		var kIndex, lIndex, that = this;

		modelData.stopsRow[sIndex].items[jIndex].IsDeleted = "1";
		modelData.stopsRow[sIndex].items[jIndex].Action = "N";
		modelData.stopsRow[sIndex].items[jIndex].PartnerOrderID = null;
		modelData.stopsRow[sIndex].items[jIndex].ExternalStopDestination = null;

		for ( kIndex = 0 ; kIndex < modelData.Items.length ; kIndex++ ) {
			if ( modelData.stopsRow[sIndex].items[jIndex].ItemUUID === modelData.Items[kIndex].UUID ) {
				if ( parseInt ( modelData.Items[kIndex].pickStopIndex, 10 ) === sIndex ) {
					modelData.Items[kIndex].pickActionHappened = "N";
					modelData.Items[kIndex].pickStopIndex = -1;
					if ( parseInt ( modelData.Items[kIndex].dropStopIndex, 10 ) !== -1 ) {
						for ( lIndex = 0 ; lIndex < modelData.stopsRow[parseInt ( modelData.Items[kIndex].dropStopIndex, 10 )].items.length ; lIndex++ ) {
							if ( modelData.stopsRow[sIndex].items[jIndex].ItemUUID === modelData.stopsRow[parseInt ( modelData.Items[kIndex].dropStopIndex, 10 )].items[lIndex].ItemUUID ) {
								modelData.stopsRow[parseInt ( modelData.Items[kIndex].dropStopIndex, 10 )].items[lIndex].Action = "N";
								modelData.stopsRow[parseInt ( modelData.Items[kIndex].dropStopIndex, 10 )].items[lIndex].IsDeleted = "0";
								modelData.stopsRow[parseInt ( modelData.Items[kIndex].dropStopIndex, 10 )].items[lIndex].PartnerOrderID = null;
								modelData.stopsRow[parseInt ( modelData.Items[kIndex].dropStopIndex, 10 )].items[lIndex].ExternalStopDestination = null;
								modelData.Items[kIndex].dropActionHappened = "N";
								modelData.Items[kIndex].dropStopIndex = -1;
								break;
							}
						}
					}
				}
				if ( parseInt ( modelData.Items[kIndex].dropStopIndex, 10 ) === sIndex ) {
					modelData.Items[kIndex].dropActionHappened = "N";
					modelData.Items[kIndex].dropStopIndex = -1;
				}
				break;
			}
		}
		this.fnToCaptureLiveChangeToSetFlag ( );

		sap.ui.getCore ( ).getModel ( "SplCreateNewTourModel" ).setData ( modelData );

		window.setTimeout ( function ( ) {
			document.getElementById ( that.byId ( "AddStopsLayout" ).getContent ( )[sIndex].getId ( ) ).scrollIntoView ( true );
			that.fnCheckTimeValidation ( that );
			sap.ui.getCore().byId("CreateNewTour--SapSplCreateNewTourVerticalLayout").rerender();
		}, 200 );
	},

	/**
	 * @description  factory function to bind "rows" as aggregation to AdStopsMatrixLayout in fragment.
	 * @param void.
	 * @returns void.
	 * @since 1.0
	 */
	factoryFunctiontoBindAggregationForMatrixLayout : function ( ) {
		var that = this;
		var x = sap.ui.xmlfragment ( "a", "splReusable.fragments.AddStopsMatrixLayoutRow", this );

		var table = sap.ui.core.Fragment.byId ( "a", "SapSplAssignFreightItemsTable" );
		var template = sap.ui.core.Fragment.byId ( "a", "SplSapAssignFrieghtItemsColumnListItem" );
		var vlayout = sap.ui.core.Fragment.byId ( "a", "sapSclAddStopsMatrixRowLayoutVerticalLayout" );

		sap.ui.core.Fragment.byId ( "a", "SapSplAssignFreightItemsTable" ).addEventDelegate ( {
			onBeforeRendering : function ( e ) {
				var aFilters = [new sap.ui.model.Filter ( "Action", sap.ui.model.FilterOperator.NE, "N" ), new sap.ui.model.Filter ( "IsDeleted", sap.ui.model.FilterOperator.EQ, "0" )];
				e.srcControl.getBinding ( "items" ).filter ( new sap.ui.model.Filter ( aFilters, true ) );
			}
		} );

		function bindRowsFactoryFunction ( sId, bObject ) {
			var vlayoutClone = vlayout.clone ( );

			vlayoutClone.getContent ( )[0].getContent ( )[3].attachBrowserEvent ( "click", this.fnHandleClickOfDateTimeInput );
			vlayoutClone.getContent ( )[0].getContent ( )[5].attachBrowserEvent ( "click", this.fnHandleClickOfDateTimeInput );

			vlayoutClone.getContent ( )[2].getContent ( )[0].bindItems ( {
				path : bObject.sPath + "/items",
				template : template,
				templateShareable : true
			// this makes it clear to the framework that you will use the
			// template for multiple calls.
			} );

			// no return the clone
			return vlayoutClone;
		}

		this.byId ( "AddStopsLayout" ).bindAggregation ( "content", "/stopsRow", jQuery.proxy ( bindRowsFactoryFunction, that ) );
	},

	fnHandleClickOfDateTimeInput : function ( oEvent ) {
		var date, savedInputTime;
		if ( oEvent && oEvent.target && oEvent.target.parentNode && oEvent.target.parentNode.parentNode && oEvent.target.parentNode.parentNode.parentNode && oEvent.target.parentNode.parentNode.parentNode.parentNode &&
				oEvent.target.parentNode.parentNode.parentNode.parentNode.parentNode && oEvent.target.parentNode.parentNode.parentNode.parentNode.parentNode.id &&
				sap.ui.getCore ( ).byId ( oEvent.target.parentNode.parentNode.parentNode.parentNode.parentNode.id ) ) {
			date = sap.ui.getCore ( ).byId ( oEvent.target.parentNode.parentNode.parentNode.parentNode.parentNode.id ).getValue ( );
		}

		savedInputTime = date;
		this.getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getController ( ).savedInputTime = savedInputTime;
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

	/**
	 * @description  Method is called when back arrow button is pressed in header
	 * @param void.
	 * @returns void.
	 * @since 1.0
	 */
	fnHandlePressOfBackButton : function ( ) {
		var that = this;
		if ( oSapSplUtils.getIsDirty ( ) ) {
			sap.m.MessageBox.show ( oSapSplUtils.getBundle ( ).getText ( "DATA_LOSS_WARNING_TEXT" ), sap.m.MessageBox.Icon.WARNING, oSapSplUtils.getBundle ( ).getText ( "WARNING" ), [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
					function ( selection ) {
						if ( selection === "YES" ) {
							oSapSplUtils.setIsDirty ( false );
							that.getView ( ).getParent ( ).back ( );
						}
					}, null, oSapSplUtils.fnSyncStyleClass ( "messageBox" ) );
		} else {
			that.getView ( ).getParent ( ).back ( );
		}

	},

	/**
	 * @description  Method is called when Action buttons ("Pick Up" or "Drop") is pressed in Assign Freight Items row.
	 * @param oEvent {object} press event object
	 * @returns void.
	 * @since 1.0
	 */
	fnHandlePressOfActionButton : function ( oEvent ) {
		var modelData = $.extend ( true, {}, sap.ui.getCore ( ).getModel ( "SplCreateNewTourModel" ).getData ( ) );
		var sIndex = parseInt ( oEvent.getSource ( ).getBindingContext ( ).sPath.split ( "/" )[2], 10 );
		var jIndex = parseInt ( oEvent.getSource ( ).getBindingContext ( ).sPath.split ( "/" )[4], 10 );
		var kIndex;

		if ( oEvent.getSource ( ).sId.indexOf ( "SapSplAssignFreightItemsTableButton_1" ) > 0 ) {
			modelData.stopsRow[sIndex].items[jIndex].Action = "P";
		} else {
			modelData.stopsRow[sIndex].items[jIndex].Action = "D";
		}

		for ( kIndex = 0 ; kIndex < modelData.Items.length ; kIndex++ ) {
			if ( modelData.stopsRow[sIndex].items[jIndex].ItemUUID === modelData.Items[kIndex].UUID ) {
				if ( modelData.stopsRow[sIndex].items[jIndex].Action === "P" ) {
					modelData.Items[kIndex].pickActionHappened = "P";
					modelData.Items[kIndex].pickStopIndex = sIndex;
					if ( modelData.Items[kIndex].dropStopIndex === sIndex ) {
						modelData.Items[kIndex].dropActionHappened = "N";
						modelData.Items[kIndex].dropStopIndex = -1;
					}
				} else if ( modelData.stopsRow[sIndex].items[jIndex].Action === "D" ) {
					modelData.Items[kIndex].dropActionHappened = "D";
					modelData.Items[kIndex].dropStopIndex = sIndex;
					if ( modelData.Items[kIndex].pickStopIndex === sIndex ) {
						modelData.Items[kIndex].pickActionHappened = "N";
						modelData.Items[kIndex].pickStopIndex = -1;
					}
				} else {
					if ( modelData.Items[kIndex].pickStopIndex === sIndex ) {
						modelData.Items[kIndex].pickActionHappened = "N";
						modelData.Items[kIndex].pickStopIndex = -1;
					} else if ( modelData.Items[kIndex].dropStopIndex === sIndex ) {
						modelData.Items[kIndex].dropActionHappened = "N";
						modelData.Items[kIndex].dropStopIndex = -1;
					}
				}
				break;
			}
		}

		sap.ui.getCore ( ).getModel ( "SplCreateNewTourModel" ).setData ( modelData );
	},

	fnHandleChangeOfDateTimeInput : function ( oEvent ) {

		var rows = this.byId ( "AddStopsLayout" ).getContent ( );
		var flag = 0, sIndex, that = this;
		var currentStopIndex = parseInt ( oEvent.getSource ( ).getBindingContext ( ).sPath.split ( "/" )[2], 10 );
		var currentIndex = currentStopIndex;
		var modelData = $.extend ( true, {}, sap.ui.getCore ( ).getModel ( "SplCreateNewTourModel" ).getData ( ) ), dateTimeIndex;

		if ( oEvent.getSource ( ).sId.indexOf ( "sapSplStopsLeavesTimeInput" ) > 0 ) {
			dateTimeIndex = 5;
			if ( new Date ( oEvent.getSource ( ).getValue ( ) ) < new Date ( oEvent.getSource ( ).getBindingContext ( ).getProperty ( )["Planned.ArrivalTime"] ) ) {
				flag = 1;
				modelData.stopsRow[currentStopIndex]["Planned.DepartureTime"] = new Date ( this.savedInputTime );
			}
		} else {
			dateTimeIndex = 3;
			if ( currentStopIndex !== 0 ) {
				if ( new Date ( oEvent.getSource ( ).getValue ( ) ) < new Date ( rows[currentStopIndex - 1].getBindingContext ( ).getProperty ( )["Planned.DepartureTime"] ) ) {
					flag = 1;
					modelData.stopsRow[currentStopIndex]["Planned.ArrivalTime"] = new Date ( this.savedInputTime );
				}
			}
		}
		if ( !flag ) {
			for ( sIndex = currentStopIndex ; sIndex < rows.length ; sIndex++ ) {
				// Arrives here time of every stop except for current stop
				if ( sIndex !== currentStopIndex ) {
					if ( new Date ( oEvent.getSource ( ).getValue ( ) ) >= new Date ( rows[sIndex].getContent ( )[0].getContent ( )[3].getValue ( ) ) ) {
						modelData.stopsRow[sIndex]["Planned.ArrivalTime"] = new Date ( oEvent.getSource ( ).getValue ( ) );
					}
				} else {
					modelData.stopsRow[sIndex]["Planned.ArrivalTime"] = new Date ( modelData.stopsRow[sIndex]["Planned.ArrivalTime"] );
				}

				// Leaves here time of every stop
				if ( new Date ( oEvent.getSource ( ).getValue ( ) ) >= new Date ( rows[sIndex].getContent ( )[0].getContent ( )[5].getValue ( ) ) ) {
					modelData.stopsRow[sIndex]["Planned.DepartureTime"] = new Date ( oEvent.getSource ( ).getValue ( ) );
				} else {
					modelData.stopsRow[sIndex]["Planned.DepartureTime"] = new Date ( modelData.stopsRow[sIndex]["Planned.DepartureTime"] );
				}
			}
		}
		this.fnToCaptureLiveChangeToSetFlag ( );
		sap.ui.getCore ( ).getModel ( "SplCreateNewTourModel" ).setData ( modelData );

		window.setTimeout ( function ( ) {
			if ( flag === 1 ) {
				that.fnCheckTimeValidation ( that, currentStopIndex, dateTimeIndex );
			} else {
				that.fnCheckTimeValidation ( that );
			}
			document.getElementById ( that.byId ( "AddStopsLayout" ).getContent ( )[currentIndex].getId ( ) ).scrollIntoView ( true );
			sap.ui.getCore().byId("CreateNewTour--SapSplCreateNewTourVerticalLayout").rerender();
		}, 200 );

	},

	/**
	 * @description  Method is called when "Submit" or "Save" button is pressed in footer
	 * @param oEvent {object} press event object
	 * @returns void.
	 * @since 1.0
	 */
	fnHandelPressOfSubmitButton : function ( oEvent ) {

		var oPayload, type, modelData = sap.ui.getCore ( ).getModel ( "SplCreateNewTourModel" ).getData ( ), that = this;

		oSapSplBusyDialog.getBusyDialogInstance ( {
			title : oSapSplUtils.getBundle ( ).getText ( "BUSY_DIALOG_MESSAGE" )
		} ).open ( );

		oPayload = this.preparePayload ( oEvent.getSource ( ).getId ( ) );
		if ( modelData.isEdit ) {
			type = "PUT";
		} else {
			type = "POST";
		}
		oSapSplBusyDialog.getBusyDialogInstance ( {
			title : oSapSplUtils.getBundle ( ).getText ( "BUSY_DIALOG_MESSAGE" )
		} ).open ( );
		window.setTimeout ( function ( ) {
			oSapSplAjaxFactory.fireAjaxCall ( {
				url : oSapSplUtils.getFQServiceUrl ( "/sap/spl/xs/app/services/tour.xsjs" ),
				method : type,
				async : false,
				data : JSON.stringify ( oPayload ),
				success : function ( data, success, messageObject ) {
					var oCustomData = new sap.ui.core.CustomData ( {
						key : "bRefreshTile",
						value : true
					} );
					oSplBaseApplication.getAppInstance ( ).getCurrentPage ( ).destroyCustomData ( );
					oSplBaseApplication.getAppInstance ( ).getCurrentPage ( ).addCustomData ( oCustomData );
					oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
					if ( data.constructor === String ) {
						data = JSON.parse ( data );
					}
					if ( messageObject["status"] === 200 && data["Error"].length === 0 ) {
						if ( !modelData.isEdit ) {
							sap.ca.ui.message.showMessageToast ( oSapSplUtils.getBundle ( ).getText ( "TOUR_CREATED_SUCCESSFULLY", data.Header[0].Name ) );
						} else {
							sap.ca.ui.message.showMessageToast ( oSapSplUtils.getBundle ( ).getText ( "SUCCESSFUL_EDIT", data.Header[0].Name ) );
						}
						if ( modelData.isEdit ) {
							that.getView ( ).getParent ( ).to ( "TourDetails" );
						} else {
							that.getView ( ).getParent ( ).to ( "ToursOverview" );
						}
					} else {
						var errorMessage = oSapSplUtils.getErrorMessagesfromErrorPayload ( data )["ufErrorObject"];
						
						sap.m.MessageBox.error(oSapSplUtils.getErrorMessagesfromErrorPayload ( data )["errorWarningString"], {
							actions: [sap.m.MessageBox.Action.OK],
							details: errorMessage,
							styleClass: "sapUiSizeCompact"
						});
					}
					oSapSplUtils.setIsDirty ( false );
				},
				error : function ( error ) {
					oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
					if ( error && error["status"] === 500 ) {
						
						sap.m.MessageBox.error(error["status"] + " " + error.statusText, {
							actions: [sap.m.MessageBox.Action.OK],
							details: error.responseText,
							styleClass: "sapUiSizeCompact"
						});
					} else {
						if ( error.responseText.constructor === String ) {
							error.responseText = JSON.parse ( error.responseText );
						}
						
						sap.m.MessageBox.error(oSapSplUtils.getErrorMessagesfromErrorPayload ( error.responseText )["errorWarningString"], {
							actions: [sap.m.MessageBox.Action.OK],
							details: oSapSplUtils.getErrorMessagesfromErrorPayload ( error.responseText )["ufErrorObject"],
							styleClass: "sapUiSizeCompact"
						});
					}
				},
				complete : function ( ) {

				}

			} );
		}, 40 );
	},

	/**
	 * @description  Method to prepare payload for either creating or editing a tour
	 * @param void
	 * @returns {object} payload.
	 * @since 1.0
	 */
	preparePayload : function ( sourceID ) {
		var payload = {}, tourUUID, modelData = sap.ui.getCore ( ).getModel ( "SplCreateNewTourModel" ).getData ( );
		if ( modelData.isEdit ) {
			tourUUID = modelData.UUID;
		} else {
			tourUUID = oSapSplUtils.getUUID ( );
		}
		payload["Header"] = [this.prepareHeader ( tourUUID, sourceID )];
		payload["Text"] = [this.prepareText ( tourUUID )];
		payload["Stop"] = this.prepareStop ( tourUUID );
		payload["Item"] = this.prepareItems ( tourUUID );
		payload["StopItemAssignment"] = this.prepareStopItemAssignment ( tourUUID, payload["Stop"] );
		payload["isTourMarkedForCompletion"] = "0";
		//Changes made for demo
		
		payload["Stop"][0].Status='I';
		payload["Header"][0].CurrentStop=payload["Stop"][0].UUID;
		
		
		return payload;
	},

	/**
	 * @description  Method to prepare header payload
	 * @param {string} tourUUID
	 * @returns {object} payloadHeader.
	 * @since 1.0
	 */
	prepareHeader : function ( tourUUID, sourceID ) {
		var payloadHeader = {}, modelData;
		modelData = $.extend ( true, {}, sap.ui.getCore ( ).getModel ( "SplCreateNewTourModel" ).getData ( ) );

		payloadHeader["UUID"] = tourUUID;
		payloadHeader["TourID"] = this.byId ( "sapSplTourIDInput" ).getValue ( );
		if ( this.byId ( "sapSplSelectTruckInput" ).getValue ( ) && this.byId ( "sapSplSelectTruckInput" ).getValue ( ).length !== 0 ) {
			payloadHeader["VehicleUUID"] = modelData.VehicleUUID;
			// payloadHeader["Status"] = "S"; //U-Unassigned S-Assigned,
			// C-Accepted, F-Finished
		} else {
			payloadHeader["VehicleUUID"] = null;
			// payloadHeader["Status"] = "U"; //U-Unassigned S-Assigned,
			// C-Accepted, F-Finished
		} // Inactive & Unassigned
		if ( sourceID.indexOf ( "sapSplCreateTourSaveForlater" ) !== -1 ) {
			payloadHeader["VehicleUUID"] = null;
			if ( modelData.isEdit ) {
				if ( payloadHeader["VehicleUUID"] ) {
					payloadHeader["Status"] = modelData.status;
				} else {
					/* Fix CSN 0120031469 810117 2014 */
					if ( modelData.status === "S" || modelData.status === "U" ) {
						payloadHeader["Status"] = "U";
					} else if ( modelData.status === "C" ) {
						payloadHeader["Status"] = modelData.status;
					}
				}

			} else {
				payloadHeader["Status"] = "U";
			}

		} else {
			payloadHeader["Status"] = "I";
		}
		payloadHeader["OwnerID"] = oSapSplUtils.getCompanyDetails ( ).BasicInfo_CompanyID;
		payloadHeader["Name"] = this.byId ( "sapSplTourNameInput" ).getValue ( );

		payloadHeader["EventSchema"] = "default";

		payloadHeader["Planned.StartTime"] = new Date ( modelData.stopsRow[0]["Planned.ArrivalTime"] ).toJSON ( );
		payloadHeader["Planned.EndTime"] = new Date ( modelData.stopsRow[modelData.stopsRow.length - 1]["Planned.DepartureTime"] ).toJSON ( );

		payloadHeader["Actual.StartTime"] = null;
		payloadHeader["Actual.EndTime"] = null;
		payloadHeader["isDeleted"] = null;
		payloadHeader["AuditTrail.CreatedBy"] = null;
		payloadHeader["AuditTrail.ChangedBy"] = null;
		payloadHeader["AuditTrail.CreationTime"] = null;
		payloadHeader["AuditTrail.ChangeTime"] = null;
		return payloadHeader;
	},

	/**
	 * @description  Method to prepare text payload
	 * @param {string} tourUUID
	 * @returns {object} payloadText.
	 * @since 1.0
	 */
	prepareText : function ( tourUUID ) {
		var payloadText = {};

		payloadText["UUID"] = tourUUID; // Foreign Key from Header Table
		/*
		 * CSN FIX : 0120031469 682358 2014 Remove the Language attribute from
		 * the payload
		 */
		payloadText["Text"] = this.byId ( "sapSplCommentsInput" ).getValue ( );

		return payloadText;
	},

	/**
	 * @description  Method to prepare stop payload
	 * @param {string} tourUUID
	 * @returns {array} payloadStop.
	 * @since 1.0
	 */
	prepareStop : function ( tourUUID ) {
		var stop = {}, modelData, sIndex;
		var payloadStop = [];
		modelData = $.extend ( true, {}, sap.ui.getCore ( ).getModel ( "SplCreateNewTourModel" ).getData ( ) );
		for ( sIndex = 0 ; sIndex < modelData.stopsRow.length ; sIndex++ ) {
			stop = {};
			if ( modelData.stopsRow[sIndex].UUID ) {
				stop["UUID"] = modelData.stopsRow[sIndex].UUID;
			} else {
				stop["UUID"] = oSapSplUtils.getUUID ( );
			}

			stop["TourUUID"] = tourUUID; // Foreign Key from Header Table
			stop["Sequence"] = (sIndex + 1).toString ( );

			if ( modelData.stopsRow[sIndex]["Address.Name1"] !== null ) {
				stop["Name"] = modelData.stopsRow[sIndex]["Name"];
			} else {
				stop["Name"] = null;
			}

			stop["Description"] = null;
			stop["Geocordinate"] = null;
			if ( modelData.isEdit ) {
				stop["Status"] = modelData.stopsRow[sIndex].Status;
				stop["LastReportedEvent"] = modelData.stopsRow[sIndex].LastReportedEvent;
			} else {
				stop["Status"] = " "; // D-Departed, A-Arrived(isActive), '
										// '(No status)
				stop["LastReportedEvent"] = null;
			}

			stop["StopPartnerUUID"] = modelData.stopsRow[sIndex].StopPartnerUUID;
			stop["StopPartnerName"] = modelData.stopsRow[sIndex].StopPartnerName;

			stop["Planned.ArrivalTime"] = new Date ( modelData.stopsRow[sIndex]["Planned.ArrivalTime"] ).toJSON ( );
			stop["Planned.DepartureTime"] = new Date ( modelData.stopsRow[sIndex]["Planned.DepartureTime"] ).toJSON ( );

			stop["Actual.ArrivalTime"] = null;
			stop["Actual.DepartureTime"] = null;
			if ( modelData.stopsRow[sIndex]["LocationUUID"] ) {
				stop["LocationUUID"] = modelData.stopsRow[sIndex]["LocationUUID"];
			} else {
				stop["LocationUUID"] = null;
			}

			stop["isDeleted"] = null;
			payloadStop.push ( stop );
		}
		return payloadStop;
	},

	/**
	 * @description  Method to prepare Freight Items payload
	 * @param {string} tourUUID
	 * @returns {array} payloadItems.
	 * @since 1.0
	 */
	prepareItems : function ( tourUUID ) {
		var payloadItems = [];
		var item = {}, sIndex, modelData = $.extend ( true, {}, sap.ui.getCore ( ).getModel ( "SplCreateNewTourModel" ).getData ( ) );
		for ( sIndex = 0 ; sIndex < modelData.Items.length ; sIndex++ ) {
			item = {};
			item["UUID"] = modelData.Items[sIndex]["UUID"];
			item["ItemID"] = modelData.Items[sIndex]["ItemID"];
			item["TourUUID"] = tourUUID; // Foreign Key from Header Table
			item["Type"] = modelData.Items[sIndex]["Type"]; // C-Container,
															// B-Break Bulk

			item["ContainerType"] = modelData.Items[sIndex]["ContainerType"];
			item["Description"] = modelData.Items[sIndex]["Description"];

			item["Quantity.Value"] = modelData.Items[sIndex]["Quantity_Value"];
			item["Quantity.Unit"] = modelData.Items[sIndex]["Quantity_Unit"];

			item["Weight.Value"] = modelData.Items[sIndex]["Weight_Value"];
			item["Weight.Unit"] = modelData.Items[sIndex]["Weight_Unit"];

			item["Volume.Value"] = modelData.Items[sIndex]["Volume_Value"];
			item["Volume.Unit"] = modelData.Items[sIndex]["Volume_Unit"];

			item["DangerGoodsClass"] = modelData.Items[sIndex]["DangerGoodsClass"];
			item["isDeleted"] = null;
			payloadItems.push ( item );
		}
		return payloadItems;
	},

	/**
	 * @description  Method to prepare Freight Items Stop Assignment payload
	 * @param {string} tourUUID
	 * @param {array} stops stops payload array
	 * @returns {array} payloadStopItemAssignment.
	 * @since 1.0
	 */
	prepareStopItemAssignment : function ( tourUUID, stops ) {
		var itemAssignment = {};
		var payloadStopItemAssignment = [];
		var sIndex, jIndex, modelData = $.extend ( true, {}, sap.ui.getCore ( ).getModel ( "SplCreateNewTourModel" ).getData ( ) );
		for ( sIndex = 0 ; sIndex < modelData.stopsRow.length ; sIndex++ ) {
			for ( jIndex = 0 ; jIndex < modelData.stopsRow[sIndex].items.length ; jIndex++ ) {
				if ( modelData.stopsRow[sIndex].items[jIndex].Action === "P" || modelData.stopsRow[sIndex].items[jIndex].Action === "D" ) {
					itemAssignment = {};
					itemAssignment["UUID"] = oSapSplUtils.getUUID ( );
					itemAssignment["TourUUID"] = tourUUID; // Foreign Key from
															// Header Table
					itemAssignment["StopUUID"] = stops[sIndex].UUID; // Foreign
																		// Key
																		// from
																		// Stop
																		// Table
					itemAssignment["ItemUUID"] = modelData.stopsRow[sIndex].items[jIndex].ItemUUID; // Foreign
																									// Key
																									// from
																									// Item
																									// Table
					itemAssignment["Type"] = modelData.stopsRow[sIndex].items[jIndex].Action; // P-Pickup,
																								// D-Drop
					itemAssignment["PartnerOrderID"] = modelData.stopsRow[sIndex].items[jIndex].PartnerOrderID;
					itemAssignment["ExternalStopDestination"] = modelData.stopsRow[sIndex].items[jIndex].ExternalStopDestination;
					itemAssignment["isDeleted"] = null;
					payloadStopItemAssignment.push ( itemAssignment );
				}
			}
		}
		return payloadStopItemAssignment;
	},

	fnToHandleTourNameInputLiveChange : function ( ) {
		var modelData = $.extend ( true, {}, sap.ui.getCore ( ).getModel ( "SplCreateNewTourModel" ).getData ( ) );
		this.fnToCaptureLiveChangeToSetFlag ( );
		if ( !modelData.TourInputNameChanged ) {
			modelData.TourInputNameChanged = true;
			sap.ui.getCore ( ).getModel ( "SplCreateNewTourModel" ).setData ( modelData );
		}
	},

	fnHandleValueHelpForBuPaList : function ( oEvent ) {
		var that = this;
		this.rowIndex = parseInt ( oEvent.getSource ( ).getBindingContext ( ).getPath ( ).split ( "/" )[2], 10 );
		var oSelectPartnerDialog = new sap.m.Dialog ( {
			title : oSapSplUtils.getBundle ( ).getText ( "SELECT_PARTNER_DIALOG_TITLE" ),
			content : [new sap.m.Page ( {
				customHeader : new sap.m.Toolbar ( ).addContent ( new sap.m.SearchField ( {
					search : jQuery.proxy ( that.fnHandleBuPaListSearchForStops, that )
				} ) ),
				content : [new sap.m.List ( {
					id : "sapSnlhPartnerList",
					mode : "SingleSelectMaster",
					items : {
						path : "/MyBusinessPartners",
						sorter : [new sap.ui.model.Sorter ( "Role.description", false, function ( oContext ) {
							var sKey = oContext.getProperty ( "Role.description" ).toLowerCase ( );
							return {
								key : sKey,
								text : sKey
							};
						} )],
						filters : [new sap.ui.model.Filter ( "Role", sap.ui.model.FilterOperator.EQ, "CONTAINERTRMNL" ),
						           new sap.ui.model.Filter ( "Role", sap.ui.model.FilterOperator.EQ, "ELHUB" ),
						           new sap.ui.model.Filter ( "Role", sap.ui.model.FilterOperator.EQ, "LSPACEOP" )],
						template : new sap.m.StandardListItem ( {
							title : "{Organization_Name}",
							icon : {
								path : "{ImageUrl}",
								formatter : splReusable.libs.SapSplModelFormatters.getImageUrlForOrganization
							}
						} )
					},
					select : jQuery.proxy ( that.fnSelectPartnerFromList, that )
				} ).setModel ( sap.ui.getCore ( ).getModel ( "ToursOverviewODataModel" ) )]
			} )],
			contentWidth : "20%",
			contentHeight : "50%",
			beginButton : new sap.m.Button ( {
				text : oSapSplUtils.getBundle ( ).getText ( "CANCEL" ),
				press : function ( e ) {
					e.getSource ( ).getParent ( ).close ( );
				}
			} )
		} );
		oSelectPartnerDialog.open ( );
	},

	fnSelectPartnerFromList : function ( oEvent ) {
		var modelData = sap.ui.getCore ( ).getModel ( "SplCreateNewTourModel" ).getData ( );

		oSapSplUtils.setIsDirty ( true );

		modelData.stopsRow[this.rowIndex].StopPartnerName = oEvent.getSource ( ).getSelectedItem ( ).getBindingContext ( ).getProperty ( )["Organization_Name"];
		modelData.stopsRow[this.rowIndex].StopPartnerUUID = oEvent.getSource ( ).getSelectedItem ( ).getBindingContext ( ).getProperty ( )["UUID"];

		sap.ui.getCore ( ).getModel ( "SplCreateNewTourModel" ).setData ( modelData );
		oEvent.getSource ( ).getParent ( ).getParent ( ).close ( );
	},

	/*payload preparation for search service*/
	prepareSearchPayload : function ( searchTerm ) {
		var payload = {};
		payload.ObjectType = "BusinessPartner";
		payload.SearchTerm = searchTerm;
		payload.FuzzinessThershold = SapSplEnums.fuzzyThreshold;
		payload.MaximumNumberOfRecords = 50;
		payload.ProvideDetails = false;
		payload.SearchInNetwork = true;
		payload.AdditionalCriteria = {};
		payload.AdditionalCriteria.BusinessPartnerType = "O";
		payload.AdditionalCriteria.SearchPending = true;
		payload.AdditionalCriteria.Role = ["CONTAINERTRMNL"];
		return payload;
	},

	/* Calling Search Service for user query string */
	callSearchService : function ( oPayload ) {
		var oSapSplSearchFilters, oSapSplMyBusinessPartnerFilters = [], oSapSplMyBusinessPartnerSorter, oSapSplMyBusinessPartnerList;
		var that = this;
		oSapSplAjaxFactory.fireAjaxCall ( {
			url : oSapSplUtils.getFQServiceUrl ( "/sap/spl/xs/app/services/Search.xsjs" ),
			method : "POST",
			async : false,
			dataType : "json",
			cache : false,
			beforeSend : function ( request ) {
				request.setRequestHeader ( "X-CSRF-Token", oSapSplUtils.getCSRFToken ( ) );
				request.setRequestHeader ( "Content-Type", "application/json; charset=UTF-8" );
			},
			data : JSON.stringify ( oPayload ),
			success : function ( data, success, messageObject ) {
				oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );

				if ( messageObject["status"] === 200 ) {

					oSapSplMyBusinessPartnerList = sap.ui.getCore ( ).byId ( "sapSnlhPartnerList" );
					oSapSplMyBusinessPartnerFilters.push ( new sap.ui.model.Filter ( "Role", sap.ui.model.FilterOperator.EQ, "CONTAINERTRMNL" ) );

					oSapSplMyBusinessPartnerSorter = new sap.ui.model.Sorter ( "Role.description", false, function ( oContext ) {
						var sKey = oContext.getProperty ( "Role.description" ).toLowerCase ( );
						return {
							key : sKey,
							text : sKey
						};
					} );

					oSapSplMyBusinessPartnerList.unbindAggregation ( "items" );
					if ( data.length > 0 ) {

						oSapSplSearchFilters = oSapSplUtils.getSearchItemFilters ( data );

						if ( oSapSplSearchFilters.aFilters.length > 0 ) {
							oSapSplMyBusinessPartnerFilters.push ( oSapSplSearchFilters );
						}

						oSapSplMyBusinessPartnerList.bindItems ( {
							path : "/MyBusinessPartners",
							template : new sap.m.StandardListItem ( {
								title : "{Organization_Name}",
								icon : {
									path : "{ImageUrl}",
									formatter : splReusable.libs.SapSplModelFormatters.getImageUrlForOrganization
								}
							} )
						} );
						oSapSplMyBusinessPartnerList.getBinding ( "items" ).sort ( oSapSplMyBusinessPartnerSorter );
						oSapSplMyBusinessPartnerList.getBinding ( "items" ).filter ( oSapSplMyBusinessPartnerFilters );
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
			}

		} );
	},

	/* Condition checking for handling search query for user  */
	fnHandleBuPaListSearchForStops : function ( oEvent ) {
		var searchString = oEvent.getParameters ( ).query;
		var payload,sKey,oSapSplMyBusinessPartnerFilterIsOwner,oSapSplMyBusinessPartnerSorter;
		var oSapSplMyBusinessPartnerList = sap.ui.getCore ( ).byId ( "sapSnlhPartnerList" );
		if ( searchString.length > 2 ) {
			payload = this.prepareSearchPayload ( searchString );
			this.callSearchService ( payload );
		} else if ( oSapSplMyBusinessPartnerList.getBinding ( "items" ) === undefined || oSapSplMyBusinessPartnerList.getBinding ( "items" ).aFilters.length > 0 ) {

			oSapSplMyBusinessPartnerFilterIsOwner = new sap.ui.model.Filter ( "Role", sap.ui.model.FilterOperator.EQ, "CONTAINERTRMNL" );

			oSapSplMyBusinessPartnerSorter = new sap.ui.model.Sorter ( "Role.description", false, function ( oContext ) {
				sKey = oContext.getProperty ( "Role.description" ).toLowerCase ( );
				return {
					key : sKey,
					text : sKey
				};
			} );

			oSapSplMyBusinessPartnerList.unbindAggregation ( "items" );
			oSapSplMyBusinessPartnerList.bindItems ( {
				path : "/MyBusinessPartners",
				template : new sap.m.StandardListItem ( {
					title : "{Organization_Name}",
					icon : {
						path : "{ImageUrl}",
						formatter : splReusable.libs.SapSplModelFormatters.getImageUrlForOrganization
					}
				} )
			} );
			oSapSplMyBusinessPartnerList.getBinding ( "items" ).sort ( oSapSplMyBusinessPartnerSorter );
			oSapSplMyBusinessPartnerList.getBinding ( "items" ).filter ( [oSapSplMyBusinessPartnerFilterIsOwner] );
		}
	}

} );
