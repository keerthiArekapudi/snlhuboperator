/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.require ( "splReusable.libs.SapSplTourTruckChart" );
sap.ui.controller ( "splController.managetours.TourDetails", {
	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 */
	onInit : function ( ) {

		var that = this;
		this.fnDefineControlLabelsFromLocalizationBundle ( );
		splReusable.libs.SapSplStyleSheetLoader.loadStyle ( "./resources/styles/sapSplLiveApp" );
		splReusable.libs.SapSplStyleSheetLoader.loadStyle ( "./resources/styles/sapSplTourOverview" );
		
		sap.ui.getCore ( ).setModel ( new sap.ui.model.json.JSONModel ( ), "ToursDetailStopsModel" );
		
		this.oSapSplToursDetailODataModelStops = sap.ui.getCore ( ).getModel ( "ToursDetailODataModelStops" );
		sap.ui.getCore ( ).setModel ( this.oSapSplToursDetailODataModelStops, "ToursDetailODataModelStops" );
		
		//this.getView ( ).byId ( "sapSplStopPanel" ).setModel ( sap.ui.getCore ( ).getModel ( "ToursDetailODataModelStops" ) );
		this.getView ( ).byId ( "sapSplStopPanel" ).setModel ( sap.ui.getCore ( ).getModel ( "ToursDetailStopsModel" ) );
		
		this.getView ( ).byId ( "toursOverviewHeader" ).setModel ( sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ) );
		//this.getView ( ).setModel ( sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ) );
		
		this.getView ( ).byId ( "sapSplTruckDetailsPanel" ).setModel ( sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ) );
		this.getView ( ).byId ( "sapSnlhHeaderContainer" ).setModel ( sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ) );
		this.getView ( ).byId ( "sapSplTourDetailsIconTabBar" ).setModel ( sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ) );
		this.getView ( ).byId ( "sapSplToursEditButton" ).setModel ( sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ) );
		//this.getView ( ).setModel ( sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ) );
		//this.getView ( ).byId ( "ToursOverViewPage" ).setModel ( sap.ui.getCore ( ).getModel ( "oSapSplTourDetail" ) );
		//this.getView ( ).setModel ( sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ) );

		var oModelData = sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ).getData ( );
		oModelData.showMapFullScreenButton = true;
		sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ).setData ( oModelData );

		this.getView ( ).byId ( "SapSplNavigationUp" ).addCustomData ( new sap.ui.core.CustomData ( {
			key : "up",
			value : "up"
		} ) );
		this.getView ( ).byId ( "SapSplNavigationDown" ).addCustomData ( new sap.ui.core.CustomData ( {
			key : "down",
			value : "down"
		} ) );

		jQuery ( window ).resize ( jQuery.proxy ( this.fnRenderStyle, this ) );
		// Fix for TSI Integration issue
		// this.oSapSplTourEventsSorter = new
		// sap.ui.model.Sorter("ReportedTime", false);
		// this.byId("SapSplLogdetails").getBinding("items").sort(this.oSapSplTourEventsSorter);

		this.byId ( "sapSplToursMapContainer" ).addEventDelegate ( {
			onAfterRendering : function ( ) {
				that.fnRenderStyle ( );
			}
		} );

		this.fnInstantiateMap ( );
	},

	onAfterRendering : function ( ) {
	},

	fnRenderStyle : function ( ) {
		if ( sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ).getData ( ).showMapFullScreenButton !== undefined && sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ).getData ( ).showMapFullScreenButton === false ) {
			this.iWindowHeight = jQuery ( window ).height ( ) * (0.6);
		} else {
			this.iWindowHeight = jQuery ( window ).height ( ) * (0.4);
		}

		jQuery ( ".oSapSplTourDetailsMap" ).css ( "height", this.iWindowHeight + "px" );
	},

	fnInstantiateMap : function ( ) {
		// Sets the JSON model for Visual Business Map
		this.oVBIModel = new sap.ui.model.json.JSONModel ( );
		this.oVBIModel.setData ( oSapSplMapsDataMarshal.getMapsModelJSON ( SapSplEnums.configJSON ) );
		sap.ui.getCore ( ).setModel ( this.oVBIModel, "oSapSplVBModelTourApp" );
		this.getView ( ).byId ( "oSapSplTourDetailsMap" ).bindProperty ( "config", "oSapSplVBModelTourApp>/" );
		this.getView ( ).byId ( "oSapSplTourDetailsMap" ).setModel ( sap.ui.getCore ( ).getModel ( "oSapSplVBModelTourApp" ) );
	},

	fnHandleNavigationToLiveApp : function ( oTruckInfo ) {
		var sNavTo = "splView.liveApp.liveApp";
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
		oNavData["FromApp"] = "tours";
		oNavData["TruckInfo"] = oTruckInfo;
		oSplBaseApplication.getAppInstance ( ).to ( sNavTo, "slide", oNavData );
	},

	fnGetPathData : function ( oResult, that, oVBMap ) {
		if ( oResult.VehicleUUID ) {
			var sFilter = "$filter=UUID eq X\'" + oSapSplUtils.base64ToHex ( oResult.VehicleUUID ) + "\'";
			var startTime = oResult["Actual_StartTime"];
			var endTime = oResult["Actual_EndTime"];
			if ( !startTime ) {
				startTime = oResult["Planned_StartTime"];
			}
			if ( !endTime ) {
				endTime = oResult["Planned_EndTime"];
			}
			//Fix incident 1580122319
			if( oResult.TourStatus === "I" ) {
				sFilter += " and (ReportedTime ge datetime'" + startTime.toJSON ( ) + "')";
			} else {
				sFilter += " and (ReportedTime le datetime'" + endTime.toJSON ( ) + "' and ReportedTime ge datetime'" + startTime.toJSON ( ) + "')";
			}

			function fnSuccess ( oPathData ) {
				/* To Improve tour read performance */
				this.fnPlotFirstPosition ( oResult, oPathData.results, oVBMap );
				this.getView ( ).byId ( "sapSplTruckLocationPanel").setBusy ( false );

				if ( oPathData ) {
					var iPathDataLength = oPathData.results.length;
					var sPathString = "";
					var oPathObject = {};

					for ( var i = 0 ; i < iPathDataLength ; i++ ) {
						if ( oPathData.results[i].PositionGeo ) {
							sPathString += oSapSplMapsDataMarshal.convertGeoJSONToString ( JSON.parse ( oPathData.results[i].PositionGeo ) );
							if ( i !== iPathDataLength - 1 ) {
								sPathString += ";";
							}
						}
					}

					oPathObject["key"] = "123";
					oPathObject["name"] = "";
					oPathObject["coordinate"] = sPathString;
					oPathObject["color"] = "ARGB(0x99;0xAB;0x21;0x8E)";
					oPathObject["start"] = "0";
					oPathObject["end"] = "0";
					oPathObject["dotWidth"] = "0";
					oPathObject["lineWidth"] = "3";

					oSapSplMapsDataMarshal.fnShowTourPath ( oPathObject, oVBMap );
				}
			}

			function fnError ( ) {
				this.getView ( ).byId ( "sapSplTruckLocationPanel").setBusy ( false );
				jQuery.sap.log.error ( "Tour path", "read failed", "TourDetails.controller.js" );
			}

			oSapSplBusyDialog.getBusyDialogInstance ( ).open ( );
			/* Making the read as async - To Improve tour read performance */
			sap.ui.getCore ( ).getModel ( "ToursOverViewPageODataModel" ).read ( "/VehiclePositionHistory", null, [sFilter], true, jQuery.proxy ( fnSuccess, this ), jQuery.proxy ( fnError, this ) );
			oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
		} else {
			this.getView ( ).byId ( "sapSplTruckLocationPanel").setBusy ( false );
			return null;
		}
	},

	fnShowStopsOnMap : function ( oResult, oVBMap ) {
		if ( oResult && oResult.Stops && oResult.Stops.results ) {
			oResult.Stops.results.sort ( function ( a, b ) {
				Number ( a.ActualSequence ) - Number ( b.ActualSequence );
			} );

			oSapSplMapsDataMarshal.fnShowTourStops ( oResult.Stops.results, oVBMap );
		}
	},

	fnPlotFirstPosition : function ( oResult, aPositions, oVBMap ) {
		if ( aPositions.length > 0 ) {
			aPositions.sort ( function ( oPosObject1, oPosObject2 ) {
				if ( oPosObject1.ReportedTime > oPosObject2.ReportedTime ) {
					return 1;
				}
				if ( oPosObject1.ReportedTime > oPosObject2.ReportedTime ) {
					return -1;
				}
			} );

			oResult.Position.results = [aPositions[0]];
			// Fix for internal incident 1570139735
			if ( oResult.TourStatus === "I" ) {
				if ( oResult.Position && oResult.Position.results && oResult.Position.results.constructor === Array ) {
					for ( var i = 0 ; i < oResult.Position.results.length ; i++ ) {
						oResult.Position.results[i].Position = oResult.Position.results[i].PositionGeo;
						oSapSplMapsDataMarshal.fnShowTruckFlags ( oResult.Position.results[i], oVBMap );
						var sCoords = oSapSplMapsDataMarshal.convertGeoJSONToString ( JSON.parse ( oResult.Position.results[i].Position ) ).split ( ";" );
						oVBMap.zoomToGeoPosition ( parseFloat ( sCoords[0], 10 ), parseFloat ( sCoords[1], 10 ), 12 );
					}
				}
			}
		}
	},

	fnShowPathOnMap : function ( oResult, oVBMap ) {
		/* To Improve tour read performance */
		this.fnGetPathData ( oResult, this, oVBMap );
	},

	fnShowTruckOnTheMap : function ( oResult, oVBMap ) {
		oSapSplMapsDataMarshal.fnClearMap ( oVBMap );

		if ( oResult.TourStatus === "I" || oResult.TourStatus === "C" ) {
			
			//Fix Incident 1580111427
			this.byId ( "sapSplNavigateToLiveAppButton" ).setEnabled ( true );
			
			//To fix incident 1580152897
			if( oResult.VehicleUUID === null ) {
				this.byId ( "sapSplTruckLocationPanel" ).setVisible ( false );
			} else {
				this.getView ( ).byId ( "sapSplTruckLocationPanel").setBusy ( true );
				this.byId ( "sapSplTruckLocationPanel" ).setVisible ( true );
				this.fnShowPathOnMap ( oResult, oVBMap );
				this.fnShowStopsOnMap ( oResult, oVBMap );
			}
			
		} else {
			this.byId ( "sapSplTruckLocationPanel" ).setVisible ( false );

			//Fix Incident 1580111427
			this.byId ( "sapSplNavigateToLiveAppButton" ).setEnabled ( false );
		}
	},

	fnHandleClickOfNavigateButton : function ( ) {
		this.fnHandleNavigationToLiveApp ( sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ).getData ( ).data );
	},

	onBeforeShow : function ( ) {
		sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ).updateBindings ( );
		this.refreshsapSplTourDetailModel ( );
		this.currentUUID = sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ).getData ( ).data.UUID;
	},

	/**
	 * @description Method to set Localization Bundle Text to the labels.
	 * @param void
	 * @returns void.
	 * @since 1.0
	 */

	fnDefineControlLabelsFromLocalizationBundle : function ( ) {
		this.getView ( ).byId ( "sapSplNavigateToLiveAppButton" ).setText ( oSapSplUtils.getBundle ( ).getText ( "SHOW_IN_TRAFFIC_STATUS" ) );
		this.getView ( ).byId ( "TourDetailPageTitle" ).setText ( oSapSplUtils.getBundle ( ).getText ( "TOUR_DETAILS" ) );
		this.getView ( ).byId ( "sapSplSelectTruckLabel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "TRUCK" ) );
		this.getView ( ).byId ( "sapSplDriverLabel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "DRIVER" ) );
		this.getView ( ).byId ( "sapSplCommentLabel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "COMMENTS" ) );
		this.getView ( ).byId ( "sapSplTruckDetailsPanel" ).setHeaderText ( oSapSplUtils.getBundle ( ).getText ( "DETAILS" ) );

		this.getView ( ).byId ( "sapSplStopPanel" ).setHeaderText ( oSapSplUtils.getBundle ( ).getText ( "STOPS" ) );
		this.getView ( ).byId ( "sapSplToursEditButton" ).setText ( oSapSplUtils.getBundle ( ).getText ( "MY_COLLEAGUES_EDIT_BUTTON" ) );
		this.getView ( ).byId ( "sapSplTourProgressLink" ).setText ( oSapSplUtils.getBundle ( ).getText ( "PROGRESS_OF_TOUR" ) );
		this.getView ( ).byId ( "sapSplTruckLocationPanel" ).setHeaderText ( oSapSplUtils.getBundle ( ).getText ( "LOCATIONS" ) );
	},

	/**
	 * @description Method to handle the click of 'Tour Navigation Up' Button.Sets the navigated tour data to the model
	 * @param {object}
	 * @returns void.
	 * @since 1.0
	 */

	fnHandlePressOfUpButton : function ( oEvent ) {
		var Index = null;
		if ( sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ).getData ( ) && sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ).getData ( ).index ) {
			Index = sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ).getData ( ).index.value - 1;
		}
		if ( sap.ui.getCore ( ).getModel ( "sapSplTourOverviewModel" ).getData ( ) && sap.ui.getCore ( ).getModel ( "sapSplTourOverviewModel" ).getData ( ).results &&
				sap.ui.getCore ( ).getModel ( "sapSplTourOverviewModel" ).getData ( ).results[Index] ) {
			sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ).getData ( ).index.value--;
			sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ).getData ( ).data = sap.ui.getCore ( ).getModel ( "sapSplTourOverviewModel" ).getData ( ).results[Index];
			sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ).updateBindings ( );
			this.currentUUID = sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ).getData ( ).data.UUID;
			if ( sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ).getData ( ).index.value - 1 >= sap.ui.getCore ( ).getModel ( "sapSplTourOverviewModel" ).getData ( ).results.length ) {
				oEvent.getSource ( ).setEnabled ( false );
			}
			this.refreshsapSplTourDetailModel ( );
			this.fnShowTruckOnTheMap ( sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ).getData ( ).data, this.byId ( "oSapSplTourDetailsMap" ) );
		}
	},

	/**
	 * @description Method to handle the click of 'Tour Navigation Down' Button.Sets the navigated tour data to the model
	 * @param {object}
	 * @returns void.
	 * @since 1.0
	 */

	fnHandlePressOfDownButton : function ( oEvent ) {
		var Index = null;
		if ( sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ).getData ( ) && sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ).getData ( ).index ) {
			Index = sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ).getData ( ).index.value + 1;
		}

		if ( sap.ui.getCore ( ).getModel ( "sapSplTourOverviewModel" ).getData ( ) && sap.ui.getCore ( ).getModel ( "sapSplTourOverviewModel" ).getData ( ).results &&
				sap.ui.getCore ( ).getModel ( "sapSplTourOverviewModel" ).getData ( ).results[Index] ) {
			sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ).getData ( ).index.value++;
			sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ).getData ( ).data = sap.ui.getCore ( ).getModel ( "sapSplTourOverviewModel" ).getData ( ).results[Index];
			sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ).updateBindings ( );
			this.currentUUID = sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ).getData ( ).data.UUID;
			if ( sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ).getData ( ).index.value + 1 >= sap.ui.getCore ( ).getModel ( "sapSplTourOverviewModel" ).getData ( ).results.length ) {
				oEvent.getSource ( ).setEnabled ( false );
			}
			this.refreshsapSplTourDetailModel ( );
			this.fnShowTruckOnTheMap ( sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ).getData ( ).data, this.byId ( "oSapSplTourDetailsMap" ) );
		}
	},

	/**
	 * @description Method to handle press of Back Button.Navigates back to previous page
	 * @param {object}
	 * @returns void.
	 * @since 1.0
	 */

	fnHandleTapOfBackbutton : function ( ) {
		this.getView ( ).getParent ( ).to ( "ToursOverview" );
		window.clearInterval ( this.oSapSplTourDetails );
	},

	/**
	 * @description Method to handle press of Edit Button.
	 * @param void
	 * @returns void.
	 * @since 1.0
	 */

	fnHandelPressOfEdit : function ( ) {
		var viewData = {};
		var CreateNewTour, that = this;
		
		var oData = null;
		oData = sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ).getData ( );
		if ( oData && oData.data && oData.data.UUID ) {
			function fnHandleSuccessCallbackForItems ( data ) {
				if ( data && data.results && data.results instanceof Array ) {
					oData.data.Items = data;
					sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ).getData ( oData );
				}
			}
			
			function fnHandleErrorCallbackForItems () {
				
			}
			sap.ui.getCore ( ).getModel ( "ToursDetailODataModelStops" ).read ( "/TourItems", null,
					["$filter=TourUUID eq X\'" + oSapSplUtils.base64ToHex ( oData.data.UUID ) + "\'"], false, jQuery.proxy ( fnHandleSuccessCallbackForItems, this ),
					jQuery.proxy ( fnHandleErrorCallbackForItems, this ) );
		}
			
		
		
		if ( !this.getView ( ).getParent ( ).getPage ( "CreateNewTour" ) ) {
			CreateNewTour = sap.ui.view ( {
				id : "CreateNewTour",
				viewName : "splView.managetours.CreateNewTour",
				type : sap.ui.core.mvc.ViewType.XML
			} );

			CreateNewTour.addEventDelegate ( {
				onBeforeShow : jQuery.proxy ( CreateNewTour.getController ( ).onBeforeShow, CreateNewTour.getController ( ) )
			} );

			CreateNewTour.getController ( ).setUnifiedShellInstance ( this.getView ( ).getParent ( ).getParent ( ).getController ( ).getUnifiedShellInstance ( ) );

			this.getView ( ).getParent ( ).addPage ( CreateNewTour );
		}
		viewData.TourData = sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ).getData ( );
		viewData.isEdit = 1;
		this.getView ( ).getParent ( ).to ( "CreateNewTour", "slide", viewData );
		window.clearInterval ( that.oSapSplTourDetails );

	},

	/**
	 * @description Method to refresh the details model and turn the polling on
	 * @param void
	 * @returns void.
	 * @since 1.0
	 * @private
	 */

	refreshsapSplTourDetailModel : function ( ) {
		var that = this;
		window.clearInterval ( that.oSapSplTourDetails );
		that.fnFetchTourDetails ( );

		if ( sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ).getData ( ).data.TourStatus !== "C" && sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ).getData ( ).data.TourStatus !== "D" ) {
			that.oSapSplTourDetails = window.setInterval ( function ( ) {
				that.fnFetchTourDetails ( );
			}, 60000 );

			oSapSplUtils.setIntervalId ( that.oSapSplTourDetails );
		}

	},
	/**
	 * @description Method to fetch the tour detail data from the service
	 * @param void
	 * @returns void.
	 * @since 1.0
	 * @private
	 */

	fnFetchTourDetails : function ( ) {
		var oData = null, UUID = null, that = this;
		oData = sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ).getData ( );
		if ( oData && oData.data && oData.data.UUID ) {
			UUID = oData.data.UUID;
			// Fix for CSN 1570019085
			//this.getView ( ).byId ( "ToursOverViewPage" ).setBusy ( true );
			this.getView ( ).byId ( "sapSplTruckDetailsPanel" ).setBusy ( true );
			this.getView ( ).byId ( "sapSplStopPanel" ).setBusy ( true );
			this.getView ( ).byId ( "sapSnlhHeaderContainer").setBusy ( true );
			
			this.getView ( ).byId ( "sapSplToursEditButton" ).setEnabled ( false );
			
			/* Removed an expand to Position - To Improve tour read performance */
			sap.ui.getCore ( ).getModel ( "ToursOverViewPageODataModel" ).read ( "/Tours", null,
					["$filter=UUID eq X\'" + oSapSplUtils.base64ToHex ( UUID ) + "\'", "$orderby=Planned_StartTime  desc,RegistrationNumber"], null, jQuery.proxy ( that.fnHandleSuccessCallback, this ),
					jQuery.proxy ( that.fnHandleErrorCallback, this ) );
			
			sap.ui.getCore ( ).getModel ( "ToursDetailODataModelStops" ).read ( "/Tours(X" + "\'" + oSapSplUtils.base64ToHex ( UUID ) + "\')/Stops", null,
			[], null, jQuery.proxy ( that.fnHandleSuccessCallbackForStops, this ),
			jQuery.proxy ( that.fnHandleErrorCallbackForStops, this ) );
			
		}
	},

	fnHandleSuccessCallback : function ( data ) {

		var oData = sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ).getData ( ), stopEvents = [], aParticularStopEvents = [];
		// Fix for CSN 1570019085
		this.getView ( ).byId ( "sapSnlhHeaderContainer").setBusy ( false );
		this.getView ( ).byId ( "sapSplTruckDetailsPanel" ).setBusy ( false );
		if ( data && data.results && data.results instanceof Array ) {

			if ( !(data.results[0].isEditable === 0 || data.results[0].TourStatus === "C" || data.results[0].TourStatus === "I") ) {
				this.getView ( ).byId ( "sapSplToursEditButton" ).setEnabled ( true );
			}
			oData.data = data.results[0];
			if ( data.results[0].UUID === this.currentUUID ) {
				if ( oData.showMapFullScreenButton === undefined ) {
					oData.showMapFullScreenButton = true;
				}
				sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ).setData ( oData );
				sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ).updateBindings ( true );
				
			}
		}
	},
	
	
	fnHandleSuccessCallbackForStops : function ( data ) {

		var oData = $.extend ( true, [], sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ).getData ( ) ), stopEvents = [], aParticularStopEvents = [];
		// Fix for CSN 1570019085
		if ( data && data.results && data.results instanceof Array ) {

			data.results.sort ( splReusable.libs.SapSplModelFormatters.sortStopObjectBasedOnSequenceNumber );
			
			oData.data.Stops = data;
			
			this.fnShowTruckOnTheMap ( oData.data, this.byId ( "oSapSplTourDetailsMap" ) );
			
			function fnHandleSuccessCallbackForLog ( data ) {
				if ( data && data.results && data.results instanceof Array ) {
					stopEvents = data.results.filter ( splReusable.libs.SapSplModelFormatters.getFilteredStopEvents );
				}
				
				if ( stopEvents && stopEvents instanceof Array ) {
					for ( var i = 0 ; i < oData.data.Stops.results.length ; i++ ) {
						aParticularStopEvents = [];
						aParticularStopEvents = stopEvents.filter ( splReusable.libs.SapSplModelFormatters.getFilteredParticularStopEvents, oData.data.Stops.results[i] );
						oData.data.Stops.results[i].Events = [];
						oData.data.Stops.results[i].Events = aParticularStopEvents;
					}
				}
				
				if( oData.data.Log.constructor === Object ) {
					oData.data.Log = [];
				}
				
				oData.data.Log = data;
				
				function fnHandleSuccessCallbackForAssignedItems ( data ) {
					
					this.getView ( ).byId ( "sapSplStopPanel" ).setBusy ( false );
					
					if ( data && data.results && data.results instanceof Array ) {
						
						if( data.results.length > 0 ) {
							for ( var i = 0 ; i < data.results.length ; i++ ) {
								for ( var j = 0 ; j < oData.data.Stops.results.length ; j++ ) {
									if( oData.data.Stops.results[j].AssignedItems.results === undefined ) {
										oData.data.Stops.results[j].AssignedItems.results = [];
									}
									if( data.results[i].StopUUID === oData.data.Stops.results[j].UUID ) {
										oData.data.Stops.results[j].AssignedItems.results.push(data.results[i]);
									}
								}
							}
						} else {
							for ( var j = 0 ; j < oData.data.Stops.results.length ; j++ ) {
								if( oData.data.Stops.results[j].AssignedItems.results === undefined ) {
									oData.data.Stops.results[j].AssignedItems.results = [];
								}
							}
						}
					}
					sap.ui.getCore ( ).getModel ( "ToursDetailStopsModel" ).setData ( oData );
					sap.ui.getCore ( ).getModel ( "ToursDetailStopsModel" ).updateBindings ( true );
					sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ).setData ( oData );
				}
				
				function fnHandleErrorCallbackForAssignedItems ( ) {
					this.getView ( ).byId ( "sapSplStopPanel" ).setBusy ( false );
				}
				sap.ui.getCore ( ).getModel ( "ToursDetailODataModelStops" ).read ( "/Items", null,
						["$filter=TourUUID eq X\'" + oSapSplUtils.base64ToHex ( oData.data.UUID ) + "\'"], null, jQuery.proxy ( fnHandleSuccessCallbackForAssignedItems, this ),
						jQuery.proxy ( fnHandleErrorCallbackForAssignedItems, this ) );
				
			}
			
			function fnHandleErrorCallbackForLog ( ) {
				this.getView ( ).byId ( "sapSplStopPanel" ).setBusy ( false );
			}
			sap.ui.getCore ( ).getModel ( "ToursOverViewPageODataModel" ).read ( "/Tours(X" + "\'" + oSapSplUtils.base64ToHex ( oData.data.UUID ) + "\')/Log", null,
					[], null, jQuery.proxy ( fnHandleSuccessCallbackForLog, this ),
					jQuery.proxy ( fnHandleErrorCallbackForLog, this ) );

		}

	},

	fnHandleErrorCallback : function ( ) {
		// Fix for CSN 1570019085
		this.getView ( ).byId ( "sapSplTruckDetailsPanel" ).setBusy ( false );
		this.getView ( ).byId ( "sapSnlhHeaderContainer").setBusy ( false );
	},
	
	fnHandleErrorCallbackForStops: function ( ) {
		// Fix for CSN 1570019085
		this.getView ( ).byId ( "sapSplStopPanel" ).setBusy ( false );
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

			oSapSplMapsDataMarshal.fnAddTruckDetailWindowContent ( oEvent, function ( ) {

			}, that.byId ( "oSapSplTourDetailsMap" ), true );

			// Detail window for Gates
		}
	},

	/**
	 * Method to check if the zoom level zone has changed as compared to previous zoom level
	 * @param oEvent
	 * @returns void
	 * @since 1.0
	 * @private
	 */
	bCanChangeTruckIcon : function ( ) {
		function getZoomLevelZone ( iZoom ) {
			if ( iZoom <= 10 ) {
				return 1;
			} else {
				return 2;
			}
		}

		if ( getZoomLevelZone ( this.iCurZoom ) === getZoomLevelZone ( this.iPrevZoom ) ) {
			return false;
		} else {
			return true;
		}

	},

	/**
	 * Zoom event handler of the tours application
	 * @param oEvent
	 * @return void
	 * @since 1.0
	 * @private
	 */
	fnHandleZoomEventOnTheMap : function ( oEvent ) {

		var oResult = sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ).getData ( ).data;
		var oVBMap = this.byId ( "oSapSplTourDetailsMap" );

		// Capturing the previous Zoom level
		this.iPrevZoom = oVBMap.zoom;

		// Function that saves the current zoom level of the map as an attribute
		// to the passed map instance
		oSapSplMapsDataMarshal.fnGetMapZoom ( oVBMap, oEvent );

		// Capturing the current Zoom level
		this.iCurZoom = oVBMap.zoom;

		if ( this.bCanChangeTruckIcon ( ) === true ) {
// if (oResult.Position && oResult.Position === Object) {
// oSapSplMapsDataMarshal.fnShowTruckFlags(oResult.Position, oVBMap);
// // oSapSplMapsDataMarshal.fnPanToEntity(oVBMap, oResult.Position);
// } else
			if ( oResult.Position && oResult.Position.results && oResult.Position.results.constructor === Array ) {
				for ( var i = 0 ; i < oResult.Position.results.length ; i++ ) {
					oSapSplMapsDataMarshal.fnShowTruckFlags ( oResult.Position.results[i], oVBMap );
				}
			}
		}
	},

	fnEventHandler : function ( oEvent ) {
		if ( JSON.parse ( oEvent.getParameter ( "data" ) ).Action.name === "ZOOM_EVENT" ) {
			this.fnHandleZoomEventOnTheMap ( oEvent );
		}
	},

	fnHandleTourProgressLink : function ( ) {
		splReusable.libs.SapSplStyleSheetLoader.loadStyle ( "./resources/styles/sapSplTourProgress" );
		var eventsData = sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ).getData ( ).data.Log;

		var tourProgressDialogView = sap.ui.view ( {
			id : "SplTourProgressDialogView",
			viewName : "splView.dialogs.SplTourProgressDialog",
			type : sap.ui.core.mvc.ViewType.XML,
			viewData : eventsData
		} );

		var tourProgressDialog = new sap.m.Dialog ( {
			title : oSapSplUtils.getBundle ( ).getText ( "PROGRESS_OF_ALL_STOPS" ),
			content : tourProgressDialogView,
			contentWidth : "20%"
		} ).addStyleClass ( "sapSplTourProgressDialog" ).open ( );

		tourProgressDialog.attachAfterOpen ( function ( ) {
			oSapSplUtils.fnSyncStyleClass ( tourProgressDialog );
		} );

		function fnHandleClose ( oEvent ) {
			oEvent.getSource ( ).destroy ( );
		}
		tourProgressDialog.attachAfterClose ( jQuery.proxy ( fnHandleClose, this ) );

		tourProgressDialogView.getController ( ).setParentDialogInstance ( tourProgressDialog );
	},

	fnHandleMapFullScreen : function ( ) {
		var modelData = sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ).getData ( );
		modelData.showMapFullScreenButton = false;
		sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ).setData ( modelData );
		sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ).updateBindings ( true );
	},

	fnHandleMapExitFullScreen : function ( ) {
		var modelData = sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ).getData ( );
		modelData.showMapFullScreenButton = true;
		sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ).setData ( modelData );
		sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ).updateBindings ( true );
	}

} );
