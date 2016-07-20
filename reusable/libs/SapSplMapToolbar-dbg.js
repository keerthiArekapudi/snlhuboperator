/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare ( "splReusable.libs.SapSplMapToolbar" );
jQuery.sap.require ( "splReusable.libs.SapSplMapFilterControl" );
jQuery.sap.require ( "splReusable.libs.SapSplLiveFeedControl" );
jQuery.sap.require ( "splReusable.libs.SapSplCustomSearchControl" );

splReusable.libs.SapSplMapToolbar = function ( oToolbarConfigData ) {
	var that = this;

	this.parentControllerInstance = oToolbarConfigData["parentControllerInstance"];

	// this.aLocationType = oToolbarConfigData.locationType;
	this.oMapInstance = oToolbarConfigData.mapInstance;
	this.oPageInstance = oToolbarConfigData.pageInstance;

	// this.oPageInstance.insertContent( this.instantiateMapFilter(), 0 );
	var oMapFilter = that.instantiateMapFilter ( );

	// SJON model for MapToolbarFiter control
	this.oMapToolbarJSONModel = new sap.ui.model.json.JSONModel ( oToolbarConfigData );

	// Layout for the Parking Space Filter
	this.oParkingSpaceFilterLayout = new sap.ui.commons.layout.HorizontalLayout ( ).addStyleClass ( "oSapSplMapToolbarParkingFilterLayout" );
	var oParkingSpaceFilterLayoutTemplate = new sap.ui.commons.layout.HorizontalLayout ( {
		visible : "{visible}"
	} );
	oParkingSpaceFilterLayoutTemplate.addContent ( new sap.m.Text ( {
		text : "{name}"
	} ).addStyleClass ( "oSapSplMapToolbarParkingFilterLayoutButton" ) ).addContent ( new sap.ui.core.Icon ( {
		src : "sap-icon://navigation-down-arrow"
	} ).attachPress ( oToolbarConfigData["toolbarEventHandler"] ).addStyleClass ( "oSapSplMapToolbarParkingFilterLayoutButton" ) );
	this.oParkingSpaceFilterLayout.bindAggregation ( "content", "/parkingSpaceFilters", oParkingSpaceFilterLayoutTemplate );

	// Layout for the Map Space Filter
	this.oMapsFilterLayout = new sap.ui.layout.HorizontalLayout ( ).addStyleClass ( "sapSplMapsFilterHLayout" );
	this.oMapsFilterLayout.bindAggregation ( "content", "/mapFilters", function ( id, oBindObject ) {
		if ( oBindObject.getProperty ( "name" ) === "Map" ) {
			that.oMapButton = new sap.m.Button ( {
				icon : "{icon}",
				visible : "{visible}",
				tooltip : oSapSplUtils.getBundle ( ).getText ( "MAP_BUTTON_TOOLTIP" )
			} ).attachPress ( function ( ) {
				// that.mapFilterPress();
				if ( !that.oMapFilterPopover ) {
					that.oMapFilterPopover = new sap.m.Popover ( {
						modal : false,
						showHeader : false,
						height : "100px",
						offsetX : -123,
						offsetY : -8,
						placement : "Bottom",
						content : oMapFilter
					} ).addStyleClass ( "mapFilterPopover" );
				}

				that.oSearchHorizontalLayout.getSearchFieldInstance ( ).fnExpandCollapseSearchField ( "Collapse" );

				// CSN FIX : 0120031469 638342 2014
				if ( that.oMapFilterPopover.isOpen ( ) ) {
					that.oMapFilterPopover.close ( );
				} else {
					that.oMapFilterPopover.openBy ( that.oMapButton );
				}

			} ).addStyleClass ( "sapSplMapToolbarMapFilterButton" );
			return that.oMapButton;
		} else {
			that.oMapButton = new sap.m.Button ( {
				icon : "{icon}",
				visible : "{visible}"
			} ).attachPress ( oToolbarConfigData["toolbarEventHandler"] );
			return that.oMapButton;
		}
	} );

	this.oTrafficStatusTitleLabel = new sap.m.Label ( {
		text : oSapSplUtils.getBundle ( ).getText ( "TRAFFIC_STATUS_TITLE" )
	} ).addStyleClass ( "trafficStatusTitle" );

	this.oSearchHorizontalLayout = new splReusable.libs.SapSplCustomSearchControl ( {
		"controllerInstance" : this.oPageInstance,
		"trafficStatusTitleLabel" : this.oTrafficStatusTitleLabel
	} );

	this.oToolbarBlockerLayout = new sap.ui.commons.layout.HorizontalLayout ( ).addStyleClass ( "oToolbarBlockerLayout" );

	/* CSNFIX : 0120031469 0000643266 2014 */
	/* Incident : 1570146454 */
	this.oNavButton = new sap.m.Button ( {
		tooltip : oSapSplUtils.getBundle ( ).getText ( "BACK_BUTTON_TOOLTIP" ),
		visible : true,
		icon : "sap-icon://nav-back",
		press : function ( ) {
			oSplBaseApplication.getAppInstance ( ).back ( );
		}
	} );

	this.oCollapseExpandLeftPanelButton = new sap.m.Button ( {
		icon : "sap-icon://list",
		tooltip : oSapSplUtils.getBundle ( ).getText ( "ENTITIES" ),
		press : function ( ) {
			if ( that.parentControllerInstance.byId ( "sapSplTrafficStatusContainer" ).getMode ( ) === "HideMode" ) {
				that.parentControllerInstance.byId ( "sapSplTrafficStatusContainer" ).setMode ( "ShowHideMode" );
				$ ( ".sapSplLeftPanelMasterPage" ).css ( "height", $ ( window ).height ( ) - 3 * $ ( ".sapMBar" ).height ( ) + "px" );
			} else {
				that.parentControllerInstance.byId ( "sapSplTrafficStatusContainer" ).setMode ( "HideMode" );
			}
			that.parentControllerInstance.fnRenderStyle ( );
		}
	} ).addEventDelegate ( {
		onAfterRendering : function ( oEvent ) {
			if ( oEvent.srcControl.bFirst === undefined ) {
				oEvent.srcControl.firePress ( );
				oEvent.srcControl.firePress ( );
				oEvent.srcControl.bFirst = true;
			}
		}
	} );

	this.oDisplayAreaLabel = new sap.m.Label ( {
		text : "{splI18NModel>SELECT_DISPLAY_AREA}",
		id : "SapSplDisplayAreaNameLabel"
	} );

	this.oDisplayAreaButton = new sap.m.Button ( {
		icon : "sap-icon://arrow-down",
		press : function ( oEvent ) {

			splReusable.libs.SapSplStyleSheetLoader.loadStyle ( "./resources/styles/sapSplDisplayAreaDialogs" );

			var oSapSPlDisplayAreaListView = sap.ui.view ( {
				viewName : "splView.dialogs.SplDisplayAreaList",
				type : sap.ui.core.mvc.ViewType.XML,
				viewData : that
			} );

			var oBeginButton = new sap.m.Button ( {
				text : "{splI18NModel>CREATE_DISPLAY_AREA}"
			} );

			var oEndButton = new sap.m.Button ( {
				text : "{splI18NModel>DISPLAY_AREA_SETTINGS}"
			} );

			oSapSPlDisplayAreaListView.getController ( ).setBeginButton ( oBeginButton );
			oSapSPlDisplayAreaListView.getController ( ).setEndButton ( oEndButton );

			new sap.m.ResponsivePopover ( {
				placement : "Bottom",
				modal : false,
				content : oSapSPlDisplayAreaListView,
				beginButton : oBeginButton,
				endButton : oEndButton,
				contentWidth : "20em",
				title : "{splI18NModel>DISPLAY_AREAS}"
			} ).openBy ( oEvent.getSource ( ) );

		}
	} );

	// removed parking space specific filter : ticket (319996)
	// To add it back add this.oParkingSpaceFilterLayout to the
	// this.oBarContentLayout.

	this.oBarContentLayout = new sap.ui.commons.layout.HorizontalLayout ( {
		content : [this.oSearchHorizontalLayout, this.oMapsFilterLayout]
	} ).addStyleClass ( "splMapTollbarBarContentLayout" );

	/* CSNFIX : 0120031469 0000654565 2014 */
	this.oSapMapToolbarBar = new sap.m.Bar ( {
		contentLeft : [this.oNavButton, this.oCollapseExpandLeftPanelButton, this.oDisplayAreaLabel, this.oDisplayAreaButton],
		contentMiddle : [this.oTrafficStatusTitleLabel],
		contentRight : [this.oBarContentLayout]
	} ).setModel ( this.oMapToolbarJSONModel ).addStyleClass ( "splMapTollbarBar" );

	// Calls the function which enables and disables the toolbar
	this.oSapMapToolbarBar.setEnabled = function ( bMode ) {
		that.setEnabled ( bMode );
	};

	// Refreshes the map with the applied filter
	this.oSapMapToolbarBar.refreshMap = function ( sFlag ) {
		that.refreshMap ( sFlag );
	};

	this.oSapMapToolbarBar.firePressOnMapFilter = function ( sType ) {
		that.firePressOnMapFilter ( sType );
	};

	this.oSapMapToolbarBar.addFeedlistControl = function ( ) {
		if ( oToolbarConfigData.feedlistVisible ) {
			that.addFeedlistControl ( );
		}
	};

	this.oSapMapToolbarBar.getSearchFieldLayoutInstance = function ( ) {
		return that.oSearchHorizontalLayout.getSearchFieldInstance ( );
	};

	this.oSapMapToolbarBar.getLiveFeedInstance = function ( ) {
		return that.oFeedListControl;
	};

	// Callback for the Map filter
	this.oSapMapToolbarBar.setMapFilterCallback = function ( fnCallback ) {
		that.setMapFilterCallback ( fnCallback );
	};

	this.oSapMapToolbarBar.getMapFilterInstance = function ( ) {
		return that.oSapSplMapFilter;
	};

	/* Fix for incident : 1570071128 */

// this.oSapMapToolbarBar.addEventDelegate({
// onAfterRendering: function () {
// if (sap.ui.Device.browser.name === "ie") {
// jQuery(".splMapTollbarBar").css("position", "fixed");
// jQuery(".splMapTollbarBar").css("z-index", 999);
// }
// }
// });
	return this.oSapMapToolbarBar;
};

/**
 * Position the map filter on the toolbar when you click on the map filter icon.
 * @param oEvetn
 * @returns void
 * @since 1.0
 */
splReusable.libs.SapSplMapToolbar.prototype.mapFilterPress = function ( ) {
// if ( this.oSapSplMapFilter.hasStyleClass("showMapFilter") ) {
// this.oSapSplMapFilter.removeStyleClass("showMapFilter");

// } else {
// this.oSapSplMapFilter.addStyleClass("showMapFilter");

// function positionMapFilter() {

// // jQuery(".filterTable").css("left", ($(".sapSplFeedLayout").offset().left -
// $(".filterTable").width() - 10)+"px");
// // jQuery(".filterTable").css("top", "3rem");

// jQuery(".filterTable").css("left", "0px");
// jQuery(".filterTable").css("top", "3rem");
// }
// positionMapFilter();
// jQuery(window).resize( function() {
// positionMapFilter();
// } );
// }
};

/**
 * Instantiate the map filter
 * @param void
 * @returns oSapSplMapFilter
 * @since 1.0
 */
/* eslint no-delete-var:1 */
splReusable.libs.SapSplMapToolbar.prototype.instantiateMapFilter = function ( ) {

	// Success call back for the read
	function fnSuccess ( aData ) {
		this.oLocationTypeData = aData;
		this.oLocationTypeData["labelResults"] = [
		// {
		// value : oSapSplUtils.getBundle().getText("FILTER_LABEL_ALL"),
		// ID : "ALL",
		// enabled : true,
		// visible : true
		// },
		{
			value : oSapSplUtils.getBundle ( ).getText ( "TRUCKS" ),
			ID : "Trucks",
			enabled : true,
			visible : splReusable.libs.SapSplModelFormatters.sapSplGetVisibilityBasedOnSubscriptionModel ( sap.ui.getCore ( ).getModel ( "sapSplAppConfigDataModel" ).getData ( )["isTrucksLabelVisible"] ),
			checked : true
		}, {
			value : oSapSplUtils.getBundle ( ).getText ( "GEOFENCES" ),
			ID : "Geofence",
			enabled : false,
			visible : false
		}];

		var x = jQuery ( ".filterTable" );
		delete x;
		var model = new sap.ui.model.json.JSONModel ( this.oLocationTypeData );

		oSapSplUtils.setSplModelFilterControlInstance ( this.oSapSplVBMapFilter );
		this.oSapSplMapFilter.setModel ( model );
	}

	// Failure of read
	function fnFail ( oError ) {
		if ( oError ) {
			sap.ca.ui.message.showMessageBox ( {
				type : sap.ca.ui.message.Type.ERROR,
				message : oError["response"]["statusCode"] + " " + oError["response"]["statusText"],
				details : oError["message"] + "\n" + oError["response"]["requestUri"]
			} );
		}
		throw new Error ( "Location Type read failed" );
	}

	// oData read for the location type enum
	// CSN FIX : 0120061532 1484268 2014
	this.oSapSplApplModel = sap.ui.getCore ( ).getModel ( "LiveAppODataModel" );
	this.oSapSplApplModel.read ( "/LocationViewEnum", null, null, true, jQuery.proxy ( fnSuccess, this ), jQuery.proxy ( fnFail, this ) );
	this.oSapSplVBMapFilter = new splReusable.libs.SapSplMapFilterControl ( {
		width : "280px",
		showList : true,
		mapInstance : this.oMapInstance
	} );
	this.oSapSplMapFilter = this.oSapSplVBMapFilter.getFilter ( );
	return this.oSapSplMapFilter;

};

/**
 * This function instantiates the feedlist control
 * @param void
 * @returns {splReusable.libs.SapSplLiveFeedControl}
 * @since 1.0
 */
splReusable.libs.SapSplMapToolbar.prototype.addFeedlistControl = function ( ) {

	var that = this;
	var fnCollapseFeedControl = function ( sMode ) {
		that.oSearchHorizontalLayout.getSearchFieldInstance ( ).fnExpandCollapseSearchField ( "Collapse" );
		that.oSearchHorizontalLayout.getExpandedSearchListCloseButton ( ).firePress ( );
		if ( sMode === "Expand" ) {
			that.oFeedListControl.getContent ( )[1].removeStyleClass ( "liveFeedHidden" );
		} else {
			that.oFeedListControl.getContent ( )[1].addStyleClass ( "liveFeedHidden" );
		}
	};
	var fnEventHandler = function ( oEvent ) {

		var that = this, i, oFeedList;

		oFeedList = that.oFeedList;

		that.oNav.back ( );

		/* CSNFIX : 0120031469 792714 2014 */
		$ ( ".contextBarParentDiv" ).remove ( );

		var oSourceButton = oEvent.getSource ( );
		that.oPressedFilterButton = oSourceButton;
		var oSourceButtonParent = oEvent.getSource ( ).getParent ( );
		var sClickedFilter = oSourceButton.getBindingContext ( ).getProperty ( "name" );

		if ( oSourceButton.hasStyleClass ( "addHighlight" ) ) {
			that.BlockerLayout.addStyleClass ( "sapSplFeedBlockerHide" );
			fnCollapseFeedControl ( "Collapse" );
			for ( i = 0 ; i < oSourceButtonParent.getItems ( ).length ; i++ ) {
				oSourceButtonParent.getItems ( )[i].removeStyleClass ( "addHighlight" );
			}
			that.oFeedList.setShowNoData ( false );
			oSourceButton.removeStyleClass ( "addHighlight" );
		} else {
			that.BlockerLayout.removeStyleClass ( "sapSplFeedBlockerHide" );
			fnCollapseFeedControl ( "Expand" );
			that.oFeedList.setShowNoData ( false );
			for ( i = 0 ; i < oSourceButtonParent.getItems ( ).length ; i++ ) {
				oSourceButtonParent.getItems ( )[i].removeStyleClass ( "addHighlight" );
			}
			oSourceButton.addStyleClass ( "addHighlight" );

			if ( sClickedFilter === "All" ) {
				that.oFeedListFilterLabel.setText ( oSapSplUtils.getBundle ( ).getText ( "ALL_MESSAGES" ) );
				that.oFeedList.setNoDataText ( oSapSplUtils.getBundle ( ).getText ( "NO_MESSAGES_TEXT" ) );
			} else if ( sClickedFilter === "Bupa" ) {
				that.oFeedListFilterLabel.setText ( oSapSplUtils.getBundle ( ).getText ( "BUSINESS_PARTNER_MESSAGES" ) ); /*
																															 * CSNFIX
																															 * 1311840
																															 * 2014
																															 */
				that.oFeedList.setNoDataText ( oSapSplUtils.getBundle ( ).getText ( "NO_BUSINESS_PARTNER_MESSAGES_TEXT" ) );
			} else if ( sClickedFilter === "HPA" ) {
				that.oFeedListFilterLabel.setText ( oSapSplUtils.getBundle ( ).getText ( "PORT_MESSAGES" ) );
				that.oFeedList.setNoDataText ( oSapSplUtils.getBundle ( ).getText ( "NO_PORT_MESSAGES_TEXT" ) );
			} else if ( sClickedFilter === "Truck" ) {
				that.oFeedListFilterLabel.setText ( oSapSplUtils.getBundle ( ).getText ( "DRIVER_MESSAGES" ) );
				that.oFeedList.setNoDataText ( oSapSplUtils.getBundle ( ).getText ( "NO_DRIVER_MESSAGES_TEXT" ) );
			} else if ( sClickedFilter === "Orders" ) {
				that.oFeedListFilterLabel.setText ( oSapSplUtils.getBundle ( ).getText ( "ORDER_MESSAGES" ) );
				that.oFeedList.setNoDataText ( oSapSplUtils.getBundle ( ).getText ( "NO_ORDER_MESSAGES_TEXT" ) );
			} else if ( sClickedFilter === "Traffic" ) {
				that.oFeedListFilterLabel.setText ( oSapSplUtils.getBundle ( ).getText ( "TRAFFIC_MESSAGES" ) );
				that.oFeedList.setNoDataText ( oSapSplUtils.getBundle ( ).getText ( "NO_TRAFFIC_MESSAGES_TEXT" ) );
			} else if ( sClickedFilter === "Sent" ) {
				that.oFeedListFilterLabel.setText ( oSapSplUtils.getBundle ( ).getText ( "SENT_MESSAGES" ) );
				that.oFeedList.setNoDataText ( oSapSplUtils.getBundle ( ).getText ( "NO_SENT_MESSAGES_TEXT" ) );
			}

			window.setTimeout ( function ( ) {
				that.oFeedList.setShowNoData ( false );

				if ( sClickedFilter === "All" ) {
					that.oFeedList.unbindAggregation ( "items" );
					that.oFeedList.bindItems ( {
						path : "/MyFeed",
						template : that.getListItemInstance ( ),
						sorter : new sap.ui.model.Sorter ( "ReportedTime", true ),
						filters : []
					} );
				} else if ( sClickedFilter === "Bupa" ) {
					/* CSNFIX : 0000774941 2014 */
					var aFilter = [new sap.ui.model.Filter ( "MessageType", sap.ui.model.FilterOperator.EQ, "BM" ), new sap.ui.model.Filter ( "MessageType", sap.ui.model.FilterOperator.EQ, "BI" ),
							new sap.ui.model.Filter ( "MessageType", sap.ui.model.FilterOperator.EQ, "TC" ), new sap.ui.model.Filter ( "MessageType", sap.ui.model.FilterOperator.EQ, "CR" ),
							new sap.ui.model.Filter ( "MessageType", sap.ui.model.FilterOperator.EQ, "AG" ), new sap.ui.model.Filter ( "MessageType", sap.ui.model.FilterOperator.EQ, "RG" ),
							new sap.ui.model.Filter ( "isNotification", sap.ui.model.FilterOperator.EQ, "1" )];

					that.oFeedList.unbindAggregation ( "items" );
					that.oFeedList.bindItems ( {
						path : "/MyFeed",
						template : that.getListItemInstance ( ),
						sorter : new sap.ui.model.Sorter ( "ReportedTime", true ),
						filters : new sap.ui.model.Filter ( aFilter )
					} );
				} else if ( sClickedFilter === "HPA" ) {
					that.oFeedList.unbindAggregation ( "items" );
					that.oFeedList.bindItems ( {
						path : "/MyFeed",
						template : that.getListItemInstance ( ),
						sorter : new sap.ui.model.Sorter ( "ReportedTime", true ),
						filters : [new sap.ui.model.Filter ( "MessageType", sap.ui.model.FilterOperator.EQ, "I" )]
					} );
				} else if ( sClickedFilter === "Truck" ) {
					that.oFeedList.unbindAggregation ( "items" );
					that.oFeedList.bindItems ( {
						path : "/MyFeed",
						template : that.getListItemInstance ( ),
						sorter : new sap.ui.model.Sorter ( "ReportedTime", true ),
						filters : [new sap.ui.model.Filter ( "MessageType", sap.ui.model.FilterOperator.EQ, "DM" )]
					} );
				} else if ( sClickedFilter === "Orders" ) {
					that.oFeedList.unbindAggregation ( "items" );
					that.oFeedList.bindItems ( {
						path : "/MyFeed",
						template : that.getListItemInstance ( ),
						sorter : new sap.ui.model.Sorter ( "ReportedTime", true ),
						filters : [new sap.ui.model.Filter ( "MessageType", sap.ui.model.FilterOperator.EQ, "E" )]
					} );
				} else if ( sClickedFilter === "Traffic" ) {
					that.oFeedList.unbindAggregation ( "items" );
					that.oFeedList.bindItems ( {
						path : "/MyFeed",
						template : that.getListItemInstance ( ),
						sorter : new sap.ui.model.Sorter ( "ReportedTime", true ),
						filters : [new sap.ui.model.Filter ( "MessageType", sap.ui.model.FilterOperator.EQ, "TM" )]
					} );
				} else if ( sClickedFilter === "Sent" ) {
					that.oFeedList.unbindAggregation ( "items" );
					that.oFeedList.bindItems ( {
						path : "/SentMessage",
						template : that.getListItemInstanceForSentItems ( ),
						sorter : new sap.ui.model.Sorter ( "ReportedTime", true )
					} );
				}

			}, 0 );
		}
	};

	/* CSNFIX 0120061532 1306408 2014 */
	/* CSNFIX 0120031469 0000690621 2014 - changed the tooltip of "ALL" */
	var data = {
		allowFeedListSelection : splReusable.libs.SapSplModelFormatters.sapSplGetVisibilityBasedOnSubscriptionModel ( sap.ui.getCore ( ).getModel ( "sapSplAppConfigDataModel" ).getData ( )["isFeedContextEnabled"] ),
		showCollapseButton : true,
		feedControlEventHandler : fnEventHandler,
		collapseFeedHandler : fnCollapseFeedControl,
		parentControllerInstance : this.parentControllerInstance,
		sMessageEntity : "/MyFeed",
		refreshMode : "Auto",
		refreshInterval : SapSplEnums.LiveFeedPollingTime,
		feedFilters : [{
			name : "All",
			icon : "All",
			visible : true,
			tooltip : oSapSplUtils.getBundle ( ).getText ( "ALL_FILTER_TOOLTIP" )
		}, {
			name : "HPA",
			icon : "sap-icon://bussiness-suite/icon-traffic-lights",
			visible : splReusable.libs.SapSplModelFormatters.sapSplGetVisibilityBasedOnSubscriptionModel ( sap.ui.getCore ( ).getModel ( "sapSplAppConfigDataModel" ).getData ( )["FeedIncidentMessage"] ),
			tooltip : oSapSplUtils.getBundle ( ).getText ( "PORT_MESSAGES" )
		}, {
			name : "Traffic",
			icon : "sap-icon://bussiness-suite/icon-traffic-cone",
			visible : splReusable.libs.SapSplModelFormatters.sapSplGetVisibilityBasedOnSubscriptionModel ( sap.ui.getCore ( ).getModel ( "sapSplAppConfigDataModel" ).getData ( )["FeedTrafficMessage"] ),
			tooltip : oSapSplUtils.getBundle ( ).getText ( "TRAFFIC_MESSAGES" )
		}, {
			name : "Truck",
			icon : "sap-icon://bussiness-suite/icon-truck-driver",
			visible : splReusable.libs.SapSplModelFormatters.sapSplGetVisibilityBasedOnSubscriptionModel ( sap.ui.getCore ( ).getModel ( "sapSplAppConfigDataModel" ).getData ( )["FeedDriverMessage"] ),
			tooltip : oSapSplUtils.getBundle ( ).getText ( "DRIVER_MESSAGES" )
		}, {
			name : "Orders",
			icon : "sap-icon://bussiness-suite/icon-container-loading",
			visible : splReusable.libs.SapSplModelFormatters.sapSplGetVisibilityBasedOnSubscriptionModel ( sap.ui.getCore ( ).getModel ( "sapSplAppConfigDataModel" ).getData ( )["FeedTourMessage"] ),
			tooltip : oSapSplUtils.getBundle ( ).getText ( "ORDER_MESSAGES" )
		}, {
			name : "Bupa",
			icon : "sap-icon://collaborate",
			visible : splReusable.libs.SapSplModelFormatters.sapSplGetVisibilityBasedOnSubscriptionModel ( sap.ui.getCore ( ).getModel ( "sapSplAppConfigDataModel" ).getData ( )["FeedPartnerMessage"] ),
			tooltip : oSapSplUtils.getBundle ( ).getText ( "BUSINESS_PARTNER_MESSAGES" )
		}, {
			name : "Sent",
			icon : "sap-icon://display-more",
			visible : true,
			tooltip : oSapSplUtils.getBundle ( ).getText ( "SENT_MESSAGES" )
		}, {
			name : "Filter",
			icon : "sap-icon://wrench",
			visible : true,
			tooltip : oSapSplUtils.getBundle ( ).getText ( "MESSAGE_PREFERENCES" )
		}]
	};
	if ( this.oBarContentLayout.getContent ( ).length <= 2 ) {
		this.oFeedListControl = new splReusable.libs.SapSplLiveFeedControl ( data );
		this.oBarContentLayout.insertContent ( this.oFeedListControl, 2 );
	}
};

/**
 * This function enables or disables the toolbar based on the mode passed
 * @param bMode
 * @returns void
 * @since 1.0
 * @example this.setEnabled( false );
 */
splReusable.libs.SapSplMapToolbar.prototype.setEnabled = function ( bMode ) {
	if ( bMode ) {
		/* CSNFIX : 0120031469 642913 2014 */
		this.oSearchHorizontalLayout.setEnabled ( true );
		this.oMapButton.setEnabled ( true );
	} else {
		this.oSearchHorizontalLayout.setEnabled ( false );
		this.oMapButton.setEnabled ( false );
	}
};

splReusable.libs.SapSplMapToolbar.prototype.refreshMap = function ( sFlag ) {
	this.oSapSplVBMapFilter.refreshMap ( sFlag );
};

/**
 * Sets a call back function for the map filter
 * @param fnCallback
 * @returns void
 * @since 1.0
 * @example this.setMapFilterCallback( false );
 */
splReusable.libs.SapSplMapToolbar.prototype.setMapFilterCallback = function ( fnCallback ) {
	this.oSapSplVBMapFilter.setCallback ( fnCallback );
};

splReusable.libs.SapSplMapToolbar.prototype.firePressOnMapFilter = function ( sType ) {
	var aMapFilterModelData = this.oSapSplMapFilter.getModel ( ).getData ( ).results;
	var iIndex = null;
	for ( var i = 0 ; i < aMapFilterModelData.length ; i++ ) {
		if ( aMapFilterModelData[i]["Value"] === sType ) {
			iIndex = i;
			break;
		}
	}

	if ( this.oSapSplMapFilter.getContent ( )[0].getItems ( )[iIndex] ) {
		var oSelectionButton = this.oSapSplMapFilter.getContent ( )[0].getItems ( )[iIndex].getCells ( )[0].getContentLeft ( )[0];
		if ( oSelectionButton.hasStyleClass ( "opacityLow" ) ) {
			oSelectionButton.firePress ( );
		}
	}
};
