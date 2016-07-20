/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
/**
 * Anonymous function that loads Startup.js after two seconds.
 * In these two seconds, the splash screen will be shown.
 */
(function () {
    window.setTimeout(function () {
        jQuery.sap.includeScript("./startup/Startup.js");
    }, 500);
}());
