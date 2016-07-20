/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */

splReusable.libs.SapSplUserPreferences=function(){this.sUserPreference=this.getUserPreference();};
splReusable.libs.SapSplUserPreferences.prototype.getUserPreference=function(){if(this.sUserPreference===undefined){this.sUserPreference="sap_bluecrystal";}return this.sUserPreference;};
splReusable.libs.SapSplUserPreferences.prototype.setUserPreference=function(t){this.sUserPreference=t;};
splReusable.libs.SapSplUserPreferences.prototype.saveTheme=function(s){var p={Data:[{ChangeMode:"U",UUID:oSapSplUtils.getLoggedOnUserDetails().profile.UUID,ApplicationTheme:s}],inputHasChangeMode:true};oSapSplAjaxFactory.fireAjaxCall({url:oSapSplUtils.getFQServiceUrl("sap/spl/xs/app/services/personPreferences.xsjs"),method:"PUT",async:true,data:JSON.stringify(p),success:function(d){if(d&&d.HttpStatusCode===200&&d.Error.length==0){oSapSplEventFactory.dispatch("reloadApp");}},error:function(d){}});};
var oSapSplUserPreference=new splReusable.libs.SapSplUserPreferences();
