/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare ( "splReusable.events.ReloadAppEventListener" );

(function ( window, document, oSapSplUtils, SapSplEnums, location, undefined ) {
	document.addEventListener ( "reloadApp", function ( ) {
		oSapSplUtils.sLO4S = "app";
		location.reload ( );
	} );
} ( window, document, oSapSplUtils, SapSplEnums, location ));