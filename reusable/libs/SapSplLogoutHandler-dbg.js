/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare ( "splReusable.libs.SapSplLogoutHandler" );

/**
 * @namespace SAP SPL Logout Handler
 */
splReusable.libs.SapSplLogoutHandler = function ( ) {

};

/**
 * @static
 * @since 1.0
 * @description To handle logout from application session
 */
splReusable.libs.SapSplLogoutHandler.doLogout = function ( onSuccess, onError, onComplete ) {

	var oLogoutUrl = oSapSplUtils.getServiceMetadata ( "sessionLogout", true ),

	sAction = "POST",

	sCSRFToken = oSapSplUtils.getCSRFToken ( );

	/* Incident Fix for 1570454559 */
	oSapSplAjaxFactory.fireAjaxCall ( {

		url : oLogoutUrl,

		method : sAction,

		dataType : false,

		success : function ( oResult, textStatus, xhr ) {

			jQuery.sap.log.info ( "SAP SCL Session Termination Logout Handler", "Session termination successful", "SAPSCL" );

			if ( onSuccess && onSuccess !== null ) {
				onSuccess ( oResult, textStatus, xhr );
			}

		},

		error : function ( xhr, textStatus, errorThrown ) {

			jQuery.sap.log.error ( "SAP SCL Session Termination Logout Handler", "Session termination failed", "SAPSCL" );

			if ( onError && onError !== null ) {
				onError ( xhr, textStatus, errorThrown );
			}

		},

		complete : function ( xhr, textStatus ) {

			jQuery.sap.log.info ( "SAP SCL Session Termination", "Session termination completed with status " + (textStatus === "success") ? 0 : (textStatus === "error") ? 1 : 2, "SAPSCL" );

			if ( onComplete && onComplete !== null ) {
				onComplete ( xhr, textStatus );
			}

		}

	} );
};
