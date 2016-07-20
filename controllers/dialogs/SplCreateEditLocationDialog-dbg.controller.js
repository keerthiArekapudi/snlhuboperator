/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.require ( "sap.ca.ui.message.message" );
sap.ui.controller ( "splController.dialogs.SplCreateEditLocationDialog", {

	fnMakeChangesToRulesTableBasedOnData : function ( oLocationData, sMode ) {
		var oWithTourItem = this.byId ( "sapSplRadarGeofenceRulesTableRunsWithTourItem" ), oWithoutTourItem = this.byId ( "sapSplRadarGeofenceRulesTableRunsWithoutTourItem" );
		var selectedItem = null;
		if ( sap.ui.getCore ( ).getModel ( "sapSplAppConfigDataModel" ).getData ( )["canViewRulesWithoutTour"] !== 1 ) {
			oWithoutTourItem.setVisible ( false );
			oWithTourItem.setSelected ( true );
			oWithTourItem.addStyleClass( "listItemWithoutSelect" );
//			oWithTourItem.getParent ( ).fireSelect ( {
//				listItem : oWithTourItem
//			} );
		}
		/* Fix for incident : 1580045801 */
		if ( sMode === "Edit" ) {
			if ( oLocationData.isRadar === "1" ) {
				this.byId ( "splCheckboxForInBoundMessaging" ).setSelected ( true );
				this.byId ( "splCheckboxForInBoundMessaging" ).fireSelect ( );
				this._isRadarGeofence = true;
			} else {
				this._isRadarGeofence = false;
			}
			if ( oLocationData.RunsWithTour === "1" ) {
				oWithTourItem.setSelected ( true );
				selectedItem = oWithTourItem;
			} else if ( oLocationData.RunsWithTour === "0" ) {
				oWithoutTourItem.setSelected ( true );
				selectedItem = oWithoutTourItem;
			}
			if ( oLocationData.Entry === "1" ) {
				selectedItem.getCells ( )[1].setSelected ( true );
			} else if ( oLocationData.Entry === "0" ) {
				selectedItem.getCells ( )[1].setSelected ( false );
			}
			if ( oLocationData.Exit === "1" ) {
				selectedItem.getCells ( )[2].setSelected ( true );
			} else if ( oLocationData.Exit === "0" ) {
				selectedItem.getCells ( )[2].setSelected ( false );
			}
		}
	},

	fnHandleSelectOfRuleTableItem : function ( oEvent ) {
		var oWithTourItem = this.byId ( "sapSplRadarGeofenceRulesTableRunsWithTourItem" ), oWithoutTourItem = this.byId ( "sapSplRadarGeofenceRulesTableRunsWithoutTourItem" );
		var selectedItem = oEvent.getParameters ( ).listItem;

		if ( selectedItem.sId === oWithTourItem.sId ) {
			oWithTourItem.getCells ( )[1].setEnabled ( true );
			oWithTourItem.getCells ( )[2].setEnabled ( true );
			oWithoutTourItem.getCells ( )[1].setEnabled ( false );
			oWithoutTourItem.getCells ( )[2].setEnabled ( false );
			oWithTourItem.getCells ( )[1].setSelected ( true );
			oWithTourItem.getCells ( )[2].setSelected ( true );
			oWithoutTourItem.getCells ( )[1].setSelected ( false );
			oWithoutTourItem.getCells ( )[2].setSelected ( false );
		} else {
			oWithoutTourItem.getCells ( )[1].setEnabled ( true );
			oWithoutTourItem.getCells ( )[2].setEnabled ( true );
			oWithTourItem.getCells ( )[1].setEnabled ( false );
			oWithTourItem.getCells ( )[2].setEnabled ( false );
			oWithoutTourItem.getCells ( )[1].setSelected ( true );
			oWithoutTourItem.getCells ( )[2].setSelected ( true );
			oWithTourItem.getCells ( )[1].setSelected ( false );
			oWithTourItem.getCells ( )[2].setSelected ( false );
		}
	},

	fnFetchStatusTrackingDetails : function ( ) {
		var oLiveAppInstance = this.getView ( ).getViewData ( )[3];
		var oLocationData = this.getView ( ).getViewData ( )[2];
		this.byId ( "sapSplBusinessPartnersTrackedList" ).setBusy ( true );
		if ( oLiveAppInstance ) {
			oLiveAppInstance.getLocationDetailsFromLocationID ( oLocationData.LocationID, oLocationData.Type, function ( aData ) {
				this.byId ( "sapSplBusinessPartnersTrackedList" ).setBusy ( false );
				var oData = this.getView ( ).getModel ( ).getData ( );
				oData["status"] = aData.results;
				this.getView ( ).getModel ( ).setData ( oData );
			}.bind ( jQuery.extend ( true, {}, this ) ), function ( ) {
				jQuery.sap.log.error ( "fnHandleLocationDetailsDisplay", "Failure of function call", "liveApp.controller.js" );
			}, false, "StatusOfRadars", true );
		}
	},

	fnFetchIncidentsAndGatesAssigned : function ( ) {
		/* Fix for incident 1580131002 */
		var oLiveAppInstance = this.getView ( ).getViewData ( )[3];
		var oLocationData = this.getView ( ).getViewData ( )[2];
		if ( oLiveAppInstance ) {

			if ( sap.ui.getCore ( ).getModel ( "sapSplAppConfigDataModel" ).getData ( )["isIncidentEditable"] !== 0 ) {
				oLiveAppInstance.getLocationDetailsFromLocationID ( oLocationData.LocationID, oLocationData.Type, function ( aData ) {
					var oData = this.getView ( ).getModel ( ).getData ( );
					oData["Incidents"] = aData;
					this.getView ( ).getModel ( ).setData ( oData );
				}.bind ( jQuery.extend ( true, {}, this ) ), function ( ) {
					jQuery.sap.log.error ( "fnHandleLocationDetailsDisplay", "Failure of function call", "liveApp.controller.js" );
				}, false, "Incidents", true );
			}
			
			this.byId( "splValueHelpForLocationGates" ).setBusy( true );
			oLiveAppInstance.getLocationDetailsFromLocationID ( oLocationData.LocationID, oLocationData.Type, function ( aData ) {
				this.byId( "splValueHelpForLocationGates" ).setBusy( false );
				var oData = this.getView ( ).getModel ( ).getData ( );
				oData["GeofenceGates"] = aData;
				/* Fix for incident : 1580131002 */
				oData["edgeToGateMap"] = oLiveAppInstance.fnGetEdgeToGateMap ( oData );
				oSapSplMapsDataMarshal.fnEditFences ( oLocationData, oLiveAppInstance.byId ( "oSapSplLiveAppMap" ) );
				this.getView ( ).getModel ( ).setData ( oData );
			}.bind ( jQuery.extend ( true, {}, this ) ), function ( ) {
				jQuery.sap.log.error ( "fnHandleLocationDetailsDisplay", "Failure of function call", "liveApp.controller.js" );
			}, false, "GeofenceGates", true );
		}

	},

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 */
	onInit : function ( ) {
		var that = this;
		this.aRemovedGates = [];
		this.navContainer = this.byId ( "SplCreateEditLocationDialogNavContainer" );
		this.aClickedGates = [];

		if ( sap.ui.getCore ( ).getModel ( "sapSplAppConfigDataModel" ).getData ( )["canViewRulesWithTour"] !== 1 ) {
			this.byId ( "splCheckboxForInBoundMessaging" ).setVisible ( false );
		} else {
			this.byId ( "splCheckboxForInBoundMessaging" ).setVisible ( true );
		}

		/* CSNFIX 0120061532 0001274906 2014 */
		if ( this.getView ( ).getViewData ( ) && this.getView ( ).getViewData ( )[1] === "Edit" ) {
			if ( this.getView ( ).getViewData ( )[0] === "LC0001" ) {
				this.byId ( "SplCreateEditLocationDialogHomePage" ).setTitle ( oSapSplUtils.getBundle ( ).getText ( "EDIT_BRIDGE" ) );
			} else if ( this.getView ( ).getViewData ( )[0] === "LC0002" ) {
				this.byId ( "SplCreateEditLocationDialogHomePage" ).setTitle ( oSapSplUtils.getBundle ( ).getText ( "EDIT_PARKINGSPACE" ) );
			} else if ( this.getView ( ).getViewData ( )[0] === "LC0003" ) {
				this.byId ( "SplCreateEditLocationDialogHomePage" ).setTitle ( oSapSplUtils.getBundle ( ).getText ( "EDIT_CONTAINER_TERMINAL" ) );
			} else {
				this.byId ( "SplCreateEditLocationDialogHomePage" ).setTitle ( oSapSplUtils.getBundle ( ).getText ( "EDIT_GEOFENCE" ) );
				if ( this.getView ( ).getViewData ( )[2].isRadar === "1" ) {
					this.fnMakeChangesToRulesTableBasedOnData ( this.getView ( ).getViewData ( )[2], "Edit" );
					if ( splReusable.libs.SapSplModelFormatters.CanViewTrackingStatusLink ( this.getView ( ).getViewData ( )[2].isRadar, this.getView ( ).getViewData ( )[2].Type,
							sap.ui.getCore ( ).getModel ( "sapSplAppConfigDataModel" ).getData ( )["canViewRulesWithoutTour"] ) ) {
						if ( this.getView ( ).getViewData ( )[2].status === undefined ) {
							this.fnFetchStatusTrackingDetails ( );
						}
						this.navContainer.to ( this.navContainer.getPages ( )[this.navContainer.getPages ( ).length - 1].sId );
						this.navContainer.getPages ( )[this.navContainer.getPages ( ).length - 1].setTitle ( oSapSplUtils.getBundle ( ).getText ( "EDIT_GEOFENCE" ) );
					} else {
						this.fnFetchIncidentsAndGatesAssigned ( );
					}
//					oSapSplMapsDataMarshal.fnEditFences ( this.getView ( ).getViewData ( )[2], this.getView ( ).getViewData ( )[3].byId ( "oSapSplLiveAppMap" ) );
				} else {
					this.fnFetchIncidentsAndGatesAssigned ( );
					this.fnMakeChangesToRulesTableBasedOnData ( this.getView ( ).getViewData ( )[2], "Edit" );
				}
			}
		} else {
			if ( this.getView ( ).getViewData ( )[0] === "LC0001" ) {
				this.byId ( "SplCreateEditLocationDialogHomePage" ).setTitle ( oSapSplUtils.getBundle ( ).getText ( "ADD_BRIDGE" ) );
			} else if ( this.getView ( ).getViewData ( )[0] === "LC0002" ) {
				this.byId ( "SplCreateEditLocationDialogHomePage" ).setTitle ( oSapSplUtils.getBundle ( ).getText ( "ADD_PARKINGSPACE" ) );
			} else if ( this.getView ( ).getViewData ( )[0] === "LC0003" ) {
				this.byId ( "SplCreateEditLocationDialogHomePage" ).setTitle ( oSapSplUtils.getBundle ( ).getText ( "ADD_CONTAINER_TERMINAL" ) );
			} else {
				this.byId ( "SplCreateEditLocationDialogHomePage" ).setTitle ( oSapSplUtils.getBundle ( ).getText ( "ADD_GEOFENCE" ) );
				this.fnMakeChangesToRulesTableBasedOnData ( this.getView ( ).getViewData ( )[2], "Create" );
			}
		}

		/* CSNFIX : 0120061532 0001409856 2014 */
		if ( this.getView ( ).getViewData ( )[0] === "LC0004" || this.getView ( ).getViewData ( )[0] === "LC0008" ) {
			this.byId ( "SplCreateEditLocationDialogBuildingID" ).setVisible ( false );
			this.byId ( "SplCreateEditLocationDialogBuildingIDInput" ).setVisible ( false );
			this.byId ( "SplCreateEditLocationDialogStreetName" ).setVisible ( false );
			this.byId ( "SplCreateEditLocationDialogStreetNameInput" ).setVisible ( false );
			this.byId ( "SplCreateEditLocationDialogCityName" ).setVisible ( false );
			this.byId ( "SplCreateEditLocationDialogCityNameInput" ).setVisible ( false );
			this.byId ( "SplCreateEditLocationDialogPostalCode" ).setVisible ( false );
			this.byId ( "SplCreateEditLocationDialogPostalCodeInput" ).setVisible ( false );
			this.byId ( "SplCreateEditLocationDialogAddressRegionCode" ).setVisible ( false );
			this.byId ( "SplCreateEditLocationDialogRegionCodeInput" ).setVisible ( false );
			this.byId ( "SplCreateEditLocationDialogCountryCode" ).setVisible ( false );
			this.byId ( "SplCreateEditLocationDialogCountryCodeInput" ).setVisible ( false );
			this.byId ( "SplCreateEditLocationDialogWebcamURL" ).setVisible ( false );
			this.byId ( "SplCreateEditLocationDialogWebcamURLInput" ).setVisible ( false );
			this.byId ( "splCheckboxForIsPublic" ).setVisible ( splReusable.libs.SapSplModelFormatters.sapSplGetVisibilityBasedOnSubscriptionModel ( sap.ui.getCore ( ).getModel ( "sapSplAppConfigDataModel" ).getData ( )["canPublish"] ) );
		} else {
			/* CSNFIX : 0120061532 0001419476 2014 */
			this.byId ( "splCheckboxForIsPublic" ).setVisible ( false );
			this.byId ( "splListForLocationCoOrdinates" ).setVisible ( false );
			this.byId ( "SplCreateEditLocationDialogInstructionLabelForAdd" ).setVisible ( false );
			this.byId ( "SplCreateEditLocationDialogInstructionLabelForDelete" ).setVisible ( false );
		}

		/* CSNFIX : 0120061532 0001409851 2014 */
		this.byId ( "splListForLocationCoOrdinates" ).addEventDelegate ( {
			onAfterRendering : function ( oEvent ) {
				if ( oEvent.srcControl.getItems ( ).length < 4 ) {
					oEvent.srcControl.setMode ( "None" );
				} else {
					oEvent.srcControl.setMode ( "Delete" );
				}
			}
		} );

		this.getView ( ).addEventDelegate ( {
			onAfterRendering : function ( oEvent ) {
				setTimeout ( function ( ) {
					if ( that.byId ( "splInputNameOfLocation" ) ) {
						that.byId ( "splInputNameOfLocation" ).focus ( );
					}
					if ( that.byId ( "SapSplParkingSpaceCreateEditPageNameInput" ) ) {
						that.byId ( "SapSplParkingSpaceCreateEditPageNameInput" ).focus ( );
					}
					that.getView ( ).getParent ( ).getParent ( ).$ ( ).css ( "top", "100px" );
					that.getView ( ).getParent ( ).getParent ( ).$ ( ).css ( "left", "90px" );
				}, 1000 );
			}
		} );

		this.fnDefineControlLabelsFromLocalizationBundle ( );
	},

	fnHandleInboundMessagingCheckChange : function ( oEvent ) {
		this.byId ( "sapSplRadarGeofenceRulesTable" ).setVisible ( oEvent.getSource ( ).getSelected ( ) );
	},

	/**
	 * @description Method to handle localization of all the hard code texts in the view.
	 * @param void.
	 * @returns void.
	 * @since 1.0
	 */
	fnDefineControlLabelsFromLocalizationBundle : function ( ) {
		// CSN FIX : 0120031469 0000647626 2014
		this.byId ( "SplCreateEditLocationDialogBuildingID" ).setText ( oSapSplUtils.getBundle ( ).getText ( "NEW_LOCATION_ADDRESS_FIELD_TITLE", "1" ) );
		this.byId ( "SplCreateEditLocationDialogStreetName" ).setText ( oSapSplUtils.getBundle ( ).getText ( "NEW_LOCATION_ADDRESS_FIELD_TITLE", "2" ) );
		this.byId ( "SplCreateEditLocationDialogCityName" ).setText ( oSapSplUtils.getBundle ( ).getText ( "NEW_LOCATION_CITY_LABEL" ) );
		this.byId ( "SplCreateEditLocationDialogPostalCode" ).setText ( oSapSplUtils.getBundle ( ).getText ( "NEW_LOCATION_ZIPCODE_LABEL" ) );
		this.byId ( "SplCreateEditLocationDialogAddressRegionCode" ).setText ( oSapSplUtils.getBundle ( ).getText ( "NEW_LOCATION_COUNRTY_LABEL" ) );
		this.byId ( "SplCreateEditLocationDialogCountryCode" ).setText ( oSapSplUtils.getBundle ( ).getText ( "NEW_LOCATION_REGION_LABEL" ) );

		this.byId ( "sapSplGatesLabel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "INCIDENTS_GATES" ) );
		this.byId ( "splLabelForCreationTimeOfLocation" ).setText ( oSapSplUtils.getBundle ( ).getText ( "LOCATION_CREATED_ON_LABEL" ) );
		this.byId ( "splLabelForLocationCoOrdinates" ).setText ( oSapSplUtils.getBundle ( ).getText ( "CO_ORDINATES" ) );
		this.byId ( "SplCreateEditLocationDialogGatesPage" ).setTitle ( oSapSplUtils.getBundle ( ).getText ( "SELECT_GATE" ) );
		this.byId ( "SapSplGatesDetailsList" ).setNoDataText ( oSapSplUtils.getBundle ( ).getText ( "NO_GATES_DEFINED" ) );
		this.byId ( "oSapSplAddGateButton" ).setText ( oSapSplUtils.getBundle ( ).getText ( "ADD_GATE" ) );
		this.byId ( "SplCreateEditLocationDialogAddGatePage" ).setTitle ( oSapSplUtils.getBundle ( ).getText ( "ADD_GATE" ) );
		this.byId ( "sapSplSelectGeofenceSideText" ).setText ( oSapSplUtils.getBundle ( ).getText ( "SELECT_ONE_SIDE_OF_GEOFENCE" ) );
		this.byId ( "splLabelForNameOfLocation" ).setText ( oSapSplUtils.getBundle ( ).getText ( "LOCATION_NAME_NOT_EMPTY" ) );
		this.byId ( "splInputNameOfLocation" ).setPlaceholder ( oSapSplUtils.getBundle ( ).getText ( "LOCATION_ENTER_NAME_PLACEHOLDER" ) );
		this.byId ( "splLabelForGatesOfLocation" ).setText ( oSapSplUtils.getBundle ( ).getText ( "LOCATION_GATES_FIELD" ) );
		this.byId ( "splLabelForIncidentsAssigned" ).setText ( oSapSplUtils.getBundle ( ).getText ( "LOCATION_INCIDENTS_ASSIGNED_LABEL" ) );
		this.byId ( "sapSplAddGateLabel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "LOCATION_NAME_NOT_EMPTY" ) );
		this.byId ( "splCheckboxForIsPublic" ).setText ( oSapSplUtils.getBundle ( ).getText ( "LOCATION_PUBLIC_FIELD" ) );
		this.byId ( "SplCreateEditLocationDialogWebcamURL" ).setText ( oSapSplUtils.getBundle ( ).getText ( "WEBCAM_URL_LABEL" ) );
		/* CSNFIX : 0120061532 0001407063 2014 */
		this.byId ( "splListForLocationCoOrdinates" ).setNoDataText ( "NO_COORDINATES_AVAILABLE_TEXT" );

		this.byId ( "SplCreateEditLocationDialogInstructionLabelForAdd" ).setText ( oSapSplUtils.getBundle ( ).getText ( "LOCATION_EDIT_INSTRUCTION_LABEL_ADD" ) );
		this.byId ( "SplCreateEditLocationDialogInstructionLabelForDelete" ).setText ( oSapSplUtils.getBundle ( ).getText ( "LOCATION_EDIT_INSTRUCTION_LABEL_DELETE" ) );

	},

	fnHandleValueHelpForLocationGates : function ( ) {
		var navToId = this.navContainer.getPages ( )[1].sId;
		this.navContainer.to ( navToId, "slide" );
		var oModelData = this.getView ( ).getModel ( ).getData ( );
		oModelData["Geometry"] = oSapSplMapsDataMarshal.convertStringToGeoJSON ( this.oLiveAppInstance.fnCordinateArrayToCordinateString ( oModelData["locationGeoCoords"] ) );
		oModelData["Geometry"] = JSON.stringify ( oModelData["Geometry"] );
		this.getView ( ).getModel ( ).setData ( oModelData );
		oSapSplMapsDataMarshal.fnShowFences ( oModelData, this.oLiveAppInstance.byId ( "oSapSplLiveAppMap" ), "onFocus" );

		if ( oModelData["GeofenceGates"] !== undefined && oModelData["GeofenceGates"] !== null ) {
			this.aAssignedGates = jQuery.extend ( true, {}, oModelData["GeofenceGates"] );
			for ( var i = 0 ; i < oModelData["GeofenceGates"]["results"].length ; i++ ) {
				var sStyle = oModelData["GeofenceGates"]["results"][i]["GateUUID"].split ( "+" ).join ( "" ).split ( "/" ).join ( "" ).split ( "?" ).join ( "" ).split ( "%" ).join ( "" ).split ( "#" ).join ( "" ).split ( "&" ).join ( "" ).split (
						"=" ).join ( "" );
				jQuery ( "." + sStyle ).parent ( ).parent ( ).show ( );
				oSapSplMapsDataMarshal.fnShowGates ( oModelData["GeofenceGates"]["results"][i], this.oLiveAppInstance.byId ( "oSapSplLiveAppMap" ) );
			}
		}

		if ( oModelData.GeofenceGates.results.length < oModelData.locationGeoCoords.length ) {
			this.byId ( "oSapSplAddGateButton" ).setEnabled ( true );
		} else {
			this.byId ( "oSapSplAddGateButton" ).setEnabled ( false );
		}

	},

	fnHandleClickOfAddGateButton : function ( ) {
		this.byId ( "sapSplAddGateInput" ).setValue ( "" );
		this.oLiveAppInstance.fnHandleGeofenceGateSelectionMode ( this.getView ( ).getModel ( ).getData ( ) );
		var navToId = this.navContainer.getPages ( )[2].sId;
		this.navContainer.to ( navToId, "slide" );
		this.getView ( ).getParent ( ).getParent ( ).getBeginButton ( ).setEnabled ( false );
	},

	sapSplChangeDirtyFlag : function ( oEvent ) {
		oSapSplUtils.setIsDirty ( true );
		if ( oEvent.getSource ( ).getValue ( ).length > 0 ) {
			oEvent.getSource ( ).setValueState ( "None" );
		}
	},

	fnIsAllMandatoryFieldsFilled : function ( ) {
		var bReturnValue = true, bShowMessageBox = false;
		if ( this.byId ( "SplCreateEditLocationDialogBuildingIDInput" ).getVisible ( ) === true && this.byId ( "SplCreateEditLocationDialogBuildingIDInput" ).getValue ( ).length === 0 ) {
			this.byId ( "SplCreateEditLocationDialogBuildingIDInput" ).setValueStateText ( oSapSplUtils.getBundle ( ).getText ( "EMPTY_ERROR_MESSAGE" ) );
			this.byId ( "SplCreateEditLocationDialogBuildingIDInput" ).setValueState ( "Error" );
			bReturnValue = false;
		} else {
			this.byId ( "SplCreateEditLocationDialogBuildingIDInput" ).setValueState ( "None" );
		}
		if ( this.byId ( "SplCreateEditLocationDialogStreetNameInput" ).getVisible ( ) === true && this.byId ( "SplCreateEditLocationDialogStreetNameInput" ).getValue ( ).length === 0 ) {
			this.byId ( "SplCreateEditLocationDialogStreetNameInput" ).setValueStateText ( oSapSplUtils.getBundle ( ).getText ( "EMPTY_ERROR_MESSAGE" ) );
			this.byId ( "SplCreateEditLocationDialogStreetNameInput" ).setValueState ( "Error" );
			bReturnValue = false;
		} else {
			this.byId ( "SplCreateEditLocationDialogStreetNameInput" ).setValueState ( "None" );
		}
		if ( this.byId ( "SplCreateEditLocationDialogCityNameInput" ).getVisible ( ) === true && this.byId ( "SplCreateEditLocationDialogCityNameInput" ).getValue ( ).length === 0 ) {
			this.byId ( "SplCreateEditLocationDialogCityNameInput" ).setValueStateText ( oSapSplUtils.getBundle ( ).getText ( "EMPTY_ERROR_MESSAGE" ) );
			this.byId ( "SplCreateEditLocationDialogCityNameInput" ).setValueState ( "Error" );
			bReturnValue = false;
		} else {
			this.byId ( "SplCreateEditLocationDialogCityNameInput" ).setValueState ( "None" );
		}
		if ( this.byId ( "SplCreateEditLocationDialogRegionCodeInput" ).getVisible ( ) === true && this.byId ( "SplCreateEditLocationDialogRegionCodeInput" ).getValue ( ).length === 0 ) {
			this.byId ( "SplCreateEditLocationDialogRegionCodeInput" ).setValueStateText ( oSapSplUtils.getBundle ( ).getText ( "EMPTY_ERROR_MESSAGE" ) );
			this.byId ( "SplCreateEditLocationDialogRegionCodeInput" ).setValueState ( "Error" );
			bReturnValue = false;
		} else {
			this.byId ( "SplCreateEditLocationDialogRegionCodeInput" ).setValueState ( "None" );
		}
		if ( this.byId ( "SplCreateEditLocationDialogCountryCodeInput" ).getVisible ( ) === true && this.byId ( "SplCreateEditLocationDialogCountryCodeInput" ).getValue ( ).length === 0 ) {
			this.byId ( "SplCreateEditLocationDialogCountryCodeInput" ).setValueStateText ( oSapSplUtils.getBundle ( ).getText ( "EMPTY_ERROR_MESSAGE" ) );
			this.byId ( "SplCreateEditLocationDialogCountryCodeInput" ).setValueState ( "Error" );
			bReturnValue = false;
		} else {
			this.byId ( "SplCreateEditLocationDialogCountryCodeInput" ).setValueState ( "None" );
		}
		if ( this.byId ( "SplCreateEditLocationDialogPostalCodeInput" ).getVisible ( ) === true && this.byId ( "SplCreateEditLocationDialogPostalCodeInput" ).getValue ( ).length === 0 ) {
			this.byId ( "SplCreateEditLocationDialogPostalCodeInput" ).setValueStateText ( oSapSplUtils.getBundle ( ).getText ( "EMPTY_ERROR_MESSAGE" ) );
			this.byId ( "SplCreateEditLocationDialogPostalCodeInput" ).setValueState ( "Error" );
			bReturnValue = false;
		} else {
			this.byId ( "SplCreateEditLocationDialogPostalCodeInput" ).setValueState ( "None" );
		}
		if ( this.byId ( "splInputNameOfLocation" ).getValue ( ).length === 0 ) {
			this.byId ( "splInputNameOfLocation" ).setValueStateText ( oSapSplUtils.getBundle ( ).getText ( "EMPTY_ERROR_MESSAGE" ) );
			this.byId ( "splInputNameOfLocation" ).setValueState ( "Error" );
			bReturnValue = false;
		} else {
			this.byId ( "splInputNameOfLocation" ).setValueState ( "None" );
		}
		/* Fix for incident 1580097499 */
		if ( this.byId( "splCheckboxForInBoundMessaging" ).getSelected() === true ) {
			if ( !this.byId( "sapSplRadarGeofenceRulesTable" ).getSelectedItem() ) {
				bReturnValue = false;
				bShowMessageBox = true;
			} else {
				if ( this.byId( "sapSplRadarGeofenceRulesTable" ).getSelectedItem ( ).getCells ( )[1].getSelected ( ) === false &&
						this.byId( "sapSplRadarGeofenceRulesTable" ).getSelectedItem ( ).getCells ( )[2].getSelected ( ) === false ) {
					bReturnValue = false;
					bShowMessageBox = true;
				}
			}
			if ( bShowMessageBox === true ) {
				sap.m.MessageBox.show ( oSapSplUtils.getBundle ( ).getText ( "MESSAGE_FOR_RULE_SELECTION_ERROR" ), sap.m.MessageBox.Icon.ERROR, oSapSplUtils.getBundle ( ).getText ( "ERROR" ), [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
						function ( selection ) {
							jQuery ( ".sapUiBLy" ).css ( "z-index", "0" );
						} );
			}
		}
		return bReturnValue;
	},

	handlePressOfDialogOK : function ( oEvent ) {
		var sCurrentPageId = this.navContainer.getCurrentPage ( ).sId, i, sStyle, oModelData;
		if ( sCurrentPageId.indexOf ( "Home" ) !== -1 ) {
			if ( this.fnIsAllMandatoryFieldsFilled ( ) ) {
				var oPayload = this.getConstructedPayloadForPost ( this.getView ( ).getModel ( ).getData ( ) );
				this.handleSaveLocationAction ( oPayload, "Create", oEvent );
			}

		} else if ( sCurrentPageId.indexOf ( "Gates" ) !== -1 ) {
			this.byId ( "splValueHelpForLocationGates" ).setValue ( splReusable.libs.SapSplModelFormatters.getGatesName ( this.getView ( ).getModel ( ).getData ( )["GeofenceGates"]["results"] ) );
			oSapSplMapsDataMarshal.fnEditFences ( this.getView ( ).getModel ( ).getData ( ), this.oLiveAppInstance.byId ( "oSapSplLiveAppMap" ) );
			oSapSplMapsDataMarshal.fnRemoveGates ( this.oLiveAppInstance.byId ( "oSapSplLiveAppMap" ) );

			// CSN FIX : 0120031469 0000809705 2014
			jQuery ( ".vbi-detail" ).remove ( );

			this.navContainer.back ( );
		} else if ( sCurrentPageId.indexOf ( "Incident" ) !== -1 ) {

			var aIncidentsArray = [];
			oModelData = this.getView ( ).getModel ( ).getData ( );
			for ( i = 0 ; i < oModelData["AssignedIncidents"]["results"].length ; i++ ) {
				if ( oModelData["AssignedIncidents"]["results"][i]["isChecked"] === true ) {
					aIncidentsArray.push ( oModelData["AssignedIncidents"]["results"][i] );
				}
			}

			oModelData["Incidents"]["results"] = aIncidentsArray;

			this.getView ( ).getModel ( ).setData ( oModelData );

			this.navContainer.back ( );

		} else if ( sCurrentPageId.indexOf ( "Warning" ) !== -1 ) {
			this.navContainer.to ( this.navContainer.getPages ( )[0].sId );
			/* Fix for incident 1580131002 */
			this.fnFetchIncidentsAndGatesAssigned ( );
//			oSapSplMapsDataMarshal.fnEditFences ( this.getView ( ).getViewData ( )[2], this.getView ( ).getViewData ( )[3].byId ( "oSapSplLiveAppMap" ) );
		} else {
			oSapSplMapsDataMarshal.fnRemoveGates ( this.oLiveAppInstance.byId ( "oSapSplLiveAppMap" ) );
			oSapSplMapsDataMarshal.fnShowFences ( this.getView ( ).getModel ( ).getData ( ), this.oLiveAppInstance.byId ( "oSapSplLiveAppMap" ), "onFocus" );
			oModelData = sap.ui.getCore ( ).getModel ( "sapSplLocationCreateEditDialogModel" ).getData ( ); // (oModelData)
			/* CSNFIX : 0120031469 681028 2014 */
			oModelData["GeofenceGates"]["results"].push ( this.fnPrepareNewGateObject ( this.byId ( "sapSplAddGateInput" ).getValue ( ), this.aClickedGates[this.aClickedGates.length - 1], oModelData["LocationID"] ) );
			oModelData["edgeToGateMap"] = this.oLiveAppInstance.fnGetEdgeToGateMap ( oModelData );

			sap.ui.getCore ( ).getModel ( "sapSplLocationCreateEditDialogModel" ).setData ( oModelData );
			oSapSplMapsDataMarshal.fnShowFences ( oModelData, this.oLiveAppInstance.byId ( "oSapSplLiveAppMap" ), "onFocus" );
			this.aClickedGates = [];
			this.navContainer.back ( );
			for ( i = 0 ; i < oModelData["GeofenceGates"]["results"].length ; i++ ) {
				sStyle = oModelData["GeofenceGates"]["results"][i]["GateUUID"].split ( "+" ).join ( "" ).split ( "/" ).join ( "" ).split ( "?" ).join ( "" ).split ( "%" ).join ( "" ).split ( "#" ).join ( "" ).split ( "&" ).join ( "" ).split ( "=" )
						.join ( "" );
				oSapSplMapsDataMarshal.fnShowGates ( oModelData["GeofenceGates"]["results"][i], this.oLiveAppInstance.byId ( "oSapSplLiveAppMap" ) );
			}
			if ( oModelData.GeofenceGates.results.length < oModelData.locationGeoCoords.length ) {
				this.byId ( "oSapSplAddGateButton" ).setEnabled ( true );
			} else {
				this.byId ( "oSapSplAddGateButton" ).setEnabled ( false );
			}
		}
	},

	fnPrepareNewGateObject : function ( sName, oGeometry, sLocationID ) {
		var returnObject = {};
		returnObject["Name"] = sName;
		returnObject["LocationID"] = sLocationID;
		returnObject["GateUUID"] = oSapSplUtils.getUUID ( );
		returnObject["GateGeometry"] = JSON.stringify ( oGeometry );
		returnObject["new"] = true;
		return returnObject;
	},

	fnHandleDeleteOfListItem : function ( oEvent ) {
		this.fnHandleDeleteOfGateAndUpdateModel ( oEvent.getParameters ( ).listItem.getBindingContext ( ).getObject ( )["GateUUID"], true );
	},

	fnHandleDeleteOfGateAndUpdateModel : function ( gateUUID, bShowGateLabels ) {
		var oModelData = this.getView ( ).getModel ( ).getData ( ), aGates = [], i;
		if ( oModelData["GeofenceGates"]["results"].length > 0 ) {
			aGates = oModelData["GeofenceGates"]["results"];
			for ( i = 0 ; i < aGates.length ; i++ ) {
				if ( aGates[i]["GateUUID"] === gateUUID ) {
					aGates[i]["deleted"] = true;
					var sStyle = aGates[i]["GateUUID"].split ( "+" ).join ( "" ).split ( "/" ).join ( "" ).split ( "?" ).join ( "" ).split ( "%" ).join ( "" ).split ( "#" ).join ( "" ).split ( "&" ).join ( "" ).split ( "=" ).join ( "" );
					jQuery ( "." + sStyle ).hide ( );
					this.aRemovedGates.push ( aGates.splice ( i, 1 )[0] );
				}
			}
		}

		this.getView ( ).getModel ( ).setData ( oModelData );
		oSapSplMapsDataMarshal.fnRemoveGates ( this.oLiveAppInstance.byId ( "oSapSplLiveAppMap" ) );
		if ( bShowGateLabels && bShowGateLabels === true ) {
			if ( oModelData["GeofenceGates"] !== undefined && oModelData["GeofenceGates"] !== null ) {
				for ( i = 0 ; i < oModelData["GeofenceGates"]["results"].length ; i++ ) {
					oSapSplMapsDataMarshal.fnShowGates ( oModelData["GeofenceGates"]["results"][i], this.oLiveAppInstance.byId ( "oSapSplLiveAppMap" ) );
				}
			}
		}
		if ( oModelData.GeofenceGates.results.length < oModelData.locationGeoCoords.length ) {
			this.byId ( "oSapSplAddGateButton" ).setEnabled ( true );
		} else {
			this.byId ( "oSapSplAddGateButton" ).setEnabled ( false );
		}

	},

	handlePressOfDialogCancel : function ( oEvent ) {
		var sCurrentPageId = this.navContainer.getCurrentPage ( ).sId, oModelData;
		this.getView ( ).getParent ( ).getParent ( ).getBeginButton ( ).setEnabled ( true );

		if ( sCurrentPageId.indexOf ( "Home" ) !== -1 || sCurrentPageId.indexOf ( "Warning" ) !== -1 ) {

			var oDialogButtonPressEvent = jQuery.extend ( true, {}, oEvent );
			if ( oSapSplUtils.getIsDirty ( ) ) {
				sap.m.MessageBox.show ( oSapSplUtils.getBundle ( ).getText ( "DATA_LOSS_WARNING_TEXT" ), sap.m.MessageBox.Icon.WARNING, oSapSplUtils.getBundle ( ).getText ( "WARNING" ), [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
						function ( selection ) {
							if ( selection === "YES" ) {
								oDialogButtonPressEvent.getSource ( ).getParent ( ).close ( );
								oSapSplUtils.setIsDirty ( false );
							} else {
								// Hides the blocker div of dialog.
								jQuery ( ".sapUiBLy" ).css ( "z-index", "0" );
							}
						}, null, oSapSplUtils.fnSyncStyleClass ( "messageBox" ) );
			} else {
				oDialogButtonPressEvent.getSource ( ).getParent ( ).close ( );
				oDialogButtonPressEvent.getSource ( ).getParent ( ).destroy ( );
			}

		} else if ( sCurrentPageId.indexOf ( "Gates" ) !== -1 ) {
			oSapSplMapsDataMarshal.fnEditFences ( this.getView ( ).getModel ( ).getData ( ), this.oLiveAppInstance.byId ( "oSapSplLiveAppMap" ) );
			oSapSplMapsDataMarshal.fnRemoveGates ( this.oLiveAppInstance.byId ( "oSapSplLiveAppMap" ) );
			oModelData = this.getView ( ).getModel ( ).getData ( );
			oModelData["GeofenceGates"] = this.aAssignedGates;
			this.getView ( ).getModel ( ).setData ( oModelData );

			for ( var i = 0 ; i < oModelData["GeofenceGates"]["results"].length ; i++ ) {
				var sStyle = oModelData["GeofenceGates"]["results"][i]["GateUUID"].split ( "+" ).join ( "" ).split ( "/" ).join ( "" ).split ( "?" ).join ( "" ).split ( "%" ).join ( "" ).split ( "#" ).join ( "" ).split ( "&" ).join ( "" ).split (
						"=" ).join ( "" );
				jQuery ( "." + sStyle ).hide ( );
			}

			// Hides all the detail windows.
			// jQuery( ".oSapSplLiveAppPage .vbi-detail" ).hide();
			this.navContainer.back ( );
		} else if ( sCurrentPageId.indexOf ( "Incident" ) !== -1 ) {
			this.getView ( ).getModel ( ).setData ( this.oDialogData );
			this.navContainer.back ( );

		} else {
			this.aClickedGates = [];
			oSapSplMapsDataMarshal.fnRemoveGates ( this.oLiveAppInstance.byId ( "oSapSplLiveAppMap" ) );
			oSapSplMapsDataMarshal.fnShowFences ( this.getView ( ).getModel ( ).getData ( ), this.oLiveAppInstance.byId ( "oSapSplLiveAppMap" ), "onFocus" );
			this.aClickedGates = [];
			this.navContainer.back ( );
			oModelData = this.getView ( ).getModel ( ).getData ( );
			if ( oModelData.GeofenceGates.results.length < oModelData.locationGeoCoords.length ) {
				this.byId ( "oSapSplAddGateButton" ).setEnabled ( true );
			} else {
				this.byId ( "oSapSplAddGateButton" ).setEnabled ( false );
			}

		}

	},

	handleChangeOfGateNameField : function ( oEvent ) {
		// Fix for internal incident 1472000672
		if ( oEvent.getParameters ( ).newValue.split ( " " ).join ( "" ).length !== 0 && this.aClickedGates.length !== 0 ) {
			this.getView ( ).getParent ( ).getParent ( ).getBeginButton ( ).setEnabled ( true );
		} else {
			this.getView ( ).getParent ( ).getParent ( ).getBeginButton ( ).setEnabled ( false );
		}
	},

	handleDeletionOfGateOnTheMap : function ( oGateObject ) {
		if ( this.aRemovedGates === undefined ) {
			this.aRemovedGates = [];
		}
		
		this.aRemovedGates.push( oGateObject );
	},
	
	handleClickOfGateOnTheMap : function ( oClickedGateObject ) {
		this.aClickedGates.push ( JSON.parse ( oClickedGateObject ) );
		// Fix for internal incident 1472000672
		if ( this.byId ( "sapSplAddGateInput" ).getValue ( ).split ( " " ).join ( "" ).length !== 0 ) {
			this.getView ( ).getParent ( ).getParent ( ).getBeginButton ( ).setEnabled ( true );
		}
	},

	setLiveAppControllerInstance : function ( oLiveAppInstance ) {
		this.oLiveAppInstance = oLiveAppInstance;
	},

	/**
	 * @description Handler for save action on UI
	 * @private
	 * @param oEvent
	 */
	handleSaveLocationAction : function ( oPayload, sMode, oEvent ) {
		// var oSaveLocationUrl = oSapSplUtils.getServiceMetadata("location",
		// true);
		var that = this;
		var oSource = oEvent.getSource ( );
		var oSaveLocationUrl = oSapSplUtils.getServiceMetadata ( "newLocation", true );
		var sType = this.getView ( ).getModel ( ).getData ( )["Tag"];
		oSapSplBusyDialog.getBusyDialogInstance ( {
			title : oSapSplUtils.getBundle ( ).getText ( "BUSY_DIALOG_MESSAGE" )
		} ).open ( );
		oSapSplAjaxFactory.fireAjaxCall ( {
			url : oSaveLocationUrl,
			method : "PUT",
			data : JSON.stringify ( oPayload ),
			success : function ( data, success, messageObject ) {
				if ( data.constructor === String ) {
					data = JSON.parse ( data );
				}
				if ( messageObject["status"] === 200 && data["Error"].length === 0 ) {

					if ( data && data.Header && data.Header[0] ) {
						that.oLiveAppInstance.newCreatedVisualObject = data.Header[0].LocationID;
					} else {
						that.oLiveAppInstance.newCreatedVisualObject = null;
					}

					that.fnHandleSaveIncidents ( );
					oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
					sap.ca.ui.message.showMessageToast ( oSapSplUtils.getBundle ( ).getText ( "LOCATION_SAVED_SUCCESSFULLY" ) );
// that.oLiveAppInstance.oMapToolbar.firePressOnMapFilter(sType);
					oSapSplUtils.setIsDirty ( false );
					oSource.getParent ( ).close ( );
					oSource.getParent ( ).destroy ( );

				} else {
					/* Fix for 1580094613 */
					sap.ca.ui.message.showMessageBox ( {
						type : sap.ca.ui.message.Type.ERROR,
						message : oSapSplUtils.getErrorMessagesfromErrorPayload ( data )["errorWarningString"],
						details : oSapSplUtils.getErrorMessagesfromErrorPayload ( data )["ufErrorObject"]
					} ).attachAfterClose ( function ( ) {
						jQuery ( ".sapUiBLy" ).css ( "z-index", "0" );
					} );

					oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
				}
			},
			error : function ( error ) {
				/* Fix for 1580094613 */
				if ( error && error["status"] === 500 ) {
					sap.ca.ui.message.showMessageBox ( {
						type : sap.ca.ui.message.Type.ERROR,
						message : error["status"] + " " + error.statusText,
						details : error.responseText
					} ).attachAfterClose ( function ( ) {
						jQuery ( ".sapUiBLy" ).css ( "z-index", "0" );
					} );
				} else {
					sap.ca.ui.message.showMessageBox ( {
						type : sap.ca.ui.message.Type.ERROR,
						message : oSapSplUtils.getErrorMessagesfromErrorPayload ( JSON.parse ( error.responseText ) )["errorWarningString"],
						details : oSapSplUtils.getErrorMessagesfromErrorPayload ( JSON.parse ( error.responseText ) )["ufErrorObject"]
					} ).attachAfterClose ( function ( ) {
						jQuery ( ".sapUiBLy" ).css ( "z-index", "0" );
					} );
				}
// that.oLiveAppInstance.oMapToolbar.refreshMap();
				oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
				jQuery.sap.log.error ( error["status"], error.statusText, "MapsDetailView.controller.js" );
			},
			complete : function ( ) {
				/* CSNFIX : 1570465615 - removed refreshMap method call */
				jQuery ( ".sapUiBLy" ).css ( "z-index", "0" );
			}
		} );
	},

	/* CSNFIX : 0001224990 2014 */

	splDeleteCordinateInEditDialog : function ( oEvent ) {
		var that = this, sConfirmationMessage = "";
		var oLocationModel = oEvent.getSource ( ).getModel ( );
		var oModelData = oLocationModel.getData ( );
		var aLocationCoords = oModelData["locationGeoCoords"];
		var iIndex = oEvent.getSource ( ).indexOfItem ( oEvent.getParameters ( )["listItem"] );
		var aWarningGateObjects = oSapSplMapsDataMarshal.fnCheckPointWithinGate ( oModelData["GeofenceGates"].results, aLocationCoords[iIndex] );
		if ( aWarningGateObjects.length > 0 ) {
			sConfirmationMessage = oSapSplUtils.getBundle ( ).getText ( "LOCATION_POINT_DELETE_CONFIRMATION" );
			sap.m.MessageBox.show ( sConfirmationMessage, sap.m.MessageBox.Icon.WARNING, oSapSplUtils.getBundle ( ).getText ( "WARNING" ), [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL], function ( selection ) {
				jQuery ( ".sapUiBLy" ).css ( "z-index", "0" );
				if ( selection === "OK" ) {
					for ( var i = 0 ; i < aWarningGateObjects.length ; i++ ) {
						that.fnHandleDeleteOfGateAndUpdateModel ( aWarningGateObjects[i]["GateUUID"], false );
					}
					that.byId ( "splValueHelpForLocationGates" ).setValue ( splReusable.libs.SapSplModelFormatters.getGatesName ( that.getView ( ).getModel ( ).getData ( )["GeofenceGates"]["results"] ) );
					aLocationCoords.splice ( iIndex, 1 );
					oModelData["locationGeoCoords"] = aLocationCoords;
					/* CSNFIX : 0120031469 680064 2014 */
					oModelData["Geometry"] = JSON.stringify ( oSapSplMapsDataMarshal.convertStringToGeoJSON ( that.oLiveAppInstance.fnCordinateArrayToCordinateString ( aLocationCoords ) ) );
					oLocationModel.setData ( oModelData );
					oSapSplMapsDataMarshal.fnEditFences ( oModelData, that.oLiveAppInstance.byId ( "oSapSplLiveAppMap" ) );
				}
			}, null, oSapSplUtils.fnSyncStyleClass ( "messageBox" ) );
		} else {
			aLocationCoords.splice ( iIndex, 1 );
			oModelData["locationGeoCoords"] = aLocationCoords;
			oModelData["Geometry"] = JSON.stringify ( oSapSplMapsDataMarshal.convertStringToGeoJSON ( that.oLiveAppInstance.fnCordinateArrayToCordinateString ( aLocationCoords ) ) );
			/* CSNFIX : 0120031469 680064 2014 */
			oLocationModel.setData ( oModelData );

			oSapSplMapsDataMarshal.fnEditFences ( oModelData, that.oLiveAppInstance.byId ( "oSapSplLiveAppMap" ) );
		}

	},

	getConstructedPayloadForPost : function ( oViewData ) {
		try {

			/* @private */

			function getUpdatedLocationStringForPost ( oViewData ) {
				var oTempViewData = oViewData, aArrayOfStrings = [];
				for ( var iLocation = 0, jTemp = oTempViewData["locationGeoCoords"].length ; iLocation < jTemp ; iLocation++ ) {
					var sCoOrds = oTempViewData["locationGeoCoords"][iLocation]["long"] + ";" + oTempViewData["locationGeoCoords"][iLocation]["lat"] + ";" + oTempViewData["locationGeoCoords"][iLocation]["alt"];
					aArrayOfStrings.push ( sCoOrds );
				}
				return aArrayOfStrings.join ( ";" );
			}
			var bIsPublic = null, sGeometry = "", bShapeHasChanged = null;
			var locationID = oViewData["LocationID"];

			if ( oViewData.shapeChanged === true ) {
				bShapeHasChanged = true;
			} else {
				bShapeHasChanged = false;
			}

			if ( !locationID ) {
				locationID = oSapSplUtils.getUUID ( );
				sGeometry = oSapSplMapsDataMarshal.convertStringToGeoJSON ( getUpdatedLocationStringForPost ( oViewData ) );
			} else {
				/* CSNFIX : 0120031469 0000680369 2014, 1570171757 */
				sGeometry = oSapSplMapsDataMarshal.convertStringToGeoJSON ( getUpdatedLocationStringForPost ( oViewData ) );
			}

			this.locationID = locationID;

			var addressUUID = oViewData["AddressUUID"];
			if ( !addressUUID ) {
				addressUUID = oSapSplUtils.getUUID ( );
			}

			if ( this.byId ( "splCheckboxForIsPublic" ).getSelected ( ) === true ) {
				bIsPublic = "1";
			} else {
				bIsPublic = "0";
			}

			/* Fix for Incident: 1570077518 */
			if ( sGeometry === undefined || sGeometry === null ) {
				sGeometry = {
					type : "Polygon",
					coordinates : [[]]
				};
			}

			// if(sMode === "Create") {
			var oReturnObject = {
				"inputHasChangeMode" : true,
				"Header" : [{
					"LocationID" : locationID,
					"Name" : oViewData["Name"],
					"OwnerID" : oSapSplUtils.getCompanyDetails ( )["BasicInfo_CompanyID"],
					"Type" : oViewData["Type"],
					"Geometry" : sGeometry, // JSON.parse( oViewData[
					// "Geometry" ] ),
					"Stacked" : "0",
					"isPublic" : bIsPublic,
					"ParentLocationID" : null,
					"ImageUrl" : oViewData["ImageUrl"],
					"Website" : oViewData["Website"],
					"WebcamUrl" : oViewData["WebcamUrl"],
					"PhoneNumber" : null,
					"AdditionalInformation" : oViewData["AdditionalInformation"],
					"ChangeMode" : (this.getView ( ).getViewData ( )[1] === "Edit" ? "U" : "I"),
					"unauthenticatedObserverGeofence" : bShapeHasChanged
				}],
				"Texts" : [{
					"LocationID" : locationID,
					"Type" : "T",
					/*
					 * CSN FIX : 0120031469 682358 2014 Remove the Language
					 * attribute from the payload
					 */
					"Text" : oViewData["Tag"],
					"ObjectUUID" : locationID,
					"LocaleLanguage" : null,
					"ChangeMode" : "U"
				}, {
					"LocationID" : locationID,
					"Type" : "D",
					/*
					 * CSN FIX : 0120031469 682358 2014 Remove the Language
					 * attribute from the payload
					 */
					"Text" : "",
					"ObjectUUID" : locationID,
					"LocaleLanguage" : null,
					"ChangeMode" : "U"
				}, {
					"LocationID" : locationID,
					"Type" : "A",
					/*
					 * CSN FIX : 0120031469 682358 2014 Remove the Language
					 * attribute from the payload
					 */
					"Text" : "",
					"ObjectUUID" : locationID,
					"LocaleLanguage" : null,
					"ChangeMode" : "U"
				}]
			};

			/* Incident : 1482016228 */
			if ( this.getView ( ).getViewData ( )[0] !== "LC0004" && this.getView ( ).getViewData ( )[0] !== "LC0008" ) {
				oReturnObject["Address"] = [{
					"UUID" : addressUUID,
					"LocationID" : locationID,
					"BuildingID" : oViewData["BuildingID"],
					"StreetName" : oViewData["StreetName"],
					"CityName" : oViewData["CityName"],
					"StreetPostalCode" : oViewData["StreetPostalCode"],
					"RegionName" : oViewData["RegionName"],
					"CountryName" : oViewData["CountryName"],
					"ChangeMode" : "U"
				}];
			}

			if ( !oViewData["GeofenceGates"]["results"] ) {
				oViewData["GeofenceGates"]["results"] = [];
			}

			var aGatesArray = [];

			for ( var i = 0 ; i < oViewData["GeofenceGates"]["results"].length ; i++ ) {
				var oTemp = {};
				if ( oViewData["GeofenceGates"]["results"][i]["new"] && oViewData["GeofenceGates"]["results"][i]["new"] === false ) {
					aGatesArray.splice ( i, 1 );
				} else {
					oTemp["Geometry"] = JSON.parse ( oViewData["GeofenceGates"]["results"][i]["GateGeometry"] );
					oTemp["UUID"] = oViewData["GeofenceGates"]["results"][i]["GateUUID"];
					if ( !oViewData["GeofenceGates"]["results"][i]["LocationID"] ) {
						oTemp["LocationID"] = locationID;
					} else {
						oTemp["LocationID"] = oViewData["GeofenceGates"]["results"][i]["LocationID"];
					}
					oTemp["Name"] = oViewData["GeofenceGates"]["results"][i]["Name"];
					oTemp["isDeleted"] = "0";
					oTemp["ChangeMode"] = "U";
					aGatesArray.push ( oTemp );
				}
			}
			/* Fix for Incident : 1580046090 */
			for ( var j = 0 ; j < this.aRemovedGates.length ; j++ ) {
				/* Fix For Incident : 1580100449 */
				if ( this.aRemovedGates[j]["new"] !== true ) {
					aGatesArray.push ( {
						UUID : this.aRemovedGates[j]["GateUUID"],
						ChangeMode : "D"
					} );
				}
			}

			oReturnObject["Gate"] = aGatesArray;
			/* Incident fix : 1570809538 */
			var bSendMessagePayloadCreate = false, bSendMessagePayloadEdit = false, oTable = this.byId ( "sapSplRadarGeofenceRulesTable" );
			if ( this.byId ( "splCheckboxForInBoundMessaging" ).getSelected ( ) === true && oTable.getSelectedItem ( ) ) {
				var oRadarObject = {}, RuleUUID = null;

				oReturnObject["Header"][0]["Type"] = "L00005";
				oReturnObject["Texts"][0]["Text"] = "LC0008";

				if ( oViewData["RuleUUID"] ) {
					RuleUUID = oViewData["RuleUUID"];
				} else {
					RuleUUID = oSapSplUtils.getUUID ( );
					bSendMessagePayloadCreate = true;
				}

				oReturnObject["Radar"] = [];
				oRadarObject.UUID = RuleUUID;
				oRadarObject.ObservationGF = locationID;
				oRadarObject.OwnerID = oSapSplUtils.getCompanyDetails ( )["BasicInfo_CompanyID"];
				oRadarObject.Name = oViewData["Name"];
				oRadarObject.Gate = null;
				oRadarObject.ChangeMode = "U";
				if ( oTable.indexOfItem ( oTable.getSelectedItem ( ) ) === 0 ) {
					oRadarObject.RunsWithTour = "1";
					oRadarObject.Entry = (oTable.getSelectedItem ( ).getCells ( )[1].getSelected ( ) === true ? "1" : "0");
					oRadarObject.Exit = (oTable.getSelectedItem ( ).getCells ( )[2].getSelected ( ) === true ? "1" : "0");
				} else {
					oRadarObject.RunsWithTour = "0";
					oRadarObject.Entry = (oTable.getSelectedItem ( ).getCells ( )[1].getSelected ( ) === true ? "1" : "0");
					oRadarObject.Exit = (oTable.getSelectedItem ( ).getCells ( )[2].getSelected ( ) === true ? "1" : "0");
				}

				oReturnObject["Radar"].push ( oRadarObject );
			} else {
				if ( this._isRadarGeofence === true ) {
					oRadarObject = {};
					oReturnObject["Radar"] = [];
					oReturnObject["Radar"].push ( {
						UUID : oViewData["RuleUUID"],
						ChangeMode : "D"
					} );
				}
			}

// sCreateOrUpdate = (this.getView().getViewData()[1] === "Edit"? "U":"I");

// if ((bSendMessagePayloadCreate === true &&
// sap.ui.getCore().getModel("sapSplAppConfigDataModel").getData()["canViewRulesWithoutTour"]
// !== 1) ||
// (bShapeHasChanged === true &&
// sap.ui.getCore().getModel("sapSplAppConfigDataModel").getData()["canViewRulesWithoutTour"]
// !== 1)) {
// oReturnObject["Message"] = {
// Header: [],
// Text: [],
// Recipient: [],
// inputHasChangeMode: true,
// Object: "MessageOccurrence",
// updateTextAndRecipientPayloadFor: sCreateOrUpdate
// };
//
// var sUUID = oSapSplUtils.getUUID();
//
// oReturnObject["Message"]["Header"].push({
// "UUID": sUUID,
// "Type": "AG",
// "TemplateUUID": null,
// "Priority": "1",
// "OwnerID": oSapSplUtils.getCompanyDetails()["BasicInfo_CompanyID"],
// "SenderID": oSapSplUtils.getCompanyDetails()["BasicInfo_CompanyID"],
// "Validity.StartTime": null,
// "Validity.EndTime": null,
// "SourceLocation": null,
// "ThreadUUID": oSapSplUtils.getUUID(),
// "ChangeMode": "I",
// "ReferenceObjectType": "Location",
// "ReferenceObjectUUID": locationID
// });
// }

			return oReturnObject;

		} catch (oEvent) {
			jQuery.sap.log.error ( oEvent.message, "Failure of getConstructedPayloadForPost function call", "MapsDetailView.controller.js" );
		}
	},

	/**
	 * @description Method to prepare the payload for post (create/ edit), as per the requirements.
	 * @param void.
	 * @returns oMainPayLoad {object} object containing the incident master payload, location assignment payload.
	 * @since 1.0
	 */
	preparePayLoadForPost : function ( ) {
		var aIncidentsFromRead = null;
		if ( this.getView ( ).getViewData ( )[2] ) {
			aIncidentsFromRead = this.getView ( ).getViewData ( )[2].Incidents.results;
		}
		var oModelData = this.getView ( ).getModel ( ).getData ( );
		var aIncidents;
		if ( !oModelData.AssignedIncidents ) {
			aIncidents = oModelData.AssignedIncidents = {
				results : []
			};
		} else {
			aIncidents = oModelData.AssignedIncidents.results;
		}

		var oMainPayLoad = {};
		oMainPayLoad["Header"] = [];
		oMainPayLoad["Text"] = [];
		oMainPayLoad["Recipient"] = [];
		oMainPayLoad["Object"] = "MessageTemplate";
		// Fix for internal incident 1472021481
		oMainPayLoad["inputHasChangeMode"] = true;

		for ( var i = 0 ; i < aIncidents.length ; i++ ) {
			var oIncidentHeader = {};
			oIncidentHeader["UUID"] = aIncidents[i]["UUID"];
			oIncidentHeader["Name"] = aIncidents[i]["Name"];
			oIncidentHeader["Priority"] = aIncidents[i]["Priority"];
			oIncidentHeader["Category"] = aIncidents[i]["Category"];
			oIncidentHeader["SourceLocation"] = JSON.parse ( aIncidents[i]["IncidentLocationGeometry"] );
			oIncidentHeader["isDeleted"] = aIncidents[i]["isDeleted"];
			oIncidentHeader["OwnerID"] = aIncidents[i]["OwnerID"];
			oIncidentHeader["AuditTrail.CreatedBy"] = null;
			oIncidentHeader["AuditTrail.ChangedBy"] = null;
			oIncidentHeader["AuditTrail.CreationTime"] = null;
			oIncidentHeader["AuditTrail.ChangeTime"] = null;
			// Fix for internal incident 1472021481
			oIncidentHeader["ChangeMode"] = "U";

			var oIncidentText = {};
			oIncidentText["UUID"] = aIncidents[i]["UUID"];
			oIncidentText["ShortText"] = aIncidents[i]["ShortText"];
			oIncidentText["LongText"] = aIncidents[i]["LongText"];
			// Fix for internal incident 1472021481
			oIncidentText["ChangeMode"] = "U";

			var oLocationObject = {};
			// fix for internal incident 1482006397 isDeleted removed
			oLocationObject["ParentUUID"] = aIncidents[i]["UUID"];
			oLocationObject["RecipientType"] = "Location";
			oLocationObject["RecipientUUID"] = this.locationID;
			oLocationObject["AuditTrail.CreatedBy"] = null;
			oLocationObject["AuditTrail.ChangedBy"] = null;
			oLocationObject["AuditTrail.CreationTime"] = null;
			oLocationObject["AuditTrail.ChangeTime"] = null;
			// Fix for internal incident 1472021481

			// fix for internal incident 1482006397
			if ( aIncidents[i]["checkedUnchecked"] === 1 ) {
				oLocationObject["ChangeMode"] = "I";
				oLocationObject["UUID"] = oSapSplUtils.getUUID ( );
				oMainPayLoad["Header"].push ( oIncidentHeader );
				oMainPayLoad["Text"].push ( oIncidentText );
				oMainPayLoad["Recipient"].push ( oLocationObject );
			} else if ( aIncidents[i]["checkedUnchecked"] === -1 ) {
				if ( aIncidentsFromRead ) {
					for ( var j = 0 ; j < aIncidentsFromRead.length ; j++ ) {
						if ( aIncidents[i]["UUID"] === aIncidentsFromRead[j]["UUID"] ) {
							oLocationObject["UUID"] = aIncidentsFromRead[j]["AssignmentUUID"];
							break;
						}
					}

					oLocationObject["ChangeMode"] = "D";
					oMainPayLoad["Header"].push ( oIncidentHeader );
					oMainPayLoad["Text"].push ( oIncidentText );
					oMainPayLoad["Recipient"].push ( oLocationObject );
				}
			}

		}
		return oMainPayLoad;
	},

	/**
	 * Handles the ajax to save incidents assignment
	 * @param void
	 * @returns void
	 * @since 1.0
	 * @private
	 */
	fnHandleSaveIncidents : function ( ) {
		var oPayLoadForPost = this.preparePayLoadForPost ( );
		if ( oPayLoadForPost.Header && oPayLoadForPost.Header.length && oPayLoadForPost.Header.length > 0 ) {
			oSapSplAjaxFactory.fireAjaxCall ( {
				url : oSapSplUtils.getServiceMetadata ( "incidents", true ),
				method : "PUT",
				data : JSON.stringify ( oPayLoadForPost ),
				success : function ( data, success, messageObject ) {
					if ( data.constructor === String ) {
						data = JSON.parse ( data );
					}
					// oSapSplBusyDialog.getBusyDialogInstance().close();
					if ( messageObject["status"] === 200 && data["Error"].length === 0 ) {
						// sap.ca.ui.message.showMessageToast(oSapSplUtils.getBundle().getText("CHANGES_SAVED_SUCCESS"));
						oSapSplUtils.setIsDirty ( false );

					} else {
						/* Fix for 1580094613 */
						var errorMessage = oSapSplUtils.getErrorMessagesfromErrorPayload ( data )["ufErrorObject"];
						sap.ca.ui.message.showMessageBox ( {
							type : sap.ca.ui.message.Type.ERROR,
							message : oSapSplUtils.getErrorMessagesfromErrorPayload ( data )["errorWarningString"],
							details : errorMessage
						} ).attachAfterClose ( function ( ) {
							jQuery ( ".sapUiBLy" ).css ( "z-index", "0" );
						} );
					}
				},
				error : function ( error ) {
					/* Fix for 1580094613 */
					jQuery.sap.log.error ( "fnHandlePressOfSaveIncidents", "ajax failed", "IncidentsDetailView.controller.js" );
					oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
					if ( error && error["status"] === 500 ) {
						sap.ca.ui.message.showMessageBox ( {
							type : sap.ca.ui.message.Type.ERROR,
							message : error["status"] + " " + error.statusText,
							details : error.responseText
						} ).attachAfterClose ( function ( ) {
							jQuery ( ".sapUiBLy" ).css ( "z-index", "0" );
						} );
					} else {
						sap.ca.ui.message.showMessageBox ( {
							type : sap.ca.ui.message.Type.ERROR,
							message : oSapSplUtils.getErrorMessagesfromErrorPayload ( JSON.parse ( error.responseText ) )["errorWarningString"],
							details : oSapSplUtils.getErrorMessagesfromErrorPayload ( JSON.parse ( error.responseText ) )["ufErrorObject"]
						} ).attachAfterClose ( function ( ) {
							jQuery ( ".sapUiBLy" ).css ( "z-index", "0" );
						} );
					}
				}
			} );
		}
	},

	/**
	 * This function is called when you select or deselect a list item in the list
	 * @param oEvent
	 * @returns void
	 * @since 1.0
	 * @private
	 */
	fnHandleListItemSelection : function ( oEvent ) {
		// fix for internal incident 1482006397
		if ( oEvent.getParameters ( ).listItem.getSelected ( ) === true ) {
			oEvent.getParameters ( ).listItem.getBindingContext ( ).getObject ( )["checkedUnchecked"] = 1;
		} else if ( oEvent.getParameters ( ).listItem.getSelected ( ) === false ) {
			oEvent.getParameters ( ).listItem.getBindingContext ( ).getObject ( )["checkedUnchecked"] = -1;
		}
	},

	/**
	 * Gets the dialogue model and compares the incident data with the data that we get from the service.
	 * Adds iChecked attribute to the model data and sets the model again
	 * @param oData
	 * @returns void
	 * @private
	 * @since 1.0
	 */
	fnPrepareModelForIncidence : function ( oData ) {
		var aIncidentsArray = oData.results;
		var aIncidentsArrayLength = aIncidentsArray.length;
		var oDialogModelData = this.getView ( ).getModel ( ).getData ( );
		var aModelIncidents = oDialogModelData.Incidents.results;
		var aModelIncidentsLength = aModelIncidents.length;

		for ( var i = 0 ; i < aIncidentsArrayLength ; i++ ) {
			aIncidentsArray[i]["isChecked"] = false;
			aIncidentsArray[i]["checkedUnchecked"] = 0;
			for ( var j = 0 ; j < aModelIncidentsLength ; j++ ) {
				if ( aIncidentsArray[i]["UUID"] === aModelIncidents[j]["UUID"] ) {
					aIncidentsArray[i]["isChecked"] = true;
					aIncidentsArray[i]["checkedUnchecked"] = 0;
				}
			}
		}

		oDialogModelData.AssignedIncidents = {};
		oDialogModelData.AssignedIncidents.results = aIncidentsArray;

		this.oDialogData = jQuery.extend ( true, {}, oDialogModelData );
		this.byId ( "SplCreateEditLocationDialogAssignIncidentPage" ).setTitle ( oSapSplUtils.getBundle ( ).getText ( "INCIDENTS_MASTER_PAGE_TITLE", aIncidentsArrayLength.toString ( ) ) );
		this.getView ( ).getModel ( ).setData ( oDialogModelData );
	},

	/**
	 * Makes an oData request to get the details of the incidence.
	 * @param fnSuccess
	 * @param fnError
	 * @returns void
	 * @since 1.0
	 * @private
	 */
	getIncidentData : function ( fnSuccess, fnError ) {
		var sFilter = "$filter=isDeleted eq '0'";
		this.oSapSplApplModel = sap.ui.getCore ( ).getModel ( "LiveAppODataModel" );
		oSapSplBusyDialog.getBusyDialogInstance ( ).open ( );
		this.oSapSplApplModel.read ( "/IncidentDetails", null, [sFilter], false, jQuery.proxy ( fnSuccess, this ), jQuery.proxy ( fnError, this ) );
		oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
		// Hides the blocker div of dialog.
		jQuery ( ".sapUiBLy" ).css ( "z-index", "0" );
	},

	/**
	 * This function is triggered when you click on the value help to assign incidence.
	 * @param void
	 * @returns void
	 * @private
	 * @since 1.0
	 */
	fnHandleValueHelpForIncidenceAssignment : function ( ) {
		var navToId = this.navContainer.getPages ( )[3].sId;

		this.getIncidentData ( this.fnPrepareModelForIncidence, function ( ) {

		} );
		this.navContainer.to ( navToId, "slide" );
	}
} );
