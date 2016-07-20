/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("splReusable.listeners.SessionTimeoutEventListener");(function(w,d,l,$,u){d.addEventListener("sessiontimeout",function(){sap.m.MessageBox.show(oSapSplUtils.getBundle().getText("MESSAGE_FOR_SESSION_TIMEOUT_REFRESH"),sap.m.MessageBox.Icon.WARNING,oSapSplUtils.getBundle().getText("SPL_ERROR_WARNING_DIALOG_HEADER"),[sap.m.MessageBox.Action.OK],function(s){if(s==="OK"){oSapSplEventFactory.dispatch("reloadApp");}else{return;}});});}(window,document,location,jQuery));
