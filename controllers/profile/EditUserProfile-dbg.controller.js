/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.require ( "splReusable.libs.SapSplAppErrorHandler" );

sap.ui.controller ( "splController.profile.EditUserProfile", {

	bProfileIsModified : false,
	//IsDirtyFlag added--Amending this code
	oPayloadObject : {

		"inputHasChangeMode" : true,

		"Header" : []
	},
	//The final payload object to be sent for PUT
	oTransientPayload : {},
	//Holds the data being changed before pushing into master object
	oUserProfileModel : {},
	//Master JSON model for binding

	onInit : function ( ) {
		var that = this;
		this.getView ( ).addEventDelegate ( {
			onAfterShow : function ( ) {
				window.setTimeout ( function ( ) {
					that.getView ( ).byId ( "sapSplMyProfileEditModeFirstNameText" ).focus ( );
				}, 100 );
			}
		} );
	},

	/**
	 * @description A single live change. Just needed to set the dirty flag
	 * @since 1.0
	 * @private
	 * @param oEvent
	 */
	commonLiveChange : function ( ) {

		if ( !this.bProfileIsModified ) {

			this.bProfileIsModified = true;

		}
	},

	/**
	 * @description Individual input event handlers
	 * @param oEvent
	 */
	handleFirstNameChange : function ( oEvent ) {
		this.bProfileIsModified = true;
		oSapSplUtils.setIsDirty ( this.bProfileIsModified );
		$.sap.log.info ( "SAP SCL Event", "Event fired " + oEvent, "SAPSCL" );
	},

	/**
	 * @private
	 * @since 1.0
	 * @param oEvent
	 */
	handleLastNameChange : function ( oEvent ) {

		this.bProfileIsModified = true;

		oSapSplUtils.setIsDirty ( this.bProfileIsModified );

		$.sap.log.info ( "SAP SCL Event", "Event fired " + oEvent, "SAPSCL" );

	},

	/**
	 * @private
	 * @param oEvent
	 */
	handleSalutationChange : function ( oEvent ) {

		this.bProfileIsModified = true;

		oSapSplUtils.setIsDirty ( this.bProfileIsModified );

		$.sap.log.info ( "SAP SCL Event", "Event fired " + oEvent, "SAPSCL" );

	},

	/**
	 * @private
	 * @param oEvent
	 */
	handlePrefixChange : function ( oEvent ) {

		this.bProfileIsModified = true;

		oSapSplUtils.setIsDirty ( this.bProfileIsModified );

		$.sap.log.info ( "SAP SCL Event", "Event fired " + oEvent, "SAPSCL" );

	},

	/**
	 * @private
	 * @param oEvent
	 */
	handleTelephoneChange : function ( oEvent ) {

		this.bProfileIsModified = true;

		oSapSplUtils.setIsDirty ( this.bProfileIsModified );

		$.sap.log.info ( "SAP SCL Event", "Event fired " + oEvent, "SAPSCL" );

	},

	/**
	 * @private
	 * @param oEvent
	 */
	handleDesignationChange : function ( oEvent ) {

		this.bProfileIsModified = true;

		oSapSplUtils.setIsDirty ( this.bProfileIsModified );

		$.sap.log.info ( "SAP SCL Event", "Event fired " + oEvent, "SAPSCL" );

	},

	/**
	 * @private
	 * @param oEvent
	 */
	onAfterRendering : function ( ) {},

	/**
	 * @private
	 * @param oEvent
	 */
	handleProfileBackNavigation : function ( ) {

		this.goBackToCaller ( 0 );

	},

	/**
	 * @description Take the current page back to it's source with backData
	 * @since 1.0
	 * @param goBackWithData
	 */
	goBackToCaller : function ( goBackWithData ) {

		oSplBaseApplication.getAppInstance ( ).back ( {
			goBackWithData : goBackWithData
		} );

	},

	/**
	 * @description Save Profile handler
	 * success and error callbacks are overridden as they are not needed.
	 * We handle the situation in complete callback itself.
	 * @private
	 * @param oEvent
	 * @since 1.0
	 */
	handleProfileSaveButtonPressEvent : function ( ) {

		var that = this;

		this.createBaseSkeletonPayloadObject ( );

		this.oPayloadObject.Header[0] = this.oTransientPayload;

		if ( this.bProfileIsModified ) {
			this.constructPayloadForPost ( );

			oSapSplBusyDialog.getBusyDialogInstance ( {
				title : oSapSplUtils.getBundle ( ).getText ( "BUSY_DIALOG_MESSAGE" )
			} ).open ( );

			oSapSplAjaxFactory.fireAjaxCall ( {

				url : oSapSplUtils.getServiceMetadata ( "bupa", true ),

				method : "PUT",

				dataType : "json",

				data : JSON.stringify ( this.oPayloadObject ),

				contentType : "json; charset=UTF-8",

				beforeSend : function ( xhr ) {

					xhr.setRequestHeader ( "Content-Type", "application/json;charset=utf-8" );

					xhr.setRequestHeader ( "X-CSRF-Token", oSapSplUtils.getCSRFToken ( ) );

				},
				success : function ( ) {

				},

				error : function ( ) {

				},

				complete : function ( xhr ) {

					oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );

					if ( xhr.status === 200 ) {

						oSapSplUtils.setIsDirty ( false );
						that.bProfileIsModified = false;

						sap.m.MessageToast.show ( oSapSplUtils.getBundle ( ).getText ( "USER_PROFILE_UPDATE_SUCCESSFUL" ) );

						that.goBackToCaller ( 1 );

					} else if ( xhr.status >= 400 && xhr.status < 500 ) {
						if ( xhr.responseJSON.hasOwnProperty ( "Error" ) ) {
							if ( xhr.responseJSON.Error.length > 0 ) {

								oSapSplAppErrorHandler.show ( xhr, true, null, function ( oDialogClosed ) {
									jQuery.sap.log.info ( "SAP Connected Logistics", "Dialog close Event fired " + oDialogClosed.m, "SAPSCL" );
									jQuery.sap.log.error ( "SPL User Profile", "Profile update failed. Toast rendered and closed", "SAPSCL" );
								} );
							}
						} else {
							oSapSplAppErrorHandler.show ( xhr, false, null, function ( oDialogClosed ) {
								jQuery.sap.log.info ( "SAP Connected Logistics", "Dialog close Event fired " + oDialogClosed.m, "SAPSCL" );
								jQuery.sap.log.error ( "SPL User Profile", "Profile update failed. Toast rendered and closed", "SAPSCL" );
							} );
						}
					} else if ( xhr.status >= 500 ) {
						oSapSplAppErrorHandler.show ( xhr, false, null, function ( oDialogClosed ) {
							jQuery.sap.log.info ( "SAP Connected Logistics", "Dialog close Event fired " + oDialogClosed.m, "SAPSCL" );
							jQuery.sap.log.error ( "SPL User Profile", "Profile update failed. Toast rendered and closed", "SAPSCL" );
						} );
					}
					//                 else {
					//
					//
					//                    /*CSNFIX 370453 2014*/
					//                    sap.m.MessageToast.show(oSapSplUtils.getBundle().getText("PROFILE_UPDATE_SUCCESSFUL"));
					//
					//                    that.goBackToCaller(1);
					//
					//                }

				}

			} );
		} else {
			this.goBackToCaller ( 1 );
		}

	},

	/**
	 * @description For future compatibility. Handle onBeforeShow logic within getData().
	 * @since 1.0
	 * @private
	 * @param oEvent
	 */
	onBeforeShow : function ( ) {

	},

	/**
	 * @description The entry point to this page. Trigger from onBeforeShow closure in Profile view
	 * @param oEvent
	 * @private
	 * @since 1.0
	 */
	getData : function ( oEvent ) {

		var oModel = new sap.ui.model.json.JSONModel ( );

		oModel.setDefaultBindingMode ( sap.ui.model.BindingMode.OneWay ); /*HOTFIX Base model getting updated (on dirty and nav back use case)*/

		oModel.setData ( oEvent.data.cDetails );

		this.byId ( "sapSplUserProfileEditPage" ).setModel ( oModel );

	},

	/**
	 * @description Cancel Profile Change handler
	 * @private
	 * @param oEvent
	 * @since 1.0
	 */
	handleProfileCancelButtonPressEvent : function ( ) {
		this.goBackToCaller ( 0 );

	},

	/**
	 * @description Generate a Transient pay-load object to store the basic fields that don't undergo change
	 * @since 1.0
	 * @private
	 */
	createBaseSkeletonPayloadObject : function ( ) {

		this.oTransientPayload["UUID"] = sap.ui.getCore ( ).getModel ( "loggedOnUserModel" ).getData ( )["profile"]["UUID"];

		this.oTransientPayload["BasicInfo.ID"] = oSapSplUtils.getCompanyDetails ( )["BasicInfo_ID"];

		this.oTransientPayload["BasicInfo.CompanyID"] = oSapSplUtils.getCompanyDetails ( )["BasicInfo_CompanyID"];

		this.oTransientPayload["BasicInfo.Type"] = "P";

		/*CSNFIX 676584 [LOD-SCL]*/
		this.oTransientPayload["ChangeMode"] = "U";

	},

	constructPayloadForPost : function ( ) {
		this.oTransientPayload["PersonName.GivenName"] = this.byId ( "sapSplMyProfileEditModeFirstNameText" ).getValue ( );
		this.oTransientPayload["PersonName.Surname"] = this.byId ( "sapSplMyProfileEditModeLastNameText" ).getValue ( );
		this.oTransientPayload["PersonName.Title"] = this.byId ( "sapSplMyProfileEditModeSalutationText" ).getValue ( );
		this.oTransientPayload["PersonName.SurnamePrefix"] = this.byId ( "sapSplMyProfileEditModePrefixText" ).getValue ( );
		this.oTransientPayload["CommunicationInfo.Phone"] = this.byId ( "sapSplMyProfileEditModeTelephoneText" ).getValue ( );
		this.oTransientPayload["PersonName.JobFunction"] = this.byId ( "sapSplMyProfileEditModeDesignationText" ).getValue ( );
	},

	handleEditProfileBackNavigation : function ( ) {
		this.goBackToCaller ( 0 );
	}

} );
