/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.require ( "sap.ui.core.util.Export" );
jQuery.sap.require ( "sap.ui.core.util.ExportTypeCSV" );

sap.ui.controller ( "splController.usageLog.usageLog", {
	onBeforeShow : function ( oEvent ) {
		this.setCurrentAppInfo ( oEvent );
	},

	onInit : function ( ) {
		this.customDate1 = null;
		this.customDate2 = null;
		var that = this;
		this.fnsetTextFromResourceBundle ( );
		splReusable.libs.SapSplStyleSheetLoader.loadStyle ( "./resources/styles/sapSplUsageLog" );
		if ( !this.oUsageLogModel ) {
			this.oUsageLogModel = new sap.ui.model.json.JSONModel ( );
			this.fetchUsageLogData ( );
		}
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
		this.getView ( ).addEventDelegate ( {
			onAfterShow : function ( ) {
				window.setTimeout ( function ( ) {
					that.getView ( ).byId ( "SapSplUsageTimeHorizon" ).focus ( );
				}, 100 );
			}
		} );
	},

	fnsetTextFromResourceBundle : function ( ) {
		// this.getView().byId("SapSplUsageTimeHorizonLabel").setText(oSapSplUtils.getBundle().getText("TIME_HORIZON_TEXT"));
		this.getView ( ).byId ( "usageLog" ).setTitle ( oSapSplUtils.getBundle ( ).getText ( "USAGE_LOG_LABEL" ) );
		this.getView ( ).byId ( "btnDownloadCSV" ).setText ( oSapSplUtils.getBundle ( ).getText ( "DOWNLOAD_AS_CSV" ) );
	},

	setCurrentAppInfo : function ( oEvent ) {
		oSapSplHelpHandler.setAppHelpInfo ( {
			iUrl : "./help/SCLUsageLog.pdf",
			eUrl : "./help/SCLNotification.pdf"
		}, oEvent );
	},

	fnInstantiateCSVExporter : function ( ) {
		var that = this;
		this.oExport = new sap.ui.core.util.Export ( {

			// Type that will be used to generate the content. Own ExportType's can be created to support other formats
			exportType : new sap.ui.core.util.ExportTypeCSV ( {
				separatorChar : ","
			} ),

			// Pass in the model created above
			models : that.oUsageLogModel,

			// binding information for the rows aggregation 
			rows : {
				path : "/results"
			},

			// column definitions with column name and binding info for the content
			columns : [{
				name : oSapSplUtils.getBundle ( ).getText ( "HUB_Name" ),
				template : {
					content : {
						path : "Organization.Name"
					}
				}
			}, {
				name : oSapSplUtils.getBundle ( ).getText ( "TOTAL_BUSINESS_PARTNER" ),
				template : {
					content : {
						path : "bupaCount"
					}
				}
			}, {
				name : oSapSplUtils.getBundle ( ).getText ( "TOTAL_HUB_USERS" ),
				template : {
					content : {
						path : "userCount"
					}
				}
			}, {
				name : oSapSplUtils.getBundle ( ).getText ( "TOTAL_TELEMATIC_UNITS" ),
				template : {
					content : {
						path : "deviceCount"
					}
				}
			}, {
				name : oSapSplUtils.getBundle ( ).getText ( "TOTAL_ACTIVE_DEVICES" ),
				template : {
					content : {
						path : "activeDevicesCount"
					}
				}
			}, {
				name : oSapSplUtils.getBundle ( ).getText ( "TOTAL_INACTIVE_DEVICES" ),
				template : {
					content : {
						path : "inactiveDevicesCount"
					}
				}
			}, {
				name : oSapSplUtils.getBundle ( ).getText ( "FROM" ),
				template : {
					content : {
						path : "StartTime",
						formatter : splReusable.libs.SapSplModelFormatters.getDateFromStringForCSV
					}
				}
			}, {
				name : oSapSplUtils.getBundle ( ).getText ( "TO" ),
				template : {
					content : {
						path : "EndTime",
						formatter : splReusable.libs.SapSplModelFormatters.getDateFromStringForCSV
					}
				}
			}

			]
		} );

	},

	fetchUsageLogData : function ( sBucketType, sFromDate, sToDate ) {
		var that = this;

		oSapSplAjaxFactory.fireAjaxCall ( {
			url : oSapSplUtils.getFQServiceUrl ( "/sap/spl/xs/app/services/usageLog.xsjs/" ),
			method : "POST",
			data : JSON.stringify ( this.getPayLoadForUsageLog ( sBucketType, sFromDate, sToDate ) ),
			success : function ( data ) {
				try {
					if ( data.constructor === String ) {
						data = JSON.parse ( data );
					}

					that.oUsageLogModel.setData ( {
						results : data
					} );
					that.getView ( ).byId ( "SapSplUsageDetail" ).setModel ( that.oUsageLogModel );

				} catch (e) {

					jQuery.sap.log.fatal ( "Invalid character identified in response of service" );

					sap.ca.ui.message.showMessageBox ( {
						type : sap.ca.ui.message.Type.ERROR,
						message : oSapSplUtils.getBundle ( ).getText ( "SPL_SYSTEM_RESPONSE_ERROR" ),
						details : e.message
					} );

				}

			},
			error : function ( error ) {
				if ( error ) {
					sap.ca.ui.message.showMessageBox ( {
						type : sap.ca.ui.message.Type.ERROR,
						message : error["status"] + " " + error.statusText,
						details : error.responseText
					}, jQuery.proxy ( that.fireCancelAction, that ) );
				}
			}
		} );

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
		oPayload["StartTime"] = oDateRange["from"];
		oPayload["EndTime"] = oDateRange["to"];
		this.StartTime = oPayload["StartTime"];
		this.EndTime = oPayload["EndTime"];
		return oPayload;
	},

	onSelectOfListItem : function ( oEvent ) {
		var oData = null;
		if ( !oSplBaseApplication.getAppInstance ( ).getPage ( "splView.profile.UsageLogDetails" ) ) {

			var oUsageLogDetails = sap.ui.view ( {

				viewName : "splView.profile.UsageLogDetails",

				id : "splView.profile.UsageLogDetails",

				type : sap.ui.core.mvc.ViewType.XML

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
		var oSettings = null, that = this;
		/* Fix for incident 1580068687 */
		oSettings = {
			id : "sapSplDateRangeSelection",
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
		var oDialog = new sap.m.Dialog ( "customDateDialog", {
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
						var oFromDate = sap.ui.getCore ( ).byId ( "sapSplDateRangeSelection" ).getDateValue ( );
						var oToDate = sap.ui.getCore ( ).byId ( "sapSplDateRangeSelection" ).getSecondDateValue ( );
						if ( sap.ui.getCore ( ).byId ( "sapSplDateRangeSelection" ).getDateValue ( ) && sap.ui.getCore ( ).byId ( "sapSplDateRangeSelection" ).getSecondDateValue ( ) ) {

							that.fetchUsageLogData ( null, oFromDate, oToDate );
							sap.ui.getCore ( ).byId ( "customDateDialog" ).close ( );
							sap.ui.getCore ( ).byId ( "customDateDialog" ).destroy ( );

						} else {
							if ( !sap.ui.getCore ( ).byId ( "sapSplDateRangeSelection" ).getDateValue ( ) ) {
								sap.ui.getCore ( ).byId ( "sapSplDateRangeSelection" ).setValueState ( sap.ui.core.ValueState.Error );

							}
							if ( !sap.ui.getCore ( ).byId ( "sapSplDateRangeSelection" ).getSecondDateValue ( ) ) {
								sap.ui.getCore ( ).byId ( "sapSplDateRangeSelection" ).setValueState ( sap.ui.core.ValueState.Error );
							}
						}
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
		var sSelectedKey = oEvent.getParameters ( ).selectedItem.getBindingContext ( ).getProperty ( ).key;
		if ( sSelectedKey === "Manual" ) {
			this.openDateRangeSelectionDialog ( this.customDate1, this.customDate2 );
		} else if ( oEvent.getParameters ( ).selectedItem.getBindingContext ( ).getProperty ( ).key === "customRange" ) {
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
			/* Incident : 1570171594 */
			this.sSelectedTimeHorizon = "customRange";
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

	handlePressOfCSVButton : function ( ) {
		var sFileName = null;
		sFileName = oSapSplUtils.getBundle ( ).getText ( "USAGE_LOG_LABEL" ) + "_" + splReusable.libs.SapSplModelFormatters.getDateFromString ( new Date ( ) );
		this.fnInstantiateCSVExporter ( );
		this.oExport.saveFile ( sFileName ).always ( function ( ) {
			this.destroy ( );
		} );
	},

	handleProfileBackNavigation : function ( ) {
		var oBaseApp = null;
		oBaseApp = oSplBaseApplication.getAppInstance ( );
		// back navigation when the App is not launched through DAL
		if ( oBaseApp.getPreviousPage ( ) ) {
			oBaseApp.back ( );
		} else {
			// back navigation when the App is launched through DAL and navToHome = true
			oBaseApp.to ( "splView.tileContainer.MasterTileContainer" );
		}

	}

} );
