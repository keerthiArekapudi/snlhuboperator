/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui
		.controller (
				"splController.registeration.MyContactsMaster",
				{

					/**
					 * Called when a controller is instantiated and its View controls (if available) are already created.
					 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
					 */
					onInit : function ( ) {

						/*unified shell instance - which is the super parent of this view*/
						this.unifiedShell = null;
						var oSapSplContactListModel = sap.ui.getCore ( ).getModel ( "myContactListODataModel" ), oSapSplMyContactsSorter = null, oSapSplMyContactsFilterInfoType = null, oSapSplMyContactsFilterIsMyselfType = null, oSapSplMyContactsListItemsBinding = null;

						oSapSplContactListModel.setCountSupported ( false );

						/*event registered to ensure that the first item is always selected. */
						oSapSplContactListModel.attachRequestCompleted ( jQuery.proxy ( this.ODataModelRequestCompleted, this ) );

						oSapSplContactListModel.attachRequestFailed ( function ( ) {
							oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
						} );

						/*SAPUI5 model sorter instance - To enable a grouping visualization on the list, based on the 1st alphabet of the contact name.*/
						oSapSplMyContactsSorter = new sap.ui.model.Sorter ( "Role.description", false, function ( oContext ) {
							var sKey = oContext.getProperty ( "Role.description" ).toLowerCase ( ); //.charAt(0);
							return {
								key : sKey,
								text : sKey
							};
						} );

						//oSapSplMyContactsFilterIsMyOrg = new sap.ui.model.Filter("isMyOrganization", sap.ui.model.FilterOperator.EQ, 1);
						oSapSplMyContactsFilterInfoType = new sap.ui.model.Filter ( "BasicInfo_Type", sap.ui.model.FilterOperator.EQ, "P" );
						oSapSplMyContactsFilterIsMyselfType = new sap.ui.model.Filter ( "isMyself", sap.ui.model.FilterOperator.NE, 1 );

						/*set the json Model to the list*/
						this.getView ( ).byId ( "SapSplMyContactsList" ).setModel ( sap.ui.getCore ( ).getModel ( "myContactListODataModel" ) );

						/*Applying the sorter and filter on the myContacts list, by accessing the "items" binding of the list.*/
						oSapSplMyContactsListItemsBinding = this.getView ( ).byId ( "SapSplMyContactsList" ).getBinding ( "items" );
						oSapSplMyContactsListItemsBinding.sort ( oSapSplMyContactsSorter );
						oSapSplMyContactsListItemsBinding.filter ( [oSapSplMyContactsFilterInfoType, oSapSplMyContactsFilterIsMyselfType] );

						/*Localization*/
						this.fnDefineControlLabelsFromLocalizationBundle ( );

						this.getRolesForRelation ( );
					},

					/***
					 * @description method to handle the request completed event of the ODataModel.
					 * @param void.
					 * @returns void.
					 * @since 1.0
					 */
					ODataModelRequestCompleted : function ( ) {
						this.afterRenderingOfMyContactList ( );
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

						// back navigation when the App is not launched through DAL
						if ( oBaseApp.getPreviousPage ( ) ) {

							oBaseApp.back ( );

						} else {

							// back navigation when the App is launched through DAL and navToHome = true
							oBaseApp.to ( "splView.tileContainer.MasterTileContainer" );
						}
					},

					onAfterRendering : function ( ) {
						oSapSplQuerySelectors.getInstance ( ).setBackButtonTooltip ( );
					},

					/***
					 * @description handler for the onAfterRendering Event of the MyContactsList.
					 * Method used to trigger selection of the first item of the list.
					 * @param e event object
					 * @since 1.0
					 * @returns void.
					 */
					afterRenderingOfMyContactList : function ( ) {
						oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
						var oSapSplItemOneContext = null, iSapSplMyContactsListLength = 0, aSapSplMyContactsListItems = [], oSapSplMyContactsList = null;
						var modelData = sap.ui.getCore ( ).getModel ( "myContactDetailModel" ).getData ( );

						if ( modelData ) {
							modelData["noData"] = true;
							modelData["isClicked"] = false;
							modelData["showFooterButtons"] = false;
							sap.ui.getCore ( ).getModel ( "myContactDetailModel" ).setData ( modelData );
						}

						var oListCustomData = (this.byId ( "SapSplMyContactsList" ).getCustomData ( ).length > 0) ? this.byId ( "SapSplMyContactsList" ).getCustomData ( )[this.byId ( "SapSplMyContactsList" ).getCustomData ( ).length - 1].getKey ( )
								: null, _iCount = 1;
						try {
							oSapSplMyContactsList = this.getView ( ).byId ( "SapSplMyContactsList" );
							if ( oSapSplMyContactsList ) {
								aSapSplMyContactsListItems = oSapSplMyContactsList.getItems ( );
								if ( aSapSplMyContactsListItems.length ) {

									iSapSplMyContactsListLength = aSapSplMyContactsListItems.length;
									this.byId ( "MyContactsMasterPage" ).setTitle (
											oSapSplUtils.getBundle ( ).getText ( "MY_COLLEAGUES_MASTER_TITLE",
													[oSapSplUtils.getCompanyDetails ( )["Organization_Name"], splReusable.libs.Utils.prototype.getListCount ( this.getView ( ).byId ( "SapSplMyContactsList" ) )] ) );
									/* Incident fix for 1580118533 */
									if ( oSapSplUtils.getCurrentDetailPage ( ).byId ( "MyContactsDetailPage" ) ) {
										oSapSplUtils.getCurrentDetailPage ( ).byId ( "MyContactsDetailPage" ).setTitle ( oSapSplUtils.getBundle ( ).getText ( "MY_COLLEAGUES_DETAIL_TITLE", oSapSplUtils.getCompanyDetails ( )["Organization_Name"] ) );
									}
									/*CSNFIX: To select item on successful creation*/
									for ( var iCount = 0 ; iCount < aSapSplMyContactsListItems.length ; iCount++ ) {

										/*First item is always GroupHeaderListItem, so ignore and go to the next item*/
										if ( aSapSplMyContactsListItems[iCount].constructor !== sap.m.GroupHeaderListItem ) {
											if ( oListCustomData === aSapSplMyContactsListItems[iCount].getBindingContext ( ).getProperty ( "UUID" ) ) {
												//Match found. Select the item and break;
												_iCount = iCount;
												break;
											}
										}
									}
								}
								if ( iSapSplMyContactsListLength && iSapSplMyContactsListLength > 0 ) {
									if ( aSapSplMyContactsListItems[0].constructor === sap.m.StandardListItem ) {
										oSapSplItemOneContext = aSapSplMyContactsListItems[0].getBindingContext ( ).getProperty ( );
									} else {
										oSapSplItemOneContext = aSapSplMyContactsListItems[1].getBindingContext ( ).getProperty ( );
									}
									this.selectFirstItem ( _iCount );
									modelData = sap.ui.getCore ( ).getModel ( "myContactDetailModel" ).getData ( );
									modelData["noData"] = false;
									modelData["isClicked"] = true;
									modelData["showFooterButtons"] = true;
									sap.ui.getCore ( ).getModel ( "myContactDetailModel" ).setData ( modelData );
								}
							} else {
								throw new Error ( );
							}
						} catch (e) {
							if ( e.constructor === Error ( ) ) {
								jQuery.sap.log.error ( e.message, "Number of items in the list is 0, cannot select the first item.", this.getView ( ).getControllerName ( ) );
							}
						} finally {
							sap.ui.getCore ( ).byId ( "MyContactsMaster--sapSplSearchMyUsersMasterList" ).focus ( );
						}
					},

					/***
					 * @description Method to open the Action Sheet which contains the set of roles which the logged user can assign.
					 * @since 1.0
					 * @param evt event object of press
					 * @returns void.
					 */
					openActionSheet : function ( evt ) {
						/* Solution to Incident 1580107677 */

						sap.ui.getCore ( ).byId ( "MyContactsMaster--sapSplSearchMyUsersMasterList" ).$ ( ).find ( "input" ).val ( "" ).trigger ( "search" );
						this.oActionSheet.openBy ( evt.getSource ( ) );
					},

					/***
					 * @description Method to create content of the action sheet which contains the roles which the logged user can assign.
					 * @since 1.0
					 * @returns void.
					 * @param void.
					 */
					createActionSheet : function ( ) {
						if ( !this.oActionSheet ) {
							this.oActionSheet = new sap.m.ActionSheet ( {
								id : "MyContactsActionSheet",
								showCancelButton : true,
								placement : sap.m.PlacementType.Top
							} );

							var roleButton = new sap.m.Button ( {
								text : {
									parts : [{
										path : "GrantableRole"
									}, {
										path : "GrantableRole.description"
									}],
									formatter : function ( sRole, sDescription ) {
										if ( sRole === "DRIVER" ) {
											return oSapSplUtils.getBundle ( ).getText ( "ADD_GRANTABLE_ROLE", [sDescription] );
										} else if ( sRole === "FREIGHTFWD_ADMN" ) {
											return oSapSplUtils.getBundle ( ).getText ( "INVITE_GRANTABLE_ROLE", [sDescription] );
										} else if ( sRole === "FREIGHTFWD_DISP" ) {
											return oSapSplUtils.getBundle ( ).getText ( "INVITE_GRANTABLE_ROLE", [sDescription] );
										} else {
											return sDescription;
										}
									}
								},
								press : jQuery.proxy ( this.fireSelectionOfRoleForCreate, this )
							} );
							this.oActionSheet.bindAggregation ( "buttons", "/results", roleButton );
							this.oActionSheet.setModel ( new sap.ui.model.json.JSONModel ( this.aRolesForTargetRelation ) );
						}
					},
					/***
					 * @description Press event handler of the roles button - to open a empty form with filled role.
					 * @since 1.0
					 * @returns void.
					 * @param evt event object of button press.
					 */
					fireSelectionOfRoleForCreate : function ( evt ) {
						var that = this;
						var eventObject = jQuery.extend ( true, {}, evt );
						if ( oSapSplUtils.getCurrentDetailPage ( ).sId === "NewContactRegistrationDetail" ) {
							if ( oSapSplUtils.getIsDirty ( ) ) {
								sap.m.MessageBox.show ( oSapSplUtils.getBundle ( ).getText ( "DATA_LOSS_WARNING_TEXT" ), sap.m.MessageBox.Icon.WARNING, oSapSplUtils.getBundle ( ).getText ( "WARNING" ), [sap.m.MessageBox.Action.YES,
										sap.m.MessageBox.Action.CANCEL], function ( selection ) {
									if ( selection === "YES" ) {
										that.navigateToNewUserInvite ( eventObject );
										oSapSplUtils.setIsDirty ( false );
									}
								} );
							} else {
								this.navigateToNewUserInvite ( evt );
							}
						} else {
							this.navigateToNewUserInvite ( evt );
						}
					},

					/***
					 * @description navigates to new registration Invite page .
					 * @since 1.0
					 * @returns void.
					 * @param evt event object .
					 */
					navigateToNewUserInvite : function ( evt ) {

						oSapSplUtils.getCurrentMasterPage ( ).byId ( "SapSplMyContactsList" ).removeSelections ( );
						if ( oSapSplUtils.getCurrentDetailPage ( ).sId === "NewContactRegistrationDetail" ) {
							/*The empty object to be bound to the Form.*/
							sap.ui.getCore ( ).getModel ( "myContactsRegisterEditModel" ).setData ( this.getEmptyRegistrationData ( evt.getSource ( ).getBindingContext ( ).getObject ( )["GrantableRole.description"], "create" ) );
							oSapSplUtils.getCurrentDetailPage ( ).getController ( ).isEditMyUser = 0;

							/* CSNFIX : 0120031469 0000805567 2014, 1482007658 */
							if ( sap.ui.getCore ( ).getModel ( "myContactsRegisterEditModel" ).getData ( )["Mode"] === "Create" || evt.getSource ( ).getBindingContext ( ).getObject ( )["GrantableRole.description"] === "Driver" ) {
								oSapSplUtils.getCurrentDetailPage ( ).getController ( ).byId ( "splNewContactRegistrationRoles" ).setEnabled ( false );
							} else {
								oSapSplUtils.getCurrentDetailPage ( ).getController ( ).byId ( "splNewContactRegistrationRoles" ).setEnabled ( true );
							}
						} else {
							/*instance of the SAPUI5 event bus - used to subscribe or publish events across the application*/
							var bus = sap.ui.getCore ( ).getEventBus ( );
							bus.publish ( "navInDetail", "to", {
								from : this.oActionSheet,
								data : {
									/*The object bound to the selected listItem.*/
									context : this.getEmptyRegistrationData ( evt.getSource ( ).getBindingContext ( ).getObject ( )["GrantableRole.description"], "create" )
								}
							} );
						}
						if ( oSapSplUtils.getCurrentDetailPage ( ).byId ( "sapSplMyUserEditEmailInput" ).getEnabled ( ) === false ) {
							oSapSplUtils.getCurrentDetailPage ( ).byId ( "sapSplMyUserEditEmailInput" ).setEnabled ( true );
						}
						oSapSplUtils.getCurrentDetailPage ( ).byId ( "NewContactRegistrationDetailPage" ).setTitle ( oSapSplUtils.getBundle ( ).getText ( "NEW_CONTACT_TITLE", oSapSplUtils.getCompanyDetails ( )["Organization_Name"] ) );
						//        oSapSplUtils.getCurrentDetailPage().byId("newContactInvite").setText(oSapSplUtils.getBundle().getText("NEW_CONTACT_INVITE"));
					},

					/**
					 * @description Method to handle localization of all the hard code texts in the view.
					 * @param void.
					 * @returns void.
					 * @since 1.0
					 */
					fnDefineControlLabelsFromLocalizationBundle : function ( ) {
						this.byId ( "MyContactsMasterPage" ).setTitle ( oSapSplUtils.getBundle ( ).getText ( "MY_COLLEAGUES_MASTER_TITLE", [oSapSplUtils.getCompanyDetails ( )["Organization_Name"], "0"] ) );

						/*CSN FIX: 0001407271 2014*/
						this.byId ( "SapSplMyContactsList" ).setNoDataText ( oSapSplUtils.getBundle ( ).getText ( "NO_USERS_TEXT" ) );

						this.byId ( "sapSplAddBusinessPartnerUserButton" ).setTooltip ( oSapSplUtils.getBundle ( ).getText ( "NEW_CONTACT_ADD" ) );

						this.byId ( "sapSplSearchMyUsersMasterList" ).setTooltip ( oSapSplUtils.getBundle ( ).getText ( "SEARCH" ) );

					},

					/***
					 * @description Method to fetch the list of roles which the logged in user can assign.
					 * @param ID UUID of the logged in company.
					 * @returns void.
					 */
					getRolesForRelation : function ( ) {
						var oModel = sap.ui.getCore ( ).getModel ( "myColleaguesODataModel" );
						var oDataModelContext = null, oDataModelFilters = [], bIsAsync = true;

						var sUrl = "/GrantableRolesForPerson";

						if ( oModel ) {
							oModel.read ( sUrl, oDataModelContext, oDataModelFilters, bIsAsync, jQuery.proxy ( this.successOfRolesOdata, this ), jQuery.proxy ( this.errorOfRolesOdata, this ) );
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
							this.updateNewRegistrationModel ( );
						} else {
							this.byId ( "sapSplAddBusinessPartnerUserButton" ).setVisible ( false );
						}

					},

					/***
					 * @description Error handler of the fetch of Target roles of user.
					 * @returns void.
					 * @param result result set containing the list of roles.
					 */
					errorOfRolesOdata : function ( error ) {
						var errorMessage = JSON.parse ( error.response.body ).error.message.value;
						sap.ca.ui.message.showMessageBox ( {
							type : sap.ca.ui.message.Type.ERROR,
							message : oSapSplUtils.getBundle ( ).getText ( "READ_ENTITY_ERROR_MESSAGE", ["Roles(My Users)"] ),
							details : errorMessage
						} );
					},

					/***
					 * @description Method to update the newContactRegistrationRoles model, as the same list of roles can be used for roles in edit mode.
					 * ie, when the user details is viewed in edit mode, the list of roles which he can edit the existing role with can be reused.
					 * @returns void.
					 * @param void.
					 */
					updateNewRegistrationModel : function ( ) {
						try {
							if ( sap.ui.getCore ( ).getModel ( "splNewContactRegistrationRoles" ) ) {
								sap.ui.getCore ( ).getModel ( "splNewContactRegistrationRoles" ).setData ( this.aRolesForTargetRelation );
							} else {
								sap.ui.getCore ( ).setModel ( new sap.ui.model.json.JSONModel ( this.aRolesForTargetRelation ), "splNewContactRegistrationRoles" );
							}
						} catch (e) {
							if ( e.constructor === Error ( ) ) {
								jQuery.sap.log.error ( e.message, "No model is set for NewContactRegistration view , cannot set data", this.getView ( ).getControllerName ( ) );
							}
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
					 * @description select event handler of the "myContacts" list. Results in navigation of the detail page - to Contact detail page.
					 * @param evt event object of the select event.
					 * @returns void.
					 * @since 1.0
					 */
					handleMyContactSelect : function ( oSelectedListItemData ) {
						var that = this, masterList, currentUser, sIndex;
						if ( oSapSplUtils.getCurrentDetailPage ( ).sId === "NewContactRegistrationDetail" ) {
							if ( oSapSplUtils.getIsDirty ( ) ) {
								sap.m.MessageBox.show ( oSapSplUtils.getBundle ( ).getText ( "DATA_LOSS_WARNING_TEXT" ), sap.m.MessageBox.Icon.WARNING, oSapSplUtils.getBundle ( ).getText ( "WARNING" ), [sap.m.MessageBox.Action.YES,
										sap.m.MessageBox.Action.CANCEL], function ( selection ) {
									if ( selection === "YES" ) {
										that.updateMyContactsDetailPage ( oSelectedListItemData );
										oSapSplUtils.setIsDirty ( false );
									} else {
										currentUser = sap.ui.getCore ( ).getModel ( "myContactsRegisterEditModel" ).getData ( );
										masterList = oSapSplUtils.getCurrentMasterPage ( ).byId ( "SapSplMyContactsList" );
										if ( currentUser.UUID ) {
											for ( sIndex = 0 ; sIndex < masterList.getItems ( ).length ; sIndex++ ) {
												if ( masterList.getItems ( )[sIndex].sId.indexOf ( "SapSplMyContactsListItem" ) !== -1 ) {
													if ( masterList.getItems ( )[sIndex].getBindingContext ( ).getProperty ( ).UUID === currentUser.UUID ) {
														masterList.setSelectedItem ( masterList.getItems ( )[sIndex] );
														break;
													}
												}
											}
										} else {
											masterList.removeSelections ( );
										}

									}
								} );
							} else {
								that.updateMyContactsDetailPage ( oSelectedListItemData );
							}

						} else {
							this.updateMyContactsDetailPage ( oSelectedListItemData );
						}

					},

					/**
					 * @description select event handler of the "myContacts" list. Results in navigation of the detail page - to Contact detail page.
					 * @param evt event object of the select event.
					 * @returns void.
					 * @since 1.0
					 */
					updateMyContactsDetailPage : function ( oSelectedListItemData ) {

						try {
							/*
							 * If the current Detail page of the SplitAppBase control, is the contact details page, then just change the myContactDetailModel's data,
							 * else navigate to the contact details page and change the model data in onBeforeShow of the respective view's controller.
							 **/
							if ( oSelectedListItemData.RequestStatus !== undefined && oSelectedListItemData.RequestStatus === "0" ) {
								oSelectedListItemData.isEnableEdit = false;
							} else {
								oSelectedListItemData.isEnableEdit = true;
							}

							/* CSNFIX : 0120031469 647935     2014 */
							/* CSNFIX : 0120031469 0000764737 2014 */
							if ( oSelectedListItemData.isEditable !== undefined && (oSelectedListItemData.isEditable === 0 || oSelectedListItemData.isEditable === false) ) {
								oSelectedListItemData.isEditable = false;
							} else {
								oSelectedListItemData.isEditable = true;
							}

							oSelectedListItemData["noData"] = false;
							oSelectedListItemData["isClicked"] = true;
							oSelectedListItemData["showFooterButtons"] = true;
							if ( oSelectedListItemData["Role"] === "DRIVER" ) {
								oSelectedListItemData["showEmail"] = false;
							} else {
								oSelectedListItemData["showEmail"] = true;
							}
							if ( oSapSplUtils.getCurrentDetailPage ( ) ) {
								if ( oSapSplUtils.getCurrentDetailPage ( ).sId === "MyContactDetails" ) {

									/*The object bound to the selected listItem.*/
									sap.ui.getCore ( ).getModel ( "myContactDetailModel" ).setData ( oSelectedListItemData );

								} else {
									/*instance of the SAPUI5 event bus - used to sunscribe or publish events accross the application*/
									var bus = sap.ui.getCore ( ).getEventBus ( );
									bus.publish ( "navInDetail", "to", {
										from : this.getView ( ),
										data : {
											/*The object bound to the selected listItem.*/
											context : oSelectedListItemData
										}
									} );
								}
							} else {
								throw new Error ( );
							}
						} catch (e) {
							if ( e.constructor === Error ( ) ) {
								jQuery.sap.log.error ( e.message, "There is no current Detail Page in MyContacts SplitApp.", this.getView ( ).getControllerName ( ) );
							}
						}
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
						oMasterPage = this.byId ( "MyContactsMasterPage" );

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

					/***
					 * @description Method to set the first list item as selected, and also fire the event to bring changes in the corresponding detail page.
					 * @returns void.
					 */
					selectFirstItem : function ( iCount ) {
						var oSelectedListItemData = null, selectedId;
						try {
							var contactsList = this.getView ( ).byId ( "SapSplMyContactsList" );

							if ( contactsList.getItems ( )[iCount].constructor === sap.m.StandardListItem ) {
								this.getView ( ).byId ( "SapSplMyContactsList" ).setSelectedItem ( contactsList.getItems ( )[iCount] );
								oSelectedListItemData = contactsList.getItems ( )[iCount].getBindingContext ( ).getProperty ( );

								if ( iCount === 0 || iCount === 1 ) {
									document.getElementById ( this.getView ( ).byId ( "sapSplSearchMyUsersMasterList" ).getId ( ) ).scrollIntoView ( true );
								} else {
									selectedId = contactsList.getItems ( )[iCount].getId ( );
									/*HOTFIX An issue where the getElementById on the selected ID is unable to get the 
									 * DOM element immediately. So asyncing it so that the DOM is prepared and then
									 * scroll into it*/
									window.setTimeout ( function ( ) {
										document.getElementById ( selectedId ).scrollIntoView ( true );
									}, 0 );
								}
							} else {
								contactsList.getItems ( )[iCount + 1].setSelected ( true );
								oSelectedListItemData = contactsList.getItems ( )[iCount + 1].getBindingContext ( ).getProperty ( );
							}
							this.updateMyContactsDetailPage ( oSelectedListItemData );

						} catch (e) {
							if ( e.constructor === Error ( ) ) {
								jQuery.sap.log.error ( e.message, "Cannot select first item of MyContactsList", this.getView ( ).getControllerName ( ) );
							}
						}
					},

					/**
					 * @description Method to get an empty contactRegistration object.
					 * @param {string} sRole The role against which the registration data needs to be obtained
					 * @returns {object} empty contactRegistration object
					 * @since 1.0
					 */
					getEmptyRegistrationData : function ( sRole, sMode ) {
						var oEmptyObject = {};
						oEmptyObject["PersonName_Title"] = "";
						oEmptyObject["PersonName_GivenName"] = "";
						oEmptyObject["PersonName_JobFunction"] = "";
						oEmptyObject["PersonName_Surname"] = "";
						oEmptyObject["PersonName_SurnamePrefix"] = "";
						oEmptyObject["PostalAddress_Country"] = "";
						oEmptyObject["PostalAddress_District"] = "";
						oEmptyObject["PostalAddress_PostalCode"] = "";
						oEmptyObject["PostalAddress_Street"] = "";
						oEmptyObject["PostalAddress_StreetName"] = "";
						oEmptyObject["PostalAddress_Town"] = "";
						oEmptyObject["CommunicationInfo_Fax"] = "";
						oEmptyObject["CommunicationInfo_Phone"] = "";
						oEmptyObject["CommunicationInfo_Website"] = "";
						oEmptyObject["Validity_StartTime"] = null;
						oEmptyObject["Validity_EndTime"] = null;
						oEmptyObject["OrganizationRoles_Role1"] = "";
						oEmptyObject["OrganizationRoles_Role2"] = "";
						oEmptyObject["OrganizationRoles_Role3"] = "";
						oEmptyObject["OrganizationRoles_Role4"] = "";
						oEmptyObject["MainUserRoles_Role2"] = "";
						oEmptyObject["MainUserRoles_Role3"] = "";
						oEmptyObject["MainUserRoles_Role4"] = "";
						oEmptyObject["UUID"] = "";
						oEmptyObject["BasicInfo_ID"] = "";
						oEmptyObject["BasicInfo_Type"] = "P";
						oEmptyObject["PersonName_GivenName"] = "";
						oEmptyObject["PersonName_Surname"] = "";
						if ( sRole ) {
							oEmptyObject["MainUserRoles_Role1"] = sRole;
						} else {
							oEmptyObject["MainUserRoles_Role1"] = "";
						}
						oEmptyObject["CommunicationInfo_EmailAddress"] = "";
						oEmptyObject["AuditTrail_CreationTime"] = "";
						oEmptyObject["CommunicationInfo_Phone"] = "";
						oEmptyObject["PostalAddress_Country"] = "";
						oEmptyObject["RequestType"] = "1";
						oEmptyObject["OrgUUID"] = null;
						if ( sMode && sMode === "create" ) {
							oEmptyObject["isClicked"] = true;
							oEmptyObject["noData"] = false;
							oEmptyObject["showFooterButtons"] = true;
							/* FIX : 1482007658 */
							oEmptyObject["Mode"] = "Create";
						} else {
							oEmptyObject["isClicked"] = false;
							oEmptyObject["noData"] = true;
							oEmptyObject["showFooterButtons"] = false;
						}
						if ( sRole === "Driver" ) {
							oEmptyObject["ActionName"] = oSapSplUtils.getBundle ( ).getText ( "NEW_CONTACT_ADD" );
							oEmptyObject["EmailVisible"] = false;
						} else {
							oEmptyObject["ActionName"] = oSapSplUtils.getBundle ( ).getText ( "NEW_CONTACT_INVITE" );
							oEmptyObject["EmailVisible"] = true;
						}

						return oEmptyObject;
					},
					/**
					 * @description Search of My Users on Press of Search icon or enter
					 * @param {object} event
					 */
					fnToHandleSearchOfMyUsers : function ( event ) {
						var searchString = event.getParameters ( ).query;
						var oSapSplMyContactsFilterInfoType, oSapSplMyContactsFilterIsMyselfType, oSapSplMyContactsSorters, oSapSplMyContactsList;
						var payload, that = this, modelData;

						oSapSplMyContactsList = this.getView ( ).byId ( "SapSplMyContactsList" );

						if ( searchString.length > 2 ) {

							payload = this.prepareSearchPayload ( searchString );
							this.callSearchService ( payload );

						} else if ( oSapSplMyContactsList.getBinding ( "items" ) === undefined || oSapSplMyContactsList.getBinding ( "items" ).aFilters.length > 2 || event.getParameters ( ).refreshButtonPressed === true ) {

							if ( oSapSplUtils.getCurrentDetailPage ( ).getId ( ) === "MyContactDetails" ) {
								oSapSplUtils.getCurrentDetailPage ( ).byId ( "MyContactDetailsEditButton" ).setEnabled ( false );
								sap.ui.getCore ( ).getModel ( "myContactDetailModel" ).setData ( this.getEmptyRegistrationData ( ) );
							}

							oSapSplMyContactsFilterInfoType = new sap.ui.model.Filter ( "BasicInfo_Type", sap.ui.model.FilterOperator.EQ, "P" );
							oSapSplMyContactsFilterIsMyselfType = new sap.ui.model.Filter ( "isMyself", sap.ui.model.FilterOperator.NE, 1 );

							oSapSplMyContactsSorters = new sap.ui.model.Sorter ( "Role.description", false, function ( oContext ) {
								var sKey = oContext.getProperty ( "Role.description" ).toLowerCase ( ); //.charAt(0);
								return {
									key : sKey,
									text : sKey
								};
							} );

							oSapSplMyContactsList.unbindAggregation ( "items" );
							oSapSplMyContactsList.bindItems ( {
								path : "/MyUsers",
								template : that.getView ( ).byId ( "SapSplMyContactsListItem" )
							} );

							oSapSplMyContactsList.getBinding ( "items" ).filter ( [oSapSplMyContactsFilterInfoType, oSapSplMyContactsFilterIsMyselfType] );

							oSapSplMyContactsList.getBinding ( "items" ).sort ( oSapSplMyContactsSorters );

							modelData = sap.ui.getCore ( ).getModel ( "myContactDetailModel" ).getData ( );
							modelData["noData"] = true;
							modelData["isClicked"] = false;
							modelData["showFooterButtons"] = false;
							sap.ui.getCore ( ).getModel ( "myContactDetailModel" ).setData ( modelData );
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
						payload.AdditionalCriteria.BusinessPartnerType = "P";
						payload.AdditionalCriteria.SearchPending = true;
						return payload;
					},

					callSearchService : function ( payload ) {
						var oSapSplSearchFilters, oSapSplMyContactsFilters = [], oSapSplMyContactsSorters, oSapSplMyContactsList;
						var that = this, modelData;

						oSapSplAjaxFactory.fireAjaxCall ( {
							url : oSapSplUtils.getFQServiceUrl ( "/sap/spl/xs/app/services/Search.xsjs" ),
							method : "POST",
							async : false,
							dataType : "json",
							data : JSON.stringify ( payload ),
							success : function ( data, success, messageObject ) {
								oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );

								if ( messageObject["status"] === 200 ) {

									oSapSplMyContactsList = that.getView ( ).byId ( "SapSplMyContactsList" );
									sap.ui.getCore ( ).getModel ( "myContactDetailModel" ).setData ( that.getEmptyRegistrationData ( ) );

									oSapSplMyContactsFilters.push ( new sap.ui.model.Filter ( "BasicInfo_Type", sap.ui.model.FilterOperator.EQ, "P" ) );
									oSapSplMyContactsFilters.push ( new sap.ui.model.Filter ( "isMyself", sap.ui.model.FilterOperator.NE, 1 ) );

									oSapSplMyContactsSorters = new sap.ui.model.Sorter ( "Role.description", false, function ( oContext ) {
										var sKey = oContext.getProperty ( "Role.description" ).toLowerCase ( ); //.charAt(0);
										return {
											key : sKey,
											text : sKey
										};
									} );

									oSapSplMyContactsList.unbindAggregation ( "items" );
									if ( data.length > 0 ) {

										oSapSplSearchFilters = oSapSplUtils.getSearchItemFilters ( data );

										if ( oSapSplSearchFilters.aFilters.length > 0 ) {
											oSapSplMyContactsFilters.push ( oSapSplSearchFilters );
										}

										oSapSplMyContactsList.bindItems ( {
											path : "/MyUsers",
											template : that.getView ( ).byId ( "SapSplMyContactsListItem" )
										} );
										oSapSplMyContactsList.getBinding ( "items" ).sort ( oSapSplMyContactsSorters );
										oSapSplMyContactsList.getBinding ( "items" ).filter ( oSapSplMyContactsFilters );

										modelData = sap.ui.getCore ( ).getModel ( "myContactDetailModel" ).getData ( );
										modelData["noData"] = false;
										modelData["isClicked"] = true;
										modelData["showFooterButtons"] = true;
										sap.ui.getCore ( ).getModel ( "myContactDetailModel" ).setData ( modelData );

									} else {
										modelData = sap.ui.getCore ( ).getModel ( "myContactDetailModel" ).getData ( );
										modelData["noData"] = true;
										modelData["isClicked"] = false;
										modelData["showFooterButtons"] = false;
										modelData["isEditable"] = 0;
										sap.ui.getCore ( ).getModel ( "myContactDetailModel" ).setData ( modelData );

										that.byId ( "MyContactsMasterPage" ).setTitle ( oSapSplUtils.getBundle ( ).getText ( "MY_COLLEAGUES_MASTER_TITLE", [oSapSplUtils.getCompanyDetails ( )["Organization_Name"], "0"] ) );
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

								modelData = sap.ui.getCore ( ).getModel ( "myContactDetailModel" ).getData ( );
								modelData["noData"] = true;
								modelData["isClicked"] = false;
								modelData["showFooterButtons"] = false;
								sap.ui.getCore ( ).getModel ( "myContactDetailModel" ).setData ( modelData );

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
