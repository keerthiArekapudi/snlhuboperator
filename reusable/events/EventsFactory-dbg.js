/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
/*global oSapSplEventDefiners*/
jQuery.sap.declare("splReusable.events.EventsFactory");

oSapSplEventFactory = (function(window,$,oSapSplUtils, undefined){

    var eventFactory = jQuery.sap.sjax({url:"./reusable/events/eventRepository.json", dataType:"json", type:"GET"});

    window["oSapSplEventDefiners"] = {};

    function CustomEvent ( event, params ) {
        var evt = document.createEvent( "CustomEvent" );
        evt.initCustomEvent( event, params.bubbles || null, params.cancelable || null, params.detail || null );
        return evt;
    }
    
    if (sap.ui.Device.browser.msie) {
        $.sap.log.debug("SPL Events Factory", "Browser detected as IE. CustomEvent adjusted", "SAPSCL");

          CustomEvent.prototype = window.Event.prototype;

          window.CustomEvent = CustomEvent;
    }
    
    function __registerEvent__(sEventName, oEventData) {
        if (!oSapSplEventDefiners[sEventName] || oSapSplEventDefiners[sEventName] === null) {
            oSapSplEventDefiners[sEventName] = new CustomEvent(sEventName, {detail:oEventData});
        }
    }
    
    function __dispatchEvent__(sEventName, oEventData) {
        if (eventFactory["data"][sEventName]) {
            jQuery.sap.require(eventFactory["data"][sEventName]["event"]);
            jQuery.sap.require(eventFactory["data"][sEventName]["listener"]);
            __registerEvent__(sEventName, oEventData);
            document.dispatchEvent(oSapSplEventDefiners[sEventName], oEventData);
        }
    }

    return {
        dispatch : function (sEventName, oEventData) {
            __dispatchEvent__(sEventName, oEventData);
        }
    };

}(window,jQuery, oSapSplUtils));