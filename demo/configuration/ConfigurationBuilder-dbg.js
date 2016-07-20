/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("splDemoConfiguration.ConfigurationBuilder");


var oSapSplDemoConfigurationBuilder = (function(w, $, d, undefined){
	var oConfigObject = {};
	$.ajax({
		url:"./configuration/appConfig.json",
		type:"GET",
		dataType:"json",
		success:function(oResult, textStatus, xhr){
			oConfigObject = oResult;
		},
		error:function(xhr, textStatus, errorThrown){

		}
	});


	return {
		getConfiguration : function (sConfig) {
			if (oConfigObject.hasOwnProperty(sConfig)) {
				return oConfigObject[sConfig];
			} else {
				return null;
			}
		}
	}
}(window, jQuery, document));