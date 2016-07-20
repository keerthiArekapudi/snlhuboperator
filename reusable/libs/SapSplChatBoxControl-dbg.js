/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.require ( "splReusable.exceptions.MissingParametersException" );
jQuery.sap.require ( "splReusable.exceptions.InvalidArrayException" );
jQuery.sap.require ( "splReusable.libs.SapSplModelFormatters" );
jQuery.sap.require ( "splReusable.libs.SapSplEnums" );
splReusable.libs.SapSplStyleSheetLoader.loadStyle ( "./resources/styles/sapSplChatBoxControl" );
jQuery.sap.declare ( "splReusable.libs.SapSplChatBoxControl" );
var bMessageReceived = false;
var bChatListRendered = false;

/**
 * private Method to fetch data for the chat box instance, based on the user
 * scroll. Ajax call to ChatMessage entity, and filter on thread UUID.
 */
function fnFetchDataForChat ( that ) {
	/* To see sent messages on the feed */
	var sPath = "/ChatMessage?$orderby=ReportedTime desc&$inlinecount=allpages&$filter=ThreadUUID eq X'" + oSapSplUtils.base64ToHex ( that.oChatBoxConfigData["ThreadUUID"] ) + "\'";

	/* Fix for Incident : 0120025231 0001159714 2014 */
	if ( that.totalCount && that.totalCount < that.top ) {
		/* Fix for incident 1580124356 */
		that.top = that.totalCount + 1;
	}

	sPath = sPath + "&$top=" + that.top;

	/* Changed the Odata read to asynchronous from synchronous */
	sap.ui.getCore ( ).getModel ( "ChatODataModel" ).read ( sPath, null, [""], true, function ( results ) {
		that.oChatBoxModel.setSizeLimit ( results.results.length + 1 );
		that.oChatBoxModel.setData ( results.results );
		/* Fix for Incident :0020079747 0000675428 2015 */
		if ( that.oChatBoxConfigData["chatBoxConsoleApp"] && that.totalCount !== undefined ) {
			if ( that.oChatBoxConsoleLeftListItemInstance && parseInt ( results["__count"], 10 ) > that.totalCount ) {
				bMessageReceived = true;
			}
		}

		if ( that.oChatBoxConfigData["chatBoxConsoleApp"] && that.totalCount !== undefined ) {
			if ( that.oChatBoxConfigData["chatBoxConsoleApp"].getCurrentPage ( ).sId !== that.oChatBoxLayout.sId ) {
				if ( that.oChatBoxConsoleLeftListItemInstance && parseInt ( results["__count"], 10 ) > that.totalCount ) {
					that.oChatBoxConsoleLeftListItemInstance.setCounter ( that.oChatBoxConsoleLeftListItemInstance.getCounter ( ) + 1 );
					that.oChatBoxConsoleLeftListItemInstance.addStyleClass ( "chatBoxHasUnreadMessages" );
				} else {
					/*
					 * Fix for Incident :0020079747 0000675428
					 * 2015
					 */
					bChatListRendered = true;
				}
			}
		}

		/* Fix for Incident : 0120025231 0001159714 2014 */
		that.totalCount = parseInt ( results["__count"], 10 );
	}, function ( ) {

	} );
}

/**
 * private Method to start polling of the chat box instance
 */
function startPollingOfChatBox ( that ) {

	if ( that.oInterval !== undefined ) {
		clearInterval ( that.oInterval );
	}

	that.oInterval = window.setInterval ( function ( ) {
		fnFetchDataForChat ( that );
	}, 4000 );
	oSapSplUtils.setIntervalId ( that.oInterval );
}

/**
 * private Method to handle click of chat box list item and to invalidate the
 * visual changes
 */
function fnHandleSelectionOfChatItem ( oEvent ) {
	oEvent.getParameter ( "listItem" ).addStyleClass ( "listItemClicked" );
	oEvent.getParameter ( "listItem" ).setSelected ( false );
}

/**
 * private Method to prepare and return the chat box list item instance The
 * returned chat box list item instance will be dependent on the direction ie,
 * placement of text and image will differ for sent items and inbox items.
 */
function getChatBoxListItem ( sDir ) {

	var oTemplate = new sap.m.FeedListItem ( {

		//Fix for incident 1570837323
		text : "{Text}",
		timestamp : {
			parts : [{
				path : "ReportedTime"
			}],
			formatter : splReusable.libs.SapSplModelFormatters.returnMessageTimestamp
		},
		icon : "sap-icon://employee"
	} );

	oTemplate.addEventDelegate ( {
		onAfterRendering : function ( oEvent ) {
			var oBoundObject = oEvent.srcControl.getBindingContext ( ).getObject ( );
			/* FIX : 1482007867 */
			var iHeight = $ ( "#" + oEvent.srcControl.sId + " .sapMFeedListItemText" ).height ( );
			$ ( "#" + oEvent.srcControl.sId + " .sapMFeedListItem" ).parent ( ).css ( "min-height", iHeight + 42 + "px" );
			$ ( "#" + oEvent.srcControl.sId + " .sapMFeedListItemFooter #" + oEvent.srcControl.sId + "outBoundStatus" ).remove ( );

			/* Fix For Incident 1570316631 */
			if ( oBoundObject["MessageDirection"] === "S" ) {
				/* CSNFIX : 1570032878 */
				$ ( "#" + oEvent.srcControl.sId + " .sapMFeedListItemFooter" ).prepend ( "<div class='outBoundStatus' id=" + oEvent.srcControl.sId + "outBoundStatus" + "></div>" );
				if ( oBoundObject["ReplicationStatus"] === 0 ) {
					new sap.m.Label ( {
						text : oSapSplUtils.getBundle ( ).getText ( "DELIVERY_FAILED" )
					} ).placeAt ( oEvent.srcControl.sId + "outBoundStatus" ).addStyleClass ( "outBoundStatusError" );
				} else if ( oBoundObject["ReplicationStatus"] === 2 ) {
					new sap.ui.core.Icon ( {
						src : "sap-icon://accept"
					} ).placeAt ( oEvent.srcControl.sId + "outBoundStatus" ).addStyleClass ( "outBoundStatusOK" );
				}
			}
		}
	} );

	if ( sDir === "right" ) {
		oTemplate.addStyleClass ( "sapSplChatBoxListItemRight" );
		return oTemplate;
	} else {
		oTemplate.addStyleClass ( "sapSplChatBoxListItemLeft" );
		return oTemplate;
	}

}

/**
 * private Method to post a new message to the appropriate thread Trigger an
 * update of the chat box data, and increment the logical variables
 */
function fnMakeAjaxCall ( oPayLoad, that, oTextField, oPostIcon ) {
	oSapSplAjaxFactory.fireAjaxCall ( {
		url : oSapSplUtils.getServiceMetadata ( "message", true ),
		method : "POST",
		// CSN FIX : 0120061532 1495872 2014
		async : false,
		data : JSON.stringify ( oPayLoad ),
		success : function ( data, success, messageObject ) {
			if ( data.constructor === String ) {
				data = JSON.parse ( data );
			}
			if ( messageObject["status"] === 200 && data["Error"].length === 0 ) {
				that.sCurrentMessage = "";
				oTextField.setValue ( "" );
				/* Fix for Incident : 0120025231 0001159714 2014 */
				that.top = that.top + 1;
				that.bMessageAdded = true;
				fnFetchDataForChat ( that );
				if ( oPostIcon ) {
					oPostIcon.setColor ( "#00679e" );
				}
			}
		},
		error : function ( ) {
			oTextField.setValue ( that.sCurrentMessage );
		},
		complete : function ( ) {}

	} );
}

/**
 * private Method to handle the "enter" keyboard button press event Prepare the
 * payload, and call the above method.
 */
function sendChatMessage ( sMessage, that, oTextField, oIcon ) {
	var sUUID = oSapSplUtils.getUUID ( ), oPostIcon = null;
	var oHeaderObject = {}, oTextObject = {};
	oHeaderObject["UUID"] = sUUID;
	oHeaderObject["TemplateUUID"] = "";
	oHeaderObject["Priority"] = "1";
	oHeaderObject["OwnerID"] = oSapSplUtils.getCompanyDetails ( )["BasicInfo_CompanyID"];
	oHeaderObject["SenderID"] = oSapSplUtils.getCompanyDetails ( )["BasicInfo_CompanyID"];
	oHeaderObject["Validity.StartTime"] = null;
	oHeaderObject["Validity.EndTime"] = null;
	oHeaderObject["AuditTrail.CreatedBy"] = null;
	oHeaderObject["AuditTrail.ChangedBy"] = null;
	oHeaderObject["AuditTrail.CreationTime"] = null;
	oHeaderObject["AuditTrail.ChangeTime"] = null;
	oHeaderObject["ThreadUUID"] = that.oChatBoxConfigData["ThreadUUID"];
	oHeaderObject["Type"] = that.oChatBoxConfigData["MessageType"];

	oTextObject["UUID"] = sUUID;
	/*
	 * CSN FIX : 0120031469 682358 2014 Remove the Language attribute from the
	 * payload
	 */
	oTextObject["ShortText"] = sMessage;
	oTextObject["LongText"] = sMessage;

	var sRecipientType = "BusinessPartner";
	var aSelectedRecipients = [];
	var oObject = {};

	oObject["RecipientUUID"] = that.oChatBoxConfigData["SenderID"];
	oObject["UUID"] = oSapSplUtils.getUUID ( );
	oObject["ParentUUID"] = sUUID;
	oObject["RecipientType"] = sRecipientType;
	oObject["isRead"] = "0";
	aSelectedRecipients.push ( oObject );

	if ( oIcon ) {
		oPostIcon = oIcon;
	}

	fnMakeAjaxCall ( {
		Header : [oHeaderObject],
		Recipient : aSelectedRecipients,
		Text : [oTextObject],
		Object : "MessageOccurrence"
	}, that, oTextField, oPostIcon );
}

/**
 * private Method to handle the click of send message button on the chat box
 */
function fnHandleClickOfPostMessageButton ( oEvent ) {
	sendChatMessage ( this.sCurrentMessage, this, this.oChatBoxInputField, oEvent.getSource ( ) );
}

/**
 * private Method to listen to live change of the chat box message input field.
 * Listen to the user input and prepare the current message till the user
 * presses "enter"
 */
function fnHandleChatBoxInputFieldLiveChange ( oEvent ) {
	var sLiveValue = oEvent.getParameters ( ).newValue;

	if ( sLiveValue !== "" && this.sCurrentMessage !== "" && sLiveValue.substr ( this.sCurrentMessage.length, sLiveValue.length ) === "\n" ) {
		sendChatMessage ( this.sCurrentMessage, this, oEvent.getSource ( ) );
	} else {
		this.sCurrentMessage = oEvent.getParameters ( ).newValue;
	}
}

/**
 * Constructor class of the sapSplChatBoxControl Prepare the layout, place the
 * layout in the chat box console Attach events and consume the chat box
 * configuration object
 */
splReusable.libs.SapSplChatBoxControl = function ( oChatBoxConfigData ) {

	var that = this;

	this.oChatBoxConfigData = oChatBoxConfigData;

	this.oChatBoxHeader = new sap.m.Toolbar ( {
		content : [new sap.m.Label ( {
			text : oChatBoxConfigData["SenderName"]
		} ).addStyleClass ( "sapSplChatBoxHeaderTitle" )]
	} ).addStyleClass ( "headerBorder" ).addStyleClass ( "chatBoxHeaderBar" );

	this.oChatBoxList = new sap.m.List ( {
		showNoData : false,
		inset : false,
		width : "100%",
		select : fnHandleSelectionOfChatItem,
		mode : "None"
	} ).addStyleClass ( "sapSplChatBoxList" );

	this.oChatBoxList.bindAggregation ( "items", "/", function ( sId, oBindingObject ) {
		var item = null;
		if ( oBindingObject.getProperty ( "MessageDirection" ) === "S" ) {
			item = getChatBoxListItem ( "right", that );
		} else {
			item = getChatBoxListItem ( "left", that );
		}
		return item;
	} );

	this.oChatBoxModel = new sap.ui.model.json.JSONModel ( );
	this.oChatBoxModel.setSizeLimit ( 400 );
	this.oChatBoxList.setModel ( this.oChatBoxModel );
	this.oChatBoxList.getBinding ( "items" ).sort ( new sap.ui.model.Sorter ( "ReportedTime", false ) );

	/* Fix for Incident : 0120025231 0001159714 2014 */
	/*
	 * @description Method to Prepare a fresh map of the indexs and the
	 * consolidated height. @param {object} oEvent - onAfterRendering event
	 * object. @returns void.
	 */
	function prepareMap ( oList ) {
		that.oMapObject = {};
		oList.iTotalHeight = undefined;
		for ( var i = 0 ; i < oList.getItems ( ).length ; i++ ) {
			var oListItem = oList.getItems ( )[i], iIndex = oList.getItems ( ).length - oList.indexOfItem ( oListItem ), iListItemHeight = $ ( "#" + oListItem.sId ).height ( );

			if ( oList.iTotalHeight === undefined ) {
				that.oMapObject[iListItemHeight] = iIndex;
				oList.iTotalHeight = iListItemHeight;
			} else {
				that.oMapObject[oList.iTotalHeight + iListItemHeight] = iIndex;
				oList.iTotalHeight += iListItemHeight;
			}
		}
	}

	/* Fix for Incident : 0120025231 0001159714 2014 */
	/*
	 * @description Method to find out the nearest list item index based on the
	 * scroll position of the chatbox. @param {object} oObject - Mapping object
	 * of the consolidated height of the chatbox till nth index and the index.
	 * {string} sValue - scrollTop value, caught in scroll event handler of the
	 * chatbox list. @returns corresponding chatbox listitem index from the
	 * bottom of the list, based on the scroll position.
	 */
	function getNearestListItemIndexBasedOnScrollPosition ( oObject, sValue ) {
		var keys = Object.keys ( oObject );
		var _ireturnValue = -1;
		for ( var i = 0 ; i < keys.length ; i++ ) {
			if ( sValue >= keys[i] ) {
				_ireturnValue = oObject[keys[i]];
			}
		}
		return _ireturnValue;
	}

	function collapseExpandChatBoxConsole ( sMode ) {
		if ( sMode === "Collapse" ) {
			that.oChatBoxConfigData["chatBoxConsoleApp"].getParent ( ).removeStyleClass ( "sapSplChatBoxConsole" ).addStyleClass ( "sapSplChatBoxConsoleClosed" );
			that.oChatBoxConfigData["chatBoxConsoleApp"].getParent ( ).getParent ( ).removeStyleClass ( "sapSplChatBoxConsoleParent" ).addStyleClass ( "sapSplChatBoxConsoleParentClosed" );
			$ ( "#chatBoxConsoleContainerDiv" ).css ( "right", "40.5em" );
		} else {
			that.oChatBoxConfigData["chatBoxConsoleApp"].getParent ( ).removeStyleClass ( "sapSplChatBoxConsoleClosed" ).addStyleClass ( "sapSplChatBoxConsole" );
			that.oChatBoxConfigData["chatBoxConsoleApp"].getParent ( ).getParent ( ).removeStyleClass ( "sapSplChatBoxConsoleParentClosed" ).addStyleClass ( "sapSplChatBoxConsoleParent" );
			$ ( "#chatBoxConsoleContainerDiv" ).css ( "right", "50.5em" );
		}
	}

	this.oChatBoxList.addEventDelegate ( {
		onAfterRendering : function ( e ) {
			/* Fix for Incident : 0120025231 0001159714 2014 */
			var listItems = e.srcControl.getItems ( );
			if ( listItems.length > 0 ) {
				/* Fix for Incident :0020079747 0000675428 2015 */
				bChatListRendered = true;
				prepareMap ( e.srcControl );
				that.bMessageAdded = false;
				if ( listItems[listItems.length - that.focusPoint] ) {
					if ( sap.ui.Device.browser.name === "ie" ) {

						listItems[listItems.length - that.focusPoint].focus ( );

					} else {
						listItems[listItems.length - that.focusPoint].focus ( );
					}
					/* Fix for Incident : 1472021645 */
					$ ( that.oChatBoxInputField )[0].focus ( );
				} else {
					listItems[listItems.length - 1].focus ( );
				}
			}
		}
	} );

	/* Fix for Incident : 0120025231 0001159714 2014 */
	this.focusPoint = 1;
	this.top = SapSplEnums.ChatBoxFetchThreshHold;
	this.bMessageAdded = false;
	this.oMapObject = {};

	fnFetchDataForChat ( this );

	this.oChatBoxInputField = new sap.m.TextArea ( {
		width : "100%",
		rows : 2,
		placeholder : oSapSplUtils.getBundle ( ).getText ( "CHAT_BOX_INPUT_PLACEHOLDER" ),
		wrapping : "Soft",
		liveChange : jQuery.proxy ( fnHandleChatBoxInputFieldLiveChange, that )
	} ).addStyleClass ( "sapSplChatBoxInput" ).addEventDelegate ( {
		onAfterRendering : function ( ) {
			setTimeout ( function ( ) {
				$ ( that.oChatBoxInputField )[0].focus ( );
			}, 1000 );
		}
	} );

	this.oListOfChatBoxes = null;
	this.sCurrentMessage = "";

	/* CSNFIX : 0120061532 0001493386 2014 */
	this.oChatBoxLayout = new sap.m.Page ( {
		customHeader : this.oChatBoxHeader.addStyleClass ( "sapSplChatBoxHeaderLayout" ),
		enableScrolling : false
	} ).addEventDelegate ( {
		onAfterShow : function ( e ) {
			/* Fix for Incident: 1580005785 */
			setTimeout ( function ( ) {
				$ ( ".sapSplChatBoxInputLayout textArea" ).css ( "height", "3.65em" );
			}, 500 );

			/* Fix for Incident : 1472021645 */
			if ( sap.ui.Device.browser.name === "ff" ) {
				that.oChatBoxInputField.rerender ( );
			}
			/* Fix for Incident : 0120025231 0001159714 2014 */
			var listItems = e.to.getContent ( )[0].getContent ( )[0].getItems ( );
			if ( listItems.length > 0 ) {
				prepareMap ( e.to.getContent ( )[0].getContent ( )[0] );
				that.bMessageAdded = false;
				if ( listItems[listItems.length - that.focusPoint] ) {
					listItems[listItems.length - that.focusPoint].focus ( );
				}
			}
			that.bAfterShow = true;
		}
	} ).addContent ( new sap.m.Page ( {
		showHeader : false
	} ).addStyleClass ( "sapSplChatBoxInnerPage" ).addEventDelegate ( {
		onAfterRendering : function ( e ) {
			/* Fix for Incident: 1580005785 */
			setTimeout ( function ( ) {
				$ ( ".sapSplChatBoxInputLayout textArea" ).css ( "height", "3.65em" );
			}, 500 );

			/*
			 * Fix for Incident : 0120025231
			 * 0001159714 2014
			 */
			$ ( "#" + e.srcControl.sId + " section" ).scroll ( function ( ) {
				var st = $ ( this ).scrollTop ( );
				/*
				 * Fix for
				 * Incident
				 * :0020079747
				 * 0000675428
				 * 2015
				 */
				if ( bMessageReceived == true && that.bMessageAdded === false ) {
					if ( bChatListRendered === true ) {

						/*
						 * Incident :
						 * 1570147229
						 */
						if ( sap.ui.Device.browser.name === "ie" && st === 0 && that.bAfterShow === true ) {
							that.bAfterShow = false;
							var aListItems = that.oChatBoxList.getItems ( );
							setTimeout ( function ( ) {
								if ( aListItems[aListItems.length - that.focusPoint] ) {
									aListItems[aListItems.length - that.focusPoint].focus ( );
								}
							}, 1000 );

						} else {
							if ( that.bMessageAdded !== undefined && that.bMessageAdded === false ) {
								that.bMessageAdded = false;
								that.focusPoint = getNearestListItemIndexBasedOnScrollPosition ( that.oMapObject, st + $ ( this ).height ( ) - 10 );
							}

							if ( st === 0 && that.bMessageAdded !== undefined && that.bMessageAdded === false ) {
								that.top = that.top + SapSplEnums.ChatBoxFetchThreshHold;
								that.oMapObject = {};
								fnFetchDataForChat ( that );
							}
						}
						bChatListRendered = false;
						bMessageReceived = false;
					}
				} else if ( bMessageReceived === false && bChatListRendered === true ) {

					/*
					 * Incident :
					 * 1570147229
					 */
					if ( sap.ui.Device.browser.name === "ie" && st === 0 && that.bAfterShow === true ) {
						that.bAfterShow = false;
						var aListItems = that.oChatBoxList.getItems ( );
						if ( aListItems[aListItems.length - that.focusPoint] ) {
							aListItems[aListItems.length - that.focusPoint].focus ( );
						}
					} else {
						if ( that.bMessageAdded !== undefined && that.bMessageAdded === false ) {
							that.bMessageAdded = false;
							that.focusPoint = getNearestListItemIndexBasedOnScrollPosition ( that.oMapObject, st + $ ( this ).height ( ) - 10 );
						}

						if ( st === 0 && that.bMessageAdded !== undefined && that.bMessageAdded === false ) {
							that.top = that.top + SapSplEnums.ChatBoxFetchThreshHold;
							that.oMapObject = {};
							fnFetchDataForChat ( that );
						}
					}
					bChatListRendered = false;
				} else if ( bMessageReceived === false && bChatListRendered === false ) {
					/*
					 * Incident :
					 * 1570147229
					 */
					if ( sap.ui.Device.browser.name === "ie" && st === 0 && that.bAfterShow === true ) {
						that.bAfterShow = false;
						var aListItems = that.oChatBoxList.getItems ( );
						if ( aListItems[aListItems.length - that.focusPoint] ) {
							aListItems[aListItems.length - that.focusPoint].focus ( );
						}
					} else {
						if ( that.bMessageAdded !== undefined && that.bMessageAdded === false ) {
							that.bMessageAdded = false;
							that.focusPoint = getNearestListItemIndexBasedOnScrollPosition ( that.oMapObject, st + $ ( this ).height ( ) - 10 );
						}

						if ( st === 0 && that.bMessageAdded !== undefined && that.bMessageAdded === false ) {
							that.top = that.top + SapSplEnums.ChatBoxFetchThreshHold;
							that.oMapObject = {};
							fnFetchDataForChat ( that );
						}
					}
				}
			} );
		}
	} ).addContent ( this.oChatBoxList.addStyleClass ( "sapSplChatBoxList" ) ) ).addStyleClass ( "sapSplChatBoxLayout" ).addContent ( new sap.ui.layout.VerticalLayout ( ).addContent ( this.oChatBoxInputField ).addContent ( new sap.m.Bar ( {
		design : "Header",
		contentRight : [new sap.m.Button ( {
			type : "Emphasized",
			text : oSapSplUtils.getBundle ( ).getText ( "SUBMIT" ),
			press : jQuery.proxy ( fnHandleClickOfPostMessageButton, this )
		} ).addStyleClass ( "sapSplChatSubmitButton" )]
	} ).addStyleClass ( "sapSplChatBoxSubmitButtonLayout" ) ).addStyleClass ( "sapSplChatBoxInputLayout" ) );

	this.oChatBoxLayout.setListOfChatBoxes = function ( oListOfChatBoxes ) {
		that.oListOfChatBoxes = oListOfChatBoxes;
	};

	this.oChatBoxLayout.closeChatBox = function ( ) {
		clearInterval ( that.oInterval );
		var aModelData = sap.ui.getCore ( ).getModel ( "sapSplChatBoxConsoleLeftListModel" ).getData ( );
		for ( var i = 0 ; i < aModelData.length ; i++ ) {
			if ( aModelData[i]["ThreadUUID"] === that.oChatBoxConfigData["ThreadUUID"] ) {
				aModelData.splice ( i, 1 );
				break;
			}
		}

		that.oChatBoxConfigData["headerLabel"].setText ( oSapSplUtils.getBundle ( ).getText ( "CHATBOX_CONSOLE_HEADER_LABEL", aModelData.length.toString ( ) ) );
		sap.ui.getCore ( ).getModel ( "sapSplChatBoxConsoleLeftListModel" ).setData ( aModelData );

		if ( aModelData.length === 1 ) {
			collapseExpandChatBoxConsole ( "Collapse" );
		} else if ( aModelData.length === 0 ) {
			$ ( ".sapSplChatBoxConsoleParent" ).hide ( "slow" );
			$ ( ".sapSplChatBoxConsoleParentClosed" ).hide ( "slow" );
		}
	};

	this.oChatBoxLayout.startPolling = function ( ) {
		startPollingOfChatBox ( that );
	};

	this.oChatBoxLayout.setListItemInstance = function ( oInstance ) {
		that.oChatBoxConsoleLeftListItemInstance = oInstance;
	};

	this.oChatBoxLayout.getListItemInstance = function ( ) {
		if ( that.oChatBoxConsoleLeftListItemInstance ) {
			return that.oChatBoxConsoleLeftListItemInstance;
		} else {
			return null;
		}
	};

	this.oChatBoxLayout.stopPolling = function ( ) {
		clearInterval ( that.oInterval );
	};

	this.oChatBoxLayout.rerenderTextAreaInstance = function ( ) {
		$ ( that.oChatBoxInputField )[0].focus ( );
	};

	/* CSNFIX: 0020079747 0000182039 2015 */
	this.oChatBoxLayout.focusOnLastItem = function ( ) {
		that.focusPoint = 1;
		var aListItems = that.oChatBoxList.getItems ( );
		if ( aListItems[aListItems.length - that.focusPoint] ) {
			aListItems[aListItems.length - that.focusPoint].focus ( );
		}
	};

	startPollingOfChatBox ( this );

	this.oChatBoxConfigData["chatBoxConsoleApp"].addPage ( this.oChatBoxLayout );

	var aModelData = sap.ui.getCore ( ).getModel ( "sapSplChatBoxConsoleLeftListModel" ).getData ( );
	aModelData.push ( oChatBoxConfigData );
	sap.ui.getCore ( ).getModel ( "sapSplChatBoxConsoleLeftListModel" ).setData ( aModelData );

	if ( $ ( ".sapSplChatBoxConsoleParentClosed" ).css ( "display" ) === "none" || $ ( ".sapSplChatBoxConsoleParent" ).css ( "display" ) === "none" ) {
		$ ( ".sapSplChatBoxConsoleParent" ).show ( "slow" );
		$ ( ".sapSplChatBoxConsoleParentClosed" ).show ( "slow" );
		$ ( "#chatBoxConsoleContainerDiv" ).css ( "right", "40.5em" );
	}

	if ( aModelData.length > 1 ) {
		collapseExpandChatBoxConsole ( "Expand" );
	}

	/* Fix for incident : 1580121819 */
	if ( this.oChatBoxConfigData["canReplyToChat"] && this.oChatBoxConfigData["canReplyToChat"] === "0" ) {
		this.oChatBoxInputField.getParent ( ).setEnabled ( false );
		this.oChatBoxInputField.setPlaceholder ( oSapSplUtils.getBundle ( ).getText ( "SEND_MESSAGE_DISABLED_PLACEHOLDER_TOOLTIP" ) );
		this.oChatBoxInputField.getParent ( ).getContent ( )[1].getContentRight ( )[0].setTooltip ( oSapSplUtils.getBundle ( ).getText ( "SEND_MESSAGE_DISABLED_PLACEHOLDER_TOOLTIP" ) );
	}

	this.oChatBoxConfigData["headerLabel"].setText ( oSapSplUtils.getBundle ( ).getText ( "CHATBOX_CONSOLE_HEADER_LABEL", aModelData.length ) );

	return this.oChatBoxLayout;
};

splReusable.libs.SapSplChatBoxControl.prototype.refreshLiveFeedModel = function ( ) {

};
