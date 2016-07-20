/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.controller ( "splController.dialogs.SplSelectTruckDialog", {

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 */
	onInit : function ( ) {
		//this.oViewData = this.getView().getViewData();

		this.oSplSelectTruckModel = new sap.ui.model.json.JSONModel ( );
		this.oSplSelectTruckModel.setSizeLimit ( 100000 );
		this.oSplSelectTruckModel.setData ( {} );
		this.getView ( ).setModel ( this.oSplSelectTruckModel );

		this.navContainer = this.byId ( "SapSplSelectTruckDialogNavContainer" );
		this.getListOfAvailableTrucks ( );
		/*Localization*/
		this.fnDefineControlLabelsFromLocalizationBundle ( );

	},

	getListOfAvailableTrucks : function ( ) {

		var that = this;

		sap.ui.getCore ( ).getModel ( "TourCreateAssignTruckList" ).read ( "/MyTrackableObjects", null, ["$filter=Status ne 'I' and isDeleted ne '1'"], false, function ( oData ) {

			oData.ShowTours = oSapSplUtils.getBundle ( ).getText ( "SHOW_TOURS" );

			that.oSplSelectTruckModel.setData ( oData );

		}, function ( ) {

		} );
	},

	getListOfVehicleAssignedTours : function ( truckUUID ) {

		var aTours = [];
		sap.ui.getCore ( ).getModel ( "ToursOverViewPageODataModel" ).read ( "/Tours", null, ["$expand=Stops&$filter= VehicleUUID eq X\'" + oSapSplUtils.base64ToHex ( truckUUID ) + "\'", "$orderby=Planned_StartTime  desc,RegistrationNumber"], false,
				function ( oData ) {

					aTours = oData.results;

				}, function ( ) {} );

		return aTours;
	},

	/**
	 * @description Method to handle localization of all the hard code texts in the view.
	 * @param void.
	 * @returns void.
	 * @since 1.0
	 */
	fnDefineControlLabelsFromLocalizationBundle : function ( ) {

		this.byId ( "SapSplSelectTruckDialogTableColumnHeader_LicencePlate" ).setText ( oSapSplUtils.getBundle ( ).getText ( "LICENCE_PLATE" ) );
		this.byId ( "SapSplSelectTruckDialogTableColumnHeader_DriverName" ).setText ( oSapSplUtils.getBundle ( ).getText ( "DRIVER" ) );
		this.byId ( "SapSplSelectTruckDialogTableColumnHeader_Vehicletype" ).setText ( oSapSplUtils.getBundle ( ).getText ( "VEHICLE_TYPE" ) );
		this.byId ( "SapSplSelectTruckDialogTableColumnHeader_OtherTours" ).setText ( oSapSplUtils.getBundle ( ).getText ( "OTHER_TOURS" ) );

		/*CSNFIX 1315295 2014*/
		this.byId ( "SapSplSelectTruckDialogTableHeader" ).setText ( oSapSplUtils.getBundle ( ).getText ( "NUMBER_OF_AVAILABLE_TRUCKS", [this.oSplSelectTruckModel.getData ( ).results.length] ) );
		this.byId ( "SapSplSelectTruckDialogTable" ).setNoDataText ( oSapSplUtils.getBundle ( ).getText ( "NO_TRUCKS_TEXT" ) );
		this.byId ( "SapSplTourDetailsDialogTable" ).setNoDataText ( oSapSplUtils.getBundle ( ).getText ( "TOURS_NO_DATA" ) );
		this.byId ( "SapSplTourDetailsDialogTableColumnHeader_TourName" ).setText ( oSapSplUtils.getBundle ( ).getText ( "TOUR_NAME" ) );
		this.byId ( "SapSplTourDetailsDialogTableColumnHeader_Date" ).setText ( oSapSplUtils.getBundle ( ).getText ( "DATE" ) );
		this.byId ( "SapSplTourDetailsDialogTableColumnHeader_Arrive" ).setText ( oSapSplUtils.getBundle ( ).getText ( "ARRIVE" ) );
		this.byId ( "SapSplTourDetailsDialogTableColumnHeader_Leave" ).setText ( oSapSplUtils.getBundle ( ).getText ( "LEAVE" ) );
		this.byId ( "SapSplTourDetailsDialogTableColumnHeader_Stops" ).setText ( oSapSplUtils.getBundle ( ).getText ( "STOPS" ) );

	},

	setParentDialogInstance : function ( oParentDialog ) {
		this.oParentDialogInstance = oParentDialog;
		this.setButtonForDialog ( );
		this.selectTableItem ( );
	},

	selectTableItem : function ( ) {
		var modelData = sap.ui.getCore ( ).getModel ( "SplCreateNewTourModel" ).getData ( ), sIndex;
		var vehicleList = this.byId ( "SapSplSelectTruckDialogTable" );
		if ( modelData.VehicleUUID ) {
			for ( sIndex = 0 ; sIndex < vehicleList.getItems ( ).length ; sIndex++ ) {
				if ( vehicleList.getItems ( )[sIndex].getBindingContext ( ).getProperty ( ).UUID === modelData.VehicleUUID ) {
					vehicleList.setSelectedItem ( vehicleList.getItems ( )[sIndex] );
					break;
				}
			}
		}
	},

	setButtonForDialog : function ( ) {

		this.oSapSplNewLocationOkButton = new sap.m.Button ( {
			press : jQuery.proxy ( this.fnHandlePressOfNewLocationDialogOk, this )
		} );

		this.oSapSplNewLocationCancelButton = new sap.m.Button ( {
			press : jQuery.proxy ( this.fnHandlePressOfNewLocationDialogCancel, this )
		} );

		this.oSapSplNewLocationOkButton.setText ( oSapSplUtils.getBundle ( ).getText ( "OK_BUTTON_TEXT" ) );
		this.oSapSplNewLocationCancelButton.setText ( oSapSplUtils.getBundle ( ).getText ( "CANCEL" ) );
		this.oParentDialogInstance.setBeginButton ( this.oSapSplNewLocationOkButton );
		this.oParentDialogInstance.setEndButton ( this.oSapSplNewLocationCancelButton );
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

	fnHandlePressOfNewLocationDialogOk : function ( ) {

		var modelData = $.extend ( true, {}, sap.ui.getCore ( ).getModel ( "SplCreateNewTourModel" ).getData ( ) );
		var selectedTruck = this.byId ( "SapSplSelectTruckDialogTable" ).getSelectedItems ( );
		if ( selectedTruck.length > 0 ) {
			var selectedTruckBindingObject = selectedTruck[0].getBindingContext ( ).getProperty ( );

			modelData.RegistrationNumber = selectedTruckBindingObject["RegistrationNumber"];
			modelData.DriverName = selectedTruckBindingObject["DriverName"];
			modelData.VehicleUUID = selectedTruckBindingObject["UUID"];
			sap.ui.getCore ( ).getModel ( "SplCreateNewTourModel" ).setData ( modelData );
			this.fnToCaptureLiveChangeToSetFlag ( );

		}

		this.getView ( ).getParent ( ).getParent ( ).close ( );
		this.getView ( ).getParent ( ).getParent ( ).destroy ( );
	},

	fnHandlePressOfNewLocationDialogCancel : function ( ) {
		this.getView ( ).getParent ( ).getParent ( ).close ( );
		this.getView ( ).getParent ( ).getParent ( ).destroy ( );
	},
	fnHandlePressOfBackButtonToSendMessagePage : function ( ) {

	},
	fnHandlePressOfShowTours : function ( oEvent ) {
		var that = this, sIndex, jIndex, tempTour, temp1, temp2;

		var tours = this.getListOfVehicleAssignedTours ( oEvent.getSource ( ).getBindingContext ( ).getProperty ( ).UUID );
		var toursArray = [];
		var modelData = $.extend ( true, {}, this.oSplSelectTruckModel.getData ( ) );

		for ( sIndex = 0 ; sIndex < tours.length ; sIndex++ ) {
			if ( tours[sIndex].VehicleUUID !== null && tours[sIndex].VehicleUUID === oEvent.getSource ( ).getBindingContext ( ).getProperty ( ).UUID ) {

				for ( jIndex = 0 ; jIndex < tours[sIndex].Stops.results.length ; jIndex++ ) {
					tours[sIndex].Stops.results[jIndex]["Planned_ArrivalDate"] = tours[sIndex].Stops.results[jIndex]["Planned_ArrivalTime"];
				}
				tempTour = $.extend ( true, [], tours[sIndex].Stops.results );
				for ( jIndex = 1 ; jIndex < tours[sIndex].Stops.results.length ; jIndex++ ) {
					temp1 = (typeof (tours[sIndex].Stops.results[jIndex]["Planned_ArrivalDate"]) === "object") ? tours[sIndex].Stops.results[jIndex]["Planned_ArrivalDate"].getFullYear ( ) : (new Date ( parseInt (
							tours[sIndex].Stops.results[jIndex]["Planned_ArrivalDate"].match ( /([0-9])+/g )[0], 10 ) )).getFullYear ( );
					temp2 = (typeof (tours[sIndex].Stops.results[jIndex - 1]["Planned_ArrivalDate"]) === "object") ? tours[sIndex].Stops.results[jIndex - 1]["Planned_ArrivalDate"].getFullYear ( ) : (new Date ( parseInt (
							tours[sIndex].Stops.results[jIndex - 1]["Planned_ArrivalDate"].match ( /([0-9])+/g )[0], 10 ) )).getFullYear ( );
					if ( temp1 === temp2 ) {
						temp1 = (typeof (tours[sIndex].Stops.results[jIndex]["Planned_ArrivalDate"]) === "object") ? tours[sIndex].Stops.results[jIndex]["Planned_ArrivalDate"].getMonth ( ) : (new Date ( parseInt (
								tours[sIndex].Stops.results[jIndex]["Planned_ArrivalDate"].match ( /([0-9])+/g )[0], 10 ) )).getMonth ( );
						temp2 = (typeof (tours[sIndex].Stops.results[jIndex - 1]["Planned_ArrivalDate"]) === "object") ? tours[sIndex].Stops.results[jIndex - 1]["Planned_ArrivalDate"].getMonth ( ) : (new Date ( parseInt (
								tours[sIndex].Stops.results[jIndex - 1]["Planned_ArrivalDate"].match ( /([0-9])+/g )[0], 10 ) )).getMonth ( );
						if ( temp1 === temp2 ) {
							temp1 = (typeof (tours[sIndex].Stops.results[jIndex]["Planned_ArrivalDate"]) === "object") ? tours[sIndex].Stops.results[jIndex]["Planned_ArrivalDate"].getDate ( ) : (new Date ( parseInt (
									tours[sIndex].Stops.results[jIndex]["Planned_ArrivalDate"].match ( /([0-9])+/g )[0], 10 ) )).getDate ( );
							temp2 = (typeof (tours[sIndex].Stops.results[jIndex - 1]["Planned_ArrivalDate"]) === "object") ? tours[sIndex].Stops.results[jIndex - 1]["Planned_ArrivalDate"].getDate ( ) : (new Date ( parseInt (
									tours[sIndex].Stops.results[jIndex - 1]["Planned_ArrivalDate"].match ( /([0-9])+/g )[0], 10 ) )).getDate ( );
							if ( temp1 === temp2 ) {
								tempTour[jIndex]["Planned_ArrivalDate"] = "";
							}
						}
					}
				}
				tours[sIndex].Stops.results = tempTour;
				toursArray.push ( tours[sIndex] );
			}
		}
		//this.oParentDialogInstance.destroyEndButton();
		this.oParentDialogInstance.setBeginButton ( this.oSapSplNewLocationCancelButton );
		modelData.tours = toursArray;
		this.oSplSelectTruckModel.setData ( modelData );

		this.navContainer.to ( this.navContainer.getPages ( )[1].sId, "slide" );
		this.oParentDialogInstance.getCustomHeader ( ).getContentMiddle ( )[0].setText ( oSapSplUtils.getBundle ( ).getText ( "TOUR_DETAILS_LABEL", oEvent.getSource ( ).getBindingContext ( ).getProperty ( ).RegistrationNumber ) );
		this.oParentDialogInstance.getCustomHeader ( ).addContentLeft ( new sap.m.Button ( {
			icon : "sap-icon://nav-back",
			press : function ( ) {
				this.getParent ( ).getParent ( ).getCustomHeader ( ).getContentMiddle ( )[0].setText ( oSapSplUtils.getBundle ( ).getText ( "SELECT_TRUCK_DIALOG_TITLE" ) );
				this.getParent ( ).getParent ( ).getCustomHeader ( ).removeAllContentLeft ( );
				that.oParentDialogInstance.setBeginButton ( that.oSapSplNewLocationOkButton );
				that.oParentDialogInstance.setEndButton ( that.oSapSplNewLocationCancelButton );
				that.navContainer.back ( );
			}
		} ) );
	}

/**
 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
 */
//  onExit: function() {
//  }
} );
