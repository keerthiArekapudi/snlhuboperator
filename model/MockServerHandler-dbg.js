/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare ( "splMockModel.MockServerHandler" );
jQuery.sap.require ( "sap.ui.core.util.MockServer" );

var splMockServerHandler = (function ( ) {

	var _bIsMockMode = (jQuery.sap.getUriParameters ( ).get ( "spl-mock-mode" ) === "true");
	var oAppMockServer, oUtilsMockServer, oConfigMockServer, oEnumsMockServer;

	var getIsMockMode = function ( ) {
		return _bIsMockMode;
	};

	function getServiceUrl ( sScope ) {
		splMockServerHandler[sScope] = oSapSplUtils.getServiceMetadata ( sScope, true );
	}

	function stopServer ( ) {
		oAppMockServer.stop ( );
		oUtilsMockServer.stop ( );
		oEnumsMockServer.stop ( );
		oConfigMockServer.stop ( );
	}

	return {
		isMockMode : function ( ) {
			getIsMockMode ( );
		},
		serviceUrl : getServiceUrl,
		startServer : function ( ) {
			oAppMockServer = new sap.ui.core.util.MockServer ( {
				rootUri : oSapSplUtils.getFQServiceUrl ( "/sap/spl/xs/app/services/appl.xsodata" ) + "/"
			} );
			oAppMockServer.simulate ( "model/app/metadata.xml", "model/app/" );
			oAppMockServer.start ( );

			oUtilsMockServer = new sap.ui.core.util.MockServer ( {
				rootUri : oSapSplUtils.getFQServiceUrl ( "/sap/spl/xs/utils/services/utils.xsodata" ) + "/"
			} );
			oUtilsMockServer.simulate ( "model/utils/metadata.xml", {
				sMockdataBaseUrl : "model/utils/",
				bGenerateMissingMockData : true
			} );
			oUtilsMockServer.start ( );

// oEnumsMockServer = new sap.ui.core.util.MockServer ( {
// rootUri : splMockServerHandler.serviceUrl ( "enums" ) + "/"
// } );
// oEnumsMockServer.simulate ( "model/enums/metadata.xml", {
// sMockdataBaseUrl : "model/enums/",
// bGenerateMissingMockData : true
// } );
// oEnumsMockServer.start ( );

			oConfigMockServer = new sap.ui.core.util.MockServer ( {
				rootUri : oSapSplUtils.getFQServiceUrl ( "/sap/spl/xs/config/services/config.xsodata" ) + "/"
			} );
			oConfigMockServer.simulate ( "model/config/metadata.xml", {
				sMockdataBaseUrl : "model/config/",
				bGenerateMissingMockData : true
			} );
			oConfigMockServer.start ( );
		},
		stopServer : stopServer
	};

} ( ));