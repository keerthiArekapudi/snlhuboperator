/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.controller ( "splController.incidents.IncidentsDetailView", {

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 */
	onInit : function ( ) {
		/*Localization*/
		this.fnDefineControlLabelsFromLocalizationBundle ( );

		var oIncidentsDetailViewModel = new sap.ui.model.json.JSONModel ( {
			isEdit : false,
			isDisplay : true,
			noData : true,
			isClicked : false
		} );

		sap.ui.getCore ( ).setModel ( oIncidentsDetailViewModel, "SapSplIncidentsDetailModel" );

		this.getView ( ).setModel ( sap.ui.getCore ( ).getModel ( "SapSplIncidentsDetailModel" ) );

		this.byId ( "SapSplIncidentsDetailAssignedGeofencesTable" ).getBinding ( "items" ).filter ( [new sap.ui.model.Filter ( "isDeleted", sap.ui.model.FilterOperator.EQ, false )] );

		this.oDetailVBI = this.byId ( "oSapSplVBMap" );
		/*Creates a JSON model and sets it to the Visual Business Map control*/
		this.oVBIModel = new sap.ui.model.json.JSONModel ( );
		this.oVBIModel.setData ( oSapSplMapsDataMarshal.getMapsModelJSON ( SapSplEnums.configJSON ) );

		sap.ui.getCore ( ).setModel ( this.oVBIModel, "oSapSplVBModel" );
		this.getView ( ).byId ( "oSapSplVBMap" ).bindProperty ( "config", "oSapSplVBModel>/" );
		this.getView ( ).byId ( "oSapSplVBMap" ).setModel ( sap.ui.getCore ( ).getModel ( "oSapSplVBModel" ) );

		this.byId ( "sapSplIncidentsCategorySelect" ).setModel ( new sap.ui.model.json.JSONModel ( ) );
		this.byId ( "sapSplIncidentsPrioritySelect" ).setModel ( new sap.ui.model.json.JSONModel ( ) );

		this.prepareDataForEnums ( );

		this.aGateToGeofenceMapping = {};

		this.oSapSplGeofencesForAssignmentModel = new sap.ui.model.odata.ODataModel ( oSapSplUtils.getServiceMetadata ( "app", true ) );
	},

	/**
	 * @description Method to prepare data for event category and priority select controls.
	 * @param void.
	 * @returns void.
	 * @since 1.0
	 */
	prepareDataForEnums : function ( ) {
		var oEnumModel = null, aCategoriesData = [], aPriorityData = [], that = this, sTempData = "", oPlaceHolderObject = {};
		oPlaceHolderObject["Value"] = null;
		oPlaceHolderObject["Value.description"] = oSapSplUtils.getBundle ( ).getText ( "PLEASE_SELECT_PLACEHOLDER" );

		oEnumModel = new sap.ui.model.odata.ODataModel ( oSapSplUtils.getServiceMetadata ( "utils", true ) );

		oEnumModel.read ( "/Enumeration('IncidentCategory')/Values", null, null, false, function ( results ) {
			aCategoriesData = results.results;
			sTempData = aCategoriesData[0];
			aCategoriesData[0] = oPlaceHolderObject;
			aCategoriesData[aCategoriesData.length] = sTempData;
			that.byId ( "sapSplIncidentsCategorySelect" ).getModel ( ).setData ( aCategoriesData );
		}, function ( ) {
			jQuery.sap.log.error ( "prepareDataForEnums", "Enumeration read failed", "IncidentsDetailView.controller.js" );
		} );

		oEnumModel.read ( "/Enumeration('Priority')/Values", null, null, false, function ( oResults ) {
			aPriorityData = oResults.results;

			/*CSNFIX : 0001313450 2014 */
			aPriorityData.splice ( 0, 0, oPlaceHolderObject );

			that.byId ( "sapSplIncidentsPrioritySelect" ).getModel ( ).setData ( aPriorityData );
		}, function ( ) {
			jQuery.sap.log.error ( "prepareDataForEnums", "Enumeration read failed", "IncidentsDetailView.controller.js" );
		} );
	},

	/***
	 * @description Method to handle navigation to Manage locations page.
	 * @since 1.0
	 * @returns void.
	 * @param void.
	 */
	fnNavigateToManageLocations : function ( ) {
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

		oSplBaseApplication.getAppInstance ( ).to ( sNavTo, "slide" );
	},

	/**
	 * @description listens to event handling channel which is previously subscribed. This is the default call back when any navigation happens to this view.
	 * It is called even before the onBeforeRendering life cycle method of the view.
	 * @param evt event object of the navigation event.
	 * @returns void.
	 * @since 1.0
	 */
	onBeforeShow : function ( ) {
		oSapSplUtils.setIsDirty ( false );
	},

	/**
	 * @description Method to capture dirty state of the incident detail screen.
	 * @param void.
	 * @returns void.
	 * @since 1.0
	 */
	fnToCaptureLiveChangeToSetIsDirtyFlag : function ( ) {
		if ( !oSapSplUtils.getIsDirty ( ) ) {
			oSapSplUtils.setIsDirty ( true );
		}
	},

	/**
	 * @description Method to Prepare a new dialog, which contains the map instance, this is either to view a geofence/ POI, or to edit the incident source..
	 * @param oEvent {object} event object of the click event.
	 * @param sType {string} the type of shape to show in the map (Polygon/ Flag)
	 * @param sMode {string} the mode of detail screen (either display or create or edit)
	 * @returns void.
	 * @since 1.0
	 */
	fnHandleOpenOfMapInDialog : function ( oEvent, sType, sMode, sTitle ) {
		var that = this, oPolygon = {}, oCoord = {}, coord = {};
		this.oVBI = new sap.ui.vbm.VBI ( {
			width : jQuery ( window ).width ( ) * 0.8,
			height : jQuery ( window ).height ( ) * 0.8,
			/* CSNFIX 0120061532 0001313335 2014 */
			plugin : false,
			submit : function ( oEvent ) {
				that.fnEventHandlerDialogMap ( oEvent );
			},
			config : "{oSapSplVBModel>/}"
		} ).addStyleClass ( "VBI" );

		new sap.m.Dialog ( {
			content : this.oVBI,
			title : sTitle,
			leftButton : new sap.m.Button ( {
				text : oSapSplUtils.getBundle ( ).getText ( "OK" ),
				press : function ( ) {
					if ( sMode !== "Display" ) {
						//set isDirtyflag on change of selection
						that.fnToCaptureLiveChangeToSetIsDirtyFlag ( );
					}
					this.getParent ( ).close ( );
					this.getParent ( ).destroy ( );
				}
			} ),
			rightButton : new sap.m.Button ( {
				text : oSapSplUtils.getBundle ( ).getText ( "CANCEL" ),
				press : function ( ) {
					var oCoord = {}, coord;
					if ( !that.selectedIncidentLocationGeometry ) {
						that.byId ( "oSapSPlVBMapHolder" ).setVisible ( false );
					}
					oCoord["Geometry"] = that.selectedIncidentLocationGeometry;
					var oModelData = sap.ui.getCore ( ).getModel ( "SapSplIncidentsDetailModel" ).getData ( );
					oModelData["IncidentLocationGeometry"] = oCoord["Geometry"];
					sap.ui.getCore ( ).getModel ( "SapSplIncidentsDetailModel" ).setData ( oModelData );
					oCoord["Name"] = "";
					oCoord["LocationID"] = that.selectedIncidentLocationGeometry;
					oCoord["Tag"] = "ALERT";
					if ( oCoord["Geometry"] ) {
						if ( oCoord["Geometry"].constructor === String && oCoord["Geometry"].length !== 0 ) {
							coord = oCoord["Geometry"].split ( ";" );
							/* CSNFIX : 0120061532 1483236    2014*/
							oCoord["Geometry"] = JSON.stringify ( oSapSplMapsDataMarshal.convertStringToGeoJSON ( that.selectedIncidentLocationGeometry ) );
							that.fnShowMarkerInDetailMap ( that.oDetailVBI, oCoord, coord[1], coord[0] );
						}
					} else {
						oSapSplMapsDataMarshal.fnClearMap ( that.oDetailVBI );
						oSapSplMapsDataMarshal.fnResetValues ( that.oDetailVBI );
					}
					this.getParent ( ).close ( );
					this.getParent ( ).destroy ( );
				}
			} )
		} ).open ( ).attachAfterOpen ( function ( oEvent ) {
			oSapSplUtils.fnSyncStyleClass ( oEvent.getSource ( ) );
		} );

		if ( sType === "Polygon" ) {
			oPolygon = {};
			oPolygon["LocationID"] = "key";
			/* CSNFIX : 0120031469 0000429980 2014 */
			/* CSNFIX : 0120031469 0000791844 2014 */
			oPolygon["Name"] = oEvent.getSource ( ).getBindingContext ( ).getObject ( )["GeoFenceName"];
			if ( oEvent.getSource ( ).getBindingContext ( ).getProperty ( )["TechnicalLocationGeometry"] ) {
				oPolygon["Geometry"] = oEvent.getSource ( ).getBindingContext ( ).getProperty ( )["TechnicalLocationGeometry"];
				this.fnApplyPolygonChangesBasedOnMode ( this.oVBI, "Display", oPolygon, oEvent.getSource ( ).getBindingContext ( ).getProperty ( )["TechnicalLocationGeometry"] );
			} else {
				oPolygon["Geometry"] = oEvent.getSource ( ).getBindingContext ( ).getProperty ( )["Geometry"];
				this.fnApplyPolygonChangesBasedOnMode ( this.oVBI, "Display", oPolygon, oEvent.getSource ( ).getBindingContext ( ).getProperty ( )["Geometry"] );
			}
		} else if ( sType === "Flag" ) {
			oCoord = {};
			coord = {};
			oCoord["Geometry"] = oEvent.getSource ( ).getModel ( ).getData ( )["IncidentLocationGeometry"];
			oCoord["Name"] = "";
			oCoord["LocationID"] = oEvent.getSource ( ).getModel ( ).getData ( )["IncidentLocationGeometry"];
			oCoord["Tag"] = "ALERT";
			if ( oCoord["Geometry"] ) {
				coord = oCoord["Geometry"].split ( ";" );
				/* CSNFIX : 0120061532 1483236    2014*/
				oCoord["Geometry"] = JSON.stringify ( oSapSplMapsDataMarshal.convertStringToGeoJSON ( oCoord["Geometry"] ) );
				this.fnShowMarkerInDetailMap ( this.oVBI, oCoord, coord[1], coord[0] );
			}
			this.fnApplyFlagChangesBasedOnMode ( this.oVBI, sMode, oCoord );
			this.selectedIncidentLocationGeometry = oEvent.getSource ( ).getModel ( ).getData ( )["IncidentLocationGeometry"];
		}
	},

	/**
	 * @description Method to Prepare the view based on the mode (edit/ create/ display).
	 * @param oContext {object} context object of the selected incident.
	 * @param sMode {string} the mode in which the page is being displayed in (edit/ create/ display)
	 * @returns void.
	 * @since 1.0
	 */
	fnMakeChangesToDetailPageControlsBasedOnMode : function ( sMode, oContext ) {
		var oCoord = {}, coord = null;
		/* CSNFIX 0120061532 1313985    2014 */
		this.byId ( "oSapSplVBMap" ).removeStyleClass ( "incidentsMapPlaceHolderDisplay" );
		this.byId ( "oSapSplVBMap" ).removeStyleClass ( "incidentsMapPlaceHolderEdit" );
		this.byId ( "SapSplIncidentsDetailPageForm" ).setTitle ( oSapSplUtils.getBundle ( ).getText ( "INCIDENTS_DETAIL_FORM_TITLE" ) );
		if ( sMode === "Display" ) {
			this.byId ( "SapSplIncidentsDetailAssignedGeofencesTable" ).setVisible ( true );
			this.byId ( "SapSplIncidentsNameInput" ).setEditable ( false );
			this.byId ( "SapSplIncidentsLocationLabel" ).setVisible ( false );
			this.byId ( "oSapSplVBMap" ).addStyleClass ( "incidentsMapPlaceHolderDisplay" );
			if ( oContext["IncidentLocationGeometry"] ) {
				oSapSplMapsDataMarshal.fnResetValues ( this.oDetailVBI );
				/* CSNFIX 0120061532 1313985    2014 */
				oSapSplMapsDataMarshal.fnClearMap ( this.oDetailVBI );
				oCoord["Geometry"] = JSON.stringify ( oSapSplMapsDataMarshal.convertStringToGeoJSON ( oContext["IncidentLocationGeometry"] ) );
				oCoord["Name"] = "";
				oCoord["LocationID"] = oContext["IncidentLocationGeometry"];
				oCoord["Tag"] = "ALERT";
				if ( oCoord["Geometry"] ) {
					/* CSNFIX : 1570034240 */
					this.byId ( "oSapSPlVBMapHolder" ).setVisible ( true );
					coord = oContext["IncidentLocationGeometry"].split ( ";" );
					setTimeout ( function ( ) {
						this.fnShowMarkerInDetailMap ( this.oDetailVBI, oCoord, coord[1], coord[0] );
					}.bind ( this ), 250 );
				} else {
					/* CSNFIX : 1570034240 */
					this.byId ( "oSapSPlVBMapHolder" ).setVisible ( false );
				}
			} else {
				this.byId ( "oSapSPlVBMapHolder" ).setVisible ( false );
			}
			this.byId ( "SapSplIncidentsFooterDelete" ).setVisible ( false );
		} else if ( sMode === "Create" ) {
			/* CSNFIX 0120061532 1313985    2014 */
			this.byId ( "oSapSplVBMap" ).addStyleClass ( "incidentsMapPlaceHolderEdit" );
			this.byId ( "oSapSPlVBMapHolder" ).setVisible ( false );
			this.byId ( "SapSplIncidentsLocationLabel" ).setVisible ( true );
			this.HeaderChangeMode = "C";
			this.TextChangeMode = "C";
			oSapSplMapsDataMarshal.fnResetValues ( this.oDetailVBI );
			oSapSplMapsDataMarshal.fnClearMap ( this.oDetailVBI );
			//            this.byId("SapSplIncidentsLocationCoordLabel").setText("");
			this.byId ( "SapSplIncidentsNameInput" ).setEditable ( true );
			this.byId ( "SapSplIncidentsChangeGeoFenceAssignmentButton" ).setText ( oSapSplUtils.getBundle ( ).getText ( "INCIDENTS_ASSIGN_LOCATION" ) );
			this.byId ( "SapSplIncidentsFooterDelete" ).setVisible ( false );
		} else {
			this.HeaderChangeMode = null;
			this.TextChangeMode = null;
			/* CSNFIX 0120061532 1313985    2014 */
			this.byId ( "oSapSplVBMap" ).addStyleClass ( "incidentsMapPlaceHolderEdit" );
			this.byId ( "SapSplIncidentsNameInput" ).setEditable ( true );
			this.byId ( "SapSplIncidentsLocationLabel" ).setVisible ( true );
			if ( oContext["Geometry"] ) {
				/* CSNFIX : 1570034240 */
				this.byId ( "oSapSPlVBMapHolder" ).setVisible ( true );
				oCoord["Geometry"] = JSON.stringify ( oSapSplMapsDataMarshal.convertStringToGeoJSON ( oContext["IncidentLocationGeometry"] ) );
				oCoord["LocationSpecName"] = "";
				oCoord["LocationID"] = oContext["IncidentLocationGeometry"];
				oCoord["Tag"] = "ALERT";
				coord = oContext["IncidentLocationGeometry"].split ( ";" );
				this.fnShowMarkerInDetailMap ( this.oDetailVBI, oCoord, coord[1], coord[0] );
			} else {
				/* CSNFIX : 1570034240, 1570148537 */
				this.byId ( "oSapSPlVBMapHolder" ).setVisible ( false );
			}
			this.byId ( "SapSplIncidentsChangeGeoFenceAssignmentButton" ).setText ( oSapSplUtils.getBundle ( ).getText ( "INCIDENTS_CHANGE_ASSIGNMENT" ) );
			this.byId ( "SapSplIncidentsFooterDelete" ).setVisible ( true );
		}
	},

	/**
	 * @description Method to display a polygon on the map, and make arrangements based on mode.
	 * @param oVBI {object} VB map instance on which the polygon needs to be displayed.
	 * @param sMode {string} the mode in which the page is being displayed in (edit/ create/ display)
	 * @param oPolygon {object} the object representing a polygon - format as required by VB to plot a polygon.
	 * @returns void.
	 * @since 1.0
	 */
	fnApplyPolygonChangesBasedOnMode : function ( oVBI, sMode, oPolygon, sCoord ) {
		this.bMode = false;
		oSapSplMapsDataMarshal.fnResetValues ( oVBI );
		oSapSplMapsDataMarshal.fnShowFences ( oPolygon, oVBI );
		var coord = oSapSplMapsDataMarshal.convertGeoJSONToString ( JSON.parse ( sCoord ) ).split ( ";" );
		oVBI.zoomToGeoPosition ( parseFloat ( coord[0] ), parseFloat ( coord[1] ), 14 );
	},

	/**
	 * @description Method to display a flag on the map, and make arrangements based on mode.
	 * @param oVBI {object} VB map instance on which the flag needs to be displayed.
	 * @param sMode {string} the mode in which the page is being displayed in (edit/ create/ display)
	 * @param oFlag {object} the object representing a flag - format as required by VB to plot a flag.
	 * @returns void.
	 * @since 1.0
	 */
	fnApplyFlagChangesBasedOnMode : function ( oVBI, sMode, oFlag ) {
		if ( sMode === "Display" ) {
			this.bMode = false;
			oSapSplMapsDataMarshal.fnResetValues ( oVBI );
			/* CSNFIX :  0120031469 0000638398 2014 */
			oFlag["Name"] = oSapSplUtils.getBundle ( ).getText ( "INCIDENT_LOCATION_TOOLTIP" );
			oSapSplMapsDataMarshal.fnShowPointOfInterestFlags ( oFlag, oVBI );
			var aCoord = oFlag.split ( ";" );
			oVBI.zoomToGeoPosition ( aCoord[0], aCoord[1], 14 );
		} else if ( sMode === "Edit" ) {
			this.bMode = true;
		}

	},

	/**
	 * @description Method to display a marker on the map and to zoom the detail page map based on the given flag coordinates.
	 * @param oVBI {object} VB map instance on which the flag needs to be displayed.
	 * @param oFlag {object} the object representing a flag - format as required by VB to plot a flag.
	 * @param x {string} longitude of the given flag on the map.
	 * @param y {string} latitude of the given flag on the map
	 * @returns void.
	 * @since 1.0
	 */
	fnShowMarkerInDetailMap : function ( oVBI, oFlag, x, y ) {
		oSapSplMapsDataMarshal.fnClearMap ( oVBI );
		oSapSplMapsDataMarshal.fnResetValues ( oVBI );
		/* CSNFIX :  0120031469 0000638398 2014 */
		oFlag["Name"] = oSapSplUtils.getBundle ( ).getText ( "INCIDENT_LOCATION_TOOLTIP" );
		oSapSplMapsDataMarshal.fnShowPointOfInterestFlags ( oFlag, oVBI );
		if ( x && y ) {
			oVBI.zoomToGeoPosition ( parseFloat ( y ), parseFloat ( x ), 14 );
		}
	},

	/**
	 * @description Method to handle the click event on the map which is opened in a dialog.
	 * this will create a marker on the clicked position.
	 * @param oEvent {object} event object of the click event.
	 * @returns void.
	 * @since 1.0
	 */
	fnEventHandlerDialogMap : function ( oEvent ) {
		/*Click on the Map*/
		if ( JSON.parse ( oEvent.getParameter ( "data" ) ).Action.object === "Map" ) {
			for ( var i = 0 ; i < JSON.parse ( oEvent.getParameter ( "data" ) ).Action.AddActionProperties.AddActionProperty.length ; i++ ) {
				if ( JSON.parse ( oEvent.getParameter ( "data" ) ).Action.AddActionProperties.AddActionProperty[i].name === "pos" ) {
					var sClickedPosition = JSON.parse ( oEvent.getParameter ( "data" ) ).Action.AddActionProperties.AddActionProperty[i]["#"];
					if ( this.bMode ) {
						oSapSplMapsDataMarshal.isMapClickEabled = true;
						/* CSNFIX : 0120031469 624807     2014 */
						oSapSplMapsDataMarshal.fnRemoveVOsOnMap ( "All", this.oVBI );
						oSapSplMapsDataMarshal.fnCreatePointOfInterestFlag ( sClickedPosition, this.oVBI, jQuery.proxy ( this.fnCallback, this ) );
						oSapSplMapsDataMarshal.fnResetValues ( this.oVBI );
					}
				}
			}
		}
	},

	fnEventHandler : function ( ) {

	},

	/**
	 * @description Method to handle the click event on change/ indicate button.
	 * this will make arrangements for the handling the click based on mode and open the dialog in respective modes.
	 * @param oEvent {object} event object of the click event.
	 * @returns void.
	 * @since 1.0
	 */
	fnChangeButtonEvent : function ( oEvent ) {
		if ( oEvent.getSource ( ).getText ( ) === oSapSplUtils.getBundle ( ).getText ( "INCIDENTS_CHANGE_ASSIGNMENT" ) ) {
			this.fnHandleOpenOfMapInDialog ( oEvent, "Flag", "Edit", oSapSplUtils.getBundle ( ).getText ( "MAP_DIALOG_TITLE_EDIT" ) );
		} else {
			this.byId ( "oSapSPlVBMapHolder" ).setVisible ( true );
			this.fnHandleOpenOfMapInDialog ( oEvent, "Flag", "Edit", oSapSplUtils.getBundle ( ).getText ( "MAP_DIALOG_TITLE_CREATE" ) );
		}
	},

	/**
	 * @description Method to handle the click event on view geofence button.
	 * @param oEvent {object} event object of the click event.
	 * @returns void.
	 * @since 1.0
	 */
	fnHandleClickOfDetailViewGeoFence : function ( oEvent ) {
		this.fnHandleOpenOfMapInDialog ( oEvent, "Polygon", "Display", oSapSplUtils.getBundle ( ).getText ( "MAP_DIALOG_TITLE_DISPLAY" ) );
	},

	/**
	 * @description call back method for the click on the dialog map.
	 * this will inturn plot the same point on the detail page map.
	 * @param oPayLoad {object} object representing the detailed information about the clicked point on the map.
	 * @returns void.
	 * @since 1.0
	 */
	fnCallback : function ( oPayload ) {
		this.byId ( "oSapSPlVBMapHolder" ).setVisible ( true );
		var oCoordinate = {}, sPolySpec = "";
		oCoordinate = oPayload["locationGeoCoords"][0];
		sPolySpec = oCoordinate["long"] + ";" + oCoordinate["lat"] + ";" + oCoordinate["alt"];
		this.setLocationTextAndChangeMarker ( sPolySpec, oCoordinate["long"], oCoordinate["lat"] );
	},

	/**
	 * @description Method to change the marker on the detail map and change the coordinated value in the detail page.
	 * this is called internally when ever a new point is clicked in the dialog containing a VB map.
	 * @param sPolygonSpec {string} string representing the clicked point on the dialog map.
	 * @param sLong {string} string representing longitude of the marker.
	 * @param sLat {string} string representing latitude of the marker.
	 * @returns void.
	 * @since 1.0
	 */
	setLocationTextAndChangeMarker : function ( sPolySpec, sLong, sLat ) {
		var oCoord = {};
		if ( this.HeaderChangeMode !== "C" ) {
			this.HeaderChangeMode = "U";
		}
		/* CSNFIX 0120061532 1310760 2014 */
		oCoord["Geometry"] = JSON.stringify ( oSapSplMapsDataMarshal.convertStringToGeoJSON ( sPolySpec ) );
		oCoord["LocationSpecName"] = "";
		oCoord["LocationID"] = JSON.stringify ( oSapSplMapsDataMarshal.convertStringToGeoJSON ( sPolySpec ) );
		oCoord["Tag"] = "ALERT";
		var oModelData = sap.ui.getCore ( ).getModel ( "SapSplIncidentsDetailModel" ).getData ( );
		oModelData["IncidentLocationGeometry"] = sPolySpec;
		this.fnShowMarkerInDetailMap ( this.oDetailVBI, oCoord, sLat, sLong );
	},

	/**
	 * @description Method to capture dirty flag of the incident detail page.
	 * @param
	 * {object} oEvent event object.
	 * @returns void.
	 * @since 1.0
	 */
	fnhandleEditOfIncidentDetails : function ( oEvent ) {

		//set isDirtyflag on change of selection
		this.fnToCaptureLiveChangeToSetIsDirtyFlag ( );

		if ( oEvent.getSource ( ).constructor === sap.m.Input ) {
			if ( this.TextChangeMode !== "C" ) {
				this.TextChangeMode = "U";
			}
		} else {
			if ( this.HeaderChangeMode !== "C" ) {
				this.HeaderChangeMode = "U";
			}
		}
	},

	/**
	 * @description Method to handle the click of "Edit" button in the detail page footer.
	 * @param void.
	 * @returns void.
	 * @since 1.0
	 */
	fnHandlePressOfEditIncidents : function ( ) {
		var newData = {};
		var oModelData = sap.ui.getCore ( ).getModel ( "SapSplIncidentsDetailModel" ).getData ( ); //.getData();
		newData = jQuery.extend ( {}, oModelData );
		if ( oModelData["Geofences"] ) {
			newData["Geofences"] = jQuery.extend ( [], oModelData["Geofences"] );
		} else {
			newData["Geofences"] = [];
		}
		newData["isEdit"] = true;
		newData["isDisplay"] = false;
		newData["isNotCreate"] = true;
		sap.ui.getCore ( ).getModel ( "SapSplIncidentsDetailModel" ).setData ( newData );
		this.fnMakeChangesToDetailPageControlsBasedOnMode ( "Edit", newData );
		this.getView ( ).byId ( "SapSplIncidentsNameInput" ).focus ( );
	},

	/**
	 * @description Method to handle the click of "Cancel" button in the detail page footer of the edit screen.
	 * @param void.
	 * @returns void.
	 * @since 1.0
	 */
	fnHandlePressOfCancelEditIncidents : function ( ) {
		var that = this;
		if ( oSapSplUtils.getIsDirty ( ) ) {
			sap.m.MessageBox.show ( oSapSplUtils.getBundle ( ).getText ( "DATA_LOSS_WARNING_TEXT" ), sap.m.MessageBox.Icon.WARNING, oSapSplUtils.getBundle ( ).getText ( "WARNING" ), [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
					function ( selection ) {
						if ( selection === "YES" ) {
							that.selectMasterListItemOnBackNavigation ( );
							jQuery.proxy ( that.handlePressOfOkDataLossWarningDialog ( ), that );
							oSapSplUtils.setIsDirty ( false );
						}
					}, null, oSapSplUtils.fnSyncStyleClass ( "messageBox" ) );
		} else {
			that.selectMasterListItemOnBackNavigation ( );
			jQuery.proxy ( that.handlePressOfOkDataLossWarningDialog ( ), that );
		}
		/* Fix for the Incident 1580100686 */
		sap.ui.getCore ( ).byId ( "IncidentsMasters--sapSplIncidentSearch" ).focus ( );
	},

	/**
	 * @description selects master list item on back navigation
	 * @param {object} modelName
	 * @returns void
	 * @since 1.0
	 * */
	selectMasterListItemOnBackNavigation : function ( ) {
		var sIndex, previousIncidentUUID, masterList;
		if ( this.incidentSelected ) {
			previousIncidentUUID = this.incidentSelected;
			masterList = this.getView ( ).getParent ( ).getParent ( ).getCurrentMasterPage ( ).getController ( ).byId ( "SapSplIncidentsList" );

			for ( sIndex = 0 ; sIndex < masterList.getItems ( ).length ; sIndex++ ) {
				if ( masterList.getItems ( )[sIndex].sId.indexOf ( "oSapSplIncidentListItem" ) !== -1 ) {
					if ( masterList.getItems ( )[sIndex].getBindingContext ( ).getProperty ( ).UUID === previousIncidentUUID ) {
						masterList.setSelectedItem ( masterList.getItems ( )[sIndex] );
						break;
					}
				}
			}
		}

	},

	/**
	 * @description Method to handle the click of OK button in the data loss warning dialog.
	 * @param
	 * void.
	 * @returns void.
	 * @since 1.0
	 */
	handlePressOfOkDataLossWarningDialog : function ( ) {
		var oModelData = this.oCurentMasterItemData, newData = {};
		newData = jQuery.extend ( {}, oModelData );
		newData["Geofences"] = [];
		if ( oModelData ) {
			if ( oModelData["Geofences"] ) {
				newData["Geofences"] = jQuery.extend ( [], oModelData["Geofences"] );
			}
			newData["noData"] = false;
			newData["isClicked"] = true;
		} else {
			newData["noData"] = true;
			newData["isClicked"] = false;
		}
		if ( !newData ) {
			newData = {};
		}
		oSapSplMapsDataMarshal.fnClearMap ( this.oDetailVBI );
		newData["isEdit"] = false;
		newData["isDisplay"] = true;
		newData["isNotCreate"] = true;

		this.byId ( "SapSplIncidentsDetailAssignedGeofencesTable" ).setVisible ( newData["isClicked"] );

		var aModelData = [];
		if ( newData["Geofences"] ) {
			aModelData = jQuery.extend ( [], newData["Geofences"] );
		}
		for ( var i = 0 ; i < aModelData.length ; i++ ) {
			if ( aModelData[i]["isDeleted"] === true ) {
				aModelData[i]["CHANGEMODE"] = null;
				aModelData[i]["isDeleted"] = false;
			}
		}
		newData["Geofences"] = aModelData;
		sap.ui.getCore ( ).getModel ( "SapSplIncidentsDetailModel" ).setData ( newData );
		this.fnMakeChangesToDetailPageControlsBasedOnMode ( "Display", newData );
		this.byId ( "SapSplIncidentsDetailAssignedGeofencesTable" ).getBinding ( "items" ).filter ( [new sap.ui.model.Filter ( "isDeleted", sap.ui.model.FilterOperator.EQ, false )] );
	},

	/**
	 * @description setter method for the context object of the selected master list item.
	 * this will be used to be set on the view when the user clicks on the "Cancel" button
	 * @param oMasterItemData {object} selected master items context object.
	 * @returns void.
	 * @since 1.0
	 */
	fnSetSelectedMasterItemData : function ( oMasterItemData ) {
		this.oCurentMasterItemData = jQuery.extend ( {}, oMasterItemData );
		this.oCurentMasterItemData["Geofences"] = [];
		if ( oMasterItemData["Geofences"] ) {
			for ( var i = 0 ; i < oMasterItemData["Geofences"].length ; i++ ) {
				this.oCurentMasterItemData["Geofences"].push ( jQuery.extend ( {}, oMasterItemData["Geofences"][i] ) );
			}
		} else {
			this.oCurentMasterItemData["Geofences"] = [];
		}
	},

	/**
	 * @description Method to handle localization of all the hard code texts in the view.
	 * @param void.
	 * @returns void.
	 * @since 1.0
	 */
	fnDefineControlLabelsFromLocalizationBundle : function ( ) {
		this.byId ( "SapSplIncidentsDetailPageForm" ).setTitle ( oSapSplUtils.getBundle ( ).getText ( "INCIDENTS_DETAIL_FORM_TITLE" ) );
		this.byId ( "SapSplIncidentsNameLabel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "INCIDENTS_NAME" ) );
		this.byId ( "SapSplIncidentsMessageLabel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "INCIDENTS_MESSAGE" ) );
		this.byId ( "SapSplIncidentsCategoryLabel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "INCIDENTS_CATEGORY" ) );
		this.byId ( "SapSplIncidentsPriorityLabel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "INCIDENTS_PRIORITY" ) );
		this.byId ( "SapSplIncidentsCategoryLabelInDisplay" ).setText ( oSapSplUtils.getBundle ( ).getText ( "INCIDENTS_CATEGORY" ) );
		this.byId ( "SapSplIncidentsPriorityLabelInDisplay" ).setText ( oSapSplUtils.getBundle ( ).getText ( "INCIDENTS_PRIORITY" ) );
		this.byId ( "SapSplIncidentsLocationLabel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "INCIDENTS_LOCATION" ) );
		this.byId ( "SapSplAssignedGeofencesTableColumnHeader_Geofence" ).setText ( oSapSplUtils.getBundle ( ).getText ( "INCIDENTS_GEOFENCE" ) );
		this.byId ( "SapSplAssignedGeofencesTableColumnHeader_Gate" ).setText ( oSapSplUtils.getBundle ( ).getText ( "INCIDENTS_GATES" ) );
		this.byId ( "SapSplIncidentsDetailAssignedGeofencesTable" ).setHeaderText ( oSapSplUtils.getBundle ( ).getText ( "INCIDENTS_ASSIGNED_GEOFENCES" ) );
		this.byId ( "SapSplIncidentsDetailPage" ).setTitle ( oSapSplUtils.getBundle ( ).getText ( "INCIDENTS_DETAIL_PAGE_TITLE" ) );
		this.byId ( "SapSplIncidentsAddGeoFenceButton" ).setText ( oSapSplUtils.getBundle ( ).getText ( "INCIDENTS_ADD_GEOFENCE" ) );
		this.byId ( "SapSplIncidentsViewGeoFenceLink" ).setText ( oSapSplUtils.getBundle ( ).getText ( "INCIDENTS_VIEW_DETAILS" ) );
		this.byId ( "SapSplIncidentsChangeGeoFenceAssignmentButton" ).setText ( oSapSplUtils.getBundle ( ).getText ( "INCIDENTS_CHANGE_ASSIGNMENT" ) );
		this.byId ( "SapSplIncidentsFooterEdit" ).setText ( oSapSplUtils.getBundle ( ).getText ( "MY_COLLEAGUES_EDIT_BUTTON" ) );
		this.byId ( "SapSplIncidentsFooterManageGeofences" ).setText ( oSapSplUtils.getBundle ( ).getText ( "INCIDENTS_FOOTER_MANAGE_GEOFENCES" ) );
		this.byId ( "SapSplIncidentsFooterSave" ).setText ( oSapSplUtils.getBundle ( ).getText ( "NEW_CONTACT_SAVE" ) );
		this.byId ( "SapSplIncidentsFooterCancel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "MY_COLLEAGUES_CANCEL_BUTTON" ) );
		this.byId ( "SapSplIncidentsFooterDelete" ).setText ( oSapSplUtils.getBundle ( ).getText ( "INCIDENTS_FOOTER_DELETE" ) );
		this.byId ( "SapSplIncidentsDetailAssignedGeofencesTable" ).setNoDataText ( oSapSplUtils.getBundle ( ).getText ( "NO_GEOFENCES_ASSIGNED_TEXT" ) );
		this.byId ( "sapSplIncidentDetailNoDataLabel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "NO_INCIDENTS_TEXT" ) );
		/* CSNFIX 0001295875 2014 */
		this.byId ( "SapSplDeleteGeofenceAssignmentButton" ).setTooltip ( oSapSplUtils.getBundle ( ).getText ( "DELETE_ASSIGNMENT_BUTTON_TOOLTIP" ) );
	},

	handleSelectOfGates : function ( oEvent ) {
		var sIndex, compareKey, oBoundObject;
		oBoundObject = oEvent.getParameters ( ).listItem.getBindingContext ( ).getObject ( );
		compareKey = "TechnicalLocationID";
		if ( oBoundObject["ID"] === "ALL" ) {

			for ( var i = 0 ; i < oEvent.getSource ( ).getItems ( ).length ; i++ ) {
				var sID = oEvent.getSource ( ).getItems ( )[i].getBindingContext ( ).getObject ( )["ID"];
				if ( !sID ) {
					oEvent.getSource ( ).getItems ( )[i].setSelected ( oEvent.getParameters ( ).selected );
					oEvent.getSource ( ).fireSelectionChange ( {
						selected : oEvent.getParameters ( ).selected,
						listItem : oEvent.getSource ( ).getItems ( )[i]
					} );
				}
			}

			var oMasterListItem = sap.ui.core.Fragment.byId ( "selectGeoFences", "sapSplGeofenceToIncidentsAssignmentNavContainer" ).getPages ( )[1].oMasterListItem;
			oMasterListItem.getParent ( ).fireSelectionChange ( {
				listItem : oMasterListItem,
				selected : oEvent.getParameters ( ).selected
			} );

		} else {
			if ( oEvent.getParameters ( ).selected ) {
				var bCanAdd = true;
				for ( sIndex = 0 ; sIndex < this.aTempListOfSelections.length ; sIndex++ ) {
					if ( this.aTempListOfSelections[sIndex][compareKey] === oBoundObject[compareKey] && this.aTempListOfSelections[sIndex]["isDeleted"] === false ) {
						bCanAdd = false;
					}
				}
				if ( bCanAdd ) {
					oBoundObject["isStacked"] = "1";
					oBoundObject["CHANGEMODE"] = "C";
					oBoundObject["GeoFenceName"] = this.sSelectedGeofenceName;
					oBoundObject["GateName"] = oBoundObject["Name"];
					oBoundObject["isDeleted"] = false;
					this.aTempListOfSelections.push ( oBoundObject );
				}
			} else {
				for ( sIndex = 0 ; sIndex < this.aTempListOfSelections.length ; sIndex++ ) {
					if ( this.aTempListOfSelections[sIndex][compareKey] === oBoundObject[compareKey] ) {
						this.aTempListOfSelections.splice ( sIndex, 1 );
						break;
					}
				}
			}
		}
	},

	/**
	 * @description Method to handle the click of "Add Geofence" button in the detail page.
	 * this will inturn open a new selectDialog containing the list of geofences, which is implemented as a fragment in SPL.
	 * @param void.
	 * @returns void.
	 * @since 1.0
	 */
	fnHandleAddGeoFenceForIncidentAssignment : function ( ) {

		var that = this;
		this.aTempListOfSelections = [];
		var oModelData = sap.ui.getCore ( ).getModel ( "SapSplIncidentsDetailModel" ).getData ( );

		if ( oModelData["Geofences"] ) {
			for ( var i = 0 ; i < oModelData["Geofences"].length ; i++ ) {
				this.aTempListOfSelections.push ( jQuery.extend ( true, {}, oModelData["Geofences"][i] ) );
			}
		} else {
			this.aTempListOfSelections = [];
		}

		function handleSuccessOfMyLocations ( data ) {
			if ( sap.ui.getCore ( ).getModel ( "GeofencesForAssignmentModel" ) ) {
				sap.ui.getCore ( ).getModel ( "GeofencesForAssignmentModel" ).setData ( that.getDataForFragment ( data.results, "I" ) );
				sap.ui.core.Fragment.byId ( "selectGeoFences", "listGeofencesPage" ).setModel ( sap.ui.getCore ( ).getModel ( "GeofencesForAssignmentModel" ) );
			} else {
				sap.ui.getCore ( ).setModel ( new sap.ui.model.json.JSONModel ( that.getDataForFragment ( data.results, "I" ) ), "GeofencesForAssignmentModel" );
				sap.ui.core.Fragment.byId ( "selectGeoFences", "listGeofencesPage" ).setModel ( sap.ui.getCore ( ).getModel ( "GeofencesForAssignmentModel" ) );
			}
		}

		/* CSNFIX : 0120031469 791932     2014
		0120031469 792076     2014 */

		function handleConfirm ( oEvent ) {
			var navContainer = sap.ui.core.Fragment.byId ( "selectGeoFences", "sapSplGeofenceToIncidentsAssignmentNavContainer" );
			var sCurrentPageId = navContainer.getCurrentPage ( ).sId;

			if ( sCurrentPageId.indexOf ( "Geofence" ) !== -1 ) {
				var oModelData = sap.ui.getCore ( ).getModel ( "SapSplIncidentsDetailModel" ).getData ( );
				oModelData["Geofences"] = that.aTempListOfSelections;
				sap.ui.getCore ( ).getModel ( "SapSplIncidentsDetailModel" ).setData ( oModelData );
				that.byId ( "SapSplIncidentsDetailAssignedGeofencesTable" ).getBinding ( "items" ).filter ( new sap.ui.model.Filter ( "isDeleted", sap.ui.model.FilterOperator.EQ, false ) );
				that.byId ( "SapSplIncidentsDetailAssignedGeofencesTable" ).setVisible ( true );
				that.oLocationFragment = null;
				oEvent.getSource ( ).getParent ( ).getParent ( ).destroy ( );
			} else {
				navContainer.back ( );
			}
		}

		function handleCancel ( oEvent ) {
			var navContainer = sap.ui.core.Fragment.byId ( "selectGeoFences", "sapSplGeofenceToIncidentsAssignmentNavContainer" );
			var sCurrentPageId = navContainer.getCurrentPage ( ).sId;
			if ( sCurrentPageId.indexOf ( "Geofence" ) !== -1 ) {
				oEvent.getSource ( ).getParent ( ).getParent ( ).destroy ( );
				that.oLocationFragment = null;
			} else {
				navContainer.back ( );
			}

		}

		/* CSNFIX 0120061532 1482984    2014 */
		if ( !oModelData["Geofences"] ) {
			oModelData["Geofences"] = [];
		}

		if ( !this.oLocationFragment ) {
			this.oLocationFragment = sap.ui.xmlfragment ( "selectGeoFences", "splReusable.fragments.SelectGeofencesForIncidents", this );
			this.oLocationFragment.attachAfterOpen ( function ( oEvent ) {
				oSapSplUtils.fnSyncStyleClass ( oEvent.getSource ( ) );
			} );
			this.oLocationFragment.getBeginButton ( ).attachPress ( handleConfirm );
			this.oLocationFragment.getEndButton ( ).attachPress ( handleCancel );
			sap.ui.core.Fragment.byId ( "selectGeoFences", "sapSplGeofenceToIncidentAssignmentList" ).setBusy ( true );
			sap.ui.core.Fragment.byId ( "selectGeoFences", "listGeofencesPage" ).setTitle ( oSapSplUtils.getBundle ( ).getText ( "SEND_MESSAGE_SELECT_GEOFENCE" ) );
			sap.ui.core.Fragment.byId ( "selectGeoFences", "sapSplSelectGatesPageTitle" ).setText ( oSapSplUtils.getBundle ( ).getText ( "SELECT_GATES" ) );
			/*CSNFIX : 0120061532 0001407020 2014 */
			sap.ui.core.Fragment.byId ( "selectGeoFences", "sapSplGeofenceToIncidentAssignmentList" ).setNoDataText ( oSapSplUtils.getBundle ( ).getText ( "NO_DATA_TEXT_GEOFENCE" ) );
			sap.ui.core.Fragment.byId ( "selectGeoFences", "sapSplGeofenceToIncidentAssignmentList" ).addEventDelegate ( {
				onAfterRendering : function ( ) {
					var oList = null;
					oList = sap.ui.core.Fragment.byId ( "selectGeoFences", "sapSplGeofenceToIncidentAssignmentList" );
					if ( oList.getModel ( ) ) {
						oList.setBusy ( false );
						oList.setShowNoData ( true );
					} else {
						oList.setShowNoData ( false );
					}
				}
			} );
			sap.ui.core.Fragment.byId ( "selectGeoFences", "listGatesPage" ).setModel ( new sap.ui.model.json.JSONModel ( ) );
			sap.ui.core.Fragment.byId ( "selectGeoFences", "sapSplSelectGeofencesForIncidentsConfirm" ).setText ( oSapSplUtils.getBundle ( ).getText ( "OK_BUTTON_TEXT" ) );
			sap.ui.core.Fragment.byId ( "selectGeoFences", "sapSplSelectGeofencesForIncidentsCancel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "CANCEL" ) );
		}
		var oDataModelFilters = ["$filter= Tag eq 'LC0004'"];

		this.oLocationFragment.open ( );
		jQuery ( "#selectGeoFences--SapSplGeofenceToIncidentAssignmentSelectDialog-dialog" ).addClass ( "assignGeofencesDialog" );
		if ( sap.ui.getCore ( ).getModel ( "GeofencesForAssignmentModel" ) ) {
			this.oSapSplGeofencesForAssignmentModel.read ( "/MyLocations", null, oDataModelFilters, true, handleSuccessOfMyLocations, function ( ) {
				sap.ui.core.Fragment.byId ( "selectGeoFences", "sapSplGeofenceToIncidentAssignmentList" ).setShowNoData ( true );
			} );

		} else {
			this.oSapSplGeofencesForAssignmentModel.read ( "/MyLocations", null, oDataModelFilters, true, handleSuccessOfMyLocations, function ( ) {
				sap.ui.core.Fragment.byId ( "selectGeoFences", "sapSplGeofenceToIncidentAssignmentList" ).setShowNoData ( true );
			} );

		}

	},

	/**
	 * @description Method to get data for the fragment (dialog for geofence assignment)
	 * The data is expected to be in a proper format, with the checked property as true for those objects,
	 * which are already assigned previously.
	 * @param
	 * {array} aData data to be bound to the fragment.
	 * @returns {array} aData data to be bound to the fragment, with all the required changes.
	 * @since 1.0
	 */
	getDataForFragment : function ( aData ) {
		var aAssignedGeofences = this.aTempListOfSelections;

		for ( var i = 0 ; i < aData.length ; i++ ) {
			aData[i]["checked"] = false;
			for ( var j = 0 ; j < aAssignedGeofences.length ; j++ ) {
				if ( aAssignedGeofences[j]["isStacked"] !== "1" ) {
					if ( aData[i]["LocationID"] === aAssignedGeofences[j]["LocationID"] && aAssignedGeofences[j]["isDeleted"] === false ) {
						aData[i]["checked"] = true;
						aData[i]["ALL"] = true;
					}
				}
			}
		}

		return aData;
	},

	/**
	 * @description Method to trigger the DELETE ajax call in case of delete of an incident.
	 * @param void.
	 * @returns void.
	 * @since 1.0
	 */
	fnHandlePressOfDeleteIncidents : function ( ) {
		var that = this;
		/* CSNFIX : 0120061532 0001308659 2014 */
		sap.m.MessageBox.show ( oSapSplUtils.getBundle ( ).getText ( "INCIDENT_DELETE_CONFIRMATION" ), sap.m.MessageBox.Icon.WARNING, oSapSplUtils.getBundle ( ).getText ( "WARNING" ), [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
				function ( selection ) {
					if ( selection === "YES" ) {
						that.fnHandlePressOfSaveIncidents ( null, "DELETE" );
						oSapSplUtils.setIsDirty ( false );
					}
				}, null, oSapSplUtils.fnSyncStyleClass ( "messageBox" ) );
	},

	/**
	 * @description Method to handle the  payload for search.
	 * @param
	 * {string} sSearchTerm term searched for.
	 * @param {string} sTypeOfAction type of action which will decide the ajax method type.
	 * @returns {object} oPayload the payload to be used for search.
	 * @since 1.0
	 */
	fnHandlePressOfSaveIncidents : function ( oEvent, sTypeOfAction ) {
		var oPayLoadForPost = null, model = null, sType = null;
		var that = this;
		if ( sTypeOfAction ) {
			sType = sTypeOfAction;
		}
		if ( !sType ) {
			if ( sap.ui.getCore ( ).getModel ( "SapSplIncidentsDetailModel" ).getData ( )["isNotCreate"] ) {
				sType = "PUT";
			} else {
				sType = "POST";
			}
		}

		oPayLoadForPost = this.preparePayLoadForPost ( sType );
		if ( oPayLoadForPost["Header"].length > 0 || oPayLoadForPost["Text"].length > 0 || oPayLoadForPost["Location"].length > 0 ) {
			oSapSplBusyDialog.getBusyDialogInstance ( {
				title : oSapSplUtils.getBundle ( ).getText ( "BUSY_DIALOG_MESSAGE" )
			} ).open ( );
			if ( sType === "DELETE" ) {
				sType = "POST";
			}
			oSapSplAjaxFactory.fireAjaxCall ( {
				url : oSapSplUtils.getServiceMetadata ( "incidents", true ),
				method : sType,
				data : JSON.stringify ( oPayLoadForPost ),
				success : function ( data, success, messageObject ) {
					if ( data.constructor === String ) {
						data = JSON.parse ( data );
					}
					oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
					model = sap.ui.getCore ( ).getModel ( "SapSplIncidentsDetailModel" ).getData ( );
					if ( messageObject["status"] === 200 && data["Error"].length === 0 ) {

						var oCustomData = new sap.ui.core.CustomData ( {
							key : "bRefreshTile",
							value : true
						} );
						oSplBaseApplication.getAppInstance ( ).getCurrentPage ( ).destroyCustomData ( );
						oSplBaseApplication.getAppInstance ( ).getCurrentPage ( ).addCustomData ( oCustomData );

						if ( model["isNotCreate"] ) {
							sap.ca.ui.message.showMessageToast ( oSapSplUtils.getBundle ( ).getText ( "CHANGES_SAVED_SUCCESS" ) );
						} else {
							sap.ca.ui.message.showMessageToast ( oSapSplUtils.getBundle ( ).getText ( "INCIDENT_CREATE_SUCCESS" ) );
						}
						oSapSplUtils.setIsDirty ( false );
					} else {
						var errorMessage = oSapSplUtils.getErrorMessagesfromErrorPayload ( data )["ufErrorObject"];
						sap.ca.ui.message.showMessageBox ( {
							type : sap.ca.ui.message.Type.ERROR,
							message : oSapSplUtils.getErrorMessagesfromErrorPayload ( data )["errorWarningString"],
							details : errorMessage
						} );
					}
					that.getView ( ).getParent ( ).getParent ( ).getCurrentMasterPage ( ).byId ( "SapSplIncidentsList" ).addCustomData ( new sap.ui.core.CustomData ( {
						key : data.Header[0].UUID
					} ) );
					sap.ui.getCore ( ).getModel ( "IncidentsListODataModel" ).refresh ( );
				},
				error : function ( error ) {
					jQuery.sap.log.error ( "fnHandlePressOfSaveIncidents", "ajax failed", "IncidentsDetailView.controller.js" );
					oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
					sap.ui.getCore ( ).getModel ( "SapSplIncidentsDetailModel" ).refresh ( );
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
				}
			} );
		}
	},

	/**
	 * @description Method to prepare the payload for post (create/ edit), as per the requirements.
	 * @param void.
	 * @returns oMainPayLoad {object} object containing the incident master payload, location assignment payload.
	 * @since 1.0
	 */
	preparePayLoadForPost : function ( sMode ) {

		var oMainPayLoad = {}, oIncidentHeader = {}, oIncidentText = {}, oContext = {}, sIncidentUUID = "", sIncidentName = "";
		oMainPayLoad["Header"] = [];
		oMainPayLoad["Text"] = [];
		oMainPayLoad["Recipient"] = [];
		oMainPayLoad["Object"] = "MessageTemplate";
		oContext = sap.ui.getCore ( ).getModel ( "SapSplIncidentsDetailModel" ).getData ( );

		if ( sap.ui.getCore ( ).getModel ( "SapSplIncidentsDetailModel" ).getData ( )["isNotCreate"] ) {
			sIncidentUUID = oContext["UUID"];
		} else {
			sIncidentUUID = oSapSplUtils.getUUID ( );
		}

		/* Fix for incident : 1570414316 */
		if ( !oContext["Name"] ) {
			sIncidentName = "";
		} else {
			sIncidentName = oContext["Name"];
		}

		oIncidentHeader["UUID"] = sIncidentUUID;
		oIncidentHeader["Name"] = sIncidentName;
		oIncidentHeader["Priority"] = this.byId ( "sapSplIncidentsPrioritySelect" ).getSelectedKey ( ); //.getBindingContext().getProperty("Value");
		oIncidentHeader["Category"] = this.byId ( "sapSplIncidentsCategorySelect" ).getSelectedKey ( );
		oIncidentHeader["SourceLocation"] = oSapSplMapsDataMarshal.convertStringToGeoJSON ( oContext["IncidentLocationGeometry"] );
		oIncidentHeader["isDeleted"] = "0";
		oIncidentHeader["OwnerID"] = oSapSplUtils.getCompanyDetails ( )["BasicInfo_CompanyID"];
		oIncidentHeader["AuditTrail.CreatedBy"] = null;
		oIncidentHeader["AuditTrail.ChangedBy"] = null;
		oIncidentHeader["AuditTrail.CreationTime"] = null;
		oIncidentHeader["AuditTrail.ChangeTime"] = null;

		if ( oIncidentHeader["Priority"] === "" ) {
			oIncidentHeader["Priority"] = null;
		}

		if ( oIncidentHeader["Category"] === "" ) {
			oIncidentHeader["Category"] = null;
		}

		oMainPayLoad["Header"].push ( oIncidentHeader );
		if ( sMode === "DELETE" ) {
			oIncidentHeader.ChangeMode = "D";
		}
		oIncidentText["UUID"] = sIncidentUUID;
		/* CSN FIX : 0120031469 682358 2014 Remove the Language attribute from the payload*/
		if ( oContext["LongText"] ) {
			if ( oContext["LongText"].length > 50 ) {
				oIncidentText["ShortText"] = oContext["LongText"].substr ( 0, 49 );
			} else {
				oIncidentText["ShortText"] = oContext["LongText"];
			}
			oIncidentText["LongText"] = oContext["LongText"];
		} else {
			oIncidentText["ShortText"] = null;
			oIncidentText["LongText"] = null;
		}
		if ( sMode === "DELETE" ) {
			oIncidentText.ChangeMode = "D";
		}
		oMainPayLoad["Text"].push ( oIncidentText );
		//        }
		if ( oContext["Geofences"] ) {
			var aAssignedGeofences = oContext["Geofences"];
			for ( var i = 0 ; i < aAssignedGeofences.length ; i++ ) {
				var oLocationObject = {};

				if ( aAssignedGeofences[i]["isDeleted"] === false ) {
					oLocationObject["isDeleted"] = "0";
					oLocationObject["UUID"] = oSapSplUtils.getUUID ( );

					oLocationObject["ParentUUID"] = sIncidentUUID;
					oLocationObject["RecipientType"] = "Location";
					if ( aAssignedGeofences[i]["isStacked"] === "0" ) {
						oLocationObject["RecipientUUID"] = aAssignedGeofences[i]["LocationID"];
					} else {
						if ( aAssignedGeofences[i]["TechnicalLocationID"] ) {
							oLocationObject["RecipientUUID"] = aAssignedGeofences[i]["TechnicalLocationID"];
						} else {
							oLocationObject["RecipientUUID"] = aAssignedGeofences[i]["LocationID"];
						}

					}
					oLocationObject["AuditTrail.CreatedBy"] = null;
					oLocationObject["AuditTrail.ChangedBy"] = null;
					oLocationObject["AuditTrail.CreationTime"] = null;
					oLocationObject["AuditTrail.ChangeTime"] = null;
					if ( sMode === "DELETE" ) {
						oLocationObject.ChangeMode = "D";
					}
					oMainPayLoad["Recipient"].push ( oLocationObject );
				}
			}
		}
		if ( sMode === "DELETE" ) {
			oMainPayLoad["Recipient"] = [];
			oMainPayLoad.inputHasChangeMode = true;
		}
		return oMainPayLoad;
	},

	/**
	 * @description Method to handle the click event of the click of delete location button, from the location assignment table in the detail page..
	 * @param oEvent {object} event object of the click event.
	 * @returns void.
	 * @since 1.0
	 */
	fnHandleClickOfDeleteGeofence : function ( oEvent ) {

		var aModelData = [], sLocationID = "", oData = null, i;
		this.fnToCaptureLiveChangeToSetIsDirtyFlag ( );
		oData = sap.ui.getCore ( ).getModel ( "SapSplIncidentsDetailModel" ).getData ( );

		for ( i = 0 ; i < oData["Geofences"].length ; i++ ) {
			aModelData.push ( jQuery.extend ( {}, oData["Geofences"][i] ) );
		}
		var sLocationKey = "";
		var oBoundObject = oEvent.getSource ( ).getParent ( ).getBindingContext ( ).getObject ( );
		if ( oBoundObject["isStacked"] === "0" ) {
			sLocationKey = "LocationID";
		} else {
			sLocationKey = "TechnicalLocationID";
		}

		/*        CSNFIX 0120061532 1313104    2014 */
		sLocationID = oBoundObject[sLocationKey];
		for ( i = 0 ; i < aModelData.length ; i++ ) {
			sLocationKey = "";
			if ( aModelData[i]["isStacked"] === "0" ) {
				sLocationKey = "LocationID";
			} else {
				sLocationKey = "TechnicalLocationID";
			}
			if ( aModelData[i][sLocationKey] === sLocationID ) {
				aModelData[i]["CHANGEMODE"] = "D";
				aModelData[i]["isDeleted"] = true;
				aModelData[i]["checked"] = false;
			}
		}
		oData["Geofences"] = aModelData;
		sap.ui.getCore ( ).getModel ( "SapSplIncidentsDetailModel" ).setData ( oData );
		this.byId ( "SapSplIncidentsDetailAssignedGeofencesTable" ).getBinding ( "items" ).filter ( new sap.ui.model.Filter ( "isDeleted", sap.ui.model.FilterOperator.EQ, false ) );
	},

	/**
	 * @description Method to handle back navigation in the assign geofence fragment.
	 * @param void.
	 * @returns void.
	 * @since 1.0
	 */
	handleBackNavigationInGeofenceDialog : function ( ) {
		var navContainer = sap.ui.core.Fragment.byId ( "selectGeoFences", "sapSplGeofenceToIncidentsAssignmentNavContainer" );
		navContainer.back ( );
	},

	/**
	 * @description Method to handle click of list item in the assigned geofence screen.
	 * This would fetch all the gates under the selected geofence.
	 * @param
	 * {object} oEvent event object.
	 * @returns void.
	 * @since 1.0
	 */
	fnHandleClickOfListItem : function ( oEvent ) {
		var aGates = [];
		var navContainer = sap.ui.core.Fragment.byId ( "selectGeoFences", "sapSplGeofenceToIncidentsAssignmentNavContainer" );
		var oSelectedListItem = null;
		oSelectedListItem = oEvent.getSource ( );

		/* CSNFIX  0120061532 0001313736 2014*/
		var sMetadataURL = oSapSplUtils.getFQServiceUrl ( "/sap/spl/xs/app/services/appl.xsodata/" ) + "MyLocations(X'" + oSapSplUtils.base64ToHex ( oSelectedListItem.getBindingContext ( ).getObject ( ).LocationID ) + "')";

		var aSplitArray = sMetadataURL.split ( "xsodata/" );
		var sSelectedIncidentsURL = aSplitArray[aSplitArray.length - 1];

		sSelectedIncidentsURL = encodeURIComponent ( sSelectedIncidentsURL ) + "/GeofenceGates";

		var bAll = oSelectedListItem.getBindingContext ( ).getObject ( )["checked"];
		/* Fix for incident : 1580136882 */
		this.sSelectedGeofenceName = oSelectedListItem.getBindingContext ( ).getObject ( )["Name"];
		this.sSelectedGeofenceID = oSelectedListItem.getBindingContext ( ).getObject ( )["LocationID"];

		aGates = this.getAssignedGates ( sSelectedIncidentsURL, bAll, this );
		navContainer.getPages ( )[1].oMasterListItem = oSelectedListItem;
		this.aSelectedLocationGates = undefined;
		sap.ui.core.Fragment.byId ( "selectGeoFences", "sapSplGeofenceToIncidentAssignmentGatesList" ).removeSelections ( );
		sap.ui.core.Fragment.byId ( "selectGeoFences", "listGatesPage" ).getModel ( ).setData ( aGates );
		navContainer.to ( navContainer.getPages ( )[1].sId, "slide" );
		if ( sap.ui.core.Fragment.byId ( "selectGeoFences", "sapSplAssignGateSearch" ) ) {
			sap.ui.core.Fragment.byId ( "selectGeoFences", "sapSplAssignGateSearch" ).setValue ( "" );
		}
	},

	/**
	 * @description Method to check if the gate is already displayed in the assignment table.
	 * @param
	 * {object} oGateObject gate object.
	 * @returns {boolean} bReturn true if selected, else false.
	 * @since 1.0
	 */
	getCheckedGatesFromAssignments : function ( oGateObject ) {
		if ( oGateObject["ID"] === "ALL" ) {
			return oGateObject["checked"];
		} else {
			var aAssignedGeofences = this.aTempListOfSelections;
			var bReturn = null, compareKey;
			compareKey = "TechnicalLocationID";
			for ( var j = 0 ; j < aAssignedGeofences.length ; j++ ) {
				if ( aAssignedGeofences[j][compareKey] ) {
					if ( oGateObject[compareKey] === aAssignedGeofences[j][compareKey] && aAssignedGeofences[j]["isDeleted"] === false ) {
						bReturn = true;
						break;
					} else {
						bReturn = false;
					}
				}
			}
			return bReturn;
		}
	},

	/**
	 * @description Method to get assigned gates to the incidents.
	 * @param
	 * {string} sSelectedIncidentsURL URL to do a odata read.
	 * @param {boolean} bAll boolean value indicating if "all directions" is selected.
	 * @returns {array} aAssignedGates the array of gates assigned, with checked = true.
	 * @since 1.0
	 */
	getAssignedGates : function ( sSelectedIncidentsURL, bAll, that ) {

		var aAssignedGates = [], bAllGates = false;
		if ( !this.oDataModel ) {
			this.oDataModel = sap.ui.getCore ( ).getModel ( "IncidentsToLocationMapODataModel" );
		}
		this.oDataModel.read ( "/" + sSelectedIncidentsURL, null, [], false, function ( results ) {
			aAssignedGates = results.results;

			if ( bAll !== undefined && bAll !== null && bAll === true ) {
				bAllGates = bAll;
			}

			if ( aAssignedGates.length > 0 ) {
				var oTemp = aAssignedGates[0];
				aAssignedGates[0] = {
					Name : oSapSplUtils.getBundle ( ).getText ( "ALL_DIRECTIONS_GATE" ),
					ID : "ALL",
					checked : bAllGates
				};
				aAssignedGates[aAssignedGates.length] = oTemp;
			}
			for ( var i = 0 ; i < aAssignedGates.length ; i++ ) {
				if ( bAllGates === true ) {
					aAssignedGates[i]["checked"] = true;
				} else {
					aAssignedGates[i]["checked"] = that.getCheckedGatesFromAssignments ( aAssignedGates[i] );
				}
				aAssignedGates[i]["isDeleted"] = false;
				aAssignedGates[i]["CHANGEMODE"] = null;
			}
		}, function ( ) {
			jQuery.sap.log.error ( "getAssignedGates", "read failed", "IncidentsDetailView.controller.js" );
		} );
		return aAssignedGates;
	},

	/**
	 * @description Method to handle selection change of the list showing all the assigned geofences.
	 * @param
	 * {object} oEvent event object.
	 * @returns void.
	 * @since 1.0
	 */
	fnHandleSelectionChange : function ( oEvent ) {
		var sIndex, compareKey, oBoundObject, parentUUID;

		oBoundObject = oEvent.getParameters ( ).listItem.getBindingContext ( ).getObject ( );

		compareKey = "LocationID";
		if ( oBoundObject["Stacked"] === "1" ) {
			compareKey = "TechnicalLocationID";
		}

		if ( oEvent.getParameters ( ).selected ) {
			oBoundObject["isStacked"] = oBoundObject["Stacked"];
			oBoundObject["CHANGEMODE"] = "C";
			oBoundObject["GeoFenceName"] = oBoundObject["Name"];
			oBoundObject["GateName"] = "";
			oBoundObject["isDeleted"] = false;
			this.aTempListOfSelections.push ( oBoundObject );

			/* CSNFIX : 0120031469 791932     2014
			0120031469 792076     2014 */

			for ( sIndex = 0 ; sIndex < this.aTempListOfSelections.length ; sIndex++ ) {
				if ( this.aTempListOfSelections[sIndex]["GeofenceID"] ) {
					parentUUID = this.aTempListOfSelections[sIndex]["GeofenceID"];
				} else if ( this.aTempListOfSelections[sIndex]["isStacked"] === "1" ) {
					parentUUID = this.aTempListOfSelections[sIndex]["LocationID"];
				} else {
					parentUUID = null;
				}
				if ( parentUUID === oBoundObject[compareKey] ) {
					this.aTempListOfSelections[sIndex]["isDeleted"] = true;
				}
			}

		} else {

			for ( sIndex = 0 ; sIndex < this.aTempListOfSelections.length ; sIndex++ ) {
				if ( this.aTempListOfSelections[sIndex]["GeofenceID"] ) {
					parentUUID = this.aTempListOfSelections[sIndex]["GeofenceID"];
				} else if ( this.aTempListOfSelections[sIndex]["isStacked"] === "1" ) {
					parentUUID = this.aTempListOfSelections[sIndex]["LocationID"];
				} else {
					parentUUID = null;
				}
				if ( parentUUID === oBoundObject[compareKey] ) {
					this.aTempListOfSelections[sIndex]["isDeleted"] = false;
				}
			}

			for ( sIndex = 0 ; sIndex < this.aTempListOfSelections.length ; sIndex++ ) {
				if ( this.aTempListOfSelections[sIndex][compareKey] === oBoundObject[compareKey] ) {
					this.aTempListOfSelections.splice ( sIndex, 1 );
					break;
				}
			}

		}
		oEvent.getParameters ( ).listItem.setSelected ( oEvent.getParameters ( ).selected );
	},

	/* Fix for incident : 1580136882 */
	/**
	 * @description Method to prepare payload for search.
	 * @param
	 * {string} sSearchTerm term searched for.
	 * @returns {object} oPayload the payload to be used for search.
	 * @since 1.0
	 */
	prepareSearchPayloadForGates : function ( sSearchTerm, LocationID ) {
		var payload = {};
		payload.ObjectType = "LocationGate";
		payload.SearchTerm = sSearchTerm;
		payload.FuzzinessThershold = SapSplEnums.fuzzyThreshold;
		payload.MaximumNumberOfRecords = SapSplEnums.numberOfRecords;
		payload.ProvideDetails = false;
		payload.LocationID = this.sSelectedGeofenceID;

		return payload;
	},

	/**
	 * @description Method to call the service for search.
	 * @param
	 * {object} payload payload used for POST ajax call.
	 * @returns void.
	 * @since 1.0
	 */
	callSearchServiceForGates : function ( payload ) {
		var that = this;
		oSapSplAjaxFactory.fireAjaxCall ( {
			url : oSapSplUtils.getFQServiceUrl ( "/sap/spl/xs/app/services/Search.xsjs" ),
			method : "POST",
			async : false,
			data : JSON.stringify ( payload ),
			success : function ( data, success, messageObject ) {
				oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
				if ( data.constructor !== Array ) {
					data = JSON.parse ( data );
				}
				if ( messageObject["status"] === 200 ) {
					var oList = sap.ui.core.Fragment.byId ( "selectGeoFences", "sapSplGeofenceToIncidentAssignmentGatesList" );
					if ( data.length > 0 ) {
						if ( that.aSelectedLocationGates ) {
							oList.getModel ( ).setData ( that.aSelectedLocationGates );
						}
						oList.getBinding ( "items" ).filter ( oSapSplUtils.getSearchItemFilters ( data, "GateUUID", true ) );
					} else {
						if ( oList.getModel ( ).getData ( ).length > 0 ) {
							that.aSelectedLocationGates = oList.getModel ( ).getData ( );
						}
						sap.ui.core.Fragment.byId ( "selectGeoFences", "listGatesPage" ).getModel ( ).setData ( [] );
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
				jQuery.sap.log.error ( "callSearchService", "ajax failed", "IncidentsDetailView.controller.js" );
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
						message : oSapSplUtils.getBundle ( ).getText ( "INCORRECT_ARGUMENTS_ERROR_MESSAGE" ),
						details : oSapSplUtils.getErrorMessagesfromErrorPayload ( JSON.parse ( error.responseText ) )["ufErrorObject"]
					} );
				}
			},
			complete : function ( ) {

			}
		} );
	},

	fnToHandleSearchOfGates : function ( event ) {
		var sSearchString = event.mParameters.query, oSapSplGatesList, oPayload;

		oSapSplGatesList = sap.ui.core.Fragment.byId ( "selectGeoFences", "sapSplGeofenceToIncidentAssignmentGatesList" );

		if ( sSearchString.length > 2 ) {
			oPayload = this.prepareSearchPayloadForGates ( sSearchString );
			this.callSearchServiceForGates ( oPayload );

		} else if ( oSapSplGatesList.getBinding ( "items" ) !== undefined ) {
			if ( this.aSelectedLocationGates ) {
				oSapSplGatesList.getModel ( ).setData ( this.aSelectedLocationGates );
			}
			oSapSplGatesList.getBinding ( "items" ).filter ( [] );
		}
	},

	/**
	 * @description Method to handle search for assigned geofences dialog.
	 * @param
	 * {objbect} event event object.
	 * @returns void.
	 * @since 1.0
	 */
	fnToHandleSearchOfIncidents : function ( event ) {

		var that = this;
		var searchString = event.mParameters.query, oDataModelFilters;
		var oSapSplIncidentsList, payload;

		function handleSuccessOfMyLocations ( data ) {
			var locationList = sap.ui.core.Fragment.byId ( "selectGeoFences", "sapSplGeofenceToIncidentAssignmentList" );
			locationList.removeSelections ( );
			if ( sap.ui.getCore ( ).getModel ( "GeofencesForAssignmentModel" ) ) {
				sap.ui.getCore ( ).getModel ( "GeofencesForAssignmentModel" ).setData ( that.getDataForFragment ( data.results ) );
				that.oLocationFragment.setModel ( sap.ui.getCore ( ).getModel ( "GeofencesForAssignmentModel" ) );

			} else {
				sap.ui.getCore ( ).setModel ( new sap.ui.model.json.JSONModel ( that.getDataForFragment ( data.results ) ), "GeofencesForAssignmentModel" );
				that.oLocationFragment.setModel ( sap.ui.getCore ( ).getModel ( "GeofencesForAssignmentModel" ) );
			}
		}

		oSapSplIncidentsList = sap.ui.core.Fragment.byId ( "selectGeoFences", "sapSplGeofenceToIncidentAssignmentList" );

		if ( searchString.length > 2 ) {

			payload = this.prepareSearchPayload ( searchString );
			this.callSearchService ( payload );

		} else if ( oSapSplIncidentsList.getBinding ( "items" ) !== undefined ) {
			oDataModelFilters = ["$filter= Tag eq 'LC0004'"];
			this.oSapSplGeofencesForAssignmentModel.read ( "/MyLocations", null, oDataModelFilters, false, handleSuccessOfMyLocations, function ( ) {

			} );

		}
	},

	/**
	 * @description Method to prepare payload for search.
	 * @param
	 * {string} sSearchTerm term searched for.
	 * @returns {object} oPayload the payload to be used for search.
	 * @since 1.0
	 */
	prepareSearchPayload : function ( searchTerm ) {
		var payload = {};
		payload.UserID = oSapSplUtils.getLoggedOnUserDetails ( ).userId;

		payload.ObjectType = "Location";

		payload.SearchTerm = searchTerm;
		payload.FuzzinessThershold = SapSplEnums.fuzzyThreshold;
		payload.MaximumNumberOfRecords = SapSplEnums.numberOfRecords;
		payload.ProvideDetails = true;
		payload.SearchInNetwork = true;
		payload.AdditionalCriteria = {};
		payload.AdditionalCriteria.TagFilter = [];
		payload.AdditionalCriteria.TagFilter[0] = "LC0004";

		return payload;
	},

	/**
	 * @description Method to call the service for search.
	 * @param
	 * {object} payload payload used for POST ajax call.
	 * @returns void.
	 * @since 1.0
	 */
	callSearchService : function ( payload ) {

		var tempDetails = [], sIndex, that = this, locationList;

		oSapSplAjaxFactory.fireAjaxCall ( {
			url : oSapSplUtils.getFQServiceUrl ( "/sap/spl/xs/app/services/Search.xsjs" ),
			method : "POST",
			async : false,
			data : JSON.stringify ( payload ),
			success : function ( data, success, messageObject ) {
				oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
				if ( data.constructor !== Array ) {
					data = JSON.parse ( data );
				}
				if ( messageObject["status"] === 200 ) {

					if ( data.length > 0 ) {

						for ( sIndex = 0 ; sIndex < data.length ; sIndex++ ) {
							tempDetails.push ( data[sIndex].Details );
						}

					}

					locationList = sap.ui.core.Fragment.byId ( "selectGeoFences", "sapSplGeofenceToIncidentAssignmentList" );
					locationList.removeSelections ( );

					if ( sap.ui.getCore ( ).getModel ( "GeofencesForAssignmentModel" ) ) {
						sap.ui.getCore ( ).getModel ( "GeofencesForAssignmentModel" ).setData ( that.getDataForFragment ( tempDetails ) );
						that.oLocationFragment.setModel ( sap.ui.getCore ( ).getModel ( "GeofencesForAssignmentModel" ) );
					} else {
						sap.ui.getCore ( ).setModel ( new sap.ui.model.json.JSONModel ( that.getDataForFragment ( tempDetails ) ), "GeofencesForAssignmentModel" );
						that.oLocationFragment.setModel ( sap.ui.getCore ( ).getModel ( "GeofencesForAssignmentModel" ) );
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
				jQuery.sap.log.error ( "callSearchService", "ajax failed", "IncidentsDetailView.controller.js" );
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
						message : oSapSplUtils.getBundle ( ).getText ( "INCORRECT_ARGUMENTS_ERROR_MESSAGE" ),
						details : oSapSplUtils.getErrorMessagesfromErrorPayload ( JSON.parse ( error.responseText ) )["ufErrorObject"]
					} );
				}
			},
			complete : function ( ) {

			}
		} );
	},

	/**
	 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
	 * (NOT before the first rendering! onInit() is used for that one!).
	 */
	//    onBeforeRendering: function() {
	//    },
	/**
	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 */
	onAfterRendering : function ( ) {}

} );
