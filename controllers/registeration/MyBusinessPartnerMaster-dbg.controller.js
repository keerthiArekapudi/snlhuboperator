/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.controller ( "splController.registeration.MyBusinessPartnerMaster", {

	splitAppBaseInstance : null,

	isNoData : false,

	/**
	 * @description Method to get an empty Business Partner object.
	 * @param sRole & sRoleDescription
	 * @returns {object} empty Business Partner object
	 * @since 1.0
	 * @example
	 * oSapSplUtils.getEmptyBusinessPartnerRegistrationData()
	 */
	getEmptyBusinessPartnerRegistrationData : function ( sRole, sRoleDescription, sMode ) {
		var oEmptyObject = {};
		oEmptyObject["POC"] = {};
		oEmptyObject["UUID"] = "";
		oEmptyObject["Editable"] = false;
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
		oEmptyObject["POC"]["CommunicationInfo_EmailAddress"] = "";
		oEmptyObject["POC"]["CommunicationInfo_Phone"] = "";
		oEmptyObject["POC"]["PersonName_JobFunction"] = "";

		if ( sMode && sMode === "create" ) {
			oEmptyObject["isClicked"] = true;
			oEmptyObject["noData"] = false;
			oEmptyObject["showFooterOptions"] = true;
		} else {
			oEmptyObject["isClicked"] = false;
			oEmptyObject["noData"] = true;
			oEmptyObject["showFooterOptions"] = false;
		}

		if ( sRole ) {
			oEmptyObject["Role"] = sRole;
		} else {
			oEmptyObject["Role"] = "";
		}
		if ( sRoleDescription ) {
			oEmptyObject["Role_description"] = sRoleDescription;
		} else {
			oEmptyObject["Role_description"] = "";
		}
		return oEmptyObject;
	},

	/***
	 * @description Press event handler of the roles button - to open a empty Invite/registration form.
	 * @since 1.0
	 * @returns void.
	 * @param evt event object of button press.
	 */
	fireSelectionOfRoleForCreate : function ( evt ) {
		var that = this;
		var eventObject = jQuery.extend ( true, {}, evt ), FreelancerConnectDetail;

		if ( !this.splitAppBaseInstance.getDetailPage ( "FreelancerConnectDetail" ) ) {

			FreelancerConnectDetail = sap.ui.view ( {
				id : "FreelancerConnectDetail",
				viewName : "splView.registeration.FreelancerConnectDetail",
				type : sap.ui.core.mvc.ViewType.XML
			} );

			FreelancerConnectDetail.getController ( ).setSplitAppInstance ( this.splitAppBaseInstance );

			FreelancerConnectDetail.addEventDelegate ( {
				onBeforeShow : jQuery.proxy ( FreelancerConnectDetail.getController ( ).onBeforeShow, FreelancerConnectDetail.getController ( ) )
			} );

			FreelancerConnectDetail.getController ( ).setUnifiedShellInstance ( this.getUnifiedShellInstance ( ) );

			this.splitAppBaseInstance.addDetailPage ( FreelancerConnectDetail );
		}

		if ( oSapSplUtils.getCurrentDetailPageBP ( ).sId === "NewBusinessPartnerRegistrationDetail" ) {
			if ( oSapSplUtils.getIsDirty ( ) ) {
				sap.m.MessageBox.show ( oSapSplUtils.getBundle ( ).getText ( "DATA_LOSS_WARNING_TEXT" ), sap.m.MessageBox.Icon.WARNING, oSapSplUtils.getBundle ( ).getText ( "WARNING" ), [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
						function ( selection ) {
							if ( selection === "YES" ) {
								that.navigateToInviteNewBusinesspartner ( eventObject );
								oSapSplUtils.setIsDirty ( false );
							}
						}, null, oSapSplUtils.fnSyncStyleClass ( "messageBox" ) );
			} else {
				this.navigateToInviteNewBusinesspartner ( evt );
			}
			/* fix for incident 1580139424 */
		} else if ( sap.ui.getCore ( ).getModel ( "myBusinessPartnerDetailModel" ).getData ( ).Editable === true && oSapSplUtils.getCurrentDetailPageBP ( ).sId === "MyBusinessPartnerDetail" ) {
			/* fix for incident 1580139424 */
			var selectedBupaDetailsData = sap.ui.getCore ( ).getModel ( "myBusinessPartnerDetailModel" ).getData ( ), oCurrentBupa = null, oMasterList = null;
			if ( oSapSplUtils.getIsDirty ( ) ) {
				sap.m.MessageBox.show ( oSapSplUtils.getBundle ( ).getText ( "DATA_LOSS_WARNING_TEXT" ), sap.m.MessageBox.Icon.WARNING, oSapSplUtils.getBundle ( ).getText ( "WARNING" ), [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
						function ( selection ) {
							if ( selection === "YES" ) {
								oSapSplUtils.setIsDirty ( false );
								oSapSplUtils.getCurrentDetailPageBP ( ).getController ( ).byId ( "MyBuPaDetailsEditButton" ).setText ( oSapSplUtils.getBundle ( ).getText ( "EDIT_BUPA" ) );
								oSapSplUtils.getCurrentDetailPageBP ( ).getController ( ).byId ( "MyBupaEditCancel" ).setVisible ( false );
								selectedBupaDetailsData["Editable"] = false;
								selectedBupaDetailsData["ExternalInstanceID"] = selectedBupaDetailsData["ExternalInstanceIDInitial"];
								sap.ui.getCore ( ).getModel ( "myBusinessPartnerDetailModel" ).setData ( selectedBupaDetailsData );
								that.navigateToInviteNewBusinesspartner ( eventObject );
							}
						} );
			} else {
				this.navigateToInviteNewBusinesspartner ( evt );
			}
		} else {
			this.navigateToInviteNewBusinesspartner ( evt );
		}
	},

	/***
	 * @description navigates to new Business Partner registration Invite page .
	 * @since 1.0
	 * @returns void.
	 * @param evt event object .
	 */
	navigateToInviteNewBusinesspartner : function ( evt ) {

		var pageId = this.oActionSheet.sId;
		var bus = sap.ui.getCore ( ).getEventBus ( ), modelData;
		oSapSplUtils.getCurrentMasterPageBP ( ).byId ( "myBusinessPartnerList" ).removeSelections ( );
		if ( oSapSplUtils.getCurrentDetailPageBP ( ).getController ( ).byId ( "sapSplBusinessPartnerSearchField" ) ) {
			oSapSplUtils.getCurrentDetailPageBP ( ).getController ( ).byId ( "sapSplBusinessPartnerSearchField" ).setValue ( "" );
			oSapSplUtils.getCurrentDetailPageBP ( ).getController ( ).byId ( "sapSplBusinessPartnerSearchField" ).focus ( );
		}

		if ( oSapSplUtils.getCurrentDetailPageBP ( ).sId === "FreelancerConnectDetail" ) {
			modelData = {
				"Role" : evt.getSource ( ).getBindingContext ( ).getProperty ( ).GrantableRole,
				"Role.Description" : evt.getSource ( ).getBindingContext ( ).getProperty ( )["GrantableRole.description"],
				"isCancel" : false,
				"BusinessPartners" : [],
				"showNewBuPaLink" : false,
				"showConnectButton" : false
			};

			sap.ui.getCore ( ).getModel ( "sapSplFreelancerConnectDetailModel" ).setData ( modelData );

			oSapSplUtils.getCurrentDetailPageBP ( ).byId ( "SapSplFreelancerTable" ).setVisible ( false );

			oSapSplUtils.getCurrentDetailPageBP ( ).byId ( "SapSplFreelancerTable" ).addStyleClass ( "freelancerTable" );

			oSapSplUtils.getCurrentDetailPageBP ( ).byId ( "SapSplFreelancerConnectRequestLabel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "NO_RECORDS_AVAILABLE_MSG", modelData["Role.Description"] ) );
		} else {
			var newObject = {};

			if ( !oSapSplUtils.getCompanyDetails ( ).canChangeSearch ) {

				if ( !this.splitAppBaseInstance.getDetailPage ( "NewBusinessPartnerRegistrationDetail" ) ) {
					var newBusinessPartnerRegistrationDetail = sap.ui.view ( {
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
				newObject = this.getEmptyBusinessPartnerRegistrationData ( evt.getSource ( ).getBindingContext ( ).getProperty ( ).GrantableRole, evt.getSource ( ).getBindingContext ( ).getProperty ( )["GrantableRole.description"], "create" );

			} else {
				this.oActionSheet.sId = "FreelancerActionSheet";

				newObject = {
					"Role" : evt.getSource ( ).getBindingContext ( ).getProperty ( ).GrantableRole,
					"Role.Description" : evt.getSource ( ).getBindingContext ( ).getProperty ( )["GrantableRole.description"]
				};
			}

			bus.publish ( "navInDetailBP", "to", {
				from : this.oActionSheet,
				data : {
					/* The object bound to the selected listItem. */
					context : newObject
				}
			} );
			this.oActionSheet.sId = pageId;
		}

	},

	/***
	 * @description opens the ActionSheet on click of Add button on UI.
	 * @returns void.
	 * @param evt Action Sheet event Object.
	 */
	openActionSheet : function ( evt ) {
		this.oActionSheet.openBy ( evt.getSource ( ) );
	},

	/***
	 * @description Creates an Action Sheet & Aggregates roles as button.
	 * @returns void.
	 * @param void.
	 */
	createActionSheet : function ( ) {
		if ( !this.oActionSheet ) {
			this.oActionSheet = new sap.m.ActionSheet ( {
				id : "MyBusinessPartnerActionSheet",
				title : "Choose Your Action",
				showCancelButton : true,
				placement : sap.m.PlacementType.Top
			} );

			var roleButton = new sap.m.Button ( {
				text : "{GrantableRole.description}",
				press : jQuery.proxy ( this.fireSelectionOfRoleForCreate, this )
			} );
			this.oActionSheet.bindAggregation ( "buttons", "/results", roleButton );
			this.oActionSheet.setModel ( new sap.ui.model.json.JSONModel ( this.aRolesForTargetRelation ) );
		}

	},

	/***
	 * @description Success handler of the fetch of Target roles of user.
	 * @returns void.
	 * @param result result set containing the list of roles.
	 */
	successOfRolesOdata : function ( result ) {
		if ( result.results.length > 0 ) {
			this.aRolesForTargetRelation = result;
			this.createActionSheet ( );
		} else {
			this.byId ( "sapSplAddBusinessPartnerButton" ).setVisible ( false );
		}
	},

	/***
	 * @description Error handler of the fetch of Target roles of user.
	 * @returns void.
	 * @param result result set containing the list of roles.
	 */
	errorOfRolesOdata : function ( ) {

	},

	/***
	 * @description Method to fetch the list of roles which the logged in user can assign.
	 * @param ID UUID of the logged in company.
	 * @returns void.
	 */
	getRolesForRelation : function ( ) {
		var oModel = sap.ui.getCore ( ).getModel ( "myBusinessPartnerListODataModel" );
		var oDataModelContext = null, oDataModelFilters = [], // ["$filter=TargetRolePartnerType
		// eq 'O'"],
		bIsAsync = true;
		var sUrl = "/GrantableRoles";
		if ( oModel ) {
			oModel.read ( sUrl, oDataModelContext, oDataModelFilters, bIsAsync, jQuery.proxy ( this.successOfRolesOdata, this ), jQuery.proxy ( this.errorOfRolesOdata, this ) );
		}
	},

	/**
	 * @description select event handler of the "BusinessPartner" list. Results in navigation of the detail page - to BuPa detail page.
	 * @param evt event object of the select event.
	 * @returns void.
	 * @since 1.0
	 */
	handleMyContactSelect : function ( oSelectedListItemData ) {
		var that = this, masterList;
		if ( oSapSplUtils.getCurrentDetailPageBP ( ).sId === "NewBusinessPartnerRegistrationDetail" ) {
			if ( oSapSplUtils.getIsDirty ( ) ) {
				sap.m.MessageBox.show ( oSapSplUtils.getBundle ( ).getText ( "DATA_LOSS_WARNING_TEXT" ), sap.m.MessageBox.Icon.WARNING, oSapSplUtils.getBundle ( ).getText ( "WARNING" ), [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
						function ( selection ) {

							if ( selection === "YES" ) {

								that.updateBusinessPartnerDetailPage ( oSelectedListItemData );
								oSapSplUtils.setIsDirty ( false );

							} else {

								masterList = oSapSplUtils.getCurrentMasterPageBP ( ).byId ( "myBusinessPartnerList" );
								masterList.removeSelections ( );
							}
						}, null, oSapSplUtils.fnSyncStyleClass ( "messageBox" ) );
			} else {
				that.updateBusinessPartnerDetailPage ( oSelectedListItemData );
			}
			/* fix for incident 1580139424 */
		} else if ( sap.ui.getCore ( ).getModel ( "myBusinessPartnerDetailModel" ).getData ( ).Editable === true && oSapSplUtils.getCurrentDetailPageBP ( ).sId === "MyBusinessPartnerDetail" ) {
			/* fix for incident 1580139424 */
			var selectedBupaDetailsData = sap.ui.getCore ( ).getModel ( "myBusinessPartnerDetailModel" ).getData ( ), oCurrentBupa = null, oMasterList = null;
			if ( oSapSplUtils.getIsDirty ( ) ) {
				sap.m.MessageBox.show ( oSapSplUtils.getBundle ( ).getText ( "DATA_LOSS_WARNING_TEXT" ), sap.m.MessageBox.Icon.WARNING, oSapSplUtils.getBundle ( ).getText ( "WARNING" ), [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
						function ( selection ) {
							if ( selection === "YES" ) {
								oSapSplUtils.setIsDirty ( false );
								oSapSplUtils.getCurrentDetailPageBP ( ).getController ( ).byId ( "MyBuPaDetailsEditButton" ).setText ( oSapSplUtils.getBundle ( ).getText ( "EDIT_BUPA" ) );
								oSapSplUtils.getCurrentDetailPageBP ( ).getController ( ).byId ( "MyBupaEditCancel" ).setVisible ( false );
								selectedBupaDetailsData["Editable"] = false;
								selectedBupaDetailsData["ExternalInstanceID"] = selectedBupaDetailsData["ExternalInstanceIDInitial"];
								sap.ui.getCore ( ).getModel ( "myBusinessPartnerDetailModel" ).setData ( selectedBupaDetailsData );
								that.updateBusinessPartnerDetailPage ( oSelectedListItemData );
							} else {
								oCurrentBupa = sap.ui.getCore ( ).getModel ( "myBusinessPartnerDetailModel" ).getData ( );
								oMasterList = that.byId ( "myBusinessPartnerList" );
								if ( oCurrentBupa.UUID ) {
									for ( var sIndex = 0 ; sIndex < oMasterList.getItems ( ).length ; sIndex++ ) {
										if ( oMasterList.getItems ( )[sIndex].constructor === sap.m.StandardListItem ) {
											if ( oMasterList.getItems ( )[sIndex].getBindingContext ( ).getProperty ( ).UUID === oCurrentBupa.UUID ) {
												oMasterList.setSelectedItem ( oMasterList.getItems ( )[sIndex] );
												break;
											}
										}
									}
								} else {
									oMasterList.removeSelections ( );
								}
							}
						} );
			} else {
				selectedBupaDetailsData["Editable"] = false;
				sap.ui.getCore ( ).getModel ( "myBusinessPartnerDetailModel" ).setData ( selectedBupaDetailsData );
				oSapSplUtils.getCurrentDetailPageBP ( ).getController ( ).byId ( "MyBupaEditCancel" ).setVisible ( false );
				oSapSplUtils.getCurrentDetailPageBP ( ).getController ( ).byId ( "MyBuPaDetailsEditButton" ).setText ( oSapSplUtils.getBundle ( ).getText ( "EDIT_BUPA" ) );
			}
		} else {
			this.updateBusinessPartnerDetailPage ( oSelectedListItemData );
		}

	},

	/***
	 * @description Navigation of the BuPa detail page based on the current detail page. .
	 * @since 1.0
	 * @returns void.
	 * @param evt event object .
	 */
	updateBusinessPartnerDetailPage : function ( oSelectedListItemData ) {

		var sSelectedBuPaURL = "", sharedData;
		/*
		 * If the current Detail page of the SplitAppBase control, is the
		 * contact details page, then just change the
		 * myBusinessPartnerDetailModel's data, else navigate to the contact
		 * details page and change the model data in onBeforeShow of the
		 * respective view's controller.
		 */
		sSelectedBuPaURL = oSapSplUtils.getFQServiceUrl ( "/sap/spl/xs/app/services/appl.xsodata/" ) + "MyBusinessPartners(X'" + oSapSplUtils.base64ToHex ( oSelectedListItemData.UUID ) + "')/PointOfContact?$format=json";
		oSelectedListItemData["SelectedKey"] = "info";
		oSelectedListItemData["POC"] = this.getPointOfContactInfo ( sSelectedBuPaURL );
		oSelectedListItemData["Trucks"] = {};
		/*
		 * To control the edit functionality on bupa details page in order to
		 * maintain External ID
		 */
		oSelectedListItemData["Editable"] = false;
		if ( oSelectedListItemData["ExternalInstanceID"] === null ) {
			oSelectedListItemData["ExternalInstanceID"] = "";
		}
		oSelectedListItemData["ExternalInstanceIDInitial"] = oSelectedListItemData["ExternalInstanceID"];

		if ( oSelectedListItemData.isVehicleSharable !== "0" && oSelectedListItemData.RequestStatus !== "0" ) {

			/* Incident : 1580088406 */
			sharedData = this.getSharedPermissionData ( oSelectedListItemData.UUID );

			oSelectedListItemData["Trucks"]["SharePermissions"] = $.extend ( true, [], sharedData );

			oSelectedListItemData.truckPermissions = $.extend ( true, [], sharedData );
		}

		oSelectedListItemData["noData"] = false;
		oSelectedListItemData["isClicked"] = true;
		oSelectedListItemData["showFooterOptions"] = true;

		if ( oSapSplUtils.getCurrentDetailPageBP ( ).sId === "MyBusinessPartnerDetail" ) {

			/* The object bound to the selected listItem. */
			sap.ui.getCore ( ).getModel ( "myBusinessPartnerDetailModel" ).setData ( oSelectedListItemData );
			/* Fix for Incident : 1570077516 */
			sap.ui.getCore ( ).byId ( "MyBusinessPartnerDetail--SapSplBupaIconTabBar" ).rerender ( );

		} else {

			/*
			 * instance of the SAPUI5 event bus - used to subscribe or publish
			 * events across the application
			 */
			var bus = sap.ui.getCore ( ).getEventBus ( );
			bus.publish ( "navInDetailBP", "to", {
				from : this.getView ( ),
				data : {
					/* The object bound to the selected listItem. */
					context : oSelectedListItemData
				}
			} );
		}
		sap.ui.getCore ( ).byId ( "MyBusinessPartnerDetail--MyBuPaDetailsEditButton" ).setText ( oSapSplUtils.getBundle ( ).getText ( "EDIT_BUPA" ) );
		sap.ui.getCore ( ).byId ( "MyBusinessPartnerDetail--MyBupaEditCancel" ).setVisible ( false );
	},

	getSharedPermissionData : function ( UUID ) {
		var oModel = sap.ui.getCore ( ).getModel ( "myBusinessPartnerListODataModel" );
		var aSharePermissionsData = [];
		var oDataModelContext = null, oDataModelFilters = [], bIsAsync = false;
		var sUrl = "/MyBusinessPartners(X'" + encodeURIComponent ( oSapSplUtils.base64ToHex ( UUID ) ) + "')/SharedTrucks";
		if ( oModel ) {
			oModel.read ( sUrl, oDataModelContext, oDataModelFilters, bIsAsync, function ( oResults ) {

				aSharePermissionsData = oResults.results;
			}, function ( ) {} );
		}
		if ( aSharePermissionsData ) {
			return aSharePermissionsData;
		}
	},

	/**
	 * @description Method to fetch the point of contact info of the selected company
	 * Implementing the same after the model OData changed inorder to expose person details as an aggregation of Org details.
	 * @param {String} sURL pre constructed URL to fetch the Point of contact.
	 * @returns {oObject} oPOCObject Object containing all the required details of the Point of contact.
	 * @since 1.0
	 */
	getPointOfContactInfo : function ( sURL ) {
		var aReturnObject = {};
		if ( sURL && sURL.constructor === String ) {
			oSapSplAjaxFactory.fireAjaxCall ( {
				url : sURL,
				method : "GET",
				// type:"GET",
				async : false,
				success : function ( data ) {
					if ( data.d.results.constructor === Array && data.d.results.length > 0 ) {
						aReturnObject = data.d.results[0];
					}
				},
				error : function ( ) {}
			} );
			return aReturnObject;
		}
	},

	/**
	 * @description Handler for the select event on the list of my colleagues.
	 * @param {object} evt select event object.
	 * @returns void.
	 * @since 1.0
	 */
	onSelectOfContact : function ( evt ) {
		this.handleMyContactSelect ( evt.getParameter ( "listItem" ).getBindingContext ( ).getProperty ( ) );
	},

	/**
	 * @description selects first item of the list on display of master pane.
	 * @param void
	 * @returns void.
	 * @since 1.0
	 */
	selectFirstItem : function ( iCount ) {
		var oSelectedListItemData, contactsList, selectedId;
		contactsList = this.getView ( ).byId ( "myBusinessPartnerList" );

		if ( contactsList.getItems ( )[iCount].constructor === sap.m.StandardListItem ) {
			this.getView ( ).byId ( "myBusinessPartnerList" ).setSelectedItem ( contactsList.getItems ( )[iCount] );
			oSelectedListItemData = contactsList.getItems ( )[iCount].getBindingContext ( ).getProperty ( );

			if ( iCount === 0 || iCount === 1 ) {
				document.getElementById ( this.getView ( ).byId ( "sapSplSearchBusinessPartnerMasterList" ).getId ( ) ).scrollIntoView ( true );
			} else {
				selectedId = contactsList.getItems ( )[iCount].getId ( );
				/*
				 * HOTFIX An issue where the getElementById on the selected ID
				 * is unable to get the DOM element immediately. So asyncing it
				 * so that the DOM is prepared and then scroll into it
				 */
				window.setTimeout ( function ( ) {
					document.getElementById ( selectedId ).scrollIntoView ( true );
				}, 0 );
			}

		} else {
			contactsList.getItems ( )[iCount + 1].setSelected ( true );
			oSelectedListItemData = contactsList.getItems ( )[iCount + 1].getBindingContext ( ).getProperty ( );
		}

		this.updateBusinessPartnerDetailPage ( oSelectedListItemData );
	},

	/***
	 * @description handler for the onAfterRendering Event of the MyBusinessPartnerList.
	 * Method used to trigger selection of the first item of the list.
	 * @param e event object
	 * @since 1.0
	 * @returns void.
	 */
	afterRenderingOfMyBusinesspartnerList : function ( ) {
		oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
		var oSapSplItemOneContext = null, iSapSplMyContactsListLength = 0, aSapSplMyContactsListItems = [], oSapSplMyContactsList = null, oListCustomData = (this.byId ( "myBusinessPartnerList" ).getCustomData ( ).length > 0) ? this.byId (
				"myBusinessPartnerList" ).getCustomData ( )[this.byId ( "myBusinessPartnerList" ).getCustomData ( ).length - 1].getKey ( ) : null, _iCount = 1;

		// this.byId("MyBusinessPartnerMasterPage")
		// .setTitle(oSapSplUtils.getBundle().getText("MY_BUSINESS_PARTNER_MASTER_TITLE",[$.grep(this.byId("myBusinessPartnerList").getItems(),
		// function(n, i){
		// return (n.constructor !== sap.m.GroupHeaderListItem);
		// }).length])).setTooltip(oSapSplUtils.getBundle().getText("MY_BUSINESS_PARTNER_MASTER_TITLE"));

		// FIX FOR CSN : 512875.

		this.byId ( "MyBusinessPartnerMasterPage" ).setTitle ( oSapSplUtils.getBundle ( ).getText ( "MY_BUSINESS_PARTNER_MASTER_TITLE", [splReusable.libs.Utils.prototype.getListCount ( this.byId ( "myBusinessPartnerList" ) )] ) );

		try {
			oSapSplMyContactsList = this.getView ( ).byId ( "myBusinessPartnerList" );
			if ( oSapSplMyContactsList ) {
				aSapSplMyContactsListItems = oSapSplMyContactsList.getItems ( );
				iSapSplMyContactsListLength = aSapSplMyContactsListItems.length;

				/* CSNFIX: To select item on successful creation */
				for ( var iCount = 0 ; iCount < iSapSplMyContactsListLength ; iCount++ ) {

					/*
					 * First item is always GroupHeaderListItem, so ignore and
					 * go to the next item
					 */
					if ( aSapSplMyContactsListItems[iCount].constructor !== sap.m.GroupHeaderListItem ) {
						if ( oListCustomData === aSapSplMyContactsListItems[iCount].getBindingContext ( ).getProperty ( "UUID" ) ) {
							// Match found. Select the item and break;
							_iCount = iCount;
							break;
						}
					}
				}

				if ( iSapSplMyContactsListLength > 0 ) {
					if ( iSapSplMyContactsListLength && iSapSplMyContactsListLength > 0 ) {
						if ( aSapSplMyContactsListItems[0].constructor === sap.m.StandardListItem ) {
							oSapSplItemOneContext = aSapSplMyContactsListItems[0].getBindingContext ( ).getProperty ( );
						} else {
							oSapSplItemOneContext = aSapSplMyContactsListItems[1].getBindingContext ( ).getProperty ( );
						}
						window.sessionStorage.setItem ( "CompanyID", oSapSplItemOneContext["BasicInfo_CompanyID"] );
						window.sessionStorage.setItem ( "OrgName", oSapSplItemOneContext["Organization_Name"] );
						window.sessionStorage.setItem ( "OrgRegNum", oSapSplItemOneContext["Organization_RegistrationNumber"] );
						window.sessionStorage.setItem ( "OrgRegistry", oSapSplItemOneContext["Organization_Registry"] );

					}

				}
				this.selectFirstItem ( _iCount );
				var modelData = sap.ui.getCore ( ).getModel ( "myBusinessPartnerDetailModel" ).getData ( );
				if ( iSapSplMyContactsListLength > 0 ) {
					modelData["noData"] = false;
					modelData["isClicked"] = true;
					modelData["showFooterOptions"] = true;
				} else {
					modelData["noData"] = true;
					modelData["isClicked"] = false;
					modelData["showFooterOptions"] = false;
				}
				sap.ui.getCore ( ).getModel ( "myBusinessPartnerDetailModel" ).setData ( modelData );

			} else {
				throw new Error ( );
			}
		} catch (e) {
			if ( e.constructor === Error ( ) ) {
				jQuery.sap.log.error ( e.message, "Number of list items of BP list is 0 , cannot select the first item.", this.getView ( ).getControllerName ( ) );
			}
		}
	},

	/**
	 * @description Method to handle localization of all the hard code texts in the view.
	 * @param void.
	 * @returns void.
	 * @since 1.0
	 */
	fnDefineControlLabelsFromLocalizationBundle : function ( ) {
		/* CSNFIX : 0120031469 620551 2014 */
		this.byId ( "myBusinessPartnerList" ).setNoDataText ( oSapSplUtils.getBundle ( ).getText ( "NO_BUPAS_TEXT" ) );

		this.byId ( "sapSplAddBusinessPartnerButton" ).setTooltip ( oSapSplUtils.getBundle ( ).getText ( "NEW_CONTACT_ADD" ) );

		this.byId ( "sapSplSearchBusinessPartnerMasterList" ).setTooltip ( oSapSplUtils.getBundle ( ).getText ( "SEARCH" ) );
	},

	onAfterRendering : function ( ) {
		oSapSplQuerySelectors.getInstance ( ).setBackButtonTooltip ( );
		this.getView ( ).byId ( "sapSplSearchBusinessPartnerMasterList" ).focus ( );
	},

	/***
	 * @description method to handle the request completed event of the ODataModel.
	 * @param void.
	 * @returns void.
	 * @since 1.0
	 */
	ODataModelRequestCompleted : function ( ) {
		this.afterRenderingOfMyBusinesspartnerList ( );
	},

	InstantiateListAfterRenderingDelegate : function ( ) {
	// var that = this;
	// this.byId( "myBusinessPartnerList" ).addEventDelegate({onAfterRendering :
	// function (oEvent){
	// that.afterRenderingOfMyBusinesspartnerList();
	// }}, this);
	},

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 */
	onInit : function ( ) {

		/* unified shell instance - which is the super parent of this view */
		this.unifiedShell = null;
		var oSapSplBusinessPartnerListModel = sap.ui.getCore ( ).getModel ( "myBusinessPartnerListODataModel" ), oSapSplMyBusinessPartnerSorter = null,

		oSapSplMyBusinessPartnerFilterInfoType = null, oSapSplMyBusinessPartnerListItemsBinding = null;

		oSapSplBusinessPartnerListModel.setCountSupported ( false );

		oSapSplBusinessPartnerListModel.attachRequestFailed ( function ( ) {
			oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
		} );

		/* event registered to ensure that the first item is always selected. */
		oSapSplBusinessPartnerListModel.attachRequestCompleted ( jQuery.proxy ( this.ODataModelRequestCompleted, this ) );

		oSapSplMyBusinessPartnerSorter = new sap.ui.model.Sorter ( "Role.description", false, function ( oContext ) {
			var sKey = oContext.getProperty ( "Role.description" ).toLowerCase ( );
			return {
				key : sKey,
				text : sKey
			};
		} );

		oSapSplMyBusinessPartnerFilterInfoType = new sap.ui.model.Filter ( "isOwner", sap.ui.model.FilterOperator.NE, "1" );

		/* set the OData Model to the list */
		this.getView ( ).byId ( "myBusinessPartnerList" ).setModel ( sap.ui.getCore ( ).getModel ( "myBusinessPartnerListODataModel" ) );

		/*
		 * Applying the sorter and filter on the myBusinessPartner list, by
		 * accessing the "items" binding of the list.
		 */
		oSapSplMyBusinessPartnerListItemsBinding = this.getView ( ).byId ( "myBusinessPartnerList" ).getBinding ( "items" );
		oSapSplMyBusinessPartnerListItemsBinding.sort ( oSapSplMyBusinessPartnerSorter );
		oSapSplMyBusinessPartnerListItemsBinding.filter ( [oSapSplMyBusinessPartnerFilterInfoType] );
		/* Localization */
		this.fnDefineControlLabelsFromLocalizationBundle ( );

		this.getRolesForRelation ( oSapSplUtils.getCompanyDetails ( ).UUID );

		/*
		 * Register list after rendering event delegate and tie to internal
		 * implementation
		 */
		this.InstantiateListAfterRenderingDelegate ( );

		/* Seting focus on the search field when the page loads */

	},

	setSplitAppInstance : function ( oInstance ) {
		this.splitAppBaseInstance = oInstance;
	},

	/**
	 * @description listens to event handling channel which is previously subscribed. This is the default call back when any navigation happens to this view.
	 * It is called even before the onBeforeRendering life cycle method of the view.
	 * @param evt event object of the navigation event.
	 * @returns void.
	 * @since 1.0
	 */
	onBeforeShow : function ( ) {
		var sNavToHome = "", sGoto = "", oMasterPage = null;
		sNavToHome = jQuery.sap.getUriParameters ( ).get ( "navToHome" );
		sGoto = jQuery.sap.getUriParameters ( ).get ( "goto" );
		oMasterPage = this.byId ( "MyBusinessPartnerMasterPage" );

		// if DAL : check for navToHome
		if ( sGoto ) {
			if ( sNavToHome && sNavToHome === "false" ) {
				oMasterPage.setShowNavButton ( false );
			} else if ( sNavToHome && sNavToHome === "true" ) {
				oMasterPage.setShowNavButton ( true );
			} else {
				// if navToHome is anything other than true or false.
				oMasterPage.setShowNavButton ( false );
			}
		} else {

			// not DAL
			oMasterPage.setShowNavButton ( true );
		}
	},

	/***
	 * @description handler for the back navigation event, in case of App to App navigation.
	 * Method to go back 1 page in the baseApp.
	 * @param oEvent event object
	 * @since 1.0
	 * @returns void.
	 */
	fnHandleBackNavigation : function ( ) {
		var oBaseApp = null;
		oBaseApp = oSplBaseApplication.getAppInstance ( );

		/* HOTFIX On back after create and reentry, list should go to i = 1 */
		this.byId ( "myBusinessPartnerList" ).removeAllCustomData ( );

		// back navigation when the App is not launched through DAL

		if ( oBaseApp.getPreviousPage ( ) ) {

			oBaseApp.back ( );

		} else {

			// back navigation when the App is launched through DAL and
			// navToHome = true
			oBaseApp.to ( "splView.tileContainer.MasterTileContainer" );

		}
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

	setIsNoData : function ( _isNoData ) {

		this.isNoData = _isNoData;
	},

	getIsNoData : function ( ) {
		return this.isNoData;
	},

	/**
	 * @description Search of My Users on Press of Search icon or enter
	 * @param {object} event
	 */
	fnToHandleSearchOfMyBusinessPartners : function ( event ) {
		var searchString = event.getParameters ( ).query;
		var oSapSplMyBusinessPartnerFilterIsOwner, oSapSplMyBusinessPartnerSorter, oSapSplMyBusinessPartnerList;
		var payload, that = this, modelData;

		oSapSplMyBusinessPartnerList = that.getView ( ).byId ( "myBusinessPartnerList" );

		if ( searchString.length > 2 ) {

			payload = this.prepareSearchPayload ( searchString );
			this.callSearchService ( payload );

		} else if ( oSapSplMyBusinessPartnerList.getBinding ( "items" ) === undefined || oSapSplMyBusinessPartnerList.getBinding ( "items" ).aFilters.length > 1 || event.getParameters ( ).refreshButtonPressed === true ) {

			sap.ui.getCore ( ).getModel ( "myBusinessPartnerDetailModel" ).setData ( this.getEmptyBusinessPartnerRegistrationData ( ) );

			oSapSplMyBusinessPartnerFilterIsOwner = new sap.ui.model.Filter ( "isOwner", sap.ui.model.FilterOperator.NE, "1" );

			oSapSplMyBusinessPartnerSorter = new sap.ui.model.Sorter ( "Role.description", false, function ( oContext ) {
				var sKey = oContext.getProperty ( "Role.description" ).toLowerCase ( );
				return {
					key : sKey,
					text : sKey
				};
			} );

			oSapSplMyBusinessPartnerList.unbindAggregation ( "items" );
			oSapSplMyBusinessPartnerList.bindItems ( {
				path : "/MyBusinessPartners",
				template : that.getView ( ).byId ( "myBusinessPartnerListItem" )
			} );
			oSapSplMyBusinessPartnerList.getBinding ( "items" ).sort ( oSapSplMyBusinessPartnerSorter );
			oSapSplMyBusinessPartnerList.getBinding ( "items" ).filter ( [oSapSplMyBusinessPartnerFilterIsOwner] );

			modelData = sap.ui.getCore ( ).getModel ( "myBusinessPartnerDetailModel" ).getData ( );
			modelData["noData"] = true;
			modelData["isClicked"] = false;
			modelData["showFooterOptions"] = false;
			modelData["Editable"] = false;
			sap.ui.getCore ( ).getModel ( "myBusinessPartnerDetailModel" ).setData ( modelData );
		}
	},

	prepareSearchPayload : function ( searchTerm ) {
		var payload = {};
		payload.UserID = oSapSplUtils.getLoggedOnUserDetails ( ).usreID;
		payload.ObjectType = "BusinessPartner";
		payload.SearchTerm = searchTerm;
		payload.FuzzinessThershold = SapSplEnums.fuzzyThreshold;
		payload.MaximumNumberOfRecords = 50;
		payload.ProvideDetails = false;
		payload.SearchInNetwork = true;
		payload.AdditionalCriteria = {};
		payload.AdditionalCriteria.BusinessPartnerType = "O";
		payload.AdditionalCriteria.SearchPending = true;
		return payload;
	},

	callSearchService : function ( payload ) {
		var oSapSplSearchFilters, oSapSplMyBusinessPartnerFilters = [], oSapSplMyBusinessPartnerSorter, oSapSplMyBusinessPartnerList;
		var that = this, modelData;

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
			data : JSON.stringify ( payload ),
			success : function ( data, success, messageObject ) {
				oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );

				if ( messageObject["status"] === 200 ) {

					oSapSplMyBusinessPartnerList = that.getView ( ).byId ( "myBusinessPartnerList" );
					sap.ui.getCore ( ).getModel ( "myBusinessPartnerDetailModel" ).setData ( that.getEmptyBusinessPartnerRegistrationData ( ) );

					oSapSplMyBusinessPartnerFilters.push ( new sap.ui.model.Filter ( "isOwner", sap.ui.model.FilterOperator.NE, "1" ) );

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
							template : that.getView ( ).byId ( "myBusinessPartnerListItem" )
						} );
						oSapSplMyBusinessPartnerList.getBinding ( "items" ).sort ( oSapSplMyBusinessPartnerSorter );
						oSapSplMyBusinessPartnerList.getBinding ( "items" ).filter ( oSapSplMyBusinessPartnerFilters );

						modelData = sap.ui.getCore ( ).getModel ( "myBusinessPartnerDetailModel" ).getData ( );
						modelData["noData"] = false;
						modelData["isClicked"] = true;
						modelData["showFooterOptions"] = true;
						sap.ui.getCore ( ).getModel ( "myBusinessPartnerDetailModel" ).setData ( modelData );

					} else {
						modelData = sap.ui.getCore ( ).getModel ( "myBusinessPartnerDetailModel" ).getData ( );
						modelData["noData"] = true;
						modelData["isClicked"] = false;
						modelData["showFooterOptions"] = false;
						sap.ui.getCore ( ).getModel ( "myBusinessPartnerDetailModel" ).setData ( modelData );

						that.byId ( "MyBusinessPartnerMasterPage" ).setTitle ( oSapSplUtils.getBundle ( ).getText ( "MY_BUSINESS_PARTNER_MASTER_TITLE", "0" ) );
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

				modelData = sap.ui.getCore ( ).getModel ( "myBusinessPartnerDetailModel" ).getData ( );
				modelData["noData"] = true;
				modelData["isClicked"] = false;
				modelData["showFooterOptions"] = false;
				sap.ui.getCore ( ).getModel ( "myBusinessPartnerDetailModel" ).setData ( modelData );

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

} );
