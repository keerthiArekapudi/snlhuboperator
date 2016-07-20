/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.controller ( "splController.adminConsole.MaintenanceNotifierDetailAddNotification", {
	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 */
	onInit : function ( ) {

		var oSapSplMaintenanceNotifierAddNotificationModel = null;

		oSapSplMaintenanceNotifierAddNotificationModel = new sap.ui.model.json.JSONModel ( {} );

		sap.ui.getCore ( ).setModel ( oSapSplMaintenanceNotifierAddNotificationModel, "SapSplMaintenanceNotifierAddNotificationModel" );

		this.getView ( ).setModel ( sap.ui.getCore ( ).getModel ( "SapSplMaintenanceNotifierAddNotificationModel" ) );

		this.getEnumerations ( );

		/*Localization*/
		this.fnDefineControlLabelsFromLocalizationBundle ( );
	},

	fnDefineControlLabelsFromLocalizationBundle : function ( ) {

		this.byId ( "AddNotificationFormTitle_Content" ).setText ( oSapSplUtils.getBundle ( ).getText ( "CONTENT" ) );

		this.byId ( "AddNotificationFormTitle_Validity" ).setText ( oSapSplUtils.getBundle ( ).getText ( "VALIDITY" ) );

		this.byId ( "SapSplAddNotificationMessageLabel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "MESSAGE" ) );

		this.byId ( "SapSplAddNotificationTypeLabel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "TYPE" ) );

		this.byId ( "SapSplAddNotificationStartTimeLabel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "STARTS" ) );

		this.byId ( "SapSplAddNotificationExpiryTimeLabel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "EXPIRES" ) );

		this.byId ( "sapSplAddNotificationSave" ).setText ( oSapSplUtils.getBundle ( ).getText ( "NEW_CONTACT_SAVE" ) );

		this.byId ( "sapSplAddNotificationCancel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "CANCEL" ) );
	},

	fnHandlePressOfAddNotificationCancel : function ( ) {
		var that = this;
		var oModelData = $.extend ( true, {}, sap.ui.getCore ( ).getModel ( "SapSplMaintenanceNotifierDetailModel" ).getData ( ) );
		var viewData = {
			context : oModelData
		};
		if ( oSapSplUtils.getIsDirty ( ) ) {
			sap.m.MessageBox.show ( oSapSplUtils.getBundle ( ).getText ( "DATA_LOSS_WARNING_TEXT" ), sap.m.MessageBox.Icon.WARNING, oSapSplUtils.getBundle ( ).getText ( "WARNING" ), [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
					function ( selection ) {
						if ( selection === "YES" ) {
							var viewData = {
								context : oModelData
							};
							that.getView ( ).getParent ( ).to ( "MaintenanceNotifierDetail", "", viewData );
							that.selectMasterListItemOnBackNavigation ( "SapSplMaintenanceNotifierDetailModel" );
							oSapSplUtils.setIsDirty ( false );
						}
					}, null, oSapSplUtils.fnSyncStyleClass ( "messageBox" ) );
		} else {
			this.getView ( ).getParent ( ).to ( "MaintenanceNotifierDetail", "", viewData );
			this.selectMasterListItemOnBackNavigation ( "SapSplMaintenanceNotifierDetailModel" );
			this.getView ( ).getParent ( ).getParent ( ).getCurrentMasterPage ( ).byId ( "sapSplMaintenanceNotifierMasterSearch" ).focus ( );
		}

	},

	/**
	 * @description selects master list item on back navigation
	 * @params {object} modelname
	 * @returns void
	 * @since 1.0
	 * */
	selectMasterListItemOnBackNavigation : function ( modelName ) {
		var sIndex, currentNotification, masterList;
		currentNotification = sap.ui.getCore ( ).getModel ( modelName ).getData ( );
		masterList = this.getView ( ).getParent ( ).getParent ( ).getCurrentMasterPage ( ).byId ( "SapSplMaintenanceNotifierList" );
		for ( sIndex = 0 ; sIndex < masterList.getItems ( ).length ; sIndex++ ) {
			if ( masterList.getItems ( )[sIndex].sId.indexOf ( "oSapSplNotificationListItem" ) !== -1 ) {
				if ( masterList.getItems ( )[sIndex].getBindingContext ( ).getProperty ( ).MessageUUID === currentNotification.MessageUUID ) {
					masterList.setSelectedItem ( masterList.getItems ( )[sIndex] );
					break;
				}
			}
		}
	},

	fnHandlePressOfAddNotificationSave : function ( ) {

		if ( this.compareDates ( ) ) {
			var oPayLoad = this.preparePayload ( ), that = this;

			oSapSplBusyDialog.getBusyDialogInstance ( {
				title : oSapSplUtils.getBundle ( ).getText ( "BUSY_DIALOG_MESSAGE" )
			} ).open ( );
			window.setTimeout ( function ( ) {
				oSapSplAjaxFactory.fireAjaxCall ( {
					url : oSapSplUtils.getServiceMetadata ( "message", true ),
					method : "PUT",
					async : false,
					data : JSON.stringify ( oPayLoad ),
					success : function ( data, success, messageObject ) {
						oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
						if ( data.constructor === String ) {
							data = JSON.parse ( data );
						}

						if ( messageObject["status"] === 200 && data["Error"].length === 0 ) {

							var model = sap.ui.getCore ( ).getModel ( "SapSplMaintenanceNotifierAddNotificationModel" ).getData ( );
							if ( model.Type === "new" ) {
								sap.ca.ui.message.showMessageToast ( oSapSplUtils.getBundle ( ).getText ( "NOTIFICATION_CREATED_SUCCESSFULLY" ) );
							} else {
								sap.ca.ui.message.showMessageToast ( oSapSplUtils.getBundle ( ).getText ( "NOTIFICATION_EDITED_SUCCESSFULLY" ) );
							}

							that.getView ( ).getParent ( ).getParent ( ).getCurrentMasterPage ( ).byId ( "SapSplMaintenanceNotifierList" ).addCustomData ( new sap.ui.core.CustomData ( {
								key : data.Header[0]["UUID"]
							} ) );

							sap.ui.getCore ( ).getModel ( "UserNotificationListODataModel" ).refresh ( );
							oSapSplUtils.setIsDirty ( false );
						}
					},
					error : function ( error ) {
						jQuery.sap.log.error ( "fnHandlePressOfAddNotificationSave", "ajax failed", "MaintenanceNotifierDetailAddNotification.controller.js" );
						oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );

						if ( error && error["status"] === 500 ) {
							sap.ca.ui.message.showMessageBox ( {
								type : sap.ca.ui.message.Type.ERROR,
								message : error["status"] + " " + error.statusText,
								details : error.responseText
							} );
						} else {
							if ( error.responseText.constructor === String ) {
								error.responseText = JSON.parse ( error.responseText );
							}
							var data = error.responseText;
							sap.ca.ui.message.showMessageBox ( {
								type : oSapSplUtils.getErrorMessagesfromErrorPayload ( data )["messageTitle"],
								message : oSapSplUtils.getErrorMessagesfromErrorPayload ( data )["errorWarningString"],
								details : oSapSplUtils.getErrorMessagesfromErrorPayload ( data )["ufErrorObject"]
							} );

						}
					},
					complete : function ( ) {

					}
				} );
			}, 20 );
		}
	},

	preparePayload : function ( ) {
		var oModelData = sap.ui.getCore ( ).getModel ( "SapSplMaintenanceNotifierAddNotificationModel" ).getData ( );

		var sUUID = oSapSplUtils.getUUID ( ), tUUID = oSapSplUtils.getUUID ( );

		var oHeaderObject = {}, oTextObject = {};

		if ( oModelData.Type === "new" ) {
			oHeaderObject["UUID"] = sUUID;
			oHeaderObject["Priority"] = "1";
			oHeaderObject["OwnerID"] = oSapSplUtils.getCompanyDetails ( )["BasicInfo_CompanyID"];
			oHeaderObject["SenderID"] = oSapSplUtils.getCompanyDetails ( )["BasicInfo_CompanyID"];
			oHeaderObject["ThreadUUID"] = tUUID;
			oTextObject["UUID"] = sUUID;
		} else {
			oHeaderObject["UUID"] = oModelData.MessageUUID;
			oHeaderObject["Priority"] = oModelData.Priority;
			oHeaderObject["OwnerID"] = oModelData.OwnerID;
			oHeaderObject["SenderID"] = oModelData.SenderID;
			oHeaderObject["ThreadUUID"] = oModelData.ThreadUUID;
			oTextObject["UUID"] = oModelData.MessageUUID;
		}
		oHeaderObject["TemplateUUID"] = "";

		oModelData["Validity_StartTime"].setHours ( oModelData["Validity_StartTime1"].getHours ( ) );
		oModelData["Validity_StartTime"].setMinutes ( oModelData["Validity_StartTime1"].getMinutes ( ) );
		oModelData["Validity_StartTime"].setSeconds ( 0 );
		oModelData["Validity_EndTime"].setHours ( oModelData["Validity_EndTime1"].getHours ( ) );
		oModelData["Validity_EndTime"].setMinutes ( oModelData["Validity_EndTime1"].getMinutes ( ) );
		oModelData["Validity_EndTime"].setSeconds ( 0 );
		oHeaderObject["Validity.StartTime"] = oModelData["Validity_StartTime"];
		oHeaderObject["Validity.EndTime"] = oModelData["Validity_EndTime"];
		oHeaderObject["AuditTrail.CreatedBy"] = null;
		oHeaderObject["AuditTrail.ChangedBy"] = null;
		oHeaderObject["AuditTrail.CreationTime"] = null;
		oHeaderObject["AuditTrail.ChangeTime"] = null;

		oHeaderObject["Type"] = this.byId ( "sapSplAddNotificationType" ).getSelectedItem ( ).getBindingContext ( ).getProperty ( )["Value"];
		oHeaderObject["isNotification"] = "1";

		oTextObject["ShortText"] = oModelData["Text1"];
		oTextObject["LongText"] = oModelData["Text1"];

		return {
			Header : [oHeaderObject],
			Recipient : [],
			Text : [oTextObject],
			Object : "MessageOccurrence"
		};
	},

	onBeforeShow : function ( oEvent ) {

		var oModelData = $.extend ( true, {}, sap.ui.getCore ( ).getModel ( "SapSplMaintenanceNotifierAddNotificationModel" ).getData ( ) );
		var oEnum = oModelData["enum"];

		if ( oEvent.data.context && oEvent.data.context.type === "new" ) {
			oModelData = {};
			oModelData["enum"] = oEnum;
			this.byId ( "sapSplMaintenanceNotifierDetailAddNotificationPage" ).setTitle ( oSapSplUtils.getBundle ( ).getText ( "NEW_NOTIFICATION" ) );
			oModelData.Validity_StartTime = new Date ( );
			oModelData.Validity_EndTime = new Date ( );
			oModelData.Validity_StartTime1 = new Date ( );
			oModelData.Validity_EndTime1 = new Date ( );
			oModelData.Text1 = "";
			oModelData.Type = "new";
			oModelData.MessageType = "Select";
			sap.ui.getCore ( ).getModel ( "SapSplMaintenanceNotifierAddNotificationModel" ).setData ( oModelData );
		} else {
			this.byId ( "sapSplMaintenanceNotifierDetailAddNotificationPage" ).setTitle ( oSapSplUtils.getBundle ( ).getText ( "EDIT_NOTIFICATION" ) );
			oEvent.data.context["enum"] = oModelData["enum"];
			oModelData = oEvent.data.context;
			oModelData.Type = "edit";
			oModelData.Validity_StartTime1 = oModelData.Validity_StartTime;
			oModelData.Validity_EndTime1 = oModelData.Validity_EndTime;

			sap.ui.getCore ( ).getModel ( "SapSplMaintenanceNotifierAddNotificationModel" ).setData ( oModelData );
		}
	},

	/*        CSNFIX : 1570016512*/
	fnHandleChangeOfStartTime : function ( ) {
		this.compareDates ( );
		this.fnToCaptureLiveChangeToSetFlag ( );
	},

	/*        CSNFIX : 1570016512*/
	fnHandleChangeOfExpiryTime : function ( ) {
		this.compareDates ( );
		this.fnToCaptureLiveChangeToSetFlag ( );
	},

	fnHandleChangeOfStartDate : function ( ) {
		this.compareDates ( );
		this.fnToCaptureLiveChangeToSetFlag ( );
	},

	fnHandleChangeOfExpiryDate : function ( ) {
		this.compareDates ( );
		this.fnToCaptureLiveChangeToSetFlag ( );
	},

	compareDates : function ( ) {
		/*        CSNFIX : 1570016512*/
		var oModelData = sap.ui.getCore ( ).getModel ( "SapSplMaintenanceNotifierAddNotificationModel" ).getData ( );
		var oEndDate = new Date ( oModelData.Validity_EndTime );
		var oStartDate = new Date ( oModelData.Validity_StartTime );
		var oEndDate1 = new Date ( oModelData.Validity_EndTime1 );
		var oStartDate1 = new Date ( oModelData.Validity_StartTime1 );

		if ( oEndDate.toLocaleDateString ( ) === oStartDate.toLocaleDateString ( ) ) {
			this.byId ( "SapSplAddNotificationStartTime" ).setValueState ( "None" );
			this.byId ( "SapSplAddNotificationExpiryTime" ).setValueState ( "None" );
			if ( oEndDate1.getHours ( ) > oStartDate1.getHours ( ) ) {
				this.byId ( "SapSplAddNotificationStartTimeValue" ).setValueState ( "None" );
				this.byId ( "SapSplAddNotificationExpiryTimeValue" ).setValueState ( "None" );
				this.byId ( "SapSplAddNotificationStartTime" ).setValueState ( "None" );
				this.byId ( "SapSplAddNotificationExpiryTime" ).setValueState ( "None" );
				return true;
			} else {
				if ( oEndDate1.getHours ( ) === oStartDate1.getHours ( ) ) {
					if ( oEndDate1.getMinutes ( ) > oStartDate1.getMinutes ( ) ) {
						this.byId ( "SapSplAddNotificationStartTimeValue" ).setValueState ( "None" );
						this.byId ( "SapSplAddNotificationExpiryTimeValue" ).setValueState ( "None" );
						return true;
					} else {
						this.byId ( "SapSplAddNotificationStartTimeValue" ).setValueState ( "Error" );
						this.byId ( "SapSplAddNotificationExpiryTimeValue" ).setValueState ( "Error" );
						return false;
					}
				}
				this.byId ( "SapSplAddNotificationStartTimeValue" ).setValueState ( "Error" );
				this.byId ( "SapSplAddNotificationExpiryTimeValue" ).setValueState ( "Error" );
				return false;
			}
		} else {
			if ( oEndDate.getTime ( ) > oStartDate.getTime ( ) ) {
				this.byId ( "SapSplAddNotificationStartTime" ).setValueState ( "None" );
				this.byId ( "SapSplAddNotificationExpiryTime" ).setValueState ( "None" );
				this.byId ( "SapSplAddNotificationStartTimeValue" ).setValueState ( "None" );
				this.byId ( "SapSplAddNotificationExpiryTimeValue" ).setValueState ( "None" );
				return true;
			} else {
				this.byId ( "SapSplAddNotificationStartTime" ).setValueState ( "Error" );
				this.byId ( "SapSplAddNotificationExpiryTime" ).setValueState ( "Error" );
				return false;
			}
		}
	},

	/**
	 * @description Method to fetch all the enumerations required for the add Notification scenario.
	 * @param void.
	 * @returns void.
	 * @since 1.0
	 */
	getEnumerations : function ( ) {
		var that = this;
		oSapSplAjaxFactory.fireAjaxCall ( {
			url : oSapSplUtils.getFQServiceUrl ( "/sap/spl/xs/utils/services/utils.xsodata/" ) + "Enumeration('NotificationType')/Values?$format=json",
			async : true,
			json : true,
			method : "GET",
			success : jQuery.proxy ( that.updateEnumData, that ),
			failure : jQuery.proxy ( that.failureEnumData, that )
		} );
	},

	/**
	 * @description Method to append the enumeration data to the global enumerations object.
	 * @returns void
	 * @since 1.0
	 * @param data
	 * @param textStatus
	 * @param XMLHttpRequest
	 */
	updateEnumData : function ( data ) {
		var resultSet = [], oSelect = {}, oModelData = sap.ui.getCore ( ).getModel ( "SapSplMaintenanceNotifierAddNotificationModel" ).getData ( );
		if ( data.d.results ) {
			resultSet = data.d.results;
		}

		if ( resultSet.length > 0 ) {
			oSelect["Value"] = "Select";
			oSelect["Value.description"] = oSapSplUtils.getBundle ( ).getText ( "PLEASE_SELECT_PLACEHOLDER" );

			resultSet.unshift ( oSelect );

			oModelData["enum"] = resultSet;
			sap.ui.getCore ( ).getModel ( "SapSplMaintenanceNotifierAddNotificationModel" ).setData ( oModelData );
		}
	},

	failureEnumData : function ( ) {

	},

	fnToHandleSelectNotificationType : function ( oEvent ) {
		oEvent.getSource ( ).setSelectedKey ( oEvent.getSource ( ).getSelectedKey ( ) );
		this.fnToCaptureLiveChangeToSetFlag ( );
	},

	/**
	 * @description Method to capture the dirty state of the new truck screen.
	 * @param void.
	 * @returns void.
	 * @since 1.0
	 */
	fnToCaptureLiveChangeToSetFlag : function ( ) {
		var oModelData = sap.ui.getCore ( ).getModel ( "SapSplMaintenanceNotifierAddNotificationModel" ).getData ( );
		if ( !oSapSplUtils.getIsDirty ( ) ) {
			oSapSplUtils.setIsDirty ( true );
		}
		if ( this.byId ( "SapSplAddNotificationExpiryTime" ).getValueState ( ) === "Error" ) {
			this.byId ( "sapSplAddNotificationSave" ).setEnabled ( false );
		} else {
			this.byId ( "sapSplAddNotificationSave" ).setEnabled ( splReusable.libs.SapSplModelFormatters.getNotificationSaveButtonEnabled ( oModelData ) );
		}

	}

} );