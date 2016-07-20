/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.require ( "sap.ca.ui.message.message" );
sap.ui
		.controller (
				"splController.dialogs.SplParkingSpaceCreateEditDialog",
				{

					/**
					 * Called when a controller is instantiated and its View controls (if available) are already created.
					 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
					 */
					onInit : function ( ) {
						this.navContainer = this.byId ( "SapSplParkingSpaceCreateEditNavContainer" );
						this.oSapSplValueHelpForSelectCardsInput = this.byId ( "SapSplValueHelpForSelectCardsInput" );
						this.oSapSplValueHelpForSelectServicesInput = this.byId ( "SapSplValueHelpForSelectServicesInput" );
						this.oSapSplValueHelpForSelectFuelInput = this.byId ( "SapSplValueHelpForSelectFuelInput" );

						sap.ui.getCore ( ).setModel ( new sap.ui.model.json.JSONModel ( ), "sapSplCreateParkingSpaceModel" );
						this.getView ( ).setModel ( sap.ui.getCore ( ).getModel ( "sapSplCreateParkingSpaceModel" ) );
						this.byId ( "SapSplCardsValueHelpLayout" ).setModel ( sap.ui.getCore ( ).getModel ( "sapSplCreateParkingSpaceModel" ) );
						this.byId ( "SapSplServicesValueHelpLayout" ).setModel ( sap.ui.getCore ( ).getModel ( "sapSplCreateParkingSpaceModel" ) );
						this.byId ( "SapSplFuelValueHelpLayout" ).setModel ( sap.ui.getCore ( ).getModel ( "sapSplCreateParkingSpaceModel" ) );
						this.byId ( "SapSplCreateParkingSpaceMultiSelectList" ).setModel ( sap.ui.getCore ( ).getModel ( "sapSplCreateParkingSpaceModel" ) );
						this.oViewData = this.getView ( ).getViewData ( );

						if ( !this.oViewData["Parking"].results ) {
							this.oViewData["Parking"].results = [];
						}

						if ( this.oViewData["mode"] === "Create" ) {
							sap.ui.getCore ( ).getModel ( "sapSplCreateParkingSpaceModel" ).setData ( this.getEmptyData ( this.oViewData ) );
							if ( this.oViewData["sDialogType"] === "LC0002" ) {
								this.byId ( "SapSplParkingSpaceCreateEditPage" ).setTitle ( oSapSplUtils.getBundle ( ).getText ( "CREATE_PARKING_SPACE_DIALOG_TITLE" ) );
								this.sName = "Parking Space";
								this.sCategory = "P";
								this.byId ( "sapSplCreateLocationEntityIDLabel" ).setVisible ( false );
								this.byId ( "SapSplValueHelpForSelectEntitiesInput" ).setVisible ( false );
								this.byId ( "SelectProvidersSelectControl" ).setVisible ( false );
								this.byId ( "SelectProvidersLabel" ).setVisible ( false );
								this.byId ( "checkBoxAutomaticManualStatusMode" ).setVisible ( false );
							} else if ( this.oViewData["sDialogType"] === "LC0007" ) {
								this.fetchListOfProviders ( );
								this.byId ( "SapSplParkingSpaceCreateEditPage" ).setTitle ( oSapSplUtils.getBundle ( ).getText ( "ADD_CONTAINER_DEPOT" ) );
								this.byId ( "SapSplEntitySelectListPageTitle" ).setText ( oSapSplUtils.getBundle ( ).getText ( "SELECT_CONTAINER_DEPOT_ID" ) );
								this.byId ( "sapSplCreateLocationEntityIDLabel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "CONTAINER_DEPOT_ID" ) );
								this.sName = "Container Depot";
								this.sCategory = "D";
								/* CSNFIX : 1570126093 */
								this.byId ( "SapSplParkingSpaceCreateEditPageCapaity" ).setVisible ( false );
								this.byId ( "SapSplParkingSpaceCreateEditPageCapaityText" ).setVisible ( false );
							} else {
								this.fetchListOfProviders ( );
								this.byId ( "SapSplParkingSpaceCreateEditPage" ).setTitle ( oSapSplUtils.getBundle ( ).getText ( "ADD_CONTAINER_TERMINAL" ) );
								this.byId ( "sapSplCreateLocationEntityIDLabel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "CONTAINER_TERMINAL_ID" ) );
								this.byId ( "SapSplEntitySelectListPageTitle" ).setText ( oSapSplUtils.getBundle ( ).getText ( "SELECT_CONTAINER_TERMINAL_ID" ) );
								this.sName = "Container Terminal";
								this.sCategory = "T";
								/* CSNFIX : 1570126093 */
								this.byId ( "SapSplParkingSpaceCreateEditPageCapaity" ).setVisible ( false );
								this.byId ( "SapSplParkingSpaceCreateEditPageCapaityText" ).setVisible ( false );
							}
							this.byId ( "checkBoxAutomaticManualStatusMode" ).setSelected ( true );
							this.byId ( "checkBoxAutomaticManualStatusMode" ).fireSelect ( {
								selected : true
							} );
							this.byId ( "sapSplParkingSpaceAddImage" ).setEnabled ( false );
						} else {
							if ( this.oViewData["sDialogType"] === "LC0002" ) {
								this.byId ( "SapSplParkingSpaceCreateEditPage" ).setTitle ( oSapSplUtils.getBundle ( ).getText ( "EDIT_PARKING_SPACE_DIALOG_TITLE" ) );
								this.sName = "Parking Space";
								this.sCategory = "P";
								this.byId ( "checkBoxAutomaticManualStatusMode" ).setVisible ( false );
							} else if ( this.oViewData["sDialogType"] === "LC0007" ) {
								this.byId ( "SapSplParkingSpaceCreateEditPage" ).setTitle ( oSapSplUtils.getBundle ( ).getText ( "EDIT_CONTAINER_DEPOT" ) );
								this.sName = "Container Depot";
								this.sCategory = "D";
								/* CSNFIX : 1570126093 */
								this.byId ( "SapSplParkingSpaceCreateEditPageCapaity" ).setVisible ( false );
								this.byId ( "SapSplParkingSpaceCreateEditPageCapaityText" ).setVisible ( false );
								this.byId ( "sapSplCreateLocationEntityIDLabel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "CONTAINER_DEPOT_ID" ) );
							} else {
								this.byId ( "SapSplParkingSpaceCreateEditPage" ).setTitle ( oSapSplUtils.getBundle ( ).getText ( "EDIT_CONTAINER_TERMINAL" ) );
								this.sName = "Container Terminal";
								this.sCategory = "T";
								/* CSNFIX : 1570126093 */
								this.byId ( "SapSplParkingSpaceCreateEditPageCapaity" ).setVisible ( false );
								this.byId ( "SapSplParkingSpaceCreateEditPageCapaityText" ).setVisible ( false );
								this.byId ( "sapSplCreateLocationEntityIDLabel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "CONTAINER_TERMINAL_ID" ) );
							}
							if ( this.oViewData["ModeOfStatusUpdate"] === "M" ) {
								this.byId ( "checkBoxAutomaticManualStatusMode" ).setSelected ( false );
								this.byId ( "checkBoxAutomaticManualStatusMode" ).fireSelect ( {
									selected : false
								} );
							} else {
								this.byId ( "checkBoxAutomaticManualStatusMode" ).setSelected ( true );
								this.byId ( "checkBoxAutomaticManualStatusMode" ).fireSelect ( {
									selected : true
								} );
							}
							sap.ui.getCore ( ).getModel ( "sapSplCreateParkingSpaceModel" ).setData ( this.oViewData );

							if ( this.oViewData["sDialogType"] === "LC0002" || !(this.oViewData["AdditionalID"] === null && this.oViewData["StatusProvider"] === null) ) {
								this.byId ( "sapSplCreateLocationEntityIDLabel" ).setVisible ( false );
								this.byId ( "SapSplValueHelpForSelectEntitiesInput" ).setVisible ( false );
								this.byId ( "SelectProvidersSelectControl" ).setVisible ( false );
								this.byId ( "SelectProvidersLabel" ).setVisible ( false );
							} else {
								this.fetchListOfProviders ( );
							}

							/* CSNFIX : 0120061532 1480541 2014 */
							if ( (this.oViewData["ImageUrl"].constructor === String && this.oViewData["ImageUrl"].length === 0) || !this.oViewData["ImageUrl"] ) {
								this.byId ( "sapSplParkingSpaceImage" ).setVisible ( false );
								this.byId ( "sapSplParkingSpaceAddImage" ).setEnabled ( false );
							} else {
								this.byId ( "sapSplParkingSpaceImage" ).setSrc ( this.oViewData["ImageUrl"] );
								this.byId ( "sapSplParkingSpaceImage" ).setVisible ( true );
								this.byId ( "sapSplParkingSpaceAddImage" ).setEnabled ( true );
								this.byId ( "sapSplParkingSpaceImageURL" ).setValue ( this.oViewData["ImageUrl"] );
							}
							/* CSNFIX : 0120061532 1480541 2014 */
							if ( this.oViewData["bDefaultImage"] !== undefined && this.oViewData["bDefaultImage"] === true ) {
								this.byId ( "sapSplParkingSpaceImageURL" ).setValue ( "" );
								/* CSNFIX : 0120061532 1480541 2014 */
								this.byId ( "sapSplParkingSpaceAddImage" ).setEnabled ( false );
							}
						}

						this.checkedFilter = new sap.ui.model.Filter ( "checked", sap.ui.model.FilterOperator.EQ, true );
						this.cardsFilter = new sap.ui.model.Filter ( "Category", sap.ui.model.FilterOperator.EQ, "C" );
						this.servicesFilter = new sap.ui.model.Filter ( "Category", sap.ui.model.FilterOperator.EQ, "S" );
						this.fuelFilter = new sap.ui.model.Filter ( "Category", sap.ui.model.FilterOperator.EQ, "F" );
						this.addAllFilter = new sap.ui.model.Filter ( "all", sap.ui.model.FilterOperator.EQ, true );
						this.removeAllFilter = new sap.ui.model.Filter ( "all", sap.ui.model.FilterOperator.NE, true );

						this.byId ( "SapSplServicesValueHelpCell" ).getBinding ( "content" ).filter ( [this.checkedFilter, this.servicesFilter, this.removeAllFilter], true );
						this.byId ( "SapSplFuelValueHelpCell" ).getBinding ( "content" ).filter ( [this.checkedFilter, this.fuelFilter, this.removeAllFilter], true );
						this.byId ( "SapSplCardsValueHelpCell" ).getBinding ( "content" ).filter ( [this.checkedFilter, this.cardsFilter, this.removeAllFilter], true );

						/* Localization */
						this.fnDefineControlLabelsFromLocalizationBundle ( );
						var that = this;
						this.getView ( ).addEventDelegate ( {
							onAfterRendering : function ( ) {
								setTimeout ( function ( ) {
									that.getView ( ).getParent ( ).getParent ( ).$ ( ).css ( "top", "100px" );
									that.getView ( ).getParent ( ).getParent ( ).$ ( ).css ( "left", "90px" );
								}, 1500 );
								if ( that.byId ( "SapSplParkingSpaceCreateEditPageNameInput" ) ) {
									setTimeout ( function ( ) {
										that.byId ( "SapSplParkingSpaceCreateEditPageNameInput" ).focus ( );
									}, 1000 );
								}
							}
						} );
					},

					handleSelectOfEntityFromList : function ( oEvent ) {
						this.byId ( "SapSplValueHelpForSelectEntitiesInput" ).setValue ( oEvent.getSource ( ).getSelectedItem ( ).getTitle ( ) );
						this.byId ( "SapSplValueHelpForSelectEntitiesInput" ).setValueState ( "None" );
						this.byId ( "SapSplValueHelpForSelectEntitiesInput" ).removeAllCustomData ( );
						this.byId ( "SapSplValueHelpForSelectEntitiesInput" ).addCustomData ( new sap.ui.core.CustomData ( {
							key : "boundObject",
							value : oEvent.getSource ( ).getSelectedItem ( ).getBindingContext ( ).getProperty ( )
						} ) );
					},

					fetchListOfProviders : function ( ) {
						/* Fix for incident 1580146088 */
						var aListOfServiceProviders = [];
						var oPlaceHolderObject = {
							terminalTypeName : "placeholder",
							description : oSapSplUtils.getBundle ( ).getText ( "SELECT_PROVIDER_PLACEHOLDER" )
						};
						var oModelData = sap.ui.getCore ( ).getModel ( "sapSplCreateParkingSpaceModel" ).getData ( );
						oModelData["Providers"] = [];
						oModelData["Providers"].splice ( 0, 0, oPlaceHolderObject );
						sap.ui.getCore ( ).getModel ( "sapSplCreateParkingSpaceModel" ).setData ( oModelData );

						oSapSplAjaxFactory.fireAjaxCall ( {
							url : oSapSplUtils.getFQServiceUrl ( "/sap/spl/xs/app/services/containerTerminals.xsjs" ),
							method : "GET",
							async : true,
							json : true,
							success : function ( data ) {
								var oModelData = sap.ui.getCore ( ).getModel ( "sapSplCreateParkingSpaceModel" ).getData ( );
								aListOfServiceProviders = JSON.parse ( data.Data );
								oModelData["Providers"] = aListOfServiceProviders;
								oModelData["Providers"].splice ( 0, 0, oPlaceHolderObject );
								sap.ui.getCore ( ).getModel ( "sapSplCreateParkingSpaceModel" ).setData ( oModelData );
							},
							error : function ( error ) {
								if ( error && error["status"] === 500 ) {
									sap.ca.ui.message.showMessageBox ( {
										type : sap.ca.ui.message.Type.ERROR,
										message : error["status"] + "\t" + error.statusText,
										details : error.responseText
									} ).attachAfterClose ( function ( ) {
										jQuery ( ".sapUiBLy" ).css ( "z-index", "0" );
									} );
								} else {
									sap.ca.ui.message.showMessageBox ( {
										type : sap.ca.ui.message.Type.ERROR,
										message : oSapSplUtils.getBundle ( ).getText ( "INCORRECT_ARGUMENTS_ERROR_MESSAGE" ),
										details : oSapSplUtils.getErrorMessagesfromErrorPayload ( JSON.parse ( error.responseText ) )["ufErrorObject"]
									} ).attachAfterClose ( function ( ) {
										jQuery ( ".sapUiBLy" ).css ( "z-index", "0" );
									} );
								}
							}
						} );

					},

					handleSelectOfAutomaticManualStatusMode : function ( oEvent ) {
						/* Incident : 1570148824, 1570148821 */
						if ( oEvent.getParameters ( ).selected === false ) {
							this.byId ( "SelectProvidersSelectControl" ).setEnabled ( false );
							this.byId ( "SelectProvidersSelectControl" ).setSelectedKey ( null );
							this.byId ( "SapSplValueHelpForSelectEntitiesInput" ).setEnabled ( false );
							this.byId ( "SapSplValueHelpForSelectEntitiesInput" ).removeAllCustomData ( );
							this.byId ( "SapSplValueHelpForSelectEntitiesInput" ).setValue ( "" );
							this.byId ( "SapSplValueHelpForSelectEntitiesInput" ).setValueState ( "None" );
						} else {
							this.byId ( "SelectProvidersSelectControl" ).setEnabled ( true );
							if ( this.byId ( "SelectProvidersSelectControl" ).getSelectedKey ( ) !== "" && this.byId ( "SelectProvidersSelectControl" ).getSelectedKey ( ) !== "placeholder" ) {
								this.byId ( "SapSplValueHelpForSelectEntitiesInput" ).setEnabled ( true );
							} else {
								this.byId ( "SapSplValueHelpForSelectEntitiesInput" ).setEnabled ( false );
							}
						}
						oSapSplUtils.setIsDirty ( true );
					},

					handleSelectOfEntityServiceProvider : function ( oEvent ) {
						var oModelData = sap.ui.getCore ( ).getModel ( "sapSplCreateParkingSpaceModel" ).getData ( );
						var aListOfEntities = [], oPostData = null, that = this;
						if ( oEvent.getParameters ( ).selectedItem.getKey ( ) === "placeholder" ) {
							this.byId ( "SapSplValueHelpForSelectEntitiesInput" ).setEnabled ( false );
						} else {
							oSapSplUtils.setIsDirty ( true );
							oEvent.getSource ( ).removeStyleClass ( "errorBorderStyle" );
							oPostData = JSON.stringify ( {
								terminalType : oEvent.getParameters ( ).selectedItem.getKey ( )
							} );

							oSapSplAjaxFactory.fireAjaxCall ( {
								url : oSapSplUtils.getFQServiceUrl ( "/sap/spl/xs/app/services/containerTerminalList.xsjs" ),
								method : "POST",
								data : oPostData,
								async : true,
								json : true,
								success : function ( data ) {
									aListOfEntities = JSON.parse ( data.Data );
									oModelData["Entities"] = aListOfEntities;
									that.byId ( "SapSplValueHelpForSelectEntitiesInput" ).setEnabled ( true );
									sap.ui.getCore ( ).getModel ( "sapSplCreateParkingSpaceModel" ).setData ( oModelData );
								},
								error : function ( error ) {
									if ( error && error["status"] === 500 ) {
										sap.ca.ui.message.showMessageBox ( {
											type : sap.ca.ui.message.Type.ERROR,
											message : error["status"] + "\t" + error.statusText,
											details : error.responseText
										} ).attachAfterClose ( function ( ) {
											jQuery ( ".sapUiBLy" ).css ( "z-index", "0" );
										} );
									} else {
										sap.ca.ui.message.showMessageBox ( {
											type : sap.ca.ui.message.Type.ERROR,
											message : oSapSplUtils.getBundle ( ).getText ( "INCORRECT_ARGUMENTS_ERROR_MESSAGE" ),
											details : oSapSplUtils.getErrorMessagesfromErrorPayload ( JSON.parse ( error.responseText ) )["ufErrorObject"]
										} ).attachAfterClose ( function ( ) {
											jQuery ( ".sapUiBLy" ).css ( "z-index", "0" );
										} );
									}

								}
							} );
						}
					},

					handleAddParkingSpacePhoto : function ( ) {
						/* CSNFIX : 0120061532 1325332 2014 */
						this.byId ( "sapSplParkingSpaceImage" ).setSrc ( this.byId ( "sapSplParkingSpaceImageURL" ).getValue ( ) );
						this.byId ( "sapSplParkingSpaceImage" ).setVisible ( true );
						window.setTimeout ( function ( ) {
							document.getElementsByClassName ( "SapSplParkingSpaceCreateEditTimingsPlaceHolder" )[0].scrollIntoView ( );
						}, 500 );
					},

					getEmptyData : function ( oViewData ) {
						return {
							Name : "",
							PhoneNumber : "",
							Capacity : "",
							Website : "",
							ImageUrl : "",
							Timings : "",
							Providers : [],
							BuildingID : "",
							StreetName : "",
							CityName : "",
							StreetPostalCode : "",
							RegionName : "",
							CountryName : "",
							AdditionalInformation : "",
							Latitude : oViewData["Latitude"],
							Longitude : oViewData["Longitude"],
							Parking : oViewData["Parking"],
							ReportedStatus : null,
							AdditionalID : null,
							StatusProvider : null,
							ModeOfStatusUpdate : "A"
						};
					},

					fnHandleClickOfDeleteSelectedItem : function ( oEvent ) {
						var sBoundPath = oEvent.getSource ( ).getBindingContext ( ).sPath.split ( "/" );
						var oModelData = sap.ui.getCore ( ).getModel ( "sapSplCreateParkingSpaceModel" ).getData ( );
						oModelData[sBoundPath[1]][sBoundPath[2]][sBoundPath[3]]["checked"] = false;
						sap.ui.getCore ( ).getModel ( "sapSplCreateParkingSpaceModel" ).setData ( oModelData );

						// sap.ui.getCore().getModel("splParkingSpaceDetailsPopOverModel").setData(oModelData);

						this.byId ( "SapSplServicesValueHelpCell" ).getBinding ( "content" ).filter ( [this.checkedFilter, this.servicesFilter, this.removeAllFilter], true );
						this.byId ( "SapSplFuelValueHelpCell" ).getBinding ( "content" ).filter ( [this.checkedFilter, this.fuelFilter, this.removeAllFilter], true );
						this.byId ( "SapSplCardsValueHelpCell" ).getBinding ( "content" ).filter ( [this.checkedFilter, this.cardsFilter, this.removeAllFilter], true );
					},

					handleFacilitySelect : function ( oEvent ) {
						if ( oEvent.getParameters ( ).listItem.getBindingContext ( ).getProperty ( ).Name === "Select all" ) {
							for ( var i = 0 ; i < oEvent.getSource ( ).getItems ( ).length ; i++ ) {
								oEvent.getSource ( ).getItems ( )[i].setSelected ( oEvent.getParameters ( ).listItem.getBindingContext ( ).getProperty ( ).checked );
							}
						}
					},

					fnIsAllMandatoryFieldsFilled : function ( ) {
						var bReturnValue = true;
						if ( this.byId ( "SapSplParkingSpaceCreateEditPageAddressBuildingIDInput" ).getValue ( ).length === 0 ) {
							this.byId ( "SapSplParkingSpaceCreateEditPageAddressBuildingIDInput" ).setValueStateText ( oSapSplUtils.getBundle ( ).getText ( "EMPTY_ERROR_MESSAGE" ) );
							this.byId ( "SapSplParkingSpaceCreateEditPageAddressBuildingIDInput" ).setValueState ( "Error" );
							bReturnValue = false;
						} else {
							this.byId ( "SapSplParkingSpaceCreateEditPageAddressBuildingIDInput" ).setValueState ( "None" );
						}
						if ( this.byId ( "SapSplParkingSpaceCreateEditPageAddressStreetNameInput" ).getVisible ( ) === true && this.byId ( "SapSplParkingSpaceCreateEditPageAddressStreetNameInput" ).getValue ( ).length === 0 ) {
							this.byId ( "SapSplParkingSpaceCreateEditPageAddressStreetNameInput" ).setValueStateText ( oSapSplUtils.getBundle ( ).getText ( "EMPTY_ERROR_MESSAGE" ) );
							this.byId ( "SapSplParkingSpaceCreateEditPageAddressStreetNameInput" ).setValueState ( "Error" );
							bReturnValue = false;
						} else {
							this.byId ( "SapSplParkingSpaceCreateEditPageAddressStreetNameInput" ).setValueState ( "None" );
						}
						if ( this.byId ( "SapSplParkingSpaceCreateEditPageAddressCityNameInput" ).getVisible ( ) === true && this.byId ( "SapSplParkingSpaceCreateEditPageAddressCityNameInput" ).getValue ( ).length === 0 ) {
							this.byId ( "SapSplParkingSpaceCreateEditPageAddressCityNameInput" ).setValueStateText ( oSapSplUtils.getBundle ( ).getText ( "EMPTY_ERROR_MESSAGE" ) );
							this.byId ( "SapSplParkingSpaceCreateEditPageAddressCityNameInput" ).setValueState ( "Error" );
							bReturnValue = false;
						} else {
							this.byId ( "SapSplParkingSpaceCreateEditPageAddressCityNameInput" ).setValueState ( "None" );
						}
						if ( this.byId ( "SapSplParkingSpaceCreateEditPageAddressRegionCodeInput" ).getVisible ( ) === true && this.byId ( "SapSplParkingSpaceCreateEditPageAddressRegionCodeInput" ).getValue ( ).length === 0 ) {
							this.byId ( "SapSplParkingSpaceCreateEditPageAddressRegionCodeInput" ).setValueStateText ( oSapSplUtils.getBundle ( ).getText ( "EMPTY_ERROR_MESSAGE" ) );
							this.byId ( "SapSplParkingSpaceCreateEditPageAddressRegionCodeInput" ).setValueState ( "Error" );
							bReturnValue = false;
						} else {
							this.byId ( "SapSplParkingSpaceCreateEditPageAddressRegionCodeInput" ).setValueState ( "None" );
						}
						if ( this.byId ( "SapSplParkingSpaceCreateEditPageAddressCountryCodeInput" ).getVisible ( ) === true && this.byId ( "SapSplParkingSpaceCreateEditPageAddressCountryCodeInput" ).getValue ( ).length === 0 ) {
							this.byId ( "SapSplParkingSpaceCreateEditPageAddressCountryCodeInput" ).setValueStateText ( oSapSplUtils.getBundle ( ).getText ( "EMPTY_ERROR_MESSAGE" ) );
							this.byId ( "SapSplParkingSpaceCreateEditPageAddressCountryCodeInput" ).setValueState ( "Error" );
							bReturnValue = false;
						} else {
							this.byId ( "SapSplParkingSpaceCreateEditPageAddressCountryCodeInput" ).setValueState ( "None" );
						}
						if ( this.byId ( "SapSplParkingSpaceCreateEditPageAddressPostalCodeInput" ).getVisible ( ) === true && this.byId ( "SapSplParkingSpaceCreateEditPageAddressPostalCodeInput" ).getValue ( ).length === 0 ) {
							this.byId ( "SapSplParkingSpaceCreateEditPageAddressPostalCodeInput" ).setValueStateText ( oSapSplUtils.getBundle ( ).getText ( "EMPTY_ERROR_MESSAGE" ) );
							this.byId ( "SapSplParkingSpaceCreateEditPageAddressPostalCodeInput" ).setValueState ( "Error" );
							bReturnValue = false;
						} else {
							this.byId ( "SapSplParkingSpaceCreateEditPageAddressPostalCodeInput" ).setValueState ( "None" );
						}
						if ( this.byId ( "SapSplParkingSpaceCreateEditPageNameInput" ).getValue ( ).length === 0 ) {
							this.byId ( "SapSplParkingSpaceCreateEditPageNameInput" ).setValueStateText ( oSapSplUtils.getBundle ( ).getText ( "EMPTY_ERROR_MESSAGE" ) );
							this.byId ( "SapSplParkingSpaceCreateEditPageNameInput" ).setValueState ( "Error" );
							bReturnValue = false;
						} else {
							this.byId ( "SapSplParkingSpaceCreateEditPageNameInput" ).setValueState ( "None" );
						}

						if ( this.sCategory !== "P" && (this.byId ( "checkBoxAutomaticManualStatusMode" ).getSelected ( ) === true) ) {
							if ( this.byId ( "SapSplValueHelpForSelectEntitiesInput" ).getVisible ( ) && this.byId ( "SapSplValueHelpForSelectEntitiesInput" ).getValue ( ).length === 0 ) {
								this.byId ( "SapSplValueHelpForSelectEntitiesInput" ).setValueStateText ( oSapSplUtils.getBundle ( ).getText ( "EMPTY_ERROR_MESSAGE" ) );
								this.byId ( "SapSplValueHelpForSelectEntitiesInput" ).setValueState ( "Error" );
								bReturnValue = false;
							} else {
								this.byId ( "SapSplValueHelpForSelectEntitiesInput" ).setValueState ( "None" );
							}
							if ( this.byId ( "SelectProvidersSelectControl" ).getVisible ( ) && this.byId ( "SelectProvidersSelectControl" ).getSelectedKey ( ) === "placeholder" ) {
								this.byId ( "SelectProvidersSelectControl" ).addStyleClass ( "errorBorderStyle" );
								bReturnValue = false;
							} else {
								this.byId ( "SelectProvidersSelectControl" ).removeStyleClass ( "errorBorderStyle" );
							}

						} else {
							this.byId ( "SapSplValueHelpForSelectEntitiesInput" ).setValueState ( "None" );
							this.byId ( "SelectProvidersSelectControl" ).removeStyleClass ( "errorBorderStyle" );
						}
						return bReturnValue;
					},

					fnValueHelpForSelectEntityIDInCreateEditPage : function ( ) {
						this.oLeftButtonInstance.setText ( oSapSplUtils.getBundle ( ).getText ( "OK" ) );
						var navToId = this.navContainer.getPages ( )[1].sId;
						this.navContainer.to ( navToId, "slide" );
					},

					fnValueHelpForSelectInParkingSpaceCreateEditPage : function ( oEvent ) {
						this.oRightButtonInstance.removeAllCustomData ( );
						this.oRightButtonInstance.addCustomData ( new sap.ui.core.CustomData ( {
							key : "cancelButton",
							value : {
								id : "Back"
							}
						} ) );
						this.oLeftButtonInstance.setText ( oSapSplUtils.getBundle ( ).getText ( "OK" ) );

						var oModelData = this.getView ( ).getModel ( ).getData ( );
						var aParking = oModelData["Parking"]["results"];
						for ( var i = 0 ; i < aParking.length ; i++ ) {
							aParking[i]["checked"] = false;
							aParking[i]["all"] = false;
						}

						var temp = aParking[0];
						if ( temp["Name"] !== "Select all" ) {
							aParking[0] = {
								Name : "Select all",
								checked : false,
								all : true
							};
							aParking[aParking.length] = temp;
						} else {
							temp["all"] = true;
						}

						var aFuels = this.byId ( "SapSplFuelValueHelpLayout" ).getRows ( )[0].getCells ( )[0].getContent ( );
						var aCards = this.byId ( "SapSplCardsValueHelpLayout" ).getRows ( )[0].getCells ( )[0].getContent ( );
						var aServices = this.byId ( "SapSplServicesValueHelpLayout" ).getRows ( )[0].getCells ( )[0].getContent ( );

						for ( var x = 0 ; x < aFuels.length ; x++ ) {
							for ( var y = 0 ; y < aParking.length ; y++ ) {
								if ( aFuels[x].getContent ( )[0].getText ( ) === aParking[y]["Name"] ) {
									aParking[y]["checked"] = true;
								}
							}
						}

						for ( var x1 = 0 ; x1 < aCards.length ; x1++ ) {
							for ( var y1 = 0 ; y1 < aParking.length ; y1++ ) {
								if ( aCards[x1].getContent ( )[0].getText ( ) === aParking[y1]["Name"] ) {
									aParking[y1]["checked"] = true;
								}
							}
						}

						for ( var x2 = 0 ; x2 < aServices.length ; x2++ ) {
							for ( var y2 = 0 ; y2 < aParking.length ; y2++ ) {
								if ( aServices[x2].getContent ( )[0].getText ( ) === aParking[y2]["Name"] ) {
									aParking[y2]["checked"] = true;
								}
							}
						}

						oModelData["Parking"]["results"] = aParking;

						this.getView ( ).getModel ( ).setData ( oModelData );

						var sId = oEvent.getParameter ( "id" );
						var navToId = this.navContainer.getPages ( )[1].sId;
						this.navContainer.to ( navToId, "slide" );

						if ( sId.indexOf ( "Cards" ) !== -1 ) {
							this.byId ( "SapSplMultiSelectListPageTitle" ).setText ( oSapSplUtils.getBundle ( ).getText ( "CREATE_PARKING_SPACE_DIALOG_SELECT_CARDS" ) );
							this.byId ( "SapSplCreateParkingSpaceMultiSelectList" ).getBinding ( "items" ).filter ( new sap.ui.model.Filter ( [this.addAllFilter, this.cardsFilter], false ) );
							this.facilityType = "C";
						} else if ( sId.indexOf ( "Services" ) !== -1 ) {
							this.byId ( "SapSplMultiSelectListPageTitle" ).setText ( oSapSplUtils.getBundle ( ).getText ( "CREATE_PARKING_SPACE_DIALOG_SELECT_SERVICES" ) );
							this.byId ( "SapSplCreateParkingSpaceMultiSelectList" ).getBinding ( "items" ).filter ( new sap.ui.model.Filter ( [this.addAllFilter, this.servicesFilter], false ) );
							this.facilityType = "S";
						} else {
							this.byId ( "SapSplMultiSelectListPageTitle" ).setText ( oSapSplUtils.getBundle ( ).getText ( "CREATE_PARKING_SPACE_DIALOG_SELECT_FUEL" ) );
							this.byId ( "SapSplCreateParkingSpaceMultiSelectList" ).getBinding ( "items" ).filter ( new sap.ui.model.Filter ( [this.addAllFilter, this.fuelFilter], false ) );
							this.facilityType = "F";
						}
						if ( !this.tempModelData ) {
							this.tempModelData = jQuery.extend ( true, [], sap.ui.getCore ( ).getModel ( "sapSplCreateParkingSpaceModel" ).getData ( ).Parking.results );
						}
					},

					preparePayloadForPost : function ( oModelData, oViewData ) {

						var oPayLoadForPost = {}, oHeaderObject = {}, oAddressObject = {}, sGeo = "", sLocationID = "", sModeOfStatusUpdate = (this.byId ( "checkBoxAutomaticManualStatusMode" ).getSelected ( ) === true) ? "A" : "M", sStatusProvider = oModelData["StatusProvider"], sReportedStatus = oModelData["ReportedStatus"], sAdditionalID = oModelData["AdditionalID"];
						/* Incident : 1570147859 */
						if ( this.sCategory !== "P" ) {
							if ( sAdditionalID === null || sAdditionalID === undefined ) {
								if ( this.byId ( "SapSplValueHelpForSelectEntitiesInput" ).getCustomData ( ).length !== 0 ) {
									sAdditionalID = this.byId ( "SapSplValueHelpForSelectEntitiesInput" ).getCustomData ( )[0].getValue ( )["terminalId"];
								}
							}

							if ( sStatusProvider === null || sStatusProvider === undefined ) {
								if ( this.byId ( "SelectProvidersSelectControl" ).getSelectedKey ( ) !== "placeholder" ) {
									sStatusProvider = this.byId ( "SelectProvidersSelectControl" ).getSelectedItem ( ).getText ( );
								}
							}
						} else {
							sModeOfStatusUpdate = null;
						}

						oPayLoadForPost["Header"] = [];
						oPayLoadForPost["Facility"] = [];
						oPayLoadForPost["FacilityTexts"] = [];
						oPayLoadForPost["Texts"] = [];
						oPayLoadForPost["Address"] = [];
						if ( !oViewData["LocationID"] ) {
							sLocationID = oSapSplUtils.getUUID ( );
						} else {
							sLocationID = oViewData["LocationID"];
						}
						sGeo = oViewData["Longitude"] + ";" + oViewData["Latitude"] + ";" + "0.0";

						oHeaderObject["LocationID"] = sLocationID;
						oHeaderObject["Name"] = oModelData["Name"];
						oHeaderObject["OwnerID"] = oSapSplUtils.getCompanyDetails ( )["BasicInfo_CompanyID"];
						oHeaderObject["Type"] = "L00001";
						oHeaderObject["Geometry"] = oSapSplMapsDataMarshal.convertStringToGeoJSON ( sGeo );
						oHeaderObject["ParentLocationID"] = null;
						oHeaderObject["Stacked"] = "0";
						oHeaderObject["isPublic"] = "1";
						oHeaderObject["isDeleted"] = "0";
						oHeaderObject["ImageUrl"] = this.byId ( "sapSplParkingSpaceImageURL" ).getValue ( );
						oHeaderObject["Website"] = oModelData["Website"];
						oHeaderObject["WebcamUrl"] = oModelData["WebcamUrl"];
						oHeaderObject["PhoneNumber"] = oModelData["PhoneNumber"];
						oHeaderObject["AdditionalInformation"] = oModelData["AdditionalInformation"];

						oPayLoadForPost["Header"].push ( oHeaderObject );

						if ( !oModelData["AddressUUID"] ) {
							oAddressObject["UUID"] = oSapSplUtils.getUUID ( );
						} else {
							oAddressObject["UUID"] = oModelData["AddressUUID"];
						}
						oAddressObject["LocationID"] = sLocationID;
						oAddressObject["BuildingID"] = oModelData["BuildingID"];
						oAddressObject["StreetName"] = oModelData["StreetName"];
						oAddressObject["CityName"] = oModelData["CityName"];
						/* Incident : 1482016228 */
						oAddressObject["StreetPostalCode"] = oModelData["StreetPostalCode"];
						oAddressObject["RegionName"] = oModelData["RegionName"];
						oAddressObject["CountryName"] = oModelData["CountryName"];

						oPayLoadForPost["Address"].push ( oAddressObject );

						var sPSFacilityUUID = null, sCapacity = null;
						sPSFacilityUUID = oModelData["FacilityUUID"];

						var ParkingSlotFacilityObject = {};
						if ( sPSFacilityUUID ) {
							ParkingSlotFacilityObject["UUID"] = sPSFacilityUUID;
						} else {
							ParkingSlotFacilityObject["UUID"] = oSapSplUtils.getUUID ( );
						}
						ParkingSlotFacilityObject["LocationID"] = sLocationID;
						ParkingSlotFacilityObject["Name"] = this.sName;
						ParkingSlotFacilityObject["Category"] = this.sCategory;
						/* Incident : 1570172236 */
						var Exp = /((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+[0-9a-z]+$/i;

						/* CSN Fix for : 1570448310 */
						if ( oModelData["Capacity"] !== null && oModelData["Capacity"] !== undefined && !oModelData["Capacity"].toString ( ).match ( Exp ) ) {
							if ( !isNaN ( parseInt ( oModelData["Capacity"], 10 ) ) ) {
								sCapacity = parseInt ( oModelData["Capacity"], 10 );
							} else {
								sCapacity = oModelData["Capacity"];
								if ( sCapacity.length === 0 ) {
									sCapacity = null;
								}
							}
						} else {
							sCapacity = oModelData["Capacity"];
						}
						ParkingSlotFacilityObject["Capacity"] = sCapacity;
						ParkingSlotFacilityObject["ImageUrl"] = "";
						ParkingSlotFacilityObject["Website"] = null;
						ParkingSlotFacilityObject["isDeleted"] = "0";
						ParkingSlotFacilityObject["ModeOfStatusUpdate"] = sModeOfStatusUpdate;
						ParkingSlotFacilityObject["StatusProvider"] = sStatusProvider;
						ParkingSlotFacilityObject["AdditionalID"] = sAdditionalID;

						oPayLoadForPost["Facility"].push ( ParkingSlotFacilityObject );

						for ( var j = 0 ; j < oPayLoadForPost["Facility"].length ; j++ ) {
							var oFacilityTextObject = {};
							oFacilityTextObject["ObjectUUID"] = oPayLoadForPost["Facility"][j]["UUID"];
							oFacilityTextObject["Type"] = "F";
							/*
							 * CSN FIX : 0120031469 682358 2014 Remove the
							 * Language attribute from the payload
							 */
							oFacilityTextObject["LocaleLanguage"] = sap.ui.getCore ( ).getConfiguration ( ).getLanguage ( );
							oFacilityTextObject["LocationID"] = sLocationID;
							oFacilityTextObject["Text"] = "Services";

							oPayLoadForPost["FacilityTexts"].push ( oFacilityTextObject );
						}

						/*
						 * CSN FIX : 0120031469 682358 2014 Remove the Language
						 * attribute from the payload
						 */
						var oTimingsTextObject = {
							ObjectUUID : sLocationID,
							Type : "W",
							LocaleLanguage : sap.ui.getCore ( ).getConfiguration ( ).getLanguage ( ),
							LocationID : sLocationID,
							Text : oModelData["Timings"]
						};
						var oTagTextObject = {
							ObjectUUID : sLocationID,
							Type : "T",
							LocaleLanguage : sap.ui.getCore ( ).getConfiguration ( ).getLanguage ( ),
							LocationID : sLocationID,
							Text : this.oViewData["sDialogType"]
						};
						oPayLoadForPost["Texts"].push ( oTimingsTextObject );
						oPayLoadForPost["Texts"].push ( oTagTextObject );

						if ( this.sCategory !== "P" ) {
							/* Incident : 1570149074 */
							if ( sReportedStatus === null || (oModelData["ModeOfStatusUpdate"] !== sModeOfStatusUpdate) ) {
								if ( sModeOfStatusUpdate === "M" ) {
									sReportedStatus = "6";
								} else {
									sReportedStatus = "8";
								}
							}
							this.oPayLoadForDefaultStatus = {
								"FacilityAvailability" : [{
									"FacilityUUID" : ParkingSlotFacilityObject["UUID"],
									"ReportedStatus" : sReportedStatus
								}]
							};
						} else {
							this.oPayLoadForDefaultStatus = null;
						}

						return oPayLoadForPost;

					},

					fnhandlePressOfOKInEntitySelectionPage : function ( ) {
						var navToId = this.navContainer.getPages ( )[0].sId;
						this.navContainer.to ( navToId, "slide" );
						this.oRightButtonInstance.removeAllCustomData ( );
						this.oLeftButtonInstance.setText ( oSapSplUtils.getBundle ( ).getText ( "NEW_CONTACT_SAVE" ) );
					},

					fnSetDefaultStatus : function ( oPayLoad ) {
						oSapSplAjaxFactory.fireAjaxCall ( {
							url : oSapSplUtils.getServiceMetadata ( "parkingSpaceStatus", true ),
							method : "PUT",
							data : JSON.stringify ( oPayLoad ),
							success : function ( ) {},
							error : function ( ) {
								jQuery.sap.log.error ( "fnHandleChangeOfParkingSpaceStatus", "Failure of function call", "liveApp.controller.js" );
							}

						} );
					},

					setLeftButton : function ( oLeftButtonInstance ) {
						if ( oLeftButtonInstance ) {
							var that = this;
							this.oLeftButtonInstance = oLeftButtonInstance;
							oLeftButtonInstance.attachPress ( function ( oEvent ) {
								/* CSNFIX : 0120031469 684903 2014 */
								if ( oEvent.getSource ( ).getText ( ) === oSapSplUtils.getBundle ( ).getText ( "NEW_CONTACT_SAVE" ) ) {
									var sType = "PUT";
									if ( that.oViewData["mode"] && that.oViewData["mode"] === "Create" ) {
										sType = "POST";
									}
									if ( that.fnIsAllMandatoryFieldsFilled ( ) ) {

										var oModelData = sap.ui.getCore ( ).getModel ( "sapSplCreateParkingSpaceModel" ).getData ( );
										var oPayload = that.preparePayloadForPost ( oModelData, that.oViewData );

										oSapSplBusyDialog.getBusyDialogInstance ( ).open ( );
										oSapSplAjaxFactory.fireAjaxCall ( {
											url : oSapSplUtils.getServiceMetadata ( "newLocation", true ),
											method : sType,
											data : JSON.stringify ( oPayload ),
											success : function ( data, success, messageObject ) {
												oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
												if ( data.constructor === String ) {
													data = JSON.parse ( data );
												}
												if ( messageObject["status"] === 200 && data["Error"].length === 0 ) {
													if ( data && data.Header && data.Header[0] ) {
														that.oMapToolbar.getParent ( ).getParent ( ).getParent ( ).getController ( ).newCreatedVisualObject = data.Header[0].LocationID;
													} else {
														that.oMapToolbar.newCreatedVisualObject = null;
													}
// that.oMapToolbar.firePressOnMapFilter(that.oViewData["sDialogType"]);
													var sMode = sap.ui.getCore ( ).getModel ( "sapSplCreateParkingSpaceModel" ).getData ( )["mode"];
													if ( that.oPayLoadForDefaultStatus ) {
														that.fnSetDefaultStatus ( that.oPayLoadForDefaultStatus );
													}
													if ( sMode && sMode === "Edit" ) {
														sap.ca.ui.message.showMessageToast ( oSapSplUtils.getBundle ( ).getText ( "CHANGES_SAVED_SUCCESS" ) );
													} else {
														sap.ca.ui.message.showMessageToast ( oSapSplUtils.getBundle ( ).getText ( "LOCATION_SAVED_SUCCESSFULLY" ) );
													}
													that.getView ( ).getParent ( ).getParent ( ).close ( );
												} else {
													/* Fix for 1580094613 */
													var errorMessage = oSapSplUtils.getErrorMessagesfromErrorPayload ( data )["ufErrorObject"];
													sap.ca.ui.message.showMessageBox ( {
														type : sap.ca.ui.message.Type.ERROR,
														message : oSapSplUtils.getErrorMessagesfromErrorPayload ( data )["errorWarningString"],
														details : errorMessage
													}, jQuery.proxy ( that.fireCancelAction, that ) ).attachAfterClose ( function ( ) {
														jQuery ( ".sapUiBLy" ).css ( "z-index", "0" );
													} );
												}
											},
											error : function ( error ) {
												oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
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
											},
											complete : function ( ) {}
										} );
									}
								} else {
// that.fnHandlePressOfButtonWithSelection(true);
									that.fnhandlePressOfOKInEntitySelectionPage ( );
								}
							} );
						}
					},

					setToolbarInstance : function ( oMapToolbar ) {
						this.oMapToolbar = oMapToolbar;
					},

					setRightButton : function ( oRightButtonInstance ) {
						if ( oRightButtonInstance ) {
							this.oRightButtonInstance = oRightButtonInstance;
							this.oRightButtonInstance.removeAllCustomData ( );
							this.oRightButtonInstance.addCustomData ( new sap.ui.core.CustomData ( {
								key : "cancelButton",
								value : {
									id : "Cancel"
								}
							} ) );
							var that = this;
							oRightButtonInstance.attachPress ( function ( oEvent ) {
								var dialogCancelEvent = jQuery.extend ( true, {}, oEvent );
								if ( that.navContainer.getCurrentPage ( ).sId.search ( "sapSplSelectedProviderEntities" ) !== -1 ) {
// that.fnHandlePressOfButtonWithSelection(false);
									that.fnhandlePressOfOKInEntitySelectionPage ( );
								} else {
									if ( oSapSplUtils.getIsDirty ( ) ) {
										sap.m.MessageBox.show ( oSapSplUtils.getBundle ( ).getText ( "DATA_LOSS_WARNING_TEXT" ), sap.m.MessageBox.Icon.WARNING, oSapSplUtils.getBundle ( ).getText ( "WARNING" ), [sap.m.MessageBox.Action.YES,
												sap.m.MessageBox.Action.CANCEL], function ( selection ) {
											if ( selection === "YES" ) {
												dialogCancelEvent.getSource ( ).getParent ( ).close ( );
												oSapSplMapsDataMarshal.fnChangeCursor ( "Normal" );
												oSapSplUtils.setIsDirty ( false );
											} else {
												jQuery ( ".sapMDialogBlockLayerInit" ).addClass ( "sapSplHideDialogBlockerForVBMap" );
											}
										}, null, oSapSplUtils.fnSyncStyleClass ( "messageBox" ) );
									} else {
										dialogCancelEvent.getSource ( ).getParent ( ).close ( );
										oSapSplMapsDataMarshal.fnChangeCursor ( "Normal" );
									}
								}
							} );
						}
					},

					fnHandlePressOfButtonWithSelection : function ( bApplyFilter ) {
						var navToId = this.navContainer.getPages ( )[0].sId;

						var oEvent = {};
						oEvent.mParameters = {};
						oEvent.mParameters.query = "";
						this.fnSearchOfFacilities ( oEvent );

						this.navContainer.to ( navToId, "slide" );
						if ( bApplyFilter && bApplyFilter === true ) {
							this.byId ( "SapSplServicesValueHelpCell" ).getBinding ( "content" ).filter ( [this.checkedFilter, this.servicesFilter, this.removeAllFilter], true );
							this.byId ( "SapSplFuelValueHelpCell" ).getBinding ( "content" ).filter ( [this.checkedFilter, this.fuelFilter, this.removeAllFilter], true );
							this.byId ( "SapSplCardsValueHelpCell" ).getBinding ( "content" ).filter ( [this.checkedFilter, this.cardsFilter, this.removeAllFilter], true );
						}
						this.oRightButtonInstance.removeAllCustomData ( );
						this.oRightButtonInstance.addCustomData ( new sap.ui.core.CustomData ( {
							key : "cancelButton",
							value : {
								id : "Cancel"
							}
						} ) );
						this.oLeftButtonInstance.setText ( "Save" );
						window.setTimeout ( function ( ) {
							if ( document.getElementsByClassName ( "sapSplValueHelp" )[2] ) {
								document.getElementsByClassName ( "sapSplValueHelp" )[2].scrollIntoView ( );
							}
						}, 500 );
					},

					sapSplChangeDirtyFlag : function ( oEvent ) {
						oSapSplUtils.setIsDirty ( true );
						if ( oEvent.getSource ( ).getValue ( ).length > 0 ) {
							oEvent.getSource ( ).setValueState ( "None" );
						}
					},

					fnHandleLiveChangeOfImageURL : function ( oEvent ) {
						if ( oEvent.getParameter ( "newValue" ) === "" ) {
							this.byId ( "sapSplParkingSpaceAddImage" ).setEnabled ( false );
						} else {
							this.byId ( "sapSplParkingSpaceAddImage" ).setEnabled ( true );
						}
						oSapSplUtils.setIsDirty ( true );
					},

					/**
					 * @description Method to handle localization of all the hard code texts in the view.
					 * @param void.
					 * @returns void.
					 * @since 1.0
					 */
					fnDefineControlLabelsFromLocalizationBundle : function ( ) {
						this.byId ( "SapSplParkingSpaceCreateEditPageName" ).setText ( oSapSplUtils.getBundle ( ).getText ( "INCIDENTS_NAME" ) );
						this.byId ( "SapSplParkingSpaceCreateEditPageAddress" ).setText ( oSapSplUtils.getBundle ( ).getText ( "CO_ORDINATES" ) );
						this.byId ( "SapSplParkingSpaceCreateEditPageCapaity" ).setText ( oSapSplUtils.getBundle ( ).getText ( "CAPACITY_PARKING_SPACE_LABEL" ) );
						this.byId ( "SapSplParkingSpaceCreateEditPageWebsite" ).setText ( oSapSplUtils.getBundle ( ).getText ( "WEBSITE_PARKING_SPACE_LABEL" ) );
						this.byId ( "SapSplParkingSpaceCreateEditPageTimings" ).setText ( oSapSplUtils.getBundle ( ).getText ( "TIMINGS_PARKING_SPACE_LABEL" ) );
						this.byId ( "SapSplParkingSpaceCreateEditPageAddPhoto" ).setText ( oSapSplUtils.getBundle ( ).getText ( "ADD_PHOTO_PARKING_SPACE_LABEL" ) );
						this.byId ( "SapSplParkingSpaceCreateEditPageCards" ).setText ( oSapSplUtils.getBundle ( ).getText ( "CARDS_PARKING_SPACE_LABEL" ) );
						this.byId ( "SapSplParkingSpaceCreateEditPageServices" ).setText ( oSapSplUtils.getBundle ( ).getText ( "SERVICES_PARKING_SPACE_LABEL" ) );
						this.byId ( "SapSplParkingSpaceCreateEditPageFuel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "FUEL_PARKING_SPACE_LABEL" ) );
						this.byId ( "SapSplParkingSpaceCreateEditPagePhoneNumber" ).setText ( oSapSplUtils.getBundle ( ).getText ( "BP_REGISTRATION_TABLE_COLUMN_PHONE" ) );
						this.byId ( "SapSplCreateParkingSpaceMultiSelectList" ).setNoDataText ( oSapSplUtils.getBundle ( ).getText ( "NO_DATA_TEXT" ) );
						// CSN FIX : 0120031469 680367 2014
						this.byId ( "SapSplParkingSpaceCreateEditPagePhoneNumberInput" ).setPlaceholder ( oSapSplUtils.getBundle ( ).getText ( "PHONE_NUMBER_PLACEHOLDER", ["+", "+", "+"] ) );
						// CSN FIX : 0120031469 0000647626 2014
						this.byId ( "SapSplParkingSpaceCreateEditPageAddressBuildingID" ).setText ( oSapSplUtils.getBundle ( ).getText ( "HOUSE_NUMBER" ) );
						this.byId ( "SapSplParkingSpaceCreateEditPageAddressStreetName" ).setText ( oSapSplUtils.getBundle ( ).getText ( "STREET_NAME" ) );
						this.byId ( "SapSplParkingSpaceCreateEditPageAddressCityName" ).setText ( oSapSplUtils.getBundle ( ).getText ( "NEW_LOCATION_CITY_LABEL" ) );
						this.byId ( "SapSplParkingSpaceCreateEditPageAddressPostalCode" ).setText ( oSapSplUtils.getBundle ( ).getText ( "NEW_LOCATION_ZIPCODE_LABEL" ) );
						this.byId ( "SapSplParkingSpaceCreateEditPageAddressRegionCode" ).setText ( oSapSplUtils.getBundle ( ).getText ( "NEW_LOCATION_COUNRTY_LABEL" ) );
						this.byId ( "SapSplParkingSpaceCreateEditPageAddressCountryCode" ).setText ( oSapSplUtils.getBundle ( ).getText ( "NEW_LOCATION_REGION_LABEL" ) );
						this.byId ( "SapSplParkingSpaceCreateEditPageWebcamURL" ).setText ( oSapSplUtils.getBundle ( ).getText ( "WEBCAM_URL_LABEL" ) );

						this.byId ( "sapSplParkingSpaceAddImage" ).setText ( oSapSplUtils.getBundle ( ).getText ( "REFRESH_PHOTO" ) );

					},

					fnSearchOfFacilities : function ( oEvent ) {
						var searchString = oEvent.mParameters.query;
						var oSapSplFacilityList, payload, sIndex, modelData, jIndex;

						oSapSplFacilityList = this.getView ( ).byId ( "SapSplCreateParkingSpaceMultiSelectList" );

						if ( searchString.length > 2 ) {
							if ( this.facilityType === "C" ) {
								payload = this.prepareSearchPayload ( searchString, "C" );
								this.callSearchService ( payload, "C" );
							} else if ( this.facilityType === "S" ) {
								payload = this.prepareSearchPayload ( searchString, "S" );
								this.callSearchService ( payload, "S" );
							} else if ( this.facilityType === "F" ) {
								payload = this.prepareSearchPayload ( searchString, "F" );
								this.callSearchService ( payload, "F" );
							}

						} else if ( oSapSplFacilityList.getBinding ( "items" ) !== undefined ) {

							modelData = jQuery.extend ( true, {}, sap.ui.getCore ( ).getModel ( "sapSplCreateParkingSpaceModel" ).getData ( ) );

							for ( sIndex = 0 ; sIndex < modelData.Parking.results.length ; sIndex++ ) {

								for ( jIndex = 1 ; jIndex < this.tempModelData.length ; jIndex++ ) {
									if ( modelData.Parking.results[sIndex].Name === this.tempModelData[jIndex].Name ) {
										this.tempModelData[jIndex] = jQuery.extend ( true, {}, modelData.Parking.results[sIndex] );
									}
								}
							}

							modelData.Parking.results = this.tempModelData;

							this.byId ( "SapSplCreateParkingSpaceMultiSelectList" ).removeSelections ( );

							modelData.Parking.results[0].checked = false;

							sap.ui.getCore ( ).getModel ( "sapSplCreateParkingSpaceModel" ).setData ( modelData );

							this.byId ( "SapSplCreateParkingSpaceMultiSelectList" ).setModel ( sap.ui.getCore ( ).getModel ( "sapSplCreateParkingSpaceModel" ) );

							if ( this.facilityType === "C" ) {

								this.byId ( "SapSplCreateParkingSpaceMultiSelectList" ).getBinding ( "items" ).filter ( new sap.ui.model.Filter ( [this.addAllFilter, this.cardsFilter], false ) );

							} else if ( this.facilityType === "S" ) {

								this.byId ( "SapSplCreateParkingSpaceMultiSelectList" ).getBinding ( "items" ).filter ( new sap.ui.model.Filter ( [this.addAllFilter, this.servicesFilter], false ) );

							} else {

								this.byId ( "SapSplCreateParkingSpaceMultiSelectList" ).getBinding ( "items" ).filter ( new sap.ui.model.Filter ( [this.addAllFilter, this.fuelFilter], false ) );

							}

						}
					},

					fnSearchOfTerminalIDs : function ( oEvent ) {
						var sSearchString = oEvent.getParameters ( ).query;
						if ( sSearchString.length === 0 ) {
							this.byId ( "SapSplCreateParkingSpaceEntityelectList" ).getBinding ( "items" ).filter ( [] );
						} else {
							var oFilter = new sap.ui.model.Filter ( "terminalId", sap.ui.model.FilterOperator.Contains, sSearchString );
							this.byId ( "SapSplCreateParkingSpaceEntityelectList" ).getBinding ( "items" ).filter ( [oFilter] );
						}
					},

					prepareSearchPayload : function ( searchTerm, pageFlag ) {
						var payload = {};
						payload.UserID = oSapSplUtils.getLoggedOnUserDetails ( ).userId;

						payload.ObjectType = "LocationFacility";

						payload.AdditionalCriteria = {};
						if ( pageFlag === "C" ) {

							payload.AdditionalCriteria.Category = "C";
						}
						if ( pageFlag === "F" ) {

							payload.AdditionalCriteria.Category = "F";
						}
						if ( pageFlag === "S" ) {

							payload.AdditionalCriteria.Category = "S";

						}

						payload.SearchTerm = searchTerm;
						payload.FuzzinessThershold = 0.3;
						payload.MaximumNumberOfRecords = 50;
						payload.ProvideDetails = true;
						payload.SearchInNetwork = true;

						return payload;
					},

					callSearchService : function ( payload ) {

						var tempDetails = [], sIndex, jIndex, that = this, temp = {};
						var modelData = jQuery.extend ( true, {}, sap.ui.getCore ( ).getModel ( "sapSplCreateParkingSpaceModel" ).getData ( ) );

						oSapSplAjaxFactory.fireAjaxCall ( {
							url : oSapSplUtils.getFQServiceUrl ( "/sap/spl/xs/app/services/Search.xsjs" ),
							method : "POST",
							async : false,
							data : JSON.stringify ( payload ),
							success : function ( data, success, messageObject ) {
								oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
								if ( data.constructor === String ) {
									data = JSON.parse ( data );
								}
								if ( messageObject["status"] === 200 ) {

									if ( data.length > 0 ) {

										for ( sIndex = 0 ; sIndex < data.length ; sIndex++ ) {
											tempDetails.push ( data[sIndex].Details );
										}

										for ( sIndex = 0 ; sIndex < tempDetails.length ; sIndex++ ) {
											for ( jIndex = 1 ; jIndex < that.tempModelData.length ; jIndex++ ) {
												if ( tempDetails[sIndex].Name === that.tempModelData[jIndex].Name ) {
													tempDetails[sIndex] = jQuery.extend ( true, {}, that.tempModelData[jIndex] );
													break;
												}
											}
										}

										for ( sIndex = 1 ; sIndex < that.tempModelData.length ; sIndex++ ) {
											for ( jIndex = 0 ; jIndex < modelData.Parking.results.length ; jIndex++ ) {
												if ( modelData.Parking.results[sIndex].Name === that.tempModelData[jIndex].Name ) {
													that.tempModelData[sIndex] = jQuery.extend ( true, {}, modelData.Parking.results[jIndex] );
													break;
												}
											}
										}
									} else {
										tempDetails = [];
									}

									temp.results = tempDetails;
									modelData.Parking = temp;
									that.byId ( "SapSplCreateParkingSpaceMultiSelectList" ).removeSelections ( );
									that.byId ( "SapSplCreateParkingSpaceMultiSelectList" ).getModel ( ).setData ( modelData );

								} else if ( data["Error"] && data["Error"].length > 0 ) {

									temp.results = tempDetails;

									modelData.Parking = temp;

									that.byId ( "SapSplCreateParkingSpaceMultiSelectList" ).removeSelections ( );

									that.byId ( "SapSplCreateParkingSpaceMultiSelectList" ).getModel ( ).setData ( modelData );

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
								oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );

								temp.results = [];
								modelData.Parking = temp;

								that.byId ( "SapSplCreateParkingSpaceMultiSelectList" ).getModel ( ).setData ( modelData );

								if ( error && error["status"] === 500 ) {
									sap.ca.ui.message.showMessageBox ( {
										type : sap.ca.ui.message.Type.ERROR,
										message : error["status"] + "\t" + error.statusText,
										details : error.responseText
									} ).attachAfterClose ( function ( ) {
										jQuery ( ".sapUiBLy" ).css ( "z-index", "0" );
									} );
								} else {
									sap.ca.ui.message.showMessageBox ( {
										type : sap.ca.ui.message.Type.ERROR,
										message : oSapSplUtils.getBundle ( ).getText ( "INCORRECT_ARGUMENTS_ERROR_MESSAGE" ),
										details : oSapSplUtils.getErrorMessagesfromErrorPayload ( JSON.parse ( error.responseText ) )["ufErrorObject"]
									} ).attachAfterClose ( function ( ) {
										jQuery ( ".sapUiBLy" ).css ( "z-index", "0" );
									} );
								}
							},
							complete : function ( ) {

							}
						} );
					}

				} );
