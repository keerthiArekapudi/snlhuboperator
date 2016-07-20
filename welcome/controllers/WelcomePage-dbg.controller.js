/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
$.sap.require ( "sap.m.MessageBox" );
$.sap.require ( "splReusable.Enums" );

sap.ui.controller ( "controllers.WelcomePage", {

	isOptionalShown : false,

	selectedOwner : null,

	renderPsp : oSapSplUtils.getIncludePsp ( ) === "x",

	helpPageUrl : "./help/SCLSelfRegistration_" + sap.ui.getCore ( ).getConfiguration ( ).getLocale ( ).getLanguage ( ).split ( "_" )[0] + ".pdf",

	registerLocalizationModel : function ( ) {
		var oLocalizationModel = new sap.ui.model.resource.ResourceModel ( {
			bundleUrl : "./resources/l10n/label.properties",
			bundleLocale : sap.ui.getCore ( ).getConfiguration ( ).getLocale ( ),
			async : true
		} );
		
		sap.ui.getCore ( ).setModel ( oLocalizationModel, "i18n" );
	},

	/**
	 * @private
	 * @description Handler for Help Page display in Self Registration
	 * @param oEvent
	 */
	handleWelcomePageHelpLoad : function ( ) {

		var sContentHeight = ($ ( ".sapUiBody" ).height ( ) * 0.88).toString ( ) + "px", sContentWidth = ($ ( ".sapUiBody" ).width ( ) * 0.9).toString ( ) + "px";

		new sap.m.Dialog ( {
			contentHeight : "100%",
			contentWidth : "100%",
			customHeader : new sap.m.Bar ( {
				contentRight : new sap.m.Button ( {
					icon : "sap-icon://sys-cancel",
					press : function ( oEvent ) {
						oEvent.getSource ( ).getParent ( ).getParent ( ).destroy ( );
					}
				} ),
				contentMiddle : [new sap.m.Label ( {
					text : "SAP Networked Logistics Hub",
					design : "Bold"
				} )]
			} ),
			content : [new sap.ui.core.HTML ( {
				content : "<iframe seamless=\"seamless\" height=" + "\"" + sContentHeight + "\"" + " width=" + "\"" + sContentWidth + "\"" + " scrolling=\"no\" frameborder=\"0\" src=" + "\"" + this.helpPageUrl + "\"" + "></iframe>"
			} )]
		} ).open ( );
	},

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf welcomepage.WelcomePage
	 */
	onInit : function ( ) {
		var oData = {
			showRegForm : true,
			showFBPage : false,
			showMessageOnHeader : false,
			showLogonButton : true
		};

		/*FIX FOR BCP 1580005760. Sort by Organization Name ascending for usability*/
		var sFilterParameters = (this.renderPsp) ? "$expand=RolesOfPotentialOwnedAccount,ProductList&$orderby=Organization_Name asc&$format=json"
				: "$expand=RolesOfPotentialOwnedAccount,ProductList&$filter=(isOwnerSelf eq 0)&$orderby=Organization_Name asc&$format=json";
		var oModel = new sap.ui.model.json.JSONModel ( oData );
		sap.ui.getCore ( ).setModel ( oModel, "visibilityModel" );

		this.oSapSplAppModel = new sap.ui.model.odata.ODataModel ( oSapSplUtils.getFQServiceUrl ( "/sap/spl/xs/selfRegistration/data.xsodata/" ) );
		this.setBusyOnSelect ( true );
		this.oSapSplAppModel.read ( "/Owners", null, [sFilterParameters], true, jQuery.proxy ( this.fnSuccessCallback, this ), jQuery.proxy ( this.fnErrorCallback, this ) );
		if ( oSapSplUtils.getDeviceID ( ) ) {
			this.oSapSplAppModel.read ( "/Enumeration('VehicleType')/Values", null, null, true, jQuery.proxy ( this.fnSuccessCallbackOfEnums, this ), jQuery.proxy ( this.fnErrorCallback, this ) );
		}
		this.serviceProductFilter = new sap.ui.model.Filter ( "isDefault", sap.ui.model.FilterOperator.EQ, "1" );
		this.canMaintainTruck = new sap.ui.model.Filter ( "canMaintainTruck", sap.ui.model.FilterOperator.EQ, "1" );

		this.BusyDialog = new sap.m.BusyDialog ( );

		var oRegistrationModel = new sap.ui.model.json.JSONModel ( );
		this.getView ( ).setModel ( oRegistrationModel );
		this.fnHandleDeviceIDParameter ( );

		this.getView ( ).byId ( "sapSplSelfRegistrationFormRoleSelect" ).setEnabled ( false );
		this.getView ( ).byId ( "sapSplSelfRegistrationFormSubscriptionPackSelect" ).setEnabled ( false );
		this.registerLocalizationModel ( );
		this.handleOnInitialization ( );

		var that = this;
		this.getView ( ).addEventDelegate ( {
			onAfterShow : function ( ) {
				that.getView ( ).byId ( "sapSplSelfRegistrationFormFNameInput" ).focus ( );
			}
		} );

	},

	handleOnInitialization : function ( ) { /*CSNFIX 631502 2014*/
		if ( (document.referrer !== "" && document.referrer.toLowerCase ( ).indexOf ( "logout/index.html" ) > -1) ) {
//            if (localStorage.getItem("state.key_-src") === "1") {
//                sap.ui.getCore().getModel("visibilityModel").getData()["showMessageOnHeader"] = true;
//                localStorage.removeItem("state.key_-src");
//
//                /*
//                 *
//                 * Set the first field for initial focus
//                 *
//                 * */
//                $(document).ready(function () {
//                    if ($("input").length >= 0) {
//                        if ($("input")[0]) {
//                            $("input")[0].focus();
//                        }
//                    }
//                });
//            }
			if ( localStorage.getItem ( "state.key_-src" ) === "2" ) {
				sap.ui.getCore ( ).getModel ( "visibilityModel" ).getData ( )["showMessageOnHeader"] = false;
				sap.ui.getCore ( ).getModel ( "visibilityModel" ).getData ( )["showRegForm"] = false;
				sap.ui.getCore ( ).getModel ( "visibilityModel" ).getData ( )["showFBPage"] = true;
				sap.ui.getCore ( ).getModel ( "visibilityModel" ).getData ( )["showLogonButton"] = false;
				sap.ui.getCore ( ).getModel ( "visibilityModel" ).refresh ( );
				if ( this.byId ( "sapSplLabelSelfDeletion" ) ) {
					this.byId ( "sapSplLabelSelfDeletion" ).setText ( oSapSplUtils.getBundle ( ).getText ( "SPL_FEEDBACK_ON_SUCCESSSFUL_DEL", ["SAP Networked Logistics Hub"] ) );
				}
				localStorage.removeItem ( "state.key_-src" );
			}
		}

	},

	/**
	 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
	 * (NOT before the first rendering! onInit() is used for that one!).
	 * @memberOf welcomepage.WelcomePage
	 */
	onBeforeRendering : function ( ) {

	},

	/**
	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * @memberOf welcomepage.WelcomePage
	 */
	onAfterRendering : function ( ) {

	},

	handleLogonOnSelfiePress : function ( oEvent ) {

		$.sap.log.info ( "SAP SCL Welcome Page", "Event triggered: " + oEvent, "SAPSCL" );

		/*Navigate to Home page*/
		location.href = "../index.html";
	},

	/**
	 * @description Method to handle success callback of register call.
	 * @param data object containing the response.
	 * @returns void.
	 * @since 1.0
	 * @private
	 */

	fnSuccessCallback : function ( data, response ) {

		var aTempArrayofOwners, oTempOwnerObj = {}, oTempRoleObj = {}, oTempProductObj = {};

		var oSapSplOwnerModel = new sap.ui.model.json.JSONModel ( ), oSapSplRoleModel = new sap.ui.model.json.JSONModel ( ), oSapSplSubscriptionProductModel = new sap.ui.model.json.JSONModel ( );

		this.setBusyOnSelect ( false );
		if ( response.hasOwnProperty ( "body" ) ) {
			var oData = JSON.parse ( response.body );
			if ( oData.hasOwnProperty ( "d" ) ) {
				data = oData["d"];
				if ( data && data.results && oSapSplUtils.IsValidArray ( data.results ) ) {

					if ( sap.ui.getCore ( ).getModel ( "i18n" ) ) {
						oTempOwnerObj["Organization_Name"] = sap.ui.getCore ( ).getModel ( "i18n" ).getProperty ( "SELECT_OPTION" );

						oTempRoleObj["RoleOfPotentialOwnedAccount_description"] = sap.ui.getCore ( ).getModel ( "i18n" ).getProperty ( "SELECT_OPTION" );

						oTempProductObj["Name.description"] = sap.ui.getCore ( ).getModel ( "i18n" ).getProperty ( "SELECT_OPTION" );

					}

					oTempOwnerObj["OrganizationUUID"] = null;

					oTempRoleObj["RoleOfPotentialOwnedAccount"] = null;

					oTempProductObj["UUID"] = null;

					oTempOwnerObj["RolesOfPotentialOwnedAccount"] = {
						results : [oTempRoleObj]
					};

					oTempOwnerObj["ProductList"] = {
						results : [oTempProductObj]
					};

					aTempArrayofOwners = [oTempOwnerObj];

					data.results = aTempArrayofOwners.concat ( data.results );

				}

			}

		}

		oSapSplOwnerModel.setData ( data );

		this.byId ( "sapSplSelfRegistrationFormOwnerSelect" ).setModel ( oSapSplOwnerModel );

		this.byId ( "sapSplSelfRegistrationFormRoleSelect" ).rerender ( );
		//Set the Role data of the preselected Owner
		if ( data && data.results && data.results.length > 0 ) {
			oSapSplRoleModel.setData ( data.results[0].RolesOfPotentialOwnedAccount );
			oSapSplSubscriptionProductModel.setData ( data.results[0].ProductList );
		}
		this.byId ( "sapSplSelfRegistrationFormRoleSelect" ).setModel ( oSapSplRoleModel );
		this.byId ( "sapSplSelfRegistrationFormSubscriptionPackSelect" ).setModel ( oSapSplSubscriptionProductModel );
	},

	/**
	 * @description Method to handle the change of drop down list.sets the model for Owner drop down list and updates the selectedKey
	 * @param oEvent -Event Object of the change event.
	 * @returns void.
	 * @since 1.0
	 * @private
	 */

	fnHandleChangeOfOwner : function ( oEvent ) {

		var oRoleFilter = null;
		var sSelectedRole = null;
		var oData = null;
		oData = oEvent.getSource ( ).getSelectedItem ( ).getBindingContext ( ).getObject ( );
		this.byId ( "sapSplSelfRegistrationFormSubscriptionPackSelect" ).setVisible ( true );

		this.selectedOwner = oData;

		this.byId ( "sapSplSelfRegistrationFormRoleSelect" ).getModel ( ).setData ( oData.RolesOfPotentialOwnedAccount );
		this.byId ( "sapSplSelfRegistrationFormSubscriptionPackSelect" ).getModel ( ).setData ( oData.ProductList );

		if ( this.byId ( "sapSplSelfRegistrationFormRoleSelect" ).getSelectedItem ( ) && oData && oData.RolesOfPotentialOwnedAccount && oData.RolesOfPotentialOwnedAccount && oData.RolesOfPotentialOwnedAccount.results &&
				oData.RolesOfPotentialOwnedAccount.results.length > 0 ) {
			this.byId ( "sapSplSelfRegistrationFormRoleSelect" ).getSelectedItem ( ).setKey ( oData.RolesOfPotentialOwnedAccount.results[0].RoleOfPotentialOwnedAccount );
			sSelectedRole = this.byId ( "sapSplSelfRegistrationFormRoleSelect" ).getSelectedItem ( ).getKey ( );
		}

		oRoleFilter = new sap.ui.model.Filter ( "Role", sap.ui.model.FilterOperator.EQ, sSelectedRole );

		this.byId ( "sapSplSelfRegistrationFormSubscriptionPackSelect" ).getBinding ( "items" ).filter ( [oRoleFilter] );

		this.fnCheckSubscriptionProduct ( );

		this.getView ( ).byId ( "sapSplSelfRegistrationFormRoleSelect" ).setEnabled ( true );
		this.byId ( "sapSplSelfRegistrationFormSubscriptionPackSelect" ).setEnabled ( true );

	},

	/**
	 * @private
	 * @param oEvent
	 * @since 1.0
	 */
	fnHandleChangeOfRole : function ( ) {

		/*
		 * If the role is Carrier, show the package select option
		 * Else set the first default item of the owner as the selected item and hide the package select option
		 * If no default items exist for that owner, select the first item, and hide the package select option
		 * If no items [subscription] exist, throw error message and return
		 *
		 */

		var sSelectedRole = this.byId ( "sapSplSelfRegistrationFormRoleSelect" ).getSelectedItem ( ).getKey ( );
		var oRoleFilter = new sap.ui.model.Filter ( "Role", sap.ui.model.FilterOperator.EQ, sSelectedRole );

		this.byId ( "sapSplSelfRegistrationFormSubscriptionPackSelect" ).setVisible ( true );
		this.byId ( "sapSplSelfRegistrationFormSubscriptionPackSelect" ).getBinding ( "items" ).filter ( [oRoleFilter] );
		this.fnCheckSubscriptionProduct ( );

	},
	/*
	 * fnCheckSubscriptionProduct:
	 * Check the number of subscription product after Filter conditions
	 * If there is only one product,check if the product is Default ,then set product as default product and disable product select drop down
	 */

	fnCheckSubscriptionProduct : function ( ) {

		var aItems = [];
		var oDefaultItem = [];
		var sDefaultProduct = null;
		var oModel = null;
		var oData = null;

		if ( this.byId ( "sapSplSelfRegistrationFormSubscriptionPackSelect" ).getItems ( ) && this.byId ( "sapSplSelfRegistrationFormSubscriptionPackSelect" ).getItems ( ).length === 1 ) {
			oModel = this.byId ( "sapSplSelfRegistrationFormSubscriptionPackSelect" ).getModel ( );
			aItems = this.byId ( "sapSplSelfRegistrationFormSubscriptionPackSelect" ).getItems ( );
			if ( oModel ) {
				oData = oModel.getData ( );
				if ( oData.hasOwnProperty ( "results" ) && aItems instanceof Array && aItems.length === 1 ) {
					this.byId ( "sapSplSelfRegistrationFormSubscriptionPackSelect" ).setVisible ( false );

					oDefaultItem = this.byId ( "sapSplSelfRegistrationFormSubscriptionPackSelect" ).getItems ( )[0];
					if ( oDefaultItem.getBindingContext ( ) && oDefaultItem.getBindingContext ( ) && oDefaultItem.getBindingContext ( ).getObject ( ) ) {
						if ( oDefaultItem.getBindingContext ( ).getObject ( ).isDefault === 1 ) {
							sDefaultProduct = oDefaultItem.getBindingContext ( ).getObject ( ).ProductUUID;
						}
					}
					this.byId ( "sapSplSelfRegistrationFormSubscriptionPackSelect" ).setSelectedKey ( sDefaultProduct );
				}
			}
		}
	},

	/**
	 * @description Method to handle the click of register button.
	 * @param null.
	 * @param null
	 * @returns void.
	 * @since 1.0
	 * @private
	 */
	fnPostBusinessPartnerDetailsData : function ( ) {
		var that = null, oData = null, oPayload = null, oRole = null, oDVA = null;

		that = this;
		oData = that.getView ( ).getModel ( ).getData ( );
		oData["BasicInfo.ID"] = null;
		oData["BasicInfo.Type"] = "O";
		oData["UUID"] = oSapSplUtils.getUUID ( );

		if ( this.byId ( "sapSplSelfRegistrationFormOwnerSelect" ).getSelectedItem ( ) ) {
			oData["Owner"] = this.byId ( "sapSplSelfRegistrationFormOwnerSelect" ).getSelectedItem ( ).getKey ( );

		}
		if ( this.byId ( "sapSplSelfRegistrationFormSubscriptionPackSelect" ).getSelectedItem ( ) ) {
			oData["SubscriptionProduct"] = this.byId ( "sapSplSelfRegistrationFormSubscriptionPackSelect" ).getSelectedItem ( ).getKey ( );

		}
		oRole = {};
		oRole["UUID"] = oSapSplUtils.getUUID ( );
		oRole["Request"] = oData.UUID;
		if ( this.byId ( "sapSplSelfRegistrationFormRoleSelect" ).getSelectedItem ( ) ) {
			oRole["Role"] = this.byId ( "sapSplSelfRegistrationFormRoleSelect" ).getSelectedItem ( ).getKey ( );

		}
		oPayload = {};
		oPayload["Header"] = [];
		oPayload["Header"].push ( oData );
		oPayload["Roles"] = [];
		oPayload["Roles"].push ( oRole );
		if ( oSapSplUtils.getDeviceID ( ) ) {
			oDVA = {};
			oDVA["VehicleUUID"] = oSapSplUtils.getUUID ( );
			oDVA["VehicleRegistrationNumber"] = this.byId ( "sapSplSelfRegistrationFormRegistrationNumberInput" ).getValue ( );
			oDVA["VehiclePublicName"] = this.byId ( "sapSplSelfRegistrationFormVehiclePublicNameInput" ).getValue ( );
			oDVA["VehicleType"] = this.byId ( "sapSplSelfRegistrationFormVehicleTypeInput" ).getSelectedKey ( );
			oDVA["VehicleStatus"] = "A";
			oDVA["DeviceUUID"] = oSapSplUtils.getUUID ( );
			oDVA["DeviceType"] = "MOBILEIF";
			oDVA["DeviceStatus"] = "A";
			oDVA["DeviceUniqueID"] = oSapSplUtils.getDeviceID ( );
			oDVA["DevicePublicName"] = oSapSplUtils.getDeviceID ( );

			oData.AdditionalParameters = {};
			oData.AdditionalParameters["DeviceVehicleAssignment"] = [];
			oData.AdditionalParameters["DeviceVehicleAssignment"].push ( oDVA );
		}

		this.BusyDialog.open ( );

		$.ajax ( {
			url : oSapSplUtils.getFQServiceUrl ( "sap/spl/xs/selfRegistration/register.xsjs" ),
			type : "POST",
			data : JSON.stringify ( oPayload ),
			beforeSend : function ( xhr ) {
				xhr.setRequestHeader ( "Content-Type", "application/json;charset=UTF-8" );
			},
			success : function ( response, success, messageObject ) {
				that.BusyDialog.close ( );
				if ( response.constructor === String ) {
					response = JSON.parse ( response );

				}
				if ( messageObject.status === 202 ) {
					var errorMessage = oSapSplUtils.getErrorMessagesfromErrorPayload ( response );
					oSapSplUtils.showMessage ( {
						message : errorMessage.Status + " " + errorMessage.statusText,
						details : errorMessage
					} );
					var event = new CustomEvent ( "SCL_Registration", {} );
					document.dispatchEvent ( event );
				} else if ( messageObject.status === 200 ) {
					sap.ca.ui.message.showMessageToast ( oSapSplUtils.getBundle ( ).getText ( "REQUEST_SENT" ) );
					that.fnHandleCancel ( );
					if ( oSapSplUtils.getDeviceID ( ) ) {
						/*HOTFIX C_DOM_O_D cx*/
						location.replace(location.href.split("?")[0]);
					}

				}
			},
			error : function ( response ) {
				var sDetails = null, errorResponse = response.responseJSON;
				that.BusyDialog.close ( );
				/*CSNFIX 759065 2014*/
				if ( response.status >= 500 ) {
					sDetails = response.responseText;
				} else {

					if ( response.responseText && response.responseText.constructor === String ) {
						response.responseText = JSON.parse ( response.responseText );
					}

				}
				/*CSNFIX 753214 2014. Empty box will now contain details with Generic message label*/

				if ( errorResponse.hasOwnProperty ( "Error" ) ) {
					sap.ca.ui.message.showMessageBox ( {
						type : oSapSplUtils.getErrorMessagesfromErrorPayload ( response.responseText )["messageTitle"],
						message : oSapSplUtils.getErrorMessagesfromErrorPayload ( response.responseText )["errorWarningString"],
						details : oSapSplUtils.getErrorMessagesfromErrorPayload ( response.responseText )["ufErrorObject"]
					} );
				} else {
					sap.ca.ui.message.showMessageBox ( {
						type : sap.ca.ui.message.Type.ERROR,
						message : oSapSplUtils.getBundle ( ).getText ( "GENERIC_ERROR_MESSAGE" ),
						details : sDetails.toString ( )
					} );
				}
			}
		} );

	},
	/**
	 * @description Method to handle the click of cancel button.
	 * @param null.
	 * @param null
	 * @returns void.
	 * @since 1.0
	 */
	fnHandleCancel : function ( oEvent ) {

		$.sap.log.info ( "SAP SCL Welcome Page", "Event triggered: " + oEvent, "SAPSCL" );

		var oData = this.fnReturnEmptyPayload ( );

		var ojsonModel = this.byId ( "baseForm" ).getModel ( ); /*CSNFIX 1435216 2014*/

		ojsonModel.setData ( oData );
		var RoleData = this.byId ( "sapSplSelfRegistrationFormOwnerSelect" ).getModel ( ).getData ( ).results[0];
		this.byId ( "sapSplSelfRegistrationFormOwnerSelect" ).setSelectedKey ( null );
		this.byId ( "sapSplSelfRegistrationFormRoleSelect" ).getModel ( ).setData ( RoleData["RolesOfPotentialOwnedAccount"] );
		this.byId ( "sapSplSelfRegistrationFormSubscriptionPackSelect" ).getModel ( ).setData ( RoleData["ProductList"] );
		this.byId ( "sapSplSelfRegistrationFormRoleSelect" ).setEnabled ( false );
		this.byId ( "sapSplSelfRegistrationFormSubscriptionPackSelect" ).setEnabled ( false );
		this.byId ( "sapSplSelfRegistrationFormVehiclePublicNameInput" ).setValue ( "" );
		this.byId ( "sapSplSelfRegistrationFormRegistrationNumberInput" ).setValue ( "" );
		this.byId ( "sapSplSelfRegistrationFormDeviceIDInput" ).setValue ( "" );
		this.byId ( "sapSplSelfRegistrationFormVehicleTypeInput" ).setSelectedKey ( null );

		this.byId ( "baseForm" ).setModel ( ojsonModel );

	},

	/**
	 * @description Method to handle emptyPayload for Registration Service.
	 * @param null.
	 * @param null
	 * @returns {object} EmptyPayload.
	 * @since 1.0
	 */

	fnReturnEmptyPayload : function ( ) {
		return {
			"UUID" : null,
			"BasicInfo.ID" : null,
			"BasicInfo.CompanyID" : null,
			"BasicInfo.Type" : "O",
			"Organization.Name" : null,
			"Organization.RegistrationNumber" : null,
			"Organization.Registry" : null,
			"PersonName.Title" : null,
			"PersonName.Surname" : null,
			"PersonName.GivenName" : null,
			"PersonName.JobFunction" : null,
			"PersonName.SurnamePrefix" : null,
			"PostalAddress.Country" : null,
			"PostalAddress.District" : null,
			"PostalAddress.PostalCode" : null,
			"PostalAddress.Street" : null,
			"PostalAddress.StreetName" : null,
			"PostalAddress.Town" : null,
			"CommunicationInfo.EmailAddress" : null,
			"CommunicationInfo.Fax" : null,
			"CommunicationInfo.Phone" : null,
			"CommunicationInfo.Website" : null,
			"Owner" : null,
			"InvitedByOrganization" : null,
			"RequestType" : "0",
			"RequestStatus" : "0"
		};

	},
	/**
	 * @description Method to check the referrer and toggle the visiblity of message label.
	 * @param null.
	 * @param null
	 * @returns null.
	 * @since 1.0
	 * @private
	 */
	checkReferrer : function ( ) {

		if ( document.referrer && document.referrer.indexOf ( "/sap/spl/ui/index.html" ) > -1 ) {
			this.getView ( ).byId ( "sapSplLogoutMessageLabel" ).setVisible ( true );
		}

	},
	/**
	 * @description Method to set the local busy state of drop down list.
	 * @param bBusy
	 * @param null
	 * @returns null.
	 * @since 1.0
	 * @private
	 */
	setBusyOnSelect : function ( bBusy ) {
		this.byId ( "sapSplSelfRegistrationFormRoleSelect" ).setBusy ( bBusy );
		this.byId ( "sapSplSelfRegistrationFormOwnerSelect" ).setBusy ( bBusy );
		this.byId ( "sapSplSelfRegistrationFormSubscriptionPackSelect" ).setBusy ( bBusy );
	},
	fnErrorCallback : function ( response ) {
		var sDetails;
		response = response.response;

		this.setBusyOnSelect ( false );
		if ( response.status === 500 ) {
			sDetails = response.body;
		} else {
			if ( response.body && response.body.constructor === String ) {
				response.body = JSON.parse ( response.body );
			}

			sDetails = oSapSplUtils.getErrorMessagesfromErrorPayload ( response.body )["ufErrorObject"];
		}
		if ( response && response.body && response.body.error && response.body.error.message ) {
			sDetails = response.body.error.message.value;
		}

		oSapSplUtils.showMessage ( {
			message : response.statusCode + " : " + sDetails
		} );
	},
	handleLiveChange : function ( oEvent ) {
		oEvent.getSource ( ).setValueState ( );
	},
	fnHandleDeviceIDParameter : function ( ) {
		if ( oSapSplUtils.getDeviceID ( ) ) {
			this.byId ( "sapSplSelfRegistrationFormDeviceIDInput" ).setVisible ( true );
			this.byId ( "sapSPlSelfregistrationFormDeviceIDLabel" ).setVisible ( true );
			this.byId ( "sapSPlSelfregistrationFormRegistrationNumberLabel" ).setVisible ( true );
			this.byId ( "sapSPlSelfregistrationFormVehiclePublicNameLabel" ).setVisible ( true );
			this.byId ( "sapSplSelfRegistrationFormVehicleTypeInput" ).setVisible ( true );
			this.byId ( "sapSplSelfRegistrationFormRegistrationNumberInput" ).setVisible ( true );
			this.byId ( "sapSplSelfRegistrationFormVehiclePublicNameInput" ).setVisible ( true );
			this.byId ( "sapSPlSelfregistrationFormVehicleTypeLabel" ).setVisible ( true );
			this.byId ( "sapSplSelfRegistrationFormDeviceIDInput" ).setValue ( oSapSplUtils.getDeviceID ( ) );
			this.byId ( "sapSplSelfRegistrationFormRegistrationNumberInput" ).setValue ( oSapSplUtils.getRegistrationNumber ( ) );
		}
	},

	fnSuccessCallbackOfEnums : function ( oData ) {
		var tempObj = {};
		tempObj["Value"] = null;
		tempObj["Value.description"] = oSapSplUtils.getBundle ( ).getText ( "SELECT_OPTION" );

		if ( oData.hasOwnProperty ( "results" ) && oData.results instanceof Array ) {
			oData.results = [tempObj].concat ( oData.results );
		}

		var oModel = new sap.ui.model.json.JSONModel ( oData );

		this.byId ( "sapSplSelfRegistrationFormVehicleTypeInput" ).setModel ( oModel );
	}

} );
