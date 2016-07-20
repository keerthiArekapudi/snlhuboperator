/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
$.sap.declare ( "splReusable.Utils" );
/**
 * @constructor
 * @description Utils library to contain some reusable libs
 * @since 1.0
 * @namespace splReusable.Utils
 */
/* jslint white:false */
splReusable.Utils = function ( ) {
	this.aUUID = [];
	this.oSapSplUUIDModel = null;
	this.sIncludePsp = null;
	this.deviceId = null;
	this.oSapSplCore = sap.ui.getCore ( );
	this.oSplL10NBundle = jQuery.sap.resources ( {
		url : "./resources/l10n/label.properties",
		locale : sap.ui.getCore ( ).getConfiguration ( ).getLanguage ( )
	} );
	var that = this;
	this.oSplQueryParametersMap = {};

	this.oSapSplMessageBundleFactory = {
		resourceBundleObject : null,

		getResourceInstance : function ( sPackageName ) {
			if ( that.oSapSplMessageBundleFactory.resourceBundleObject === null ) {
				that.oSapSplMessageBundleFactory.resourceBundleObject = {};
				that.oSapSplMessageBundleFactory.resourceBundleObject[sPackageName] = $.sap.resources ( {
					url : sPackageName,
					locale : sap.ui.getCore ( ).getConfiguration ( ).getLanguage ( )
				} );
			} else {

				if ( !that.oSapSplMessageBundleFactory.resourceBundleObject.hasOwnProperty ( sPackageName ) ) {
					that.oSapSplMessageBundleFactory.resourceBundleObject[sPackageName] = $.sap.resources ( {
						url : sPackageName,
						locale : sap.ui.getCore ( ).getConfiguration ( ).getLanguage ( )
					} );
				}
			}

			return that.oSapSplMessageBundleFactory.resourceBundleObject[sPackageName];
		}
	};

	this.isPageDirty = false;

	this.errorMessageMapper = {
		errorMessages : [{
			iName : "Organization.Name",
			eName : this.getBundle ( ).getText ( "ORGANIZATION_NAME_FIELD" )
		}, {
			iName : "CommunicationInfo.EmailAddress",
			eName : this.getBundle ( ).getText ( "EMAIL" )
		}, {
			iName : "CommunicationInfo.Phone",
			eName : this.getBundle ( ).getText ( "PHONE" )
		}, {
			iName : "CommunicationInfo.Fax",
			eName : this.getBundle ( ).getText ( "FAX" )
		}, {
			iName : "PersonName.Surname",
			eName : this.getBundle ( ).getText ( "PERSON_SURNAME_FIELD" )
		}, {
			iName : "PersonName.GivenName",
			eName : this.getBundle ( ).getText ( "PERSON_GIVENNAME_FIELD" )
		}, {
			iName : "Role",
			eName : this.getBundle ( ).getText ( "ROLE" )
		}]
	};

};

/**
 * @description Returns the bundle instance. Use this to avoid getting a bundle everywhere in the code,
 * accessible through global accessor
 * @returns Localization bundle
 * @public
 * @function
 * @since 1.0
 * @example
 * var oBtn = new sap.ui.commons.Button({});
 * oBtn.setProperty("text",oSapSplUtils.getBundle().getText("HELLO_WORLD_BUTTON"));
 * This would return the value of HELLO_WORLD_BUTTON from the label_xx.properties
 * where xx would be the user locale.
 */
/* jslint white:false */

splReusable.Utils.prototype.getBundle = function ( ) { /*
														 * HOTFIX No more
														 * request to
														 * hdbtextbundle since
														 * it is already loaded
														 */
	return this.oSplL10NBundle;
};

/**
 * @description To get server side business messages
 * @returns {Object} Localization Bundle
 * @since 1.0
 */
splReusable.Utils.prototype.getBusinessMessageBundle = function ( ) {
	return this.oSplL10NBundle;
};

/**
 * @description GETTER to get the fully qualified serviceUrl based on serviceUrl passed
 * This is for the local eclipse based testing scenario. Simple Proxy servelet configured.
 * If application is running from Tomcat, service url returned will be
 * If run from HANA it would be
 * http://<hanapath>/sap/spl/xs/appl/services/appl.xsodata
 * This would take care of the cross domain issue
 * @param serviceUrl Service URL for the remote service to be accessed.
 * @returns serviceUrl : fully qualified ServiceURL , string format.
 * @since 1.0
 * @function
 * @example
 * var sServiceUrl = "/sap/spl/xs/appl/services/appl.xsodata"
 * sServiceUrl = oSapSplUtils.getFQServiceUrl(sServiceUrl)
 *
 */
splReusable.Utils.prototype.getFQServiceUrl = function ( serviceUrl ) {
	try {

		if ( !window.location.origin ) {
			window.location.origin = window["location"]["protocol"] + "//" + window["location"]["hostname"] + (window.location.port ? ":" + window.location.port : "");
		}

		if ( serviceUrl && serviceUrl !== null && typeof (serviceUrl) === "string" ) {
			var pattern = new RegExp ( "localhost", "gi" );
			var result = pattern.exec ( window.location.hostname );
			if ( result !== null && window.location.hostname === result[0] ) {
				if ( serviceUrl.charAt ( 0 ) !== "/" ) {
					serviceUrl = "proxy/" + serviceUrl;
				} else {
					serviceUrl = "proxy" + serviceUrl;
				}
			} else {
				if ( serviceUrl.charAt ( 0 ) !== "/" ) {
					serviceUrl = window["location"]["origin"] + "/" + serviceUrl;
				} else {
					serviceUrl = window["location"]["origin"] + serviceUrl;
				}
			}
		} else {
			throw new splReusable.exceptions.MissingParametersException ( {
				source : this.toString ( ),
				message : "serviceUrl argument missing",
				options : {
					severity : "Information"
				}
			} );
		}
	} catch (e) {
		if ( e.constructor === splReusable.exceptions.MissingParametersException ) {
			jQuery.sap.log.error ( e.message, "Failure of getFQServiceUrl function call", "Utils.js" );
		}
	}
	return serviceUrl;
};

/**
 * @description Setter for setting all service urls (odata)
 * @param oServiceUrls
 * @since 1.0
 * @example
 * oSapSplUtils.setServiceMetadata(oServiceUrls);
 */
splReusable.Utils.prototype.setServiceMetadata = function ( oServiceUrls ) {
	this.oServiceUrls = oServiceUrls;
};

/**
 * @description Get a service URL based on the scope.
 * @param {string} sScope
 * @param {boolean} bGetUrl
 * @returns fully qualified serviceUrl if bGetUrl is true otherwise the service object
 * @since 1.0
 * @example
 * oSapSplUtils.getODataServiceUrl('appl', true);
 * It gives you the URl '/sap/spl/xs/appl/services/appl.xsodata/'
 * oSapSplUtils.getODataServiceUrl('appl');
 * It gives you the URl object
 */
splReusable.Utils.prototype.getServiceMetadata = function ( sScope, bGetUrl ) {
	try {
		var _returnValue = null;
		if ( sScope !== undefined && sScope !== null ) {
			if ( sScope.constructor === String ) {
				for ( var i = 0 ; i < this.oServiceUrls.services.length ; i++ ) {
					if ( bGetUrl ) {
						if ( this.oServiceUrls.services[i].id === sScope ) {
							_returnValue = this.getFQServiceUrl ( this.oServiceUrls.services[i]["value"] );
						}
					} else {
						if ( this.oServiceUrls.services[i].id === sScope ) {
							_returnValue = this.oServiceUrls.services[i];
						}
					}
				}
				return _returnValue;
			} else {
				throw new TypeError ( );
			}
		} else {
			throw new ReferenceError ( );
		}
	} catch (e) {
		if ( e.constructor === Error ) {
			jQuery.sap.log.error ( e.message, "Failure of getServiceMetadata function call", "Utils.js" );
		}
	}
};

/**
 * @description Returns if the emailID is in proper format or not.
 * It accepts an object as its parameter. It matches the sent email ID with the sent pattern.
 * If the pattern is not present, it matches the sent email ID with a default pattern.
 * @param oMailObject {Object} The object model to pass to verify e-mail pattern sanctity
 * @param oMailObject.email {String} The e-mail string to check
 * @param oMailObject.pattern {String} The regexp pattern to use for mail sanctity validation
 * @returns {Boolean} True if the email id matches with the pattern, false otherwise.
 * @since 1.0
 * @example
 * oSapSplUtils.validateEmailId({email:'<email to check>', pattern:<your regex pattern to use> default to base pattern});
 */
splReusable.Utils.prototype.validateEmailID = function ( oEmail ) {
	if ( typeof (oEmail) === "object" ) {
		var emailVerificationPattern = "";
		if ( oEmail["pattern"] !== undefined ) {
			emailVerificationPattern = oEmail["pattern"];
		} else {
			emailVerificationPattern = /^([a-zA-Z0-9]+[a-zA-Z0-9._%-]*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,4})$/;
		}

		var bool = emailVerificationPattern.test ( oEmail["email"] );
		return bool;
	} else {
		throw new TypeError ( );
	}
};

/**
 * A GETTER to return a navigation URL to be passed to datajs read method.
 * The actual navigation URL would contain the entire application url + entity name (for navigation)
 * The getter would only return the last part of the entity which can be used in the model read method
 * @param sServiceUrl
 * @returns resolvedEntityForNavigation
 * @since 1.0
 *
 * @requires splReusable.Utils.getODataServiceUrl
 */
/* jslint white:false */
splReusable.Utils.prototype.getResolvedEntityNameForNavigation = function ( sServiceUrl, scope ) {
	var resolvedEntityForNavigation = null;

	try {
		if ( arguments === undefined || arguments.length < 0 ) {
			throw new splReusable.exceptions.MissingParametersException ( {
				message : SapSplEnums.missing_parameter,
				source : this.toString ( ),
				options : {
					severity : SapSplEnums.fatal
				}
			} );
		} else {
			if ( sServiceUrl ) {
				if ( scope === undefined || scope === null ) {
					scope = "appl";
				}
				resolvedEntityForNavigation = sServiceUrl.split ( this.getODataServiceUrl ( scope ) )[1];
			}
		}
	} catch (e) {
		if ( e.constructor === splReusable.exceptions.MissingParametersException ) {
			jQuery.sap.log.error ( e.message, "Failure of getResolvedEntityNameForNavigation function call", "Utils.js" );
		}
	}
	return "/" + resolvedEntityForNavigation; // Append a / since the Base
	// Entity should have a / for
	// DataJS Read method
};

/**
 * @description API to get a single UUID from the array of UUID's fetched from Backend.
 * If the length of the array becomes less than 10, a new read is done to fetch more UUID's.
 * @returns last UUID in the array aUUID.
 * @since 1.0
 * @example
 * oSapSplUtils.getUUID();
 * It gives you a random UUID.
 */
splReusable.Utils.prototype.getUUID = function ( ) {

	var _specialCharactersRegExp = new RegExp ( "[+/?%#&]+" ), uuidToUse = null, that = this;

	/*
	 * First check for null Array. If true, make synchronous request for UUID.
	 * Else, make asynchronous request
	 */

	/*HOTFIX CSN Fix 1580114240*/
	if ( this.aUUID.length > 10 ) {
		
		uuidToUse = this.aUUID.pop ( ).UUID;
		
	} else if ( this.aUUID.length <= 0 ) {

		this.fetchUUIDs ( false, function ( ) {
			uuidToUse = that.aUUID.pop ( ).UUID;
		} );

	} else if ( this.aUUID.length <= 10 ) {

		this.fetchUUIDs ( true, function ( ) {
			uuidToUse = that.aUUID.pop ( ).UUID;
		} );

	}

	return uuidToUse;

};

/**
 * @description Success handler of UUID fetch.
 * This automatically updates the array of UUID's on the client side.
 * @since 1.0
 */

function maintainArrayOfUUID ( data, textStatus, XMLHttpRequest ) {
	var result = data.d;
	$.sap.log.info ( "SAP SCL Welcome Utils", "XMLHTTPRequest status" + XMLHttpRequest.status.toString ( ), "SAPSCL" );
	$.sap.log.info ( "SAP SCL Welcome Utils", "TextStatus " + textStatus.toString ( ), "SAPSCL" );
	for ( var UUIDCount = 1 ; UUIDCount < result.results.length ; UUIDCount++ ) {
		this.aUUID.push ( result.results[UUIDCount] );
	}
}

/**
 * @description Fetches random UUIS's from backend.
 * It maintains a array on the client side with the random UUID's.
 * @since 1.0
 * @example
 * oSapSplUtils.fetchUUIDs();
 * It fetches UUID's from backend.
 */
splReusable.Utils.prototype.fetchUUIDs = function ( bAsync, callback ) {
	/*
	 * Using jQuery.ajax to fetch the CSRF-Token from HANA along with UUID's. *
	 * Using ajax as I was not able to set headers to the ODataModel, inorder to
	 * fetch CSRF-Token.
	 */
	var that = this;
	jQuery.ajax ( {
		url : that.getFQServiceUrl ( "/sap/spl/xs/selfRegistration/data.xsodata/" ) + "UUID?$format=json",
		async : bAsync,// || true,
		json : true,
		beforeSend : function ( request ) {
			request.setRequestHeader ( "X-CSRF-Token", "Fetch" );
		},
		success : function ( data, textStatus, XMLHttpRequest ) {
			var result = data.d;
			$.sap.log.info ( "SAP SCL Welcome Utils", "XMLHTTPRequest status" + XMLHttpRequest.status.toString ( ), "SAPSCL" );
			$.sap.log.info ( "SAP SCL Welcome Utils", "TextStatus " + textStatus.toString ( ), "SAPSCL" );
			for ( var UUIDCount = 1 ; UUIDCount < result.results.length ; UUIDCount++ ) {
				that.aUUID.push ( result.results[UUIDCount] );
			}
			callback ( );
		}
	} );

};

/**
 * @description Setter for the CSRF token - to be used for POST.
 * @param
 * SapSplCSRFToken - CSRF token fetched from HANA.
 * @returns void
 * @since 1.0
 * @example
 * oSapSplUtils.setCSRFToken(SapSplCSRFToken)
 */
splReusable.Utils.prototype.setCSRFToken = function ( SapSplCSRFToken ) {
	try {
		if ( !this.SapSplCSRFToken ) {
			this.SapSplCSRFToken = SapSplCSRFToken;
		} else {
			throw new Error ( );
		}
	} catch (e) {
		if ( e.constructor === Error ) {
			jQuery.sap.log.error ( "Failure of setCSRFToken function call", "Perhaps due to missing CSRF setting. POST actions might fail", "splReusable.Utils.setCSRFToken()" );
		}
	}
};

/**
 * @description Getter for the CSRF token - to be used for POST.
 * @param void
 * @returns CSRF-Token.
 * @since 1.0
 * @example
 * oSapSplUtils.getCSRFToken()
 */
splReusable.Utils.prototype.getCSRFToken = function ( ) {
	try {
		if ( this.SapSplCSRFToken ) {
			return this.SapSplCSRFToken;
		} else {
			throw new Error ( );
		}
	} catch (e) {
		if ( e.constructor === Error ) {
			jQuery.sap.log.error ( e.message, "Failure of getCSRFToken function call", "Utils.js" );
		}
	}
};

/**
 * @description Error handler of UUID fetch.
 * @since 1.0
 */
splReusable.Utils.prototype.failureOfUUIDFetch = function ( ) { /*
																 * handle
																 * service
																 * failure!!!
																 */};

/**
 * @description Checks if the object passed is an array at all
 * @since 1.0
 * @public
 * @param {array} aArrayToCheck The array to check for sanity
 * @returns {Boolean}
 * @example
 * var aArray = [1,2,3];
 * oSapSplUtils.IsValidArray(aArray); //Returns true;
 * var aArray = {"null"};
 * oSapSplUtils.IsValidArray (aArray) ; //Returns false;
 */
splReusable.Utils.prototype.IsValidArray = function ( aArrayToCheck ) {
	if ( arguments && arguments.length < 0 ) {
		throw new splReusable.exceptions.MissingParametersException ( {
			message : "Invalid arguments passed",
			source : this.toString ( ),
			options : {
				severity : SapSplEnums.fatal
			}
		} );
	} else {
		if ( aArrayToCheck.hasOwnProperty ( "length" ) && typeof aArrayToCheck.length === "number" ) {
			return true;
		} else {
			return false;
		}
	}
};

/**
 * @description A sophisticated interface which loads the bundles as provided by the service Package
 * entry in Message object and loads through jQuery.sap.resources. Can use getText() interface on the
 * bundle
 * @since 1.0
 * @this splReusable.libs.Utils
 * @param errorPayload
 * @returns  {Object} The error object collection as a complete entity,
 * The second object is the localized string message escaped with \n for UI readability
 */
splReusable.Utils.prototype.getErrorMessagesfromErrorPayload = function ( errorPayload ) {
	var that = this;
	var _tempErrorObjectsCollection = {
		"errors" : []
	}, _tempSubstitutionValues = null, _tempErrorObject = null, oReturnedErrorObject = {
		completeErrorObject : null,
		ufErrorObject : null,
		errorWarningString : null,
		messageTitle : {
			title : null,
			valueState : null
		}
	};

	if ( arguments === undefined || arguments.length <= 0 ) {

		throw new splReusable.exceptions.MissingParametersException ( {

			message : "Missing arguments. Invalid usage",

			source : this.toString ( ),

			options : {

				severity : SapSplEnums.fatal

			}
		} );
	}

	/**
	 * @private
	 * @param sPackage
	 * @returns sPackage {String} Package with . replaced with /
	 * @description: Since the Package contains ., this interface will replace the . with /
	 * and return a FQ path to the text bundle to load
	 */

	function __replaceDotWithSlash__ ( sPackage ) {

		return sPackage.split ( "." ).join ( "/" ) + "/";

	}

	/**
	 * @private
	 * @param errorObject
	 * @returns emptyArray {Array} An empty message array
	 * @description A consolidated method to join the UFMessage field with \n
	 * @returns emptyArray {Array}  An empty array
	 */

	function __prepareFinalUFError__ ( errorObject ) {
		var _emptyArray = [], hasLocation = false;

		for ( var iCount = 0, jCount = errorObject.errors.length ; iCount < jCount ; iCount++ ) {

			jQuery.each ( errorObject.errors[iCount]["UFLocation"], function ( sKey, sValue ) {
				_emptyArray.push ( sValue + " : " + errorObject.errors[iCount]["Message"]["UFMessage"] );
				hasLocation = true;
			} );
			if ( hasLocation ) {
				hasLocation = false;
				continue;
			}

			_emptyArray.push ( errorObject.errors[iCount]["Message"]["UFMessage"] );

		}

		return _emptyArray.join ( "\n" );
	}

	/**
	 * @private
	 * @param aServerLocationString
	 * @since 1.0
	 * @description utility to map field name from backend with localized name from front end
	 */

	function __getLocationNameFromMapping__ ( aServerLocationString ) {

		for ( var iCount = 0, jCount = that.errorMessageMapper.errorMessages.length ; iCount < jCount ; iCount++ ) {

			for ( var _iCount = 0, _jCount = aServerLocationString.length ; _iCount < _jCount ; _iCount++ ) {

				if ( aServerLocationString[_iCount] === that.errorMessageMapper.errorMessages[iCount]["iName"] ) {

					_tempErrorObject["UFLocation"][that.errorMessageMapper.errorMessages[iCount]["iName"]] = that.errorMessageMapper.errorMessages[iCount]["eName"];

					break;

				}

			}

		}

	}

	/**
	 * @description Internal. Returns {0} errors and {1} warnings identified.
	 * @param _tempErrorObjectsCollection
	 * @returns {String} Returns {0} errors and {1} warnings identified. (Localized) | Malformed error object
	 * @since 1.0
	 * @private
	 */

	function __getSeverityString__ ( _tempErrorObjectsCollection ) {

		var _errors = 0, _warnings = 0, errorString = "";

		if ( that.IsValidArray ( _tempErrorObjectsCollection.errors ) ) {

			for ( var iCount = 0, jCount = _tempErrorObjectsCollection.errors.length ; iCount < jCount ; iCount++ ) {

				if ( _tempErrorObjectsCollection.errors[iCount]["Severity"] === "E" ) {

					_errors++;

				} else if ( _tempErrorObjectsCollection.errors[iCount]["Severity"] === "W" ) {

					_warnings++;

				}

			}

			// errorCount = _errors;
			// warningCount = _warnings;
			errorString = that.getBundle ( ).getText ( "IDENTIFIED_ERRORS_AND_WARNINGS", [_errors, _warnings] );

		} else {

			errorString = that.getBundle ( ).getText ( "MALFORMED_ERROR_OBJECT" );

		}

		return {
			value : errorString,
			count : _errors + _warnings,
			errorCount : _errors,
			warningCount : _warnings
		};

	}

	/**
	 * @private
	 * @since 1.0
	 * @description Final error object creator
	 *
	 */

	function constructFinalErrorObject ( oErrorObjectsCollection ) {
		/*
		 * If ErrorCount > 0 and warning count = 0, show error specific message
		 * in the error dialog If ErorCount = 0 and warning count > 0, show
		 * warning specific message in the error dialog If ErrorCount > 0 and
		 * WarningCount > 0, show attention specific message in the error dialog
		 * else return empty object
		 */

		var oErrorWarningCountObject = __getSeverityString__ ( oErrorObjectsCollection );
		var errorCount = oErrorWarningCountObject["errorCount"];
		var warningCount = oErrorWarningCountObject["warningCount"];

		oReturnedErrorObject["completeErrorObject"] = oErrorObjectsCollection;
		oReturnedErrorObject["ufErrorObject"] = __prepareFinalUFError__ ( oErrorObjectsCollection );

		if ( errorCount > 0 && warningCount === 0 ) { /*
														 * Create object with
														 * error messages
														 */
			oReturnedErrorObject["errorWarningString"] = that.getBundle ( ).getText ( "SPL_ERROR_MESSAGE" );
			oReturnedErrorObject["messageTitle"]["title"] = that.getBundle ( ).getText ( "SPL_ERROR_DIALOG_HEADER" );
			oReturnedErrorObject["messageTitle"]["valueState"] = "Error";
		} else if ( errorCount === 0 && warningCount > 0 ) { /*
																 * Create object
																 * with warning
																 * messges
																 */
			oReturnedErrorObject["errorWarningString"] = that.getBundle ( ).getText ( "SPL_WARNING_MESSAGE" );
			oReturnedErrorObject["messageTitle"]["title"] = that.getBundle ( ).getText ( "SPL_WARNING_DIALOG_HEADER" );
			oReturnedErrorObject["messageTitle"]["valueState"] = sap.ui.core.ValueState.Warning;
		} else if ( errorCount > 0 && warningCount > 0 ) { /*
															 * Create Attention
															 * specific messages
															 */
			oReturnedErrorObject["errorWarningString"] = that.getBundle ( ).getText ( "SPL_ERROR_WARNING_MESSAGE" );
			oReturnedErrorObject["messageTitle"]["title"] = that.getBundle ( ).getText ( "SPL_ERROR_WARNING_DIALOG_HEADER" );
			oReturnedErrorObject["messageTitle"]["valueState"] = "None";
		} else {
			return oReturnedErrorObject;
		}

		return oReturnedErrorObject;

	}

	/*
	 * The core interface logic begins here. Comments are added in every step
	 */
	if ( errorPayload.hasOwnProperty ( "Error" ) ) {

		if ( errorPayload.Error.length > 0 ) {

			var errorPayloadError = errorPayload.Error;

			for ( var iErrorCount = 0, jCount = errorPayloadError.length ; iErrorCount < jCount ; iErrorCount++ ) {

				/*
				 * A sample message object (skeleton). Use for reference.
				 * Replicate changes (if any)
				 */
				_tempErrorObject = {

					"Severity" : null,

					"ObjectType" : null,

					"Entity" : null,

					"Keys" : {

						"UUID" : null

					},

					"Message" : {

						"Package" : null,

						"Bundle" : null,

						"ID" : null

					},

					"Location" : [],
					"UFLocation" : {},

					"TextSubstitutionValues" : null,

					"Text" : null

				};

				_tempErrorObject.Severity = errorPayloadError[iErrorCount]["Severity"];

				_tempErrorObject.ObjectType = errorPayloadError[iErrorCount]["ObjectType"];

				_tempErrorObject.Entity = errorPayloadError[iErrorCount]["Entity"];

				_tempErrorObject.Location = errorPayloadError[iErrorCount]["Location"];

				_tempErrorObject["Keys"]["UUID"] = errorPayloadError[iErrorCount]["Keys"]["UUID"];

				_tempErrorObject["Message"]["Package"] = errorPayloadError[iErrorCount]["Message"]["Package"];

				_tempErrorObject["Message"]["Bundle"] = errorPayloadError[iErrorCount]["Message"]["Bundle"];

				_tempErrorObject["Message"]["ID"] = errorPayloadError[iErrorCount]["Message"]["ID"];

				_tempErrorObject["TextSubstitutionValues"] = errorPayloadError[iErrorCount]["TextSubstitutionValues"];

				_tempErrorObject["Text"] = errorPayloadError[iErrorCount]["Text"];

				/*
				 * HOTFIX TextSubstitutionValues should be passed only if it has
				 * array of values in it. Else, make it as Null To avoid "null"
				 * appearing within placeholders in the localized message object
				 */

				if ( (errorPayloadError[iErrorCount]["TextSubstitutionValues"] && errorPayloadError[iErrorCount]["TextSubstitutionValues"] !== null) && errorPayloadError[iErrorCount]["TextSubstitutionValues"].hasOwnProperty ( "length" ) &&
						errorPayloadError[iErrorCount]["TextSubstitutionValues"].length > 0 ) {

					_tempSubstitutionValues = errorPayloadError[iErrorCount]["TextSubstitutionValues"];

				}

				/*
				 * Check if multiple requests of 200 are served for the same
				 * request. If so, create hash map for each bundle and use it if
				 * it repeats to avoid round trips
				 */
				_tempErrorObject["Message"]["UFMessage"] = this.oSapSplMessageBundleFactory.getResourceInstance (
						this.getFQServiceUrl ( __replaceDotWithSlash__ ( _tempErrorObject["Message"]["Package"] ) + _tempErrorObject["Message"]["Bundle"] + ".hdbtextbundle" ) ).getText ( _tempErrorObject["Message"]["ID"], _tempSubstitutionValues );

				__getLocationNameFromMapping__ ( _tempErrorObject["Location"] );

				/* The final step. Push all the mesages into a master object. */
				_tempErrorObjectsCollection.errors.push ( _tempErrorObject );

			}

		} else {

			// Invalid error object. Quit.
			jQuery.sap.log.error ( "Error message payload", "Invalid error object format", "splReusable.libs.Utils.getErrorMessageFromErrorPayload" );

		}

	} else {

		jQuery.sap.log.error ( "Error message paylaod", "Missing Error/Message field on payload", "splReusable.libs.Utils.getErrorMessagesfromErrorPayload" );

	}

	jQuery.sap.log.info ( "Error message object", "Message object prepared with detailed information", "splReusable.libs.Utils" );

	return constructFinalErrorObject ( _tempErrorObjectsCollection );

};

/**
 * @description Method to check if object has any key or not
 * @param oObject object instance
 * @returns {Boolean} Returns false if object has any key else true
 * @example
 * oSapSplUtils.isObjectEmpty({name:"a"}); will return false as it has a key.
 */
splReusable.Utils.prototype.isObjectEmpty = function ( oObject ) {

	if ( arguments === undefined || arguments === null || arguments.length <= 0 ) {
		throw new splReusable.exceptions.MissingParametersException ( {
			message : "Invalid usage",
			source : this.toString ( ),
			options : {
				severity : SapSplEnums.fatal
			}
		} );
	}

	if ( oObject.constructor !== Object ) {
		throw new TypeError ( );
	}

	try {
		if ( oObject.constructor === Object ) {
			for ( var key in oObject ) {
				if ( oObject.hasOwnProperty ( key ) ) {
					return false;
				}
			}
			return true;
		} else {
			throw new Error ( );
		}
	} catch (oEvent) {
		if ( oEvent.constructor === Error ) {
			jQuery.sap.log.error ( oEvent.message, "oObject is not an object - isObjectEmpty", "Utils.js" );
		}
	}
};

/**
 * @description shows the error message in a Fiori MessageBox
 * @param {object} oMessageBoxSettings parameters (message & details) required for error message.
 * @param oMessageBoxSettings.message {String} Error message text to show
 * @param oMessageBoxSettings.details {String} Detailed message (when clicked on 'Show Details' link)
 * @returns void
 * @example
 * splReusable.Utils.prototype.showMessage({message:"404",details:"Http Bad Request"});
 */
splReusable.Utils.prototype.showMessage = function ( oMessageBoxSettings ) {
	if ( arguments === undefined || arguments.length <= 0 ) {
		throw new splReusable.exceptions.MissingParametersException ( {
			message : "Missing arguments. showMessage",
			source : this.toString ( ),
			options : {
				severity : SapSplEnums.fatal
			}
		} );
	}
	try {
		if ( oMessageBoxSettings.constructor === Object ) {
			sap.ca.ui.message.showMessageBox ( {
				type : sap.ca.ui.message.Type.ERROR,
				message : oMessageBoxSettings.message,
				details : oMessageBoxSettings.details
			} );
		} else {
			throw new TypeError ( );
		}
	} catch (oEvent) {
		if ( oEvent.constructor === Error ) {
			jQuery.sap.log.error ( oEvent.message, "oMessageBoxSettings is not an object - oMessageBoxSettings", "Utils.js" );
		}
	}

};

/**
 * @description Getter to get Core instance. Avoid need for sap.ui.getCore() all over the codebase
 * @since 1.0
 * @this splReusable.Utils
 * @public
 * @returns {Object} sap.ui.core.Core;
 */
splReusable.Utils.prototype.getCoreInstance = function ( ) {
	return this.oSapSplCore;
};

/**
 * @description Checks if application is launched in iFrame. If so, error is thrown
 * and application load stops
 * @returns {Boolean}
 * @since 1.0
 * @this splReusable.Utils
 */
splReusable.Utils.prototype.isInIframe = function ( isTrue ) {
	if ( window.self && window.top ) {
		isTrue ( window.self !== window.top );

	} else {
		throw new Error ( "Window object not supported by browser" );
	}
};

/**
 * @description to handle the includePsp scenario during self registration
 * @returns {String}
 */
splReusable.Utils.prototype.getIncludePsp = function ( ) {
	return this.sIncludePsp;
};
/**
 * @description to handle the deviceId scenario during self registration
 * @returns {String}
 */
splReusable.Utils.prototype.getDeviceID = function ( ) {
	return this.deviceId;
};

/**
 * @description to handle the Registration number scenario during self registration
 * @returns {String}
 */
splReusable.Utils.prototype.getRegistrationNumber = function ( ) {
	return this.registrationNumber;
};

/**
 * @description Setter for getIncludePsp
 */
splReusable.Utils.prototype.setIncludePsp = function ( ) {
	this.sIncludePsp = "x";
};
/**
 * @description Setter for getDeviceId
 */
splReusable.Utils.prototype.setDeviceID = function ( sValue ) {
	this.deviceId = sValue;
};
/**
 * @description Setter for getRegistrationNumber
 */
splReusable.Utils.prototype.setRegistrationNumber = function ( sValue ) {
	this.registrationNumber = sValue;
};

/* Create global accessor */
var oSapSplUtils = new splReusable.Utils ( );
oSapSplUtils.getUUID ( );