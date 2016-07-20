/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.require ( "splReusable.libs.SapSplMapToolbar" );
// jQuery.sap.require("splReusable.libs.SapSplNotificationCenter");
$.sap.require ( "sap.ui.thirdparty.jqueryui.jquery-ui-core" );
$.sap.require ( "sap.ui.thirdparty.jqueryui.jquery-ui-widget" );
$.sap.require ( "sap.ui.thirdparty.jqueryui.jquery-ui-mouse" );
$.sap.require ( "sap.ui.thirdparty.jqueryui.jquery-ui-draggable" );
$.sap.require ( "sap.ui.thirdparty.jqueryui.jquery-ui-sortable" );
$.sap.require ( "sap.ui.thirdparty.jqueryui.jquery-ui-droppable" );

sap.ui
		.controller (
				"splController.liveApp.liveApp",
				{

					/*************************************************
					 * **********************************************
					 * **********************************************
					 * *************oData READ METHODS START*********
					 * **********************************************
					 * **********************************************
					 ************************************************/

					/**
					 * Makes an oData call to get the location details from locaion ID.
					 * @param locationId
					 * @param fnSuccess
					 * @param fnError
					 * @returns void
					 * @since 1.0
					 * @private
					 */
					getLocationDetailsFromLocationID : function ( locationId, sLocationType, fnSuccess, fnError, bDoExpand, sExpandParam, bAsync, sEntity ) {
						/* Fix For Incident : 1570316630 */
						var sExpandParamString = "", bAsynch = (bAsync === undefined ? false : true);
						sEntity = (sEntity === undefined ? "MyLocations" : sEntity);
						if ( sLocationType === "LC0004" && bDoExpand !== false ) {
							sExpandParamString = "&$expand=Incidents,GeofenceGates";
						} else if ( sLocationType === "Truck" && bDoExpand !== false ) {
							sExpandParamString = "&$expand=StopItemAssignment";
						} else {
							sExpandParamString = "";
						}

						oSapSplBusyDialog.getBusyDialogInstance ( ).open ( );
						if ( sExpandParam !== undefined ) {
							this.oSapSplApplModel.read ( "/" + sEntity + encodeURIComponent ( "(X" + "\'" + oSapSplUtils.base64ToHex ( locationId ) + "\')/" ) + sExpandParam, null, [""], bAsynch, jQuery.proxy ( fnSuccess, this ), jQuery.proxy (
									fnError, this ) );
						} else {
							/*
							 * HOTFIX: Encode filter parameter to handle
							 * escaping of extra characters
							 */
							var sFilter = "$filter=(" + encodeURIComponent ( "LocationID eq " + "X" + "\'" + oSapSplUtils.base64ToHex ( locationId ) + "\'" ) + ")" + sExpandParamString;
							this.oSapSplApplModel.read ( "/" + sEntity, null, [sFilter], bAsynch, jQuery.proxy ( fnSuccess, this ), jQuery.proxy ( fnError, this ) );
						}

						oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
						// Hides the blocker div of dialog.
						jQuery ( ".sapUiBLy" ).css ( "z-index", "0" );
					},

					/**
					 * Event listener for the click of any objects on the Map
					 * @param void
					 * @returns void
					 * @since 1.0
					 * @private
					 */
					fnHandleClickOnVisualObjects : function ( ) {
						this.oMapToolbar.getSearchFieldLayoutInstance ( ).fnExpandCollapseSearchField ( "Collapse" );
					},

					/*
					 *Proxy stub interface object to bypass VehiclePositions Read call.
					 *The object instance methods will read from local array of trucks
					 *and display the same with no request to the backend. 
					 */
					getTruckDetailsFromDeviceUUIDProxy : {
						that : this,
						readArray : function ( oInstance, aDeviceId ) {
							var tempObject = {
								Data : []
							};
							for ( var iCount = 0 ; iCount < oInstance.aTruckArray.length ; iCount++ ) {
								for ( var jCount = 0 ; jCount < aDeviceId.length ; jCount++ ) {
									if ( oInstance.aTruckArray[iCount]["DeviceUUID"] === aDeviceId[jCount] ) {
										tempObject.Data.push ( oInstance.aTruckArray[iCount] );
										break;
									}
								}

							}
							return tempObject;
						},
						read : function ( oInstance, deviceId, successHandler, errorHandler ) {
							var tempArray = new Array ( );
							var tempObject = {
								results : []
							};
							for ( var iCount = 0 ; iCount < oInstance.aTruckArray.length ; iCount++ ) {
								if ( oInstance.aTruckArray[iCount]["DeviceUUID"] === deviceId ) {
									tempObject.results.push ( oInstance.aTruckArray[iCount] );
								}
							}

							successHandler ( tempObject );
						}
					},

					/**
					 * Makes an oData call to get truck details from the device UUID.
					 * @param deviceID
					 * @param fnSuccess
					 * @param fnError
					 * @returns void
					 * @since 1.0
					 * @private
					 */
					getTruckDetailsFromDeviceUUID : function ( deviceID, fnSuccess, fnError ) {
						/*
						 * HOTFIX: Encode filter parameter to handle escaping of
						 * extra characters
						 */
						var sFilter = "$filter=(" + encodeURIComponent ( "DeviceUUID eq " + "X" + "\'" + oSapSplUtils.base64ToHex ( deviceID ) + "\'" ) + ")";
						oSapSplBusyDialog.getBusyDialogInstance ( ).open ( );
						this.oSapSplApplModel.read ( "/VehiclePositions", null, [sFilter], false, jQuery.proxy ( fnSuccess, this ), jQuery.proxy ( fnError, this ) );
						oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
						// Hides the blocker div of dialog.
						jQuery ( ".sapUiBLy" ).css ( "z-index", "0" );

					},

					/**
					 * Makes an oData request to get the details of the incidence occurrence.
					 * @param incidenceID
					 * @param fnSuccess
					 * @param fnError
					 * @returns void
					 * @since 1.0
					 * @private
					 */
					getIncidentDetailsFromUUID : function ( incidenceID, fnSuccess, fnError ) {
						var sFilter = "$filter=(" + encodeURIComponent ( "UUID eq " + "X" + "\'" + oSapSplUtils.base64ToHex ( incidenceID ) + "\'" ) + ")";
						oSapSplBusyDialog.getBusyDialogInstance ( ).open ( );
						this.oSapSplApplModel.read ( "/OccurredIncidents", null, [sFilter], false, jQuery.proxy ( fnSuccess, this ), jQuery.proxy ( fnError, this ) );
						oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
						// Hides the blocker div of dialog.
						jQuery ( ".sapUiBLy" ).css ( "z-index", "0" );
					},

					/**
					 * Makes the service call and gets all the truck data that can be seen by the logged in user.
					 * @since 1.0
					 * @returns void
					 * @param void
					 * @private
					 */
					getTruckMetadata : function ( ) {
						var that = this;
						// Success call back for the oData read for
						// VehiclePositions. That is
						// the truck positions
						function fnSuccess ( oData ) {
							that.aTruckArray = oData.results;
							that.showTrucksOnMap ( );
						}

						// Failure call back for the oData read for
						// VehiclePositions. That is
						// the truck positions
						function fnFail ( ) {
							jQuery.sap.log.error ( "Truck position", "read failed", "liveApp.controller.js" );
						}

						if ( this.isTruckDataPollingEnabled === true ) {
							// Odata read for the truck position.
							oSapSplBusyDialog.getBusyDialogInstance ( ).open ( );
							this.oSapSplApplModel.read ( "/VehiclePositions", null, null, true, jQuery.proxy ( fnSuccess, this ), jQuery.proxy ( fnFail, this ) );
							oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
							// Hides the blocker div of dialog.
							jQuery ( ".sapUiBLy" ).css ( "z-index", "0" );
						}
					},

					/**
					 * Gets the data for the incidents occurred on the Map
					 * @returns void
					 * @param void
					 * @since 1.0
					 * @private
					 */
					getIncidenceOccurencesMetadata : function ( ) {
						var that = this;
						// Success call back for the Incidence occurrence oData
						// read
						function fnSuccess ( oData ) {
							that.aIncidenceOccuranceData = oData.results;
							that.showIncidenceOccurrencesOnMap ( );
						}

						// Failure call back for the Incidence occurrence oData
						// read
						function fnError ( ) {
							jQuery.sap.log.error ( "Incidence occurrence", "read failed", "liveApp.controller.js" );
						}

						if ( this.isIncidenceOccurrenceDataPollingEnabled === true ) {
							// oData read for the incidence occurrence position.
							oSapSplBusyDialog.getBusyDialogInstance ( ).open ( );

							/*
							 * Patch Fix for Incident : 0020079747 0001172740
							 * 2014, making the incident occurrence fetch as
							 * async
							 */
							/*
							 * Fix for console crash when location is null.
							 * Filtering on isLocationNull
							 */
							this.oSapSplApplModel.read ( "/OccurredIncidents", null, ["$filter=isLocationNull eq 0"], true, jQuery.proxy ( fnSuccess, this ), jQuery.proxy ( fnError, this ) );
							oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
							// Hides the blocker div of dialog.
							jQuery ( ".sapUiBLy" ).css ( "z-index", "0" );
						}
					},

					/*************************************************
					 * **********************************************
					 * **********************************************
					 * *********LIFE CYCLE METHODS START*************
					 * **********************************************
					 * **********************************************
					 ************************************************/

					onInit : function ( ) {
						var that = this;
						this.allowSelectAllGroupLevel = true;
						this.allowSelectAllListLevel = true;
						this.sDisplayAreaText = oSapSplUtils.getBundle ( ).getText ( "SELECT_DISPLAY_AREA" );
						this.selectedLocationKey = "Geofences";
						this.getView ( ).addEventDelegate ( {
							onAfterShow : function ( ) {
								if ( !that.bFirstTime ) {
									that.oMapToolbar.getLiveFeedInstance ( ).startPolling ( "firstTime" );
									that.bFirstTime = true;
									$ ( ".splMapTollbarBar" ).next ( ).addClass ( "setSectionWidthForMapBorder" );
									that.fetchAndSetDefaultDisplayArea ( true );
								}
								/* CSNFIX : 1570031246 */
								that.fetchAndSetDefaultDisplayArea ( false );

								/* Fix for 0020079747 0001196420 2014 */
								var oFeedFilterLayout = sap.ui.getCore ( ).byId ( $ ( ".sapSplFeedFilterLayout" ).attr ( "id" ) );
								$ ( ".sapSplFeedFilterLayoutButton" ).css ( "width", oFeedFilterLayout.$ ( ).width ( ) / oFeedFilterLayout.getItems ( ).length + "px" );

// Fix For Incident : 0020079747 0001175221 2014
								sap.ui.getCore ( ).byId ( $ ( ".sapSplTrafficStatusFooter" ).attr ( "id" ) ).rerender ( );
							}
						} );
						this.appID = "liveApp";
						sap.ui.getCore ( ).getModel ( "sapSplAppConfigDataModel" ).setData ( oSapSplUtils.getAppConfigObjectFromAllowedTiles ( this.appID )[0] );
						this.fnInitialiseControllerInstanceVariables ( );
						this.fnInstatiateMap ( );
						this.fnInstantiateToolbar ( );
						this.fnSetTextBundles ( );
						// this.fnHandleLocationCreationCancelOnTheMap();
						this.fnCreateBusinessSuiteIcons ( );
						jQuery ( window ).resize ( jQuery.proxy ( this.fnRenderStyle, this ) );
						this.getLocationViewEnum ( );

						jQuery ( document ).keydown ( function ( event ) {
							var code = event.keyCode ? event.keyCode : event.which;
							if ( code === 27 ) {
								that.fnHandleLocationCreationCancelOnTheMap ( );
							}
						} );

						this.bindLeftPanelList ( );

						this.fnHandleLeftPaneActions ( );

						if ( splReusable.libs.SapSplModelFormatters.sapSplGetVisibilityBasedOnSubscriptionModel ( sap.ui.getCore ( ).getModel ( "sapSplAppConfigDataModel" ).getData ( )["isTrucksLabelVisible"] ) ) {
							this.byId ( "sapSplTrafficStatusContainerPage" ).addStyleClass ( "showLabelsSegment" );
						}

					},

					fnHandleClickOfRadarGeofenceApprovalIcons : function ( oLocationData, sApprovalStatus, fnCallBack ) {
						function _getPayload ( oLocationData, sApprovalStatus ) {
							var oPayload = {}, RelationUUID = null;
							oPayload["Relation"] = [];

							if ( oLocationData.RadarRelationUUID ) {
								RelationUUID = oLocationData.RadarRelationUUID;
							} else {
								RelationUUID = oSapSplUtils.getUUID ( );
							}

							var oRelationPayload = {
								UUID : RelationUUID,
								ToPartner : oLocationData.OwnerID,
								FromPartner : oSapSplUtils.getCompanyDetails ( )["BasicInfo_CompanyID"],
								Relation : "FREIGHTFWD_CONTAINERTRMNL_RADR",
								Text : "",
								Status : sApprovalStatus,
								ObjectType : "ObservationGeofence",
								InstanceUUID : oLocationData.LocationID
							};

							oPayload["Relation"].push ( oRelationPayload );

							oSapSplAjaxFactory.fireAjaxCall ( {
								url : oSapSplUtils.getFQServiceUrl ( "sap/spl/xs/app/services/businessPartner.xsjs" ),
								method : "PUT",
								async : false,
								cache : false,
								data : JSON.stringify ( oPayload ),
								success : function ( data, success, messageObject ) {
									oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
									if ( data.constructor === String ) {
										data = JSON.parse ( data );
									}
									if ( messageObject["status"] === 200 && data["Error"].length === 0 ) {
										if ( oRelationPayload.Status === "1" ) {
											sap.ca.ui.message.showMessageToast ( oSapSplUtils.getBundle ( ).getText ( "GEOFENCE_ACCEPTED" ) );
										} else {
											sap.ca.ui.message.showMessageToast ( oSapSplUtils.getBundle ( ).getText ( "GEOFENCE_REJECTED" ) );
										}

										fnCallBack.call ( oRelationPayload );
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
									}
								},
								complete : function ( xhr ) {
									if ( xhr.responseText.constructor === String ) {
										xhr.responseText = JSON.parse ( xhr.responseText );
									}
									var oErrorObject = oSapSplUtils.getErrorMessagesfromErrorPayload ( xhr.responseText );
									if ( xhr.status === 400 ) {
										sap.ca.ui.message.showMessageBox ( {
											type : sap.ca.ui.message.Type.ERROR,
											message : oErrorObject["errorWarningString"],
											details : oErrorObject["ufErrorObject"]
										} );
									}
								}
							} );

						}

						if ( sApprovalStatus === "2" ) {
							sap.m.MessageBox.show ( oSapSplUtils.getBundle ( ).getText ( "REJECT_RADAR_GEOFENCE_CONFIRMATION" ), sap.m.MessageBox.Icon.NONE, oSapSplUtils.getBundle ( ).getText ( "CONFIRMATION_DIALOG_HEADER_TITLE" ), [
									sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL], function ( selection ) {
								if ( selection === "OK" ) {
									_getPayload ( oLocationData, sApprovalStatus, fnCallBack );
								}
							} );
						} else {
							_getPayload ( oLocationData, sApprovalStatus, fnCallBack );
						}

					},

					sapSplHandleClickOfSelectAllLocations : function ( oEvent ) {
						this.oGroupHeaderCheckBoxObject[this.selectedLocationKey]["All"] = oEvent.getSource ( ).getSelected ( );
						var that = this;
						jQuery.each ( this.oGroupHeaderCheckBoxObject[this.selectedLocationKey], function ( sKey, oValue ) {
							if ( sKey !== "All" ) {
								if ( oValue["control"].$ ( ).length > 0 ) {
									oValue["control"].setSelected ( oEvent.getSource ( ).getSelected ( ) );
									oValue["selected"] = oEvent.getSource ( ).getSelected ( );
									if ( that.allowSelectAllListLevel === true ) {
										oValue["control"].fireSelect ( {
											selected : oEvent.getSource ( ).getSelected ( )
										} );
									}
								} else {
									oValue["selected"] = false;
								}
							}
						} );
					},

					sapSplHandleSelectOfTruckVisibility : function ( oEvent ) {
						var oObject = {
							Trucks : ((oEvent.getSource ( ).getSelectedItems ( ).length > 0) ? true : false)
						};
						this.fnLabelToggleControlToMapInterface ( oObject );
						oSapSplMapsDataMarshal.fnHandleDetailWindowVisibility ( ((oEvent.getSource ( ).getSelectedItems ( ).length > 0) ? "Show" : "Hide"), "Trucks" );
					},

					bindLeftPanelList : function ( ) {

						this.oGroupHeaderCheckBoxObject = {};
						if ( !this.oGroupHeaderCheckBoxObject[this.selectedLocationKey] ) {
							this.oGroupHeaderCheckBoxObject[this.selectedLocationKey] = {};
						}
						var that = this;

						function handleSelectAll ( e ) {
							var oObj = that.oGroupHeaderCheckBoxObject;
							var sTitle = sap.ui.getCore ( ).byId ( e.getSource ( ).$ ( ).parent ( ).parent ( ).prop ( "id" ) ).getTitle ( );
							var aItems = oObj[that.selectedLocationKey][sTitle]["items"];
							oObj[that.selectedLocationKey][sTitle]["selected"] = e.getParameters ( ).selected;
							for ( var i = 0 ; i < aItems.length ; i++ ) {
								aItems[i].setSelected ( e.getParameters ( ).selected );
// if (that.selectedItems === undefined) {
// that.selectedItems = {};
// }
								that.selectedItems[aItems[i].getBindingContext ( ).getObject ( ).LocationID] = e.getParameters ( ).selected;
								if ( i === aItems.length - 1 && this.allowSelectAllGroupLevel === true ) {
									aItems[i].getParent ( ).fireSelect ( {
										listItem : aItems[i]
									} );
								}
							}
							this.allowSelectAllListLevel = false;
							if ( e.getParameters ( ).selected === false ) {
								this.byId ( "sapSplSelectAllLocationsCheckBox" ).setSelected ( false );
							}
							this.allowSelectAllListLevel = true;

						}

						this.byId ( "SapSplLeftPanelList" ).addEventDelegate ( {
							onAfterRendering : function ( e ) {
								var sGroupHeaderTitle = "";
								for ( var i = 0 ; i < e.srcControl.getItems ( ).length ; i++ ) {
									if ( e.srcControl.getItems ( )[i].constructor !== sap.m.StandardListItem && e.srcControl.getItems ( )[i].constructor !== sap.m.ObjectListItem ) {
										e.srcControl.getItems ( )[i].$ ( ).prepend ( "<div title=" + oSapSplUtils.getBundle ( ).getText ( "SELECT_ALL" ) + " class='selectAllCheckBox' id='checkBox" + e.srcControl.getItems ( )[i].sId + "'></div>" );
										var oSelectAllCheckBox = new sap.m.CheckBox ( {
											select : handleSelectAll.bind ( that )
										} ).placeAt ( "checkBox" + e.srcControl.getItems ( )[i].sId );
										sGroupHeaderTitle = e.srcControl.getItems ( )[i].getTitle ( );
										if ( sGroupHeaderTitle === undefined || sGroupHeaderTitle === null ) {
											sGroupHeaderTitle = "0";
										}
										if ( !that.oGroupHeaderCheckBoxObject[that.selectedLocationKey][sGroupHeaderTitle] ) {
											that.oGroupHeaderCheckBoxObject[that.selectedLocationKey][sGroupHeaderTitle] = {};
										}
										if ( that.oGroupHeaderCheckBoxObject[that.selectedLocationKey][sGroupHeaderTitle]["selected"] === undefined ) {
											that.oGroupHeaderCheckBoxObject[that.selectedLocationKey][sGroupHeaderTitle]["selected"] = false;
										} else {
											oSelectAllCheckBox.setSelected ( that.oGroupHeaderCheckBoxObject[that.selectedLocationKey][sGroupHeaderTitle]["selected"] );
										}
										that.oGroupHeaderCheckBoxObject[that.selectedLocationKey][sGroupHeaderTitle]["control"] = oSelectAllCheckBox;
										that.oGroupHeaderCheckBoxObject[that.selectedLocationKey][sGroupHeaderTitle]["items"] = [];
									} else {
										if ( that.oGroupHeaderCheckBoxObject[that.selectedLocationKey][sGroupHeaderTitle] ) {
											e.srcControl.getItems ( )[i].sGroupHeaderTitle = sGroupHeaderTitle;
											that.oGroupHeaderCheckBoxObject[that.selectedLocationKey][sGroupHeaderTitle]["items"].push ( e.srcControl.getItems ( )[i] );
										}
									}
								}
							}
						} );

						this.fnHandleSuccessOfAcceptOrRejectRadarGeofenceFromLeftPanel = function ( ) {
							this.fnShowAllVisualObjectsOnMap ( "plotSelectedGeofences" );
						};

						this.byId ( "SapSplLeftPanelList" ).bindAggregation (
								"items",
								"/",
								function ( sId, oContext ) {
									var oTemplate = null;
									if ( oContext.getObject ( ).isRadar === "0" ||
											(oContext.getObject ( ).isRadar === "1" && oContext.getObject ( ).isMyOrgObject === "1" && sap.ui.getCore ( ).getModel ( "sapSplAppConfigDataModel" ).getData ( )["canViewRulesWithoutTour"] === 1) ) {
										oTemplate = new sap.m.StandardListItem ( {
											title : "{Name}",
											selected : "{isSelected}",
											press : that.fnHandleLeftPanelItemPress.bind ( that ),
											type : "Active"
										} );

										if ( oContext.getObject ( ).isRadar === "1" ) {
											oTemplate.addStyleClass ( "leftPanelListItemHeight3" );
										}

									} else {
										if ( sap.ui.getCore ( ).getModel ( "sapSplAppConfigDataModel" ).getData ( )["canViewRulesWithoutTour"] === 1 ) {
											oTemplate = new sap.m.ObjectListItem ( {
												title : "{Name}",
												attributes : [new sap.m.ObjectAttribute ( {
													text : "{OwnerName}"
												} ), new sap.m.ObjectAttribute ( {
													text : {
														path : "RelationStatus",
														formatter : function ( sStatus ) {
															if ( sStatus === "0" ) {
																return oSapSplUtils.getBundle ( ).getText ( "RADAR_GEOFENCE_PENDING" );
															} else {
																return "";
															}
														}
													}
												} ).addStyleClass ( "radarStatus" )],
												selected : "{isSelected}",
												press : that.fnHandleLeftPanelItemPress.bind ( that ),
												type : "Active"
											} ).addStyleClass ( "radarGeofence" );
											if ( oContext.getObject ( ).RelationStatus === "0" ) {
												oTemplate.addStyleClass ( "leftPanelListItemHeight1" );
											} else {
												oTemplate.addStyleClass ( "leftPanelListItemHeight2" );
											}
										} else {
											oTemplate = new sap.m.ObjectListItem ( {
												title : "{Name}",
												selected : "{isSelected}",
												press : that.fnHandleLeftPanelItemPress.bind ( that ),
												type : "Active"
											} ).addStyleClass ( "radarGeofence" ).addStyleClass ( "leftPanelListItemHeight2" );
										}
									}

									return oTemplate.addStyleClass ( "leftPanelListItem" ).addEventDelegate ( {
										onAfterRendering : function ( oEvent ) {
											if ( oEvent.srcControl.getBindingContext ( ).getObject ( ).isRadar === "1" ) {
												var sStatus = oEvent.srcControl.getBindingContext ( ).getObject ( ).RelationStatus;
												$ ( "#approvalLayout" + oEvent.srcControl.sId ).empty ( );
												$ ( "#approvalLayout" + oEvent.srcControl.sId ).remove ( );
												$ ( "#radarIcon" + oEvent.srcControl.sId ).empty ( );
												$ ( "#radarIcon" + oEvent.srcControl.sId ).remove ( );

												oEvent.srcControl.$ ( ).append ( "<div class='radarApprovalLayout' id='approvalLayout" + oEvent.srcControl.sId + "'></div>" );
												oEvent.srcControl.$ ( ).append ( "<div class='radarIcon' id='radarIcon" + oEvent.srcControl.sId + "'></div>" );

												new sap.ui.core.Icon ( {
													src : "sap-icon://feed",
													color : "#959595"
												} ).placeAt ( "radarIcon" + oEvent.srcControl.sId );

												// canEditOrg - dispatcher
												// should not be able to
												// approve/ reject radar
												if ( (sStatus === "0" || sStatus === "2") && oEvent.srcControl.getBindingContext ( ).getObject ( ).canActOnRadar === "1" ) {
													new sap.ui.core.Icon ( {
														tooltip : oSapSplUtils.getBundle ( ).getText ( "APPROVE" ),
														src : "sap-icon://accept",
														press : function ( e ) {
															if ( e.getSource ( ).getCustomData ( ).length === 1 ) {
																e.getSource ( ).addCustomData ( new sap.ui.core.CustomData ( {
																	key : "actionHandled",
																	value : true
																} ) );
																that.fnHandleClickOfRadarGeofenceApprovalIcons ( e.getSource ( ).getCustomData ( )[0].getValue ( ), "1", that.fnHandleSuccessOfAcceptOrRejectRadarGeofenceFromLeftPanel.bind ( that ) );
															}
														}
													} ).addStyleClass ( "radarApprovalAccept" ).placeAt ( "approvalLayout" + oEvent.srcControl.sId ).addCustomData ( new sap.ui.core.CustomData ( {
														key : "context",
														value : oEvent.srcControl.getBindingContext ( ).getObject ( )
													} ) );
												}
												if ( (sStatus === "0" || sStatus === "1") && oEvent.srcControl.getBindingContext ( ).getObject ( ).canActOnRadar === "1" ) {
													new sap.ui.core.Icon ( {
														tooltip : oSapSplUtils.getBundle ( ).getText ( "REJECT" ),
														src : "sap-icon://decline",
														press : function ( e ) {
															if ( e.getSource ( ).getCustomData ( ).length === 1 ) {
																e.getSource ( ).addCustomData ( new sap.ui.core.CustomData ( {
																	key : "actionHandled",
																	value : true
																} ) );
																that.fnHandleClickOfRadarGeofenceApprovalIcons ( e.getSource ( ).getCustomData ( )[0].getValue ( ), "2", that.fnHandleSuccessOfAcceptOrRejectRadarGeofenceFromLeftPanel.bind ( that ) );
															}
														}
													} ).addStyleClass ( "radarApprovalReject" ).placeAt ( "approvalLayout" + oEvent.srcControl.sId ).addCustomData ( new sap.ui.core.CustomData ( {
														key : "context",
														value : oEvent.srcControl.getBindingContext ( ).getObject ( )
													} ) );
												}
											}

											if ( oEvent.srcControl.$ ( ).find ( ".sapMLIBContent" ).height ( ) > 80 ) {
												oEvent.srcControl.removeStyleClass ( "leftPanelListItemHeight1" );
												oEvent.srcControl.$ ( ).css ( "height", oEvent.srcControl.$ ( ).find ( ".sapMLIBContent" ).height ( ) + 8 + "px" );
											}

										}
									} );

								} );
					},

					fnToAddSIsSharedFieldToLeftPanelModel : function ( data ) {
						for ( var i = 0 ; i < data.results.length ; i++ ) {
							var sIsPublic = data.results[i]["isPublic"];
							var sIsRadar = data.results[i]["isRadar"];
							var sIsMyOrgObject = data.results[i]["isMyOrgObject"];
							var bIsCarrier = (sap.ui.getCore ( ).getModel ( "sapSplAppConfigDataModel" ).getData ( )["canViewRulesWithoutTour"] === 1) ? "1" : "0";

							var x = sIsPublic + sIsRadar + bIsCarrier + sIsMyOrgObject;

							if ( x === "1010" ) {
								data.results[i].sIsShared = "2";
							} else if ( x === "1000" ) {
								data.results[i].sIsShared = "2";
							} else if ( x === "0111" ) {
								data.results[i].sIsShared = "0";
							} else if ( x === "0011" ) {
								data.results[i].sIsShared = "0";
							} else if ( x === "0110" ) {
								data.results[i].sIsShared = "1";
							} else if ( x === "0001" ) {
								data.results[i].sIsShared = "0";
							} else if ( x === "0101" ) {
								data.results[i].sIsShared = "1";
							} else if ( x === "1001" ) {
								data.results[i].sIsShared = "1";
							} else {
								data.results[i].sIsShared = "1";
							}

// if (( sIsMyOrgObject ==="1" && sIsRadar ==="1" && bIsCarrier && sIsPublic ===
// "0")||( sIsMyOrgObject ==="1" && sIsRadar ==="0" && sIsPublic === "0")){
// data.results[i].sIsShared = "0"; // private
// } else if ( sIsPublic === "1"){
// data.results[i].sIsShared = "2"; // public
// } else if(( sIsMyOrgObject === "0" && sIsRadar === "1")||( sIsMyOrgObject ===
// "1" && sIsRadar === "0")){
// data.results[i].sIsShared = "1"; //shared
// }
						}
						return data;
					},

					fnHandleLeftPaneActions : function ( ) {

						var that = this;
						// Setting name model leftpanel
						this.byId ( "sapSplLeftPanelTitle" ).setText ( oSapSplUtils.getBundle ( ).getText ( "ENTITIES" ) );

						if ( !sap.ui.getCore ( ).getModel ( "SapSplLeftPanelListModel" ) ) {
							var oModel = new sap.ui.model.json.JSONModel ( );
							sap.ui.getCore ( ).setModel ( oModel, "SapSplLeftPanelListModel" );
							this.byId ( "SapSplLeftPanelList" ).setModel ( sap.ui.getCore ( ).getModel ( "SapSplLeftPanelListModel" ) );
						}

						this.oSapSplApplModel.read ( "MyLocations", null, null, false, function ( data ) {
							for ( var i = 0 ; i < data.results.length ; i++ ) {
								data.results[i].isSelected = false;
							}
							sap.ui.getCore ( ).getModel ( "SapSplLeftPanelListModel" ).setSizeLimit ( data.results.length + 1 );

							data = that.fnToAddSIsSharedFieldToLeftPanelModel ( data );

							sap.ui.getCore ( ).getModel ( "SapSplLeftPanelListModel" ).setData ( data.results );
						}, function ( ) {

						} );

						var oSorter = new sap.ui.model.Sorter ( "sIsShared", false, this.handleGroupingOfLocations );
						var oNameSorter = new sap.ui.model.Sorter ( "Name", false );

						this.byId ( "SapSplLeftPanelList" ).getBinding ( "items" ).sort ( [oSorter, oNameSorter] );

						var oFilter = new sap.ui.model.Filter ( "Tag", sap.ui.model.FilterOperator.EQ, "LC0004" );
						this.byId ( "SapSplLeftPanelList" ).getBinding ( "items" ).filter ( [oFilter, new sap.ui.model.Filter ( "Tag", sap.ui.model.FilterOperator.EQ, "LC0008" )] );

						this.byId ( "sapSnlhGroupTitlelabelInfoToolBar" ).setText ( oSapSplUtils.getBundle ( ).getText ( "GROUPED_BY_SHARING" ) );

						this.byId ( "SapSplLeftPanelList" ).attachBrowserEvent (
								"mouseover",
								function ( oEvent ) {

									if ( sap.ui.getCore ( ).byId ( oEvent.target.id ) &&
											(sap.ui.getCore ( ).byId ( oEvent.target.id ).constructor === sap.m.StandardListItem || sap.ui.getCore ( ).byId ( oEvent.target.id ).constructor === sap.m.ObjectListItem) &&
											sap.ui.getCore ( ).byId ( oEvent.target.id ).getSelected ( ) === true ) {
										if ( sap.ui.getCore ( ).byId ( oEvent.target.id ) && sap.ui.getCore ( ).byId ( oEvent.target.id ).getBindingContext ( ).getProperty ( ).Tag === "LC0004" || sap.ui.getCore ( ).byId ( oEvent.target.id ) &&
												sap.ui.getCore ( ).byId ( oEvent.target.id ).getBindingContext ( ).getProperty ( ).Tag === "LC0008" ) {
											if ( sap.ui.getCore ( ).byId ( oEvent.target.id ).getBindingContext ( ).getProperty ( ).Geometry ) {
												oSapSplMapsDataMarshal.fnShowFences ( sap.ui.getCore ( ).byId ( oEvent.target.id ).getBindingContext ( ).getProperty ( ), sap.ui.getCore ( ).byId ( "splView.liveApp.liveApp" ).getController ( ).byId (
														"oSapSplLiveAppMap" ), "onFocus" );
											}
										} else {
											if ( sap.ui.getCore ( ).byId ( oEvent.target.id ).getBindingContext ( ).getProperty ( ).Geometry ) {
												if ( sap.ui.getCore ( ).byId ( oEvent.target.id ).getBindingContext ( ).getProperty ( ).Geometry ) {
													oSapSplMapsDataMarshal.fnShowPointOfInterestFlags ( sap.ui.getCore ( ).byId ( oEvent.target.id ).getBindingContext ( ).getProperty ( ), sap.ui.getCore ( ).byId ( "splView.liveApp.liveApp" )
															.getController ( ).byId ( "oSapSplLiveAppMap" ), "onFocus" );
												}
											}
										}

										if ( sap.ui.getCore ( ).byId ( "splView.liveApp.liveApp" ).getController ( ).previousFocused ) {
											if ( sap.ui.getCore ( ).byId ( oEvent.target.id ) && sap.ui.getCore ( ).byId ( oEvent.target.id ).getBindingContext ( ) &&
													(sap.ui.getCore ( ).byId ( "splView.liveApp.liveApp" ).getController ( ).previousFocused !== sap.ui.getCore ( ).byId ( oEvent.target.id ).getBindingContext ( ).getProperty ( )) ) {
												if ( sap.ui.getCore ( ).byId ( "splView.liveApp.liveApp" ).getController ( ).previousFocused.Tag === "LC0004" ||
														sap.ui.getCore ( ).byId ( "splView.liveApp.liveApp" ).getController ( ).previousFocused.Tag === "LC0008" ) {
													if ( sap.ui.getCore ( ).byId ( "splView.liveApp.liveApp" ).getController ( ).previousFocused.Geometry ) {
														oSapSplMapsDataMarshal.fnShowFences ( sap.ui.getCore ( ).byId ( "splView.liveApp.liveApp" ).getController ( ).previousFocused, sap.ui.getCore ( ).byId ( "splView.liveApp.liveApp" )
																.getController ( ).byId ( "oSapSplLiveAppMap" ) );
														oSapSplMapsDataMarshal.fnHandleDetailWindowVisibility ( "Hide", "Geofence" );
													}

												} else {
													if ( sap.ui.getCore ( ).byId ( "splView.liveApp.liveApp" ).getController ( ).previousFocused.Geometry ) {
														oSapSplMapsDataMarshal.fnShowPointOfInterestFlags ( sap.ui.getCore ( ).byId ( "splView.liveApp.liveApp" ).getController ( ).previousFocused, sap.ui.getCore ( ).byId ( "splView.liveApp.liveApp" )
																.getController ( ).byId ( "oSapSplLiveAppMap" ) );
													}
												}
											}
										}

										if ( sap.ui.getCore ( ).byId ( oEvent.target.id ) && sap.ui.getCore ( ).byId ( oEvent.target.id ).getSelected ( ) && sap.ui.getCore ( ).byId ( oEvent.target.id ).getBindingContext ( ) ) {
											sap.ui.getCore ( ).byId ( "splView.liveApp.liveApp" ).getController ( ).previousFocused = sap.ui.getCore ( ).byId ( oEvent.target.id ).getBindingContext ( ).getProperty ( );
										}
									}
									// check if "Approval" scenario should be
									// shown on hover.
									if ( sap.ui.getCore ( ).byId ( oEvent.target.id ) && sap.ui.getCore ( ).byId ( oEvent.target.id ).getBindingContext ( ) &&
											sap.ui.getCore ( ).byId ( oEvent.target.id ).getBindingContext ( ).getObject ( ).isRadar === "1" ) {
										if ( sap.ui.getCore ( ).byId ( oEvent.target.id ).constructor === sap.m.StandardListItem || sap.ui.getCore ( ).byId ( oEvent.target.id ).constructor === sap.m.ObjectListItem ) {
											$ ( ".leftPanelListItem" ).removeClass ( "leftPanelListItemHovered" );
											sap.ui.getCore ( ).byId ( oEvent.target.id ).$ ( ).addClass ( "leftPanelListItemHovered" );
										}
									} else if ( sap.ui.getCore ( ).byId ( oEvent.target.id ) && sap.ui.getCore ( ).byId ( oEvent.target.id ).getBindingContext ( ) &&
											sap.ui.getCore ( ).byId ( oEvent.target.id ).getBindingContext ( ).getObject ( ).isRadar === "0" ) {
										if ( sap.ui.getCore ( ).byId ( oEvent.target.id ).constructor === sap.m.StandardListItem || sap.ui.getCore ( ).byId ( oEvent.target.id ).constructor === sap.m.ObjectListItem ) {
											$ ( ".leftPanelListItem" ).removeClass ( "leftPanelListItemHovered" );
										}
									}
								} );

						this.byId ( "SapSplLeftPanelList" ).attachBrowserEvent ( "mouseout", function ( ) {
						// if(
						// this.getParent().getParent().getParent().getParent().getParent().getParent().getController().previousFocused
						// ) {
						// if(this.getParent().getParent().getParent().getParent().getParent().getParent().getController().selectedItems[this.getParent().getParent().getParent().getParent().getParent().getParent().getController().previousFocused.LocationID])
						// {
						// if(this.getParent().getParent().getParent().getParent().getParent().getParent().getController().previousFocused.Tag
						// === "LC0004") {
						// oSapSplMapsDataMarshal.fnShowFences(this.getParent().getParent().getParent().getParent().getParent().getParent().getController().previousFocused,
						// this.getParent().getParent().getParent().getParent().getParent().getParent().getController().byId("oSapSplLiveAppMap"));
						// oSapSplMapsDataMarshal.fnHandleDetailWindowVisibility(
						// "Hide",
						// "Geofence" );
						// } else {
						// oSapSplMapsDataMarshal.fnShowPointOfInterestFlags(this.getParent().getParent().getParent().getParent().getParent().getParent().getController().previousFocused,
						// this.getParent().getParent().getParent().getParent().getParent().getParent().getController().byId("oSapSplLiveAppMap"));
						// }
						// }
						// }
						} );
					},

					/**
					 * Handles the click of left panel items
					 * @param oEvent
					 * @returns void
					 * @since 1.0
					 * @private
					 */
					fnHandleLeftPanelItemPress : function ( oEvent ) {
						if ( oEvent.getSource ( ).getSelected ( ) === true ) {
							this.fnLeftPaneToMapInterface ( oEvent.getSource ( ).getBindingContext ( ).getObject ( ) );
						}
					},

					/**
					 * Interface from left pane to Map
					 * @param oEvent
					 * @returns void
					 * @since 1.0
					 * @private
					 */
					fnLeftPaneToMapInterface : function ( oData, sMode, fnHandler ) {

						var that = this, oEventData = oData;
						/* Fix For Incident : 1570316630 */
						this.getLocationDetailsFromLocationID ( oData["LocationID"], oData["Tag"], function ( aResults ) {
							oData = aResults.results[0];
							var oPopoverOffset = null;
							// if (sMode === "Cluster") {
							oPopoverOffset = that.fnGetPopoverOffsets ( "fromMap" );
							// }
							var sCoords;

							if ( oData["Tag"] === "LC0004" || oData["Tag"] === "LC0008" ) {
								sCoords = oSapSplMapsDataMarshal.convertGeoJSONToString ( JSON.parse ( oData["Geometry"] ) );
								sCoords = oSapSplMapsDataMarshal.fnGetPointFromPolygon ( sCoords );
							} else {
								sCoords = oSapSplMapsDataMarshal.convertGeoJSONToString ( JSON.parse ( oData["Geometry"] ) );
							}
							var sLat = sCoords.split ( ";" )[1];
							var sLong = sCoords.split ( ";" )[0];
							if ( sMode !== "Cluster" ) {
								/* Fix for incident 1580086182 */
								if ( oData["Tag"] === "LC0004" || oData["Tag"] === "LC0008" ) {
									if ( oData.Geometry && JSON.parse ( oData.Geometry ).coordinates.length > 0 ) {
										that.byId ( "oSapSplLiveAppMap" ).zoomToAreas ( JSON.parse ( oData.Geometry ).coordinates[0], true );
									}
								} else {
									that.byId ( "oSapSplLiveAppMap" ).zoomToGeoPosition ( parseFloat ( sLong, 10 ), parseFloat ( sLat, 10 ), 15 );
								}
								var oCoordinateObject = oSapSplMapsDataMarshal.convertGeoCoordToScreenCoord ( sCoords, that.byId ( "oSapSplLiveAppMap" ) );
								var popoverPositionObject = that.getPopoverOpeningDirection ( oCoordinateObject["left"], oCoordinateObject["top"] );
								oData.x = parseInt ( popoverPositionObject.x + oPopoverOffset["x"], 10 );
								oData.y = parseInt ( popoverPositionObject.y + oPopoverOffset["y"], 10 );
								oData.placement = popoverPositionObject.placement;
							} else {
								oData.x = oEventData["x"];
								oData.y = oEventData["y"];
								oData.placement = oEventData["placement"];
								oData.introduceFooterZoomInButton = true;
								oData.zoomInButtonHandler = fnHandler;
							}

							if ( oData["Tag"] === "LC0002" && oData["Geometry"] ) {
								that.parkingSpaceDisplayHandler ( oData );
							} else if ( (oData["Tag"] === "LC0003" || oData["Tag"] === "LC0007") && oData["Geometry"] ) {
								that.fnContainerTerminalDisplayHandler ( oData );
							} else {
								if ( oData["Geometry"] ) {
									that.fnHandleDisplayOflocations ( oData );
								}
							}
						}, function ( ) {
							jQuery.sap.log.error ( "fnHandleLocationDetailsDisplay", "Failure of function call", "liveApp.controller.js" );
						} );

					},

					fnHandleLeftPanelIconTabBarSelect : function ( event ) {

						var oSapSplListItemsBinding = this.byId ( "SapSplLeftPanelList" ).getBinding ( "items" );
						var oFilter, index;
						this.selectedLocationKey = event.getParameters ( ).selectedKey;
						if ( !this.oGroupHeaderCheckBoxObject[this.selectedLocationKey] ) {
							this.oGroupHeaderCheckBoxObject[this.selectedLocationKey] = {};
						}
						this.byId ( "sapSplSelectAllLocationsCheckBox" ).setSelected ( (this.oGroupHeaderCheckBoxObject[this.selectedLocationKey]["All"] === undefined) ? false : this.oGroupHeaderCheckBoxObject[this.selectedLocationKey]["All"] );
						if ( event.getParameters ( ).selectedKey === "Geofences" ) {
							oFilter = new sap.ui.model.Filter ( "Tag", sap.ui.model.FilterOperator.EQ, "LC0004" );
							index = 0;
							event.getSource ( ).getItems ( )[0].setIcon ( "./resources/icons/tab_geofence_focus.png" );
							this.byId ( "SapSplLeftPanelList" ).setNoDataText ( oSapSplUtils.getBundle ( ).getText ( "NO_DATA_TEXT_GEOFENCE" ) );
							this.byId ( "sapSplSelectAllLocationsCheckBox" ).setText ( oSapSplUtils.getBundle ( ).getText ( "SELECT_ALL_GEOFENCES" ) );
							oSapSplListItemsBinding.filter ( [oFilter, new sap.ui.model.Filter ( "Tag", sap.ui.model.FilterOperator.EQ, "LC0008" )] );
							this.byId ( "sapSplLeftPanelGroupButton" ).setVisible ( true );
							this.byId ( "sapSplLeftPanelFilterButton" ).setVisible ( true );

						} else if ( event.getParameters ( ).selectedKey === "Bridge" ) {
							oFilter = new sap.ui.model.Filter ( "Tag", sap.ui.model.FilterOperator.EQ, "LC0001" );
							index = 4;
							event.getSource ( ).getItems ( )[4].setIcon ( "./resources/icons/tab_bridge_focus.png" );
							this.byId ( "SapSplLeftPanelList" ).setNoDataText ( oSapSplUtils.getBundle ( ).getText ( "NO_BRIDGES_TEXT" ) );
							this.byId ( "sapSplSelectAllLocationsCheckBox" ).setText ( oSapSplUtils.getBundle ( ).getText ( "SELECT_ALL_BRIDGES" ) );
							oSapSplListItemsBinding.filter ( [oFilter] );
							this.byId ( "sapSplLeftPanelGroupButton" ).setVisible ( false );
							this.byId ( "sapSplLeftPanelFilterButton" ).setVisible ( false );

						} else if ( event.getParameters ( ).selectedKey === "ParkingSpace" ) {
							oFilter = new sap.ui.model.Filter ( "Tag", sap.ui.model.FilterOperator.EQ, "LC0002" );
							index = 2;
							event.getSource ( ).getItems ( )[2].setIcon ( "./resources/icons/tab_parking_focus.png" );
							this.byId ( "SapSplLeftPanelList" ).setNoDataText ( oSapSplUtils.getBundle ( ).getText ( "NO_PARKING_SPACES_TEXT" ) );
							this.byId ( "sapSplSelectAllLocationsCheckBox" ).setText ( oSapSplUtils.getBundle ( ).getText ( "SELECT_ALL_PARKINGSPACES" ) );
							oSapSplListItemsBinding.filter ( [oFilter] );
							this.byId ( "sapSplLeftPanelGroupButton" ).setVisible ( false );
							this.byId ( "sapSplLeftPanelFilterButton" ).setVisible ( false );
						} else if ( event.getParameters ( ).selectedKey === "ContainerTerminals" ) {
							oFilter = new sap.ui.model.Filter ( "Tag", sap.ui.model.FilterOperator.EQ, "LC0003" );
							index = 6;
							event.getSource ( ).getItems ( )[6].setIcon ( "./resources/icons/tab_container_terminal_focus.png" );
							this.byId ( "SapSplLeftPanelList" ).setNoDataText ( oSapSplUtils.getBundle ( ).getText ( "NO_CONTAINER_TERMINALS_TEXT" ) );
							this.byId ( "sapSplSelectAllLocationsCheckBox" ).setText ( oSapSplUtils.getBundle ( ).getText ( "SELECT_ALL_CONTAINERTERMINALS" ) );
							oSapSplListItemsBinding.filter ( [oFilter] );
							this.byId ( "sapSplLeftPanelGroupButton" ).setVisible ( false );
							this.byId ( "sapSplLeftPanelFilterButton" ).setVisible ( false );
						} else {
							oFilter = new sap.ui.model.Filter ( "Tag", sap.ui.model.FilterOperator.EQ, "LC0007" );
							index = 8;
							event.getSource ( ).getItems ( )[8].setIcon ( "./resources/icons/tab_container_depot_focus.png" );
							this.byId ( "SapSplLeftPanelList" ).setNoDataText ( oSapSplUtils.getBundle ( ).getText ( "NO_CONTAINER_DEPOTS_TEXT" ) );
							this.byId ( "sapSplSelectAllLocationsCheckBox" ).setText ( oSapSplUtils.getBundle ( ).getText ( "SELECT_ALL_CONTAINERDEPOTS" ) );
							oSapSplListItemsBinding.filter ( [oFilter] );
							this.byId ( "sapSplLeftPanelGroupButton" ).setVisible ( false );
							this.byId ( "sapSplLeftPanelFilterButton" ).setVisible ( false );
						}

						for ( var i = 0 ; i < event.getSource ( ).getItems ( ).length ; i++ ) {
							if ( i !== index ) {
								if ( i === 0 ) {
									event.getSource ( ).getItems ( )[i].setIcon ( "./resources/icons/tab_geofence_normal.png" );
								} else if ( i === 2 ) {
									event.getSource ( ).getItems ( )[i].setIcon ( "./resources/icons/tab_parking_normal.png" );
								} else if ( i === 4 ) {
									event.getSource ( ).getItems ( )[i].setIcon ( "./resources/icons/tab_bridge_normal.png" );
								} else if ( i === 6 ) {
									event.getSource ( ).getItems ( )[i].setIcon ( "./resources/icons/tab_container_terminal_normal.png" );
								} else {
									event.getSource ( ).getItems ( )[i].setIcon ( "./resources/icons/tab_container_depot_normal.png" );
								}
							}
							i++;
						}

					},

					handleGroupingOfLocations : function ( oContext ) {
						var sKey = oContext.getProperty ( "Tag" );
						var sType = oContext.getProperty ( "isPublic" );

						if ( sKey === "LC0001" ) {
							if ( sType === "1" ) {
								return {
									key : "PublicBridge",
									text : oSapSplUtils.getBundle ( ).getText ( "PUBLIC_BRIDGES" )
								};
							} else {
								return {
									key : "PrivateBridge",
									text : oSapSplUtils.getBundle ( ).getText ( "PRIVATE_BRIDGES" )
								};
							}

						}
						if ( sKey === "LC0002" ) {
							if ( sType === "1" ) {
								return {
									key : "PublicParkingSpace",
									text : oSapSplUtils.getBundle ( ).getText ( "PUBLIC_PARKING_SPACES" )
								};
							} else {
								return {
									key : "PrivateParkingSpace",
									text : oSapSplUtils.getBundle ( ).getText ( "PRIVATE_PARKING_SPACES" )
								};
							}

						}
						if ( sKey === "LC0003" ) {
							if ( sType === "1" ) {
								return {
									key : "PublicContainerTerminals",
									text : oSapSplUtils.getBundle ( ).getText ( "PUBLIC_CONTAINER_TERMINALS" )
								};
							} else {
								return {
									key : "PrivateContainerTerminals",
									text : oSapSplUtils.getBundle ( ).getText ( "PRIVATE_CONTAINER_TERMINALS" )
								};
							}

						}
						if ( sKey === "LC0004" || sKey === "LC0008" ) {

							var sIsShared = oContext.getProperty ( "sIsShared" );

							if ( this.sPath === "sIsShared" ) {
								if ( sIsShared === "1" ) {
									return {
										key : "SharedGeofences",
										text : oSapSplUtils.getBundle ( ).getText ( "SHARED_GEOFENCES" )
									};
								} else if ( sIsShared === "0" ) {
									return {
										key : "PrivateGeofences",
										text : oSapSplUtils.getBundle ( ).getText ( "PRIVATE_GEOFENCES" )
									};
								} else if ( sIsShared === "2" ) {
									return {
										key : "PublicGeofences",
										text : oSapSplUtils.getBundle ( ).getText ( "PUBLIC_GEOFENCES" )
									};
								}
							} else if ( this.sPath === "OwnerName" ) {
								sType = oContext.getProperty ( "isMyOrgObject" );
								if ( sType === "1" ) {
									return {
										key : "MyCompany",
										text : oSapSplUtils.getBundle ( ).getText ( "MY_COMPANY_GEOFENCES" )
									};
								} else {
									return {
										key : oContext.getProperty ( "OwnerName" ),
										text : oContext.getProperty ( "OwnerName" )
									};
								}
							}
						}

						if ( sKey === "LC0007" ) {
							if ( sType === "1" ) {
								return {
									key : "PublicContainerDepots",
									text : oSapSplUtils.getBundle ( ).getText ( "PUBLIC_CONTAINER_DEPOTS" )
								};
							} else {
								return {
									key : "PrivateContainerDepots",
									text : oSapSplUtils.getBundle ( ).getText ( "PRIVATE_CONTAINER_DEPOTS" )
								};
							}

						}

					},

					fnHandleSapSplLeftPanelListItemSelect : function ( oEvent ) {
						var selectedItems = [];

// if ( this.selectedItems === undefined ) {
// this.selectedItems = {};
// }
						if ( oEvent.getParameters ( ).listItem.getSelected ( ) === false ) {
							this.previousFocused = null;
							this.selectedItems[oEvent.getParameters ( ).listItem.getBindingContext ( ).getProperty ( ).LocationID] = false;

							// fix for internal incident 1482007927
							oSapSplMapsDataMarshal.fnHandleDetailWindowVisibility ( "Hide", "Geofence" );

							var sGroupHeaderTitle = "";
							if ( oEvent.getParameters ( ).listItem.sGroupHeaderTitle !== undefined ) {
								this.allowSelectAllGroupLevel = false;
								sGroupHeaderTitle = oEvent.getParameters ( ).listItem.sGroupHeaderTitle;
								this.oGroupHeaderCheckBoxObject[this.selectedLocationKey][sGroupHeaderTitle]["control"].setSelected ( false );
								this.allowSelectAllGroupLevel = true;
								this.allowSelectAllListLevel = false;
								this.byId ( "sapSplSelectAllLocationsCheckBox" ).setSelected ( false );
								this.allowSelectAllListLevel = true;
							}

						} else {
							this.selectedItems[oEvent.getParameters ( ).listItem.getBindingContext ( ).getProperty ( ).LocationID] = true;
						}
						for ( var i = 0 ; i < sap.ui.getCore ( ).getModel ( "SapSplLeftPanelListModel" ).getData ( ).length ; i++ ) {
							if ( sap.ui.getCore ( ).getModel ( "SapSplLeftPanelListModel" ).getData ( )[i].isSelected ) {
								if ( sap.ui.getCore ( ).getModel ( "SapSplLeftPanelListModel" ).getData ( )[i].Geometry ) {
									selectedItems.push ( sap.ui.getCore ( ).getModel ( "SapSplLeftPanelListModel" ).getData ( )[i] );
								}
							}
						}
						oSapSplMapsDataMarshal.fnShowVOsOnMap ( selectedItems, this.byId ( "oSapSplLiveAppMap" ) );
						this.aSelectedLocationObjectsFromLeftPanel = selectedItems;
						// to display Trucks & Incident Occurence
						this.showTrucksOnMap ( );
						this.showIncidenceOccurrencesOnMap ( );

					},

					fnCreateBusinessSuiteIcons : function ( ) {
						jQuery.sap.require ( "sap.ui.core.IconPool" );

						sap.ui.core.IconPool.addIcon ( "icon-traffic-cone", "bussiness-suite", "businessSuiteIcons", "e06f;" );
						sap.ui.core.IconPool.addIcon ( "icon-traffic-lights", "bussiness-suite", "businessSuiteIcons", "e06e;" );
						sap.ui.core.IconPool.addIcon ( "icon-container", "bussiness-suite", "businessSuiteIcons", "e070;" );
						sap.ui.core.IconPool.addIcon ( "icon-container-loading", "bussiness-suite", "businessSuiteIcons", "e071;" );
						sap.ui.core.IconPool.addIcon ( "icon-traffic-jam", "bussiness-suite", "businessSuiteIcons", "e072;" );
						sap.ui.core.IconPool.addIcon ( "icon-truck-driver", "bussiness-suite", "businessSuiteIcons", "e076;" );
					},

					fnFetchDefaultDisplay : function ( ) {
						var aDefaultDisplayAreas = [];

						oSapSplAjaxFactory.fireAjaxCall ( {
							url : oSapSplUtils.getFQServiceUrl ( "/sap/spl/xs/utils/services/utils.xsodata/" ) + "Enumeration('FacilityAvailabilityStatus')/Values?$format=json",
							method : "GET",
							success : function ( data ) {
								aDefaultDisplayAreas = data.d.results;
							},
							error : function ( ) {},
							async : false,
							json : true
						} );

						return aDefaultDisplayAreas;
					},

					onBeforeShow : function ( oEvent ) {
						this.fnRenderStyle ( );
// this.fnShowAllVisualObjectsOnMap ( );
						this.startPollingOfAllComponents ( );
						this.setCurrentAppInfo ( oEvent );
						if ( oEvent && oEvent.data && oEvent.data.showBackButton ) {
							this.oMapToolbar.getContentLeft ( )[0].setVisible ( true );
						}
						/* To Handle context based navigation from tours app */
						if ( oEvent.data && oEvent.data["FromApp"] === "tours" ) {
							if ( oEvent.data["TruckInfo"] ) {
								this.bZoomToTruck = true;
								this.oZoomToTruckData = oEvent.data["TruckInfo"];
							}
						}

						this.fnFetchDefaultDisplay ( );

						sap.ui.getCore ( ).getModel ( "sapSplAppConfigDataModel" ).setData ( oSapSplUtils.getAppConfigObjectFromAllowedTiles ( this.appID )[0] );
					},

					setCurrentAppInfo : function ( oEvent ) {
						oSapSplHelpHandler
								.setAppHelpInfo (
										{
											iUrl : "./help/SCLApp.pdf",
											eUrl : "//help.sap.com/saphelp_scl10/helpdata/en/52/02e3537a0e9438e10000000a44176d/content.htm?frameset=/en/c9/50e853c0bb9438e10000000a44176d/frameset.htm&current_toc=/en/b7/8ee25341d61e4ee10000000a423f68/plain.htm&node_id=8"
										}, oEvent );
					},

					startPollingOfAllComponents : function ( ) {
						var that = this;
						var getTruckMetadataInterval;
						var getIncidencesMetadataInterval;
						this.oMapToolbar.getLiveFeedInstance ( ).startPolling ( );
						var oListOfChatBoxes = this.oMapToolbar.getLiveFeedInstance ( ).getChatBoxInstances ( );
						jQuery.each ( oListOfChatBoxes, function ( sKey, oValue ) {
							oValue.startPolling ( );
						} );

						/* CSNFIX : 0120061532 1461187 2014 */
						// Polls for the truck data in every minute
						if ( getTruckMetadataInterval ) {
							window.clearInterval ( getTruckMetadataInterval );
						}
						getTruckMetadataInterval = window.setInterval ( function ( ) {
							that.getTruckMetadata ( );
						}, SapSplEnums.VehiclePositionsPollingTime );

						oSapSplUtils.setIntervalId ( getTruckMetadataInterval );

						// Polls for the incidence occurrence data in every
						// minute
						if ( getIncidencesMetadataInterval ) {
							window.clearInterval ( getIncidencesMetadataInterval );
						}
						getIncidencesMetadataInterval = window.setInterval ( function ( ) {
							that.getIncidenceOccurencesMetadata ( );
						}, SapSplEnums.IncidentOccurencePollingTime );

						oSapSplUtils.setIntervalId ( getIncidencesMetadataInterval );
					},

					fetchAndSetDefaultDisplayArea : function ( bFirst ) {
						var that = this;
						var zoomObject = {};

						function fnSuccess ( oData ) {
							if ( oData.results && oData.results.length > 0 ) {

								that.byId ( "oSapSplLiveAppMap" ).defaultDisplayArea = oData.results[0];
								var sCoords = oSapSplMapsDataMarshal.convertGeoJSONToString ( JSON.parse ( oData.results[0].DisplayArea_Center ) ).split ( ";" );
								zoomObject.lon = parseFloat ( sCoords[0], 10 );
								zoomObject.lat = parseFloat ( sCoords[1], 10 );
								zoomObject.zoomLevel = parseFloat ( oData.results[0].DisplayArea_ZoomLevel, 10 );
								oSapSplMapsDataMarshal.fnSetZoomAndCenter ( that.byId ( "oSapSplLiveAppMap" ), zoomObject );
								if ( oData.results[0].isDefault === 1 ) {
									that.oMapToolbar.getContentLeft ( )[2].setText ( oData.results[0].Name + " *" );
								} else {
									that.oMapToolbar.getContentLeft ( )[2].setText ( oData.results[0].Name );
								}

							} else {
								that.byId ( "oSapSplLiveAppMap" ).defaultDisplayArea = null;
							}
						}

						function fnFail ( ) {
							jQuery.sap.log.error ( "Default Display Area", "read failed", "liveApp.controller.js" );
						}

						if ( bFirst ) {
							oSapSplBusyDialog.getBusyDialogInstance ( ).open ( );
							this.oSapSplApplModel.read ( "/ViewList", null, ["$filter=isDefault eq 1"], true, jQuery.proxy ( fnSuccess, this ), jQuery.proxy ( fnFail, this ) );
							oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
							jQuery ( ".sapUiBLy" ).css ( "z-index", "0" );
						} else {
							/* CSNFIX : 1570031246 */
							this.oMapToolbar.getContentLeft ( )[2].setText ( this.sDisplayAreaText );
						}

					},

					onAfterRendering : function ( ) {
						this.fnRenderStyle ( );
						this.getTruckMetadata ( );
						this.getIncidenceOccurencesMetadata ( );
						this.getView ( ).$ ( ).append ( "<div id='chatBoxConsoleContainerDiv'></div>" );
						this.oMapToolbar.getLiveFeedInstance ( ).placeChatBoxControl ( );

						splReusable.libs.SapSplStyleSheetLoader.loadStyle ( "./resources/styles/sapSplLiveApp", "css" );
						splReusable.libs.SapSplStyleSheetLoader.loadStyle ( "./resources/styles/sapSplMapToolbar", "css" );
					},

					/*************************************************
					 * **********************************************
					 * **********************************************
					 * ******CONTROLLER SPECIFIC METHODS START*******
					 * **********************************************
					 * **********************************************
					 ************************************************/

					/**
					 * Loads the configuration object and instatiate the Map
					 * @param void
					 * @returns void
					 * @since 1.0
					 * @private
					 */
					fnInstatiateMap : function ( ) {
						// Sets the JSON model for Visual Business Map
						this.oVBIModel = new sap.ui.model.json.JSONModel ( );
						this.oVBIModel.setData ( oSapSplMapsDataMarshal.getMapsModelJSON ( SapSplEnums.configJSON ) );
						sap.ui.getCore ( ).setModel ( this.oVBIModel, "oSapSplVBModelLiveApp" );
						this.getView ( ).byId ( "oSapSplLiveAppMap" ).bindProperty ( "config", "oSapSplVBModelLiveApp>/" );
						this.getView ( ).byId ( "oSapSplLiveAppMap" ).setModel ( sap.ui.getCore ( ).getModel ( "oSapSplVBModelLiveApp" ) );
					},

					/**
					 * Based on the header and button size, it calculates the offsetX and offsetY
					 * @param void
					 * @returns void
					 * @since 1.0
					 * @private
					 */
					fnGetPopoverOffsets : function ( sContext ) {
						var iShellHeaderHeight = jQuery ( ".sapUiUfdShellHead" ).height ( );
						var iAppHeaderHeight = jQuery ( ".splMapTollbarBar" ).height ( );
						var iAnchorButtonHeight = jQuery ( ".oPopoverAnchorButton" ).height ( );
						var iAnchorButtonWidth = jQuery ( ".oPopoverAnchorButton" ).width ( );
						var iMasterPaneWidth = jQuery ( ".sapSplLeftPanelMasterPage" ).width ( );
						var oPopoverOffsets = {};

						if ( sContext === "fromMap" ) {
							if ( jQuery ( ".sapSplTrafficStatusContainer" ).hasClass ( "sapMSplitContainerHideMode" ) === true ) {
								oPopoverOffsets.x = -iAnchorButtonWidth;
								oPopoverOffsets.y = -iAnchorButtonHeight;
							} else {
								oPopoverOffsets.x = -iAnchorButtonWidth;
								oPopoverOffsets.y = -iAnchorButtonHeight;
							}
						} else {
							if ( jQuery ( ".sapSplTrafficStatusContainer" ).hasClass ( "sapMSplitContainerHideMode" ) === true ) {
								oPopoverOffsets.x = -iAnchorButtonWidth;
								oPopoverOffsets.y = iShellHeaderHeight + iAppHeaderHeight - (iAnchorButtonHeight / 2);
							} else {
								oPopoverOffsets.x = -iAnchorButtonWidth + iMasterPaneWidth;
								oPopoverOffsets.y = iShellHeaderHeight + iAppHeaderHeight - (iAnchorButtonHeight / 2);
							}
						}

						return oPopoverOffsets;
					},

					/**
					 * Shows and hides the display area border
					 * @param sMode
					 * @return void
					 * @since 1.1
					 * @private
					 */
					fnShowHideLiveAppDisplayAreaBorder : function ( sMode ) {
						if ( sMode === "show" ) {
							jQuery ( ".sapSplLiveAppDisplayAreaBorder" ).show ( );
							jQuery ( ".splMapTollbarBar" ).addClass ( "sapSplLiveAppDisplayAreaBorderTop" );
							jQuery ( ".sapSplTrafficStatusFooter" ).addClass ( "sapSplLiveAppDisplayAreaBorderBottom" );

						} else if ( sMode === "hide" ) {
							jQuery ( ".sapSplLiveAppDisplayAreaBorder" ).hide ( );
							jQuery ( ".splMapTollbarBar" ).removeClass ( "sapSplLiveAppDisplayAreaBorderTop" );
							jQuery ( ".sapSplTrafficStatusFooter" ).removeClass ( "sapSplLiveAppDisplayAreaBorderBottom" );
						}
					},

					/**
					 * @description Sets the height and width of the map to 100%.
					 * @param void
					 * @returns void
					 * @since 1.0
					 * @private
					 */
					fnRenderStyle : function ( ) {
						this.iWindowWidth = jQuery ( window ).width ( );
						this.iWindowHeight = jQuery ( window ).height ( );

						// Resizes the dialogs when you resize the window
// for ( var i = 0 ; i < this.aRenderedDialogs.length ; i++ ) {
// var cssHeight = jQuery ( window ).height ( ) - jQuery ( ".sapUiUfdShellHead"
// ).height ( ) - (6 * jQuery ( ".sapMFooter-CTX" ).height ( ));
// jQuery ( "." + this.aRenderedDialogs[i] ).css ( "height", cssHeight + "px" );
// }

						var iListContainerHeight = this.iWindowHeight - $ ( ".sapUiUfdShellHead" ).height ( ) - $ ( ".splMapTollbarBar" ).height ( ) - $ ( ".sapMFooter-CTX" ).height ( );
						$ ( ".sapSplLeftPanelMasterPage" ).css ( "height", iListContainerHeight - 5 + "px" );
						/* Fix for incident : 1580111093 */
						$ ( ".sapSplLeftPanelMasterPage" ).parent ( ).css ( "height", iListContainerHeight - 5 + "px" );

						jQuery ( ".oSapSplLiveAppMap" ).css ( "height", iListContainerHeight - 7 + "px" );
						jQuery ( ".oSapSplLiveAppMap" ).css ( "width", this.iWindowWidth - 2 + "px" );

					},

					/**
					 * Enables the free movement of dialog boxes on the screen.
					 * @param oDialogInstance
					 * @returns void
					 * @since 1.0
					 * @private
					 */
					fnHandleDialogMove : function ( oDialogInstance ) {
						/*
						 * Removing the dialog drag feature for IE browser as
						 * there is a bug with jQuery UI
						 */
						if ( !oSapSplUtils.bIsInternetExplorer ( ) ) {

							var jQueryRef = oDialogInstance.$ ( );
							jQueryRef.find ( ".sapMBarPH" ).css ( "cursor", "move" );

							jQueryRef.draggable ( {
								"drag" : function ( ) {
									if ( $ ( window ).width ( ) < $ ( this ).offset ( ).left + $ ( this ).width ( ) ) {
										// oEvent.preventDefault();
										$ ( this ).css ( "left", ($ ( window ).width ( ) - $ ( this ).width ( )) + "px" );
									}
								},
								"containment" : "window"
							} );
						}
					},

					/**
					 * Positions all the dialogs in the desired position
					 * @param oDialogInstance
					 * @returns void
					 * @since 1.0
					 * @private
					 *
					 */
					fnHandleDialogPositioning : function ( oDialogInstance ) {

						window.setTimeout ( function ( ) {
							oDialogInstance.removeStyleClass ( "sapSplHideDialog" );
							var oViewInstance = $ ( "#" + oDialogInstance.sId + " section" );
							var oHeaderHeight = jQuery ( "#sapSplBaseUnifiedShell-hdr" ).height ( );

							// All dialogs except parking space
							if ( oDialogInstance.$ ( ).hasClass ( "SplParkingSpaceCreateEditDialog" ) === false ) {

								// Geofence dialog
								if ( (oDialogInstance.$ ( ).hasClass ( "SplLocationCreateEditDialog" ) === true) &&
										((oDialogInstance.getContent ( )[0].getContent ( )[0].getModel ( ).getData ( )["Tag"] === "LC0004") || (oDialogInstance.getContent ( )[0].getContent ( )[0].getModel ( ).getData ( )["Tag"] === "LC0008")) ) {
									$ ( "#" + oDialogInstance.sId + " .sapUiView" ).css ( "height",
											($ ( "#" + oViewInstance[1].children[0].id ).height ( ) < 250 ? 250 : $ ( "#" + oViewInstance[1].children[0].id ).height ( )) + 5 * $ ( ".sapMIBar" ).height ( ) + "px" );
									$ ( "#" + oDialogInstance.sId + " .sapUiView" ).css ( "max-height", (jQuery ( window ).height ( ) - 5 * oHeaderHeight) + "px" );

									// All dialog except parking space and
									// geofence
								} else {
									$ ( "#" + oDialogInstance.sId + " .sapUiView" ).css ( "height", $ ( "#" + oViewInstance[0].children[0].id ).height ( ) + 1 * $ ( ".sapMIBar" ).height ( ) + "px" );
									$ ( "#" + oDialogInstance.sId + " .sapUiView" ).css ( "max-height", (jQuery ( window ).height ( ) - 5 * oHeaderHeight) + "px" );
								}

								// Parking space dialog
							} else {
								$ ( "#" + oDialogInstance.sId + " .sapUiView" ).css ( "height", $ ( "#" + oViewInstance[0].children[0].id ).height ( ) + 2 * $ ( ".sapMIBar" ).height ( ) + "px" );
								$ ( "#" + oDialogInstance.sId + " .sapUiView" ).css ( "max-height", (jQuery ( window ).height ( ) - 5 * oHeaderHeight) + "px" );
							}

						}, 50 );
					},

					/**
					 * Initialize all the controller instance variables.
					 * @param void
					 * @returns void
					 * @since 1.0
					 * @private
					 */
					fnInitialiseControllerInstanceVariables : function ( ) {
						this.aTruckArray = [];
						this.aIncidenceOccuranceData = [];
						this.aSelectedLocationObjects = [];
						this.aSelectedLocationObjectsFromLeftPanel = [];
						this.selectedItems = {};
						this.aRenderedDialogs = [];
						this.oSapSplApplModel = sap.ui.getCore ( ).getModel ( "LiveAppODataModel" );
						this.sLocationType = null;
						this.oSapSplLocationCreateEditDialogInstance = null;
						this.oLocationViewEnum = null;

						// Flags related to the actions on the Map.
						this.isIncidenceOccurrenceClickEnabled = true;
						this.isTruckClickEnabled = true;
						this.isGeofenceClickEnabled = true;
						this.isPOIclickEnabled = true;
						this.isSelectMultipleTrucksEnabled = false;
						this.isSelectMultipleGeofencesEnabled = false;

						this.isTruckDataPollingEnabled = true;
						this.isIncidenceOccurrenceDataPollingEnabled = true;

						this.isGeofenceLabelVisible = true;
						this.isTruckLabelVisible = null;

					},

					/**
					 * Sets the text bundles for all the text.
					 * @param void
					 * @returns void
					 * @since 1.0
					 * @private
					 */
					fnSetTextBundles : function ( ) {
						this.byId ( "addGeofenceButton" ).setText ( oSapSplUtils.getBundle ( ).getText ( "ADD_GEOFENCE" ) );
						this.byId ( "addPointOfInterestButton" ).setText ( oSapSplUtils.getBundle ( ).getText ( "ADD_POI" ) );
						this.byId ( "oContactBusinessPartnerButton" ).setText ( oSapSplUtils.getBundle ( ).getText ( "CONTACT_BUSINESS_PARTNER" ) );
						this.byId ( "oSendMessageToTruckButton" ).setText ( oSapSplUtils.getBundle ( ).getText ( "SEND_MESSAGE_TO_TRUCKS" ) );
						this.byId ( "sapSplLocationCreateCancelButton" ).setText ( oSapSplUtils.getBundle ( ).getText ( "CANCEL" ) );
					},

					/**
					 * Calls the functions that shows trucks, incidences and locations on the Map.
					 * @param void
					 * @returns void
					 * @since 1.0
					 * @private
					 */
					fnShowAllVisualObjectsOnMap : function ( sFlag ) {
						if ( sFlag === "PlotLocally" ) {
							var aSelectedItems = [];
							for ( var i = 0 ; i < sap.ui.getCore ( ).getModel ( "SapSplLeftPanelListModel" ).getData ( ).length ; i++ ) {
								if ( sap.ui.getCore ( ).getModel ( "SapSplLeftPanelListModel" ).getData ( )[i].isSelected ) {
									if ( sap.ui.getCore ( ).getModel ( "SapSplLeftPanelListModel" ).getData ( )[i].Geometry ) {
										aSelectedItems.push ( sap.ui.getCore ( ).getModel ( "SapSplLeftPanelListModel" ).getData ( )[i] );
									}
								}
							}
							oSapSplMapsDataMarshal.fnShowVOsOnMap ( aSelectedItems, this.byId ( "oSapSplLiveAppMap" ) );
							/*
							 * fix for truck disappearing after sending the
							 * message - incident 1580174605
							 */
							this.showTrucksOnMap ( );
							this.showIncidenceOccurrencesOnMap ( );
						} else {
							this.oMapToolbar.refreshMap ( sFlag );
							this.showTrucksOnMap ( );
							this.showIncidenceOccurrencesOnMap ( );
						}
						// this.oMapToolbar.getContentLeft()[2].setText(this.sDisplayAreaText);
					},

					/**
					 * Cancels the location creation when you press escape key in the keyboard
					 * @param void
					 * @returns void
					 * @since 1.0
					 * @private
					 */
					fnHandleLocationCreationCancelOnTheMap : function ( oEvent ) {
						var that = this;
						/* Fix for 1580081638 */
						var fnHandleCancelAction = function ( ) {
							// CSN FIX : 0120031469 649181
							that.byId ( "sapSplLocationCreateCancelButton" ).setVisible ( false );
							that.byId ( "sapSplTrafficStatusFooter" ).removeStyleClass ( "sapSplHiddenBar" );

							if ( that.sLocationType !== null && that.sLocationType !== undefined ) {

								that.fnShowAllVisualObjectsOnMap ( "PlotLocally" );

								that.sLocationType = null;

								// Enables the click event on Map.
								oSapSplMapsDataMarshal.isMapClickEabled = false;

								// Prevents the Map refresh while the
								// creation
								// of location
								that.fnPreventEnableMapRefresh ( "Enable" );

								// Changes the cursor to pencil while
								// creation
								// of location
								oSapSplMapsDataMarshal.fnChangeCursor ( "normal" );

								oSapSplMapsDataMarshal.fnResetValues ( that.byId ( "oSapSplLiveAppMap" ) );

								that.fnBlockUnblockLiveAppUI ( "Unblock" );

								// CSN FIX : 0120031469 0000793523 2014
								oSapSplUtils.setIsDirty ( false );
							}
						};
						/* Fix for 1580081638 */
						// FIX FOR INTERNAL INCIDENT 1482016556
						if ( oSapSplUtils.getIsDirty ( ) === true ) {
							sap.m.MessageBox.show ( oSapSplUtils.getBundle ( ).getText ( "DATA_LOSS_WARNING_TEXT" ), sap.m.MessageBox.Icon.WARNING, oSapSplUtils.getBundle ( ).getText ( "WARNING" ), [sap.m.MessageBox.Action.YES,
									sap.m.MessageBox.Action.CANCEL], function ( selection ) {
								if ( selection === "YES" ) {
									fnHandleCancelAction ( );
								}
							} );
						} else {
							fnHandleCancelAction ( );
						}
					},

					/**
					 * @description Blocks all the actions on the map window
					 * @param void
					 * @return void
					 * @since 1.0
					 * @private
					 */
					fnBlockUnblockLiveAppUI : function ( sAction, sContext ) {
						if ( sAction === "Block" ) {

							// Disables the actions on the toolbar.
							this.oMapToolbar.setEnabled ( false );

							window.clearInterval ( this.oMapToolbar.getMapFilterInstance ( ).oPSInterval );
							this.oMapToolbar.getMapFilterInstance ( ).oPSInterval = null;

							// Hides the blocker div of dialog.
							jQuery ( ".sapUiBLy" ).css ( "z-index", "0" );

							// Hides all the detail windows.
							// jQuery( ".oSapSplLiveAppPage .vbi-detail"
							// ).hide();

							this.byId ( "addGeofenceButton" ).setEnabled ( false );
							this.byId ( "addPointOfInterestButton" ).setEnabled ( false );
							this.byId ( "oContactBusinessPartnerButton" ).setEnabled ( false );
							this.byId ( "oSendMessageToTruckButton" ).setEnabled ( false );

							this.oMapToolbar.getContentLeft ( )[1].setEnabled ( false );
							this.oMapToolbar.getContentLeft ( )[3].setEnabled ( false );

							if ( this.byId ( "sapSplTrafficStatusContainer" ).getMode ( ) === "ShowHideMode" ) {
								this.byId ( "sapSplTrafficStatusContainer" ).setMode ( "HideMode" );
								this.fnRenderStyle ( );
							}

							if ( sContext === "addGeofence" ) {
								oSapSplMapsDataMarshal.fnHandleDetailWindowVisibility ( "Hide", "All" );
								this.isIncidenceOccurrenceClickEnabled = false;
								this.isTruckClickEnabled = false;
								this.isPOIclickEnabled = false;
								this.isGeofenceClickEnabled = false;

							} else if ( sContext === "addPOI" ) {
								oSapSplMapsDataMarshal.fnHandleDetailWindowVisibility ( "Hide", "All" );
								this.isIncidenceOccurrenceClickEnabled = false;
								this.isTruckClickEnabled = false;
								this.isPOIclickEnabled = false;
								this.isGeofenceClickEnabled = false;

							} else if ( sContext === "contactBuPa" ) {
								oSapSplMapsDataMarshal.fnHandleDetailWindowVisibility ( "Hide", "All" );
								this.isIncidenceOccurrenceClickEnabled = false;
								this.isTruckClickEnabled = false;
								this.isGeofenceClickEnabled = false;
								this.isPOIclickEnabled = false;

							} else if ( sContext === "sendMessageToTruckOnMap" ) {
								oSapSplMapsDataMarshal.fnHandleDetailWindowVisibility ( "Hide", "All" );
								this.isIncidenceOccurrenceClickEnabled = false;
								this.isGeofenceClickEnabled = false;
								this.isPOIclickEnabled = false;

							} else if ( sContext === "sendMessageToTruckViaGeofence" ) {
								oSapSplMapsDataMarshal.fnHandleDetailWindowVisibility ( "Hide", "All" );
								this.isIncidenceOccurrenceClickEnabled = false;
								this.isTruckClickEnabled = false;
								this.isPOIclickEnabled = false;

							} else if ( sContext === "sendMessage" ) {
								oSapSplMapsDataMarshal.fnHandleDetailWindowVisibility ( "Hide", "Geofence" );
								// CSN FIX : 0120031469 774973 2014
								this.isIncidenceOccurrenceClickEnabled = false;
								this.isPOIclickEnabled = false;
								this.isIncidenceOccurrenceClickEnabled = false;

							} else if ( sContext === "sendMessageToSingleTruck" ) {
								oSapSplMapsDataMarshal.fnHandleDetailWindowVisibility ( "Hide", "Geofence" );
								this.isIncidenceOccurrenceClickEnabled = false;
								this.isTruckClickEnabled = false;
								this.isPOIclickEnabled = false;
								this.isGeofenceClickEnabled = false;
							}

						} else if ( sAction === "Unblock" ) {

							// Enables the actions on the toolbar.
							this.oMapToolbar.setEnabled ( true );

							oSapSplMapsDataMarshal.fnChangeCursor ( "normal" );

							startStopPollingOfParkingSpace ( "start", this.oMapToolbar.getMapFilterInstance ( ).getMapFilterControlInstance ( ) );

							this.oMapToolbar.getContentLeft ( )[1].setEnabled ( true );
							this.oMapToolbar.getContentLeft ( )[3].setEnabled ( true );

							// Shows all the detail windows.

							this.isIncidenceOccurrenceClickEnabled = true;
							this.isTruckClickEnabled = true;
							this.isGeofenceClickEnabled = true;
							this.isPOIclickEnabled = true;
							this.isSelectMultipleTrucksEnabled = false;
							this.isSelectMultipleGeofencesEnabled = false;

							this.byId ( "addGeofenceButton" ).setEnabled ( true );
							this.byId ( "addPointOfInterestButton" ).setEnabled ( true );
							this.byId ( "oContactBusinessPartnerButton" ).setEnabled ( true );
							this.byId ( "oSendMessageToTruckButton" ).setEnabled ( true );

						} else {
							jQuery.sap.log.error ( "Block-Unblock", "invalid arguments", "liveApp.controller.js" );
						}
					},

					/**
					 * It stops or enables the refresh of the Map
					 * @param void
					 * @return void
					 * @since 1.0
					 * @private
					 */
					fnPreventEnableMapRefresh : function ( sMode ) {
						if ( sMode === "Prevent" ) {
							this.isTruckDataPollingEnabled = false;
							this.isIncidenceOccurrenceDataPollingEnabled = false;

						} else if ( sMode === "Enable" ) {
							this.isTruckDataPollingEnabled = true;
							this.isIncidenceOccurrenceDataPollingEnabled = true;
						}
					},

					/**
					 * Get the popovet openig direction based on the click position on the screeen
					 * @param iClickedX {Number} Clicked X-Co Ordinate
					 * @param iClickedY {Number} Clicked Y-Co Ordinate
					 * @returns {Object} Popover position Object
					 * @since 1.0
					 * @private
					 */
					getPopoverOpeningDirection : function ( iClickedX, iClickedY ) {
						var popoverPositionObject = {};
						var windowWidth = jQuery ( window ).width ( );
						// Fix for the internal incident : 1482011181
						if ( iClickedX > windowWidth * 0.5 ) {
							popoverPositionObject.placement = "Left";
							// Fix for the internal incident : 1482011181
							popoverPositionObject.x = iClickedX + jQuery ( ".oPopoverAnchorButton" ).width ( );
							popoverPositionObject.y = iClickedY;
						} else {
							popoverPositionObject.placement = "Right";
							popoverPositionObject.x = iClickedX;
							popoverPositionObject.y = iClickedY;
						}
						return popoverPositionObject;
					},

					/**
					 * Returns the screen coordinates from the map event object
					 * @param oEvent
					 * @returns oCoordinates
					 * @private
					 * @since 1.0
					 */
					fnGetScreenCoordinateFromEventObject : function ( oEvent ) {
						var oAction = JSON.parse ( oEvent.getParameter ( "data" ) ).Action;
						var oActionProperties = oAction.AddActionProperties.AddActionProperty;
						var oParams = oAction.Params.Param;
						var oCoordinates = {}, i;
						var oParamsLength = oParams.length;
						var oActionPropertiesLength = oActionProperties.length;

						for ( i = 0 ; i < oParamsLength ; i++ ) {
							if ( oParams[i]["name"] === "x" ) {
								oCoordinates["x"] = parseInt ( oParams[i]["#"], 10 );
							} else if ( oParams[i]["name"] === "y" ) {
								oCoordinates["y"] = parseInt ( oParams[i]["#"], 10 );
							} else if ( oParams[i]["name"] === "handle" ) {
								oCoordinates["handle"] = oParams[i]["#"];
							} else if ( oParams[i]["name"] === "edge" ) {
								oCoordinates["edge"] = oParams[i]["#"];
							}
						}

						for ( i = 0 ; i < oActionPropertiesLength ; i++ ) {
							if ( oActionProperties[i]["name"] === "pos" ) {
								oCoordinates["position"] = oActionProperties[i]["#"];
							}
						}

						return oCoordinates;
					},

					/**
					 * Removes the deleted gate in the model and updates the model
					 * @param void
					 * @returns void
					 * @since 1.0
					 * @private
					 */
					fnHandleDeleteOfGateAndUpdateModel : function ( gateUUID, bShowGateLabels ) {
						var oModelData = sap.ui.getCore ( ).getModel ( "sapSplLocationCreateEditDialogModel" ).getData ( ), aGates = [], i;
						if ( oModelData["GeofenceGates"]["results"].length > 0 ) {
							aGates = oModelData["GeofenceGates"]["results"];
							for ( i = 0 ; i < aGates.length ; i++ ) {
								if ( aGates[i]["GateUUID"] === gateUUID ) {
									aGates[i]["deleted"] = true;
									var sStyle = aGates[i]["GateUUID"].split ( "+" ).join ( "" ).split ( "/" ).join ( "" ).split ( "?" ).join ( "" ).split ( "%" ).join ( "" ).split ( "#" ).join ( "" ).split ( "&" ).join ( "" ).split ( "=" ).join (
											"" );
									jQuery ( "." + sStyle ).hide ( );
									if ( this.oSapSplLocationCreateEditDialogInstance ) {
										this.oSapSplLocationCreateEditDialogInstance.getContent ( )[0].getContent ( )[0].getController ( ).handleDeletionOfGateOnTheMap ( aGates.splice ( i, 1 )[0] );
									}
								}
							}
						}

						sap.ui.getCore ( ).getModel ( "sapSplLocationCreateEditDialogModel" ).setData ( oModelData );

					},

					/**
					 * Inserts a point in the middle of an edge
					 * @param void
					 * @returns void
					 * @since 1.0
					 * @private
					 */
					fnInsertPointInsideEdge : function ( oPosition ) {
						var that = this;
						var sGateUUID;
						var oLocationModel = sap.ui.getCore ( ).getModel ( "sapSplLocationCreateEditDialogModel" ).getData ( );
						var aLocationCoords = oLocationModel["locationGeoCoords"];
						var iEdgeIndex = parseInt ( oPosition["edge"], 10 ) + 1;

						var aWarningGateObjects1 = oSapSplMapsDataMarshal.fnCheckPointWithinGate ( oLocationModel["GeofenceGates"].results, aLocationCoords[iEdgeIndex % aLocationCoords.length] );
						var aWarningGateObjects2 = oSapSplMapsDataMarshal.fnCheckPointWithinGate ( oLocationModel["GeofenceGates"].results, aLocationCoords[iEdgeIndex - 1] );

						var bIsConflict = false;

						for ( var i = 0 ; i < aWarningGateObjects1.length ; i++ ) {
							for ( var j = 0 ; j < aWarningGateObjects2.length ; j++ ) {
								if ( aWarningGateObjects1[i]["GateUUID"] === aWarningGateObjects2[j]["GateUUID"] ) {
									bIsConflict = true;
									sGateUUID = aWarningGateObjects1[i]["GateUUID"];
									break;
								}
							}
						}

						if ( bIsConflict ) {

							var sConfirmationMessage = oSapSplUtils.getBundle ( ).getText ( "LOCATION_POINT_INSERT_CONFIRMATION" );
							sap.m.MessageBox.show ( sConfirmationMessage, sap.m.MessageBox.Icon.WARNING, oSapSplUtils.getBundle ( ).getText ( "WARNING" ), [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL], function ( selection ) {
								jQuery ( ".sapUiBLy" ).css ( "z-index", "0" );
								if ( selection === "OK" ) {
									that.fnHandleDeleteOfGateAndUpdateModel ( sGateUUID, false );
									var aCoordArray = oPosition["position"].split ( ";" );
									var oCoordObject = {
										"long" : parseFloat ( aCoordArray[0], 10 ),
										"lat" : parseFloat ( aCoordArray[1], 10 ),
										"alt" : parseFloat ( aCoordArray[2], 10 )
									};
									oLocationModel.locationGeoCoords.splice ( iEdgeIndex, 0, oCoordObject );
									if ( oLocationModel.isRadar === "1" && (sap.ui.getCore ( ).getModel ( "sapSplAppConfigDataModel" ).getData ( )["canViewRulesWithoutTour"] !== 1) && this._bMessageStripInsertedToLocationEditDialog === false &&
											sap.ui.getCore ( ).byId ( $ ( ".SplCreateEditLocationDialogNavContainer" ).attr ( "id" ) ).getCurrentPage ( ).sId.search ( "Home" ) !== -1 ) {
										this._bMessageStripInsertedToLocationEditDialog = true;
										sap.ui.getCore ( ).byId ( $ ( ".SplCreateEditLocationDialogNavContainer" ).attr ( "id" ) ).getCurrentPage ( ).insertContent ( new sap.m.MessageStrip ( {
											text : "{splI18NModel>EDIT_GEOFENCE_SHAPE_WARNING}",
											showCloseButton : false,
											showIcon : true,
											type : "Warning"
										} ).addStyleClass ( "sapUiSmallMarginTopBottom" ).addStyleClass ( "sapUiSmallMarginBeginEnd" ), "0" );

										oLocationModel.shapeChanged = true;
									}
									sap.ui.getCore ( ).getModel ( "sapSplLocationCreateEditDialogModel" ).setData ( oLocationModel );

									var sCoordString = that.fnCordinateArrayToCordinateString ( oLocationModel.locationGeoCoords );
									var sCoordGeojson = oSapSplMapsDataMarshal.convertStringToGeoJSON ( sCoordString );
									oLocationModel.Geometry = JSON.stringify ( sCoordGeojson );

									oSapSplMapsDataMarshal.fnEditFences ( oLocationModel, that.byId ( "oSapSplLiveAppMap" ) );
									/* Fix For Incident : 1472020285 */
									sap.ui.getCore ( ).byId ( $ ( ".sapSplValueHelpForGates" ).attr ( "id" ) ).setValue ( splReusable.libs.SapSplModelFormatters.getGatesName ( oLocationModel["GeofenceGates"]["results"] ) );
								}
							} );

						} else {
							var aCoordArray = oPosition["position"].split ( ";" );
							var oCoordObject = {
								"long" : parseFloat ( aCoordArray[0], 10 ),
								"lat" : parseFloat ( aCoordArray[1], 10 ),
								"alt" : parseFloat ( aCoordArray[2], 10 )
							};
							oLocationModel.locationGeoCoords.splice ( iEdgeIndex, 0, oCoordObject );
							if ( oLocationModel.isRadar === "1" && (sap.ui.getCore ( ).getModel ( "sapSplAppConfigDataModel" ).getData ( )["canViewRulesWithoutTour"] !== 1) && this._bMessageStripInsertedToLocationEditDialog === false &&
									sap.ui.getCore ( ).byId ( $ ( ".SplCreateEditLocationDialogNavContainer" ).attr ( "id" ) ).getCurrentPage ( ).sId.search ( "Home" ) !== -1 ) {
								this._bMessageStripInsertedToLocationEditDialog = true;
								sap.ui.getCore ( ).byId ( $ ( ".SplCreateEditLocationDialogNavContainer" ).attr ( "id" ) ).getCurrentPage ( ).insertContent ( new sap.m.MessageStrip ( {
									text : "{splI18NModel>EDIT_GEOFENCE_SHAPE_WARNING}",
									showCloseButton : false,
									showIcon : true,
									type : "Warning"
								} ).addStyleClass ( "sapUiSmallMarginTopBottom" ).addStyleClass ( "sapUiSmallMarginBeginEnd" ), "0" );

								oLocationModel.shapeChanged = true;
							}
							sap.ui.getCore ( ).getModel ( "sapSplLocationCreateEditDialogModel" ).setData ( oLocationModel );

							var sCoordString = this.fnCordinateArrayToCordinateString ( oLocationModel.locationGeoCoords );
							var sCoordGeojson = oSapSplMapsDataMarshal.convertStringToGeoJSON ( sCoordString );
							oLocationModel.Geometry = JSON.stringify ( sCoordGeojson );

							oSapSplMapsDataMarshal.fnEditFences ( oLocationModel, this.byId ( "oSapSplLiveAppMap" ) );
						}

					},

					/**
					 * Removes a point from the Geofence
					 * @param void
					 * @returns void
					 * @since 1.0
					 * @private
					 */
					fnRemovePointFromArea : function ( oPosition ) {

						var that = this, sConfirmationMessage = "";
						var oLocationModel = sap.ui.getCore ( ).getModel ( "sapSplLocationCreateEditDialogModel" );
						var oModelData = oLocationModel.getData ( );
						var aLocationCoords = oModelData["locationGeoCoords"];
						var iIndex = parseInt ( oPosition["handle"], 10 );
						var aWarningGateObjects = oSapSplMapsDataMarshal.fnCheckPointWithinGate ( oModelData["GeofenceGates"].results, aLocationCoords[iIndex] );

						if ( aWarningGateObjects.length > 0 ) {
							sConfirmationMessage = oSapSplUtils.getBundle ( ).getText ( "LOCATION_POINT_DELETE_CONFIRMATION" );
							sap.m.MessageBox.show ( sConfirmationMessage, sap.m.MessageBox.Icon.WARNING, oSapSplUtils.getBundle ( ).getText ( "WARNING" ), [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL], function ( selection ) {
								jQuery ( ".sapUiBLy" ).css ( "z-index", "0" );
								if ( selection === "OK" ) {
									for ( var i = 0 ; i < aWarningGateObjects.length ; i++ ) {
										that.fnHandleDeleteOfGateAndUpdateModel ( aWarningGateObjects[i]["GateUUID"], false );
									}
									aLocationCoords.splice ( iIndex, 1 );
									oModelData["locationGeoCoords"] = aLocationCoords;
									oModelData["Geometry"] = JSON.stringify ( oSapSplMapsDataMarshal.convertStringToGeoJSON ( that.fnCordinateArrayToCordinateString ( aLocationCoords ) ) );
									if ( oModelData.isRadar === "1" && (sap.ui.getCore ( ).getModel ( "sapSplAppConfigDataModel" ).getData ( )["canViewRulesWithoutTour"] !== 1) && this._bMessageStripInsertedToLocationEditDialog === false &&
											sap.ui.getCore ( ).byId ( $ ( ".SplCreateEditLocationDialogNavContainer" ).attr ( "id" ) ).getCurrentPage ( ).sId.search ( "Home" ) !== -1 ) {
										this._bMessageStripInsertedToLocationEditDialog = true;
										sap.ui.getCore ( ).byId ( $ ( ".SplCreateEditLocationDialogNavContainer" ).attr ( "id" ) ).getCurrentPage ( ).insertContent ( new sap.m.MessageStrip ( {
											text : "{splI18NModel>EDIT_GEOFENCE_SHAPE_WARNING}",
											showCloseButton : false,
											showIcon : true,
											type : "Warning"
										} ).addStyleClass ( "sapUiSmallMarginTopBottom" ).addStyleClass ( "sapUiSmallMarginBeginEnd" ), "0" );

										oModelData.shapeChanged = true;
									}
									oLocationModel.setData ( oModelData );
									oSapSplMapsDataMarshal.fnEditFences ( oModelData, that.byId ( "oSapSplLiveAppMap" ) );
									/* Fix For Incident : 1472020285 */
									sap.ui.getCore ( ).byId ( $ ( ".sapSplValueHelpForGates" ).attr ( "id" ) ).setValue ( splReusable.libs.SapSplModelFormatters.getGatesName ( oModelData["GeofenceGates"]["results"] ) );
								}
							} );
						} else {
							aLocationCoords.splice ( iIndex, 1 );
							oModelData["locationGeoCoords"] = aLocationCoords;
							/* Fix for 1570077518 */
							if ( aLocationCoords.length === 0 ) {
								oModelData["Geometry"] = JSON.stringify ( {
									type : "Polygon",
									coordinates : [[]]
								} );
							} else {
								oModelData["Geometry"] = JSON.stringify ( oSapSplMapsDataMarshal.convertStringToGeoJSON ( that.fnCordinateArrayToCordinateString ( aLocationCoords ) ) );
							}
							if ( oModelData.isRadar === "1" && (sap.ui.getCore ( ).getModel ( "sapSplAppConfigDataModel" ).getData ( )["canViewRulesWithoutTour"] !== 1) && this._bMessageStripInsertedToLocationEditDialog === false &&
									sap.ui.getCore ( ).byId ( $ ( ".SplCreateEditLocationDialogNavContainer" ).attr ( "id" ) ).getCurrentPage ( ).sId.search ( "Home" ) !== -1 ) {
								this._bMessageStripInsertedToLocationEditDialog = true;
								sap.ui.getCore ( ).byId ( $ ( ".SplCreateEditLocationDialogNavContainer" ).attr ( "id" ) ).getCurrentPage ( ).insertContent ( new sap.m.MessageStrip ( {
									text : "{splI18NModel>EDIT_GEOFENCE_SHAPE_WARNING}",
									showCloseButton : false,
									showIcon : true,
									type : "Warning"
								} ).addStyleClass ( "sapUiSmallMarginTopBottom" ).addStyleClass ( "sapUiSmallMarginBeginEnd" ), "0" );

								oModelData.shapeChanged = true;
							}
							oLocationModel.setData ( oModelData );
							oSapSplMapsDataMarshal.fnEditFences ( oModelData, that.byId ( "oSapSplLiveAppMap" ) );
						}
						/* Fix For Incident : 1472020285 */
						sap.ui.getCore ( ).byId ( $ ( ".sapSplValueHelpForGates" ).attr ( "id" ) ).setValue ( splReusable.libs.SapSplModelFormatters.getGatesName ( oModelData["GeofenceGates"]["results"] ) );

					},

					/**
					 * Creates and returns the context menu.
					 * @param
					 * @returns void
					 * @since 1.0
					 * @private
					 */
					fnOpenContextMenu : function ( oPosition, oContext ) {
						var that = this;
						var oContextMenuButton;
						var oPopoverOffset = this.fnGetPopoverOffsets ( );
						/* Fix for Incident : 1580100793 */
						var oContextMenuPopover = new sap.m.ResponsivePopover ( {
							offsetX : parseInt ( oPosition["x"] + oPopoverOffset["x"], 10 ),
							offsetY : parseInt ( oPosition["y"] + oPopoverOffset["y"], 10 ),
							showHeader : false,
							modal : false
						} ).addStyleClass ( "mapContextMenu" );

						if ( oContext["contextName"] === "AreaEdgeClick" ) {
							oContextMenuButton = new sap.m.Button ( {
								text : oSapSplUtils.getBundle ( ).getText ( "ADD_POINT" ),
								icon : "sap-icon://add",
								iconDensityAware : true,
								press : function ( ) {
									oContext["fnCallback"].call ( that, oPosition );
									this.getParent ( ).close ( );
								}
							} ).addStyleClass ( "contextMenuButton" ).addStyleClass ( "contextMenuButtonAdd" );
							oContextMenuPopover.addStyleClass ( "mapContextMenuAdd" );
						} else if ( oContext["contextName"] === "AreaHandlerClick" ) {
							oContextMenuButton = new sap.m.Button ( {
								text : oSapSplUtils.getBundle ( ).getText ( "DELETE_POINT" ),
								icon : "sap-icon://delete",
								iconDensityAware : true,
								press : function ( ) {
									oContext["fnCallback"].call ( that, oPosition );
									this.getParent ( ).close ( );
								}
							} ).addStyleClass ( "contextMenuButton" ).addStyleClass ( "contextMenuButtonDelete" );
							oContextMenuPopover.addStyleClass ( "mapContextMenuDelete" );
						}

						oContextMenuPopover.addContent ( oContextMenuButton );
						oContextMenuPopover.openBy ( this.byId ( "oPopoverAnchorButton" ) );

					},

					/**
					 * Handles the context menu events on the Map
					 * @param oEvent
					 * @returns void
					 * @since 1.0
					 * @private
					 */
					fnHandleContextMenu : function ( oEvent ) {
						var oEventObject = JSON.parse ( oEvent.getParameter ( "data" ) ), oContextObject = null;
						// Right click on the edge
						if ( oEventObject.Action.name === "EDGE_RIGHT_CLICK_GEOFENCE_AREA" ) {
							oContextObject = {
								"contextName" : "AreaEdgeClick",
								"fnCallback" : this.fnInsertPointInsideEdge
							};

							this.fnOpenContextMenu ( this.fnGetScreenCoordinateFromEventObject ( oEvent ), oContextObject );

							// Right click on the handler
						} else if ( oEventObject.Action.name === "RIGHT_CLICK_GEOFENCE_AREA_HANDLER" ) {

							oContextObject = {
								"contextName" : "AreaHandlerClick",
								"fnCallback" : this.fnRemovePointFromArea
							};

							this.fnOpenContextMenu ( this.fnGetScreenCoordinateFromEventObject ( oEvent ), oContextObject );

						}
					},

					/**
					 * Zoom event handler of the traffic status application
					 * @param oEvent
					 * @return void
					 * @since 1.0
					 * @private
					 */
					fnHandleZoomEventOnTheMap : function ( oEvent ) {
						/* SPLSCRUMBACKLOG-669 */
						// Capturing the previous Zoom level
						this.iPrevZoom = this.byId ( "oSapSplLiveAppMap" ).zoom;

						// Function that saves the current zoom level of the map
						// as an attribute
						// to the passed map instance
						oSapSplMapsDataMarshal.fnGetMapZoom ( this.byId ( "oSapSplLiveAppMap" ), oEvent );

						// Capturing the current Zoom level
						this.iCurZoom = this.byId ( "oSapSplLiveAppMap" ).zoom;

						if ( this.bCanChangeVOIcon ( "Truck" ) === true ) {
							// rerender all the truck flags, which will take up
							// the new icon
							// based on zoom category.
							for ( var iTruckCount = 0 ; iTruckCount < this.aTruckArray.length ; iTruckCount++ ) {
								if ( this.aTruckArray[iTruckCount] ) {
									oSapSplMapsDataMarshal.fnShowTruckFlags ( this.aTruckArray[iTruckCount], this.byId ( "oSapSplLiveAppMap" ), this.isTruckLabelVisible );
								}
							}
						}

						if ( this.bCanChangeVOIcon ( "Other" ) === true ) {
							for ( var iIncidentCount = 0 ; iIncidentCount < this.aIncidenceOccuranceData.length ; iIncidentCount++ ) {
								if ( this.aIncidenceOccuranceData[iIncidentCount] ) {
									oSapSplMapsDataMarshal.fnShowIncidenceFlags ( this.aIncidenceOccuranceData[iIncidentCount], this.byId ( "oSapSplLiveAppMap" ) );
								}
							}

							for ( var iLocationCount = 0 ; iLocationCount < this.aSelectedLocationObjectsFromLeftPanel.length ; iLocationCount++ ) {
								if ( this.aSelectedLocationObjectsFromLeftPanel[iLocationCount] &&
										(this.aSelectedLocationObjectsFromLeftPanel[iLocationCount]["Tag"] !== "LC0004" && this.aSelectedLocationObjectsFromLeftPanel[iLocationCount]["Tag"] !== "LC0008") ) {
									oSapSplMapsDataMarshal.fnShowPointOfInterestFlags ( this.aSelectedLocationObjectsFromLeftPanel[iLocationCount], this.byId ( "oSapSplLiveAppMap" ) );
								}
							}

						}
					},

					fnLiveAppMapZoomPanEvent : function ( oEvent ) {
						jQuery.sap.log.info ( "zoom object", oEvent, "liveApp.controller.js" );
						/* CSNFIX : 1570031246 */
						if ( this.oMapToolbar.getContentLeft ( )[2].getText ( ) !== oSapSplUtils.getBundle ( ).getText ( "SELECT_DISPLAY_AREA" ) ) {
							this.sDisplayAreaText = this.oMapToolbar.getContentLeft ( )[2].getText ( );
						}
						/* Incident : 1570126095 */
						if ( JSON.parse ( oEvent.getParameters ( ).data ).Data !== undefined ) {
							this.oMapToolbar.getContentLeft ( )[2].setText ( oSapSplUtils.getBundle ( ).getText ( "SELECT_DISPLAY_AREA" ) );
						}
					},

					/**
					 * @param void
					 * @returns void
					 * @since 1.1
					 * @private
					 */
					fnGetBoundingRectangle : function ( ) {
						var topLeft = this.byId ( "oSapSplLiveAppMap" ).min;
						var bottomRight = this.byId ( "oSapSplLiveAppMap" ).max;
						var topRight = topLeft.split ( ";" )[0] + ";" + bottomRight.split ( ";" )[1] + ";0";
						var bottomLeft = bottomRight.split ( ";" )[0] + ";" + topLeft.split ( ";" )[1] + ";0";

						var boundingRectangleString = topLeft + ";" + topRight + ";" + bottomRight + ";" + bottomLeft;

						return boundingRectangleString;
					},

					fnHandleClickOfClusterVO : function ( oEvent, sClusterType ) {
						var aBatchRequests = [], sInstance = null, aListOfVOs = [], sFilter = null, that = this, x = 0, y = 0, oPopoverOffset = null, oObject = {};
						sInstance = JSON.parse ( oEvent.getParameter ( "data" ) ).Action.instance;
						aListOfVOs = oEvent.getSource ( ).getInfoForCluster ( sInstance, 1 );
						oEvent = jQuery.extend ( true, {}, oEvent );
						sFilter = "/MyLocations?$select=LocationID,Name,Tag,Geometry,ReportedStatus&$filter=";
						if ( sClusterType === "POI" ) {
							for ( var i = 0 ; i < aListOfVOs.length ; i++ ) {

								sFilter += "(" + encodeURIComponent ( "LocationID eq " + "X" + "\'" + oSapSplUtils.base64ToHex ( aListOfVOs[i].split ( "." )[1] ) + "\'" ) + ")";
								if ( i !== aListOfVOs.length - 1 ) {
									sFilter += "or";
								}
							}
							aBatchRequests.push ( this.oSapSplApplModel.createBatchOperation ( sFilter, "GET" ) );

							this.oSapSplApplModel.addBatchReadOperations ( aBatchRequests );

							sap.ui.getCore ( ).byId ( "splView.liveApp.liveApp--oSapSplLiveAppPage" ).setBusy ( true );
							this.oSapSplApplModel.submitBatch ( function ( oData ) {
								sap.ui.getCore ( ).byId ( "splView.liveApp.liveApp--oSapSplLiveAppPage" ).setBusy ( false );
								oPopoverOffset = that.fnGetPopoverOffsets ( );
								if ( JSON.parse ( oEvent.getParameter ( "data" ) ).Action.Params.Param[0].name === "x" ) {
									x = parseInt ( JSON.parse ( oEvent.getParameter ( "data" ) ).Action.Params.Param[0]["#"], 10 );
									x += oPopoverOffset["x"];
									x = parseInt ( x, 10 );
								} else {
									jQuery.sap.log.error ( "fnHandleClickOfClusterVO", "Failure of function call", "liveApp.controller.js" );
								}
								if ( JSON.parse ( oEvent.getParameter ( "data" ) ).Action.Params.Param[1].name === "y" ) {
									y = parseInt ( JSON.parse ( oEvent.getParameter ( "data" ) ).Action.Params.Param[1]["#"], 10 );
									y += oPopoverOffset["y"];
									y = parseInt ( y, 10 );
								} else {
									jQuery.sap.log.error ( "fnHandleClickOfClusterVO", "Failure of function call", "liveApp.controller.js" );
								}

								oObject["PositionObject"] = that.getPopoverOpeningDirection ( x, y );
								oObject["Data"] = oData.__batchResponses[0].data.results;
								oObject["Title"] = oSapSplUtils.getBundle ( ).getText ( "POI_CLUSTER_POPOVER_TITLE", oData.__batchResponses[0].data.results.length );

								this.oClusterObjectsPopOver = sap.ui.xmlfragment ( "clusterObjectsFragment", "splReusable.fragments.ClusterObjectsList", that ).addStyleClass ( "clusterObjectsFragmentClass" );
								this.oClusterObjectsPopOver.setModel ( new sap.ui.model.json.JSONModel ( oObject ) ).openBy ( that.byId ( "oPopoverAnchorButton" ) ).attachAfterClose ( function ( oEvent ) {
									oEvent.getSource ( ).destroy ( );
								} ).attachAfterOpen ( function ( ) {
									if ( parseInt ( this.$ ( ).find ( ".sapMPopoverCont" ).css ( "height" ), 10 ) > 400 ) {
										this.setContentHeight ( "400px" );
									}
								} );
							}, function ( ) {
								sap.ui.getCore ( ).byId ( "splView.liveApp.liveApp--oSapSplLiveAppPage" ).setBusy ( false );
							} );

						} else if ( sClusterType === "Truck" ) {

							var tempArrayOfClusteredVOs = [], _results = [];
							sFilter = "/VehiclePositions?$select=DeviceUUID,RegistrationNumber,TourName,Position,ReportedTime,isTruckRunningLate&$filter=";

							if ( oSapSplUtils.getFromQueryParameterMap ( "xx-sap-spl-fallback" ) === "true" ) {
								sFilter = "/VehiclePositions?$select=DeviceUUID,RegistrationNumber,TourName,Position,ReportedTime,isTruckRunningLate&$filter=";
								for ( i = 0 ; i < aListOfVOs.length ; i++ ) {
									sFilter += "(" + encodeURIComponent ( "DeviceUUID eq " + "X" + "\'" + oSapSplUtils.base64ToHex ( aListOfVOs[i].split ( "." )[1] ) + "\'" ) + ")";
									if ( i !== aListOfVOs.length - 1 ) {
										sFilter += "or";
									}
								}
								aBatchRequests.push ( this.oSapSplApplModel.createBatchOperation ( sFilter, "GET" ) );
								this.oSapSplApplModel.addBatchReadOperations ( aBatchRequests );

								sap.ui.getCore ( ).byId ( "splView.liveApp.liveApp--oSapSplLiveAppPage" ).setBusy ( true );
								this.oSapSplApplModel.submitBatch ( function ( oData ) {
									sap.ui.getCore ( ).byId ( "splView.liveApp.liveApp--oSapSplLiveAppPage" ).setBusy ( false );
									oPopoverOffset = that.fnGetPopoverOffsets ( );
									if ( JSON.parse ( oEvent.getParameter ( "data" ) ).Action.Params.Param[0].name === "x" ) {
										x = parseInt ( JSON.parse ( oEvent.getParameter ( "data" ) ).Action.Params.Param[0]["#"], 10 );
										x += oPopoverOffset["x"];
										x = parseInt ( x, 10 );
									} else {
										jQuery.sap.log.error ( "fnHandleClickOfClusterVO", "Failure of function call", "liveApp.controller.js" );
									}
									if ( JSON.parse ( oEvent.getParameter ( "data" ) ).Action.Params.Param[1].name === "y" ) {
										y = parseInt ( JSON.parse ( oEvent.getParameter ( "data" ) ).Action.Params.Param[1]["#"], 10 );
										y += oPopoverOffset["y"];
										y = parseInt ( y, 10 );
									} else {
										jQuery.sap.log.error ( "fnHandleClickOfClusterVO", "Failure of function call", "liveApp.controller.js" );
									}

									oObject["PositionObject"] = that.getPopoverOpeningDirection ( x, y );
									oObject["Data"] = oData.__batchResponses[0].data.results;
									oObject["Title"] = oSapSplUtils.getBundle ( ).getText ( "TRUCK_CLUSTER_POPOVER_TITLE", oData.__batchResponses[0].data.results.length );

									this.oClusterObjectsPopOver = sap.ui.xmlfragment ( "clusterObjectsTrucksFragment", "splReusable.fragments.ClusterObjectsListForTrucks", that ).addStyleClass ( "clusterObjectsFragmentClass" );
									this.oClusterObjectsPopOver.setModel ( new sap.ui.model.json.JSONModel ( oObject ) ).openBy ( that.byId ( "oPopoverAnchorButton" ) ).attachAfterClose ( function ( oEvent ) {
										oEvent.getSource ( ).destroy ( );
									} ).attachAfterOpen ( function ( ) {
										if ( parseInt ( this.$ ( ).find ( ".sapMPopoverCont" ).css ( "height" ), 10 ) > 400 ) {
											this.setContentHeight ( "400px" );
										}
									} );
								}, function ( ) {
									sap.ui.getCore ( ).byId ( "splView.liveApp.liveApp--oSapSplLiveAppPage" ).setBusy ( false );
								} );

							} else {
								for ( i = 0 ; i < aListOfVOs.length ; i++ ) {
									tempArrayOfClusteredVOs.push ( aListOfVOs[i].split ( "." )[1] );
								}
								sap.ui.getCore ( ).byId ( "splView.liveApp.liveApp--oSapSplLiveAppPage" ).setBusy ( true );
								(function ( instance ) {
									_results = instance.getTruckDetailsFromDeviceUUIDProxy.readArray ( instance, tempArrayOfClusteredVOs );
									sap.ui.getCore ( ).byId ( "splView.liveApp.liveApp--oSapSplLiveAppPage" ).setBusy ( false );
									oPopoverOffset = that.fnGetPopoverOffsets ( );
									if ( JSON.parse ( oEvent.getParameter ( "data" ) ).Action.Params.Param[0].name === "x" ) {
										x = parseInt ( JSON.parse ( oEvent.getParameter ( "data" ) ).Action.Params.Param[0]["#"], 10 );
										x += oPopoverOffset["x"];
										x = parseInt ( x, 10 );
									} else {
										jQuery.sap.log.error ( "fnHandleClickOfClusterVO", "Failure of function call", "liveApp.controller.js" );
									}
									if ( JSON.parse ( oEvent.getParameter ( "data" ) ).Action.Params.Param[1].name === "y" ) {
										y = parseInt ( JSON.parse ( oEvent.getParameter ( "data" ) ).Action.Params.Param[1]["#"], 10 );
										y += oPopoverOffset["y"];
										y = parseInt ( y, 10 );
									} else {
										jQuery.sap.log.error ( "fnHandleClickOfClusterVO", "Failure of function call", "liveApp.controller.js" );
									}

									oObject["PositionObject"] = that.getPopoverOpeningDirection ( x, y );

									oObject["Data"] = _results["Data"];

									oObject["Title"] = oSapSplUtils.getBundle ( ).getText ( "TRUCK_CLUSTER_POPOVER_TITLE", _results["Data"].length );

									this.oClusterObjectsPopOver = sap.ui.xmlfragment ( "clusterObjectsTrucksFragment", "splReusable.fragments.ClusterObjectsListForTrucks", that ).addStyleClass ( "clusterObjectsFragmentClass" );
									this.oClusterObjectsPopOver.setModel ( new sap.ui.model.json.JSONModel ( oObject ) ).openBy ( that.byId ( "oPopoverAnchorButton" ) ).attachAfterClose ( function ( oEvent ) {
										oEvent.getSource ( ).destroy ( );
									} ).attachAfterOpen ( function ( ) {
										if ( parseInt ( this.$ ( ).find ( ".sapMPopoverCont" ).css ( "height" ), 10 ) > 400 ) {
											this.setContentHeight ( "400px" );
										}
									} );
									sap.ui.getCore ( ).byId ( "splView.liveApp.liveApp--oSapSplLiveAppPage" ).setBusy ( false );
								} ( this ));

							}
						}
					},

					fnHandleClickOfClusterObjectTruckListItem : function ( oEvent ) {
						var oData = oEvent.getParameters ( ).listItem.getBindingContext ( ).getObject ( );
						var oPositionObject = oEvent.getSource ( ).getModel ( ).getData ( ).PositionObject;
						oEvent.getParameters ( ).listItem.getParent ( ).getParent ( ).close ( );
						var that = this;

						/*Fallback mode*/
						if ( oSapSplUtils.getFromQueryParameterMap ( "xx-sap-spl-fallback" ) === "true" ) {
							this.getTruckDetailsFromDeviceUUID ( oData["DeviceUUID"], function ( oData ) {
								var oTruckData = oData.results[0];
								oTruckData.x = oPositionObject["x"];
								oTruckData.y = oPositionObject["y"];
								oTruckData.placement = oPositionObject["placement"];
								oTruckData.introduceFooterZoomInButton = true;
								oTruckData.zoomInButtonHandler = jQuery.proxy ( this.fnHandleZoomIntoCLusterObject, this );
								oTruckData.fromLabel = true;
								this.showTruckDetailsPopover ( oTruckData );
							}, function ( ) {
								jQuery.sap.log.error ( "SAP SPL Live App Controller", "Error while fetching truck details from UUID", "SAPSPL" );
							} );
						} else {
							this.getTruckDetailsFromDeviceUUIDProxy.read ( this, oData["DeviceUUID"], function ( oData ) {
								var oTruckData = oData.results[0];
								oTruckData.x = oPositionObject["x"];
								oTruckData.y = oPositionObject["y"];
								oTruckData.placement = oPositionObject["placement"];
								oTruckData.introduceFooterZoomInButton = true;
								oTruckData.zoomInButtonHandler = jQuery.proxy ( that.fnHandleZoomIntoCLusterObject, that );
								oTruckData.fromLabel = true;
								that.showTruckDetailsPopover ( oTruckData );
							}, function ( ) {

							} );
						}

					},

					fnHandleClickOfClusterObjectListItem : function ( oEvent ) {
						var oData = oEvent.getParameters ( ).listItem.getBindingContext ( ).getObject ( );
						var oPositionObject = oEvent.getSource ( ).getModel ( ).getData ( ).PositionObject;
						oData["x"] = oPositionObject["x"];
						oData["y"] = oPositionObject["y"];
						oData["placement"] = oPositionObject["placement"];
						oEvent.getParameters ( ).listItem.getParent ( ).getParent ( ).close ( );
						this.fnLeftPaneToMapInterface ( oData, "Cluster", jQuery.proxy ( this.fnHandleZoomIntoCLusterObject, this ) );
					},

					fnHandleZoomIntoCLusterObject : function ( oData, oPopover, sProperty ) {
						var iZoomTo = 17;
						var sCoords = oData[sProperty].split ( ";" );
						if ( oData[sProperty].length === sCoords[0].length ) {
							sCoords = oSapSplMapsDataMarshal.convertGeoJSONToString ( JSON.parse ( oData[sProperty] ) ).split ( ";" );
						}
						this.byId ( "oSapSplLiveAppMap" ).zoomToGeoPosition ( parseFloat ( sCoords[0], 10 ), parseFloat ( sCoords[1], 10 ), iZoomTo );
						oPopover.close ( );
					},

					/**
					 * Event handler for the Visual Business Map
					 * @param oEvent
					 * @return void
					 * @since 1.0
					 * @private
					 */
					fnEventHandler : function ( oEvent ) {

						if ( this.oTruckDetailsPopOver ) {
							this.oTruckDetailsPopOver.destroy ( );
						}
						if ( this.oIncidenceOccurrenceDetailsPopOver ) {
							this.oIncidenceOccurrenceDetailsPopOver.destroy ( );
						}
						if ( this.oLocationDetailsPopOver ) {
							this.oLocationDetailsPopOver.destroy ( );
						}

						// Click on the Map
						if ( JSON.parse ( oEvent.getParameter ( "data" ) ).Action.object === "Map" ) {

							this.fnHandleLocationCreationOnMap ( oEvent, "mapClick" );

							// Click on the first point when you try to create a
							// Geofence
						} else if ( JSON.parse ( oEvent.getParameter ( "data" ) ).Action.object === "FLAG" ) {

							this.fnHandleLocationCreationOnMap ( oEvent, "flagClick" );

							// Click on Geofence area
						} else if ( JSON.parse ( oEvent.getParameter ( "data" ) ).Action.object === "GeoFenceArea" && this.isGeofenceClickEnabled ) {

							// Function triggered when any VO is clicked.
							this.fnHandleClickOnVisualObjects ( );

							// Function that handles the click on Geofence.
							this.fnHandleGeofenceAreaClick ( oEvent );

							// Click on the PointOfInterestFlag
						} else if ( JSON.parse ( oEvent.getParameter ( "data" ) ).Action.object === "PoIFlag" && this.isPOIclickEnabled ) {

							// Function triggered when any VO is clicked.
							this.fnHandleClickOnVisualObjects ( );

							this.fnHandleLocationDetailsDisplay ( oEvent );

							// Click on the Truck flag
						} else if ( JSON.parse ( oEvent.getParameter ( "data" ) ).Action.object === "TruckFlag" && this.isTruckClickEnabled ) {

							// Function triggered when any VO is clicked.
							this.fnHandleClickOnVisualObjects ( );

							// Function that handles the click on Truck
							this.fnHandleTruckFlagClick ( oEvent );

							// Click on the incidence occurrence flag
						} else if ( JSON.parse ( oEvent.getParameter ( "data" ) ).Action.object === "IncidentFlag" && this.isIncidenceOccurrenceClickEnabled ) {

							// Function triggered when any VO is clicked.
							this.fnHandleClickOnVisualObjects ( );

							// Function that handles the click on an Incident
							// occurrence
							this.handleIncidenceOccurrencePopover ( oEvent );

							// Zoom event on the Map
						} else if ( JSON.parse ( oEvent.getParameter ( "data" ) ).Action.name === "ZOOM_EVENT" ) {

							this.fnLiveAppMapZoomPanEvent ( oEvent );
							this.fnHandleZoomEventOnTheMap ( oEvent );

							// Pan event on the Map
						} else if ( JSON.parse ( oEvent.getParameter ( "data" ) ).Action.name === "CENTERCHANGED_EVENT" ) {

							this.fnLiveAppMapZoomPanEvent ( oEvent );
							// Function that saves the current center point of
							// the map as an
							// attribute to the passed map instance
							oSapSplMapsDataMarshal.fnGetMapCenter ( this.byId ( "oSapSplLiveAppMap" ), oEvent );

							// Click on the gate
						} else if ( JSON.parse ( oEvent.getParameter ( "data" ) ).Action.name === "CLICK_POINT_GEOFENCE_TEMP_GATE" ) {

							// Handles the click on the edge of a Geofence
							this.fnHandleGeofenceGateClick ( oEvent );

						} else if ( JSON.parse ( oEvent.getParameter ( "data" ) ).Action.name === "ATTRIBUTE_CHANGED" ) {

							// Handles the Location edit on the Map.
							this.fnHandleLocationEditOnMap ( oEvent );
						} else if ( JSON.parse ( oEvent.getParameter ( "data" ) ).Action.name === "EDGE_RIGHT_CLICK_GEOFENCE_AREA" ) {

							this.fnHandleContextMenu ( oEvent );

						} else if ( JSON.parse ( oEvent.getParameter ( "data" ) ).Action.name === "RIGHT_CLICK_GEOFENCE_AREA_HANDLER" ) {

							this.fnHandleContextMenu ( oEvent );
						} else if ( JSON.parse ( oEvent.getParameter ( "data" ) ).Action.name === "CLICK_POI_CLUSTER" ) {

							this.fnHandleClickOfClusterVO ( oEvent, "POI" );
						} else if ( JSON.parse ( oEvent.getParameter ( "data" ) ).Action.name === "CLICK_TRUCK_NORMAL_CLUSTER" || JSON.parse ( oEvent.getParameter ( "data" ) ).Action.name === "CLICK_TRUCK_ORDER_CLUSTER" ||
								JSON.parse ( oEvent.getParameter ( "data" ) ).Action.name === "CLICK_TRUCK_ISSUE_CLUSTER" ) {

							this.fnHandleClickOfClusterVO ( oEvent, "Truck" );
						}
					},

					/**
					 * Method to check if the zoom level zone has changed as compared to previous zoom level
					 * @param oEvent
					 * @returns void
					 * @since 1.0
					 * @private
					 */
					bCanChangeVOIcon : function ( sType ) {
						function getZoomLevelZone ( iZoom ) {
							if ( iZoom <= 6 ) {
								return 1;
							} else if ( iZoom <= 12 ) {
								return 2;
							} else {
								return 3;
							}
						}

						function getZoomLevelZoneForTruck ( iZoom ) {
							if ( iZoom <= 10 ) {
								return 1;
							} else {
								return 2;
							}
						}

						if ( sType === "Truck" ) {
							if ( getZoomLevelZoneForTruck ( this.iCurZoom ) === getZoomLevelZoneForTruck ( this.iPrevZoom ) ) {
								return false;
							} else {
								return true;
							}
						} else {
							if ( getZoomLevelZone ( this.iCurZoom ) === getZoomLevelZone ( this.iPrevZoom ) ) {
								return false;
							} else {
								return true;
							}
						}
					},

					/**
					 * This function refreshes the labels based on the state that is maintained in the label visibility control.
					 * @param void
					 * @returns void
					 * @since 1.0
					 * @private
					 */
					fnRefreshLabels : function ( ) {

						// For Geofences
						if ( this.isGeofenceLabelVisible ) {
							oSapSplMapsDataMarshal.fnHandleDetailWindowVisibility ( "Show", "Geofence" );
						} else {
							oSapSplMapsDataMarshal.fnHandleDetailWindowVisibility ( "Hide", "Geofence" );
						}
					},

					/**
					 * This is the interface between Map and the label visibility control.
					 * Based on the change you make in this control, it toggles the visibility of the label and persists the state.
					 * @param oLabelVisibility
					 * @return void
					 * @since 1.0
					 * @private
					 */
					fnLabelToggleControlToMapInterface : function ( oLabelVisibility ) {

						// For trucks
						if ( oLabelVisibility["Trucks"] === true ) {
							this.isTruckLabelVisible = null;
							oSapSplMapsDataMarshal.fnHandleDetailWindowVisibility ( "Show", "Trucks" );
						} else {
							this.isTruckLabelVisible = "noLabel";
							oSapSplMapsDataMarshal.fnHandleDetailWindowVisibility ( "Hide", "Trucks" );
						}
						for ( var i = 0 ; i < this.aTruckArray.length ; i++ ) {
							if ( this.aTruckArray[i] ) {
								oSapSplMapsDataMarshal.fnShowTruckFlags ( this.aTruckArray[i], this.byId ( "oSapSplLiveAppMap" ), this.isTruckLabelVisible );
							}
						}

						// For Geofences
						if ( oLabelVisibility["Geofence"] !== undefined ) {

							if ( oLabelVisibility["Geofence"] === true ) {
								this.isGeofenceLabelVisible = true;
								oSapSplMapsDataMarshal.fnHandleDetailWindowVisibility ( "Show", "Geofence" );
							} else {
								this.isGeofenceLabelVisible = false;
								// CSN FIX : 0120031469 0000619148 2014
								oSapSplMapsDataMarshal.fnHandleDetailWindowVisibility ( "Hide", "Geofence" );
							}
						}

					},

					/**
					 * This function is called when detail window config object is loaded.
					 * @returns void
					 * @param oEvent
					 * @since 1.0
					 * @private
					 */
					openDetailWindow : function ( oEvent ) {
						var that = this;

						// Detail window for Trucks
						if ( JSON.parse ( oEvent.getParameter ( "id" ) )["isTypeTruck"] ) {

							oSapSplMapsDataMarshal.fnAddTruckDetailWindowContent ( oEvent, function ( oData ) {
								oData["fromLabel"] = true;
								that.fnHandleTruckFlagClick ( oData );
								// Function triggered when any VO is clicked.
								that.fnHandleClickOnVisualObjects ( );
							}, that.byId ( "oSapSplLiveAppMap" ), this.isTruckLabelVisible );

							// Detail window for Gates
						} else if ( JSON.parse ( oEvent.getParameter ( "id" ) )["isTypeGate"] ) {

							oSapSplMapsDataMarshal.fnAddGateDetailWindowContent ( oEvent, function ( ) {}, that.byId ( "oSapSplLiveAppMap" ) );

							// Detail window foe Geofence
						} else {

							oSapSplMapsDataMarshal.fnAddDetailWindowContent ( oEvent, function ( oData ) {
								/* Fix For Incident : 1570316630 */
								that.getLocationDetailsFromLocationID ( oData["LocationID"], oData["Tag"], function ( aResults ) {
									var sDetailWindowPosition = oSapSplMapsDataMarshal.fnGetPointFromPolygon ( oSapSplMapsDataMarshal.convertGeoJSONToString ( JSON.parse ( aResults.results[0]["Geometry"] ) ) );
									aResults.results[0]["sDetailWindowPosition"] = sDetailWindowPosition;
									that.fnHandleLocationDetailsDisplay ( aResults.results[0] );
								}, function ( ) {

								} );
							}, that.byId ( "oSapSplLiveAppMap" ), that.isGeofenceLabelVisible );

						}
					},

					/**
					 * Instantiates the toolbar and adds to the header of the page
					 * @param void
					 * @returns void
					 * @since 1.0
					 * @private
					 */
					fnInstantiateToolbar : function ( ) {
						var that = this;
						// Configuration data for the toolbar.
						var oToolbarConfigData = {
							searchFieldVisible : false,
							advancedSearchVisible : false,
							parentControllerInstance : this,
							feedlistVisible : true,
							toolbarEventHandler : jQuery.proxy ( this.fnToolbarEventHandler, this ),
							mapFilters : [{
								name : "Layers",
								icon : "sap-icon://dimension",
								visible : false
							}, {
								name : "Others",
								icon : "sap-icon://map",
								visible : false
							}, {
								name : "Map",
								icon : "sap-icon://map-2",
								visible : false
							}],
							parkingSpaceFilters : [{
								name : oSapSplUtils.getBundle ( ).getText ( "CARDS_PARKING_SPACE_LABEL" ),
								visible : true
							}, {
								name : oSapSplUtils.getBundle ( ).getText ( "FUEL_PARKING_SPACE_LABEL" ),
								visible : true
							}, {
								name : oSapSplUtils.getBundle ( ).getText ( "SERVICES_PARKING_SPACE_LABEL" ),
								visible : true
							}],
							feedFilters : [{
								name : "All",
								icon : "All",
								visible : true
							}, {
								name : "HPA",
								icon : "sap-icon://action",
								visible : true
							}, {
								name : "Traffic",
								icon : "sap-icon://badge",
								visible : true
							}, {
								name : "Truck",
								icon : "sap-icon://shipping-status",
								visible : true
							}, {
								name : "Orders",
								icon : "sap-icon://database",
								visible : true
							}, {
								name : "Bupa",
								icon : "sap-icon://org-chart",
								visible : true
							}],
							mapInstance : this.byId ( "oSapSplLiveAppMap" ),
							pageInstance : this.byId ( "oSapSplLiveAppPage" )
						};

						// Instantiate the Map toolbar.
						if ( this.oMapToolbar ) {
							this.oMapToolbar.destroy ( );
						} else {
							this.oMapToolbar = new splReusable.libs.SapSplMapToolbar ( oToolbarConfigData );
							this.oMapToolbar.addFeedlistControl ( );
							this.byId ( "oSapSplLiveAppPage" ).setCustomHeader ( this.oMapToolbar );
						}

						// Sets a call back function for the Map filter in the
						// toolbar
						this.oMapToolbar.setMapFilterCallback ( function ( aSelectedVOs ) {
							that.showTrucksOnMap ( );
							that.showIncidenceOccurrencesOnMap ( );
							if ( aSelectedVOs ) {
								that.aSelectedLocationObjectsFromLeftPanel = aSelectedVOs;
							}
						} );
					},

					/**
					 * Gets the data from the UUID of Locations Messages and Trucks. Used only for liveApp search.
					 * @param IDString
					 * @param sEntity
					 * @param fnSuccess
					 * @param fnError
					 * @private
					 */
					fnGetDataForLiveAppSearch : function ( IDString, sEntity, fnSuccess, fnError ) {
						var sFilter = "";
						/*
						 * HOTFIX: Encode filter parameter to handle escaping of
						 * extra characters
						 */

						if ( sEntity === "MyLocations" ) {
							/* Incident Fix For : 1570311254 */
							sFilter = "$filter=(" + encodeURIComponent ( IDString ) + ")";

						} else {

							sFilter = "$filter=(" + encodeURIComponent ( IDString ) + ")";

						}
						oSapSplBusyDialog.getBusyDialogInstance ( ).open ( );
						this.oSapSplApplModel.read ( "/" + sEntity, null, [sFilter], false, jQuery.proxy ( fnSuccess, this ), jQuery.proxy ( fnError, this ) );
						oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
						// Hides the blocker div of dialog.
						jQuery ( ".sapUiBLy" ).css ( "z-index", "0" );
					},

					/**
					 * Interface to highlight searched objects on the Map
					 * @param aSearchResults
					 * @returns void
					 * @since 1.0
					 * @private
					 */
					fnSearchToMapInterface : function ( sMode, aSearchResults ) {

						var sLocationFilter = "";
						var sTruckFilter = "";
						var sIncidenceOccurrenceFilter = "";
						var sLastChar = "";

						if ( sMode === "clear" ) {

							this.fnPreventEnableMapRefresh ( "Prevent" );
							oSapSplMapsDataMarshal.fnRemoveVOsOnMap ( "All", this.byId ( "oSapSplLiveAppMap" ) );
							oSapSplMapsDataMarshal.fnHandleDetailWindowVisibility ( "Hide", "All" );

						} else if ( sMode === "show" ) {

							oSapSplMapsDataMarshal.fnRemoveVOsOnMap ( "All", this.byId ( "oSapSplLiveAppMap" ) );
							/* CSNFIX : 0120061532 0001317736 2014 */
							oSapSplMapsDataMarshal.fnHandleDetailWindowVisibility ( "Hide", "All" );

							for ( var i = 0 ; i < aSearchResults.length ; i++ ) {

								// For location entity
								if ( aSearchResults[i]["ObjectInfo"]["ObjectType"] === "Location" ) {

									sLocationFilter += "LocationID eq " + "X" + "\'" + oSapSplUtils.base64ToHex ( aSearchResults[i]["ObjectInfo"]["ObjectKey"] ) + "\' or ";

									// For incidence occurrence
								} else if ( aSearchResults[i]["ObjectInfo"]["ObjectType"] === "Message" ) {

									sIncidenceOccurrenceFilter += "UUID eq " + "X" + "\'" + oSapSplUtils.base64ToHex ( aSearchResults[i]["ObjectInfo"]["ObjectKey"] ) + "\' or ";

									// For truck
								} else if ( aSearchResults[i]["ObjectInfo"]["ObjectType"] === "TrackableObject" ) {

									sTruckFilter += "DeviceUUID eq " + "X" + "\'" + oSapSplUtils.base64ToHex ( aSearchResults[i]["ObjectInfo"]["DeviceUUID"] ) + "\' or ";

								}

							}

							if ( sLocationFilter !== "" ) {

								sLastChar = sLocationFilter.slice ( -3 );
								if ( sLastChar === "or " ) {
									sLocationFilter = sLocationFilter.substring ( 0, sLocationFilter.length - 4 );
								}

								this.fnGetDataForLiveAppSearch ( sLocationFilter, "MyLocations", function ( aResults ) {
									var aLocationArray = [];
									for ( var i = 0 ; i < aResults.results.length ; i++ ) {
										if ( aResults.results[i].Geometry ) {
											aLocationArray.push ( aResults.results[i] );
										}
									}
									oSapSplMapsDataMarshal.fnShowVOsOnMap ( aLocationArray, this.byId ( "oSapSplLiveAppMap" ) );
									if ( aResults.results.length === 1 ) {
										oSapSplMapsDataMarshal.fnPanToEntity ( this.byId ( "oSapSplLiveAppMap" ), aResults.results[0] );
									}

								}, function ( ) {
									jQuery.sap.log.error ( "getLocationDetailsFromLocationID", "read failed", "liveApp.controller.js" );
								} );
							}

							if ( sTruckFilter !== "" ) {

								sLastChar = sTruckFilter.slice ( -3 );
								if ( sLastChar === "or " ) {
									sTruckFilter = sTruckFilter.substring ( 0, sTruckFilter.length - 4 );
								}

								this.fnGetDataForLiveAppSearch ( sTruckFilter, "VehiclePositions", function ( aResults ) {

									for ( var i = 0 ; i < aResults.results.length ; i++ ) {
										if ( aResults.results[i] ) {
											oSapSplMapsDataMarshal.fnShowTruckFlags ( aResults.results[i], this.byId ( "oSapSplLiveAppMap" ), null );
										}
									}
									if ( aResults.results.length === 1 ) {
										oSapSplMapsDataMarshal.fnPanToEntity ( this.byId ( "oSapSplLiveAppMap" ), aResults.results[0] );
									}

								}, function ( ) {
									jQuery.sap.log.error ( "getTruckDetailsFromDeviceUUID", "read failed", "liveApp.controller.js" );
								} );
							}

							if ( sIncidenceOccurrenceFilter !== "" ) {

								sLastChar = sIncidenceOccurrenceFilter.slice ( -3 );
								if ( sLastChar === "or " ) {
									sIncidenceOccurrenceFilter = sIncidenceOccurrenceFilter.substring ( 0, sIncidenceOccurrenceFilter.length - 4 );
								}

								this.fnGetDataForLiveAppSearch ( sIncidenceOccurrenceFilter, "OccurredIncidents", function ( aResults ) {

									for ( var i = 0 ; i < aResults.results.length ; i++ ) {
										oSapSplMapsDataMarshal.fnShowIncidenceFlags ( aResults.results[i], this.byId ( "oSapSplLiveAppMap" ) );
									}
									if ( aResults.results.length === 1 ) {
										oSapSplMapsDataMarshal.fnPanToEntity ( this.byId ( "oSapSplLiveAppMap" ), aResults.results[0] );
									}

								}, function ( ) {
									jQuery.sap.log.error ( "getIncidentDetailsFromUUID", "read failed", "liveApp.controller.js" );
								} );
							}

						} else if ( sMode === "reset" ) {

							this.fnPreventEnableMapRefresh ( "Enable" );
							this.fnShowAllVisualObjectsOnMap ( "PlotLocally" );
							this.fnRefreshLabels ( );

						} else {
							jQuery.sap.log.error ( "fnSearchToMapInterface", "invalid argument", "liveApp.controller.js" );
						}
					},

					/**
					 * Interface to hilight objects on the Map
					 * @returns void
					 * @param UUID
					 * @param entityType
					 * @since 1.0
					 * @private
					 */
					feedlistToMapInterface : function ( UUID, entityType ) {
						var that = this;

						function fnIncidenceSuccess ( aResults ) {
							var coordinateString = oSapSplMapsDataMarshal.convertGeoJSONToString ( JSON.parse ( aResults.results[0]["SourceLocation"] ) );
							oSapSplMapsDataMarshal.fnPanTo ( that.byId ( "oSapSplLiveAppMap" ), coordinateString );

							// Converts the coordinate string to x an y
							// coordinate of the
							// screen.
							var oCords = oSapSplMapsDataMarshal.convertGeoCoordToScreenCoord ( coordinateString, that.byId ( "oSapSplLiveAppMap" ) );
							var oPopoverOffset = that.fnGetPopoverOffsets ( "fromMap" );
							aResults.results[0].x = parseInt ( oCords["left"] + oPopoverOffset["x"], 10 );
							aResults.results[0].y = parseInt ( oCords["top"] + oPopoverOffset["y"], 10 );
							aResults.results[0].fromFeedlist = true;

							that.handleIncidenceOccurrencePopover ( aResults.results[0] );
						}

						function fnIncidenceFail ( ) {
							jQuery.sap.log.error ( "Incident data", "read failed", "liveApp.controller.js" );
						}

						function fnTruckSuccess ( aResults ) {
							var coordinateString = oSapSplMapsDataMarshal.convertGeoJSONToString ( JSON.parse ( aResults.results[0]["Position"] ) );
							oSapSplMapsDataMarshal.fnPanTo ( that.byId ( "oSapSplLiveAppMap" ), coordinateString );

							// Converts the coordinate string to x an y
							// coordinate of the
							// screen.
							var oCords = oSapSplMapsDataMarshal.convertGeoCoordToScreenCoord ( coordinateString, that.byId ( "oSapSplLiveAppMap" ) );
							var oPopoverOffset = that.fnGetPopoverOffsets ( "fromMap" );
							aResults.results[0].x = parseInt ( oCords["left"] + oPopoverOffset["x"], 10 );
							aResults.results[0].y = parseInt ( oCords["top"] + oPopoverOffset["y"], 10 );
							aResults.results[0].placement = "Auto";
							aResults.results[0].fromFeedlist = true;

							that.showTruckDetailsPopover ( aResults.results[0] );
						}

						function fnTruckFail ( ) {
							jQuery.sap.log.error ( "Truck position", "read failed", "liveApp.controller.js" );
						}

						// Destroys the Truck detail Popover instance
						if ( this.oTruckDetailsPopOver ) {
							this.oTruckDetailsPopOver.destroy ( );
						}

						// Destroys the Incidence occurrence popover instance.
						if ( this.oIncidenceOccurrenceDetailsPopOver ) {
							this.oIncidenceOccurrenceDetailsPopOver.destroy ( );
						}

						// Get truck data from UUID
						if ( entityType === "Incidents" ) {

							this.getIncidentDetailsFromUUID ( UUID, fnIncidenceSuccess, fnIncidenceFail );

							// Get incidence data from UUID
						} else if ( entityType === "Trucks" ) {

							this.getTruckDetailsFromDeviceUUID ( UUID, fnTruckSuccess, fnTruckFail );
						}
					},

					/**
					 * @description Converts cordinate string to array of cordinates
					 * @param {array} aCoOrds
					 * @private
					 * @returns {string} Joined string with \n as delimited
					 */
					fnCordinateStringToCordinateArray : function ( sCords ) {
						var aCords = sCords.split ( ";" );
						var aCordinates = [];
						var oCords = {};
						for ( var i = 0 ; i < aCords.length ; i++ ) {
							if ( i % 3 === 0 ) {
								oCords = {};
								oCords["long"] = parseFloat ( aCords[i], 10 );
							} else if ( i % 3 === 1 ) {
								oCords["lat"] = parseFloat ( aCords[i], 10 );
							} else if ( i % 3 === 2 ) {
								oCords["alt"] = parseFloat ( aCords[i], 10 );
								aCordinates.push ( oCords );
							}
						}
						return aCordinates;
					},

					/**
					 * @description Converts array of cordinates to cordinate string
					 * @param {array} aCoOrds
					 * @private
					 * @returns {string} Joined string with \n as delimited
					 */
					fnCordinateArrayToCordinateString : function ( aCords ) {
						var sCordinates = "";
						for ( var i = 0 ; i < aCords.length ; i++ ) {
							sCordinates += aCords[i]["long"] + ";" + aCords[i]["lat"] + ";" + aCords[i]["alt"] + ";";
						}
						var sLastChar = sCordinates.slice ( -1 );
						if ( sLastChar === ";" ) {
							sCordinates = sCordinates.substring ( 0, sCordinates.length - 1 );
						}
						return sCordinates;
					},

					/**
					 * Handles the edit of location.
					 * @param oEvent {object}
					 * @returns void
					 * @since 1.0
					 * @private
					 */
					fnHandleLocationEdit : function ( oEvent ) {
						var that = this;

						this.fnPreventEnableMapRefresh ( "Prevent" );

						oSapSplMapsDataMarshal.fnChangeCursor ( "pencil" );

						var oLocationData = oEvent.getSource ( ).getParent ( ).getParent ( ).getModel ( ).getData ( );

						oLocationData["locationGeoCoords"] = this.fnCordinateStringToCordinateArray ( oSapSplMapsDataMarshal.convertGeoJSONToString ( JSON.parse ( oLocationData["Geometry"] ) ) );
						oLocationData["showGates"] = true;

						// fix for internal incident 1482006756
						oSapSplMapsDataMarshal.fnHandleDetailWindowVisibility ( "Hide", "Geofence" );

// oSapSplMapsDataMarshal.fnEditFences ( oLocationData, this.byId (
// "oSapSplLiveAppMap" ) );
						oEvent.getSource ( ).getParent ( ).getParent ( ).close ( );
						splReusable.libs.SapSplStyleSheetLoader.loadStyle ( "./resources/styles/sapSplCreateEditLocationDialog" );

						if ( !this.oSapSplLocationCreateEditDialogInstance ) {

							sap.ui.getCore ( ).setModel ( new sap.ui.model.json.JSONModel ( ), "sapSplLocationCreateEditDialogModel" );

							var oSapSplLocationCreateEditDialogViewInstance = sap.ui.view ( {
								viewName : "splView.dialogs.SplCreateEditLocationDialog",
								type : sap.ui.core.mvc.ViewType.XML,
								viewData : [oLocationData["Tag"], "Edit", jQuery.extend ( true, {}, oLocationData ), that]
							} ).setModel ( sap.ui.getCore ( ).getModel ( "sapSplLocationCreateEditDialogModel" ) ).addStyleClass ( "sapSplLocationCreateDialogContainerView" );

							var oLeftButton = new sap.m.Button ( {
								text : oSapSplUtils.getBundle ( ).getText ( "OK" ),
								press : jQuery.proxy ( oSapSplLocationCreateEditDialogViewInstance.getController ( ).handlePressOfDialogOK, oSapSplLocationCreateEditDialogViewInstance.getController ( ) )
							} );

							var oRightButton = new sap.m.Button ( {
								text : oSapSplUtils.getBundle ( ).getText ( "CANCEL" ),
								press : jQuery.proxy ( oSapSplLocationCreateEditDialogViewInstance.getController ( ).handlePressOfDialogCancel, oSapSplLocationCreateEditDialogViewInstance.getController ( ) )
							} );

							oSapSplLocationCreateEditDialogViewInstance.getController ( ).setLiveAppControllerInstance ( this );

							this.oSapSplLocationCreateEditDialogInstance = new sap.m.Dialog ( {
								beginButton : oLeftButton,
								endButton : oRightButton,
								showHeader : false,
								content : new sap.ui.commons.layout.VerticalLayout ( ).addStyleClass ( "viewHolderLayout" ).addContent ( oSapSplLocationCreateEditDialogViewInstance )
							} ).addStyleClass ( "SplLocationCreateEditDialog" ).addStyleClass ( "sapSplHideDialog" );

							this.oSapSplLocationCreateEditDialogInstance.attachAfterClose ( function ( ) {
								/* Fix for 1580094753 */
								that.fnShowAllVisualObjectsOnMap ( "plotSelected" );
								that.fnPreventEnableMapRefresh ( "Enable" );
								that.fnBlockUnblockLiveAppUI ( "Unblock" );
								that.oSapSplLocationCreateEditDialogInstance = null;
								that._bMessageStripInsertedToLocationEditDialog = false;
							} );

							this.oSapSplLocationCreateEditDialogInstance.attachAfterOpen ( function ( ) {
								oSapSplUtils.fnSyncStyleClass ( that.oSapSplLocationCreateEditDialogInstance );
								that._bMessageStripInsertedToLocationEditDialog = false;
							} );

							this.oSapSplLocationCreateEditDialogInstance.addEventDelegate ( {
								onAfterRendering : function ( oEvent ) {
									that.fnHandleDialogMove ( oEvent.srcControl );
									that.fnHandleDialogPositioning ( oEvent.srcControl );
								}
							} );

						}

						oLocationData["edgeToGateMap"] = this.fnGetEdgeToGateMap ( oLocationData );

						sap.ui.getCore ( ).getModel ( "sapSplLocationCreateEditDialogModel" ).setData ( oLocationData );
						this.oSapSplLocationCreateEditDialogInstance.open ( );
						/* Fix for 1580168985 Hides the blocker div of dialog. */
						$ ( ".sapUiBliLy" ).addClass ( 'splReduceDivHeight' );
						this.aRenderedDialogs.push ( "viewHolderLayout" );
						this.fnBlockUnblockLiveAppUI ( "Block", "addGeofence" );
						oSapSplMapsDataMarshal.fnHandleDetailWindowVisibility ( "Show", "Gates" );

					},

					fnUpdateGatesDataInLocationEditMode : function ( ) {

						var oModelData = null, aEdgeToGateMap = [], aEdgeArray = [], aGatesArray = [];

						function fnOverWriteGateObjectWithUpdatedEdgeObject ( oEdgeObject, oGateObject ) {
							oGateObject["GateGeometry"] = oEdgeObject["GateGeometry"];
							return oGateObject;
						}

						oModelData = sap.ui.getCore ( ).getModel ( "sapSplLocationCreateEditDialogModel" ).getData ( );
						aEdgeToGateMap = oModelData["edgeToGateMap"];
						aEdgeArray = oSapSplMapsDataMarshal.getEdgesFromGeofence ( oModelData, this.byId ( "oSapSplLiveAppMap" ) );
						aGatesArray = oModelData["GeofenceGates"]["results"];

						for ( var i = 0 ; i < aGatesArray.length ; i++ ) {
							for ( var j = 0 ; j < aEdgeToGateMap.length ; j++ ) {
								if ( aEdgeToGateMap[j]["resultsIndex"] === i ) {
									var iCorrespondingEdge = aEdgeToGateMap[j]["index"];
									aGatesArray[i] = fnOverWriteGateObjectWithUpdatedEdgeObject ( aEdgeArray[iCorrespondingEdge], aGatesArray[i] );
								}
							}
						}

						oModelData["GeofenceGates"]["results"] = aGatesArray;

						if ( oModelData.isRadar === "1" && (sap.ui.getCore ( ).getModel ( "sapSplAppConfigDataModel" ).getData ( )["canViewRulesWithoutTour"] !== 1) && this._bMessageStripInsertedToLocationEditDialog === false &&
								sap.ui.getCore ( ).byId ( $ ( ".SplCreateEditLocationDialogNavContainer" ).attr ( "id" ) ).getCurrentPage ( ).sId.search ( "Home" ) !== -1 ) {
							this._bMessageStripInsertedToLocationEditDialog = true;
							sap.ui.getCore ( ).byId ( $ ( ".SplCreateEditLocationDialogNavContainer" ).attr ( "id" ) ).getCurrentPage ( ).insertContent ( new sap.m.MessageStrip ( {
								text : "{splI18NModel>EDIT_GEOFENCE_SHAPE_WARNING}",
								showCloseButton : false,
								showIcon : true,
								type : "Warning"
							} ).addStyleClass ( "sapUiSmallMarginTopBottom" ).addStyleClass ( "sapUiSmallMarginBeginEnd" ), "0" );

							oModelData.shapeChanged = true;
						}

						sap.ui.getCore ( ).getModel ( "sapSplLocationCreateEditDialogModel" ).setData ( oModelData );
					},

					/**
					 * Handles the edit of locations on the Map
					 * @param oEvent {object}
					 * @returns void
					 * @since 1.0
					 * @private
					 */
					fnHandleLocationEditOnMap : function ( oEvent ) {
						var i = 0;
						var j = 0;
						var oModelData = {};
						for ( j = 0 ; j < JSON.parse ( oEvent.getParameter ( "data" ) ).Data.Merge.N.length ; j++ ) {

							// Edit of Geofence
							if ( JSON.parse ( oEvent.getParameter ( "data" ) ).Data.Merge.N[j].name === "GeoFenceAreas" ) {

								for ( i = 0 ; i < JSON.parse ( oEvent.getParameter ( "data" ) ).Data.Merge.N[j].E.length ; i++ ) {

									if ( JSON.parse ( oEvent.getParameter ( "data" ) ).Data.Merge.N[j].E[i]["H"] ) {

										oModelData = sap.ui.getCore ( ).getModel ( "sapSplLocationCreateEditDialogModel" ).getData ( );
										oModelData["locationGeoCoords"] = this.fnCordinateStringToCordinateArray ( JSON.parse ( oEvent.getParameter ( "data" ) ).Data.Merge.N[j].E[i]["H"] );
										oModelData["Geometry"] = JSON.stringify ( oSapSplMapsDataMarshal.convertStringToGeoJSON ( JSON.parse ( oEvent.getParameter ( "data" ) ).Data.Merge.N[j].E[i]["H"] ) );
										sap.ui.getCore ( ).getModel ( "sapSplLocationCreateEditDialogModel" ).setData ( oModelData );
										this.fnUpdateGatesDataInLocationEditMode ( );

									}

								}

							} else if ( JSON.parse ( oEvent.getParameter ( "data" ) ).Data.Merge.N[j].name === "PointOfInterestFlags" ) {

								for ( i = 0 ; i < JSON.parse ( oEvent.getParameter ( "data" ) ).Data.Merge.N[j].E.length ; i++ ) {

									/* CSNFIX : 0120031469 418002 2014 */
									if ( JSON.parse ( oEvent.getParameter ( "data" ) ).Data.Merge.N[j].E[i]["VB:s"] && JSON.parse ( oEvent.getParameter ( "data" ) ).Data.Merge.N[j].E[i]["VB:s"] === "true" ) {

										if ( sap.ui.getCore ( ).getModel ( "sapSplLocationCreateEditDialogModel" ) ) {
											oModelData = sap.ui.getCore ( ).getModel ( "sapSplLocationCreateEditDialogModel" ).getData ( );
											oModelData["locationGeoCoords"] = this.fnCordinateStringToCordinateArray ( JSON.parse ( oEvent.getParameter ( "data" ) ).Data.Merge.N[j].E[i]["position"] );
											sap.ui.getCore ( ).getModel ( "sapSplLocationCreateEditDialogModel" ).setData ( oModelData );
										}
										if ( sap.ui.getCore ( ).getModel ( "sapSplCreateParkingSpaceModel" ) ) {
											oModelData = sap.ui.getCore ( ).getModel ( "sapSplCreateParkingSpaceModel" ).getData ( );
											oModelData["Longitude"] = JSON.parse ( oEvent.getParameter ( "data" ) ).Data.Merge.N[j].E[i]["position"].split ( ";" )[0];
											oModelData["Latitude"] = JSON.parse ( oEvent.getParameter ( "data" ) ).Data.Merge.N[j].E[i]["position"].split ( ";" )[1];
											sap.ui.getCore ( ).getModel ( "sapSplCreateParkingSpaceModel" ).setData ( oModelData );
										}
									}

								}

							}
						}
					},

					/**
					 * Handles location creation on Map. That is Bridge, Parking, Container and Geofence.
					 * @param oEvent {object}
					 * @param sMode {string}
					 * @returns void
					 * @since 1.0
					 * @private
					 */
					fnHandleLocationCreationOnMap : function ( oEvent, sMode ) {
						var that = this;
						if ( sMode === "mapClick" ) {

							for ( var i = 0 ; i < JSON.parse ( oEvent.getParameter ( "data" ) ).Action.AddActionProperties.AddActionProperty.length ; i++ ) {

								if ( JSON.parse ( oEvent.getParameter ( "data" ) ).Action.AddActionProperties.AddActionProperty[i].name === "pos" ) {

									// Clicked coordinate in the from of string
									var sClickedPosition = JSON.parse ( oEvent.getParameter ( "data" ) ).Action.AddActionProperties.AddActionProperty[i]["#"];

									// Creates a flag and lines between flags
									// when you click on
									// the map
									if ( this.sLocationType === "LC0004" || this.sLocationType === "LC0008" ) {

										// FIX FOR INTERNAL INCIDENT 1482016556
										oSapSplUtils.setIsDirty ( true );
										// Function which creates a line between
										// the points that
										// you clicked
										oSapSplMapsDataMarshal.fnCreateLine ( sClickedPosition, oEvent, this.getView ( ).byId ( "oSapSplLiveAppMap" ) );

										// Creates Parking space flag on the Map
									} else if ( this.sLocationType === "LC0002" || this.sLocationType === "LC0003" || this.sLocationType === "LC0007" ) {

										// FIX FOR INTERNAL INCIDENT 1482016556
										oSapSplUtils.setIsDirty ( true );
										// Change the pencil cursor to normal
										oSapSplMapsDataMarshal.fnChangeCursor ( "normal" );
										this.fnPreventEnableMapRefresh ( "Enable" );
										this.byId ( "sapSplLocationCreateCancelButton" ).setVisible ( false );
										this.byId ( "sapSplTrafficStatusFooter" ).removeStyleClass ( "sapSplHiddenBar" );
										// Creates a flag on the Map
										oSapSplMapsDataMarshal.fnCreatePointOfInterestFlag ( sClickedPosition, this.getView ( ).byId ( "oSapSplLiveAppMap" ), function ( oData ) {

											that.handleCreateParkingDialog ( oData );

										}, this.sLocationType );

										// Resets all the variables and array
										// buffers in
										// MapDataMarshal
										oSapSplMapsDataMarshal.fnResetValues ( this.getView ( ).byId ( "oSapSplLiveAppMap" ) );
									} else {

										// Change the pencil cursor to normal
										oSapSplMapsDataMarshal.fnChangeCursor ( "normal" );
										this.fnPreventEnableMapRefresh ( "Enable" );
										this.byId ( "sapSplLocationCreateCancelButton" ).setVisible ( false );
										this.byId ( "sapSplTrafficStatusFooter" ).removeStyleClass ( "sapSplHiddenBar" );
										// Creates a flag on the Map
										oSapSplMapsDataMarshal.fnCreatePointOfInterestFlag ( sClickedPosition, this.getView ( ).byId ( "oSapSplLiveAppMap" ), function ( oData ) {

											that.fnInstantiateAndOpenCreateLocationDialog ( oData );

										}, this.sLocationType );

										// Resets all the variables and array
										// buffers in
										// MapDataMarshal
										oSapSplMapsDataMarshal.fnResetValues ( this.getView ( ).byId ( "oSapSplLiveAppMap" ) );
									}
									// this.oMapToolbar.getContentLeft()[2].setText(this.sDisplayAreaText);
								}

							}
						} else if ( sMode === "flagClick" ) {
							/* Check whether this is the first point */
							if ( JSON.parse ( oEvent.getParameter ( "data" ) ).Action.instance === "Flags.0" ) {

								// Change the pencil cursor to normal
								oSapSplMapsDataMarshal.fnChangeCursor ( "normal" );
								this.fnPreventEnableMapRefresh ( "Enable" );
								this.byId ( "sapSplLocationCreateCancelButton" ).setVisible ( false );
								this.byId ( "sapSplTrafficStatusFooter" ).removeStyleClass ( "sapSplHiddenBar" );

								// Creates an Area on the Map
								oSapSplMapsDataMarshal.fnCreatePolygon ( this.getView ( ).byId ( "oSapSplLiveAppMap" ), function ( oData ) {

									// This gives the coordinate when you try to
									// create a
									// Geofence
									that.fnInstantiateAndOpenCreateLocationDialog ( oData );

								} );

								// Resets all the variables and array buffers in
								// MapDataMarshal
								oSapSplMapsDataMarshal.fnResetValues ( this.getView ( ).byId ( "oSapSplLiveAppMap" ) );
							}
						} else {
							jQuery.sap.log.error ( "Invalid argument", "sMode", "liveApp.controller.js" );
						}
					},

					/**
					 * Compares the coordinates of two lineStrings and checks if both are same or not
					 */
					fnCompareLineStrings : function ( oTempEdge, oFenceGate ) {
						var isMatched, sTempEdge, sFenceGate, aTempEdgeCoordinates, aFenceGateCoordinate;
						sTempEdge = oSapSplMapsDataMarshal.convertGeoJSONToString ( JSON.parse ( oTempEdge["GateGeometry"] ) );
						sFenceGate = oSapSplMapsDataMarshal.convertGeoJSONToString ( JSON.parse ( oFenceGate["GateGeometry"] ) );
						aTempEdgeCoordinates = sTempEdge.split ( ";" );
						aFenceGateCoordinate = sFenceGate.split ( ";" );
						if ( ((aTempEdgeCoordinates[0] === aFenceGateCoordinate[0]) && (aTempEdgeCoordinates[1] === aFenceGateCoordinate[1]) && (aTempEdgeCoordinates[3] === aFenceGateCoordinate[3]) && (aTempEdgeCoordinates[4] === aFenceGateCoordinate[4])) ||
								((aTempEdgeCoordinates[0] === aFenceGateCoordinate[3]) && (aTempEdgeCoordinates[1] === aFenceGateCoordinate[4]) && (aTempEdgeCoordinates[3] === aFenceGateCoordinate[0]) && (aTempEdgeCoordinates[4] === aFenceGateCoordinate[1])) ) {
							isMatched = true;
						}
						return isMatched;
					},

					/**
					 * Creates a mapping between the gates and the edges of geofence.
					 * @param oLocationData
					 * @returns {Array}
					 * @since 1.0
					 * @private
					 */
					fnGetEdgeToGateMap : function ( oLocationData ) {

						var aGateIndexes = [];
						/* Fix for incident : 1570441636 */
						if ( oLocationData["Tag"] === "LC0001" ) {
							return aGateIndexes;
						}

						var aFenceEdges = oSapSplMapsDataMarshal.getEdgesFromGeofence ( oLocationData, this.byId ( "oSapSplLiveAppMap" ) );
						var aGateLines = oLocationData["GeofenceGates"]["results"];
						// Maps the existing gates with the selected gate index.
						for ( var i = 0 ; i < aFenceEdges.length ; i++ ) {
							for ( var j = 0 ; j < aGateLines.length ; j++ ) {
								var isMatchedStatus = this.fnCompareLineStrings ( aFenceEdges[i], aGateLines[j] );
								if ( isMatchedStatus ) {
									var oIndexReferenceObject = {};
									oIndexReferenceObject["index"] = i;
									oIndexReferenceObject["resultsIndex"] = j;
									aGateIndexes.push ( oIndexReferenceObject );
								}
							}
						}

						return aGateIndexes;

					},

					/**
					 * Handles the selection of gates in the edit gate Map
					 * @param oFenceData
					 * @param oSelectedGate
					 * @private
					 */
					fnHandleGeofenceGateSelectionMode : function ( oTempGeofence ) {

						var aGateIndexes = [];
						var oIndexReferenceObject = {};
						var i;
						var j;
						oSapSplMapsDataMarshal.fnShowFences ( oTempGeofence, this.byId ( "oSapSplLiveAppMap" ), "onFocus" );
						if ( oTempGeofence["GeofenceGates"] !== undefined && oTempGeofence["GeofenceGates"] !== null ) {
							for ( i = 0 ; i < oTempGeofence["GeofenceGates"]["results"].length ; i++ ) {
								oSapSplMapsDataMarshal.fnShowGates ( oTempGeofence["GeofenceGates"]["results"][i], this.byId ( "oSapSplLiveAppMap" ) );
							}
						}
						var aFenceEdges = oSapSplMapsDataMarshal.getEdgesFromGeofence ( oTempGeofence, this.byId ( "oSapSplLiveAppMap" ) );

						// Maps the existing gates with the selected gate index.
						for ( i = 0 ; i < aFenceEdges.length ; i++ ) {
							for ( j = 0 ; j < oTempGeofence["GeofenceGates"]["results"].length ; j++ ) {
								var isMatchedStatus = this.fnCompareLineStrings ( aFenceEdges[i], oTempGeofence["GeofenceGates"]["results"][j] );
								if ( isMatchedStatus ) {
									oIndexReferenceObject["index"] = i;
									oIndexReferenceObject["resultsIndex"] = j;
									aGateIndexes.push ( oIndexReferenceObject );
								}
							}
						}

						// Shows all the temp gates
						for ( i = 0 ; i < aFenceEdges.length ; i++ ) {
							oSapSplMapsDataMarshal.fnShowGates ( aFenceEdges[i], this.byId ( "oSapSplLiveAppMap" ), "tempGate" );
						}

					},

					/**
					 * Handles the click of Geofence Gate
					 * @param oEvent
					 * @returns void
					 * @since 1.0
					 * @private
					 */
					fnHandleGeofenceGateClick : function ( oEvent ) {

						var oEventData = JSON.parse ( oEvent.getParameter ( "data" ) );

						// ID of the Geofence.

						// Gets the index of the edge.
						var iGeofenceGateIndex = parseInt ( oEventData.Action.instance.split ( "." )[2], 10 );

						var oModelData = sap.ui.getCore ( ).getModel ( "sapSplLocationCreateEditDialogModel" ).getData ( );

						var sGeofenceCoordinates = oSapSplMapsDataMarshal.convertGeoJSONToString ( JSON.parse ( oModelData["Geometry"] ) );
						var aGeofenceCoordinateArray = sGeofenceCoordinates.split ( ";0.0;" );
						aGeofenceCoordinateArray.push ( aGeofenceCoordinateArray[0] );

						var sStartCoordinate = aGeofenceCoordinateArray[iGeofenceGateIndex];
						var sEndCoordinate = aGeofenceCoordinateArray[iGeofenceGateIndex + 1];
						var fStartCoordinateLon = parseFloat ( sStartCoordinate.split ( ";" )[0], 10 );
						var fStartCoordinateLat = parseFloat ( sStartCoordinate.split ( ";" )[1], 10 );
						var fEndCoordinateLon = parseFloat ( sEndCoordinate.split ( ";" )[0], 10 );
						var fEndCoordinateLat = parseFloat ( sEndCoordinate.split ( ";" )[1], 10 );

						// Edge coordinate string.
						var sGateCoordinate = fStartCoordinateLon + ";" + fStartCoordinateLat + ";0.0;" + fEndCoordinateLon + ";" + fEndCoordinateLat + ";0.0";

						// Constructs the gate object
						var oFenceGateData = {};
						oFenceGateData["Name"] = "";
						oFenceGateData["GateGeometry"] = JSON.stringify ( oSapSplMapsDataMarshal.convertStringToGeoJSON ( sGateCoordinate ) );
						oFenceGateData["GateUUID"] = oEventData.Action.instance.split ( "." )[1] + "." + oEventData.Action.instance.split ( "." )[2];

						this.fnHandleGeofenceGateSelectionMode ( oModelData );

						// Highlights the selected gate.
						oSapSplMapsDataMarshal.fnShowGates ( oFenceGateData, this.byId ( "oSapSplLiveAppMap" ), "tempGate", "selected" );

						// this is the coordinates of clicked gate in gate
						// selection mode.
						if ( this.oSapSplLocationCreateEditDialogInstance ) {
							this.oSapSplLocationCreateEditDialogInstance.getContent ( )[0].getContent ( )[0].getController ( ).handleClickOfGateOnTheMap ( oFenceGateData["GateGeometry"] );
						}

					},

					/**
					 * Handles the click on Truck.
					 * @param oEvent
					 * @returns void
					 * @since 1.0
					 * @private
					 */
					fnHandleTruckFlagClick : function ( oEvent ) {
						var that = this;
						var aSelectedTrucks = [];
						var oTruckData = {};

						if ( oEvent["fromLabel"] === true ) {
							if ( this.isSelectMultipleTrucksEnabled ) {

								if ( oSapSplUtils.getFromQueryParameterMap ( "xx-sap-spl-fallback" ) === "true" ) {
									this.getTruckDetailsFromDeviceUUID ( oEvent["DeviceUUID"], function ( aResults ) {
										oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
										oTruckData = aResults.results[0];
									}, function ( ) {
										jQuery.sap.log.error ( "fnHandleTruckFlagClick", "Failure of function call", "liveApp.controller.js" );
									} );
								} else {
									this.getTruckDetailsFromDeviceUUIDProxy.read ( this, oEvent["DeviceUUID"], function ( aResults ) {
										oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
										oTruckData = aResults.results[0];
									}, function ( error ) {
									/* TODO */
									} );
								}

								oSapSplMapsDataMarshal.fnSelectDeselectTrucks ( oTruckData, this.byId ( "oSapSplLiveAppMap" ), function ( aResults ) {
									aSelectedTrucks.length = 0;
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
									that.oSendMessageDialogView.getController ( ).fnHandleClickOfTrucksOnTheMap ( aSelectedTrucks );
								} );

							} else {

								if ( oSapSplUtils.getFromQueryParameterMap ( "xx-sap-spl-fallback" ) === "true" ) {
									this.getTruckDetailsFromDeviceUUID ( oEvent["DeviceUUID"], function ( aResults ) {
										oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
										oTruckData = aResults.results[0];
									}, function ( error ) {
										jQuery.sap.log.error ( "fnHandleTruckFlagClick", "Failure of function call", "liveApp.controller.js" );
									} );
									this.getTruckDetailsFromDeviceUUID ( oEvent["DeviceUUID"], function ( aResults ) {
										oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
										var coordinateString = oSapSplMapsDataMarshal.convertGeoJSONToString ( JSON.parse ( aResults.results[0]["Position"] ) );

										// Converts the coordinate string to x an y
										// coordinate of
										// the screen.
										var oCords = oSapSplMapsDataMarshal.convertGeoCoordToScreenCoord ( coordinateString, that.byId ( "oSapSplLiveAppMap" ) );
										var oPopoverOffset = that.fnGetPopoverOffsets ( "fromMap" );
										aResults.results[0].x = parseInt ( oCords["left"] + oPopoverOffset["x"], 10 );
										aResults.results[0].y = parseInt ( oCords["top"] + oPopoverOffset["y"], 10 );
										aResults.results[0].fromLabel = true;
										this.showTruckDetailsPopover ( aResults.results[0] );
									}, function ( ) {
										jQuery.sap.log.error ( "fnHandleTruckFlagClick", "Failure of function call", "liveApp.controller.js" );
									} );
								} else {
									this.getTruckDetailsFromDeviceUUIDProxy.read ( this, oEvent["DeviceUUID"], function ( aResults ) {
										oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
										oTruckData = aResults.results[0];
									}, function ( error ) {
									/* TODO */
									} );

									this.getTruckDetailsFromDeviceUUIDProxy.read ( this, oEvent["DeviceUUID"], function ( aResults ) {
										oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
										var coordinateString = oSapSplMapsDataMarshal.convertGeoJSONToString ( JSON.parse ( aResults.results[0]["Position"] ) );

										// Converts the coordinate string to x an y
										// coordinate of
										// the screen.
										var oCords = oSapSplMapsDataMarshal.convertGeoCoordToScreenCoord ( coordinateString, that.byId ( "oSapSplLiveAppMap" ) );
										var oPopoverOffset = that.fnGetPopoverOffsets ( "fromMap" );
										aResults.results[0].x = parseInt ( oCords["left"] + oPopoverOffset["x"], 10 );
										aResults.results[0].y = parseInt ( oCords["top"] + oPopoverOffset["y"], 10 );
										aResults.results[0].fromLabel = true;
										this.showTruckDetailsPopover ( aResults.results[0] );
									}, function ( ) {
										jQuery.sap.log.error ( "fnHandleTruckFlagClick", "Failure of function call", "liveApp.controller.js" );
									} );
								}

							}
						} else {
							if ( this.isSelectMultipleTrucksEnabled ) {
								aSelectedTrucks = [];
								oTruckData = {};

								if ( oSapSplUtils.getFromQueryParameterMap ( "xx-sap-spl-fallback" ) === "true" ) {
									this.getTruckDetailsFromDeviceUUID ( JSON.parse ( oEvent.getParameter ( "data" ) ).Action.instance.split ( "." )[1], function ( aResults ) {
										oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
										oTruckData = aResults.results[0];
									}, function ( ) {
										jQuery.sap.log.error ( "fnHandleTruckFlagClick", "Failure of function call", "liveApp.controller.js" );
									} );
								} else {
									this.getTruckDetailsFromDeviceUUIDProxy.read ( this, JSON.parse ( oEvent.getParameter ( "data" ) ).Action.instance.split ( "." )[1], function ( aResults ) {
										oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
										oTruckData = aResults.results[0];
									}, function ( ) {
										jQuery.sap.log.error ( "fnHandleTruckFlagClick", "Failure of function call", "liveApp.controller.js" );
									} );
								}

								oSapSplMapsDataMarshal.fnSelectDeselectTrucks ( oTruckData, this.byId ( "oSapSplLiveAppMap" ), function ( aResults ) {
									aSelectedTrucks.length = 0;
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
									that.oSendMessageDialogView.getController ( ).fnHandleClickOfTrucksOnTheMap ( aSelectedTrucks );
								} );

							} else {
								this.showTruckDetailsPopover ( oEvent );
							}
						}
					},

					/**
					 * Handles the click on Geofence.
					 * @param oEvent
					 * @returns void
					 * @since 1.0
					 * @private
					 */
					fnHandleGeofenceAreaClick : function ( oEvent ) {

						if ( this.isSelectMultipleGeofencesEnabled ) {
							/* Fix For Incident : 1570316630 */
							this.getLocationDetailsFromLocationID ( JSON.parse ( oEvent.getParameter ( "data" ) ).Action.instance.split ( "." )[1], "LC0004", function ( aResults ) {
								this.handleSelectDeselectFence ( aResults.results[0] );
							}, function ( ) {
								jQuery.sap.log.error ( "fnHandleGeofenceAreaClick", "Failure of function call", "liveApp.controller.js" );
							}, false );

						} else {
							this.fnHandleLocationDetailsDisplay ( oEvent );
						}
					},

					fnHandleNavigationToManageToursApp : function ( sVehicleRegNumber ) {
						var sNavTo = "splView.managetours.ManageToursContainer";
						var oNavToPageView = null;
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
						oNavData["FromApp"] = "liveApp";
						oNavData["VehicleUUID"] = sVehicleRegNumber;
						oSplBaseApplication.getAppInstance ( ).to ( sNavTo, "slide", oNavData );
					},

					fnHandleNavigationToReportingApp : function ( ) {
						var sNavTo = "splView.reporting.ReportingSpl";
						var oNavToPageView = null;
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

						var oNavData = sap.ui.getCore ( ).getModel ( "splViewEditLocationModel" ).getData ( );
						oNavData["fromApp"] = "liveApp";
						oSplBaseApplication.getAppInstance ( ).to ( sNavTo, "slide", oNavData );
					},

					fnHandleFetchOfIncidentsAssigned : function ( oEvent ) {
						var oLocationData = oEvent.getSource ( ).getModel ( ).getData ( );
						if ( oLocationData.bFetchedIncidents !== true ) {
							sap.ui.core.Fragment.byId ( "locationFragment", "sapSplIncidentsAssignedToTheLocationPanel" ).setBusy ( true );
							this.getLocationDetailsFromLocationID ( oLocationData.LocationID, oLocationData.Tag, function ( aData ) {
								sap.ui.core.Fragment.byId ( "locationFragment", "sapSplIncidentsAssignedToTheLocationPanel" ).setBusy ( false );
								var oData = this.getSource ( ).getModel ( ).getData ( );
								oData.bFetchedIncidents = true;
								oData["Incidents"] = aData;
								this.getSource ( ).getModel ( ).setData ( oData );
							}.bind ( jQuery.extend ( true, {}, oEvent ) ), function ( ) {
								jQuery.sap.log.error ( "fnHandleLocationDetailsDisplay", "Failure of function call", "liveApp.controller.js" );
							}, false, "Incidents", true );
						}
					},

					fnHandleFetchOfGatesAssigned : function ( oEvent ) {
						var oLocationData = oEvent.getSource ( ).getModel ( ).getData ( );
						if ( oLocationData.bFetchedgates !== true ) {
							sap.ui.core.Fragment.byId ( "locationFragment", "sapSplLocationGatesPanel" ).setBusy ( true );
							this.getLocationDetailsFromLocationID ( oLocationData.LocationID, oLocationData.Tag, function ( aData ) {
								sap.ui.core.Fragment.byId ( "locationFragment", "sapSplLocationGatesPanel" ).setBusy ( false );
								var oData = this.getSource ( ).getModel ( ).getData ( );
								oData.bFetchedgates = true;
								oData["GeofenceGates"] = aData;
								this.getSource ( ).getModel ( ).setData ( oData );
							}.bind ( jQuery.extend ( true, {}, oEvent ) ), function ( ) {
								jQuery.sap.log.error ( "fnHandleLocationDetailsDisplay", "Failure of function call", "liveApp.controller.js" );
							}, false, "GeofenceGates", true );
						}
					},

					fnHandleFetchOfItemsToTour : function ( oEvent ) {
						var oTruckData = oEvent.getSource ( ).getModel ( ).getData ( );
						if ( oTruckData.bFetchedItems !== true ) {
							sap.ui.core.Fragment.byId ( "viewTruckDetailsFragment", "sapSplTruckDetailWindowTourItemsPanel" ).setBusy ( true );
							this.getLocationDetailsFromLocationID ( oTruckData.UUID, "Truck", function ( aData ) {
								sap.ui.core.Fragment.byId ( "viewTruckDetailsFragment", "sapSplTruckDetailWindowTourItemsPanel" ).setBusy ( false );
								var oData = this.getSource ( ).getModel ( ).getData ( );
								oData.bFetchedItems = true;
								oData["Items"] = aData.results;
								this.getSource ( ).getModel ( ).setData ( oData );
							}.bind ( jQuery.extend ( true, {}, oEvent ) ), function ( ) {
								jQuery.sap.log.error ( "fnHandleLocationDetailsDisplay", "Failure of function call", "liveApp.controller.js" );
							}, false, "StopItemAssignment", true, "VehiclePositions" );
						}
					},

					fnHandleNavigationIntoItemDetails : function ( oEvent ) {
						var oNavContainer = sap.ui.core.Fragment.byId ( "viewTruckDetailsFragment", "sapSplTruckDetailsNavContainer" ), oModel = null, oData = null;
						oNavContainer.to ( oNavContainer.getPages ( )[1].sId );
						oModel = oEvent.getSource ( ).getModel ( );
						oData = oModel.getData ( );
						oData["stopItemDetails"] = oEvent.getSource ( ).getBindingContext ( ).getObject ( );
						oModel.setData ( oData );
					},

					fnHandleBackNavigationFromTruckItemsPage : function ( oEvent ) {
						sap.ui.core.Fragment.byId ( "viewTruckDetailsFragment", "sapSplTruckDetailsNavContainer" ).back ( );
					},

					/**
					 * @description temp handler to launch the popover
					 * @param {string} x as an offset to render the popover
					 * @param {string} y as an offset to render the popover
					 * @since 1.0
					 * @private
					 */
					fnHandleDisplayOflocations : function ( oLocationData ) {

						if ( this.oPopOver ) {
							this.oPopOver.destroy ( );
						}

						var that = this;

						// Instantiates the location fragment to show the
						// location details
						// except parking.
						this.oPopOver = sap.ui.xmlfragment ( "locationFragment", "splReusable.fragments.ViewEditLocation", this ).addStyleClass ( "locationFragmentClass" );
						var oLocalModel = new sap.ui.model.json.JSONModel ( oLocationData );
						oLocationData["GeofenceGates"] = {
							results : []
						};
						oLocationData["Incidents"] = {
							results : []
						};
						sap.ui.getCore ( ).setModel ( oLocalModel, "splViewEditLocationModel" );
						this.oPopOver.setModel ( sap.ui.getCore ( ).getModel ( "splViewEditLocationModel" ) );

// sap.ui.core.Fragment.byId("locationFragment",
// "sapSplIncidentsAssignedToTheLocationLabel").setText(oSapSplUtils.getBundle().getText("LOCATION_INCIDENTS_ASSIGNED_LABEL"));
// sap.ui.core.Fragment.byId("locationFragment",
// "sapSplLocationIncidentsAssignedViewAllLink").setText(oSapSplUtils.getBundle().getText("VIEW_ALL"));
// sap.ui.core.Fragment.byId("locationFragment",
// "sapSplLocationGatesLabel").setText(oSapSplUtils.getBundle().getText("LOCATION_GATES_FIELD"));
						sap.ui.core.Fragment.byId ( "locationFragment", "splLocationCreatedOn" ).setText ( oSapSplUtils.getBundle ( ).getText ( "LOCATION_CREATED_ON_LABEL" ) );
						sap.ui.core.Fragment.byId ( "locationFragment", "splLocationGeoCoords" ).setText ( oSapSplUtils.getBundle ( ).getText ( "LOCATION_GEO_COORDINATES_LABEL" ) );
						// CSN FIX : 0120061532 0001483173 2014
						sap.ui.core.Fragment.byId ( "locationFragment", "splLocationAddressLabel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "ADDRESS_LABEL" ) );
						sap.ui.core.Fragment.byId ( "locationFragment", "splBtnEdit" ).setText ( oSapSplUtils.getBundle ( ).getText ( "MY_COLLEAGUES_EDIT_BUTTON" ) );
						sap.ui.core.Fragment.byId ( "locationFragment", "splBtnDelete" ).setText ( oSapSplUtils.getBundle ( ).getText ( "INCIDENTS_FOOTER_DELETE" ) );

						/* CSNFIX : 0120061532 1493269 2014 */

						if ( oLocationData["isEditable"] === 0 ) {
							sap.ui.core.Fragment.byId ( "locationFragment", "splBtnEdit" ).setEnabled ( false );
							sap.ui.core.Fragment.byId ( "locationFragment", "splBtnDelete" ).setEnabled ( false );
						} else {
							sap.ui.core.Fragment.byId ( "locationFragment", "splBtnEdit" ).setEnabled ( true );
							sap.ui.core.Fragment.byId ( "locationFragment", "splBtnDelete" ).setEnabled ( true );
						}

						/*
						 * Incident : 1482012334 - Removing incidentAssigned
						 * Section for all roles other than Hub, as incidents
						 * cannot be seen by other roles.
						 */
						if ( sap.ui.getCore ( ).getModel ( "sapSplAppConfigDataModel" ).getData ( )["isIncidentEditable"] === 0 ) {
							sap.ui.core.Fragment.byId ( "locationFragment", "sapSplIncidentsAssignedToTheLocationPanel" ).setVisible ( false );
						} else {
							/*
							 * Bug fix 1580182498 : Only Geofences ( Radar and
							 * normal ) should be displaying Incidents Assigned
							 * Panel
							 */
							if ( splReusable.libs.SapSplModelFormatters.getVisibilityBasedOnType ( oLocationData["Type"] ) ) {
								sap.ui.core.Fragment.byId ( "locationFragment", "sapSplIncidentsAssignedToTheLocationPanel" ).setVisible ( true );
							} else {
								sap.ui.core.Fragment.byId ( "locationFragment", "sapSplIncidentsAssignedToTheLocationPanel" ).setVisible ( false );
							}
						}

						// Destroys the popover once it is closed.
						this.oPopOver.attachAfterClose ( function ( oEvent ) {
							oEvent.getSource ( ).destroy ( );
							if ( oLocationData["Tag"] === "LC0001" ) {
								oSapSplMapsDataMarshal.fnShowPointOfInterestFlags ( oLocationData, that.byId ( "oSapSplLiveAppMap" ) );
							}
						} );

						this.oPopOver.attachAfterOpen ( function ( ) {
							if ( oLocationData["introduceFooterZoomInButton"] === true ) {
								sap.ui.getCore ( ).byId ( jQuery ( "#" + this.sId + "-popover footer" ).attr ( "id" ) ).insertContent ( new sap.m.ToolbarSpacer ( ), 0 ).insertContent ( new sap.m.Button ( {
									text : oSapSplUtils.getBundle ( ).getText ( "ZOOM_IN_CLUSTER" ),
									press : function ( oEvent ) {
										oLocationData["zoomInButtonHandler"] ( oLocationData, oEvent.getSource ( ).getParent ( ).getParent ( ).getParent ( ), "Geometry" );
									}
								}, 0 ) );
							}

							/*
							 * Fix for incident 1580172782 for popOver not
							 * getting closed
							 */if ( oLocationData["isEditable"] === 0 ) {
								this.focus ( );
							}
						} );

						/* CSNFIX : 1570035339 */
						setTimeout ( function ( ) {
							that.oPopOver.openBy ( that.byId ( "oPopoverAnchorButton" ) );
						}, 500 );

					},

					/**
					 * Handles the click on navigate to view tracking status link
					 *  - in geofence detail screen for a radar geofence.
					 * @param oEvent
					 * @returns void
					 * @since 1.0
					 * @private
					 */
					fnHandlePressOfViewTrackingStatusLink : function ( oEvent ) {
						var oNavContainer = sap.ui.core.Fragment.byId ( "locationFragment", "sapSplLocationDetailsNavContainer" ), oModel = null;
						oNavContainer.to ( oNavContainer.getPages ( )[1].sId );
						oModel = oEvent.getSource ( ).getModel ( );
						sap.ui.core.Fragment.byId ( "locationFragment", "sapSplTrackingStatusTable" ).setBusy ( true );
						this.getLocationDetailsFromLocationID ( oModel.getData ( )["LocationID"], oModel.getData ( )["Tag"], function ( aResults ) {
							sap.ui.core.Fragment.byId ( "locationFragment", "sapSplTrackingStatusTable" ).setBusy ( false );
							var oModelData = oModel.getData ( );
							oModelData["status"] = aResults.results;
							oModel.setData ( oModelData );
						}, function ( oError ) {
							jQuery.sap.log.error ( "fnHandleLocationDetailsDisplay", "Failure of function call", "liveApp.controller.js" );
						}, false, "StatusOfRadars", true );
					},

					/**
					 * Handles the click on back navigation button from the tracking page
					 * - in geofence detail screen for a radar geofence.
					 * @param oEvent
					 * @returns void
					 * @since 1.0
					 * @private
					 */
					fnHandleBackNavigationFromTrackingPage : function ( ) {
						sap.ui.core.Fragment.byId ( "locationFragment", "sapSplLocationDetailsNavContainer" ).back ( );
					},

					fnHandleChangeOfContainerTerminalStatus : function ( ) {
// if (oContainerTerminalData["ReportedStatus"] === "4") {
// sap.ui.core.Fragment.byId("parkingSpaceDetailsFragment",
// "sapSplContainerAvailabilityLabel").addStyleClass("containerAvailable");
// sap.ui.core.Fragment.byId("parkingSpaceDetailsFragment",
// "sapSplContainerAvailabilityLabel").setText(
// oSapSplUtils.getBundle().getText("AVAILABLE") );
// } else if (oContainerTerminalData["ReportedStatus"] === "5" ||
// oContainerTerminalData["ReportedStatus"] === null) {
// sap.ui.core.Fragment.byId("parkingSpaceDetailsFragment",
// "sapSplContainerAvailabilityLabel").addStyleClass("containerStatusNotAvailable");
// sap.ui.core.Fragment.byId("parkingSpaceDetailsFragment",
// "sapSplContainerAvailabilityLabel").setText(
// oSapSplUtils.getBundle().getText("UNAVAILABLE") );
// } else {
// sap.ui.core.Fragment.byId("parkingSpaceDetailsFragment",
// "sapSplContainerAvailabilityLabel").addStyleClass("containerFull");
// sap.ui.core.Fragment.byId("parkingSpaceDetailsFragment",
// "sapSplContainerAvailabilityLabel").setText(
// oSapSplUtils.getBundle().getText("FULL") );
// }
					},

					/**
					 * function to handle the status change of a parking space, makes an ajax call to change the status as and when the selection of status changes.
					 * @param oEvent
					 * @returns void
					 * @since 1.0
					 * @private
					 */
					fnHandleChangeOfParkingSpaceStatus : function ( oEvent ) {

						var that = this;
						var sKey = oEvent.getParameters ( ).selectedItem.getKey ( );
						var oEventSource = oEvent.getSource ( );
						var oPayLoad = {
							"FacilityAvailability" : [{
								"FacilityUUID" : sap.ui.getCore ( ).getModel ( "splParkingSpaceDetailsPopOverModel" ).getData ( )["FacilityUUID"], // UUID
								// of
								// the
								// Facility
								// from
								// the
								// Facility
								// table
								// that
								// has
								// FacilityCategory
								// as P
								"ReportedStatus" : sKey, // Status Value from
								// the UI : 1 –
								// Available, 2 – Filling up Fast, 3
								// – Full
								"ModeOfStatusUpdate" : sap.ui.getCore ( ).getModel ( "splParkingSpaceDetailsPopOverModel" ).getData ( )["ModeOfStatusUpdate"],
								"StatusProvider" : sap.ui.getCore ( ).getModel ( "splParkingSpaceDetailsPopOverModel" ).getData ( )["StatusProvider"]
							}]
						};

						oSapSplAjaxFactory.fireAjaxCall ( {
							url : oSapSplUtils.getServiceMetadata ( "parkingSpaceStatus", true ),
							method : "PUT",
							data : JSON.stringify ( oPayLoad ),
							success : function ( ) {
								oEventSource.removeStyleClass ( "parkingAvailable" );
								oEventSource.removeStyleClass ( "parkingFastFilling" );
								oEventSource.removeStyleClass ( "parkingFull" );
								oEventSource.removeStyleClass ( "containerTerminalServiceNotPossible" );
								oEventSource.removeStyleClass ( "containerTerminalServiceWithDelay" );
								oEventSource.removeStyleClass ( "containerTerminalServicing" );
								oEventSource.removeStyleClass ( "containerTerminalOutsideWorkHours" );

								var tempObject = {};
								var oModelData = sap.ui.getCore ( ).getModel ( "splParkingSpaceDetailsPopOverModel" ).getData ( );
								tempObject = jQuery.extend ( {}, oModelData );
								tempObject["Geometry"] = JSON.stringify ( oSapSplMapsDataMarshal.convertStringToGeoJSON ( oModelData["Geometry"] ) );
								tempObject["ReportedStatus"] = sKey;

								oSapSplMapsDataMarshal.fnShowPointOfInterestFlags ( tempObject, that.byId ( "oSapSplLiveAppMap" ) );
								if ( sKey === "1" ) {
									oEventSource.addStyleClass ( "parkingAvailable" );
								} else if ( sKey === "2" ) {
									oEventSource.addStyleClass ( "parkingFastFilling" );
								} else if ( sKey === "3" ) {
									oEventSource.addStyleClass ( "parkingFull" );
								} else if ( sKey === "4" ) {
									oEventSource.addStyleClass ( "containerTerminalServiceNotPossible" );
								} else if ( sKey === "5" ) {
									oEventSource.addStyleClass ( "containerTerminalServiceWithDelay" );
								} else if ( sKey === "6" ) {
									oEventSource.addStyleClass ( "containerTerminalServicing" );
								} else if ( sKey === "7" ) {
									oEventSource.addStyleClass ( "containerTerminalOutsideWorkHours" );
								}

								for ( var i = 0 ; i < that.aSelectedLocationObjectsFromLeftPanel.length ; i++ ) {
									if ( that.aSelectedLocationObjectsFromLeftPanel[i]["LocationID"] === oModelData["LocationID"] ) {
										that.aSelectedLocationObjectsFromLeftPanel[i]["ReportedStatus"] = sKey;
										break;
									}
								}

							},
							error : function ( ) {
								jQuery.sap.log.error ( "fnHandleChangeOfParkingSpaceStatus", "Failure of function call", "liveApp.controller.js" );
							}
						} );
					},

					/**
					 * This function makes a service call to get the parking space enum.
					 * @param void
					 * @returns {Array}
					 * @since 1.0
					 * @private
					 */
					getParkingSpaceStatusEnum : function ( ) {

						var aParkingSpaceStatusEnum = [];
						oSapSplAjaxFactory.fireAjaxCall ( {
							url : oSapSplUtils.getFQServiceUrl ( "/sap/spl/xs/utils/services/utils.xsodata/" ) + "Enumeration('FacilityAvailabilityStatus')/Values?$format=json",
							method : "GET",
							async : false,
							json : true,
							success : function ( data ) {
								aParkingSpaceStatusEnum = data.d.results;
							},
							error : function ( ) {

							}
						} );

						return aParkingSpaceStatusEnum;
					},

					/**
					 * This function makes a service call to get the container terminla enum.
					 * @param void
					 * @returns {Array}
					 * @since 1.0
					 * @private
					 */
					getContainerTerminalStatusEnum : function ( mode ) {

						var aContainerTerminalStatusEnum = [], sUrl;
						if ( mode === "M" ) {
							sUrl = oSapSplUtils.getFQServiceUrl ( "/sap/spl/xs/utils/services/utils.xsodata/" ) + "Enumeration('ContainerTerminalAvailabilityStatus')/Values?$format=json&$filter=(Value ne '8')";
						} else {
							sUrl = oSapSplUtils.getFQServiceUrl ( "/sap/spl/xs/utils/services/utils.xsodata/" ) + "Enumeration('ContainerTerminalAvailabilityStatus')/Values?$format=json";
						}
						oSapSplAjaxFactory.fireAjaxCall ( {
							url : sUrl,
							method : "GET",
							async : false,
							json : true,
							success : function ( data ) {
								aContainerTerminalStatusEnum = data.d.results;
							},
							error : function ( ) {

							}
						} );

						return aContainerTerminalStatusEnum;
					},

					/**
					 * This function makes a service call to get the container terminla enum.
					 * @param void
					 * @returns {Array}
					 * @since 1.0
					 * @private
					 */
					getContainerTerminalStatusListEnum : function ( ) {

						var aContainerTerminalStatusListEnum = [];
						oSapSplAjaxFactory.fireAjaxCall ( {
							url : oSapSplUtils.getFQServiceUrl ( "/sap/spl/xs/utils/services/utils.xsodata/" ) + "Enumeration('ModeOfStatusUpdate')/Values?$format=json",
							method : "GET",
							async : false,
							json : true,
							success : function ( data ) {
								aContainerTerminalStatusListEnum = data.d.results;
							},
							error : function ( ) {

							}
						} );

						return aContainerTerminalStatusListEnum;
					},

					/**
					 * Handles the popover that displays the details of a Parking space
					 * @param oParkingSpaceData
					 * @returns void
					 * @since 1.0
					 * @private
					 */
					parkingSpaceDisplayHandler : function ( oParkingSpaceData ) {

						splReusable.libs.SapSplStyleSheetLoader.loadStyle ( "./resources/styles/sapSplParkingSpaceDetailsPopOver" );

						var that = this;

						if ( !this.aParkingSpaceStatusEnum ) {
							this.aParkingSpaceStatusEnum = this.getParkingSpaceStatusEnum ( );
						}

						/* CSNFIX : 0120061532 1480541 2014 */

						if ( oParkingSpaceData["ImageUrl"] === "" ) {
							oParkingSpaceData["ImageUrl"] = "./resources/icons/parking_default_image_placeholder.png";
							oParkingSpaceData["bDefaultImage"] = true;
						}
						oParkingSpaceData["Geometry"] = oSapSplMapsDataMarshal.convertGeoJSONToString ( JSON.parse ( oParkingSpaceData["Geometry"] ) );
						oParkingSpaceData["texts"] = {
							cards_text : oSapSplUtils.getBundle ( ).getText ( "CARDS_PARKING_SPACE_LABEL" ),
							services_text : oSapSplUtils.getBundle ( ).getText ( "SERVICES_PARKING_SPACE_LABEL" ),
							fuel_text : oSapSplUtils.getBundle ( ).getText ( "FUEL_PARKING_SPACE_LABEL" ),
							address : oSapSplUtils.getBundle ( ).getText ( "ADDRESS_LABEL" ),
							phone : oSapSplUtils.getBundle ( ).getText ( "TELEPHONE" ),
							website : oSapSplUtils.getBundle ( ).getText ( "WEBSITE_PARKING_SPACE_LABEL" ),
							total_space : oSapSplUtils.getBundle ( ).getText ( "TOTAL_SPACES_PARKING_SPACE_LABEL" ),
							availability : oSapSplUtils.getBundle ( ).getText ( "PARKING_AVAILABILITY_STATUS" ),
							timings : oSapSplUtils.getBundle ( ).getText ( "TIMINGS_PARKING_SPACE_LABEL" )

						};
						oParkingSpaceData["ParkingSpaceStatusData"] = this.aParkingSpaceStatusEnum;
						if ( !sap.ui.getCore ( ).getModel ( "splParkingSpaceDetailsPopOverModel" ) ) {
							sap.ui.getCore ( ).setModel ( new sap.ui.model.json.JSONModel ( oParkingSpaceData ), "splParkingSpaceDetailsPopOverModel" );
						} else {
							sap.ui.getCore ( ).getModel ( "splParkingSpaceDetailsPopOverModel" ).setData ( oParkingSpaceData );
						}

						if ( this.oPopOver ) {
							this.oPopOver.destroy ( );
						}

						this.oPopOver = sap.ui.xmlfragment ( "parkingSpaceDetailsFragment", "splReusable.fragments.ParkingSpaceDetails", this );
						this.oPopOver.setModel ( sap.ui.getCore ( ).getModel ( "splParkingSpaceDetailsPopOverModel" ) );

						sap.ui.core.Fragment.byId ( "parkingSpaceDetailsFragment", "sapSplPointOfInterestOccupancyLayout" ).setWidths ( ["70px"] );

						if ( oParkingSpaceData["introduceFooterZoomInButton"] === true ) {
							this.oPopOver.getContent ( )[0].getFooter ( ).addContentLeft ( new sap.m.Button ( {
								text : oSapSplUtils.getBundle ( ).getText ( "ZOOM_IN_CLUSTER" ),
								press : function ( oEvent ) {
									oParkingSpaceData["zoomInButtonHandler"] ( oParkingSpaceData, oEvent.getSource ( ).getParent ( ).getParent ( ).getParent ( ), "Geometry" );
								}
							} ) );
						}

						if ( oParkingSpaceData["isEditable"] === 0 ) {
							sap.ui.core.Fragment.byId ( "parkingSpaceDetailsFragment", "splBtnEdit" ).setEnabled ( false );
							sap.ui.core.Fragment.byId ( "parkingSpaceDetailsFragment", "splBtnDelete" ).setEnabled ( false );
							sap.ui.core.Fragment.byId ( "parkingSpaceDetailsFragment", "sapSplParkingSpaceStatusSelect" ).setEnabled ( false );
						}
						sap.ui.core.Fragment.byId ( "parkingSpaceDetailsFragment", "sapSplOccupancyContainerTerminal" ).setVisible ( false );
						sap.ui.core.Fragment.byId ( "parkingSpaceDetailsFragment", "sapSplParkingSpaceStatusSelect" ).addEventDelegate ( {
							onAfterRendering : function ( oEvent ) {

								oEvent.srcControl.removeStyleClass ( "parkingAvailable" );
								oEvent.srcControl.removeStyleClass ( "parkingFastFilling" );
								oEvent.srcControl.removeStyleClass ( "parkingFull" );

								var sKey = oEvent.srcControl.getSelectedKey ( );
								if ( sKey === "1" ) {
									oEvent.srcControl.addStyleClass ( "parkingAvailable" );
								} else if ( sKey === "2" ) {
									oEvent.srcControl.addStyleClass ( "parkingFastFilling" );
								} else {
									oEvent.srcControl.addStyleClass ( "parkingFull" );
								}

							}
						} );
						this.oPopOver.attachAfterClose ( function ( oEvent ) {
							oEvent.getSource ( ).destroy ( );
							oParkingSpaceData["Geometry"] = JSON.stringify ( oSapSplMapsDataMarshal.convertStringToGeoJSON ( oParkingSpaceData["Geometry"] ) );
							oSapSplMapsDataMarshal.fnShowPointOfInterestFlags ( oParkingSpaceData, that.byId ( "oSapSplLiveAppMap" ) );
						} );

						/* CSNFIX : 1570035339 */
						setTimeout ( function ( ) {
							that.oPopOver.openBy ( that.byId ( "oPopoverAnchorButton" ) );
						}, 500 );

					},

					/**
					 * Handles the popover that displays the details of a Container trminal
					 * @param oParkingSpaceData
					 * @returns void
					 * @since 1.0
					 * @private
					 */
					fnContainerTerminalDisplayHandler : function ( oContainerTerminalData ) {

						splReusable.libs.SapSplStyleSheetLoader.loadStyle ( "./resources/styles/sapSplParkingSpaceDetailsPopOver" );

						var that = this;

						if ( oContainerTerminalData.ModeOfStatusUpdate === "A" ) {
							if ( !this.aContainerTerminalStatusAutomaticEnum ) {
								this.aContainerTerminalStatusAutomaticEnum = this.getContainerTerminalStatusEnum ( oContainerTerminalData.ModeOfStatusUpdate );
							}
							this.aContainerTerminalStatusEnum = this.aContainerTerminalStatusAutomaticEnum;
						} else {
							if ( !this.aContainerTerminalStatusManualEnum ) {
								this.aContainerTerminalStatusManualEnum = this.getContainerTerminalStatusEnum ( oContainerTerminalData.ModeOfStatusUpdate );
							}
							this.aContainerTerminalStatusEnum = this.aContainerTerminalStatusManualEnum;
						}

						if ( !this.aContainerTerminalStatusListEnum ) {
							this.aContainerTerminalStatusListEnum = this.getContainerTerminalStatusListEnum ( );
						}

						if ( oContainerTerminalData["ImageUrl"] === "" ) {
							oContainerTerminalData["bDefaultImage"] = true;
							if ( oContainerTerminalData["Tag"] === "LC0007" ) {
								oContainerTerminalData["ImageUrl"] = "./resources/icons/container_depot_image_placeholder.png";
							} else {
								oContainerTerminalData["ImageUrl"] = "./resources/icons/container_terminal_image_placeholder.png";
							}
						}
						oContainerTerminalData["Geometry"] = oSapSplMapsDataMarshal.convertGeoJSONToString ( JSON.parse ( oContainerTerminalData["Geometry"] ) );
						oContainerTerminalData["texts"] = {
							cards_text : oSapSplUtils.getBundle ( ).getText ( "CARDS_PARKING_SPACE_LABEL" ),
							services_text : oSapSplUtils.getBundle ( ).getText ( "SERVICES_PARKING_SPACE_LABEL" ),
							fuel_text : oSapSplUtils.getBundle ( ).getText ( "FUEL_PARKING_SPACE_LABEL" ),
							source : oSapSplUtils.getBundle ( ).getText ( "CONTAINER_TERMINAL_DEPOT_SOURCE" ),
							status : oSapSplUtils.getBundle ( ).getText ( "STATUS" ),
							address : oSapSplUtils.getBundle ( ).getText ( "ADDRESS_LABEL" ),
							phone : oSapSplUtils.getBundle ( ).getText ( "TELEPHONE" ),
							website : oSapSplUtils.getBundle ( ).getText ( "WEBSITE_PARKING_SPACE_LABEL" ),
							total_space : oSapSplUtils.getBundle ( ).getText ( "TOTAL_CONTAINER_TERMINAL_CAPACITY" ),
							availability : oSapSplUtils.getBundle ( ).getText ( "CONTAINER_AVAILABILITY_STATUS" ),
							timings : oSapSplUtils.getBundle ( ).getText ( "TIMINGS_PARKING_SPACE_LABEL" )

						};
						oContainerTerminalData["ParkingSpaceStatusData"] = this.aContainerTerminalStatusEnum;
						oContainerTerminalData["ParkingSpaceStatusListData"] = this.aContainerTerminalStatusListEnum;
						if ( !sap.ui.getCore ( ).getModel ( "splParkingSpaceDetailsPopOverModel" ) ) {
							sap.ui.getCore ( ).setModel ( new sap.ui.model.json.JSONModel ( oContainerTerminalData ), "splParkingSpaceDetailsPopOverModel" );
						} else {
							sap.ui.getCore ( ).getModel ( "splParkingSpaceDetailsPopOverModel" ).setData ( oContainerTerminalData );
						}

						if ( this.oPopOver ) {
							this.oPopOver.destroy ( );
						}

						this.oPopOver = sap.ui.xmlfragment ( "parkingSpaceDetailsFragment", "splReusable.fragments.ParkingSpaceDetails", this );
						this.oPopOver.setModel ( sap.ui.getCore ( ).getModel ( "splParkingSpaceDetailsPopOverModel" ) );

						sap.ui.core.Fragment.byId ( "parkingSpaceDetailsFragment", "sapSplPointOfInterestOccupancyLayout" ).setWidths ( ["70px"] );

						if ( oContainerTerminalData["introduceFooterZoomInButton"] === true ) {
							this.oPopOver.getContent ( )[0].getFooter ( ).addContentLeft ( new sap.m.Button ( {
								text : oSapSplUtils.getBundle ( ).getText ( "ZOOM_IN_CLUSTER" ),
								press : function ( oEvent ) {
									oContainerTerminalData["zoomInButtonHandler"] ( oContainerTerminalData, oEvent.getSource ( ).getParent ( ).getParent ( ).getParent ( ), "Geometry" );
								}
							} ) );
						}

						if ( oContainerTerminalData["isEditable"] === 0 ) {
							sap.ui.core.Fragment.byId ( "parkingSpaceDetailsFragment", "splBtnEdit" ).setEnabled ( false );
							sap.ui.core.Fragment.byId ( "parkingSpaceDetailsFragment", "splBtnDelete" ).setEnabled ( false );
						}

						sap.ui.core.Fragment.byId ( "parkingSpaceDetailsFragment", "sapSplOccupancyContainer" ).setVisible ( false );
						/* CSNFIX : 1570126093 */
						sap.ui.core.Fragment.byId ( "parkingSpaceDetailsFragment", "sapSplOccupancyContainerAvailabilityLabel" ).setVisible ( false );
						sap.ui.core.Fragment.byId ( "parkingSpaceDetailsFragment", "sapSplOccupancyContainerAvailabilityText" ).setVisible ( false );

						sap.ui.core.Fragment.byId ( "parkingSpaceDetailsFragment", "sapSplContainerTerminalStatusSelect" ).addEventDelegate ( {
							onAfterRendering : function ( oEvent ) {

								oEvent.srcControl.removeStyleClass ( "containerTerminalServiceNotPossible" );
								oEvent.srcControl.removeStyleClass ( "containerTerminalServiceWithDelay" );
								oEvent.srcControl.removeStyleClass ( "containerTerminalServicing" );
								oEvent.srcControl.removeStyleClass ( "containerTerminalOutsideWorkHours" );

								if ( oEvent.srcControl.getModel ( ).getData ( ).ReportedStatus === null ) {
									oEvent.srcControl.setSelectedKey ( "6" );
								}

								var sKey = oEvent.srcControl.getSelectedKey ( );
								if ( sKey === "4" ) {
									oEvent.srcControl.addStyleClass ( "containerTerminalServiceNotPossible" );
								} else if ( sKey === "5" ) {
									oEvent.srcControl.addStyleClass ( "containerTerminalServiceWithDelay" );
								} else if ( sKey === "6" ) {
									oEvent.srcControl.addStyleClass ( "containerTerminalServicing" );
								} else if ( sKey === "7" ) {
									oEvent.srcControl.addStyleClass ( "containerTerminalOutsideWorkHours" );
								}

							}
						} );

						this.oPopOver.attachAfterClose ( function ( oEvent ) {
							oEvent.getSource ( ).destroy ( );
							oContainerTerminalData["Geometry"] = JSON.stringify ( oSapSplMapsDataMarshal.convertStringToGeoJSON ( oContainerTerminalData["Geometry"] ) );
							oSapSplMapsDataMarshal.fnShowPointOfInterestFlags ( oContainerTerminalData, that.byId ( "oSapSplLiveAppMap" ) );
						} );

						this.oPopOver.attachAfterOpen ( function ( ) {

						} );

						/* CSNFIX : 1570035339 */
						setTimeout ( function ( ) {
							that.oPopOver.openBy ( that.byId ( "oPopoverAnchorButton" ) );
						}, 500 );

					},

					/**
					 * @description Opens the Popover on the Area that is clicked and puts the detail view in it.
					 * @param oEvent
					 * @returns void
					 * @since 1.0
					 * @private
					 */
					fnHandleLocationDetailsDisplay : function ( oEvent ) {

						var oPopoverOffset = null;
						// Click on detail window
						if ( oEvent.sDetailWindowPosition ) {
							var oCords = oSapSplMapsDataMarshal.convertGeoCoordToScreenCoord ( oEvent.sDetailWindowPosition, this.byId ( "oSapSplLiveAppMap" ) );

							var popoverPositionObject = this.getPopoverOpeningDirection ( oCords["left"], oCords["top"] );
							oPopoverOffset = this.fnGetPopoverOffsets ( "fromMap" );
							oEvent.x = parseInt ( popoverPositionObject.x + oPopoverOffset["x"], 10 );
							oEvent.y = parseInt ( popoverPositionObject.y + oPopoverOffset["y"], 10 );
							oEvent.placement = popoverPositionObject.placement;

							if ( this.byId ( "oSapSplLiveAppMap" ).zoom <= 6 ) {
								oSapSplMapsDataMarshal.fnShowPointOfInterestFlags ( oEvent, this.byId ( "oSapSplLiveAppMap" ), "onEnlarge" );
							}

							if ( oEvent["Tag"] === "LC0002" ) {
								this.parkingSpaceDisplayHandler ( oEvent );
							} else if ( oEvent["Tag"] === "LC0003" || oEvent["Tag"] === "LC0007" ) {
								this.fnContainerTerminalDisplayHandler ( oEvent );
							} else {
								this.fnHandleDisplayOflocations ( oEvent );
							}

							// Click on Geofence
						} else {

							var x = 0;
							var y = 0;
							var that = this, sEntity = "POI";
							var sLocationID = JSON.parse ( oEvent.getParameter ( "data" ) ).Action.instance.split ( "." )[1];
							oPopoverOffset = this.fnGetPopoverOffsets ( );
							if ( JSON.parse ( oEvent.getParameter ( "data" ) ).Action.Params.Param[0].name === "x" ) {
								x = parseInt ( JSON.parse ( oEvent.getParameter ( "data" ) ).Action.Params.Param[0]["#"], 10 );
								x += oPopoverOffset["x"];
								x = parseInt ( x, 10 );
							} else {
								jQuery.sap.log.error ( "fnHandleLocationDetailsDisplay", "Failure of function call", "liveApp.controller.js" );
							}
							if ( JSON.parse ( oEvent.getParameter ( "data" ) ).Action.Params.Param[1].name === "y" ) {
								y = parseInt ( JSON.parse ( oEvent.getParameter ( "data" ) ).Action.Params.Param[1]["#"], 10 );
								y += oPopoverOffset["y"];
								y = parseInt ( y, 10 );
							} else {
								jQuery.sap.log.error ( "fnHandleLocationDetailsDisplay", "Failure of function call", "liveApp.controller.js" );
							}
							/* Fix For Incident : 1570316630 */
							if ( JSON.parse ( oEvent.getParameter ( "data" ) ).Action.object === "GeoFenceArea" ) {
								sEntity = "LC0004";
							}

							this.getLocationDetailsFromLocationID ( sLocationID, sEntity, function ( aResults ) {
								var popoverPositionObject = that.getPopoverOpeningDirection ( x, y );
								aResults.results[0].x = popoverPositionObject.x;
								aResults.results[0].y = popoverPositionObject.y;
								aResults.results[0].placement = popoverPositionObject.placement;

								if ( (aResults.results[0]["Tag"] !== "LC0004" && aResults.results[0]["Tag"] !== "LC0008") && this.byId ( "oSapSplLiveAppMap" ).zoom <= 6 ) {
									oSapSplMapsDataMarshal.fnShowPointOfInterestFlags ( aResults.results[0], this.byId ( "oSapSplLiveAppMap" ), "onEnlarge" );
								}

								if ( aResults.results[0]["Tag"] === "LC0002" ) {
									this.parkingSpaceDisplayHandler ( aResults.results[0] );
								} else if ( aResults.results[0]["Tag"] === "LC0003" || aResults.results[0]["Tag"] === "LC0007" ) {
									this.fnContainerTerminalDisplayHandler ( aResults.results[0] );
								} else {
									this.fnHandleDisplayOflocations ( aResults.results[0] );
								}

							}, function ( ) {
								jQuery.sap.log.error ( "fnHandleLocationDetailsDisplay", "Failure of function call", "liveApp.controller.js" );
							}, false );
						}
					},

					/**
					 * @description Dialog box for the confirmation of delete Location
					 * @since 1.0
					 * @param void
					 * @returns void
					 * @private
					 */
					fnOpenDeleteLocationConfirmationDialog : function ( oEvent ) {

						var that = this, sLocationName = "", sLocationType = "";
						sLocationName = oEvent.getSource ( ).getModel ( ).getData ( )["Name"];
						if ( oEvent.getSource ( ).getModel ( ).getData ( )["Tag"] === "LC0002" || oEvent.getSource ( ).getModel ( ).getData ( )["Tag"] === "LC0003" || oEvent.getSource ( ).getModel ( ).getData ( )["Tag"] === "LC0007" ) {
							sLocationType = "Parking Space";
						} else {
							sLocationType = "Other";
						}
						/* First close the popover when action is triggered */
						this.oPopOver.close ( );
						var oDeleteLocationConfirmationDialog = new sap.m.Dialog ( {
							showHeader : true,
							title : oSapSplUtils.getBundle ( ).getText ( "CONFIRMATION" ),
							beginButton : new sap.m.Button ( {
								text : oSapSplUtils.getBundle ( ).getText ( "OK" ),
								press : function ( ) {
									this.getParent ( ).close ( );
								}
							} ),
							endButton : new sap.m.Button ( {
								text : oSapSplUtils.getBundle ( ).getText ( "CANCEL" ),
								press : function ( ) {
									this.getParent ( ).close ( );
								}
							} ),
							type : sap.m.DialogType.Message,
							content : new sap.m.Text ( {
								text : oSapSplUtils.getBundle ( ).getText ( "DELETE_LOCATION_CONFIRMATION", sLocationName )
							} )
						} );

						oDeleteLocationConfirmationDialog.addCustomData ( new sap.ui.core.CustomData ( {
							key : "locationType",
							value : sLocationType
						} ) );

						if ( (oEvent.getSource ( ).getModel ( ).getData ( )["Tag"] === "LC0004" || oEvent.getSource ( ).getModel ( ).getData ( )["Tag"] === "LC0008") && oEvent.getSource ( ).getModel ( ).getData ( ).IncidentCount > 0 ) {
							sap.m.MessageBox.show ( oSapSplUtils.getBundle ( ).getText ( "MESSAGE_FOR_GEOFENCE_DELETE_WARNING" ), sap.m.MessageBox.Icon.WARNING, oSapSplUtils.getBundle ( ).getText ( "SPL_ERROR_WARNING_DIALOG_HEADER" ),
									[sap.m.MessageBox.Action.OK], function ( ) {

									} );
						} else {
							oDeleteLocationConfirmationDialog.open ( );
							oDeleteLocationConfirmationDialog.attachAfterClose ( function ( oEvent ) {
								if ( oEvent.getParameter ( "origin" ).getText ( ) === oSapSplUtils.getBundle ( ).getText ( "OK" ) ) {
									that.handleDeleteLocation ( oEvent );
								}
							} );
						}
					},

					/**
					 * @description Delete location event handler
					 * @private
					 * @this splReusable.controller.MapsDetailView
					 * @since 1.0
					 */
					handleDeleteLocation : function ( oEvent ) {
						var that = this, oModelForView = {}, oFinalPayload = {}, encodedUrl = "";
						if ( oEvent.getSource ( ).getCustomData ( )[0].getValue ( ) === "Parking Space" ) {
							oModelForView = sap.ui.getCore ( ).getModel ( "splParkingSpaceDetailsPopOverModel" );
						} else {
							oModelForView = sap.ui.getCore ( ).getModel ( "splViewEditLocationModel" );
						}

						oFinalPayload = this.returnDataForDelete ( oModelForView.getData ( ) );
						encodedUrl = oSapSplUtils.getServiceMetadata ( "newLocation", true );
						oSapSplBusyDialog.getBusyDialogInstance ( {
							title : oSapSplUtils.getBundle ( ).getText ( "BUSY_DIALOG_MESSAGE" )
						} ).open ( );
						/* move this to wrapper API in Utils */
						oSapSplAjaxFactory.fireAjaxCall ( {
							url : encodedUrl,
							method : "POST",
							data : JSON.stringify ( oFinalPayload ),
							success : function ( oResult, textStatus, xhr ) {
								if ( oResult.constructor === String ) {
									oResult = JSON.parse ( oResult );
								}

								if ( xhr.status === 200 ) {

									if ( oResult["Error"].length > 0 ) {
										/* CSNFIX 401790 2014 */
										sap.ca.ui.message.showMessageBox ( {
											type : sap.ca.ui.message.Type.ERROR,
											message : oSapSplUtils.getErrorMessagesfromErrorPayload ( oResult )["errorWarningString"],
											details : oSapSplUtils.getErrorMessagesfromErrorPayload ( oResult )["ufErrorObject"]
										}, function ( ) {
											that.oMapToolbar.refreshMap ( " " );
										} );

										/* CSN FIX Incident ID 1482008765 */
										if ( oResult.Header && oResult.Header[0] && oResult.Header[0].LocationID ) {
											delete that.selectedItems[oResult.Header[0].LocationID];

											if ( that.previousFocused && that.previousFocused.LocationID === oResult.Header[0].LocationID ) {
												that.previousFocused = null;
											}
										}

										oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
									} else {
										oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
										sap.ca.ui.message.showMessageToast ( oSapSplUtils.getBundle ( ).getText ( "LOCATION_DELETED_SUCCESSFULLY" ) );
										/* Incident FIX 1580046081 */
										that.oMapToolbar.refreshMap ( " " );
									}

								}

							},
							error : function ( xhr, textStatus, errorThrown ) {
								if ( xhr ) {

									/* CSNFIX 1316753 2014 */
									sap.ca.ui.message.showMessageBox ( {
										type : oSapSplUtils.getErrorMessagesfromErrorPayload ( xhr.responseJSON )["messageTitle"],
										message : oSapSplUtils.getErrorMessagesfromErrorPayload ( xhr.responseJSON )["errorWarningString"],
										details : oSapSplUtils.getErrorMessagesfromErrorPayload ( xhr.responseJSON )["ufErrorObject"]
									} );
								}
								oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
								jQuery.sap.log.error ( errorThrown, textStatus, "MapsDetailView.controller.js" );
							},
							complete : function ( ) {
								oSapSplMapsDataMarshal.fnClearMap ( that.byId ( "oSapSplLiveAppMap" ) );
								that.fnShowAllVisualObjectsOnMap ( );
								that.fnRefreshLabels ( );
							}
						} );
					},

					/**
					 * @description To handle delete of Location data
					 * @private
					 * @since 1.0
					 */
					returnDataForDelete : function ( oDataFromSourceView ) {

						/* changed the payload for delete */
						var oConstructedPayload = {
							"inputHasChangeMode" : true,
							"Header" : [{
								"LocationID" : oDataFromSourceView["LocationID"],
								"ChangeMode" : "D"
							}]
						};

						return oConstructedPayload;
					},

					/**
					 * This method returns the view instance of this controller
					 * @param void
					 * @returns object
					 * @since 1.0
					 * @private
					 */
					getChildInstance : function ( ) {
						return this.getView ( );
					},

					/**
					 * This function is called if the dirty flag is set as true.
					 * This function closes all the open dialog boxes and clears the Map when you navigate from the app.
					 * @param void
					 * @return void
					 * @since 1.0
					 * @private
					 */
					onCleanUp : function ( ) {

						if ( this.oSendMessageBusinessPartnerParentDialog ) {
							this.oSendMessageBusinessPartnerParentDialog.destroy ( );
						}

						if ( this.oSendMessageParentDialog ) {
							this.oSendMessageParentDialog.destroy ( );
						}

						if ( this.oSapSplLocationCreateEditDialogInstance ) {
							this.oSapSplLocationCreateEditDialogInstance.destroy ( );
							this.oSapSplLocationCreateEditDialogInstance = null;
						}

						if ( this.oSendMessageToTruckParentDialog ) {
							this.oSendMessageToTruckParentDialog.destroy ( );
						}

						if ( this.oParkingEditDialog ) {
							this.oParkingEditDialog.destroy ( );
						}

						this.fnShowAllVisualObjectsOnMap ( );
						oSapSplMapsDataMarshal.fnResetValues ( this.byId ( "oSapSplLiveAppMap" ) );
						oSapSplMapsDataMarshal.fnChangeCursor ( "Normal" );
						this.fnBlockUnblockLiveAppUI ( "Unblock" );
						this.byId ( "sapSplLocationCreateCancelButton" ).setVisible ( false );
						this.byId ( "sapSplTrafficStatusFooter" ).removeStyleClass ( "sapSplHiddenBar" );
					},

					/*************************************************
					 * **********************************************
					 * **********************************************
					 * *********TRUCK RELATED METHODS START**********
					 * **********************************************
					 * **********************************************
					 ************************************************/

					/**
					 * Handles Send message action on the truck popover.
					 * @param oEvent
					 * @returns void
					 * @since 1.0
					 * @private
					 */
					handleSendMessageAction : function ( ) {

						var that = this;
						var oPopoverModelData = this.oTruckDetailsPopOver.getModel ( ).getData ( );
						var oViewData = {
							Reg : oPopoverModelData["RegistrationNumber"],
							ID : oPopoverModelData["DeviceUUID"],
							mode : "Trucks",
							bAllowDelete : false
						};
						this.oTruckDetailsPopOver.close ( );

						// adding style class.
						splReusable.libs.SapSplStyleSheetLoader.loadStyle ( "./resources/styles/sapSplSendMessageDialog" );

						// instantiating the dialog view.
						this.oSendMessageToTruckDialogView = sap.ui.view ( {
							viewName : "splView.dialogs.SplSendMessageDialog",
							type : sap.ui.core.mvc.ViewType.XML,
							viewData : oViewData
						} ).addStyleClass ( "sendMessageDialogContainerView" );

						// instantiating the dialog to hold the above view.
						this.oSendMessageToTruckParentDialog = new sap.m.Dialog ( {
							showHeader : false,
							content : new sap.ui.commons.layout.VerticalLayout ( ).addStyleClass ( "viewHolderLayout" ).addContent ( this.oSendMessageToTruckDialogView )
						} ).addStyleClass ( "splSendMessageDialog" ).addStyleClass ( "sapSplHideDialog" ).open ( );

						this.aRenderedDialogs.push ( "viewHolderLayout" );

						// attaching after open event handler.
						this.oSendMessageToTruckParentDialog.attachAfterOpen ( function ( ) {
							oSapSplUtils.fnSyncStyleClass ( that.oSendMessageToTruckParentDialog );
							that.fnBlockUnblockLiveAppUI ( "Block", "sendMessageToSingleTruck" );
							that.fnPreventEnableMapRefresh ( "Prevent" );
						} );

						// attaching after close event handler
						this.oSendMessageToTruckParentDialog.attachAfterClose ( function ( ) {
							that.isSelectMultipleTrucksEnabled = false;
							that.isSelectMultipleGeofencesEnabled = false;
							that.fnBlockUnblockLiveAppUI ( "Unblock" );
							that.fnPreventEnableMapRefresh ( "Enable" );
							oSapSplMapsDataMarshal.fnResetValues ( that.byId ( "oSapSplLiveAppMap" ) );
							that.fnShowAllVisualObjectsOnMap ( "PlotLocally" );
						} );

						this.oSendMessageToTruckParentDialog.addEventDelegate ( {
							onAfterRendering : function ( oEvent ) {
								that.fnHandleDialogMove ( oEvent.srcControl );
								that.fnHandleDialogPositioning ( oEvent.srcControl );
							}
						} );

						// setting the parent dialog instance on the view's
						// controller.
						this.oSendMessageToTruckDialogView.getController ( ).setParentDialogInstance ( this.oSendMessageToTruckParentDialog, this );

						// to hide the black opaque background which any sap.m
						// dialog has by
						// default.
						$ ( ".sapMDialogBlockLayerInit" ).css ( "z-index", "0" );

					},

					fnHandleSelectOfTourForTruckAssignment : function ( oEvent ) {
						var that = this;
						var oPayLoad = {};
						oPayLoad["Header"] = [];
						oPayLoad["Text"] = [];
						oPayLoad["Stop"] = [];
						oPayLoad["Item"] = [];
						oPayLoad["StopItemAssignment"] = [];

						function fnFireAjaxCall ( oPayLoad, oDialog ) {
							oSapSplAjaxFactory.fireAjaxCall ( {
								url : oSapSplUtils.getFQServiceUrl ( "/sap/spl/xs/app/services/tour.xsjs" ),
								method : "PUT",
								async : false,
								data : JSON.stringify ( oPayLoad ),
								success : function ( data, success, messageObject ) {
									oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
									if ( data.constructor === String ) {
										data = JSON.parse ( data );
									}
									if ( messageObject["status"] === 200 && data["Error"].length === 0 ) {
										sap.ca.ui.message.showMessageToast ( oSapSplUtils.getBundle ( ).getText ( "SUCCESSFUL_TOUR_ASSIGNMENT" ) );
										oDialog.close ( );
										that.getTruckMetadata ( );
									} else {
										var errorMessage = oSapSplUtils.getErrorMessagesfromErrorPayload ( data )["ufErrorObject"];
										sap.ca.ui.message.showMessageBox ( {
											type : oSapSplUtils.getErrorMessagesfromErrorPayload ( data )["messageTitle"],
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
										if ( error.responseText.constructor === String ) {
											error.responseText = JSON.parse ( error.responseText );
										}

										sap.ca.ui.message.showMessageBox ( {
											type : oSapSplUtils.getErrorMessagesfromErrorPayload ( error.responseText )["messageTitle"],
											message : oSapSplUtils.getErrorMessagesfromErrorPayload ( error.responseText )["errorWarningString"],
											details : oSapSplUtils.getErrorMessagesfromErrorPayload ( error.responseText )["ufErrorObject"]
										} );
									}
								},
								complete : function ( ) {

								}

							} );
						}

						function fnPreparePayloadForTourAssignment ( oData, that, oDialog ) {

							var oHeaderPayLoad = {};
							oHeaderPayLoad["UUID"] = oData["UUID"];
							oHeaderPayLoad["TourID"] = oData["TourID"];
							oHeaderPayLoad["VehicleUUID"] = that.sClickedVehicleUUID;
							oHeaderPayLoad["Status"] = "S";
							oHeaderPayLoad["OwnerID"] = oSapSplUtils.getCompanyDetails ( )["BasicInfo_CompanyID"];
							oHeaderPayLoad["Name"] = oData["Name"];
							oHeaderPayLoad["EventSchema"] = "default";
							oHeaderPayLoad["Planned.StartTime"] = (oData["Planned_StartTime"] === null) ? null : oData["Planned_StartTime"].toJSON ( );
							oHeaderPayLoad["Planned.EndTime"] = (oData["Planned_EndTime"] === null) ? null : oData["Planned_EndTime"].toJSON ( );
							oHeaderPayLoad["Actual.StartTime"] = (oData["Actual_StartTime"] === null) ? null : oData["Actual_StartTime"].toJSON ( );
							oHeaderPayLoad["Actual.EndTime"] = (oData["Actual_EndTime"] === null) ? null : oData["Actual_EndTime"].toJSON ( );
							oHeaderPayLoad["isDeleted"] = oData["isDeleted"];
							oHeaderPayLoad["AuditTrail.CreatedBy"] = null;
							oHeaderPayLoad["AuditTrail.ChangedBy"] = null;
							oHeaderPayLoad["AuditTrail.CreationTime"] = null;
							oHeaderPayLoad["AuditTrail.ChangeTime"] = null;

							oPayLoad["Header"].push ( oHeaderPayLoad );
							oPayLoad["Text"].push ( {
								UUID : oData["UUID"],
								Text : oData["Text"]
							} );

							var oTempObject = {};
							for ( var i = 0 ; i < oData["Items"].results.length ; i++ ) {
								oTempObject = {};
								oTempObject["UUID"] = oData["Items"].results[i]["ItemUUID"];
								oTempObject["ItemID"] = oData["Items"].results[i]["ItemID"];
								oTempObject["TourUUID"] = oData["Items"].results[i]["TourUUID"];
								oTempObject["Type"] = oData["Items"].results[i]["Type"];
								oTempObject["Detail1"] = oData["Items"].results[i]["Detail1"];
								oTempObject["Detail2"] = oData["Items"].results[i]["Detail2"];
								oTempObject["Detail3"] = oData["Items"].results[i]["Detail3"];
								oTempObject["DangerGoodsClass"] = oData["Items"].results[i]["DangerGoodsClass"];
								oTempObject["isDeleted"] = oData["Items"].results[i]["isDeleted"];

								oPayLoad["Item"].push ( oTempObject );
							}

							for ( var j = 0 ; j < oData["Stops"].results.length ; j++ ) {
								oTempObject = {};
								oTempObject["UUID"] = oData["Stops"].results[j]["UUID"];
								oTempObject["TourUUID"] = oData["Stops"].results[j]["TourUUID"];
								oTempObject["Sequence"] = oData["Stops"].results[j]["Sequence"];
								oTempObject["Name"] = oData["Stops"].results[j]["Name"];
								oTempObject["Description"] = oData["Stops"].results[j]["Description"];
								oTempObject["Geocordinate"] = null;
								oTempObject["Status"] = oData["Stops"].results[j]["Status"];
								oTempObject["LastReportedEvent"] = oData["Stops"].results[j]["LastReportedEvent"];
								oTempObject["LocationUUID"] = oData["Stops"].results[j]["LocationID"];
								oTempObject["isDeleted"] = oData["Stops"].results[j]["isDeleted"];
								oTempObject["Planned.ArrivalTime"] = (oData["Stops"].results[j]["Planned_ArrivalTime"] === null) ? null : oData["Stops"].results[j]["Planned_ArrivalTime"].toJSON ( );
								oTempObject["Planned.DepartureTime"] = (oData["Stops"].results[j]["Planned_DepartureTime"] === null) ? null : oData["Stops"].results[j]["Planned_DepartureTime"].toJSON ( );
								oTempObject["Actual.ArrivalTime"] = (oData["Stops"].results[j]["Actual_ArrivalTime"] === null) ? null : oData["Stops"].results[j]["Actual_ArrivalTime"].toJSON ( );
								oTempObject["Actual.DepartureTime"] = (oData["Stops"].results[j]["Actual_DepartureTime"] === null) ? null : oData["Stops"].results[j]["Actual_DepartureTime"].toJSON ( );
								oPayLoad["Stop"].push ( oTempObject );
								var aAssignedItems = oData["Stops"].results[j]["AssignedItems"].results;
								for ( var k = 0 ; k < aAssignedItems.length ; k++ ) {
									var oTempAssignmentObject = {};
									oTempAssignmentObject["UUID"] = oSapSplUtils.getUUID ( );
									oTempAssignmentObject["TourUUID"] = aAssignedItems[k]["TourUUID"];
									oTempAssignmentObject["StopUUID"] = aAssignedItems[k]["StopUUID"];
									oTempAssignmentObject["ItemUUID"] = aAssignedItems[k]["ItemUUID"];
									oTempAssignmentObject["Type"] = aAssignedItems[k]["AssignmentType"];
									oTempAssignmentObject["isDeleted"] = aAssignedItems[k]["isDeleted"];

									oPayLoad["StopItemAssignment"].push ( oTempAssignmentObject );
								}
							}

							fnFireAjaxCall ( oPayLoad, oDialog );

						}

						var sPath = oEvent.getSource ( ).getSelectedItem ( ).getBindingContext ( ).getPath ( );
						this.oSapSplApplModel.read ( sPath, null, ["$expand=Items,Stops/AssignedItems"], false, function ( oResult ) {
							fnPreparePayloadForTourAssignment ( oResult, that, oEvent.getSource ( ).getParent ( ) );
						}, function ( ) {

						} );
					},

					fnHandleSearch : function ( event ) {
						var searchString = event.mParameters.query;
						var payload;

						if ( searchString.length > 2 ) {
							payload = this.prepareSearchPayload ( searchString );
							this.callSearchService ( payload );
						} else {
							if ( searchString.length === 0 ) {
								var aFilters = [], oBinding = null;
								oBinding = this.oListOfUnassignedTours.getBinding ( "items" );
								oBinding.filter ( [] );
								// aFilters.push( this.oTourStatusFilter );
								oBinding.filter ( aFilters );
							}
						}
					},

					prepareSearchPayload : function ( searchTerm ) {
						var payload = {};
						payload.UserID = oSapSplUtils.getLoggedOnUserDetails ( ).usreID;
						payload.ObjectType = "Tour";
						payload.SearchTerm = searchTerm;
						payload.FuzzinessThershold = SapSplEnums.fuzzyThreshold;
						payload.MaximumNumberOfRecords = SapSplEnums.numberOfRecords;
						payload.ProvideDetails = false;
						payload.SearchInNetwork = true;
						payload.AdditionalCriteria = {};
						payload.AdditionalCriteria.Columns = "Name";

						return payload;
					},

					fnApplySearchFilters : function ( data ) {
						var aFilters = [], oBinding = null;
						oBinding = this.oListOfUnassignedTours.getBinding ( "items" );
						aFilters = oSapSplUtils.getSearchItemFilters ( data ).aFilters;
						oBinding.filter ( [] );
						oBinding.filter ( aFilters );
					},

					callSearchService : function ( payload ) {
						var that = this;

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
									that.fnApplySearchFilters ( data );
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
									var response = {};
									if ( error.responseText.constructor === String ) {
										response = JSON.parse ( error.responseText );
									} else {
										response = error.responseText;
									}

									sap.ca.ui.message.showMessageBox ( {
										type : sap.ca.ui.message.Type.ERROR,
										message : oSapSplUtils.getErrorMessagesfromErrorPayload ( response )["errorWarningString"],
										details : oSapSplUtils.getErrorMessagesfromErrorPayload ( response )["ufErrorObject"]
									} );
								}
							},
							complete : function ( ) {

							}
						} );
					},

					handleAssigTourAction : function ( oEvent ) {
						if ( oEvent.getSource ( ).getText ( ) === oSapSplUtils.getBundle ( ).getText ( "ASSIGN_TOUR" ) ) {

							var that = this;

							this.sClickedVehicleUUID = oEvent.getSource ( ).getModel ( ).getData ( )["UUID"];

							this.oTourStatusFilter = new sap.ui.model.Filter ( "TourStatus", sap.ui.model.FilterOperator.EQ, "U" );

							this.oListOfUnassignedTours = new sap.m.List ( {
								mode : "SingleSelectMaster",
								growing : true,
								growingThreshold : 20,
								growingScrollToLoad : true,
								select : jQuery.proxy ( that.fnHandleSelectOfTourForTruckAssignment, that ),
								items : {
									path : "/Tours",
									filters : [this.oTourStatusFilter],
									template : new sap.m.StandardListItem ( {
										title : "{Name}",
										description : "{TourID}"
									} )
								}
							} );

							new sap.m.Dialog ( {
								contentHeight : "40%",
								title : oSapSplUtils.getBundle ( ).getText ( "ASSIGN_TOUR" ),
								beginButton : new sap.m.Button ( {
									text : oSapSplUtils.getBundle ( ).getText ( "CANCEL" ),
									press : function ( ) {
										oEvent.getSource ( ).getParent ( ).close ( );
									}
								} ),
								subHeader : new sap.m.Toolbar ( {
									content : new sap.m.SearchField ( {
										search : jQuery.proxy ( that.fnHandleSearch, that )
									} )
								} ),
								content : [this.oListOfUnassignedTours]
							} ).open ( ).addStyleClass ( "sapSplAssignTourToTruckDialog" ).setModel ( this.oSapSplApplModel ).attachAfterClose ( function ( oControl ) {
								oControl.getSource ( ).destroy ( );
							} );

							this.aRenderedDialogs.push ( "sapSplAssignTourToTruckDialog" );
						} else {
							this.fnHandleNavigationToManageToursApp ( oEvent.getSource ( ).getModel ( ).getData ( )["RegistrationNumber"] );
						}

					},

					/**
					 * This function opens the popover to show the details of the truck
					 * @param oEvent
					 * @return void
					 * @since 1.0
					 * @private
					 */
					showTruckDetailsPopover : function ( oEvent ) {

						if ( (sap.ui.getCore ( ).getModel ( "sapSplAppConfigDataModel" ).getData ( )["canClickTruck"] !== null) && (sap.ui.getCore ( ).getModel ( "sapSplAppConfigDataModel" ).getData ( )["canClickTruck"] === 1) ) {
							var x = 0;
							var y = 0;
							var oViewData = {};
							var oTruckData = {};
							var oEventData = {};
							this.oTruckDetailsPopOver = sap.ui.xmlfragment ( "viewTruckDetailsFragment", "splReusable.fragments.ViewTruckDetails", this );
							sap.ui.core.Fragment.byId ( "viewTruckDetailsFragment", "sapSplPhoneLabel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "TELEPHONE" ) );
							sap.ui.core.Fragment.byId ( "viewTruckDetailsFragment", "sapSplTruckLabel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "TRUCK" ) );
							sap.ui.core.Fragment.byId ( "viewTruckDetailsFragment", "sapSplTourLabel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "TRUCK_DETAIL_TOUR_FIELD" ) );
							sap.ui.core.Fragment.byId ( "viewTruckDetailsFragment", "sapSplNextStopLabel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "TRUCK_DETAIL_NEXT_STOP" ) );
							sap.ui.core.Fragment.byId ( "viewTruckDetailsFragment", "sapSplTruckDetailsViewPageBeginButton" ).setText ( oSapSplUtils.getBundle ( ).getText ( "SEND_MESSAGE_ACTION_BUTTON" ) );
							sap.ui.core.Fragment.byId ( "viewTruckDetailsFragment", "sapSplTruckDetailsViewPageEndButton" ).setText ( oSapSplUtils.getBundle ( ).getText ( "ASSIGN_TOUR" ) );

							if ( sap.ui.getCore ( ).getModel ( "sapSplAppConfigDataModel" ).getData ( )["canSendMessageToTruckFromMap"] === 1 ) {
								sap.ui.core.Fragment.byId ( "viewTruckDetailsFragment", "sapSplTruckDetailsViewPageBeginButton" ).setVisible ( true );
							} else {
								sap.ui.core.Fragment.byId ( "viewTruckDetailsFragment", "sapSplTruckDetailsViewPageBeginButton" ).setVisible ( false );
							}

							if ( sap.ui.getCore ( ).getModel ( "sapSplAppConfigDataModel" ).getData ( )["canAssignTour"] === 1 ) {
								sap.ui.core.Fragment.byId ( "viewTruckDetailsFragment", "sapSplTruckDetailsViewPageEndButton" ).setVisible ( true );
							} else {
								sap.ui.core.Fragment.byId ( "viewTruckDetailsFragment", "sapSplTruckDetailsViewPageEndButton" ).setVisible ( false );
							}

							// If the function is called from Feedlist.
							if ( oEvent.fromFeedlist || oEvent.fromLabel ) {
								oTruckData = oEvent;

								// If the function is called from event handler.
							} else {

								oEventData = JSON.parse ( oEvent.getParameter ( "data" ) );
								oViewData["LocationID"] = oEventData.Action.instance.split ( "." )[1];
								oViewData["viewMode"] = "E";
								var oPopoverOffset = this.fnGetPopoverOffsets ( );
								if ( oEventData.Action.Params.Param[0].name === "x" ) {

									// Calculates the x coordinate of the
									// popover
									x = parseInt ( oEventData.Action.Params.Param[0]["#"], 10 );
									x += oPopoverOffset["x"];
									x = parseInt ( x, 10 );
								}

								// Calculates the x coordinate of the popover
								if ( oEventData.Action.Params.Param[1].name === "y" ) {
									y = parseInt ( oEventData.Action.Params.Param[1]["#"], 10 );
									y += oPopoverOffset["y"];
									y = parseInt ( y, 10 );
								}

								// UUID of the device of the Truck
								var deviceUUID = oEventData.Action.instance.split ( "." )[1];

								if ( oSapSplUtils.getFromQueryParameterMap ( "xx-sap-spl-fallback" ) === "true" ) {
									this.getTruckDetailsFromDeviceUUID ( deviceUUID, function ( aResults ) {
										oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
										oTruckData = aResults.results[0];
									}, function ( ) {
										jQuery.sap.log.error ( "Truck details", "read failed", "liveApp.controller.js" );
									} );
								} else {
									this.getTruckDetailsFromDeviceUUIDProxy.read ( this, deviceUUID, function ( aResults ) {
										oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
										oTruckData = aResults.results[0];
									}, function ( ) {/* TODO */} );
								}

								/* Fix for Incident :1580110936 */
								var oPos = this.getPopoverOpeningDirection ( x, y );
								oTruckData.x = oPos.x;
								oTruckData.y = oPos.y;
								oTruckData.placement = oPos.placement;
							}

							/* CSNFIX : 0120031469 642548 2014 */
							if ( oTruckData["TourName"] === null && oTruckData["NextTourName"] === null ) {
								sap.ui.core.Fragment.byId ( "viewTruckDetailsFragment", "sapSplTourtext" ).setText ( oSapSplUtils.getBundle ( ).getText ( "NO_TOURS_ASSIGNED_FOR_TRUCK" ) );
								sap.ui.core.Fragment.byId ( "viewTruckDetailsFragment", "sapSplNextStopLabel" ).setVisible ( false );
								sap.ui.core.Fragment.byId ( "viewTruckDetailsFragment", "sapSplNextStopText" ).setVisible ( false );
								this.oTruckDetailsPopOver.setContentHeight ( "160px" );

								// To Handle the scenario when the truck is
								// assigned to a tour,
								// but the truck is related to any bupa.
								// Hence the truck has to be shown on the map,
								// but further
								// assignments should not be possible.
								if ( oTruckData["isTerminated"] !== undefined && oTruckData["isTerminated"] !== null && oTruckData["isTerminated"] === 1 ) {
									sap.ui.core.Fragment.byId ( "viewTruckDetailsFragment", "sapSplTruckDetailsViewPageEndButton" ).setVisible ( false );
								}
							} else {
								if ( oTruckData["TourName"] !== null ) {
									sap.ui.core.Fragment.byId ( "viewTruckDetailsFragment", "sapSplTourtext" ).setText ( oTruckData["TourName"] );
									if ( oTruckData["TourNextStop"] !== null ) {
										sap.ui.core.Fragment.byId ( "viewTruckDetailsFragment", "sapSplNextStopLabel" ).setVisible ( true );
										sap.ui.core.Fragment.byId ( "viewTruckDetailsFragment", "sapSplNextStopText" ).setVisible ( true );
									} else {
										sap.ui.core.Fragment.byId ( "viewTruckDetailsFragment", "sapSplNextStopLabel" ).setVisible ( false );
										sap.ui.core.Fragment.byId ( "viewTruckDetailsFragment", "sapSplNextStopText" ).setVisible ( false );
									}

									sap.ui.core.Fragment.byId ( "viewTruckDetailsFragment", "sapSplTruckDetailsViewPageEndButton" ).setText ( oSapSplUtils.getBundle ( ).getText ( "SHOW_TOURS" ) );

								} else {
									sap.ui.core.Fragment.byId ( "viewTruckDetailsFragment", "sapSplTourtext" ).setText (
											oSapSplUtils.getBundle ( ).getText ( "NO_TOURS_ASSIGNED_FOR_TRUCK_UNTIL", [oTruckData["NextTourStartTime"].toLocaleDateString ( ), oTruckData["NextTourStartTime"].toLocaleTimeString ( )] ) );
									sap.ui.core.Fragment.byId ( "viewTruckDetailsFragment", "sapSplNextStopLabel" ).setVisible ( false );
									sap.ui.core.Fragment.byId ( "viewTruckDetailsFragment", "sapSplNextStopText" ).setVisible ( false );

									// To Handle the scenario when the truck is
									// assigned to a
									// tour, but the truck is related to any
									// bupa.
									// Hence the truck has to be shown on the
									// map, but further
									// assignments should not be possible.
									if ( oTruckData["isTerminated"] !== undefined && oTruckData["isTerminated"] !== null && oTruckData["isTerminated"] === 1 ) {
										sap.ui.core.Fragment.byId ( "viewTruckDetailsFragment", "sapSplTruckDetailsViewPageEndButton" ).setVisible ( false );
									}
								}
							}

							// If it is PRM
							if ( oTruckData["RegistrationNumber"] === null ) {
								oTruckData.showHeaderAndContent = false;
								oTruckData["RegistrationNumber"] = "Truck";
								this.oTruckDetailsPopOver.setContentHeight ( "0px" );

								// If it is FF ADMIN
							} else {
								oTruckData.showHeaderAndContent = true;
							}

							if ( sap.ui.getCore ( ).getModel ( "sapSplAppConfigDataModel" ).getData ( )["canViewAssignedItems"] === 1 ) {
								sap.ui.core.Fragment.byId ( "viewTruckDetailsFragment", "sapSplNextStopLabel" ).setVisible ( false );
								sap.ui.core.Fragment.byId ( "viewTruckDetailsFragment", "sapSplNextStopText" ).setVisible ( false );
								this.oTruckDetailsPopOver.setContentHeight ( "300px" );
							} else {
								/* Fix for Incident 1580111870 */
								if ( oTruckData["RegistrationNumber"] === "Truck" ) {
									this.oTruckDetailsPopOver.setContentHeight ( "0px" );
								} else {
									this.oTruckDetailsPopOver.setContentHeight ( "180px" );
								}
							}

							// Creates a JSON model and sets it to the popover
							var oTruckDetailsPopOverModel = new sap.ui.model.json.JSONModel ( );
							oTruckDetailsPopOverModel.setData ( oTruckData );
							sap.ui.getCore ( ).setModel ( oTruckDetailsPopOverModel, "splTruckDetailsPopOverModel" );
							this.oTruckDetailsPopOver.setModel ( sap.ui.getCore ( ).getModel ( "splTruckDetailsPopOverModel" ) );

							this.oTruckDetailsPopOver.attachAfterClose ( function ( oEvent ) {
								oEvent.getSource ( ).destroy ( );
							} );

							this.oTruckDetailsPopOver.attachAfterOpen ( function ( ) {
								if ( oTruckData["introduceFooterZoomInButton"] === true ) {
									sap.ui.getCore ( ).byId ( jQuery ( "#" + this.sId + "-popover footer" ).attr ( "id" ) ).insertContent ( new sap.m.ToolbarSpacer ( ), 0 ).insertContent ( new sap.m.Button ( {
										text : oSapSplUtils.getBundle ( ).getText ( "ZOOM_IN_CLUSTER" ),
										press : function ( oEvent ) {
											oTruckData["zoomInButtonHandler"] ( oTruckData, oEvent.getSource ( ).getParent ( ).getParent ( ).getParent ( ), "Position" );
										}
									}, 0 ) );
								}

								if ( parseInt ( this.$ ( ).find ( ".sapMPopoverCont" ).css ( "height" ), 10 ) > 400 ) {
									this.setContentHeight ( "400px" );
								}

							} );

							this.oTruckDetailsPopOver.openBy ( this.byId ( "oPopoverAnchorButton" ) );
						}
					},

					/**
					 * This function loops through the array of Truck object and call the function to plot it on the Map
					 * @since 1.0
					 * @returns void
					 * @param void
					 * @private
					 */
					showTrucksOnMap : function ( ) {
						// CSN FIX : 0120031469 634669 2014
						var aLabels = jQuery ( ".vbi-detail" );
						var i;
						for ( i = 0 ; i < aLabels.length ; i++ ) {
							if ( jQuery ( aLabels[i] ).find ( ".truckDetailWindowLayout" ).length > 0 ) {
								jQuery ( aLabels[i] ).remove ( );
							}
						}

						oSapSplMapsDataMarshal.fnRemoveVOsOnMap ( "Truck", this.byId ( "oSapSplLiveAppMap" ) );

						// Loops through the array of truck data and calls the
						// function to plot
						// it on the Map
						for ( i = 0 ; i < this.aTruckArray.length ; i++ ) {
							if ( this.aTruckArray[i] ) {
								oSapSplMapsDataMarshal.fnShowTruckFlags ( this.aTruckArray[i], this.byId ( "oSapSplLiveAppMap" ), this.isTruckLabelVisible );
							}
						}

						if ( this.bZoomToTruck !== undefined && this.bZoomToTruck === true ) {
							/* Incident : 1570171440 */
							var sCoords = oSapSplMapsDataMarshal.convertGeoJSONToString ( JSON.parse ( this.oZoomToTruckData.Position.results[0].Position ) ).split ( ";" );
							this.byId ( "oSapSplLiveAppMap" ).zoomToGeoPosition ( parseFloat ( sCoords[0], 10 ), parseFloat ( sCoords[1], 10 ), parseFloat ( this.byId ( "oSapSplLiveAppMap" ).zoom, 10 ) );
						}
					},

					/*************************************************
					 * **********************************************
					 * **********************************************
					 * *******INCIDENT RELATED METHODS START*********
					 * **********************************************
					 * **********************************************
					 ************************************************/

					handleIncidenceOccurrencePopover : function ( oEvent ) {
						var x = 0;
						var y = 0;
						var oTruckData = {};
						var oEventData = {};

						if ( oEvent.fromFeedlist ) {
							oTruckData = oEvent;
							x = oEvent.x;
							y = oEvent.y;
						} else {
							oEventData = JSON.parse ( oEvent.getParameter ( "data" ) );
							var oPopoverOffset = this.fnGetPopoverOffsets ( );
							if ( oEventData.Action.Params.Param[0].name === "x" ) {

								// Calculates the x coordinate of the Popover.
								x = parseInt ( oEventData.Action.Params.Param[0]["#"], 10 );
								x += oPopoverOffset["x"];
								x = parseInt ( x, 10 );
							}

							// Calculates the y coordinate of the popover
							if ( oEventData.Action.Params.Param[1].name === "y" ) {
								y = parseInt ( oEventData.Action.Params.Param[1]["#"], 10 );
								y += oPopoverOffset["y"];
								y = parseInt ( y, 10 );
							}

							// UUID of incidence occurrence.
							var incidenceUUID = oEventData.Action.instance.split ( "." )[1];

							this.getIncidentDetailsFromUUID ( incidenceUUID, function ( aResults ) {
								oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
								oTruckData = aResults.results[0];
							}, function ( ) {
								jQuery.sap.log.error ( "Incidence Occurrence details", "read failed", "liveApp.controller.js" );
							} );
						}

						// Instantiates the Popover for Incidence Occurrence
						this.oIncidenceOccurrenceDetailsPopOver = new sap.m.ResponsivePopover ( {
							showHeader : false,
							offsetX : x,
							offsetY : y,
							modal : false,
							content : new sap.ui.commons.layout.VerticalLayout ( ).addStyleClass ( "oIncidenceOccurrenceDetailsPopOverContetnLayout" ).addContent ( new sap.m.Label ( {
								text : "Incident"
							} ).addStyleClass ( "oIncidenceOccurrenceDetailsPopOverIncident" ) ).addContent ( new sap.m.Label ( {
								text : oTruckData["LongText"]
							} ).addStyleClass ( "oIncidenceOccurrenceDetailsPopOverIncidentShortText" ) ).addContent ( new sap.m.Image ( {
								src : "resources/icons/redArrow.png.png"
							} ).addStyleClass ( "oIncidenceOccurrenceDetailsPopOverArrowImage" ) )
						} ).addStyleClass ( "oIncidenceOccurrenceDetailsPopOver" );

						this.oIncidenceOccurrenceDetailsPopOver.attachAfterClose ( function ( oEvent ) {
							oEvent.getSource ( ).destroy ( );
						} );

						this.oIncidenceOccurrenceDetailsPopOver.openBy ( this.byId ( "oPopoverAnchorButton" ) );
					},

					/**
					 * Shows the incidence occurrence on the Map
					 * @param void
					 * @returns void
					 * @since 1.0
					 * @private
					 */
					showIncidenceOccurrencesOnMap : function ( ) {

						oSapSplMapsDataMarshal.fnRemoveVOsOnMap ( "Incident", this.byId ( "oSapSplLiveAppMap" ) );

						for ( var i = 0 ; i < this.aIncidenceOccuranceData.length ; i++ ) {
							oSapSplMapsDataMarshal.fnShowIncidenceFlags ( this.aIncidenceOccuranceData[i], this.byId ( "oSapSplLiveAppMap" ) );
						}
					},

					/*************************************************
					 * **********************************************
					 * **********************************************
					 * *******LOCATION RELATED METHOD START**********
					 * **********************************************
					 * **********************************************
					 ************************************************/

					fnGetEmptyLocationObjectForCreate : function ( sCoord, sLocationType ) {
						var oReturnObject = {};
						oReturnObject["Name"] = "";
						oReturnObject["GeofenceGates"] = {
							results : []
						};
						oReturnObject["Incidents"] = {
							results : []
						};
						oReturnObject["locationGeoCoords"] = this.fnCordinateStringToCordinateArray ( sCoord );
						if ( sLocationType === "Geofence" ) {
							oReturnObject["showGates"] = true;
							oReturnObject["Type"] = "L00002";
							/* CSNFIX : 0120061532 0001419476 2014 */
							oReturnObject["isPublic"] = "0";
						} else {
							oReturnObject["showGates"] = false;
							oReturnObject["Type"] = "L00001";
							/* CSNFIX : 0120061532 0001419476 2014 */
							oReturnObject["isPublic"] = "1";
						}
						oReturnObject["ImageUrl"] = "";
						oReturnObject["Website"] = "";
						oReturnObject["Tag"] = this.sLocationType;
						return oReturnObject;
					},

					/**
					 * @description Opens up the Dialogbox for the edit of parking space.
					 * @returns void
					 * @param oEvent
					 * @since 1.0
					 * @private
					 */
					fnHandleEditDialogOfParkingSpace : function ( oEvent ) {
						var that = this;
						var aLocationCoords = [];
						oSapSplMapsDataMarshal.fnChangeCursor ( "pencil" );
						oEvent.getSource ( ).getParent ( ).getParent ( ).getParent ( ).close ( );
						splReusable.libs.SapSplStyleSheetLoader.loadStyle ( "./resources/styles/sapSplParkingSpaceCreateDialog" );
						var oParkingSpaceData = {};
						oParkingSpaceData = oEvent.getSource ( ).getModel ( ).getData ( );
						var oParkingSpaceGeometry = oSapSplMapsDataMarshal.convertStringToGeoJSON ( oParkingSpaceData["Geometry"] );
						oParkingSpaceData["Geometry"] = JSON.stringify ( oParkingSpaceGeometry );

						oSapSplMapsDataMarshal.fnEditFences ( oParkingSpaceData, this.byId ( "oSapSplLiveAppMap" ) );

						aLocationCoords = oParkingSpaceGeometry.coordinates;
						oParkingSpaceData["Latitude"] = aLocationCoords[1];
						oParkingSpaceData["Longitude"] = aLocationCoords[0];
						oParkingSpaceData["mode"] = "Edit";

// var aParkingConfigData = oParkingSpaceData["Parking"].results;
// for (var i = 0; i < aParkingConfigData.length; i++) {
// aParkingConfigData[i]["checked"] = true;
// }

						oParkingSpaceData["Parking"].results = [];
						oParkingSpaceData["sDialogType"] = oParkingSpaceData["Tag"];
						this.oCreateParkingSpaceEditDialogView = sap.ui.view ( {
							viewName : "splView.dialogs.SplParkingSpaceCreateEditDialog",
							type : sap.ui.core.mvc.ViewType.XML,
							viewData : oParkingSpaceData
						} ).addStyleClass ( "sapSplParkingSpaceCreateDialogContainerView" );

						this.oCreateParkingSpaceEditDialogView.byId ( "sapSplCreateEditParkingSpaceLatitude" ).attachLiveChange ( function ( oEvent ) {
							oEvent["isParkingSpace"] = true;
							that.splChangeCordinateInEditDialog ( oEvent );
						} );

						this.oCreateParkingSpaceEditDialogView.byId ( "sapSplCreateEditParkingSpaceLongitude" ).attachLiveChange ( function ( oEvent ) {
							oEvent["isParkingSpace"] = true;
							that.splChangeCordinateInEditDialog ( oEvent );
						} );

						this.aRenderedDialogs.push ( "sapSplParkingSpaceCreateDialogContainerView" );

						var oLeftButton = new sap.m.Button ( {
							text : oSapSplUtils.getBundle ( ).getText ( "NEW_CONTACT_SAVE" )
						} );
						var oRightButton = new sap.m.Button ( {
							text : oSapSplUtils.getBundle ( ).getText ( "CANCEL" )
						} );
						this.oCreateParkingSpaceEditDialogView.getController ( ).setToolbarInstance ( this.oMapToolbar );
						this.oCreateParkingSpaceEditDialogView.getController ( ).setLeftButton ( oLeftButton );
						this.oCreateParkingSpaceEditDialogView.getController ( ).setRightButton ( oRightButton );

						this.oParkingEditDialog = new sap.m.Dialog ( {
							showHeader : false,
							content : new sap.ui.commons.layout.VerticalLayout ( ).addStyleClass ( "viewHolderLayout" ).addContent ( this.oCreateParkingSpaceEditDialogView ),
							leftButton : oLeftButton,
							rightButton : oRightButton
						} ).addStyleClass ( "SplParkingSpaceCreateEditDialog" ).addStyleClass ( "sapSplHideDialog" ).open ( ).attachAfterClose ( function ( oEvent ) {
							/* Fix for 1580094753 */
							that.fnShowAllVisualObjectsOnMap ( "plotSelected" );
							that.fnBlockUnblockLiveAppUI ( "Unblock" );
// that.oMapToolbar.refreshMap ( );
							oEvent.getSource ( ).destroy ( );
						} ).attachAfterOpen ( function ( ) {
							oSapSplUtils.fnSyncStyleClass ( that.oParkingEditDialog );
							that.fnBlockUnblockLiveAppUI ( "Block" );
							jQuery.proxy ( that.fnRenderStyle ( ), that );
						} );

						$ ( ".sapMDialogBlockLayerInit" ).css ( "z-index", "0" );

						this.oParkingEditDialog.addEventDelegate ( {
							onAfterRendering : function ( oEvent ) {
								that.fnHandleDialogMove ( oEvent.srcControl );
								that.fnHandleDialogPositioning ( oEvent.srcControl );
							}
						} );

					},

					fnGetDataForParkingFacilityEdit : function ( oSelectedParkingFacility ) {
						var bFound, UUID;
						var oAllParkingFacilityData = {}, aSelectedParkingFacility = [], aAllParkingFacilityData = [];
						oAllParkingFacilityData = this.fnGetParkingSpaceFacilityData ( );

						aSelectedParkingFacility = oSelectedParkingFacility["Parking"].results;
						aAllParkingFacilityData = oAllParkingFacilityData.results;

						for ( var k = 0 ; k < aSelectedParkingFacility.length ; k++ ) {
							if ( aSelectedParkingFacility[k]["Category"] === "P" ) {
								aAllParkingFacilityData.push ( aSelectedParkingFacility[k] );
							}
						}

						for ( var i = 0 ; i < aAllParkingFacilityData.length ; i++ ) {
							bFound = false;
							UUID = "";
							for ( var j = 0 ; j < aSelectedParkingFacility.length ; j++ ) {

								if ( aSelectedParkingFacility[j]["Name"] === aAllParkingFacilityData[i]["Name"] ) {
									bFound = true;
									UUID = aSelectedParkingFacility[j]["FacilityUUID"];
									break;
								}
							}
							if ( bFound ) {
								aAllParkingFacilityData[i]["checked"] = true;
								aAllParkingFacilityData[i]["UUID"] = UUID;
							}
						}

						oSelectedParkingFacility["Parking"].results = aAllParkingFacilityData;
						return oSelectedParkingFacility;
					},

					fnGetParkingSpaceFacilityData : function ( ) {

						var facilityList = null;
						new splModels.odata.ODataModel ( {
							url : oSapSplUtils.getServiceMetadata ( "config", true ),
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
						} ).read ( "/LocationFacility", null, null, false, function ( oData ) {
							for ( var i = 0 ; i < oData.results.length ; i++ ) {
								oData.results[i].checked = false;
								oData.results[i].all = false;
							}
							facilityList = oData;

						}, function ( ) {

						} );
						return facilityList;
					},

					/**
					 * This function handles the dialog for creating parking space
					 * @param oViewData
					 * @returns void
					 * @since 1.0
					 * @private
					 */
					handleCreateParkingDialog : function ( oViewData ) {
						splReusable.libs.SapSplStyleSheetLoader.loadStyle ( "./resources/styles/sapSplParkingSpaceCreateDialog" );
						var that = this;
						oViewData["Latitude"] = oViewData["locationGeoCoords"][0]["lat"];
						oViewData["Longitude"] = oViewData["locationGeoCoords"][0]["long"];
						oViewData["Parking"] = {};
						oViewData["mode"] = "Create";
						oViewData["sDialogType"] = this.sLocationType;
						this.oCreateParkingSpaceDialogView = sap.ui.view ( {
							viewName : "splView.dialogs.SplParkingSpaceCreateEditDialog",
							type : sap.ui.core.mvc.ViewType.XML,
							viewData : oViewData
						} ).addStyleClass ( "sapSplParkingSpaceCreateDialogContainerView" );

						var oLeftButton = new sap.m.Button ( {
							text : oSapSplUtils.getBundle ( ).getText ( "NEW_CONTACT_SAVE" )
						} );
						var oRightButton = new sap.m.Button ( {
							text : oSapSplUtils.getBundle ( ).getText ( "CANCEL" )
						} );
						this.oCreateParkingSpaceDialogView.getController ( ).setToolbarInstance ( this.oMapToolbar );
						this.oCreateParkingSpaceDialogView.getController ( ).setLeftButton ( oLeftButton );
						this.oCreateParkingSpaceDialogView.getController ( ).setRightButton ( oRightButton );

						this.oParkingEditDialog = new sap.m.Dialog ( {
							showHeader : false,
							content : new sap.ui.commons.layout.VerticalLayout ( ).addStyleClass ( "viewHolderLayout" ).addContent ( this.oCreateParkingSpaceDialogView ),
							leftButton : oLeftButton,
							rightButton : oRightButton
						} ).addStyleClass ( "SplParkingSpaceCreateEditDialog" ).addStyleClass ( "sapSplHideDialog" ).attachAfterClose ( function ( oEvent ) {
							/* Fix for 1580094753 */
							that.fnShowAllVisualObjectsOnMap ( "plotSelected" );
							that.fnBlockUnblockLiveAppUI ( "Unblock" );
// that.oMapToolbar.refreshMap ( );
							oEvent.getSource ( ).destroy ( );
						} ).attachAfterOpen ( function ( ) {
							oSapSplUtils.fnSyncStyleClass ( that.oParkingEditDialog );
							that.fnBlockUnblockLiveAppUI ( "Block" );
							jQuery.proxy ( that.fnRenderStyle ( ), that );
						} );

						this.oParkingEditDialog.addEventDelegate ( {
							onAfterRendering : function ( oEvent ) {
								that.fnHandleDialogMove ( oEvent.srcControl );
								that.fnHandleDialogPositioning ( oEvent.srcControl );
							}
						} );

						this.oParkingEditDialog.open ( );

						this.aRenderedDialogs.push ( "sapSplParkingSpaceCreateDialogContainerView" );

					},

					/**
					 * This function is called when you add any location, to instantiate and open the create dialog.
					 * @param sCoord
					 * @return void
					 * @since 1.0
					 * @private
					 */
					fnInstantiateAndOpenCreateLocationDialog : function ( sCoord ) {
						var that = this;
						var oLocationData;

						if ( this.sLocationType === "LC0004" || this.sLocationType === "LC0008" ) {

							oLocationData = this.fnGetEmptyLocationObjectForCreate ( sCoord, "Geofence" );

						} else {

							var sCoordString = sCoord["locationGeoCoords"][0]["long"] + ";" + sCoord["locationGeoCoords"][0]["lat"] + ";" + sCoord["locationGeoCoords"][0]["alt"];
							oLocationData = this.fnGetEmptyLocationObjectForCreate ( sCoordString, "POI" );

						}
						this.fnPreventEnableMapRefresh ( "Prevent" );

// oSapSplMapsDataMarshal.fnEditFences(oLocationData,
// this.byId("oSapSplLiveAppMap"));
						splReusable.libs.SapSplStyleSheetLoader.loadStyle ( "./resources/styles/sapSplCreateEditLocationDialog" );

						this.oSapSplLocationCreateEditDialogInstance = null;

						if ( !this.oSapSplLocationCreateEditDialogInstance ) {

							sap.ui.getCore ( ).setModel ( new sap.ui.model.json.JSONModel ( ), "sapSplLocationCreateEditDialogModel" );

							var oSapSplLocationCreateEditDialogViewInstance = sap.ui.view ( {
								viewName : "splView.dialogs.SplCreateEditLocationDialog",
								type : sap.ui.core.mvc.ViewType.XML,
								viewData : [that.sLocationType, "Create"]
							} ).setModel ( sap.ui.getCore ( ).getModel ( "sapSplLocationCreateEditDialogModel" ) ).addStyleClass ( "sapSplLocationCreateDialogContainerView" );

							var oLeftButton = new sap.m.Button ( {
								text : oSapSplUtils.getBundle ( ).getText ( "OK" ),
								press : jQuery.proxy ( oSapSplLocationCreateEditDialogViewInstance.getController ( ).handlePressOfDialogOK, oSapSplLocationCreateEditDialogViewInstance.getController ( ) )
							} );

							var oRightButton = new sap.m.Button ( {
								text : oSapSplUtils.getBundle ( ).getText ( "CANCEL" ),
								press : jQuery.proxy ( oSapSplLocationCreateEditDialogViewInstance.getController ( ).handlePressOfDialogCancel, oSapSplLocationCreateEditDialogViewInstance.getController ( ) )
							} );

							oSapSplLocationCreateEditDialogViewInstance.getController ( ).setLiveAppControllerInstance ( this );

							this.oSapSplLocationCreateEditDialogInstance = new sap.m.Dialog ( {
								beginButton : oLeftButton,
								endButton : oRightButton,
								showHeader : false,
								content : new sap.ui.commons.layout.VerticalLayout ( ).addStyleClass ( "viewHolderLayout" ).addContent ( oSapSplLocationCreateEditDialogViewInstance )
							} ).addStyleClass ( "SplLocationCreateEditDialog" );// .addStyleClass
							// (
							// "sapSplHideDialog"
							// );

							this.oSapSplLocationCreateEditDialogInstance.attachAfterClose ( function ( ) {
								/* Fix for 1580094753 */
								that.fnShowAllVisualObjectsOnMap ( "plotSelected" );
								that.fnPreventEnableMapRefresh ( "Enable" );
								that.fnBlockUnblockLiveAppUI ( "Unblock" );
								that.oSapSplLocationCreateEditDialogInstance = null;
								/*
								 * Fix for 1580168985 Hides the blocker div of
								 * dialog.
								 */
								$ ( ".sapUiBliLy" ).removeClass ( 'splReduceDivHeight' );
							} );

							this.oSapSplLocationCreateEditDialogInstance.attachAfterOpen ( function ( oEvent ) {
								oSapSplUtils.fnSyncStyleClass ( that.oSapSplLocationCreateEditDialogInstance );
							} );

							this.oSapSplLocationCreateEditDialogInstance.addEventDelegate ( {
								onAfterRendering : function ( oEvent ) {
									that.fnHandleDialogMove ( oEvent.srcControl );
									that.fnHandleDialogPositioning ( oEvent.srcControl );
								}
							} );

							oSapSplLocationCreateEditDialogViewInstance.addEventDelegate ( {
								onAfterRendering : function ( oEvent ) {
									that.fnHandleDialogMove ( oEvent.srcControl.getParent ( ).getParent ( ) );
									that.fnHandleDialogPositioning ( oEvent.srcControl.getParent ( ).getParent ( ) );
								}
							} );

						}

						this.oSapSplLocationCreateEditDialogInstance.open ( );
						/* Fix for 1580168985 Hides the blocker div of dialog. */
						$ ( ".sapUiBliLy" ).addClass ( 'splReduceDivHeight' );
						sap.ui.getCore ( ).getModel ( "sapSplLocationCreateEditDialogModel" ).setData ( oLocationData );
						this.aRenderedDialogs.push ( "sapSplLocationCreateDialogContainerView" );
						this.fnBlockUnblockLiveAppUI ( "Block", "addGeofence" );
					},

					/**
					 * This function is called when you click on Add Geofence button in the footer
					 * @param void
					 * @return void
					 * @since 1.0
					 * @private
					 */
					fnAddGeofence : function ( ) {

						this.sLocationType = "LC0004";

						// Enables the click event on Map.
						oSapSplMapsDataMarshal.isMapClickEabled = true;

						// Prevents the Map refresh while the creation of
						// location
						this.fnPreventEnableMapRefresh ( "Prevent" );

						// Changes the cursor to pencil while creation of
						// location
						oSapSplMapsDataMarshal.fnChangeCursor ( "pencil" );

						this.fnBlockUnblockLiveAppUI ( "Block", "addGeofence" );

						// CSN FIX : 0120031469 649181
						this.byId ( "sapSplLocationCreateCancelButton" ).setVisible ( true );
						this.byId ( "sapSplTrafficStatusFooter" ).addStyleClass ( "sapSplHiddenBar" );

					},

					/**
					 * Gets the enums for location create.
					 * @param fnSuccess
					 * @param fnError
					 * @returns void
					 * @since 1.0
					 * @private
					 */
					getLocationViewEnum : function ( ) {

						function fnSuccess ( oData ) {

							this.oLocationViewEnum = [];
							for ( var i = 0 ; i < oData.results.length ; i++ ) {
								if ( oData.results[i]["Value"] !== "LC0004" && oData.results[i]["Value"] !== "LC0008" ) {
									this.oLocationViewEnum.push ( oData.results[i] );
									// CSN FIX : 0120061532 0001485156 2014
									this.byId ( "addPointOfInterestButton" ).setVisible ( true );
								} else {
									this.byId ( "addGeofenceButton" ).setVisible ( true );
								}
							}
						}

						function fnError ( ) {
							jQuery.sap.log.error ( "getLocationViewEnum", "read failed", "liveApp.controller.js" );
							throw new Error ( "getLocationViewEnum function failed" );
						}

						/*
						 * HOTFIX: Encode filter parameter to handle escaping of
						 * extra characters
						 */
						oSapSplBusyDialog.getBusyDialogInstance ( ).open ( );
						this.oSapSplApplModel.read ( "/LocationCreateEnum", null, null, true, jQuery.proxy ( fnSuccess, this ), jQuery.proxy ( fnError, this ) );
						oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
						// Hides the blocker div of dialog.
						jQuery ( ".sapUiBLy" ).css ( "z-index", "0" );
					},

					/**
					 * This function is called when you click on Add Point of Interests button in the footer
					 * @param void
					 * @return void
					 * @since 1.0
					 * @priavte
					 */
					fnAddPointOfInterest : function ( ) {
						var oTemplateButton = null;
						var that = this;
						oTemplateButton = new sap.m.Button ( {
							text : "{Value.description}",
							press : function ( oEvent ) {
								that.sLocationType = oEvent.getSource ( ).getBindingContext ( ).getProperty ( "Value" );

								// Enables the click event on Map.
								oSapSplMapsDataMarshal.isMapClickEabled = true;

								// Prevents the Map refresh while the creation
								// of location
								that.fnPreventEnableMapRefresh ( "Prevent" );

								// Changes the cursor to pencil while creation
								// of location
								oSapSplMapsDataMarshal.fnChangeCursor ( "pencil" );

								that.fnBlockUnblockLiveAppUI ( "Block", "addPOI" );

								// CSN FIX : 0120031469 649181
								that.byId ( "sapSplLocationCreateCancelButton" ).setVisible ( true );
								that.byId ( "sapSplTrafficStatusFooter" ).addStyleClass ( "sapSplHiddenBar" );
							}
						} );

						if ( !this.oGeoFenceTypeDataJSONModel ) {
							var oPointOfInterestsTypes = {};
							oPointOfInterestsTypes["results"] = this.oLocationViewEnum;

							this.oGeoFenceTypeDataJSONModel = new sap.ui.model.json.JSONModel ( oPointOfInterestsTypes );
						}

						var oActionSheet = new sap.m.ActionSheet ( {
							buttons : {
								path : "/results",
								template : oTemplateButton
							},
							placement : sap.m.PlacementType.Top
						} ).setModel ( this.oGeoFenceTypeDataJSONModel );

						oActionSheet.openBy ( this.byId ( "addPointOfInterestButton" ) );
					},

					/*************************************************
					 * **********************************************
					 * **********************************************
					 * ******SEND MESSAGE RELATED METHOD START*******
					 * **********************************************
					 * **********************************************
					 ************************************************/

					/**
					 * This function is called when you click on Contact Business Partner button in the footer
					 * @param void
					 * @return void
					 * @since 1.0
					 * @praivate
					 */
					fnOpenBusinessPartnerMessageDialog : function ( ) {
						var that = this;
						splReusable.libs.SapSplStyleSheetLoader.loadStyle ( "./resources/styles/sapSplSendMessageBusinessPartnerDialog" );
						splReusable.libs.SapSplStyleSheetLoader.loadStyle ( "./resources/styles/sapSplSendMessageDialog" );
						var dialog = sap.ui.view ( {
							viewName : "splView.dialogs.SplSendMessageBusinessPartnerDialog",
							type : sap.ui.core.mvc.ViewType.XML
						} ).addStyleClass ( "sendMessageBusinessPartnerDialogContainerView" );

						this.oSendMessageBusinessPartnerParentDialog = new sap.m.Dialog ( {
							showHeader : false,
							content : new sap.ui.commons.layout.VerticalLayout ( ).addStyleClass ( "viewHolderLayout" ).addContent ( dialog )
						} ).addStyleClass ( "splSendMessageBusinessPartnerDialog" ).open ( );

						// FIX FOR CSN : 0120031469 787467 2014
						this.oSendMessageBusinessPartnerParentDialog.attachAfterOpen ( function ( ) {
							oSapSplUtils.fnSyncStyleClass ( that.oSendMessageBusinessPartnerParentDialog );
							that.fnPreventEnableMapRefresh ( "Prevent" );
						} );

						this.oSendMessageBusinessPartnerParentDialog.attachAfterClose ( function ( ) {
							that.fnPreventEnableMapRefresh ( "Enable" );
						} );

						this.aRenderedDialogs.push ( "viewHolderLayout" );

						dialog.getController ( ).setParentDialogInstance ( this.oSendMessageBusinessPartnerParentDialog );
					},

					/**
					 * Function that enables to select multiple Geofences on the Map
					 * @returns void
					 * @param oResult
					 * @since 1.0
					 * @private
					 */
					handleSelectDeselectFence : function ( oResult ) {
						oSapSplMapsDataMarshal.fnSelectDeselectFences ( oResult, this.byId ( "oSapSplLiveAppMap" ), jQuery.proxy ( this.oSendMessageDialogView.getController ( ).fnHandleClickOfGeofenceOnTheMap, this.oSendMessageDialogView
								.getController ( ) ) );
					},

					/**
					 * Method to handle click of one of the action sheet item.
					 * this method opens a new dialog to send messages
					 * @param oEvent {object} event object of the click event.
					 * @returns void.
					 * @since 1.0
					 * @private
					 */
					fnHandleSelectOfActionSheetItem : function ( oEvent ) {
						var that = this, oViewData = {}, oOpenedMode = {};
						this.sEventText = jQuery.extend ( true, {}, oEvent );
						splReusable.libs.SapSplStyleSheetLoader.loadStyle ( "./resources/styles/sapSplSendMessageDialog" );

						if ( oEvent.getSource ( ).getText ( ) === oSapSplUtils.getBundle ( ).getText ( "SELECT_TRUCKS_VIA_DISPLAY_AREA" ) ) {

							oViewData = {
								mode : "Views",
								liveAppInstance : this.byId ( "oSapSplLiveAppMap" ),
								sSelectedDisplayArea : this.oMapToolbar.getContentLeft ( )[2].getText ( )
							};
							oOpenedMode = {
								mode : "View"
							};
							this.isSelectMultipleTrucksEnabled = true;
							this.isGeofenceClickEnabled = false;

						} else if ( oEvent.getSource ( ).getText ( ) === oSapSplUtils.getBundle ( ).getText ( "SELECT_VIA_GEOFENCE" ) ) {
							oOpenedMode = {
								mode : "Geofence"
							};
							this.isSelectMultipleGeofencesEnabled = true;
							this.isTruckClickEnabled = false;

						} else if ( oEvent.getSource ( ).getText ( ) === oSapSplUtils.getBundle ( ).getText ( "SELECT_TRUCK_ON_MAP" ) ) {
							oOpenedMode = {
								mode : "TruckOnMap"
							};
							oViewData = {
								mode : "Trucks"
							};
							this.isSelectMultipleTrucksEnabled = true;
							this.isGeofenceClickEnabled = false;

						} else if ( oEvent.getSource ( ).getText ( ) === oSapSplUtils.getBundle ( ).getText ( "SELECT_ALL_MY_TRUCKS_ON_MAP" ) || oEvent.getSource ( ).getText ( ) === oSapSplUtils.getBundle ( ).getText ( "SELECT_ALL_TRUCKS_ON_MAP" ) ) {
							oOpenedMode = {
								mode : "AllTrucksOnMap"
							};
							oViewData = {
								mode : "All_Trucks",
								trucks : this.aTruckArray,
								liveAppInstance : this.byId ( "oSapSplLiveAppMap" )
							};
							this.isSelectMultipleTrucksEnabled = true;
							this.isGeofenceClickEnabled = false;
						}

						// Send message to truck dialog parent view.
						this.oSendMessageDialogView = sap.ui.view ( {
							viewName : "splView.dialogs.SplSendMessageDialog",
							type : sap.ui.core.mvc.ViewType.XML,
							viewData : oViewData
						} ).addStyleClass ( "sendMessageDialogContainerView" );

						// Send message to truck dialog
						this.oSendMessageParentDialog = new sap.m.Dialog ( {
							showHeader : false,
							content : new sap.ui.commons.layout.VerticalLayout ( ).addStyleClass ( "viewHolderLayout" ).addContent ( this.oSendMessageDialogView )
						} ).addStyleClass ( "splSendMessageDialog" ).addStyleClass ( "sapSplHideDialog" ).open ( );

						this.aRenderedDialogs.push ( "viewHolderLayout" );

						// Handles the functions that happens after you open the
						// dialog
						this.oSendMessageParentDialog.attachAfterOpen ( function ( ) {
							oSapSplUtils.fnSyncStyleClass ( that.oSendMessageParentDialog );

							setTimeout ( function ( ) {
								if ( sap.ui.getCore ( ).byId ( $ ( ".sapSplMessageToRecipientTextArea" ).attr ( "id" ) ) ) {
									sap.ui.getCore ( ).byId ( $ ( ".sapSplMessageToRecipientTextArea" ).attr ( "id" ) ).focus ( );
								}
							}, 100 );

							that.fnBlockUnblockLiveAppUI ( "Block", "sendMessage" );
							that.fnPreventEnableMapRefresh ( "Prevent" );
						} );

						// Handles the functions that happens after you close
						// the dialog
						this.oSendMessageParentDialog.attachAfterClose ( function ( ) {
							that.isSelectMultipleTrucksEnabled = false;
							that.isSelectMultipleGeofencesEnabled = false;
							that.fnBlockUnblockLiveAppUI ( "Unblock" );
							that.fnPreventEnableMapRefresh ( "Enable" );
							oSapSplMapsDataMarshal.fnResetValues ( that.byId ( "oSapSplLiveAppMap" ) );
							if ( this.mode === "Geofence" ) {
								that.fnShowAllVisualObjectsOnMap ( "PlotLocally" );
							}
						}.bind ( oOpenedMode ) );
						this.oSendMessageDialogView.getController ( ).setParentDialogInstance ( this.oSendMessageParentDialog, this );

						this.oSendMessageParentDialog.addEventDelegate ( {
							onAfterRendering : function ( oEvent ) {
								that.fnHandleDialogMove ( oEvent.srcControl );
								that.fnHandleDialogPositioning ( oEvent.srcControl );
							}
						} );
					},

					/**
					 * This function is called when you click on Send Message to Trucks button in the footer
					 * @param void
					 * @return void
					 * @since 1.0
					 * @private
					 */
					fnOpenSendMessageToTruckActionSheet : function ( ) {
						var that = this;
						var sTextLabel;
						if ( !oSapSplUtils.getCompanyDetails ( ).canChangeSearch ) {
							sTextLabel = oSapSplUtils.getBundle ( ).getText ( "SELECT_ALL_TRUCKS_ON_MAP" );
						} else {
							sTextLabel = oSapSplUtils.getBundle ( ).getText ( "SELECT_ALL_MY_TRUCKS_ON_MAP" );
						}
						var oActionSheetData = {
							results : [{
								"Value" : sTextLabel,
								"visible" : splReusable.libs.SapSplModelFormatters.sapSplGetVisibilityBasedOnSubscriptionModel ( sap.ui.getCore ( ).getModel ( "sapSplAppConfigDataModel" ).getData ( )["canSendMessageToTruck"] )
							}, {
								"Value" : oSapSplUtils.getBundle ( ).getText ( "SELECT_TRUCKS_VIA_DISPLAY_AREA" ),
								"visible" : splReusable.libs.SapSplModelFormatters.sapSplGetVisibilityBasedOnSubscriptionModel ( sap.ui.getCore ( ).getModel ( "sapSplAppConfigDataModel" ).getData ( )["canSendMessageToTruck"] )
							}, {
								"Value" : oSapSplUtils.getBundle ( ).getText ( "SELECT_TRUCK_ON_MAP" ),
								"visible" : splReusable.libs.SapSplModelFormatters.sapSplGetVisibilityBasedOnSubscriptionModel ( sap.ui.getCore ( ).getModel ( "sapSplAppConfigDataModel" ).getData ( )["canSendMessageToTruck"] )
							}, {
								"Value" : oSapSplUtils.getBundle ( ).getText ( "SELECT_VIA_GEOFENCE" ),
								"visible" : splReusable.libs.SapSplModelFormatters.sapSplGetVisibilityBasedOnSubscriptionModel ( sap.ui.getCore ( ).getModel ( "sapSplAppConfigDataModel" ).getData ( )["canSendMessageToGeofence"] )
							}]
						};

						if ( !this.oActionSheetJSONModel ) {
							this.oActionSheetJSONModel = new sap.ui.model.json.JSONModel ( oActionSheetData );
						}

						var oTemplateButton = new sap.m.Button ( {
							text : "{Value}",
							visible : "{visible}",
							press : function ( oEvent ) {
								that.fnHandleSelectOfActionSheetItem ( oEvent );
							}
						} );

						var oActionSheet = new sap.m.ActionSheet ( {
							buttons : {
								path : "/results",
								template : oTemplateButton
							},
							placement : sap.m.PlacementType.Top
						} ).setModel ( this.oActionSheetJSONModel );
						oActionSheet.attachAfterClose ( function ( oEvent ) {
							oEvent.getSource ( ).destroy ( );
						} );
						oActionSheet.openBy ( this.byId ( "oSendMessageToTruckButton" ) );
					},

					fnHandleOpenOfLeftPanelSortDialog : function ( ) {

						var viewData = {}, i;
						viewData.groupList = [{
							GroupName : oSapSplUtils.getBundle ( ).getText ( "SHARING" ),
							FieldName : "isPublic"
						}, {
							GroupName : oSapSplUtils.getBundle ( ).getText ( "COMPANY" ),
							FieldName : "OwnerName"
						}, {
							GroupName : oSapSplUtils.getBundle ( ).getText ( "TYPE" ),
							FieldName : "isRadar"
						}];

						viewData.sorterField = "";
						var aSorters = this.byId ( "SapSplLeftPanelList" ).getBinding ( "items" ).aSorters;
						for ( i = 0 ; i < aSorters.length ; i++ ) {
							if ( aSorters[i].fnGroup ) {
								viewData.sorterField = this.byId ( "SapSplLeftPanelList" ).getBinding ( "items" ).aSorters[0].sPath;
							}
						}

						var leftPanelGroupByDialogView = sap.ui.view ( {
							viewName : "splView.dialogs.SplLeftPanelGroupByDialog",
							type : sap.ui.core.mvc.ViewType.XML,
							viewData : viewData
						} );

						var leftPanelGroupByDialog = new sap.m.Dialog ( {
							title : oSapSplUtils.getBundle ( ).getText ( "GROUP_BY" ),
							content : leftPanelGroupByDialogView
						} ).addStyleClass ( "sapSnlhleftPanelGroupByDialog" ).open ( );

						leftPanelGroupByDialog.attachAfterOpen ( function ( ) {
							oSapSplUtils.fnSyncStyleClass ( leftPanelGroupByDialog );
						} );

						leftPanelGroupByDialogView.getController ( ).setParentDialogInstance ( leftPanelGroupByDialog );

					},

					fnHandleConfirmOfViewSettingsDialog : function ( oEvent ) {

						var that = this, sPath, sValue;
						var sGroupSelected = null, aFiltersSelected = [], aItemSplit = [];
						var oSorter = {};
						var oNameSorter = new sap.ui.model.Sorter ( "Name", false );
						var mParams = oEvent.getParameters ( );
						var oBinding = sap.ui.getCore ( ).byId ( "splView.liveApp.liveApp--SapSplLeftPanelList" ).getBinding ( "items" );

						if ( mParams.groupItem ) {
							sGroupSelected = mParams.groupItem.getKey ( );
							oSorter = new sap.ui.model.Sorter ( sGroupSelected, mParams.groupDescending, this.handleGroupingOfLocations );
							sap.ui.getCore ( ).byId ( "splView.liveApp.liveApp--SapSplLeftPanelList" ).getBinding ( "items" ).sort ( [] );
							sap.ui.getCore ( ).byId ( "splView.liveApp.liveApp--SapSplLeftPanelList" ).getBinding ( "items" ).sort ( [oSorter, oNameSorter] );
						}

						if ( mParams.filterItems.length > 0 ) {
							aFiltersSelected.push ( new sap.ui.model.Filter ( "Tag", sap.ui.model.FilterOperator.EQ, "LC0004" ) );
							aFiltersSelected.push ( new sap.ui.model.Filter ( "Tag", sap.ui.model.FilterOperator.EQ, "LC0008" ) );

							jQuery.each ( mParams.filterItems, function ( i, oItem ) {
								if ( oItem.getKey ( ) !== "None" ) {
									aItemSplit = oItem.getKey ( ).split ( "_" );
									sPath = aItemSplit[0];
									sValue = aItemSplit[2];
									aFiltersSelected.push ( new sap.ui.model.Filter ( sPath, sap.ui.model.FilterOperator.EQ, sValue ) );
									that.byId ( "sapSnlhGroupFilterInfoToolbar" ).removeStyleClass ( "sapSnlhInfoToolbarHeight" );
									if ( sValue === "0" ) {
										that.byId ( "sapSnlhGroupTitlelabelInfoToolBar" ).setText ( oSapSplUtils.getBundle ( ).getText ( "FILTER_BY_GEOFENCE" ) );
									} else if ( sValue === "1" ) {
										that.byId ( "sapSnlhGroupTitlelabelInfoToolBar" ).setText ( oSapSplUtils.getBundle ( ).getText ( "FILTER_BY_RADAR" ) );
									}
								} else {
									that.byId ( "sapSnlhGroupFilterInfoToolbar" ).addStyleClass ( "sapSnlhInfoToolbarHeight" );
								}

							} );
							oBinding.filter ( aFiltersSelected );
						}
						/*
						 * else{
						 * sap.ui.getCore().byId("splView.liveApp.liveApp--SapSplLeftPanelList").getBinding("items").sort([oNameSorter]); }
						 */

						this.byId ( "sapSplSelectAllLocationsCheckBox" ).setSelected ( false );

					},

					/*
					 * Bug fix 1580169097 : "None" option selected after
					 * clearing filters
					 */
					fnHandleResetOfFiltersInDialog : function ( oEvent ) {
						if ( oEvent.getSource ( ).getFilterItems ( ) && oEvent.getSource ( ).getFilterItems ( )[0].getItems ( )[2] ) {
							oEvent.getSource ( ).getFilterItems ( )[0].getItems ( )[2].setSelected ( true );
						}
					},

					fnHandleOpenOfLeftPanelGroupFilterDialog : function ( oEvent ) {
						var that = this;
						if ( !this.oGroupFilterGeofencesViewSettingDialog ) {
							this.oGroupFilterGeofencesViewSettingDialog = new sap.m.ViewSettingsDialog ( {
								confirm : that.fnHandleConfirmOfViewSettingsDialog.bind ( that ),
								resetFilters : that.fnHandleResetOfFiltersInDialog.bind ( that ),
								filterItems : [new sap.m.ViewSettingsFilterItem ( {
									multiSelect : false,
									key : "Type",
									text : oSapSplUtils.getBundle ( ).getText ( "TYPE" ),
									items : {
										path : "/filters",
										template : new sap.m.ViewSettingsItem ( {
											key : "{value}",
											text : "{text}",
											selected : "{selectValue}"
										} )
									}
								} )],
								groupItems : {
									path : "/groups",
									template : new sap.m.ViewSettingsItem ( {
										key : "{FieldName}",
										text : "{GroupName}",
										selected : "{SelectValue}"
									} )
								}
							} ).setModel ( new sap.ui.model.json.JSONModel ( {
								groups : [{
									GroupName : oSapSplUtils.getBundle ( ).getText ( "SHARING" ),
									FieldName : "sIsShared",
									SelectValue : true
								}, {
									GroupName : oSapSplUtils.getBundle ( ).getText ( "COMPANY" ),
									FieldName : "OwnerName",
									SelectValue : false
								}],
								filters : [{
									text : oSapSplUtils.getBundle ( ).getText ( "GEOFENCE_UNIDIRECTIONAL" ),
									value : "isRadar_eq_0",
									selectValue : false
								}, {
									text : oSapSplUtils.getBundle ( ).getText ( "GEOFENCE_BIDIRECTIONAL" ),
									value : "isRadar_eq_1",
									selectValue : false
								}, {
									text : oSapSplUtils.getBundle ( ).getText ( "FILTER_LABEL_NONE" ),
									value : "None",
									selectValue : true
								}]
							} ) );
						}
						if ( oEvent.getSource ( ).getId ( ) === "splView.liveApp.liveApp--sapSplLeftPanelGroupButton" ) {
							this.oGroupFilterGeofencesViewSettingDialog.setTitle ( oSapSplUtils.getBundle ( ).getText ( "GROUP_BY" ) );
							this.oGroupFilterGeofencesViewSettingDialog.open ( "group" );
						} else {
							this.oGroupFilterGeofencesViewSettingDialog.setTitle ( oSapSplUtils.getBundle ( ).getText ( "FILTER_BY" ) );
							this.oGroupFilterGeofencesViewSettingDialog.open ( "group" );
						}

						this.oGroupFilterGeofencesViewSettingDialog._dialog.attachAfterOpen ( function ( oEvent ) {

							if ( oEvent.getSource ( ).getContent ( )[0].getPages ( )[0].getContent ( )[1].getItems ( )[2] ) {
								oEvent.getSource ( ).getContent ( )[0].getPages ( )[0].getContent ( )[1].getItems ( )[2].setVisible ( false );
							}
							if ( oEvent.getSource ( ).getContent ( )[0].getPages ( )[0].getContent ( )[1].indexOfItem ( oEvent.getSource ( ).getContent ( )[0].getPages ( )[0].getContent ( )[1].getSelectedItem ( ) ) === 2 ) {
								if ( oEvent.getSource ( ).getContent ( )[0].getPages ( )[0].getContent ( )[1].getItems ( )[0] ) {
									oEvent.getSource ( ).getContent ( )[0].getPages ( )[0].getContent ( )[1].getItems ( )[0].setSelected ( true );
								}
							}

							/*
							 * To remove the "None" option that appears when
							 * groupBy is selected from the filter button
							 */
							if ( that.oGroupFilterGeofencesViewSettingDialog.getTitle ( ) === oSapSplUtils.getBundle ( ).getText ( "FILTER_BY" ) ) {
								for ( var i = 0 ; i < $ ( ".sapMSegBBtn" ).length ; i++ ) {
									if ( $ ( $ ( ".sapMSegBBtn" )[i] ).attr ( "id" ) && $ ( $ ( ".sapMSegBBtn" )[i] ).attr ( "id" ).search ( "filterbutton" ) !== -1 ) {
										sap.ui.getCore ( ).byId ( $ ( $ ( ".sapMSegBBtn" )[i] ).attr ( "id" ) ).firePress ( );
										break;
									}
								}

							}

						} );
					}
				} );
