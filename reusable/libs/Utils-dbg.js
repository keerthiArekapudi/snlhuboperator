/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare ( "splReusable.libs.Utils" );
jQuery.sap.require ( "splReusable.exceptions.MissingParametersException" );
jQuery.sap.require ( "splReusable.exceptions.InvalidArrayException" );
jQuery.sap.require ( "splReusable.libs.SapSplEnums" );
jQuery.sap.require ( "jquery.sap.storage" );

/**
 * @constructor
 * @description Utils library to contain some reusable libs
 * @since 1.0
 * @namespace splReusable.libs.Utils
 */
/* jslint white:false */

splReusable.libs.Utils = function ( ) {
	this.aUUID = [];
	this.oSapSplUUIDModel = null;
	this.oSplitAppBaseOne = null;
	this.oSplitAppBaseTwo = null;
	this.oSplitAppBaseVehicle = null;
	this.aListOfUnAssignedDevices = [];
	this.oSapSplMapFilterControl = null;
	this.oSapSplLoggedInUsersCompanyDetails = null;
	this.oSapSplInitializerDetails = null;
	this.oSapSplLoggedOnUserDetails = null;
	this.aAllowedTiles = [];
	this.aIntervalIds = [];
	this.oAppToLoad = {};
	this.oSapSplCore = sap.ui.getCore ( );
	this.bStartupError = false;
	this.sLO4S = "nav";
	this.startDate = null;
	this.sSystemType = null;
	this.bIsInHCBMode = false;
	this.sReferrer = null;

	/* Help Type. Default to html. Used in get/setHelpType */
	this.sHelpType = "html";

	/* Used in get/setIsNavToAppComplete */
	this.isNavToAppComplete = false;

	/* used in get/setCurrentAppInfo */
	this.oCurrentAppInfo = {};

	this.oSplL10NBundle = jQuery.sap.resources ( {
		url : "./resources/l10n/label.properties",
		locale : sap.ui.getCore ( ).getConfiguration ( ).getLanguage ( )
	} );

	if ( !sap.ui.getCore ( ).getModel ( "splI18NModel" ) ) {
		sap.ui.getCore ( ).setModel ( new sap.ui.model.resource.ResourceModel ( {
			bundleUrl : "./resources/l10n/label.properties",
			bundleLocale : sap.ui.getCore ( ).getConfiguration ( ).getLocale ( ).getLanguage ( ),
			async : true
		} ), "splI18NModel" );
	}

	if ( !sap.ui.getCore ( ).getModel ( "myCompanyDetails" ) ) {
		sap.ui.getCore ( ).setModel ( new sap.ui.model.json.JSONModel ( ), "myCompanyDetails" );
	}

	this.oSplQueryParametersMap = {};

	this.oSapSplMessageBundleFactory = {
		resourceBundleObject : null,

		getResourceInstance : function ( sPackageName ) {
			if ( this.oSapSplMessageBundleFactory.resourceBundleObject === null ) {
				this.oSapSplMessageBundleFactory.resourceBundleObject = {};
				this.oSapSplMessageBundleFactory.resourceBundleObject[sPackageName] = $.sap.resources ( {
					url : sPackageName,
					locale : sap.ui.getCore ( ).getConfiguration ( ).getLanguage ( )
				} );
			} else {

				if ( !this.oSapSplMessageBundleFactory.resourceBundleObject.hasOwnProperty ( sPackageName ) ) {
					this.oSapSplMessageBundleFactory.resourceBundleObject[sPackageName] = $.sap.resources ( {
						url : sPackageName,
						locale : sap.ui.getCore ( ).getConfiguration ( ).getLanguage ( )
					} );
				}
			}

			return this.oSapSplMessageBundleFactory.resourceBundleObject[sPackageName];
		}.bind ( this )
	};

	this.isPageDirty = false;

	this.errorMessageMapper = {
		errorMessages : [{
			iName : "Organization.Name",
			eName : this.getBundle ( ).getText ( "ORGANIZATION_NAME_FIELD" )
		}, {
			iName : "CommunicationInfo.EmailAddress",
			eName : this.getBundle ( ).getText ( "EMAIL_ADDRESS_FIELD" )
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
			iName : "RegistrationNumber",
			eName : this.getBundle ( ).getText ( "VEHICLE_REGISTRATION_NUMBER" )
		}, {
			iName : "LocationSpecName",
			eName : this.getBundle ( ).getText ( "LOCATION_NAME_NOT_EMPTY" )
		}, {
			iName : "IncidentCode",
			eName : this.getBundle ( ).getText ( "INCIDENTS_NAME" )
		}, {
			iName : "LongText",
			eName : this.getBundle ( ).getText ( "INCIDENTS_MESSAGE" )
		}, {
			iName : "EventCode",
			eName : this.getBundle ( ).getText ( "INCIDENTS_CATEGORY" )
		}, {
			iName : "Priority",
			eName : this.getBundle ( ).getText ( "INCIDENTS_PRIORITY" )
		}, {
			iName : "PolygonSpec",
			eName : this.getBundle ( ).getText ( "INCIDENTS_LOCATION" )
		}, {
			iName : "UniqueID",
			eName : this.getBundle ( ).getText ( "DEVICE_ID" )
		}, {
			iName : "Category",
			eName : this.getBundle ( ).getText ( "INCIDENTS_CATEGORY" )
		}, {
			iName : "Priority",
			eName : this.getBundle ( ).getText ( "INCIDENTS_PRIORITY" )
		}, {
			iName : "Name",
			eName : this.getBundle ( ).getText ( "INCIDENTS_NAME" )
		}, {
			iName : "Address.Name1",
			eName : this.getBundle ( ).getText ( "NEW_LOCATION_ADDRESS_FIELD_TITLE", 1 )
		}, {
			iName : "Address.Town",
			eName : this.getBundle ( ).getText ( "NEW_LOCATION_CITY_LABEL" )
		}, {
			iName : "BuildingID",
			eName : this.getBundle ( ).getText ( "NEW_LOCATION_ADDRESS_FIELD_TITLE", ["1"] )
		}, {
			iName : "ObjectUUID",
			eName : this.getBundle ( ).getText ( "OBJECT_LOCATION_CODE" )
		}, {
			iName : "StreetName",
			eName : this.getBundle ( ).getText ( "NEW_LOCATION_ADDRESS_FIELD_TITLE", ["2"] )
		}, {
			iName : "CityName",
			eName : this.getBundle ( ).getText ( "NEW_LOCATION_CITY_LABEL" )
		}, {
			iName : "StreetPostalCode",
			eName : this.getBundle ( ).getText ( "NEW_LOCATION_ZIPCODE_LABEL" )
		}, {
			iName : "RegionName",
			eName : this.getBundle ( ).getText ( "NEW_LOCATION_REGION_LABEL" )
		}, {
			iName : "CountryName",
			eName : this.getBundle ( ).getText ( "NEW_LOCATION_COUNRTY_LABEL" )
		}, {
			iName : "Capacity",
			eName : this.getBundle ( ).getText ( "CAPACITY_PARKING_SPACE_LABEL" )
		}, {
			iName : "LocationUUID",
			eName : this.getBundle ( ).getText ( "STOP_DETAILS" )
		}]
	/*
	 * Incident : 1482016228 - Added address fields to the mapping object, as it
	 * is made mandatory
	 */
	};

	this.helpLinkMapper = {
		helpLinks : [{
			appId : "myBusinessPartners",
			iLink : "",
			eLink : ""
		}, {
			appId : "myUsers",
			iLink : "",
			eLink : ""
		}, {
			appId : "manageTours",
			iLink : "",
			eLink : ""
		}, {
			appId : "incidences",
			iLink : "",
			eLink : ""
		}, {
			appId : "vehicles",
			iLink : "",
			eLink : ""
		}, {
			appId : "liveApp",
			iLink : "",
			eLink : ""
		}, {
			appId : "reporting",
			iLink : "",
			eLink : ""
		}]
	};

};

/**
 * @description Setter for the SplitAppBase control - used for navigation of master and detail Apps.
 * @param
 * {object} oBaseContainer instance of SplitApp control.
 * @returns void
 * @since 1.0
 * @example
 * this.setSplitAppBase(oSplitAppBaseVehicle)
 */
splReusable.libs.Utils.prototype.setSplitAppBaseVehicle = function ( oBaseContainer ) {
	try {
		if ( oBaseContainer && typeof oBaseContainer === "object" ) {
			this.oSplitAppBaseVehicle = oBaseContainer.byId ( "SapSplVehicleMasterDetailSplitApp" );
		} else {
			throw new Error ( );
		}
	} catch (e) {
		if ( e.constructor === Error ) {
			jQuery.sap.log.error ( e.message, "Failure of setSplitAppBaseVehicle function call", "Utils.js" );
		}
	}
};

/**
 * @description Getter for the instance of current page in detail App of MyVehicles.
 * @param void
 * @returns {object} current detail page instance of MyVehicles
 * @since 1.0
 * @example
 * this.getCurrentDetailPageVehicle()
 */
splReusable.libs.Utils.prototype.getCurrentDetailPageVehicle = function ( ) {
	try {
		if ( this.oSplitAppBaseVehicle.getCurrentDetailPage ( ) ) {
			return this.oSplitAppBaseVehicle.getCurrentDetailPage ( );
		} else {
			throw new Error ( );
		}
	} catch (e) {
		if ( e.constructor === Error ) {
			jQuery.sap.log.error ( e.message, "Failure of getCurrentDetailPageVehicle function call", "Utils.js" );
		}
	}
};

/**
 * @description Getter for the instance of current page in Master App of MyVehicles.
 * @param void
 * @returns {object} current master page instance of MyVehicles
 * @since 1.0
 * @example
 * this.getCurrentMasterPageVehicle()
 */
splReusable.libs.Utils.prototype.getCurrentMasterPageVehicle = function ( ) {
	try {
		if ( this.oSplitAppBaseVehicle.getCurrentMasterPage ( ) ) {
			return this.oSplitAppBaseVehicle.getCurrentMasterPage ( );
		} else {
			throw new Error ( );
		}
	} catch (e) {
		if ( e.constructor === Error ) {
			jQuery.sap.log.error ( e.message, "Failure of getCurrentMasterPageVehicle function call", "Utils.js" );
		}
	}
};

/**
 * @description Setter for the SplitAppBase control - used for navigation of master and detail Apps.
 * @param
 * {object} oBaseContainer instance of SplitAppBase control.
 * @returns void
 * @since 1.0
 * @example
 * this.setSplitAppBase(oSplitAppBaseOne)
 */
splReusable.libs.Utils.prototype.setSplitAppBaseOne = function ( oBaseContainer ) {
	try {
		if ( oBaseContainer && typeof oBaseContainer === "object" ) {
			this.oSplitAppBaseOne = oBaseContainer.byId ( "SplitAppBase" );
		} else {
			throw new Error ( );
		}
	} catch (e) {
		if ( e.constructor === Error ) {
			jQuery.sap.log.error ( e.message, "Failure of setSplitAppBaseOne function call", "Utils.js" );
		}
	}
};

/**
 * @description Setter for the company details of the logged in user - used for Master page title.
 * @param
 * {object} oCompanyDetails object.
 * @returns void
 * @since 1.0
 * @example
 * this.setCompanyDetails(oCompanyDetails)
 */
splReusable.libs.Utils.prototype.setCompanyDetails = function ( oCompanyDetails ) {
	try {
		if ( oCompanyDetails && typeof oCompanyDetails === "object" ) {
			this.oSapSplLoggedInUsersCompanyDetails = oCompanyDetails;
			if ( sap.ui.getCore ( ).getModel ( "myCompanyDetails" ) ) {
				sap.ui.getCore ( ).getModel ( "myCompanyDetails" ).setData ( oCompanyDetails );
			}
		} else {
			throw new Error ( );
		}
	} catch (e) {
		if ( e.constructor === Error ) {
			jQuery.sap.log.error ( e.message, "Failure of setCompanyDetails function call", "Utils.js" );
		}
	}
};

/**
 * @description Getter for the company details of the logged in user - used for the Master page title.
 * @param void
 * @returns {object} oCompanyDetails company details of the logged in user.
 * @since 1.0
 * @example
 * this.getCompanyDetails()
 */
splReusable.libs.Utils.prototype.getCompanyDetails = function ( ) {
	try {
		if ( this.oSapSplLoggedInUsersCompanyDetails ) {
			return this.oSapSplLoggedInUsersCompanyDetails;
		} else {
			throw new Error ( );
		}
	} catch (e) {
		if ( e.constructor === Error ) {
			jQuery.sap.log.error ( e.message, "Failure of getCompanyDetails function call", "Utils.js" );
		}
	}
};

/**
 * @description Getter for the instance of current page in master App.
 * @param void
 * @returns {object} current master page instance
 * @since 1.0
 * @example
 * this.getCurrentMasterPage()
 */
splReusable.libs.Utils.prototype.getCurrentMasterPage = function ( ) {
	try {
		if ( this.oSplitAppBaseOne.getCurrentMasterPage ( ) ) {
			return this.oSplitAppBaseOne.getCurrentMasterPage ( );
		} else {
			throw new Error ( );
		}
	} catch (e) {
		if ( e.constructor === Error ) {
			jQuery.sap.log.error ( e.message, "Failure of getCurrentMasterPage function call", "Utils.js" );
		}
	}
};

/**
 * @description Getter for the instance of current page in detail App.
 * @param void
 * @returns {object} current detail page instance
 * @since 1.0
 * @example
 * this.getCurrentDetailPage()
 */
splReusable.libs.Utils.prototype.getCurrentDetailPage = function ( ) {
	try {
		if ( this.oSplitAppBaseOne.getCurrentDetailPage ( ) ) {
			return this.oSplitAppBaseOne.getCurrentDetailPage ( );
		} else {
			throw new Error ( );
		}
	} catch (e) {
		if ( e.constructor === Error ) {
			jQuery.sap.log.error ( e.message, "Failure of getCurrentDetailPage function call", "Utils.js" );
		}
	}
};

/**
 * @function
 * @description GETTER to get the parameter value based on key(s) passed
 * @param aParameters Array of Parameters whose values in key:value format should be retrieved
 */
/* jslint white:false */
splReusable.libs.Utils.prototype.getQueryParameterValues = function ( aParameters ) {
	try {
		if ( aParameters && aParameters.length > 0 ) {
			jQuery.sap.log.info ( "Parameters passed. Valid arguement" );
		}
	} catch (e) {
		jQuery.sap.log.error ( e.message, "Failure of getQueryParameterValues function call", "Utils.js" );
	}
};

/**
 * @description Returns the bundle instance. Use this to avoid getting a bundle everywhere in the code,
 * accessible through global accessor
 * @see {@link http://veui5infra.dhcp.wdf.sap.corp:8080/demokit/#docs/api/symbols/sap.ui.core.Configuration.html#getLocale}
 * @returns Localization bundle
 * @public
 * @function
 * @since 1.0
 * @example
 * var oBtn = new sap.ui.commons.Button({});
 * oBtn.setProperty("text",this.getBundle().getText("HELLO_WORLD_BUTTON"));
 * This would return the value of HELLO_WORLD_BUTTON from the label_xx.properties
 * where xx would be the user locale.
 */
/* jslint white:false */

splReusable.libs.Utils.prototype.getBundle = function ( ) { /*
															 * HOTFIX No more
															 * request to
															 * hdbtextbundle
															 * since it is
															 * already loaded
															 */
	return this.oSplL10NBundle;
};

/**
 * @description To get server side business messages
 * @returns {Object} Localization Bundle
 * @since 1.0
 */
splReusable.libs.Utils.prototype.getBusinessMessageBundle = function ( ) {
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
 * sServiceUrl = this.getFQServiceUrl(sServiceUrl)
 *
 */
splReusable.libs.Utils.prototype.getFQServiceUrl = function ( serviceUrl ) {
	var sOriginHostUrl = null;
	try {

		if ( !window.location.origin ) {
			window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : "");
		}

		if ( this.getReferrer ( ).indexOf ( window.location.hostname ) === -1 ) {
			throw new Error ( "Invalid usage.Origin and service host do not match" );
		}

		if ( serviceUrl && serviceUrl !== null && typeof (serviceUrl) === "string" ) {
			var pattern = new RegExp ( "localhost", "gi" );
			var result = pattern.exec ( window.location.hostname ); /*
																	 * Add
																	 * comments.
																	 * Else
																	 * don't add
																	 * empty
																	 * comment
																	 * blocks
																	 */
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
 * this.setServiceMetadata(oServiceUrls);
 */
splReusable.libs.Utils.prototype.setServiceMetadata = function ( oServiceUrls ) {
	this.oServiceUrls = oServiceUrls;
};

/**
 * @description Get a service URL based on the scope.
 * @param {string} sScope
 * @param {boolean} bGetUrl
 * @returns fully qualified serviceUrl if bGetUrl is true otherwise the service object
 * @since 1.0
 * @example
 * this.getODataServiceUrl('appl', true);
 * It gives you the URl '/sap/spl/xs/appl/services/appl.xsodata/'
 * this.getODataServiceUrl('appl');
 * It gives you the URl object
 */
splReusable.libs.Utils.prototype.getServiceMetadata = function ( sScope, bGetUrl ) {
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
 * this.validateEmailId({email:'<email to check>', pattern:<your regex pattern to use> default to base pattern});
 */
splReusable.libs.Utils.prototype.validateEmailID = function ( oEmail ) {
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
 * @requires splReusable.libs.Utils.getODataServiceUrl
 */
/* jslint white:false */
splReusable.libs.Utils.prototype.getResolvedEntityNameForNavigation = function ( sServiceUrl, scope ) {
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
 * this.getUUID();
 * It gives you a random UUID.
 */
splReusable.libs.Utils.prototype.getUUID = function ( ) {

	splReusable.libs.SplTracer.trace ( 0, "getUUID in Utils" );

	var uuidToUse = null;

	/*
	 * First check for null Array. If true, make synchronous request for UUID.
	 * Else, make asynchronous request
	 */
	if ( this.aUUID.length <= 0 ) {

		this.fetchUUIDs ( false );

	} else if ( this.aUUID.length <= 10 ) {

		this.fetchUUIDs ( true );

	}

	for ( var iTemp = 0, jTemp = this.aUUID.length ; iTemp < jTemp ; iTemp++ ) {

		var _tempUUID = this.aUUID.pop ( ).UUID;

		/*
		 * If regexp test fails, continue else, break out, and return the passed
		 * uuid back for use
		 */
		/*
		 * No more regular expression check as UUID finally gets converted to
		 * HEX to OData will not break
		 */

		// Retrieved UUID contains special character, go to the next UUID
		uuidToUse = _tempUUID;

		break;

	}

	splReusable.libs.SplTracer.trace ( 1, "getUUID in Utils" );

	return uuidToUse;
};

/**
 * @description Success handler of UUID fetch.
 * This automatically updates the array of UUID's on the client side.
 * @since 1.0
 */

function maintainArrayOfUUID ( data, textStatus, XMLHttpRequest ) {

	$.sap.log.info ( "SAP SCL Utils", "Text Status: " + textStatus + " XHR: " + XMLHttpRequest, "SAPSCL" );

	var result = data;

	for ( var UUIDCount = 1 ; UUIDCount < result.results.length ; UUIDCount++ ) {
		this.aUUID.push ( result.results[UUIDCount] );
	}
}

/**
 * @description Fetches random UUIS's from backend.
 * It maintains a array on the client side with the random UUID's.
 * @since 1.0
 * @example
 * this.fetchUUIDs();
 * It fetches UUID's from backend.
 */
splReusable.libs.Utils.prototype.fetchUUIDs = function ( bAsync ) {
	/*
	 * Using jQuery.ajax to fetch the CSRF-Token from HANA along with UUID's.
	 * Using ajax as I was not able to set headers to the ODataModel, inorder to
	 * fetch CSRF-Token.
	 */
	var that = this;
	if ( !sap.ui.getCore ( ).getModel ( "sapSplUtilsModel" ) ) {
		sap.ui.getCore ( ).setModel ( new splModels.odata.ODataModel ( {
			url : that.getServiceMetadata ( "utils", true ),
			json : true,
			headers : {
				"Cache-Control" : "max-age=0"
			},
			tokenHandling : true,
			withCredentials : false,
			loadMetadataAsync : true,
			handleTimeOut : true,
			numberOfSecondsBeforeTimeOut : 10000
		} ), "sapSplUtilsModel" );
	}

	sap.ui.getCore ( ).getModel ( "sapSplUtilsModel" ).read ( "/UUID", {
		async : (function ( ) {
			if ( bAsync === undefined ) {
				return true;
			}
			return bAsync;
		} ( )),
		success : function ( oResult ) {
			maintainArrayOfUUID.call ( that, oResult );
// jQuery.proxy(maintainArrayOfUUID, this);
		},
		error : function ( oError ) {
			jQuery.sap.log.error ( "UUID fetch failed: " + oError.toString ( ) );
		}
	} );

};

/**
 * @description Setter for the CSRF token - to be used for POST.
 * @param SapSplCSRFToken - CSRF token fetched from HANA.
 * @returns void
 * @since 1.0
 * @example this.setCSRFToken(SapSplCSRFToken)
 */
splReusable.libs.Utils.prototype.setCSRFToken = function ( SapSplCSRFToken ) {
	try {
		if ( !this.SapSplCSRFToken ) {
			this.SapSplCSRFToken = SapSplCSRFToken;
		} else {
			throw new Error ( );
		}
	} catch (e) {
		if ( e.constructor === Error ) {
			jQuery.sap.log.error ( "Failure of setCSRFToken function call", "Perhaps due to missing CSRF setting. POST actions might fail", "splReusable.libs.Utils.setCSRFToken()" );
		}
	}
};

/**
 * @description Getter for the CSRF token - to be used for POST.
 * @param void
 * @returns CSRF-Token.
 * @since 1.0
 * @example
 * this.getCSRFToken()
 */
splReusable.libs.Utils.prototype.getCSRFToken = function ( ) {
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
splReusable.libs.Utils.prototype.failureOfUUIDFetch = function ( ) { /*
																		 * handle
																		 * service
																		 * failure!!!
																		 */
};

/**
 * @description Setter for the SplitAppBaseBusinessPartners control - used for navigation of master and detail Apps.
 * @param
 * {object} oBaseContainer instance of SplitAppBaseBusinessPartners control.
 * @returns void
 * @since 1.0
 * @example
 * this.setSplitAppBaseTwo(oSplitAppBasetwo)
 */
splReusable.libs.Utils.prototype.setSplitAppBaseTwo = function ( oBaseContainer ) {
	try {
		if ( oBaseContainer && typeof oBaseContainer === "object" ) {
			this.oSplitAppBaseTwo = oBaseContainer.byId ( "SplitAppBaseBusinessPartners" );
		} else {
			throw new Error ( );
		}
	} catch (e) {
		if ( e.constructor === Error ) {
			jQuery.sap.log.error ( e.message, "Failure of setSplitAppBaseTwo function call", "Utils.js" );
		}
	}
};

/**
 * @description Getter for the instance of current page in master App for Business Partner.
 * @param void
 * @returns {object} current master page instance
 * @since 1.0
 * @example
 * this.getCurrentMasterPageBP()
 */
splReusable.libs.Utils.prototype.getCurrentMasterPageBP = function ( ) {
	try {
		if ( this.oSplitAppBaseTwo.getCurrentMasterPage ( ) ) {
			return this.oSplitAppBaseTwo.getCurrentMasterPage ( );
		} else {
			throw new Error ( );
		}
	} catch (e) {
		if ( e.constructor === Error ) {
			jQuery.sap.log.error ( e.message, "Failure of getCurrentMasterPageBP function call", "Utils.js" );
		}
	}
};

/**
 * @description Getter for the instance of current page in detail App for Business Partner.
 * @param void
 * @returns {object} current detail page instance
 * @since 1.0
 * @example
 * this.getCurrentDetailPageBP()
 */
splReusable.libs.Utils.prototype.getCurrentDetailPageBP = function ( ) {
	try {
		if ( this.oSplitAppBaseTwo.getCurrentDetailPage ( ) ) {
			return this.oSplitAppBaseTwo.getCurrentDetailPage ( );
		} else {
			throw new Error ( );
		}
	} catch (e) {
		if ( e.constructor === Error ) {
			jQuery.sap.log.error ( e.message, "Failure of getCurrentDetailPageBP function call", "Utils.js" );
		}
	}
};

/**
 * @description Checks if the object passed is an array at all
 * @since 1.0
 * @public
 * @param {array} aArrayToCheck The array to check for sanity
 * @returns {Boolean}
 * @example
 * var aArray = [1,2,3];
 * this.IsValidArray(aArray); //Returns true;
 * var aArray = {"null"};
 * this.IsValidArray (aArray) ; //Returns false;
 */
splReusable.libs.Utils.prototype.IsValidArray = function ( aArrayToCheck ) {
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
splReusable.libs.Utils.prototype.getErrorMessagesfromErrorPayload = function ( errorPayload ) {

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
		var _emptyArray = [], hasLocation = false, oTempObjectToRemoveRedundantMessages = {};

		for ( var iCount = 0, jCount = errorObject.errors.length ; iCount < jCount ; iCount++ ) {

			jQuery.each ( errorObject.errors[iCount]["UFLocation"], function ( sKey, sValue ) {
				_emptyArray.push ( sValue + " : " + errorObject.errors[iCount]["Message"]["UFMessage"] );
				hasLocation = true;
			} );
			if ( hasLocation ) {
				hasLocation = false;
				continue;
			}

			// if (_emptyArray.length === 0) {
			/*
			 * Incident fix for : 1570336964 - To remove redundant messages from
			 * backend, which does not have a Location
			 */
			if ( oTempObjectToRemoveRedundantMessages[errorObject.errors[iCount]["Message"]["UFMessage"]] !== true ) {
				_emptyArray.push ( errorObject.errors[iCount]["Message"]["UFMessage"] );
				oTempObjectToRemoveRedundantMessages[errorObject.errors[iCount]["Message"]["UFMessage"]] = true;
			}
			// }

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

		for ( var iCount = 0, jCount = this.errorMessageMapper.errorMessages.length ; iCount < jCount ; iCount++ ) {

			for ( var _iCount = 0, _jCount = aServerLocationString.length ; _iCount < _jCount ; _iCount++ ) {

				if ( aServerLocationString[_iCount] === this.errorMessageMapper.errorMessages[iCount]["iName"] ) {

					_tempErrorObject["UFLocation"][this.errorMessageMapper.errorMessages[iCount]["iName"]] = this.errorMessageMapper.errorMessages[iCount]["eName"];

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

		if ( this.IsValidArray ( _tempErrorObjectsCollection.errors ) ) {

			for ( var iCount = 0, jCount = _tempErrorObjectsCollection.errors.length ; iCount < jCount ; iCount++ ) {

				if ( _tempErrorObjectsCollection.errors[iCount]["Severity"] === "E" ) {

					_errors++;

				} else if ( _tempErrorObjectsCollection.errors[iCount]["Severity"] === "W" ) {

					_warnings++;

				}

			}

			// errorCount = _errors;
			// warningCount = _warnings;
			errorString = this.getBundle ( ).getText ( "IDENTIFIED_ERRORS_AND_WARNINGS", [_errors, _warnings] );

		} else {

			errorString = this.getBundle ( ).getText ( "MALFORMED_ERROR_OBJECT" );

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

		var oErrorWarningCountObject = __getSeverityString__.call ( this, oErrorObjectsCollection );
		var errorCount = oErrorWarningCountObject["errorCount"];
		var warningCount = oErrorWarningCountObject["warningCount"];

		oReturnedErrorObject["completeErrorObject"] = oErrorObjectsCollection;
		oReturnedErrorObject["ufErrorObject"] = __prepareFinalUFError__ ( oErrorObjectsCollection );

		if ( errorCount > 0 && warningCount === 0 ) { /*
														 * Create object with
														 * error messages
														 */
			oReturnedErrorObject["errorWarningString"] = this.getBundle ( ).getText ( "SPL_ERROR_MESSAGE" );
			oReturnedErrorObject["messageTitle"]["title"] = this.getBundle ( ).getText ( "SPL_ERROR_DIALOG_HEADER" );
			oReturnedErrorObject["messageTitle"]["valueState"] = "Error";
		} else if ( errorCount === 0 && warningCount > 0 ) { /*
																 * Create object
																 * with warning
																 * messges
																 */
			oReturnedErrorObject["errorWarningString"] = this.getBundle ( ).getText ( "SPL_WARNING_MESSAGE" );
			oReturnedErrorObject["messageTitle"]["title"] = this.getBundle ( ).getText ( "SPL_WARNING_DIALOG_HEADER" );
			oReturnedErrorObject["messageTitle"]["valueState"] = sap.ui.core.ValueState.Warning;
		} else if ( errorCount > 0 && warningCount > 0 ) { /*
															 * Create Attention
															 * specific messages
															 */
			oReturnedErrorObject["errorWarningString"] = this.getBundle ( ).getText ( "SPL_ERROR_WARNING_MESSAGE" );
			oReturnedErrorObject["messageTitle"]["title"] = this.getBundle ( ).getText ( "SPL_ERROR_WARNING_DIALOG_HEADER" );
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

				__getLocationNameFromMapping__.call ( this, _tempErrorObject["Location"] );
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

	return constructFinalErrorObject.call ( this, _tempErrorObjectsCollection );

};

/**
 * @description Method to check if object has any key or not
 * @param oObject object instance
 * @returns {Boolean} Returns false if object has any key else true
 * @example
 * this.isObjectEmpty({name:"a"}); will return false as it has a key.
 */
splReusable.libs.Utils.prototype.isObjectEmpty = function ( oObject ) {

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
 * @description Method to fetch the latest list of unAssigned devices.
 * updates the model "myVehiclesAddVehicleModel" after the success of the ajax call.
 * if the second paramater is an object, the method pushes the object to the fetched set of devices. - FOR EDIT scenario.
 * @param bAsync Boolean to make the ajax call sync or async.
 * @returns void
 * @example
 * this.updateUnAssignedDevices(false); for synchronous call.
 * this.updateUnAssignedDevices(true,{}); for asynchronous call, adds an empty object to the fetched list of unassigned devices.
 */
splReusable.libs.Utils.prototype.updateUnAssignedDevices = function ( bAsync, oObject ) {
	var oModelData = null, aDevicesArray = [], oFirstObject = null, aMobileDevicesArray = [], aOBUDevicesArray = [], sDeviceType = "";
	oModelData = sap.ui.getCore ( ).getModel ( "myVehiclesAddVehicleModel" ).getData ( );

	if ( bAsync === undefined || bAsync.constructor !== Boolean ) {
		bAsync = true;
	}
	if ( sap.ui.getCore ( ).getModel ( "myVehiclesAddVehicleModel" ) ) {
		jQuery.ajax ( {
			url : this.getFQServiceUrl ( "/sap/spl/xs/appl/services/appl.xsodata/" ) + "MyUnAssignedDevices?$format=json",
			// type: "GET",
			async : bAsync,
			json : true,
			success : function ( data ) {
				aDevicesArray = data.d.results;

				for ( var i = 0 ; i < aDevicesArray.length ; i++ ) {
					if ( aDevicesArray[i].DeviceType === "M" ) {
						aMobileDevicesArray.push ( aDevicesArray[i] );
					} else if ( aDevicesArray[i].DeviceType === "O" ) {
						aOBUDevicesArray.push ( aDevicesArray[i] );
					}
				}

				if ( aDevicesArray && aDevicesArray.constructor === Array && oModelData.constructor === Object ) {
					if ( oObject && oObject.constructor === Object ) {
						sDeviceType = oObject["DeviceType"];
						if ( sDeviceType && sDeviceType === "M" ) {
							if ( aMobileDevicesArray.length > 0 ) {
								oFirstObject = aDevicesArray[0];
								aMobileDevicesArray[0] = oObject;
							} else {
								oFirstObject = oObject;
							}
							aMobileDevicesArray[aMobileDevicesArray.length] = oFirstObject;
						} else if ( sDeviceType && sDeviceType === "O" ) {
							if ( aOBUDevicesArray.length > 0 ) {
								oFirstObject = aDevicesArray[0];
								aOBUDevicesArray[0] = oObject;
							} else {
								oFirstObject = oObject;
							}
							aOBUDevicesArray[aOBUDevicesArray.length] = oFirstObject;
						} else {
							if ( aMobileDevicesArray.length > 0 ) {
								oFirstObject = aDevicesArray[0];
								aMobileDevicesArray[0] = oObject;
							} else {
								oFirstObject = oObject;
							}
							aMobileDevicesArray[aMobileDevicesArray.length] = oFirstObject;

						}
					}

					oModelData["devices"] = aDevicesArray;
					oModelData["mobileDevices"] = aMobileDevicesArray;
					oModelData["obuDevices"] = aOBUDevicesArray;

					sap.ui.getCore ( ).getModel ( "myVehiclesAddVehicleModel" ).setData ( oModelData );
				}
			},
			error : function ( ) {
				jQuery.sap.log.error ( "error in fetching unassigned devices", "service for unassigned devices is down - updateUnAssignedDevices", "Utils.js" );
			}
		} );
	}
};

/**
 * @description Setter Method for SapSplMapFilterControl.
 * To be used across the application to access the filter control.
 * @param {object} oInstance oSapSplMapFilterControl used in the maps tile.
 * @returns void
 * @example
 * splReusable.libs.Utils.prototype.setSplModelFilterControlInstance(oMapFilterInstance);
 */
splReusable.libs.Utils.prototype.setSplModelFilterControlInstance = function ( oInstance ) {
	this.oSapSplMapFilterControl = oInstance;
};

/**
 * @description Getter Method for SapSplMapFilterControl.
 * To be used across the application to access the filter control.
 * @param void
 * @returns void
 * @example
 * splReusable.libs.Utils.prototype.getSplModelFilterControlInstance();
 */
splReusable.libs.Utils.prototype.getSplModelFilterControlInstance = function ( ) {
	return this.oSapSplMapFilterControl;
};

/**
 * @description shows the error message in a Fiori MessageBox
 * @param {object} oMessageBoxSettings parameters (message & details) required for error message.
 * @param oMessageBoxSettings.message {String} Error message text to show
 * @param oMessageBoxSettings.details {String} Detailed message (when clicked on 'Show Details' link)
 * @returns void
 * @example
 * splReusable.libs.Utils.prototype.showMessage({message:"404",details:"Http Bad Request"});
 */
splReusable.libs.Utils.prototype.showMessage = function ( oMessageBoxSettings ) {
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
 * @description Setter to set list of allowed Tiles.
 * @param {array} Array of allowed tiles
 * @this splReusable.libs.Utils
 * @returns this to support method chaining
 * @since 1.0
 */
splReusable.libs.Utils.prototype.setAllowedTilesList = function ( aAllowedTiles ) {
	if ( arguments && this.IsValidArray ( arguments ) ) {
		if ( this.IsValidArray ( aAllowedTiles ) ) {
			this.aAllowedTiles = aAllowedTiles;
		} else {
			throw splReusable.exceptions.InvalidArrayException ( {
				message : "Invalid array object",
				source : "setAllowedTilesList",
				options : {
					severity : SapSplEnums.fatal
				}
			} );
		}
	} else {
		throw splReusable.exceptions.MissingParametersException ( {
			message : "Missing arguments",
			source : "setAllowedTilesList",
			options : {
				severity : SapSplEnums.fatal
			}
		} );
	}
	return this; // Method chaining
};

/**
 * @description Getter to get list of allowed tiles
 * @since 1.0
 * @returns {Array} array of tiles
 * @this splReusable.libs.Utils
 */
splReusable.libs.Utils.prototype.getAllowedTilesList = function ( ) {
	return (this.aAllowedTiles && this.aAllowedTiles.length > 0) ? this.aAllowedTiles : null;
};

/**
 * To check if user has the apps in his list and if so, return the app Payload. Else return false and null
 * @param appId {String} Application ID being passed as query parameter
 * @returns {Object} object
 *
 */
splReusable.libs.Utils.prototype.checkAppPermission = function ( appId ) {

	var bIsAllowed = false, aAllowedTilesList = this.getAllowedTilesList ( ); // Default
	// to
	// false
	for ( var i = 0, j = aAllowedTilesList.length ; i < j ; i++ ) {
		if ( aAllowedTilesList[i]["AppID"] === appId ) {
			// Match found. User is authorized to access app. Return true;
			bIsAllowed = true;
			this.setAppToLoad ( aAllowedTilesList[i] );
			break;
		}
	}

	return bIsAllowed;
};

splReusable.libs.Utils.prototype.setAppToLoad = function ( appToLoad ) {
	this.oAppToLoad = appToLoad;
};

splReusable.libs.Utils.prototype.getAppToLoad = function ( ) {
	return this.oAppToLoad;
};

/**
 * @description To control the home button display and behavior when the tile app is instantiated (irrespective of DAL)
 * If navToHome query param is true, button is displayed. If query parameter is not passed, showButton property takes precedence
 * If underlying sNavToPage is not passed, defaulted to MasterTileContainer
 * If underlying navIcon is not passed, defaulted to home icon
 * @param mSettings {Object} Show button or not
 * @param mSettings.sNavToPage {String} page ID to navigate to when this button is pressed
 * @param mSettings.navIcon {String} icon to show here
 * @this splReusable.libs.Utils
 * @since 1.0
 * @example
 * this.showHeaderButton({showButton:true, sNavToPage:"path.to.page", navIcon:"sap-icon://share-2"});
 */
splReusable.libs.Utils.prototype.showHeaderButton = function ( mSettings ) {

	if ( arguments.length === 0 || arguments === undefined || arguments === null ) {
		// Default settings
		throw new splReusable.exceptions.MissingParametersException ( {
			message : "Missing parameters to showHeaderButton",
			source : this.toString ( ),
			options : {
				severity : SapSplEnums.fatal
			}
		} );
	}

	if ( sap.ui.getCore ( ).byId ( "sapSplBaseUnifiedShell" ).getHeadItems ( ).length === 0 ) {
		if ( mSettings.hasOwnProperty ( "showButton" ) && mSettings.showButton ) {
			sap.ui.getCore ( ).byId ( "sapSplBaseUnifiedShell" ).addHeadItem ( new sap.ui.unified.ShellHeadItem ( {
				icon : (mSettings.hasOwnProperty ( "navIcon" ) ? mSettings.navIcon : "sap-icon://home"),
				/* HOTFIX Accessibility */
				tooltip : this.getBundle ( ).getText ( "UNIFIED_SHELL_HEADER_HOME" ),
				press : function ( ) {
					oSplBaseApplication.getAppInstance ( ).to ( (mSettings.hasOwnProperty ( "sNavToPage" ) ? mSettings.sNavToPage : "splView.tileContainer.MasterTileContainer") );
				}
			} ) );
		}
	}
};

splReusable.libs.Utils.prototype.showDataLossWarningDialog = function ( mSettings ) {
	var isChanged = false;
	// Myusers App
	if ( oSplBaseApplication.getAppInstance ( ).getCurrentPage ( ).sId && oSplBaseApplication.getAppInstance ( ).getCurrentPage ( ).sId === "splView.registeration.SplitAppBase" ) {
		if ( this.getCurrentDetailPage ( ).sId && this.getCurrentDetailPage ( ).sId === "NewContactRegistrationDetail" ) {
			if ( sap.ui.getCore ( ).getModel ( "myContactsRegisterEditModel" ).getData ( ) && sap.ui.getCore ( ).getModel ( "myContactsRegisterEditModel" ).getData ( ).ChangedFlag ) {
				isChanged = true;
				this.showMessageBox ( mSettings );
			}
		}
	}

	// MyBusinessPartner App
	if ( oSplBaseApplication.getAppInstance ( ).getCurrentPage ( ).sId && oSplBaseApplication.getAppInstance ( ).getCurrentPage ( ).sId === "splView.registeration.SplitAppBaseBusinessPartners" ) {
		if ( this.getCurrentDetailPageBP ( ).sId && this.getCurrentDetailPageBP ( ).sId === "NewBusinessPartnerRegistrationDetail" ) {
			if ( sap.ui.getCore ( ).getModel ( "myBusinessPartnerRegisterEditModel" ).getData ( ) && sap.ui.getCore ( ).getModel ( "myBusinessPartnerRegisterEditModel" ).getData ( ).ChangedFlag ) {
				isChanged = true;
				this.showMessageBox ( mSettings );
			}
		}
	}

	// MyTruck App
	if ( oSplBaseApplication.getAppInstance ( ).getCurrentPage ( ).sId && oSplBaseApplication.getAppInstance ( ).getCurrentPage ( ).sId === "splView.vehicles.VehicleMasterDetail" ) {
		if ( this.getCurrentDetailPageVehicle ( ).sId && this.getCurrentDetailPageVehicle ( ).sId === "MyVehiclesDetailAddVehicle" ) {
			if ( sap.ui.getCore ( ).getModel ( "myVehiclesAddVehicleModel" ).getData ( ) && sap.ui.getCore ( ).getModel ( "myVehiclesAddVehicleModel" ).getData ( ).ChangedFlag ) {
				isChanged = true;
				this.showMessageBox ( mSettings );
			}
		}
	}

	return isChanged;
};

splReusable.libs.Utils.prototype.getListCount = function ( oMasterList ) {
	try {
		var _listItemsCount = 0;
		if ( oMasterList && oMasterList.getBinding ( "items" ) && oMasterList.getBinding ( "items" ).iLength ) {
			_listItemsCount = oMasterList.getBinding ( "items" ).iLength;
		}
		return _listItemsCount;
	} catch (oEvent) {
		if ( oEvent.constructor === Error ) {
			jQuery.sap.log.error ( oEvent.message, "oObject is not an object - isObjectEmpty", "Utils.js" );
		}
	}
};

splReusable.libs.Utils.prototype.showMessageBox = function ( mSettings ) {
	sap.m.MessageBox.show ( this.getBundle ( ).getText ( "DATA_LOSS_WARNING_TEXT" ), sap.m.MessageBox.Icon.WARNING, this.getBundle ( ).getText ( "WARNING" ), [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL], function ( selection ) {
		if ( selection === "YES" ) {
			oSplBaseApplication.getAppInstance ( ).to ( (mSettings.hasOwnProperty ( "sNavToPage" ) ? mSettings.sNavToPage : "splView.tileContainer.MasterTileContainer") );
			sap.ui.getCore ( ).byId ( "sapSplBaseUnifiedShell" ).removeAllHeadItems ( );
		}
	}, null, this.fnSyncStyleClass ( "messageBox" ) );
};

/**
 * @description Getter to get Core instance. Avoid need for sap.ui.getCore() all over the codebase
 * @since 1.0
 * @this splReusable.libs.Utils
 * @public
 * @returns {Object} sap.ui.core.Core;
 */
splReusable.libs.Utils.prototype.getCoreInstance = function ( ) {
	return this.oSapSplCore;
};

/**
 * @param oValue {Object}
 * @param oValue.email {String} E-mail of the logged on user
 * @param oValue.firstName {String} First name of the logged on user
 * @param oValue.lastName {String} Last name of the logged on user
 * @since 1.0
 * @this splReusable.libs.Utils
 */
splReusable.libs.Utils.prototype.setLoggedOnUserDetails = function ( oValue ) {

	/* If logged on user model is undefined (usually at the start) */
	if ( !sap.ui.getCore ( ).getModel ( "loggedOnUserModel" ) ) {

		/*
		 * Create a new named model of this name and set on core with init
		 * payload
		 */
		sap.ui.getCore ( ).setModel ( new sap.ui.model.json.JSONModel ( oValue ), "loggedOnUserModel" );
	} else {

		/* If being set the second time (usually from user profile modification */
		sap.ui.getCore ( ).getModel ( "loggedOnUserModel" ).setData ( oValue, true );
	}

	this.oSapSplLoggedOnUserDetails = oValue;
};

/**
 *
 * @returns Logged on user details
 * @since 1.0
 * @this splReusable.libs.Utils
 */
splReusable.libs.Utils.prototype.getLoggedOnUserDetails = function ( ) {

	return this.oSapSplLoggedOnUserDetails;
};

splReusable.libs.Utils.prototype.getIsDirty = function ( ) {
	return this.isPageDirty;
};

splReusable.libs.Utils.prototype.setIsDirty = function ( bIsDirty ) {
	this.isPageDirty = bIsDirty;
};

splReusable.libs.Utils.prototype.setIntervalId = function ( intervalId ) {
	this.aIntervalIds.push ( intervalId );
};

splReusable.libs.Utils.prototype.getIntervalIds = function ( ) {
	return this.aIntervalIds;
};

splReusable.libs.Utils.prototype.saveTime = function ( date ) {
	this.startDate = date;
};

splReusable.libs.Utils.prototype.calculateTime = function ( date, msg ) {
	var mSec = date - this.startDate;
	var hours = Math.floor ( mSec / 1000 / 60 / 60 );
	mSec = mSec - hours * 1000 * 60 * 60;
	var minutes = Math.floor ( mSec / 1000 / 60 );
	mSec = mSec - minutes * 1000 * 60;
	var seconds = Math.floor ( mSec / 1000 );
	mSec = mSec - seconds * 1000;

};

/**
 * @description Checks if application is launched in iFrame. If so, error is thrown
 * and application load stops
 * @returns {Boolean}
 * @since 1.0
 * @this splReusable.libs.Utils
 */
splReusable.libs.Utils.prototype.isInIframe = function ( isTrue ) {
	if ( window.self && window.top ) {
		isTrue ( window.self !== window.top );

	} else {
		throw new Error ( "Window object not supported by browser" );
	}
};

/**
 *
 * @param aSearchResults {Array} Array of Search Results
 * @returns new sap.ui.model.Filter(aFilters, false)
 * @since 1.0
 * @this splReusable.libs.Utils
 */
splReusable.libs.Utils.prototype.getSearchItemFilters = function ( aSearchResults, sObjectKey, bNoHexConversion ) {
	/*
	 * Loop through the Search Results input construct new
	 * sap.ui.model.Filter("UUID","EQ",ObjectType); push the above instance into
	 * a parent array Return parent array
	 */

	var aResultFilterArray = [], bAnd = false, key;

	sObjectKey = sObjectKey ? sObjectKey : "UUID";

	if ( !this.IsValidArray ( aSearchResults ) ) {
		jQuery.sap.log.fatal ( "Invalid array usage", "Search result is an invalid object type", "splReusable.libs.Utils.getSearchItemFilters" );
		throw new splReusable.exceptions.InvalidArrayException ( {
			message : "Invalid filter array",
			source : "splReusable.libs.Utils.getSearchItemFilters",
			options : {
				severity : SapSplEnums.fatal
			}
		} );
	}

	for ( var iCount = 0 ; iCount < aSearchResults.length ; iCount++ ) {

		if ( bNoHexConversion ) {
			key = aSearchResults[iCount]["ObjectInfo"]["ObjectKey"];
		} else {
			key = this.base64ToHex ( aSearchResults[iCount]["ObjectInfo"]["ObjectKey"] );
		}
		aResultFilterArray.push ( new sap.ui.model.Filter ( sObjectKey, sap.ui.model.FilterOperator.EQ, key || null ) );

	}

	return new sap.ui.model.Filter ( aResultFilterArray, bAnd );

};

/**
 * @description Handle state of Search field on startup
 * @param bStartupStatus {Boolean} Status on startup
 * @returns void
 * @since 1.0
 */
splReusable.libs.Utils.prototype.setStartupError = function ( bStartupStatus ) {
	this.bStartupError = bStartupStatus;
};

/**
 * @description Handle state of Search field on startup
 * @returns bStartupError {Boolean} True/False
 * @since 1.0
 */
splReusable.libs.Utils.prototype.getStartupError = function ( ) {

	/* CSNFIX 612302 2014 */

	return this.bStartupError;
};

/**
 * @private
 * @param {Boolean} isInternal True if Query parameter is passed
 * @since 1.0
 * @description Method to get Helps link based on Query Parameter
 */

splReusable.libs.Utils.prototype.getHelpLinkFromMapping = function ( isInternal ) {

	var pdfLinks = {}, temp;
	pdfLinks.links = [];
	if ( arguments === undefined || arguments === null || arguments.length <= 0 ) {
		throw new splReusable.exceptions.MissingParametersException ( {
			message : "Invalid usage",
			source : this.toString ( ),
			options : {
				severity : SapSplEnums.fatal
			}
		} );
	}

	if ( isInternal.constructor !== Boolean ) {
		throw new TypeError ( );
	}

	try {
		var iCount, jCount;
		for ( iCount = 0, jCount = this.helpLinkMapper.helpLinks.length ; iCount < jCount ; iCount++ ) {
			temp = {};

			if ( isInternal ) {
				temp.helpLink = this.helpLinkMapper.helpLinks[iCount]["iLink"];
			} else {
				temp.helpLink = this.helpLinkMapper.helpLinks[iCount]["eLink"];
			}

			temp.helpLinkName = this.getAppNameFromAppId ( this.helpLinkMapper.helpLinks[iCount]["appId"] );

			temp.helpLinkDescription = this.getAppDescriptionFromAppId ( this.helpLinkMapper.helpLinks[iCount]["appId"] );

			if ( temp.helpLinkName ) {
				pdfLinks.links.push ( temp );
			}
		}
		return pdfLinks;

	} catch (oEvent) {
		if ( oEvent.constructor === Error ) {
			jQuery.sap.log.error ( oEvent.message, "Error in getHelpLinkFromMapping", "Utils.js" );
		}
	}

};

/**
 * @description Given an appPath, get the help metadata (url)
 * @param sAppPath
 * @returns oAppHelpObject {Object} The core help object maintained in help mapper
 * @since 1.0
 */
splReusable.libs.Utils.prototype.getHelpLinkPerAppFromMapping = function ( sAppPath ) {

	var oAppHelpObject = {}, sAppId = null, iCount = 0;

	if ( arguments === undefined || arguments.length <= 0 ) {
		$.sap.log.error ( "Help API Usage [Utility]", "Invalid usage of interface", "SAPSCL" );
		return null;
	}
	if ( sAppPath === null || sAppPath === undefined ) {
		$.sap.log.error ( "Help API Usage [Utility]", "Invalid application help metadata", "SAPSCL" );
		return null;
	}

	for ( iCount = 0 ; iCount < this.getAllowedTilesList ( ).length ; iCount++ ) {
		if ( sAppPath === this.getAllowedTilesList ( )[iCount]["AppPath"] ) {
			sAppId = this.getAllowedTilesList ( )[iCount]["AppID"];
			break;
		}
	}

	for ( iCount = 0 ; iCount < this.helpLinkMapper.helpLinks.length ; iCount++ ) {
		if ( sAppId === this.helpLinkMapper.helpLinks[iCount]["appId"] ) {
			oAppHelpObject = this.helpLinkMapper.helpLinks[iCount];
			break;
		}
	}
	return oAppHelpObject;
};

splReusable.libs.Utils.prototype.getAppNameFromAppId = function ( appId ) {
	var iCount;
	for ( iCount = 0 ; iCount < this.aAllowedTiles.length ; iCount++ ) {
		if ( this.aAllowedTiles[iCount].AppID === appId ) {
			return this.aAllowedTiles[iCount]["AppName"];
		}
	}

	if ( iCount === this.aAllowedTiles.length ) {
		return null;
	}
};

splReusable.libs.Utils.prototype.getAppDescriptionFromAppId = function ( appId ) {
	var iCount;
	for ( iCount = 0 ; iCount < this.aAllowedTiles.length ; iCount++ ) {
		if ( this.aAllowedTiles[iCount].AppID === appId ) {
			return this.aAllowedTiles[iCount]["AppName.description"];
		}
	}

	if ( iCount === this.aAllowedTiles.length ) {
		return null;
	}
};

/**
 * @description Converts Base64 encoded string into Hex. This is used to handle OData entity access
 * @param sBase64EncodedString {String} The base64 encoded string which should be converted to Hex
 * @since 1.0
 * @example this.base64ToHex('IBQIBRNHF1iAAAAAc4CWiQ==') returns "DB4D78D3CD39D77E3BD7BE7CF34D34D34D34EF7F34F7AF3D"
 * @returns HexString {String}
 */
splReusable.libs.Utils.prototype.base64ToHex = function ( sBase64EncodedString ) {

	if ( !arguments || arguments.length <= 0 ) {
		$.sap.log.fatal ( "Invalid Interface usage", "Invalid Interface usage", "SAPSCLUTILS" );
		return;
	}

	if ( sBase64EncodedString.constructor !== String ) {
		$.sap.log.info ( "Input type compatibility", "Input is not of type String.", "SAPSCLUTILS" );
		sBase64EncodedString = sBase64EncodedString.toString ( );
	}

	/**
	 * @private
	 * @description internal
	 */

	function makeMapOfValuesToArrayIndex ( inputArrayOfValues ) {
		var oMap = {};
		var i = 0;
		var iMax = inputArrayOfValues.length;
		for ( i = 0 ; i < iMax ; i++ ) {
			oMap[inputArrayOfValues[i]] = i;
		}
		return oMap;
	}

	/**
	 * @private
	 * @description internal
	 */

	function BinaryToBase64Encoder ( ) {
		var base64Characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
		var base64CharacterSet = base64Characters.split ( "" );
		var allCharactersRegExp = new RegExp ( "^[" + base64Characters + "]*$" );
		var base64CharacterToValueMap = makeMapOfValuesToArrayIndex ( base64CharacterSet );

		function encodeInternal ( ioArrayBuffer ) {
			var byteLength = ioArrayBuffer.byteLength;
			var remainder = ioArrayBuffer.byteLength % 3;
			var dataView = new DataView ( ioArrayBuffer );
			var padding = "";
			var byte1 = 0;
			var byte2 = 0;
			var byte3 = 0;
			var i = 0;
			var p = 0;
			var iMax = Math.ceil ( ioArrayBuffer.byteLength / 3 );
			var output = [];
			if ( remainder === 1 ) {
				padding = "==";
			} else if ( remainder === 2 ) {
				padding = "=";
			}
			for ( i = 0 ; i < iMax ; i++ ) {
				p = i * 3;
				byte1 = dataView.getUint8 ( p );
				byte2 = (p + 1) < byteLength ? dataView.getUint8 ( p + 1 ) : 0;
				byte3 = (p + 2) < byteLength ? dataView.getUint8 ( p + 2 ) : 0;
				output.push ( base64CharacterSet[byte1 >>> 2] );
				output.push ( base64CharacterSet[((byte1 & 0x3) << 4) | (byte2 >>> 4)] ); // Bit
				// mask
				// with
				// 00000011
				// (0x3)
				if ( (p + 1) < byteLength ) {
					output.push ( base64CharacterSet[((byte2 & 0xF) << 2) | (byte3 >>> 6)] ); // Bit
					// mask
					// with
					// 00001111
					// (0xF)
				}
				if ( (p + 2) < byteLength ) {
					output.push ( base64CharacterSet[byte3 & 0x3F] ); // Bit
					// mask
					// with
					// 00111111
					// (0x3F)
				}
			}
			output.push ( padding );
			return output.join ( "" );
		}

		/**
		 * @private
		 * @description internal
		 */

		function getCharacterValue ( sChar ) {
			var value = base64CharacterToValueMap[sChar];
			if ( value === undefined ) {
				throw new Error ( "Base64 string has invalid character " + sChar );
			}
			return value;
		}

		/**
		 * @private
		 * @description internal
		 */

		function decodeInternal ( input ) {
			var inputLength = input.length;
			var iMax = Math.ceil ( input.length / 4 );
			var remainder = input.length % 4;
			var i = 0;
			var j = 0;
			var p = 0;
			var q = 0;
			var r = 0;
			var s = 0;
			var digitVal = 0;
			var byte1 = 0;
			var byte2 = 0;
			var byte3 = 0;
			var byteLength = Math.floor ( input.length / 4 ) * 3;

			if ( remainder === 2 ) {
				byteLength = byteLength + 1;
			} else if ( remainder === 3 ) {
				byteLength = byteLength + 2;
			}
			if ( remainder === 1 || byteLength === 0 ) {
				throw new Error ( "Decode Base 64: input has invalid length. Length should be in (multiples of 4) + (2 or 3) after excluding = character" );
			}
			if ( !allCharactersRegExp.test ( input ) ) {
				throw new Error ( "DecodeBase64: Base64 string has invalid character(s)" );
			}
			var output = new ArrayBuffer ( byteLength );
			var dataView = new DataView ( output );

			for ( i = 0 ; i < iMax ; i++ ) {
				p = i * 4;
				q = p + 1;
				r = p + 2;
				s = p + 3;
				byte1 = getCharacterValue ( input[p] ) << 2; // BYTE-1: 6 bin
				// digits become
				// most
				// significant
				// bits(byte1
				// has 2
				// trailing 0)
				byte2 = 0;
				byte3 = 0;
				if ( q < inputLength ) {
					digitVal = getCharacterValue ( input[q] );
					byte1 |= digitVal >>> 4; // BYTE-1: 2 least significant
					// digits of byte1: out of 6 bin
					// digits, 4 are pushed right to
					// get 2 leading digits
					dataView.setUint8 ( j++, byte1 );
					byte2 = (digitVal & 0xF) << 4; // BYTE-2: 4 most
					// significant digits of
					// byte2: out of 6 bin
					// digits, 2 are pushed left
					// to get 4 trailing digits
					// of digitVal;
					// BYTE-2: now has 4 trailing 0; 0xF = 00001111
				}
				if ( r < inputLength ) {
					digitVal = getCharacterValue ( input[r] );
					byte2 |= digitVal >>> 2; // BYTE-2: takes 4 leading bin
					// digits of digitVal as its
					// trailing digits
					dataView.setUint8 ( j++, byte2 );
					byte3 = (digitVal & 0x3) << 6; // BYTE-3: takes 2 trailing
					// bin digits of digitVal as
					// its leading digits;
					// BYTE-3 now has 6 trailing
					// 0
				}
				if ( s < inputLength ) {
					digitVal = getCharacterValue ( input[s] );
					byte3 |= digitVal; // BYTE-3: takes bin digits of digitVal
					// as its leading digits
					dataView.setUint8 ( j++, byte3 );
				}
			}
			return output;
		}

		this.encode = function ( ioArrayBuffer ) {
			if ( !ioArrayBuffer instanceof ArrayBuffer ) {
				throw new Error ( "BinaryToBase64Encoder.encode(): Input has to be an ArrayBuffer" );
			}
			return encodeInternal ( ioArrayBuffer );
		};

		this.decode = function ( input ) {
			if ( input === undefined || typeof input !== "string" ) {
				throw new Error ( "BinaryToBase64Encoder.decode(): Input has to be a string" );
			}
			return decodeInternal ( input.replace ( /=/g, "" ) );
		};
	}

	/**
	 * @private
	 * @description internal
	 */
	/* eslint consistent-return: 0 */
	function BinaryToHexEncoder ( ) {
		var hexDigitsCharacterSet = "0123456789ABCDEF";
		var hexDigits = hexDigitsCharacterSet.split ( "" );
		var allDigitsRegExp = new RegExp ( "^[" + hexDigitsCharacterSet + "]*$" );
		var hexDigitCharacterToValueMap = makeMapOfValuesToArrayIndex ( hexDigitsCharacterSet );

		this.encode = function ( input ) {
			if ( input === undefined || typeof input !== "object" || (!(input instanceof ArrayBuffer)) ) {
				throw new Error ( "BinaryToHexEncoder.encode(): Input has to be ArrayBuffer" );
			}
			var output = [];
			var dv = new DataView ( input );
			var i = 0;
			var iMax = 0;
			for ( i = 0, iMax = input.byteLength ; i < iMax ; i++ ) {
				output.push ( hexDigits[Math.floor ( dv.getUint8 ( i ) / 0x10 )] );
				output.push ( hexDigits[Math.floor ( dv.getUint8 ( i ) % 0x10 )] );
			}
			return output.join ( "" );
		};

		this.decode = function ( hexString ) {
			if ( hexString === undefined || typeof hexString !== "string" ) {
				throw new Error ( "BinaryToHexEncoder.decode(): Input has to be Hexadecimal String" );
			}
			var input = hexString.toUpperCase ( );
			if ( !allDigitsRegExp.test ( input ) ) {
				throw new Error ( "BinaryToHexEncoder.decode(): Hexadecimal string has invalid character(s))" );
			}
			if ( (input.length % 2) !== 0 || input.length === 0 ) {
				throw new Error ( "BinaryToHexEncoder.decode(): Hexadecimal String input has invalid length. Length should be a multiple of 2" );
			}
			var output = new ArrayBuffer ( Math.floor ( input.length / 2 ) );
			var dv = new DataView ( output );
			var i = 0;
			var iMax = 0;
			var j = 0;
			for ( i = 0, iMax = output.byteLength ; i < iMax ; i++ ) {
				j = i * 2;
				dv.setUint8 ( i, hexDigitCharacterToValueMap[input[j]] * 0x10 + hexDigitCharacterToValueMap[input[j + 1]] );
			}
			return output;
		};
	}
	var binHexEncoder = new BinaryToHexEncoder ( ), base64Encoder = new BinaryToBase64Encoder ( );

	return binHexEncoder.encode ( base64Encoder.decode ( sBase64EncodedString ) );

};

/**
 * @description Setter for maintaining a list of query parameters map
 * @param queryObjectKey {String} Query parameter object key
 * @param queryObjectValue {String} Query parameter Object key value
 * @returns void
 * @since 1.0
 * @function
 * @public
 */
splReusable.libs.Utils.prototype.setInQueryParameterMap = function ( queryObjectKey, queryObjectValue ) {
	this.oSplQueryParametersMap[queryObjectKey] = queryObjectValue;
};

/**
 * @description Getter for list of query maps
 * @param queryObjectKey {String} Object whose value to fetch
 * @returns sValue {String} Value of the first occurence of the query parameter
 * @since 1.0
 * @function
 * @public
 */
splReusable.libs.Utils.prototype.getFromQueryParameterMap = function ( queryObjectKey ) {
	if ( arguments.length <= 0 ) {
		return this.oSplQueryParametersMap;
	}
	if ( this.oSplQueryParametersMap.hasOwnProperty ( queryObjectKey ) ) {
		return this.oSplQueryParametersMap[queryObjectKey];
	} else {
		// $.sap.console.error("Invalid query parameter - Utility", "Invalid
		// query parameter passed: " + queryObjectKey + ". Returning null",
		// "SAPSCL");
		return null;
	}
};

/**
 * @desdicription Set current application information. Set from MasterTileContainer press handler
 * @param oAppInfo
 * @since 1.0
 */
splReusable.libs.Utils.prototype.setCurrentAppInfo = function ( oAppHelpMetadata ) {
	if ( !oAppHelpMetadata.hasOwnProperty ( "appHelpUrl" ) || !oAppHelpMetadata.appHelpUrl.hasOwnProperty ( "eUrl" ) ) { /*
																															 * Disable
																															 * global
																															 * help
																															 * button
																															 */
		jQuery.sap.log.info ( oAppHelpMetadata.eUrl, "", "Utils.js" );
	}

	this.oCurrentAppInfo = oAppHelpMetadata;
};

/**
 * @description Get current application information
 * @returns oCurrentAppInfo {Object} Current application information
 * @since 1.0
 */
splReusable.libs.Utils.prototype.getCurrentAppInfo = function ( ) {

	return this.oCurrentAppInfo;

};

/**
 * @description Called from afterNavigate handler of AppContainer. To ensure the proper help is loaded
 * @param bIsNavToAppComplete {Boolean} True|False
 * @since 1.0
 */
splReusable.libs.Utils.prototype.setIsNavToAppComplete = function ( bIsNavToAppComplete ) {
	this.isNavToAppComplete = bIsNavToAppComplete;
	return this;
};

/**
 * @description Called from afterNavigate handler of AppContainer. To ensure the proper help is loaded
 * @returns isNavToAppComplete {Boolean}
 * @since 1.0
 */
splReusable.libs.Utils.prototype.getIsNavToAppComplete = function ( ) {
	return this.isNavToAppComplete;
};

/**
 * @description Set a help type html/pdf
 *
 * @param sHelpType {String} html|pdf
 *
 * @this splReusable.libs.Utils
 *
 * @returns splReusable.libs.Utils;
 */
splReusable.libs.Utils.prototype.setHelpType = function ( sHelpType ) {
	this.sHelpType = sHelpType;
	return this;
};

splReusable.libs.Utils.prototype.getHelpType = function ( ) {
	return this.sHelpType;
};

/**
 * @description Method to get Application Config object from getAllowedTilesList()
 * @param {String} sAppId
 * @returns {Array} aConfigArray
 * @since 1.0
 */
splReusable.libs.Utils.prototype.getAppConfigObjectFromAllowedTiles = function ( sAppId ) {

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
		if ( sAppId.constructor === String ) {
			for ( var sIndex = 0 ; sIndex < this.getAllowedTilesList ( ).length ; sIndex++ ) {
				if ( this.getAllowedTilesList ( )[sIndex].AppID === sAppId ) {
					return this.getAllowedTilesList ( )[sIndex].AppConfig.results;
				}
			}
		} else {
			throw new TypeError ( );
		}
	} catch (oEvent) {
		if ( oEvent.constructor === Error ) {
			jQuery.sap.log.error ( oEvent.message, "sAppId is not an string - getAppConfigObjectFromAllowedTiles", "Utils.js" );
		}
	}

};

/**
 *
 * @description Given a bucket type (Current month, last month, last 3 months, last 6 months, last 1 year), get the date range from
 * @param sBucketType {String} "C" - Current Month, "L": Last Month, "Q": Last 3 months, "H": Last 6 months, "Y": Last 1 year
 * @returns oDateRange {Object} Date Range Object
 * @returns oDateRange.from {String} From date
 * @returns oDateRange.to {String} To Date
 * @since 1.0
 * @example
 * this.getDateRange("C"); Month to date
 * this.getDateRange("L"); 1st of last month to last of last month
 * this.getDateRange("Q"); 1st of last quarter to last of last quarter
 * this.getDateRange("QTD"); Quarter to date
 * this.getDateRange("H"); 6 Months to date
 * this.getDateRange("Y"); Year to date
 */
splReusable.libs.Utils.prototype.getDateRange = function ( sBucketType ) {

	var oDateRange = {
		from : "",
		to : ""
	}, sCurrentDate = new Date ( ), sCurrentYear = sCurrentDate.getFullYear ( ), sCurrentMonth = sCurrentDate.getMonth ( ), tempDate;

	function getQuarterRange ( quarterNumber ) {
		if ( quarterNumber === 1 ) {
			// Return previous year's quarter range date
			/*
			 * If in 1st quarter of current year, last quarter would be the 4th
			 * quarter of previous year. So year is decremented by 1
			 */
			oDateRange["from"] = new Date ( sCurrentYear - 1, 9, 1 ); /*
																		 * 1st
																		 * of
																		 * the
																		 * 1st
																		 * month
																		 * of
																		 * 4th
																		 * quarter
																		 * of
																		 * previous
																		 * year
																		 */
			oDateRange["to"] = new Date ( sCurrentYear, 0, 0 );
			oDateRange["to"].setDate( oDateRange["to"].getDate() + 1 );
																/*
																 * Last day of
																 * the last
																 * month of 4th
																 * quarter of
																 * previous year
																 */
		} else if ( quarterNumber === 2 ) {
			oDateRange["from"] = new Date ( sCurrentYear, 0, 1 ); /*
																	 * 1st of
																	 * the 1st
																	 * month of
																	 * 1st
																	 * quarter
																	 * of
																	 * current
																	 * year
																	 */
			oDateRange["to"] = new Date ( sCurrentYear, 3, 0 );

			// Fix to incident 1580183497
			oDateRange["to"].setDate( oDateRange["to"].getDate() + 1 );
																/*
																 * Last day of
																 * the last
																 * month of 1st
																 * quarter of
																 * current year
																 */
		} else if ( quarterNumber === 3 ) {
			oDateRange["from"] = new Date ( sCurrentYear, 3, 1 ); /*
																	 * 1st day
																	 * of the
																	 * 1st month
																	 * of 2nd
																	 * quarter
																	 * of
																	 * current
																	 * year
																	 */
			oDateRange["to"] = new Date ( sCurrentYear, 6, 0 );

			// Fix to incident 1580183497
			oDateRange["to"].setDate( oDateRange["to"].getDate() + 1 );
																/*
																 * Last day of
																 * the last
																 * month of 2nd
																 * quarter of
																 * current year
																 */
		} else if ( quarterNumber === 4 ) {
			oDateRange["from"] = new Date ( sCurrentYear, 6, 1 ); /*
																	 * 1st day
																	 * of the
																	 * 1st month
																	 * of 3rd
																	 * quarter
																	 * of
																	 * current
																	 * year
																	 */
			oDateRange["to"] = new Date ( sCurrentYear, 9, 0 );

			// Fix to incident 1580183497 
			oDateRange["to"].setDate( oDateRange["to"].getDate() + 1 );
																/*
																 * Last day of
																 * the last
																 * month of 3rd
																 * quarter of
																 * current year
																 */
		}
		return;
	}

	/* Get the numeric current quarter */

	function getCurrentQ ( dCurrentMonth ) {
		var iCurrentQuarter = Math.floor ( dCurrentMonth / 3 ) + 1;
		return iCurrentQuarter > 3 ? 4 : iCurrentQuarter;
	}

	function getCurrentQuarterRange ( quarterNumber ) {
		if ( quarterNumber === 1 ) {
			// Return previous year's quarter range date
			oDateRange["from"] = new Date ( sCurrentYear, 0, 1 ); /*
																	 * 1st day
																	 * of the
																	 * 1st month
																	 * of 1st
																	 * quarter
																	 * of
																	 * current
																	 * year
																	 */
		} else if ( quarterNumber === 2 ) {
			oDateRange["from"] = new Date ( sCurrentYear, 3, 1 ); /*
																	 * 1st day
																	 * of the
																	 * 1st month
																	 * of 2nd
																	 * quarter
																	 * of
																	 * current
																	 * year
																	 */
		} else if ( quarterNumber === 3 ) {
			oDateRange["from"] = new Date ( sCurrentYear, 6, 1 ); /*
																	 * 1st day
																	 * of the
																	 * 1st month
																	 * of 3rd
																	 * quarter
																	 * of
																	 * current
																	 * year
																	 */
		} else if ( quarterNumber === 4 ) {
			oDateRange["from"] = new Date ( sCurrentYear, 9, 1 ); /*
																	 * 1st day
																	 * of the
																	 * 1st month
																	 * of 4th
																	 * quarter
																	 * of
																	 * current
																	 * year
																	 */
		}
		oDateRange["to"] = sCurrentDate; /* Today */
		return;
	}

	function __getDateRange__ ( dFrom, dTo, iCheckQuarter ) {
		// Check for quarter?
		if ( iCheckQuarter === 1 ) {
			getQuarterRange ( getCurrentQ ( sCurrentMonth ) );
			return;
		}
		// Check for quarter to date
		else if ( iCheckQuarter === 2 ) {
			getCurrentQuarterRange ( getCurrentQ ( sCurrentMonth ) );
			return;
		}

		// Just get plain date range
		oDateRange["from"] = dFrom;
		oDateRange["to"] = dTo;
	}

	switch ( sBucketType ) {
		case "C":
			__getDateRange__ ( new Date ( sCurrentYear, sCurrentMonth, 1 ), sCurrentDate, 0 ); // Month
			// to
			// date
			break;
		case "L":

			// Fix to incident 1580183497
			tempDate = new Date ( sCurrentYear, sCurrentMonth, 0 );
			tempDate.setDate(tempDate.getDate() + 1 );

			__getDateRange__ ( new Date ( sCurrentYear, sCurrentMonth - 1, 1 ), tempDate, 0 ); // Last
			// month
			break;
		case "Q":
			__getDateRange__ ( null, null, 1 ); // Last quarter (Calendar)
			break;
		case "QTD":
			__getDateRange__ ( null, null, 2 ); // Quarter to date
			break;
		case "H":
			__getDateRange__ ( new Date ( sCurrentYear, sCurrentMonth - 6, 1 ), sCurrentDate, 0 ); // 6
			// months
			// to
			// date
			break;
		case "Y":
			__getDateRange__ ( new Date ( sCurrentYear, 0, 1 ), sCurrentDate, 0 ); // Year
			// to
			// date
			break;
		default:

	}

	return {
		from : oDateRange["from"],
		to : oDateRange["to"]
	};

};

/**
 * @description Getter for storage instance (local/session)
 * @param sInstanceType {String} local/session
 * @returns {Object} jQuery.sap.storage instance
 * @since 1.0
 */
splReusable.libs.Utils.prototype.getStorageInstance = function ( sInstanceType ) {
	var _instance;
	if ( !sInstanceType || sInstanceType === null || sInstanceType === "session" ) {
		_instance = jQuery.sap.storage ( jQuery.sap.storage.Type.session );
	} else if ( sInstanceType.toLowerCase ( ) === "local" ) {
		_instance = jQuery.sap.storage ( jQuery.sap.storage.Type.local );
	}
	return _instance;
};

/**
 *
 * @param sInstanceType {String} session|local
 * @param aKeys {Array} array of keys to retrieve
 * @returns {Object} Key value pair of keys with their values
 */
splReusable.libs.Utils.prototype.getKeys = function ( sInstanceType, aKeys ) {
	var oKeyObject = {};
	var sStorageInstance = this.getStorageInstance ( sInstanceType );
	if ( (arguments.length < 1) || ((sInstanceType.constructor !== String) || (aKeys.constructor !== Array)) ) {
		throw new splReusable.exceptions.MissingParametersException ( {
			source : "getKeys",
			message : "mandatory arguments missing",
			options : {
				severity : "Fatal"
			}
		} );
// return;
	} else {
		for ( var iCount = 0 ; iCount < aKeys.length ; iCount++ ) {
			if ( sStorageInstance.get ( aKeys[iCount] ) ) {
				oKeyObject[aKeys[iCount]] = sStorageInstance.get ( aKeys[iCount] );
			}
		}
	}

	return oKeyObject;
};

/**
 * @description Setter for init data
 * @returns {Object}
 * @since 1.0.1
 */
splReusable.libs.Utils.prototype.getInitializerDetails = function ( ) {
	return this.oSapSplInitializerDetails;
};

/**
 * @description Setter for init data
 * @param oValue {Object} Initializer data object
 * @since 1.0.1
 */
splReusable.libs.Utils.prototype.setInitializerDetails = function ( oValue ) {
	this.oSapSplInitializerDetails = oValue;
};

/**
 * @description Setter for system type
 * @param void
 * @since 1.0.1
 */

splReusable.libs.Utils.prototype.fnSetSystemType = function ( ) {
	if ( sap.ui.Device.system.combi === true ) {
		this.sSystemType = SapSplEnums.COMBI_TYPE;
	} else if ( sap.ui.Device.system.desktop === true ) {
		this.sSystemType = SapSplEnums.DESKTOP_TYPE;
	} else if ( sap.ui.Device.system.phone === true ) {
		this.sSystemType = SapSplEnums.PHONE_TYPE;
	} else if ( sap.ui.Device.system.tablet === true ) {
		this.sSystemType = SapSplEnums.TABLET_TYPE;
	}
};

/**
 * @description Getter for system type
 * @param void
 * @since 1.0.1
 */
splReusable.libs.Utils.prototype.fnGetSystemType = function ( ) {
	return this.sSystemType;
};

/**
 * @description Function to Sync target control with parent style class
 * @param {object} oControlInstance  Instance of the target control
 * @returns void
 * @since 1.0.1
 */
splReusable.libs.Utils.prototype.fnSyncStyleClass = function ( oControlInstance ) {
	if ( oControlInstance.constructor === String && oControlInstance === "messageBox" ) {
		if ( this.sSystemType === SapSplEnums.DESKTOP_TYPE ) {
			return "sapUiSizeCompact";
		} else {
			return "";
		}
	} else {
		if ( this.sSystemType === SapSplEnums.DESKTOP_TYPE ) {
			jQuery.sap.syncStyleClass ( "sapUiSizeCompact", $ ( "#sapSplBaseUnifiedShell" ), oControlInstance );
		}
	}
};

/**
 * @description Setter for style mode
 * @param __bIsInHCB {Boolean} True - If in HCB Mode true, defaults to false
 */
splReusable.libs.Utils.prototype.setHCBMode = function ( __bIsInHCB ) {
	var oTemp = (__bIsInHCB) ? jQuery.sap.log.info ( "SAP SCL Theme check", "Launching in HCB mode", "SAPSCL" ) : jQuery.sap.log.info ( "SAP SCL Theme check", "Launching in default theme", "SAPSCL" );
	this.bIsInHCBMode = __bIsInHCB;
};

/**
 * @description Getter method to know if the browser is internet explorer
 * @param bIsInternetExplorer True - If the browser is IE.
 */
splReusable.libs.Utils.prototype.bIsInternetExplorer = function ( ) {
	return (sap.ui.Device.browser.name === "ie");
};

/**
 * @description If the app is running in HCB Mode.
 * @see splReusable.libs.SapSplStyleSheetLoader
 * @returns {Boolean}
 */
splReusable.libs.Utils.prototype.isInHCBMode = function ( ) {
	return this.bIsInHCBMode;
};

splReusable.libs.Utils.prototype.setReferrer = function ( ) {
	if ( this.sReferrer === null ) {
		this.sReferrer = document.URL.toString ( );
	}
};

splReusable.libs.Utils.prototype.getReferrer = function ( ) {
	return this.sReferrer;
};

/* Create global accessor */
var oSapSplUtils = new splReusable.libs.Utils ( );