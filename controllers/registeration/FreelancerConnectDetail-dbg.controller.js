/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.controller ( "splController.registeration.FreelancerConnectDetail", {

	splitAppBaseInstance : null,
	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 */
	onInit : function ( ) {
		/*unified shell instance - which is the super parent of this view*/
		this.unifiedShell = null;
		/*Includes the Stylesheet for Freelancer*/
		splReusable.libs.SapSplStyleSheetLoader.loadStyle ( "./resources/styles/splFreelancer" );

		var oFreelancerDetailViewModel = new sap.ui.model.json.JSONModel ( {} );

		this.bDirtySearchState = null; //IM 1472018092

		sap.ui.getCore ( ).setModel ( oFreelancerDetailViewModel, "sapSplFreelancerConnectDetailModel" );

		this.getView ( ).setModel ( sap.ui.getCore ( ).getModel ( "sapSplFreelancerConnectDetailModel" ) );

		/*Localization*/
		this.fnDefineControlLabelsFromLocalizationBundle ( );

		this.byId ( "SapSplFreelancerTable" ).addStyleClass ( "freelancerTable" );

		/*config Odata Model */
		//this.createConfigOdataModel();
	},

	/**
	 * @description Set the split app instance on the Freelancer. This is needed by this controller
	 * to check if the NewRegistertationDetail page exists in SplitAppBase page aggregation and
	 * if not, the instantiate, else load the existing page.
	 * @private
	 * @param oInstance
	 * @since 1.0
	 */
	setSplitAppInstance : function ( oInstance ) {
		this.splitAppBaseInstance = oInstance;
	},

	/**
	 * @description Method to handle localization of all the hard code texts in the view.
	 * @param void.
	 * @returns void.
	 * @since 1.0
	 */
	fnDefineControlLabelsFromLocalizationBundle : function ( ) {
		this.byId ( "FreelancerConnectDetailPage" ).setTitle ( oSapSplUtils.getBundle ( ).getText ( "NEW_BUSINESS_PARTNER_TITLE" ) );
		//this.byId("sapSplFreelancerEmail").setText(oSapSplUtils.getBundle().getText("EMAIL"));
		this.byId ( "sapSplBusinessPartnerSearchField" ).setProperty ( "placeholder", oSapSplUtils.getBundle ( ).getText ( "GLOBAL_SEARCH", ["..."] ) );

		this.byId ( "sapSplBusinessPartnerConnect" ).setText ( oSapSplUtils.getBundle ( ).getText ( "MY_COLLEAGUES_CONNECT_BUTTON" ) );
		this.byId ( "sapSplBusinessPartnerConnect" ).setTooltip ( oSapSplUtils.getBundle ( ).getText ( "MY_COLLEAGUES_CONNECT_BUTTON" ) );

		this.byId ( "freelancerCancel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "MY_COLLEAGUES_CANCEL_BUTTON" ) );
		this.byId ( "freelancerCancel" ).setTooltip ( oSapSplUtils.getBundle ( ).getText ( "MY_COLLEAGUES_CANCEL_BUTTON" ) );
		//this.byId("sapSplFreelancerSearchButton").setText(oSapSplUtils.getBundle().getText("SEARCH"));

		this.byId ( "SapSplFreelancerTableColumnHeader_CompanyName" ).setText ( oSapSplUtils.getBundle ( ).getText ( "COMPANY_NAME" ) );
		this.byId ( "SapSplFreelancerTableColumnHeader_Email" ).setText ( oSapSplUtils.getBundle ( ).getText ( "EMAIL" ) );
		//this.byId("freelancerInvite").setText(oSapSplUtils.getBundle().getText("NEW_CONTACT_INVITE"));
		this.byId ( "SapSplFreelancerInviteLink" ).setText ( oSapSplUtils.getBundle ( ).getText ( "INVITE_TEXT" ) );

		this.byId ( "sapSplNewBuPaLabel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "ADD_NEW_BUSINESS_PARTNER_INFO" ) );
		this.byId ( "sapSplNewBuPaLink" ).setText ( oSapSplUtils.getBundle ( ).getText ( "INVITE_TEXT" ) );

		this.byId ( "sapSplBusinessPartnerSearchFieldTitle" ).setText ( oSapSplUtils.getBundle ( ).getText ( "NEW_BUSINESS_PARTNER_SEARCH_FIELD_TITLE" ) );
		this.byId ( "sapSplBusinessPartnerSearchField" ).setTooltip ( oSapSplUtils.getBundle ( ).getText ( "SEARCH" ) );

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
	 * @description calls when cancel button is pressed & navigates back to detail page
	 * @params void
	 * @returns void
	 * @since 1.0
	 * */
	fireCancel : function ( ) {
		var sdetailObject, oModelData, bus;
		sdetailObject = jQuery.extend ( true, {}, sap.ui.getCore ( ).getModel ( "myBusinessPartnerDetailModel" ).getData ( ) );
		oModelData = sap.ui.getCore ( ).getModel ( "sapSplFreelancerConnectDetailModel" ).getData ( );
		oModelData["isCancel"] = true;
		sap.ui.getCore ( ).getModel ( "sapSplFreelancerConnectDetailModel" ).setData ( oModelData );
		bus = sap.ui.getCore ( ).getEventBus ( );
		bus.publish ( "navInDetailBP", "to", {
			from : this.getView ( ),
			data : {
				context : sdetailObject
			}
		} );
	},

	/**
	 * @description calls when search button is pressed & Displays freelancer if found
	 * @params {Object} event
	 * @returns void
	 * @since 1.0
	 * */
	fnHandleClickOfSearch : function ( ) {

		var that = this, modelData = {}, payload = {};

		this.bDirtySearchState = 1;

		var searchtext = this.byId ( "sapSplBusinessPartnerSearchField" ).getValue ( );

		this.byId ( "sapSplBusinessPartnerConnect" ).setEnabled ( false );

		this.byId ( "SapSplFreelancerTable" ).removeSelections ( );

		if ( searchtext.length > 2 ) {
			oSapSplBusyDialog.getBusyDialogInstance ( {
				title : oSapSplUtils.getBundle ( ).getText ( "BUSY_DIALOG_MESSAGE" )
			} ).open ( );

			modelData = sap.ui.getCore ( ).getModel ( "sapSplFreelancerConnectDetailModel" ).getData ( );
			modelData["BusinessPartners"] = [];
			sap.ui.getCore ( ).getModel ( "sapSplFreelancerConnectDetailModel" ).setData ( modelData );

			payload = this.prepareSearchPayload ( searchtext );

			window.setTimeout ( function ( ) {
				oSapSplAjaxFactory.fireAjaxCall ( {
					url : oSapSplUtils.getFQServiceUrl ( "/sap/spl/xs/app/services/ConnectSearch.xsjs" ),
					method : "POST",
					async : false,
					dataType : "json",
					cache : false,
					data : JSON.stringify ( payload ),
					success : function ( data, success, messageObject ) {
						oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );

						if ( messageObject["status"] === 200 ) {
							that.byId ( "SapSplFreelancerTable" ).setHeaderText ( oSapSplUtils.getBundle ( ).getText ( "BUSINESS_PARTNER_CONNECT_TABEL_LABEL", data.length.toString ( ) ) );
							if ( data.length > 0 ) {
								that.byId ( "SapSplFreelancerTable" ).setVisible ( true );
								modelData = sap.ui.getCore ( ).getModel ( "sapSplFreelancerConnectDetailModel" ).getData ( );
								modelData["BusinessPartners"] = data;
								modelData["showNewBuPaLink"] = false;
								modelData["showConnectButton"] = true;
								sap.ui.getCore ( ).getModel ( "sapSplFreelancerConnectDetailModel" ).setData ( modelData );
								that.byId ( "SapSplFreelancerTable" ).removeStyleClass ( "freelancerTable" );
							} else {
								modelData = sap.ui.getCore ( ).getModel ( "sapSplFreelancerConnectDetailModel" ).getData ( );
								modelData["BusinessPartners"] = [];
								modelData["showNewBuPaLink"] = true;
								modelData["showConnectButton"] = false;
								sap.ui.getCore ( ).getModel ( "sapSplFreelancerConnectDetailModel" ).setData ( modelData );
								that.byId ( "SapSplFreelancerTable" ).setVisible ( true );
								that.byId ( "SapSplFreelancerTable" ).addStyleClass ( "freelancerTable" );
							}
						} else {
							modelData = sap.ui.getCore ( ).getModel ( "sapSplFreelancerConnectDetailModel" ).getData ( );
							modelData["BusinessPartners"] = [];
							modelData["showNewBuPaLink"] = true;
							modelData["showConnectButton"] = false;
							sap.ui.getCore ( ).getModel ( "sapSplFreelancerConnectDetailModel" ).setData ( modelData );
							that.byId ( "SapSplFreelancerTable" ).addStyleClass ( "freelancerTable" );
							that.byId ( "SapSplFreelancerTable" ).setVisible ( true );
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
						modelData = sap.ui.getCore ( ).getModel ( "sapSplFreelancerConnectDetailModel" ).getData ( );
						modelData["BusinessPartners"] = [];
						modelData["showNewBuPaLink"] = true;
						modelData["showConnectButton"] = false;
						sap.ui.getCore ( ).getModel ( "sapSplFreelancerConnectDetailModel" ).setData ( modelData );
						that.byId ( "SapSplFreelancerTable" ).addStyleClass ( "freelancerTable" );
						that.byId ( "SapSplFreelancerTable" ).setVisible ( true );
					},
					complete : function ( ) {

					}
				} );
			}, 30 );
		} else {
			modelData = sap.ui.getCore ( ).getModel ( "sapSplFreelancerConnectDetailModel" ).getData ( );
			modelData["BusinessPartners"] = [];
			modelData["showNewBuPaLink"] = false;
			modelData["showConnectButton"] = false;
			sap.ui.getCore ( ).getModel ( "sapSplFreelancerConnectDetailModel" ).setData ( modelData );
			that.byId ( "SapSplFreelancerTable" ).addStyleClass ( "freelancerTable" );
			that.byId ( "SapSplFreelancerTable" ).setVisible ( false );
		}
	},
	prepareSearchPayload : function ( searchTerm ) {
		var payload = {};

		payload["SearchTerm"] = searchTerm;
		payload["Role"] = sap.ui.getCore ( ).getModel ( "sapSplFreelancerConnectDetailModel" ).getData ( ).Role;

		return payload;
	},
	/**
	 * @description listens to event handling channel which is previously subscribed. This is the default call back when any navigation happens to this view.
	 * It is called even before the onBeforeRendering life cycle method of the view.
	 * @param {Object}evt event object of the navigation event.
	 * @returns void.
	 * @since 1.0
	 */
	onBeforeShow : function ( evt ) {
		var modelData = evt.data.context;
		modelData.isCancel = false;
		modelData["BusinessPartners"] = [];
		modelData["showNewBuPaLink"] = false;
		modelData["showConnectButton"] = false;
		sap.ui.getCore ( ).getModel ( "sapSplFreelancerConnectDetailModel" ).setData ( modelData );
		this.byId ( "sapSplBusinessPartnerSearchField" ).setValue ( "" );
		this.byId ( "SapSplFreelancerTable" ).setVisible ( false );
		this.byId ( "SapSplFreelancerConnectRequestLabel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "NO_RECORDS_AVAILABLE_MSG", modelData["Role.Description"] ) );
		this.bDirtySearchState = null;
	},

	fnHandleSelectOfBusinessPartner : function ( oEvent ) {
		if ( oEvent.getSource ( ).getSelectedItems ( ) && oEvent.getSource ( ).getSelectedItems ( ).length > 0 ) {
			this.byId ( "sapSplBusinessPartnerConnect" ).setEnabled ( true );
		} else {
			this.byId ( "sapSplBusinessPartnerConnect" ).setEnabled ( false );
		}
	},

	fnHandleClickOfConnect : function ( ) {
		var payload = {}, that = this, selectedItems = this.byId ( "SapSplFreelancerTable" ).getSelectedItems ( ), sIndex, tempArray = [];
		oSapSplBusyDialog.getBusyDialogInstance ( {
			title : oSapSplUtils.getBundle ( ).getText ( "BUSY_DIALOG_MESSAGE" )
		} ).open ( );
		window.setTimeout ( function ( ) {

			that.getRelation ( );

			for ( sIndex = 0 ; sIndex < selectedItems.length ; sIndex++ ) {
				tempArray.push ( that.preparePayload ( selectedItems[sIndex].getBindingContext ( ).getProperty ( ) ) );
			}
			payload["Relation"] = tempArray;

			oSapSplAjaxFactory.fireAjaxCall ( {
				url : oSapSplUtils.getFQServiceUrl ( "sap/spl/xs/app/services/businessPartner.xsjs" ),
				method : "POST",
				async : false,
				data : JSON.stringify ( payload ),
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

						sap.ca.ui.message.showMessageToast ( oSapSplUtils.getBundle ( ).getText ( "CONNECTION_REQUEST_SENT_SUCCESSFULLY_MSG" ) );
						sap.ui.getCore ( ).getModel ( "myBusinessPartnerListODataModel" ).refresh ( );

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
		}, 10 );
	},
	preparePayload : function ( toBusinessPartner ) {
		var payload = {};
		payload["UUID"] = oSapSplUtils.getUUID ( );
		payload["FromPartner"] = oSapSplUtils.getCompanyDetails ( ).UUID;
		payload["ToPartner"] = toBusinessPartner["UUID"];
		payload["Relation"] = this.Relation[0].Name;
		payload["Text"] = "";
		payload["Status"] = "0";
		payload["ObjectType"] = "BuPa-O";
		payload["InstanceUUID"] = null;

		return payload;
	},

	fnHandleClickOfInvite : function ( ) {
		var bus = sap.ui.getCore ( ).getEventBus ( ), newBusinessPartnerRegistrationDetail;

		var view = $.extend ( true, {}, this.getView ( ) );
		if ( !this.splitAppBaseInstance.getDetailPage ( "NewBusinessPartnerRegistrationDetail" ) ) {
			newBusinessPartnerRegistrationDetail = sap.ui.view ( {
				id : "NewBusinessPartnerRegistrationDetail",
				viewName : "splView.registeration.NewBusinessPartnerRegistrationDetail",
				type : sap.ui.core.mvc.ViewType.XML
			} );

			newBusinessPartnerRegistrationDetail.addEventDelegate ( {
				onBeforeShow : jQuery.proxy ( newBusinessPartnerRegistrationDetail.getController ( ).onBeforeShow, newBusinessPartnerRegistrationDetail.getController ( ) )
			} );

			newBusinessPartnerRegistrationDetail.getController ( ).setUnifiedShellInstance ( this.getUnifiedShellInstance ( ) );

			this.splitAppBaseInstance.addDetailPage ( newBusinessPartnerRegistrationDetail );
		}
		view.sId = "FreelancerActionSheetInvite";
		bus.publish ( "navInDetailBP", "to", {
			from : view,
			data : {
				context : this.getEmptyBusinessPartnerRegistrationData ( sap.ui.getCore ( ).getModel ( "sapSplFreelancerConnectDetailModel" ).getData ( )["Role"],
						sap.ui.getCore ( ).getModel ( "sapSplFreelancerConnectDetailModel" ).getData ( )["Role.Description"], this.byId ( "sapSplBusinessPartnerSearchField" ).getValue ( ), this.bDirtySearchState )
			}
		} );

	},
	successOfRolesOdata : function ( result ) {
		this.Relation = result.results;
	},

	errorOfRolesOdata : function ( ) {},

	getRelation : function ( ) {
		var oModel = sap.ui.getCore ( ).getModel ( "myConfigODataModel" );
		var oDataModelContext = null, oDataModelFilters = "$filter=FromRole eq '" + oSapSplUtils.getCompanyDetails ( ).Role + "' and ToRole eq '" + sap.ui.getCore ( ).getModel ( "sapSplFreelancerConnectDetailModel" ).getData ( )["Role"] +
				"' and Scope eq 'PARTNER'", bIsAsync = false;
		var sUrl = "/BusinessPartnerRoleRelation";
		if ( oModel ) {
			oModel.read ( sUrl, oDataModelContext, oDataModelFilters, bIsAsync, jQuery.proxy ( this.successOfRolesOdata, this ), jQuery.proxy ( this.errorOfRolesOdata, this ) );
		}
	},

	/**
	 * @description Method to get an empty Business Partner object.
	 * @param sRole & sRoleDescription
	 * @returns {object} empty Business Partner object
	 * @since 1.0
	 */
	getEmptyBusinessPartnerRegistrationData : function ( sRole, sRoleDescription, sEmailID, bDirtySearchState ) {
		var oEmptyObject = {};
		oEmptyObject["POC"] = {};
		oEmptyObject["UUID"] = "";
		oEmptyObject["OrgUUID"] = "";
		oEmptyObject["BasicInfo.ID"] = "";
		oEmptyObject["BasicInfo.CompanyID"] = "";
		oEmptyObject["BasicInfo.Type"] = "";
		oEmptyObject["Organization.Name"] = "";
		oEmptyObject["Organization.RegistrationNumber"] = "";
		oEmptyObject["Organization.Registry"] = "";
		oEmptyObject["PersonName.Title"] = "";
		oEmptyObject["PersonName.Surname"] = "";
		oEmptyObject["PersonName.GivenName"] = "";
		oEmptyObject["PersonName.JobFunction"] = "";
		oEmptyObject["PersonName.SurnamePrefix"] = "";
		oEmptyObject["PostalAddress_Country"] = "";
		oEmptyObject["PostalAddress_District"] = "";
		oEmptyObject["PostalAddress_PostalCode"] = "";
		oEmptyObject["PostalAddress_Street"] = "";
		oEmptyObject["PostalAddress_StreetName"] = "";
		oEmptyObject["PostalAddress_Town"] = "";
		oEmptyObject["CommunicationInfo.EmailAddress"] = "";
		oEmptyObject["CommunicationInfo.Fax"] = "";
		oEmptyObject["CommunicationInfo_Phone"] = "";
		oEmptyObject["CommunicationInfo.Website"] = "";
		oEmptyObject["Validity.StartTime"] = "";
		oEmptyObject["Validity.EndTime"] = "";
		oEmptyObject["Owner"] = "";
		oEmptyObject["InvitedByOrganization"] = "";
		oEmptyObject["OrganizationRoles.Role1"] = "";
		oEmptyObject["OrganizationRoles.Role2"] = "";
		oEmptyObject["OrganizationRoles.Role3"] = "";
		oEmptyObject["OrganizationRoles.Role4"] = "";
		oEmptyObject["MainUserRoles.Role1"] = "";
		oEmptyObject["MainUserRoles.Role2"] = "";
		oEmptyObject["MainUserRoles.Role3"] = "";
		oEmptyObject["MainUserRoles.Role4"] = "";
		oEmptyObject["RequestType"] = "";
		oEmptyObject["POC"]["PersonName_Surname"] = "";
		oEmptyObject["POC"]["PersonName_GivenName"] = "";
		//        oEmptyObject["POC"]["CommunicationInfo_EmailAddress"] = "";
		oEmptyObject["POC"]["CommunicationInfo_Phone"] = "";
		oEmptyObject["POC"]["PersonName_JobFunction"] = "";

		if ( sRole ) {
			oEmptyObject["Role"] = sRole;
		} else {
			oEmptyObject["Role"] = "";
		}

		if ( sEmailID && bDirtySearchState ) {
			oEmptyObject["POC"]["CommunicationInfo_EmailAddress"] = sEmailID;
		} else {
			oEmptyObject["POC"]["CommunicationInfo_EmailAddress"] = "";
		}

		if ( sRoleDescription ) {
			oEmptyObject["Role_description"] = sRoleDescription;
		} else {
			oEmptyObject["Role_description"] = "";
		}
		return oEmptyObject;
	}

} );
