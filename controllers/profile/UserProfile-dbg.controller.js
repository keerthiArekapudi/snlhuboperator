/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.require ( "splReusable.libs.SapSplAppErrorHandler" );
sap.ui.controller ( "splController.profile.UserProfile", {

	oUserProfileModel : {},
	// An empty object to be used as JSON Model later
	oUserDetails : {},

	onInit : function ( oEvent ) {

		/* function to fetch a list of theme preferences */
		function fnFetchThemePreferencesList ( instance ) {
			var oSapSplThemePreferencesModel = new sap.ui.model.json.JSONModel ( );
			oSapSplAjaxFactory.fireAjaxCall ( {
				url : oSapSplUtils.getFQServiceUrl ( "/sap/spl/xs/app/services/appl.xsodata/MyThemePreference?$format=json" ),
				method : "GET",
				async : true,
				success : function ( data ) {
					oSapSplThemePreferencesModel.setData ( data.d.results );
					instance.getView ( ).byId ( "sapSclThemeGridLayout" ).setModel ( oSapSplThemePreferencesModel );
				},
				error : function ( oError ) {
					$.sap.log.error ( "Error: " + oError.toString ( ), "Failure of theme preference list fetch", "SAPSCL" );
				}

			} );

		}
		fnFetchThemePreferencesList ( this );

		splReusable.libs.SapSplStyleSheetLoader.loadStyle ( "./resources/styles/sapSplProfile" );
		this.byId ( "sapSclFollowTrucksTableHeaderText" ).setText ( oSapSplUtils.getBundle ( ).getText ( "MY_VEHICLES_MASTER_TITLE", [0] ) );
	},

	loadStyleSheet : function ( ) {

	},

	onBeforeRendering : function ( ) {

	},

	goBackToCaller : function ( goBackWithData ) {

		oSplBaseApplication.getAppInstance ( ).back ( {
			goBackWithData : goBackWithData
		} );

	},

	onAfterRendering : function ( ) {

	},

	onBeforeShow : function ( ) {

	},

	handleDeleteOfAccountAction : function ( ) {

		function __handleRedirectOfUserOnSuccessfulDeletion__ ( ) {
			/** *********Set to 'app' to avoid browser prompt************ */
			oSapSplUtils.sLO4S = "app";

			/** *********Set the flag to '2' to display the feedback page and suppress the registration page *********** */
			oSapSplUtils.getStorageInstance ( "local" ).put ( "src", 2 );

			/** *****Finally redirect to the redirpath enum value******* */
			window.location.href = SapSplEnums.REDIRPATH;
		}

		function __deleteUserAccount__ ( ) {
			var oDeleteActionPayload = {
				"inputHasChangeMode" : true,
				"Header" : [{
					"UUID" : sap.ui.getCore ( ).getModel ( "loggedOnUserModel" ).getData ( )["profile"]["UUID"],
					// Basic Info Type being added as per discussion
					"BasicInfo.Type" : "P",
					"ChangeMode" : "D"
				}]
			};

			oSapSplAjaxFactory.fireAjaxCall ( {
				url : oSapSplUtils.getServiceMetadata ( "bupa", true ),
				method : "POST",
				data : JSON.stringify ( oDeleteActionPayload ),
				timeout : 60000,
				beforeSend : function ( xhr ) {
					xhr.setRequestHeader ( "Content-Type", "application/json;charset:utf-8" );
					xhr.setRequestHeader ( "X-CSRF-Token", oSapSplUtils.getCSRFToken ( ) );
				},
				success : function ( ) {
					sap.m.MessageToast.show ( oSapSplUtils.getBundle ( ).getText ( "USER_PROFILE_UPDATE_SUCCESSFUL" ), {
						duration : 2000,
						onClose : function ( ) {
							__handleRedirectOfUserOnSuccessfulDeletion__ ( );
						}
					} );

				},
				error : function ( xhr, textStatus ) {
					if ( textStatus === "timeout" ) {
						sap.m.MessageBox.show ( oSapSplUtils.getBundle ( ).getText ( "SERVICE_TIMEOUT_ERROR" ), {
							icon : sap.m.MessageBox.Icon.ERROR,
							title : oSapSplUtils.getBundle ( ).getText ( "ERROR_MESSAGE_HANDLING_TITLE" ),
							actions : [],
							onClose : function ( ) {
								jQuery.sap.log.error ( "SPL User Profile", "Profile update failed", "SAPSCL" );
							}
						}, null, oSapSplUtils.fnSyncStyleClass ( "messageBox" ) );
					} else {
						oSapSplAppErrorHandler.show ( xhr, true, null, function ( oDialogClosed ) {
							jQuery.sap.log.info ( "SAP Connected Logistics", "Dialog close Event fired " + oDialogClosed.m, "SAPSCL" );
							jQuery.sap.log.error ( "SPL User Profile", "Profile update failed.", "SAPSCL" );
						} );
					}
				}
			} );
		}

		sap.m.MessageBox.show ( oSapSplUtils.getBundle ( ).getText ( "PROMPT_FOR_DELETION_OF_USER_ACCOUNT", [SapSplEnums.APPNAME] ), {
			icon : sap.m.MessageBox.Icon.WARNING,
			title : "{splI18NModel>PROMPT_FOR_DELETION_DIALOG_TITLE}",
			actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
			onClose : function ( oAction ) {
				if ( oAction === sap.m.MessageBox.Action.NO ) {
					return;
				} else {
					__deleteUserAccount__ ( );
				}
			}
		} );

	},

	updateBindings : function ( oEvent ) {

		/* CSNFIX : 0120031469 0000759828 2014 - to show header home button */
		oSapSplUtils.showHeaderButton ( {
			showButton : true,
			sNavToPage : "splView.tileContainer.MasterTileContainer",
			navIcon : "sap-icon://home"
		} );

		/**
		* Explicitly handle forward navigation
		* 
		* @private
		* @since 1.0
		*/

		function __udpateBindingsFromNavData__ ( oEvent, instance ) {

			this.oUserDetails = oEvent.data.cDetails;

			instance.oUserProfileModel.setData ( this.oUserDetails );

			instance.byId ( "userProfilePage" ).setModel ( instance.oUserProfileModel );
			if ( instance.getView ( ).byId ( "sapSclThemeGridLayout" ) && instance.getView ( ).byId ( "sapSclThemeGridLayout" ).getBinding ( "content" ) ) {
				instance.getView ( ).byId ( "sapSclThemeGridLayout" ).getBinding ( "content" ).filter ( new sap.ui.model.Filter ( "Value", sap.ui.model.FilterOperator.EQ, (oSapSplUtils.getLoggedOnUserDetails ( )["profile"]["Theme"] || "sap_bluecrystal") )  );
			}

		}

		/**
		 * Explicitly handle reverse navigation (coming from Edit mode)
		 * 
		 * @private
		 * @since 1.0
		 */

		function __updateBindingsFromBackData__ ( oEvent, instance ) {

			if ( oEvent.backData && oEvent.backData.goBackWithData === 1 ) {

				oSapSplAjaxFactory.fireAjaxCall ( {
					url : oSapSplUtils.getServiceMetadata ( SapSplEnums.RootApp, true ) + "/MyUsers/?$filter=(isMyself eq 1)&$format=json",
					method : "GET",
					success : function ( oResult ) {

						oSapSplUtils.setLoggedOnUserDetails ( {
							profile : oResult.d.results[0]
						} );

						var oModel = new sap.ui.model.json.JSONModel ( );

						oModel.setData ( oResult.d.results[0] );

						instance.byId ( "userProfilePage" ).setModel ( oModel );

					},

					error : function ( xhr ) {
						sap.ca.ui.message.showMessageBox ( {
							type : sap.ca.ui.message.Type.ERROR,
							message : oSapSplUtils.getBundle ( ).getText ( "GENERIC_ERROR_MESSAGE" ),
							details : oSapSplUtils.getErrorMessagesfromErrorPayload ( xhr.responseText )
						}, function ( ) {
						// Handle close of the message box explicitly
						} );

					}
				} );
			}
		}

		if ( !this.oUserProfileModel.hasOwnProperty ( "setData" ) ) {

			this.oUserProfileModel = new sap.ui.model.json.JSONModel ( );

		}

		if ( oEvent.data && !oEvent.backData.hasOwnProperty ( "goBackWithData" ) ) {

			__udpateBindingsFromNavData__ ( oEvent, this );

		} else {

			__updateBindingsFromBackData__ ( oEvent, this );

		}

	},

	handleProfileBackNavigation : function ( ) {
		oSplBaseApplication.getAppInstance ( ).back ( );
	},

	handleProfileEditActionEvent : function ( ) {

		if ( this.byId ( "sapSclProfileAndSettingIconTabBar" ).getSelectedKey ( ) === "sapSclIconTabFilternotifications" ) {
			this.getView ( ).byId ( "sapSclThemeGridLayout" ).removeStyleClass ( "sapSplThemePreferenceLayout" );
			this.getView ( ).byId ( "sapSclThemeGridLayout" ).getBinding ( "content" ).filter ( [] );

			this.byId ( "btnEditUserProfile" ).setVisible ( false );
			this.byId ( "sapSclFollowTrucksSaveButton" ).setVisible ( true );
			this.byId ( "sapSclFollowTrucksCancelButton" ).setVisible ( true );
		} else if ( this.byId ( "sapSclProfileAndSettingIconTabBar" ).getSelectedKey ( ) === "sapSclIconTabFilterFollowTrucks" ) {

			this.byId ( "sapSplFollowTrucksSubscribeCheckBox" ).setVisible ( true );
			this.byId ( "sapSplFollowTrucksSubscribeText" ).setVisible ( false );

			this.byId ( "btnEditUserProfile" ).setVisible ( false );

			this.byId ( "sapSclFollowTrucksSaveButton" ).setVisible ( true );
			this.byId ( "sapSclFollowTrucksCancelButton" ).setVisible ( true );
			if ( $ ( ".sapSclFollowTrucksColumnListItems" ) && $ ( ".sapSclFollowTrucksColumnListItems" ).not ( ".SapSplTrucksListDisabled" ).length > 0 ) {
				($ ( ".sapSclFollowTrucksColumnListItems" ).not ( ".SapSplTrucksListDisabled" ))[0].focus ( );
			}

		} else {
			if ( !oSplBaseApplication.getAppInstance ( ).getPage ( "splView.profile.EditUserProfile" ) ) {

				var oEditProfileView = sap.ui.view ( {

					viewName : "splView.profile.EditUserProfile",

					id : "splView.profile.EditUserProfile",

					type : sap.ui.core.mvc.ViewType.XML

				} );

				oEditProfileView.addEventDelegate ( {
					onBeforeShow : function ( oEvent ) {

						/* CSNFIX : 0120031469 269466 */
						this.oPayloadObject.Header = [];

						this.getData ( oEvent );

					}
				}, oEditProfileView.getController ( ) );

				oSplBaseApplication.getAppInstance ( ).addPage ( oEditProfileView );

			}

			oSplBaseApplication.getAppInstance ( ).to ( "splView.profile.EditUserProfile", {
				cDetails : sap.ui.getCore ( ).getModel ( "loggedOnUserModel" ).getData ( )["profile"]
			} );
		}
	},

	fnHandleFollowTrucksViewSettingDialog : function ( oEvent ) {
		if ( !this.oFollowTrucksViewSettingDialog ) {
			this.oFollowTrucksViewSettingDialog = sap.ui.xmlfragment ( "splView.profile.FollowTrucksViewSettingDialog", this );
		}

		oSapSplUtils.fnSyncStyleClass ( this.oFollowTrucksViewSettingDialog );
		this.oFollowTrucksViewSettingDialog.open ( );
		if ( oEvent.getSource ( ).getId ( ).indexOf ( "sapSclFollowTrucksFilter" ) > -1 ) {
			this.oFollowTrucksViewSettingDialog._getFilterButton ( ).firePress ( );
		} else {
			this.oFollowTrucksViewSettingDialog._getGroupButton ("group" );
		}
	},

	fnHandleSelectOfIconTabFilter : function ( oEvent ) {

		if ( oEvent.getParameters ( ).selectedKey === "sapSclIconTabFilternotifications" ) {
			this.getView ( ).byId ( "sapSclThemeGridLayout" ).addStyleClass ( "sapSplThemePreferenceLayout" );
			this.byId ( "btnEditUserProfile" ).setVisible ( splReusable.libs.SapSplModelFormatters.showEditable ( sap.ui.getCore ( ).getModel ( "loggedOnUserModel" ).getData ( ).profile.isEditable ) );
			this.byId ( "sapSclFollowTrucksSaveButton" ).setVisible ( false );
			this.byId ( "sapSclFollowTrucksCancelButton" ).setVisible ( false );
			this.getView ( ).byId ( "sapSclThemeGridLayout" ).getBinding ( "content" ).filter ( new sap.ui.model.Filter ( "Value", sap.ui.model.FilterOperator.EQ, (oSapSplUtils.getLoggedOnUserDetails ( )["profile"]["Theme"] || "sap_bluecrystal") ) );

		} else if ( oEvent.getParameters ( ).selectedKey === "sapSclIconTabFilterFollowTrucks" ) {

			if ( !sap.ui.getCore ( ).getModel ( "SapSclFollowTrucksOataModel" ) ) {
				var oSapSclFollowTrucksOataModel = new splModels.odata.ODataModel ( {
					url : oSapSplUtils.getFQServiceUrl ( "/sap/spl/xs/app/services/appl.xsodata/" ),
					json : true,
					headers : {
						"Cache-Control" : "max-age=0"
					},
					tokenHandling : true,
					withCredentials : false,
					loadMetadataAsync : true,
					handleTimeOut : true,
					numberOfSecondsBeforeTimeOut : 10000
				} );

				oSapSclFollowTrucksOataModel.attachRequestCompleted ( jQuery.proxy ( this.ODataModelRequestCompleted, this ) );

				sap.ui.getCore ( ).setModel ( oSapSclFollowTrucksOataModel, "SapSclFollowTrucksOataModel" );

				this.getView ( ).byId ( "sapSplFollowTrucksTab" ).setModel ( sap.ui.getCore ( ).getModel ( "SapSclFollowTrucksOataModel" ) );

				this.oSapSplVehiclesFilterIsValidTruck = new sap.ui.model.Filter ( "isDeleted", sap.ui.model.FilterOperator.EQ, "0" );

				this.mGroupFunctions = {
					isSharedWithMyOrg : function ( oContext ) {
						var isShared = oContext.getProperty ( "isSharedWithMyOrg" );
						if ( isShared === 1 ) {
							return {
								key : isShared,
								text : oSapSplUtils.getBundle ( ).getText ( "SHARED" )
							};
						} else {
							return {
								key : isShared,
								text : oSapSplUtils.getBundle ( ).getText ( "OWNED" )
							};
						}
					},
					isSubscribed : function ( oContext ) {
						var isSubscribed = oContext.getProperty ( "isSubscribed" );

						if ( isSubscribed === "1" ) {
							return {
								key : isSubscribed,
								text : oSapSplUtils.getBundle ( ).getText ( "TRUCKS_SUBSCRIBED" )
							};
						} else {
							return {
								key : isSubscribed,
								text : oSapSplUtils.getBundle ( ).getText ( "TRUCKS_NOT_SUBSCRIBED" )
							};
						}

					}
				};

				this.aSubscribeTruckList = [];
				this.aSubscribeTruckRegNoList = [];
				this.SapSplSearchFilters = [];

				this.getView ( ).byId ( "sapSplFollowTrucksTab" ).getBinding ( "items" ).filter ( [this.oSapSplVehiclesFilterIsValidTruck] );

				this.aAppliedFilters = this.getView ( ).byId ( "sapSplFollowTrucksTab" ).getBinding ( "items" ).aFilters;

				this.aAppliedSorters = this.getView ( ).byId ( "sapSplFollowTrucksTab" ).getBinding ( "items" ).aSorters;

			} else {
				sap.ui.getCore ( ).getModel ( "SapSclFollowTrucksOataModel" ).refresh ( );
				this.byId ( "sapSplFollowTrucksSubscribeCheckBox" ).setVisible ( false );
				this.byId ( "sapSplFollowTrucksSubscribeText" ).setVisible ( true );
				this.byId ( "btnEditUserProfile" ).setVisible ( splReusable.libs.SapSplModelFormatters.showEditable ( sap.ui.getCore ( ).getModel ( "loggedOnUserModel" ).getData ( ).profile.isEditable ) );

				this.byId ( "sapSclFollowTrucksSaveButton" ).setVisible ( false );
				this.byId ( "sapSclFollowTrucksCancelButton" ).setVisible ( false );
			}
			this.byId ( "sapSclFollowTrucksSearchField" ).focus ( );
		} else {
			this.byId ( "sapSclFollowTrucksSaveButton" ).setVisible ( false );
			this.byId ( "sapSclFollowTrucksCancelButton" ).setVisible ( false );
			this.byId ( "btnEditUserProfile" ).setVisible ( true );
		}
	},

	ODataModelRequestCompleted : function ( oEvent ) {
		if ( oEvent.mParameters.success ) {
			this.byId ( "sapSclFollowTrucksTableHeaderText" ).setText ( oSapSplUtils.getBundle ( ).getText ( "MY_VEHICLES_MASTER_TITLE", [splReusable.libs.Utils.prototype.getListCount ( this.byId ( "sapSplFollowTrucksTab" ) )] ) );
		}
		
		if( oEvent.mParameters.errorobject ) {
			if( oEvent.mParameters.errorobject.message === SapSplEnums.REQUEST_ABORTED ) {
				this.getView ( ).byId ( "sapSplFollowTrucksTab" ).setBusy(false);
			}
			
		}
	},

	fnHandleConfirmOfViewSettingDialog : function ( oEvent ) {
		var oTable = this.getView ( ).byId ( "sapSplFollowTrucksTab" );
		var mParams = oEvent.getParameters ( );
		var oBinding = oTable.getBinding ( "items" );
		var aSorters = [];
		var vGroup;

		if ( mParams.groupItem ) {
			var sPath = mParams.groupItem.getKey ( );
			var bDescending = mParams.groupDescending;
			vGroup = this.mGroupFunctions[sPath];
			aSorters.push ( new sap.ui.model.Sorter ( sPath, bDescending, vGroup ) );
		}
		if( aSorters.length > 0 ) {
			oBinding.sort ( aSorters );
		}

		var aFilters = [];

		jQuery.each ( mParams.filterItems, function ( i, oItem ) {
			var aSplit = oItem.getKey ( ).split ( "_" );
			var sPath = aSplit[0];
			var sValue = aSplit[1];

			aFilters.push ( new sap.ui.model.Filter ( sPath, sap.ui.model.FilterOperator.EQ, sValue ) );
			if ( aSplit[2] ) {
				var sPath1 = aSplit[2];
				var sValue1 = aSplit[3];
				aFilters.push ( new sap.ui.model.Filter ( sPath1, sap.ui.model.FilterOperator.EQ, sValue1 ) );
			}

		} );

		if ( aFilters.length === 0 ) {
			aFilters.push ( new sap.ui.model.Filter ( "isDeleted", sap.ui.model.FilterOperator.EQ, "0" ) );
		}

		this.aAppliedFilters = $.extend ( true, [], aFilters );

		if ( this.SapSplSearchFilters.length !== 0 ) {
			aFilters.push ( this.SapSplSearchFilters );
		}

		oBinding.filter ( aFilters );

		this.aAppliedSorters = oBinding.aSorters;
	},

	fnHandleUserPreferenceSaveButton : function ( ) {
		var payload = {};

		if ( this.byId ( "sapSclProfileAndSettingIconTabBar" ).getSelectedKey ( ) === "sapSclIconTabFilternotifications" ) {

			this.byId ( "btnEditUserProfile" ).setVisible ( true );
			this.byId ( "sapSclFollowTrucksSaveButton" ).setVisible ( false );
			this.byId ( "sapSclFollowTrucksCancelButton" ).setVisible ( false );
			if ( this.selectedThemeFromProfile ) {
				oSapSplUserPreference.saveTheme ( this.selectedThemeFromProfile );
			}
		} else if ( this.byId ( "sapSclProfileAndSettingIconTabBar" ).getSelectedKey ( ) === "sapSclIconTabFilterFollowTrucks" ) {
			payload.VehicleSubscription = [];
			payload.VehicleSubscription = this.preparePayload ( );
			payload.inputHasChangeMode = true;

			oSapSplBusyDialog.getBusyDialogInstance ( {
				title : oSapSplUtils.getBundle ( ).getText ( "BUSY_DIALOG_MESSAGE" )
			} ).open ( );

			oSapSplAjaxFactory.fireAjaxCall ( {
				url : oSapSplUtils.getFQServiceUrl ( "/sap/spl/xs/app/services/personPreferences.xsjs" ),
				method : "PUT",
				data : JSON.stringify ( payload ),
				timeout : 60000,
				beforeSend : function ( xhr ) {
					xhr.setRequestHeader ( "Content-Type", "application/json;charset:utf-8" );
					xhr.setRequestHeader ( "X-CSRF-Token", oSapSplUtils.getCSRFToken ( ) );
				},
				success : function ( data, success, messageObject ) {

					oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );

					sap.m.MessageToast.show ( oSapSplUtils.getBundle ( ).getText ( "USER_PROFILE_UPDATE_SUCCESSFUL" ) );

					sap.ui.getCore ( ).getModel ( "SapSclFollowTrucksOataModel" ).refresh ( );

					this.aSubscribeTruckList = [];
					this.aSubscribeTruckRegNoList = [];

					this.byId ( "sapSplFollowTrucksSubscribeCheckBox" ).setVisible ( false );
					this.byId ( "sapSplFollowTrucksSubscribeText" ).setVisible ( true );
					this.byId ( "btnEditUserProfile" ).setVisible ( splReusable.libs.SapSplModelFormatters.showEditable ( sap.ui.getCore ( ).getModel ( "loggedOnUserModel" ).getData ( ).profile.isEditable ) );

					this.byId ( "sapSclFollowTrucksSaveButton" ).setVisible ( false );
					this.byId ( "sapSclFollowTrucksCancelButton" ).setVisible ( false );

					oSapSplUtils.setIsDirty ( false );

				}.bind ( this ),
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
		}
	},

	preparePayload : function ( ) {
		var payload = [], i, oPayload = {}, regNo;
		for ( i = 0 ; i < this.aSubscribeTruckRegNoList.length ; i++ ) {
			regNo = this.aSubscribeTruckRegNoList[i];
			if ( this.aSubscribeTruckList[regNo].isValid ) {
				oPayload = {};
				oPayload.VehicleUUID = this.aSubscribeTruckList[regNo].UUID;
				oPayload.isSubscribed = this.aSubscribeTruckList[regNo].isSubscribed;
				oPayload.ChangeMode = "U";
				payload.push ( oPayload );
			}
		}
		return payload;
	},

	fnHandleSelectOfTheme : function ( oEvent ) {
		if ( this.byId ( "sapSclProfileAndSettingIconTabBar" ).getSelectedKey ( ) === "sapSclIconTabFilternotifications" ) {
			this.fnToCaptureLiveChangeToSetFlag ( );
			this.selectedThemeFromProfile = oEvent.getSource ( ).getBindingContext ( ).getObject ( ).Value;
		}
	},

	fnHandleUserPreferenceCancelButton : function ( ) {

		var that = this;

		if ( oSapSplUtils.getIsDirty ( ) ) {
			sap.m.MessageBox.show ( oSapSplUtils.getBundle ( ).getText ( "DATA_LOSS_WARNING_TEXT" ), sap.m.MessageBox.Icon.WARNING, oSapSplUtils.getBundle ( ).getText ( "WARNING" ), [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
					function ( selection ) {
						if ( selection === "YES" ) {
							jQuery.proxy ( that.fnHandlePerformCancelAction ( ), that );
						}
					} );
		} else {
			this.fnHandlePerformCancelAction ( );
		}

	},

	fnHandlePerformCancelAction : function ( ) {
		if ( this.byId ( "sapSclProfileAndSettingIconTabBar" ).getSelectedKey ( ) === "sapSclIconTabFilternotifications" ) {
			this.getView ( ).byId ( "sapSclThemeGridLayout" ).addStyleClass ( "sapSplThemePreferenceLayout" );
			this.getView ( ).byId ( "sapSclThemeGridLayout" ).getBinding ( "content" ).filter ( new sap.ui.model.Filter( "Value", sap.ui.model.FilterOperator.EQ, (oSapSplUtils.getLoggedOnUserDetails ( )["profile"]["Theme"] || "sap_bluecrystal") ) );
		} else if ( this.byId ( "sapSclProfileAndSettingIconTabBar" ).getSelectedKey ( ) === "sapSclIconTabFilterFollowTrucks" ) {
			this.byId ( "sapSplFollowTrucksSubscribeCheckBox" ).setVisible ( false );
			this.byId ( "sapSplFollowTrucksSubscribeText" ).setVisible ( true );
			sap.ui.getCore ( ).getModel ( "SapSclFollowTrucksOataModel" ).refresh ( true );
		}

		this.byId ( "btnEditUserProfile" ).setVisible ( splReusable.libs.SapSplModelFormatters.showEditable ( sap.ui.getCore ( ).getModel ( "loggedOnUserModel" ).getData ( ).profile.isEditable ) );
		this.byId ( "sapSclFollowTrucksSaveButton" ).setVisible ( false );
		this.byId ( "sapSclFollowTrucksCancelButton" ).setVisible ( false );
		oSapSplUtils.setIsDirty ( false );
	},

	fnHandleSelectOfCheckBox : function ( oEvent ) {
		var regNo = oEvent.getSource ( ).getBindingContext ( ).getProperty ( ).RegistrationNumber;
		var uuid = oEvent.getSource ( ).getBindingContext ( ).getProperty ( ).UUID;

		this.fnToCaptureLiveChangeToSetFlag ( );

		if ( this.aSubscribeTruckList[regNo] ) {
			this.aSubscribeTruckList[regNo].isSubscribed = oEvent.getParameters ( ).selected ? "1" : "0";
			this.aSubscribeTruckList[regNo].isValid = this.aSubscribeTruckList[regNo].isValid ? false : true;
		} else {
			this.aSubscribeTruckList[regNo] = {};
			this.aSubscribeTruckList[regNo].UUID = uuid;
			this.aSubscribeTruckList[regNo].isSubscribed = oEvent.getParameters ( ).selected ? "1" : "0";
			this.aSubscribeTruckList[regNo].isValid = true;
			this.aSubscribeTruckRegNoList.push ( regNo );
		}
	},

	/**
	 * @description Called to set isDirtyFlag to true in Utils
	 * @returns void.
	 * @since 1.0
	 */
	fnToCaptureLiveChangeToSetFlag : function ( ) {
		if ( !oSapSplUtils.getIsDirty ( ) ) {
			oSapSplUtils.setIsDirty ( true );
		}
	},

	fnHandleRegistrationNumberLink : function ( oEvent ) {

		//Fix to Incident ID 1580130805
		var that = this;
		var eventObject = $.extend ( true, {}, oEvent );
		if ( oSapSplUtils.getIsDirty ( ) ) {
			sap.m.MessageBox.show ( oSapSplUtils.getBundle ( ).getText ( "DATA_LOSS_WARNING_TEXT" ), sap.m.MessageBox.Icon.WARNING, oSapSplUtils.getBundle ( ).getText ( "WARNING" ), [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
					function ( selection ) {
						if ( selection === "YES" ) {
							jQuery.proxy ( that.fnHandlePerformRegistrationLinkNavigation ( eventObject ), that );
						}
					} );
		} else {
			this.fnHandlePerformRegistrationLinkNavigation ( eventObject );
		}
	},

	//Fix to Incident ID 1580130805
	fnHandlePerformRegistrationLinkNavigation : function ( eventObject ) {
		var sNavTo = "splView.vehicles.VehicleMasterDetail";
		var oNavToPageView = null;
		this.fnHandlePerformCancelAction ( );
		if ( !sap.ui.getCore ( ).byId ( "sapSplBaseApplication" ).getPage ( sNavTo ) ) {

			oNavToPageView = sap.ui.view ( {
				viewName : sNavTo,
				id : sNavTo,
				type : sap.ui.core.mvc.ViewType.XML
			} );

			oNavToPageView.addEventDelegate ( {
				onBeforeShow : jQuery.proxy ( oNavToPageView.getController ( ).onBeforeShow, oNavToPageView.getController ( ) )
			} );
			sap.ui.getCore ( ).byId ( "sapSplBaseApplication" ).addPage ( oNavToPageView );
		}

		var oNavData = {};
		oNavData["FromApp"] = "profile";
		oNavData["RegistrationNumber"] = eventObject.getSource ( ).getBindingContext ( ).getProperty ( ).RegistrationNumber;
		oNavData["showBackButton"] = true;
		oSplBaseApplication.getAppInstance ( ).to ( sNavTo, "slide", oNavData );
	},

	/**
	 * @description Search of Vehicles on Press of Search icon or enter
	 * @param {object} event
	 */
	fnToHandleSearchOfFollowTrucks : function ( event ) {
		var searchString = event.mParameters.query;
		var oSapSplVehiclesList;
		var payload, that = this;

		oSapSplVehiclesList = this.getView ( ).byId ( "sapSplFollowTrucksTab" );

		if ( searchString.length > 2 ) {
			payload = this.prepareSearchPayload ( searchString );
			this.callSearchService ( payload );

		} else if ( oSapSplVehiclesList.getBinding ( "items" ) === undefined || oSapSplVehiclesList.getBinding ( "items" ).aFilters.length > 1 || event.mParameters.refreshButtonPressed === true ) {

			oSapSplVehiclesList.unbindAggregation ( "items" );

			oSapSplVehiclesList.bindItems ( {
				path : "/MyTrackableObjects",
				template : that.getView ( ).byId ( "sapSclFollowTrucksCloumnListItem" )
			} );

			oSapSplVehiclesList.getBinding ( "items" ).filter ( this.aAppliedFilters );

			oSapSplVehiclesList.getBinding ( "items" ).sort ( this.aAppliedSorters );

			this.SapSplSearchFilters = [];
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
		payload.ObjectType = "TrackableObject";
		payload.SearchTerm = searchTerm;
		payload.FuzzinessThershold = SapSplEnums.fuzzyThreshold;
		payload.MaximumNumberOfRecords = SapSplEnums.numberOfRecords;
		
		payload.AdditionalCriteria = {};
		payload.AdditionalCriteria.IncludeSharedVehicles = true; 
		
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
		var that = this;

		var sUrl = oSapSplUtils.getFQServiceUrl ( "/sap/spl/xs/app/services/Search.xsjs" );
		var ajaxObject = {
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
		var oSapSplSearchFilters, oSapSplVehiclesFilters = [], oSapSplVehiclesList, index, that = this, oSapSplVehiclesListItemsBinding;

		oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );

		oSapSplVehiclesList = this.getView ( ).byId ( "sapSplFollowTrucksTab" );

		oSapSplVehiclesListItemsBinding = this.getView ( ).byId ( "sapSplFollowTrucksTab" ).getBinding ( "items" );

		if ( data.constructor === String ) {
			data = JSON.parse ( data );
		}
		if ( messageObject["status"] === 200 ) {

			oSapSplVehiclesList.unbindAggregation ( "items" );
			if ( data.length > 0 ) {

				oSapSplSearchFilters = oSapSplUtils.getSearchItemFilters ( data );

				this.SapSplSearchFilters = oSapSplSearchFilters;

				if ( oSapSplSearchFilters.aFilters.length > 0 ) {
					oSapSplVehiclesFilters.push ( oSapSplSearchFilters );
				}

				for ( index = 0 ; index < this.aAppliedFilters.length ; index++ ) {
					oSapSplVehiclesFilters.push ( this.aAppliedFilters[index] );
				}

				oSapSplVehiclesList.bindItems ( {
					path : "/MyTrackableObjects",
					template : that.getView ( ).byId ( "sapSclFollowTrucksCloumnListItem" )
				} );

				oSapSplVehiclesList.getBinding ( "items" ).filter ( oSapSplVehiclesFilters );
				oSapSplVehiclesList.getBinding ( "items" ).sort ( this.aAppliedSorters );

			} else {
				this.byId ( "sapSclFollowTrucksTableHeaderText" ).setText ( oSapSplUtils.getBundle ( ).getText ( "MY_VEHICLES_MASTER_TITLE", [0] ) );

				this.SapSplSearchFilters = [];
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
