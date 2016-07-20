/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.require ( "sap.ca.ui.message.message" );
sap.ui.controller ( "splController.dialogs.SplSendMessageDialog",
		{

			/**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 */
			onInit : function ( ) {
				var that = this;
				oSapSplUtils.setIsDirty ( false );
				this.byId ( "SapSplMessageValidFromDateTime" ).setValue ( new Date ( ) );
				this.byId ( "SapSplMessageValidToDateTime" ).setValue ( new Date ( new Date ( ).getTime ( ) + 120 * 60000 ) );

				this.navContainer = this.byId ( "SapSplSendMessageNavContainer" );

				this.oSapSplValueHelpForSelectGeofencesInput = this.byId ( "SapSplValueHelpForSelectGeofencesInput" );
				sap.ui.getCore ( ).setModel ( new sap.ui.model.json.JSONModel ( ), "sapSplSendMessageSelectDialogModel" );
				this.byId ( "SapSplSendMessageSelectDialogList" ).setModel ( sap.ui.getCore ( ).getModel ( "sapSplSendMessageSelectDialogModel" ) );
				this.byId ( "SapSplSendMessageSelectDialogListIncident" ).setModel ( sap.ui.getCore ( ).getModel ( "sapSplSendMessageSelectDialogModel" ) );
				this.byId ( "SapSplSendMessageSelectViewList" ).setModel ( sap.ui.getCore ( ).getModel ( "sapSplSendMessageSelectDialogModel" ) );

				this.byId ( "SapSplMessageValidFromDateTime" ).addCustomData ( new sap.ui.core.CustomData ( {
					key : "type",
					value : "From"
				} ) );
				this.byId ( "SapSplMessageValidToDateTime" ).addCustomData ( new sap.ui.core.CustomData ( {
					key : "type",
					value : "To"
				} ) );
				this.getDataForGeofencesAndIncidents ( );
				/* Localization */
				this.fnDefineControlLabelsFromLocalizationBundle ( );
				this.oViewData = this.getView ( ).getViewData ( );

				if ( sap.ui.getCore ( ).getModel ( "sapSplAppConfigDataModel" ).getData ( )["isIncidentEditable"] === 0 ) {
					this.byId ( "sapSplMessageToRecipientMessageFieldLayout" ).removeContent ( 1 );
				} else {
					this.byId ( "sapSplAttachIncidentLink" ).setText ( oSapSplUtils.getBundle ( ).getText ( "ATTACH_INCIDENT_LINK" ) );
				}

				if ( this.oViewData && (this.oViewData["mode"] === "Trucks" || this.oViewData["mode"] === "All_Trucks") || (this.oViewData["mode"] === "Views") ) {
					/* CSNFIX 0120061532 0001318872 2014 */
					this.byId ( "SapSplMessageReceipientsLabel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "SEND_MESSAGE_RECIPIENTS_TRUCK" ) );
					this.byId ( "SapSplMessageValidFromDateTime" ).setVisible ( false );
					this.byId ( "SapSplMessageValidToDateTime" ).setVisible ( false );
					this.byId ( "SapSplGeofencesValueHelpCell" ).getParent ( ).getParent ( ).removeStyleClass ( "valueHelpMainLayout" ).addStyleClass ( "valueHelpMainLayoutForTruck" );
					this.byId ( "SapSplValueHelpForSelectGeofencesInput" ).setVisible ( false );
					this.byId ( "SapSplGeofencesValueHelpCell" ).destroyContent ( );
					if ( this.oViewData["Reg"] && this.oViewData["ID"] ) {
						this.byId ( "SapSplGeofencesValueHelpCell" ).addContent ( this.getSelectedItemLayout ( {
							Reg : this.oViewData["Reg"],
							ID : this.oViewData["ID"]
						}, "truck", this.oViewData["bAllowDelete"] ) );
					} else {
						if ( this.oViewData["mode"] !== "Views" ) {
							this.byId ( "SapSplGeofencesValueHelpCell" ).addContent ( new sap.m.Text ( {
								text : oSapSplUtils.getBundle ( ).getText ( "SEND_MESSAGE_DIALOG_SELECT_TRUCKS" )
							} ).addStyleClass ( "selectTruckOnMapPlaceholder" ) );
						} else {
							this.byId ( "SapSplGeofencesValueHelpCell" ).addStyleClass ( "selectTruckOnMapPlaceholder" );
						}

					}
					if ( this.oViewData["mode"] === "All_Trucks" ) {
						for ( var i = 0 ; i < this.oViewData["trucks"].length ; i++ ) {
							oSapSplMapsDataMarshal.fnSelectDeselectTrucks ( this.oViewData["trucks"][i], this.oViewData["liveAppInstance"], function ( aResults ) {
								var aSelectedTrucks = [];
								for ( var i = 0 ; i < aResults.length ; i++ ) {
									var oTruckObject = {};
									oTruckObject["ID"] = aResults[i]["DeviceUUID"];
									oTruckObject["Position"] = aResults[i]["Position"];
									oTruckObject["TourName"] = aResults[i]["TourName"];
									if ( aResults[i]["RegistrationNumber"] === null ) {
										oTruckObject["Reg"] = oSapSplUtils.getBundle ( ).getText ( "TRUCK" );
									} else {
										oTruckObject["Reg"] = aResults[i]["RegistrationNumber"];
									}
									aSelectedTrucks.push ( oTruckObject );
								}
								that.fnHandleClickOfTrucksOnTheMap ( aSelectedTrucks );
							}, true );
						}
					}

				}
				// Setting initial view for nav container
				if ( this.oViewData && (this.oViewData["mode"] === "Views") ) {
					this.navContainer.to ( this.navContainer.getPages ( )[1].sId );
					this.byId ( "SapSplSendMessageSelectViewList" ).setModel ( sap.ui.getCore ( ).getModel ( "LiveAppODataModel" ) );
					var oSorter = new sap.ui.model.Sorter ( "isMyCompanyView", false, function ( oContext ) {
						var sOwnerName = oContext.getProperty ( "OwnerName" );
						var iIsMyCompanyView = oContext.getProperty ( "isMyCompanyView" );
						if ( iIsMyCompanyView === 1 ) {
							return {
								key : "My Owner",
								text : "{splI18NModel>MY_COMPANY_DISPLAY_AREAS}"
							};
						} else {
							return {
								key : sOwnerName,
								text : sOwnerName
							};
						}
					} );

					this.byId ( "SapSplSendMessageSelectViewList" ).getBinding ( "items" ).sort ( oSorter );
					this.byId ( "SapSplSendMessageSelectViewList" ).addEventDelegate ( {
						onAfterRendering : function ( oEvent ) {
							oEvent.srcControl.setBusy ( false );
							var sSelectedDisplayArea = that.getView ( ).getViewData ( ).sSelectedDisplayArea;
							if ( oEvent.srcControl.getItems ( ).length > 0 ) {
								if ( sSelectedDisplayArea !== oSapSplUtils.getBundle ( ).getText ( "SELECT_DISPLAY_AREA" ) ) {
									for ( var i = 0 ; i < oEvent.srcControl.getItems ( ).length ; i++ ) {
										if ( oEvent.srcControl.getItems ( )[i].getTitle ( ) === sSelectedDisplayArea ) {
											oEvent.srcControl.getItems ( )[i].setSelected ( true );
											break;
										}
									}
								}
							}
						}
					} );
				} else {
					this.navContainer.setInitialPage ( this.navContainer.getPages ( )[0].sId );
				}

				this.getView ( ).addEventDelegate ( {
					onAfterRendering : function ( ) {
						setTimeout ( function ( ) {
							that.getView ( ).getParent ( ).getParent ( ).$ ( ).css ( "top", "100px" );
							that.getView ( ).getParent ( ).getParent ( ).$ ( ).css ( "left", "90px" );
						}, 1500 );
						if ( that.getView ( ).byId ( "SapSplMessageReceipientsLabel" ).getText ( ) !== oSapSplUtils.getBundle ( ).getText ( "SEND_MESSAGE_RECIPIENTS_GEOFENCE" ) ) {
							setTimeout ( function ( ) {
								that.byId ( "SapSplMessageFromIncidentInput" ).focus ( );
							}, 1000 );
						} else {
							setTimeout ( function ( ) {
								if ( that.byId ( "SapSplValueHelpForSelectGeofencesInput" ) ) {
									that.byId ( "SapSplValueHelpForSelectGeofencesInput" ).focus ( );
								}
							}, 1000 );
						}
					}
				} );

				this.byId ( "SapSplSendMessagesPage" ).addEventDelegate ( {
					onAfterShow : function ( ) {
						setTimeout ( function ( ) {
							if ( that.byId ( "SapSplValueHelpForSelectGeofencesInput" ) ) {
								that.byId ( "SapSplValueHelpForSelectGeofencesInput" ).focus ( );
							}
						}, 100 );
					}
				} );

				this.byId ( "SapSplSendMessageSelectGeofencePage" ).addEventDelegate ( {
					onAfterShow : function ( ) {
						setTimeout ( function ( ) {
							that.byId ( "SapSplsearchOfGeofences" ).focus ( );
						}, 500 );
					}
				} );
			},

			/* CSNFIX : 0120031469 0000664388 2014 */
			/**
			 * @description Method to handle the change event on recipient input field.
			 * @param oEvent event object.
			 * @returns void.
			 * @since 1.0
			 */
			fnHandleChangeOfInputField : function ( oEvent ) {
				oEvent.getSource ( ).setValue ( "" );
			},

			/**
			 * @description Method to handle localization of all the hard code texts in the view.
			 * @param void.
			 * @returns void.
			 * @since 1.0
			 */
			fnDefineControlLabelsFromLocalizationBundle : function ( ) {
				this.byId ( "SapSplSendMessagesPage" ).setTitle ( oSapSplUtils.getBundle ( ).getText ( "SEND_MESSAGE_DIALOG_TITLE" ) );
				this.byId ( "SapSplSendMessageSelectViewPage" ).setTitle ( oSapSplUtils.getBundle ( ).getText ( "SEND_MESSAGE_VIA_VIEW_DIALOG_TITLE" ) );

				/* CSNFIX 0120061532 0001318872 2014 */
				this.byId ( "SapSplMessageReceipientsLabel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "SEND_MESSAGE_RECIPIENTS_GEOFENCE" ) );
				this.byId ( "SapSplValueHelpForSelectGeofencesInput" ).setPlaceholder ( oSapSplUtils.getBundle ( ).getText ( "SEND_MESSAGE_SELECT_GEOFENCE" ) );
				this.byId ( "SapSplIncidentMessageLabel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "INCIDENTS_MESSAGE" ) );
				this.byId ( "SapSplMessageValidFrom" ).setText ( oSapSplUtils.getBundle ( ).getText ( "SEND_MESSAGE_VALID_FROM" ) );
				this.byId ( "SapSplMessageValidTo" ).setText ( oSapSplUtils.getBundle ( ).getText ( "SEND_MESSAGE_VALID_UNTIL" ) );
				this.byId ( "SapSplMessagePriorityLabel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "INCIDENTS_PRIORITY" ) );
				this.byId ( "SapSplSendMessageSelectDialogList" ).setNoDataText ( oSapSplUtils.getBundle ( ).getText ( "NO_DATA_TEXT" ) );
				this.byId ( "SapSplSendMessageSelectDialogListIncident" ).setNoDataText ( oSapSplUtils.getBundle ( ).getText ( "NO_DATA_TEXT" ) );
				/* CSNFIX : 0120031469 0000635429 2014 */
				this.byId ( "SapSplPriorityRadioButton_1" ).setText ( oSapSplUtils.getBundle ( ).getText ( "INCIDENTS_PRIORITY_1" ) );
				this.byId ( "SapSplPriorityRadioButton_2" ).setText ( oSapSplUtils.getBundle ( ).getText ( "INCIDENTS_PRIORITY_2" ) );
				this.byId ( "SapSplPriorityRadioButton_3" ).setText ( oSapSplUtils.getBundle ( ).getText ( "INCIDENTS_PRIORITY_3" ) );
				this.byId ( "SapSplPriorityRadioButton_4" ).setText ( oSapSplUtils.getBundle ( ).getText ( "INCIDENTS_PRIORITY_4" ) );
			},

			/**
			 * @description method to make odata read to fetch the geofence and incident details
			 * @param void.
			 * @returns void.
			 * @since 1.0
			 */
			getDataForGeofencesAndIncidents : function ( ) {
				if ( !this.oSapSplApplModel ) {
					this.oSapSplApplModel = new splModels.odata.ODataModel ( {
						url : oSapSplUtils.getServiceMetadata ( "app", true ),
						json : true,
						user : undefined,
						password : undefined,
						headers : {
							"Cache-Control" : "max-age=0"
						},
						tokenHandling : true,
						withCredentials : false,
						loadMetadataAsync : true,
						handleTimeOut : true,
						numberOfSecondsBeforeTimeOut : 10000
					} );
				}

				this.oSapSplApplModel.read ( "/MyLocations", null, ["$filter=((Tag eq 'LC0004' or Tag eq 'LC0008') and isMyOrgObject eq '1') or ((Tag eq 'LC0004' or Tag eq 'LC0008') and isPublic eq '1') "], true, jQuery.proxy (
						this.fnSuccessOfMyLocationsRead, this ), jQuery.proxy ( this.fnFailOfMyLocationsRead, this ) );
				this.oSapSplApplModel.read ( "/IncidentDetails", null, ["$filter=isDeleted eq '0'"], true, jQuery.proxy ( this.fnSuccessOfIncidentsRead, this ), jQuery.proxy ( this.fnFailOfIncidentsRead, this ) );
			},

			fnSuccessOfMyLocationsRead : function ( oResults ) {
				var oSelectDialogModelData = {};
				var aArrayOfGeofences = [];
				var oAllObject = {};
				oAllObject["bIsSelected"] = false;
				oAllObject["Name"] = oSapSplUtils.getBundle ( ).getText ( "FILTER_LABEL_ALL" );
				oAllObject["TitleID"] = oSapSplUtils.getBundle ( ).getText ( "FILTER_LABEL_ALL" );

				aArrayOfGeofences.push ( oAllObject );

				for ( var i = 0 ; i < oResults.results.length ; i++ ) {
					oResults.results[i]["bIsSelected"] = false;
					aArrayOfGeofences.push ( oResults.results[i] );
				}
				// oModel = new
				// sap.ui.model.json.JSONModel({Geofences:oResults.results});
				sap.ui.getCore ( ).getModel ( "sapSplSendMessageSelectDialogModel" ).setSizeLimit ( oResults.results.length + 1 );
				oSelectDialogModelData = sap.ui.getCore ( ).getModel ( "sapSplSendMessageSelectDialogModel" ).getData ( );
				oSelectDialogModelData["Geofences"] = aArrayOfGeofences;
				sap.ui.getCore ( ).getModel ( "sapSplSendMessageSelectDialogModel" ).setData ( oSelectDialogModelData );
				this.oSapSplValueHelpForSelectGeofencesInput.setModel ( sap.ui.getCore ( ).getModel ( "sapSplSendMessageSelectDialogModel" ) );
			},

			fnHandleSelectOfViewItem : function ( oEvent ) {
				var that = this;
				/* Fix for Incident : 1570452539 */
				if ( this.byId ( "SapSplSendMessageSelectViewList" ).getSelectedItem ( ).getCustomData ( ).length === 0 ) {
					this.navContainer.to ( this.navContainer.getPages ( )[0].sId, "slide" );
					this.navContainer.getPages ( )[0].setShowNavButton ( true );
					this.byId ( "SapSplSendMessageSelectViewList" ).getSelectedItem ( ).addCustomData ( new sap.ui.core.CustomData ( {
						key : "selected",
						value : true
					} ) );
					var displayViewName = this.byId ( "SapSplSendMessageSelectViewList" ).getSelectedItem ( ).getBindingContext ( ).getProperty ( ).Name;
					this.navContainer.getPages ( )[0].setTitle ( oSapSplUtils.getBundle ( ).getText ( "SEND_MESSAGE_VIA_VIEW_DIALOG2_TITLE", displayViewName ) );
					this.byId ( "SapSplMessageReceipientsLabel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "SEND_MESSAGE_RECIPIENTS_TRUCK_VIA_DISPLAY_VIEW", displayViewName ) );
					this.oSapSplSendMessageSendButton.setVisible ( true );

					if ( this.byId ( "sapSplMessageToRecipientTextArea" ) ) {
						setTimeout ( function ( ) {
							if ( sap.ui.getCore ( ).byId ( $ ( ".sapSplMessageToRecipientTextArea" ).attr ( "id" ) ) ) {
								sap.ui.getCore ( ).byId ( $ ( ".sapSplMessageToRecipientTextArea" ).attr ( "id" ) ).focus ( );
							}
						}, 1000 );
					}

					function fnSuccess ( oData ) {
						var aTruckArray = oData.results;

						this.byId ( "SapSplGeofencesValueHelpCell" ).removeAllContent ( );

						for ( var i = 0 ; i < aTruckArray.length ; i++ ) {
							oSapSplMapsDataMarshal.fnSelectDeselectTrucks ( aTruckArray[i], that.oViewData["liveAppInstance"], function ( aResults ) {
								var aSelectedTrucks = [];
								for ( var i = 0 ; i < aResults.length ; i++ ) {
									var oTruckObject = {};
									oTruckObject["ID"] = aResults[i]["DeviceUUID"];
									oTruckObject["Position"] = aResults[i]["Position"];
									oTruckObject["TourName"] = aResults[i]["TourName"];
									if ( aResults[i]["RegistrationNumber"] === null ) {
										oTruckObject["Reg"] = oSapSplUtils.getBundle ( ).getText ( "TRUCK" );
									} else {
										oTruckObject["Reg"] = aResults[i]["RegistrationNumber"];
									}
									aSelectedTrucks.push ( oTruckObject );
								}
								that.fnHandleClickOfTrucksOnTheMap ( aSelectedTrucks );
							} );
						}
						this.aSelectedTrucksForBackNavigation = aTruckArray;

					}

					function fnFail ( ) {
						jQuery.sap.log.error ( "Trucks inside display area", "read failed", "liveApp.controller.js" );
					}

					var sFilter = "$filter=(" + encodeURIComponent ( "LocationID eq " + "X" + "\'" + oSapSplUtils.base64ToHex ( oEvent.getParameters ( ).listItem.getBindingContext ( ).getProperty ( ).LocationID ) + "\'" ) + ")";
					oSapSplBusyDialog.getBusyDialogInstance ( ).open ( );
					this.oSapSplApplModel.read ( "/TrackableObjectsWithinView", null, [sFilter], false, jQuery.proxy ( fnSuccess, this ), jQuery.proxy ( fnFail, this ) );
					oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
					jQuery ( ".sapUiBLy" ).css ( "z-index", "0" );
				}

			},

			fnHandlePressOfSendMessageBackButton : function ( ) {
				this.navContainer.back ( );
				this.oSapSplSendMessageSendButton.setVisible ( false );
				/* Incident : 1570172035 */
				for ( var i = 0 ; i < this.aSelectedTrucksForBackNavigation.length ; i++ ) {
					oSapSplMapsDataMarshal.fnSelectDeselectTrucks ( this.aSelectedTrucksForBackNavigation[i], this.oViewData["liveAppInstance"], function ( ) {} );
				}
				this.aSelectedTrucksForBackNavigation = [];
				/* Incident fix for : 1570452539 */
				this.byId ( "SapSplSendMessageSelectViewList" ).getSelectedItem ( ).destroyCustomData ( );
			},

			fnFailOfMyIncidentsRead : function ( ) {

			},

			fnSuccessOfIncidentsRead : function ( oResults ) {
				var oSelectDialogModelData = {};
				for ( var i = 0 ; i < oResults.results.length ; i++ ) {
					oResults.results[i]["bIsSelected"] = false;
				}
				// oModel = new
				// sap.ui.model.json.JSONModel({Incidents:oResults.results});
				oSelectDialogModelData = sap.ui.getCore ( ).getModel ( "sapSplSendMessageSelectDialogModel" ).getData ( );
				oSelectDialogModelData["Incidents"] = oResults.results;
				sap.ui.getCore ( ).getModel ( "sapSplSendMessageSelectDialogModel" ).setData ( oSelectDialogModelData );
			},

			fnFailOfMyLocationsRead : function ( ) {

			},

			/**
			 * @description Method to make changes to the dialog buttons based on the current page, the navcontainer is holding.
			 * @param sPageIdentifier {string} the unique identifier for the current page.
			 * @returns void.
			 * @since 1.0
			 */
			setParentDialogButtonStateBasedOnCurrentPage : function ( sPageIdentifier ) {
				this.oParentDialogInstance.destroyBeginButton ( );
				this.oParentDialogInstance.destroyEndButton ( );

				this.oSapSplSendMessageSendButton = null;
				this.oSapSplSendMessageCancelButton = null;
				this.oSapSplSendMessageSelectOKButton = null;
				this.oSapSplSendMessageSelectCancelButton = null;

				if ( !this.oSapSplSendMessageSendButton ) {
					// CSN FIX : 0120031469 620972 2014
					this.oSapSplSendMessageSendButton = new sap.m.Button ( {
						text : oSapSplUtils.getBundle ( ).getText ( "SEND_MESSAGE_ACTION_TEXT" ),
						press : jQuery.proxy ( this.fnHandlePressOfSendMessageDialog, this ),
						enabled : true
					} );
				}
				if ( !this.oSapSplSendMessageCancelButton ) {
					this.oSapSplSendMessageCancelButton = new sap.m.Button ( {
						text : oSapSplUtils.getBundle ( ).getText ( "MY_COLLEAGUES_CANCEL_BUTTON" ),
						press : jQuery.proxy ( this.fnHandlePressOfSendMessageDialogCancel, this )
					} );
				}
				if ( !this.oSapSplSendMessageSelectOKButton ) {
					this.oSapSplSendMessageSelectOKButton = new sap.m.Button ( {
						text : oSapSplUtils.getBundle ( ).getText ( "OK_BUTTON_TEXT" ),
						press : jQuery.proxy ( this.fnHandlePressOfButtonWithSelection, this )
					} );
				}
				if ( !this.oSapSplSendMessageSelectCancelButton ) {
					this.oSapSplSendMessageSelectCancelButton = new sap.m.Button ( {
						text : oSapSplUtils.getBundle ( ).getText ( "MY_COLLEAGUES_CANCEL_BUTTON" ),
						press : jQuery.proxy ( this.fnHandlePressOfButtonWithOutSelection, this )
					} );
				}

				if ( sPageIdentifier === "Form" ) {
					this.oParentDialogInstance.setBeginButton ( this.oSapSplSendMessageSendButton );
					this.oParentDialogInstance.setEndButton ( this.oSapSplSendMessageCancelButton );
				} else if ( sPageIdentifier === "Select_Multi" ) {
					this.oParentDialogInstance.setBeginButton ( this.oSapSplSendMessageSelectOKButton );
					this.oParentDialogInstance.setEndButton ( this.oSapSplSendMessageSelectCancelButton );
				} else {
					// this.oParentDialogInstance.setBeginButton(this.oSapSplSendMessageSelectOKButton);
					this.oParentDialogInstance.setEndButton ( this.oSapSplSendMessageSelectCancelButton );
				}
			},

			/**
			 * @description Method to handle the click of the value help button for selecting geofences for sending messages.
			 * @param void.
			 * @returns void.
			 * @since 1.0
			 */
			fnValueHelpForSelectGeofences : function ( ) {
				this.fnOpenDialogForValueHelp ( oSapSplUtils.getBundle ( ).getText ( "SEND_MESSAGE_SELECT_GEOFENCE" ), "Geofences" );
			},

			/**
			 * @description Method to handle the click of the value help button for selecting incidents for associating a message to send.
			 * @param void.
			 * @since 1.0
			 */
			fnValueHelpForIncidentMessage : function ( ) {
				this.fnOpenDialogForValueHelp ( oSapSplUtils.getBundle ( ).getText ( "SEND_MESSAGE_SELECT_INCIDENT" ), "Incidents" );
			},

			/**
			 * @description Method to handle the click of the cancel button in the dialog to send messages.
			 * this closes the dialog and destroys the dialog to avoid duplicate ID's.
			 * @param void.
			 * @returns void.
			 * @since 1.0
			 */
			fnHandlePressOfSendMessageDialogCancel : function ( ) {
				var that = this;

				if ( oSapSplUtils.getIsDirty ( ) ) {
					sap.m.MessageBox.show ( oSapSplUtils.getBundle ( ).getText ( "DATA_LOSS_WARNING_TEXT" ), sap.m.MessageBox.Icon.WARNING, oSapSplUtils.getBundle ( ).getText ( "WARNING" ), [sap.m.MessageBox.Action.YES,
							sap.m.MessageBox.Action.CANCEL], function ( selection ) {
						if ( selection === "YES" ) {
							//Fix to incident 1570840589
							if ( that.oViewData["mode"] === "All_Trucks" ) {
								for ( var i = 0; i < that.oViewData["trucks"].length; i++ ) {
									oSapSplMapsDataMarshal.fnSelectDeselectTrucks ( that.oViewData["trucks"][i], that.oViewData["liveAppInstance"] );
								}
							}
							that.getView ( ).getParent ( ).getParent ( ).close ( );
							oSapSplUtils.setIsDirty ( false );
						} else {
							jQuery ( ".sapMDialogBlockLayerInit" ).css ( "display", "none" );
						}
					}, null, oSapSplUtils.fnSyncStyleClass ( "messageBox" ) );
				} else {
					that.getView ( ).getParent ( ).getParent ( ).close ( );
					oSapSplUtils.setIsDirty ( false );
				}

			},

			/**
			 * @description Method to handle the click of the buttons for back navigation in the navcontainer
			 * which does not need the selected items contexts to be used in the other page.
			 * @param void.
			 * @returns void.
			 * @since 1.0
			 */
			fnHandlePressOfButtonWithOutSelection : function ( ) {
				this.setParentDialogButtonStateBasedOnCurrentPage ( "Form" );
				this.navContainer.back ( );
			},

			/**
			 * @description Method to handle the click of the buttons for back navigation in the navcontainer
			 * also which needs the selected items contexts to be used in the other page.
			 * @param void.
			 * @returns void.
			 * @since 1.0
			 */
			fnHandlePressOfButtonWithSelection : function ( ) {
				this.setParentDialogButtonStateBasedOnCurrentPage ( "Form" );

				if ( this.byId ( "SapSplSendMessageNavContainer" ).getCurrentPage ( ).sId.split ( "--" )[1] === "SapSplSendMessageSelectGeofencePage" ) {
					this.byId ( "SapSplsearchOfGeofences" ).setValue ( "" );
					this.byId ( "SapSplSendMessageSelectDialogList" ).getBinding ( "items" ).filter ( [] );
					this.fnChangeValueHelpWithSelectedItem ( this.byId ( "SapSplSendMessageSelectDialogList" ) );
				} else {
					this.fnChangeValueHelpWithSelectedItem ( this.byId ( "SapSplSendMessageSelectDialogListIncident" ) );
				}
				this.navContainer.back ( );
			},

			/**
			 * @description Method to change the value help custom control based on the selected items in the value help dialog
			 * @param oSelectList {object} the list instance of the select dialog list, to extract the selected items.
			 * @returns void.
			 * @since 1.0
			 */
			fnChangeValueHelpWithSelectedItem : function ( oSelectList ) {
				var aContent = null, oInputValueHelp = null, that = this;
				if ( oSelectList.getMode ( ) === "MultiSelect" ) {
					if ( oSelectList.getSelectedItems ( ).length > 0 ) {
						/* Fix for incident 1580100467 */
						oSapSplUtils.setIsDirty ( true );
						aContent = this.byId ( "SapSplGeofencesValueHelpCell" ).getContent ( );
						oInputValueHelp = aContent[aContent.length - 1];
						this.byId ( "SapSplGeofencesValueHelpCell" ).removeAllContent ( );
						this.byId ( "SapSplGeofencesValueHelpCell" ).addContent ( oInputValueHelp );
						var aItems = oSelectList.getSelectedItems ( );
						for ( var i = 0 ; i < aItems.length ; i++ ) {
							if ( !aItems[i].getBindingContext ( ).getProperty ( )["TitleID"] ) {
								if ( !this.isGeofenceIsInTheValueHelpList ( aItems[i].getBindingContext ( ).getProperty ( )["LocationID"] ) ) {
									this.byId ( "SapSplGeofencesValueHelpCell" ).insertContent ( this.getSelectedItemLayout ( aItems[i].getBindingContext ( ).getProperty ( ), "geofence" ), 0 );
									this.byId ( "SapSplGeofencesValueHelpLayout" ).removeStyleClass ( "redBorder" );
								}
								this.byId ( "SapSplValueHelpForSelectGeofencesInput" ).setValue ( "" );
							}
						}
						window.setTimeout ( function ( ) {
							that.byId ( "SapSplValueHelpForSelectGeofencesInput" ).$ ( ).children ( )[0].focus ( );
						}, 1000 );
					}
				} else {
					if ( oSelectList.getSelectedItem ( ) ) {
						/* Fix for incident 1580100467 */
						oSapSplUtils.setIsDirty ( true );
						this.selectedIncidentSourceLocation = null;
						var oItemContext = oSelectList.getSelectedItem ( ).getBindingContext ( ).getProperty ( );
						var oCustomData = new sap.ui.core.CustomData ( {
							key : "ID",
							value : {
								id : oItemContext["UUID"],
								type : "incident",
								object : oItemContext["Name"]
							}
						} );

						/* CSNFIX : 0120061532 1443215 2014 */
						this.byId ( "sapSplAttachIncidentLink" ).destroyCustomData ( );
						this.byId ( "sapSplAttachIncidentLink" ).addCustomData ( oCustomData );
						this.byId ( "sapSplAttachIncidentLink" ).setText ( oItemContext["Name"] );

						if ( oItemContext["LongText"] ) {
							this.byId ( "SapSplMessageFromIncidentInput" ).setValue ( oItemContext["LongText"] );
							this.byId ( "sapSplMessageToRecipientMessageFieldLayout" ).removeStyleClass ( "redBorder" );
						}
						this.selectedIncidentSourceLocation = oItemContext["IncidentLocationGeometry"];
						if ( oItemContext["Priority"] ) {
							this.fnPriorityRadioButtonLayoutAccess ( "set", oItemContext["Priority"] );
						}
					}
				}
			},

			/**
			 * @description method to access the priority radio buttons layout
			 * it can be used in 2 modes, "set"/"get".
			 * In the set mode, one can set a priority on the radio buttons.
			 * In the get mode, one can get the text of the selected radio button.
			 * @param sMode {string} - either get or set
			 * @param sPriority {string} optional (priority to be set)
			 * @returns sText {string} in case of get mode.
			 * @since 1.0
			 */
			fnPriorityRadioButtonLayoutAccess : function ( sMode, sPriority ) {
				var aRadioButtons = this.byId ( "SapSplSendMessagePriorityRadioButtonHolder" ).getContent ( );
				var sButtonId = "";
				if ( sMode === "set" && sPriority ) {
					// oSapSplUtils.setIsDirty(true);
					for ( var i = 0 ; i < aRadioButtons.length ; i++ ) {
						sButtonId = aRadioButtons[i].sId.split ( "_" );
						if ( sButtonId[sButtonId.length - 1] === sPriority ) {
							aRadioButtons[i].setSelected ( true );
						} else {
							aRadioButtons[i].setSelected ( false );
						}
					}
				} else if ( sMode === "get" ) {
					for ( var j = 0 ; j < aRadioButtons.length ; j++ ) {
						if ( aRadioButtons[j].getSelected ( ) ) {
							sButtonId = aRadioButtons[j].sId.split ( "_" );
							return sButtonId[sButtonId.length - 1];
						}
					}
				}
			},

			sapSplHandleDateChange : function ( oEvent ) {

				var that = this;
				oSapSplUtils.setIsDirty ( true );
				if ( oEvent && oEvent.getSource ( ) && oEvent.getSource ( ).getCustomData ( )[0] && oEvent.getSource ( ).getCustomData ( )[0].getValue ( ) === "To" ) {
					if ( new Date ( oEvent.getSource ( ).getValue ( ) ) < new Date ( that.byId ( "SapSplMessageValidFromDateTime" ).getValue ( ) ) ) {
						that.byId ( "SapSplMessageValidToDateTime" ).setValue ( that.byId ( "SapSplMessageValidFromDateTime" ).getValue ( ) );
					}
				} else {
					if ( new Date ( oEvent.getSource ( ).getValue ( ) ) > new Date ( that.byId ( "SapSplMessageValidToDateTime" ).getValue ( ) ) ) {
						that.byId ( "SapSplMessageValidToDateTime" ).setValue ( that.byId ( "SapSplMessageValidFromDateTime" ).getValue ( ) );
					}
				}

			},

			sapSplChangeDirtyFlag : function ( oEvent ) {
				oSapSplUtils.setIsDirty ( true );
				if ( oEvent.getParameters ( "newValue" ).length === 0 ) {
					this.byId ( "sapSplMessageToRecipientMessageFieldLayout" ).addStyleClass ( "redBorder" );
				} else {
					this.byId ( "sapSplMessageToRecipientMessageFieldLayout" ).removeStyleClass ( "redBorder" );
				}
			},

			getThreadUUID : function ( sFilter ) {

				var returnValue = null;

				oSapSplAjaxFactory.fireAjaxCall ( {
					url : oSapSplUtils.getFQServiceUrl ( "/sap/spl/xs/app/services/appl.xsodata/ThreadList?" + sFilter + "&$format=json" ),
					method : "GET",
					async : false,
					success : function ( oData ) {
						if ( oData.d.results.length > 0 ) {
							returnValue = oData.d.results[0]["ThreadUUID"];
						} else {
							returnValue = oSapSplUtils.getUUID ( );
						}
					},
					error : function ( ) {
						returnValue = oSapSplUtils.getUUID ( );
					}
				} );

				return returnValue;
			},

			/**
			 * @description method to get all the selected recipients of the message.
			 * @param void.
			 * @returns aSelectedRecipients {array} array of ID's of all the selected recipients.
			 * @since 1.0
			 */
			fnGetListOfRecipientsFromValueHelpControl : function ( sPriority, IncidentUUID, sStartTime, sEndTime, sShortText ) {
				var oRecipientsCellContents = null, aSelectedRecipients = [];
				oRecipientsCellContents = this.byId ( "SapSplGeofencesValueHelpCell" ).getContent ( );

				var sUUID = oSapSplUtils.getUUID ( );
				var oHeaderObject = {}, oTextObject = {};
				oHeaderObject["UUID"] = sUUID;
				oHeaderObject["Type"] = "DM";
				oHeaderObject["TemplateUUID"] = IncidentUUID;
				oHeaderObject["Priority"] = sPriority;
				oHeaderObject["OwnerID"] = oSapSplUtils.getCompanyDetails ( )["BasicInfo_CompanyID"];
				oHeaderObject["SenderID"] = oSapSplUtils.getCompanyDetails ( )["BasicInfo_CompanyID"];
				oHeaderObject["Validity.StartTime"] = sStartTime;
				oHeaderObject["Validity.EndTime"] = sEndTime;
				oHeaderObject["AuditTrail.CreatedBy"] = null;
				oHeaderObject["AuditTrail.ChangedBy"] = null;
				oHeaderObject["AuditTrail.CreationTime"] = null;
				oHeaderObject["AuditTrail.ChangeTime"] = null;
				if ( this.selectedIncidentSourceLocation ) {
					oHeaderObject["SourceLocation"] = JSON.parse ( this.selectedIncidentSourceLocation );
				} else {
					oHeaderObject["SourceLocation"] = null;
				}

				var sRecipientType = "Location";
				if ( this.oViewData && this.oViewData["mode"] && (this.oViewData["mode"] === "Trucks" || this.oViewData["mode"] === "All_Trucks") ) {
					sRecipientType = "Truck";
				}

				for ( var i = 0 ; i < oRecipientsCellContents.length ; i++ ) {
					/* CSNFIX : 0120061532 1483236 2014 */
					if ( (oRecipientsCellContents[i].constructor !== sap.m.Input) && (oRecipientsCellContents[i].constructor !== sap.m.Text) ) {
						var oObject = {};
						oObject["RecipientUUID"] = oRecipientsCellContents[i].getCustomData ( )[0].getValue ( ).id;
						oObject["UUID"] = oSapSplUtils.getUUID ( );
						oObject["ParentUUID"] = sUUID;
						oObject["RecipientType"] = sRecipientType;
						oObject["isRead"] = "0";
						aSelectedRecipients.push ( oObject );
					}
				}
				if ( aSelectedRecipients.length === 1 ) {
					var sFilter = "$filter=(" + encodeURIComponent ( "RecipientUUID eq " + "X" + "\'" + oSapSplUtils.base64ToHex ( aSelectedRecipients[0]["RecipientUUID"] ) + "\'" ) + " and " +
							encodeURIComponent ( "SenderID eq " + "X" + "\'" + oSapSplUtils.base64ToHex ( oSapSplUtils.getCompanyDetails ( )["BasicInfo_CompanyID"] ) + "\'" ) + ") or (" +
							encodeURIComponent ( "SenderID eq " + "X" + "\'" + oSapSplUtils.base64ToHex ( aSelectedRecipients[0]["RecipientUUID"] ) + "\'" ) + " and " +
							encodeURIComponent ( "RecipientUUID eq " + "X" + "\'" + oSapSplUtils.base64ToHex ( oSapSplUtils.getCompanyDetails ( )["BasicInfo_CompanyID"] ) + "\')" );
					oHeaderObject["ThreadUUID"] = this.getThreadUUID ( sFilter );
				} else {
					oHeaderObject["ThreadUUID"] = oSapSplUtils.getUUID ( );
				}

				oTextObject["UUID"] = sUUID;
				/*
				 * CSN FIX : 0120031469 682358 2014 Remove the Language
				 * attribute from the payload
				 */
				oTextObject["ShortText"] = sShortText;
				oTextObject["LongText"] = sShortText;

				return {
					Header : [oHeaderObject],
					Recipient : aSelectedRecipients,
					Text : [oTextObject],
					Object : "MessageOccurrence"
				};
			},

			fnIsAllMandatoryFieldsFilled : function ( ) {
				var bReturnValue = true;
				/* Fix : 1482006739 */
				if ( this.byId ( "SapSplGeofencesValueHelpCell" ).getContent ( ).length === 0 ||
						(this.byId ( "SapSplGeofencesValueHelpCell" ).getContent ( ).length === 1 && (this.byId ( "SapSplGeofencesValueHelpCell" ).getContent ( )[0].constructor === sap.m.Text || this.byId ( "SapSplGeofencesValueHelpCell" )
								.getContent ( )[0].constructor === sap.m.Input)) ) {
					this.byId ( "SapSplGeofencesValueHelpLayout" ).addStyleClass ( "redBorder" );
					bReturnValue = false;
				} else {
					this.byId ( "SapSplGeofencesValueHelpLayout" ).removeStyleClass ( "redBorder" );
				}
				if ( this.byId ( "SapSplMessageFromIncidentInput" ).getValue ( ).length === 0 ) {
					this.byId ( "sapSplMessageToRecipientMessageFieldLayout" ).addStyleClass ( "redBorder" );
					bReturnValue = false;
				} else {
					this.byId ( "sapSplMessageToRecipientMessageFieldLayout" ).removeStyleClass ( "redBorder" );
				}
				return bReturnValue;
			},

			/**
			 * @description Method to post the message to backend.
			 * @since 1.0
			 * @param void
			 * @returns void.
			 */
			fnHandlePressOfSendMessageDialog : function ( ) {
				if ( this.fnIsAllMandatoryFieldsFilled ( ) ) {
					var oPayLoadForPost = null;
					var that = this;
					oPayLoadForPost = this.preparePayLoadForMessagePost ( );
					oSapSplBusyDialog.getBusyDialogInstance ( ).open ( );
					oSapSplAjaxFactory.fireAjaxCall ( {
						url : oSapSplUtils.getServiceMetadata ( "message", true ),
						// CSN FIX : 0120061532 1495872 2014
						method : "POST",
						beforeSend : function ( request ) {
							request.setRequestHeader ( "X-CSRF-Token", oSapSplUtils.getCSRFToken ( ) );
						},
						/* CSNFIX : 0120031469 630672 2014 */
						contentType : "json; charset=UTF-8",
						data : JSON.stringify ( oPayLoadForPost ),
						success : function ( data, success, messageObject ) {
							oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
							if ( data.constructor === String ) {
								data = JSON.parse ( data );
							}
							if ( messageObject["status"] === 200 && data["Error"].length === 0 ) {
								sap.ca.ui.message.showMessageToast ( oSapSplUtils.getBundle ( ).getText ( "MESSAGE_SENT_SUCCESSFULLY" ) );
								oSapSplUtils.setIsDirty ( false );
								that.fnHandlePressOfSendMessageDialogCancel ( );
							} else {
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
						complete : function ( ) {}
					} );
				}
			},

			fireCancelAction : function ( ) {
				$ ( ".sapMDialogBlockLayerInit" ).css ( "z-index", "0" );
			},

			/**
			 * @description Method to prepare the payload for post, in case of sending a message to a list of geofences.
			 * @param void.
			 * @returns oPayLoad {object} object containing the fields required for post
			 * @since 1.0
			 */
			preparePayLoadForMessagePost : function ( ) {
				var sPriority = "", IncidentUUID = null, sStartTime = "", sEndTime = "", sShortText = "";
				if ( this.byId ( "sapSplAttachIncidentLink" ) && this.byId ( "sapSplAttachIncidentLink" ).getCustomData ( ).length > 0 ) {
					IncidentUUID = this.byId ( "sapSplAttachIncidentLink" ).getCustomData ( )[0].getValue ( ).id;
				} else {
					IncidentUUID = "";
				}
				sPriority = this.fnPriorityRadioButtonLayoutAccess ( "get" );
				sStartTime = this.byId ( "SapSplMessageValidFromDateTime" ).getValue ( ).toString ( );
				sEndTime = this.byId ( "SapSplMessageValidToDateTime" ).getValue ( ).toString ( );
				sShortText = this.byId ( "SapSplMessageFromIncidentInput" ).getValue ( );
				return this.fnGetListOfRecipientsFromValueHelpControl ( sPriority, IncidentUUID, new Date ( sStartTime ).toJSON ( ), new Date ( sEndTime ).toJSON ( ), sShortText );
			},

			/**
			 * @description Method to open the new dialog, with the list for selection.
			 * @param sTitle {string} title to be displayed on the dialog control.
			 * @param sPath {string} the path to which the list should be bound.
			 * @param bIsMultiSelect {boolean} boolean value for multiselect capability of the list
			 * @param sTitlePath {string} path to which the title field of list item should be bound to.
			 * @param sDescPath {string} path to which the description field of list item should be bound to.
			 * @since 1.0
			 */
			fnOpenDialogForValueHelp : function ( sTitle, sPath ) {
				var navToId = "";
				if ( sPath === "Geofences" ) {
					this.setParentDialogButtonStateBasedOnCurrentPage ( "Select_Multi" );
					navToId = this.navContainer.getPages ( )[2].sId;
					this.byId ( "SapSplSendMessageSelectDialogTitle" ).setText ( sTitle );
				} else {
					this.setParentDialogButtonStateBasedOnCurrentPage ( "Select_Single" );
					navToId = this.navContainer.getPages ( )[3].sId;
					this.byId ( "SapSplSendMessageSelectDialogTitleIncident" ).setText ( sTitle );
				}

				this.navContainer.to ( navToId, "slide" );
			},

			/**
			 * @description setter to set the instance of the parent dialog control on this view and controller
			 * @param oParentDialog {object} the parent dialog instance.
			 * @returns void.
			 * @since 1.0
			 */
			setParentDialogInstance : function ( oParentDialog, oPRMMessagingController ) {
				this.oParentDialogInstance = oParentDialog;
				this.oPRMMessagingController = oPRMMessagingController;
				this.setParentDialogButtonStateBasedOnCurrentPage ( "Form" );
				if ( this.oViewData && (this.oViewData["mode"] === "Views") ) {
					this.oSapSplSendMessageSendButton.setVisible ( false );
				}

			},

			/**
			 * @description Method to instantiate a horizontal layout, which would represent the selected item from the select dialog list.
			 * This would have 2 parts, one being the selected list item detail, other one being the "x" button, for deletion of this item.
			 * @param oItemDetail {object} object of the selected item detail.
			 * @pram sMode {string} mode to distinguish between the call from "geofence" context or from "incident" context.
			 * @returns void.
			 * @since 1.0
			 */
			getSelectedItemLayout : function ( oItemDetail, sMode, bAllowDelete ) {
				var oDeleteButton = null, oItemDetailButton = null, oItemSelectedLayout = null, sItemDetail = "", sID = "", oCustomData = null;
				if ( sMode && sMode === "geofence" ) {
					sItemDetail = oItemDetail["Name"];
					sID = oItemDetail["LocationID"];
				} else if ( sMode && sMode === "truck" ) {
					sItemDetail = oItemDetail["Reg"];
					sID = oItemDetail["ID"];
				} else {
					sItemDetail = oItemDetail["Name"];
					sID = oItemDetail["UUID"];
				}

				if ( sItemDetail && sItemDetail.constructor === String && sItemDetail.length >= 25 ) {
					sItemDetail = sItemDetail.substring ( 0, 25 ) + "...";
				}

				oCustomData = new sap.ui.core.CustomData ( {
					key : "ID",
					value : {
						id : sID,
						type : sMode,
						object : oItemDetail
					}
				} );
				var that = this;
				oDeleteButton = new sap.m.Button ( {
					text : "x",
					type : "Unstyled"
				} ).addStyleClass ( "itemLayoutButton" ).addStyleClass ( "deleteItemButton" );
				if ( sMode === "truck" ) {
					oDeleteButton.setEnabled ( true );
				}
				if ( bAllowDelete !== undefined && bAllowDelete === false ) {
					oDeleteButton.setVisible ( false );
				}
				oItemDetailButton = new sap.m.Button ( {
					text : sItemDetail,
					type : "Unstyled"
				} ).addStyleClass ( "itemLayoutButton" ).addStyleClass ( "itemDetailButton" );
				oItemSelectedLayout = new sap.ui.layout.HorizontalLayout ( {
					content : [oItemDetailButton, oDeleteButton]
				} ).addStyleClass ( "itemLayout" );
				oDeleteButton.attachPress ( function ( e ) {
					var oSelectedItemLayout = e.getSource ( ).getParent ( );
					var sType = oSelectedItemLayout.getCustomData ( )[0].getValue ( ).type;
					var oObject = oSelectedItemLayout.getCustomData ( )[0].getValue ( ).object;
					that.fnChangeTheSelectionOfListItems ( oSelectedItemLayout, false, sType, true );
					setTimeout ( function ( ) {
						/* Fix for incident 1580113956 */
						if ( that.byId ( "SapSplGeofencesValueHelpCell" ).getContent ( ).length > 0 ) {
							that.byId ( "SapSplGeofencesValueHelpCell" ).getContent ( )[0].getContent ( )[0].$ ( ).focus ( );
						}
					}, 250 );
					oSelectedItemLayout.destroy ( );
					if ( sType === "geofence" ) {
						window.setTimeout ( function ( ) {
							that.oSapSplValueHelpForSelectGeofencesInput.$ ( ).children ( )[0].focus ( );
						}, 1000 );
						that.oSapSplValueHelpForSelectGeofencesInput.setPlaceholder ( "" );
					} else if ( sType === "incident" ) {
						/* CSNFIX : 0120061532 0001409493 2014 */
						// that.oSapSplValueHelpForSelectIncidentInput.setPlaceholder(oSapSplUtils.getBundle().getText("SELECT_INCIDENTS_PLACEHOLDER_TEXT"));
						that.byId ( "SapSplMessageFromIncidentInput" ).setValue ( "" );
					} else {
						if ( oObject ) {
							oObject["DeviceUUID"] = oObject["ID"];
							if ( oObject["Reg"] === oSapSplUtils.getBundle ( ).getText ( "TRUCK" ) ) {
								oObject["RegistrationNumber"] = null;
							} else {
								oObject["RegistrationNumber"] = oObject["Reg"];
							}
							oSapSplMapsDataMarshal.fnSelectDeselectTrucks ( oObject, that.oPRMMessagingController.byId ( "oSapSplLiveAppMap" ), function ( ) {} );
						}

					}
				} );
				return oItemSelectedLayout.addCustomData ( oCustomData );

			},

			fnHandleCheckUncheckOfListItem : function ( oEvent ) {
				var oItem = oEvent.getParameter ( "listItem" );
				var oModelData = sap.ui.getCore ( ).getModel ( "sapSplSendMessageSelectDialogModel" ).getData ( );
				var oGeofenceListData = oModelData["Geofences"];

				if ( !oItem.getBindingContext ( ).getProperty ( )["TitleID"] ) {
					if ( oItem.getSelected ( ) === false ) {
						for ( var i = 0 ; i < oGeofenceListData.length ; i++ ) {
							if ( oGeofenceListData[i]["TitleID"] ) {
								oGeofenceListData[i]["bIsSelected"] = false;
								break;
							}
						}
						this.fnDeleteTheButtonLayoutBasedOnListItemCheck ( oItem.getBindingContext ( ).getProperty ( ).LocationID );
						oSapSplMapsDataMarshal.isGeofenceSelectDeselectEnabled = true;
						oSapSplMapsDataMarshal.fnSelectDeselectFences ( oItem.getBindingContext ( ).getProperty ( ), this.oPRMMessagingController.byId ( "oSapSplLiveAppMap" ), function ( ) {} );
					} else {
						oSapSplMapsDataMarshal.isGeofenceSelectDeselectEnabled = true;
						oSapSplMapsDataMarshal.fnSelectDeselectFences ( oItem.getBindingContext ( ).getProperty ( ), this.oPRMMessagingController.byId ( "oSapSplLiveAppMap" ), function ( ) {} );
					}
				} else {
					if ( oGeofenceListData && oGeofenceListData.length > 1 ) {
						for ( var j = 0 ; j < oGeofenceListData.length ; j++ ) {
							if ( !oGeofenceListData[j]["TitleID"] ) {
								if ( oItem.getSelected ( ) === true ) {
									// oGeofenceListData[i]["bIsSelected"] =
									// true;
									oItem.getParent ( ).getItems ( )[j].setSelected ( true );
									oItem.getParent ( ).fireSelect ( {
										listItem : oItem.getParent ( ).getItems ( )[j]
									} ); // .setSelected(true);
								} else {
									// oGeofenceListData[i]["bIsSelected"] =
									// false;
									oItem.getParent ( ).getItems ( )[j].setSelected ( false );
									oItem.getParent ( ).fireSelect ( {
										listItem : oItem.getParent ( ).getItems ( )[j]
									} );
								}
							}
						}
					}
				}

				oModelData["Geofences"] = oGeofenceListData;
				sap.ui.getCore ( ).getModel ( "sapSplSendMessageSelectDialogModel" ).setData ( oModelData );
			},

			fnChangeTheSelectionOfListItems : function ( oSelectedItemLayout, bIsSelected, sType, sMode ) {
				if ( sType !== "truck" ) {
					var oSelectDialogModelData = sap.ui.getCore ( ).getModel ( "sapSplSendMessageSelectDialogModel" ).getData ( );
					var oSelectDialogModelDataGeo = oSelectDialogModelData.Geofences;
					for ( var i = 0 ; i < oSelectDialogModelDataGeo.length ; i++ ) {
						var UUID = oSelectedItemLayout.getCustomData ( )[0].getValue ( ).id;
						if ( oSelectDialogModelDataGeo[i]["LocationID"] === UUID ) {
							oSelectDialogModelDataGeo[i]["bIsSelected"] = bIsSelected;
							if ( sMode ) {
								oSapSplMapsDataMarshal.fnSelectDeselectFences ( oSelectDialogModelDataGeo[i], this.oPRMMessagingController.byId ( "oSapSplLiveAppMap" ), function ( ) {} );
							}
							break;
						}
					}
					oSelectDialogModelData["Geofences"] = oSelectDialogModelDataGeo;
					sap.ui.getCore ( ).getModel ( "sapSplSendMessageSelectDialogModel" ).setData ( oSelectDialogModelData );
				}
			},

			fnHandleClickOfTrucksOnTheMap : function ( aSelectedTrucksOnTheMap ) {
				// var oInputValueHelp = aContent[aContent.length-1];
				oSapSplUtils.setIsDirty ( true );
				this.byId ( "SapSplGeofencesValueHelpCell" ).removeAllContent ( );
				// this.byId("SapSplGeofencesValueHelpCell").addContent(oInputValueHelp);
				for ( var i = 0 ; i < aSelectedTrucksOnTheMap.length ; i++ ) {
					this.byId ( "SapSplGeofencesValueHelpCell" ).insertContent ( this.getSelectedItemLayout ( aSelectedTrucksOnTheMap[i], "truck" ), 0 );
					this.byId ( "SapSplGeofencesValueHelpLayout" ).removeStyleClass ( "redBorder" );
				}
				if ( aSelectedTrucksOnTheMap.length === 0 ) {
					this.byId ( "SapSplGeofencesValueHelpCell" ).insertContent ( new sap.m.Text ( {
						text : oSapSplUtils.getBundle ( ).getText ( "SEND_MESSAGE_DIALOG_SELECT_TRUCKS" )
					} ).addStyleClass ( "selectTruckOnMapPlaceholder" ) );
				}
			},

			fnHandleClickOfGeofenceOnTheMap : function ( aSelectedGeofencesOnTheMap ) {
				oSapSplUtils.setIsDirty ( true );
				var aContent = this.byId ( "SapSplGeofencesValueHelpCell" ).getContent ( );
				var oInputValueHelp = aContent[aContent.length - 1];
				this.byId ( "SapSplGeofencesValueHelpCell" ).removeAllContent ( );
				this.byId ( "SapSplGeofencesValueHelpCell" ).addContent ( oInputValueHelp );
				for ( var i = 0 ; i < aSelectedGeofencesOnTheMap.length ; i++ ) {
					if ( !this.isGeofenceIsInTheValueHelpList ( aSelectedGeofencesOnTheMap[i]["LocationID"] ) ) {
						this.byId ( "SapSplGeofencesValueHelpCell" ).insertContent ( this.getSelectedItemLayout ( aSelectedGeofencesOnTheMap[i], "geofence" ), 0 );
						this.byId ( "SapSplGeofencesValueHelpLayout" ).removeStyleClass ( "redBorder" );
					}
					this.byId ( "SapSplValueHelpForSelectGeofencesInput" ).setValue ( "" );
				}

				var oSelectDialogModelData = sap.ui.getCore ( ).getModel ( "sapSplSendMessageSelectDialogModel" ).getData ( );
				var oSelectDialogModelDataGeo = oSelectDialogModelData.Geofences;
				for ( var j = 0 ; j < oSelectDialogModelDataGeo.length ; j++ ) {
					oSelectDialogModelDataGeo[j]["bIsSelected"] = false;
				}
				oSelectDialogModelData["Geofences"] = oSelectDialogModelDataGeo;
				sap.ui.getCore ( ).getModel ( "sapSplSendMessageSelectDialogModel" ).setData ( oSelectDialogModelData );

				var aContentAfterInsert = this.byId ( "SapSplGeofencesValueHelpCell" ).getContent ( );
				for ( var k = 0 ; k < aContentAfterInsert.length ; k++ ) {
					if ( aContentAfterInsert[k].constructor !== sap.m.Input ) {
						this.fnChangeTheSelectionOfListItems ( aContentAfterInsert[k], true, "geofence", false );
					}
				}

			},

			fnDeleteTheButtonLayoutBasedOnListItemCheck : function ( UUID ) {
				var aGeofenceValueHelpCellContent = this.byId ( "SapSplGeofencesValueHelpCell" ).getContent ( );
				for ( var i = 0 ; i < aGeofenceValueHelpCellContent.length ; i++ ) {
					if ( aGeofenceValueHelpCellContent[i].constructor !== sap.m.Input ) {
						if ( aGeofenceValueHelpCellContent[i].getCustomData ( )[0].getValue ( ).id === UUID ) {
							aGeofenceValueHelpCellContent[i].destroy ( );
						}
					}
				}
			},

			fnValueHelpForSelectGeofencesSuggestItemSelected : function ( oEvent ) {
				if ( !this.isGeofenceIsInTheValueHelpList ( oEvent.getParameter ( "selectedItem" ).getBindingContext ( ).getProperty ( )["LocationID"] ) ) {
					var oSelectedItemLayout = this.getSelectedItemLayout ( oEvent.getParameter ( "selectedItem" ).getBindingContext ( ).getProperty ( ), "geofence" );
					this.byId ( "SapSplGeofencesValueHelpCell" ).insertContent ( oSelectedItemLayout, 0 );
					this.byId ( "SapSplGeofencesValueHelpLayout" ).removeStyleClass ( "redBorder" );
					this.fnChangeTheSelectionOfListItems ( oSelectedItemLayout, true, "geofence" );
				}
				this.byId ( "SapSplValueHelpForSelectGeofencesInput" ).setValue ( "" );
				var that = this;
				window.setTimeout ( function ( ) {
					that.byId ( "SapSplValueHelpForSelectGeofencesInput" ).$ ( ).children ( )[0].focus ( );
				}, 1000 );
			},

			isGeofenceIsInTheValueHelpList : function ( UUID ) {
				var aSelectedGeofences = this.byId ( "SapSplGeofencesValueHelpCell" ).getContent ( );
				var _returnIfExisting = false;
				for ( var i = 0 ; i < aSelectedGeofences.length ; i++ ) {
					if ( aSelectedGeofences[i].constructor !== sap.m.Input ) {
						if ( aSelectedGeofences[i].getCustomData ( )[0].getValue ( )["id"] === UUID ) {
							_returnIfExisting = true;
							break;
						}
					}
				}
				return _returnIfExisting;
			},

			fnHandleClickOfListItem : function ( oEvent ) {
				var oSelectedListItem = null;
				oSelectedListItem = oEvent.getSource ( );
				if ( oSelectedListItem.getSelected ( ) ) {
					oSelectedListItem.setSelected ( false );
				} else {
					oSelectedListItem.setSelected ( true );
				}
				// if
				// (oSelectedListItem.getBindingContext().getObject()["TitleID"])
				// {
				oSelectedListItem.getParent ( ).fireSelect ( {
					listItem : oSelectedListItem
				} );
				// }
			},

			fnToHandleSearchOfGeofences : function ( event ) {
				/* Fix for incident 1580104401 */
				var searchString = event.getParameters ( ).query;
				var oSapSplGeofenceList;

				/* Fix for incident 1570831469 */
				if ( searchString[searchString.length - 1] === "*" ) {
					searchString = searchString.slice ( 0, -1 );
				}
				if ( searchString[0] === "*" ) {
					searchString = searchString.slice ( 1, searchString.length );
				}
				oSapSplGeofenceList = this.getView ( ).byId ( "SapSplSendMessageSelectDialogList" );

				if ( searchString.length > 2 ) {
					oSapSplGeofenceList.getBinding ( "items" ).filter (
							new sap.ui.model.Filter ( [new sap.ui.model.Filter ( "Name", sap.ui.model.FilterOperator.NE, oSapSplUtils.getBundle ( ).getText ( "FILTER_LABEL_ALL" ) ),
									new sap.ui.model.Filter ( "Name", sap.ui.model.FilterOperator.Contains, searchString )], true ) );
				} else {
					oSapSplGeofenceList.getBinding ( "items" ).filter ( [] );
				}
			},

			fnToHandleSearchOfIncidents : function ( event ) {
				var searchString = event.getParameters ( ).query;
				var oSapSplIncidentsList, payload;

				oSapSplIncidentsList = this.getView ( ).byId ( "SapSplSendMessageSelectDialogListIncident" );

				if ( searchString.length > 2 ) {

					payload = this.prepareSearchPayload ( searchString, "I" );

					this.callSearchService ( payload, "I" );

				} else if ( oSapSplIncidentsList.getBinding ( "items" ) !== undefined ) {

					sap.ui.getCore ( ).getModel ( "sapSplSendMessageSelectDialogModel" ).setData ( {
						Incidents : []
					} );

					this.oSapSplApplModel.read ( "/IncidentDetails", null, ["$filter=isDeleted eq '0'"], true, jQuery.proxy ( this.fnSuccessOfIncidentsRead, this ), jQuery.proxy ( this.fnFailOfIncidentsRead, this ) );
				}
			},

			prepareSearchPayload : function ( searchTerm, pageFlag ) {
				var payload = {};
				payload.UserID = oSapSplUtils.getLoggedOnUserDetails ( ).userID;
				if ( pageFlag === "I" ) {
					payload.ObjectType = "Message";
					payload.AdditionalCriteria = {};
					payload.AdditionalCriteria.MessageObjectType = "I";
				}
				if ( pageFlag === "G" ) {
					payload.ObjectType = "Location";
					payload.AdditionalCriteria = {};
					payload.AdditionalCriteria.TagFilter = [];
					payload.AdditionalCriteria.TagFilter[0] = "LC0004";
				}
				payload.SearchTerm = searchTerm;
				payload.FuzzinessThershold = SapSplEnums.fuzzyThreshold;
				payload.MaximumNumberOfRecords = SapSplEnums.numberOfRecords;
				payload.ProvideDetails = true;
				payload.SearchInNetwork = true;

				return payload;
			},

			callSearchService : function ( payload, pageFlag ) {

				var tempObjects = [], sIndex, that = this, oSelectDialogModelData;

				oSapSplAjaxFactory.fireAjaxCall ( {
					url : oSapSplUtils.getFQServiceUrl ( "/sap/spl/xs/app/services/Search.xsjs" ),
					// CSN FIX : 0120061532 1495872 2014
					method : "POST",
					contentType : "json; charset=UTF-8",
					async : false,
					beforeSend : function ( request ) {
						request.setRequestHeader ( "X-CSRF-Token", oSapSplUtils.getCSRFToken ( ) );
						request.setRequestHeader ( "Cache-Control", "max-age=0" );
					},
					data : JSON.stringify ( payload ),
					success : function ( data, success, messageObject ) {
						oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
						if ( data.constructor === String ) {
							data = JSON.parse ( data );
						}
						if ( messageObject["status"] === 200 ) {
							oSelectDialogModelData = sap.ui.getCore ( ).getModel ( "sapSplSendMessageSelectDialogModel" ).getData ( );
							if ( data.length > 0 ) {

								for ( sIndex = 0 ; sIndex < data.length ; sIndex++ ) {
									tempObjects.push ( data[sIndex].Details );
								}

								if ( pageFlag === "I" ) {
									oSelectDialogModelData["Incidents"] = tempObjects;
									sap.ui.getCore ( ).getModel ( "sapSplSendMessageSelectDialogModel" ).setData ( oSelectDialogModelData );
								}
								if ( pageFlag === "G" ) {
									oSelectDialogModelData["Geofences"] = tempObjects;
									sap.ui.getCore ( ).getModel ( "sapSplSendMessageSelectDialogModel" ).setData ( oSelectDialogModelData );
								}

							} else {
								if ( pageFlag === "I" ) {
									oSelectDialogModelData["Incidents"] = [];
									sap.ui.getCore ( ).getModel ( "sapSplSendMessageSelectDialogModel" ).setData ( oSelectDialogModelData );
								}
								if ( pageFlag === "G" ) {
									oSelectDialogModelData["Geofences"] = [];
									sap.ui.getCore ( ).getModel ( "sapSplSendMessageSelectDialogModel" ).setData ( oSelectDialogModelData );
								}

							}
							that.oSapSplValueHelpForSelectGeofencesInput.setModel ( sap.ui.getCore ( ).getModel ( "sapSplSendMessageSelectDialogModel" ) );

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
						oSelectDialogModelData = sap.ui.getCore ( ).getModel ( "sapSplSendMessageSelectDialogModel" ).getData ( );
						if ( pageFlag === "I" ) {
							oSelectDialogModelData["Incidents"] = [];
							sap.ui.getCore ( ).getModel ( "sapSplSendMessageSelectDialogModel" ).setData ( oSelectDialogModelData );
						}
						if ( pageFlag === "G" ) {
							oSelectDialogModelData["Geofences"] = [];
							sap.ui.getCore ( ).getModel ( "sapSplSendMessageSelectDialogModel" ).setData ( oSelectDialogModelData );
						}
						that.oSapSplValueHelpForSelectGeofencesInput.setModel ( sap.ui.getCore ( ).getModel ( "sapSplSendMessageSelectDialogModel" ) );

						if ( error && error["status"] === 500 ) {
							sap.ca.ui.message.showMessageBox ( {
								type : sap.ca.ui.message.Type.ERROR,
								message : error["status"] + "\t" + error.statusText,
								details : error.responseText
							} );
						} else {
							sap.ca.ui.message.showMessageBox ( {
								type : sap.ca.ui.message.Type.ERROR,
								message : oSapSplUtils.getBundle ( ).getText ( "INCORRECT_ARGUMENTS_ERROR_MESSAGE" ),
								details : oSapSplUtils.getErrorMessagesfromErrorPayload ( JSON.parse ( error.responseText ) )["ufErrorObject"]
							} );
						}
					},
					complete : function ( ) {

					}
				} );
			}
		} );
