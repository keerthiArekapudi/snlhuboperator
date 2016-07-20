/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare ( "splReusable.libs.MapsDataMarshal" );
jQuery.sap.require ( "splReusable.exceptions.MissingParametersException" );
jQuery.sap.require ( "splReusable.exceptions.InvalidArrayException" );
jQuery.sap.require ( "splReusable.libs.SapSplEnums" );
jQuery.sap.require ( "splReusable.libs.SapSplVOIconSelector" );

/**
 * MapsDataMarshal library to contain all the APIs related to visual business
 * @constructor
 */
splReusable.libs.MapsDataMarshal = function ( ) {

	var that = this;

	// Configuration JSON for the Visual Business Map
	this.oMapsModelConfiguration = {};

	// Configuration JSON for the Visual Business Map
	this.aMapsModelSkeleton = [];

	// Array of clicked cordinates used to creates Flags and Lines
	this.aClickedPoints = [];

	// Array of cordinats that is used to create the Area
	this.aPolygonPoints = [];

	// Counter that counts the number of clicks performed on the Map
	this.iClickCount = 0;

	// The first clicked point when you create an Area
	this.sFirstClickPoint = "";

	// Boolean that desables the click event on the Map
	this.isMapClickEabled = false;

	// Boolean that disable the geofence selection
	this.isGeofenceSelectDeselectEnabled = true;

	// Boolean that disable the POI selection
	this.isPointOfInterestSelectDeselectEnabled = false;

	// Flag skeleton JSON
	this.oFlagSkeleton = null;

	// Flag skeleton JSON
	this.oPintOfInterestFlagSkeleton = null;

	// Geofence Area skeleton JSON
	this.oGeoFenceArea = null;

	// GeofenceGate skeleton JSON
	this.oGeofenceGate = null;

	this.oTempArea = null;

	try {

		var sUrl = "./config/maps/MapsModelConfiguration.json";
// if (window.location.href.search("_test") > 0) {
// sUrl = "./config/maps/MapsModelConfiguration_test.json";
// }
		// Ajax call to get the Configuration JSON from the JSON file
		$.ajax ( {
			type : "get",
			url : sUrl,
			dataType : "json",
			async : false
		} ).success ( function ( oConfigJSON ) {
			// Configuration JSON for visual business control
			that.oMapsModelConfiguration = oConfigJSON;
		} ).fail ( function ( xhr, errorType, exception ) {
			var errorMessage = exception || xhr.statusText;
			throw new Error ( "Error: " + errorMessage );
		} );

		// Ajax call to get the Skeleton JSON from the JSON file
		$.ajax ( {
			type : "get",
			url : "./config/maps/MapsModelSkeleton.json",
			dataType : "json",
			async : false
		} ).success ( function ( aSkeletonJSON ) {
			that.aMapsModelSkeleton = aSkeletonJSON;
			for ( var i = 0 ; i < aSkeletonJSON.length ; i++ ) {

				// Assigns points of interest flag skeleton to the variable
				if ( aSkeletonJSON[i].Key === "oPintOfInterestFlagSkeleton" ) {
					that.oPintOfInterestFlagSkeleton = aSkeletonJSON[i].Object;

					// Assigns flag skeleton to the variable
				} else if ( aSkeletonJSON[i].Key === "Flag" ) {
					that.oFlagSkeleton = aSkeletonJSON[i].Object;

					// Sets GeoFenceAreas as an attribute to the library
				} else if ( aSkeletonJSON[i].Key === "GeoFenceAreas" ) {
					that.oGeoFenceArea = aSkeletonJSON[i].Object;

					// Sets oTruckFlag as an attribute to the library
				} else if ( aSkeletonJSON[i].Key === "oTruckFlag" ) {
					that.oTruckFlagSkeleton = aSkeletonJSON[i].Object;

					// Sets oIncidentFlag as an attribute to the library
				} else if ( aSkeletonJSON[i].Key === "oIncidentFlag" ) {
					that.oIncidentFlagSkeleton = aSkeletonJSON[i].Object;

					// Sets oGeofenceGate as an attribute to the library
				} else if ( aSkeletonJSON[i].Key === "GeofenceGates" ) {
					that.oGeofenceGate = aSkeletonJSON[i].Object;

				} else if ( aSkeletonJSON[i].Key === "Area" ) {
					that.oTempArea = aSkeletonJSON[i].Object;
				}
			}
		} ).fail ( function ( xhr, errorType, exception ) {
			var errorMessage = exception || xhr.statusText;
			throw new Error ( "Error: " + errorMessage );
		} );
	} catch (oEvent) {
		if ( oEvent.constructor === Error ) {
			jQuery.sap.log.error ( oEvent.message, "Failure of setMapsModelConfigurationJSON function call", "MapsDataMarshal.js" );
		}
	}
};

/**
 * Function that returns the configuration JSON or one of the skeleton JSON based on the type given
 * @since 1.0
 * @param sType
 * @returns this.oMapsModelConfiguration
 * @example oSapSplMapsDataMarshal.getMapsModelJSON("Flag")
 */
splReusable.libs.MapsDataMarshal.prototype.getMapsModelJSON = function ( sType ) {
	try {
		var _returnValue = null;

		// sType should be of type string
		if ( sType.constructor === String ) {

			// Checks weather it is of type configuration JSON
			if ( sType === SapSplEnums.configJSON ) {

				// Checks weather the configuration JSON which is an attribute
				// to this library is undefined or not.
				if ( this.oMapsModelConfiguration !== undefined && this.oMapsModelConfiguration !== null ) {

					// configuration JSON should be of type object
					if ( this.oMapsModelConfiguration.constructor === Object ) {
						_returnValue = this.oMapsModelConfiguration;

						// If configuration JSON is not an Object
					} else {
						throw new TypeError ( );
					}

					// If configuration JSON is undefined
				} else {
					throw new ReferenceError ( );
				}

				// For the array of skeleton objects like Area Flag etc
			} else {

				// The collection of skeleton objects should not be undefined or
				// null
				if ( this.aMapsModelSkeleton !== undefined && this.aMapsModelSkeleton !== null ) {

					// The skeleton objects should be inside an array
					if ( this.aMapsModelSkeleton.constructor === Array ) {

						// The array should not be empty
						if ( this.aMapsModelSkeleton.length !== 0 ) {

							// Loops through the array of skeleton objects and
							// returns the desired one based on the type that is
							// passed to the function
							for ( var i = 0 ; i < this.aMapsModelSkeleton.length ; i++ ) {
								if ( this.aMapsModelSkeleton[i].Key === sType ) {

									// The skeleton object like Area or Flag etc
									_returnValue = this.aMapsModelSkeleton[i].Object;
								}
							}
						} else {
							throw new Error ( "Empty Array" );
						}
					} else {
						throw new TypeError ( );
					}
				} else {
					throw new ReferenceError ( );
				}
			}
		} else {
			throw new TypeError ( );
		}

		// The return value should be of type object
		if ( _returnValue.constructor === Object && _returnValue !== undefined && _returnValue !== null ) {
			return _returnValue;
		} else {
			throw new TypeError ( );
		}

	} catch (oEvent) {

		if ( oEvent.constructor === Error ) {
			jQuery.sap.log.error ( oEvent.message, "Failure of getMapsModelConfigurationJSON function call", "MapsDataMarshal.js" );
		}

	}
};

/**
 * Shows the point of interest Flags on the map
 * @param aResults
 * @returns void
 * @since 1.1
 */
splReusable.libs.MapsDataMarshal.prototype.fnShowPointOfInterestFlags = function ( oResult, oVBMap, sMode ) {
	try {
		// The oResult object shouldnt be null or undefined
		if ( oResult !== undefined && oResult !== null ) {

			// The oResult should be of type object
			if ( oResult.constructor === Object ) {

				// Creates a visual business flag object of type point of
				// interest. eg Bridge, Parking space, Container terminal etc
				var oFlagData = {};

				// The coordinate string, which is the position of Flag on the
				// map
				oFlagData["position"] = this.convertGeoJSONToString ( JSON.parse ( oResult["Geometry"] ) );

				// Tooltip of the Flag.
				oFlagData["tooltip"] = oResult.Name;

				// Key of the Flag.
				oFlagData["key"] = oResult.LocationID;

				// Description of the Flag.
				oFlagData["description"] = oResult.Name;

				oFlagData["VB:m"] = "true";

				// Flag object can't be moved on the Map
				oFlagData["VB:c"] = "false";

				if ( sMode && sMode === "onFocus" ) {
					// Assigns the image for the flag object based on Bridge,
					// Parking space or Container terminal
					if ( oResult["Tag"] === "LC0001" ) {
						oFlagData["image"] = SapSplVOIconSelector.getVOIcon ( "Bridge", null, oVBMap.zoom, "RollOver" );
					} else if ( oResult["Tag"] === "LC0002" ) {
						// CSN FIX : 0120031469 0000626426
						if ( sap.ui.getCore ( ).getModel ( "sapSplAppConfigDataModel" ).getData ( )["canViewParkingStatus"] === 1 ) {
							oFlagData["image"] = SapSplVOIconSelector.getVOIcon ( "Parking", oResult["ReportedStatus"], oVBMap.zoom, "RollOver" );
						} else {
							oFlagData["image"] = SapSplVOIconSelector.getVOIcon ( "Parking", null, oVBMap.zoom, "RollOver" );
						}

					} else if ( oResult["Tag"] === "LC0003" ) {

						if ( sap.ui.getCore ( ).getModel ( "sapSplAppConfigDataModel" ).getData ( )["canViewContainerStatus"] === 1 ) {
							oFlagData["image"] = SapSplVOIconSelector.getVOIcon ( "ContainerTerminal", oResult["ReportedStatus"], oVBMap.zoom, "RollOver" );
						} else {
							oFlagData["image"] = SapSplVOIconSelector.getVOIcon ( "ContainerTerminal", null, oVBMap.zoom, "RollOver" );
						}

					} else if ( oResult["Tag"] === "LC0007" ) {
						if ( sap.ui.getCore ( ).getModel ( "sapSplAppConfigDataModel" ).getData ( )["canViewContainerStatus"] === 1 ) {
							oFlagData["image"] = SapSplVOIconSelector.getVOIcon ( "ContainerDepot", oResult["ReportedStatus"], oVBMap.zoom, "RollOver" );
						} else {
							oFlagData["image"] = SapSplVOIconSelector.getVOIcon ( "ContainerDepot", null, oVBMap.zoom, "RollOver" );
						}
					} else if ( oResult["Tag"] === "ALERT" ) {
						oFlagData["image"] = SapSplVOIconSelector.getVOIcon ( "Alert", null, oVBMap.zoom, "Focus" );
					} else {
						throw new Error ( "Invalid LocationSpecType" );
					}
				} else if ( sMode && sMode === "onEnlarge" ) {

					if ( oResult["Tag"] === "LC0001" ) {
						oFlagData["image"] = SapSplVOIconSelector.getVOIcon ( "Bridge", null, 15, "Normal" );
					} else if ( oResult["Tag"] === "LC0002" ) {
						// CSN FIX : 0120031469 0000626426
						if ( sap.ui.getCore ( ).getModel ( "sapSplAppConfigDataModel" ).getData ( )["canViewParkingStatus"] === 1 ) {
							oFlagData["image"] = SapSplVOIconSelector.getVOIcon ( "Parking", oResult["ReportedStatus"], 15, "Normal" );
						} else {
							oFlagData["image"] = SapSplVOIconSelector.getVOIcon ( "Parking", null, 15, "Normal" );
						}

					} else if ( oResult["Tag"] === "LC0007" ) {

						if ( sap.ui.getCore ( ).getModel ( "sapSplAppConfigDataModel" ).getData ( )["canViewContainerStatus"] === 1 ) {
							oFlagData["image"] = SapSplVOIconSelector.getVOIcon ( "ContainerDepot", oResult["ReportedStatus"], 15, "Normal" );
						} else {
							oFlagData["image"] = SapSplVOIconSelector.getVOIcon ( "ContainerDepot", null, 15, "Normal" );
						}
					} else if ( oResult["Tag"] === "LC0003" ) {
						if ( sap.ui.getCore ( ).getModel ( "sapSplAppConfigDataModel" ).getData ( )["canViewContainerStatus"] === 1 ) {
							oFlagData["image"] = SapSplVOIconSelector.getVOIcon ( "ContainerTerminal", oResult["ReportedStatus"], 15, "Normal" );
						} else {
							oFlagData["image"] = SapSplVOIconSelector.getVOIcon ( "ContainerTerminal", null, 15, "Normal" );
						}

					}

				} else {
					// Assigns the image for the flag object based on Bridge,
					// Parking space or Container terminal
					if ( oResult["Tag"] === "LC0001" ) {
						oFlagData["image"] = SapSplVOIconSelector.getVOIcon ( "Bridge", null, oVBMap.zoom, "Normal" );
					} else if ( oResult["Tag"] === "LC0002" ) {
						// CSN FIX : 0120031469 0000626426
						if ( sap.ui.getCore ( ).getModel ( "sapSplAppConfigDataModel" ).getData ( )["canViewParkingStatus"] === 1 ) {
							oFlagData["image"] = SapSplVOIconSelector.getVOIcon ( "Parking", oResult["ReportedStatus"], oVBMap.zoom, "Normal" );
						} else {
							oFlagData["image"] = SapSplVOIconSelector.getVOIcon ( "Parking", null, oVBMap.zoom, "Normal" );
						}

					} else if ( oResult["Tag"] === "LC0007" ) {

						if ( sap.ui.getCore ( ).getModel ( "sapSplAppConfigDataModel" ).getData ( )["canViewContainerStatus"] === 1 ) {
							oFlagData["image"] = SapSplVOIconSelector.getVOIcon ( "ContainerDepot", oResult["ReportedStatus"], oVBMap.zoom, "Normal" );
						} else {
							oFlagData["image"] = SapSplVOIconSelector.getVOIcon ( "ContainerDepot", null, oVBMap.zoom, "Normal" );
						}
					} else if ( oResult["Tag"] === "LC0003" ) {
						if ( sap.ui.getCore ( ).getModel ( "sapSplAppConfigDataModel" ).getData ( )["canViewContainerStatus"] === 1 ) {
							oFlagData["image"] = SapSplVOIconSelector.getVOIcon ( "ContainerTerminal", oResult["ReportedStatus"], oVBMap.zoom, "Normal" );
						} else {
							oFlagData["image"] = SapSplVOIconSelector.getVOIcon ( "ContainerTerminal", null, oVBMap.zoom, "Normal" );
						}

					} else if ( oResult["Tag"] === "ALERT" ) {
						oFlagData["image"] = SapSplVOIconSelector.getVOIcon ( "Alert", null, oVBMap.zoom, "Focus" );
					} else {
						throw new Error ( "Invalid LocationSpecType" );
					}
				}

				var oPolygonSkeleton = jQuery.extend ( true, {}, this.oPintOfInterestFlagSkeleton );

				// Pushes the Flag object to the Flag skeleton
				oPolygonSkeleton.SAPVB.Data.Set.N.E.push ( oFlagData );

				// Loads it to the Map instance
				oVBMap.load ( oPolygonSkeleton );
			} else {
				throw new TypeError ( );
			}
		} else {
			throw new ReferenceError ( );
		}

	} catch (oEvent) {
		jQuery.sap.log.error ( oEvent.message, "Failure of fnShowPointOfInterestFlags function call", "MapsDataMarshal.js" );
	}
};

/**
 * Shows the TourStops on the map
 * @param aResults
 * @returns void
 * @since 1.1
 */
splReusable.libs.MapsDataMarshal.prototype.fnShowTourStops = function ( result, oVBMap ) {

	var oTourStopFlagSkeleton = {
		"SAPVB" : {
			"version" : "2.0",
			"Data" : {
				"Set" : {
					"type" : "N",
					"name" : "TourStops",
					"N" : {
						"name" : "TourStops",
						"E" : []
					}
				}
			}
		}
	};

	// Creates a visual business flag object of type tour stop
	var oFlagData;

	try {
		// The oResult object shouldnt be null or undefined
		if ( result !== undefined && result !== null ) {

			if ( result.constructor === Array ) {
				for ( var i = 0 ; i < result.length ; i++ ) {

					if ( result[i].GeometryGeo && result[i]["ActualSequence"] ) {

						oFlagData = {};

						// The coordinate string, which is the position of Flag
						// on the map
						oFlagData["position"] = this.convertGeoJSONToString ( JSON.parse ( result[i].GeometryGeo ) );

						// Tooltip of the Flag.
						oFlagData["tooltip"] = "";

						// Key of the Flag.
						oFlagData["key"] = result[i].UUID;

						// Description of the Flag.
						oFlagData["description"] = "";

						//
						oFlagData["VB:m"] = "true";

						// Flag object can't be moved on the Map
						oFlagData["VB:c"] = "false";

						// Flag image
						if ( Number ( result[i]["ActualSequence"] ) === 1 ) {
							oFlagData["image"] = "tour_start.png";
						} else if ( Number ( result[i]["ActualSequence"] ) === result.length ) {
							oFlagData["image"] = "tour_end.png";
						} else {
							oFlagData["image"] = "tour_mid_points.png";
						}

						// Pushes the Flag object to the Flag skeleton
						oTourStopFlagSkeleton.SAPVB.Data.Set.N.E.push ( oFlagData );

						var sCoords = this.convertGeoJSONToString ( JSON.parse ( result[i].GeometryGeo ) ).split ( ";" );
						oVBMap.zoomToGeoPosition ( parseFloat ( sCoords[0], 10 ), parseFloat ( sCoords[1], 10 ), 12 );
					}

				}
				// Loads it to the Map instance
				oVBMap.load ( oTourStopFlagSkeleton );
			} else {
				throw new TypeError ( );
			}
		} else {
			throw new ReferenceError ( );
		}

	} catch (oEvent) {
		jQuery.sap.log.error ( oEvent.message, "Failure of fnShowIncidenceFlags function call", "MapsDataMarshal.js" );
	}
};

/**
 * Shows the incidents Flags on the map
 * @param aResults
 * @returns void
 * @since 1.1
 */
splReusable.libs.MapsDataMarshal.prototype.fnShowIncidenceFlags = function ( oResult, oVBMap ) {

	var oIncidentFlagSkeleton = {
		"SAPVB" : {
			"version" : "2.0",
			"Data" : {
				"Set" : {
					"type" : "N",
					"name" : "IncidentFlags",
					"N" : {
						"name" : "IncidentFlags",
						"E" : []
					}
				}
			}
		}
	};

	try {
		// The oResult object shouldnt be null or undefined
		if ( oResult !== undefined && oResult !== null ) {

			// The oResult should be of type object
			if ( oResult.constructor === Object ) {

				// Creates a visual business flag object of type point of
				// interest. eg Bridge, Parking space, Container terminal etc
				var oFlagData = {};

				// The coordinate string, which is the position of Flag on the
				// map
				oFlagData["position"] = this.convertGeoJSONToString ( JSON.parse ( oResult.SourceLocation ) );

				// Tooltip of the Flag.
				oFlagData["tooltip"] = "";

				// Key of the Flag.
				oFlagData["key"] = oResult.UUID;

				// Description of the Flag.
				oFlagData["description"] = oResult.Name;

				//
				oFlagData["VB:m"] = "true";

				// Flag object can't be moved on the Map
				oFlagData["VB:c"] = "false";

				// Checks for traffic message
				if ( oResult["MessageType"] === "TM" ) {

					oFlagData["image"] = SapSplVOIconSelector.getVOIcon ( "Incident", oResult["Priority"], oVBMap.zoom, "Traffic" );

				} else {

					oFlagData["image"] = SapSplVOIconSelector.getVOIcon ( "Incident", oResult["Priority"], oVBMap.zoom, "PRM" );

				}

				// Pushes the Flag object to the Flag skeleton
				oIncidentFlagSkeleton.SAPVB.Data.Set.N.E.push ( oFlagData );

				// Loads it to the Map instance
				oVBMap.load ( oIncidentFlagSkeleton );
			} else {
				throw new TypeError ( );
			}
		} else {
			throw new ReferenceError ( );
		}

	} catch (oEvent) {
		jQuery.sap.log.error ( oEvent.message, "Failure of fnShowIncidenceFlags function call", "MapsDataMarshal.js" );
	}
};

splReusable.libs.MapsDataMarshal.prototype.fnAddTruckDetailWindowContent = function ( oEvent, fnCallback, oVBMap, isDetailVisible ) {
	var oDetailWindowArrowImage;
	var oGeofenceNameLabel;
	var oDetailWindowLayout = null;
	try {

		if ( oEvent !== undefined && oEvent !== null ) {
			var sLayoutID = JSON.parse ( oEvent.getParameter ( "id" ) )["DeviceUUID"].split ( "+" ).join ( "" ).split ( "/" ).join ( "" ).split ( "?" ).join ( "" ).split ( "%" ).join ( "" ).split ( "#" ).join ( "" ).split ( "&" ).join ( "" ).split (
					"=" ).join ( "" );

			if ( JSON.parse ( oEvent.getParameter ( "id" ) )["RegistrationNumber"] !== null ) {

				if ( !oDetailWindowLayout ) {
					if ( sap.ui.getCore ( ).byId ( sLayoutID + oVBMap.getId ( ) ) ) {
						sap.ui.getCore ( ).byId ( sLayoutID + oVBMap.getId ( ) ).destroy ( );
					}

					oDetailWindowLayout = new sap.ui.commons.layout.VerticalLayout ( {
						id : sLayoutID + oVBMap.getId ( )
					} ).addStyleClass ( "truckDetailWindowLayout" ).addStyleClass ( sLayoutID ).attachBrowserEvent ( "click", function ( ) {
						fnCallback ( this.oData );
					} );

					oDetailWindowLayout.oData = JSON.parse ( oEvent.getParameter ( "id" ) );
					if ( !oDetailWindowArrowImage ) {
						oDetailWindowArrowImage = new sap.m.Image ( {
							src : "resources/icons/truckDetailsArrow.png"
						} ).addStyleClass ( "truckDetailWindowArrowImage" );
					}
					if ( !oGeofenceNameLabel ) {
						oGeofenceNameLabel = new sap.m.Label ( {
							text : JSON.parse ( oEvent.getParameter ( "id" ) )["RegistrationNumber"]
						} ).addStyleClass ( "truckDetailWindowLabel" );
					}

					oDetailWindowLayout.addEventDelegate ( {
						onAfterRendering : function ( ) {
							if ( isDetailVisible ) {
								jQuery ( "." + sLayoutID ).parent ( ).parent ( ).show ( );
							}
						}
					} );
					oDetailWindowLayout.addContent ( oDetailWindowArrowImage ).addContent ( oGeofenceNameLabel );
					oDetailWindowLayout.placeAt ( oEvent.getParameter ( "contentarea" ).id );

				}
			}
		} else {
			throw new ReferenceError ( );
		}
	} catch (oEvent1) {
		jQuery.sap.log.error ( oEvent1.message, "Failure of fnAddDetailWindowContent function call", "MapsDataMarshal.js" );
	}
};

splReusable.libs.MapsDataMarshal.prototype.fnShowDetailWindowsForTrucks = function ( oResult, oVBMap ) {

	var oTruckTata = {};
	oTruckTata["RegistrationNumber"] = oResult["RegistrationNumber"];
	oTruckTata["DeviceUUID"] = oResult["DeviceUUID"];
	oTruckTata["isTypeTruck"] = true;

	try {

		if ( oResult !== undefined && oResult !== null ) {
			if ( oResult.constructor === Object ) {
				var oWindowSkeletonConfigObject = {
					"SAPVB" : {
						"version" : "2.0",
						"xmlns:VB" : "VB",
						"Windows" : {
							"Remove" : {
								"name" : "Detail1"
							},
							"Set" : {
								"name" : "Detail1",
								"Window" : {
									"id" : JSON.stringify ( oTruckTata ),
									"type" : "callout",
									"refParent" : "Window1",
									"refScene" : "",
									"modal" : "false",
									"width" : "150",
									"height" : "50",
									"pos" : this.convertGeoJSONToString ( JSON.parse ( oResult["Position"] ) ),
									"caption" : "",
									"offsetX" : "15",
									"offsetY" : "-30"
								}
							}
						}
					}
				};

				oVBMap.load ( oWindowSkeletonConfigObject );

			} else {
				throw new TypeError ( );
			}
		} else {
			throw new ReferenceError ( );
		}
	} catch (oEvent) {
		jQuery.sap.log.error ( oEvent.message, "Failure of fnShowDetailWindowsForTrucks function call", "MapsDataMarshal.js" );
	}
};

/**
 * Shows the trucks Flags on the map
 * @param aResults
 * @returns void
 * @since 1.1
 */
splReusable.libs.MapsDataMarshal.prototype.fnShowTruckFlags = function ( oResult, oVBMap, sMode ) {

	var oTruckFlagSkeleton = {
		"SAPVB" : {
			"version" : "2.0",
			"Data" : {
				"Set" : {
					"type" : "N",
					"name" : "TruckFlags",
					"N" : {
						"name" : "TruckFlags",
						"E" : []
					}
				}
			}
		}
	};

	try {

		// The oResult object shouldnt be null or undefined
		if ( oResult !== undefined && oResult !== null ) {

			// The oResult should be of type object
			if ( oResult.constructor === Object ) {
				var oFlagData = {};
				oFlagData["position"] = this.convertGeoJSONToString ( JSON.parse ( oResult.Position ) );
				oFlagData["tooltip"] = oResult["ReportedTime"];
				if ( oResult["ReportedTime"] === null ) {
					oFlagData["tooltip"] = "";
				} else {
					oFlagData["tooltip"] = oSapSplUtils.getBundle ( ).getText ( "LAST_REPORTED" ) + " : " + splReusable.libs.SapSplModelFormatters.returnMessageTimestamp ( oResult["ReportedTime"] );
				}
				oFlagData["key"] = oResult.DeviceUUID;
				oFlagData["description"] = JSON.stringify ( oResult );
				oFlagData["VB:m"] = "true";
				oFlagData["VB:c"] = "false";

				if ( sMode && (sMode === "noLabel") ) {
					// Label text of the Flag.
					oFlagData["labeltext"] = "";

					// Label background color of the Flag.
					oFlagData["labelbackground"] = "RGBA(255,255,255,400)";

					// Label position of the Flag.
					oFlagData["labelposition"] = "3";

				} else {
					// Label text of the Flag.
					if ( oResult["RegistrationNumber"] !== null ) {
						oFlagData["labeltext"] = " " + oResult["RegistrationNumber"] + " ";
					} else {
						oFlagData["labeltext"] = "";
					}

					// Label background color of the Flag.
					oFlagData["labelbackground"] = "RGBA(255,255,255,400)";

					// Label position of the Flag.
					oFlagData["labelposition"] = "3";
				}

				if ( oResult["TourName"] === null ) {
					oFlagData["image"] = SapSplVOIconSelector.getVOIcon ( "Truck", "NoOrder", oVBMap.zoom, "Normal" );
				} else {
					oFlagData["image"] = SapSplVOIconSelector.getVOIcon ( "Truck", oResult["isTruckRunningLate"], oVBMap.zoom, "Normal" );
				}

				oTruckFlagSkeleton.SAPVB.Data.Set.N.E.push ( oFlagData );
				oVBMap.load ( oTruckFlagSkeleton );

			} else {
				jQuery.sap.log.error ( "Unable to plot truck position", "TourDetailController", "SAPSCL" );
			}
		} else {
			jQuery.sap.log.error ( "Unable to plot truck position", "TourDetailController", "SAPSCL" );
		}

	} catch (oEvent) {
		jQuery.sap.log.error ( oEvent.message, "Failure of fnShowTruckFlags function call", "MapsDataMarshal.js" );
	}
};

/**
 * @description Shows the Selected geofences on the map
 * @param aResults
 * @returns void
 * @since 1.1
 */
splReusable.libs.MapsDataMarshal.prototype.fnSelectDeselectPointOfInterests = function ( oResult, oVBMap, fnCallback ) {
	try {
		if ( this.isPointOfInterestSelectDeselectEnabled ) {
			var sAction = null;
			if ( oVBMap.aSelectedLocationPOIs === undefined ) {
				oVBMap.aSelectedLocationPOIs = [];
			}
			var isSelected = false;
			for ( var i = 0 ; i < oVBMap.aSelectedLocationPOIs.length ; i++ ) {
				if ( oVBMap.aSelectedLocationPOIs[i].LocationID === oResult.LocationID ) {
					isSelected = true;
					oVBMap.aSelectedLocationPOIs.splice ( i, 1 );
					sAction = "Deselect";
				}
			}
			if ( !isSelected ) {
				oVBMap.aSelectedLocationPOIs.push ( oResult );
				sAction = "Select";
			}

			if ( oResult !== undefined && oResult !== null ) {
				if ( oResult.constructor === Object ) {
					var oFlagData = {};
					oFlagData["position"] = oResult.Geometry;
					oFlagData["tooltip"] = oResult.Name;
					oFlagData["key"] = oResult.LocationID;
					oFlagData["description"] = oResult.Name;
					oFlagData["VB:m"] = "true";
					oFlagData["VB:c"] = "false";
					if ( sAction === "Select" ) {
						oFlagData["image"] = "PointOfInterest.png";
					} else if ( sAction === "Deselect" ) {

						if ( oResult["Tag"] === "LC0001" ) {
							oFlagData["image"] = SapSplVOIconSelector.getVOIcon ( "Bridge", null, oVBMap.zoom, "Focus" );
						} else if ( oResult["Tag"] === "LC0002" ) {
							oFlagData["image"] = SapSplVOIconSelector.getVOIcon ( "Parking", null, oVBMap.zoom, "Focus" );
						} else if ( oResult["Tag"] === "LC0003" ) {
							oFlagData["image"] = SapSplVOIconSelector.getVOIcon ( "ContainerTerminal", null, oVBMap.zoom, "Focus" );
						} else if ( oResult["Tag"] === "LC0007" ) {
							oFlagData["image"] = SapSplVOIconSelector.getVOIcon ( "ContainerDepot", null, oVBMap.zoom, "Focus" );
						} else {
							throw new Error ( "Invalid LocationSpecType" );
						}
					} else {
						throw new Error ( "Invalid action argument" );
					}

					this.oPintOfInterestFlagSkeleton.SAPVB.Data.Set.N.E.push ( oFlagData );
					oVBMap.load ( this.oPintOfInterestFlagSkeleton );
				} else {
					throw new TypeError ( );
				}
			}
			fnCallback ( oVBMap.aSelectedLocationPOIs );
		} else {
			throw new ReferenceError ( );
		}
	} catch (oEvent) {
		jQuery.sap.log.error ( oEvent.message, "Failure of fnShowFences function call", "MapsDataMarshal.js" );
	}
};

/**
 * @description Shows the Selected trucks on the map
 * @param oResults
 * @param oVBMap
 * @param fnCallback
 * @returns void
 * @since 1.1
 */
splReusable.libs.MapsDataMarshal.prototype.fnSelectDeselectTrucks = function ( oResult, oVBMap, fnCallback, isFromSendMessageToTrucks ) {
	try {
		var sAction = null;
		if ( oVBMap.aSelectedTrucks === undefined ) {
			oVBMap.aSelectedTrucks = [];
		}
		var isSelected = false;
		for ( var i = 0 ; i < oVBMap.aSelectedTrucks.length ; i++ ) {
			if ( oVBMap.aSelectedTrucks[i].DeviceUUID === oResult.DeviceUUID ) {
				if( isFromSendMessageToTrucks !== undefined && isFromSendMessageToTrucks !== null ) {
					if ( isFromSendMessageToTrucks ) {
						isSelected = true;
						sAction = "Select";
						break;
					}
				} else {
					isSelected = true;
					oVBMap.aSelectedTrucks.splice ( i, 1 );
					sAction = "Deselect";
				}
			}
		}
		if ( !isSelected ) {
			oVBMap.aSelectedTrucks.push ( oResult );
			sAction = "Select";
		}

		if ( oResult !== undefined && oResult !== null ) {
			if ( oResult.constructor === Object ) {
				var oFlagData = {};
				oFlagData["position"] = this.convertGeoJSONToString ( JSON.parse ( oResult.Position ) );
				oFlagData["tooltip"] = "";
				oFlagData["key"] = oResult.DeviceUUID;
				oFlagData["description"] = "";
				oFlagData["VB:m"] = "true";
				oFlagData["VB:c"] = "false";
				if ( sAction === "Select" ) {
					if ( oResult["TourName"] === null ) {
						oFlagData["image"] = SapSplVOIconSelector.getVOIcon ( "Truck", "NoOrder", oVBMap.zoom, "Focus" );
					} else {
						oFlagData["image"] = SapSplVOIconSelector.getVOIcon ( "Truck", oResult["isTruckRunningLate"], oVBMap.zoom, "Focus" );
					}

				} else if ( sAction === "Deselect" ) {

					if ( oResult["TourName"] === null ) {
						oFlagData["image"] = SapSplVOIconSelector.getVOIcon ( "Truck", "NoOrder", oVBMap.zoom, "Normal" );
					} else {
						oFlagData["image"] = SapSplVOIconSelector.getVOIcon ( "Truck", oResult["isTruckRunningLate"], oVBMap.zoom, "Normal" );
					}

				} else {
					throw new Error ( "Invalid action argument" );
				}

				this.oTruckFlagSkeleton.SAPVB.Data.Set.N.E.push ( oFlagData );
				oVBMap.load ( this.oTruckFlagSkeleton );
			} else {
				throw new TypeError ( );
			}
		}
		fnCallback ( oVBMap.aSelectedTrucks );
	} catch (oEvent) {
		jQuery.sap.log.error ( oEvent.message, "Failure of fnSelectDeselectTrucks function call", "MapsDataMarshal.js" );
	}
};

/**
 * @description Shows the Selected geofences on the map
 * @param aResults
 * @returns void
 * @since 1.1
 */
splReusable.libs.MapsDataMarshal.prototype.fnSelectDeselectFences = function ( oResult, oVBMap, fnCallback ) {
	try {
		if ( this.isGeofenceSelectDeselectEnabled && oResult.Geometry ) {
			var sAction = null;
			if ( oVBMap.aSelectedLocationFences === undefined ) {
				oVBMap.aSelectedLocationFences = [];
			}
			var isSelected = false;
			for ( var i = 0 ; i < oVBMap.aSelectedLocationFences.length ; i++ ) {
				if ( oVBMap.aSelectedLocationFences[i].LocationID === oResult.LocationID ) {
					isSelected = true;
					oVBMap.aSelectedLocationFences.splice ( i, 1 );
					sAction = "Deselect";
				}
			}
			if ( !isSelected ) {
				oVBMap.aSelectedLocationFences.push ( oResult );
				sAction = "Select";
			}

			if ( oResult !== undefined && oResult !== null ) {
				if ( oResult.constructor === Object ) {
					var oPolygonSkeleton = {
						"SAPVB" : {
							"version" : "2.0",
							"Data" : {
								"Set" : {
									"type" : "N",
									"name" : "GeoFenceAreas",
									"N" : {
										"name" : "GeoFenceAreas",
										"E" : []
									}
								}
							}
						}
					};

					var oPolygonData = {};
					oPolygonData["K"] = oResult["LocationID"];
					oPolygonData["B"] = oResult["Name"];
					oPolygonData["H"] = this.convertGeoJSONToString ( JSON.parse ( oResult["Geometry"] ) );
					oPolygonData["VB:c"] = "false";
					if ( sAction === "Select" ) {
						oPolygonData["C"] = "ARGB(0x30;0xFF;0x00;0x00)";
						oPolygonData["D"] = "ARGB(0x64;0xFF;0x00;0x00)";
						oPolygonData["HC"] = "ARGB(0x64;0xFF;0x00;0x00)";
					} else if ( sAction === "Deselect" ) {
						if ( oResult["isPublic"] === "1" ) {
							oPolygonData["C"] = "ARGB(0x60;0x00;0x9D;0xE0)";
							oPolygonData["D"] = "ARGB(0x60;0xFF;0xFF;0xFF)";
							oPolygonData["HC"] = "ARGB(0x90;0x00;0x9D;0xE0)";
						} else {
							oPolygonData["C"] = "ARGB(0x60;0xF0;0xAB;0x00)";
							oPolygonData["D"] = "ARGB(0x60;0xFF;0xFF;0xFF)";
							oPolygonData["HC"] = "ARGB(0x90;0xF0;0xAB;0x00)";
						}
					} else {
						throw new Error ( "Invalid action argument" );
					}
					oPolygonSkeleton.SAPVB.Data.Set.N.E.push ( oPolygonData );
					oVBMap.load ( oPolygonSkeleton );
				} else {
					throw new TypeError ( );
				}
			}
			fnCallback ( oVBMap.aSelectedLocationFences );
		}
	} catch (oEvent) {
		jQuery.sap.log.error ( oEvent.message, "Failure of fnShowFences function call", "MapsDataMarshal.js" );
	}
};

/**
 * @description Shows the Edited geofences on the map
 * @param aResults
 * @returns void
 * @since 1.1
 */
splReusable.libs.MapsDataMarshal.prototype.fnEditFences = function ( oResult, oVBMap ) {
	try {
		if ( oResult !== undefined && oResult !== null ) {
			if ( oResult.constructor === Object ) {

				if ( oResult["Type"] === "L00001" ) {
					var oFlagData = {};
					oFlagData["position"] = this.convertGeoJSONToString ( JSON.parse ( oResult["Geometry"] ) );
					oFlagData["tooltip"] = oResult.Name;
					oFlagData["key"] = oResult.LocationID;
					oFlagData["description"] = oResult.Name;
					oFlagData["VB:m"] = "true";
					oFlagData["VB:c"] = "true";
					if ( oResult["Tag"] === "LC0001" ) {
						oFlagData["image"] = SapSplVOIconSelector.getVOIcon ( "Bridge", null, oVBMap.zoom, "Focus" );
					} else if ( oResult["Tag"] === "LC0002" ) {
						oFlagData["image"] = SapSplVOIconSelector.getVOIcon ( "Parking", null, oVBMap.zoom, "Focus" );
					} else if ( oResult["Tag"] === "LC0003" ) {
						oFlagData["image"] = SapSplVOIconSelector.getVOIcon ( "ContainerTerminal", null, oVBMap.zoom, "Focus" );
					} else if ( oResult["Tag"] === "LC0007" ) {
						oFlagData["image"] = SapSplVOIconSelector.getVOIcon ( "ContainerDepot", null, oVBMap.zoom, "Focus" );
					} else {
						throw new Error ( "Invalid LocationSpecType" );
					}
					this.oPintOfInterestFlagSkeleton.SAPVB.Data.Set.N.E.push ( oFlagData );
					oVBMap.load ( this.oPintOfInterestFlagSkeleton );
				} else if ( oResult["Type"] === "L00002" || oResult["Type"] === "L00005" ) {
					var oPolygonSkeleton = {
						"SAPVB" : {
							"version" : "2.0",
							"Data" : {
								"Set" : {
									"type" : "N",
									"name" : "GeoFenceAreas",
									"N" : {
										"name" : "GeoFenceAreas",
										"E" : []
									}
								}
							}
						}
					};

					var oPolygonData = {};
					if ( !oResult["LocationID"] ) {
						oPolygonData["K"] = "location";
					} else {
						oPolygonData["K"] = oResult["LocationID"];
					}
					oPolygonData["B"] = oResult["Name"];
					oPolygonData["H"] = this.convertGeoJSONToString ( JSON.parse ( oResult["Geometry"] ) );
					oPolygonData["VB:c"] = "true";
					oPolygonData["C"] = "ARGB(0x64;0xFF;0x00;0x00)";
					oPolygonData["D"] = "ARGB(0x64;0xFF;0x00;0x00)";
					oPolygonData["HC"] = "ARGB(0x30;0xFF;0x00;0x00)";
					oPolygonSkeleton.SAPVB.Data.Set.N.E.push ( oPolygonData );
					oVBMap.load ( oPolygonSkeleton );
				} else {
					throw new Error ( "Invalid Type" );
				}
				// CSN FIX : 0120031469 774795 2014. Removed fence movement when
				// you edit fence
			} else {
				throw new TypeError ( );
			}
		}
	} catch (oEvent) {
		jQuery.sap.log.error ( oEvent.message, "Failure of fnShowFences function call", "MapsDataMarshal.js" );
	}
};

/**
 * Loads detail window objects to the Map
 * @param
 * @returns void
 * @since 1.0
 */
splReusable.libs.MapsDataMarshal.prototype.fnAddDetailWindowContent = function ( oEvent, fnCallback, oVBMap, isDetailVisible ) {
	try {

		if ( oEvent !== undefined && oEvent !== null ) {
			var oDetailWindowArrowImage;
			var oGeofenceNameLabel;
			var oDetailWindowLayout = null;
			var sArrowImage = "";
			var sLayoutID = JSON.parse ( oEvent.getParameter ( "id" ) )["LocationID"].split ( "+" ).join ( "" ).split ( "/" ).join ( "" ).split ( "?" ).join ( "" ).split ( "%" ).join ( "" ).split ( "#" ).join ( "" ).split ( "&" ).join ( "" ).split (
					"=" ).join ( "" );

			if ( !oDetailWindowLayout ) {
				if ( sap.ui.getCore ( ).byId ( sLayoutID + oVBMap.getId ( ) ) ) {
					sap.ui.getCore ( ).byId ( sLayoutID + oVBMap.getId ( ) ).destroy ( );
				}

				oDetailWindowLayout = new sap.ui.commons.layout.VerticalLayout ( {
					id : sLayoutID + oVBMap.getId ( )
				} ).addStyleClass ( "detailWindowLayout" ).addStyleClass ( sLayoutID ).attachBrowserEvent ( "click", function ( ) {
					fnCallback ( this.oData );
				} );

				if ( JSON.parse ( oEvent.getParameter ( "id" ) )["isPublic"] && (JSON.parse ( oEvent.getParameter ( "id" ) )["isPublic"] === "1") ) {
					oDetailWindowLayout.addStyleClass ( "detailWindowLayoutBlueBorder" );
					sArrowImage = "vbDetailWindowArrow.png";
				} else {
					oDetailWindowLayout.addStyleClass ( "detailWindowLayoutYellowBorder" );
					sArrowImage = "vbDetailWindowArrowYellow.png";
				}

				oDetailWindowLayout.oData = JSON.parse ( oEvent.getParameter ( "id" ) );
				if ( !oDetailWindowArrowImage ) {
					oDetailWindowArrowImage = new sap.m.Image ( {
						src : "resources/icons/" + sArrowImage
					} ).addStyleClass ( "detailWindowArrowImage" );
				}
				if ( !oGeofenceNameLabel ) {
					oGeofenceNameLabel = new sap.m.Label ( {
						text : JSON.parse ( oEvent.getParameter ( "id" ) )["Name"]
					} ).addStyleClass ( "detailWindowLabel" );
				}

				oDetailWindowLayout.addEventDelegate ( {
					onAfterRendering : function ( ) {

						if ( isDetailVisible ) {
							jQuery ( "." + sLayoutID ).parent ( ).parent ( ).show ( );
						}
					}
				} );

				oDetailWindowLayout.addContent ( oDetailWindowArrowImage ).addContent ( oGeofenceNameLabel );
				oDetailWindowLayout.placeAt ( oEvent.getParameter ( "contentarea" ).id );
			}
		} else {
			throw new ReferenceError ( );
		}
	} catch (oEvent1) {
		jQuery.sap.log.error ( oEvent1.message, "Failure of fnAddDetailWindowContent function call", "MapsDataMarshal.js" );
	}
};

/**
 * Returns coordinate from a polygon
 * @param sPolygonCordinate
 * @returns void
 * @since 1.0
 */
splReusable.libs.MapsDataMarshal.prototype.fnGetPointFromPolygon = function ( sPolygonCordinate ) {
	var sCordinate = "";
	var iMaxLat = -1000;
	var iMaxCordIndex = 0;
	var fLat;
	var fLon;
	var fMaxLat;
	var fMaxLon;
	var fPrevLon;
	var fPrevLat;
	var fNextLon;
	var fNextLat;

	var aPolygonCordinate = sPolygonCordinate.split ( ";" );
	for ( var j = 0 ; j < aPolygonCordinate.length ; j++ ) {
		if ( j % 3 === 1 ) {
			if ( parseFloat ( aPolygonCordinate[j], 10 ) >= iMaxLat ) {
				iMaxLat = parseFloat ( aPolygonCordinate[j], 10 );
				iMaxCordIndex = j;
			}
		}
	}

	if ( iMaxCordIndex === 1 ) {
		fMaxLat = parseFloat ( aPolygonCordinate[iMaxCordIndex], 10 );
		fMaxLon = parseFloat ( aPolygonCordinate[iMaxCordIndex - 1], 10 );
		fPrevLat = parseFloat ( aPolygonCordinate[aPolygonCordinate.length - 2], 10 );
		fPrevLon = parseFloat ( aPolygonCordinate[aPolygonCordinate.length - 3], 10 );
		fNextLat = parseFloat ( aPolygonCordinate[iMaxCordIndex + 3], 10 );
		fNextLon = parseFloat ( aPolygonCordinate[iMaxCordIndex + 2], 10 );

	} else if ( iMaxCordIndex === aPolygonCordinate.length - 2 ) {
		fMaxLat = parseFloat ( aPolygonCordinate[iMaxCordIndex], 10 );
		fMaxLon = parseFloat ( aPolygonCordinate[iMaxCordIndex - 1], 10 );
		fPrevLat = parseFloat ( aPolygonCordinate[iMaxCordIndex - 3], 10 );
		fPrevLon = parseFloat ( aPolygonCordinate[iMaxCordIndex - 4], 10 );
		fNextLat = parseFloat ( aPolygonCordinate[1], 10 );
		fNextLon = parseFloat ( aPolygonCordinate[0], 10 );

	} else {
		fMaxLat = parseFloat ( aPolygonCordinate[iMaxCordIndex], 10 );
		fMaxLon = parseFloat ( aPolygonCordinate[iMaxCordIndex - 1], 10 );
		fPrevLat = parseFloat ( aPolygonCordinate[iMaxCordIndex - 3], 10 );
		fPrevLon = parseFloat ( aPolygonCordinate[iMaxCordIndex - 4], 10 );
		fNextLat = parseFloat ( aPolygonCordinate[iMaxCordIndex + 3], 10 );
		fNextLon = parseFloat ( aPolygonCordinate[iMaxCordIndex + 2], 10 );
	}

	fLat = (fPrevLat + fNextLat + fMaxLat) / 3;
	fLon = (fNextLon + fPrevLon + fMaxLon) / 3;

	sCordinate = fLon.toString ( ) + ";" + fLat.toString ( ) + ";" + "0.0";
	return sCordinate;
};

/**
 * Loads detail window objects to the Map
 * @param
 * @returns void
 * @since 1.0
 */
splReusable.libs.MapsDataMarshal.prototype.fnShowDetailWindowsForGeofence = function ( oResult, oVBMap ) {

	var oGeofeneData = {};
	oGeofeneData["LocationID"] = oResult["LocationID"];
	oGeofeneData["Name"] = oResult["Name"];
	oGeofeneData["isPublic"] = oResult["isPublic"];

	try {
		if (oGeofeneData["LocationID"]) {
			if ( oResult !== undefined && oResult !== null ) {
				if ( oResult.constructor === Object ) {

					oResult.sDetailWindowPosition = this.fnGetPointFromPolygon ( this.convertGeoJSONToString ( JSON.parse ( oResult["Geometry"] ) ) );

					var oWindowSkeletonConfigObject = {
							"SAPVB" : {
								"version" : "2.0",
								"xmlns:VB" : "VB",
								"Windows" : {
									"Set" : {
										"name" : "Detail1",
										"Window" : {
											"id" : JSON.stringify ( oGeofeneData ),
											"type" : "callout",
											"refParent" : "Window1",
											"refScene" : "",
											"modal" : "false",
											"width" : "150",
											"height" : "50",
											"pos" : oResult.sDetailWindowPosition,
											"caption" : "",
											"offsetX" : "-30",
											"offsetY" : "-40"
										}
									}
								}
							}
					};

					oVBMap.load ( oWindowSkeletonConfigObject );

				} else {
					throw new TypeError ( );
				}
			} else {
				throw new ReferenceError ( );
			}
		}
	} catch (oEvent) {
		jQuery.sap.log.error ( oEvent.message, "Failure of fnShowDetailWindowsForGeofence function call", "MapsDataMarshal.js" );
	}
};

splReusable.libs.MapsDataMarshal.prototype.fnAddGateDetailWindowContent = function ( oEvent, fnCallback, oVBMap ) {
	try {

		if ( oEvent !== undefined && oEvent !== null ) {
			var oDetailWindowArrowImage;
			var oGeofenceNameLabel;
			var oDetailWindowLayout = null;
			var sLayoutID = JSON.parse ( oEvent.getParameter ( "id" ) )["GateUUID"].split ( "+" ).join ( "" ).split ( "/" ).join ( "" ).split ( "?" ).join ( "" ).split ( "%" ).join ( "" ).split ( "#" ).join ( "" ).split ( "&" ).join ( "" ).split (
					"=" ).join ( "" );

			if ( !oDetailWindowLayout ) {
				if ( sap.ui.getCore ( ).byId ( sLayoutID + oVBMap.getId ( ) ) ) {
					sap.ui.getCore ( ).byId ( sLayoutID + oVBMap.getId ( ) ).destroy ( );
				}

				oDetailWindowLayout = new sap.ui.commons.layout.VerticalLayout ( {
					id : sLayoutID + oVBMap.getId ( )
				} ).addStyleClass ( sLayoutID ).addStyleClass ( "gateDetailWindowLayout" ).attachBrowserEvent ( "click", function ( ) {
					fnCallback ( this.oData );
				} );

				oDetailWindowLayout.oData = JSON.parse ( oEvent.getParameter ( "id" ) );
				if ( !oDetailWindowArrowImage ) {
					oDetailWindowArrowImage = new sap.m.Image ( {
						src : "resources/icons/truckDetailsArrow.png"
					} ).addStyleClass ( "gateDetailWindowArrowImage" );
				}
				if ( !oGeofenceNameLabel ) {
					oGeofenceNameLabel = new sap.m.Label ( {
						text : JSON.parse ( oEvent.getParameter ( "id" ) )["Name"]
					} ).addStyleClass ( "gateDetailWindowLabel" );
				}
				oDetailWindowLayout.addContent ( oDetailWindowArrowImage ).addContent ( oGeofenceNameLabel );
				oDetailWindowLayout.placeAt ( oEvent.getParameter ( "contentarea" ).id );
			}

		} else {
			throw new ReferenceError ( );
		}
	} catch (oEvent1) {
		jQuery.sap.log.error ( oEvent1.message, "Failure of fnAddGateDetailWindowContent function call", "MapsDataMarshal.js" );
	}
};

splReusable.libs.MapsDataMarshal.prototype.fnShowDetailWindowsForGates = function ( oResult, oVBMap ) {
	try {

		function fnGetGateDetailWindowPosition ( gateGeometry ) {
			var aGateGeometry = gateGeometry.split ( ";" );
			for ( var i = 0 ; i < aGateGeometry.length ; i++ ) {
				aGateGeometry[i] = parseFloat ( aGateGeometry[i], 10 );
			}
			var sGatePositon = (aGateGeometry[0] + aGateGeometry[3]) / 2 + ";" + (aGateGeometry[1] + aGateGeometry[4]) / 2 + ";0.0";
			return sGatePositon;
		}

		if ( oResult !== undefined && oResult !== null ) {
			if ( oResult.constructor === Object ) {
				oResult["isTypeGate"] = true;
				var oWindowSkeletonConfigObject = {
					"SAPVB" : {
						"version" : "2.0",
						"xmlns:VB" : "VB",
						"Windows" : {
							"Remove" : {
								"name" : "GateDetail" + oResult["GateUUID"]
							},
							"Set" : {
								"name" : "GateDetail" + oResult["GateUUID"],
								"Window" : {
									"id" : JSON.stringify ( oResult ),
									"type" : "callout",
									"refParent" : "Window1",
									"refScene" : "",
									"modal" : "false",
									"width" : "150",
									"height" : "50",
									"pos" : fnGetGateDetailWindowPosition ( this.convertGeoJSONToString ( JSON.parse ( oResult["GateGeometry"] ) ) ),
									"caption" : "",
									"offsetX" : "5",
									"offsetY" : "-15"
								}
							}
						}
					}
				};

				oVBMap.load ( oWindowSkeletonConfigObject );

			} else {
				throw new TypeError ( );
			}
		} else {
			throw new ReferenceError ( );
		}
	} catch (oEvent) {
		jQuery.sap.log.error ( oEvent.message, "Failure of fnShowDetailWindowsForTrucks function call", "MapsDataMarshal.js" );
	}
};

/**
 * Removes the gates on the Map
 * @param oResult
 * @param oVBMap
 */
splReusable.libs.MapsDataMarshal.prototype.fnRemoveGates = function ( oVBMap ) {
	try {

		var oFenceGateSkeleton = {
			"SAPVB" : {
				"Data" : {
					"Remove" : [{
						"name" : "GeofenceGates",
						"type" : "N",
						"N" : {
							"E" : {
								"name" : "GeofenceGates"
							}
						}
					}, {
						"name" : "GeofenceTempGates",
						"type" : "N",
						"N" : {
							"E" : {
								"name" : "GeofenceTempGates"
							}
						}
					}]
				}
			}
		};

		oVBMap.load ( oFenceGateSkeleton );

	} catch (oEvent) {
		jQuery.sap.log.error ( oEvent.message, "Failure of fnRemoveGates function call", "MapsDataMarshal.js" );
	}
};

/**
 * Creates a VB path object and returns it.
 * @param oResult
 * @returns oPath
 * @since 1.1
 */
splReusable.libs.MapsDataMarshal.prototype.fnShowTourPath = function ( oResult, oVBMap ) {
	var oLine = {
		"SAPVB" : {
			"version" : "2.0",
			"Data" : {
				"Set" : {
					"type" : "N",
					"name" : "TourPaths",
					"N" : {
						"name" : "TourPaths",
						"E" : []
					}
				}
			}
		}
	};
	var oPathData = {};
	if ( oResult ) {
		oPathData["key"] = oResult["key"];
		oPathData["name"] = oResult["name"];
		oPathData["coordinate"] = oResult["coordinate"];
		oPathData["color"] = oResult["color"];
		oPathData["start"] = oResult["start"];
		oPathData["end"] = oResult["end"];
		oPathData["dotWidth"] = oResult["dotWidth"];
		oPathData["lineWidth"] = oResult["lineWidth"];
	}
	oLine.SAPVB.Data.Set.N.E.push ( oPathData );
	oVBMap.load ( oLine );
};

/**
 * @description Shows the fnShowGates on the map
 * @param aResults
 * @returns void
 * @since 1.1
 */
splReusable.libs.MapsDataMarshal.prototype.fnShowGates = function ( oResult, oVBMap, sType, sMode ) {
	var oFenceGateSkeleton;
	var oFenceGateData = {};
	try {

		if ( oResult !== undefined && oResult !== null ) {
			if ( oResult.constructor === Object ) {
				if ( sType === "tempGate" ) {
					oFenceGateSkeleton = {
						"SAPVB" : {
							"version" : "2.0",
							"Data" : {
								"Set" : {
									"type" : "N",
									"name" : "GeofenceTempGates",
									"N" : {
										"name" : "GeofenceTempGates",
										"E" : []
									}
								}
							}
						}
					};

					if ( sMode === "selected" ) {
						oFenceGateData["C"] = "ARGB(0x99;0xFF;0xFF;0x00)";
					} else {
						oFenceGateData["C"] = "ARGB(0x99;0x00;0x9D;0xE0)";
					}

				} else {
					oFenceGateSkeleton = {
						"SAPVB" : {
							"version" : "2.0",
							"Data" : {
								"Set" : {
									"type" : "N",
									"name" : "GeofenceGates",
									"N" : {
										"name" : "GeofenceGates",
										"E" : []
									}
								}
							}
						}
					};

					oFenceGateData["C"] = "ARGB(0x99;0xFF;0x00;0x00)";
					this.fnShowDetailWindowsForGates ( oResult, oVBMap );

				}

				oFenceGateData["K"] = oResult["GateUUID"];
				oFenceGateData["T"] = oResult["Name"];
				oFenceGateData["P"] = this.convertGeoJSONToString ( JSON.parse ( oResult["GateGeometry"] ) );
				oFenceGateData["S"] = "0";
				oFenceGateData["E"] = "0";
				oFenceGateData["DW"] = "0";
				oFenceGateData["LW"] = "5";

				oFenceGateSkeleton.SAPVB.Data.Set.N.E.push ( oFenceGateData );
				oVBMap.load ( oFenceGateSkeleton );

			} else {
				throw new TypeError ( );
			}
		} else {
			throw new ReferenceError ( );
		}
	} catch (oEvent) {
		jQuery.sap.log.error ( oEvent.message, "Failure of fnShowGates function call", "MapsDataMarshal.js" );
	}
};

/**
 * getEdgesFromGeofence from an area
 * @param aResults
 * @returns void
 * @since 1.1
 */
splReusable.libs.MapsDataMarshal.prototype.getEdgesFromGeofence = function ( oResult ) {
	try {

		if ( oResult !== undefined && oResult !== null ) {
			if ( oResult.constructor === Object ) {

				var aFenceGates = [];
				var sGeofenceCoordinates = this.convertGeoJSONToString ( JSON.parse ( oResult["Geometry"] ) );
				var aGeofenceCoordinateArray = sGeofenceCoordinates.split ( ";0.0;" );
				aGeofenceCoordinateArray.push ( aGeofenceCoordinateArray[0] );

				for ( var i = 0 ; i < aGeofenceCoordinateArray.length - 1 ; i++ ) {
					var sStartCoordinate = aGeofenceCoordinateArray[i];
					var sEndCoordinate = aGeofenceCoordinateArray[i + 1];
					var fStartCoordinateLon = parseFloat ( sStartCoordinate.split ( ";" )[0], 10 );
					var fStartCoordinateLat = parseFloat ( sStartCoordinate.split ( ";" )[1], 10 );
					var fEndCoordinateLon = parseFloat ( sEndCoordinate.split ( ";" )[0], 10 );
					var fEndCoordinateLat = parseFloat ( sEndCoordinate.split ( ";" )[1], 10 );

					var sGateCoordinate = fStartCoordinateLon + ";" + fStartCoordinateLat + ";0.0;" + fEndCoordinateLon + ";" + fEndCoordinateLat + ";0.0";
					var oFenceGateData = {};
					oFenceGateData["Name"] = "";
					oFenceGateData["GateGeometry"] = JSON.stringify ( this.convertStringToGeoJSON ( sGateCoordinate ) );
					oFenceGateData["GateUUID"] = oResult["LocationID"] + "." + i;
					aFenceGates.push ( oFenceGateData );
					// oSapSplMapsDataMarshal.fnShowGates( oFenceGateData,
					// oVBMap );
				}

				return aFenceGates;
			} else {
				throw new TypeError ( );
			}
		} else {
			throw new ReferenceError ( );
		}
	} catch (oEvent) {
		jQuery.sap.log.error ( oEvent.message, "Failure of getEdgesFromGeofence function call", "MapsDataMarshal.js" );
	}
};

/**
 * @description Shows the GeoFences on the map
 * @param aResults
 * @returns void
 * @since 1.1
 */
splReusable.libs.MapsDataMarshal.prototype.fnShowFences = function ( oResult, oVBMap, sMode ) {

	var oPolygonSkeleton = jQuery.extend ( true, {}, this.oGeoFenceArea );
	var oPolygonData = {};

	try {

		if ( oResult !== undefined && oResult !== null ) {
			if ( oResult.constructor === Object ) {

				if ( !oResult["LocationID"] ) {
					oPolygonData["K"] = "location";
				} else {
					oPolygonData["K"] = oResult["LocationID"];
				}
				oPolygonData["B"] = oResult["Name"];
				oPolygonData["H"] = this.convertGeoJSONToString ( JSON.parse ( oResult["Geometry"] ) );
				oPolygonData["VB:c"] = "false";
				oPolygonData["C"] = "ARGB(0x60;0x00;0x9D;0xE0)";
				oPolygonData["D"] = "ARGB(0x60;0xFF;0xFF;0xFF)";
				oPolygonData["HC"] = "ARGB(0x90;0x00;0x9D;0xE0)";

				if ( sMode && sMode === "onFocus" ) {
					oPolygonData["C"] = "ARGB(0x60;0xFF;0x00;0x00)";
					oPolygonData["D"] = "ARGB(0x60;0xFF;0x00;0x00)";
					oPolygonData["HC"] = "ARGB(0x90;0xFF;0x00;0x00)";
				} else {
					if ( oResult["isPublic"] === "1" ) {
						oPolygonData["C"] = "ARGB(0x60;0x00;0x9D;0xE0)";
						oPolygonData["D"] = "ARGB(0x60;0xFF;0xFF;0xFF)";
						oPolygonData["HC"] = "ARGB(0x90;0x00;0x9D;0xE0)";
					} else {
						oPolygonData["C"] = "ARGB(0x60;0xF0;0xAB;0x00)";
						oPolygonData["D"] = "ARGB(0x60;0xFF;0xFF;0xFF)";
						oPolygonData["HC"] = "ARGB(0x90;0xF0;0xAB;0x00)";
					}
				}

				oPolygonSkeleton.SAPVB.Data.Set.N.E.push ( oPolygonData );
				oVBMap.load ( oPolygonSkeleton );

				if ( sMode && sMode === "onFocus" ) {
					this.fnHandleDetailWindowVisibility ( "Hide", "Geofence" );
					this.fnShowDetailWindowsForGeofence ( oResult, oVBMap );
				}

			} else {
				throw new TypeError ( );
			}
		} else {
			throw new ReferenceError ( );
		}
	} catch (oEvent) {
		jQuery.sap.log.error ( oEvent.message, "Failure of fnShowFences function call", "MapsDataMarshal.js" );
	}
};

/**
 * Removes visual objects based on the arguments
 * @param aResults
 * @returns void
 * @since 1.0
 */
splReusable.libs.MapsDataMarshal.prototype.fnRemoveVOsOnMap = function ( sType, oVBMap ) {

	var oFenceGateRemoveSkeleton;
	var oGFAreaRemoveSkeleton;
	var oPOIRemoveSkeleton;
	var oTruckRemoveSkeleton;
	var oIncidentsOccurrenceRemoveSkeleton;
	var oAreaRemoveSkeleton;
	var oFlagRemoveSkeleton;
	var oLineRemoveSkeleton;

	try {
		if ( sType !== undefined && sType !== null ) {
			if ( sType.constructor === String ) {

				oAreaRemoveSkeleton = {

					"SAPVB" : {
						"Data" : {
							"Remove" : {
								"name" : "Areas",
								"type" : "N",
								"N" : {
									"E" : {
										"name" : "Areas"
									}
								}
							}
						}
					}
				};

				oFlagRemoveSkeleton = {

					"SAPVB" : {
						"Data" : {
							"Remove" : {
								"name" : "Flags",
								"type" : "N",
								"N" : {
									"E" : {
										"name" : "Flags"
									}
								}
							}
						}
					}
				};

				oFenceGateRemoveSkeleton = {
					"SAPVB" : {
						"Data" : {
							"Remove" : [{
								"name" : "GeofenceGates",
								"type" : "N"
							}, {
								"name" : "GeofenceTempGates",
								"type" : "N"
							}]
						}
					}
				};

				oGFAreaRemoveSkeleton = {
					"SAPVB" : {
						"version" : "2.0",
						"Data" : {
							"Remove" : {
								"type" : "N",
								"name" : "GeoFenceAreas"
							}
						}
					}
				};

				oPOIRemoveSkeleton = {
					"SAPVB" : {
						"version" : "2.0",
						"Data" : {
							"Remove" : {
								"type" : "N",
								"name" : "PointOfInterestFlags"
							}
						}
					}
				};

				oTruckRemoveSkeleton = {
					"SAPVB" : {
						"version" : "2.0",
						"Data" : {
							"Remove" : {
								"type" : "N",
								"name" : "TruckFlags"
							}
						}
					}
				};

				oIncidentsOccurrenceRemoveSkeleton = {
					"SAPVB" : {
						"version" : "2.0",
						"Data" : {
							"Remove" : {
								"type" : "N",
								"name" : "IncidentFlags"
							}
						}
					}
				};

				oLineRemoveSkeleton = {
					"SAPVB" : {
						"version" : "2.0",
						"Data" : {
							"Remove" : {
								"type" : "N",
								"name" : "TourPath"
							}
						}
					}
				};

				if ( sType === "All" ) {

					oVBMap.load ( oAreaRemoveSkeleton );
					oVBMap.load ( oFlagRemoveSkeleton );
					oVBMap.load ( oFenceGateRemoveSkeleton );
					oVBMap.load ( oGFAreaRemoveSkeleton );
					oVBMap.load ( oPOIRemoveSkeleton );
					oVBMap.load ( oTruckRemoveSkeleton );
					oVBMap.load ( oIncidentsOccurrenceRemoveSkeleton );
					oVBMap.load ( oLineRemoveSkeleton );

				} else if ( sType === "Flag" ) {

					oVBMap.load ( oFlagRemoveSkeleton );

				} else if ( sType === "Area" ) {

					oVBMap.load ( oAreaRemoveSkeleton );

				} else if ( sType === "Gate" ) {

					oVBMap.load ( oFenceGateRemoveSkeleton );

				} else if ( sType === "Incident" ) {

					oVBMap.load ( oIncidentsOccurrenceRemoveSkeleton );

				} else if ( sType === "Truck" ) {

					oVBMap.load ( oTruckRemoveSkeleton );

				} else if ( sType === "TourPath" ) {

					oVBMap.load ( oLineRemoveSkeleton );

				}

			} else {
				throw new TypeError ( );
			}
		} else {
			throw new ReferenceError ( );
		}
	} catch (oEvent) {
		jQuery.sap.log.error ( oEvent.message, "Failure of fnRemoveVOsOnMap function call", "MapsDataMarshal.js" );
	}
};

/**
 * @description Calls fnShowPointOfInterestFlags or fnShowFences function based on the LocationType
 * @param aResults
 * @returns void
 * @since 1.0
 */
splReusable.libs.MapsDataMarshal.prototype.fnShowVOsOnMap = function ( aResults, oVBMap ) {
	try {
		if ( aResults !== undefined && aResults !== null ) {
			if ( aResults.constructor === Array ) {
				if ( aResults.length === 0 ) {
					this.fnResetValues ( oVBMap );
					this.fnRemoveVOsOnMap ( "All", oVBMap );
					jQuery.sap.log.info ( "No locations present", "MapsDataMarshal.js" );
				} else {
					this.fnResetValues ( oVBMap );
					this.fnRemoveVOsOnMap ( "All", oVBMap );

					var aLabels = jQuery ( ".vbi-detail" );
					var i;
					for ( i = 0 ; i < aLabels.length ; i++ ) {
						if ( jQuery ( aLabels[i] ).find ( ".detailWindowLayout" ).length > 0 ) {
							jQuery ( aLabels[i] ).remove ( );
						}
					}

					for ( i = 0 ; i < aResults.length ; i++ ) {

						if ( aResults[i]["Tag"] === "LC0004" || aResults[i]["Tag"] === "LC0008" ) {
							this.fnShowFences ( aResults[i], oVBMap );
						} else {
							this.fnShowPointOfInterestFlags ( aResults[i], oVBMap );
						}
					}
					this.fnResetValues ( oVBMap );
				}
			} else {
				throw new TypeError ( );
			}
		} else {
			throw new ReferenceError ( );
		}
	} catch (oEvent) {
		jQuery.sap.log.error ( oEvent.message, "Failure of fnShowVOsOnMap function call", "MapsDataMarshal.js" );
	}
};

// CSN FIX STARTS : 0120031469 808589 2014
/**
 * @description This function creates lines on the Map when you draw a polygon
 * @param sPoint
 * @param oVBI
 * @returns void
 * @since 1.0
 */
splReusable.libs.MapsDataMarshal.prototype.fnCreateLine = function ( sPoint, oEvent, oVBMap ) {

	var oFenceGateSkeleton = {
		"SAPVB" : {
			"version" : "2.0",
			"Data" : {
				"Set" : {
					"type" : "N",
					"name" : "GeofenceGates",
					"N" : {
						"name" : "GeofenceGates",
						"E" : []
					}
				}
			}
		}
	};
	var oFlagData = {};

	try {
		if ( sPoint !== undefined && sPoint !== null && oEvent !== undefined && oEvent !== null ) {
			if ( sPoint.constructor === String ) {
				if ( this.isMapClickEabled ) {

					this.aPolygonPoints.push ( sPoint );

					oFlagData["position"] = this.aPolygonPoints[this.iClickCount];
					oFlagData["tooltip"] = "";
					oFlagData["key"] = this.iClickCount.toString ( );
					oFlagData["description"] = "";
					oFlagData["image"] = "default.png";
					oFlagData["VB:m"] = "false";
					oFlagData["VB:c"] = "false";
					this.oFlagSkeleton.SAPVB.Data.Set.N.E.push ( oFlagData );
					oVBMap.load ( this.oFlagSkeleton );

					/* Create lines */
					if ( this.aPolygonPoints.length >= 2 ) {

						var oFenceGateData = {};
						oFenceGateData["C"] = "ARGB(0x64;0xFF;0x00;0x00)";
						oFenceGateData["K"] = this.iClickCount.toString ( );
						oFenceGateData["T"] = this.iClickCount.toString ( );
						oFenceGateData["P"] = this.aPolygonPoints[this.iClickCount - 1] + ";" + this.aPolygonPoints[this.iClickCount] + ";";
						oFenceGateData["S"] = "0";
						oFenceGateData["E"] = "0";
						oFenceGateData["DW"] = "0";
						oFenceGateData["LW"] = "2";

						oFenceGateSkeleton.SAPVB.Data.Set.N.E.push ( oFenceGateData );
						oVBMap.load ( oFenceGateSkeleton );
					}
					// }

					this.iClickCount++;
				}
			} else {
				throw new TypeError ( );
			}
		} else {
			throw new ReferenceError ( );
		}
	} catch (oEvent1) {
		jQuery.sap.log.error ( oEvent1.message, "Failure of fnCreateLine function call", "MapsDataMarshal.js" );
	}
};
// CSN FIX ENDS : 0120031469 808589 2014

/**
 * @description Construct the payload for the ctration of Area
 * @param sMode
 * @param oGeoFenceTypeData
 * @param aCordinates
 * @returns oPayload
 * @since 1.0
 */
splReusable.libs.MapsDataMarshal.prototype.fnConstructPayload = function ( sMode, aCordinates ) {
	var oPayload = {};
	try {

		if ( sMode !== undefined && sMode !== null && aCordinates !== undefined && aCordinates !== null ) {
			if ( sMode.constructor === String && aCordinates.constructor === Array && aCordinates.length !== 0 ) {
				if ( sMode === "Create" ) {
					oPayload.locationGeoCoords = [];
					for ( var i = 0 ; i < aCordinates.length ; i++ ) {
						var aLonLatArray = aCordinates[i].split ( ";" );
						var oLonLatObject = {};
						oLonLatObject.lat = aLonLatArray[1];
						oLonLatObject["long"] = aLonLatArray[0];
						oLonLatObject.alt = aLonLatArray[2];
						oPayload.locationGeoCoords.push ( oLonLatObject );
					}
				}
			} else {
				throw new TypeError ( );
			}
		} else {
			throw new ReferenceError ( );
		}

		return oPayload;

	} catch (oEvent) {
		jQuery.sap.log.error ( oEvent.message, "Failure of fnConstructPayload function call", "MapsDataMarshal.js" );
	}
};

/**
 * @description This function creates the Area and plot on the map based on the clicks on the map
 * @param oGeoFenceTypeData
 * @param oEvent
 * @returns void
 * @since 1.0
 */
splReusable.libs.MapsDataMarshal.prototype.fnCreatePolygon = function ( oVBMap, fnCallback ) {
	var sCoordinate = "";
	var oResult = {};
	try {
		if ( oVBMap !== undefined && oVBMap !== null ) {
			if ( oVBMap.constructor === sap.ui.vbm.VBI ) {

				// Construckts the polygon coordinate string.
				for ( var i = 0 ; i < this.aPolygonPoints.length ; i++ ) {
					sCoordinate += this.aPolygonPoints[i] + ";";
				}
				sCoordinate = sCoordinate.substring ( 0, sCoordinate.length - 1 );

				// Removes the temporary lines from the Map
				this.fnRemoveVOsOnMap ( "Gate", oVBMap );

				// Removes the temporary points from the Map
				this.fnRemoveVOsOnMap ( "Flag", oVBMap );

				oResult = {
					Type : "L00002",
					LocationID : "location",
					Name : "",
					Geometry : JSON.stringify ( this.convertStringToGeoJSON ( sCoordinate ) )
				};

				// Plots the polygon in the Map in edit mode.
				this.fnEditFences ( oResult, oVBMap );

				fnCallback ( sCoordinate );

			} else {
				throw new TypeError ( );
			}
		} else {
			throw new ReferenceError ( );
		}
	} catch (oEvent) {
		jQuery.sap.log.error ( oEvent.message, "Failure of fnShowFences function call", "MapsDataMarshal.js" );
	}
};

/**
 * @description This function creates the Area and plot on the map based on the clicks on the map
 * @param oGeoFenceTypeData
 * @param oEvent
 * @returns void
 * @since 1.0
 */
splReusable.libs.MapsDataMarshal.prototype.fnCreatePointOfInterestFlag = function ( sPoint, oVBMap, fnCallback, sType ) {
	try {
		if ( this.isMapClickEabled ) {
			if ( oVBMap !== undefined && oVBMap !== null ) {
				if ( oVBMap.constructor === sap.ui.vbm.VBI ) {
					this.aPolygonPoints.push ( sPoint );
					var oFlagData = {};
					oFlagData["position"] = sPoint;
					oFlagData["tooltip"] = "Point";
					oFlagData["key"] = "Point" + this.iClickCount;
					oFlagData["description"] = "Point" + this.iClickCount;

					// Bridge
					if ( sType === "LC0001" ) {
						oFlagData["image"] = SapSplVOIconSelector.getVOIcon ( "Bridge", null, oVBMap.zoom, "Focus" );
					} else if ( sType === "LC0002" ) {
						oFlagData["image"] = SapSplVOIconSelector.getVOIcon ( "Parking", null, oVBMap.zoom, "Focus" );
					} else if ( sType === "LC0003" ) {
						oFlagData["image"] = SapSplVOIconSelector.getVOIcon ( "ContainerTerminal", null, oVBMap.zoom, "Focus" );
					} else if ( sType === "LC0007" ) {
						oFlagData["image"] = SapSplVOIconSelector.getVOIcon ( "ContainerDepot", null, oVBMap.zoom, "Focus" );
					} else {
						/* CSNFIX : 0120031469 0000638398 2014 */
						oFlagData["tooltip"] = oSapSplUtils.getBundle ( ).getText ( "INCIDENT_LOCATION_TOOLTIP" );
						oFlagData["image"] = "alert_red.png";
					}
					oFlagData["VB:m"] = "true";
					oFlagData["VB:c"] = "false";
					this.oFlagSkeleton.SAPVB.Data.Set.N.E.push ( oFlagData );
					oVBMap.load ( this.oFlagSkeleton );

					if ( oVBMap.zoom ) {
						oVBMap.zoomToGeoPosition ( parseFloat ( sPoint.split ( ";" )[0], 10 ), parseFloat ( sPoint.split ( ";" )[1], 10 ), parseFloat ( oVBMap.zoom, 10 ) );
					}

					/*
					 * Function that create payload based on the mode that is
					 * passed
					 */
					var oPayload = this.fnConstructPayload ( "Create", this.aPolygonPoints );
					fnCallback ( oPayload );

				} else {
					throw new TypeError ( );
				}
			} else {
				throw new ReferenceError ( );
			}
		}
	} catch (oEvent) {
		jQuery.sap.log.error ( oEvent.message, "Failure of fnShowFences function call", "MapsDataMarshal.js" );
	}
};

/**
 * Change the cursor to pencil image and back to the normal one
 * @param sCursorType
 */
splReusable.libs.MapsDataMarshal.prototype.fnChangeCursor = function ( sCursorType ) {

	if ( oSapSplUtils.bIsInternetExplorer ( ) ) {
		var z = -999;
		var high = null;
		if ( sCursorType === "pencil" ) {
			jQuery ( "canvas" ).each ( function ( ) {
				if ( jQuery ( this ).css ( "z-index" ) > z ) {
					z = jQuery ( this ).css ( "z-index" );
					high = jQuery ( this );
				}
			} );
			if ( high ) {
				jQuery ( "canvas" ).addClass ( "oSapSplPenCursor" );
			}
		} else {
			jQuery ( "canvas" ).each ( function ( ) {
				if ( jQuery ( this ).css ( "z-index" ) > z ) {
					z = jQuery ( this ).css ( "z-index" );
					high = jQuery ( this );
				}
			} );
			if ( high ) {
				jQuery ( "canvas" ).removeClass ( "oSapSplPenCursor" );
			}
		}
	} else {
		if ( sCursorType === "pencil" ) {
			jQuery ( "canvas" ).addClass ( "oSapSplPenCursor" );
		} else {
			jQuery ( "canvas" ).removeClass ( "oSapSplPenCursor" );
		}
	}
};

/**
 * Converts the GeoJSON to coordinate string.
 * @param oGeoJSON
 */
splReusable.libs.MapsDataMarshal.prototype.convertGeoJSONToString = function ( oGeoJSON ) {
	var aCoords;
	var i;
	try {

		// oGeoJSON should not be undefined or null
		if ( oGeoJSON !== undefined && oGeoJSON !== null ) {

			// oGeoJSON should be of type object
			if ( oGeoJSON.constructor === Object ) {
				var sCoords = "";

				if ( oGeoJSON["type"] === "Point" ) {

					// Array of Longitude and Latitude
					aCoords = oGeoJSON["coordinates"];

					sCoords += aCoords[0] + ";" + aCoords[1] + ";" + "0.0;";

				} else if ( oGeoJSON["type"] === "Polygon" ) {

					// Array of Longitude and Latitude
					aCoords = oGeoJSON["coordinates"][0];

					// Loops throught the array and convert it to the string in
					// the format
					// "longitude;latitude;altitude;longitude;latitude;altitude;......longitude;latitude;altitude;"
					for ( i = 0 ; i < aCoords.length - 1 ; i++ ) {
						sCoords += aCoords[i][0] + ";" + aCoords[i][1] + ";" + "0.0;";
					}
				} else if ( oGeoJSON["type"] === "LineString" ) {

					// Array of Longitude and Latitude
					aCoords = oGeoJSON["coordinates"];

					// Loops throught the array and convert it to the string in
					// the format
					// "longitude;latitude;altitude;longitude;latitude;altitude;......longitude;latitude;altitude;"
					for ( i = 0 ; i < aCoords.length ; i++ ) {
						sCoords += aCoords[i][0] + ";" + aCoords[i][1] + ";" + "0.0;";
					}
				}

				// Finds the last charactor of the string
				var sLastChar = sCoords.slice ( -1 );

				// Removes the last charactor of the string if it is a semicolon
				if ( sLastChar === ";" ) {
					sCoords = sCoords.substring ( 0, sCoords.length - 1 );
				}
				return sCoords;

				// oGeoJSON is not of type object
			} else {
				throw new TypeError ( );
			}

			// oGeoJSON is undefined or null
		} else {
			throw new ReferenceError ( );
		}
	} catch (oEvent) {

		jQuery.sap.log.error ( oEvent.message, "Failure of convertGeoJSONToString function call", "MapsDataMarshal.js" );

	}
};

/**
 * Converts the coordinate string to GeoJSON.
 * @param sCoords
 */
splReusable.libs.MapsDataMarshal.prototype.convertStringToGeoJSON = function ( sCoords ) {
	var tempArray;
	try {

		/*
		 * This functions takes the coordinate array in the form [ "longitude",
		 * "latitude", "altitude", "longitude", "latitude", "altitude" ] as
		 * argument and converts to an array in the form [ [ "longitude",
		 * "latitude" ], [ "longitude", "latitude" ], ....[ "longitude",
		 * "latitude" ] ]
		 */
		function createCoordinatesArray ( aCoords ) {
			var aCoordinateArray = [];
			for ( var i = 0 ; i < aCoords.length ; i++ ) {

				// Takes longitude and pushes it to a temporary array
				if ( i % 3 === 0 ) {
					tempArray = [];
					tempArray.push ( parseFloat ( aCoords[i], 10 ) );

					// Takes latitude and pushes it to a temporary array
				} else if ( i % 3 === 1 ) {
					tempArray.push ( parseFloat ( aCoords[i], 10 ) );
					aCoordinateArray.push ( tempArray );
				}
			}
			return aCoordinateArray;
		}

		// sCoords should not be undefined or null
		if ( sCoords !== undefined && sCoords !== null ) {

			// sCoords of type string
			if ( sCoords.constructor === String ) {
				var oGeoJSON = {};
				var aCoordinateArray;

				// Splits the string with semicolon and convert it to an array
				// in the form aCoords[ "longitude", "latitude", "altitude",
				// "longitude", "latitude", "altitude" ]
				var aCoords = sCoords.split ( ";" );

				// Checks if it is a point
				if ( aCoords.length === 3 ) {
					oGeoJSON["type"] = "Point";
					oGeoJSON["coordinates"] = createCoordinatesArray ( aCoords )[0];

					// Checks if it is a line
				} else if ( aCoords.length === 6 ) {
					oGeoJSON["type"] = "LineString";
					aCoordinateArray = createCoordinatesArray ( aCoords );
					oGeoJSON["coordinates"] = aCoordinateArray;

					// Checks if it is a polygon
				} else if ( aCoords.length >= 9 && aCoords.length % 3 === 0 ) {
					oGeoJSON["type"] = "Polygon";
					aCoordinateArray = createCoordinatesArray ( aCoords );
					tempArray = [];
					tempArray.push ( parseFloat ( aCoords[0], 10 ) );
					tempArray.push ( parseFloat ( aCoords[1], 10 ) );
					aCoordinateArray.push ( tempArray );
					oGeoJSON["coordinates"] = [aCoordinateArray];

					// Invalid location string
				} else {
					throw new Error ( "Invalid coordinates" );
				}
				return oGeoJSON;

				// sCoords not a type of string
			} else {
				throw new TypeError ( );
			}

			// sCoords is undefined or null
		} else {
			throw new ReferenceError ( );
		}

	} catch (oEvent) {
		jQuery.sap.log.error ( oEvent.message, "Failure of convertStringToGeoJSON function call", "MapsDataMarshal.js" );
	}
};

/**
 * This function converts Geo coordinates to x and y coordinates of the window
 * @param sCoord
 * @param oVBMap
 */
splReusable.libs.MapsDataMarshal.prototype.convertGeoCoordToScreenCoord = function ( sCoord, oVBMap ) {

	try {

		// Checks for reference errors
		if ( sCoord !== undefined && sCoord !== null && oVBMap !== undefined && oVBMap !== null ) {

			// Checks for type errors
			if ( sCoord.constructor === String && oVBMap.constructor === sap.ui.vbm.VBI ) {

				// Converts the coordinate string in the format "long;lat;alt"
				// to array in the format ["long", "lat", "alt"]
				var aCoords = sCoord.split ( ";" );
				var Control = oVBMap;

				// Visual business internal implementaion to convert geo
				// coordinates to window x and y coordinates
				var ctx = Control.m_VBIContext;
				var sm = ctx.m_SceneManager;
				var scene = sm.m_SceneArray[0];
				var pt = scene.GetPointFromPos ( [parseFloat ( aCoords[0], 10 ), parseFloat ( aCoords[1], 10 ), 0] );
				var cv = scene.m_Canvas[scene.m_nOverlayIndex];
				var rect = cv.getBoundingClientRect ( );

				var oCoords = {};
				oCoords["left"] = rect.left + pt[0];

				// Need to remove the offset 97 after checking with Visual
				// Business
				oCoords["top"] = rect.top + pt[1];

				return oCoords;

			} else {
				throw new TypeError ( );
			}
		} else {
			throw new ReferenceError ( );
		}
	} catch (oEvent) {

	}

};

/**
 * Handles the visibility of labels based on the filter applied on the label toggle control
 * @param sMode
 * @param sContext
 * @since 1.0
 */
splReusable.libs.MapsDataMarshal.prototype.fnHandleDetailWindowVisibility = function ( sMode, sContext ) {
	// DOM reference of all the VB labels.
	var aLabels = jQuery ( ".vbi-detail" );
	var i;

	// To hide the labels
	if ( sMode === "Hide" ) {

		if ( sContext === "All" ) {
			for ( i = 0 ; i < aLabels.length ; i++ ) {
				if ( (jQuery ( aLabels[i] ).find ( ".gateDetailWindowLayout" ).length > 0) || (jQuery ( aLabels[i] ).find ( ".detailWindowLayout" ).length > 0) || (jQuery ( aLabels[i] ).find ( ".truckDetailWindowLayout" ).length > 0) ) {
					jQuery ( aLabels[i] ).hide ( );
				}
			}
		} else if ( sContext === "Geofence" ) {
			for ( i = 0 ; i < aLabels.length ; i++ ) {
				if ( jQuery ( aLabels[i] ).find ( ".detailWindowLayout" ).length > 0 ) {
					jQuery ( aLabels[i] ).remove ( );
				}
			}
		} else if ( sContext === "Gates" ) {
			for ( i = 0 ; i < aLabels.length ; i++ ) {
				if ( jQuery ( aLabels[i] ).find ( ".gateDetailWindowLayout" ).length > 0 ) {
					jQuery ( aLabels[i] ).remove ( );
				}
			}
		} else if ( sContext === "Trucks" ) {
			for ( i = 0 ; i < aLabels.length ; i++ ) {
				if ( jQuery ( aLabels[i] ).find ( ".truckDetailWindowLayout" ).length > 0 ) {
					jQuery ( aLabels[i] ).hide ( );
				}
			}
		} else {
			jQuery.sap.log.error ( "fnHandleDetailWindowVisibility", "invalid sContext", "MapsDataMarshal.js" );
		}

		// To show the labels.
	} else if ( sMode === "Show" ) {

		if ( sContext === "All" ) {
			for ( i = 0 ; i < aLabels.length ; i++ ) {
				if ( (jQuery ( aLabels[i] ).find ( ".gateDetailWindowLayout" ).length > 0) || (jQuery ( aLabels[i] ).find ( ".detailWindowLayout" ).length > 0) || (jQuery ( aLabels[i] ).find ( ".truckDetailWindowLayout" ).length > 0) ) {
					jQuery ( aLabels[i] ).show ( );
				}
			}
		} else if ( sContext === "Geofence" ) {
			for ( i = 0 ; i < aLabels.length ; i++ ) {
				if ( jQuery ( aLabels[i] ).find ( ".detailWindowLayout" ).length > 0 ) {
					jQuery ( aLabels[i] ).show ( );
				}
			}
		} else if ( sContext === "Gates" ) {
			for ( i = 0 ; i < aLabels.length ; i++ ) {
				if ( jQuery ( aLabels[i] ).find ( ".gateDetailWindowLayout" ).length > 0 ) {
					jQuery ( aLabels[i] ).show ( );
				}
			}
		} else if ( sContext === "Trucks" ) {
			for ( i = 0 ; i < aLabels.length ; i++ ) {
				if ( jQuery ( aLabels[i] ).find ( ".truckDetailWindowLayout" ).length > 0 ) {
					jQuery ( aLabels[i] ).show ( );
				}
			}
		} else {
			jQuery.sap.log.error ( "fnHandleDetailWindowVisibility", "invalid sContext", "MapsDataMarshal.js" );
		}

	} else {
		jQuery.sap.log.error ( "fnHandleDetailWindowVisibility", "invalid sMode", "MapsDataMarshal.js" );
	}
};

/**
 * Checks if a point is a part of the gate.
 * @param aGateArray
 * @param oPoint
 */
splReusable.libs.MapsDataMarshal.prototype.fnCheckPointWithinGate = function ( aGateArray, oPoint ) {
	var aGateArrayLength = aGateArray.length;
	var i;
	var aMatchingEdges = [];

	for ( i = 0 ; i < aGateArrayLength ; i++ ) {
		var oGateObject = JSON.parse ( aGateArray[i]["GateGeometry"] );
		if ( ((oGateObject["coordinates"][0][0] === oPoint["long"]) && (oGateObject["coordinates"][0][1] === oPoint["lat"])) || ((oGateObject["coordinates"][1][0] === oPoint["long"]) && (oGateObject["coordinates"][1][1] === oPoint["lat"])) ) {
			aMatchingEdges.push ( aGateArray[i] );
		}
	}

	return aMatchingEdges;
};

/**
 * @description Stores the zoom level of the map
 */
splReusable.libs.MapsDataMarshal.prototype.fnGetMapZoom = function ( oVBMap, oZoomObject ) {
	var i;
	var aZoomArray = JSON.parse ( oZoomObject.getParameter ( "data" ) ).Action.AddActionProperties.AddActionProperty;
	var aParam = JSON.parse ( oZoomObject.getParameter ( "data" ) ).Action.Params.Param;
	for ( i = 0 ; i < aZoomArray.length ; i++ ) {
		if ( aZoomArray[i]["name"] === "zoom" ) {
			oVBMap.zoom = aZoomArray[i]["#"];
		} else if ( aZoomArray[i]["name"] === "centerpoint" ) {
			oVBMap.centerpoint = aZoomArray[i]["#"];
		}
	}
	for ( i = 0 ; i < aParam.length ; i++ ) {
		if ( aParam[i]["name"] === "min" ) {
			oVBMap.min = aParam[i]["#"];
		} else if ( aParam[i]["name"] === "max" ) {
			oVBMap.max = aParam[i]["#"];
		}
	}

	if ( oVBMap.max !== undefined && oVBMap.min !== undefined ) {
		var topLeft = oVBMap.min;
		var bottomRight = oVBMap.max;
		var topRight = topLeft.split ( ";" )[0] + ";" + bottomRight.split ( ";" )[1] + ";0";
		var bottomLeft = bottomRight.split ( ";" )[0] + ";" + topLeft.split ( ";" )[1] + ";0";

		var boundingRectangleString = topLeft + ";" + topRight + ";" + bottomRight + ";" + bottomLeft;
		oVBMap.boundingRectangle = boundingRectangleString;
	}
};

/**
 * @description Stores the zoom level of the map
 */
splReusable.libs.MapsDataMarshal.prototype.fnGetMapCenter = function ( oVBMap, oZoomObject ) {
	var i;
	var aZoomArray = JSON.parse ( oZoomObject.getParameter ( "data" ) ).Action.AddActionProperties.AddActionProperty;
	var aParam = JSON.parse ( oZoomObject.getParameter ( "data" ) ).Action.Params.Param;
	for ( i = 0 ; i < aZoomArray.length ; i++ ) {
		if ( aZoomArray[i]["name"] === "centerpoint" ) {
			oVBMap.centerpoint = aZoomArray[i]["#"];
		}
	}
	for ( i = 0 ; i < aParam.length ; i++ ) {
		if ( aParam[i]["name"] === "min" ) {
			oVBMap.min = aParam[i]["#"];
		} else if ( aParam[i]["name"] === "max" ) {
			oVBMap.max = aParam[i]["#"];
		}
	}

	if ( oVBMap.max !== undefined && oVBMap.min !== undefined ) {
		var topLeft = oVBMap.min;
		var bottomRight = oVBMap.max;
		var topRight = topLeft.split ( ";" )[0] + ";" + bottomRight.split ( ";" )[1] + ";0";
		var bottomLeft = bottomRight.split ( ";" )[0] + ";" + topLeft.split ( ";" )[1] + ";0";

		var boundingRectangleString = topLeft + ";" + topRight + ";" + bottomRight + ";" + bottomLeft;
		oVBMap.boundingRectangle = boundingRectangleString;
	}
};

/**
 * @description Sets the zoom level and center point of the Map
 */
splReusable.libs.MapsDataMarshal.prototype.fnSetZoomAndCenter = function ( oVBMap, oZoomObject ) {
	oVBMap.zoomToGeoPosition ( oZoomObject.lon, oZoomObject.lat, oZoomObject.zoomLevel );
};

/**
 * @description Pan to a point in the map
 */

splReusable.libs.MapsDataMarshal.prototype.fnPanTo = function ( oVBMap, sPoint ) {
	var aPoint = sPoint.split ( ";" );
	if ( oVBMap.zoom ) {
		oVBMap.zoomToGeoPosition ( parseFloat ( aPoint[0], 10 ), parseFloat ( aPoint[1], 10 ), parseFloat ( oVBMap.zoom, 10 ) );
	}
};

/**
 * Pan to a particular entity on the Map
 * @param oVBMap
 * @param oResult
 */
splReusable.libs.MapsDataMarshal.prototype.fnPanToEntity = function ( oVBMap, oResult ) {
	var coordinatesArray;
	if ( oResult["Geometry"] ) {

		coordinatesArray = this.convertGeoJSONToString ( JSON.parse ( oResult["Geometry"] ) ).split ( ";" );
		if ( oVBMap.zoom ) {
			oVBMap.zoomToGeoPosition ( parseFloat ( coordinatesArray[0], 10 ), parseFloat ( coordinatesArray[1], 10 ), parseFloat ( oVBMap.zoom, 10 ) );
		}

	} else if ( oResult["Position"] ) {

		coordinatesArray = this.convertGeoJSONToString ( JSON.parse ( oResult["Position"] ) ).split ( ";" );
		if ( oVBMap.zoom ) {
			oVBMap.zoomToGeoPosition ( parseFloat ( coordinatesArray[0], 10 ), parseFloat ( coordinatesArray[1], 10 ), parseFloat ( oVBMap.zoom, 10 ) );
		}

	} else if ( oResult["SourceLocation"] ) {

		coordinatesArray = this.convertGeoJSONToString ( JSON.parse ( oResult["SourceLocation"] ) ).split ( ";" );
		if ( oVBMap.zoom ) {
			oVBMap.zoomToGeoPosition ( parseFloat ( coordinatesArray[0], 10 ), parseFloat ( coordinatesArray[1], 10 ), parseFloat ( oVBMap.zoom, 10 ) );
		}

	} else {
		jQuery.sap.log.error ( "fnPanToEntity", "invalid entity", "liveApp.controller.js" );
	}
};

/**
 * Plots VOs on the map.
 * @param oVBMap oVO
 * @returns null
 * @since 1.0
 */
splReusable.libs.MapsDataMarshal.prototype.plotOnVBMap = function ( oVBMap, oVO ) {
	if ( oVBMap && oVO ) {
		oVBMap.load ( oVO );
	}
};

/**
 * @description Clear all the VOs from the Map
 * @param void
 * @returns void
 * @since 1.0
 */
splReusable.libs.MapsDataMarshal.prototype.fnClearMap = function ( oVBMap ) {
	var oConfigJSON = this.getMapsModelJSON ( SapSplEnums.configJSON );

	if ( oVBMap.centerpoint && oVBMap.zoom ) {
		oConfigJSON.SAPVB.Scenes.Set.SceneGeo.initialStartPosition = oVBMap.centerpoint;
		oConfigJSON.SAPVB.Scenes.Set.SceneGeo.initialZoom = oVBMap.zoom;
	}
	oVBMap.load ( oConfigJSON );
	if ( oVBMap.zoom ) {
		var aCenter = oVBMap.centerpoint.split ( ";" );
		oVBMap.zoomToGeoPosition ( parseFloat ( aCenter[0], 10 ), parseFloat ( aCenter[1], 10 ), parseFloat ( oVBMap.zoom, 10 ) );
	}
};

/**
 * @description Resets the values of all buffer variables and counters.
 * @param void
 * @returns void
 * @since 1.0
 */
splReusable.libs.MapsDataMarshal.prototype.fnResetValues = function ( oVBMap ) {
	if ( oVBMap.aSelectedLocationFences !== undefined ) {
		oVBMap.aSelectedLocationFences = [];
	}
	if ( oVBMap.aSelectedTrucks !== undefined ) {
		oVBMap.aSelectedTrucks = [];
	}
	this.aClickedPoints = [];
	this.aPolygonPoints = [];
	this.oFlagSkeleton.SAPVB.Data.Set.N.E.length = 0;
	this.oPintOfInterestFlagSkeleton.SAPVB.Data.Set.N.E.length = 0;
	this.oTruckFlagSkeleton.SAPVB.Data.Set.N.E.length = 0;
	this.iClickCount = 0;
	this.isMapClickEabled = false;
	this.isGeofenceSelectDeselectEnabled = true;
	this.sFirstClickPoint = "";

};

/* Create global accessor */
var oSapSplMapsDataMarshal = new splReusable.libs.MapsDataMarshal ( );
