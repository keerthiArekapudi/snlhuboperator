/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
/**
 * Exception handler to handle Invalid array types
 */

jQuery.sap.declare("splReusable.exceptions.InvalidArrayException");


/**
 @description Extension of Base Exception handler
 * @see {splReusable.exceptions.ExceptionsBase}
 * @constructor
 * @param 
 * {object} oExceptionsObject The exceptions base object
 * {string} oExceptionsObject.message The message to display for exception
 * {string} oExceptionsObject.source The source of the exception
 * {object} options Optional parameters
 * {string} oExceptionsObject.options.severity: Severity of the error
 * @returns {splReusable.exceptions.InvalidArrayException}
 * @since 1.0 
 * @requires splReusable.exceptions.ExceptionsBase
 * @example
 * var oExceptionObject = {message:'Sample message', source :this|source, options:{severity:'fatal'}};
 * throw new splReusable.exceptions.InvalidArrayException(oExcetionsObject);
 * 
 */
splReusable.exceptions.InvalidArrayException = function() {
    splReusable.exceptions.ExceptionsBase.call(this, arguments);
};

splReusable.exceptions.InvalidArrayException.prototype = jQuery.sap.newObject(splReusable.exceptions.ExceptionsBase);
