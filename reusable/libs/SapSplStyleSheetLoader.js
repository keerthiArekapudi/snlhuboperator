/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("splReusable.libs.SapSplStyleSheetLoader");
splReusable.libs.SapSplStyleSheetLoader=function(){};
splReusable.libs.SapSplStyleSheetLoader.loadStyle=function(s,e,i,S,f){jQuery.sap.includeStyleSheet((oSapSplUtils.isInHCBMode())?s+"_hcb."+((e&&(e==="css|less"))?e:"css"):s+"."+((e&&e==="css|less")?e:"css"),(i)?i:null,(S)?S:null,(f)?f:null);};
