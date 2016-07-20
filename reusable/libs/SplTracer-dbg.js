/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("splReusable.libs.SplTracer");

splReusable.libs.SplTracer = function () {

};

/**
 * @param iLifecyle {Integer} 0 - Entering, 1 - Exiting
 * @returns void
 * @since 1.0
 * @static
 */
splReusable.libs.SplTracer.trace = function (iLifecycle, sSource) {

    if (jQuery.sap.getUriParameters().get("spl-trace") === "on") {

        var sLifecycleMessage = null;

        switch (iLifecycle) {

        case 0:
            sLifecycleMessage = "Entering into " + sSource + " at " + new Date().toLocaleString();
            break;

        case 1:
            sLifecycleMessage = "Exiting from " + sSource + " at " + new Date().toLocaleString();
            break;
        
        default:
        	sLifecycleMessage = "";
        	break;
        	
        }

        
        jQuery.sap.log.debug(" SPL Trace Message", sLifecycleMessage, "splReusable.libs.SplTracer.trace");

    }

};
