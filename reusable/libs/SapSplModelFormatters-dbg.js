/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
/*
 * Static methods to handle Odata formatters
 */
jQuery.sap.declare ( "splReusable.libs.SapSplModelFormatters" );

/**
 * @namespace splReusable.libs.SapSplModelFormatters
 */
splReusable.libs.SapSplModelFormatters = function ( ) {

};

/**
 * @description Static function to return "pending" label depending on RequestStatus field in service
 * @static
 * @function
 * @since 1.0
 * @param {string} Value from the RequestStatus field in service
 * @param {string} Value from the Status field in service
 * @returns {string} pending|null
 * @example splReusable.libs.SapSplModelFormatters.showPendingLabel("0");//If pending status is true
 */
splReusable.libs.SapSplModelFormatters.showPendingLabel = function ( fieldValueFromService1, fieldValueFromService2 ) {
	var sPendingLabelValue = oSapSplUtils.getBundle ( ).getText ( "PENDING_LABEL_FOR_LIST" );
	if ( fieldValueFromService1 === "1" ) {
		if ( fieldValueFromService2 === "0" ) {
			return sPendingLabelValue;
		} else {
			return "";
		}
	} else {
		return sPendingLabelValue;
	}
};

/*****************************************************************************************************************************************************
 * @static
 * @description formatter method for showing the display name in proper format (surname , givenName).
 * @param fName givenName , lName surname.
 * @returns {string} concatenation of lName and fName.
 * @since 1.0
 * @example splReusable.libs.SapSplModelFormatters.displayNameFormatter("a","b");//returns b a
 */
splReusable.libs.SapSplModelFormatters.displayNameFormatter = function ( fName, lName ) {
	try {
		if ( lName === undefined || fName === undefined ) {
			throw Error ( );
		} else {
			if ( lName.length === 0 || lName.length === null ) {
				throw Error ( );
			} else {
				if ( fName.length === 0 || fName === null ) {
					return lName;
				} else {
					return lName + ", " + fName;
				}
			}
		}

	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( e.message, "LastName cannot be undefined/null", "SapSplModelFormatters.js" );
		}
	}
};

/*****************************************************************************************************************************************************
 * @description formatter method for showing the date in proper format.
 * @param sDate date from backend.
 * @returns {Date} new Date()
 * @static
 * @since 1.0
 * @requires sap.ui.core.format.DateFormat
 * @example splReusable.libs.SapSplModelFormatters.showFormattedDate(sDate);//returns new Date(sDate)
 */
/***
 */
splReusable.libs.SapSplModelFormatters.showFormattedDate = function ( sDate ) {
	try {
		if ( sDate ) {/* CSNFIX 321158 2014 */
			return sap.ui.core.format.DateFormat.getDateInstance ( {
				pattern : "MMM dd, yyyy",
				style : "short"
			}, sap.ui.getCore ( ).getConfiguration ( ).getLocale ( ) ).format ( new Date ( sDate ), true );

		} else {

			throw new Error ( );

		}

	} catch (e) {

		if ( e.constructor === Error ( ) ) {

			jQuery.sap.log.error ( e.message, "Date is undefined", "SapSplModelFormatters.js" );

		}

	}

};

/**
 * @description Static function to return the feed message tooltip
 * @static
 * @since 1.0
 * @param {String} sRecipientName recipient Name.
 * @param {Number} iCount number of recipients.
 * @returns {String} tooltip for the message in live feed.
 */
splReusable.libs.SapSplModelFormatters.returnFeedMessageTooltip = function ( sRecipientName, iCount ) {
	if ( iCount && iCount === 1 ) {
		if ( sRecipientName === undefined || sRecipientName === null ) {
			if ( iCount !== null ) {
				return oSapSplUtils.getBundle ( ).getText ( "FEEDLIST_MESSAGE_SINGLE_RECIPIENT_TOOLTIP", [iCount] );
			} else {
				return oSapSplUtils.getBundle ( ).getText ( "FEEDLIST_MESSAGE_TOOLTIP", [""] );
			}
		} else {
			return oSapSplUtils.getBundle ( ).getText ( "FEEDLIST_MESSAGE_TOOLTIP", [sRecipientName] );
		}
	} else {
		if ( iCount !== null ) {
			return oSapSplUtils.getBundle ( ).getText ( "FEEDLIST_MESSAGE_MULTIPLE_RECIPIENTS_TOOLTIP", [iCount] );
		} else {
			return "";
		}
	}
};

/**
 * @description Static function to return the visibility of Users page edit button
 * @static
 * @since 1.0
 * @param {Boolean} Value from the isEditable field.
 * @param {Boolean} Value of the showFooterButton field.
 * @returns {Boolean} Visible value for the edit button
 */
splReusable.libs.SapSplModelFormatters.visibilityOfUsersEditButton = function ( bIsEditable, bShowFooterButtons ) {
	if ( bShowFooterButtons && bShowFooterButtons === true ) {
		if ( bIsEditable && bIsEditable === true ) {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
};

/*****************************************************************************************************************************************************
 * @description formatter method for showing the time in proper format.
 * @param sDate time from backend.
 * @returns {Date} new Date()
 * @static
 * @since 1.0
 * @requires sap.ui.core.format.DateFormat
 * @example splReusable.libs.SapSplModelFormatters.showFormattedTime(sTime);//returns new Date(sTime)
 */
/***
 */
splReusable.libs.SapSplModelFormatters.showFormattedTime = function ( sTime ) {
	try {
		if ( sTime ) { /* CSNFIX 321158 2014 */
			return sap.ui.core.format.DateFormat.getTimeInstance ( {
				pattern : "HH:mm:ss",
				style : "long"
			}, sap.ui.getCore ( ).getConfiguration ( ).getLocale ( ) ).format ( new Date ( sTime ), false ); // Fix
			// on
			// 02.05.2015.
			// Logger
			// shows
			// UTC.
			// bUtc
			// being
			// set
			// to false

		} else {

			throw new Error ( );

		}

	} catch (e) {

		if ( e.constructor === Error ( ) ) {

			jQuery.sap.log.error ( e.message, "Date is undefined", "SapSplModelFormatters.js" );

		}

	}

};

/**
 * @description function to return title label for form of Edit/Invite scenario of Business Partner
 * @static
 * @since 1.0
 * @param {string} value from Role.description field in service or based on Role type selected to create Business partner
 * @return {string} Role obtained from input concatenated with text "Information"
 * @example splReusable.libs.SapSplModelFormatters.formatterForTitleOfForm("Platform Service provider");
 */
splReusable.libs.SapSplModelFormatters.formatterForTitleOfForm = function ( sTitle ) {
	try {
		if ( sTitle ) {
			return oSapSplUtils.getBundle ( ).getText ( "NEW_BUSINESS_PARTNER_LIST_TITLE", sTitle );
		} else {
			throw new Error ( );
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( e.message, "Title cannot be null", "SapSplModelFormatters.js" );
		}
	}

};

/**
 * @description Static function to add a style class to the StandardListItem, which will give the coloration to the icon.
 * @static
 * @since 1.0
 * @param {string} Value from the Status field in service ("Active", "InActive", "Deregistered")
 * @returns {string} icon path , with added styleClass to the listItem.
 * @example splReusable.libs.SapSplModelFormatters.truckcolor("Active");
 */
splReusable.libs.SapSplModelFormatters.truckcolor = function ( val ) {
	if ( val === "A" ) {
		this.addStyleClass ( "green" );
	} else if ( val === "I" ) {
		this.addStyleClass ( "red" );
	} else {
		this.addStyleClass ( "gray" );
	}
	return "sap-icon://car-rental";
};

/**
 * @description Static function to return the info State of the StandardListItem
 * @static
 * @since 1.0
 * @param {string} Value from the Status field in service ("Active", "InActive", "Deregistered")
 * @returns {string} either error or success , which will decide the coloration of the info field.
 * @example splReusable.libs.SapSplModelFormatters.infoState("I");
 */
splReusable.libs.SapSplModelFormatters.infoState = function ( val ) {
	if ( val === "A" ) {
		return "Success";
	} else if ( val === "I" ) {
		return "Error";
	} else {
		return "Warning";
	}
};

/**
 * @description Static function to return the info Label of the Trucks StandardListItem
 * @static
 * @since 1.0
 * @param {string} Value from the Status field in service ("Active", "InActive", "Deregistered")
 * @param {string} Value from the isDeleted field in service ("0"-Active/Inactive, "1"-Deregistered)
 * @returns {string} Either Active or Inactive if isDeleted is '0', else "".
 * @example splReusable.libs.SapSplModelFormatters.getStatusLabel("Active", "0");
 */
/* CSNFIX : 0120031469 620158 2014 */
splReusable.libs.SapSplModelFormatters.getStatusLabel = function ( sStatus, sIsDeleted ) {
	if ( sIsDeleted !== undefined && sIsDeleted !== null ) {
		if ( sIsDeleted === "0" ) {
			return sStatus;
		} else {
			return "";
		}
	}
};

/**
 * @description Static function to return the description property of the StandardListItem
 * @static
 * @since 1.0
 * @param {string} Value from the Description field in service
 * @returns {string} either value or single spaced string.
 * @example splReusable.libs.SapSplModelFormatters.descriptionField(null);
 */
splReusable.libs.SapSplModelFormatters.descriptionField = function ( sDesc ) {
	if ( sDesc ) {
		return sDesc;
	} else {
		return "\t";
	}
};

/**
 * @description If ImageUrl is available in model and not null, show it or show default user icon
 * @param {string} imageUrl The URL for the image to be displayed
 * @returns {string} imageUrl or default icon based on presence of value in the ImageUrl field
 * @static
 */
splReusable.libs.SapSplModelFormatters.getImageUrlForUser = function ( imageUrl ) {

	if ( arguments && arguments.length > 0 ) {

		if ( imageUrl && imageUrl !== null && imageUrl.constructor === String ) {

			return imageUrl; // Valid Image URL
		} else {

			/* CSNFIX 321159 2014 */
			return null; // ImageUrl field mapping is empty. Return
			// sap-icon://person-placeholder
		}

	} else {

		throw new splReusable.exceptions.MissingParametersException ( {
			message : "Invalid API usage. Expected argument",
			source : "getImageUrl-ModelFormatter",
			options : {
				severity : SapSplEnums.fatal
			}
		} );

	}

};

/**
 * @description If ImageUrl is available in model and not null, show it or show default organization icon
 * @param {string} imageUrl The URL for the image to be displayed
 * @returns {string} imageUrl or default icon based on presence of value in the ImageUrl field
 * @static
 * @since 1.0
 */
splReusable.libs.SapSplModelFormatters.getImageUrlForOrganization = function ( imageUrl ) {

	if ( arguments && arguments.length > 0 ) {

		if ( imageUrl && imageUrl !== null && imageUrl.constructor === String ) {

			return imageUrl; // Valid Image URL
		} else {

			/* CSNFIX 321159 2014 */
			return null; // ImageUrl field mapping is empty. Return
			// sap-icon://person-placeholder
		}

	} else {

		throw new splReusable.exceptions.MissingParametersException ( {
			message : "Invalid API usage. Expected argument",
			source : "getImageUrl-ModelFormatter",
			options : {
				severity : SapSplEnums.fatal
			}
		} );

	}

};

/**
 * @description If ImageUrl is available in model and not null, show it or show default truck icon
 * @param {string} imageUrl The URL for the image to be displayed
 * @returns {string} imageUrl or default icon based on presence of value in the ImageUrl field
 * @static
 * @since 1.0
 */
splReusable.libs.SapSplModelFormatters.getImageUrlForVehicle = function ( imageUrl ) {
	if ( arguments && arguments.length > 0 ) {
		if ( imageUrl && imageUrl !== null && imageUrl.constructor === String ) {
			return imageUrl; // Valid Image URL
		} else {
			return "sap-icon://shipping-status"; // ImageUrl field mapping is
			// empty. Return
			// sap-icon://car-rental
		}
	} else {
		throw new splReusable.exceptions.MissingParametersException ( {
			message : "Invalid API usage. Expected argument",
			source : "getImageUrl-ModelFormatter",
			options : {
				severity : SapSplEnums.fatal
			}
		} );
	}
};

/*****************************************************************************************************************************************************
 * @static
 * @description formatter method for showing the display name of Business partner in proper format (surName , givenName).
 * @param fName givenName , lName surname.
 * @returns {string} concatenation of lName and fName.
 * @since 1.0
 * @example splReusable.libs.SapSplModelFormatters.displayNameFormatterBP("a","b");//returns b,a
 */
splReusable.libs.SapSplModelFormatters.displayNameFormatterBP = function ( fName, lName ) {
	try {
		if ( lName === undefined || fName === undefined ) {
			throw Error ( );
		} else {
			if ( (lName === null || lName.length === 0) && (fName === null || fName.length === 0) ) {
				return "";
			} else {
				if ( lName === null || lName.length === 0 ) {
					return fName;
				} else {
					if ( fName === null || fName.length === 0 ) {
						return lName;
					} else {
						return lName + ", " + fName;
					}
				}
			}
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( e.message, "FirstName or LastName cannot be Undefined", "SapSplModelFormatters.js" );
		}
	}
};

/**
 * @descriotion To get the date object from an EDM.Time object in OData
 * @static
 * @since 1.0
 * @example splReusable.libs.SapSplModelFormatters.getDateFromString();
 * @param {string} oValue
 * @returns {string} The converted date (in UTC format)
 */
splReusable.libs.SapSplModelFormatters.getDateFromString = function ( oValue ) {
	if ( oValue ) {

		return sap.ui.core.format.DateFormat.getDateInstance ( {
			pattern : "dd MMMM yyyy hh mm ss",
			style : "short"
		}, sap.ui.getCore ( ).getConfiguration ( ).getLocale ( ) ).format ( new Date ( oValue ), false );
	} else {
		return null;
	}
};

splReusable.libs.SapSplModelFormatters.getDateFromStringForTourProgressDialog = function ( oValue ) {
	if ( oValue ) {
		return sap.ui.core.format.DateFormat.getDateInstance ( {
			pattern : "MMM dd, HH:mm",
			style : "short"
		}, sap.ui.getCore ( ).getConfiguration ( ).getLocale ( ) ).format ( new Date ( oValue ), false );
	} else {
		return null;
	}
};

/**
 * @description To get whether BusinessPartner/Trucks is Editable or not based on isEditable field
 * @static
 * @since 1.0
 * @example splReusable.libs.SapSplModelFormatters.showEditable(1);
 * @param {Number} isEditable
 * @returns {Boolean} True if isEditable is 1 else False
 */
splReusable.libs.SapSplModelFormatters.showEditable = function ( isEditable ) {
	try {

		/* CSNFIX 646894 2014 */
		if ( isEditable !== undefined && isEditable !== null && isEditable.constructor === Number ) {
			return (isEditable === 1);
		} else {
			throw Error ( );
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( "SAP SCL Model Formatter", "isEditable is not number. Error: " + e.message, "SAPSCL" );
		}
	}

};

/**
 * @description To get Truck Status based on isVehicleValid & VehicleStatus fields
 * @static
 * @since 1.0
 * @example splReusable.libs.SapSplModelFormatters.showVehicleStatus("A",1);
 * @param {String} VehicleStatus , {Number} isVehicleValid
 * @returns {Boolean} True if can be Acivated/Deactivated else False
 */
splReusable.libs.SapSplModelFormatters.showVehicleStatus = function ( VehicleStatus, isVehicleValid ) {
	try {
		if ( isVehicleValid.constructor === Number || VehicleStatus.construtor === String ) {
			if ( isVehicleValid === 1 ) {
				if ( VehicleStatus === "A" || VehicleStatus === "I" ) {
					return true;
				} else {
					throw Error ( );
				}
			} else {
				return false;
			}
		} else {
			throw Error ( );
		}

	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( e.message, "showVehicleStatus is not number", "SapSplModelFormatters.js" );
		}
	}

};

/**
 * @description Formatter method, to display title of Edit of Business Partner.
 * @param {string} sValue value of the Organization name.
 * @returns {string} the string to be displayed on the screen "Edit -"sValue.
 * @since 1.0
 */
splReusable.libs.SapSplModelFormatters.showBusinessPartnerEditTitle = function ( sValue ) {
	try {
		if ( sValue.constructor === String ) {
			if ( window.sessionStorage.getItem ( "isEdit" ) === "1" ) {
				if ( sValue ) {
					return oSapSplUtils.getBundle ( ).getText ( "EDIT_TITLE_OF_BUSINESS_PARTNER", sValue );
				}
			}
		} else {
			throw Error ( );
		}

	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( e.message, "Business Partner Edit Title is not string", "SapSplModelFormatters.js" );
		}
	}

};

/**
 * @description Formatter method, to display priority of Incidencts in detail page.
 * @param {string} sPriority value of the priority.
 * @param {string} sPrioDescription description of the priority.
 * @returns {string} the string to be displayed on the screen "Priority -"sValue.
 * @since 1.0
 */
splReusable.libs.SapSplModelFormatters.showIncidentsPriorityWithDescription = function ( sPriority, sPrioDescription ) {
	try {
		if ( sPriority && sPriority.constructor === String && sPrioDescription && sPrioDescription.constructor === String ) {
			return sPriority + " - " + sPrioDescription;
		} else {
			throw Error ( );
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( e.message, "Business Partner Edit Title is not string", "SapSplModelFormatters.js" );
		}
	}
};

/**
 * @description Formatter method, to display priority of Incidencts.
 * @param {string} sValue value of the priority.
 * @returns {string} the string to be displayed on the screen "Priority -"sValue.
 * @since 1.0
 */
splReusable.libs.SapSplModelFormatters.returnIncidentInfoState = function ( sValue ) {
	var flag = null;
	try {
		if ( sValue && sValue.constructor === String ) {
			switch ( sValue ) {
				case "1":
					flag = "Error";
					break;
				case "4":
					flag = "Success";
					break;
				default:
					flag = "Warning";
			}
			return flag;

		} else {
			throw Error ( );

		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( e.message, "Business Partner Edit Title is not string", "SapSplModelFormatters.js" );
		}
	}
};

/**
 * @description Formatter method, to display priority of Message.
 * @param {string} sValue value of the priority.
 * @returns {string} the string to be displayed on the screen "Priority -"sValue.
 * @since 1.0
 */
splReusable.libs.SapSplModelFormatters.returnMessagePriorityText = function ( sValue ) {
	var flag = null;
	try {
		if ( sValue && sValue.constructor === String ) {
			switch ( sValue ) {
				case "1":
					flag = "High";
					break;
				case "2":
					flag = "Medium";
					break;
				case "3":
					flag = "Medium";
					break;
				case "4":
					flag = "Low";
					break;
				default:
					flag = "Warning";
			}
			return flag;

		} else {
			throw Error ( );

		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( e.message, "Business Partner Edit Title is not string", "SapSplModelFormatters.js" );
		}
	}
};

/* CSNFIX : 1570016512 */
/**
 * @description Formatter method, to display date of a notification message in short style.
 * @param {object} oDate date object.
 * @returns {string} the string to be displayed on the screen in short style
 * @since 1.0
 */
splReusable.libs.SapSplModelFormatters.convertDateTimeToStringBasedOnLocaleInShortFormat = function ( oDate ) {
	if ( oDate ) {
		return sap.ui.core.format.DateFormat.getDateTimeInstance ( {
			style : "short"
		}, sap.ui.getCore ( ).getConfiguration ( ).getLocale ( ) ).format ( new Date ( oDate ), false );
	}
};

/* CSNFIX : 1570016512 */
/**
 * @description Formatter method, to display date of a notification message in medium style.
 * @param {object} oDate date object.
 * @returns {string} the string to be displayed on the screen in medium style
 * @since 1.0
 */
splReusable.libs.SapSplModelFormatters.convertDateTimeToStringBasedOnLocaleInMediumFormat = function ( oDate ) {
	if ( oDate ) {
		return sap.ui.core.format.DateFormat.getDateTimeInstance ( {
			style : "medium"
		}, sap.ui.getCore ( ).getConfiguration ( ).getLocale ( ) ).format ( new Date ( oDate ), false );
	}
};

/**
 * @description Formatter method, to display Timestamp of Message.
 * @param {string} sTimestamp value of the priority.
 * @returns {string} the string to be displayed on the screen "Timestamp -"sValue.
 * @since 1.0
 */
splReusable.libs.SapSplModelFormatters.returnMessageTimestamp = function ( sTime, sType ) {
	var sTimestamp = null;
	var date = null;
	var time = null;
	var currentDate = new Date ( );
	currentDate.setHours ( 0, 0, 0, 0 );
	try {
		if ( Math.floor ( Math.abs ( sTime - new Date ( ) ) / 60000 ) === 0 ) {
			sTimestamp = " " + oSapSplUtils.getBundle ( ).getText ( "JUST_NOW" );
		} else if ( Math.floor ( Math.abs ( sTime - new Date ( ) ) / 60000 ) <= 59 ) {
			sTimestamp = Math.floor ( Math.abs ( sTime - new Date ( ) ) / 60000 ) + " " + oSapSplUtils.getBundle ( ).getText ( "MIN_AGO" );

			// Fix for internal incident id : 1482006755 starts
		} else if ( (currentDate.getFullYear ( ) === sTime.getFullYear ( )) && (currentDate.getMonth ( ) === sTime.getMonth ( )) && (currentDate.getDate ( ) === sTime.getDate ( )) ) {

			/* Fix for Incident 1472018755 begins - Cherry Picked from EC */
			time = sap.ui.core.format.DateFormat.getTimeInstance ( {
				pattern : "HH:mm",
				style : "short"
			}, sap.ui.getCore ( ).getConfiguration ( ).getLocale ( ) ).format ( new Date ( sTime ), false );
			/* Fix for Incident 1472018755 ends */
			/* Fix for Incident 1472020527 - removed the Suffix - "h" */
			sTimestamp = time;

		} else {

			date = sap.ui.core.format.DateFormat.getDateInstance ( {
				pattern : "dd.MM.yyyy",
				style : "short"
			}, sap.ui.getCore ( ).getConfiguration ( ).getLocale ( ) ).format ( new Date ( sTime ), false );

			/* Fix for Incident 1472018755 begins - Cherry Picked from EC */
			time = sap.ui.core.format.DateFormat.getTimeInstance ( {
				pattern : "HH:mm",
				style : "short"
			}, sap.ui.getCore ( ).getConfiguration ( ).getLocale ( ) ).format ( new Date ( sTime ), false );
			/* Fix for Incident 1472018755 Ends */
			sTimestamp = date + " " + oSapSplUtils.getBundle ( ).getText ( "AT" ) + " " + time;
		}
		// Fix for internal incident id : 1482006755 ends

		if ( sType && sType === "BI" ) {
			sTimestamp = "";
		}

		return sTimestamp;
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( e.message, "Business Partner Edit Title is not string", "SapSplModelFormatters.js" );
		}
	}
};

/**
 * @description Formatter method, to display priority of if it is not null, else return "".
 * @param {string} sPriority value of the priority.
 * @returns {string} the string to be displayed on the screen "priority"sValue.
 * @since 1.0
 */
splReusable.libs.SapSplModelFormatters.returnPriorityTextByRemovingNull = function ( sPriority, isNotification, isActive ) {
	if ( isNotification === "0" ) {
		if ( sPriority === null || sPriority === undefined ) {
			return "";
		} else {
			return sPriority;
		}
	} else {
		if ( isActive !== null || isActive !== undefined ) {
			if ( isActive === "1" ) {
				return sPriority;
			} else {
				return oSapSplUtils.getBundle ( ).getText ( "EXPIRED" );
			}
		} else {
			return "";
		}
	}

};

/**
 * @description Formatter method, to display feedlist message, which ever is not null
 * @param {string} sText1 value of the text1.
 * @param {string} sText2 value of the text1.
 * @param {string} sText3 value of the text1.
 * @returns {string} the string to be displayed on the screen "text" sValue.
 * @since 1.0
 */
splReusable.libs.SapSplModelFormatters.returnFeedMessage = function ( sText1, sText2, sText3 ) {
	if ( sText1 !== null && sText1 !== undefined ) {
		return sText1 ;
	}
	if ( sText2 !== null && sText2 !== undefined ) {
		return sText2 ;
	}
	if ( sText3 !== null && sText3 !== undefined ) {
		return sText3 ;
	}
};

/**
 * return the deviceID of the vehicle if present, else return a placeholder.
 * 
 * @static
 * @since 1.0
 * @param {string} sValue
 */
splReusable.libs.SapSplModelFormatters.displayDeviceIDLink = function ( sValue ) {
	if ( sValue !== undefined && sValue !== null && sValue !== "" ) {
		return sValue;
	} else {
		return oSapSplUtils.getBundle ( ).getText ( "SELECT_DEVICE_PLACEHOLDER" );
	}
};

/**
 * @description Formatter method, to display Icon of Message.
 * @param {string} sTrafic value of the priority.
 * @param {string} sBuPa value of the priority.
 * @param {string} sPms value of the priority.
 * @returns {string} the string to be displayed on the screen "Icon -"sValue.
 * @since 1.0
 */
splReusable.libs.SapSplModelFormatters.returnMessageIcons = function ( sIcon, sType, isNotification ) {
	sIcon = null;
	try {
		if ( sIcon ) {
			return sIcon;
		} else {
			if ( sType ) {
				/* CSNFIX : 0120031469 782910 2014 */
				if ( sType === "BM" || sType === "BI" || sType === "TC" || sType === "CR" || isNotification === "1" || sType === "AG" || sType === "RG" ) {
					if ( isNotification === "1" ) {
						return "sap-icon://marketing-campaign";
					} else {
						return "sap-icon://collaborate";
					}
				} else if ( sType === "I" ) {
					return "sap-icon://bussiness-suite/icon-traffic-lights";
				} else if ( sType === "DM" ) {
					return "sap-icon://bussiness-suite/icon-truck-driver";
				} else if ( sType === "E" ) {
					return "sap-icon://bussiness-suite/icon-container-loading";
				} else {
					return "sap-icon://bussiness-suite/icon-traffic-cone";
				}
			}
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( e.message, "Business Partner Edit Title is not string", "SapSplModelFormatters.js" );
		}
	}
};

/**
 * @description To get the state of the switch control based on the permissions given by a freight forwarder to a Bupa.
 * @static
 * @since 1.0
 * @example splReusable.libs.SapSplModelFormatters.sharePermissionSwitchState(1);
 * @param {Number} iIsShared
 * @returns {Boolean} True if iIsShared is 1 else False
 */
splReusable.libs.SapSplModelFormatters.sharePermissionSwitchState = function ( iIsShared ) {
	try {
		if ( iIsShared && iIsShared.constructor === Number ) {
			if ( iIsShared === 1 ) {
				return true;
			} else if ( iIsShared === 0 ) {
				return false;
			} else {
				throw new Error ( "iIsShared not 1/0" );
			}
		} else {
			throw new Error ( "invalid arguments" );
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( e.message, "share permissions state not a integer", "SapSplModelFormatters.js" );
		}
	}
};

/**
 * @description Formatter method, to display driver Name of Vehicle.
 * @param {string} sValue value of the Driver Name.
 * @returns {string} the string to be displayed for DriverName on the screen
 * @since 1.0
 */
splReusable.libs.SapSplModelFormatters.returnDriverName = function ( sValue ) {

	try {
		if ( sValue && sValue !== null && sValue !== "" ) {

			return sValue;

		} else {
			return oSapSplUtils.getBundle ( ).getText ( "SELECT_DRIVER" );

		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( e.message, "Business Partner Edit Title is not string", "SapSplModelFormatters.js" );
		}
	}
};

/**
 * @description Formatter method, to display Location Name for Stops.
 * @param addressField1 {string} House number
 * @param addressField2 {string} Street Name
 * @param addressPostalCode {string} Postal Code
 * @param city {string} Name of the City
 * @param addressRegion {string} Address Region
 * @param addressCountry {string} Country
 * @returns {string} concatenated string to be displayed for Location in Stops
 * @example splReusable.libs.SapSplModelFormatters.returnLocationName("Street","Hamburg"); //returns Street, Hamburg
 */
splReusable.libs.SapSplModelFormatters.returnLocationName = function ( ) {
	var sFormattedAddress = "", aFormattedAddressList = [], bCalledOnInitialization = true, aArguments = arguments;

	/* FIX FOR 1580005077 */
	function _checkForInitialization ( arguments ) {
		for ( var iArg = 0 ; iArg < arguments.length ; iArg++ ) {
			if ( arguments[iArg] === null ) {
				bCalledOnInitialization = true;
			} else {
				bCalledOnInitialization = false;
			}
		}
		return bCalledOnInitialization;
	}

	if ( arguments.length <= 0 || _checkForInitialization ( aArguments ) ) {
		return sFormattedAddress;
	}

	for ( var iArgList = 0 ; iArgList < arguments.length ; iArgList++ ) {
		if ( arguments[iArgList] !== null || arguments[iArgList] ) {
			aFormattedAddressList.push ( arguments[iArgList] );
		}
	}
	sFormattedAddress = aFormattedAddressList.join ( ", " );
	return sFormattedAddress;

};

/**
 * @description Formatter method, to set Type for PickUp Button based on Freight Item Action.
 * @param {string} action Action on freight item for a location.
 * @returns {string} Type for the PickUp Button. Emphasized if action is P else Default
 * @example splReusable.libs.SapSplModelFormatters.setTypeForPickUpButton("P"); //returns "Emphasized"
 */
splReusable.libs.SapSplModelFormatters.setTypeForPickUpButton = function ( action ) {
	try {
		if ( action && action !== null && action !== "" ) {
			if ( action === "P" ) {
				return "Emphasized";
			} else {
				return "Default";
			}
		} else {
			throw new Error ( "invalid arguments setTypeForPickUpButton" );
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( e.message, "action  not string", "SapSplModelFormatters.js" );
		}
	}
};

/**
 * @description Formatter method, to set Type for Drop Button based on Freight Item Action.
 * @param {string} action Action on freight item for a location.
 * @returns {string} Type for the Drop Button. Emphasized if action is D else Default
 * @example splReusable.libs.SapSplModelFormatters.setTypeForDropButton("D"); //returns "Emphasized"
 */
splReusable.libs.SapSplModelFormatters.setTypeForDropButton = function ( action ) {
	try {
		if ( action && action !== null && action !== "" ) {
			if ( action === "D" ) {
				return "Emphasized";
			} else {
				return "Default";
			}
		} else {
			throw new Error ( "invalid arguments setTypeForDropButton" );
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( e.message, "action not string", "SapSplModelFormatters.js" );
		}
	}
};

/**
 * @description Formatter method, to set Type for DoNothing Button based on Freight Item Action.
 * @param {string} action Action on freight item for a location.
 * @returns {string} Type for the DoNothing Button. Emphasized if action is N else Default
 * @example splReusable.libs.SapSplModelFormatters.setTypeForDoNothingButton("N"); //returns "Emphasized"
 */
splReusable.libs.SapSplModelFormatters.setTypeForDoNothingButton = function ( action ) {
	try {
		if ( action && action !== null && action !== "" ) {
			if ( action === "N" ) {
				return "Emphasized";
			} else {
				return "Default";
			}
		} else {
			throw new Error ( "invalid arguments setTypeForDoNothingButton" );
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( e.message, "action  not string", "SapSplModelFormatters.js" );
		}
	}
};

/**
 * @description Formatter method, to set enabled property pick Button in the fragment.
 * @param {String} itemUUID UUID of freight item.
 * @returns {Boolean} True if button is to be enabled else false
 * @example splReusable.libs.SapSplModelFormatters.setEnablePropertyForPickUpButtonInFragment("123");
 */
splReusable.libs.SapSplModelFormatters.setEnablePropertyForPickUpButtonInFragment = function ( itemUUID ) {

	var sIndex, modelData = this.getBindingContext ( ).getModel ( ).getData ( );
	var items = sap.ui.getCore ( ).getModel ( "SplCreateNewTourModel" ).getData ( ).Items, jIndex;

	var stopRowIndex = this.getBindingContext ( ).sPath.split ( "/" )[2];
	for ( sIndex = 0 ; sIndex < items.length ; sIndex++ ) {
		if ( items[sIndex].UUID === itemUUID ) {
			if ( items[sIndex].pickActionHappened === "P" ) {
				for ( jIndex = 0 ; jIndex < modelData.stopsRow[stopRowIndex].items.length ; jIndex++ ) {
					if ( modelData.stopsRow[stopRowIndex].items[jIndex].Action === "P" && modelData.stopsRow[stopRowIndex].items[jIndex].ItemUUID === itemUUID ) {
						return true;
					}
				}
				return false;
			}
		}
	}
	return true;
};

/**
 * @description Formatter method, to set enabled property drop Button in the fragment.
 * @param {String} itemUUID UUID of freight item.
 * @returns {Boolean} True if button is to be enabled else false
 * @example splReusable.libs.SapSplModelFormatters.setEnablePropertyForDropButtonInFragment("123");
 */
splReusable.libs.SapSplModelFormatters.setEnablePropertyForDropButtonInFragment = function ( itemUUID ) {

	var sIndex, modelData = this.getBindingContext ( ).getModel ( ).getData ( );
	var items = sap.ui.getCore ( ).getModel ( "SplCreateNewTourModel" ).getData ( ).Items, jIndex;

	var stopRowIndex = this.getBindingContext ( ).sPath.split ( "/" )[2];
	for ( sIndex = 0 ; sIndex < items.length ; sIndex++ ) {
		if ( items[sIndex].UUID === itemUUID ) {
			if ( items[sIndex].pickActionHappened === "N" || items[sIndex].pickActionHappened === "P" && items[sIndex].dropActionHappened === "N" ) {
				return false;
			}
			if ( items[sIndex].dropActionHappened === "D" ) {
				for ( jIndex = 0 ; jIndex < modelData.stopsRow[stopRowIndex].items.length ; jIndex++ ) {
					if ( modelData.stopsRow[stopRowIndex].items[jIndex].Action === "D" && modelData.stopsRow[stopRowIndex].items[jIndex].ItemUUID === itemUUID ) {
						return true;
					}
				}
				return false;
			}
		}
	}
	return true;
};

/**
 * @description Formatter method, to set enabled property pick Button in the dialog.
 * @param {String} itemUUID UUID of freight item.
 * @returns {Boolean} True if button is to be enabled else false
 * @example splReusable.libs.SapSplModelFormatters.setEnablePropertyForPickUpButton("123");
 */
splReusable.libs.SapSplModelFormatters.setEnablePropertyForPickUpButton = function ( itemUUID ) {

	var sIndex, modelData = this.getBindingContext ( ).getModel ( ).getData ( );
	var items = sap.ui.getCore ( ).getModel ( "SplCreateNewTourModel" ).getData ( ).Items, jIndex;

	// If Stop is not defined then Assignment of Items not allowed
	if ( !sap.ui.getCore ( ).getModel ( "SplCreateNewTourModel" ).getData ( ).stopsRow[this.getModel ( ).getData ( ).rowIndex].LocationUUID ) {
		return false;
	}
	for ( sIndex = 0 ; sIndex < items.length ; sIndex++ ) {
		if ( items[sIndex].UUID === itemUUID ) {
			if ( items[sIndex].pickActionHappened === "P" ) {
				for ( jIndex = 0 ; jIndex < modelData.fItems.length ; jIndex++ ) {
					if ( modelData.fItems[jIndex].Action === "P" && itemUUID === modelData.fItems[jIndex].ItemUUID ) {
						return true;
					}
				}
				return false;
			}
		}
	}
	return true;
};

/**
 * @description Formatter method, to set enabled property drop Button in the dialog.
 * @param {String} itemUUID UUID of freight item.
 * @returns {Boolean} True if button is to be enabled else false
 * @example splReusable.libs.SapSplModelFormatters.setEnablePropertyForDropButton("123");
 */
splReusable.libs.SapSplModelFormatters.setEnablePropertyForDropButton = function ( itemUUID ) {

	var sIndex, modelData = this.getBindingContext ( ).getModel ( ).getData ( );
	var items = sap.ui.getCore ( ).getModel ( "SplCreateNewTourModel" ).getData ( ).Items, jIndex;

	// If Stop is not defined then Assignment of Items not allowed
	if ( !sap.ui.getCore ( ).getModel ( "SplCreateNewTourModel" ).getData ( ).stopsRow[this.getModel ( ).getData ( ).rowIndex].LocationUUID ) {
		return false;
	}
	for ( sIndex = 0 ; sIndex < items.length ; sIndex++ ) {
		if ( items[sIndex].UUID === itemUUID ) {
			if ( items[sIndex].pickActionHappened === "N" || items[sIndex].pickActionHappened === "P" && items[sIndex].dropActionHappened === "N" ) {
				if ( items[sIndex].pickActionHappened === "P" ) {

					if ( sap.ui.getCore ( ).getModel ( "SplCreateNewTourModel" ).getData ( ).stopsRow[items[sIndex].pickStopIndex].LocationUUID === sap.ui.getCore ( ).getModel ( "SplCreateNewTourModel" ).getData ( ).stopsRow[this.getModel ( )
							.getData ( ).rowIndex].LocationUUID ) {
						return false;
					}
					if ( parseInt ( items[sIndex].pickStopIndex, 10 ) < parseInt ( modelData.rowIndex, 10 ) ) {
						return true;
					}
				}

				return false;
			}
			if ( items[sIndex].dropActionHappened === "D" ) {
				for ( jIndex = 0 ; jIndex < modelData.fItems.length ; jIndex++ ) {
					if ( modelData.fItems[jIndex].Action === "D" && itemUUID === modelData.fItems[jIndex].ItemUUID ) {
						return true;
					}
				}
				return false;
			}
		}
	}
	return true;
};

/**
 * @description To show "DropRemainingItems" link at last stop.
 * @param {boolean} lastRowFlag .
 * @returns {boolean} lastRowFlag
 * @example splReusable.libs.SapSplModelFormatters.showDropRemainingFreightItems(false); //returns true
 */
splReusable.libs.SapSplModelFormatters.showDropRemainingFreightItems = function ( lastRowFlag ) {
	return !lastRowFlag;
};

/**
 * @description Formatter method,to display ETA time along with planned arrival time.If the status of the stop is active,displays truck icon and
 *              decides the color of the text based on the value of ETA.
 * @param {object} Date
 * @returns {string} Depature Date of the Stop. returns null if the Date is same as that of a earlier stop in the tour *
 * @example splReusable.libs.SapSplModelFormatters.returnTimeValue(new Date()); //returns "12:24 h"
 */

splReusable.libs.SapSplModelFormatters.CalculateDaysBetween = function ( oObject ) {

	if ( splReusable.libs.SapSplModelFormatters.getDateFromStringtoLocaleString ( oObject.Planned_ArrivalTime ) === splReusable.libs.SapSplModelFormatters.getDateFromStringtoLocaleString ( oObject.Planned_DepartureTime ) ) {

		return 0;

	} else {

		return 1;
	}

};
/**
 * @description Formatter method, to set icon for Assignment Item Type.And Creates empty rows based on the input data
 * @param {string} sValue .
 * @returns {string} icon path
 * @example splReusable.libs.SapSplModelFormatters.setTypeForDoNothingButton("D"); //returns "sap-icon://slim-arrow-down"
 */

splReusable.libs.SapSplModelFormatters.createEmptyRowsAndReturnImageIcon = function ( sValue ) {

	if ( this.getParent ( ).getParent ( ).getContent ( ).length === this.getParent ( ).getParent ( ).getBindingContext ( ).getObject ( ).AssignedItems.results.length ) {
		if ( splReusable.libs.SapSplModelFormatters.CalculateDaysBetween ( this.getParent ( ).getParent ( ).getBindingContext ( ).getObject ( ) ) > 0 ) {
			this.getParent ( ).getParent ( ).addContent ( new sap.m.Label ( {
				text : "test"
			} ).addStyleClass ( "SapSplTourTextHidden" ) );
			this.getParent ( ).getParent ( ).getParent ( ).addCustomData ( new sap.ui.core.CustomData ( {
				key : "key",
				value : "value"
			} ) );
		}

	}

	return splReusable.libs.SapSplModelFormatters.sapSplTourAssignedItemsImageIcon ( sValue );

};

/**
 * @description Formatter method, to set icon for Assignment Item Type
 * @param {string} sValue .
 * @returns {string} icon path
 * @example splReusable.libs.SapSplModelFormatters.sapSplTourAssignedItemsImageIcon("D"); //returns "sap-icon://slim-arrow-down"
 */
splReusable.libs.SapSplModelFormatters.sapSplTourAssignedItemsImageIcon = function ( sValue ) {

	try {

		if ( this.getParent ( ).getParent ( ).getContent ( ).length === this.getParent ( ).getParent ( ).getBindingContext ( ).getObject ( ).AssignedItems.results.length ) {
			if ( splReusable.libs.SapSplModelFormatters.CalculateDaysBetween ( this.getParent ( ).getParent ( ).getBindingContext ( ).getObject ( ) ) > 0 ) {
				this.getParent ( ).getParent ( ).addContent ( new sap.m.Label ( {
					text : "test"
				} ).addStyleClass ( "SapSplTourTextHidden" ) );
				this.getParent ( ).getParent ( ).getParent ( ).addCustomData ( new sap.ui.core.CustomData ( {
					key : "key",
					value : "value"
				} ) );
			}

		}
	} catch (e) {

	}

	if ( sValue === "D" ) {
		return "sap-icon://slim-arrow-down";

	} else {
		return "sap-icon://slim-arrow-up";
	}

};

/**
 * @description Formatter method, to set the empty rows in Toursoverview table.
 * @param {string} Name
 * @returns {string} Name of the stop after creating empty rows for each additional assigned item
 * @example splReusable.libs.SapSplModelFormatters.setMarginBottom("Hamburg");
 */

splReusable.libs.SapSplModelFormatters.setMarginBottom = function ( sValue ) {

	if ( this.getBindingContext ( ) && this.getBindingContext ( ).getObject ( ).AssignedItems && this.getBindingContext ( ).getObject ( ).AssignedItems.results && this.getBindingContext ( ).getObject ( ).AssignedItems.results.length ) {
		var iTemsCount = this.getBindingContext ( ).getObject ( ).AssignedItems.results.length;

		if ( splReusable.libs.SapSplModelFormatters.CalculateDaysBetween ( this.getBindingContext ( ).getObject ( ) ) > 0 ) {
			this.getParent ( ).addContent ( new sap.m.Label ( {
				text : sValue
			} ) );

		}
		for ( var i = 0 ; i < iTemsCount - 1 ; i++ ) {
			this.getParent ( ).addContent ( new sap.m.Label ( {
				text : "test"
			} ).addStyleClass ( "SapSplTourTextHidden" ) );
		}

	}
	return sValue;

};

/**
 * @description Formatter method, to set the empty rows in Toursoverview table.
 * @param {object} Date
 * @returns {string} Arrival Date of the Stop.return null if the Date is same as that of a earlier stop in the tour
 */

splReusable.libs.SapSplModelFormatters.setTourStopDate = function ( sValue ) {

	var that = this;

	if ( that.getBindingContext && that.getBindingContext ( ) ) {
		var iTemsCount = that.getBindingContext ( ).getObject ( ).AssignedItems.results.length, sDateString = splReusable.libs.SapSplModelFormatters.getDateFromStringtoLocaleString ( sValue ), flag = false, parentDate, Depature_Date;

		if ( splReusable.libs.SapSplModelFormatters.CalculateDaysBetween ( this.getBindingContext ( ).getObject ( ) ) > 0 ) {
			Depature_Date = splReusable.libs.SapSplModelFormatters.getDateFromStringtoLocaleString ( this.getBindingContext ( ).getObject ( ).Planned_DepartureTime );
			this.getParent ( ).addContent ( new sap.m.Label ( {
				text : Depature_Date
			} ) );

		}
		for ( var i = 0 ; i < iTemsCount - 1 ; i++ ) {
			that.getParent ( ).addContent ( new sap.m.Label ( {
				text : "test"
			} ).addStyleClass ( "SapSplTourTextHidden" ) );

		}
		if ( !that.getParent ( ).getParent ( ).getParent ( ).getCustomData ( )[0] ) {
			parentDate = Depature_Date ? Depature_Date : sDateString;
			that.getParent ( ).getParent ( ).getParent ( ).addCustomData ( new sap.ui.core.CustomData ( {
				key : "Date",
				value : parentDate
			} ) );
			flag = true;
		}

		if ( !flag && sDateString === that.getParent ( ).getParent ( ).getParent ( ).getCustomData ( )[0].getValue ( ) ) {
			return null;
		} else {
			that.getParent ( ).getParent ( ).getParent ( ).destroyCustomData ( );
			that.getParent ( ).getParent ( ).getParent ( ).addCustomData ( new sap.ui.core.CustomData ( {
				key : "Date",
				value : parentDate
			} ) );
			return sDateString;
		}
	}

};

/**
 * @description Formatter method, to set the empty rows in Toursoverview table.
 * @param {object} Date
 * @returns {string} Depature Date of the Stop.return null if the Date is same as that of a earlier stop in the tour
 */

splReusable.libs.SapSplModelFormatters.returnTimeValueAndSetEmptyRows = function ( sValue ) {
	if ( this.getBindingContext ) {
		var iTemsCount = this.getBindingContext ( ).getObject ( ).AssignedItems.results.length;

		if ( splReusable.libs.SapSplModelFormatters.CalculateDaysBetween ( this.getBindingContext ( ).getObject ( ) ) > 0 ) {
			this.getParent ( ).addContent ( new sap.m.Label ( {
				text : splReusable.libs.SapSplModelFormatters.returnTimeValue ( sValue )
			} ) );
			this.addStyleClass ( "SapSplTourTextHidden" );

		}

		for ( var i = 0 ; i < iTemsCount - 1 ; i++ ) {
			this.getParent ( ).addContent ( new sap.m.Label ( {
				text : splReusable.libs.SapSplModelFormatters.returnTimeValue ( sValue )
			} ).addStyleClass ( "SapSplTourTextHidden" ) );

		}
	}

	return splReusable.libs.SapSplModelFormatters.returnTimeValue ( sValue );

};

/**
 * @description Formatter method,to display time value in Tour Overview UI.
 * @param {object} Date
 * @returns {string} Depature Date of the Stop.return null if the Date is same as that of a earlier stop in the tour *
 * @example splReusable.libs.SapSplModelFormatters.returnTimeValue(new Date()); //returns "12:24 h"
 */

splReusable.libs.SapSplModelFormatters.returnTimeValue = function ( sValue ) {

	var oDate = null, sMinutes, sTime = null, sHours;

	if ( sValue ) {

		if ( typeof sValue !== "object" ) {

			oDate = new Date ( splReusable.libs.SapSplModelFormatters.getDateFromString ( sValue ) );
			sMinutes = oDate.getMinutes ( );
			sHours = oDate.getHours ( );
			if ( oDate.getMinutes ( ) < 10 ) {
				sMinutes = "0" + oDate.getMinutes ( );
			}
			if ( oDate.getHours ( ) < 10 ) {
				sHours = "0" + oDate.getHours ( );
			}
			/* Fix for Incident 1472020527 - removed the Suffix - "h" */
			sTime = sHours + ":" + sMinutes;

		} else {
			sMinutes = sValue.getMinutes ( );
			sHours = sValue.getHours ( );
			if ( sValue.getMinutes ( ) < 10 ) {
				sMinutes = "0" + sValue.getMinutes ( );
			}
			if ( sValue.getHours ( ) < 10 ) {
				sHours = "0" + sValue.getHours ( );
			}
			/* Fix for Incident 1472020527 - removed the Suffix - "h" */
			sTime = sHours + ":" + sMinutes;

		}
		return sTime;
	} else {
		return null;
	}
};

/**
 * @description Formatter method,to display ETA time along with planned arrival time.If the status of the stop is active,displays truck icon and
 *              decides the color of the text based on the value of ETA.
 * @param {object} Date
 * @returns {string} Depature Date of the Stop.return null if the Date is same as that of a earlier stop in the tour *
 * @example splReusable.libs.SapSplModelFormatters.returnTimeValue(new Date()); //returns "12:24 h"
 */

splReusable.libs.SapSplModelFormatters.returnETA = function ( sValue ) {

	var oData = null, sETA = null, isIconVisible = false, ETAStyleClass = null;

	if ( this.getBindingContext ( ) && this.getBindingContext ( ).getObject ( ).AssignedItems && this.getBindingContext ( ).getObject ( ).AssignedItems.results && this.getBindingContext ( ).getObject ( ).AssignedItems.results.length ) {
		var iTemsCount = this.getBindingContext ( ).getObject ( ).AssignedItems.results.length;

		if ( splReusable.libs.SapSplModelFormatters.CalculateDaysBetween ( this.getBindingContext ( ).getObject ( ) ) > 0 ) {
			this.getParent ( ).getParent ( ).addContent ( new sap.m.Label ( {
				text : "test"
			} ).addStyleClass ( "SapSplTourTextHidden" ) );

		}
		for ( var i = 0 ; i < iTemsCount - 1 ; i++ ) {
			this.getParent ( ).getParent ( ).addContent ( new sap.m.Label ( {
				text : "test"
			} ).addStyleClass ( "SapSplTourTextHidden" ) );
		}
	}

	if ( this && this.getBindingContext ( ) && this.getBindingContext ( ).getObject ( ) && this.getBindingContext ( ).getObject ( ).Status === "A" ) {
		oData = this.getBindingContext ( ).getObject ( );

		sETA = splReusable.libs.SapSplModelFormatters.returnTimeValue ( oData.ETA );
		if ( sETA ) {
			isIconVisible = true;

			if ( oData.ETA < oData.Planned_ArrivalTime ) {
				ETAStyleClass = "SapSplTourOverviewETAGreen";

			} else {
				ETAStyleClass = "SapSplTourOverviewETAOrange";
			}

			this.getParent ( ).addContent ( new sap.m.Text ( {
				text : "(" + sETA + ")"
			} ).addStyleClass ( ETAStyleClass ) );

		} else {
			this.addStyleClass ( "sapSplTourOverviewIconPadding" );
		}
		this.getParent ( ).insertContent ( new sap.m.Image ( {
			width : "50%",
			src : "resources/icons/Truck.PNG",
			visible : isIconVisible
		} ), 0 );

	} else {
		this.addStyleClass ( "sapSplTourOverviewIconPadding" );

	}

	return splReusable.libs.SapSplModelFormatters.returnTimeValue ( sValue );

};

splReusable.libs.SapSplModelFormatters.setTourOverHeaderText = function ( sValue ) {

	if ( sValue ) {
		return sValue;
	}

};

splReusable.libs.SapSplModelFormatters.SapSplToursOverviewCount = function ( sValue ) {
	return sValue;
};

/**
 * @description Formatter method,to display the stop name in bold if the status is active.
 * @param {object} sValue
 * @returns {string} enumeration of label style
 */

splReusable.libs.SapSplModelFormatters.setCurrentStop = function ( sValue ) {
	if ( sValue === "A" ) {
		return sap.m.LabelDesign.Bold;
	}

};

/**
 * @descriotion To get the date object from an EDM.Time object in OData
 * @static
 * @since 1.0
 * @example splReusable.libs.SapSplModelFormatters.getDateFromStringtoLocaleString();
 * @param {string} oValue
 * @returns {string} The converted date (in UTC format)
 */
splReusable.libs.SapSplModelFormatters.getDateFromStringtoLocaleString = function ( oValue ) {
	var oDateRegEx = new RegExp ( "[0-9]+", "gi" );
	if ( oValue ) {
		if ( typeof oValue !== "object" ) {
			var aDateValue = oDateRegEx.exec ( oValue );
			return (new Date ( parseInt ( aDateValue[0], 10 ) ).toLocaleDateString ( ));
		} else {
			return oValue.toLocaleDateString ( );
		}

	} else {
		return null;
	}
};

/**
 * Concatenate the registration number and the driver name.
 * 
 * @static
 * @since 1.0
 * @param {string} sRegistrationNumber
 * @param {string} sDriverName
 * @returns {string} sRegNumAndName
 */
splReusable.libs.SapSplModelFormatters.getTruckDetailsHeader = function ( sRegistrationNumber, sDriverName ) {

	try {
		var sRegNumAndName = "";

		if ( sRegistrationNumber !== undefined && sDriverName !== undefined ) {
			if ( sDriverName === null ) {
				sRegNumAndName = sRegistrationNumber;
			} else {
				sRegNumAndName = sRegistrationNumber + " ( " + sDriverName + " )";
			}
			return sRegNumAndName;
		} else {
			throw new ReferenceError ( );
		}

	} catch (oEvent) {
		jQuery.sap.log.error ( oEvent.message, "Driver Name or Reg Number missing", "SapSplModelFormatters.js" );
	}
};

/**
 * If the toour name is null, it replaces null with 'No tours assigned'.
 * 
 * @static
 * @since 1.0
 * @param {string} sTourName
 * @returns {string} sFinalTourName
 */
splReusable.libs.SapSplModelFormatters.getTruckAssignedTourName = function ( sTourName ) {

	try {
		var sFinalTourName = "";

		if ( sTourName !== undefined ) {
			if ( sTourName === null ) {
				sFinalTourName = oSapSplUtils.getBundle ( ).getText ( "NO_TOURS_ASSIGNED_FOR_TRUCK" );
			} else {
				sFinalTourName = sTourName;
			}
			return sFinalTourName;
		} else {
			throw new ReferenceError ( );
		}

	} catch (oEvent) {
		jQuery.sap.log.error ( oEvent.message, "", "SapSplModelFormatters.js" );
	}
};

/**
 * @description Formatter function to check for missing odata field value and return appropriate placeholder (localized)
 * @static
 * @since 1.0
 * @param oValue {String} The value to check
 * @returns {String} Value | L10N text for "Value Not Found"
 */
splReusable.libs.SapSplModelFormatters.valueNotAvailable = function ( oValue ) {
	var _ret = oValue;
	if ( oValue === undefined || oValue === null || oValue === "" ) {
		_ret = ""; /* CSNFIX 1307167 2014 */
	}
	return _ret;
};

/**
 * @since 1.0
 * @static
 * @description core:Title control does not have a visible property. Hence to hide this control when the corresponding property is false, validate and
 *              return "" if oValue is 0
 * @param oValue {Integer} 0..n
 * @returns {String} Localized message or null
 */
splReusable.libs.SapSplModelFormatters.controlTitleVisibility = function ( oValue ) {

	return (oValue === 1) ? oSapSplUtils.getBundle ( ).getText ( "COMPANY_PROFILE_TRUCK_AND_DEVICE_DETAILS" ) : "";

};

/**
 * @since 1.0
 * @description Log formatter object
 * @param oValue {Integer} 0|1|2|3|4 Log states
 * @returns oState {String} Error|Warning|Success|None
 */
splReusable.libs.SapSplModelFormatters.logLevelFormatter = function ( oValue ) {
	var oState = null;
	switch ( oValue ) {
		case 0:
		case 1:
			oState = "Error";
			break;
		case 2:
		case 3:
			oState = "Warning";
			break;
		case 4:
			oState = "Success";
			break;
		default:
			oState = "None";
	}
	return oState;

};

/**
 * return the registration number and the driver name.
 * 
 * @static
 * @since 1.0
 * @param {string} sRegistrationNumber
 * @param {string} sDriverName
 * @returns {string} sRegNumAndName
 */
splReusable.libs.SapSplModelFormatters.getVehicleAndTruckDetails = function ( sRegistrationNumber, sDriverName ) {

	try {
		var sRegNumAndName = "";

		if ( sRegistrationNumber !== undefined && sDriverName !== undefined ) {
			if ( sDriverName === null ) {
				sRegNumAndName = sRegistrationNumber;
			} else if ( sDriverName === null ) {
				sRegNumAndName = sRegistrationNumber;
			} else {
				sRegNumAndName = sRegistrationNumber + " ( " + sDriverName + " )";
			}
			return sRegNumAndName;
		} else {
			throw new ReferenceError ( );
		}

	} catch (oEvent) {
		jQuery.sap.log.error ( oEvent.message, "Driver Name or Reg Number missing", "SapSplModelFormatters.js" );
	}
};

/**
 * @since 1.0
 * @static
 * @description core:function to append the item details of a Item for a given stop
 * @param oValue {String} 0..n
 * @returns {String}
 */
splReusable.libs.SapSplModelFormatters.returnItemDetails = function ( ) {
	var oModelData = null, sValue = "";
	// FIX for CSN 158000381
	if ( this.getBindingContext ( ) && this.getBindingContext ( ).getObject ( ) ) {
		oModelData = this.getBindingContext ( ).getObject ( );
		if ( oModelData.Type === "C" ) {
			if ( oModelData.ContainerType === null || oModelData.ContainerType === undefined ) {
				return " ";
			} else {
				sValue = oModelData.ContainerType + " " + oModelData["Type_description"];
			}
		} else if ( oModelData.Type === "B" ) {
			sValue = oModelData.Quantity_Value + " " + oModelData.Quantity_Unit + "  " + oModelData.Weight_Value + " " + oModelData.Weight_Unit + "  " + oModelData.Volume_Value + " " + oModelData.Volume_Unit;
		}
	}
	return sValue;
};

/**
 * @since 1.0
 * @static
 * @description core:function to enable button for tour navigation
 * @param oValue {String} 0..n
 * @returns {Boolean}
 */
splReusable.libs.SapSplModelFormatters.enableTourNavigationButton = function ( oValue ) {
	var oKey = null, OverViewModelData;

	if ( this.getCustomData ( ) && this.getCustomData ( ).length > 0 ) {
		oKey = this.getCustomData ( )[0].getKey ( );
	}
	if ( oKey && oKey === "down" ) {
		if ( sap.ui.getCore ( ).getModel ( "sapSplTourOverviewModel" ) ) {
			OverViewModelData = sap.ui.getCore ( ).getModel ( "sapSplTourOverviewModel" ).getData ( );
			if ( OverViewModelData && OverViewModelData.results && OverViewModelData.results instanceof Array && oValue >= OverViewModelData.results.length ) {
				return false;
			} else {
				return true;
			}
		}

	} else {
		if ( sap.ui.getCore ( ).getModel ( "sapSplTourOverviewModel" ) ) {
			OverViewModelData = sap.ui.getCore ( ).getModel ( "sapSplTourOverviewModel" ).getData ( );
			if ( OverViewModelData && OverViewModelData.results && OverViewModelData.results instanceof Array && oValue > 0 ) {
				return true;

			} else {
				return false;
			}
		}
	}
};

/**
 * @since 1.0
 * @static
 * @description core:function to sort an array of object
 * @param StopObject1 {object} 0..n
 * @param StopObject2 {object} 0..n
 * @returns {Integer}
 */

splReusable.libs.SapSplModelFormatters.sortStopObjectBasedOnSequenceNumber = function ( StopObject1, StopObject2 ) {
	if ( StopObject1 instanceof Object && StopObject2 instanceof Object ) {

		if ( StopObject1.Sequence > StopObject2.Sequence ) {
			return 1;
		}
		if ( StopObject1.Sequence < StopObject2.Sequence ) {
			return -1;
		}

	}
	return 0;
};

splReusable.libs.SapSplModelFormatters.getFormattedLocationGeometry = function ( sGeometry ) {
	var oGeometry = null, aCoordArray = [], sReturnString = "";
	try {
		if ( sGeometry && sGeometry.constructor === String ) {
			oGeometry = JSON.parse ( sGeometry );
			if ( oGeometry && oGeometry.coordinates && oGeometry.coordinates.constructor === Array && oGeometry.coordinates.length > 0 ) {
				aCoordArray = oGeometry.coordinates[0];
				if ( aCoordArray.constructor === Array ) {
					for ( var i = 0 ; i < aCoordArray.length ; i++ ) {
						sReturnString = sReturnString + aCoordArray[i][0] + ",    " + aCoordArray[i][1] + "\n";
					}
					return sReturnString;
				} else {
					return oGeometry.coordinates[0] + ",    " + oGeometry.coordinates[1];
				}
			} else {
				throw new Error ( "invalid arguments getFormattedLocationGeometry" );
			}
		} else {
			throw new Error ( "invalid arguments getFormattedLocationGeometry" );
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( e.message, "isVehicleSharable/requestStatus  not of type Integer/String", "SapSplModelFormatters.js" );
		}
	}
};

/**
 * @description To show Truck tab filter based on passed parameter flags
 * @static
 * @since 1.0
 * @example splReusable.libs.SapSplModelFormatters.showTruckSharingTab(1,1);
 * @param {Integer} isVehicleSharable
 * @param {String} requestStatus
 * @param {Integer} canViewShareVehicle
 * @param {String) status
 * @returns {Boolean} requestStatus
 */
splReusable.libs.SapSplModelFormatters.showTruckSharingTab = function ( isVehicleSharable, requestStatus, canViewShareVehicle, status ) {
	try {
		if ( isVehicleSharable.constructor === Number && requestStatus.constructor === String && canViewShareVehicle.constructor === Number ) {
			if ( canViewShareVehicle && isVehicleSharable ) {
				// Fix Incident 1472000543
				if ( requestStatus === "1" && status === "1" ) {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}

		} else {

			throw new Error ( "invalid arguments showTruckSharingTab" );
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( e.message, "isVehicleSharable/requestStatus  not of type Integer/String", "SapSplModelFormatters.js" );
		}
	}

};

/**
 * @description Returns title for BuPa Search Screen based on Role
 * @static
 * @since 1.0
 * @example splReusable.libs.SapSplModelFormatters.getTitleForFreelancerConnectDetailPage("Carrier");
 * @returns {string} Role
 */
splReusable.libs.SapSplModelFormatters.getTitleForFreelancerConnectDetailPage = function ( Role ) {
	try {
		if ( typeof (Role) === "string" ) {

			return oSapSplUtils.getBundle ( ).getText ( "BUSINESS_PARTNER_CONNECT_TITLE", Role );

		} else {

			throw new Error ( "invalid arguments getTitleForFreelancerConnectDetailPage" );
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( e.message, "Role  not of type String", "SapSplModelFormatters.js" );
		}
	}
};

splReusable.libs.SapSplModelFormatters.getGatesNameInDetailWindow = function ( aGates ) {

	if ( aGates && aGates.constructor === Array ) {
		var sReturnString = "";

		if ( aGates.length === 0 ) {
			return oSapSplUtils.getBundle ( ).getText ( "NO_GATES_DEFINED" );
		}

		for ( var i = 0 ; i < aGates.length ; i++ ) {
			sReturnString = sReturnString + " " + aGates[i]["Name"];
			if ( i !== aGates.length - 1 ) {
				sReturnString += ",  ";
			}
		}
		return sReturnString.substring ( 0, sReturnString.length );
	} else {
		return "";
	}
};

splReusable.libs.SapSplModelFormatters.getIncidentsNameInDetailWindow = function ( aIncidents ) {
	// Fix for the internal incident 1482008742
	if ( aIncidents && aIncidents.constructor === Array ) {
		var sReturnString = "";

		if ( aIncidents.length === 0 ) {
			return oSapSplUtils.getBundle ( ).getText ( "NO_INCIDENTS_TEXT" );
		}

		for ( var i = 0 ; i < aIncidents.length ; i++ ) {
			sReturnString = sReturnString + aIncidents[i]["Name"];
			if ( i !== aIncidents.length - 1 ) {
				sReturnString += ",  ";
			}
		}
		return sReturnString;
	} else {
		return "";
	}
};

splReusable.libs.SapSplModelFormatters.getGatesName = function ( aGates ) {

	if ( aGates && aGates.constructor === Array ) {
		var sReturnString = "";
		for ( var i = 0 ; i < aGates.length ; i++ ) {
			sReturnString = sReturnString + " " + aGates[i]["Name"];
			if ( i !== aGates.length - 1 ) {
				sReturnString += ",  ";
			}
		}
		return sReturnString.substring ( 0, sReturnString.length );
	} else {
		return "";
	}
};

splReusable.libs.SapSplModelFormatters.getIncidentsName = function ( aIncidents ) {
	// Fix for the internal incident 1482008742
	if ( aIncidents && aIncidents.constructor === Array ) {
		var sReturnString = "";
		for ( var i = 0 ; i < aIncidents.length ; i++ ) {
			sReturnString = sReturnString + aIncidents[i]["Name"];
			if ( i !== aIncidents.length - 1 ) {
				sReturnString += ",  ";
			}
		}
		return sReturnString;
	} else {
		return "";
	}
};

/**
 * @description Sets Auto Generated Tour Name based on Stop Names & Time & Returns True
 * @static
 * @since 1.0
 * @example splReusable.libs.SapSplModelFormatters.setTourName(modelData);
 * @returns {string} Role
 */
splReusable.libs.SapSplModelFormatters.setTourName = function ( modelData ) {
	try {
		if ( typeof (modelData) === "object" ) {

			var tempTourname = "";
			if ( modelData.isEdit === 1 ) {
				this.setValue ( modelData.Name );
				return true;
			} else {
				if ( !modelData.TourInputNameChanged ) {
					tempTourname = oSapSplUtils.getBundle ( ).getText ( "TOUR" );

					if ( tempTourname !== "" ) {
						var firstStopDate = new Date ( modelData.stopsRow[0]["Planned.ArrivalTime"] );
						var lastStopDate = new Date ( modelData.stopsRow[modelData.stopsRow.length - 1]["Planned.DepartureTime"] );

						/*
						 * Fix for Incident 1472020527 - removed the Suffix -
						 * "h"
						 */
						if ( firstStopDate.toLocaleDateString ( ) === lastStopDate.toLocaleDateString ( ) ) {
							tempTourname = tempTourname + ", " + (firstStopDate.getHours ( ) < 10 ? "0" + firstStopDate.getHours ( ) : firstStopDate.getHours ( )) + ":" +
									(firstStopDate.getMinutes ( ) < 10 ? "0" + firstStopDate.getMinutes ( ) : firstStopDate.getMinutes ( )) + " - " + (lastStopDate.getHours ( ) < 10 ? "0" + lastStopDate.getHours ( ) : lastStopDate.getHours ( )) +
									":" + (lastStopDate.getMinutes ( ) < 10 ? "0" + lastStopDate.getMinutes ( ) : lastStopDate.getMinutes ( ));
						} else {
							tempTourname = tempTourname + ", " + firstStopDate.toLocaleDateString ( ) + " " + (firstStopDate.getHours ( ) < 10 ? "0" + firstStopDate.getHours ( ) : firstStopDate.getHours ( )) + ":" +
									(firstStopDate.getMinutes ( ) < 10 ? "0" + firstStopDate.getMinutes ( ) : firstStopDate.getMinutes ( )) + " - " + lastStopDate.toLocaleDateString ( ) + " " +
									(lastStopDate.getHours ( ) < 10 ? "0" + lastStopDate.getHours ( ) : lastStopDate.getHours ( )) + ":" + (lastStopDate.getMinutes ( ) < 10 ? "0" + lastStopDate.getMinutes ( ) : lastStopDate.getMinutes ( ));
						}
					}
					this.setValue ( tempTourname );
				}

				return true;
			}
		} else {
			throw new Error ( "invalid arguments setTourName" );
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( e.message, "isEditFlag  not of type String", "SapSplModelFormatters.js" );
		}
	}
};

/**
 * @description Returns true if sType is "L00002" else returns false
 * @static
 * @since 1.0
 * @example SapSplModelFormatters.getVisibilityBasedOnType(sType);
 * @returns {Boolean}
 */
splReusable.libs.SapSplModelFormatters.getVisibilityBasedOnType = function ( sType ) {
	try {
		if ( sType !== undefined && sType !== null && sType.constructor === String ) {
			if ( sType === "L00002" || sType === "L00005" ) {
				return true;
			} else {
				return false;
			}
		} else {
			throw new Error ( "invalid arguments getVisibilityBasedOnType - locations" );
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( e.message, "Type flag not of type String", "SapSplModelFormatters.js" );
		}
	}
};

/**
 * @description Returns false if it is anyone except PRM
 * @static
 * @since 1.0
 * @example SapSplModelFormatters.getIncidentVisibilityBasedOnType(sType);
 * @returns {Boolean}
 */
splReusable.libs.SapSplModelFormatters.getIncidentVisibilityBasedOnType = function ( sType ) {
	try {
		if ( sap.ui.getCore ( ).getModel ( "sapSplAppConfigDataModel" ).getData ( )["isIncidentEditable"] === 0 ) {
			return false;
		} else {
			if ( sType !== undefined && sType !== null && sType.constructor === String ) {
				if ( sType === "L00002" || sType === "L00005" ) {
					return true;
				} else {
					return false;
				}
			} else {
				throw new Error ( "invalid arguments getVisibilityBasedOnType - locations" );
			}
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( e.message, "Type flag not of type String", "SapSplModelFormatters.js" );
		}
	}
};

// CSN FIX : 0120061532 0001483173 2014
/**
 * @description Returns false if sType is "L00002" else returns true
 * @static
 * @since 1.0
 * @example SapSplModelFormatters.getVisibilityBasedOnType(sType);
 * @returns {Boolean}
 */
splReusable.libs.SapSplModelFormatters.getAddressVisibilityBasedOnType = function ( sType ) {
	try {
		if ( sType !== undefined && sType !== null && sType.constructor === String ) {
			if ( sType === "L00002" || sType === "L00005" ) {
				return false;
			} else {
				return true;
			}
		} else {
			throw new Error ( "invalid arguments getAddressVisibilityBasedOnType - locations" );
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( e.message, "Type flag not of type String", "SapSplModelFormatters.js" );
		}
	}
};

/**
 * @description Returns true if isPublic is "1" else returns false
 * @static
 * @since 1.0
 * @example SapSplModelFormatters.getIsPublicValue(isPublic);
 * @returns {Boolean}
 */
splReusable.libs.SapSplModelFormatters.getIsPublicValue = function ( isPublic ) {
	try {
		if ( isPublic !== undefined && isPublic !== null && isPublic.constructor === String ) {
			if ( isPublic === "1" ) {
				return true;
			} else {
				return false;
			}
		} else {
			throw new Error ( "invalid arguments getIsPublicValue - locations" );
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( e.message, "isPublic flag not of type String", "SapSplModelFormatters.js" );
		}
	}
};

/**
 * @description Returns true if canPublish is "1" else returns false
 * @static
 * @since 1.0
 * @example SapSplModelFormatters.getCanPublishValue(isPublic);
 * @returns {Boolean}
 */
splReusable.libs.SapSplModelFormatters.getCanPublishValue = function ( canPublish ) {
	try {
		if ( canPublish !== undefined && canPublish !== null && canPublish.constructor === Number ) {
			if ( canPublish === 1 ) {
				return true;
			} else {
				return false;
			}
		} else {
			throw new Error ( "invalid arguments getCanPublishValue - locations" );
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( e.message, "canPublish flag not of type String", "SapSplModelFormatters.js" );
		}
	}
};

/**
 * @description Returns "All directions" if sGateName is "" else returns sGateName
 * @static
 * @since 1.0
 * @example SapSplModelFormatters.showGateName(sGateName);
 * @returns {sGateName}
 */
splReusable.libs.SapSplModelFormatters.showGateName = function ( sGateName ) {
	try {
		if ( sGateName.constructor === String ) {
			if ( sGateName.length === 0 ) {
				return oSapSplUtils.getBundle ( ).getText ( "ALL_DIRECTIONS_GATE" );
			} else {
				return sGateName;
			}
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( e.message, "sGateName is not of type String", "SapSplModelFormatters.js" );
		}
	}
};

/**
 * @description Returns true if Registrationnumber is not Null
 * @static
 * @since 1.0
 * @example splReusable.libs.SapSplModelFormatters.enableAssignTourButton(registrationNumber);
 * @returns {string} Role
 */
splReusable.libs.SapSplModelFormatters.enableAssignTourButton = function ( modelData ) {
	var noActionItems = 0;
	var freightItems = modelData.Items, registrationNumber = modelData.RegistrationNumber;
	if ( registrationNumber ) {
		if ( freightItems && freightItems.constructor === Array ) {
			if ( freightItems.length !== 0 ) {
				for ( var index = 0 ; index < freightItems.length ; index++ ) {
					if ( freightItems[index].pickActionHappened === "P" ) {
						if ( freightItems[index].dropActionHappened !== "D" ) {
							return false;
						} else {
							if ( !(modelData.stopsRow[freightItems[index].pickStopIndex]["Address.Name1"] && modelData.stopsRow[freightItems[index].dropStopIndex]["Address.Name1"]) ) {
								return false;
							}
						}
					} else {
						noActionItems++;
					}
				}
				if ( noActionItems === freightItems.length ) {
					return false;
				}

				return true;

			} else {
				return false;
			}
		} else {
			return false;
		}
		return true;
	} else {
		return false;
	}
};

/**
 * @description Returns fasle if Registrationnumber is not Null
 * @static
 * @since 1.0
 * @example splReusable.libs.SapSplModelFormatters.enableSaveTourButton(registrationNum);
 * @returns {Boolean} value
 */
splReusable.libs.SapSplModelFormatters.enableSaveTourButton = function ( registrationNum ) {
	if ( registrationNum && registrationNum.constructor !== "String" ) {
		if ( registrationNum.length < 0 ) {
			return true;
		} else {
			return false;
		}
	} else {
		return true;
	}
};

/**
 * @description Returns true if isEditable is 1
 * @static
 * @since 1.0
 * @example splReusable.libs.SapSplModelFormatters.sapSplTourDetailEditVisiblity(sValue);
 * @returns {boolean} isEditable
 */
splReusable.libs.SapSplModelFormatters.sapSplTourDetailEditVisiblity = function ( sEditable, sTourStatus ) {
	if ( (sEditable !== 1) || sTourStatus === "C" || sTourStatus === "I" ) {
		return false;
	} else {
		return true;
	}

};

splReusable.libs.SapSplModelFormatters.setVisibilityForBreakBulk = function ( freightItemType ) {
	try {
		if ( freightItemType.constructor === String ) {
			if ( freightItemType === "B" ) {
				return true;
			} else {
				return false;
			}
		} else {
			throw Error ( );
		}

	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( e.message, "Freight Item Type is not string", "SapSplModelFormatters.js" );
		}
	}
};

splReusable.libs.SapSplModelFormatters.setVisibilityForContainer = function ( freightItemType ) {
	try {
		if ( freightItemType.constructor === String ) {
			if ( freightItemType === "C" ) {
				return true;
			} else {
				return false;
			}
		} else {
			throw Error ( );
		}

	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( e.message, "Freight Item Type is not string", "SapSplModelFormatters.js" );
		}
	}
};

/**
 * @description Returns label for truck shared label
 * @static
 * @since 1.0
 * @example splReusable.libs.SapSplModelFormatters.showTruckShareLabel(sharedTrucks);
 * @returns {string} Label for Shared Trucks Label
 */
splReusable.libs.SapSplModelFormatters.showTruckShareLabel = function ( sharedTrucks ) {
	try {
		if ( sharedTrucks.constructor === Array ) {
			if ( sharedTrucks.length > 0 ) {
				return oSapSplUtils.getBundle ( ).getText ( "SHARED_TRUCKS" );
			} else {
				return oSapSplUtils.getBundle ( ).getText ( "NO_TRUCKS_SHARED" );
			}
		} else {
			throw Error ( );
		}

	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( e.message, "sharedTrucks Type is not Array", "SapSplModelFormatters.js" );
		}
	}
};

// CSN FIX : 0120061532 0001309803 2014
/**
 * Apppends all the fields in the address
 * 
 * @static
 * @since 1.0
 * @example splReusable.libs.SapSplModelFormatters.showTruckShareLabel(aAddressFields);
 * @returns {string} sAddress
 */
splReusable.libs.SapSplModelFormatters.getFormatedAddressFromAddressfields = function ( ) {
	var sAddress = "";
	var i, aAddressFieldsLength;
	try {
		aAddressFieldsLength = arguments.length;
		for ( i = 0 ; i < aAddressFieldsLength ; i++ ) {
			if ( arguments[i] !== null ) {
				sAddress += arguments[i];
				if ( (arguments[i].length !== 0) && (i !== aAddressFieldsLength - 1) ) {
					sAddress += ", \n";
				}
			}
		}
		return sAddress;

	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( e.message, "aAddressFields Type is not Array", "SapSplModelFormatters.js" );
		}
	}
};

/**
 * @description Returns true if sValue is 1
 * @static
 * @since 1.0
 * @example splReusable.libs.SapSplModelFormatters.sapSplGetVisibilityBasedOnSubscriptionModel(sValue);
 * @returns {boolean} sValue
 */
splReusable.libs.SapSplModelFormatters.sapSplGetVisibilityBasedOnSubscriptionModel = function ( sValue ) {
	try {
		if ( sValue.constructor === Number ) {
			if ( sValue === 1 ) {
				return true;
			} else {
				return false;
			}
		} else {
			throw Error ( );
		}

	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( e.message, "sValue Type is not Number", "SapSplModelFormatters.js" );
		}
	}

};

/**
 * Returns true if sValue is 1
 * 
 * @static
 * @since 1.0
 * @example splReusable.libs.SapSplModelFormatters.fnCanTerminateRelation(sValue);
 * @returns {boolean} sValue
 */
splReusable.libs.SapSplModelFormatters.fnCanTerminateRelation = function ( sValue, Status, RequestStatus, showFooterOptions ) {
	try {
		// Fix for internal incident : 1482007933 one more level of check added
		if ( showFooterOptions ) {
			if ( (Status !== "1") && (RequestStatus !== "1") ) {
				return false;
			} else {
				if ( sValue === 1 ) {
					return true;
				} else {
					return false;
				}
			}
		} else {
			return false;
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( e.message, "sValue Type is not Number", "SapSplModelFormatters.js" );
		}
	}
};

/*****************************************************************************************************************************************************
 * @description formatter method for showing the date in proper format.
 * @param sFromDate , stoDate date from backend.
 * @returns {Date} new Date()
 * @static
 * @since 1.0
 * @requires sap.ui.core.format.DateFormat
 * @example splReusable.libs.SapSplModelFormatters.showFormattedDateforUsageLog(sDate);//returns
 */
/***
 */
splReusable.libs.SapSplModelFormatters.showFormattedDateForUsageLog = function ( sFromDate, sToDate ) {
	var sFromDateString, sToDateString;

	try {
		if ( sFromDate && sToDate ) {
			sFromDateString = sap.ui.core.format.DateFormat.getDateInstance ( {
				pattern : "dd MMMM yyyy",
				style : "short"
			}, sap.ui.getCore ( ).getConfiguration ( ).getLocale ( ) ).format ( new Date ( sFromDate ), false );

			sToDateString = sap.ui.core.format.DateFormat.getDateInstance ( {
				pattern : "dd MMMM yyyy",
				style : "short"
			}, sap.ui.getCore ( ).getConfiguration ( ).getLocale ( ) ).format ( new Date ( sToDate ), false );

			return sFromDateString + "- " + sToDateString;

		} else {

			throw new Error ( );

		}

	} catch (e) {

		if ( e.constructor === Error ( ) ) {

			jQuery.sap.log.error ( e.message, "Date is undefined", "SapSplModelFormatters.js" );

		}

	}

};
/*****************************************************************************************************************************************************
 * @description formatter method for converting string in yyyymmdd format to date
 * @param sYyyymmddString
 * @returns {Date} new Date()
 * @static
 * @since 1.0
 * @example splReusable.libs.SapSplModelFormatters.convertYyyymmddtoDate("20141212");//returns
 */
/***
 */

splReusable.libs.SapSplModelFormatters.convertYyyymmddtoDate = function ( sYyyymmddString ) {

	return new Date ( sYyyymmddString.substring ( 0, 4 ), parseInt ( sYyyymmddString.substring ( 4, 6 ), 10 ) - 1, sYyyymmddString.substring ( 6, 8 ) );
};
/*****************************************************************************************************************************************************
 * @description formatter method appending localized text to vehicle count
 * @param sValue
 * @returns sValue Active Truck Count
 * @static
 * @since 1.0
 * @example splReusable.libs.SapSplModelFormatters.displayVehicleCount("12");//returns 12 Active trucks
 */
/***
 */

splReusable.libs.SapSplModelFormatters.displayVehicleCount = function ( sValue ) {
	if ( !sValue ) {
		sValue = 0;
	}
	return sValue + " " + oSapSplUtils.getBundle ( ).getText ( "ACTIVE_TRUCK_COUNT" );

};
/*****************************************************************************************************************************************************
 * @description formatter method appending localized text to user count
 * @param sValue
 * @returns sValue Active User Count
 * @static
 * @since 1.0
 * @example splReusable.libs.SapSplModelFormatters.displayUserCount("12");//returns 12 Active users
 */
/***
 */
splReusable.libs.SapSplModelFormatters.displayUserCount = function ( sValue ) {
	if ( !sValue ) {
		sValue = 0;
	}
	return sValue + " " + oSapSplUtils.getBundle ( ).getText ( "ACTIVE_USER_COUNT" );

};

/*****************************************************************************************************************************************************
 * @description formatter method appending event description
 * @param sStopName,sEventDescription
 * @returns sStopName+" : "+sEventDescription
 * @static
 * @since 1.0
 * @example splReusable.libs.SapSplModelFormatters.displayStopEventText("stopA","depatured");//returns stopA : depatured
 */
/***
 */
splReusable.libs.SapSplModelFormatters.displayStopEventText = function ( sEventType, sStopName, sEventDescription ) {
	var sEventText = " ";
	// FIX for CSN 158000381
	if ( sEventType === "S" ) {
		sEventText = sStopName + " : " + sEventDescription;
	} else {
		sEventText = sEventDescription;
	}
	return sEventText;
};

splReusable.libs.SapSplModelFormatters.encodeHTML = function ( sHTMLString ) {
	if ( sHTMLString ) {
		return jQuery.sap.encodeHTML ( sHTMLString );
	}
	return "";

};

/**
 * @description Display the logged on user's image in the header
 * @since 1.0
 * @param sImageUrl {String} The image URL maintained in User Profile application
 */
splReusable.libs.SapSplModelFormatters.displayImageInUShellHeader = function ( sImageUrl ) {
	if ( !sImageUrl || sImageUrl === null ) {
		return null;
	}
	return sImageUrl;
};

splReusable.libs.SapSplModelFormatters.enableDeleteStopButton = function ( stopArray ) {
	try {
		if ( stopArray && stopArray.constructor === Array ) {
			if ( stopArray.length > 2 ) {
				return true;
			} else {
				return false;
			}
		} else {
			throw Error ( );
		}

	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( e.message, "stopArray Type is not Array", "SapSplModelFormatters.js" );
		}
	}
};

splReusable.libs.SapSplModelFormatters.enableShiftStopToUpButton = function ( ) {
	return parseInt ( this.getParent ( ).getParent ( ).getBindingContext ( ).sPath.split ( "/" )[2], 10 ) === 0 ? false : true;
};

splReusable.libs.SapSplModelFormatters.enableShiftStopToDownButton = function ( stopArray ) {
	return parseInt ( this.getParent ( ).getParent ( ).getBindingContext ( ).sPath.split ( "/" )[2], 10 ) === (stopArray.length - 1) ? false : true;
};
/**
 * @description Hide the check box based on tour status.Hide the check box if status is completed or cancelled
 * @since 1.0
 * @param sValue {String}
 */

splReusable.libs.SapSplModelFormatters.setTourStatusEditable = function ( sValue ) {

	if ( sValue === "C" || sValue === "D" ) {
		this.addStyleClass ( "SapSplHideCompletedToursCheckBox" );
	}
	return false;
};
/**
 * @description set the enabled property of the button based on number of items selected
 * @since 1.0
 * @param sValue {Integer}
 */
splReusable.libs.SapSplModelFormatters.enableCompleteButton = function ( sValue ) {

	if ( sValue > 0 ) {
		return true;
	}
	return false;
};

/**
 * @description Display the message based on isSearchable flag
 * @since 1.0
 */
splReusable.libs.SapSplModelFormatters.displaySearchVisibilityMessage = function ( isSearchable ) {
	/*
	 * HOTFIX Condition check here being changed as per discussion on flag
	 * change
	 */
	if ( isSearchable === undefined || isSearchable === null || isSearchable === "1" ) {
		return oSapSplUtils.getBundle ( ).getText ( "SEARCH_VISIBILITY_VALUE_1" );
	} else {
		return oSapSplUtils.getBundle ( ).getText ( "SEARCH_VISIBILITY_VALUE_2" );
	}
};

splReusable.libs.SapSplModelFormatters.displayTourAutomationMessage = function ( sTourCreationMode ) {
	if ( sTourCreationMode === undefined ) {
		return null;
	}
	switch ( sTourCreationMode ) {
		case "M": // Manual creation mode only
			return oSapSplUtils.getBundle ( ).getText ( "COMPANY_PROFILE_TOUR_CREATION_MANUAL_ENABLED" );
		case "I": // Automation and manual mode
			return oSapSplUtils.getBundle ( ).getText ( "COMPANY_PROFILE_TOUR_CREATION_AUTOMATION_ENABLED" );
		case "": // Both enabled
			return oSapSplUtils.getBundle ( ).getText ( "COMPANY_PROFILE_TOUR_CREATION_BOTH_ENABLED" );
		default:
			return "";
	}
};

splReusable.libs.SapSplModelFormatters.getSelectedSearchState = function ( iIsVisibleOnSearch ) {
	/* CSNFIX 754183 2014 */
	/*
	 * HOTFIX Condition check here being changed as per discussion on flag
	 * change
	 */
	return (iIsVisibleOnSearch === undefined || iIsVisibleOnSearch === null || iIsVisibleOnSearch === "1") ? true : false;
};

/**
 * @description function to disable the create tour button ,based on "TourInputType"
 * @since 1.0
 * @param {string} sTourInputType
 * @returns boolean
 */

splReusable.libs.SapSplModelFormatters.enableCreateTour = function ( sTourInputType ) {

	if ( sTourInputType === "I" ) {
		return false;
	}
	return true;
};

splReusable.libs.SapSplModelFormatters.walletVisibility = function ( sCanMaintainWallet ) {

	if ( sCanMaintainWallet === 0 ) {
		return false;
	}
	return true;
};

splReusable.libs.SapSplModelFormatters.enableDropRemainingFreightItemsLink = function ( items, rowIndex ) {
	try {
		if ( items && items.constructor === Array ) {
			var stopIndex;
			if ( rowIndex === undefined ) {
				stopIndex = parseInt ( this.getParent ( ).getParent ( ).getBindingContext ( ).sPath.split ( "/" )[2], 10 );
			} else {
				stopIndex = rowIndex;
			}
			var modelData = sap.ui.getCore ( ).getModel ( "SplCreateNewTourModel" ).getData ( );

			if ( stopIndex === (modelData.stopsRow.length - 1) ) {
				if ( modelData.stopsRow[stopIndex].LocationUUID ) {
					if ( items.length > 0 ) {
						for ( var i = 0 ; i < items.length ; i++ ) {
							if ( items[i].pickActionHappened === "P" && items[i].dropActionHappened === "N" ) {
								return true;
							}
						}
						return false;
					} else {
						return false;
					}
				} else {
					return false;
				}
			} else {
				return false;
			}
		} else {
			throw Error ( );
		}

	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( e.message, "items Type is not Array", "SapSplModelFormatters.js" );
		}
	}
};

splReusable.libs.SapSplModelFormatters.enableRemoveTruckLink = function ( registrationNumber ) {
	if ( registrationNumber ) {
		return true;
	} else {
		return false;
	}
};

splReusable.libs.SapSplModelFormatters.showEditable2 = function ( oValue1, oValue2 ) {
	if ( oValue1 === 1 && oValue2 === true ) {
		return true;
	} else {
		return false;
	}
};

splReusable.libs.SapSplModelFormatters.getTourName = function ( sTourName, sShareDirection, sTourActive ) {
	if ( sShareDirection === "O" ) {
		return "-";
	} else {
		if ( sTourActive === null ) {
			return "-";
		} else if ( sTourActive === 0 ) {
			return sTourName;
		} else {
			return sTourName;
		}
	}
};

splReusable.libs.SapSplModelFormatters.getTourStatus = function ( sTourActive, sShareDirection ) {
	if ( sShareDirection === "O" ) {
		return "-";
	} else {
		if ( sTourActive === null ) {
			return oSapSplUtils.getBundle ( ).getText ( "NOT_IN_USE" );
		} else if ( sTourActive === 0 ) {
			return oSapSplUtils.getBundle ( ).getText ( "FUTURE_TOUR" );
		} else {
			this.addStyleClass ( "greenActiveLabel" );
			return oSapSplUtils.getBundle ( ).getText ( "FILTER_LABEL_ACTIVE" );
		}
	}
};

splReusable.libs.SapSplModelFormatters.getTourDate = function ( sTourDate, sShareDirection, sTourActive ) {
	if ( sShareDirection === "O" ) {
		return "-";
	} else {
		if ( sTourActive === null ) {
			return "-";
		} else if ( sTourActive === 0 ) {
			return sTourDate;
		} else {
			return sTourDate;
		}
	}
};

splReusable.libs.SapSplModelFormatters.getConsequence = function ( sShareDirection, sTourActive ) {
	if ( sShareDirection === "O" ) {
		return oSapSplUtils.getBundle ( ).getText ( "TRUCK_WILL_BE_UNSHARED" );
	} else {
		if ( sTourActive === null ) {
			return oSapSplUtils.getBundle ( ).getText ( "TRUCK_WILL_BE_UNSHARED" );
		} else if ( sTourActive === 0 ) {
			return oSapSplUtils.getBundle ( ).getText ( "TRUCK_WILL_BE_UNSHARED_ON_TOUR_COMPLETION" );
		} else {
			return oSapSplUtils.getBundle ( ).getText ( "TRUCK_WILL_BE_UNSHARED" );
		}
	}
};

splReusable.libs.SapSplModelFormatters.isPanelVisible = function ( iCanDelete ) {
	return (iCanDelete === 1);
};

splReusable.libs.SapSplModelFormatters.getSapSplCountBasedOnKey = function ( leftPanelModel ) {
	try {
		if ( leftPanelModel && leftPanelModel.constructor === Array ) {
			var tag, count = 0;

			if ( this.getKey ( ) === "Geofences" ) {
				tag = "LC0004";
			} else if ( this.getKey ( ) === "ParkingSpace" ) {
				tag = "LC0002";
			} else if ( this.getKey ( ) === "Bridge" ) {
				tag = "LC0001";
			} else if ( this.getKey ( ) === "ContainerTerminals" ) {
				tag = "LC0003";
			} else {
				tag = "LC0007";
			}

			for ( var i = 0 ; i < leftPanelModel.length ; i++ ) {
				if ( leftPanelModel[i].Tag === tag ) {
					count++;
				}
			}

			if ( count > 0 ) {
				return count;
			} else {
				throw Error ( );
			}
		} else {
			throw Error ( );
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( e.message, "leftPanelModel Type is not Array or Count is less than 0", "SapSplModelFormatters.js" );
		}
	}

};

/*****************************************************************************************************************************************************
 * @description formatter method to disable item in the table if Searched Business Partner is already connected
 * @param isConnectedFlag
 * @returns true if connected & sets disable property else false
 * @static
 * @since 1.0
 * @example splReusable.libs.SapSplModelFormatters.disableListItemCheckBox(1);
 */
/***
 */
splReusable.libs.SapSplModelFormatters.disableListItemCheckBox = function ( isConnectedFlag ) {

	try {

		if ( isConnectedFlag !== undefined && isConnectedFlag !== null && isConnectedFlag.constructor === Number ) {
			if ( isConnectedFlag === 1 ) {
				this.addStyleClass ( "SapSplDisableListItemCheckBox" );
				this.getParent ( ).addStyleClass ( "SapSplFreelancerTable" );
				return true;
			}
			this.removeStyleClass ( "SapSplDisableListItemCheckBox" );
			this.getParent ( ).removeStyleClass ( "SapSplFreelancerTable" );
			return false;
		} else {
			throw Error ( );
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( "SAP SCL Model Formatter", "isConnectedFlag is not number. Error: " + e.message, "SAPSCL" );
		}
	}

};

/*****************************************************************************************************************************************************
 * @description formatter method to get value unit together
 * @param value, unit
 * @returns value unit
 * @static
 * @since 1.0
 * @example splReusable.libs.SapSplModelFormatters.getValueUnitCombination("1000","kgs"); //return "1000 kgs"
 */
/***
 */
splReusable.libs.SapSplModelFormatters.getValueUnitCombination = function ( value, unit ) {
	try {

		if ( value !== undefined && value !== null && value.constructor === String && unit !== undefined && unit !== null && unit.constructor === String ) {
			if ( value.length > 0 ) {
				return value + " " + unit;
			} else {
				return "";
			}

		} else {
			throw Error ( );
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( "SAP SCL Model Formatter", "value or unit is not String. Error: " + e.message, "SAPSCL" );
		}
	}
};

/*****************************************************************************************************************************************************
 * @description formatter method to get quantity value unit together if freight item type is B else just containertype
 * @param type, containerType, quantityValue, quantityUnit
 * @returns value
 * @static
 * @since 1.0
 * @example splReusable.libs.SapSplModelFormatters.getValueForAddFreightItemsTable("B", "",1000","kgs"); //return "1000 kgs"
 */
/***
 */
splReusable.libs.SapSplModelFormatters.getValueForAddFreightItemsTable = function ( type, containerType, quantityValue, quantityUnit ) {
	if ( type === "C" ) {
		return containerType;
	} else {
		return quantityValue + " " + quantityUnit;
	}
};

/*****************************************************************************************************************************************************
 * @description formatter method to get volume value unit together if freight item type is B else just ""
 * @param type, volumeValue, volumeUnit
 * @returns value
 * @static
 * @since 1.0
 * @example splReusable.libs.SapSplModelFormatters.getVolumeForAddFreightItemsTable("C","1000","kgs"); //return ""
 */
/***
 */
splReusable.libs.SapSplModelFormatters.getVolumeForAddFreightItemsTable = function ( type, volumeValue, volumeUnit ) {
	if ( type === "C" ) {
		return "";
	} else {
		return volumeValue + " " + volumeUnit;
	}
};

/*****************************************************************************************************************************************************
 * @description formatter method to get Next Stop Planned Arrival Time in HH:MM Format
 * @param aDate
 * @returns formattedTime
 * @static
 * @since 1.0
 * @example splReusable.libs.SapSplModelFormatters.getValueForAddFreightItemsTable(new Date()); //return "HH:MMh"
 */
/***
 */
splReusable.libs.SapSplModelFormatters.returnPlannedArrivalTime = function ( aDate ) {

	try {
		if ( aDate !== undefined && aDate !== null && aDate.constructor === Date ) {
			var fHours = "", fMinutes = "";

			if ( aDate.getHours ( ).toString ( ).length > 1 ) {
				fHours = aDate.getHours ( ).toString ( );
			} else {
				fHours = "0" + aDate.getHours ( ).toString ( );
			}

			if ( aDate.getMinutes ( ).toString ( ).length > 1 ) {
				fMinutes = aDate.getMinutes ( ).toString ( );
			} else {
				fMinutes = "0" + aDate.getMinutes ( ).toString ( );
			}
			/* Fix for Incident 1472020527 - removed the Suffix - "h" */
			return " " + fHours + ":" + fMinutes;
		} else {
			throw Error ( );
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( "SAP SCL Model Formatter", "aDate is not in Date format. Error: " + e.message, "SAPSCL" );
		}
	}

};

/*****************************************************************************************************************************************************
 * @description formatter method to get Next Stop Estimated Arrival Time in HH:MM Format and style the text to green if Estimated is <= Planned else
 *              Orange
 * @param etaDate, aDate
 * @returns formattedTime
 * @static
 * @since 1.0
 * @example splReusable.libs.SapSplModelFormatters.returnEstimatedArrivalTime(new Date()); //return "(HH:MMh)"
 */
/***
 */
splReusable.libs.SapSplModelFormatters.returnEstimatedArrivalTime = function ( etaDate, aDate ) {

	try {
		if ( etaDate !== undefined && etaDate !== null && etaDate.constructor === Date && aDate !== undefined && aDate !== null && aDate.constructor === Date ) {

			var fHours = "", fMinutes = "";

			if ( etaDate.getHours ( ).toString ( ).length > 1 ) {
				fHours = etaDate.getHours ( ).toString ( );
			} else {
				fHours = "0" + etaDate.getHours ( ).toString ( );
			}

			if ( etaDate.getMinutes ( ).toString ( ).length > 1 ) {
				fMinutes = etaDate.getMinutes ( ).toString ( );
			} else {
				fMinutes = "0" + etaDate.getMinutes ( ).toString ( );
			}

			if ( etaDate > aDate ) {
				this.addStyleClass ( "SapSplETAOrange" );
			} else {
				this.addStyleClass ( "SapSplETAGreen" );
			}

			/* Fix for Incident 1472020527 - removed the Suffix - "h" */
			return "(" + fHours + ":" + fMinutes + ")";
		} else {
			throw Error ( );
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( "SAP SCL Model Formatter", "aDate or etaDate is not in Date format. Error: " + e.message, "SAPSCL" );
		}
	}

};

/**
 * @description function to return the visiblity text for hub
 * @static
 * @since 1.0
 * @param {String} Value isVisibleOnSearch.
 * @returns {String} Text for visibility column
 */
splReusable.libs.SapSplModelFormatters.getVisibilityText = function ( isVisibleOnSearch ) {
	try {
		if ( isVisibleOnSearch !== null && isVisibleOnSearch !== undefined && isVisibleOnSearch.constructor === String ) {
			if ( isVisibleOnSearch === "1" ) {
				return oSapSplUtils.getBundle ( ).getText ( "YES" );
			} else {
				return oSapSplUtils.getBundle ( ).getText ( "NO" );
			}
		} else {
			throw Error ( );
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( "SAP SCL Model Formatter", "isVisibleOnSearch is not in String format. Error: " + e.message, "SAPSCL" );
		}
	}

};

/**
 * @description function to return the Notification Validity Text
 * @static
 * @since 1.0
 * @param {String} isActive
 * @returns {String} Text for Validity Field
 */
splReusable.libs.SapSplModelFormatters.getNotificationValidityText = function ( isActive ) {
	try {
		if ( isActive !== undefined && isActive !== null && isActive.constructor === String ) {
			if ( isActive === "1" ) {
				return oSapSplUtils.getBundle ( ).getText ( "ACTIVE" );
			} else {
				return oSapSplUtils.getBundle ( ).getText ( "EXPIRED" );
			}
		} else {
			throw Error ( );
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( "SAP SCL Model Formatter", "isActive is not in String format. Error: " + e.message, "SAPSCL" );
		}
	}
};

/**
 * @description function to return the Message Notification Type
 * @static
 * @since 1.0
 * @param {String} messageType
 * @returns {String} Localized Text for Notification Message Type
 */
splReusable.libs.SapSplModelFormatters.getMessageTypeForNotification = function ( messageType ) {
	try {
		if ( messageType !== undefined && messageType !== null && messageType.constructor === String ) {
			if ( messageType === "DUN" ) {
				return oSapSplUtils.getBundle ( ).getText ( "FILTER_LABEL_DB_UPGRADE" );
			} else if ( messageType === "CHN" ) {
				return oSapSplUtils.getBundle ( ).getText ( "FILTER_LABEL_CRITICAL_HOTFIX" );
			} else if ( messageType === "PAN" ) {
				return oSapSplUtils.getBundle ( ).getText ( "FILTER_LABEL_PATCH" );
			} else if ( messageType === "OUN" ) {
				return oSapSplUtils.getBundle ( ).getText ( "FILTER_LABEL_OS_UPGRADE" );
			}
		} else {
			throw Error ( );
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( "SAP SCL Model Formatter", "messageType is not in String format. Error: " + e.message, "SAPSCL" );
		}
	}
};

/**
 * @description function to return the Message Notification validity state
 * @static
 * @since 1.0
 * @param {String} isActive
 * @returns {String} validity state for object list item status property
 */
splReusable.libs.SapSplModelFormatters.getNotificationValidityState = function ( isActive ) {
	try {
		if ( isActive !== undefined && isActive !== null && isActive.constructor === String ) {

			if ( isActive === "1" ) {
				return "Error";
			} else {
				return "None";
			}
		} else {
			throw Error ( );
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( "SAP SCL Model Formatter", "isActive is not in String format. Error: " + e.message, "SAPSCL" );
		}
	}
};
/**
 * @description function to return the visiblity text for hub
 * @static
 * @since 1.0
 * @param {String} Value isVisibleOnSearch.
 * @returns {String} Text for visibility column
 */
splReusable.libs.SapSplModelFormatters.showFormatedBupaCount = function ( BupaCount ) {
	try {
		if ( !BupaCount ) {
			BupaCount = 0;
		}
		return BupaCount + " " + oSapSplUtils.getBundle ( ).getText ( "BUSINESS_PARTNERS" );
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( "SAP SCL Model Formatter", "OrganizationName is not in String format. Error: " + e.message, "SAPSCL" );
		}
	}

};
/**
 * @description function to return the HUB COUNT
 * @static
 * @since 1.0
 * @param {Integer} Value iHubCount.
 * @returns {String} Formatted Text
 */
splReusable.libs.SapSplModelFormatters.setUsageLogTableHeaderText = function ( iHubCount ) {

	return oSapSplUtils.getBundle ( ).getText ( "HUBS" ) + " (" + iHubCount + ")";

};

splReusable.libs.SapSplModelFormatters.getNotificationSaveButtonEnabled = function ( modelData ) {
	if ( modelData.MessageType !== undefined && modelData.MessageType === "Select" ) {
		return false;
	}
	if ( modelData.Text1 !== undefined && modelData.Text1.length === 0 ) {
		return false;
	}
	return true;
};

/*****************************************************************************************************************************************************
 * @description formatter method appending localized text to vehicle count
 * @param sValue
 * @returns sValue Active Truck Count
 * @static
 * @since 1.0
 * @example splReusable.libs.SapSplModelFormatters.displayBupaCount("12");//returns 12 Business Partners(s)
 */
/***
 */

splReusable.libs.SapSplModelFormatters.displayBupCount = function ( sValue ) {
	if ( !sValue ) {
		sValue = 0;
	}
	return sValue + " " + oSapSplUtils.getBundle ( ).getText ( "TOTAL_BUSINESS_PARTNER" );

};

/*****************************************************************************************************************************************************
 * @description formatter method appending localized text to user count
 * @param sValue
 * @returns sValue Active User Count
 * @static
 * @since 1.0
 * @example splReusable.libs.SapSplModelFormatters.displayDeviceCount("12");//returns 12 Telematic Unit(s)
 */
/***
 */
splReusable.libs.SapSplModelFormatters.displayDeviceCount = function ( sValue ) {
	if ( !sValue ) {
		sValue = 0;
	}
	return sValue + " " + oSapSplUtils.getBundle ( ).getText ( "TOTAL_TELEMATIC_UNITS" );
};
/*****************************************************************************************************************************************************
 * @description formatter method appending localized text to user count
 * @param sValue
 * @returns sValue User Count
 * @static
 * @since 1.0
 * @example splReusable.libs.SapSplModelFormatters.displayHubUserCount("12");//returns 12 User(s)
 */
/***
 */
splReusable.libs.SapSplModelFormatters.displayHubUserCount = function ( sValue ) {
	if ( !sValue ) {
		sValue = 0;
	}
	return sValue + " " + oSapSplUtils.getBundle ( ).getText ( "TOTAL_HUB_USERS" );

};

/*****************************************************************************************************************************************************
 * @description formatter method appending localized text to Excluded Count
 * @param sValue
 * @returns sValue
 * @static
 * @since 1.0
 * @example splReusable.libs.SapSplModelFormatters.showFormatedExcludedCount("12");//returns (12 excluded)
 */
/***
 */
splReusable.libs.SapSplModelFormatters.showFormatedExcludedCount = function ( sValue ) {
	if ( !sValue || sValue === 0 || sValue === "0" ) {
		return null;
	}
	return "(" + sValue + " " + oSapSplUtils.getBundle ( ).getText ( "EXCLUDED_USERS" ) + ")";

};

splReusable.libs.SapSplModelFormatters.getVisibilityOfEditNotificationButton = function ( isActive, showFooterButton ) {
	if ( showFooterButton ) {
		try {
			if ( isActive !== undefined && isActive !== null && isActive.constructor === String ) {

				if ( isActive === "1" ) {
					return true;
				} else {
					return false;
				}
			} else {
				throw Error ( );
			}
		} catch (e) {
			if ( e.constructor === Error ( ) ) {
				jQuery.sap.log.error ( "SAP SCL Model Formatter", "isActive is not in String format. Error: " + e.message, "SAPSCL" );
			}
		}
	} else {
		return false;
	}
};

/**
 * @descriotion To get the name of the default display area with a "*" in the end.
 * @static
 * @since 1.0
 * @example splReusable.libs.SapSplModelFormatters.getDefaultDisplayAreaName(sName);
 * @param {string} sName
 * @returns {string} name of the display area with a "*" in the end
 */
splReusable.libs.SapSplModelFormatters.getDefaultDisplayAreaName = function ( sName, isDefault ) {
	if ( sName !== null && sName !== undefined ) {
		if ( isDefault !== null && isDefault !== undefined && isDefault === 1 ) {
			return sName + " *";
		} else {
			return sName;
		}
	}
};

/**
 * @description To get the communication log direction.
 * @static
 * @since 1.0
 * @example splReusable.libs.SapSplModelFormatters.communicationLogDirection("I");
 * @param {string} sDirection
 * @returns {string} "Inbound" is direction is "I" and "Outbound" if direction is "O"
 */
splReusable.libs.SapSplModelFormatters.communicationLogDirection = function ( sDirection ) {
	if ( sDirection !== null && sDirection !== undefined ) {
		if ( sDirection === "I" ) {
			return oSapSplUtils.getBundle ( ).getText ( "INBOUND_DIRECTION" );
		} else {
			return oSapSplUtils.getBundle ( ).getText ( "OUTBOUND_DIRECTION" );
		}
	}
};

/**
 * @descriotion To get the date object from an EDM.Time object in OData
 * @static
 * @since 1.0
 * @example splReusable.libs.SapSplModelFormatters.getDateFromStringForCSV();
 * @param {string} oValue
 * @returns {string} The converted date (in UTC format)
 */
splReusable.libs.SapSplModelFormatters.getDateFromStringForCSV = function ( oValue ) {
	if ( oValue ) {
		return sap.ui.core.format.DateFormat.getDateInstance ( {
			pattern : "dd MM yyyy hh mm ss",
			style : "short"
		}, sap.ui.getCore ( ).getConfiguration ( ).getLocale ( ) ).format ( new Date ( oValue ), false );
	} else {
		return null;
	}
};

splReusable.libs.SapSplModelFormatters.getStateOfObjectStatusForActualDuration = function ( TourState ) {
	try {
		if ( TourState !== undefined && TourState !== null && TourState.constructor === Number ) {

			if ( TourState === 2 ) {
				return "Success";
			} else if ( TourState === 1 ) {
				return "Warning";
			} else if ( TourState === 0 ) {
				return "Error";
			}
		} else {
			throw Error ( );
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( "SAP SCL Model Formatter", "TourState is not in Number format. Error: " + e.message, "SAPSCL" );
		}
	}
};

splReusable.libs.SapSplModelFormatters.getColorForTourDelayChart = function ( TourState ) {
	try {
		if ( TourState !== undefined && TourState !== null && TourState.constructor === Number ) {

			if ( TourState === 2 ) {
				return "Good";
			} else if ( TourState === 1 ) {
				return "Critical";
			} else if ( TourState === 0 ) {
				return "Error";
			}
		} else {
			throw Error ( );
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( "SAP SCL Model Formatter", "actualDuration or plannedDuration is not in Number format. Error: " + e.message, "SAPSCL" );
		}
	}
};

splReusable.libs.SapSplModelFormatters.getTourDurationFromSeconds = function ( sSeconds ) {

	try {
		if ( sSeconds !== undefined && sSeconds !== null && sSeconds.constructor === String ) {

			var iSeconds = parseInt ( sSeconds, 10 );

			var iMinutes = parseInt ( iSeconds / 60, 10 );

			if ( iMinutes < 60 ) {
				if ( iMinutes < 10 ) {
					return "00:0" + iMinutes;
				} else {
					return "00:" + iMinutes;
				}
			} else {
				var iHours = parseInt ( iMinutes / 60, 10 );
				var iRemainingMinutes = iMinutes - iHours * 60;
				if ( iHours < 10 ) {
					iHours = "0" + iHours;
				}
				if ( iRemainingMinutes < 10 ) {
					iRemainingMinutes = "0" + iRemainingMinutes;
				}

				return iHours + ":" + iRemainingMinutes;
			}
		} else {
			throw Error ( );
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( "SAP SCL Model Formatter", "sSeconds is not in String format. Error: " + e.message, "SAPSCL" );
		}
	}
};

splReusable.libs.SapSplModelFormatters.getTourDurationInTextFormatFromSeconds = function ( sSeconds ) {

	try {
		if ( sSeconds !== undefined && sSeconds !== null && sSeconds.constructor === String ) {

			var iSeconds = parseInt ( sSeconds, 10 );
			var iMinutes = parseInt ( iSeconds / 60, 10 );
			var returnStr = "";

			function _getCorrectFormat ( sStr, val ) {
				var sReturnStr = "";
				if ( sStr === "M" ) {
					if ( val === 1 ) {
						sReturnStr = val + " " + oSapSplUtils.getBundle ( ).getText ( "LABEL_MINUTE" );
					} else {
						sReturnStr = val + " " + oSapSplUtils.getBundle ( ).getText ( "LABEL_MINUTES" );
					}
				} else if ( sStr === "H" ) {
					if ( val === 1 ) {
						sReturnStr = val + " " + oSapSplUtils.getBundle ( ).getText ( "TOUR_SETTINGS_HOUR" );
					} else {
						sReturnStr = val + " " + oSapSplUtils.getBundle ( ).getText ( "TOUR_SETTINGS_HOURS" );
					}
				} else if ( sStr === "D" ) {
					if ( val === 1 ) {
						sReturnStr = val + " " + oSapSplUtils.getBundle ( ).getText ( "TOUR_SETTINGS_DAY" );
					} else {
						sReturnStr = val + " " + oSapSplUtils.getBundle ( ).getText ( "TOUR_SETTINGS_DAYS" );
					}
				}
				return sReturnStr;
			}

			if ( iMinutes < 60 ) {
				returnStr = _getCorrectFormat ( "M", iMinutes );

			} else {
				var iRemainingMinutes, iHours;
				iHours = parseInt ( iMinutes / 60, 10 );
				if ( iHours < 24 ) {
					iRemainingMinutes = iMinutes - iHours * 60;
					if ( iRemainingMinutes === 0 ) {
						returnStr = _getCorrectFormat ( "H", iHours );
					} else {
						returnStr = _getCorrectFormat ( "H", iHours ) + ", " + _getCorrectFormat ( "M", iRemainingMinutes );
					}
				} else {
					var iDays = parseInt ( iHours / 24, 10 );
					iRemainingMinutes = iMinutes - iDays * 24 * 60;
					iHours = parseInt ( iRemainingMinutes / 60, 10 );
					if ( iHours === 0 ) {
						if ( iRemainingMinutes === 0 ) {
							returnStr = _getCorrectFormat ( "D", iDays );
						} else {
							returnStr = _getCorrectFormat ( "D", iDays ) + ", " + _getCorrectFormat ( "M", iRemainingMinutes );
						}
					} else {
						var finalMinutes = iRemainingMinutes - iHours * 60;
						if ( finalMinutes === 0 ) {
							returnStr = _getCorrectFormat ( "D", iDays ) + " ," + _getCorrectFormat ( "H", iHours );
						} else {
							returnStr = _getCorrectFormat ( "D", iDays ) + " ," + _getCorrectFormat ( "H", iHours ) + ", " + _getCorrectFormat ( "M", finalMinutes );
						}
					}
				}
			}
			return returnStr;
		} else {
			throw Error ( );
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( "SAP SCL Model Formatter", "sSeconds is not in String format. Error: " + e.message, "SAPSCL" );
		}
	}
};

splReusable.libs.SapSplModelFormatters.getVisibilityForActualDuarationStatus = function ( duration ) {
	if ( duration !== undefined && duration !== null && duration.constructor === String ) {
		return true;
	} else {
		return false;
	}
};

splReusable.libs.SapSplModelFormatters.getTourStatusVisibilityBasedOnStatus = function ( tourStatus ) {
	try {
		if ( tourStatus !== undefined && tourStatus !== null && tourStatus.constructor === String ) {

			if ( tourStatus === "C" ) {
				return true;
			} else {
				return false;
			}
		} else {
			throw Error ( );
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( "SAP SCL Model Formatter", "tourStatus is not in String format. Error: " + e.message, "SAPSCL" );
		}
	}
};

splReusable.libs.SapSplModelFormatters.getTourDelayCount = function ( tourDelay ) {
	try {
		if ( tourDelay !== undefined && tourDelay !== null && tourDelay.constructor === Number ) {

			if ( tourDelay > 1 ) {
				return tourDelay + " " + oSapSplUtils.getBundle ( ).getText ( "DELAYS" );
			} else {
				return tourDelay + " " + oSapSplUtils.getBundle ( ).getText ( "DELAY" );
			}
		} else {
			throw Error ( );
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( "SAP SCL Model Formatter", "tourDelay is not in Number format. Error: " + e.message, "SAPSCL" );
		}
	}
};

splReusable.libs.SapSplModelFormatters.setTourDelayCountVisibility = function ( tourDelay ) {
	try {
		if ( tourDelay !== undefined && tourDelay !== null && tourDelay.constructor === Number ) {

			if ( tourDelay > 0 ) {
				return true;
			} else {
				return false;
			}

		} else {
			throw Error ( );
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( "SAP SCL Model Formatter", "tourDelay is not in Number format. Error: " + e.message, "SAPSCL" );
		}
	}
};

splReusable.libs.SapSplModelFormatters.getStopDelayInMinutesForPopup = function ( iDelayInSeconds ) {
	try {
		if ( iDelayInSeconds !== undefined && iDelayInSeconds !== null && iDelayInSeconds.constructor === String ) {

			var iSeconds = parseInt ( iDelayInSeconds, 10 );

			var iMinutes = parseInt ( iSeconds / 60, 10 );

			var sDelay;

			if ( iMinutes > 0 ) {
				this.addStyleClass ( "sapSplTourDelayTextRed" );
				sDelay = "+";
			} else {
				this.addStyleClass ( "sapSplTourDelayTextGreen" );
				sDelay = "";
			}

			if ( Math.abs ( iMinutes ) > 1 ) {
				sDelay = sDelay + iMinutes + " " + oSapSplUtils.getBundle ( ).getText ( "MINUTES" );
			} else {
				sDelay = sDelay + iMinutes + " " + oSapSplUtils.getBundle ( ).getText ( "MINUTE" );
			}

			return sDelay;

		} else {
			throw Error ( );
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( "SAP SCL Model Formatter", "iDelayInSeconds is not in String format. Error: " + e.message, "SAPSCL" );
		}
	}
};

splReusable.libs.SapSplModelFormatters.setTourStatusState = function ( status ) {
	try {
		if ( status !== undefined && status !== null && status.constructor === String ) {

			if ( status === "C" ) {
				return "Success";
			} else {
				return "None";
			}

		} else {
			throw Error ( );
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( "SAP SCL Model Formatter", "status is not in String format. Error: " + e.message, "SAPSCL" );
		}
	}
};

splReusable.libs.SapSplModelFormatters.getFilteredStopEvents = function ( oEvent ) {
	if ( oEvent.EventType === "S" ) {
		return true;
	} else {
		return false;
	}
};

splReusable.libs.SapSplModelFormatters.getFilteredParticularStopEvents = function ( oEvent ) {
	if ( oEvent.StopUUID === this.UUID ) {
		return true;
	} else {
		return false;
	}
};

splReusable.libs.SapSplModelFormatters.setTourProgressBar = function ( UUID, aStopObject ) {

	try {
		if ( aStopObject !== undefined && aStopObject !== null && aStopObject.constructor === Object ) {

			var i, j, k, flag = false, aEvent = aStopObject.Events, stopPickItems = [], stopDropItems = [];

			if ( UUID === sap.ui.getCore ( ).getModel ( "sapSplTourDetailsModel" ).getData ( ).data.CurrentStop ) {
				for ( i = 14 ; i > -1 ; i = i - 2 ) {
					for ( j = 0 ; j < aEvent.length ; j++ ) {
						if ( this.getContent ( )[i].sId.search ( aEvent[j].EventCode ) > -1 ) {
							flag = true;
							break;
						}
					}
					if ( flag ) {
						break;
					}
				}

				if ( i !== -2 ) {
					for ( k = 0 ; k <= i ; k++ ) {
						this.getContent ( )[k].removeStyleClass ( "SapSplTourEventGrey" );
						this.getContent ( )[k].addStyleClass ( "SapSplTourEventGreen" );
					}

					for ( k = i + 1 ; k <= 14 ; k++ ) {
						this.getContent ( )[k].removeStyleClass ( "SapSplTourEventGreen" );
						this.getContent ( )[k].addStyleClass ( "SapSplTourEventGrey" );
					}
				}

				stopPickItems = aStopObject.AssignedItems.results.filter ( splReusable.libs.SapSplModelFormatters.getFilteredPickItems );
				stopDropItems = aStopObject.AssignedItems.results.filter ( splReusable.libs.SapSplModelFormatters.getFilteredDropItems );

				if ( stopDropItems.length < 1 ) {
					this.getContent ( )[5].addStyleClass ( "SapSplControlHide" );
					this.getContent ( )[6].addStyleClass ( "SapSplControlHide" );

					this.getContent ( )[9].addStyleClass ( "SapSplControlHide" );
					this.getContent ( )[10].addStyleClass ( "SapSplControlHide" );
				}
				if ( stopPickItems.length < 1 ) {
					this.getContent ( )[3].addStyleClass ( "SapSplControlHide" );
					this.getContent ( )[4].addStyleClass ( "SapSplControlHide" );

					this.getContent ( )[7].addStyleClass ( "SapSplControlHide" );
					this.getContent ( )[8].addStyleClass ( "SapSplControlHide" );
				}

			}

			return true;

		} else {
			throw Error ( );
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( "SAP SCL Model Formatter", "aStopObject is not in Object format. Error: " + e.message, "SAPSCL" );
		}
	}

};

splReusable.libs.SapSplModelFormatters.getFilteredPickItems = function ( oAssignedItem ) {
	if ( oAssignedItem.AssignmentType === "P" ) {
		return true;
	} else {
		return false;
	}
};

splReusable.libs.SapSplModelFormatters.getFilteredDropItems = function ( oAssignedItem ) {
	if ( oAssignedItem.AssignmentType === "D" ) {
		return true;
	} else {
		return false;
	}
};

splReusable.libs.SapSplModelFormatters.getProgressBarVisibility = function ( currentStopUUID, stopUUID ) {
	try {
		if ( currentStopUUID !== null ) {
			if ( stopUUID !== undefined && stopUUID !== null && stopUUID.constructor === String ) {
				if ( currentStopUUID === stopUUID ) {
					return true;
				} else {
					return false;
				}
			} else {
				throw Error ( );
			}
		} else {
			return false;
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( "SAP SCL Model Formatter", "status is not in String format. Error: " + e.message, "SAPSCL" );
		}
	}
};

splReusable.libs.SapSplModelFormatters.getSrcForStopImage = function ( currentStopUUID, stopUUID ) {
	try {
		if ( currentStopUUID !== null ) {
			if ( stopUUID !== undefined && stopUUID !== null && stopUUID.constructor === String ) {
				if ( currentStopUUID === stopUUID ) {
					return "resources/icons/tour_mid_points_bigsize.png";
				} else {
					return "resources/icons/tour_mid_points.png";
				}
			} else {
				throw Error ( );
			}
		} else {
			return "resources/icons/tour_mid_points.png";
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( "SAP SCL Model Formatter", "status is not in String format. Error: " + e.message, "SAPSCL" );
		}
	}
};

splReusable.libs.SapSplModelFormatters.getTooltipForDelayChart = function ( actualDuration, plannedDuration, warningDuration, criticalDuration ) {
	try {
		if ( plannedDuration !== undefined && plannedDuration !== null && plannedDuration.constructor === String ) {
			var sToolTip = "";

			if ( actualDuration !== undefined && actualDuration !== null && actualDuration.constructor === String ) {
				sToolTip = sToolTip + oSapSplUtils.getBundle ( ).getText ( "CURRENT" ) + " " + splReusable.libs.SapSplModelFormatters.getTourDurationFromSeconds ( actualDuration ) + oSapSplUtils.getBundle ( ).getText ( "HOUR" ) + "\n";
			} else {
				sToolTip = sToolTip + oSapSplUtils.getBundle ( ).getText ( "CURRENT" ) + " " + "\n";
			}

			sToolTip = sToolTip + oSapSplUtils.getBundle ( ).getText ( "TARGET" ) + " " + splReusable.libs.SapSplModelFormatters.getTourDurationFromSeconds ( plannedDuration ) + oSapSplUtils.getBundle ( ).getText ( "HOUR" ) + "\n";

			if ( warningDuration !== undefined && warningDuration !== null && warningDuration.constructor === String ) {
				sToolTip = sToolTip + oSapSplUtils.getBundle ( ).getText ( "THRESHOLD" ) + " " + splReusable.libs.SapSplModelFormatters.getTourDurationFromSeconds ( warningDuration ) + oSapSplUtils.getBundle ( ).getText ( "HOUR" ) + " " +
						oSapSplUtils.getBundle ( ).getText ( "TOOLTIP_WARNING" ) + "\n";
			}

			if ( criticalDuration !== undefined && criticalDuration !== null && criticalDuration.constructor === String ) {
				sToolTip = sToolTip + oSapSplUtils.getBundle ( ).getText ( "THRESHOLD" ) + " " + splReusable.libs.SapSplModelFormatters.getTourDurationFromSeconds ( criticalDuration ) + oSapSplUtils.getBundle ( ).getText ( "HOUR" ) + " " +
						oSapSplUtils.getBundle ( ).getText ( "TOOLTIP_CRITICAL" );
			}
			return sToolTip;
		} else {
			throw Error ( );
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( "SAP SCL Model Formatter", "actualDuration or plannedDuration is not in String format. Error: " + e.message, "SAPSCL" );
		}
	}
};

splReusable.libs.SapSplModelFormatters.convertDurationToInteger = function ( duration ) {
	try {
		if ( duration !== undefined && duration !== null && duration.constructor === String ) {
			return parseInt ( duration, 10 );
		} else {
			throw Error ( );
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( "SAP SCL Model Formatter", "actualDuration or plannedDuration is not in String format. Error: " + e.message, "SAPSCL" );
		}
	}
};

splReusable.libs.SapSplModelFormatters.getTerminalOrDepotIdLabel = function ( tag ) {
	try {
		if ( tag !== undefined && tag !== null && tag.constructor === String ) {
			if ( tag === "LC0003" ) {
				return oSapSplUtils.getBundle ( ).getText ( "CONTAINER_TERMINAL_ID" );
			} else {
				return oSapSplUtils.getBundle ( ).getText ( "CONTAINER_DEPOT_ID" );
			}
		} else {
			throw Error ( );
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( "SAP SCL Model Formatter", "tag is not in String format. Error: " + e.message, "SAPSCL" );
		}
	}
};

splReusable.libs.SapSplModelFormatters.getTerminalOrDepotIdFormVisibility = function ( tag, mode, isEditable ) {
	try {
		if ( tag !== undefined && tag !== null && tag.constructor === String && mode !== undefined && mode !== null && mode.constructor === String && isEditable !== undefined && isEditable !== null && isEditable.constructor === Number ) {
			if ( isEditable === 1 ) {
				if ( tag === "LC0003" || tag === "LC0007" ) {
					if ( mode === "A" ) {
						return true;
					} else {
						return false;
					}
				} else {
					return false;
				}
			} else {
				return false;
			}
		} else {
			return false;
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( "SAP SCL Model Formatter", "tag or mode is not in String format. Error: " + e.message, "SAPSCL" );
		}
	}
};

splReusable.libs.SapSplModelFormatters.getTerminalOrDepotIdStatusText = function ( mode, statusEnum ) {
	try {
		if ( mode !== undefined && mode !== null && mode.constructor === String && statusEnum !== undefined && statusEnum !== null && statusEnum.constructor === Array ) {
			for ( var i = 0 ; i < statusEnum.length ; i++ ) {
				if ( statusEnum[i].Value === mode ) {
					return statusEnum[i]["Value.description"];
				}
			}
		} else {
			throw Error ( );
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( "SAP SCL Model Formatter", "mode or statusEnum is not in String/Array format. Error: " + e.message, "SAPSCL" );
		}
	}
};

splReusable.libs.SapSplModelFormatters.getVisiblityofContainerTerminalDepotStatusField = function ( tag, isEditable ) {
	try {
		if ( tag !== undefined && tag !== null && tag.constructor === String && isEditable !== undefined && isEditable !== null && isEditable.constructor === Number ) {
			if ( tag === "LC0003" || tag === "LC0007" ) {
				if ( isEditable === 1 ) {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}

		} else {
			throw Error ( );
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( "SAP SCL Model Formatter", "tag/isEditable is not in String/Number format. Error: " + e.message, "SAPSCL" );
		}
	}
};

splReusable.libs.SapSplModelFormatters.setEnabledForContainerTerminalStatusSelect = function ( mode, isEditable ) {
	try {
		if ( mode !== undefined && mode !== null && mode.constructor === String && isEditable !== undefined && isEditable !== null && isEditable.constructor === Number ) {
			if ( isEditable === 1 ) {
				if ( mode === "M" ) {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		} else {
			return false;
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( "SAP SCL Model Formatter", "isEditable or mode is not in String format. Error: " + e.message, "SAPSCL" );
		}
	}
};

splReusable.libs.SapSplModelFormatters.getTruckTypeIcon = function ( sTourName, iTruckLate ) {
	if ( sTourName === null ) {
		return "./resources/icons/Truck_Cluster/truck_no_order_normal.png";
	} else {
		if ( iTruckLate === 1 ) {
			return "./resources/icons/Truck_Cluster/truck_with_issue_normal.png";
		} else {
			return "./resources/icons/Truck_Cluster/truck_with_order_normal.png";
		}
	}
};

splReusable.libs.SapSplModelFormatters.getLocationTypeIcon = function ( sTag, sReportedStatus ) {

	if ( sTag === "LC0001" ) {
		return "./resources/icons/POI_Cluster/marker_bridge_normal.png";
	} else if ( sTag === "LC0002" ) {
		if ( sReportedStatus === null || sReportedStatus === "1" ) {
			return "./resources/icons/POI_Cluster/marker_parking_normal.png";
		} else if ( sReportedStatus === "2" ) {
			return "./resources/icons/POI_Cluster/marker_parking_fast_filling_normal.png";
		} else {
			return "./resources/icons/POI_Cluster/marker_parking_full_normal.png";
		}
	} else if ( sTag === "LC0003" ) {
		if ( sReportedStatus === null || sReportedStatus === "6" ) {
			return "./resources/icons/POI_Cluster/marker_container_terminal_normal.png";
		} else if ( sReportedStatus === "4" ) {
			return "./resources/icons/POI_Cluster/marker_container_terminal_full_normal.png";
		} else if ( sReportedStatus === "5" ) {
			return "./resources/icons/POI_Cluster/marker_container_terminal_fast_filling_normal.png";
		} else {
			return "./resources/icons/POI_Cluster/marker_container_terminal_disabled.png";
		}
	} else if ( sTag === "LC0007" ) {
		if ( sReportedStatus === null || sReportedStatus === "6" ) {
			return "./resources/icons/POI_Cluster/marker_container_depot_normal.png";
		} else if ( sReportedStatus === "4" ) {
			return "./resources/icons/POI_Cluster/marker_container_depot_full_normal.png";
		} else if ( sReportedStatus === "5" ) {
			return "./resources/icons/POI_Cluster/marker_container_depot_fast_filling_normal.png";
		} else {
			return "./resources/icons/POI_Cluster/marker_container_depot_disabled.png";
		}
	} else {
		return "";
	}
};

splReusable.libs.SapSplModelFormatters.showOwnershipTypeText = function ( isShared ) {
	try {
		if ( isShared !== undefined && isShared !== null && isShared.constructor === Number ) {
			if ( isShared === 1 ) {
				return oSapSplUtils.getBundle ( ).getText ( "SHARED" );
			} else {
				return oSapSplUtils.getBundle ( ).getText ( "OWNED" );
			}
		} else {
			throw Error ( );
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( "SAP SCL Model Formatter", "isShared is not in String format. Error: " + e.message, "SAPSCL" );
		}
	}
};

splReusable.libs.SapSplModelFormatters.showIsSubscribeText = function ( isSubscribed, status, isDeleted ) {
	try {
		if ( isSubscribed !== undefined && isSubscribed !== null && isSubscribed.constructor === String && status !== undefined && status !== null && status.constructor === String && isDeleted !== undefined && isDeleted !== null &&
				isDeleted.constructor === String ) {
			if ( status === "I" || isDeleted === "1" ) {
				return "-";
			} else {
				if ( isSubscribed === "1" ) {
					return oSapSplUtils.getBundle ( ).getText ( "YES" );
				} else {
					return oSapSplUtils.getBundle ( ).getText ( "NO" );
				}
			}

		} else {
			throw Error ( );
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( "SAP SCL Model Formatter", "isSubscribed is not in String format. Error: " + e.message, "SAPSCL" );
		}
	}
};

splReusable.libs.SapSplModelFormatters.followToursIsEditable = function ( status ) {
	try {
		if ( status !== undefined && status !== null && status.constructor === String ) {
			if ( status === "I" ) {
				return false;
			} else {
				return true;
			}

		} else {
			return false;
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( "SAP SCL Model Formatter", "status is not in String format. Error: " + e.message, "SAPSCL" );
		}
	}
};

splReusable.libs.SapSplModelFormatters.setTrucksListEnabledBasedOnStatus = function ( status, isDeleted, isSharedWithMyOrg ) {
	try {
		if ( status !== undefined && status !== null && status.constructor === String && isDeleted !== undefined && isDeleted !== null && isDeleted.constructor === String && isSharedWithMyOrg !== undefined && isSharedWithMyOrg !== null &&
				isSharedWithMyOrg.constructor === Number ) {
			if ( isSharedWithMyOrg === 1 ) {
				//Fix to incident 1580182977
				this.getCells()[0].addStyleClass ( "SapSplTrucksListDisabled" );
				return true;
			} else {
				if ( isDeleted === "1" ) {
					this.addStyleClass ( "SapSplTrucksListDisabled" );
					return true;
				} else {
					if ( status === "I" ) {
						this.addStyleClass ( "SapSplTrucksListDisabled" );
						return true;
					} else {
						this.removeStyleClass ( "SapSplTrucksListDisabled" );
						return true;
					}
				}
			}

		} else {
			return true;
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( "SAP SCL Model Formatter", "status is not in String format. Error: " + e.message, "SAPSCL" );
		}
	}
};

splReusable.libs.SapSplModelFormatters.getEnableForSubscribeCheckBox = function ( isSubscribed, status, isDeleted ) {
	try {
		if ( isSubscribed !== undefined && isSubscribed !== null && isSubscribed.constructor === String && status !== undefined && status !== null && status.constructor === String && isDeleted !== undefined && isDeleted !== null &&
				isDeleted.constructor === String ) {
			if ( status === "I" || isDeleted === "1" ) {
				return false;
			} else {
				if ( isSubscribed === "1" ) {
					return true;
				} else {
					return false;
				}
			}

		} else {
			throw Error ( );
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( "SAP SCL Model Formatter", "isSubscribed is not in String format. Error: " + e.message, "SAPSCL" );
		}
	}
};

splReusable.libs.SapSplModelFormatters.showStatusText = function ( status, isDeleted ) {
	try {
		if ( status !== undefined && status !== null && status.constructor === String && isDeleted !== undefined && isDeleted !== null && isDeleted.constructor === String ) {
			if ( isDeleted === "1" ) {
				// Fix incident 1580101316
				return oSapSplUtils.getBundle ( ).getText ( "FILTER_LABEL_DEREGISTERED" );
			} else {
				return status;
			}

		} else {
			throw Error ( );
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( "SAP SCL Model Formatter", "status & isDeleted is not in String format. Error: " + e.message, "SAPSCL" );
		}
	}
};

splReusable.libs.SapSplModelFormatters.showSelectedTheme = function ( isSelected ) {
	try {

		if ( isSelected === undefined || isSelected === null || isSelected === "1" ) {
			return true;
		} else {
			return false;
		}

	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( "SAP SCL Model Formatter", "canMaintainTruck is not in String format. Error: " + e.message, "SAPSCL" );
		}
	}
};

splReusable.libs.SapSplModelFormatters.showFreightForwarderSpecificIconTabFilter = function ( canMaintainTruck ) {
	try {
		if ( canMaintainTruck !== undefined && canMaintainTruck !== null && canMaintainTruck.constructor === String ) {
			if ( canMaintainTruck === "1" ) {
				return true;
			} else {
				return false;
			}

		} else {
			return false;
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( "SAP SCL Model Formatter", "canMaintainTruck is not in String format. Error: " + e.message, "SAPSCL" );
		}
	}
};

splReusable.libs.SapSplModelFormatters.showExitFUllScreenButtonOnMap = function ( bShowFullScreen ) {
	try {
		if ( bShowFullScreen !== undefined && bShowFullScreen !== null && bShowFullScreen.constructor === Boolean ) {
			if ( bShowFullScreen === true ) {
				return false;
			} else {
				return true;
			}

		} else {
			return false;
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( "SAP SCL Model Formatter", "bShowFullScreen is not in String format. Error: " + e.message, "SAPSCL" );
		}
	}
};

splReusable.libs.SapSplModelFormatters.returnTourDetailsLayoutSpan = function ( bShowFullScreen ) {
	try {
		if ( bShowFullScreen !== undefined && bShowFullScreen !== null && bShowFullScreen.constructor === Boolean ) {
			if ( bShowFullScreen === true ) {
				return "L3 M12 S12";
			} else {
				return "L12 M12 S12";
			}

		} else {
			return "L3 M12 S12";
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( "SAP SCL Model Formatter", "bShowFullScreen is not in String format. Error: " + e.message, "SAPSCL" );
		}
	}
};

splReusable.libs.MapsDataMarshal.prototype.fnGetTruckRegistrationNumber = function ( sRegistrationNumber, sTourName, iIsRunningLate ) {

	if ( sTourName === null ) {
		this.addStyleClass ( "grayColor" );
	} else {
		if ( iIsRunningLate === 1 ) {
			this.addStyleClass ( "redColor" );
		} else {
			this.addStyleClass ( "greenColor" );
		}
	}

	if ( !sRegistrationNumber ) {
		return oSapSplUtils.getBundle ( ).getText ( "TRUCK" );
	} else {
		return sRegistrationNumber;
	}
};

splReusable.libs.SapSplModelFormatters.getThemeIcon = function ( key ) {
	try {
		if ( key !== undefined && key !== null && key.constructor === String ) {
			if ( key === "sap_bluecrystal" ) {
				return "resources/icons/theme_bluecrystal.png";
			} else {
				return "resources/icons/theme_contrastblack.png";
			}
		} else {
			throw Error ( );
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( "SAP SCL Model Formatter", "key value is not in String format. Error: " + e.message, "SAPSCL" );
		}
	}
};

splReusable.libs.SapSplModelFormatters.getAccountCreationStatus = function ( status ) {
	try {
		if ( status !== undefined && status !== null && status.constructor === Number ) {
			if ( status === 2 ) {
				return "";
			} else if ( status === 1 || status === 4 ) {
				return oSapSplUtils.getBundle ( ).getText ( "ACC_STATUS_FAIL" );
			} else if ( status === 3 ) {
				return oSapSplUtils.getBundle ( ).getText ( "ACC_STATUS_PENDING" );
			}
		} else {
			throw Error ( );
		}

	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( "SAP SNHL Model formatter", "Account creation status is not in number format. Error: " + e.message, "SAPSNHL" );
		}
	}
};

splReusable.libs.SapSplModelFormatters.getAccountCreationState = function ( status ) {
	try {
		if ( status !== undefined && status !== null && status.constructor === Number ) {
			if ( status === 2 ) {
				return "None";
			} else if ( status === 1 || status === 4 ) {
				return "Error";
			} else if ( status === 3 ) {
				return "Warning";
			}
		} else {
			throw Error ( );
		}

	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( "SAP SNHL Model formatter", "Account creation status is not in number format. Error: " + e.message, "SAPSNHL" );
		}
	}
};

splReusable.libs.SapSplModelFormatters.getAccountRefreshState = function ( status ) {
	try {
		if ( status !== undefined && status !== null && status.constructor === Number ) {
			if ( status === 1 || status === 3 || status === 4 ) {
				return oSapSplUtils.getBundle ( ).getText ( "ACC_REFRESH" );
			} else if ( status === 2 ) {
				return "";
			}
		} else {
			throw Error ( );
		}

	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( "SAP SNHL Model formatter", "Account creation status is not in number format. Error: " + e.message, "SAPSNHL" );
		}
	}
};

splReusable.libs.SapSplModelFormatters.DeviceReplicationState = function ( ReplicationStatus ) {
	try {
		if ( ReplicationStatus !== undefined && ReplicationStatus !== null && ReplicationStatus.constructor === Number ) {
			if ( ReplicationStatus === 1 || ReplicationStatus === 4 ) {
				return oSapSplUtils.getBundle ( ).getText ( "DEVICE_ASSIGNMENT_FAILED" );
			} else if ( ReplicationStatus === 3 ) {
				return oSapSplUtils.getBundle ( ).getText ( "DEVICE_ASSIGNMENT_PENDING" );
			} else if ( ReplicationStatus === 2 ) {
				return "";
			}
		} else {
			throw Error ( );
		}

	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( "SAP SNHL Model formatter", "Device Replication status is not in number format. Error: " + e.message, "SAPSNHL" );
		}
	}
};

splReusable.libs.SapSplModelFormatters.getDeviceReplicationState = function ( ReplicationStatus ) {
	try {
		if ( ReplicationStatus !== undefined && ReplicationStatus !== null && ReplicationStatus.constructor === Number ) {
			if ( ReplicationStatus === 1 || ReplicationStatus === 4 ) {
				return "Error";
			} else if ( ReplicationStatus === 3 ) {
				return "Warning";
			} else if ( ReplicationStatus === 2 ) {
				return "None";
			}
		} else {
			throw Error ( );
		}

	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( "SAP SNHL Model formatter", "Device Replication status is not in number format. Error: " + e.message, "SAPSNHL" );
		}
	}
};

splReusable.libs.SapSplModelFormatters.setVisibleTourSettingsAddRuleLink = function ( isEdit ) {
	if ( isEdit !== undefined && isEdit !== null && isEdit.constructor === Boolean ) {
		if ( isEdit ) {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
};

splReusable.libs.SapSplModelFormatters.setTourSettingsTableMode = function ( isEdit ) {
	if ( isEdit !== undefined && isEdit !== null && isEdit.constructor === Boolean ) {
		if ( isEdit ) {
			return "Delete";
		} else {
			return "None";
		}
	} else {
		return "None";
	}
};

splReusable.libs.SapSplModelFormatters.setWarningColorTextToOrange = function ( ) {
	return true;
};

splReusable.libs.SapSplModelFormatters.sortThresholdRulesObjectBasedOnLowerThreshold = function ( thresholdRules1, thresholdRules2 ) {
	return (parseInt ( thresholdRules1.LowerThreshold ) - parseInt ( thresholdRules2.LowerThreshold ));
};

splReusable.libs.SapSplModelFormatters.getIsEnabledForFromSelectControl = function ( isEnabled, isEdit ) {
	return (isEnabled && isEdit);
};

splReusable.libs.SapSplModelFormatters.formattingForNotifications = function ( iReplicationStatus, sEntity, sDesc1, sDesc2 ) {
	try {
		if ( iReplicationStatus !== undefined && iReplicationStatus !== null && sEntity !== undefined && sEntity !== null ) {
			if ( sEntity === "vehicles" ) {
				switch ( iReplicationStatus ) {
					case 0:
						return oSapSplUtils.getBundle ( ).getText ( "TRUCK_NO_DEVICE", [sDesc1, sDesc2] );
					case 1:
						return oSapSplUtils.getBundle ( ).getText ( "TRUCK_CANNOT_ASSIGN_DEVICE", [sDesc1, sDesc2] );
					case 2:
						return oSapSplUtils.getBundle ( ).getText ( "TRUCK_DEVICE_ASSIGNED", [sDesc1, sDesc2] );
					case 3:
						return oSapSplUtils.getBundle ( ).getText ( "DEVICE_PENDING", [sDesc1, sDesc2] );
					default:
						return oSapSplUtils.getBundle ( ).getText ( "TRUCK_CANNOT_ASSIGN_DEVICE", [sDesc1, sDesc2] );
				}
			} else if ( sEntity === "myBusinessPartners" ) {
				switch ( iReplicationStatus ) {
					case 1:
						return oSapSplUtils.getBundle ( ).getText ( "CUSTOMER_ACC_FAILED", [sDesc1] );
					case 2:
						return oSapSplUtils.getBundle ( ).getText ( "CUSTOMER_ACC_CREATED", [sDesc1] );
					case 3:
						return oSapSplUtils.getBundle ( ).getText ( "CUSTOMER_ACC_PROGRESS", [sDesc1] );
					default:
						return oSapSplUtils.getBundle ( ).getText ( "CUSTOMER_ACC_FAILED", [sDesc1] );
				}
			}
		} else {
			throw Error ( );
		}
	} catch (e) {
		jQuery.sap.log.error ( "SAP SCL Model Formatter", "ReplicationStatus is not in String format. Error: " + e.message, "SAPSCL" );
	}
};

splReusable.libs.SapSplModelFormatters.setErrorCLassForSelectControl = function ( flag ) {
	if ( flag ) {
		this.addStyleClass ( "sapSnlhRedBorder" );
	} else {
		this.removeStyleClass ( "sapSnlhRedBorder" );
	}
	return true;
};

splReusable.libs.SapSplModelFormatters.getThresholdDetailTextVisibility = function ( isEdit ) {
	if ( isEdit !== undefined && isEdit !== null && isEdit.constructor === Boolean ) {
		if ( isEdit ) {
			return false;
		} else {
			return true;
		}
	} else {
		return true;
	}
};

splReusable.libs.SapSplModelFormatters.getThresholdText = function ( key ) {
	if ( key !== undefined && key !== null && key.constructor === String ) {
		var index = this.getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getController ( ).getIndexOfkeyFromThresholdArray ( key );
		return this.getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getParent ( ).getController ( ).thresholdArray[index].value;
	} else {
		return "";
	}
};

/**
 * @description To check if the geofence is a radar geofence or not
 * @static
 * @since SD1511
 * @example splReusable.libs.SapSplModelFormatters.CanViewTrackingStatusLink(0);
 * @param {String} sIsRadar
 * @param {String} sType
 * @param {Integer} iCanCreateRuleWithoutTour
 * @returns {Boolean} bIsRadar
 */
splReusable.libs.SapSplModelFormatters.CanViewTrackingStatusLink = function ( sIsRadar, sType, iCanCreateRuleWithoutTour ) {
	if ( sIsRadar === "1" && splReusable.libs.SapSplModelFormatters.getVisibilityBasedOnType ( sType ) && iCanCreateRuleWithoutTour !== 1 ) {
		return true;
	} else {
		return false;
	}
};

splReusable.libs.SapSplModelFormatters.returnTrackingStatusText = function ( sStatus ) {
	sStatus = sStatus.toString ( );
	if ( sStatus === "0" ) {
		this.addStyleClass ( "grayColor" );
		return oSapSplUtils.getBundle ( ).getText ( "RADAR_GEOFENCE_STATUS_PENDING" );
	} else if ( sStatus === "1" ) {
		this.addStyleClass ( "greenColor" );
		return oSapSplUtils.getBundle ( ).getText ( "RADAR_GEOFENCE_STATUS_ACCEPTED" );
	} else if ( sStatus === "2" ) {
		this.addStyleClass ( "redColor" );
		return oSapSplUtils.getBundle ( ).getText ( "RADAR_GEOFENCE_STATUS_REJECTED" );
	}
};

splReusable.libs.SapSplModelFormatters.setSelectedForLeftPanelGroupingList = function ( fieldName, sorterField ) {
	try {
		if ( fieldName !== undefined && fieldName !== null && fieldName.constructor === String && sorterField !== undefined && sorterField !== null && sorterField.constructor === String ) {
			return (fieldName === sorterField);
		} else {
			throw Error ( );
		}
	} catch (e) {
		jQuery.sap.log.error ( "SAP SCL Model Formatter", "fieldName or sorterField is not in String format. Error: " + e.message, "SAPSCL" );
	}
};

splReusable.libs.SapSplModelFormatters.setVisiblePropertyForAcceptButton = function ( RequestStatus ) {
	try {
		if ( RequestStatus !== undefined && RequestStatus !== null && RequestStatus.constructor === String ) {
			return (RequestStatus === "0");
		} else {
			return false;
		}
	} catch (e) {
		jQuery.sap.log.error ( "SAP SCL Model Formatter", "RequestStatus is not in String format. Error: " + e.message, "SAPSCL" );
	}
};

splReusable.libs.SapSplModelFormatters.setVisiblePropertyForRejectButton = function ( RequestStatus ) {
	try {
		if ( RequestStatus !== undefined && RequestStatus !== null && RequestStatus.constructor === String ) {
			return (RequestStatus === "0" || RequestStatus === "1");
		} else {
			return false;
		}
	} catch (e) {
		jQuery.sap.log.error ( "SAP SCL Model Formatter", "RequestStatus is not in String format. Error: " + e.message, "SAPSCL" );
	}
};

splReusable.libs.SapSplModelFormatters.setVisiblePropertyForRepostButton = function ( RequestStatus ) {
	try {
		if ( RequestStatus !== undefined && RequestStatus !== null && RequestStatus.constructor === String ) {
			if ( RequestStatus === "0" ) {
				this.removeStyleClass ( "sapSnlhIconRepostReject" );
				this.addStyleClass ( "sapSnlhIconRepostActiceAndReject" );
			} else {
				this.removeStyleClass ( "sapSnlhIconRepostActiceAndReject" );
				this.addStyleClass ( "sapSnlhIconRepostReject" );
			}
			return true;
		} else {
			return false;
		}
	} catch (e) {
		jQuery.sap.log.error ( "SAP SCL Model Formatter", "RequestStatus is not in String format. Error: " + e.message, "SAPSCL" );
	}
};

splReusable.libs.SapSplModelFormatters.setVisibleForNewLabel = function ( RequestStatus ) {
	try {
		if ( RequestStatus !== undefined && RequestStatus !== null && RequestStatus.constructor === String ) {
			if ( RequestStatus === "0" ) {
				this.setText ( oSapSplUtils.getBundle ( ).getText ( "NEW" ) );
			} else {
				this.setText ( "" );
			}
		} else {
			this.setText ( "" );
		}
		return true;
	} catch (e) {
		jQuery.sap.log.error ( "SAP SCL Model Formatter", "RequestStatus is not in String format. Error: " + e.message, "SAPSCL" );
	}
};
/**
 * ******************************************************************************
 * 
 * @static
 * @description formatter method for hiding delta value if delta is 0
 * @param iTATTimeIndex
 * @returns {boolean} true if delta is non zero else false
 * @since 1.0
 * @example splReusable.libs.SapSplModelFormatters.getMaxTATIndex("134");//returns 134
 */
splReusable.libs.SapSplModelFormatters.getDeltaValueShowStatus = function ( iTATTimeIndex ) {
	if ( iTATTimeIndex - 100 == 0 ) {
		return false;
	} else {
		return true;
	}
};
/*****************************************************************************************************************************************************
 * @static
 * @description formatter method for converting TATIndex to integer
 * @param iTATTimeIndex
 * @returns {integer}
 * @since 1.0
 * @example splReusable.libs.SapSplModelFormatters.getMaxTATIndex("134");//returns 134
 */

splReusable.libs.SapSplModelFormatters.getTATIndexforStringToInteger = function ( iTATTimeIndex ) {
	return parseInt ( iTATTimeIndex, 10 );
};
/*****************************************************************************************************************************************************
 * @static
 * @description formatter method for getting the color of the bullet chart according to TATIndex value
 * @param iTATTimeIndex
 * @returns {string} Good if TATIndex is less than 100 else Error
 * @since 1.0
 * @example splReusable.libs.SapSplModelFormatters.getColorForTATIndex(73);//returns Good
 */
splReusable.libs.SapSplModelFormatters.getColorForTATIndex = function ( iTATTimeIndex ) {
	if ( iTATTimeIndex < 100 ) {
		return "Good";
	} else if ( iTATTimeIndex > 100 ) {
		return "Error";
	}
};
/*****************************************************************************************************************************************************
 * @static
 * @description formatter method for seting visibilty of Actual stay duration according to stop status
 * @param SStatus Stop Status
 * @returns {boolean} true if stop is complete ,false is stop is in progess.
 * @since 1.0
 * @example splReusable.libs.SapSplModelFormatters.getStopStatusVisibilityBasedOnStatus(C);//returns true
 */
splReusable.libs.SapSplModelFormatters.getStopStatusVisibilityBasedOnStatus = function ( sStatus ) {
	try {
		if ( sStatus !== undefined && sStatus !== null && sStatus.constructor === String ) {
			if ( sStatus === "C" ) {
				return true;
			} else {
				return false;
			}
		} else {
			throw Error ( );
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( "SAP SCL Model Formatter", "tourStatus is not in String format. Error: " + e.message, "SAPSCL" );
		}
	}
};
/*****************************************************************************************************************************************************
 * @static
 * @description formatter method for getting actual value in BulletChart ToolTip
 * @param iTATTimeIndex Actual Value of TAT INdex
 * @returns {string} concatenation of Actual TATIndex% sColor and \n((AltText)).
 * @since 1.0
 * @example splReusable.libs.SapSplModelFormatters.getActaulValueForToolTip(120);//returns Actual 120% Error
 */
splReusable.libs.SapSplModelFormatters.getActualValueForToolTip = function ( iTATTimeIndex ) {
	var sColor = "";
	var stoolTipString = "";
	if ( iTATTimeIndex < 100 ) {
		sColor = oSapSplUtils.getBundle ( ).getText ( "COLORGOOD" );
	} else if ( iTATTimeIndex > 100 ) {
		sColor = oSapSplUtils.getBundle ( ).getText ( "COLORERROR" );
	}
	if ( iTATTimeIndex === null || iTATTimeIndex === undefined ) {
		stoolTipString = oSapSplUtils.getBundle ( ).getText ( "ACTUAL" ) + " " + oSapSplUtils.getBundle ( ).getText ( "TATNULL_TOOLTIP" ) + "\n((AltText))";
	} else {

		stoolTipString = oSapSplUtils.getBundle ( ).getText ( "ACTUAL" ) + " " + iTATTimeIndex + "% " + sColor + "\n((AltText))";
	}
	return stoolTipString;
};

splReusable.libs.SapSplModelFormatters.setVisiblePropertyForOrderIdDestinationInfo = function ( index, modelData, fItemsIndex ) {
	if ( fItemsIndex === undefined || fItemsIndex === null ) {
		fItemsIndex = parseInt ( this.getBindingContext ( ).sPath.split ( "/" )[2], 10 );
	}
	try {
		if ( index !== undefined && index !== null && index.constructor === Number && modelData !== undefined && modelData !== null && modelData.constructor === Array ) {
			if ( (modelData[index].items[fItemsIndex].Action === "P" || modelData[index].items[fItemsIndex].Action === "D") ) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( "SAP SCL Model Formatter", "tourStatus is not in String format. Error: " + e.message, "SAPSCL" );
		}
	}
};

splReusable.libs.SapSplModelFormatters.enablePartnerIDInput = function ( sTag ) {
	if ( sTag !== undefined || sTag !== null ) {
		if ( sTag === "LC0003" ) {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
};
/*****************************************************************************************************************************************************
 * @static
 * @description formatter method for enabling edit to Bupa Detials
 * @param sValue boolean that indicate if user has termination right showFooterOptions boolean
 * @returns {boolean} .
 * @since 1.0
 * @example splReusable.libs.SapSplModelFormatters.fnCanEditBupaDetails(true,true);//returns true
 */
splReusable.libs.SapSplModelFormatters.fnCanEditBupaDetails = function ( sValue, showFooterOptions, canMaintainExternalID ) {
	try {
		if ( showFooterOptions ) {
			if ( sValue === 1 ) {
				if ( canMaintainExternalID === 1 ) {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		} else {
			return false;
		}
	} catch (e) {
		if ( e.constructor === Error ( ) ) {
			jQuery.sap.log.error ( e.message, "sValue Type is not Number", "SapSplModelFormatters.js" );
		}
	}
};


splReusable.libs.SapSplModelFormatters.fnGetTourStopActionText = function ( sValue ) {
	if ( sValue === "D" ) {
		return oSapSplUtils.getBundle ( ).getText ( "FREIGHT_ITEM_ASSIGN_DROP" );
	} else if ( sValue === "P" ) {
		return oSapSplUtils.getBundle ( ).getText ( "FREIGHT_ITEM_ASSIGN_PICK_UP" );
	} else {
		return oSapSplUtils.getBundle ( ).getText ( "FREIGHT_ITEM_ASSIGN_DO_NOTHING" );
	}
};

splReusable.libs.SapSplModelFormatters.enableNewOrEditStopInTours = function ( stopOwnerUUID ) {
	if ( stopOwnerUUID !== undefined && stopOwnerUUID !== null ) {
		if ( stopOwnerUUID === oSapSplUtils.getCompanyDetails ( ).UUID ) {
			return true;
		} else {
			return false;
		}
	} else {
		return true;
	}
};

splReusable.libs.SapSplModelFormatters.setNoDataTextForTrackGeofenceDialogList = function ( geofenceName ) {
	if ( geofenceName !== undefined && geofenceName !== null && geofenceName.constructor === String ) {
		return oSapSplUtils.getBundle ( ).getText ( "NO_DATA_TEXT_GEOFENCE_ALREADY_REJECTED", geofenceName );
	}
};

splReusable.libs.SapSplModelFormatters.enableEditStopLinkForStopsInTour = function ( isEditable ) {
	if ( isEditable !== undefined && isEditable !== null && isEditable.constructor === String ) {
		return (isEditable === "1");
	}
};
/*
 * Set the visibilty for external id field only for carrier and hide it for others
 */
splReusable.libs.SapSplModelFormatters.setVisibilityofExternalID = function ( canMaintainExternalID ) {
	if ( canMaintainExternalID === 0 ) {
		return false;
	} else {
		return true;
	}
};
