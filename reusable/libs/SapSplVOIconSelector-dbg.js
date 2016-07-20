/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare ( "splReusable.libs.SapSplVOIconSelector" );

SapSplVOIconSelector = (function ( window, $, oSapSplUtils, undefined ) {

	/*
	 * Mapping object used for mapping the icon names based on entity, sub
	 * criteria (based on reported status or priority), Zoom level (to decide
	 * the size of icons), filter criteria/ state (Focus, Normal, PRM incident,
	 * Traffic incident)
	 */
	var oIconMapper = jQuery.sap.sjax ( {
		url : "./config/maps/MapsIconMapper.json",
		dataType : "json",
		type : "GET"
	} )["data"];

	var oSubCategoryMapper = {
		Parking : {
			"0" : "Normal",
			"1" : "Normal",
			"2" : "FastFilling",
			"3" : "Full"
		},
		ContainerTerminal : {
			"0" : "Normal",
			"4" : "NoService",
			"5" : "Delay",
			"6" : "Normal",
			"7" : "OutOfHours"
		},
		ContainerDepot : {
			"0" : "Normal",
			"4" : "NoService",
			"5" : "Delay",
			"6" : "Normal",
			"7" : "OutOfHours"
		},
		Alert : {
			"0" : "Normal"
		},
		Bridge : {
			"0" : "Normal"
		},
		Incident : {
			"4" : "Low",
			"3" : "Medium",
			"2" : "High",
			"1" : "High",
			"0" : "Low"
		},
		Truck : {
			"NoOrder" : "NoOrder",
			"1" : "Issue",
			"2" : "NoIssue",
			"0" : "NoIssue"
		}
	};

	function findIconBasedOnZoomAndTag ( sEntity, sSubType, sSize, sFilter ) {
		if (sSubType === undefined) {
			sSubType = "Normal";
		}
		return oIconMapper[sEntity][sSubType][sSize][sFilter];
	}

	/* Get Icon size based on zoom level */
	function getSizeFromZoomLevel ( iZoom, sEntity ) {
		if ( sEntity !== "Truck" ) {
			if ( iZoom ) {
				if ( iZoom <= 6 ) {
					return "Small";
				} else if ( iZoom <= 12 ) {
					return "Medium";
				} else {
					return "Large";
				}
			} else {
				return "Large";
			}
		} else {
			if ( iZoom ) {
				if ( iZoom <= 10 ) {
					return "Small";
				} else {
					return "Large";
				}
			} else {
				return "Large";
			}
		}
	}

	/*
	 * Get Sub Category from oSubCategoryMapper, based on category decider value
	 * For Incidents : Value - Priority For Trucks : Value - isTruckRunningLate
	 * For POI : Value - Reported Status
	 */
	function getSubCategoryForLocation ( sEntity, sValue ) {
		/* To remove 1 eslint high prio error */
		if ( sEntity === "Truck" && sValue === 0 ) {
			sValue = "2";
		}
		if ( sEntity === "Truck" && sValue === 1 ) {
			sValue = "1";
		}
		return oSubCategoryMapper[sEntity][sValue];
	}

	/*
	 * Method to fetch the appropriate icon sEntity (Entity Name) - Eg: Parking,
	 * Truck, etc sValue (Sub category decider) - Eg: reportedStatus for POI,
	 * priority for Incidents iZoom (Zoom level of the map) - Eg: any number in
	 * the range 1 - 20 sFilter (Additional filter criteria) - Eg: State of the
	 * icon like Focus, RollOver, Normal
	 */
	return {
		getVOIcon : function ( sEntity, sValue, iZoom, sFilter ) {
			if ( !sValue ) {
				sValue = "0";
			}
			return findIconBasedOnZoomAndTag ( sEntity, getSubCategoryForLocation ( sEntity, sValue ), getSizeFromZoomLevel ( iZoom, sEntity ), sFilter );
		}
	};

} ( window, jQuery, oSapSplUtils ));