/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.require ( "sap.m.MessageBox" );
sap.ui.controller ( "splController.vehicles.MyVehiclesDetailAddVehicle", {
	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created. Can be used to modify the View before it is
	 * displayed, to bind event handlers and do other one-time initialization.
	 */
	onInit : function ( ) {
		var oSapSplMyVehiclesAddVehicleModel = null;

		oSapSplMyVehiclesAddVehicleModel = new sap.ui.model.json.JSONModel ( {} );

		sap.ui.getCore ( ).setModel ( oSapSplMyVehiclesAddVehicleModel, "myVehiclesAddVehicleModel" );

		this.getView ( ).setModel ( sap.ui.getCore ( ).getModel ( "myVehiclesAddVehicleModel" ) );

		this.getEnumerations ( );

		// this.byId("sapSplNewVehiclesDeviceID").attachChange(jQuery.proxy(this.handleSelectOfDeviceID,this));

		this.byId ( "sapSplNewVehiclesDeviceType" ).attachChange ( jQuery.proxy ( this.handleSelectOfDeviceType, this ) );

		/* Localization */
		this.fnDefineControlLabelsFromLocalizationBundle ( );

		this.oShareInfo = {};

		this.getView ( ).addEventDelegate ( {
			onAfterShow : function ( ) {
				oSapSplUtils.setIsDirty ( false );
			}
		} );
	},

	handleSelectOfSugesstedItem : function ( oEvent ) {
		var oModelData = sap.ui.getCore ( ).getModel ( "myVehiclesAddVehicleModel" ).getData ( );
		var oModelDataHeader = oModelData["data"];
		if ( oModelDataHeader["DeviceUUID"] !== oEvent.getParameter ( "selectedItem" ).getBindingContext ( ).getObject ( )["UUID"] ) {
			oModelDataHeader["DeviceUUID"] = oEvent.getParameter ( "selectedItem" ).getBindingContext ( ).getObject ( )["UUID"];
			oModelData["data"] = oModelDataHeader;
			this.bDeviceAssignmentChanged = true;
			sap.ui.getCore ( ).getModel ( "myVehiclesAddVehicleModel" ).setData ( oModelData );
		}
	},

	/**
	 * @description Method to handle the change event of the DeviceType , to make all the device details as none.
	 * @Param {object} oEvent event object
	 * @returns void.
	 * @since 1.0
	 */
	handleSelectOfDeviceType : function ( oEvent ) {

		this.fnToCaptureLiveChangeToSetFlag ( );

		this.byId ( "sapSplNewVehicleMobileDeviceID" ).setValue ( "" );
		var oDeviceIDSelect = null, selectedItem = null;
		selectedItem = oEvent.getParameters ( ).selectedItem;
		this.sSelectedDeviceType = selectedItem.getKey ( );
		oDeviceIDSelect = this.byId ( "sapSplNewVehiclesDeviceID" );
		if ( selectedItem.getKey ( ) !== "None" ) {
			this.sSelectedDeviceType = selectedItem.getKey ( );
		}
		if ( this.sSelectedDeviceType === "Select" ) {
			oDeviceIDSelect.setVisible ( false );
			this.byId ( "SapSplVehicleDeviceID" ).setVisible ( false );
			this.byId ( "sapSplNewVehicleMobileDeviceID" ).setVisible ( false );
		}
		if ( selectedItem.getKey ( ) !== "None" && selectedItem.getKey ( ) !== "MOBILEIF" && this.sSelectedDeviceType !== "Select" ) {
			this.byId ( "SapSplVehicleDeviceID" ).setVisible ( true );
			this.byId ( "SapSplVehicleDeviceID" ).setText ( oSapSplUtils.getBundle ( ).getText ( "DEVICE_ID" ) );
			oDeviceIDSelect.setVisible ( true );
			this.byId ( "sapSplNewVehicleMobileDeviceID" ).setVisible ( false );
		} else if ( selectedItem.getKey ( ) === "None" ) {
			oDeviceIDSelect.setVisible ( false );
			this.byId ( "SapSplVehicleDeviceID" ).setVisible ( false );
			this.byId ( "sapSplNewVehicleMobileDeviceID" ).setVisible ( false );
			oDeviceIDSelect.setVisible ( false );
		} else if ( selectedItem.getKey ( ) === "MOBILEIF" ) {
			this.byId ( "SapSplVehicleDeviceID" ).setVisible ( true );
			oDeviceIDSelect.setVisible ( false );
			this.byId ( "sapSplNewVehicleMobileDeviceID" ).setVisible ( true );
			this.byId ( "SapSplVehicleDeviceID" ).setText ( oSapSplUtils.getBundle ( ).getText ( "IMEI_NUMBER" ) );
			this.byId ( "sapSplNewVehiclesDeviceType" ).setSelectedKey ( selectedItem.getKey ( ) );
			var sDevicePublicName = sap.ui.getCore ( ).getModel ( "SapSplMyVehicleDetailModel" ).getData ( )["DevicePublicName"];
			if ( sDevicePublicName && sDevicePublicName !== "Select Device" && this.mode === "Edit" ) {
				this.byId ( "sapSplNewVehicleMobileDeviceID" ).setValue ( sDevicePublicName );
			} else {
				this.byId ( "sapSplNewVehicleMobileDeviceID" ).setValue ( "" );
			}
			this.fnGetDevicesFromTSystems ( "MOBILE" );
		}
	},

	/**
	 * @description Method to handle the change event of the DeviceID , to auto select the telematicID.
	 * @Param {object} oEvent event object
	 * @returns void.
	 * @since 1.0
	 */
	handleSelectOfDeviceID : function ( ) {

	},

	/**
	 * @description Method to capture the dirty state of the new truck screen.
	 * @param void.
	 * @returns void.
	 * @since 1.0
	 */
	fnToCaptureLiveChangeToSetFlag : function ( ) {

		if ( !oSapSplUtils.getIsDirty ( ) ) {
			oSapSplUtils.setIsDirty ( true );
		}
	},

	/**
	 * @description Method to handle click of select device id list, in the device list dialog.
	 * @param {object} oEvent event object.
	 * @returns void.
	 * @since 1.0
	 */
	fnhandleClickOfSelectDeviceID : function ( oEvent ) {

		var oModelData = sap.ui.getCore ( ).getModel ( "myVehiclesAddVehicleModel" ).getData ( );

		if ( oModelData["data"]["DevicePublicName"] !== oEvent.getParameters ( ).listItem.getBindingContext ( ).getProperty ( "denotation" ) ) {
			this.bDeviceAssignmentChanged = true;
		}

		this.fnToCaptureLiveChangeToSetFlag ( );
		oEvent.getSource ( ).getParent ( ).close ( );
		oModelData["data"]["DevicePublicName"] = oEvent.getParameters ( ).listItem.getBindingContext ( ).getProperty ( "denotation" );
		oModelData["data"]["DeviceUniqueID"] = oEvent.getParameters ( ).listItem.getBindingContext ( ).getProperty ( "deviceId" );
		oModelData["data"]["DeviceUUID"] = oEvent.getParameters ( ).listItem.getBindingContext ( ).getProperty ( "DeviceUUID" );
		oEvent.getSource ( ).removeSelections ( );
		sap.ui.getCore ( ).getModel ( "myVehiclesAddVehicleModel" ).setData ( oModelData );
	},

	/**
	 * @description Method to instantiate a dialog, to hold the list of devices for assignment to a truck.
	 * @param {object} oEvent event object.
	 * @returns {object} sap.m.Dialog instance.
	 * @since 1.0
	 */
	fnGetSelectDevicesDialog : function ( ) {
		var that = this;
		return new sap.m.Dialog ( {
			title : oSapSplUtils.getBundle ( ).getText ( "SELECT_DEVICE_PLACEHOLDER" ),
			content : [new sap.m.List ( {
				mode : "SingleSelectMaster",
				select : jQuery.proxy ( that.fnhandleClickOfSelectDeviceID, that ),
				noDataText : oSapSplUtils.getBundle ( ).getText ( "NO_DATA_FOUND_TEXT" ),
				items : {
					path : "/mobileDevices",
					template : new sap.m.StandardListItem ( {
						title : "{denotation}",
						description : "{deviceId}"
					} )
				}
			} )],
			leftButton : new sap.m.Button ( {
				text : "Cancel",
				press : function ( oEvent ) {
					oEvent.getSource ( ).getParent ( ).close ( );
				}
			} )
		} ).attachAfterOpen ( function ( oEvent ) {
			oSapSplUtils.fnSyncStyleClass ( oEvent.getSource ( ) );
		} ).setModel ( sap.ui.getCore ( ).getModel ( "myVehiclesAddVehicleModel" ) );
	},

	/**
	 * @description Method to fetch device list from TSystems, based on the UUID and device type. on success, this would set the new data on the
	 *              existing model to update the list of devices.
	 * @param {string} sMode - if "MOBILE", will fetch mobile device list.
	 * @returns void.
	 * @since 1.0
	 */
	fnGetDevicesFromTSystems : function ( sMode ) {
		var that = this, sUrl = "", oAjaxObj = {};
		this.sModeTSystems = sMode;
		var oPayLoadForPost = {
			UUID : oSapSplUtils.getCompanyDetails ( )["BasicInfo_CompanyID"],
			accountID : this.sSelectedDeviceType
		};
		if ( this.sSelectedDeviceType !== "Select" ) {
			sUrl = oSapSplUtils.getServiceMetadata ( "deviceList", true );
			oAjaxObj = {
				url : sUrl,
				method : "POST",
				data : JSON.stringify ( oPayLoadForPost ),
				success : jQuery.proxy ( that.successForTSysDevices, that ),
				error : jQuery.proxy ( that.errorForTSysDevices, that ),
				complete : jQuery.proxy ( that.completeForTSysDevices, that )
			};

			oSapSplAjaxFactory.fireAjaxCall ( oAjaxObj );
		}
	},

	successForTSysDevices : function ( data ) {
		if ( !this.oSelectDevicesFromTSystemsDialog && this.sModeTSystems.constructor !== String ) {
			this.oSelectDevicesFromTSystemsDialog = this.fnGetSelectDevicesDialog ( );
		}
		var oModelData = sap.ui.getCore ( ).getModel ( "myVehiclesAddVehicleModel" ).getData ( );
		oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );
		/* CSNFIX : 0120061532 1484624 2014 */
		if ( this.sModeTSystems.constructor !== String ) {
			/*
			 * that.oSelectDevicesFromTSystemsDialog.open();
			 * that.oSelectDevicesFromTSystemsDialog.getContent()[0].setBusy(true);
			 */
			this.oSelectDevicesFromTSystemsDialog.open ( );
			this.oSelectDevicesFromTSystemsDialog.getContent ( )[0].setBusy ( true );
		}
		if ( data.constructor === String ) {
			data = JSON.parse ( data );
		}
		if ( this.sModeTSystems.constructor !== String ) {
			oModelData["mobileDevices"] = data;
			sap.ui.getCore ( ).getModel ( "myVehiclesAddVehicleModel" ).setData ( oModelData );
		} else {
			oModelData["mobileDeviceNames"] = data;
			sap.ui.getCore ( ).getModel ( "myVehiclesAddVehicleModel" ).setData ( oModelData );
		}
	},

	errorForTSysDevices : function ( error ) {
		jQuery.sap.log.error ( "fnGetDevicesFromTSystems", "ajax failed", "MyVehiclesDetailAddVehicle.controller.js" );
		oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );

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

	completeForTSysDevices : function ( ) {
		if ( this.oSelectDevicesFromTSystemsDialog ) {
			this.oSelectDevicesFromTSystemsDialog.getContent ( )[0].setBusy ( false );
		}
	},

	/**
	 * @description Method to fetch all the enumerations required for the add truck scenario.
	 * @param void.
	 * @returns void.
	 * @since 1.0
	 */
	getEnumerations : function ( ) {
		var oModelData = null, aEnumUrls = [], sEnumUrl = "", that = this, ajaxObject = {};
		this.oEnumerationData = {};

		oModelData = sap.ui.getCore ( ).getModel ( "myVehiclesAddVehicleModel" ).getData ( );
		aEnumUrls = ["Enumeration('DeviceType')/Values?$format=json", "Enumeration('VehicleType')/Values?$format=json", "Enumeration('statusValue')/Values?$format=json"];
		for ( var i = 0 ; i < aEnumUrls.length ; i++ ) {
			sEnumUrl = oSapSplUtils.getFQServiceUrl ( "/sap/spl/xs/utils/services/utils.xsodata/" ) + aEnumUrls[i];
			ajaxObject = {
				url : sEnumUrl,
				success : jQuery.proxy ( that.updateEnumData, that ),
				method : "GET"
			};
			oSapSplAjaxFactory.fireAjaxCall ( ajaxObject );
		}

		oModelData["enum"] = this.oEnumerationData;
		sap.ui.getCore ( ).getModel ( "myVehiclesAddVehicleModel" ).setData ( oModelData );

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

		var resultSet = [];
		if ( data.d.results ) {
			resultSet = data.d.results;
		}

		if ( resultSet.length > 0 ) {
			this.oEnumerationData[resultSet[0].Name] = resultSet;
		}
	},

	/**
	 * @description Method to handle localization of all the hard code texts in the view.
	 * @param void.
	 * @returns void.
	 * @since 1.0
	 */
	fnDefineControlLabelsFromLocalizationBundle : function ( ) {

		this.byId ( "SapSPlAddVehicleSimpleForm" ).setTitle ( oSapSplUtils.getBundle ( ).getText ( "ADD_TRUCK_TITLE" ) );
		this.byId ( "SapSplVehicleRegistrationNumberLabel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "VEHICLE_REGISTRATION_NUMBER" ) );
		this.byId ( "SapSplVehicleVehicleTypeLabel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "VEHICLE_TYPE" ) );
		this.byId ( "SapSplVehiclePublicName" ).setText ( oSapSplUtils.getBundle ( ).getText ( "VEHICLE_PUBLIC_NAME" ) );
		this.byId ( "SapSplVehicleDeviceType" ).setText ( oSapSplUtils.getBundle ( ).getText ( "DEVICE_TYPE" ) );
		this.byId ( "SapSplVehicleDeviceID" ).setText ( oSapSplUtils.getBundle ( ).getText ( "DEVICE_ID" ) );
		this.byId ( "MyVehiclesFormTitle_Truck" ).setText ( oSapSplUtils.getBundle ( ).getText ( "TRUCK_DETAILS_TITLE" ) );
		this.byId ( "MyVehiclesFormTitle_Device" ).setText ( oSapSplUtils.getBundle ( ).getText ( "DEVICE_DETAILS_TITLE" ) );
		this.byId ( "NewContactRegistrationDetailPage" ).setTitle ( oSapSplUtils.getBundle ( ).getText ( "ADD_VEHICLE_TITLE" ) );
		this.byId ( "addVehicleSave" ).setText ( oSapSplUtils.getBundle ( ).getText ( "NEW_CONTACT_SAVE" ) );
		this.byId ( "addVehicleCancel" ).setText ( oSapSplUtils.getBundle ( ).getText ( "MY_COLLEAGUES_CANCEL_BUTTON" ) );
		this.byId ( "SapSplVehicleDriver" ).setText ( oSapSplUtils.getBundle ( ).getText ( "DRIVER_NAME" ) );

	},

	/**
	 * @description listens to event handling channel which is previously subscribed. This is the default call back when any navigation happens to
	 *              this view. It is called even before the onBeforeRendering life cycle method of the view.
	 * @param evt event object of the navigation event.
	 * @returns void.
	 * @since 1.0
	 */
	onBeforeShow : function ( evt ) {
		var mode = null, oContext = null, oDeviceIDSelect = null;
		oDeviceIDSelect = this.byId ( "sapSplNewVehiclesDeviceID" );
		this.byId ( "SapSplVehicleDeviceID" ).setVisible ( false );
		this.byId ( "sapSplNewVehiclesDeviceID" ).setVisible ( false );
		// this.byId("sapSplNewVehiclesDeviceType").setSelectedKey("None");
		this.byId ( "sapSplNewVehicleMobileDeviceID" ).setVisible ( false );
		mode = evt.data.mode;
		oContext = evt.data.context;
		this.mode = mode;

		if ( oContext ) {

			if ( mode && mode === "Edit" ) {
				this.byId ( "SapSplVehicleDeviceID" ).setVisible ( false );
				oDeviceIDSelect.setVisible ( true );

				var oDeviceTypeSelect = this.byId ( "sapSplNewVehiclesDeviceType" );
				oDeviceTypeSelect.setEnabled ( true );

				this.byId ( "NewContactRegistrationDetailPage" ).setTitle ( oSapSplUtils.getBundle ( ).getText ( "MY_VEHICLE_TITLE_IN_EDIT", [oContext["RegistrationNumber"]] ) );
				this.byId ( "SapSPlAddVehicleSimpleForm" ).setTitle ( "" );

				// oDeviceTypeSelect.setSelectedKey(oContext["DeviceType"]);
				if ( oDeviceTypeSelect.getItemByKey ( oContext["DeviceType"] ) ) {
					oDeviceTypeSelect.setSelectedKey ( oContext["DeviceType"] );
					oDeviceTypeSelect.setSelectedItem ( oDeviceTypeSelect.getItemByKey ( oContext["DeviceType"] ) );
					oDeviceTypeSelect.fireChange ( {
						selectedItem : oDeviceTypeSelect.getItemByKey ( oContext["DeviceType"] )
					} );
				} else {
					this.byId ( "sapSplNewVehiclesDeviceType" ).setSelectedKey ( "None" );
					this.sSelectedDeviceType = "None";
					oDeviceIDSelect.setVisible ( false );
				}
				this.byId ( "sapSplNewVehiclesVehicleType" ).setSelectedKey ( oContext["Type"] );
				this.byId ( "SapSplNewVehiclesVehicleRegistrationNumber" ).setEditable ( true );

				if ( oContext["DriverName"] ) {
					var aNames = oContext["DriverName"].split ( ", " );
					oContext["VehicleDriverFirstName"] = aNames[0];
					oContext["VehicleDriverLastName"] = aNames[1];
				}

				this.updateEnumsWithNone ( "add" );
				this.addRemoveNoneFromTruckTypeEnum ( "remove" );
				oContext["mode"] = mode;

				var oData = sap.ui.getCore ( ).getModel ( "myVehiclesAddVehicleModel" ).getData ( );
				oSapSplUtils.setIsDirty ( false );
				oData["isCancel"] = false;
				oData["data"] = oContext;
				sap.ui.getCore ( ).getModel ( "myVehiclesAddVehicleModel" ).setData ( oData );

			} else {
				this.sSelectedDeviceType = "Select";
				oDeviceIDSelect.setVisible ( false );
				this.byId ( "SapSplVehicleDeviceID" ).setVisible ( false );
				this.byId ( "sapSplNewVehicleMobileDeviceID" ).setVisible ( false );
				this.updateEnumsWithNone ( "remove" );
				this.addRemoveNoneFromTruckTypeEnum ( "add" );
				this.byId ( "sapSplNewVehiclesVehicleType" ).setSelectedItem ( null );
				this.byId ( "sapSplNewVehiclesDeviceType" ).setSelectedItem ( null );
				this.byId ( "sapSplNewVehiclesDeviceType" ).fireChange ( {
					selectedItem : this.byId ( "sapSplNewVehiclesDeviceType" ).getItems ( )[0]
				} );
				this.byId ( "sapSplNewVehiclesDeviceType" ).setEnabled ( true );
				this.byId ( "SapSplNewVehiclesVehicleRegistrationNumber" ).setEditable ( true );
				this.byId ( "NewContactRegistrationDetailPage" ).setTitle ( oSapSplUtils.getBundle ( ).getText ( "ADD_VEHICLE_TITLE" ) );
				this.byId ( "SapSPlAddVehicleSimpleForm" ).setTitle ( oSapSplUtils.getBundle ( ).getText ( "ADD_TRUCK_TITLE" ) );

				var oData1 = sap.ui.getCore ( ).getModel ( "myVehiclesAddVehicleModel" ).getData ( );
				oSapSplUtils.setIsDirty ( false );
				oData1["isCancel"] = false;
				oData1["data"] = oContext;
				sap.ui.getCore ( ).getModel ( "myVehiclesAddVehicleModel" ).setData ( oData1 );
			}
		}
	},

	/**
	 * @description Method to add/ remove the "Please Select" placeholder option to the truck type enumeration. This is done based on the mode passed
	 *              as an parameter to this method. It will either add the new object or remove the new object.
	 * @param {string} sMode add/remove.
	 * @returns void.
	 * @since 1.0
	 */
	addRemoveNoneFromTruckTypeEnum : function ( sMode ) {
		var oModelData = null, aVehicleType = [];
		oModelData = sap.ui.getCore ( ).getModel ( "myVehiclesAddVehicleModel" ).getData ( );

		var oPlaceHolderObject = {};
		oPlaceHolderObject["Value"] = "Select";
		oPlaceHolderObject["Value.description"] = oSapSplUtils.getBundle ( ).getText ( "PLEASE_SELECT_PLACEHOLDER" );

		if ( oModelData["enum"]["VehicleType"] ) {
			aVehicleType = oModelData["enum"]["VehicleType"];
			if ( sMode === "add" ) {
				if ( aVehicleType.length > 0 && aVehicleType[0]["Value"] !== "Select" ) {
					aVehicleType.splice ( 0, 0, oPlaceHolderObject );
				}
			} else {
				if ( aVehicleType.length > 0 && aVehicleType[0]["Value"] === "Select" ) {
					aVehicleType.shift ( );
				}
			}
			oModelData["enum"]["VehicleType"] = aVehicleType;
			sap.ui.getCore ( ).getModel ( "myVehiclesAddVehicleModel" ).setData ( oModelData );
		}
	},

	/**
	 * @description Method to add/ remove the "none" option to the device type enumeration. This is done based on the mode passed as an parameter to
	 *              this method. It will either add the "none" object or remove the "none" object.
	 * @param {string} sMode add/remove.
	 * @returns void.
	 * @since 1.0
	 */
	updateEnumsWithNone : function ( sMode ) {
		var oModelData = null, aDeviceData = null, oNoneObject = null, oTempObject = null, oSelectplaceHolderObject = null;
		oModelData = sap.ui.getCore ( ).getModel ( "myVehiclesAddVehicleModel" ).getData ( );
		if ( oModelData["enum"]["DeviceType"] ) {
			aDeviceData = oModelData["enum"]["DeviceType"];
			if ( aDeviceData.constructor === Array && aDeviceData.length > 0 ) {
				if ( sMode === "add" ) {
					if ( aDeviceData[0]["Value"] !== "None" && aDeviceData[0]["Value"] !== "Select" ) {
						oNoneObject = {};
						oNoneObject["Value"] = "None";
						oNoneObject["Value.description"] = oSapSplUtils.getBundle ( ).getText ( "PLEASE_SELECT_PLACEHOLDER" );
						oTempObject = aDeviceData[0];
						aDeviceData[0] = oNoneObject;
						aDeviceData[aDeviceData.length] = oTempObject;
					}
				} else {
					if ( aDeviceData[0]["Value"] === "None" ) {
						aDeviceData[0]["Value"] = "Select";
						aDeviceData[0]["Value.description"] = oSapSplUtils.getBundle ( ).getText ( "PLEASE_SELECT_PLACEHOLDER" );
					} else {
						if ( aDeviceData[0]["Value"] !== "Select" && aDeviceData[0]["Value"] !== "None" ) {
							oSelectplaceHolderObject = {};
							oSelectplaceHolderObject["Value"] = "Select";
							oSelectplaceHolderObject["Value.description"] = oSapSplUtils.getBundle ( ).getText ( "PLEASE_SELECT_PLACEHOLDER" );
							oTempObject = aDeviceData[0];
							aDeviceData[0] = oSelectplaceHolderObject;
							aDeviceData[aDeviceData.length] = oTempObject;
						}
					}
				}
			}
		}
		oModelData["enum"]["DeviceType"] = aDeviceData;
		sap.ui.getCore ( ).getModel ( "myVehiclesAddVehicleModel" ).setData ( oModelData );
	},

	/**
	 * @description triggered on click of cancel button Navigates back in the detail App.
	 * @param evt event object of the click event.
	 * @returns void.
	 * @since 1.0
	 */
	fireCancelAction : function ( ) {

		var that = this, sdetailObject, modelData;
		modelData = sap.ui.getCore ( ).getModel ( "myVehiclesAddVehicleModel" ).getData ( );
		modelData["isCancel"] = true;
		sap.ui.getCore ( ).getModel ( "myVehiclesAddVehicleModel" ).setData ( modelData );
		sdetailObject = jQuery.extend ( true, {}, sap.ui.getCore ( ).getModel ( "SapSplMyVehicleDetailModel" ).getData ( ) );

		if ( oSapSplUtils.getIsDirty ( ) ) {
			sap.m.MessageBox.show ( oSapSplUtils.getBundle ( ).getText ( "DATA_LOSS_WARNING_TEXT" ), sap.m.MessageBox.Icon.WARNING, oSapSplUtils.getBundle ( ).getText ( "WARNING" ), [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
					function ( selection ) {
						if ( selection === "YES" ) {
							jQuery.proxy ( that.callToNavInDetailVehicle ( sdetailObject ), that );
							that.selectMasterListItemOnBackNavigation ( "SapSplMyVehicleDetailModel" );
							oSapSplUtils.setIsDirty ( false );
						}
					}, null, oSapSplUtils.fnSyncStyleClass ( "messageBox" ) );
		} else {
			this.callToNavInDetailVehicle ( sdetailObject );
			this.selectMasterListItemOnBackNavigation ( "SapSplMyVehicleDetailModel" );
		}
	},

	/**
	 * @description Call to navInDetailBP function of event bus for navigating to detail page with model data
	 * @params {object} modelData
	 * @returns void
	 * @since 1.0
	 */
	callToNavInDetailVehicle : function ( modelData ) {
		var bus = sap.ui.getCore ( ).getEventBus ( );
		bus.publish ( "navInDetailVehicle", "to", {
			from : this.getView ( ),
			data : {
				context : modelData
			}
		} );
	},

	/**
	 * @description selects master list item on back navigation
	 * @params {object} modelname
	 * @returns void
	 * @since 1.0
	 */
	selectMasterListItemOnBackNavigation : function ( modelName ) {
		var sIndex, currentVehicle, masterList;
		currentVehicle = sap.ui.getCore ( ).getModel ( modelName ).getData ( );
		masterList = oSapSplUtils.getCurrentMasterPageVehicle ( ).byId ( "SapSplVehiclesList" );
		for ( sIndex = 0 ; sIndex < masterList.getItems ( ).length ; sIndex++ ) {
			if ( masterList.getItems ( )[sIndex].sId.indexOf ( "SapSplVehiclesListItem" ) !== -1 ) {
				if ( masterList.getItems ( )[sIndex].getBindingContext ( ).getProperty ( ).UUID === currentVehicle.UUID ) {
					masterList.setSelectedItem ( masterList.getItems ( )[sIndex] );
					break;
				}
			}
		}
		/* Fix for Incident : 1580071436 */
		if ( masterList.getItems ( ).length === 0 ) {
			var oEmptyObject = {};
			oEmptyObject["isClicked"] = false;
			oEmptyObject["noData"] = true;
			oEmptyObject["showFooterButtons"] = false;
			oEmptyObject["isEdit"] = false;
			oEmptyObject["isEditable"] = false;
			sap.ui.getCore ( ).getModel ( "SapSplMyVehicleDetailModel" ).setData ( oEmptyObject );
		}
	},

	/**
	 * @description Method to fire the save action in the add new truck scenario.
	 * @param {object} oEvent event object.
	 * @returns void.
	 * @since 1.0
	 */
	fireSaveAction : function ( ) {

		var oPayLoadForPost = null, that = this, urlSaveAction = "", ajaxObjSettings = {};
		oSapSplBusyDialog.getBusyDialogInstance ( {
			title : oSapSplUtils.getBundle ( ).getText ( "BUSY_DIALOG_MESSAGE" )
		} ).open ( );
		oPayLoadForPost = this.preparePayLoad ( );
		urlSaveAction = oSapSplUtils.getServiceMetadata ( "deviceVehicleAssignment", true );
		ajaxObjSettings = {
			url : urlSaveAction,
			method : "PUT",
			data : JSON.stringify ( oPayLoadForPost ),
			success : jQuery.proxy ( that.successForSaveAction, that ),
			error : jQuery.proxy ( that.errorForSaveAction, that ),
			complete : jQuery.proxy ( that.completeForSaveAction, that )
		};
		oSapSplAjaxFactory.fireAjaxCall ( ajaxObjSettings );
	},

	successForSaveAction : function ( data, success, messageObject ) {
		if ( data.constructor === String ) {
			data = JSON.parse ( data );
		}
		var model = sap.ui.getCore ( ).getModel ( "myVehiclesAddVehicleModel" ).getData ( ).data;

		oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );

		if ( messageObject["status"] === 200 && data["Error"].length === 0 ) {

			var oCustomData = new sap.ui.core.CustomData ( {
				key : "bRefreshTile",
				value : true
			} );
			oSplBaseApplication.getAppInstance ( ).getCurrentPage ( ).destroyCustomData ( );
			oSplBaseApplication.getAppInstance ( ).getCurrentPage ( ).addCustomData ( oCustomData );

			if ( model.mode === "Edit" ) {
				sap.ca.ui.message.showMessageToast ( oSapSplUtils.getBundle ( ).getText ( "SUCCESSFUL_EDIT", model.RegistrationNumber ) );
			} else {
				sap.ca.ui.message.showMessageToast ( oSapSplUtils.getBundle ( ).getText ( "TRUCK_ADDED_SUCCESSFUL" ) );
			}

			oSapSplUtils.getCurrentMasterPageVehicle ( ).byId ( "SapSplVehiclesList" ).addCustomData ( new sap.ui.core.CustomData ( {
				key : data.Vehicle.data[0].UUID
			} ) );

			sap.ui.getCore ( ).getModel ( "myVehiclesListODataModel" ).refresh ( );

			oSapSplUtils.setIsDirty ( false );

		} else {

			var errorMessage = oSapSplUtils.getErrorMessagesfromErrorPayload ( data )["ufErrorObject"];
			sap.ca.ui.message.showMessageBox ( {
				type : oSapSplUtils.getErrorMessagesfromErrorPayload ( data )["messageTitle"],
				message : oSapSplUtils.getErrorMessagesfromErrorPayload ( data )["errorWarningString"],
				details : errorMessage
			}, function ( ) {

			} );

		}
	},

	errorForSaveAction : function ( error ) {
		jQuery.sap.log.error ( "fireSaveAction", "ajax failed", "MyVehiclesDetailAddVehicle.controller.js" );
		oSapSplBusyDialog.getBusyDialogInstance ( ).close ( );

		if ( error && error["status"] === 500 ) {

			sap.ca.ui.message.showMessageBox ( {

				type : sap.ca.ui.message.Type.ERROR,

				message : error["status"] + " " + error.statusText,

				details : error.responseText

			} );

		} else {
			if ( error && error.responseText && error.responseText !== null ) {
				if ( error.responseText.constructor === String ) {
					error.responseText = JSON.parse ( error.responseText );
				} else if ( error.statusText === "timeout" ) {
					sap.m.MessageBox.show ( oSapSplUtils.getBundle ( ).getText ( "APP_ERR_MSG" ), {
						title : oSapSplUtils.getBundle ( ).getText ( "ACC_STATE_ERROR" ),
						icon : sap.m.MessageBox.Icon.ERROR,
						actions : [sap.m.MessageBox.Action.CLOSE],
						onClose : function ( ) {
							jQuery.sap.log.warning ( "SAP SCL Timeout", "Timeout error occured while performing save", "SAPSCL" );
						}
					} );
				}
			}
			var data = error.responseText;

			sap.ca.ui.message.showMessageBox ( {

				type : oSapSplUtils.getErrorMessagesfromErrorPayload ( data )["messageTitle"],

				message : oSapSplUtils.getErrorMessagesfromErrorPayload ( data )["errorWarningString"],

				details : oSapSplUtils.getErrorMessagesfromErrorPayload ( data )["ufErrorObject"]

			} );

		}
	},
	/**
	 * @description Method to prepare the payload, for creation of new truck scenario.
	 * @param void.
	 * @returns {object} oMainPayLoad constructed payload for post.
	 * @since 1.0
	 */
	preparePayLoad : function ( ) {

		var oPayLoadForPost = {}, oData = null, sSelectedDeviceType = "", oMainPayload = {};
		oMainPayload["data"] = [];
		oData = sap.ui.getCore ( ).getModel ( "myVehiclesAddVehicleModel" ).getData ( )["data"];
		if ( oData["UUID"] ) {
			oPayLoadForPost["VehicleUUID"] = oData["UUID"];
		} else {
			oPayLoadForPost["VehicleUUID"] = oSapSplUtils.getUUID ( );
		}
		oPayLoadForPost["VehicleRegistrationNumber"] = oData["RegistrationNumber"];
		/* CSNFIX : 0120061532 0001485499 2014 */
		if ( oData["VehicleDriverUUID"] || oData["DriverID"] ) {
			oPayLoadForPost["DriverID"] = oData["VehicleDriverUUID"] || oData["DriverID"];
		} else {
			oPayLoadForPost["DriverID"] = null;
		}
		oPayLoadForPost["VehiclePublicName"] = oData["PublicName"];
		oPayLoadForPost["VehicleType"] = this.byId ( "sapSplNewVehiclesVehicleType" ).getSelectedItem ( ).getBindingContext ( ).getProperty ( )["Value"];
		if ( oPayLoadForPost["VehicleType"] === "Select" ) {
			oPayLoadForPost["VehicleType"] = null;
		}
		if ( oData["Status"] ) {
			oPayLoadForPost["VehicleStatus"] = oData["Status"];
		} else {
			oPayLoadForPost["VehicleStatus"] = "A";

		}

		oPayLoadForPost["VehicleCountryCode"] = "IND";
		if ( oData["VehicleChangeMode"] ) {
			oPayLoadForPost["VehicleChangeMode"] = oData["VehicleChangeMode"];
		} else {
			oPayLoadForPost["VehicleChangeMode"] = null;
		}

		oPayLoadForPost["OwnerID"] = oSapSplUtils.getCompanyDetails ( )["BasicInfo_CompanyID"];
		oPayLoadForPost["VehicleImageUrl"] = null;
		oPayLoadForPost["VehicleIsDeleted"] = "0";
		sSelectedDeviceType = this.byId ( "sapSplNewVehiclesDeviceType" ).getSelectedItem ( ).getBindingContext ( ).getProperty ( )["Value"];
		if ( sSelectedDeviceType === "None" || sSelectedDeviceType === "Select" || oData["DevicePublicName"] === oSapSplUtils.getBundle ( ).getText ( "SELECT_DEVICE_PLACEHOLDER" ) ) {
			oMainPayload["data"].push ( oPayLoadForPost );
			return oMainPayload;
		} else {
			if ( oData["mode"] && oData["mode"] === "Edit" && this.bDeviceAssignmentChanged === true ) {
				oMainPayload["data"].push ( oPayLoadForPost );
				oPayLoadForPost = jQuery.extend ( true, {}, oPayLoadForPost );
				this.bDeviceAssignmentChanged = false;
			}
			if ( oData["DeviceUUID"] ) {
				oPayLoadForPost["DeviceUUID"] = oData["DeviceUUID"];
			} else {
				oPayLoadForPost["DeviceUUID"] = oSapSplUtils.getUUID ( );
			}
			oPayLoadForPost["DeviceType"] = (this.byId ( "sapSplNewVehiclesDeviceType" ).getSelectedItem ( ).getBindingContext ( ).getProperty ( )["Value"] === undefined) ? null : this.byId ( "sapSplNewVehiclesDeviceType" ).getSelectedItem ( )
					.getBindingContext ( ).getProperty ( )["Value"];
			oPayLoadForPost["DevicePhoneNumber"] = (oData["DevicePhoneNumber"]) ? oData["DevicePhoneNumber"] : null;
			oPayLoadForPost["DeviceStatus"] = "A";
			oPayLoadForPost["DeviceisDeleted"] = "0";

			if ( this.byId ( "sapSplNewVehiclesDeviceType" ).getSelectedItem ( ).getBindingContext ( ).getProperty ( )["Value.description"] === "Mobile" ) {
				oPayLoadForPost["DeviceUniqueID"] = this.byId ( "sapSplNewVehicleMobileDeviceID" ).getValue ( );
				oPayLoadForPost["DevicePublicName"] = this.byId ( "sapSplNewVehicleMobileDeviceID" ).getValue ( );
			} else {
				if ( !oData["DeviceUniqueID"] ) {
					oPayLoadForPost["DeviceUniqueID"] = oData["DevicePublicName"];
				} else {
					oPayLoadForPost["DeviceUniqueID"] = oData["DeviceUniqueID"];
				}
				oPayLoadForPost["DevicePublicName"] = oData["DevicePublicName"];
			}
		}

		oMainPayload["data"].push ( oPayLoadForPost );

		return oMainPayload;
	},

	/**
	 * @description Method to handle the click of the driver name link. This method would instantiate the driverdetaildialog and open the same. This
	 *              method will trigger an odata read, to fetch the appropriate drivers in the system only after the dialog opens.
	 * @param void.
	 * @returns void.
	 * @since 1.0
	 */
	fnHandlePressSelectDriverName : function ( ) {
		splReusable.libs.SapSplStyleSheetLoader.loadStyle ( "./resources/styles/splDriverDialog" );
		var dialog = sap.ui.view ( {
			viewName : "splView.dialogs.SplDriverDetailsDialog",
			type : sap.ui.core.mvc.ViewType.XML
		} ).addStyleClass ( "AddDriverDialogDialogContainerView" );
		this.oSendMessageBusinessPartnerParentDialog = new sap.m.Dialog ( {
			showHeader : false,
			content : new sap.ui.commons.layout.VerticalLayout ( ).addStyleClass ( "viewHolderLayout" ).addContent ( dialog ),
			afterOpen : function ( oEvent ) {
				oEvent.getSource ( ).getContent ( )[0].getContent ( )[0].setBusyIndicatorDelay ( 0 );
				oEvent.getSource ( ).getContent ( )[0].getContent ( )[0].setBusy ( true );
				var oSapSplDriverModel = null, oDataModelContext = null, oDataModelFilters = null, bIsAsync = null;
				oSapSplDriverModel = sap.ui.getCore ( ).getModel ( "myDriversListODataModel" );
				oDataModelFilters = ["$filter= BasicInfo_Type eq 'P' and Role eq 'DRIVER'"];
				bIsAsync = true;
				var sUrl = "/MyUsers";
				if ( oSapSplDriverModel ) {

					oSapSplDriverModel.read ( sUrl, oDataModelContext, oDataModelFilters, bIsAsync, jQuery.proxy ( this.successOfDriversOData, this ), jQuery.proxy ( this.errorOfDriverOData, this ) );
				}
			}.bind ( this )

		} ).addStyleClass ( "splSendMessageBusinessPartnerDialog" );
		dialog.getController ( ).setParentDialogInstance ( this.oSendMessageBusinessPartnerParentDialog );

		$ ( ".sapMDialogBlockLayerInit" ).css ( "z-index", "0" );
		this.oSendMessageBusinessPartnerParentDialog.open ( );

	},

	/**
	 * @description success callback of the driver list odata read.
	 * @param {object} oData object containing all the drivers details in the system.
	 * @returns void.
	 * @since 1.0
	 */
	successOfDriversOData : function ( oData ) {
		this.oSendMessageBusinessPartnerParentDialog.getContent ( )[0].getContent ( )[0].setBusy ( false );
		var oModel = new sap.ui.model.json.JSONModel ( );
		oModel.setData ( oData );
		this.oSendMessageBusinessPartnerParentDialog.setModel ( oModel );
	},

	errorOfDriverOData : function ( ) {

	},

	// check and remove.
	fnHandleSwitchChange : function ( evt ) {
		var oData = evt.getSource ( ).getBindingContext ( ).getObject ( );
		this.fnToCaptureLiveChangeToSetFlag ( );
		if ( evt.getSource ( ).getState ( ) ) {
			oData["ChangeMode"] = "I";
		} else {
			oData["ChangeMode"] = "D";
		}

		// if(this.oShareInfo[oData.Organization_Name]){
		// delete this.oShareInfo[oData.Organization_Name];
		// }
		// else {
		this.oShareInfo[oData.Partner_Name] = {
			data : oData
		};
		// }
	}

} );
