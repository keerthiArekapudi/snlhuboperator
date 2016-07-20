/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare ( "splReusable.libs.SapSplMapFilterControl" );
jQuery.sap.require ( "splReusable.exceptions.MissingParametersException" );
jQuery.sap.require ( "splReusable.exceptions.InvalidArrayException" );
jQuery.sap.require ( "splReusable.libs.SapSplEnums" );
splReusable.libs.SapSplStyleSheetLoader.loadStyle ( "./resources/styles/sapSplMapFilter" );

/**
 * @constructor
 * @description SapSplMapFilterControl library to handle mapFilterControl instantiation.
 * @param {object} oArguments arguments to the constructor.
 *      mapInstance : the VBI map instance - to be used by the control to refresh the map.
 * @returns void.
 * @since 1.0
 */
splReusable.libs.SapSplMapFilterControl = function ( oArguments ) {
	this.appliedFilters = [];
	this.showList = true;
	this.headerTitle = oSapSplUtils.getBundle ( ).getText ( "MAP_FILTER_VISIBILITY_TITLE" );
	this.headerLabelTitle = oSapSplUtils.getBundle ( ).getText ( "MAP_FILTER_LABEL_TITLE" );
	this.width = "20rem";
	this.headerIcon = "sap-icon://show";
	this.headerLabelIcon = "sap-icon://blank-tag";
	this.oVBMapInstance = null;
	this.sPSURL = null;

	/* CSN FIX Incident ID 1482008765 */
	this.isRefresh = false;

	if ( oArguments.constructor === Object ) {
		if ( !this.oMapFilterODataModel ) {
			this.oMapFilterODataModel = new sap.ui.model.odata.ODataModel ( oSapSplUtils.getFQServiceUrl ( "/sap/spl/xs/app/services/appl.xsodata/" ) );
		}
		if ( oArguments["headerTitle"] ) {
			this.headerTitle = oArguments["headerTitle"];
		}
		if ( oArguments["headerLabelTitle"] ) {
			this.headerLabelTitle = oArguments["headerLabelTitle"];
		}
		if ( oArguments["showList"] && oArguments["showList"].constructor === Boolean ) {
			this.showList = oArguments["showList"];
		}
		if ( oArguments["width"] && oArguments["width"].constructor === String ) {
			this.width = oArguments["width"];
		}
		if ( oArguments["headerIcon"] && oArguments["headerIcon"].constructor === String ) {
			this.headerIcon = oArguments["headerIcon"];
		}
		if ( oArguments["headerLabelIcon"] ) {
			this.headerIcon = oArguments["headerLabelIcon"];
		}
		if ( oArguments["mapInstance"] && oArguments["mapInstance"].constructor === sap.ui.vbm.VBI ) {
			this.oVBMapInstance = oArguments["mapInstance"];
		}
	}
};

/**
 * private
 * @description success call back of the OData read with filters.
 * @param {object} data resultset of the filtered geofences.
 * @returns void
 * @since 1.0
 */
function fnSuccessOfGeoFenceRead ( data, dummySecondArgument, oRef ) {
	oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
	/* CSNFIX : 0120061532 0001224835 2014 */
	/*if (data.results.length === 0) {
	    //sap.ca.ui.message.showMessageToast(oSapSplUtils.getBundle().getText("NO_DATA_TEXT"));
	}*/

	if ( !oRef ) {
		oRef = this;
	}

	var oVBToBeShownOnMap = [], i;

	if ( oRef.oVBMapInstance && !oRef.oVBMapInstance.getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getController ( ).selectedItems ) {
		oRef.oVBMapInstance.getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getController ( ).selectedItems = {};
	}

	if ( oRef.oVBMapInstance.getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getController ( ).newCreatedVisualObject ) {
		oRef.entity = "";
	}

	//set data for left panel
	for ( i = 0 ; i < data.results.length ; i++ ) {

		data.results[i].isSelected = false;

		if ( oRef.oVBMapInstance.getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getController ( ).newCreatedVisualObject ) {
			if ( oRef.oVBMapInstance.getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getController ( ).newCreatedVisualObject === data.results[i].LocationID ) {
				data.results[i].isSelected = true;
				oRef.oVBMapInstance.getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getController ( ).newCreatedVisualObject = null;
			} else if ( oRef.oVBMapInstance.getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getController ( ).selectedItems[data.results[i].LocationID] ) {
				data.results[i].isSelected = true;
			}
		} else {
			if ( data.results[i].Tag === oRef.entity ) {

				if ( oRef.entityTypes === "B" ) {
					data.results[i].isSelected = oRef.entitySelected;
				} else {
					if ( oRef.entityTypes === "O" && data.results[i].isPublic === "0" ) {
						data.results[i].isSelected = oRef.entitySelected;
					} else if ( oRef.entityTypes === "T" && data.results[i].isPublic === "1" ) {
						data.results[i].isSelected = oRef.entitySelected;
					} else if ( oRef.oVBMapInstance.getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getController ( ).selectedItems ) {
						if ( oRef.oVBMapInstance.getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getController ( ).selectedItems[data.results[i].LocationID] ) {
							data.results[i].isSelected = true;
						}
					}
				}

			} else if ( oRef.oVBMapInstance.getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getController ( ).selectedItems ) {
				if ( oRef.oVBMapInstance.getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getController ( ).selectedItems[data.results[i].LocationID] ) {
					data.results[i].isSelected = true;
				}
			}
		}

		if ( data.results[i].isSelected ) {
			if (data.results[i].Geometry) {
				oVBToBeShownOnMap.push ( data.results[i] );
			}
			oRef.oVBMapInstance.getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getController ( ).selectedItems[data.results[i].LocationID] = true;
		} else {
			oRef.oVBMapInstance.getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getController ( ).selectedItems[data.results[i].LocationID] = false;
		}
	}

	/* CSN FIX Incident ID 1482008765 */

	data = oRef.oVBMapInstance.getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getController ( ).fnToAddSIsSharedFieldToLeftPanelModel ( data );

	if ( this.isRefresh || oRef.entitySelected ) {
		sap.ui.getCore ( ).getModel ( "SapSplLeftPanelListModel" ).setSizeLimit ( data.results.length + 1 );

		sap.ui.getCore ( ).getModel ( "SapSplLeftPanelListModel" ).setData ( data.results );

		this.isRefresh = false;

	} else {
		var oModelData = sap.ui.getCore ( ).getModel ( "SapSplLeftPanelListModel" ).getData ( );
		for ( i = 0 ; i < oModelData.length ; i++ ) {
			if ( oModelData[i].Tag === oRef.entity ) {
				if ( oRef.entityTypes === "B" ) {
					oModelData[i].isSelected = false;
					oRef.oVBMapInstance.getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getController ( ).selectedItems[oModelData[i].LocationID] = false;
				} else {
					if ( oRef.entityTypes === "O" && oModelData[i].isPublic === "0" ) {
						oModelData[i].isSelected = false;
						oRef.oVBMapInstance.getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getController ( ).selectedItems[oModelData[i].LocationID] = false;
					} else if ( oRef.entityTypes === "T" && oModelData[i].isPublic === "1" ) {
						oModelData[i].isSelected = false;
						oRef.oVBMapInstance.getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getController ( ).selectedItems[oModelData[i].LocationID] = false;
					}
				}
			}
		}
		sap.ui.getCore ( ).getModel ( "SapSplLeftPanelListModel" ).setSizeLimit ( oModelData.length + 1 );
		sap.ui.getCore ( ).getModel ( "SapSplLeftPanelListModel" ).setData ( oModelData );
	}

	oRef.entity = "";

	oSapSplMapsDataMarshal.fnShowVOsOnMap ( oVBToBeShownOnMap, oRef.oVBMapInstance );
	if ( oRef.fnCallback ) {
		oRef.fnCallback ( oVBToBeShownOnMap );
	}

	oRef.oVBMapInstance.getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getController ( ).byId ( "SapSplLeftPanelBusyIndicatorLayout" ).removeStyleClass ( "SapSplLeftPanelBlocker" );
	oRef.oVBMapInstance.getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getController ( ).byId ( "SapSplLeftPanelBusyIndicatorLayout" ).addStyleClass ( "SapSplLeftPanelBlockerHide" );
}

/**
 * private
 * @description success call back of the OData read with filters.
 * @param {object} error error object.
 * @returns void
 * @since 1.0
 */
function fnFailureOfGeoFenceRead ( ) {

}

/**
 * private
 * @description Method to make an OData read with the selected filters, or to refresh the geofences with the current set of applied filters.
 * @param {array} aFilters array of filters to be applied or the string "refresh" to indicate refresh mode.
 * @param {object} that the class instance of SapSplMapFilterControl
 * @returns void
 * @since 1.0
 */
function readForGeoFences ( aFilters, that ) {
	if ( aFilters.constructor === Array ) {
		that.appliedFilters = aFilters;
		if ( aFilters.length === 0 ) {
			fnSuccessOfGeoFenceRead ( {
				results : []
			}, {}, that );
			oSapSplMapsDataMarshal.fnClearMap ( that.oVBMapInstance );
			if ( that.fnCallback ) {
				that.fnCallback ( );
			}

		} else {
			oSapSplBusyDialog.getBusyDialogInstance ( {
				title : oSapSplUtils.getBundle ( ).getText ( "BUSY_DIALOG_MESSAGE" )
			} ).open ( );
			that.oMapFilterODataModel.read ( "MyLocations", null, null, false, jQuery.proxy ( fnSuccessOfGeoFenceRead, that ), jQuery.proxy ( fnFailureOfGeoFenceRead, that ) );
		}

	} else if ( aFilters.constructor === String && aFilters === "refresh" ) {
		if ( that.appliedFilters.length === 0 ) {
			oSapSplMapsDataMarshal.fnClearMap ( that.oVBMapInstance );
		} else {
			oSapSplBusyDialog.getBusyDialogInstance ( {
				title : oSapSplUtils.getBundle ( ).getText ( "BUSY_DIALOG_MESSAGE" )
			} ).open ( );
			that.oMapFilterODataModel.read ( "MyLocations", null, null, false, jQuery.proxy ( fnSuccessOfGeoFenceRead, that ), jQuery.proxy ( fnFailureOfGeoFenceRead, that ) );
		}
	} else {
		oSapSplBusyDialog.getBusyDialogInstance ( {
			title : oSapSplUtils.getBundle ( ).getText ( "BUSY_DIALOG_MESSAGE" )
		} ).open ( );
		that.oMapFilterODataModel.read ( "MyLocations", null, null, false, jQuery.proxy ( fnSuccessOfGeoFenceRead, that ), jQuery.proxy ( fnFailureOfGeoFenceRead, that ) );
	}
}

/**
 * private
 * @description Method to return the filter text based on type of secondary filter.
 * @since 1.0
 * @param sId id of the selected secondary filter.
 * @returns {string} filter text for the required filter.
 */
function getFilterText ( sId ) {
	var oFilterText = {
		"thirdParty" : "isPublic eq '1'",
		"myOrg" : "isPublic eq '0'"
	};
	return oFilterText[sId];
}

//function getLocationCode(sLocationName) {
//    switch (sLocationName) {
//    case "Bridge":
//        return "LC0001";
//    case "Parking Space":
//        return "LC0002";
//    case "Container Terminal":
//        return "LC0003";
//    case "Geofence":
//        return "LC0004";
//    }
//}

function startStopPollingOfParkingSpace ( sMode, that ) {
	if ( sMode === "start" ) {
		if ( !that.oFilterLayout.oPSInterval ) {
			that.oFilterLayout.oPSInterval = window.setInterval ( function ( ) {
				startStopPollingOfParkingSpace ( "start", that );
			}, 30000 );
		}
		if ( that.sPSURL ) {
			that.oMapFilterODataModel.read ( "MyLocations", null, null, true, jQuery.proxy ( function ( oData ) {

				var oVBToBeShownOnMap = [];
				for ( var i = 0 ; i < oData.results.length ; i++ ) {
					oData.results[i].isSelected = false;

					if ( that.oVBMapInstance.getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getController ( ).selectedItems[oData.results[i].LocationID] ) {
						oData.results[i].isSelected = true;
						oVBToBeShownOnMap.push ( oData.results[i] );
					}
					//oSapSplMapsDataMarshal.fnShowPointOfInterestFlags(oData.results[i], that.oVBMapInstance);
				}

				sap.ui.getCore ( ).getModel ( "SapSplLeftPanelListModel" ).setSizeLimit ( oData.results.length + 1 );
				sap.ui.getCore ( ).getModel ( "SapSplLeftPanelListModel" ).setData ( oData.results );

				oSapSplMapsDataMarshal.fnShowVOsOnMap ( oVBToBeShownOnMap, that.oVBMapInstance );
				if ( that.fnCallback ) {
					that.fnCallback ( );
				}

			}, that ), jQuery.proxy ( function ( ) {
				jQuery.sap.log.error ( "startStopPollingOfParkingSpace", "read for parking space failed", "SapSplMapFilterControl.js" );
			}, that ) );
		}
	} else {
		window.clearInterval ( that.oFilterLayout.oPSInterval );
		that.oFilterLayout.oPSInterval = null;
	}
}

/**
 * private
 * @description Method to get the complete URL for OData request , based on the primary and secondary filters selected by the user.
 * @returns void.
 * @since 1.0
 * @param {object} oEvent event object.
 * @param {object} that the class instance of SapSplMapFilterContro
 */
function getFilterUrl ( oEvent, that ) {
	var oSelectedDataObject = {};
	var aItems = oEvent.getSource ( ).getParent ( ).getParent ( ).getParent ( ).getItems ( );
	if ( aItems.constructor === Array ) {
		for ( var j = 0 ; j < aItems.length ; j++ ) {
			/* CSN FIX : 0120031469 682358 2014 changing the value of sKey from Value.description to Value */
			var sKey = aItems[j].getBindingContext ( ).getProperty ( "Value" );
			var aSelectedFilterArray = [];
			var aSelectedRowRightItems = aItems[j].getCells ( )[0].getContentRight ( );
			if ( aSelectedRowRightItems.constructor === Array ) {
				for ( var i = 0 ; i < aSelectedRowRightItems.length ; i++ ) {
					if ( aSelectedRowRightItems[i].hasStyleClass ( "opacityHigh" ) ) {
						aSelectedFilterArray.push ( aSelectedRowRightItems[i].getCustomData ( )[0].getValue ( ).id.split ( "-" )[0] );
					}
				}
			}
			oSelectedDataObject[sKey] = aSelectedFilterArray;
		}
	}

	var URL = "$expand=GeofenceGates&$filter=";
	$.each ( oSelectedDataObject, function ( key, value ) {
		if ( value.length > 0 ) {
			/* CSN FIX : 0120031469 682358 2014 changing the value of sKey from Value.description to Value */
			var Location = "((Tag eq " + "'" + key + "') and (";
			var arr = [];
			for ( var i = 0 ; i < value.length ; i++ ) {
				//                if (value[i] !== "thirdParty") {
				arr.push ( getFilterText ( value[i] ) );
				//                } else {
				//                if (i === 0) {
				//                Location = "";
				//                }
				//                }
			}
			for ( var j = 0 ; j < arr.length ; j++ ) {
				Location = Location + arr[j];
				if ( j !== arr.length - 1 ) {
					Location = Location + " or ";
				} else {
					Location = Location + ")) or";
				}
			}
			URL = URL + Location;
			/* CSNFIX : 0120031469 792660     2014 */
			if ( key === "LC0002" ) {
				that.sPSURL = "$filter=(Tag eq 'LC0002') and (" + Location.split ( ") or" )[0].split ( "and " )[1] + ")";
			}
		}
	} );

	if ( URL.search ( "LC0002" ) > -1 ) {
		startStopPollingOfParkingSpace ( "start", that );
	} else {
		startStopPollingOfParkingSpace ( "stop", that );
	}

	if ( URL.indexOf ( "or", URL.length - 3 ) !== -1 ) {
		URL = URL.substring ( 0, URL.length - 2 );
	}

	if ( URL === "$expand=GeofenceGates&$filter=" ) {
		readForGeoFences ( [], that );
	} else {
		readForGeoFences ( [URL], that );
	}
}

/**
 * private
 * @description Method to handle the collapse or expand of the filter list
 * internally changes the visibilty of the control.
 * @returns void.
 * @since 1.0
 * @param {object} oEvent event object.
 */
//function fnCollapseOrExpandFilter(oEvent) {
//    var oSourceButton = null;
//    oSourceButton = oEvent.getSource();
//    if (oSourceButton && oSourceButton.constructor === sap.m.Button) {
//        if (oSourceButton.getIcon() === "sap-icon://navigation-down-arrow") {
//            oSourceButton.setIcon("sap-icon://navigation-up-arrow");
//            $(".sapMListTbl").show();
//        } else {
//            oSourceButton.setIcon("sap-icon://navigation-down-arrow");
//            $(".sapMListTbl").hide();
//        }
//    }
//}
/**
 * private
 * @description Method to handle the press of row selection button of label filter
 * @returns void.
 * @since 1.0
 * @param {object} oEvent event object.
 */
function fnOnRowSelectButtonClickOfLabel ( oEvent ) {

	var oSourceButton = oEvent.getSource ( );
	var oSourceBar = oEvent.getSource ( ).getParent ( );
	var aContentRightOfBar = oSourceBar.getContentRight ( );
	var sHideShow = "";

	if ( oSourceButton && oSourceButton.constructor === sap.m.Button && oSourceBar && oSourceBar.constructor === sap.m.Bar && aContentRightOfBar && aContentRightOfBar.constructor === Array ) {

		if ( oSourceButton.hasStyleClass ( "opacityLow" ) ) {
			oSourceButton.removeStyleClass ( "opacityLow" );
			oSourceButton.addStyleClass ( "opacityHigh" );
			oSourceBar.removeStyleClass ( "whiteBackground" );
			oSourceBar.addStyleClass ( "itemSelectedBackground" );
			//            getFilterUrl(oEvent,that);
			sHideShow = "Show";
		} else {
			oSourceButton.removeStyleClass ( "opacityHigh" );
			oSourceButton.addStyleClass ( "opacityLow" );
			oSourceBar.addStyleClass ( "whiteBackground" );
			oSourceBar.removeStyleClass ( "itemSelectedBackground" );
			//            getFilterUrl(oEvent,that);
			sHideShow = "Hide";
		}
		var oObject = {};
		oObject[oEvent.getSource ( ).getBindingContext ( ).getObject ( ).ID] = !oSourceButton.hasStyleClass ( "opacityLow" );
		this.oVBMapInstance.getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getController ( ).fnLabelToggleControlToMapInterface ( oObject );
		oSapSplMapsDataMarshal.fnHandleDetailWindowVisibility ( sHideShow, oEvent.getSource ( ).getBindingContext ( ).getObject ( ).ID );
	}
}

function handleClickOfObjectInMapFilter ( sType, bClicked, that, bToggle ) {
	var sHideShow;
	var aLabelFilterData = that.oFilterLayout.getContent ( )[1].getItems ( ), oSourceButton = null, oSourceBar = null;
	for ( var i = 0 ; i < aLabelFilterData.length ; i++ ) {
		if ( aLabelFilterData[i].getBindingContext ( ).getObject ( )["ID"] === sType ) {
			oSourceButton = aLabelFilterData[i].getCells ( )[0].getContentLeft ( )[0];
			oSourceBar = aLabelFilterData[i].getCells ( )[0];
			oSourceButton.removeStyleClass ( "opacityLow" );
			oSourceButton.removeStyleClass ( "opacityHigh" );
			if ( bClicked ) {
				oSourceButton.addStyleClass ( "opacityLow" );
				oSourceButton.setEnabled ( true );
			} else {
				oSourceButton.addStyleClass ( "opacityHigh" );
				oSourceButton.setEnabled ( false );
			}
			if ( oSourceButton.hasStyleClass ( "opacityLow" ) ) {
				oSourceButton.removeStyleClass ( "opacityLow" );
				oSourceButton.addStyleClass ( "opacityHigh" );
				oSourceBar.removeStyleClass ( "whiteBackground" );
				oSourceBar.addStyleClass ( "itemSelectedBackground" );
				//                getFilterUrl(oEvent,that);
				/* CSNFIX : 0120061532 1479733    2014 */
				sHideShow = "Hide";
			} else {
				oSourceButton.removeStyleClass ( "opacityHigh" );
				oSourceButton.addStyleClass ( "opacityLow" );
				oSourceBar.addStyleClass ( "whiteBackground" );
				oSourceBar.removeStyleClass ( "itemSelectedBackground" );
				//                getFilterUrl(oEvent,that);
				/* CSNFIX : 0120061532 1479733    2014 */
				sHideShow = "Show";
			}
			var oObject = {};
			oObject[sType] = !oSourceButton.hasStyleClass ( "opacityLow" );
			/* CSNFIX : 0120031469 0000619148 2014 */
			if ( bToggle && bToggle === true ) {
				oObject[sType] = oSourceButton.hasStyleClass ( "opacityLow" );
				if ( sHideShow === "Show" ) {
					sHideShow = "Hide";
				} else {
					sHideShow = "Show";
				}
			}
			that.oVBMapInstance.getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getController ( ).fnLabelToggleControlToMapInterface ( oObject );
			oSapSplMapsDataMarshal.fnHandleDetailWindowVisibility ( sHideShow, sType );
		}
	}
}

/**
 * private
 * @description Method to handle the press of row selection button
 * internally changes the opacity of all the buttons in the row, based on its current state
 * @returns void.
 * @since 1.0
 * @param {object} oEvent event object.
 */
function fnOnRowSelectButtonClick ( oEvent ) {
	var oSourceButton = oEvent.getSource ( );
	var oSourceBar = oEvent.getSource ( ).getParent ( );
	var aContentRightOfBar = oSourceBar.getContentRight ( );
	var that = this;

	//fnSelectCorrespondingIconTabFilter(oEvent.getSource().getBindingContext().getProperty().Value, that);

	this.oVBMapInstance.getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getController ( ).byId ( "SapSplLeftPanelBusyIndicatorLayout" ).removeStyleClass ( "SapSplLeftPanelBlockerHide" );
	this.oVBMapInstance.getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getController ( ).byId ( "SapSplLeftPanelBusyIndicatorLayout" ).addStyleClass ( "SapSplLeftPanelBlocker" );

	this.entity = oEvent.getSource ( ).getBindingContext ( ).getProperty ( ).Value;
	this.entityTypes = "B";
	if ( oSourceButton.hasStyleClass ( "opacityLow" ) ) {
		this.entitySelected = true;
	} else {
		this.entitySelected = false;
	}

	if ( oSourceButton && oSourceButton.constructor === sap.m.Button && oSourceBar && oSourceBar.constructor === sap.m.Bar && aContentRightOfBar && aContentRightOfBar.constructor === Array ) {

		if ( oSourceButton.hasStyleClass ( "opacityLow" ) ) {
			oSourceButton.removeStyleClass ( "opacityLow" );
			oSourceButton.addStyleClass ( "opacityHigh" );
			for ( var i = 0 ; i < aContentRightOfBar.length ; i++ ) {
				aContentRightOfBar[i].removeStyleClass ( "opacityLow" );
				aContentRightOfBar[i].addStyleClass ( "opacityHigh" );
			}
			oSourceBar.removeStyleClass ( "whiteBackground" );
			oSourceBar.addStyleClass ( "itemSelectedBackground" );
			/* CSNFIX : 0120031469 0000619148 2014 */
			if ( oSourceBar.getBindingContext ( ).getObject ( )["Value"] === "LC0004" ) {
				if ( oSourceBar.hasStyleClass ( "itemSelectedBackground" ) ) {
					handleClickOfObjectInMapFilter ( "Geofence", true, that );
				} else {
					handleClickOfObjectInMapFilter ( "Geofence", false, that, true );
				}
			}

			getFilterUrl ( oEvent, that );
		} else {
			oSourceButton.removeStyleClass ( "opacityHigh" );
			oSourceButton.addStyleClass ( "opacityLow" );
			for ( var j = 0 ; j < aContentRightOfBar.length ; j++ ) {
				aContentRightOfBar[j].removeStyleClass ( "opacityHigh" );
				aContentRightOfBar[j].addStyleClass ( "opacityLow" );
			}
			oSourceBar.addStyleClass ( "whiteBackground" );
			oSourceBar.removeStyleClass ( "itemSelectedBackground" );
			/* CSNFIX : 0120031469 0000619148 2014 */
			if ( oSourceBar.getBindingContext ( ).getObject ( )["Value"] === "LC0004" ) {
				if ( oSourceBar.hasStyleClass ( "itemSelectedBackground" ) ) {
					handleClickOfObjectInMapFilter ( "Geofence", true, that );
				} else {
					handleClickOfObjectInMapFilter ( "Geofence", false, that, true );
				}
			}

			getFilterUrl ( oEvent, that );
		}

	}
}

/**
 * private
 * @description Method to handle the press of any secondary filter button
 * changes the opacity of the secondary filter button and calls getFilterURL internally with all the selected secondary filters
 * @returns void.
 * @since 1.0
 * @param {object} oEvent event object.
 */
function fnOnSecondaryFilterClicked ( oEvent ) {
	var that = this;
	var oSourceButton = null, oSourceBar = null, oSourceBarRightItems = null, isOff = true;

	oSourceButton = oEvent.getSource ( );
	oSourceBar = oEvent.getSource ( ).getParent ( );
	oSourceBarRightItems = oSourceBar.getContentRight ( );

	this.oVBMapInstance.getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getController ( ).byId ( "SapSplLeftPanelBusyIndicatorLayout" ).removeStyleClass ( "SapSplLeftPanelBlockerHide" );
	this.oVBMapInstance.getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getController ( ).byId ( "SapSplLeftPanelBusyIndicatorLayout" ).addStyleClass ( "SapSplLeftPanelBloker" );
	//fnSelectCorrespondingIconTabFilter(oEvent.getSource().getCustomData()[0].getBindingContext().getProperty().Value, that);

	this.entity = oEvent.getSource ( ).getCustomData ( )[0].getBindingContext ( ).getProperty ( ).Value;
	if ( oEvent.getSource ( ).getCustomData ( )[0].getValue ( ).id === "myOrg" ) {
		this.entityTypes = "O";
	} else {
		this.entityTypes = "T";
	}
	if ( oSourceButton.hasStyleClass ( "opacityLow" ) ) {
		this.entitySelected = true;
	} else {
		this.entitySelected = false;
	}

	if ( oSourceButton && oSourceButton.constructor === sap.m.Button && oSourceBar && oSourceBar.constructor === sap.m.Bar ) {
		if ( oSourceButton.hasStyleClass ( "opacityLow" ) ) {
			oSourceButton.removeStyleClass ( "opacityLow" );
			oSourceButton.addStyleClass ( "opacityHigh" );
			oSourceBar.getContentLeft ( )[0].removeStyleClass ( "opacityLow" );
			oSourceBar.getContentLeft ( )[0].addStyleClass ( "opacityHigh" );
			oSourceBar.removeStyleClass ( "whiteBackground" );
			oSourceBar.addStyleClass ( "itemSelectedBackground" );
		} else if ( oSourceButton.hasStyleClass ( "opacityHigh" ) ) {
			oSourceButton.removeStyleClass ( "opacityHigh" );
			oSourceButton.addStyleClass ( "opacityLow" );
		}

		for ( var i = 0 ; i < oSourceBarRightItems.length ; i++ ) {
			if ( !oSourceBarRightItems[i].hasStyleClass ( "opacityLow" ) ) {
				isOff = false;
			}
		}
		if ( isOff ) {
			oSourceBar.removeStyleClass ( "itemSelectedBackground" );
			oSourceBar.addStyleClass ( "whiteBackground" );
			oSourceBar.getContentLeft ( )[0].removeStyleClass ( "opacityHigh" );
			oSourceBar.getContentLeft ( )[0].addStyleClass ( "opacityLow" );
		}
		getFilterUrl ( oEvent, that );
		if ( oSourceBar.getBindingContext ( ).getObject ( )["Value"] === "LC0004" ) {
			if ( oSourceBar.hasStyleClass ( "itemSelectedBackground" ) ) {
				handleClickOfObjectInMapFilter ( "Geofence", true, that );
			} else {
				handleClickOfObjectInMapFilter ( "Geofence", false, that, true );
			}
		}
	}
}

/**
 * public
 * @description Method to set a callback function.
 * @returns void
 * @param void
 * @since 1.0
 * @example
 *      new splReusable.libs.SapSplMapFilterControl().refreshMap();
 */
splReusable.libs.SapSplMapFilterControl.prototype.setCallback = function ( fnCallback ) {
	this.fnCallback = fnCallback;
};

/**
 * public
 * @description Method to refresh the geofences with the currently applied filters on the geofences.
 * @returns void
 * @param void
 * @since 1.0
 * @example
 *      new splReusable.libs.SapSplMapFilterControl().refreshMap();
 */
splReusable.libs.SapSplMapFilterControl.prototype.refreshMap = function ( sFlag ) {

	/* CSN FIX Incident ID 1482008765 */
	this.isRefresh = true;
	if ( sFlag ) {
		readForGeoFences ( sFlag, this );
	} else {
		readForGeoFences ( "refresh", this );
	}

};

/**
 * public
 * @description Method to get the mapFilter Control.
 * @returns {object} oMapFilter mapFilter instance to handle filtering on the map.
 * @param void.
 * @since 1.0
 * @example
 *      new splReusable.libs.SapSplMapFilterControl().getFilter();
 */
splReusable.libs.SapSplMapFilterControl.prototype.getFilter = function ( ) {

	var that = this;
	/* CSNFIX : 0120031469 0000788179 2014 */
	var oMapFilter = new sap.m.Table ( {
		width : that.width,
		rowHeight : 1,
		mode : "SingleSelectMaster",
		headerToolbar : new sap.m.Toolbar ( {
			content : new sap.m.Bar ( {
				contentLeft : [new sap.m.Button ( {
					icon : that.headerIcon,
					enabled : false,
					press : function ( ) {
						jQuery ( ".filterTable" ).hide ( );
					}
				} ), new sap.m.Label ( {
					text : that.headerTitle,
					design : "Bold"
				} )]
			} ).addStyleClass ( "headerToolbar" )
		} ).addStyleClass ( "shadow" ),
		columns : {
			template : new sap.m.Column ( )
		},
		items : {
			path : "/results",
			template : new sap.m.ColumnListItem ( {
				cells : [new sap.m.Bar ( {
					contentLeft : [new sap.m.Button ( {
						icon : "sap-icon://accept",
						press : jQuery.proxy ( fnOnRowSelectButtonClick, that )
					} ).addStyleClass ( "opacityLow" ), new sap.m.Text ( {
						text : "{Value.description}"
					} ).addStyleClass ( "geoFenceText" )],
					contentMiddle : [],
					contentRight : [
					//new sap.m.Button({
					//type: "Transparent",
					//icon: "sap-icon://employee", visible: true,
					//press: jQuery.proxy(fnOnSecondaryFilterClicked,that)
					//}).addStyleClass("opacityLow").addCustomData(new sap.ui.core.CustomData({key:"ID",value:{id:"myself"}})),
					new sap.m.Button ( {
						type : "Transparent",
						icon : "sap-icon://collaborate",
						tooltip : oSapSplUtils.getBundle ( ).getText ( "PRIVATE_VISIBILITY" ),
						press : jQuery.proxy ( fnOnSecondaryFilterClicked, that )
					} ).addStyleClass ( "opacityLow" ).addCustomData ( new sap.ui.core.CustomData ( {
						key : "ID",
						value : {
							id : "myOrg"
						}
					} ) ), new sap.m.Button ( {
						type : "Transparent",
						icon : "sap-icon://family-care",
						tooltip : oSapSplUtils.getBundle ( ).getText ( "PUBLIC_VISIBILITY" ),
						press : jQuery.proxy ( fnOnSecondaryFilterClicked, that )
					} ).addStyleClass ( "opacityLow" ).addCustomData ( new sap.ui.core.CustomData ( {
						key : "ID",
						value : {
							id : "thirdParty"
						}
					} ) )]
				} ).addStyleClass ( "whiteBackground" )]
			} )
		}
	} ).addStyleClass ( "filterTable" );

	/* CSNFIX : 0120031469 0000788179 2014 */
	var oLabelFilter = new sap.m.Table ( {
		width : that.width,
		rowHeight : 1,
		mode : "SingleSelectMaster",
		headerToolbar : new sap.m.Toolbar ( {
			content : new sap.m.Bar ( {
				contentLeft : [new sap.m.Button ( {
					icon : that.headerLabelIcon,
					enabled : false
				} ), new sap.m.Label ( {
					text : that.headerLabelTitle,
					design : "Bold"
				} )]
			} ).addStyleClass ( "headerToolbar" )
		} ).addStyleClass ( "shadow" ),
		columns : {
			template : new sap.m.Column ( )
		}
	} ).addStyleClass ( "filterTable" );

	/* FIX : 1482008728 */
	oLabelFilter.setVisible ( splReusable.libs.SapSplModelFormatters.sapSplGetVisibilityBasedOnSubscriptionModel ( sap.ui.getCore ( ).getModel ( "sapSplAppConfigDataModel" ).getData ( )["isTrucksLabelVisible"] ) );

	oLabelFilter.bindAggregation ( "items", "/labelResults", function ( sId, oObject ) {
		var sStyleClassButton = "", sStyleClassBar = "";

		if ( oObject.getObject ( )["checked"] && oObject.getObject ( )["checked"] === true ) {
			sStyleClassButton = "opacityHigh";
			sStyleClassBar = "itemSelectedBackground";
		} else {
			sStyleClassButton = "opacityLow";
			sStyleClassBar = "whiteBackground";
		}

		return new sap.m.ColumnListItem ( {
			visible : "{visible}",
			cells : [new sap.m.Bar ( {
				contentLeft : [new sap.m.Button ( {
					enabled : "{enabled}",
					icon : "sap-icon://accept",
					press : jQuery.proxy ( fnOnRowSelectButtonClickOfLabel, that )
				} ).addStyleClass ( sStyleClassButton ), new sap.m.Text ( {
					text : "{value}"
				} ).addStyleClass ( "geoFenceText" )],
				contentMiddle : []

			} ).addStyleClass ( sStyleClassBar )]
		} );
	} );

	oMapFilter.addEventDelegate ( {
		onAfterRendering : function ( ) {
		//            $(".sapMListTbl").hide();
		}
	} );

	this.oFilterLayout = new sap.ui.layout.VerticalLayout ( ).addContent ( oMapFilter ).addContent ( oLabelFilter ).addStyleClass ( "sapSplMapFilterControlVerticalLayout" );
	this.oFilterLayout.getMapFilterControlInstance = function ( ) {
		return that;
	};
	return this.oFilterLayout;

};
