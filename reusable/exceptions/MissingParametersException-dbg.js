/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.require("splReusable.exceptions.ExceptionsBase");
jQuery.sap.declare("splReusable.exceptions.MissingParametersException");

/**
 *
 * @description Extension of Base Exception handler
 * @see {splReusable.exceptions.ExceptionsBase}
 * @constructor
 * @param
 * {object} oExceptionsObject The exceptions base object
 * {string} oExceptionsObject.message The message to display for exception
 * {string} oExceptionsObject.source The source of the exception
 * {object} options Optional parameters
 * {string} oExceptionsObject.options.severity: Severity of the error
 * @returns {splReusable.exceptions.MissingParametersException}
 * @since 1.0
 * @requires splReusable.exceptions.ExceptionsBase
 * @example
 * var oExceptionObject = {message:'Sample message', source :this|source, options:{severity:'fatal'}};
 * throw new splReusable.exceptions.MissingParametersException(oExcetionsObject);
 *
 **/
splReusable.exceptions.MissingParametersException = function() {
    splReusable.exceptions.ExceptionsBase.call(this, arguments);
};

/*Overload the custom exception class with Base Exception*/
splReusable.exceptions.MissingParametersException.prototype = jQuery.sap.newObject(splReusable.exceptions.ExceptionsBase());
