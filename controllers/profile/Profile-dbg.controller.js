/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.require ( "splReusable.libs.SapSplAppErrorHandler" );
jQuery.sap.require ( "sap.m.MessageBox" );
sap.ui.controller ( "splController.profile.Profile", {

	oCompanyProfileModel : {}, // An empty object to be used as JSON Model
	// later

	oCompanyDetails : {},

	oUsageLogModel : null,

	onInit : function ( ) {
		this.customDate1 = null;
		this.customDate2 = null;
		splReusable.libs.SapSplStyleSheetLoader.loadStyle ( "./resources/styles/sapSplProfile" );

		sap.ui.getCore ( ).setModel ( new sap.ui.model.json.JSONModel ( {
			editButton : true
		} ), "profileButtonVisibilityModel" );

		this.getView ( ).byId ( "sapSplEditHubButton" ).addCustomData ( new sap.ui.core.CustomData ( {
			key : "EditHubDetails",
			value : "EditHubDetails"
		} ) );

		this.getView ( ).byId ( "sapSplAddHubButton" ).addCustomData ( new sap.ui.core.CustomData ( {
			key : "AddHub",
			value : "AddHub"
		} ) );

		this.getView ( ).byId ( "sapSplDeregisterMyCompanyButton" ).addCustomData ( new sap.ui.core.CustomData ( {
			key : "DeregisterHub",
			value : "DeregisterHub"
		} ) );

		this.sSelectedTimeHorizon = "C";
		var oData = {
			results : [{
				name : oSapSplUtils.getBundle ( ).getText ( "CURRENT_MONTH" ),
				key : "C"
			}, {
				name : oSapSplUtils.getBundle ( ).getText ( "LAST_MONTH" ),
				key : "L"
			}, {
				name : oSapSplUtils.getBundle ( ).getText ( "LAST_QUARTER" ),
				key : "Q"
			}, {
				name : oSapSplUtils.getBundle ( ).getText ( "LAST_QUARTER_TODATE" ),
				key : "QTD"
			}, {
				name : oSapSplUtils.getBundle ( ).getText ( "MANUAL_SELECTION" ),
				key : "Manual"
			}]
		};

		this.sapSplUsageTimeHorizonModel = new sap.ui.model.json.JSONModel ( );

		this.sapSplUsageTimeHorizonModel.setData ( oData );

		this.byId ( "SapSplUsageTimeHorizon" ).setModel ( this.sapSplUsageTimeHorizonModel );

		/* Fix for incident 1580068687 */
		this.byId ( "SapSplUsageTimeHorizon" ).setModel ( this.sapSplUsageTimeHorizonModel );
		if (this.byId ( "SapSplUsageTimeHorizon" )) {
			this.byId ( "SapSplUsageTimeHorizon" ).addEventDelegate ( {
				onAfterRendering : function ( oEvent ) {
					oEvent.srcControl.$ ( ).on ( "focusout", function ( oEvent ) {
						oEvent.stopPropagation ( );
					} );
				}
			} );
		}
		
	},

	onBeforeRendering : function ( ) {

	},

	handleIconTabSelect : function ( oEvent ) {
		if ( oEvent && oEvent.getParameter ( "key" ) !== undefined ) {
			if ( oEvent.getParameter ( "key" ) === "sapSplUsageInfo" ) {
				sap.ui.getCore ( ).getModel ( "profileButtonVisibilityModel" ).getData ( )["editButton"] = false;
				sap.ui.getCore ( ).getModel ( "profileButtonVisibilityModel" ).refresh ( );
				/*** BCP Ticket 1570474947 **/
				this.byId ( "sapSnlhCompnayTourSettingsSaveButton" ).setVisible ( false );
				this.byId ( "sapSnlhCompnayTourSettingsCancelButton" ).setVisible ( false );
				this.handleUsagelogTabSelect ( );
				this.byId ( "SapSplUsageTimeHorizon" ).focus ( );
			} else if ( oEvent.getParameter ( "key" ) === "sapSplCompanyInfo" ) {
				sap.ui.getCore ( ).getModel ( "profileButtonVisibilityModel" ).getData ( )["editButton"] = true;
				sap.ui.getCore ( ).getModel ( "profileButtonVisibilityModel" ).refresh ( );
				/*** BCP Ticket 1570474947 **/
				this.byId ( "sapSnlhCompnayTourSettingsSaveButton" ).setVisible ( false );
				this.byId ( "sapSnlhCompnayTourSettingsCancelButton" ).setVisible ( false );
				this.byId ( "btnEditCompanyProfile" ).setVisible (
						splReusable.libs.SapSplModelFormatters.showEditable ( this.oCompanyProfileModel.getData ( ).isEditable, sap.ui.getCore ( ).getModel ( "profileButtonVisibilityModel" ).getData ( ).editButton ) );
			} else if ( oEvent.getParameter ( "key" ) === "sapSnlhCompanyTourSettings" ) {
				sap.ui.getCore ( ).getModel ( "profileButtonVisibilityModel" ).getData ( )["editButton"] = true;
				sap.ui.getCore ( ).getModel ( "profileButtonVisibilityModel" ).refresh ( );
				if ( !sap.ui.getCore ( ).getModel ( "SapSnlhCompanyTourSettingsModel" ) ) {
					var oSapSnlhCompanyTourSettingsModel = new sap.ui.model.json.JSONModel ( {} );

					this.initializeThresholdJson ( );

					sap.ui.getCore ( ).setModel ( oSapSnlhCompanyTourSettingsModel, "SapSnlhCompanyTourSettingsModel" );
					this.getView ( ).byId ( "sapSnlhTourSettingsTable" ).setModel ( sap.ui.getCore ( ).getModel ( "SapSnlhCompanyTourSettingsModel" ) );

					this.getView ( ).byId ( "sapSnlhTourSettingsTable" ).addEventDelegate (
							{
								onAfterRendering : function ( oEvent ) {
									var replacedSpan;
									var aTable = oEvent.srcControl.getItems ( );
									for ( var i = 0 ; i < aTable.length ; i++ ) {
										replacedSpan = sap.ui.getCore ( ).byId ( aTable[i].getCells ( )[6].getItems ( )[0].getCells ( )[0].sId ).$ ( )[0].textContent.replace ( new RegExp ( oSapSplUtils.getBundle ( )
												.getText ( "TOUR_SETTINGS_WARNING" ), 'g' ), '<span class=sapSnlhOrangeText>' + oSapSplUtils.getBundle ( ).getText ( "TOUR_SETTINGS_WARNING" ) + '</span>' );
										sap.ui.getCore ( ).byId ( aTable[i].getCells ( )[6].getItems ( )[0].getCells ( )[0].sId ).$ ( )[0].innerHTML = replacedSpan;

										replacedSpan = sap.ui.getCore ( ).byId ( aTable[i].getCells ( )[6].getItems ( )[1].getCells ( )[0].sId ).$ ( )[0].textContent.replace ( new RegExp ( oSapSplUtils.getBundle ( ).getText (
												"TOUR_SETTINGS_CRITICAL" ), 'g' ), '<span class=sapSnlhRedText>' + oSapSplUtils.getBundle ( ).getText ( "TOUR_SETTINGS_CRITICAL" ) + '</span>' );
										sap.ui.getCore ( ).byId ( aTable[i].getCells ( )[6].getItems ( )[1].getCells ( )[0].sId ).$ ( )[0].innerHTML = replacedSpan;

									}
								}
							} );

				}
				this.fireAjaxToGetListOfThresholdRules ( );
			}
		} else {
			$.sap.log.error ( "SAP Connected Logistics Profile", "Icon tab switch event handler error", "SAPSCL" );
		}

	},

	fireAjaxToGetListOfThresholdRules : function ( ) {
		var that = this;
		oSapSplAjaxFactory.fireAjaxCall ( {
			url : oSapSplUtils.getFQServiceUrl ( "/sap/spl/xs/app/services/appl.xsodata/TourPreference" ),
			method : "GET",
			async : true,
			success : function ( oResult ) {
				var aData = [];
				aData = oResult.d.results;
				if ( aData && aData.length > 0 ) {
					aData.sort ( splReusable.libs.SapSplModelFormatters.sortThresholdRulesObjectBasedOnLowerThreshold );
					aData[0].fromArray = that.thresholdArray;

					for ( var i = 0 ; i < aData.length ; i++ ) {
						aData[i].toSelectError = false;
						aData[i].fromSelectError = false;
						if ( i !== 0 ) {
							aData[i].fromArray = that.getThresholdArrayForSelectControl ( parseInt ( aData[i - 1].LowerThreshold ) );
							aData[i].isEnabled = false;
						} else {
							aData[i].isEnabled = true;
						}
						aData[i].toArray = that.getThresholdArrayForSelectControl ( parseInt ( aData[i].LowerThreshold ) );
						if ( aData[i].UpperThreshold === null ) {
							aData[i].UpperThreshold = "518460";
						}
					}
					sap.ui.getCore ( ).getModel ( "SapSnlhCompanyTourSettingsModel" ).setData ( {
						data : aData,
						isEdit : false
					} );
				} else {
					sap.ui.getCore ( ).getModel ( "SapSnlhCompanyTourSettingsModel" ).setData ( {
						data : [],
						isEdit : false
					} );
				}

			},
			error : function ( ) {
				sap.ui.getCore ( ).getModel ( "SapSnlhCompanyTourSettingsModel" ).setData ( {
					data : [],
					isEdit : false
				} );
			}
		} );
	},

	onAfterRendering : function ( ) {

		this.byId ( "profilePage" ).setTitle ( oSapSplUtils.getBundle ( ).getText ( "HEADER_COMPANY_PROFILE" ) );

		this.byId ( "btnEditCompanyProfile" ).setProperty ( "text", oSapSplUtils.getBundle ( ).getText ( "MY_COLLEAGUES_EDIT_BUTTON" ) ).setTooltip ( oSapSplUtils.getBundle ( ).getText ( "MY_COLLEAGUES_EDIT_BUTTON" ) );

		/* Set icon label and tooltip for company profile icon tab */
		this.byId ( "sapSplCompanyHeaderInfoIcon" ).setText ( oSapSplUtils.getBundle ( ).getText ( "INFORMATION_LABEL" ) ).setTooltip ( oSapSplUtils.getBundle ( ).getText ( "INFORMATION_LABEL" ) );

		/* Set icon label and tooltip for usage log icon tab */
		this.byId ( "sapSplUsageLogIcon" ).setText ( oSapSplUtils.getBundle ( ).getText ( "USAGE_LOG_LABEL" ) ).setTooltip ( oSapSplUtils.getBundle ( ).getText ( "USAGE_LOG_LABEL" ) );
		// CSNFIX : 0120061532 1325332 2014
		// this.byId("sapSplCompanyProfileContactDetails").setProperty("text",
		// (oSapSplUtils.getBundle().getText("COMPANY_PROFILE_CONTACT_DETAILS")));

		this.byId ( "sapSplCompanyProfileStreet" ).setText ( oSapSplUtils.getBundle ( ).getText ( "STREET" ) );

		this.byId ( "sapSplCompanyProfileTown" ).setText ( oSapSplUtils.getBundle ( ).getText ( "TOWN" ) );

		this.byId ( "sapSplCompanyProfileDistrict" ).setText ( oSapSplUtils.getBundle ( ).getText ( "DISTRICT" ) );

		this.byId ( "sapSplCompanyProfileCountry" ).setText ( oSapSplUtils.getBundle ( ).getText ( "COUNTRY" ) );

		this.byId ( "sapSplCompanyProfilePhone" ).setText ( oSapSplUtils.getBundle ( ).getText ( "PHONE" ) );

		this.byId ( "sapSplCompanyProfileFax" ).setText ( oSapSplUtils.getBundle ( ).getText ( "FAX" ) );

		// CSNFIX : 0120061532 1325332 2014
		// this.byId("sapSplCompanyDetailsFormTile").setText(oSapSplUtils.getBundle().getText("COMPANY_PROFILE_COMPANY_DETAILS"));

		this.byId ( "sapSplComanyProfileWebsite" ).setText ( oSapSplUtils.getBundle ( ).getText ( "COMPANY_PROFILE_COMPANY_WEBSITE" ) );

		this.byId ( "SapSplUsageLogHeader" ).setNumberUnit ( oSapSplUtils.getBundle ( ).getText ( "BILLABLE_DAYS" ) );

		// this.byId("sapSplCompanyProductName").setText(oSapSplUtils.getBundle().getText("PRODUCT_NAME"));

		this.byId ( "sapSplUsageLogHeaderlabel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "USAGE_DETAIL" ) );

		// this.byId("SapSplUsageTimeHorizon").setText(oSapSplUtils.getBundle().getText("TIME_HORIZON",
		// oSapSplUtils.getBundle().getText("CURRENT_MONTH")));

		this.HorizonText = oSapSplUtils.getBundle ( ).getText ( "CURRENT_MONTH" );
	},

	onBeforeShow : function ( ) {

	},

	updateBindings : function ( oEvent ) {

		var that = this;

		/* CSNFIX : 0120031469 0000759828 2014 - to show header home button */
		oSapSplUtils.showHeaderButton ( {
			showButton : true,
			sNavToPage : "splView.tileContainer.MasterTileContainer",
			navIcon : "sap-icon://home"
		} );

		function fnCallToCheckNumberOfHubs ( ) {

			var oAjaxRes = {};

			function checkNumHubsSuccess ( oResult ) {
				if ( oResult.d.results && oResult.d.results.length === 0 ) {
					that.getView ( ).byId ( "sapSplAddHubButton" ).setEnabled ( false );
					that.getView ( ).byId ( "sapSplAddHubButton" ).setTooltip ( oSapSplUtils.getBundle ( ).getText ( "NO_HUBS_AVAILABLE_TO_CONNECT_TO" ) );
				}
			}
			function checkNumHubsError ( ) {

			}
			var oAjaxObjSettings = {
				url : oSapSplUtils.getServiceMetadata ( SapSplEnums.RootApp, true ) + "/PossibleOwnerList?$format=json&$filter=isConnected eq 0",
				success : checkNumHubsSuccess,
				error : checkNumHubsError,
				handleBusyIndicator : false
			};
			oAjaxRes = oSapSplAjaxFactory.fireAjaxCall ( oAjaxObjSettings );
		}

		// this.aMyOwnerList = this.fnCallToFetchConnectedhubs();

		/**
		 * Explicitly handle forward navigation
		 * @private
		 * @since 1.0
		 */
		function __udpateBindingsFromNavData__ ( oEvent, instance ) {

			/*
			 * Fixing the issue when COMP-PROF -> CHANGE -> USR-PROF -> BCK ->
			 * COM-PRF was resetting company
			 */
			this.oCompanyDetails = oSapSplUtils.getCompanyDetails ( );

			this.oCompanyDetails.MyOwnerList = that.fnCallToFetchConnectedhubs ( );

			oSapSplUtils.setCompanyDetails ( oSapSplUtils.getCompanyDetails ( ) );

			fnCallToCheckNumberOfHubs ( );

			instance.oCompanyProfileModel.setData ( this.oCompanyDetails );

			instance.byId ( "profilePage" ).setModel ( instance.oCompanyProfileModel );

		}

		/**
		 * Explicitly handle reverse navigation (coming from Edit mode)
		 * @private
		 * @since 1.0
		 */
		function __updateBindingsFromBackData__ ( oEvent, instance ) {

			if ( oEvent.backData && oEvent.backData.goBackWithData === 1 ) {
				var oAjaxResult = {};
				var sURL = oSapSplUtils.getServiceMetadata ( SapSplEnums.RootApp, true ) + "/MyOrganization/?$format=json";// $expand=MyHubs&

				function updateBindingsSuccess ( oResult ) {
					var aKeysToRemove = ["spl-change-prompt-subscr", "spl-change-prompt-tour"];

					var oKeysToDelete = oSapSplUtils.getKeys ( "session", aKeysToRemove );

					var _bDone = false;
					if ( !(oResult.d.results[0]["MyOwnerList"]) ) {

						oResult.d.results[0].MyOwnerList = oSapSplUtils.getCompanyDetails ( ).MyOwnerList;
					}
					oSapSplUtils.setCompanyDetails ( oResult.d.results[0] );

					var oModel = new sap.ui.model.json.JSONModel ( );

					oModel.setData ( oResult.d.results[0] );

					instance.byId ( "profilePage" ).setModel ( oModel );

					for ( var key in oKeysToDelete ) {
						if ( oKeysToDelete.hasOwnProperty ( key ) ) {
							oSapSplUtils.getStorageInstance ( "session" ).remove ( key );
							_bDone = true;
						}
					}

					if ( _bDone ) {
						oSapSplEventFactory.dispatch ( "reloadApp" );
					}
				}

				function updateBindingsError ( xhr ) {
					sap.ca.ui.message.showMessageBox ( {
						type : sap.ca.ui.message.Type.ERROR,
						message : oSapSplUtils.getBundle ( ).getText ( "GENERIC_ERROR_MESSAGE" ),
						details : oSapSplUtils.getErrorMessagesfromErrorPayload ( xhr.responseText )
					}, function ( ) {// Handle close of the message box
					// explicitly
					} );
				}

				var oAjaxObj = {
					url : sURL,
					success : updateBindingsSuccess,
					error : updateBindingsError,
					handleBusyIndicator : false
				};

				oAjaxResult = oSapSplAjaxFactory.fireAjaxCall ( oAjaxObj );

			} else {

				instance.oCompanyProfileModel.setData ( oSapSplUtils.getCompanyDetails ( ) );

				instance.byId ( "profilePage" ).setModel ( instance.oCompanyProfileModel );

			}

			fnCallToCheckNumberOfHubs ( );
		}

		/*
		 * Fixing the issue when COMP-PROF -> CHANGE -> USR-PROF -> BCK ->
		 * COM-PRF was resetting company
		 */
		if ( !this.oCompanyProfileModel.hasOwnProperty ( "oData" ) ) {

			this.oCompanyProfileModel = new sap.ui.model.json.JSONModel ( );

		}

		if ( oEvent.data && !oEvent.backData.hasOwnProperty ( "goBackWithData" ) ) {

			__udpateBindingsFromNavData__ ( oEvent, this );

		} else {

			__updateBindingsFromBackData__ ( oEvent, this );

		}

	},

	fnCallToFetchConnectedhubs : function ( ) {
		var aConnectedHubs = [];
		var sURL = oSapSplUtils.getServiceMetadata ( SapSplEnums.RootApp, true ) + "/PossibleOwnerList?$format=json&$filter=isConnected eq 1";
		var oAjaxObj, oAjaxResult = {};

		function fnSuccFetchConnHubs ( oResult ) {
			if ( oResult.d.results.length > 0 ) {
				aConnectedHubs = oResult.d.results;
			}
		}
		function fnErrorFetchConnHubs ( ) {

		}

		oAjaxObj = {
			url : sURL,
			async : false,
			success : fnSuccFetchConnHubs,
			error : fnErrorFetchConnHubs
		};
		oAjaxResult = oSapSplAjaxFactory.fireAjaxCall ( oAjaxObj );
		return aConnectedHubs;
	},

	onExit : function ( ) {

	},

	refreshAccountStatus : function ( ) {
		var that = this;
		var oAjaxResult = {};
		var sURL = oSapSplUtils.getServiceMetadata ( SapSplEnums.RootApp, true ) + "/MyOrganization/?$select=BuPaReplication&$format=json";// $expand=MyHubs&
		var oAjaxObj = {
			url : sURL,
			method : "GET",
			success : function ( oResult ) {
				var oModel = that.byId ( "sapSplCompanyProfileHeader" ).getModel ( );
				var oData = oModel.getData ( );
				oData.BuPaReplication = oResult.d.results[0].BuPaReplication;
				oModel.setData ( oData );
			},
			handleBusyIndicator : true
		};
		oAjaxResult = oSapSplAjaxFactory.fireAjaxCall ( oAjaxObj );
	},

	handleProfileBackNavigation : function ( ) {

		oSplBaseApplication.getAppInstance ( ).back ( );

	},

	handleProfileEditActionEvent : function ( ) {

		if ( this.byId ( "sapSplCompanyProfileIconTabBar" ).getSelectedKey ( ) === "sapSnlhCompanyTourSettings" ) {
			var table = this.byId ( "sapSnlhTourSettingsTable" );
			this.byId ( "btnEditCompanyProfile" ).setVisible ( false );
			this.byId ( "sapSnlhCompnayTourSettingsSaveButton" ).setVisible ( true );
			this.byId ( "sapSnlhCompnayTourSettingsCancelButton" ).setVisible ( true );
			this.byId ( "sapSnlhTourSettingsTable" ).setMode ( "Delete" );
			this.byId ( "sapSnlhTourSettingsAddRuleLink" ).setVisible ( true );

			var modelData = $.extend ( true, {}, sap.ui.getCore ( ).getModel ( "SapSnlhCompanyTourSettingsModel" ).getData ( ) );
			modelData.isEdit = true;
			this.toDeleteArray = [];
			sap.ui.getCore ( ).getModel ( "SapSnlhCompanyTourSettingsModel" ).setData ( modelData );
			this.previousModelData = $.extend ( true, {}, sap.ui.getCore ( ).getModel ( "SapSnlhCompanyTourSettingsModel" ).getData ( ) );
			window.setTimeout ( function ( ) {
				if ( sap.ui.getCore ( ).byId ( "splView.profile.Profile--sapSnlhTourSettingsTable" ) && sap.ui.getCore ( ).byId ( "splView.profile.Profile--sapSnlhTourSettingsTable" ).getItems ( )[0] ) {
					if ( sap.ui.getCore ( ).byId ( "splView.profile.Profile--sapSnlhTourSettingsTable" ).getItems ( )[0].getCells ( )[2] ) {
						sap.ui.getCore ( ).byId ( "splView.profile.Profile--sapSnlhTourSettingsTable" ).getItems ( )[0].getCells ( )[2].focus ( );
					}
				}
			}, 100 );

		} else {

			if ( !oSplBaseApplication.getAppInstance ( ).getPage ( "splView.profile.EditProfile" ) ) {

				var oEditProfileView = sap.ui.view ( {

					viewName : "splView.profile.EditProfile",

					id : "splView.profile.EditProfile",

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

			oSplBaseApplication.getAppInstance ( ).to ( "splView.profile.EditProfile", {
				cDetails : oSapSplUtils.getCompanyDetails ( )
			} );
		}
	},

	handleProfileSaveActionEvent : function ( ) {

	},

	btnCancelCompanyEditProfile : function ( ) {

	},

	handleDeregisterOfCompany : function ( noOfHubs, relationUUID, hubName, subscriptionRelationUUID ) {
		var that = this;
		jQuery.sap.require ( "splReusable.libs.DeregistrationHandler" );

		function handleDeregisterOfCompany ( ) {
			// Removed Subscription relation from the payload as it is taken
			// care from the backend
			var oPayloadForDeleteOfMyCompany = {
				"inputHasChangeMode" : true,
				"Relation" : [{
					"UUID" : relationUUID,
					"ChangeMode" : "D"
				}]
			};

			function __handleRedirectOfUserOnSuccessfulDeletion__ ( ) {
				oSapSplUtils.sLO4S = "app";
				if ( noOfHubs === 1 ) {
					/***********Set the flag to '2' to display the feedback page and suppress the registration page ************/
					oSapSplUtils.getStorageInstance ( "local" ).put ( "src", 2 );

					/*******Finally redirect to the redirpath enum value********/
					window.location.href = SapSplEnums.REDIRPATH;
				} else {
					sap.m.MessageToast.show ( oSapSplUtils.getBundle ( ).getText ( "APPLICATION_RELOADING" ), {
						duration : 2000,
						onClose : function ( ) {
							__handleRedirectOfUserOnSuccessfulDeletion__ ( );
						}
					} );
					oSapSplEventFactory.dispatch ( "reloadApp" );
				}
			}

			function __handlerDeRegisterOfCompany__ ( ) {
				oSapSplBusyDialog.getBusyDialogInstance ( ).open ( );
				/*
				 * jQuery.ajax({ url: oSapSplUtils.getServiceMetadata("bupa",
				 * true), type: "POST", data:
				 * JSON.stringify(oPayloadForDeleteOfMyCompany), dataType:
				 * "json", beforeSend: function (xhr) {
				 * xhr.setRequestHeader("X-CSRF-Token",
				 * oSapSplUtils.getCSRFToken());
				 * xhr.setRequestHeader("Content-Type",
				 * "application/json;charset=utf-8"); }, success: function () {
				 * oSapSplBusyDialog.getBusyDialogInstance().close();
				 * that.oDialog.close();
				 * sap.m.MessageToast.show(oSapSplUtils.getBundle().getText("COMPANY_DEREGISTRATION_SUCCESSFUL_TOAST"), {
				 * duration: 2000, onClose: function () {
				 * __handleRedirectOfUserOnSuccessfulDeletion__(); } }); },
				 * error: function (xhr) {
				 * oSapSplBusyDialog.getBusyDialogInstance().close();
				 * oSapSplAppErrorHandler.show(xhr, false, null, function
				 * (oDialogClosed) { jQuery.sap.log.info("SAP Connected
				 * Logistics", "Dialog close Event fired " + oDialogClosed.m,
				 * "SAPSCL"); }); } });
				 */
				oSapSplAjaxFactory.fireAjaxCall ( {
					url : oSapSplUtils.getServiceMetadata ( "bupa", true ),
					method : "POST",
					data : JSON.stringify ( oPayloadForDeleteOfMyCompany ),
					dataType : "json",
					beforeSend : function ( xhr ) {
						xhr.setRequestHeader ( "X-CSRF-Token", oSapSplUtils.getCSRFToken ( ) );
						xhr.setRequestHeader ( "Content-Type", "application/json;charset=utf-8" );
					},
					success : function ( ) {
						oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
						that.oDialog.close ( );
						sap.m.MessageToast.show ( oSapSplUtils.getBundle ( ).getText ( "COMPANY_DEREGISTRATION_SUCCESSFUL_TOAST" ), {
							duration : 2000,
							onClose : function ( ) {
								__handleRedirectOfUserOnSuccessfulDeletion__ ( );
							}
						} );
					},
					error : function ( xhr ) {
						oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
						oSapSplAppErrorHandler.show ( xhr, false, null, function ( oDialogClosed ) {
							jQuery.sap.log.info ( "SAP Connected Logistics", "Dialog close Event fired " + oDialogClosed.m, "SAPSCL" );
						} );
					}

				} );

			}

			__handlerDeRegisterOfCompany__ ( );
		}

		oSapSplDeregistrationHandler.launch ( hubName, function ( ) {
			handleDeregisterOfCompany ( );
		}, function ( ) {
		// What to do on Cancel action
		}, function ( ) {
		// What to do on afterOpen
		}, function ( ) {
		// What to do on afterClose
		} );

		// sap.m.MessageBox.show(oSapSplUtils.getBundle().getText("PROMPT_FOR_DELETION_OF_COMPANY_ACCOUNT",
		// [SapSplEnums.APPNAME]), {
		// icon: sap.m.MessageBox.Icon.WARNING,
		// title: "{splI18NModel>PROMPT_FOR_DELETION_DIALOG_TITLE}",
		// actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
		// onClose: function (oAction) {
		// if (oAction === sap.m.MessageBox.Action.NO) {
		// return;
		// } else {
		// handleDeregisterOfCompany();
		// }
		// }
		// });

	},

	handleTSIWalletLaunchPress : function ( ) {

		/*
		 * Ajax request to SPL Outbound Window open to success handler response
		 * data
		 */

		/**
		 * @private
		 * @since 1.0.1
		 * @internal
		 * @description Error handler UI launcher
		 */
		function __handleWalletLaunchDialog__ ( dataAccount ) {
			var oDialog = new sap.m.Dialog ( {
				height : "400px",
				width : "400px",
				title : oSapSplUtils.getBundle ( ).getText ( "TSI_WALLET_TITLE" ),
				endButton : new sap.m.Button ( {
					text : oSapSplUtils.getBundle ( ).getText ( "CLOSE_TSI_WALLET_DIALOG" ),
					press : function ( ) {
						oDialog.close ( );
					}
				} ),
				afterClose : function ( ) {
					oDialog.destroy ( );
				},
				content : [new sap.ui.core.HTML ( {
					content : "<iframe width=\"600\" seamless=\"seamless\" frameborder=\"0\" height=\"600\" onload=parent.scrollTo(0,0); src = " + encodeURI ( dataAccount.url + "?" + dataAccount.token ) + "/>"
				} )]
			} );

			oDialog.open ( ).attachAfterOpen ( function ( ) {
				oSapSplUtils.fnSyncStyleClass ( oDialog );
			} );

		}

// var that = this;

		var ajaxObj = {};
		var that = this;

		function fnTSIWalletBeforeSend ( xhr ) {
			xhr.setRequestHeader ( "X-CSRF-Token", oSapSplUtils.getCSRFToken ( ) );
		}

		function fnTSIWalletSuccess ( dataAccount, textStatus, xhr ) {

			try {
				if ( dataAccount.constructor === String ) {

					try {
						dataAccount = JSON.parse ( dataAccount );
					} catch (e) {
						jQuery.sap.log.fatal ( "Wallet management", "Wallet management parsing of data failed with error " + e.message, "SAPSCL" );
					}
				}
				if ( dataAccount && dataAccount.url && dataAccount.token ) {
					__handleWalletLaunchDialog__ ( dataAccount );
				}

			} catch (e) {

				jQuery.sap.log.fatal ( "Invalid character identified in response of service" );

				oSapSplAppErrorHandler.show ( xhr, false, null, null );

			}
		}

		function fnTSIWalletError ( xhr ) {
			oSapSplAppErrorHandler.show ( xhr, false, null, null );
		}

		ajaxObj = {
			url : oSapSplUtils.getFQServiceUrl ( "/sap/spl/xs/app/services/configureTSIWallet.xsjs/" ),
			method : "POST",
			data : JSON.stringify ( that.getPayLoadForCustomerAccount ( ) ),
			beforeSend : fnTSIWalletBeforeSend,
			success : fnTSIWalletSuccess,
			error : fnTSIWalletError
		};

		oSapSplAjaxFactory.fireAjaxCall ( ajaxObj );
	},

	handleAddEditHubOperatorPress : function ( oEvent ) {
		var that = this;
		var sTitleForDialog = null;
		var sBeginButtonText = null;
		var flagForBeginButton = false;
		var sSelectedHub = null;
		var oTextForAddEditDeregister = null;
		var oSelectedItemFromDialog,selectedItemFromDialogData,oHubDetailsForHubCreation = null;

		function successOfRolesOdata ( result ) {
			that.Relation = result.results;
		}

		function errorOfRolesOdata ( error ) {
			/* handle service failure!!! */
			oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
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
		}

		function getRelation ( ) {
			var oModel = sap.ui.getCore ( ).getModel ( "myConfigODataModel" );
			var oDataModelContext = null, oDataModelFilters = "$filter=FromRole eq '" + oSapSplUtils.getCompanyDetails ( ).Role + "' and ToRole eq 'LSPACEOP' and (Scope eq 'OWNER' or Scope eq 'SERVICE_SUBSCRIPTION')", bIsAsync = false;
			var sUrl = "/BusinessPartnerRoleRelation";
			if ( oModel ) {
				oModel.read ( sUrl, oDataModelContext, oDataModelFilters, bIsAsync, successOfRolesOdata, errorOfRolesOdata );
			}
		}

		function prepareHeaderPayload ( isVisibleOnSearchFlag, toPartnerUUID ) {
			var payload = {};
			payload["UUID"] = oSapSplUtils.getCompanyDetails ( ).UUID;
			payload["BasicInfo.Type"] = "O";
			payload["BasicInfo.CompanyID"] = oSapSplUtils.getCompanyDetails ( ).UUID;
			payload["BasicInfo.ID"] = oSapSplUtils.getCompanyDetails ( ).BasicInfo_ID;
			payload["isVisibleOnSearch"] = isVisibleOnSearchFlag;
			payload["ChangeMode"] = "U";
			payload["OwnerUUID"] = toPartnerUUID;
			return [payload];
		}

		function preparePayload ( toBusinessPartnerUUID, subscriptionUUID, ChangeMode, oldRelationUUID ) {
			var payload = [];
			var oRelationTempObj = {};
			if ( ChangeMode === "Create" ) {
				oRelationTempObj["UUID"] = oSapSplUtils.getUUID ( );
				oRelationTempObj["FromPartner"] = oSapSplUtils.getCompanyDetails ( ).UUID;
				oRelationTempObj["ToPartner"] = toBusinessPartnerUUID;
				if ( that.Relation[0].Scope === "OWNER" ) {
					oRelationTempObj["Relation"] = that.Relation[0].Name;
				} else if ( that.Relation[1].Scope === "OWNER" ) {
					oRelationTempObj["Relation"] = that.Relation[1].Name;
				}
				oRelationTempObj["Text"] = "";
				oRelationTempObj["Status"] = "1";
				oRelationTempObj["ObjectType"] = "BuPa-O";
				oRelationTempObj["InstanceUUID"] = null;
				oRelationTempObj["ChangeMode"] = "I";
				payload.push ( oRelationTempObj );
				oRelationTempObj = {};
				oRelationTempObj["UUID"] = oSapSplUtils.getUUID ( );
				oRelationTempObj["FromPartner"] = oSapSplUtils.getCompanyDetails ( ).UUID;
				oRelationTempObj["ToPartner"] = toBusinessPartnerUUID;
				if ( that.Relation[0].Scope === "SERVICE_SUBSCRIPTION" ) {
					oRelationTempObj["Relation"] = that.Relation[0].Name;
				} else if ( that.Relation[1].Scope === "SERVICE_SUBSCRIPTION" ) {
					oRelationTempObj["Relation"] = that.Relation[1].Name;
				}
				oRelationTempObj["Text"] = "";
				oRelationTempObj["Status"] = "1";
				oRelationTempObj["ObjectType"] = "SubscriptionProduct";
				oRelationTempObj["InstanceUUID"] = subscriptionUUID;
				oRelationTempObj["ChangeMode"] = "I";
				payload.push ( oRelationTempObj );
			} else if ( ChangeMode === "Edit" ) {
				oRelationTempObj["UUID"] = oldRelationUUID;
				oRelationTempObj["ChangeMode"] = "D";
				payload.push ( oRelationTempObj );
				oRelationTempObj = {};
				oRelationTempObj["UUID"] = oSapSplUtils.getUUID ( );
				oRelationTempObj["FromPartner"] = oSapSplUtils.getCompanyDetails ( ).UUID;
				oRelationTempObj["ToPartner"] = toBusinessPartnerUUID;
				if ( that.Relation[0].Scope === "SERVICE_SUBSCRIPTION" ) {
					oRelationTempObj["Relation"] = that.Relation[0].Name;
				} else if ( that.Relation[1].Scope === "SERVICE_SUBSCRIPTION" ) {
					oRelationTempObj["Relation"] = that.Relation[1].Name;
				}
				oRelationTempObj["Text"] = "";
				oRelationTempObj["Status"] = "1";
				oRelationTempObj["ObjectType"] = "SubscriptionProduct";
				oRelationTempObj["InstanceUUID"] = subscriptionUUID;
				oRelationTempObj["ChangeMode"] = "I";
				payload.push ( oRelationTempObj );
			}
			return payload;
		}

		function fnFireAjaxCallBuPa ( payload ) {
			var ajaxObj = {};

			function beforeSendBuPa ( request ) {
				request.setRequestHeader ( "X-CSRF-Token", oSapSplUtils.getCSRFToken ( ) );
				request.setRequestHeader ( "Cache-Control", "max-age=0" );
			}

			function successCallbackBuPa ( data, success, messageObject ) {
				oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
				that.oDialog.close ( );

				if ( data.constructor === String ) {
					data = JSON.parse ( data );
				}
				if ( messageObject["status"] === 200 && data["Error"].length === 0 ) {
					if ( that.oDialog.getContent ( )[0].getViewData ( ).Text === "Create" ) {
						sap.m.MessageToast.show ( oSapSplUtils.getBundle ( ).getText ( "ADD_NEW_HUB_SUCCESSFUL_TOAST" ) );
					} else if ( that.oDialog.getContent ( )[0].getViewData ( ).Text === "Edit" ) {
						sap.m.MessageToast.show ( oSapSplUtils.getBundle ( ).getText ( "CHANGES_SAVED_SUCCESS" ) );
					}
					/*
					 * else if(that.oDialog.getContent()[0].getViewData().Text
					 * === "Deregister"){
					 * sap.m.MessageToast.show(oSapSplUtils.getBundle().getText("COMPANY_DEREGISTRATION_SUCCESSFUL_TOAST")); }
					 */
					oSapSplUtils.sLO4S = "app";
					oSapSplEventFactory.dispatch ( "reloadApp" );

				} else if ( data["Error"].length > 0 ) {
					var errorMessage = oSapSplUtils.getErrorMessagesfromErrorPayload ( data )["ufErrorObject"];
					sap.ca.ui.message.showMessageBox ( {
						type : sap.ca.ui.message.Type.ERROR,
						message : oSapSplUtils.getErrorMessagesfromErrorPayload ( data )["errorWarningString"],
						details : errorMessage
					} );
				}
			}

			function errorAjaxBuPa ( error ) {
				oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
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
			}

			ajaxObj = {
				url : oSapSplUtils.getFQServiceUrl ( "sap/spl/xs/app/services/businessPartner.xsjs" ),
				method : "POST",
				contentType : "json; charset=UTF-8",
				async : false,
				cache : false,
				data : JSON.stringify ( payload ),
				beforeSend : beforeSendBuPa,
				success : successCallbackBuPa,
				error : errorAjaxBuPa
			};
			var results = oSapSplAjaxFactory.fireAjaxCall ( ajaxObj );
		}

		function relationForPost ( payload ) {
			oSapSplBusyDialog.getBusyDialogInstance ( {
				title : oSapSplUtils.getBundle ( ).getText ( "BUSY_DIALOG_MESSAGE" )
			} ).open ( );

			window.setTimeout ( fnFireAjaxCallBuPa ( payload ), 10 );
		}

		function handleBeginButtonPress ( ) {
			var payload = {
				inputHasChangeMode : true
			};
			var toPartnerUUID = null;
			var subscriptionUUID = null;
			var relationUUID = null;
			var isVisibleOnSearchFlag = null;
			if ( this.getParent ( ).getParent ( ).getContent ( )[0].getController ( ).byId ( "BuPaIsVisibleCheckBox" ).getSelected ( ) ) {
				isVisibleOnSearchFlag = "1";
			} else {
				isVisibleOnSearchFlag = "0";
			}
			if ( this.getParent ( ).getParent ( ).getContent ( )[0].getViewData ( ).Text === "Create" ) {
				getRelation ( );
				toPartnerUUID = this.getParent ( ).getParent ( ).getContent ( )[0].getController ( ).byId ( "SelectNewHub" ).getSelectedItem ( ).getBindingContext ( ).getProperty ( ).OwnerID;
				subscriptionUUID = this.getParent ( ).getParent ( ).getContent ( )[0].getController ( ).byId ( "SubscriptionPackage" ).getSelectedItem ( ).getBindingContext ( ).getProperty ( ).ProductUUID; // Internal
				// Incident
				// Fix
				// -
				// 1570002998
				payload.Header = prepareHeaderPayload ( isVisibleOnSearchFlag, toPartnerUUID );
				payload["Relation"] = preparePayload ( toPartnerUUID, subscriptionUUID, "Create" );
				relationForPost ( payload );
			} else if ( this.getParent ( ).getParent ( ).getContent ( )[0].getViewData ( ).Text === "Edit" ) {
				if((this.getParent ( ).getParent ( ).getContent ( )[0].getController ( ).byId ( "SubscriptionPackage" ).getSelectedItem ( ).getBindingContext ( ).getProperty ( ).Name !== that.selectedSubscriptionPackage) || oSapSplUtils.getIsDirty() ){
					getRelation ( );
					toPartnerUUID = sSelectedHub.OwnerID;
					relationUUID = sSelectedHub.RelationUUID;
					subscriptionUUID = this.getParent ( ).getParent ( ).getContent ( )[0].getController ( ).byId ( "SubscriptionPackage" ).getSelectedItem ( ).getBindingContext ( ).getProperty ( ).ProductUUID;
					payload.Header = prepareHeaderPayload ( isVisibleOnSearchFlag, toPartnerUUID );
					if ( subscriptionUUID !== sSelectedHub.SubscriptionUUID ) { // 
						// :
						// Send
						// OwnerID
						// field
						// while
						// changing
						// "isvisiblesearch"
						// flag
						// always..
						// Send
						// Relation
						// only
						// when
						// subscription
						// product
						// changes.
						payload["Relation"] = preparePayload ( toPartnerUUID, subscriptionUUID, "Edit", relationUUID );
					}
					relationForPost ( payload );
				} else {
					that.oDialog.close();
					sap.m.MessageToast.show ( oSapSplUtils.getBundle ( ).getText ( "CHANGES_SAVED_SUCCESS" ) );
				}
				
			} else if ( this.getParent ( ).getParent ( ).getContent ( )[0].getViewData ( ).Text === "Deregister" ) {
				getRelation ( );
				that.handleDeregisterOfCompany ( this.getParent ( ).getParent ( ).getContent ( )[0].getController ( ).oSapSplHubListModel.getData ( ).connectedHubs.length, this.getParent ( ).getParent ( ).getContent ( )[0].getController ( ).byId (
						"SelectOneOfAlreadyConnectedHubsToDeregister" ).getSelectedItem ( ).getBindingContext ( ).getProperty ( ).OwnerRelationUUID, this.getParent ( ).getParent ( ).getContent ( )[0].getController ( ).byId (
						"SelectOneOfAlreadyConnectedHubsToDeregister" ).getSelectedItem ( ).getBindingContext ( ).getProperty ( ).OwnerName, this.getParent ( ).getParent ( ).getContent ( )[0].getController ( ).byId (
						"SelectOneOfAlreadyConnectedHubsToDeregister" ).getSelectedItem ( ).getBindingContext ( ).getProperty ( ).RelationUUID );
			}
		}

		function handleCancelButtonPress ( ) {
			var that = this;
			if ( oSapSplUtils.getIsDirty ( ) ) {
				sap.m.MessageBox.show ( oSapSplUtils.getBundle ( ).getText ( "DATA_LOSS_WARNING_TEXT" ), sap.m.MessageBox.Icon.WARNING, oSapSplUtils.getBundle ( ).getText ( "WARNING" ), [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
						function ( selection ) {
							if ( selection === "YES" ) {
								oSapSplUtils.setIsDirty ( false );
								that.getParent ( ).getParent ( ).close ( );
								that.getParent ( ).getParent ( ).destroy ( );
							}
						}, null, oSapSplUtils.fnSyncStyleClass ( "messageBox" ) );
			} else {
				oSapSplUtils.setIsDirty ( false );
				this.getParent ( ).getParent ( ).close ( );
				this.getParent ( ).getParent ( ).destroy ( );
			}
		}

		if ( oEvent.getSource ( ).getCustomData ( )[0].getKey ( ) === "AddHub" ) {
			sTitleForDialog = oSapSplUtils.getBundle ( ).getText ( "ADD_HUB" );
			sBeginButtonText = oSapSplUtils.getBundle ( ).getText ( "NEW_CONTACT_ADD" );
			oTextForAddEditDeregister = "Create";
		} else if ( oEvent.getSource ( ).getCustomData ( )[0].getKey ( ) === "EditHubDetails" ) {
			sTitleForDialog = oSapSplUtils.getBundle ( ).getText ( "MY_COLLEAGUES_EDIT_BUTTON" );
			sBeginButtonText = oSapSplUtils.getBundle ( ).getText ( "SAVE_PROFILE_ACTION" );
			oTextForAddEditDeregister = "Edit";
			sSelectedHub = oEvent.getSource ( ).getBindingContext ( ).getObject ( );
		} else if ( oEvent.getSource ( ).getCustomData ( )[0].getKey ( ) === "DeregisterHub" ) {
			sTitleForDialog = oSapSplUtils.getBundle ( ).getText ( "COMPANY_PROFILE_LINK_DEREGISTER_MY_COMPANY" );
			sBeginButtonText = oSapSplUtils.getBundle ( ).getText ( "COMPANY_PROFILE_LINK_DEREGISTER_MY_COMPANY" );
			oTextForAddEditDeregister = "Deregister";
			flagForBeginButton = true;
		}
		oHubDetailsForHubCreation = this.oCompanyProfileModel.getData ( ).MyOwnerList[0];
		var selectedHubDetailsData = jQuery.extend ( true, {}, sSelectedHub );
		var newAddEditHubDialogView = sap.ui.view ( {
			viewName : "splView.dialogs.SplAddEditHubDialog",
			type : sap.ui.core.mvc.ViewType.XML,
			viewData : {
				View : this,
				Text : oTextForAddEditDeregister,
				MyOwners : that.aMyOwnerList,
				SelectedHubForEdit : jQuery.extend( true, {}, sSelectedHub ),
				SelectedHubDetails : selectedHubDetailsData,
				SelectedHubForCreateHub : jQuery.extend(true, {} ,oHubDetailsForHubCreation)
			}
		} );

		this.oDialog = new sap.m.Dialog ( {
			height : "400px",
			width : "400px",
			title : sTitleForDialog,
			id : "addEditDeregisterHubDialog",
			beginButton : new sap.m.Button ( {
				text : sBeginButtonText,
				press : handleBeginButtonPress,
				enabled : flagForBeginButton
			} ),
			endButton : new sap.m.Button ( {
				text : oSapSplUtils.getBundle ( ).getText ( "CANCEL" ),
				press : handleCancelButtonPress
			} ),
			afterClose : function ( oEvent ) {
				oEvent.getSource ( ).destroy ( );
			},
			content : newAddEditHubDialogView
		} ).addStyleClass ( "addEditDeregisterHubDialog" );

		this.oDialog.open ( ).attachAfterOpen ( function ( ) {
			oSelectedItemFromDialog = that.oDialog.getContent()[0].getContent()[0].getContent()[4].getSelectedItem();
			selectedItemFromDialogData = jQuery.extend(true, {} ,oSelectedItemFromDialog);
			that.selectedSubscriptionPackage =  that.oDialog.getContent()[0].getViewData().SelectedHubForEdit.SubscriptionProductName;
			that.selectedSubscriptionPackageName = that.oDialog.getContent()[0].getViewData().SelectedHubForEdit.SubscriptionName;
			oSapSplUtils.fnSyncStyleClass ( that.oDialog );
			newAddEditHubDialogView.getController().setSubscriptionItem( selectedItemFromDialogData );
		} );

	},

	getPayLoadForCustomerAccount : function ( ) {
		var oPayloadCusAcct = {
			"BusinessPartnerUUID" : oSapSplUtils.getCompanyDetails ( )["BasicInfo_CompanyID"],
			"reference" : "FedEx-at-Logiweb",
			"telematicDataProviderType" : "Logiweb",
			"description" : "FedEx Logiweb account"
		};

		return oPayloadCusAcct;
	},

	handleUsagelogTabSelect : function ( ) {

		if ( !this.oUsageLogModel ) {
			this.oUsageLogModel = new sap.ui.model.json.JSONModel ( );

			this.fetchUsageLogData ( );

		}

	},

	fetchUsageLogData : function ( sBucketType, sFromDate, sToDate ) {

		var oAjaxResult = {};
		var oAjaxObj = {};
		oAjaxObj = {
			url : oSapSplUtils.getFQServiceUrl ( "/sap/spl/xs/app/services/usage.xsjs/" ),
			method : "POST",
			data : JSON.stringify ( this.getPayLoadForUsageLog ( sBucketType, sFromDate, sToDate ) ),
			beforeSend : jQuery.proxy ( this.fetchUsageLogBeforeSend, this ),
			success : jQuery.proxy ( this.fetchUsageLogSuccess, this ),
			error : jQuery.proxy ( this.fetchUsageLogError, this )
		};
		oAjaxResult = oSapSplAjaxFactory.fireAjaxCall ( oAjaxObj );
	},

	fetchUsageLogBeforeSend : function ( xhr ) {
		xhr.setRequestHeader ( "X-CSRF-Token", oSapSplUtils.getCSRFToken ( ) );
		xhr.setRequestHeader ( "Content-Type", "application/json" );
	},

	fetchUsageLogSuccess : function ( data ) {
		try {
			if ( data.constructor === String ) {
				data = JSON.parse ( data );
			}

			this.oUsageLogModel.setData ( {
				results : data
			} );
			this.getView ( ).byId ( "SapSplUsageDetail" ).setModel ( this.oUsageLogModel );

		} catch (e) {

			jQuery.sap.log.fatal ( "Invalid character identified in response of service" );

			sap.ca.ui.message.showMessageBox ( {
				type : sap.ca.ui.message.Type.ERROR,
				message : oSapSplUtils.getBundle ( ).getText ( "SPL_SYSTEM_RESPONSE_ERROR" ),
				details : e.message
			} );

		}
	},

	fetchUsageLogError : function ( error ) {
		var that = this;
		if ( error ) {
			sap.ca.ui.message.showMessageBox ( {
				type : sap.ca.ui.message.Type.ERROR,
				message : error["status"] + " " + error.statusText,
				details : error.responseText
			}, jQuery.proxy ( that.fireCancelAction, that ) );
		}
	},

	getPayLoadForUsageLog : function ( sBucketType, oFromDate, oToDate ) {
		var oPayload = {}, oDateRange = {};

		if ( !oFromDate ) {
			sBucketType = (sBucketType) ? sBucketType : "C";
			oDateRange = oSapSplUtils.getDateRange ( sBucketType );
		} else {
			oDateRange["from"] = oFromDate;
			oDateRange["to"] = oToDate;

		}
		oPayload["CompanyID"] = oSapSplUtils.getCompanyDetails ( )["UUID"];
		oPayload["StartTime"] = oDateRange["from"];
		oPayload["EndTime"] = oDateRange["to"];
		return oPayload;
	},

	onSelectOfListItem : function ( oEvent ) {
		var oData = null;
		if ( !oSplBaseApplication.getAppInstance ( ).getPage ( "splView.profile.UsageLogDetails" ) ) {
			/* Fix for Incident : 1580068685 */
			var oObject = oEvent.getSource ( ).getSelectedItem ( ).getBindingContext ( ).getObject ( );

			var oUsageLogDetails = sap.ui.view ( {

				viewName : "splView.profile.UsageLogDetails",

				id : "splView.profile.UsageLogDetails",

				type : sap.ui.core.mvc.ViewType.XML,

				viewData : [oObject.UserCount, oObject.VehicleCount]

			} );
			oUsageLogDetails.addEventDelegate ( {
				onBeforeShow : jQuery.proxy ( oUsageLogDetails.getController ( ).onBeforeShow, oUsageLogDetails.getController ( ) )
			} );

			oSplBaseApplication.getAppInstance ( ).addPage ( oUsageLogDetails );

		}
		oData = oEvent.getSource ( ).getSelectedItem ( ).getBindingContext ( ).getObject ( );
		oData["Filter"] = this.HorizonText;

		oSplBaseApplication.getAppInstance ( ).to ( "splView.profile.UsageLogDetails", {
			data : oEvent.getSource ( ).getSelectedItem ( ).getBindingContext ( ).getObject ( )
		} );

		oEvent.getSource ( ).removeSelections ( );

	},

	openDateRangeSelectionDialog : function ( oDate1, oDate2 ) {
		var that = this, oSettings = null;
		/* Fix for incident 1580068687 */
		oSettings = {
			dateValue : oDate1,
			secondDateValue : oDate2,
			placeholder : oSapSplUtils.getBundle ( ).getText ( "DATE_RANGE_PLACEHOLDER" ),
			displayFormat : "dd.MM.yyyy",
			change : function ( oEvent ) {
				var bValid = oEvent.getParameter ( "valid" );
				var oDRS = oEvent.oSource;
				if ( bValid ) {
					oDRS.setValueState ( sap.ui.core.ValueState.None );
				} else {
					oDRS.setValueState ( sap.ui.core.ValueState.Error );
				}
			}
		};
		var oDateRange = new sap.m.DateRangeSelection ( oSettings );
		var oDialog = new sap.m.Dialog ( {
			title : oSapSplUtils.getBundle ( ).getText ( "MANUAL_SELECTION" ),
			content : [new sap.ui.layout.form.SimpleForm ( {
				content : [new sap.m.Label ( {
					text : oSapSplUtils.getBundle ( ).getText ( "DATE_RANGE" )
				} ), oDateRange]
			} )],
			beginButton : new sap.m.Button ( {
				text : oSapSplUtils.getBundle ( ).getText ( "OK" ),
				press : function ( oEvent ) {
					if ( oDateRange.getValueState ( ) === "None" ) {
						that.handleCreationOfCustomDateRange ( oEvent );
					}
				}
			} ),
			endButton : new sap.m.Button ( {
				text : oSapSplUtils.getBundle ( ).getText ( "CANCEL" ),
				press : function ( oEvent ) {
					oEvent.getSource ( ).getParent ( ).getParent ( ).close ( );
					oEvent.getSource ( ).getParent ( ).getParent ( ).destroy ( );
					that.byId ( "SapSplUsageTimeHorizon" ).setSelectedKey ( that.sSelectedTimeHorizon );
				}
			} )
		} );

		oDialog.open ( );
		oDialog.attachAfterOpen ( function ( oEvent ) {
			oSapSplUtils.fnSyncStyleClass ( oEvent.getSource ( ) );
		} );

	},

	handlePressOfTimeHorizon : function ( oEvent ) {

		/*
		 * if (!this.oTimeHorizonPopover) { var oTimeHorizonList = null, oData =
		 * null; this.oTimeHorizonPopover = new sap.m.Popover({ placement:
		 * "Bottom" });
		 * this.oTimeHorizonPopover.addContent(sap.ui.xmlfragment("SapSplUsageLogTimeHorizonDialogContent",
		 * "splReusable.fragments.UsageLogTimeHorizon", this)); oTimeHorizonList =
		 * sap.ui.core.Fragment.byId("SapSplUsageLogTimeHorizonDialogContent",
		 * "SapSplTimeHorizon");
		 * sap.ui.core.Fragment.byId("SapSplUsageLogTimeHorizonDialogContent",
		 * "CustomTimeRange").setText(oSapSplUtils.getBundle().getText("CUSTOM_RANGE"));
		 * oData = { results: [{ name:
		 * oSapSplUtils.getBundle().getText("CURRENT_MONTH"), key: "C" }, {
		 * name: oSapSplUtils.getBundle().getText("LAST_MONTH"), key: "L" }, {
		 * name: oSapSplUtils.getBundle().getText("LAST_QUARTER"), key: "Q" }, {
		 * name: oSapSplUtils.getBundle().getText("LAST_QUARTER_TODATE"), key:
		 * "QTD" }, ] }; var oModel = new sap.ui.model.json.JSONModel();
		 * oModel.setData(oData); oTimeHorizonList.setModel(oModel); }
		 * this.oTimeHorizonPopover.openBy(oEvent.getSource());
		 */

		var sSelectedKey = oEvent.getParameters ( ).selectedItem.getBindingContext ( ).getProperty ( ).key;
		if ( sSelectedKey === "Manual" ) {
			this.openDateRangeSelectionDialog ( this.customDate1, this.customDate2 );
		} else if ( oEvent.getParameters ( ).selectedItem.getBindingContext ( ).getProperty ( ).key === "customRange" ) {
			this.openDateRangeSelectionDialog ( this.customDate1, this.customDate2 );
			this.sSelectedTimeHorizon = sSelectedKey;
		} else {
			this.sSelectedTimeHorizon = sSelectedKey;
			this.fetchUsageLogData ( sSelectedKey );
		}

	},

	handleCreationOfCustomDateRange : function ( oEvent ) {
		var aTimeHorizonData = [], oDateRangeSelector = null, oModelData = {}, bCustomRangeFound = false;

		oDateRangeSelector = oEvent.getSource ( ).getParent ( ).getParent ( ).getContent ( )[0].getContent ( )[1];
		this.customDate1 = oDateRangeSelector.getDateValue ( );
		this.customDate2 = oDateRangeSelector.getSecondDateValue ( );

		// Fix to incident 1580183497
		this.customDate2.setHours ( 23 );
		this.customDate2.setMinutes ( 59 );
		this.customDate2.setSeconds ( 59 );
		
		oModelData = this.sapSplUsageTimeHorizonModel.getData ( );
		aTimeHorizonData = oModelData.results;
		/* Incident : 1570173323 */
		if ( this.customDate1 === null || this.customDate2 === null ) {
			oDateRangeSelector.setValueState ( "Error" );
			oDateRangeSelector.setValueStateText ( oSapSplUtils.getBundle ( ).getText ( "CUSTOM_RANGE_DATE_ERROR_STATE_TEXT" ) );
		} else {
			oDateRangeSelector.setValueState ( "None" );
			for ( var i = 0 ; i < aTimeHorizonData.length ; i++ ) {
				if ( aTimeHorizonData[i].key === "customRange" ) {
					bCustomRangeFound = true;
					aTimeHorizonData[i].name = oDateRangeSelector.getValue ( );
					break;
				}
			}

			if ( bCustomRangeFound === false ) {
				aTimeHorizonData.push ( {
					key : "customRange",
					name : oDateRangeSelector.getValue ( )
				} );
			}

			oModelData["results"] = aTimeHorizonData;
			this.sapSplUsageTimeHorizonModel.setData ( oModelData );
			this.byId ( "SapSplUsageTimeHorizon" ).setSelectedKey ( "customRange" );
			/* Incident : 1570171594 1580068687 */
			this.sSelectedTimeHorizon = "customRange";
			this.fetchUsageLogData ( null, this.customDate1, this.customDate2 );
			oEvent.getSource ( ).getParent ( ).close ( );
			oEvent.getSource ( ).getParent ( ).destroy ( );
		}

	},

	onSelectOfTimeHorizon : function ( oEvent ) {

		var sBucketType = oEvent.getSource ( ).getSelectedItem ( ).getBindingContext ( ).getObject ( )["key"];
		this.fetchUsageLogData ( sBucketType );
		this.HorizonText = oEvent.getSource ( ).getSelectedItem ( ).getTitle ( );
		this.byId ( "SapSplUsageTimeHorizon" ).setText ( oSapSplUtils.getBundle ( ).getText ( "TIME_HORIZON", this.HorizonText ) );
		this.oTimeHorizonPopover.close ( );
		oEvent.getSource ( ).removeSelections ( );

	},

	handlePressOfCustomRange : function ( ) {

		if ( !this.UsageLogCustomDaterangeDialog ) {

			this.UsageLogCustomDaterangeDialog = sap.ui.xmlfragment ( "SapSplUsageLogCustomDateRange", "splReusable.fragments.UsageLogCustomDaterange", this );
			sap.ui.core.Fragment.byId ( "SapSplUsageLogCustomDateRange", "SapSplUsageLogFromDate" ).addCustomData ( new sap.ui.core.CustomData ( {
				key : "type",
				value : "from"
			} ) );
			sap.ui.core.Fragment.byId ( "SapSplUsageLogCustomDateRange", "SapSplUsageLogToDate" ).addCustomData ( new sap.ui.core.CustomData ( {
				key : "type",
				value : "to"
			} ) );
			sap.ui.core.Fragment.byId ( "SapSplUsageLogCustomDateRange", "CustomDateRangeToLabel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "TO" ) );
			sap.ui.core.Fragment.byId ( "SapSplUsageLogCustomDateRange", "CustomDateRangeFromLabel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "FROM" ) );
			sap.ui.core.Fragment.byId ( "SapSplUsageLogCustomDateRange", "SapSplUsageLogOKButton" ).setText ( oSapSplUtils.getBundle ( ).getText ( "OK_BUTTON_TEXT" ) );
			sap.ui.core.Fragment.byId ( "SapSplUsageLogCustomDateRange", "SapSplUsageLogCancelButton" ).setText ( oSapSplUtils.getBundle ( ).getText ( "CANCEL" ) );
			sap.ui.core.Fragment.byId ( "SapSplUsageLogCustomDateRange", "SapSplUsageLogPage" ).setTitle ( oSapSplUtils.getBundle ( ).getText ( "SELECT_CUSTOM_TIME_RANGE" ) );

		}

		this.UsageLogCustomDaterangeDialog.open ( );

	},

	handlePressOfOk : function ( ) {
		var oFromDate = null, oToDate = null;

		oFromDate = splReusable.libs.SapSplModelFormatters.convertYyyymmddtoDate ( sap.ui.core.Fragment.byId ( "SapSplUsageLogCustomDateRange", "SapSplUsageLogFromDate" ).getYyyymmdd ( ) );
		oToDate = splReusable.libs.SapSplModelFormatters.convertYyyymmddtoDate ( sap.ui.core.Fragment.byId ( "SapSplUsageLogCustomDateRange", "SapSplUsageLogToDate" ).getYyyymmdd ( ) );

		if ( sap.ui.core.Fragment.byId ( "SapSplUsageLogCustomDateRange", "SapSplUsageLogFromDate" ).getYyyymmdd ( ) && sap.ui.core.Fragment.byId ( "SapSplUsageLogCustomDateRange", "SapSplUsageLogToDate" ).getYyyymmdd ( ) ) {

			this.fetchUsageLogData ( null, oFromDate, oToDate );
			this.UsageLogCustomDaterangeDialog.close ( );

		} else {
			if ( !sap.ui.core.Fragment.byId ( "SapSplUsageLogCustomDateRange", "SapSplUsageLogFromDate" ).getYyyymmdd ( ) ) {
				sap.ui.core.Fragment.byId ( "SapSplUsageLogCustomDateRange", "SapSplUsageLogFromDate" ).setValueState ( sap.ui.core.ValueState.Error );

			}
			if ( !sap.ui.core.Fragment.byId ( "SapSplUsageLogCustomDateRange", "SapSplUsageLogToDate" ).getYyyymmdd ( ) ) {
				sap.ui.core.Fragment.byId ( "SapSplUsageLogCustomDateRange", "SapSplUsageLogToDate" ).setValueState ( sap.ui.core.ValueState.Error );

			}

		}

	},

	handlePressOfCancel : function ( ) {
		this.UsageLogCustomDaterangeDialog.close ( );
	},

	handleChangeOfDatePicker : function ( oEvent ) {
		var oFromDate, oToDate, oDatePicker;
		oFromDate = splReusable.libs.SapSplModelFormatters.convertYyyymmddtoDate ( sap.ui.core.Fragment.byId ( "SapSplUsageLogCustomDateRange", "SapSplUsageLogFromDate" ).getYyyymmdd ( ) );
		oToDate = splReusable.libs.SapSplModelFormatters.convertYyyymmddtoDate ( sap.ui.core.Fragment.byId ( "SapSplUsageLogCustomDateRange", "SapSplUsageLogToDate" ).getYyyymmdd ( ) );

		oDatePicker = oEvent.getSource ( );

		if ( oDatePicker.getCustomData ( )[0].getValue ( ) === "from" ) {
			sap.ui.core.Fragment.byId ( "SapSplUsageLogCustomDateRange", "SapSplUsageLogFromDate" ).setValueState ( );
		} else {
			sap.ui.core.Fragment.byId ( "SapSplUsageLogCustomDateRange", "SapSplUsageLogToDate" ).setValueState ( );
		}
		if ( oFromDate > oToDate ) {
			sap.ui.core.Fragment.byId ( "SapSplUsageLogCustomDateRange", "SapSplUsageLogToDate" ).setYyyymmdd ( sap.ui.core.Fragment.byId ( "SapSplUsageLogCustomDateRange", "SapSplUsageLogFromDate" ).getYyyymmdd ( ) );
		}
	},
	fnHandlePressOfTourSettingsAddRuleLink : function ( ) {
		var modelData = $.extend ( true, {}, sap.ui.getCore ( ).getModel ( "SapSnlhCompanyTourSettingsModel" ).getData ( ) ), isEnabled, LowerThreshold, toArray, UpperThreshold;
		var fromArray;
		if ( modelData && modelData.data && modelData.data.length === 0 ) {
			isEnabled = true;
			LowerThreshold = "-1";
			toArray = this.thresholdArray;
			UpperThreshold = "-1";
			fromArray = this.thresholdArray;
		} else {
			isEnabled = false;
			LowerThreshold = modelData.data[modelData.data.length - 1].UpperThreshold;
			fromArray = modelData.data[modelData.data.length - 1].toArray;

			if ( modelData.data[modelData.data.length - 1].UpperThreshold !== "-1" ) {
				toArray = this.getThresholdArrayForSelectControl ( parseInt ( modelData.data[modelData.data.length - 1].UpperThreshold ) );
				UpperThreshold = toArray[0].key;
			} else {
				toArray = modelData.data[modelData.data.length - 1].toArray;
				UpperThreshold = toArray[0].key;
			}

		}
		var tempTableRowObject = {
			isEnabled : isEnabled,
			toArray : toArray,
			fromArray : fromArray,
			LowerThreshold : LowerThreshold,
			UpperThreshold : UpperThreshold,
			WarningValue : "0",
			CriticalValue : "0",
			warningValueState : "None",
			warningValueStateText : "",
			criticalValueState : "None",
			criticalValueStateText : "",
			toSelectError : false,
			fromSelectError : false
		};

		modelData.data.push ( tempTableRowObject );
		
		sap.ui.getCore ( ).getModel ( "SapSnlhCompanyTourSettingsModel" ).setData ( modelData );
		
		window.setTimeout ( function ( ) {
			
			if ( sap.ui.getCore ( ).byId ( "splView.profile.Profile--sapSnlhTourSettingsTable" ) && sap.ui.getCore ( ).byId ( "splView.profile.Profile--sapSnlhTourSettingsTable" ).getItems ( )[0] ) {
				if( modelData.data && modelData.data.length > 1 ) {
					if ( sap.ui.getCore ( ).byId ( "splView.profile.Profile--sapSnlhTourSettingsTable" ).getItems ( )[modelData.data.length - 1].getCells ( )[5] ) {
						sap.ui.getCore ( ).byId ( "splView.profile.Profile--sapSnlhTourSettingsTable" ).getItems ( )[modelData.data.length - 1].getCells ( )[5].focus ( );
					}
				} else {
					if ( sap.ui.getCore ( ).byId ( "splView.profile.Profile--sapSnlhTourSettingsTable" ).getItems ( )[modelData.data.length - 1].getCells ( )[2] ) {
						sap.ui.getCore ( ).byId ( "splView.profile.Profile--sapSnlhTourSettingsTable" ).getItems ( )[modelData.data.length - 1].getCells ( )[2].focus ( );
					}
				}
				
			}
		}, 100 );

		
	},

	getThresholdArrayForSelectControl : function ( LowerThreshold ) {
		if ( LowerThreshold === -1 ) {
			return this.thresholdArray;
		} else {
			return this.thresholdArray.filter ( function ( el ) {
				return (parseInt ( el.key ) === -1 || parseInt ( el.key ) > LowerThreshold);
			} );
		}
	},

	fnHandlePressDeleteOfTourSettingsTableItem : function ( oEvent ) {
		var index = parseInt ( oEvent.getParameter ( "listItem" ).getBindingContext ( ).getPath ( ).split ( "/" )[2] );
		var modelData = $.extend ( true, {}, sap.ui.getCore ( ).getModel ( "SapSnlhCompanyTourSettingsModel" ).getData ( ) );

		this.fnToCaptureLiveChangeToSetFlag ( );

		if ( index !== 0 && index !== (modelData.data.length - 1) ) {

			modelData.data[index + 1].LowerThreshold = modelData.data[index - 1].UpperThreshold;
			modelData.data[index + 1].fromArray = modelData.data[index - 1].toArray;
			modelData.data[index + 1].toArray = this.getThresholdArrayForSelectControl ( parseInt ( modelData.data[index + 1].LowerThreshold ) );
		}

		if ( modelData.data[index].UUID ) {
			this.toDeleteArray.push ( modelData.data[index] );
		}

		modelData.data.splice ( index, 1 );

		//Incident 1580098246 lower threshold of the new first row should be enabled when existing first row is deleted
		if ( modelData.data.length > 0 ) {
			modelData.data[0].fromArray = this.thresholdArray;
			modelData.data[0].isEnabled = true;
			modelData.data[0].toArray = this.getThresholdArrayForSelectControl ( parseInt ( modelData.data[0].LowerThreshold ) );
		}
		sap.ui.getCore ( ).getModel ( "SapSnlhCompanyTourSettingsModel" ).setData ( modelData );
	},

	fnHandleChangeOfFromThreshold : function ( oEvent ) {
		var index = parseInt ( oEvent.getSource ( ).getBindingContext ( ).getPath ( ).split ( "/" )[2] );
		var key = oEvent.getParameters ( ).selectedItem.getKey ( );

		var modelData = $.extend ( true, {}, sap.ui.getCore ( ).getModel ( "SapSnlhCompanyTourSettingsModel" ).getData ( ) );
		modelData.data[index].LowerThreshold = key;

		if ( this.getIndexOfkeyFromThresholdArray ( key ) < this.getIndexOfkeyFromThresholdArray ( modelData.data[index].UpperThreshold ) ) {
			modelData.data[index].LowerThreshold = key;
			modelData = this.fnToValidateSelectControlEntries ( modelData );
		} else if ( modelData.data[index].UpperThreshold !== "-1" && (this.getIndexOfkeyFromThresholdArray ( key ) >= this.getIndexOfkeyFromThresholdArray ( modelData.data[index].UpperThreshold )) ) {
			modelData = this.fnToValidateSelectControlEntries ( modelData );
		} else {
			modelData.data = this.fnValidateSelectControl ( modelData.data, index, key, 1 );
		}
		if( ( index === 0 ) && ( this.getIndexOfkeyFromThresholdArray ( key ) === 0 ) ) {
			modelData.data[index].fromSelectError = true;
		} else {
			modelData.data[index].fromSelectError = false;
		}
		this.fnToCaptureLiveChangeToSetFlag ( );
		
		sap.ui.getCore ( ).getModel ( "SapSnlhCompanyTourSettingsModel" ).setData ( modelData );
	},

	fnHandleChangeOfToThreshold : function ( oEvent ) {
		var index = parseInt ( oEvent.getSource ( ).getBindingContext ( ).getPath ( ).split ( "/" )[2] );
		var key = oEvent.getParameters ( ).selectedItem.getKey ( );

		var modelData = $.extend ( true, {}, sap.ui.getCore ( ).getModel ( "SapSnlhCompanyTourSettingsModel" ).getData ( ) );
		modelData.data[index].UpperThreshold = key;
		if ( modelData.data[index + 1] && (this.getIndexOfkeyFromThresholdArray ( key ) < this.getIndexOfkeyFromThresholdArray ( modelData.data[index + 1].UpperThreshold )) ) {

			modelData.data[index + 1].LowerThreshold = key;
			modelData = this.fnToValidateSelectControlEntries ( modelData );

		} else if ( modelData.data[index + 1] && modelData.data[index + 1].UpperThreshold !== "-1" && (this.getIndexOfkeyFromThresholdArray ( key ) >= this.getIndexOfkeyFromThresholdArray ( modelData.data[index + 1].UpperThreshold )) ) {

			modelData.data[index + 1].LowerThreshold = key;
			modelData = this.fnToValidateSelectControlEntries ( modelData );
		} else {

			modelData = this.fnToValidateSelectControlEntries ( modelData );
			modelData.data = this.fnValidateSelectControl ( modelData.data, index, modelData.data[index].LowerThreshold, 0 );
		}

		this.fnToCaptureLiveChangeToSetFlag ( );

		sap.ui.getCore ( ).getModel ( "SapSnlhCompanyTourSettingsModel" ).setData ( modelData );
	},

	fnToValidateSelectControlEntries : function ( modelData ) {
		for ( var i = 0 ; i < modelData.data.length ; i++ ) {
			if ( i === 0 && modelData.data[i].LowerThreshold !== "-1" && this.getIndexOfkeyFromThresholdArray ( modelData.data[i].LowerThreshold ) >= this.getIndexOfkeyFromThresholdArray ( modelData.data[i].UpperThreshold ) ) {
				modelData.data[i].toSelectError = true;
				for ( i = i + 1 ; i < modelData.data.length ; i++ ) {
					modelData.data[i].toSelectError = true;
				}
			} else if ( modelData.data[i + 1] && modelData.data[i + 1].UpperThreshold !== "-1" &&
					this.getIndexOfkeyFromThresholdArray ( modelData.data[i].UpperThreshold ) >= this.getIndexOfkeyFromThresholdArray ( modelData.data[i + 1].UpperThreshold ) ) {
				if ( i !== 0 ) {
					modelData.data[i].toArray = this.getThresholdArrayForSelectControl ( modelData.data[i].LowerThreshold );
					modelData.data[i].fromArray = this.getThresholdArrayForSelectControl ( modelData.data[i - 1].LowerThreshold );
				}
				modelData.data[i].toSelectError = false;
				for ( i = i + 1 ; i < modelData.data.length ; i++ ) {
					modelData.data[i].toSelectError = true;
				}
			} else {
				modelData.data[i].toSelectError = false;
				modelData.data[i].toArray = this.getThresholdArrayForSelectControl ( modelData.data[i].LowerThreshold );
				if ( i !== (modelData.data.length - 1) ) {
					if ( modelData.data[i].UpperThreshold === "-1" ) {
						modelData.data[i + 1].toArray = modelData.data[i].toArray;
					} else {
						modelData.data[i + 1].toArray = this.getThresholdArrayForSelectControl ( modelData.data[i].UpperThreshold );
					}
					modelData.data[i + 1].fromArray = modelData.data[i].toArray;
				}
			}
		}
		return modelData;
	},

	fnValidateSelectControl : function ( modelData, index, key, isFrom ) {
		var i;

		if ( isFrom === 1 ) {
			i = index;
		} else {
			i = index + 1;
		}
		for ( ; i < modelData.length ; i++ ) {

			if ( i !== index ) {
				if ( modelData[i].fromArray === undefined ) {
					modelData[i].fromArray = [];
				}
				modelData[i].fromArray = modelData[i - 1].toArray;
				if ( isFrom === 0 ) {
					modelData[i].LowerThreshold = modelData[i - 1].UpperThreshold;
				} else {
					modelData[i].LowerThreshold = modelData[i].fromArray[0].key;
				}

			}
			if ( isFrom === 0 && i === (index + 1) ) {
				key = modelData[i].LowerThreshold;
			}
			if ( modelData[i].toArray === undefined ) {
				modelData[i].toArray = [];
			}
			modelData[i].toArray = this.getThresholdArrayForSelectControl ( parseInt ( key, 10 ) );
			modelData[i].UpperThreshold = modelData[i].toArray[0].key;
		}

		return modelData;
	},

	getIndexOfkeyFromThresholdArray : function ( key ) {
		for ( var i = 0 ; i < this.thresholdArray.length ; i++ ) {
			if ( this.thresholdArray[i].key === key ) {
				break;
			}
		}
		return i;
	},

	fnHandleCompnayTourSettingsCancelButton : function ( ) {
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
		this.byId ( "btnEditCompanyProfile" )
				.setVisible ( splReusable.libs.SapSplModelFormatters.showEditable ( this.oCompanyProfileModel.getData ( ).isEditable, sap.ui.getCore ( ).getModel ( "profileButtonVisibilityModel" ).getData ( ).editButton ) );
		this.byId ( "sapSnlhCompnayTourSettingsSaveButton" ).setVisible ( false );
		this.byId ( "sapSnlhCompnayTourSettingsCancelButton" ).setVisible ( false );
		this.byId ( "sapSnlhTourSettingsTable" ).setMode ( "None" );
		this.byId ( "sapSnlhTourSettingsAddRuleLink" ).setVisible ( false );
		oSapSplUtils.setIsDirty ( false );
		var modelData = this.previousModelData;
		modelData.isEdit = false;
		sap.ui.getCore ( ).getModel ( "SapSnlhCompanyTourSettingsModel" ).setData ( modelData );
	},

	fireDelete : function ( aDelete ) {

		var payload = {};

		payload = this.prepareDeletePayload ( );

		oSapSplAjaxFactory.fireAjaxCall ( {
			url : oSapSplUtils.getFQServiceUrl ( "sap/spl/xs/app/services/tourPreferences.xsjs" ),
			method : "POST",
			async : false,
			data : JSON.stringify ( payload ),
			success : function ( data, success, messageObject ) {

				if ( data.constructor === String ) {
					data = JSON.parse ( data );
				}
				if ( data["Error"].length > 0 ) {
					var errorMessage = oSapSplUtils.getErrorMessagesfromErrorPayload ( data )["ufErrorObject"];
					sap.ca.ui.message.showMessageBox ( {
						type : sap.ca.ui.message.Type.ERROR,
						message : oSapSplUtils.getErrorMessagesfromErrorPayload ( data )["errorWarningString"],
						details : errorMessage
					} );
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
			},
			complete : function ( ) {

			}

		} );
	},

	prepareDeletePayload : function ( ) {
		var aPayload = [], oPayload = {};
		for ( var i = 0 ; i < this.toDeleteArray.length ; i++ ) {
			oPayload = {};
			oPayload.UUID = this.toDeleteArray[i].UUID;
			oPayload.ChangeMode = "D";
			oPayload["OrganizationUUID"] = this.toDeleteArray[i].OrganizationUUID;
			aPayload.push ( oPayload );
		}
		return {
			"inputHasChangeMode" : true,
			"tourPreference" : aPayload
		};
	},

	fnHandleCompnayTourSettingsSaveButton : function ( ) {

		var that = this, payload;

		if ( this.validateEntries ( ) ) {
			oSapSplBusyDialog.getBusyDialogInstance ( {
				title : oSapSplUtils.getBundle ( ).getText ( "BUSY_DIALOG_MESSAGE" )
			} ).open ( );

			if ( this.toDeleteArray.length > 0 ) {
				this.fireDelete ( );
			}
			payload = this.prepareTourSettingsPayload ( );

			oSapSplAjaxFactory.fireAjaxCall ( {
				url : oSapSplUtils.getFQServiceUrl ( "sap/spl/xs/app/services/tourPreferences.xsjs" ),
				method : "PUT",
				async : false,
				data : JSON.stringify ( payload ),
				success : function ( data, success, messageObject ) {
					oSapSplUtils.setIsDirty ( false );
					oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
					if ( data.constructor === String ) {
						data = JSON.parse ( data );
					}
					if ( messageObject["status"] === 200 && data["Error"].length === 0 ) {

						sap.ca.ui.message.showMessageToast ( oSapSplUtils.getBundle ( ).getText ( "PROFILE_UPDATE_SUCCESSFUL" ) );
						that.byId ( "btnEditCompanyProfile" ).setVisible (
								splReusable.libs.SapSplModelFormatters.showEditable ( that.oCompanyProfileModel.getData ( ).isEditable, sap.ui.getCore ( ).getModel ( "profileButtonVisibilityModel" ).getData ( ).editButton ) );
						that.byId ( "sapSnlhCompnayTourSettingsSaveButton" ).setVisible ( false );
						that.byId ( "sapSnlhCompnayTourSettingsCancelButton" ).setVisible ( false );
						that.byId ( "sapSnlhTourSettingsTable" ).setMode ( "None" );
						that.byId ( "sapSnlhTourSettingsAddRuleLink" ).setVisible ( false );
						that.fireAjaxToGetListOfThresholdRules ( );

					} else if ( data["Error"].length > 0 ) {
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
				},
				complete : function ( ) {

				}

			} );
		}

	},

	validateEntries : function ( ) {
		var modelData = sap.ui.getCore ( ).getModel ( "SapSnlhCompanyTourSettingsModel" ).getData ( );
		var flag = true, bFlag = true, wValue, cValue;

		for ( var i = 0 ; i < modelData.data.length ; i++ ) {
			bFlag = true;

			if ( !(/^\d+(\.\d+)?$/i.test ( modelData.data[i].WarningValue )) && !(modelData.data[i].WarningValue.trim ( ) === "") ) {
				flag = false;
				bFlag = false;
				modelData.data[i].warningValueState = "Error";
				modelData.data[i].warningValueStateText = oSapSplUtils.getBundle ( ).getText ( "EMPTY_ERROR_MESSAGE" );
			} else {
				modelData.data[i].warningValueState = "None";
			}
			if ( !(/^\d+(\.\d+)?$/i.test ( modelData.data[i].CriticalValue )) && !(modelData.data[i].CriticalValue.trim ( ) === "") ) {
				flag = false;
				bFlag = false;
				modelData.data[i].criticalValueState = "Error";
				modelData.data[i].criticalValueStateText = oSapSplUtils.getBundle ( ).getText ( "EMPTY_ERROR_MESSAGE" );
			} else {
				modelData.data[i].criticalValueState = "None";
			}

			if ( bFlag ) {
				if ( modelData.data[i].WarningValue === "" ) {
					wValue = 0;
				} else {
					wValue = parseFloat ( modelData.data[i].WarningValue );
				}

				if ( modelData.data[i].CriticalValue === "" ) {
					cValue = 0;
				} else {
					cValue = parseFloat ( modelData.data[i].CriticalValue );
				}

				if ( cValue <= wValue ) {
					if ( cValue === 0 && wValue === 0 ) {
						modelData.data[i].criticalValueState = "None";
					} else {
						flag = false;
						modelData.data[i].criticalValueState = "Error";
					}
				} else {
					modelData.data[i].criticalValueState = "None";
				}
			}
			
			if ( modelData.data[i].UpperThreshold === "-1" ) {
				modelData.data[i].toSelectError = true;
			}
			
			if( i === 0 ) {
				if ( modelData.data[i].LowerThreshold === "-1" ) {
					modelData.data[i].fromSelectError = true;
				} else {
					modelData.data[i].fromSelectError = false;
				}
			} else {
				modelData.data[i].fromSelectError = false;
			}

			if ( modelData.data[i].LowerThreshold !== "-1" && modelData.data[i].UpperThreshold === "-1" ) {
				if ( modelData.data[i].LowerThreshold !== "518460" ) {
					modelData.data[i].toSelectError = true;
				} else {
					modelData.data[i].fromSelectError = true;
				}
			}
			
			
			if ( modelData.data[i].toSelectError || modelData.data[i].fromSelectError ) {
				flag = false;
			}
		}
		if ( !flag ) {
			sap.ui.getCore ( ).getModel ( "SapSnlhCompanyTourSettingsModel" ).setData ( modelData );
		}
		return flag;
	},

	prepareTourSettingsPayload : function ( ) {
		var oPayload = {}, payload = [];
		var modelData = sap.ui.getCore ( ).getModel ( "SapSnlhCompanyTourSettingsModel" ).getData ( );

		for ( var i = 0 ; i < modelData.data.length ; i++ ) {

			if ( modelData.data[i].LowerThreshold === "-1" && modelData.data[i].UpperThreshold === "-1" ) {
				break;
			}
			oPayload = {};
			if ( modelData.data[i].UUID ) {
				oPayload["UUID"] = modelData.data[i].UUID;
			} else {
				oPayload["UUID"] = oSapSplUtils.getUUID ( );
			}

			oPayload["OrganizationUUID"] = oSapSplUtils.getCompanyDetails ( ).UUID;
			oPayload["LowerThreshold"] = modelData.data[i].LowerThreshold;
			if ( modelData.data[i].UpperThreshold === "518460" ) {
				oPayload["UpperThreshold"] = null;
			} else {
				oPayload["UpperThreshold"] = modelData.data[i].UpperThreshold;
			}

			if ( modelData.data[i].WarningValue.trim ( ) === "" ) {
				oPayload["WarningValue"] = "0";
			} else {
				oPayload["WarningValue"] = modelData.data[i].WarningValue.toString ( );
			}
			if ( modelData.data[i].CriticalValue.trim ( ) === "" ) {
				oPayload["CriticalValue"] = "0";
			} else {
				oPayload["CriticalValue"] = modelData.data[i].CriticalValue.toString ( );
			}

			payload.push ( oPayload );

			if ( modelData.data[i].UpperThreshold === "518460" || (modelData.data[i].LowerThreshold === "-1" && modelData.data[i].UpperThreshold === "-1") ) {
				break;
			}
		}

		return {
			"tourPreference" : payload
		};

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

	initializeThresholdJson : function ( ) {
		this.thresholdArray = [{
			key : "-1",
			value : ""
		}, {
			key : "0",
			value : "0" + " " + oSapSplUtils.getBundle ( ).getText ( "MINUTES" )
		}, {
			key : "900",
			value : "15" + " " + oSapSplUtils.getBundle ( ).getText ( "MINUTES" )
		}, {
			key : "1800",
			value : "30" + " " + oSapSplUtils.getBundle ( ).getText ( "MINUTES" )
		}, {
			key : "2700",
			value : "45" + " " + oSapSplUtils.getBundle ( ).getText ( "MINUTES" )
		}, {
			key : "3600",
			value : "1" + " " + oSapSplUtils.getBundle ( ).getText ( "TOUR_SETTINGS_HOUR" )
		}, {
			key : "7200",
			value : "2" + " " + oSapSplUtils.getBundle ( ).getText ( "TOUR_SETTINGS_HOURS" )
		}, {
			key : "10900",
			value : "3" + " " + oSapSplUtils.getBundle ( ).getText ( "TOUR_SETTINGS_HOURS" )
		}, {
			key : "14400",
			value : "4" + " " + oSapSplUtils.getBundle ( ).getText ( "TOUR_SETTINGS_HOURS" )
		}, {
			key : "18000",
			value : "5" + " " + oSapSplUtils.getBundle ( ).getText ( "TOUR_SETTINGS_HOURS" )
		}, {
			key : "21600",
			value : "6" + " " + oSapSplUtils.getBundle ( ).getText ( "TOUR_SETTINGS_HOURS" )
		}, {
			key : "25200",
			value : "7" + " " + oSapSplUtils.getBundle ( ).getText ( "TOUR_SETTINGS_HOURS" )
		}, {
			key : "28800",
			value : "8" + " " + oSapSplUtils.getBundle ( ).getText ( "TOUR_SETTINGS_HOURS" )
		}, {
			key : "32400",
			value : "9" + " " + oSapSplUtils.getBundle ( ).getText ( "TOUR_SETTINGS_HOURS" )
		}, {
			key : "36000",
			value : "10" + " " + oSapSplUtils.getBundle ( ).getText ( "TOUR_SETTINGS_HOURS" )
		}, {
			key : "39600",
			value : "11" + " " + oSapSplUtils.getBundle ( ).getText ( "TOUR_SETTINGS_HOURS" )
		}, {
			key : "43200",
			value : "12" + " " + oSapSplUtils.getBundle ( ).getText ( "TOUR_SETTINGS_HOURS" )
		}, {
			key : "46800",
			value : "13" + " " + oSapSplUtils.getBundle ( ).getText ( "TOUR_SETTINGS_HOURS" )
		}, {
			key : "50400",
			value : "14" + " " + oSapSplUtils.getBundle ( ).getText ( "TOUR_SETTINGS_HOURS" )
		}, {
			key : "54000",
			value : "15" + " " + oSapSplUtils.getBundle ( ).getText ( "TOUR_SETTINGS_HOURS" )
		}, {
			key : "57600",
			value : "16" + " " + oSapSplUtils.getBundle ( ).getText ( "TOUR_SETTINGS_HOURS" )
		}, {
			key : "61200",
			value : "17" + " " + oSapSplUtils.getBundle ( ).getText ( "TOUR_SETTINGS_HOURS" )
		}, {
			key : "64800",
			value : "18" + " " + oSapSplUtils.getBundle ( ).getText ( "TOUR_SETTINGS_HOURS" )
		}, {
			key : "68400",
			value : "19" + " " + oSapSplUtils.getBundle ( ).getText ( "TOUR_SETTINGS_HOURS" )
		}, {
			key : "72000",
			value : "20" + " " + oSapSplUtils.getBundle ( ).getText ( "TOUR_SETTINGS_HOURS" )
		}, {
			key : "75600",
			value : "21" + " " + oSapSplUtils.getBundle ( ).getText ( "TOUR_SETTINGS_HOURS" )
		}, {
			key : "79200",
			value : "22" + " " + oSapSplUtils.getBundle ( ).getText ( "TOUR_SETTINGS_HOURS" )
		}, {
			key : "82800",
			value : "23" + " " + oSapSplUtils.getBundle ( ).getText ( "TOUR_SETTINGS_HOURS" )
		}, {
			key : "86400",
			value : "1" + " " + oSapSplUtils.getBundle ( ).getText ( "TOUR_SETTINGS_DAY" )
		}, {
			key : "172800",
			value : "2" + " " + oSapSplUtils.getBundle ( ).getText ( "TOUR_SETTINGS_DAYS" )
		}, {
			key : "259200",
			value : "3" + " " + oSapSplUtils.getBundle ( ).getText ( "TOUR_SETTINGS_DAYS" )
		}, {
			key : "345600",
			value : "4" + " " + oSapSplUtils.getBundle ( ).getText ( "TOUR_SETTINGS_DAYS" )
		}, {
			key : "432000",
			value : "5" + " " + oSapSplUtils.getBundle ( ).getText ( "TOUR_SETTINGS_DAYS" )
		}, {
			key : "518400",
			value : "6" + " " + oSapSplUtils.getBundle ( ).getText ( "TOUR_SETTINGS_DAYS" )
		}, {
			key : "518460",
			value : "6+" + " " + oSapSplUtils.getBundle ( ).getText ( "TOUR_SETTINGS_DAYS" )
		}];
	}

} );
