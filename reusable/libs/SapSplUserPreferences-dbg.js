/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
splReusable.libs.SapSplUserPreferences = function ( ) {
	this.sUserPreference = this.getUserPreference ( );
};

splReusable.libs.SapSplUserPreferences.prototype.getUserPreference = function ( ) {
	if ( this.sUserPreference === undefined ) {
		this.sUserPreference = "sap_bluecrystal";
	}
	return this.sUserPreference;
};

splReusable.libs.SapSplUserPreferences.prototype.setUserPreference = function ( sTheme ) {
	this.sUserPreference = sTheme;
};

splReusable.libs.SapSplUserPreferences.prototype.saveTheme = function ( oSelectedTheme ) {
	// ajax put call to be done here.
	// reload the application

	var payload = {
		Data : [{
			ChangeMode : "U",
			UUID : oSapSplUtils.getLoggedOnUserDetails ( ).profile.UUID,
			ApplicationTheme : oSelectedTheme// selected key
		}],
		inputHasChangeMode : true
	};
	oSapSplAjaxFactory.fireAjaxCall ( {
		url : oSapSplUtils.getFQServiceUrl ( "sap/spl/xs/app/services/personPreferences.xsjs" ),
		method : "PUT",
		async : true,
		data : JSON.stringify ( payload ),
		success : function ( data ) {
			if ( data && data.HttpStatusCode === 200 && data.Error.length == 0 ) {
				oSapSplEventFactory.dispatch ( "reloadApp" );
			}
		},
		error : function ( data ) {
		// show error message

		}
	} );
};

var oSapSplUserPreference = new splReusable.libs.SapSplUserPreferences ( );
