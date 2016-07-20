/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("splReusable.events.StopPollingEventListener");(function(w,d,s,S,l,u){d.addEventListener("stopPolling",function(e){jQuery.sap.log.info("SAP SCL Polling Event",e.detail,"SAPSCL");var E=e.detail;E["chatBoxInstance"].stopPolling();E["liveFeedInstance"].stopPolling();});}(window,document,oSapSplUtils,SapSplEnums,location));
