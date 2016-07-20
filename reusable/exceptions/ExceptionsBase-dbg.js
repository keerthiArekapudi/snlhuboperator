/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("splReusable.exceptions.ExceptionsBase");

/**
 *
 * @description Base class for Exception handling
 * @constructor
 * @param
 * {object} oExceptionsObject The exceptions base object
 * {string} oExceptionsObject.message The message to display for exception
 * {string} oExceptionsObject.source The source of the exception
 * {object} options Optional parameters
 * {string} oExceptionsObject.options.severity: Severity of the error
 * @returns {splReusable.exceptions.ExceptionsBase}
 *
 * @version 1.0
 */
splReusable.exceptions.ExceptionsBase = function(oExceptionObject) {
    this.sMessage = null;
    this.sSource = null;
    this.oOptions = null;
    if (oExceptionObject && oExceptionObject !== null) {
        this.sMessage = oExceptionObject[0]["message"] || "Default message";
        this.sSource = oExceptionObject[0]["source"];
        this.oOptions = oExceptionObject[0]["options"]["severity"];
    }
};

/*Overload the base exception class with Error object*/
splReusable.exceptions.ExceptionsBase.prototype = jQuery.sap.newObject(Error());
