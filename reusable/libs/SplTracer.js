/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("splReusable.libs.SplTracer");
splReusable.libs.SplTracer=function(){};
splReusable.libs.SplTracer.trace=function(l,s){if(jQuery.sap.getUriParameters().get("spl-trace")==="on"){var L=null;switch(l){case 0:L="Entering into "+s+" at "+new Date().toLocaleString();break;case 1:L="Exiting from "+s+" at "+new Date().toLocaleString();break;default:L="";break;}jQuery.sap.log.debug(" SPL Trace Message",L,"splReusable.libs.SplTracer.trace");}};
