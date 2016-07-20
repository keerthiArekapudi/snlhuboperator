/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare ( "splReusable.events.StopPollingEventListener" );

(function ( window, document, oSapSplUtils, SapSplEnums, location, undefined ) {
	document.addEventListener ( "stopPolling", function ( oEventData ) {
		jQuery.sap.log.info ("SAP SCL Polling Event", oEventData.detail, "SAPSCL" );
		var oEventDetail = oEventData.detail;
		oEventDetail["chatBoxInstance"].stopPolling ( );
		oEventDetail["liveFeedInstance"].stopPolling ( );
	} );
} ( window, document, oSapSplUtils, SapSplEnums, location ));