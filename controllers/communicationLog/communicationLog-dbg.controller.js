/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.require ( "sap.ui.core.util.Export" );
jQuery.sap.require ( "sap.ui.core.util.ExportTypeCSV" );
jQuery.sap.require ( "sap.ui.comp.filterbar.FilterBar" );

sap.ui
		.controller (
				"splController.communicationLog.communicationLog",
				{
					/**
					 * Called when a controller is instantiated and its View controls (if available) are already created.
					 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
					 */
					onInit : function ( ) {
						this.oResponseCodeObject = {};
						this.oServicePathsObject = {};
						this.selectedTime = [];
						this.selectedResponseCode = [];
						this.selectedDirection = [];
						this.selectedServicePaths = [];
						this.customDate1 = null;
						this.customDate2 = null;
						var that = this, oNowDate = new Date ( );

						var oData = {
							time : this.getTimeHorizonEnum ( ),
							direction : this.getDirectionEnum ( ),
							responseCodes : []
						};

						this.byId ( "timeHorizonSelect" ).addEventDelegate ( {
							onAfterRendering : function ( oEvent ) {
								oEvent.srcControl.$ ( ).on ( "focusout", function ( oEvent ) {
									oEvent.stopPropagation ( );
								} );
							}
						} );

						this.sapSplCommunicationLogModel = new sap.ui.model.json.JSONModel ( oData );
						this.byId ( "filterBar" ).setModel ( this.sapSplCommunicationLogModel );
						/* CSNFIX - 1570462037,     1570462036 */
						sap.ui.getCore ( ).getModel ( "CommunicationLogODataModel" ).attachRequestCompleted ( function ( ) {
							that.byId ( "SapSplCommunicationLogTable" ).setBusy ( false );
						} );

						/* CSNFIX - 1570462037,     1570462036 */
						sap.ui.getCore ( ).getModel ( "CommunicationLogODataModel" ).attachRequestFailed ( function ( ) {
							that.byId ( "SapSplCommunicationLogTable" ).setBusy ( false );
						} );

						/* CSNFIX - 1570462037,     1570462036 */
						function onAfterTableRendering ( oTable ) {
							that.byId ( "sapSplCommunicationLogLoggedEvents" ).setText ( oSapSplUtils.getBundle ( ).getText ( "LOGGED_EVENTS", oTable.getItems ( ).length.toString ( ) ) );

							if ( oTable.getItems ( ).length === 0 ) {
								that.oResponseCodeObject = {};
								that.oServicePathsObject = {};
								that.byId ( "sapSplComLogDelete" ).setEnabled ( false );
							} else {
								that.byId ( "sapSplComLogDelete" ).setEnabled ( true );
							}

							var aResponseCodeArray = [], aServicePathsArray = [], oModelData = null;
							jQuery.each ( that.oResponseCodeObject, function ( sKey, oValue ) {
								aResponseCodeArray.push ( {
									value : oValue,
									value_description : sKey
								} );
							} );

							jQuery.each ( that.oServicePathsObject, function ( sKey ) {
								aServicePathsArray.push ( {
									value : sKey,
									value_description : sKey
								} );
							} );

							oModelData = that.sapSplCommunicationLogModel.getData ( );
							oModelData.responseCodes = aResponseCodeArray;
							oModelData.servicePaths = aServicePathsArray;
							that.sapSplCommunicationLogModel.setData ( oModelData );
						}

						this.byId ( "SapSplCommunicationLogTable" ).setModel ( sap.ui.getCore ( ).getModel ( "CommunicationLogODataModel" ) );
						this.byId ( "SapSplCommunicationLogTable" ).getBinding ( "items" ).sort ( new sap.ui.model.Sorter ( "StartTime", true ) );
						this.byId ( "SapSplCommunicationLogTable" ).getBinding ( "items" ).filter (
								new sap.ui.model.Filter ( "StartTime", sap.ui.model.FilterOperator.GT, "datetime'" + (new Date ( oNowDate.setMinutes ( oNowDate.getMinutes ( ) - 10 ) )) + "'" ) );

						sap.ui.getCore ( ).getModel ( "CommunicationLogODataModel" ).attachRequestCompleted ( function ( ) {
							onAfterTableRendering ( that.byId ( "SapSplCommunicationLogTable" ) );
						} );

						/* HOTFIX - comment the above code in case onAfterRendering works */
						this.byId ( "SapSplCommunicationLogTable" ).addEventDelegate ( {
							onAfterRendering : function ( oEvent ) {
								onAfterTableRendering ( oEvent.srcControl );
							}
						} );

						this.byId ( "SapSplCommunicationLogTableListItem" ).addEventDelegate ( {
							onAfterRendering : function ( oEvent ) {
								oEvent.srcControl.getParent ( ).setBusy ( false );
								if ( oEvent.srcControl.getBindingContext ( ) ) {
									if ( oEvent.srcControl.getParent ( ).indexOfItem ( oEvent.srcControl ) === 0 ) {
										that.oResponseCodeObject = {};
										that.oServicePathsObject = {};
									}
									var iResponseCode = oEvent.srcControl.getBindingContext ( ).getProperty ( ).ResponseCode;
									var sPackage = oEvent.srcControl.getBindingContext ( ).getProperty ( ).Package;
									var startTime = oEvent.srcControl.getBindingContext ( ).getProperty ( ).StartTime_1;
									var oTime = that.oResponseCodeObject[iResponseCode];
									if ( oTime === undefined ) {
										oTime = startTime;
									} else {
										if ( new Date ( oTime ).getTime ( ) > new Date ( startTime ).getTime ( ) ) {
											oTime = startTime;
										}
									}
									that.oResponseCodeObject[iResponseCode] = oTime;
									that.oServicePathsObject[sPackage] = {};

									if ( oEvent.srcControl.getParent ( ).indexOfItem ( oEvent.srcControl ) === oEvent.srcControl.getParent ( ).getItems ( ).length - 1 ) {
										onAfterTableRendering ( oEvent.srcControl.getParent ( ) );
									}

								}
							}
						} );

						this.byId ( "filterBar" ).addEventDelegate ( {
							onAfterRendering : function ( ) {
								$ ( ".sapSplServicesPathMultiInput" ).parent ( ).parent ( ).css ( "width", "40%" );
								var iButtonLength = $ ( ".communicationLogFilterBar .sapUiCompFilterBarToolbar" ).find ( ".sapMBtn" ).length;
								$ ( ".communicationLogFilterBar .sapUiCompFilterBarToolbar" ).find ( ".sapMBtn" ).css ( "display", "none" );
								$ ( $ ( ".communicationLogFilterBar .sapUiCompFilterBarToolbar" ).find ( ".sapMBtn" )[0] ).css ( "display", "block" );
								$ ( $ ( ".communicationLogFilterBar .sapUiCompFilterBarToolbar" ).find ( ".sapMBtn" )[iButtonLength - 1] ).css ( "display", "block" );
							}
						} );

						this.sSelectedTimeHorizon = "10";

						this.instantiatePersoService ( );

						this.mGroupFunctions = {
							Direction : function ( oContext ) {
								var sDirection = oContext.getProperty ( "Direction" );
								if ( sDirection === "O" ) {
									return {
										text : oSapSplUtils.getBundle ( ).getText ( "OUTBOUND_DIRECTION" ),
										key : sDirection
									};
								} else {
									return {
										text : oSapSplUtils.getBundle ( ).getText ( "INBOUND_DIRECTION" ),
										key : sDirection
									};
								}
							},
							Object : function ( oContext ) {
								var sObject = oContext.getProperty ( "Object" );
								return {
									text : sObject,
									key : sObject
								};
							},
							ResponseCode : function ( oContext ) {
								var sResponseCode = oContext.getProperty ( "ResponseCode" );
								return {
									text : sResponseCode,
									key : sResponseCode
								};
							}
						};

						this.getView ( ).addEventDelegate ( {
							onAfterShow : function ( ) {
								window.setTimeout ( function ( ) {
									that.getView ( ).byId ( "timeHorizonSelect" ).focus ( );
								}, 100 );
							}
						} );

//        that.oTablePersoDialog.mAggregations._tablePersoDialog._oDialog.addEventDelegate({
//            onAfterShow: function(){
////                this.oTablePersoDialog.mAggregations._tablePersoDialog._oDialog.attachAfterClose(function(){
////                    var that = this;
//                    that.getView.byId("timeHorizonSelect").focus();
//               /// });    
//            }
//        });

					},

					onBeforeShow : function ( oEvent ) {
						var sNavToHome = "", sGoto = "", oMasterPage = null;
						sNavToHome = jQuery.sap.getUriParameters ( ).get ( "navToHome" );
						sGoto = jQuery.sap.getUriParameters ( ).get ( "goto" );
						oMasterPage = this.byId ( "sapSplCommunicationLogPage" );
						this.setCurrentAppInfo ( oEvent );

						// if DAL : check for navToHome
						if ( sGoto ) {
							if ( sNavToHome && sNavToHome === "false" ) {
								oMasterPage.setShowNavButton ( false );
							} else if ( sNavToHome && sNavToHome === "true" ) {
								oMasterPage.setShowNavButton ( true );
								oSapSplUtils.showHeaderButton ( {
									showButton : true,
									sNavToPage : "splView.tileContainer.MasterTileContainer"
								} );
							} else {
								// if navToHome is anything other than true or false.
								oMasterPage.setShowNavButton ( false );
							}
						} else {
							oMasterPage.setShowNavButton ( true );
						}
					},

					setCurrentAppInfo : function ( oEvent ) {
						oSapSplHelpHandler.setAppHelpInfo ( {
							iUrl : "./help/SCLComLog.pdf",
							eUrl : "./help/SCLComLog.pdf"
						}, oEvent );
					},

					instantiatePersoService : function ( ) {
						var oPersoService = {
							oPersoData : {
								_persoSchemaVersion : "1.0",
								aColumns : []
							},
							getPersData : function ( ) {
								var oDeferred = new jQuery.Deferred ( );
								if ( !this._oBundle ) {
									this._oBundle = this.oPersoData;
								}
								var oBundle = this._oBundle;
								oDeferred.resolve ( oBundle );
								return oDeferred.promise ( );
							},
							setPersData : function ( oBundle ) {
								var oDeferred = new jQuery.Deferred ( );
								this._oBundle = oBundle;
								oDeferred.resolve ( );
								return oDeferred.promise ( );
							}
						};

						var oTable = this.byId ( "SapSplCommunicationLogTable" );
						jQuery.sap.require ( "sap.m.TablePersoController" );
						this.oTablePersoDialog = new sap.m.TablePersoController ( {
							table : oTable,
							persoService : oPersoService
						} ).activate ( );
					},

					getTimeHorizonEnum : function ( ) {
						return [{
							value : "10",
							value_description : oSapSplUtils.getBundle ( ).getText ( "LAST_10_MINUTES" )
						}, {
							value : "60",
							value_description : oSapSplUtils.getBundle ( ).getText ( "LAST_HOUR" )
						}, {
							value : "360",
							value_description : oSapSplUtils.getBundle ( ).getText ( "LAST_6_HOURS" )
						}, {
							value : "1440",
							value_description : oSapSplUtils.getBundle ( ).getText ( "LAST_DAY" )
						}, {
							value : "10080",
							value_description : oSapSplUtils.getBundle ( ).getText ( "LAST_WEEK" )
						}, {
							value : "Manual",
							value_description : oSapSplUtils.getBundle ( ).getText ( "MANUAL_SELECTION" )
						}];
					},

					getDirectionEnum : function ( ) {
						return [{
							value : "All",
							value_description : oSapSplUtils.getBundle ( ).getText ( "FILTER_LABEL_ALL" )
						}, {
							value : "I",
							value_description : oSapSplUtils.getBundle ( ).getText ( "INBOUND_DIRECTION" )
						}, {
							value : "O",
							value_description : oSapSplUtils.getBundle ( ).getText ( "OUTBOUND_DIRECTION" )
						}];
					},

					handleSearchBasedOnFilters : function ( oEvent ) {
						var aFilterInstances = oEvent.getParameters ( ).selectionSet, sFilterText = "$filter=", oNowDate = new Date ( ), oTimeHorizonSelectionObject = null, aResponseCodeSelectedItems = null, aServicePathSelectedItems = null, oDirectionSelectionObject = null;
						this.byId ( "sapSplCommunicationLogSearchField" ).setValue ( "" );
						this.selectedTime = [];
						this.selectedResponseCode = [];
						this.selectedDirection = [];
						this.selectedServicePaths = [];

						oTimeHorizonSelectionObject = aFilterInstances[0].getSelectedItem ( ).getBindingContext ( ).getProperty ( );
						oDirectionSelectionObject = aFilterInstances[1].getSelectedItem ( ).getBindingContext ( ).getProperty ( );
						aResponseCodeSelectedItems = aFilterInstances[2].getSelectedItems ( );
						aServicePathSelectedItems = aFilterInstances[3].getTokens ( );

						if ( oTimeHorizonSelectionObject.value === "customRange" ) {
							if ( this.customDate1.getTime ( ) !== this.customDate2.getTime ( ) ) {
								sFilterText += "StartTime gt datetime'" + (this.customDate1.toJSON ( )) + "' and ";
								sFilterText += "StartTime lt datetime'" + (this.customDate2.toJSON ( )) + "' and ";
								this.selectedTime.push ( this.customDate1.toJSON ( ) );
								this.selectedTime.push ( this.customDate2.toJSON ( ) );
							} else {
								/* fix for Incident 1570147327 */
								sFilterText += "StartTime gt datetime'" + new Date ( this.customDate1.setHours ( "0" ) ).toJSON ( ) + "' and ";
								sFilterText += "StartTime lt datetime'" + new Date ( this.customDate2.setHours ( "24" ) ).toJSON ( ) + "' and ";
								this.selectedTime.push ( new Date ( this.customDate1.setHours ( "0" ) ).toJSON ( ) );
								this.selectedTime.push ( new Date ( this.customDate2.setHours ( "24" ) ).toJSON ( ) );
							}

						} else {
							sFilterText += "StartTime gt datetime'" + (new Date ( oNowDate.setMinutes ( oNowDate.getMinutes ( ) - oTimeHorizonSelectionObject.value ) )).toJSON ( ) + "' and ";
							this.selectedTime.push ( new Date ( oNowDate.setMinutes ( oNowDate.getMinutes ( ) - oTimeHorizonSelectionObject.value ) ).toJSON ( ) );
						}

						if ( oDirectionSelectionObject.value === "All" ) {
							sFilterText += "(Direction eq 'I' or Direction eq 'O')";
						} else {
							sFilterText += "Direction eq '" + oDirectionSelectionObject.value + "'";
							this.selectedDirection.push ( oDirectionSelectionObject.value );
						}
						if ( aResponseCodeSelectedItems.length > 0 ) {
							var aResponseCodeArray = [];
							sFilterText += " and (";
							for ( var i = 0 ; i < aResponseCodeSelectedItems.length ; i++ ) {
								aResponseCodeArray.push ( "(ResponseCode eq " + aResponseCodeSelectedItems[i].getBindingContext ( ).getProperty ( ).value_description + ")" );
								this.selectedResponseCode.push ( aResponseCodeSelectedItems[i].getBindingContext ( ).getProperty ( ).value_description );
							}
							sFilterText += aResponseCodeArray.join ( " or " ) + ")";
						}

						if ( aServicePathSelectedItems.length > 0 ) {
							var aServicePathsArray = [];
							sFilterText += " and (";
							for ( var j = 0 ; j < aServicePathSelectedItems.length ; j++ ) {
								aServicePathsArray.push ( "(Package eq \'" + aServicePathSelectedItems[j].getText ( ) + "\')" );
								this.selectedServicePaths.push ( aServicePathSelectedItems[j].getText ( ) );
							}
							sFilterText += aServicePathsArray.join ( " or " ) + ")";
						}

						/* CSNFIX - 1570462037,     1570462036 */
						this.byId ( "SapSplCommunicationLogTable" ).setBusy ( true );
						this.byId ( "SapSplCommunicationLogTable" ).getBinding ( "items" ).sFilterParams = sFilterText;
						sap.ui.getCore ( ).getModel ( "CommunicationLogODataModel" ).refresh ( );
						this.sAppliedFilters = sFilterText;
						this.getView ( ).byId ( "timeHorizonSelect" ).focus ( );

					},

					sapSplHandleClickOfCommunicationLogObjectLink : function ( oEvent ) {

						var oContent = new sap.ui.layout.form.SimpleForm ( {
							content : [new sap.m.Label ( {
								text : oSapSplUtils.getBundle ( ).getText ( "REQUEST" ),
								design : "Bold"
							} ), new sap.m.Text ( {
								text : "{/Request}",
								wrapping : true
							} ), new sap.m.Label ( {
								text : oSapSplUtils.getBundle ( ).getText ( "REQUEST_HEADER" ),
								design : "Bold"
							} ), new sap.m.Text ( {
								text : "{/RequestHeaders}",
								wrapping : true
							} ), new sap.m.Label ( {
								text : oSapSplUtils.getBundle ( ).getText ( "RESPONSE" ),
								design : "Bold"
							} ), new sap.m.Text ( {
								text : "{/Response}",
								wrapping : true
							} ), new sap.m.Label ( {
								text : oSapSplUtils.getBundle ( ).getText ( "RESPONSE_HEADER" ),
								design : "Bold"
							} ), new sap.m.Text ( {
								text : "{/ResponseHeaders}",
								wrapping : true
							} )]
						} ).setModel ( new sap.ui.model.json.JSONModel ( oEvent.getSource ( ).getBindingContext ( ).getProperty ( ) ) );

						/* CSNFIX : 1570031891 */
						new sap.m.ResponsivePopover ( {
							title : oEvent.getSource ( ).getBindingContext ( ).getProperty ( ).Object,
							placement : "Auto",
							content : new sap.ui.layout.VerticalLayout ( ).setWidth ( "320px" ).addContent ( oContent ),
							contentHeight : "375px",
							contentWidth : "320px"
						} ).openBy ( oEvent.getSource ( ) );
					},

					handleCreationOfCustomDateRange : function ( oEvent ) {
						var aTimeHorizonData = [], oDateRangeSelector = null, oModelData = {}, bCustomRangeFound = false;

						oDateRangeSelector = oEvent.getSource ( ).getParent ( ).getParent ( ).getContent ( )[0].getContent ( )[1];
						this.customDate1 = oDateRangeSelector.getDateValue ( );
						this.customDate2 = oDateRangeSelector.getSecondDateValue ( );
						oModelData = this.sapSplCommunicationLogModel.getData ( );
						aTimeHorizonData = oModelData.time;
						/* Incident : 1570173323 */
						if ( this.customDate1 === null || this.customDate2 === null ) {
							oDateRangeSelector.setValueState ( "Error" );
							oDateRangeSelector.setValueStateText ( oSapSplUtils.getBundle ( ).getText ( "CUSTOM_RANGE_DATE_ERROR_STATE_TEXT" ) );
						} else {
							oDateRangeSelector.setValueState ( "None" );
							for ( var i = 0 ; i < aTimeHorizonData.length ; i++ ) {
								if ( aTimeHorizonData[i].value === "customRange" ) {
									bCustomRangeFound = true;
									aTimeHorizonData[i].value_description = oDateRangeSelector.getValue ( );
									break;
								}
							}

							if ( bCustomRangeFound === false ) {
								aTimeHorizonData.push ( {
									value : "customRange",
									value_description : oDateRangeSelector.getValue ( )
								} );
							}

							oModelData["time"] = aTimeHorizonData;
							this.sapSplCommunicationLogModel.setData ( oModelData );
							this.byId ( "timeHorizonSelect" ).setSelectedKey ( "customRange" );
							/* Incident : 1570171594 */
							this.sSelectedTimeHorizon = "customRange";
							oEvent.getSource ( ).getParent ( ).close ( );
							oEvent.getSource ( ).getParent ( ).destroy ( );
						}

					},

					onPersoButtonPressed : function ( ) {
						var that = this;
						this.oTablePersoDialog.mAggregations._tablePersoDialog._oDialog.attachAfterClose ( function ( ) {
							that.getView ( ).byId ( "timeHorizonSelect" ).focus ( );
						} );
						this.oTablePersoDialog.mAggregations._tablePersoDialog._oDialog.removeStyleClass ( "sapUiPopupWithPadding" );
						this.oTablePersoDialog.openDialog ( );
					},

					onSortButtonPressed : function ( oEvent ) {
						var that = this, selectedButton = null;
						if ( !this._oDialog ) {
							this._oDialog = new sap.m.ViewSettingsDialog ( "oSapSplSortFilterDialog", {
								title : oSapSplUtils.getBundle ( ).getText ( "VIEW" ),
								sortDescending : true,
								sortItems : [new sap.m.ViewSettingsItem ( {
									text : oSapSplUtils.getBundle ( ).getText ( "START_TIME" ),
									key : "StartTime",
									selected : true
								} ), new sap.m.ViewSettingsItem ( {
									text : oSapSplUtils.getBundle ( ).getText ( "END_TIME" ),
									key : "EndTime"
								} )

								],
								groupItems : [new sap.m.ViewSettingsItem ( {
									text : oSapSplUtils.getBundle ( ).getText ( "OBJECT" ),
									key : "Object"
								} ), new sap.m.ViewSettingsItem ( {
									text : oSapSplUtils.getBundle ( ).getText ( "DIRECTION" ),
									key : "Direction"
								} ), new sap.m.ViewSettingsItem ( {
									text : oSapSplUtils.getBundle ( ).getText ( "RESPONSE_CODE" ),
									key : "ResponseCode"
								} )],
								confirm : function sortOrGroup ( oEvent ) {
									var oView = that.getView ( );
									var oTable = oView.byId ( "SapSplCommunicationLogTable" );
									var sPath, bDescending;
									var mParams = oEvent.getParameters ( );
									var oBinding = oTable.getBinding ( "items" );

									// apply sorter to binding
									// (grouping comes before sorting)
									var aSorters = [];
									if ( mParams.groupItem ) {
										sPath = mParams.groupItem.getKey ( );
										bDescending = mParams.groupDescending;
										var vGroup = that.mGroupFunctions[sPath];
										aSorters.push ( new sap.ui.model.Sorter ( sPath, bDescending, vGroup ) );
									}
									sPath = mParams.sortItem.getKey ( );
									bDescending = mParams.sortDescending;
									aSorters.push ( new sap.ui.model.Sorter ( sPath, bDescending ) );
									oBinding.sort ( aSorters );
									that.getView ( ).byId ( "timeHorizonSelect" ).focus ( );
								},
								cancel : function ( ) {
									that.getView ( ).byId ( "timeHorizonSelect" ).focus ( );
								}

							}, this );
						}

						this.getView ( ).addDependent ( this._oDialog );
						this._oDialog.open ( );
						selectedButton = oEvent.getSource ( ).getTooltip ( );
						if ( selectedButton === oSapSplUtils.getBundle ( ).getText ( "SORTBY_BUTTON_TOOLTIP" ) ) {
							this._oDialog._getSortButton ( ).firePress ( );
						} else if ( selectedButton === oSapSplUtils.getBundle ( ).getText ( "GROUPBY_BUTTON_TOOLTIP" ) ) {
							this._oDialog._getGroupButton ( ).firePress ( );
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

						// back navigation when the App is not launched through DAL
						if ( oBaseApp.getPreviousPage ( ) ) {
							oBaseApp.back ( );
						} else {
							// back navigation when the App is launched through DAL and navToHome = true
							oBaseApp.to ( "splView.tileContainer.MasterTileContainer" );
						}
					},

					openDateRangeSelctionDialog : function ( oDate1, oDate2 ) {
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
						var oDialog = new sap.m.Dialog ( {
							title : oSapSplUtils.getBundle ( ).getText ( "MANUAL_SELECTION" ),
							content : [new sap.ui.layout.form.SimpleForm ( {
								content : [new sap.m.Label ( {
									text : oSapSplUtils.getBundle ( ).getText ( "DATE_RANGE" )
								} ), new sap.m.DateRangeSelection ( oSettings )]
							} )],
							beginButton : new sap.m.Button ( {
								text : oSapSplUtils.getBundle ( ).getText ( "OK" ),
								press : function ( oEvent ) {
									if ( oEvent.getSource ( ).getParent ( ).getParent ( ).getContent ( )[0].getContent ( )[1].getValueState ( ) === "None" ) {
										that.handleCreationOfCustomDateRange ( oEvent );
									}
								}
							} ),
							endButton : new sap.m.Button ( {
								text : oSapSplUtils.getBundle ( ).getText ( "CANCEL" ),
								press : function ( oEvent ) {
									oEvent.getSource ( ).getParent ( ).close ( );
									oEvent.getSource ( ).getParent ( ).destroy ( );
									/* Fix for incident : 1570153528 */
									that.byId ( "timeHorizonSelect" ).setSelectedKey ( that.sSelectedTimeHorizon );
								}
							} )
						} );
						oDialog.open ( );
						oDialog.attachAfterOpen ( function ( oEvent ) {
							oSapSplUtils.fnSyncStyleClass ( oEvent.getSource ( ) );
						} );
					},

					handleSelectOfTimeHorizon : function ( oEvent ) {
						var sSelectedKey = oEvent.getParameters ( ).selectedItem.getBindingContext ( ).getProperty ( ).value;
						if ( sSelectedKey === "Manual" ) {
							this.openDateRangeSelctionDialog ( this.customDate1, this.customDate2 );
							/* Fix for incident : 1570153528 */
						} else if ( oEvent.getParameters ( ).selectedItem.getBindingContext ( ).getProperty ( ).value === "customRange" ) {
							this.openDateRangeSelctionDialog ( this.customDate1, this.customDate2 );
							this.sSelectedTimeHorizon = sSelectedKey;
						} else {
							/* Fix for incident : 1570153528 */
							this.sSelectedTimeHorizon = sSelectedKey;
						}
					},

					fnInstantiateCSVExporter : function ( oModel ) {
						this.oExport = new sap.ui.core.util.Export ( {

							exportType : new sap.ui.core.util.ExportTypeCSV ( {
								separatorChar : ","
							} ),

							models : oModel,

							rows : {
								path : "/"
							},

							columns : [{
								name : oSapSplUtils.getBundle ( ).getText ( "SERVICE_PATH" ),
								template : {
									content : {
										path : "Package"
									}
								}
							}, {
								name : oSapSplUtils.getBundle ( ).getText ( "OBJECT" ),
								template : {
									content : {
										path : "Object"
									}
								}
							}, {
								name : oSapSplUtils.getBundle ( ).getText ( "DESTINATION_SUFFIX" ),
								template : {
									content : {
										path : "DestinationSuffix"
									}
								}
							}, {
								name : oSapSplUtils.getBundle ( ).getText ( "DIRECTION" ),
								template : {
									content : {
										path : "Direction"
									}
								}
							}, {
								name : oSapSplUtils.getBundle ( ).getText ( "REQUEST" ),
								template : {
									content : {
										path : "Request"
									}
								}
							}, {
								name : oSapSplUtils.getBundle ( ).getText ( "REQUEST_HEADER" ),
								template : {
									content : {
										path : "RequestHeaders"
									}
								}
							}, {
								name : oSapSplUtils.getBundle ( ).getText ( "HTTP_METHOD" ),
								template : {
									content : {
										path : "httpMethod"
									}
								}
							}, {
								name : oSapSplUtils.getBundle ( ).getText ( "RESPONSE_CODE" ),
								template : {
									content : {
										path : "ResponseCode"
									}
								}
							}, {
								name : oSapSplUtils.getBundle ( ).getText ( "RESPONSE" ),
								template : {
									content : {
										path : "Response"
									}
								}
							}, {
								name : oSapSplUtils.getBundle ( ).getText ( "RESPONSE_HEADER" ),
								template : {
									content : {
										path : "ResponseHeaders"
									}
								}
							}, {
								name : oSapSplUtils.getBundle ( ).getText ( "DURATION" ),
								template : {
									content : {
										path : "Duration"
									}
								}
							}, {
								name : oSapSplUtils.getBundle ( ).getText ( "START_TIME" ),
								template : {
									content : {
										path : "StartTime"
									}
								}
							}, {
								name : oSapSplUtils.getBundle ( ).getText ( "END_TIME" ),
								template : {
									content : {
										path : "EndTime"
									}
								}
							}, {
								name : oSapSplUtils.getBundle ( ).getText ( "LOGON_USER" ),
								template : {
									content : {
										path : "LogonUser"
									}
								}
							}]
						} );

					},

					onColumnListSelected : function ( oEvent ) {
						var iLength = oEvent.getSource ( ).getSelectedItems ( ).length;
						if ( iLength === 0 ) {
							this.byId ( "sapSplComLogDelete" ).setEnabled ( false );
						} else {
							this.byId ( "sapSplComLogDelete" ).setEnabled ( true );
						}
					},

					fnCreatePayload : function ( aItems ) {
						var aHeaderPayload = [];
						for ( var i = 0 ; i < aItems.length ; i++ ) {
							aHeaderPayload.push ( {
								ChangeMode : "D",
								UUID : aItems[i].getBindingContext ( ).getObject ( )["UUID"]
							} );
						}
						return {
							Header : aHeaderPayload,
							inputHasChangeMode : true
						};
					},

					fnDeleteEvents : function ( ) {
						var that = this;
						var oPayload = this.fnCreatePayload ( this.byId ( "SapSplCommunicationLogTable" ).getSelectedItems ( ) );
						sap.m.MessageBox.show ( oSapSplUtils.getBundle ( ).getText ( "DELETE_EVENTS" ), {
							title : oSapSplUtils.getBundle ( ).getText ( "WARNING" ),
							icon : sap.m.MessageBox.Icon.WARNING,
							actions : [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
							onClose : function ( oAction ) {
								if ( oAction === "YES" ) {
									that.fnDeleteLog ( oPayload );
								}
							}
						} );

					},

					fnDeleteLog : function ( oPayload ) {
						oSapSplAjaxFactory.fireAjaxCall ( {
							url : oSapSplUtils.getFQServiceUrl ( "/sap/spl/xs/app/services/communicationLog.xsjs" ),
							method : "POST",
							data : JSON.stringify ( oPayload ),
							success : function ( data, success, messageObject ) {
								if ( data.constructor === String ) {
									data = JSON.parse ( data );
								}
								oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
								if ( messageObject["status"] === 200 && data["Error"].length === 0 ) {
									//toast
									sap.ca.ui.message.showMessageToast ( oSapSplUtils.getBundle ( ).getText ( "DELETE_EVENTS_SUCCESS" ) );
									sap.ui.getCore ( ).getModel ( "CommunicationLogODataModel" ).refresh ( );
								}
							},
							error : function ( error ) {
								jQuery.sap.log.error ( "fnCreatePayload", "ajax failed", "communicationLog.controller.js" );
								oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
								sap.ui.getCore ( ).getModel ( "CommunicationLogODataModel" ).refresh ( );
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

					fnHandleDownloadAsCSV : function ( ) {
						var oModel = new sap.ui.model.json.JSONModel ( ), aModelData = [];
						var oTable = this.byId ( "SapSplCommunicationLogTable" );
						for ( var i = 0 ; i < oTable.getSelectedItems ( ).length ; i++ ) {
							aModelData.push ( oTable.getSelectedItems ( )[i].getBindingContext ( ).getProperty ( ) );
						}
						oModel.setData ( aModelData );
						var sFileName = null;
						sFileName = oSapSplUtils.getBundle ( ).getText ( "COMMUNICATION_LOG_PAGE_TITLE" ) + "_" + splReusable.libs.SapSplModelFormatters.getDateFromString ( new Date ( ) );
						this.fnInstantiateCSVExporter ( oModel );
						this.oExport.saveFile ( sFileName ).always ( function ( ) {
							this.destroy ( );
							sap.ca.ui.message.showMessageToast ( oSapSplUtils.getBundle ( ).getText ( "EVENTS_DOWNLOAD_SUCCESS", aModelData.length ) );
						} );
					},

					/**
					 * @description Method to handle the ajax call to fetch searched results.
					 * @param {object} payload payload for post.
					 * @returns void.
					 * @since 1.0
					 */
					callSearchService : function ( oPayload ) {
						var oSapSplCommLogTable = this.getView ( ).byId ( "SapSplCommunicationLogTable" ), aSapSplCommLogFilters = [], oSapSplSearchFilters = {};

						$.ajax ( {
							url : oSapSplUtils.getFQServiceUrl ( "/sap/spl/xs/app/services/Search.xsjs" ),
							type : "POST",
							contentType : "json; charset=UTF-8",
							async : false,
							beforeSend : function ( request ) {
								request.setRequestHeader ( "X-CSRF-Token", oSapSplUtils.getCSRFToken ( ) );
								request.setRequestHeader ( "Cache-Control", "max-age=0" );
							},
							data : JSON.stringify ( oPayload ),
							success : function ( data, success, messageObject ) {
								oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
								if ( data.constructor === String ) {
									data = JSON.parse ( data );
								}
								if ( messageObject["status"] === 200 ) {

									if ( data.length > 0 ) {
										oSapSplSearchFilters = oSapSplUtils.getSearchItemFilters ( data, "UUID" );
										if ( oSapSplSearchFilters.aFilters.length > 0 ) {
											aSapSplCommLogFilters.push ( oSapSplSearchFilters );
										}
										oSapSplCommLogTable.getBinding ( "items" ).filter ( aSapSplCommLogFilters );
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
								/* CSNFIX - 1570462037,     1570462036 */
								oSapSplCommLogTable.setBusy ( false );
							}
						} );
					},

					prepareSearchPayload : function ( sSearchTerm ) {
						var oPayload = {};
						oPayload.UserID = oSapSplUtils.getLoggedOnUserDetails ( ).profile.UserID;
						oPayload.ObjectType = "CommunicationLog";
						oPayload.SearchTerm = sSearchTerm;
						oPayload.FuzzinessThershold = SapSplEnums.fuzzyThreshold;
						oPayload.MaximumNumberOfRecords = SapSplEnums.numberOfRecords;
						oPayload.ProvideDetails = false;

						if ( this.selectedResponseCode.length > 0 || this.selectedTime.length > 0 || this.selectedServicePaths.length > 0 || this.selectedDirection.length > 0 ) {
							oPayload.AdditionalCriteria = {};
						}
						if ( this.selectedResponseCode.length > 0 ) {
							oPayload.AdditionalCriteria.ResponseCode = this.selectedResponseCode;
						}
						if ( this.selectedTime.length > 0 ) {
							if ( this.selectedTime.length === 1 ) {
								oPayload.AdditionalCriteria.StartTimeRange = this.selectedTime[0];
							} else {
								oPayload.AdditionalCriteria.StartTimeRange = this.selectedTime;
							}
						}
						if ( this.selectedServicePaths.length > 0 ) {
							oPayload.AdditionalCriteria.Package = this.selectedServicePaths;
						}
						if ( this.selectedDirection.length > 0 ) {
							oPayload.AdditionalCriteria.Direction = this.selectedDirection;
						}
						return oPayload;
					},

					handleSearch : function ( oEvent ) {
						var sSearchString = oEvent.getParameters ( ).query;
						var oSapSplCommLogTable;
						var oPayload;

						oSapSplCommLogTable = this.getView ( ).byId ( "SapSplCommunicationLogTable" );
						/* CSNFIX - 1570462037,     1570462036 */
						if ( sSearchString.length > 2 ) {
							oPayload = this.prepareSearchPayload ( sSearchString );
							oSapSplCommLogTable.setBusy ( true );
							this.callSearchService ( oPayload );
						} else if ( oSapSplCommLogTable.getBinding ( "items" ) === undefined || (oSapSplCommLogTable.getBinding ( "items" ).sFilterParams !== undefined && oSapSplCommLogTable.getBinding ( "items" ).sFilterParams.length > 1) ) {
							if ( this.sAppliedFilters === undefined ) {
								this.sAppliedFilters = "";
							}
							oSapSplCommLogTable.getBinding ( "items" ).sFilterParams = this.sAppliedFilters;
							sap.ui.getCore ( ).getModel ( "CommunicationLogODataModel" ).refresh ( );
						}
					}

				} );
