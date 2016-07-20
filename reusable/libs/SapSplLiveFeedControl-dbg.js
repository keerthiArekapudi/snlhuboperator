/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.require ( "splReusable.exceptions.MissingParametersException" );
jQuery.sap.require ( "splReusable.exceptions.InvalidArrayException" );
jQuery.sap.require ( "splReusable.libs.SapSplModelFormatters" );
jQuery.sap.require ( "splReusable.libs.SapSplEnums" );
jQuery.sap.require ( "splReusable.libs.SapSplChatBoxControl" );
splReusable.libs.SapSplStyleSheetLoader.loadStyle ( "./resources/styles/sapSplLiveFeedControl" );
jQuery.sap.declare ( "splReusable.libs.SapSplLiveFeedControl" );

/**
 * private
 *Method to start polling of live feed.
 *Set the returned ID to utils, to stop polling on navigation out of live app.
 **/
function startPollingOfLiveFeed ( that, bSetInUtils ) {

	/* Patch Fix for Incident : 0020079747 0001172740 2014 */
	if ( that.liveFeedInterval !== undefined ) {
		clearInterval ( that.liveFeedInterval );
	}
	that.liveFeedInterval = window.setInterval ( function ( ) {
		that.refreshLiveFeedModel ( );
	}, that.iInterval );
	if ( bSetInUtils !== undefined && bSetInUtils !== null && bSetInUtils === true ) {
		oSapSplUtils.setIntervalId ( that.liveFeedInterval );
	}
}

/**
 * private
 *Method to handle on after rendering event of the feed list.
 *Set the dynamic height of the list.
 **/
function fnHandleOnAfterRenderingOfTheFeedList ( ) {
	if ( this.oFeedList ) {
		if ( this.oFeedList.getItems ( ) && this.oFeedList.getItems ( ).length === 0 ) {
			this.oFeedList.setShowNoData ( true );
		} else {
			this.oFeedList.setShowNoData ( false );
		}
	}

	var iListContainerHeight = $ ( window ).height ( ) - $ ( ".sapUiUfdShellHead" ).height ( ) - $ ( ".splMapTollbarBar" ).height ( ) - $ ( ".sapMFooter-CTX" ).height ( );
	$ ( ".sapSplMessageFeedListContainer" ).css ( "height", iListContainerHeight + "px" );
	$ ( ".sapSplFeedBlocker" ).css ( "height", iListContainerHeight + "px" );
	/* CSNFIX : 679198 */
	$ ( ".sapSplExpandedSearchListContainer" ).css ( "height", iListContainerHeight + "px" );
}

/**
 * private
 *Method to get the HTML content of the footer, based on priority and time stamp. 
 **/
function getFooterDiv ( obj ) {

	var HTML = "";
	var sPrio = obj["Priority"];
	var sPrioDesc = null;
	/* CSNFIX : 0120031469 685294 2014 */
	if ( sPrio === "3" ) {
		sPrioDesc = "Medium";
	} else if ( sPrio === "4" ) {
		sPrioDesc = "Low";
	}

	if ( sPrio && (sPrio === "1" || sPrio === "2") ) {
		if ( obj["isNotification"] === "1" ) {
			if ( obj["isActive"] === "1" ) {
				HTML += "<span class=HighPriority>";
			} else {
				HTML += "<span class=Expired>";
			}
			if ( obj["isActive"] === "1" ) {
				HTML += obj["Priority.description"] + "</span>";
			} else {
				HTML += oSapSplUtils.getBundle ( ).getText ( "EXPIRED" ) + "</span>";
			}
		} else {
			HTML += "<span class=HighPriority>";

			if ( obj["Priority.description"] ) {
				HTML += obj["Priority.description"] + "</span>";
			} else {
				HTML += "" + "</span>";
			}
		}

		HTML += "<div class='dateClassForMessage'>";
	} else {
		HTML += "<div class=" + sPrioDesc + "Priority>";
		if ( obj["Priority.description"] ) {
			HTML += obj["Priority.description"] + "</div>";
		} else {
			HTML += "" + "</div>";
		}
		HTML += "<div class='dateClassForMessage'>";
	}

	if ( obj["isNotification"] && obj["isNotification"] === "1" ) {
		HTML += "" + "</div>";
	} else {
		HTML += splReusable.libs.SapSplModelFormatters.returnMessageTimestamp ( obj["ReportedTime"], obj["MessageType"] ) + "</div>";
	}
	return HTML;
}

/**
 *private
 *Method to handle after rendering of the feed list item
 *prepare dynamic tooltip, footer div, sent item div, more/less, unread message. 
 **/
function fnHandleOnAfterRenderingOfTheFeedListItem ( oEvent ) {
	var sender = "";
	var isSentByMe = null, sRecipientName = null, iRecipientCount = null;
	if ( oEvent.srcControl.getBindingContext ( ).getProperty ( "isSentByMe" ) !== undefined ) {
		isSentByMe = oEvent.srcControl.getBindingContext ( ).getProperty ( "isSentByMe" );
	}

	$ ( ".detailOverlayClass" ).remove ( );
	oEvent.srcControl.getParent ( ).$ ( ).append ( "<div id='feedMessageDetailOverlay' class='detailOverlayClass'></div>" );
	/* Fix for Message details not appearing on first click - issue */
	$ ( "#feedMessageDetailOverlay" ).css ( "display", "none" );
	sRecipientName = oEvent.srcControl.getBindingContext ( ).getProperty ( "RecipientName" );
	iRecipientCount = oEvent.srcControl.getBindingContext ( ).getProperty ( "RecipientCount" );

	if ( iRecipientCount !== undefined ) {
		oEvent.srcControl.$ ( ).attr ( "title", splReusable.libs.SapSplModelFormatters.returnFeedMessageTooltip ( sRecipientName, iRecipientCount ) );
	}

	/* SPLSCRUMBACKLOG-718 */
	sender = oEvent.srcControl.getBindingContext ( ).getObject ( )["SenderName"];
	if ( !sender ) {
		oEvent.srcControl.setMaxCharacters ( 60 );
	} else {
		oEvent.srcControl.setMaxCharacters ( 75 );
	}

	if ( $ ( "#" + oEvent.srcControl.sId + " .sapMFeedListItemFooter" )[0] ) {
		$ ( "#" + oEvent.srcControl.sId + " .sapMFeedListItemFooter" )[0].innerHTML = getFooterDiv ( oEvent.srcControl.getBindingContext ( ).getObject ( ) );
	}

	if ( oEvent.srcControl.getBindingContext ( ).getObject ( )["MessageType"] === "BM" || oEvent.srcControl.getBindingContext ( ).getObject ( )["MessageType"] === "DM" ) {
		if ( oEvent.srcControl.getBindingContext ( ).getObject ( )["isRead"] === "0" && !oEvent.srcControl.hasStyleClass ( "messageUnRead" ) ) {
			oEvent.srcControl.addStyleClass ( "messageUnRead" );
		}
	}

	if ( isSentByMe === 1 ) {
		oEvent.srcControl.addStyleClass ( "sapSplMessageFeedListItemRight" );
		oEvent.srcControl.setIcon ( "sap-icon://employee" );
	}

	if ( oEvent.srcControl.getBindingContext ( ).getObject ( ).isSent === 1 ) {
		/* Fix for Incident : 1580111961 */
		oEvent.srcControl.setIcon ( "sap-icon://employee" );
		var sToString = "", sFromString = "";
		$ ( "#" + oEvent.srcControl.sId + "FromToText" ).remove ( );
		sFromString = sender;
		if ( iRecipientCount > 1 ) {
			sToString = oSapSplUtils.getBundle ( ).getText ( "MULTIPLE_RECIPIENTS" );
		} else {
			if ( sRecipientName === null && oEvent.srcControl.getBindingContext ( ).getProperty ( "MessageType" ) === "DM" ) {
				sToString = oSapSplUtils.getBundle ( ).getText ( "NOT_AVAILABLE" );
			} else if ( (sRecipientName === null && oEvent.srcControl.getBindingContext ( ).getProperty ( "MessageType" ) === "TC") || (sRecipientName === null && oEvent.srcControl.getBindingContext ( ).getProperty ( "MessageType" ) === "BM") ||
					(sRecipientName === null && oEvent.srcControl.getBindingContext ( ).getProperty ( "MessageType" ) === "BI") ) {
				sToString = oSapSplUtils.getBundle ( ).getText ( "NOT_AVAILABLE" );
			} else {
				sToString = sRecipientName;
			}
		}
		$ ( "#" + oEvent.srcControl.sId + " .sapMFeedListItemText" ).prepend ( "<div class='sentItemsTopLayoutDiv' id=" + oEvent.srcControl.sId + "FromToText" + "></div>" );
		$ ( "#" + oEvent.srcControl.sId + "FromToText" )[0].innerHTML = "<p><span>" + oSapSplUtils.getBundle ( ).getText ( "From" ) + " : " + "</span>" + sender + "<br/><span>" + oSapSplUtils.getBundle ( ).getText ( "To" ) + " : " + "</span>" +
				sToString + "</p>";
	}
}

/**
 *private
 *Method to change message validity
 *Change the message validity to current time, so that it would be removed from the feed.
 **/
function fnChangeMessageValidity ( that, oMessageObject ) {

	var oHeaderObject = {};
	oHeaderObject["UUID"] = oMessageObject["MessageUUID"];
	oHeaderObject["Type"] = oMessageObject["MessageType"];
	oHeaderObject["TemplateUUID"] = oMessageObject["TemplateUUID"];
	oHeaderObject["Priority"] = oMessageObject["Priority"];
	oHeaderObject["OwnerID"] = oMessageObject["OwnerID"];
	oHeaderObject["SenderID"] = oMessageObject["SenderID"];
	oHeaderObject["Validity.StartTime"] = oMessageObject["Validity_StartTime"];
	oHeaderObject["Validity.EndTime"] = new Date ( );
	oHeaderObject["AuditTrail.CreatedBy"] = oMessageObject["AuditTrail_CreatedBy"];
	oHeaderObject["AuditTrail.ChangedBy"] = oMessageObject["AuditTrail_ChangedBy"];
	oHeaderObject["AuditTrail.ChangeTime"] = oMessageObject["AuditTrail_ChangeTime"];
	oHeaderObject["SourceLocation"] = oMessageObject["SourceLocation"];
	oHeaderObject["ThreadUUID"] = oMessageObject["ThreadUUID"];
	oHeaderObject["ChangeMode"] = "U";

	var payload = {
		Header : [oHeaderObject],
		inputHasChangeMode : true,
		Text : [],
		Recipient : [],
		Object : "MessageOccurrence"
	};

	oSapSplAjaxFactory.fireAjaxCall ( {
		url : oSapSplUtils.getFQServiceUrl ( "sap/spl/xs/app/services/updateMessageStatus.xsjs" ),
		method : "PUT",
		async : false,
		cache : false,
		data : JSON.stringify ( payload ),
		success : function ( data, success, messageObject ) {
			oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
			if ( data.constructor === String ) {
				data = JSON.parse ( data );
			}
			if ( messageObject["status"] === 200 && data["Error"].length === 0 ) {
				that.refreshLiveFeedModel ( );
			} else if ( data["Error"].length > 0 ) {
				var errorMessage = oSapSplUtils.getErrorMessagesfromErrorPayload ( data )["ufErrorObject"];
				sap.ca.ui.message.showMessageBox ( {
					type : sap.ca.ui.message.Type.ERROR,
					message : oSapSplUtils.getErrorMessagesfromErrorPayload ( data )["errorWarningString"],
					details : errorMessage
				} );
			}
		},
		error : function ( error ) {
			oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
			if ( error && error["status"] === 500 ) {
				sap.ca.ui.message.showMessageBox ( {
					type : sap.ca.ui.message.Type.ERROR,
					message : error["status"] + " " + error.statusText,
					details : error.responseText
				} );
			}
		},
		complete : function ( xhr ) {
			if ( xhr.responseText.constructor === String ) {
				xhr.responseText = JSON.parse ( xhr.responseText );
			}
			var oErrorObject = oSapSplUtils.getErrorMessagesfromErrorPayload ( xhr.responseText );
			if ( xhr.status === 400 ) {
				sap.ca.ui.message.showMessageBox ( {
					type : sap.ca.ui.message.Type.ERROR,
					message : oErrorObject["errorWarningString"],
					details : oErrorObject["ufErrorObject"]
				} );
			}

		}

	} );
}

/**
 *private
 *Method to respond to Bupa connect request
 *on success, remove the message from the feed list.
 **/
function respondToBussinessPartnerRequest ( sType, that, GUID, sContextID, oMessageObject ) {
	var payload = {};
	payload["inputHasChangeMode"] = false;
	payload["Relation"] = [{
		UUID : GUID,
		Status : sType,
		InstanceUUID : null
	}];

	oSapSplBusyDialog.getBusyDialogInstance ( ).open ( );

	oSapSplAjaxFactory.fireAjaxCall ( {
		url : oSapSplUtils.getFQServiceUrl ( "sap/spl/xs/app/services/businessPartner.xsjs" ),
		method : "PUT",
		async : false,
		cache : false,
		data : JSON.stringify ( payload ),
		success : function ( data, success, messageObject ) {
			oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
			if ( data.constructor === String ) {
				data = JSON.parse ( data );
			}
			if ( messageObject["status"] === 200 && data["Error"].length === 0 ) {
				$ ( "#" + sContextID ).remove ( );
				if ( oMessageObject ) {
					fnChangeMessageValidity ( that, oMessageObject );
				} else {
					that.refreshLiveFeedModel ( );
				}
			} else if ( data["Error"].length > 0 ) {
				var errorMessage = oSapSplUtils.getErrorMessagesfromErrorPayload ( data )["ufErrorObject"];
				sap.ca.ui.message.showMessageBox ( {
					type : sap.ca.ui.message.Type.ERROR,
					message : oSapSplUtils.getErrorMessagesfromErrorPayload ( data )["errorWarningString"],
					details : errorMessage
				} );

				/* Fix for incident : 1580101619 */
				$ ( "#" + sContextID ).remove ( );
				if ( oMessageObject ) {
					fnChangeMessageValidity ( that, oMessageObject );
				} else {
					that.refreshLiveFeedModel ( );
				}
			}
		},
		error : function ( error ) {
			oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
			if ( error && error["status"] === 500 ) {
				sap.ca.ui.message.showMessageBox ( {
					type : sap.ca.ui.message.Type.ERROR,
					message : error["status"] + " " + error.statusText,
					details : error.responseText
				} );

				/* Fix for incident : 1580101619 */
				$ ( "#" + sContextID ).remove ( );
				if ( oMessageObject ) {
					fnChangeMessageValidity ( that, oMessageObject );
				} else {
					that.refreshLiveFeedModel ( );
				}

			}
		},
		complete : function ( xhr ) {
			if ( xhr.responseText.constructor === String ) {
				xhr.responseText = JSON.parse ( xhr.responseText );
			}
			var oErrorObject = oSapSplUtils.getErrorMessagesfromErrorPayload ( xhr.responseText );
			if ( xhr.status === 400 ) {
				sap.ca.ui.message.showMessageBox ( {
					type : sap.ca.ui.message.Type.ERROR,
					message : oErrorObject["errorWarningString"],
					details : oErrorObject["ufErrorObject"]
				} );
			}

		}

	} );
}

/**
 *private
 *Method to handle app to app navigation from live feed
 *triggered from the context actions. 
 **/
function navigateToAnotherApp ( sPath ) {
	var sNavTo = sPath;
	var oNavToPageView = null;
	if ( !sap.ui.getCore ( ).byId ( "sapSplBaseApplication" ).getPage ( sNavTo ) ) {

		oNavToPageView = sap.ui.view ( {
			viewName : sNavTo,
			id : sNavTo,
			type : sap.ui.core.mvc.ViewType.XML
		} );

		oNavToPageView.addEventDelegate ( {
			onBeforeShow : jQuery.proxy ( oNavToPageView.getController ( ).onBeforeShow, oNavToPageView.getController ( ) )
		} );
		sap.ui.getCore ( ).byId ( "sapSplBaseApplication" ).addPage ( oNavToPageView );
	}

	oSplBaseApplication.getAppInstance ( ).to ( sNavTo, "slide" );
}

/**
 *private
 *Method to handle click of radar approval message
 **/
function openTrackGeofenceDialog ( oMessageObject ) {

	var viewData = {}, sTitle = "";
	var modelData = sap.ui.getCore ( ).getModel ( "SapSplLeftPanelListModel" ).getData ( );

	viewData.geofences = [];
	viewData.containerTerminal = [];

	// To fix incident 1580111781
	if ( oMessageObject["ReferenceLocationName"] ) {
		viewData.ReferenceLocationName = oMessageObject["ReferenceLocationName"];
	}

	for ( var i = 0 ; i < modelData.length ; i++ ) {
		if ( modelData[i].Tag === "LC0008" ) {
			if ( modelData[i].LocationID === oMessageObject["ReferenceObjectUUID"] ) {
				viewData.geofences.push ( modelData[i] );
				if ( modelData[i]["RelationStatus"] === "0" ) {
					sTitle = oSapSplUtils.getBundle ( ).getText ( "TRACK_GEOFENCE_DIALOG_TITLE", oMessageObject["SenderName"] );
				}
			}
		}
		if ( modelData[i].Tag === "LC0003" ) {
			if ( modelData[i].OwnerID === oMessageObject["SenderID"] ) {
				viewData.containerTerminal.push ( modelData[i] );
			}
		}
	}

	var trackGeofenceDialogView = sap.ui.view ( {
		viewName : "splView.dialogs.SplTrackGeofenceDialog",
		type : sap.ui.core.mvc.ViewType.XML,
		viewData : viewData
	} );

	var trackGeofenceDialog = new sap.m.Dialog ( {
		title : sTitle,
		tooltip : sTitle,
		content : trackGeofenceDialogView,
		draggable : true,
		contentWidth : "10rem"
	} ).addStyleClass ( "sapSnlhTrackGeofenceDialog" ).open ( );

	trackGeofenceDialog.attachAfterOpen ( function ( ) {
		oSapSplUtils.fnSyncStyleClass ( trackGeofenceDialog );
		sap.ui.getCore ( ).byId ( "splView.liveApp.liveApp" ).getController ( ).fnBlockUnblockLiveAppUI ( "Block" );
	} );

	trackGeofenceDialog.attachAfterClose ( function ( oEvent ) {
		sap.ui.getCore ( ).byId ( "splView.liveApp.liveApp" ).getController ( ).fnBlockUnblockLiveAppUI ( "Unblock" );
		oEvent.getSource ( ).destroy ( );
	} );

	trackGeofenceDialog.addEventDelegate ( {
		onAfterRendering : function ( oEvent ) {
			sap.ui.getCore ( ).byId ( "splView.liveApp.liveApp" ).getController ( ).fnHandleDialogMove ( oEvent.srcControl );
			sap.ui.getCore ( ).byId ( "splView.liveApp.liveApp" ).getController ( ).fnHandleDialogPositioning ( oEvent.srcControl );
		}
	} );

	trackGeofenceDialogView.getController ( ).setParentDialogInstance ( trackGeofenceDialog );
}

/**
 *private
 *Method to handle click of radar rejection notification message
 **/
function openSidePanelSelectRejectedGeofences ( oMessageObject ) {
	var sCoords;

	sap.ui.getCore ( ).byId ( "splView.liveApp.liveApp--sapSplTrafficStatusContainer" ).setMode ( "ShowHideMode" );

	sap.ui.getCore ( ).byId ( "splView.liveApp.liveApp--idSapSplLeftPanelIconTabBar" ).setSelectedKey ( "Geofences" );
	sap.ui.getCore ( ).byId ( "splView.liveApp.liveApp--idSapSplLeftPanelIconTabBar" ).fireSelect ( {
		item : sap.ui.getCore ( ).byId ( "splView.liveApp.liveApp--SapSplLeftPanelFilterGeofences" ),
		selectedKey : "Geofences"
	} );

	for ( var i = 0 ; i < sap.ui.getCore ( ).byId ( "splView.liveApp.liveApp--SapSplLeftPanelList" ).getItems ( ).length ; i++ ) {
		if ( sap.ui.getCore ( ).byId ( "splView.liveApp.liveApp--SapSplLeftPanelList" ).getItems ( )[i].getType ( ) === "Active" ) {
			if ( sap.ui.getCore ( ).byId ( "splView.liveApp.liveApp--SapSplLeftPanelList" ).getItems ( )[i].getBindingContext ( ).getProperty ( ).Tag === "LC0008" ) {
				if ( sap.ui.getCore ( ).byId ( "splView.liveApp.liveApp--SapSplLeftPanelList" ).getItems ( )[i].getBindingContext ( ).getProperty ( ).LocationID === oMessageObject["ReferenceObjectUUID"] ) {
					sap.ui.getCore ( ).byId ( "splView.liveApp.liveApp--SapSplLeftPanelList" ).getItems ( )[i].setSelected ( true );
					sap.ui.getCore ( ).byId ( "splView.liveApp.liveApp--SapSplLeftPanelList" ).fireSelect ( {
						listItem : sap.ui.getCore ( ).byId ( "splView.liveApp.liveApp--SapSplLeftPanelList" ).getItems ( )[i],
						selected : true
					} );
					sCoords = oSapSplMapsDataMarshal.convertGeoJSONToString ( JSON.parse ( sap.ui.getCore ( ).byId ( "splView.liveApp.liveApp--SapSplLeftPanelList" ).getItems ( )[i].getBindingContext ( ).getProperty ( ).Geometry ) );
					sCoords = oSapSplMapsDataMarshal.fnGetPointFromPolygon ( sCoords );

					var sLat = sCoords.split ( ";" )[1];
					var sLong = sCoords.split ( ";" )[0];

					sap.ui.getCore ( ).byId ( "splView.liveApp.liveApp--oSapSplLiveAppMap" ).zoomToGeoPosition ( parseFloat ( sLong, 10 ), parseFloat ( sLat, 10 ), parseFloat ( "1", 10 ) );
					break;
				}
			}
		}
	}
}

/**
 *private
 *Method to handle click of open details context action
 *make a call to FeedRecipientList, to fetch the from and to details
 *Prepare appropriate div and place it on the overlay
 **/
function getFeedMessageDetailLayout ( MessageUUID, that ) {
	var sPath = "", sFilter = "", sToString = "", sFromString = "";
	sFilter = "$filter=MessageUUID eq X'" + oSapSplUtils.base64ToHex ( MessageUUID ) + "'";
	sPath = "/FeedRecipientList";
	that.oDataModel.read ( sPath, null, [sFilter], true, function ( results ) {
		var iNullCount = 0;
		for ( var i = 0 ; i < results.results.length ; i++ ) {
			if ( results.results[i]["RecipientName"] !== null ) {
				sToString += results.results[i]["RecipientName"] + " , ";
			} else {
				iNullCount = iNullCount + 1;
			}
		}
		if ( iNullCount > 0 ) {
			sToString += oSapSplUtils.getBundle ( ).getText ( "NOT_AVAILABLE_MULTIPLE", iNullCount );
		} else {
			/* Fix for Incident : 1570148773 */
			var iIndex = sToString.lastIndexOf ( " , " );
			sToString = sToString.substr ( 0, iIndex ) + "" + sToString.substr ( iIndex + 3 );
		}
		sFromString = results.results[0]["SenderName"];
		/* Fix for Incident : 1570003093 */
		$ ( ".detailOverlayClass" )[0].innerHTML = "<p><span>" + oSapSplUtils.getBundle ( ).getText ( "From" ) + " : " + "</span>" + sFromString + "<br/><span>" + oSapSplUtils.getBundle ( ).getText ( "To" ) + " : " + "</span>" + sToString + "</p>";
	}, function ( ) {

	} );
}

/**
 *private
 *Method to toggle the visibility of detail window overlay, on the appropriate list item 
 **/
function openOverlayForDetails ( oContext, oEvent, that ) {
	var oListItem = oEvent.getSource ( ).$ ( ).parent ( ).parent ( ).prev ( );
	var id = "feedMessageDetailOverlay";
	if ( $ ( "#" + id ).css ( "display" ) === "none" ) {
		$ ( ".detailOverlayClass" )[0].innerHTML = "";
		getFeedMessageDetailLayout ( sap.ui.getCore ( ).byId ( oListItem.attr ( "id" ) ).getBindingContext ( ).getObject ( )["MessageUUID"], that );
	}
	/* Removed toggle - To solve checkmarx issue */
	if ( $ ( "#" + id ).css ( "display" ) === "none" ) {
		$ ( "#" + id ).show ( );
	} else {
		$ ( "#" + id ).hide ( );
	}
	$ ( "#" + id ).css ( "top", oListItem.position ( )["top"] );
	$ ( "#" + id ).css ( "height", oListItem.height ( ) );
}

/**
 *private
 *Method to handle click of context item
 *trigger various actions based on action type
 **/
function fnHandlePressOfContextItem ( oEvent ) {
	var that = this;
	var oBindingContext = oEvent.getSource ( ).getBindingContext ( ).getProperty ( );
	if ( oBindingContext["ActionType"] === "RC" ) {
		var aModelData = null, iCount = 0;
		/* Patch Fix for Incident : 0020079747 0001172740 2014 */
		oBindingContext["liveFeed"] = this.oFeedListControl;
		oBindingContext["chatBoxConsoleApp"] = this.oChatBoxContainerApp;
		oBindingContext["headerLabel"] = this.oSapSplChatBoxConsoleHeaderLabel;

		if ( !this.oListOfChatBoxes[oBindingContext["ThreadUUID"]] ) {
			var oChatBox = new splReusable.libs.SapSplChatBoxControl ( oBindingContext );
			this.oListOfChatBoxes[oBindingContext["ThreadUUID"]] = oChatBox;
			oChatBox.setListOfChatBoxes ( this.oListOfChatBoxes );
		} else {
			this.oListOfChatBoxes[oBindingContext["ThreadUUID"]].startPolling ( );

			aModelData = sap.ui.getCore ( ).getModel ( "sapSplChatBoxConsoleLeftListModel" ).getData ( );
			for ( iCount = 0 ; iCount < aModelData.length ; iCount++ ) {
				if ( aModelData[iCount]["ThreadUUID"] === oBindingContext["ThreadUUID"] ) {
					break;
				}
			}
			if ( iCount === aModelData.length ) {
				aModelData.push ( oBindingContext );
				this.oSapSplChatBoxConsoleHeaderLabel.setText ( oSapSplUtils.getBundle ( ).getText ( "CHATBOX_CONSOLE_HEADER_LABEL", aModelData.length ) );
				sap.ui.getCore ( ).getModel ( "sapSplChatBoxConsoleLeftListModel" ).setData ( aModelData );
			} else {
				if ( this.oListOfChatBoxes[oBindingContext["ThreadUUID"]].getListItemInstance ( ) ) {
					this.oListOfChatBoxes[oBindingContext["ThreadUUID"]].getListItemInstance ( ).firePress ( );
				}
			}
			if ( $ ( ".sapSplChatBoxConsoleParentClosed" ).css ( "display" ) === "none" || $ ( ".sapSplChatBoxConsoleParent" ).css ( "display" ) === "none" ) {
				$ ( ".sapSplChatBoxConsoleParent" ).show ( "slow" );
				$ ( ".sapSplChatBoxConsoleParentClosed" ).show ( "slow" );
			}
			if ( aModelData.length > 1 ) {
				this.oChatBoxContainerApp.getParent ( ).removeStyleClass ( "sapSplChatBoxConsoleClosed" ).addStyleClass ( "sapSplChatBoxConsole" );
				this.oChatBoxContainerApp.getParent ( ).getParent ( ).removeStyleClass ( "sapSplChatBoxConsoleParentClosed" ).addStyleClass ( "sapSplChatBoxConsoleParent" );
				$ ( "#chatBoxConsoleContainerDiv" ).css ( "right", "50.5em" );
			}
			setTimeout ( function ( ) {
				that.oListOfChatBoxes[oBindingContext["ThreadUUID"]].rerenderTextAreaInstance ( );
			}, 1000 );
		}
	} else if ( oBindingContext["ActionType"] === "LM" ) {
		if ( oBindingContext["MessageType"] === "I" || oBindingContext["MessageType"] === "TM" ) {
			this.parentControllerInstance.feedlistToMapInterface ( oBindingContext["InstanceUUID"], "Incidents" );
		} else {
			if ( oBindingContext["isThirdPartyMessage"] === 1 || oBindingContext["isSent"] === 1 ) {
				this.parentControllerInstance.feedlistToMapInterface ( oBindingContext["RecipientUUID"], "Trucks" );
			} else {
				this.parentControllerInstance.feedlistToMapInterface ( oBindingContext["SenderID"], "Trucks" );
			}
		}
	} else if ( oBindingContext["ActionType"] === "A" ) {
		if ( oBindingContext["MessageType"] === "BI" ) {
			if ( oEvent.getSource ( ).getCustomData ( ).length > 0 ) {
				respondToBussinessPartnerRequest ( "1", this, oBindingContext["RelationUUID"], oEvent.getSource ( ).getParent ( ).$ ( ).parent ( ).attr ( "id" ), oEvent.getSource ( ).getCustomData ( )[0].getValue ( ) );
			} else {
				respondToBussinessPartnerRequest ( "1", this, oBindingContext["RelationUUID"], oEvent.getSource ( ).getParent ( ).$ ( ).parent ( ).attr ( "id" ), null );
			}
		}
	} else if ( oBindingContext["ActionType"] === "R" ) {
		if ( oBindingContext["MessageType"] === "BI" ) {
			if ( oEvent.getSource ( ).getCustomData ( ).length > 0 ) {
				respondToBussinessPartnerRequest ( "2", this, oBindingContext["RelationUUID"], oEvent.getSource ( ).getParent ( ).$ ( ).parent ( ).attr ( "id" ), oEvent.getSource ( ).getCustomData ( )[0].getValue ( ) );
			} else {
				respondToBussinessPartnerRequest ( "2", this, oBindingContext["RelationUUID"], oEvent.getSource ( ).getParent ( ).$ ( ).parent ( ).attr ( "id" ), null );
			}
		}
	} else if ( oBindingContext["ActionType"] === "AN" ) {
		navigateToAnotherApp ( oBindingContext["NavigationPath"] );
	} else if ( oBindingContext["ActionType"] === "DT" ) {
		openOverlayForDetails ( oBindingContext, oEvent, this );
	} else if ( oBindingContext["ActionType"] === "OD" ) {
		sap.ui.getCore ( ).byId ( "splView.liveApp.liveApp" ).getController ( ).oMapToolbar.refreshMap ( " " );
		openTrackGeofenceDialog ( oEvent.getSource ( ).getCustomData ( )[0].getValue ( ) );
	} else if ( oBindingContext["ActionType"] === "OP" ) {
		openSidePanelSelectRejectedGeofences ( oEvent.getSource ( ).getCustomData ( )[0].getValue ( ) );
	}
}

/**
 *private
 *Method to fetch the contexts.
 *make a call to FeedListControl, fetch all the possible context actions.
 *Prepare a toolbar and return the same.
 *If the only action is chat, then hide the toolbar and trigger chat option.
 **/
function getContextLayout ( oBoundObject, that ) {

	/* To see sent messages on the feed */
	var sPath = "/FeedListControl?$filter=MessageUUID eq X'" + oSapSplUtils.base64ToHex ( oBoundObject["MessageUUID"] ) + "\'";

	// To fix incident 1580148660
	if ( oBoundObject.MessageType === "DM" ) {
		sPath = "/FeedListControl?$filter=MessageUUID eq X'" + oSapSplUtils.base64ToHex ( oBoundObject["MessageUUID"] ) + "\'" + " and RecipientUUID eq X'" + oSapSplUtils.base64ToHex ( oBoundObject["RecipientUUID"] ) + "\'";
	}

	var aAvailableContexts = [];
	if ( !that.oDataModel ) {
		that.oDataModel = sap.ui.getCore ( ).getModel ( "LiveFeedContextODataModel" );
	}
	that.oDataModel.read ( sPath, null, [], false, function ( results ) {
		aAvailableContexts = results.results;
		for ( var i = 0 ; i < aAvailableContexts.length ; i++ ) {
			if ( aAvailableContexts[i]["canViewContext"] === 0 ) {
				aAvailableContexts.splice ( i, 1 );
			}
		}
	}, function ( ) {

	} );

	if ( aAvailableContexts.length === 0 ) {
		return null;
	} else {
		var oToolbar = new sap.m.Toolbar ( {
			content : {
				path : "/",
				template : new sap.ui.core.Icon ( {
					src : "{Icon}",
					color : "#666666",
					press : jQuery.proxy ( fnHandlePressOfContextItem, that ),
					tooltip : {
						path : "ActionType",
						formatter : function ( sActionType ) {
							if ( sActionType === "RC" ) {
								return oSapSplUtils.getBundle ( ).getText ( "REPLY_THROUGH_CHAT" );
							} else if ( sActionType === "LM" ) {
								return oSapSplUtils.getBundle ( ).getText ( "LOCATE_ON_MAP" );
							} else if ( sActionType === "A" ) {
								return oSapSplUtils.getBundle ( ).getText ( "ACCEPT" );
							} else if ( sActionType === "R" ) {
								return oSapSplUtils.getBundle ( ).getText ( "REJECT" );
							} else if ( sActionType === "AN" ) {
								return oSapSplUtils.getBundle ( ).getText ( "APP_TO_APP_NAVIGATION" );
							} else if ( sActionType === "DT" ) {
								return oSapSplUtils.getBundle ( ).getText ( "MESSAGE_DETAILS" );
							}
						}
					}

				} ).addStyleClass ( "contextBarIcon" ).addCustomData ( new sap.ui.core.CustomData ( {
					key : "messageBoundObject",
					value : oBoundObject
				} ) )
			}
		} ).setModel ( new sap.ui.model.json.JSONModel ( aAvailableContexts ) ).addStyleClass ( "contextBar" );

		oToolbar.addEventDelegate ( {
			onAfterRendering : function ( oEvent ) {
				var aContext = oEvent.srcControl.getContent ( );
				if ( aContext.constructor === Array ) {
					for ( var i = 0 ; i < aContext.length ; i++ ) {
						var aActionObject = aContext[i].getBindingContext ( ).getObject ( );
						if ( aActionObject["ActionType"] === "RC" ) {
							aContext[i].firePress ( );
							aContext[i].setVisible ( false );
						} /* Fix for Incident : 1570003093 */
						else if ( (aActionObject["ActionType"] === "DT" && aActionObject["isSent"] === 1 && aActionObject["RecipientCount"] === 1) ) {
							aContext[i].setVisible ( false );
							if ( aContext.length === 1 ) {
								oEvent.srcControl.setVisible ( false );
								oEvent.srcControl.$ ( ).parent ( ).hide ( );
							}
						} else if ( aActionObject["ActionType"] === "OD" || aActionObject["ActionType"] === "OP" ) {
							aContext[i].firePress ( );
							if ( aContext.length === 1 ) {
								oEvent.srcControl.setVisible ( false );
								oEvent.srcControl.$ ( ).parent ( ).hide ( );
							}
						}
					}
				}
			}
		} );

		return oToolbar;

	}
}

/**
 *private
 *Method to remove the selections of all feed list items, including hiding of the context bar.
 **/
function removeOtherSelections ( id, oFeedList ) {

	if ( oFeedList && oFeedList.getItems ( ) ) {
		for ( var i = 0 ; i < oFeedList.getItems ( ).length ; i++ ) {
			var oListItem = oFeedList.getItems ( )[i];
			if ( oListItem.sId !== id ) {
				if ( oListItem.getCustomData ( ).length === 1 ) {
					var oCustomData = oListItem.getCustomData ( )[0].getValue ( );
					if ( oCustomData.state === "show" ) {
						$ ( "#" + oCustomData.id ).hide ( );
						oCustomData.state = "hide";
						oListItem.getCustomData ( )[0].setValue ( oCustomData );
					}
				}
			}
		}
	}
}

/**
 *private
 *Method to make the list item as read
 *this would change the css of the list item, when the model is next refreshed.
 **/
function fnMakeTheListItemAsReadUnread ( oMessageObject, that ) {
	var oHeaderObject = {}, oTextObject = {}, oRecipientObject = {};
	oHeaderObject["UUID"] = oMessageObject["MessageUUID"];
	oHeaderObject["Type"] = oMessageObject["MessageType"];
	oHeaderObject["TemplateUUID"] = "";
	oHeaderObject["Priority"] = oMessageObject["Priority"];
	oHeaderObject["OwnerID"] = oMessageObject["OwnerID"];
	oHeaderObject["SenderID"] = oMessageObject["SenderID"];
	oHeaderObject["Validity.StartTime"] = oMessageObject["Validity_StartTime"].toJSON ( );
	oHeaderObject["Validity.EndTime"] = oMessageObject["Validity_EndTime"].toJSON ( );
	oHeaderObject["AuditTrail.CreatedBy"] = null;
	oHeaderObject["AuditTrail.ChangedBy"] = null;
	oHeaderObject["AuditTrail.CreationTime"] = null;
	oHeaderObject["AuditTrail.ChangeTime"] = null;
	oHeaderObject["SourceLocation"] = oMessageObject["SourceLocation"];
	oHeaderObject["ThreadUUID"] = oMessageObject["ThreadUUID"];
	oHeaderObject["ChangeMode"] = "U";

	var sRecipientType = "Truck";
	if ( oMessageObject["MessageType"] === "DM" || oMessageObject["MessageType"] === "BM" ) {
		sRecipientType = "BusinessPartner";
	}

	oRecipientObject["RecipientUUID"] = oMessageObject["RecipientUUID"];
	oRecipientObject["UUID"] = oMessageObject["MessageRecipientID"];
	oRecipientObject["ParentUUID"] = oMessageObject["MessageUUID"];
	oRecipientObject["RecipientType"] = sRecipientType;
	oRecipientObject["isRead"] = "1";
	oRecipientObject["ChangeMode"] = "U";

	oTextObject["UUID"] = oMessageObject["MessageUUID"];
	oTextObject["ShortText"] = oMessageObject["Text1"];
	oTextObject["LongText"] = oMessageObject["Text1"];
	oTextObject["ChangeMode"] = "U";

	var oPayLoadForPost = {
		Header : [oHeaderObject],
		Recipient : [oRecipientObject],
		Text : [oTextObject],
		Object : "MessageOccurrence",
		inputHasChangeMode : true
	};

	/* CSNFIX: 0020079747 0000182039 2015 */
	setTimeout ( function ( ) {
		if ( that.oListOfChatBoxes[oHeaderObject["ThreadUUID"]] ) {
			that.oListOfChatBoxes[oHeaderObject["ThreadUUID"]].focusOnLastItem ( );
		}
	}, 1000 );

	oSapSplAjaxFactory.fireAjaxCall ( {
		url : oSapSplUtils.getFQServiceUrl ( "sap/spl/xs/app/services/updateMessageStatus.xsjs" ),
		method : "PUT",
		data : JSON.stringify ( oPayLoadForPost ),
		success : function ( data, success, messageObject ) {
			if ( data.constructor === String ) {
				data = JSON.parse ( data );
			}
			if ( messageObject["status"] === 200 && data["Error"].length === 0 ) {
				that.refreshLiveFeedModel ( );
			} else {
				var errorMessage = oSapSplUtils.getErrorMessagesfromErrorPayload ( data )["ufErrorObject"];
				sap.ca.ui.message.showMessageBox ( {
					type : sap.ca.ui.message.Type.ERROR,
					message : oSapSplUtils.getErrorMessagesfromErrorPayload ( data )["errorWarningString"],
					details : errorMessage
				} );
			}
		},
		error : function ( error ) {
			if ( error && error["status"] === 500 ) {
				sap.ca.ui.message.showMessageBox ( {
					type : sap.ca.ui.message.Type.ERROR,
					message : error["status"] + " " + error.statusText,
					details : error.responseText
				} );
			} else {
				sap.ca.ui.message.showMessageBox ( {
					type : sap.ca.ui.message.Type.ERROR,
					message : oSapSplUtils.getErrorMessagesfromErrorPayload ( JSON.parse ( error.responseText ) )["errorWarningString"],
					details : oSapSplUtils.getErrorMessagesfromErrorPayload ( JSON.parse ( error.responseText ) )["ufErrorObject"]
				} );
			}
		},
		complete : function ( ) {}
	} );

}

/**
 *private
 *Method to handle select event of the feed list item
 *If the message is unread, make it as read
 *if there is no context bar associated already, create a new one.
 *else hide/ unhide the context bar.
 **/
function fnHandleSelectOfListItem ( oEvent ) {

	// Removing all overlays
	$ ( "#feedMessageDetailOverlay" ).hide ( );
	var oSelectedItem = null;
	var that = this, sId = "", sMessageType = null, sProperty = "ThreadUUID";
	oSelectedItem = oEvent.getParameters ( ).listItem;

	/* Incident : 1570148966 */
	var oMessageObject = oSelectedItem.getBindingContext ( ).getProperty ( );
	var sSelectedMessageType = "";
	sSelectedMessageType = oMessageObject["MessageType"];
	if ( (sSelectedMessageType === "BM" || sSelectedMessageType === "DM") && oMessageObject["isRead"] === "0" ) {
		fnMakeTheListItemAsReadUnread ( oMessageObject, that );
	}

	if ( this.allowFeedListSelection !== undefined && this.allowFeedListSelection === true ) {
		oSelectedItem.addStyleClass ( "sapSplMessageFeedListItemSelected" );
		sMessageType = oSelectedItem.getBindingContext ( ).getObject ( )["MessageType"];
		if ( sMessageType === "I" || sMessageType === "TM" ) {
			sProperty = "MessageUUID";
		}
		this.openContextUUID = oSelectedItem.getBindingContext ( ).getProperty ( sProperty );
		oSelectedItem.setSelected ( true );
		removeOtherSelections ( oSelectedItem.sId, oEvent.getSource ( ) );

		if ( oSelectedItem.getCustomData ( ).length === 1 && $ ( "#" + oSelectedItem.getCustomData ( )[0].getValue ( ).id ).css ( "display" ) === "block" ) {
			$ ( "#" + oSelectedItem.getCustomData ( )[0].getValue ( ).id ).remove ( );
			oSelectedItem.destroyCustomData ( );
		} else {

			var oLayout = null;
			oSelectedItem.destroyCustomData ( );

			/* FIX : 1482007925, 1482008753, 1482006447 */
			if ( oSelectedItem.getBindingContext ( ).getProperty ( )["isSent"] === 1 ) {
				if ( !this.oOpenedContextSentDetails[oSelectedItem.getBindingContext ( ).getProperty ( )[sProperty]] ) {
					oLayout = getContextLayout ( oSelectedItem.getBindingContext ( ).getProperty ( ), that );
					if ( sMessageType !== "AG" && sMessageType !== "RG" ) {
						this.oOpenedContextSentDetails[oSelectedItem.getBindingContext ( ).getProperty ( )[sProperty]] = oLayout;
					}
				} else {
					oLayout = this.oOpenedContextSentDetails[oSelectedItem.getBindingContext ( ).getProperty ( )[sProperty]];
				}
			} else {
				if ( !this.oOpenedContextDetails[oSelectedItem.getBindingContext ( ).getProperty ( )[sProperty]] ) {
					oLayout = getContextLayout ( oSelectedItem.getBindingContext ( ).getProperty ( ), that );
					if ( sSelectedMessageType === "DM" ) {
						if ( sMessageType !== "AG" && sMessageType !== "RG" ) {
							this.oOpenedContextDetails[oSelectedItem.getBindingContext ( ).getProperty ( )[sProperty]] = null;
						}
					} else {
						if ( sMessageType !== "AG" && sMessageType !== "RG" ) {
							this.oOpenedContextDetails[oSelectedItem.getBindingContext ( ).getProperty ( )[sProperty]] = oLayout;
						}
					}
				} else {
					oLayout = this.oOpenedContextDetails[oSelectedItem.getBindingContext ( ).getProperty ( )[sProperty]];
				}
			}

			/* CSNFIX : 0120061532 1491280 2014 */
			if ( oLayout ) {
				sId = new Date ( ).getTime ( ).toString ( );
				$ ( "<div id=" + sId + " class='contextBarParentDiv'></div>" ).insertAfter ( oEvent.getParameters ( ).listItem.$ ( ) );
				oSelectedItem.addCustomData ( new sap.ui.core.CustomData ( {
					key : "id",
					value : {
						id : sId,
						state : "show"
					}
				} ) );
				oLayout.placeAt ( sId );
			}
		}
	}

	oEvent.getSource ( ).removeSelections ( );

}

/**
 *private
 *Method to navigate back to the previously selected filter item
 **/
function navigateToPreviouslySelectedFilter ( ) {
	var oSourceButtonParent = this.oPressedFilterButton.getParent ( );
	for ( var i = 0 ; i < oSourceButtonParent.getItems ( ).length ; i++ ) {
		oSourceButtonParent.getItems ( )[i].removeStyleClass ( "addHighlight" );
	}
	this.oPressedFilterButton.addStyleClass ( "addHighlight" );
	this.oNav.back ( );
}

/**
 *private
 *Method to fetch the user preferences, when the user navigates to filter tab
 **/
function fnFetchUserPreferences ( ) {
	var oModel = sap.ui.getCore ( ).getModel ( "sapSplFeedUserPreferencesJSONModel" );
	oSapSplAjaxFactory.fireAjaxCall ( {
		url : oSapSplUtils.getFQServiceUrl ( "/sap/spl/xs/app/services/appl.xsodata/PersonPreferences?$format=json" ),
		method : "GET",
		async : true,
		success : function ( oData1 ) {
			var oData = oData1.d.results[0];
			var oTimeData = {};
			oTimeData["1"] = false;
			oTimeData["6"] = false;
			oTimeData["12"] = false;
			oTimeData["24"] = false;
			/* FIX : 1482007973, 1482005870 */
			oTimeData[null] = false;

			oData["MessagePreferences_Priorities_VeryHigh"] = (oData["MessagePreferences_Priorities_VeryHigh"] === "1") ? true : false;
			oData["MessagePreferences_Priorities_High"] = (oData["MessagePreferences_Priorities_High"] === "1") ? true : false;
			oData["MessagePreferences_Priorities_Medium"] = (oData["MessagePreferences_Priorities_Medium"] === "1") ? true : false;
			oData["MessagePreferences_Priorities_Low"] = (oData["MessagePreferences_Priorities_Low"] === "1") ? true : false;
			if ( !oData["MessagePreferences_SelectionTimeWindowInSeconds"] ) {
				oTimeData[null] = true;
			} else {
				oTimeData[(oData["MessagePreferences_SelectionTimeWindowInSeconds"] / 3600).toString ( )] = true;
			}

			var oModelData = {
				UUID : oData["UUID"],
				Priority : [{
					Name : oSapSplUtils.getBundle ( ).getText ( "INCIDENTS_PRIORITY_1" ),
					selected : oData["MessagePreferences_Priorities_VeryHigh"]
				}, {
					Name : oSapSplUtils.getBundle ( ).getText ( "INCIDENTS_PRIORITY_2" ),
					selected : oData["MessagePreferences_Priorities_High"]
				}, {
					Name : oSapSplUtils.getBundle ( ).getText ( "INCIDENTS_PRIORITY_3" ),
					selected : oData["MessagePreferences_Priorities_Medium"]
				}, {
					Name : oSapSplUtils.getBundle ( ).getText ( "INCIDENTS_PRIORITY_4" ),
					selected : oData["MessagePreferences_Priorities_Low"]
				}, {
					Name : oSapSplUtils.getBundle ( ).getText ( "NO_PRIORITY_MESSAGES" ),
					selected : true,
					ID : "NONE"
				}],
				Time : [{
					Name : oSapSplUtils.getBundle ( ).getText ( "TIME_FILTER_ONE_HOUR", 1 ),
					selected : oTimeData["1"],
					ID : 1 * 3600
				}, {
					Name : oSapSplUtils.getBundle ( ).getText ( "TIME_FILTER_MULTIPLE_HOURS", 6 ),
					selected : oTimeData["6"],
					ID : 6 * 3600
				}, {
					Name : oSapSplUtils.getBundle ( ).getText ( "TIME_FILTER_MULTIPLE_HOURS", 12 ),
					selected : oTimeData["12"],
					ID : 12 * 3600
				}, {
					Name : oSapSplUtils.getBundle ( ).getText ( "TIME_FILTER_MULTIPLE_HOURS", 24 ),
					selected : oTimeData["24"],
					ID : 24 * 3600
				}, {
					Name : oSapSplUtils.getBundle ( ).getText ( "FILTER_LABEL_ALL" ),
					selected : oTimeData[null],
					ID : null
				}]
			};
			oModel.setData ( oModelData );
		},
		error : function ( ) {

		}
	} );

}

/**
 *private
 *Method to handle the click of feed preferences tab
 **/
function fnHandleClickOfSetFilterOption ( oEvent ) {
	this.BlockerLayout.addStyleClass ( "sapSplFeedBlockerHide" );
	var oSourceButtonParent = oEvent.getSource ( ).getParent ( );
	for ( var i = 0 ; i < oSourceButtonParent.getItems ( ).length ; i++ ) {
		oSourceButtonParent.getItems ( )[i].removeStyleClass ( "addHighlight" );
	}

	/* FIX : 1482008717 */
	if ( this.oNav.getCurrentPage ( ).sId === this.oNav.getPages ( )[1].sId ) {
		if ( this.oFeedListControl.getContent ( )[1].hasStyleClass ( "liveFeedHidden" ) ) {
			this.oFeedListControl.getContent ( )[1].removeStyleClass ( "liveFeedHidden" );
			oEvent.getSource ( ).addStyleClass ( "addHighlight" );
		} else {
			this.oFeedListControl.getContent ( )[1].addStyleClass ( "liveFeedHidden" );
		}
	} else {
		oEvent.getSource ( ).addStyleClass ( "addHighlight" );
		this.oFeedListControl.getContent ( )[1].removeStyleClass ( "liveFeedHidden" );
		fnFetchUserPreferences ( );
		this.oNav.to ( this.oNav.getPages ( )[1].sId );
	}
}

/**
 *private
 *Method to handle save of feed preferences
 *Navigate back to the previously selected filter, on success. 
 **/
function fnHandleClickOfSaveFilterPreferences ( ) {
	var that = this;
	var oPreferenceModelData = sap.ui.getCore ( ).getModel ( "sapSplFeedUserPreferencesJSONModel" ).getData ( ), iTime = 0;
	for ( var i = 0 ; i < oPreferenceModelData["Time"].length ; i++ ) {
		if ( oPreferenceModelData["Time"][i].selected === true ) {
			iTime = oPreferenceModelData["Time"][i].ID;
			break;
		}
	}
	var oPayLoad = {
		"Data" : [{
			"UUID" : oPreferenceModelData["UUID"],
			"MessagePreferences.Priorities.Low" : (oPreferenceModelData["Priority"][3]["selected"] === true) ? "1" : "0",
			"MessagePreferences.Priorities.Medium" : (oPreferenceModelData["Priority"][2]["selected"] === true) ? "1" : "0",
			"MessagePreferences.Priorities.High" : (oPreferenceModelData["Priority"][1]["selected"] === true) ? "1" : "0",
			"MessagePreferences.Priorities.VeryHigh" : (oPreferenceModelData["Priority"][0]["selected"] === true) ? "1" : "0",
			"MessagePreferences.SelectionTimeWindowInSeconds" : iTime,
			"AuditTrail.CreatedBy" : null,
			"AuditTrail.ChangedBy" : null,
			"AuditTrail.CreationTime" : null,
			"AuditTrail.ChangeTime" : null
		}]
	};

	oSapSplAjaxFactory.fireAjaxCall ( {
		url : oSapSplUtils.getFQServiceUrl ( "sap/spl/xs/app/services/personPreferences.xsjs" ),
		method : "PUT",
		async : false,
		cache : false,
		data : JSON.stringify ( oPayLoad ),
		success : function ( data, success, messageObject ) {
			oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
			if ( data.constructor === String ) {
				data = JSON.parse ( data );
			}
			if ( messageObject["status"] === 200 && data["Error"].length === 0 ) {
				that.oPressedFilterButton.firePress ( );
			} else if ( data["Error"].length > 0 ) {
				var errorMessage = oSapSplUtils.getErrorMessagesfromErrorPayload ( data )["ufErrorObject"];
				sap.ca.ui.message.showMessageBox ( {
					type : sap.ca.ui.message.Type.ERROR,
					message : oSapSplUtils.getErrorMessagesfromErrorPayload ( data )["errorWarningString"],
					details : errorMessage
				} );
			}
		},
		error : function ( error ) {
			oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
			if ( error && error["status"] === 500 ) {
				sap.ca.ui.message.showMessageBox ( {
					type : sap.ca.ui.message.Type.ERROR,
					message : error["status"] + " " + error.statusText,
					details : error.responseText
				} );
			}
		},
		complete : function ( xhr ) {
			if ( xhr.responseText.constructor === String ) {
				xhr.responseText = JSON.parse ( xhr.responseText );
			}
			var oErrorObject = oSapSplUtils.getErrorMessagesfromErrorPayload ( xhr.responseText );
			if ( xhr.status === 400 ) {
				sap.ca.ui.message.showMessageBox ( {
					type : sap.ca.ui.message.Type.ERROR,
					message : oErrorObject["errorWarningString"],
					details : oErrorObject["ufErrorObject"]
				} );
			}
		}
	} );
}

/**
 *Constructor class of the sapSplLiveFeedControl
 *Prepare the complex layout, attach all events, consume the configuration object
 *Prepare the chat box console
 *Return the prepared layout
 **/
splReusable.libs.SapSplLiveFeedControl = function ( oFeedControlConfigData ) {

	this.oListOfChatBoxes = {};
	this.oFeedListCount = {};
	this.oExpandedListItems = {};
	this.parentControllerInstance = oFeedControlConfigData["parentControllerInstance"];

	if ( splReusable.libs.SapSplLiveFeedControl.prototype._singletonInstance ) {
		return splReusable.libs.SapSplLiveFeedControl.prototype._singletonInstance;
	}

	var that = this;
	this.oOpenedContextDetails = {};
	this.oOpenedContextSentDetails = {};
	this.openContextUUID = null;

	this.oFeedListControlModel = new sap.ui.model.json.JSONModel ( oFeedControlConfigData );

	this.oFeedFilterLayout = new sap.m.HBox ( ).addStyleClass ( "sapSplFeedFilterLayout" );

	this.oFeedFilterLayout.bindAggregation ( "items", "/feedFilters", function ( id, oBindObject ) {
		if ( oBindObject.getProperty ( "icon" ) === "All" ) {
			/* CSNFIX : 0120031469 0000690621 2014 */
			var oTextButton = new sap.m.Button ( {
				text : oSapSplUtils.getBundle ( ).getText ( "FILTER_LABEL_ALL" ),
				type : "Transparent",
				tooltip : oBindObject.getProperty ( "tooltip" ),
				visible : oBindObject.getProperty ( "visible" )
			} ).attachPress ( jQuery.proxy ( oFeedControlConfigData["feedControlEventHandler"], that ) );

			that.oPressedFilterButton = oTextButton;

			return oTextButton.addStyleClass ( "sapSplFeedFilterLayoutButton" ).addStyleClass ( "addHighlight" );
		} else if ( oBindObject.getProperty ( "name" ) === "Filter" ) {
			return new sap.m.Button ( {
				icon : oBindObject.getProperty ( "icon" ),
				type : "Transparent",
				tooltip : oBindObject.getProperty ( "tooltip" ),
				visible : oFeedControlConfigData["showCollapseButton"]
			} ).attachPress ( jQuery.proxy ( fnHandleClickOfSetFilterOption, that ) ).addStyleClass ( "sapSplFeedFilterLayoutButton" ).addStyleClass ( "filterButton" );

		} else {
			return new sap.m.Button ( {
				icon : oBindObject.getProperty ( "icon" ),
				type : "Transparent",
				tooltip : oBindObject.getProperty ( "tooltip" ),
				visible : oBindObject.getProperty ( "visible" )
			} ).attachPress ( jQuery.proxy ( oFeedControlConfigData["feedControlEventHandler"], that ) ).addStyleClass ( "sapSplFeedFilterLayoutButton" );
		}
	} );

	var oFeedListItemTemplate = this.getListItemInstance ( );

	this.oFeedList = new sap.m.List ( {
		enableBusyIndicator : false,
		select : jQuery.proxy ( fnHandleSelectOfListItem, that ),
		mode : "SingleSelectMaster",
		includeItemInSelection : true,
		noDataText : oSapSplUtils.getBundle ( ).getText ( "NO_MESSAGES_TEXT" ),
		showNoData : false,
		growing : true,
		growingScrollToLoad : true,
		growingThreshhold : 20
	} ).addStyleClass ( "sapSplMessageFeedList" );

	/* CSNFIX : 0120031469 685249 2014 */
	this.oFeedListFilterLabel = new sap.m.Label ( {
		text : oSapSplUtils.getBundle ( ).getText ( "ALL_MESSAGES" )
	} ).addStyleClass ( "sapSplFeedListToolbarTitle" );

	this.oFeedListFilterToolbar = new sap.m.Toolbar ( {
		design : "Auto"
	} ).addContent ( this.oFeedListFilterLabel ).addStyleClass ( "sapSplFeedListFilterToolbar" );

	this.oFeedList.bindItems ( {
		path : oFeedControlConfigData["sMessageEntity"],
		template : oFeedListItemTemplate,
		sorter : new sap.ui.model.Sorter ( "ReportedTime", true )
	} );
	this.oFeedFilterLayout.setModel ( this.oFeedListControlModel );
	this.oFeedFilterLayout.getBinding ( "items" ).filter ( new sap.ui.model.Filter ( "visible", sap.ui.model.FilterOperator.EQ, true ) );

	this.oNav = new sap.m.NavContainer ( ).addStyleClass ( "sapSplMessageFeedListContainer" );

	this.oFeedListLayoutPage = new sap.m.Page ( {
		subHeader : this.oFeedListFilterToolbar,
		content : this.oFeedList,
		showHeader : false
	} ).addStyleClass ( "feedLayoutPage" );

	this.oNav.addPage ( this.oFeedListLayoutPage );

	var oModel = new sap.ui.model.json.JSONModel ( );
	sap.ui.getCore ( ).setModel ( oModel, "sapSplFeedUserPreferencesJSONModel" );

	this.oNav.addPage ( new sap.m.Page ( {
		showHeader : false,
		subHeader : new sap.m.Toolbar ( {
			design : "Auto",
			content : new sap.m.Label ( {
				text : oSapSplUtils.getBundle ( ).getText ( "MESSAGE_PREFERENCES" )
			} ).addStyleClass ( "sapSplFeedListToolbarTitle" )
		} ).addStyleClass ( "sapSplFeedListFilterToolbar" ),
		footer : new sap.m.Bar ( {
			contentRight : [new sap.m.Button ( {
				text : oSapSplUtils.getBundle ( ).getText ( "NEW_CONTACT_SAVE" ),
				press : jQuery.proxy ( fnHandleClickOfSaveFilterPreferences, that )
			} ), new sap.m.Button ( {
				text : oSapSplUtils.getBundle ( ).getText ( "CANCEL" ),
				press : jQuery.proxy ( navigateToPreviouslySelectedFilter, that )
			} )]
		} ),
		content : [new sap.m.Panel ( {
			content : new sap.m.List ( {
				mode : "MultiSelect",
				select : function ( oEvent ) {
					if ( oEvent.getParameters ( ).listItem.getBindingContext ( ).getObject ( )["ID"] === "NONE" ) {
						oEvent.getParameters ( ).listItem.setSelected ( true );
					}
				}
			} ).bindItems ( "/Priority", function ( sId, oObject ) {
				/* FIX : 1482007971 */
				var oReturnListItem = new sap.m.StandardListItem ( {
					title : "{Name}",
					selected : "{selected}"
				} ).addStyleClass ( "filterSettingsListItem" );
				if ( oObject.getObject ( )["ID"] && oObject.getObject ( )["ID"] === "NONE" ) {
					return oReturnListItem.addStyleClass ( "sapSplPointerEventsBlocker" );
				} else {
					return oReturnListItem;
				}
			} ),
			headerToolbar : new sap.m.Toolbar ( {
				design : "Info",
				content : [new sap.m.Text ( {
					text : oSapSplUtils.getBundle ( ).getText ( "PRIORITY_HEADER" )
				} )]
			} )
		} ).addStyleClass ( "filterSettingsPanel" ), new sap.m.Panel ( {
			content : new sap.m.List ( {
				mode : "SingleSelectLeft",
				items : {
					path : "/Time",
					template : new sap.m.StandardListItem ( {
						title : "{Name}",
						selected : "{selected}"
					} ).addStyleClass ( "filterSettingsListItem" )
				}
			} ),
			headerToolbar : new sap.m.Toolbar ( {
				design : "Info",
				content : [new sap.m.Text ( {
					text : oSapSplUtils.getBundle ( ).getText ( "TIME_HEADER" )
				} )]
			} )
		} ).addStyleClass ( "filterSettingsPanel" )]
	} ).setModel ( sap.ui.getCore ( ).getModel ( "sapSplFeedUserPreferencesJSONModel" ) ).addStyleClass ( "feedLayoutPage" ) );

	this.BlockerLayout = new sap.ui.layout.HorizontalLayout ( {
		busyIndicatorDelay : 0,
		busy : true
	} ).addStyleClass ( "sapSplFeedBlocker" ).addEventDelegate ( {
		onAfterRendering : function ( oEvent ) {
			oEvent.srcControl.$ ( ).css ( "height", $ ( window ).height ( ) - $ ( ".sapUiUfdShellHead" ).height ( ) - $ ( ".splMapTollbarBar" ).height ( ) - $ ( ".sapMFooter-CTX" ).height ( ) + "px" );
		}
	} ).addStyleClass ( "sapSplFeedBlockerHide" );

	sap.ui.getCore ( ).byId ( "splView.liveApp.liveApp--sapSplTrafficStatusMapContainer" ).addContent ( this.oChatBoxLayout );

	this.oFeedListControl = new sap.ui.commons.layout.VerticalLayout ( ).addStyleClass ( "sapSplFeedLayout" ).addContent ( this.oFeedFilterLayout ).addContent ( this.oNav ).addContent ( this.BlockerLayout );

	this.oFeedList.addEventDelegate ( {
		onAfterRendering : jQuery.proxy ( fnHandleOnAfterRenderingOfTheFeedList, that )
	} );

	this.allowFeedListSelection = oFeedControlConfigData["allowFeedListSelection"];
	if ( oFeedControlConfigData["refreshMode"] !== "Manual" ) {
		var iInterval = 5000;
		if ( oFeedControlConfigData["refreshInterval"] ) {
			iInterval = oFeedControlConfigData["refreshInterval"];
		}

		this.iInterval = iInterval;
	}

	jQuery ( window ).resize ( function ( ) {
		fnHandleOnAfterRenderingOfTheFeedList ( );
	} );

	this.oFeedListControl.placeChatBoxControl = function ( ) {
		that.oChatBoxConsole.placeAt ( "chatBoxConsoleContainerDiv" );
	};

	this.oFeedListControl.startPolling = function ( sMode ) {
		if ( sMode && sMode === "firstTime" ) {
			that.refreshLiveFeedModel ( );
		}
		startPollingOfLiveFeed ( that, true );
	};

	this.oFeedListControl.getChatBoxInstances = function ( ) {
		return that.oListOfChatBoxes;
	};

	/* Patch Fix for Incident : 0020079747 0001172740 2014 */
	this.oFeedListControl.stopPolling = function ( ) {
		clearInterval ( that.liveFeedInterval );
	};

	this.oChatBoxContainerApp = new sap.m.NavContainer ( {
		layoutData : new sap.ui.layout.SplitterLayoutData ( {
			resizable : false
		} ),
		pages : [new sap.m.Page ( )]
	} );

	sap.ui.getCore ( ).setModel ( new sap.ui.model.json.JSONModel ( [] ), "sapSplChatBoxConsoleLeftListModel" );

	this.oChatBoxConsoleLeftList = new sap.m.List ( {
		mode : "Delete",
		items : {
			path : "/",
			template : new sap.m.StandardListItem ( {
				title : "{SenderName}",
				counter : 0,
				icon : {
					path : "MessageType",
					formatter : function ( sType ) {
						if ( sType === "BM" ) {
							return "sap-icon://collaborate";
						} else if ( sType === "DM" ) {
							return "sap-icon://bussiness-suite/icon-truck-driver";
						}
					}
				},
				press : function ( e ) {
					for ( var i = 0 ; i < e.getSource ( ).getParent ( ).getItems ( ).length ; i++ ) {
						e.getSource ( ).getParent ( ).getItems ( )[i].removeStyleClass ( "chatBoxHasUnreadMessages" );
						e.getSource ( ).getParent ( ).getItems ( )[i].removeStyleClass ( "chatBoxItemIsSelected" );
					}
					e.getSource ( ).setCounter ( 0 );
					e.getSource ( ).addStyleClass ( "chatBoxItemIsSelected" );
					that.oChatBoxContainerApp.to ( that.oListOfChatBoxes[e.getSource ( ).getBindingContext ( ).getObject ( )["ThreadUUID"]], "back" );
				},
				type : "Active"
			} ).addStyleClass ( "chatLeftPanelListItem" )
		},
		"delete" : function ( e ) {
			that.oListOfChatBoxes[e.getParameters ( ).listItem.getBindingContext ( ).getObject ( )["ThreadUUID"]].closeChatBox ( );
		}
	} ).setModel ( sap.ui.getCore ( ).getModel ( "sapSplChatBoxConsoleLeftListModel" ) ).addStyleClass ( "sapSplChatBoxConsoleLeftList" );

	this.oChatBoxConsoleLeftList.addEventDelegate ( {
		onAfterRendering : function ( e ) {
			for ( var i = 0 ; i < e.srcControl.getItems ( ).length ; i++ ) {
				if ( that.oListOfChatBoxes[e.srcControl.getItems ( )[i].getBindingContext ( ).getObject ( )["ThreadUUID"]] ) {
					that.oListOfChatBoxes[e.srcControl.getItems ( )[i].getBindingContext ( ).getObject ( )["ThreadUUID"]].setListItemInstance ( e.srcControl.getItems ( )[i] );
				}
			}
			if ( e.srcControl.getItems ( ).length > 0 ) {
				e.srcControl.getItems ( )[e.srcControl.getItems ( ).length - 1].firePress ( );
			}
		}
	} );

	this.oSapSplChatBoxConsoleHeaderLabel = new sap.m.Label ( );

	function fnPositionChatbox ( ) {
		/* Fix for : 1580002246 */
		var fWindowHeight = jQuery ( window ).height ( );
		var fChatboxHieght = jQuery ( "#chatBoxConsoleContainerDiv" ).height ( );
		var fChatboxTop = jQuery ( "#chatBoxConsoleContainerDiv" ).offset ( )["top"];

		// Chatbox on lower half of the screen
		if ( (fChatboxTop + fChatboxHieght / 2) > fWindowHeight / 2 ) {
			jQuery ( "#chatBoxConsoleContainerDiv" ).css ( "bottom", (fWindowHeight - (fChatboxTop + fChatboxHieght)) + "px" );
			jQuery ( "#chatBoxConsoleContainerDiv" ).css ( "top", "auto" );
			// Chatbox on upper half of the screen
		} else {
			jQuery ( "#chatBoxConsoleContainerDiv" ).css ( "bottom", "auto" );
			jQuery ( "#chatBoxConsoleContainerDiv" ).css ( "top", (fChatboxTop - 45) + "px" );
		}
	}

	this.oChatBoxConsole = new sap.m.Page ( {
		enableScrolling : false,
		customHeader : new sap.m.Bar ( {
			contentLeft : [this.oSapSplChatBoxConsoleHeaderLabel],
			contentRight : [new sap.ui.core.Icon ( {
				src : "sap-icon://less",
				tooltip : oSapSplUtils.getBundle ( ).getText ( "MINIMIZE_CHAT_BOX_TOOLTIP" ),
				press : function ( ) {
					if ( $ ( "#chatBoxConsoleContainerDiv" )[0].style.height === "2em" ) {
						this.setSrc ( "sap-icon://less" );
						$ ( "#chatBoxConsoleContainerDiv" ).css ( "height", "40%" );
					} else {
						this.setSrc ( "sap-icon://collapse-group" );
						this.getParent ( ).getContentRight ( )[1].setSrc ( "sap-icon://full-screen" );
						$ ( "#chatBoxConsoleContainerDiv" ).css ( "height", "2em" );
					}
				},
				color : "white",
				size : "18px"
			} ), new sap.ui.core.Icon ( {
				src : "sap-icon://full-screen",
				tooltip : oSapSplUtils.getBundle ( ).getText ( "MAXIMIZE_CHAT_BOX_TOOLTIP" ),
				press : function ( ) {
					this.getParent ( ).getContentRight ( )[0].setSrc ( "sap-icon://less" );
					if ( this.getSrc ( ) === "sap-icon://full-screen" ) {
						this.setSrc ( "sap-icon://exit-full-screen" );
						$ ( "#chatBoxConsoleContainerDiv" ).css ( "height", "70%" );
					} else {
						this.setSrc ( "sap-icon://full-screen" );
						$ ( "#chatBoxConsoleContainerDiv" ).css ( "height", "40%" );
					}
				},
				color : "white",
				size : "18px"
			} ), new sap.ui.core.Icon ( {
				src : "sap-icon://sys-cancel",
				tooltip : oSapSplUtils.getBundle ( ).getText ( "CLOSE_CHAT_BOX_TOOLTIP" ),
				press : function ( ) {
					jQuery.each ( that.oListOfChatBoxes, function ( sKey, sValue ) {
						sValue.closeChatBox ( );
					} );
				},
				color : "white",
				size : "18px"
			} )]
		} ).addStyleClass ( "sapSplChatBoxConsoleHeader" )
	} ).addStyleClass ( "sapSplChatBoxConsoleParentPage" ).addContent ( new sap.ui.layout.Splitter ( {
		contentAreas : [new sap.m.Page ( {
			layoutData : new sap.ui.layout.SplitterLayoutData ( {
				resizable : false
			} ),
			content : this.oChatBoxConsoleLeftList,
			showHeader : false
		} ).addStyleClass ( "sapSplChatBoxConsoleLeftPanel" ), this.oChatBoxContainerApp.addStyleClass ( "sapSplChatBoxConsoleRightPanel" )]
	} ).addEventDelegate ( {
		onAfterRendering : function ( e ) {
			/* Fix for : 1580002246 */
			$ ( "#" + e.srcControl.sId ).on ( "mousedown", function ( ) {
				jQuery ( "#chatBoxConsoleContainerDiv" ).draggable ( "destroy" );
			} );

			$ ( "#" + e.srcControl.sId ).on ( "mouseup", function ( ) {
				jQuery ( "#chatBoxConsoleContainerDiv" ).draggable ( {
					"containment" : "#sapSplBaseUnifiedShell-cntnt",
					"stop" : function ( ) {
						fnPositionChatbox ( );
					}
				} );
				jQuery ( "#chatBoxConsoleContainerDiv" ).draggable ( {
					"containment" : "#sapSplBaseUnifiedShell-cntnt",
					"stop" : function ( ) {
						fnPositionChatbox ( );
					}
				} );
			} );
		}
	} ).addStyleClass ( "sapSplChatBoxConsoleClosed" ) ).addStyleClass ( "sapSplChatBoxConsoleParentClosed" ).addEventDelegate ( {
		onAfterRendering : function ( ) {
			$ ( "#chatBoxConsoleContainerDiv" ).draggable ( {
				"containment" : "#sapSplBaseUnifiedShell-cntnt",
				"stop" : function ( ) {
					fnPositionChatbox ( );
				}
			} );
		}
	} );

	splReusable.libs.SapSplLiveFeedControl.prototype._singletonInstance = this.oFeedListControl.addStyleClass ( "right" );
	return this.oFeedListControl.addStyleClass ( "right" );
};

/**
 * Method to get the list item template for all inbox list items
 * Will also be consumed from the maptoolbar
 **/

splReusable.libs.SapSplLiveFeedControl.prototype.getListItemInstance = function ( ) {
	var that = this;
	return new sap.m.FeedListItem ( {
		sender : "{SenderName}",
		/* Solution to Incident 1580185546 */
		senderActive : true,
		text : {
			parts : [{
				path : "Text1"
			}, {
				path : "Text2"
			}, {
				path : "Text2"
			}],
			formatter : splReusable.libs.SapSplModelFormatters.returnFeedMessage
		},
		timestamp : {
			parts : [{
				path : "ReportedTime"
			}, {
				path : "MessageType"
			}],
			formatter : splReusable.libs.SapSplModelFormatters.returnMessageTimestamp
		},
		info : {
			parts : [{
				path : "Priority.description"
			}, {
				path : "isNotification"
			}, {
				path : "isActive"
			}],
			formatter : splReusable.libs.SapSplModelFormatters.returnPriorityTextByRemovingNull
		},
		icon : {
			parts : [{
				path : "ImageUrl"
			}, {
				path : "MessageType"
			}, {
				path : "isNotification"
			}],
			formatter : splReusable.libs.SapSplModelFormatters.returnMessageIcons
		}
	} ).addStyleClass ( "sapSplMessageFeedListItem" ).addEventDelegate ( {
		onAfterRendering : jQuery.proxy ( fnHandleOnAfterRenderingOfTheFeedListItem, that )
	} );

};

/**
 * Method to get the list item template for all sent items
 * Will also be consumed from the maptoolbar
 **/
splReusable.libs.SapSplLiveFeedControl.prototype.getListItemInstanceForSentItems = function ( ) {
	var that = this;
	return new sap.m.FeedListItem ( {
		text : {
			parts : [{
				path : "Text1"
			}, {
				path : "Text2"
			}, {
				path : "Text2"
			}],
			formatter : splReusable.libs.SapSplModelFormatters.returnFeedMessage
		},
		timestamp : {
			parts : [{
				path : "ReportedTime"
			}, {
				path : "MessageType"
			}],
			formatter : splReusable.libs.SapSplModelFormatters.returnMessageTimestamp
		},
		info : {
			parts : [{
				path : "Priority.description"
			}],
			formatter : splReusable.libs.SapSplModelFormatters.returnPriorityTextByRemovingNull
		},
		icon : {
			parts : [{
				path : "ImageUrl"
			}, {
				path : "MessageType"
			}],
			formatter : splReusable.libs.SapSplModelFormatters.returnMessageIcons
		}
	} ).addStyleClass ( "sapSplMessageFeedListItem" ).addEventDelegate ( {
		onAfterRendering : jQuery.proxy ( fnHandleOnAfterRenderingOfTheFeedListItem, that )
	} );

};

/**
 * Method to get refresh the live feed odata model
 **/
splReusable.libs.SapSplLiveFeedControl.prototype.refreshLiveFeedModel = function ( ) {
	if ( !this.oFeedListOdataModel ) {
		this.oFeedListOdataModel = sap.ui.getCore ( ).getModel ( "LiveFeedODataModel" );
		/*
		 * Patch Fix for Incident - 0020079747 0001172740 2014 - set the
		 * liveFeed models countSupported property to false. if the models
		 * countSupported property is true, everytime the model is refreshed; a
		 * call for count is done, which is sync. Thereby blocking the entire
		 * UI.
		 */
		this.oFeedListOdataModel.setCountSupported ( false );
		this.oFeedList.setModel ( this.oFeedListOdataModel );
		var that = this;
		this.oFeedListOdataModel.attachRequestCompleted ( function ( oEvent ) {
			if ( !oEvent.getParameters ( )["errorobject"] ) {
				that.oFeedList.setBusy ( false );
				that.BlockerLayout.addStyleClass ( "sapSplFeedBlockerHide" );
			}
		} );
		this.oFeedListOdataModel.attachRequestSent ( function ( ) {
			if ( !that.oNav.hasStyleClass ( "liveFeedHidden" ) ) {
				that.BlockerLayout.removeStyleClass ( "sapSplFeedBlockerHide" );
			}
		} );
		this.oFeedListOdataModel.attachRequestFailed ( function ( ) {
			that.BlockerLayout.addStyleClass ( "sapSplFeedBlockerHide" );
		} );
	}
	this.oFeedListOdataModel.refresh ( );
};
