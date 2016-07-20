/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
/* Load SPL Utils */
jQuery.sap.require ( "splReusable.libs.Utils" );

/* Load Maps Data Marshal (for Maps data model handling */
jQuery.sap.require ( "splReusable.libs.MapsDataMarshal" );

/* Load SPL Model Formatter (For complex path binding formatting) */
jQuery.sap.require ( "splReusable.libs.SapSplModelFormatters" );

/* Load SPL Model as extension of OData model to handle timeout */
jQuery.sap.require ( "splReusable.libs.SapSplModel" );

/* Load CA.UI.Message for the alter/error handling message boxes */
jQuery.sap.require ( "sap.ca.ui.message.message" );

/* Load SPL Busy Dialog Lib as singleton to display Busy Dialog */
jQuery.sap.require ( "splReusable.libs.SapSplBusyDialoglib" );

/* Load SPL Message Box Lib as singleton to display error messages */
jQuery.sap.require ( "splReusable.libs.SapSplMessageBoxlib" );

/* SAPUI5 message box lazy load */
jQuery.sap.require ( "sap.m.MessageBox" );

/* SAPUI5 message toast lazy load */
jQuery.sap.require ( "sap.m.MessageToast" );

/* SAPUI5 Instance Manager to handle close of all Dialogs and Popovers */
jQuery.sap.require ( "sap.m.InstanceManager" );

/* SPL Tracer */
jQuery.sap.require ( "splReusable.libs.SplTracer" );

/* SPL Logout Handler */
jQuery.sap.require ( "splReusable.libs.SapSplLogoutHandler" );

/* SPL Global jQuery based selectors singleton */
jQuery.sap.require ( "splReusable.libs.SapSplGlobalQuerySelectors" );

/* SPL Core tile refresher */
jQuery.sap.require ( "splReusable.libs.SapSplTileRefresher" );

/* SPL Help Handler */
jQuery.sap.require ( "splReusable.libs.SapSplHelpHandler" );

/* SPL Error Handler UI component */
jQuery.sap.require ( "splReusable.libs.SapSplAppErrorHandler" );

/* SPL Session Timeout Handler */
jQuery.sap.require ( "splReusable.libs.SapSplSessionHandler" );

/* SPL Event Definition factory */
jQuery.sap.require ( "splReusable.events.EventsFactory" );

/* SPL HCB Theme checker and style loader */
jQuery.sap.require ( "splReusable.libs.SapSplStyleSheetLoader" );

/* SPL Data Access Factory */
jQuery.sap.require ( "splReusable.libs.SapSplAjaxFactory" );

/* SPL User Preferences Library */
jQuery.sap.require ( "splReusable.libs.SapSplUserPreferences" );

/**
 * @description Anonymous function to instantiate the shell based on the worksets which is intended for the logged in User.
 */
/* eslint no-inner-declarations:1 */
(function ( ) {

	/* Scoped Locally */
	try {
		
		oSapSplUtils.setReferrer(); //Set refferer in startup

		jQuery.sap.log.trace ( "SAP SCL Startup", "Application Bootstrap initalized", "SAPSCL" );

		/**
		 * @description: Query init.xsjs for BuPa existence and load/stop based on result
		 * @returns void
		 * @private
		 * @param checkDone {Function} Callback
		 * @since 1.0
		 */
		function checkForBuPaExistence ( checkDone ) {
			var oUrl;
			
			if ( jQuery.sap.getUriParameters ( ).get ( "spl-mock-mode" ) === "true" ) {
				$.sap.log.info ( "SAP SCL DEMO MODE!!!!", "Demo mode initializer", "SAPSCL" );
				var oResultObject = {
					"email" : "admin.carrier1@sap.com",
					"userId" : "CL_CARRIER1_ADMIN",
					"firstName" : "Admin",
					"lastName" : "Carrier 1",
					"isSAML" : false,
					"notificationMessages" : [],
					"Error" : [],
					"HttpStatusCode" : 200
				}, data = oResultObject;

				oSapSplUtils.setInitializerDetails ( data );

				if ( data.notificationMessages && data.notificationMessages.length > 0 ) {

					var notificationMsgs = "", index;

					for ( index = 0 ; index < data.notificationMessages.length ; index++ ) {
						if ( index === 0 ) {
							notificationMsgs = notificationMsgs + data.notificationMessages[index].LongText + " " + oSapSplUtils.getBundle ( ).getText ( "SEND_MESSAGE_VALID_FROM" ) + " " +
									splReusable.libs.SapSplModelFormatters.convertDateTimeToStringBasedOnLocaleInMediumFormat ( new Date ( data.notificationMessages[index]["Validity.StartTime"] ) ) + " " +
									oSapSplUtils.getBundle ( ).getText ( "SEND_MESSAGE_VALID_UNTIL" ) + " " +
									splReusable.libs.SapSplModelFormatters.convertDateTimeToStringBasedOnLocaleInMediumFormat ( new Date ( data.notificationMessages[index]["Validity.EndTime"] ) );
						} else {
							notificationMsgs += "\n\n" + data.notificationMessages[index].LongText + " " + oSapSplUtils.getBundle ( ).getText ( "SEND_MESSAGE_VALID_FROM" ) + " " +
									splReusable.libs.SapSplModelFormatters.convertDateTimeToStringBasedOnLocaleInMediumFormat ( new Date ( data.notificationMessages[index]["Validity.StartTime"] ) ) + " " +
									oSapSplUtils.getBundle ( ).getText ( "SEND_MESSAGE_VALID_UNTIL" ) + " " +
									splReusable.libs.SapSplModelFormatters.convertDateTimeToStringBasedOnLocaleInMediumFormat ( new Date ( data.notificationMessages[index]["Validity.EndTime"] ) );
						}

					}
					sap.m.MessageBox.show ( notificationMsgs, sap.m.MessageBox.Icon.INFORMATION, oSapSplUtils.getBundle ( ).getText ( "NOTIFICATIONS" ), [sap.m.MessageBox.Action.OK], null, null, oSapSplUtils.fnSyncStyleClass ( "messageBox" ) );

				}

				checkDone ( {
					data : oResultObject,
					xhr : null,
					status : null
				} );

			}

			else {

				oUrl = oSapSplUtils.getServiceMetadata ( SapSplEnums.Init, true );
				jQuery.ajax ( {
					url : oUrl,
					type : "GET",
					async : true,
					success : function ( data, textStatus, jqXhr ) {
						jQuery.sap.log.info ( "Entity Check", "Entities check completed", "SAPSCL" );

						/* Set the initializer for reuse in session management */
						oSapSplUtils.setInitializerDetails ( data );

						checkDone ( {
							data : data,
							xhr : jqXhr,
							status : textStatus
						} );

						/* Handler for support mode message notifications */
						if ( data.notificationMessages && data.notificationMessages.length > 0 ) {

							var notificationMsgs = "", index;

							for ( index = 0 ; index < data.notificationMessages.length ; index++ ) {
								if ( index === 0 ) {
									notificationMsgs = notificationMsgs + data.notificationMessages[index].LongText + " " + oSapSplUtils.getBundle ( ).getText ( "SEND_MESSAGE_VALID_FROM" ) + " " +
											splReusable.libs.SapSplModelFormatters.convertDateTimeToStringBasedOnLocaleInMediumFormat ( new Date ( data.notificationMessages[index]["Validity.StartTime"] ) ) + " " +
											oSapSplUtils.getBundle ( ).getText ( "SEND_MESSAGE_VALID_UNTIL" ) + " " +
											splReusable.libs.SapSplModelFormatters.convertDateTimeToStringBasedOnLocaleInMediumFormat ( new Date ( data.notificationMessages[index]["Validity.EndTime"] ) );
								} else {
									notificationMsgs += "\n\n" + data.notificationMessages[index].LongText + " " + oSapSplUtils.getBundle ( ).getText ( "SEND_MESSAGE_VALID_FROM" ) + " " +
											splReusable.libs.SapSplModelFormatters.convertDateTimeToStringBasedOnLocaleInMediumFormat ( new Date ( data.notificationMessages[index]["Validity.StartTime"] ) ) + " " +
											oSapSplUtils.getBundle ( ).getText ( "SEND_MESSAGE_VALID_UNTIL" ) + " " +
											splReusable.libs.SapSplModelFormatters.convertDateTimeToStringBasedOnLocaleInMediumFormat ( new Date ( data.notificationMessages[index]["Validity.EndTime"] ) );
								}

							}
							sap.m.MessageBox
									.show ( notificationMsgs, sap.m.MessageBox.Icon.INFORMATION, oSapSplUtils.getBundle ( ).getText ( "NOTIFICATIONS" ), [sap.m.MessageBox.Action.OK], null, null, oSapSplUtils.fnSyncStyleClass ( "messageBox" ) );

						}
					},
					error : function ( jqXhr, textStatus ) {
						jQuery.sap.log.fatal ( "Entity Check", "Entities check failed. Operations might fail", "SAPSCL" );
						checkDone ( {
							data : null,
							xhr : jqXhr,
							status : textStatus
						} );

					}
				} );
			}

		}

		function applyThemePreference ( fnApplied ) {
			sap.ui.getCore ( ).applyTheme ( oSapSplUtils.getLoggedOnUserDetails ( )["profile"].Theme );
			oSapSplUtils.setHCBMode ( oSapSplUtils.getLoggedOnUserDetails ( )["profile"].Theme === "sap_hcb" );
			fnApplied ( );
		}

		function getMyProfileDetails ( checkDone ) {
			var oUserModel = new sap.ui.model.odata.ODataModel ( oSapSplUtils.getServiceMetadata ( "app", true ) );

			oUserModel.read ( "/MyUsers", {
				context : null,
				urlParameters : "$filter=(isMyself eq 1)&$format=json",
				async : true,
				success : function ( oData, response ) {
					var data = jQuery.parseJSON ( response.body );
					if ( data.d.results.length > 0 ) {
						oSapSplUtils.setLoggedOnUserDetails ( {
							profile : data.d.results[0]
						} );
						checkDone ( {
							data : data,
							result : "OK"
						} );
					} else {
						checkDone ( {
							data : null,
							result : "ERROR"
						} );
					}
				},
				error : function ( oError ) {
					checkDone ( {
						data : null,
						result : "ERROR"
					} );
				}
			} );
		}

		/**
		 * @private
		 * @since 1.0
		 * @description Handle browser unsupported cases here
		 * @param fnCallBack {Function} Callback. Handle what should be done on dialog close.
		 */

		function handleBrowserUnsupportedExceptions ( _sBrowserFullName, fnCallBack ) {
			sap.ca.ui.message.showMessageBox ( {
				type : sap.ca.ui.message.Type.ERROR,
				message : oSapSplUtils.getBundle ( ).getText ( "UNSUPPORTED_BROWSER", [_sBrowserFullName] )
			}, function ( ) {
				fnCallBack ( );
			} );

		}

		/**
		 * @description Checks for the Browser, Browser version, Device and logs the info. Also it checks for the localStorage and sessionStorage
		 *              object.
		 * @param void
		 * @returns void
		 * @private
		 */

		function fnLogDetails ( ) {
			var sBrowser = sap.ui.Device.browser.name;
			var _sBrowserFullName = null;
			var sBrowserVersion = sap.ui.Device.browser.versionStr;

			$.sap.log.info ( "SAP SPL Startup", "Application running from host" + document.URL, "SAPSCL" );
			
			(function ( ) { /*
			 * Loop through base sdk browser model and print the
			 * version information for diagnostics
			 */
				var _tempBrowserInfoString = "";
				for ( var sKey in sap.ui.Device.browser ) {
					if ( sap.ui.Device.browser.hasOwnProperty ( sKey ) ) {
						_tempBrowserInfoString += sKey + ":" + sap.ui.Device.browser[sKey] + "\n";
					}
				}

				$.sap.log.info ( "Browser version", JSON.stringify ( _tempBrowserInfoString ), "SAPSCL" );

			} ( ));

			if ( navigator ) {
				if ( navigator.userAgent ) {
					_sBrowserFullName = navigator.userAgent;
				} else {
					$.sap.log.fatal ( "Navigator support", "Navigator User agent not supported. Some functionalities might suffer", "SAPSCL" );
				}
			} else {
				$.sap.log.fatal ( "Navigator support", "Navigator not supported. Some functionalities might suffer", "SAPSCL" );
			}

			$.sap.log.info ( "Browser identified", (navigator) ? ((navigator.userAgent) ? navigator.userAgent : "Navigator unsupported. Error") : "Navigator Not supported. Fatal", "SAPSCL" );

			/* Checks whether it is Desktop or Mobile device */
			if ( sap.ui.Device.browser.mobile !== undefined && sap.ui.Device.browser.mobile !== null ) {

				if ( sap.ui.Device.browser.mobile.constructor === Boolean ) {

					if ( sap.ui.Device.browser.mobile ) {

						jQuery.sap.log.info ( "Browser Support", "Application is running on a Mobile Device", "SAPSCL" );

						if ( sap.ui.Device.os.name === "Android" ) {

							switch ( sBrowser ) {
								case "cr":
									jQuery.sap.log.info ( "Browser Support", "Google Chrome, Version " + sBrowserVersion + "\t" + _sBrowserFullName, "SAPSCL" );
									break;

								case "an":
									jQuery.sap.log.info ( "Browser Support", "Android stock browser, Version " + sBrowserVersion + "\t" + _sBrowserFullName, "SAPSCL" );
									break;

								default:
									jQuery.sap.log.fatal ( "Browser Support", "Unsupported Browser:" + sBrowserVersion + "\t" + _sBrowserFullName, "SAPSCL" );

									/*
									 * When browser is not one of the above or a
									 * mobile browser, break and exit
									 */
									handleBrowserUnsupportedExceptions ( _sBrowserFullName );
									throw new Error ( "Browser is not supported" );
							}
						} else if ( sap.ui.Device.os.name === "iOS" ) {
							switch ( sBrowser ) {

								case "sf":
									jQuery.sap.log.info ( "Browser Support", "Safari, Version " + sBrowserVersion + "\t" + _sBrowserFullName, "SAPSCL" );
									break;

								default:
									jQuery.sap.log.fatal ( "Browser Support", "Unsupported Browser:" + sBrowserVersion + "\t" + _sBrowserFullName, "SAPSCL" );

									/*
									 * When browser is not one of the above or a
									 * mobile browser, break and exit
									 */
									handleBrowserUnsupportedExceptions ( _sBrowserFullName );
									throw new Error ( "Browser is not supported" );
							}
						} else {
							jQuery.sap.log.fatal ( "Browser Support", "Unsupported Browser:" + sBrowserVersion + "\t" + _sBrowserFullName, "SAPSCL" );
						}

					} else {

						jQuery.sap.log.info ( "Browser Support", "Application is running on a Desktop", "SAPSCL" );

						/* Checks the Browser Type */
						if ( sBrowser !== undefined && sBrowser !== null ) {
							if ( sBrowser.constructor === String && sBrowser.length === 2 ) {
								switch ( sBrowser ) {
									case "cr":
										jQuery.sap.log.info ( "Browser Support", "Google Chrome, Version " + sBrowserVersion + "\t" + _sBrowserFullName, "SAPSCL" );
										break;

									case "ff":
										jQuery.sap.log.info ( "Browser Support", "FireFox, Version " + sBrowserVersion + "\t" + _sBrowserFullName, "SAPSCL" );
										break;

									case "sf":
										jQuery.sap.log.info ( "Browser Support", "Safari, Version " + sBrowserVersion + "\t" + _sBrowserFullName, "SAPSCL" );
										break;

									case "an":
										jQuery.sap.log.info ( "Browser Support", "Android stock browser, Version " + sBrowserVersion + "\t" + _sBrowserFullName, "SAPSCL" );
										break;

									case "ie":
										jQuery.sap.log.info ( "Browser Support", "Internet Explorer, Version " + sBrowserVersion + "\t" + _sBrowserFullName, "SAPSCL" );
										break;

									default:
										jQuery.sap.log.fatal ( "Browser Support", "Unsupported Browser:" + sBrowserVersion + "\t" + _sBrowserFullName, "SAPSCL" );

										/*
										 * When browser is not one of the above
										 * or a mobile browser, break and exit
										 */
										handleBrowserUnsupportedExceptions ( _sBrowserFullName );

										throw new Error ( "Browser is not supported" );
								}
							} else {
								jQuery.sap.log.fatal ( "Browser Support", "Fatal Type Error while checking for browser support.", "SAPSCL" );
								throw new TypeError ( );
							}
						} else {
							handleBrowserUnsupportedExceptions ( _sBrowserFullName );
							throw new Error ( "Browser is not supported" );
						}

					}

				} else {
					jQuery.sap.log.fatal ( "Browser Support", "Unsupported Browser:" + sBrowserVersion + "\t" + _sBrowserFullName, "SAPSCL" );
					handleBrowserUnsupportedExceptions ( _sBrowserFullName );
					throw new TypeError ( );

				}

			} else {
				jQuery.sap.log.fatal ( "Browser Support", "Unsupported Browser:" + sBrowserVersion + "\t" + _sBrowserFullName, "SAPSCL" );
				handleBrowserUnsupportedExceptions ( _sBrowserFullName );
				throw new ReferenceError ( );

			}

			/* Checks for localStorage and sessionStorage */
			if ( window ) {

				if ( !window.localStorage ) {

					jQuery.sap.log.error ( "Browser Check", "Local Storage not supported by this browser. Some Core functionalitites might not work", "SAPSCL" );

					throw new Error ( "Your Browser does not support localStorage" );

				} else if ( !window.sessionStorage ) {

					jQuery.sap.log.error ( "Browser Check", "Session Storage not supported by this browser", "SAPSCL" );

					throw new Error ( "Your Browser does not support sessionStorage" );

				}

			} else {

				jQuery.sap.log.fatal ( "Browser Check", "Window object not supported. Critical features might fail", "SAPSCL" );

				throw new Error ( "Your Browser does not support window object" );

			}

			$.sap.log.info ( "jQuery Check", "Found version:" + $.fn.jquery, "SAPSCL" );

			$.sap.log.info ( "SCL Locale Check", "Running in Locale: " + sap.ui.getCore ( ).getConfiguration ( ).getLocale ( ).getLanguage ( ), "SAPSCL" );

		}

		/**
		 * @description Internal function that makes an Ajax call to get JSON object(object containing service url) and maintains it locally
		 * @function
		 * @private
		 * @since 1.0
		 * @param loadAppsOnDone {Function} Callback. To be called once loading of applications is done.
		 * @returns void
		 */

		function storeAllServiceUrls ( loadAppsOnDone ) {
			jQuery.ajax ( {

				type : "get",

				url : "./config/Services.json",

				dataType : "json",

				async : true,

				cache : false
			/* CSNFIX: SEC394808 2014 */
			} ).done ( function ( oUrls ) {

				var oServiceUrls = oUrls;
				oSapSplUtils.setServiceMetadata ( oServiceUrls );
				loadAppsOnDone ( );

				jQuery.sap.log.info ( "Service Initializer", "Application configuration fetched successfully", "SAPSCL" );
			} ).fail ( function ( ) {
				jQuery.sap.log.error ( "Startup Error", "Failure of storeAllServiceUrls() function's service call", "SAPCL" );
			} );
		}
		/**
		 * @private
		 * @internal
		 * @description The core function responsible for setting models on startup of application Reads the allowed tiles list from utils Reads the
		 *              services metadata from utils Compares allowed appID with usedBy of services.json OData model only for allowed up instantiated.
		 *              Model set on core through namedModel parameter of services.json
		 * @returns void
		 * @since 1.0
		 */

		function setNamedModelsOnStartup ( ) {

			splReusable.libs.SplTracer.trace ( 0, "Startup setNamedModels" );

			var oServiceRepository = oSapSplUtils.getServiceMetadata ( SapSplEnums.RootApp, false );

			var oRootModel = new splModels.odata.ODataModel ( {
				url : oSapSplUtils.getServiceMetadata ( SapSplEnums.RootApp, true ),
				json : true,
				headers : {
					"Cache-Control" : "max-age=0",
					"Content-Type":"application/json;charset=UTF-8"
				},
				tokenHandling : true,
				withCredentials : false,
				loadMetadataAsync : false,
				handleTimeOut : true,
				defaultCountMode : sap.ui.model.odata.CountMode.Both,
				numberOfSecondsBeforeTimeOut : 10000
			} );

			var aTilesList = oSapSplUtils.getAllowedTilesList ( );

			/* HOTFIX In case of empty UIApps table. Needed for a graceful exit */

			if ( aTilesList.length === null || aTilesList.length === undefined ) {
				// UIApps is empty. Display proper console message. This could
				// be authorization related
				jQuery.sap.log.error ( "Empty applications list. Authorizations need to be verfied" );
				return;
			}

			/**
			 * @internal
			 * @private
			 * @since 1.0
			 * @description Private handler to set OData Model
			 */

			function __setModels__ ( oRootModel, modelUrl, namedModels ) {

				if ( namedModels === undefined || namedModels === null || !oSapSplUtils.IsValidArray ( namedModels ) ) {

					throw new splReusable.exceptions.InvalidArrayException ( {
						messge : "Invalid Aray Usage",
						source : "Startup",
						options : {
							severity : SapSplEnums.fatal
						}
					} );

				}

				if ( namedModels.hasOwnProperty ( "length" ) && namedModels.length > 0 ) {
					for ( var iNamedModelCount = 0 ; iNamedModelCount < namedModels.length ; iNamedModelCount++ ) {

						var copiedModel = {};
						copiedModel = $.extend ( true, {}, oRootModel );
						sap.ui.getCore ( ).setModel ( copiedModel, namedModels[iNamedModelCount] );

					}
				}

			}

			for ( var iTilesList = 0 ; iTilesList < aTilesList.length ; iTilesList++ ) {

				for ( var jServiceList = 0 ; jServiceList < oServiceRepository.usedBy.length ; jServiceList++ ) {

					if ( aTilesList[iTilesList].AppID === oServiceRepository.usedBy[jServiceList].appId ) {

						__setModels__ ( oRootModel, oServiceRepository.value, oServiceRepository.usedBy[jServiceList].namedModels );

					}

				}

			}

			/* The core Utils Data Model */
			var oUtilsDataModel = new splModels.odata.ODataModel ( {
				url : oSapSplUtils.getServiceMetadata ( "utils", true ),
				json : true,
				headers : {
					"Cache-Control" : "max-age=0"
				},
				tokenHandling : true,
				withCredentials : false,
				loadMetadataAsync : true,
				handleTimeOut : true,
				numberOfSecondsBeforeTimeOut : 10000
			} );

			sap.ui.getCore ( ).setModel ( oUtilsDataModel, "sapSplUtilsModel" );

		}

		/*
		 * Method to create a JSONModel for handling back navigation button
		 * visibility across the application. Making the model as a named model,
		 * and setting the same to the core, to ensure easy binding in all
		 * master pages.
		 */

		function createBackButtonVisibilityJSONModel ( aUIAppsData ) {

			splReusable.libs.SplTracer.trace ( "0", "Startup" );

			if ( aUIAppsData && aUIAppsData.constructor === Array ) {

				var oBackButtonVisibilityData = {}, oModel = null;

				for ( var i = 0 ; i < aUIAppsData.length ; i++ ) {

					oBackButtonVisibilityData[aUIAppsData[i]["AppID"]] = false;

				}

				oModel = new sap.ui.model.json.JSONModel ( oBackButtonVisibilityData );

				sap.ui.getCore ( ).setModel ( oModel, "SapSplBackButtonVisibilityModel" );

				jQuery.sap.log.info ( "SCLUI", "Nav button state set", "SAPSCL" );

			}
			splReusable.libs.SplTracer.trace ( "1", "Startup" );
		}

		/* Get company details. To be used in Split App Base Controllers */

		function getCompanyDetails ( callBack, aUIAppsData ) {

			jQuery.ajax ( {

				url : oSapSplUtils.getServiceMetadata ( SapSplEnums.RootApp, true ) + "/MyOrganization/?$format=json&$expand=Owner",

				type : "Get",

				contentType : "application/json",

				success : function ( oResult ) {

					oSapSplUtils.setCompanyDetails ( oResult.d.results[0] );

					if ( oResult.d.results[0].BuPaReplication === 1 || oResult.d.results[0].BuPaReplication === 4 ) {
						sap.m.MessageBox.show ( oSapSplUtils.getBundle ( ).getText ( "ACC_CREATION_STATUS_FAILED", oResult.d.results[0].Organization_Name ), {
							title : oSapSplUtils.getBundle ( ).getText ( "ACC_STATE_ERROR" ),
							icon : sap.m.MessageBox.Icon.ERROR,
							actions : [sap.m.MessageBox.Action.CLOSE],
							onClose : function ( ) {}
						} );
					} else if ( oResult.d.results[0].BuPaReplication === 3 ) {
						sap.m.MessageBox.show ( oSapSplUtils.getBundle ( ).getText ( "ACC_CREATION_STATUS_PENDING", oResult.d.results[0].Organization_Name ), {
							title : oSapSplUtils.getBundle ( ).getText ( "ACC_STATE_WARNING" ),
							icon : sap.m.MessageBox.Icon.WARNING,
							actions : [sap.m.MessageBox.Action.CLOSE],
							onClose : function ( ) {}
						} );
					}

					createBackButtonVisibilityJSONModel ( aUIAppsData );

					callBack ( );

				}

			} );

		}

		/* Call Direct App Launcher. Bypass home page launch */

		function CallDAL ( ) {

			jQuery.sap.includeScript ( "./startup/DirectAppLauncher.js", "dalLoaderScript", function ( ) {

			}, function ( ) {

				jQuery.sap.log.error ( "DAL Load failed" );

			} );

		}

		/* Regular UI launch */

		function LoadDefaultUI ( ) {

			sap.ui.getCore ( ).byId ( "sapSplBaseApplication" ).addPage ( new sap.ui.view ( {

				viewName : "splView.tileContainer.MasterTileContainer",

				id : "splView.tileContainer.MasterTileContainer",

				type : sap.ui.core.mvc.ViewType.XML

			} ) );

			sap.ui.getCore ( ).byId ( "sapSplBaseApplication" ).setInitialPage ( "splView.tileContainer.MasterTileContainer" );

		}

		/**
		 * @private
		 * @internal
		 * @description To fetch the list of apps from UIApps, compare with available allowed apps and load DAL or Default UI
		 * @since 1.0
		 * @returns void
		 */

		function getAppsList ( ) { /*
		 * We are only querying for UIApps. No sense
		 * in creating OData model and performing
		 * read. Hence ajaxing
		 */

			/*
			 * CSNFIX 658207 2014 For setting sequence of tiles. Sorting on
			 * SequenceNumber ascending
			 */
			var sServiceUrl = oSapSplUtils.getServiceMetadata ( SapSplEnums.RootApp, true );
			var oModel = new sap.ui.model.odata.ODataModel ( sServiceUrl, true );

			var oData = oModel.read ( "/UIApps", undefined, ["$expand=AppConfig&$orderby=SequenceNumber asc"], false, function _OnSuccess ( oResult ) {
				if ( oResult && oResult.results.length === 0 ) {
					jQuery.sap.require ( "sap.ca.ui.message.message" );
					oSapSplUtils.setStartupError ( true );
					sap.ca.ui.message.showMessageBox ( {
						type : sap.ca.ui.message.Type.ERROR,
						message : oSapSplUtils.getBundle ( ).getText ( "APP_STARTUP_FAIL_ON_INIT" ),
						details : oSapSplUtils.getErrorMessagesfromErrorPayload ( oResult )["ufErrorObject"]
					}, function ( ) {
						// Handle dialog close here
						jQuery.sap.log.fatal ( "Startup Error", "Application startup failed with missing privileges", "SAPSCL" );
						return;
					} );

				} else {
					oSapSplUtils.setAllowedTilesList ( oResult.results );
					setNamedModelsOnStartup ( );
					sap.ui.getCore ( ).setModel ( new sap.ui.model.json.JSONModel ( ), "sapSplAppConfigDataModel" );
					oSapSplUtils.setStartupError ( false );
					getCompanyDetails ( function ( ) {
						if ( jQuery.sap.getUriParameters ( ).get ( "goto" ) && oSapSplUtils.checkAppPermission ( jQuery.sap.getUriParameters ( ).get ( "goto" ) ) ) {
							CallDAL ( );
						} else {
							LoadDefaultUI ( );
						}
					}, oResult.results );
				}

			}, function _OnError ( oError ) {
				jQuery.sap.log.error ( "UI Apps load failed with error: " + oError.toString ( ) );
			} );

		}

		jQuery.sap.log.info ( "Using SAPUI5 version: " + sap.ui.version.toString ( ), "Supported version", "SAP SPL Startup" );

		/* Internal application launched from iframe check */

		function loadAppPostBaseChecks ( ) {

			(function ( ) {

				/* Store the map of query parameters */
				for ( var key in $.sap.getUriParameters ( ).mParams ) {

					if ( $.sap.getUriParameters ( ).mParams.hasOwnProperty ( key ) ) {
						oSapSplUtils.setInQueryParameterMap ( key, $.sap.getUriParameters ( ).mParams[key][0] );
					}

				}

			} ( ));

			(function ( ) { /*
			 * Call Help configuration (asynchronously) for type
			 * of help to display
			 */
				var sUrl;
				if ( jQuery.sap.getUriParameters ( ).get ( "spl-mock-mode" ) == "true" ) {
					sUrl = "model/app/helpType.json";
				} else {
					sUrl = oSapSplUtils.getFQServiceUrl ( "/sap/spl/xs/app/services/helpType.xsjs" );
				}

				$.ajax ( {
					url : sUrl,
					success : function ( oResult ) {
						$.sap.log.info ( "SAP Connected Logistics Help", "Help Info type fetched: " + oResult, "SAPSCL" );

						/*
						 * Set the help type here. Get the help type in button
						 * press in SplHelpHandler
						 */
						oSapSplUtils.setHelpType ( oResult );
					},
					error : function ( ) {
						$.sap.log.warning ( "SAP Connected Logistics Help", "Unable to fetch Help Type. Defaulting to HTML", "SAPSCL" );
					}
				} );
			} ( ));

			sap.ui.getCore ( ).setModel ( new sap.ui.model.json.JSONModel ( {
				helpVisible : false
			} ), "helpModel" );

			/* Logger at entry point for user agent, browser type etc. */
			fnLogDetails ( );

			/* Function to set the system type */
			oSapSplUtils.fnSetSystemType ( );

			/* Set UI load in trace mode for logging */
			if ( $.sap.getUriParameters ( ).get ( "spl-trace" ) === "on" ) {

				jQuery.sap.log.setLevel ( jQuery.sap.log.Level.TRACE );

			}

			(function ( ) {

				/*
				 * Register body unload event to handle Alert on back button
				 * press
				 */

				/*
				 * Register for page nav prompt
				 */

				$ ( window ).bind ( "beforeunload", function ( ) {
					/** *****Check for source of Logout************** */
					/** **** Avoid duplication of prompt************ */
					/** *****when logout is initiated from app****** */
					/** ******************************************* */
					if ( oSapSplUtils.sLO4S === "nav" ) {
						return "Save your changes before your proceed";
					}

				} );

				/* On successful page nav terminate session */
				$ ( window ).bind ( "unload", function ( ) {
					/** *****Check for source of Logout************** */
					/** **** Avoid duplication of prompt************ */
					/** *****when logout is initiated from app****** */
					/** ******************************************* */
					if ( oSapSplUtils.sLO4S === "nav" ) {
						splReusable.libs.SapSplLogoutHandler.doLogout ( function ( ) {}, function ( ) {} );
					}

				} );

			} ( ));

			/*
			 * Load and instantiate App Container first
			 */
			jQuery.sap.includeScript ( encodeURIComponent ( "startup/AppContainer.js" ), "appContainerLoader", function ( ) {

				splReusable.libs.SplTracer.trace ( 0, "SPL Startup Pre Unified Shell creation" );

				jQuery.sap.includeScript ( encodeURIComponent ( "startup/SplUnifiedShellCreator.js" ), "unifiedShellScript", function ( ) {

					// Unified Shell is loaded. Proceed with application launch
					/*********************************************************************************************************************************
					 * ************************************************************************* *Invoke all functions from one central location.
					 * Easier for readability** *************************************************************************
					 ********************************************************************************************************************************/

					/*
					 * Load services.json, set service metadata in Utils, on
					 * completion, call internal function to get list of apps,
					 * check for permissions and handle DAL/Default UI load
					 */
					storeAllServiceUrls ( function ( ) {

						/*
						 * Anonymous self executing to ensure that csrf token is
						 * set in startup
						 */
						if ( jQuery.sap.getUriParameters ( ).get ( "spl-mock-mode" ) !== "true" ) {
							(function ( ) {

								jQuery.ajax ( {

									url : oSapSplUtils.getServiceMetadata ( "token", true ),

									cache : false,

									beforeSend : function ( jqXhr ) {

										jqXhr.setRequestHeader ( "X-CSRF-Token", "Fetch" );

									},

									success : function ( oResult, textStatus, jqXhr ) {

										oSapSplUtils.setCSRFToken ( jqXhr.getResponseHeader ( "X-CSRF-Token" ) );

									},

									error : function ( jqXhr, textStatus, errorThrown ) {

										jQuery.sap.log.fatal ( "CSRF Token Fetch Error", "Error occured while fetching token. \n" + errorThrown, "App Startup" );

									}

								} );

							} ( ));
						}

						checkForBuPaExistence ( function ( oData ) {
							/*
							 * condition oData.data["isSAML"] for checking if a
							 * valid BuPa exists
							 */
							if ( oData.data && oData.data !== null && (oData.data["isSAML"] !== undefined || oData.data["firstName"] || oData.data["lastName"] || oData.data["email"]) ) {

								$.sap.log.info ( "SPL Startup", "User logged in as " + JSON.stringify ( oData.data.email ), "SAPSCL" );

								$ ( "#splLoggedOnUser" ).html ( "<h5><i>" + "Logging in " + oData.data.email + "</i></h5>" );

								/*
								 * Set logged on user details (email and
								 * first/last name) to display in header.
								 * Concrete implementation in Utils
								 */
								$.sap.log.info ( "SPL Startup", "Setting logged on user details on Utility reuse", "SAPSCL" );

								oSapSplUtils.setLoggedOnUserDetails ( oData.data );

								/*
								 * Get Logged on user profile details and merge
								 * into loggedOnUserModel
								 */
								getMyProfileDetails ( function ( result ) {

									if ( result === "ERROR" ) {

										/*
										 * Ensure we display an error handler
										 * here
										 */
										jQuery.sap.log.fatal ( "User Profile Check", "Unable to fetch user profile information. Some operations might suffer", "SAPSCL" );
										return;

									}
									applyThemePreference ( function ( ) {
										$.sap.log.info ( "Theme applied" );

										/*
										 * Load Unified Shell style only after
										 * the base theme is applied
										 */
										splReusable.libs.SapSplStyleSheetLoader.loadStyle ( "./resources/styles/splUnifiedShellHeaderSearch", "css", "splUnifiedShellSearch", function ( ) {
											jQuery.sap.log.info ( "Loaded SPL Unified Shell styles in " + sap.ui.getCore ( ).getConfiguration ( ).getTheme ( ) );
										}, function ( ) {
											jQuery.sap.log.error ( "Failed to load SPL Unified Shell styles" );
										} );
									} );
								} );

								/*
								 * !!!!Main tile preparation and rendering
								 * (handles DAL too)!!!!!
								 */
								$.sap.log.info ( "SPL Startup", "Getting supported Apps List", "SAPSCL" );
								getAppsList ( );

								/* Fetch first 20 UUIDs */
								$.sap.log.info ( "SPL Startup", "Fetching first set of identifiers", "SAPSCL" );
								oSapSplUtils.fetchUUIDs ( );

								/* Finally place the container into the base DIV */
								window["splBaseUnifiedShell"].placeAt ( "content" );

								/* Remove the logged on user DIV */
								if ( $ ( "#splLoggedOnUser" ) ) {
									$ ( "#splLoggedOnUser" ).remove ( );
								}

								// CSN FIX : 0120031469 280582 201
								/*
								 * Fades out the splash screen and places UI
								 * content into the div
								 */
								if ( jQuery ( "#splash-screen" ) ) {
									jQuery ( "#splash-screen" ).fadeOut ( "slow", function ( ) {
										jQuery ( "#splash-screen" ).remove ( );
										if ( oSapSplUtils.fnGetSystemType ( ) === "D" ) {
											$ ( "#sapSplBaseUnifiedShell" ).addClass ( "sapUiSizeCompact" );
										}
									} );
									/*
									 * Initiate handled to set the email of
									 * logged on user during hover on the Shell
									 * Header User Item
									 */
									oSapSplQuerySelectors.getInstance ( ).setHeaderUserNameTooltip ( );
								}

							} else { /*
							 * Handle Abort through error message
							 * and return
							 */
								jQuery.sap.require ( "sap.ca.ui.message.message" );
								oSapSplUtils.setStartupError ( true );
								$.sap.log.error ( "SAP SCL Application Startup", "Startup encountered errors" + oSapSplUtils.getBundle ( ).getText ( "APP_STARTUP_FAIL_ON_INIT" ), "SAPSCL" );
								sap.ca.ui.message.showMessageBox ( {
									type : sap.ca.ui.message.Type.ERROR,
									message : oSapSplUtils.getBundle ( ).getText ( "APP_STARTUP_FAIL_ON_INIT" ),
									details : oData.xhr.statusText
								}, function ( ) {
									// Handle dialog close here
									$ ( "#splashDiv" ).remove ( );

									$ ( ".sapUiBody" ).removeClass ( "sapUiBody" );
									$ ( "#splErrorDiv" ).append ( oData.xhr.responseText );

								} );

								return;
							}
						} );
					} );

					/*********************************************************************************************************************************
					 * ************************************************************************ **************** Invocation of functions
					 * ends*************************** ************************************************************************
					 ********************************************************************************************************************************/
					splReusable.libs.SplTracer.trace ( 1, "SPL Startup Pre Unified Shell creation" );

				}, function ( ) {
					// Abort Application launch. Unified Shell creation failed
					jQuery.sap.log.fatal ( "SPL Startup", "An error occured while trying to create unified shell container", "SAPSCL" );
					return;
				} );

			}, function ( ) {

				jQuery.sap.log.fatal ( "SPL Startup", "Failure while loading App Container", "SAPSCL" );
				return;

			} );
		}

		/* CSNFIX SEC394154 2014 */
		/*
		 * CSNFIX 477126 2014: Strict mode enforced on FF BRWSR. Moving function
		 * invocation after function definition
		 */
		oSapSplUtils.isInIframe ( function ( oResult ) {

			if ( !oResult ) {

				$.sap.log.info ( "SPL Startup", "IFrame check successful", "SAPSCL" );

				loadAppPostBaseChecks ( );

			} else {

				$.sap.log.info ( "SPL Startup", "Invalid container invocation. Aborting", "SAPSCL" );
				sap.ca.ui.message.showMessageBox ( {
					type : sap.ca.ui.message.Type.ERROR,
					message : "Fatal Error",
					details : "Invalid application invocation"
				} );

				throw new Error ( );
				// loadAppPostBaseChecks ( );

			}

		} );

	} catch (e) {

		if ( e.constructor === ReferenceError ( ) ) {

			jQuery.sap.log.error ( "SPL Startup", (e && e.stack) ? e.stack : "Reference Error in startup", "SAPSCL" );

		} else if ( e.constructor === TypeError ( ) ) {

			jQuery.sap.log.error ( "SPL Startup", (e && e.stack) ? e.stack : "Reference Error in startup", "SAPSCL" );

		} else {

			jQuery.sap.log.error ( "SPL Startup", (e && e.message) ? e.message : "Error", "SAPSCL" );

		}

	}
} ( ));
