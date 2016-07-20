/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.controller ( "splController.dialogs.SplCreateDisplayAreaDialog", {

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 */
	onInit : function ( ) {
		var that = this;
		/* Localization */
		this.fnDefineControlLabelsFromLocalizationBundle ( );

		this.oViewData = this.getView ( ).getViewData ( );

		this.liveAppControllerInstance = this.oViewData.oPageInstance.getParent ( ).getParent ( );

		if ( sap.ui.getCore ( ).getModel ( "sapSplAppConfigDataModel" ).getData ( )["isIncidentEditable"] === 0 ) {
			this.byId ( "SapSplDisplayAreaIsPublicCheckBox" ).setVisible ( false );
		} else {
			this.byId ( "SapSplDisplayAreaIsPublicCheckBox" ).setVisible ( true );
		}

		oSapSplUtils.setIsDirty ( true );

		this.getView ( ).getViewData ( ).parentControllerInstance.fnShowHideLiveAppDisplayAreaBorder ( "show" );
		this.getView ( ).addEventDelegate ( {
			onAfterRendering : function ( oEvent ) {
				window.setTimeout ( function ( ) {
					that.getView ( ).byId ( "SapSplDisplayAreaNameInput" ).focus ( );
				}, 100 );
			}
		} );

	},

	/**
	 * @description Method to handle localization of all the hard code texts in the view.
	 * @param void.
	 * @returns void.
	 * @since 1.0
	 */
	fnDefineControlLabelsFromLocalizationBundle : function ( ) {
		this.byId ( "SapSplCreateDisplayAreaPageInfo" ).setText ( oSapSplUtils.getBundle ( ).getText ( "CREATE_DISPLAY_AREA_PAGE_INFO" ) );
		this.byId ( "SapSplDisplayAreaNameLabel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "NAME" ) );
		this.byId ( "SapSplDisplayAreaMakeDefaultCheckBox" ).setText ( oSapSplUtils.getBundle ( ).getText ( "MAKE_DEFAULT_VIEW" ) );
		this.byId ( "SapSplDisplayAreaIsPublicCheckBox" ).setText ( oSapSplUtils.getBundle ( ).getText ( "PUBLIC" ) );
	},

	/**
	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 */
	onAfterRendering : function ( ) {

	},

	/**
	 * @description Method to save dialog instance & set buttons for dialog.
	 * @param {Object} oParentDialog.
	 * @returns void.
	 * @since 1.0
	 */
	setParentDialogInstance : function ( oParentDialog ) {
		this.oParentDialogInstance = oParentDialog;
		this.setButtonsForDialog ( );
	},

	/**
	 * @description Method to set Begin & End Button for dialog & set localized text for it.
	 * @param void.
	 * @returns void.
	 * @since 1.0
	 */
	setButtonsForDialog : function ( ) {

		this.oSapSplCreateDisplayAreaSaveButton = new sap.m.Button ( {
			press : jQuery.proxy ( this.fnHandlePressOfCreateDisplayAreaSaveButton, this ),
			enabled : false
		} );

		this.oSapSplCreateDisplayAreaCancelButton = new sap.m.Button ( {
			press : jQuery.proxy ( this.fnHandlePressOfCreateDisplayAreaCancelButton, this )
		} );

		this.oSapSplCreateDisplayAreaSaveButton.setText ( oSapSplUtils.getBundle ( ).getText ( "NEW_CONTACT_SAVE" ) );
		this.oSapSplCreateDisplayAreaCancelButton.setText ( oSapSplUtils.getBundle ( ).getText ( "CANCEL" ) );
		this.oParentDialogInstance.setBeginButton ( this.oSapSplCreateDisplayAreaSaveButton );
		this.oParentDialogInstance.setEndButton ( this.oSapSplCreateDisplayAreaCancelButton );
	},

	/**
	 * @description Method to handle press of Close button of dialog.
	 * @param void.
	 * @returns void.
	 * @since 1.0
	 */
	fnHandlePressOfCreateDisplayAreaCancelButton : function ( ) {
		var that = this;
		if ( oSapSplUtils.getIsDirty ( ) ) {
			sap.m.MessageBox.show ( oSapSplUtils.getBundle ( ).getText ( "DATA_LOSS_WARNING_TEXT" ), sap.m.MessageBox.Icon.WARNING, oSapSplUtils.getBundle ( ).getText ( "WARNING" ), [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
					function ( selection ) {
						if ( selection === "YES" ) {
							that.getView ( ).getParent ( ).close ( );
							oSapSplUtils.setIsDirty ( false );
						}
					} );
		} else {
			that.getView ( ).getParent ( ).close ( );
			oSapSplUtils.setIsDirty ( false );
		}
	},

	/**
	 * @description Method to handle press of save button of dialog.
	 * @param void.
	 * @returns void.
	 * @since 1.0
	 */
	fnHandlePressOfCreateDisplayAreaSaveButton : function ( ) {
		var oPayload = this.fnPreparePayloadToCreateDisplayArea ( );

		var that = this;
		var oSaveLocationUrl = oSapSplUtils.getServiceMetadata ( "newLocation", true );
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
					that.oParentDialogInstance.close ( );
					oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
					sap.ca.ui.message.showMessageToast ( oSapSplUtils.getBundle ( ).getText ( "CREATE_DISPLAY_AREA_SUCCESS_MSG", data.Header[0].Name ) );
					oSapSplUtils.setIsDirty ( false );
					/* Incident fix : 1570147639 */
					if ( data.Personalization.DisplayArea[0].isDefault === "1" ) {
						that.oViewData.oMapInstance.defaultDisplayArea = data.Header[0];
					}
				} else {
					sap.ca.ui.message.showMessageBox ( {
						type : sap.ca.ui.message.Type.ERROR,
						message : oSapSplUtils.getErrorMessagesfromErrorPayload ( data )["errorWarningString"],
						details : oSapSplUtils.getErrorMessagesfromErrorPayload ( data )["ufErrorObject"]
					} );

					oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
				}
			},
			error : function ( error ) {
				if ( error && error["status"] === 500 ) {
					sap.ca.ui.message.showMessageBox ( {
						type : sap.ca.ui.message.Type.ERROR,
						message : error["status"] + " " + error.statusText,
						details : error.responseText
					} );
				} else {
					sap.ca.ui.message.showMessageBox ( {
						type : sap.ca.ui.message.Type.ERROR,
						message : oSapSplUtils.getErrorMessagesfromErrorPayload ( JSON.parse ( error.responseText ) )["errorWarningString"],
						details : oSapSplUtils.getErrorMessagesfromErrorPayload ( JSON.parse ( error.responseText ) )["ufErrorObject"]
					} );
				}
				oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
				jQuery.sap.log.error ( error["status"], error.statusText, "CreateDisplayAreaDialog.controller.js" );
			},
			complete : function ( ) {

			}
		} );
	},

	fnPreparePayloadToCreateDisplayArea : function ( ) {
		var locationID = oSapSplUtils.getUUID ( );
		var bIsPublic = "0", bIsDefault = null, oDefaultDisplayAreaObject = null, oReturnObject = null;
		if ( sap.ui.getCore ( ).getModel ( "sapSplAppConfigDataModel" ).getData ( )["isIncidentEditable"] !== 0 ) {
			if ( this.byId ( "SapSplDisplayAreaIsPublicCheckBox" ).getSelected ( ) ) {
				bIsPublic = "1";
			}
		}

		if ( this.byId ( "SapSplDisplayAreaMakeDefaultCheckBox" ).getSelected ( ) ) {
			bIsDefault = "1";
			if ( this.oViewData.oMapInstance.defaultDisplayArea !== null && this.oViewData.oMapInstance.defaultDisplayArea !== undefined ) {
				oDefaultDisplayAreaObject = {};
				oDefaultDisplayAreaObject.UUID = sap.ui.getCore ( ).getModel ( "loggedOnUserModel" ).getData ( ).profile.UUID;
				oDefaultDisplayAreaObject.LocationID = this.oViewData.oMapInstance.defaultDisplayArea.LocationID;
				oDefaultDisplayAreaObject.Favourite = "1";
				oDefaultDisplayAreaObject.isDefault = "0";
				oDefaultDisplayAreaObject.ChangeMode = "U";
			}
		} else {
			bIsDefault = "0";
		}

		/* Fix for : 1570749333 - changed Geometry to SpacialGeometry */

		oReturnObject = {
			"Header" : [{
				"LocationID" : locationID,
				"Name" : this.byId ( "SapSplDisplayAreaNameInput" ).getValue ( ),
				"OwnerID" : oSapSplUtils.getCompanyDetails ( )["BasicInfo_CompanyID"],
				"Type" : "L00002",
				"Geometry" : oSapSplMapsDataMarshal.convertStringToGeoJSON ( this.oViewData.oMapInstance.boundingRectangle ),
				"Stacked" : "0",
				"isPublic" : bIsPublic,
				"ParentLocationID" : null,
				"ImageUrl" : null,
				"Website" : null,
				"PhoneNumber" : null,
				"DisplayArea.ZoomLevel" : this.oViewData.oMapInstance.zoom,
				"DisplayArea.Center" : oSapSplMapsDataMarshal.convertStringToGeoJSON ( this.oViewData.oMapInstance.centerpoint ),
				"ChangeMode" : "I"
			}],
			"Texts" : [{
				"LocationID" : locationID,
				"Type" : "T",
				"Text" : "LC0006",
				"ObjectUUID" : locationID,
				"LocaleLanguage" : null,
				"Language" : "E",
				"ChangeMode" : "I"
			}],
			"Personalization" : {
				"DisplayArea" : [{
					"UUID" : sap.ui.getCore ( ).getModel ( "loggedOnUserModel" ).getData ( ).profile.UUID,
					"LocationID" : locationID,
					"Favourite" : "1",
					"isDefault" : bIsDefault,
					"ChangeMode" : "I"
				}]
			},
			"inputHasChangeMode" : true
		};

		if ( oDefaultDisplayAreaObject !== null ) {
			oReturnObject.Personalization.DisplayArea.push ( oDefaultDisplayAreaObject );
			return oReturnObject;
		} else {
			return oReturnObject;
		}

	},

	fnToCaptureLiveChangeNameInput : function ( oEvent ) {
		if ( oEvent.getSource ( ).getValue ( ).length > 0 ) {
			this.oParentDialogInstance.getBeginButton ( ).setEnabled ( true );
		} else {
			this.oParentDialogInstance.getBeginButton ( ).setEnabled ( false );
		}
		this.fnToCaptureLiveChangeToSetFlag ( );
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
	}

} );
