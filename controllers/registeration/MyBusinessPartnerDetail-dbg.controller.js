/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
splReusable.libs.SapSplStyleSheetLoader.loadStyle ( "./resources/styles/splBusinessPartner" );

sap.ui.controller ( "splController.registeration.MyBusinessPartnerDetail", {
	splitAppInstance : null,
	/**
	 * @description Method to handle localization of all the
	 *              hard code texts in the view.
	 * @param void.
	 * @returns void.
	 * @since 1.0
	 */
	fnDefineControlLabelsFromLocalizationBundle : function ( ) {

		this.byId ( "MyBusinessPartnerDetailPage" ).setTitle ( oSapSplUtils.getBundle ( ).getText ( "MY_BUSINESS_PARTNER_DETAIL_TITLE" ) );
		this.byId ( "sapSplBusinessPartnerDetailStreet" ).setText ( oSapSplUtils.getBundle ( ).getText ( "STREET" ) );
		this.byId ( "sapSplBusinessPartnerDetailTown" ).setText ( oSapSplUtils.getBundle ( ).getText ( "TOWN" ) );
		this.byId ( "sapSplBusinessPartnerDetailDistrict" ).setText ( oSapSplUtils.getBundle ( ).getText ( "DISTRICT" ) );
		this.byId ( "sapSplBusinessPartnerDetailCountry" ).setText ( oSapSplUtils.getBundle ( ).getText ( "COUNTRY" ) );
		this.byId ( "sapSplBusinessPartnerDetailOrgPhone" ).setText ( oSapSplUtils.getBundle ( ).getText ( "PHONE" ) );
		this.byId ( "sapSplBusinessPartnerDetailMainContact" ).setText ( oSapSplUtils.getBundle ( ).getText ( "MAIN_CONTACT" ) );
		this.byId ( "sapSplBusinessPartnerDetailExternalId" ).setText ( oSapSplUtils.getBundle ( ).getText ( "EXTERNAL_ID" ) );
		this.byId ( "sapSplBusinessPartnerDetailEmail" ).setText ( oSapSplUtils.getBundle ( ).getText ( "EMAIL" ) );
		// this.byId("SapSplVehiclesDetailSharePermission").setText(oSapSplUtils.getBundle().getText("VEHICLE_SHARED_PERMISSION"));
		this.byId ( "SapSplVehiclesDetailRegistrationNumber" ).setText ( oSapSplUtils.getBundle ( ).getText ( "LICENCE_PLATE" ) );
		this.byId ( "sapSplBupaDetailNoDataLabel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "NO_BUPAS_TEXT" ) );
		this.byId ( "MyBuPaDeleteButton" ).setText ( oSapSplUtils.getBundle ( ).getText ( "TERMINATE_CONNECTION" ) );
		this.byId ( "MyBuPaDetailsEditButton" ).setText ( oSapSplUtils.getBundle ( ).getText ( "EDIT_BUPA" ) );
		this.byId ( "MyBupaEditCancel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "CANCEL_EDITBUPA" ) );
		this.byId ( "sapSplBusinessPartnerVehicleSharePermissionsTable" ).setNoDataText ( oSapSplUtils.getBundle ( ).getText ( "NO_RECORDS_AVAILABLE_MSG", oSapSplUtils.getBundle ( ).getText ( "DETAILS_MSG" ) ) );
	},

	setSplitAppInstance : function ( oInstance ) {
		this.splitAppInstance = oInstance;
	},
	/**
	 * Called every time when Icontab bar filter is Selected
	 */
	fnhandleIconTabBarSelect : function ( oEvent ) {
		var sKey = oEvent.getParameter ( "key" );
		/* Fix for Incident 1580124186 */
		var oData = sap.ui.getCore ( ).getModel ( "myBusinessPartnerDetailModel" ).getData ( );
		if ( sKey === "info" ) {
			this.byId ( "MyBuPaDetailsEditButton" ).setVisible ( splReusable.libs.SapSplModelFormatters.fnCanEditBupaDetails ( oData.canTerminate, oData.showFooterOptions ) );
		} else {
			this.byId ( "MyBuPaDetailsEditButton" ).setVisible ( false );
		}
	},

	/**
	 * Called when a controller is instantiated and its View
	 * controls (if available) are already created. Can be used
	 * to modify the View before it is displayed, to bind event
	 * handlers and do other one-time initialization.
	 */
	onInit : function ( ) {

		/*
		 * unified shell instance - which is the super parent of
		 * this view
		 */
		this.unifiedShell = null;

		/* CSNFIX : 0120031469 752982 2014 */
		/*
		 * SAPUI5 JSONModel - to be set to
		 * MyBusinessPartnerDetails view
		 */
		var myBusinessPartnerDetailModel = new sap.ui.model.json.JSONModel ( {
			noData : true,
			isClicked : false,
			showFooterOptions : false
		} );

		/*
		 * Making the myBusinessPartnerDetailModel as a named
		 * model. 1. Easily accessible from other views and
		 * model data manipulation becomes easy. 2. To enable
		 * multiple model setting on the view.
		 */
		sap.ui.getCore ( ).setModel ( myBusinessPartnerDetailModel, "myBusinessPartnerDetailModel" );

		this.getView ( ).setModel ( sap.ui.getCore ( ).getModel ( "myBusinessPartnerDetailModel" ) );

		/* Localization */
		this.fnDefineControlLabelsFromLocalizationBundle ( );
	},

	/**
	 * @description listens to event handling channel which is
	 *              previously subscribed. This is the default
	 *              call back when any navigation happens to
	 *              this view. It is called even before the
	 *              onBeforeRendering life cycle method of the
	 *              view.
	 * @param evt
	 *            event object of the navigation event.
	 * @returns void.
	 * @since 1.0
	 */
	onBeforeShow : function ( evt ) {
		var sIndex, masterList = oSapSplUtils.getCurrentMasterPageBP ( ).byId ( "myBusinessPartnerList" ), oDetailData, model;

		if ( oSapSplUtils.getCurrentDetailPageBP ( ).sId !== "MyBusinessPartnerDetail" ) {
			if ( oSapSplUtils.getCurrentDetailPageBP ( ).sId === "NewBusinessPartnerRegistrationDetail" ) {
				if ( sap.ui.getCore ( ).getModel ( "myBusinessPartnerRegisterEditModel" ).getData ( )["isCancel"] ) {
					sap.ui.getCore ( ).getModel ( "myBusinessPartnerDetailModel" ).setData ( sap.ui.getCore ( ).getModel ( "myBusinessPartnerDetailModel" ).getData ( ) );
				} else {
					sap.ui.getCore ( ).getModel ( "myBusinessPartnerDetailModel" ).setData ( evt.data.context );
				}
			} else {
				if ( oSapSplUtils.getCurrentDetailPageBP ( ).sId === "FreelancerConnectDetail" ) {
					model = "sapSplFreelancerConnectDetailModel";
				} else {
					model = "SapSplBusinessPartnerConnectDetailModel";
				}

				if ( sap.ui.getCore ( ).getModel ( model ).getData ( ).isCancel ) {
					oDetailData = sap.ui.getCore ( ).getModel ( "myBusinessPartnerDetailModel" ).getData ( );
				} else {
					oDetailData = evt.data.context;
				}
				sap.ui.getCore ( ).getModel ( "myBusinessPartnerDetailModel" ).setData ( oDetailData );
				for ( sIndex = 0 ; sIndex < masterList.getItems ( ).length ; sIndex++ ) {
					if ( masterList.getItems ( )[sIndex].sId.indexOf ( "myBusinessPartnerListItem" ) !== -1 ) {
						if ( masterList.getItems ( )[sIndex].getBindingContext ( ).getProperty ( ).UUID === oDetailData.UUID ) {
							masterList.setSelectedItem ( masterList.getItems ( )[sIndex] );
							break;
						}
					}
				}

			}
		}
	},

	/**
	 * Makes the service call to terminate the relationship wih
	 * the selected user
	 * 
	 * @param void
	 * @returns void
	 * @since 1.0
	 */
	fnTerminateRelationServiceCall : function ( ) {
		var selectedContactData = jQuery.extend ( true, {}, sap.ui.getCore ( ).getModel ( "myBusinessPartnerDetailModel" ).getData ( ) );
		var oFinalPayload = {
			"inputHasChangeMode" : true,
			"Relation" : [{
				"UUID" : selectedContactData["RelationUUID"], // The
				// relation
				// UUID
				"ChangeMode" : "D"
			}]
		};
		var encodedUrl = oSapSplUtils.getServiceMetadata ( "bupa", true );
		oSapSplBusyDialog.getBusyDialogInstance ( ).open ( );

		oSapSplAjaxFactory.fireAjaxCall ( {
			method : "PUT",
			url : encodedUrl,
			data : JSON.stringify ( oFinalPayload ),
			success : function ( oResult, textStatus, xhr ) {
				if ( oResult.constructor === String ) {
					oResult = JSON.parse ( oResult );
				}

				if ( xhr.status === 200 ) {
					if ( oResult["Error"].length > 0 ) {
						sap.ca.ui.message.showMessageBox ( {
							type : sap.ca.ui.message.Type.ERROR,
							message : oSapSplUtils.getErrorMessagesfromErrorPayload ( oResult )["errorWarningString"],
							details : oSapSplUtils.getErrorMessagesfromErrorPayload ( oResult )["ufErrorObject"]
						} );

						oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
					} else {
						oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
						sap.ca.ui.message.showMessageToast ( oSapSplUtils.getBundle ( ).getText ( "CONNECTION_TERMINATED" ) );
						sap.ui.getCore ( ).getModel ( "myBusinessPartnerListODataModel" ).refresh ( );
					}
				}
			},
			error : function ( xhr, textStatus, errorThrown ) {
				if ( xhr ) {

					sap.ca.ui.message.showMessageBox ( {
						type : oSapSplUtils.getErrorMessagesfromErrorPayload ( xhr.responseJSON )["messageTitle"],
						message : oSapSplUtils.getErrorMessagesfromErrorPayload ( xhr.responseJSON )["errorWarningString"],
						details : oSapSplUtils.getErrorMessagesfromErrorPayload ( xhr.responseJSON )["ufErrorObject"]
					} );
				}
				oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
				jQuery.sap.log.error ( errorThrown, textStatus, "MyBusinessPartnerDetail.controller.js" );
			},
			complete : function ( ) {
				oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
			}
		} );
	},

	/**
	 * Gets the data of the selected BuPa.
	 * 
	 * @param oBuPaData
	 * @returns void
	 * @since 1.0
	 * @private
	 */
	fnGetSelectedBuPaDetails : function ( oBuPaData ) {
		var oModel = sap.ui.getCore ( ).getModel ( "myBusinessPartnerListODataModel" );
		var sFilter = "$filter=isShared eq 1";
		var aResults;

		function fnSuccess ( oData ) {
			aResults = oData.results;
		}

		function fnError ( ) {

		}

		if ( oModel ) {
			oModel.read ( "/MyBusinessPartners(X" + "\'" + oSapSplUtils.base64ToHex ( oBuPaData["UUID"] ) + "\')/SharedVehicleList", null, [sFilter], false, jQuery.proxy ( fnSuccess, this ), jQuery.proxy ( fnError, this ) );
		}

		return aResults;
	},

	/**
	 * Prepares the content for the dialog based on the role of
	 * the selected BuPa
	 * 
	 * @param oBuPaData
	 * @returns oDialogContent
	 * @since 1.0
	 * @private
	 */
	fnGetDialogContent : function ( oBuPaData ) {
		var oDialogContent = new sap.ui.layout.VerticalLayout ( );
		var oBuPaDetails = this.fnGetSelectedBuPaDetails ( oBuPaData );

		var oModel = new sap.ui.model.json.JSONModel ( oBuPaDetails );

		// freight forwarder trying to terminate freight
		// forwarder
		if ( oBuPaData["isVehicleSharable"] === 1 ) {
			// If no trucks are shared
			if ( oBuPaDetails.length === 0 ) {
				oDialogContent.addContent ( new sap.m.Label ( {
					text : oSapSplUtils.getBundle ( ).getText ( "PERMANENTLY_DISCONNECT", oBuPaData["Organization_Name"] )
				} ) );
				return oDialogContent;
				// If trucks are shared in any ways.
			} else {
				oDialogContent.hasTrucks = true;
				var oFirstLabel = new sap.m.Label ( {
					text : oSapSplUtils.getBundle ( ).getText ( "PERMANENTLY_DISCONNECTING_AFFECTS_THE_FOLLOWING_ASSOCIATIONS", oBuPaData["Organization_Name"] ),
					design : "Bold"
				} ).addStyleClass ( "relationTerminatorTruckDialogLabel" );
				// var oSecondLabel = new sap.m.Label({
				// text:
				// oSapSplUtils.getBundle().getText("FOLLOWING_ASSOCIATIONS_WITH_WILL_BE_AFFECTED")
				// }).addStyleClass("relationTerminatorTruckDialogLabel");
				var oThirdLabel = new sap.m.Label ( {
					text : oSapSplUtils.getBundle ( ).getText ( "CONTINUE" ),
					design : "Bold"
				} ).addStyleClass ( "relationTerminatorTruckDialogLabel" );
				var oTrucksTable = new sap.m.Table ( {
					items : {
						path : "/",
						template : new sap.m.ColumnListItem ( {
							cells : [new sap.m.Label ( {
								text : {
									path : "RegistrationNumber"
								},

								// Fix
								// to
								// Incident
								// ID
								// 1580132783
								tooltip : {
									path : "RegistrationNumber"
								}
							} ), new sap.m.Label ( {
								text : {
									parts : [{
										path : "TourName"
									}, {
										path : "ShareDirection"
									}, {
										path : "TourActive"
									}],
									formatter : function ( sTourName, sShareDirection, sTourActive ) {
										if ( sShareDirection === "O" ) {
											return "-";
										} else {
											if ( sTourActive === null ) {
												return "-";
											} else if ( sTourActive === 0 ) {
												return sTourName;
											} else {
												return sTourName;
											}
										}
									}
								},

								// Fix
								// to
								// Incident
								// ID
								// 1580132783
								tooltip : {
									parts : [{
										path : "TourName"
									}, {
										path : "ShareDirection"
									}, {
										path : "TourActive"
									}],
									formatter : function ( sTourName, sShareDirection, sTourActive ) {
										if ( sShareDirection === "O" ) {
											return "-";
										} else {
											if ( sTourActive === null ) {
												return "-";
											} else if ( sTourActive === 0 ) {
												return sTourName;
											} else {
												return sTourName;
											}
										}
									}
								}
							} ), new sap.m.Label ( {
								text : {
									parts : [{
										path : "TourActive"
									}, {
										path : "ShareDirection"
									}],
									formatter : function ( sTourActive, sShareDirection ) {
										if ( sShareDirection === "O" ) {
											return "-";
										} else {
											if ( sTourActive === null ) {
												return oSapSplUtils.getBundle ( ).getText ( "NOT_IN_USE" );
											} else if ( sTourActive === 0 ) {
												return oSapSplUtils.getBundle ( ).getText ( "FUTURE_TOUR" );
											} else {
												this.addStyleClass ( "greenActiveLabel" );
												return oSapSplUtils.getBundle ( ).getText ( "FILTER_LABEL_ACTIVE" );
											}
										}
									}
								},

								// Fix
								// to
								// Incident
								// ID
								// 1580132783
								tooltip : {
									parts : [{
										path : "TourActive"
									}, {
										path : "ShareDirection"
									}],
									formatter : function ( sTourActive, sShareDirection ) {
										if ( sShareDirection === "O" ) {
											return "-";
										} else {
											if ( sTourActive === null ) {
												return oSapSplUtils.getBundle ( ).getText ( "NOT_IN_USE" );
											} else if ( sTourActive === 0 ) {
												return oSapSplUtils.getBundle ( ).getText ( "FUTURE_TOUR" );
											} else {
												this.addStyleClass ( "greenActiveLabel" );
												return oSapSplUtils.getBundle ( ).getText ( "FILTER_LABEL_ACTIVE" );
											}
										}
									}
								}
							} ), new sap.m.Label ( {
								text : {
									parts : [{
										path : "TourDate"
									}, {
										path : "ShareDirection"
									}, {
										path : "TourActive"
									}],
									formatter : function ( sTourDate, sShareDirection, sTourActive ) {
										if ( sShareDirection === "O" ) {
											return "-";
										} else {
											if ( sTourActive === null ) {
												return "-";
											} else if ( sTourActive === 0 ) {
												return sTourDate;
											} else {
												return sTourDate;
											}
										}
									}
								},

								// Fix
								// to
								// Incident
								// ID
								// 1580132783
								tooltip : {
									parts : [{
										path : "TourDate"
									}, {
										path : "ShareDirection"
									}, {
										path : "TourActive"
									}],
									formatter : function ( sTourDate, sShareDirection, sTourActive ) {
										if ( sShareDirection === "O" ) {
											return "-";
										} else {
											if ( sTourActive === null ) {
												return "-";
											} else if ( sTourActive === 0 ) {
												return sTourDate;
											} else {
												return sTourDate;
											}
										}
									}
								}
							} ), new sap.m.Label ( {
								text : {
									parts : [{
										path : "TourActive"
									}, {
										path : "ShareDirection"
									}, {
										path : "TourActive"
									}],
									formatter : function ( sTourName, sShareDirection, sTourActive ) {
										if ( sShareDirection === "O" ) {
											return oSapSplUtils.getBundle ( ).getText ( "TRUCK_WILL_BE_UNSHARED" );
										} else {
											if ( sTourActive === null ) {
												return oSapSplUtils.getBundle ( ).getText ( "TRUCK_WILL_BE_UNSHARED" );
											} else if ( sTourActive === 0 ) {
												return oSapSplUtils.getBundle ( ).getText ( "TRUCK_WILL_BE_UNSHARED_ON_TOUR_COMPLETION" );
											} else {
												return oSapSplUtils.getBundle ( ).getText ( "TRUCK_WILL_BE_UNSHARED" );
											}
										}
									}
								},

								// Fix
								// to
								// Incident
								// ID
								// 1580132783
								tooltip : {
									parts : [{
										path : "TourActive"
									}, {
										path : "ShareDirection"
									}, {
										path : "TourActive"
									}],
									formatter : function ( sTourName, sShareDirection, sTourActive ) {
										if ( sShareDirection === "O" ) {
											return oSapSplUtils.getBundle ( ).getText ( "TRUCK_WILL_BE_UNSHARED" );
										} else {
											if ( sTourActive === null ) {
												return oSapSplUtils.getBundle ( ).getText ( "TRUCK_WILL_BE_UNSHARED" );
											} else if ( sTourActive === 0 ) {
												return oSapSplUtils.getBundle ( ).getText ( "TRUCK_WILL_BE_UNSHARED_ON_TOUR_COMPLETION" );
											} else {
												return oSapSplUtils.getBundle ( ).getText ( "TRUCK_WILL_BE_UNSHARED" );
											}
										}
									}
								}
							} )]
						} )
					},
					columns : [new sap.m.Column ( {
						header : new sap.m.Text ( {
							text : oSapSplUtils.getBundle ( ).getText ( "TRUCK_S" )
						} )
					} ), new sap.m.Column ( {
						header : new sap.m.Text ( {
							text : oSapSplUtils.getBundle ( ).getText ( "TOUR_NAME" )
						} )
					} ), new sap.m.Column ( {
						header : new sap.m.Text ( {
							text : oSapSplUtils.getBundle ( ).getText ( "TOUR_STATUS" )
						} )
					} ), new sap.m.Column ( {
						header : new sap.m.Text ( {
							text : oSapSplUtils.getBundle ( ).getText ( "TOUR_DATE" )
						} )
					} ), new sap.m.Column ( {
						header : new sap.m.Text ( {
							text : oSapSplUtils.getBundle ( ).getText ( "RESULT_OF_TERMINATION" )
						} )
					} )]
				} ).setModel ( oModel ).addStyleClass ( "relationTerminatorTruckDialogTable" );

				oDialogContent.addContent ( oFirstLabel ).addContent ( oTrucksTable ).addContent ( oThirdLabel );
				return oDialogContent;
			}
			// Other three scenarios ( ff to parking, parking to
			// ff, parking to
			// parking )
		} else {
			oDialogContent.addContent ( new sap.m.Label ( {
				text : oSapSplUtils.getBundle ( ).getText ( "PERMANENTLY_DISCONNECT", oBuPaData["Organization_Name"] )
			} ) );
			return oDialogContent;
		}
	},

	/**
	 * Handles the termination of relationship with PuBa
	 * 
	 * @param void
	 * @return void
	 * @since 1.0
	 * @private
	 */

	fnRelationTerminator : function ( ) {
		/* fix for incident 1580139424 */
		var that = this;
		var selectedBupaDetailsData = sap.ui.getCore ( ).getModel ( "myBusinessPartnerDetailModel" ).getData ( );
		if ( oSapSplUtils.getIsDirty ( ) ) {
			sap.m.MessageBox.show ( oSapSplUtils.getBundle ( ).getText ( "DATA_LOSS_WARNING_TEXT" ), sap.m.MessageBox.Icon.WARNING, oSapSplUtils.getBundle ( ).getText ( "WARNING" ), [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
					function ( selection ) {
						if ( selection === "YES" ) {
							oSapSplUtils.setIsDirty ( false );
							that.byId ( "MyBuPaDetailsEditButton" ).setText ( oSapSplUtils.getBundle ( ).getText ( "EDIT_BUPA" ) );
							that.byId ( "MyBupaEditCancel" ).setVisible ( false );
							selectedBupaDetailsData["Editable"] = false;
							selectedBupaDetailsData["ExternalInstanceID"] = selectedBupaDetailsData["ExternalInstanceIDInitial"];
							sap.ui.getCore ( ).getModel ( "myBusinessPartnerDetailModel" ).setData ( selectedBupaDetailsData );
							that.fnHandleRelationTerminate ( );
						}
					} );
		} else {
			selectedBupaDetailsData["Editable"] = false;
			sap.ui.getCore ( ).getModel ( "myBusinessPartnerDetailModel" ).setData ( selectedBupaDetailsData );
			this.byId ( "MyBupaEditCancel" ).setVisible ( false );
			this.byId ( "MyBuPaDetailsEditButton" ).setText ( oSapSplUtils.getBundle ( ).getText ( "EDIT_BUPA" ) );
			this.fnHandleRelationTerminate ( );
		}

	},

	fnHandleRelationTerminate : function ( ) {
		var that = this, oDialogContent;
		var selectedContactData = jQuery.extend ( true, {}, sap.ui.getCore ( ).getModel ( "myBusinessPartnerDetailModel" ).getData ( ) );
		
		oSapSplBusyDialog.getBusyDialogInstance ( ).open ( );
		
		//To fix incident 1580181804
		setTimeout(function(){
			oDialogContent = that.fnGetDialogContent ( selectedContactData );
			
			that.oTerminateConnectionDetailsDialog = new sap.m.Dialog ( {
				title : oSapSplUtils.getBundle ( ).getText ( "TERMINATE_CONNECTION" ),
				beginButton : new sap.m.Button ( {
					text : oSapSplUtils.getBundle ( ).getText ( "OK" ),
					press : function ( ) {
						that.fnTerminateRelationServiceCall ( );
						this.getParent ( ).close ( );
					}
				} ),
				endButton : new sap.m.Button ( {
					text : oSapSplUtils.getBundle ( ).getText ( "CANCEL" ),
					press : function ( ) {
						this.getParent ( ).close ( );
					}
				} ),
				content : oDialogContent
			} );

			if ( oDialogContent.hasTrucks === true ) {
				that.oTerminateConnectionDetailsDialog.setContentWidth ( "50%" );
			}
			
			oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
			
			that.oTerminateConnectionDetailsDialog.open ( ).attachAfterOpen ( function ( ) {
				// sync style class for the dialog
				oSapSplUtils.fnSyncStyleClass ( that.oTerminateConnectionDetailsDialog );
			} );
		},100);
		

		
	},

	/**
	 * @description Getter method to get the unified shell
	 *              instance which is the super parent of this
	 *              view.
	 * @param void.
	 * @returns this.unifiedShell the unified shell instance
	 *          previously set to this view during
	 *          instantiation.
	 * @since 1.0
	 */
	getUnifiedShellInstance : function ( ) {
		return this.unifiedShell;
	},

	/**
	 * @description Setter method to set the unified shell
	 *              instance which is the super parent of this
	 *              view.
	 * @param void.
	 * @returns void.
	 * @since 1.0
	 */
	setUnifiedShellInstance : function ( oUnifiedShellInstance ) {
		this.unifiedShell = oUnifiedShellInstance;
	},
	/**
	 * @description method to prepare payload for update service
	 *              of Bupa tile
	 * @param selectedBupa.
	 * @returns {object}payload.
	 */
	preparePayload : function ( SelectedBusinessPartnerEdit ) {
		var payload = {};
		var Relation = [];
		var temparray = {};
		/* fix for incident 1580139424 */
		if ( SelectedBusinessPartnerEdit["ExternalInstanceID"] === "" ) {
			SelectedBusinessPartnerEdit["ExternalInstanceID"] = null;
		}
		temparray["UUID"] = SelectedBusinessPartnerEdit["RelationUUID"];
		temparray["ExternalInstanceID"] = SelectedBusinessPartnerEdit["ExternalInstanceID"];
		temparray["Status"] = SelectedBusinessPartnerEdit["Status"];
		Relation.push ( temparray );
		payload["inputHasChangeMode"] = true;
		payload["Relation"] = Relation;
		return payload;
	},
	/**
	 * @description Setter method to set edit mode for Bupa
	 *              details which will let the admin enter
	 *              External ID in BUPA Details
	 * @param void.
	 * @returns void.
	 */
	fnEditBupaDetails : function ( oEvent ) {

		var selectedBupaDetailsData = sap.ui.getCore ( ).getModel ( "myBusinessPartnerDetailModel" ).getData ( );
		this.byId ( "sapSplBusinessPartnerExternalIdInput" ).removeStyleClass ( "SapSplBusinessPartnerExternalIDInputViewMode" );
		this.byId ( "sapSplBusinessPartnerDetailExternalIdMessage" ).setText ( oSapSplUtils.getBundle ( ).getText ( "EXTERNALID_MESSAGE", [selectedBupaDetailsData["Organization_Name"]] ) );

		if ( oEvent.getSource ( ).getText ( ) == oSapSplUtils.getBundle ( ).getText ( "EDIT_BUPA" ) ) {

			selectedBupaDetailsData["Editable"] = true;
			
			sap.ui.getCore ( ).getModel ( "myBusinessPartnerDetailModel" ).setData ( selectedBupaDetailsData );
			this.byId ( "MyBuPaDetailsEditButton" ).setText ( oSapSplUtils.getBundle ( ).getText ( "SAVE_BUPADETAILS" ) );
			this.byId ( "MyBupaEditCancel" ).setVisible ( true );
			/*Solution to incident 1580182608*/
			setTimeout(function(){
				sap.ui.getCore ( ).byId ( "MyBusinessPartnerDetail--sapSplBusinessPartnerExternalIdInput" ).focus ( );	
			},1000);
		} else if ( oEvent.getSource ( ).getText ( ) == oSapSplUtils.getBundle ( ).getText ( "SAVE_BUPADETAILS" ) ) {
			var that = this;
			var bupaEditUrl = oSapSplUtils.getServiceMetadata ( "bupa", true );

			var payload = that.preparePayload ( selectedBupaDetailsData );

			oSapSplAjaxFactory.fireAjaxCall ( {
				method : "PUT",
				url : bupaEditUrl,
				data : JSON.stringify ( payload ),
				success : function ( ) {

					that.byId ( "MyBupaEditCancel" ).setVisible ( false );
					that.byId ( "MyBuPaDetailsEditButton" ).setText ( oSapSplUtils.getBundle ( ).getText ( "EDIT_BUPA" ) );
					selectedBupaDetailsData["Editable"] = false;
					that.byId ( "MyBusinessPartnerDetail--sapSplBusinessPartnerExternalIdInput" ).addStyleClass ( "SapSplBusinessPartnerExternalIDInputViewMode" );
					sap.ui.getCore ( ).getModel ( "myBusinessPartnerDetailModel" ).setData ( selectedBupaDetailsData );

				},

				error : function ( xhr, textStatus, errorThrown ) {

					if ( xhr ) {

						oSapSplAppErrorHandler.show ( xhr, true, function ( ) {}, function ( ) {}, function ( ) {}, function ( ) {} );
					}
					oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
					jQuery.sap.log.error ( errorThrown, textStatus, "MyBusinessPartnerDetail.controller.js" );
				},
				complete : function ( ) {
					oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
				}
			} );

		}

	},
	/**
	 * @description Setter method to exit from edit mode in BUPA
	 *              Details Page
	 * @param void.
	 * @returns void.
	 */
	fnCancelEditBupaDetails : function ( ) {
		var that = this;
		/* fix for incident 1580139424 */
		var selectedBupaDetailsData = sap.ui.getCore ( ).getModel ( "myBusinessPartnerDetailModel" ).getData ( );
		if ( oSapSplUtils.getIsDirty ( ) ) {
			sap.m.MessageBox.show ( oSapSplUtils.getBundle ( ).getText ( "DATA_LOSS_WARNING_TEXT" ), sap.m.MessageBox.Icon.WARNING, oSapSplUtils.getBundle ( ).getText ( "WARNING" ), [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
					function ( selection ) {
						if ( selection === "YES" ) {
							that.byId ( "sapSplBusinessPartnerExternalIdInput" ).addStyleClass ( "SapSplBusinessPartnerExternalIDInputViewMode" );
							that.byId("sapSplBusinessPartnerExternalIdInput").setValue(selectedBupaDetailsData.ExternalInstanceID);
							oSapSplUtils.setIsDirty ( false );
							that.byId ( "MyBuPaDetailsEditButton" ).setText ( oSapSplUtils.getBundle ( ).getText ( "EDIT_BUPA" ) );
							that.byId ( "MyBupaEditCancel" ).setVisible ( false );
							selectedBupaDetailsData["Editable"] = false;
							selectedBupaDetailsData["ExternalInstanceID"] = selectedBupaDetailsData["ExternalInstanceIDInitial"];
							sap.ui.getCore ( ).getModel ( "myBusinessPartnerDetailModel" ).setData ( selectedBupaDetailsData );
						}
					} );
		} else {
			selectedBupaDetailsData["Editable"] = false;
			sap.ui.getCore ( ).getModel ( "myBusinessPartnerDetailModel" ).setData ( selectedBupaDetailsData );
			this.byId ( "MyBupaEditCancel" ).setVisible ( false );
			this.byId ( "MyBuPaDetailsEditButton" ).setText ( oSapSplUtils.getBundle ( ).getText ( "EDIT_BUPA" ) );
		}
		/*Solution to incident 1580182608*/
		setTimeout(function(){
			sap.ui.getCore().byId("MyBusinessPartnerMaster--sapSplSearchBusinessPartnerMasterList").focus();
		},1000);
	},
	/**
	 * @description Method to capture the dirty state of the new
	 *              truck screen.
	 * @param void.
	 * @returns void.
	 * @since 1.0
	 */
	/* fix for incident 1580139424 */
	fnToCaptureLiveChangeToSetFlag : function ( ) {
		var selectedBupaDetailsData = sap.ui.getCore ( ).getModel ( "myBusinessPartnerDetailModel" ).getData ( );
		if ( this.byId ( "sapSplBusinessPartnerExternalIdInput" ).getValue ( ) != selectedBupaDetailsData["ExternalInstanceIDInitial"] ) {
			oSapSplUtils.setIsDirty ( true );
		} else {
			oSapSplUtils.setIsDirty ( false );
		}
	}

} );
