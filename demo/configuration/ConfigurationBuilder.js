/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("splDemoConfiguration.ConfigurationBuilder");var oSapSplDemoConfigurationBuilder=(function(w,$,d,u){var c={};$.ajax({url:"./configuration/appConfig.json",type:"GET",dataType:"json",success:function(r,t,x){c=r;},error:function(x,t,e){}});return{getConfiguration:function(C){if(c.hasOwnProperty(C)){return c[C];}else{return null;}}}}(window,jQuery,document));
