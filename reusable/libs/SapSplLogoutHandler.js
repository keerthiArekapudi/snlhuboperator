/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("splReusable.libs.SapSplLogoutHandler");
splReusable.libs.SapSplLogoutHandler=function(){};
splReusable.libs.SapSplLogoutHandler.doLogout=function(o,a,b){var l=oSapSplUtils.getServiceMetadata("sessionLogout",true),A="POST",c=oSapSplUtils.getCSRFToken();oSapSplAjaxFactory.fireAjaxCall({url:l,method:A,dataType:false,success:function(r,t,x){jQuery.sap.log.info("SAP SCL Session Termination Logout Handler","Session termination successful","SAPSCL");if(o&&o!==null){o(r,t,x);}},error:function(x,t,e){jQuery.sap.log.error("SAP SCL Session Termination Logout Handler","Session termination failed","SAPSCL");if(a&&a!==null){a(x,t,e);}},complete:function(x,t){jQuery.sap.log.info("SAP SCL Session Termination","Session termination completed with status "+(t==="success")?0:(t==="error")?1:2,"SAPSCL");if(b&&b!==null){b(x,t);}}});};
