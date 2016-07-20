/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare ( "splReusable.libs.SapSplStyleSheetLoader" );

/**
 * @namespace splReusable.libs.SapSplStyleSheetLoader
 * @constructor
 * @since 1.0FP03
 */
splReusable.libs.SapSplStyleSheetLoader = function ( ) {

};

/**
 * @static
 * @since 1.0FP03
 * @description Wrapper static method around $.sap.includeStylesheet. Checks for theme parameter and
 * loads _hcb.css or .css accordingly
 * @param {string} - The path from where to load the stylesheet from (including filename), excluding extension
 * @param {string} [sExtension="css"] - css|less
 * @param {string} [sId=null] - Default to null 
 * @param {function} [fnSuccess=null] - Callback for success of stylesheet load
 * @param {function} [fnFailure=null] - Callback for failure of stylesheet load
 * @returns void
 * @example
 * splReusable.libs.SapSplStyleSheetLoader.loadStyle("/sap/spl/ui/resources/styles/SapCreateNewTour",success,failure);
 * 
 */
splReusable.libs.SapSplStyleSheetLoader.loadStyle = function ( sStyleSheetPath, sExtension, sId, fnSuccess, fnFailure ) {
	jQuery.sap.includeStyleSheet ( (oSapSplUtils.isInHCBMode ( )) ? sStyleSheetPath + "_hcb." + ((sExtension && (sExtension === "css|less")) ? sExtension : "css") : sStyleSheetPath + "." +
			((sExtension && sExtension === "css|less") ? sExtension : "css"), (sId) ? sId : null, (fnSuccess) ? fnSuccess : null, (fnFailure) ? fnFailure : null );
};