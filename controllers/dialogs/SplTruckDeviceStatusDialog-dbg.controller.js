/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.require("sap.ca.ui.message.message");
sap.ui.controller("splController.dialogs.SplTruckDeviceStatusDialog", {

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     */
    onInit: function () {
        this.oViewData = this.getView().getViewData();

        this.oSplTruckDeviceStatusModel = new sap.ui.model.json.JSONModel();
        this.oSplTruckDeviceStatusModel.setData(this.oViewData);
        this.getView().setModel(this.oSplTruckDeviceStatusModel);

        /*     CSNFIX : 0120061532 1322863    2014 */
        if (this.oViewData["data"]["isSharedByMyOrg"] && this.oViewData["data"]["isSharedByMyOrg"]) {
            this.byId("SapSplDeactivateDeregisterWarningMessageLayout").setVisible(true);
        }

        /*Localization*/
        this.fnDefineControlLabelsFromLocalizationBundle();
    },

    /**
     * @description Method to handle localization of all the hard code texts in the view.
     * @param void.
     * @returns void.
     * @since 1.0
     */
    fnDefineControlLabelsFromLocalizationBundle: function () {
        this.byId("SapSplDeactivateTruckFormContainerRegistrationNumberLabel").setText(oSapSplUtils.getBundle().getText("VEHICLE_REGISTRATION_NUMBER"));
        this.byId("SapSplDeactivateTruckFormContainerDeviceIDLabel").setText(oSapSplUtils.getBundle().getText("DEVICE_ID"));
        this.byId("SapSplDeactivateDeregisterWarningMessage").setText(oSapSplUtils.getBundle().getText("VEHICLE_DEACTIVATE_DEREGISTER_WARNING"));
    },

    /**
     * @description Prepare payload for the Truck based on the mode.
     * @returns null
     * @this splController.dialogs.SplTruckDeviceStatusDialog
     * @since 1.0
     */
    fnPreparePayloadTruck: function (sMode) {

        var oModelData = this.oSplTruckDeviceStatusModel.getData().data;
        var oSamplePayload = {};
        oSamplePayload.data = [];
        var oSamplePayloadData = {};

        oSamplePayloadData["VehicleUUID"] = oModelData["UUID"];
        oSamplePayloadData["VehicleType"] = oModelData["Type"];
        oSamplePayloadData["VehiclePublicName"] = oModelData["PublicName"];
        oSamplePayloadData["DriverID"] = oModelData["DriverID"];
        oSamplePayloadData["VehicleRegistrationNumber"] = oModelData["RegistrationNumber"];
        oSamplePayloadData["VehicleCountryCode"] = oModelData["CountryCode"];
        if (sMode === "Deactivate Truck") {
            oSamplePayloadData["VehicleStatus"] = "I";
            oSamplePayloadData["VehicleChangeMode"] = "U";
        } else if (sMode === "Deregister Truck") {
        	/* Fix for 1580104706 */
            oSamplePayloadData["VehicleStatus"] = oModelData.Status;
            oSamplePayloadData["VehicleChangeMode"] = "U";
        } else {
            oSamplePayloadData["VehicleStatus"] = "A";
            oSamplePayloadData["VehicleChangeMode"] = "U";
        }
        if (oModelData["ImageUrl"]) {
            oSamplePayloadData["VehicleImageUrl"] = oModelData["ImageUrl"];
        } else {
            oSamplePayloadData["VehicleImageUrl"] = null;
        }
        oSamplePayloadData["VehicleisDeleted"] = "0";
        oSamplePayloadData["OwnerID"] = oModelData["OwnerID"];

        oSamplePayloadData["DeviceUUID"] = oModelData["DeviceUUID"];
        oSamplePayloadData["DeviceType"] = oModelData["DeviceType"];
        oSamplePayloadData["DeviceUniqueID"] = oModelData["UniqueID"];
        oSamplePayloadData["DevicePhoneNumber"] = null;
        oSamplePayloadData["DevicePublicName"] = oModelData["DevicePublicName"];
        oSamplePayloadData["DeviceStatus"] = oModelData["DeviceStatus"];
        oSamplePayloadData["DeviceisDeleted"] = "0";

        if (sMode === "Deregister Truck") {
        	oSamplePayloadData.ChangeMode = "D";
        	oSamplePayload.inputHasChangeMode = true;
        }
        
        oSamplePayload.data.push(oSamplePayloadData);
        return oSamplePayload;

    },

    /**
     * @description Makes an ajax call to perform actions on the Truck based on the mode.
     * @returns null
     * @this splController.dialogs.SplTruckDeviceStatusDialog
     * @since 1.0
     */
    fnTruckActionServieCall: function (sMode) {

        var that = this;
       this.sModeTruckAction = sMode;
        oSapSplBusyDialog.getBusyDialogInstance({
            title: oSapSplUtils.getBundle().getText("BUSY_DIALOG_MESSAGE")
        }).open();
        /*Function to prepare payload for the Device based on the mode*/
        var oPayLoadForPost = this.fnPreparePayloadTruck(sMode);
        var sType = "PUT",
            sUrl = oSapSplUtils.getServiceMetadata("deviceVehicleAssignment", true);
        // Full path used for local testing 
        if (sMode === "Deregister Truck") {
            sType = "POST";
        }
        window.setTimeout(function () {

            /*Ajax call that perform Activate Deactivate or Deregister based on the mode*/
            var ajaxObject = {
                    url: sUrl,
                    method: sType,
                    async: false,
                    beforeSend: function(request){
                        request.setRequestHeader("X-CSRF-Token", oSapSplUtils.getCSRFToken());
                    },
                    contentType: "json",
                    data: JSON.stringify(oPayLoadForPost),
                    success : jQuery.proxy(that.onSuccess,that),
                    error: jQuery.proxy(that.onError,that)
                    
            };
            
            oSapSplAjaxFactory.fireAjaxCall(ajaxObject);
 
        }, 20);
    },
    
    onSuccess: function (data, success, messageObject) {
        var that = this;
        oSapSplBusyDialog.getBusyDialogInstance().close();
        if (data.constructor === String) {
            data = JSON.parse(data);
        }
        var oModelData = that.oSplTruckDeviceStatusModel.getData().data;

        oSapSplUtils.getCurrentMasterPageVehicle().byId("SapSplVehiclesList").addCustomData(new sap.ui.core.CustomData({
            key: data.Vehicle.data[0].UUID
        }));

        if (that.getView().getParent()) {
            that.getView().getParent().destroyContent();
        }

   /*      CSNFIX : 0120061532 1325656    2014 */

        if (messageObject["status"] === 200 && data["Error"].length === 0) {

            var oCustomData = new sap.ui.core.CustomData({
                key: "bRefreshTile",
                value: true
            });
            oSplBaseApplication.getAppInstance().getCurrentPage().destroyCustomData();
            oSplBaseApplication.getAppInstance().getCurrentPage().addCustomData(oCustomData);

            oSapSplBusyDialog.getBusyDialogInstance().close();
            if (this.sModeTruckAction === "Deactivate Truck") {

                sap.m.MessageToast.show(oSapSplUtils.getBundle().getText("VEHICLE_DEACTIVATED_SUCCESSFULLY_MSG", oModelData.RegistrationNumber), {
                    width: "25em",
                    offset: "0 -115"
                });
                if (oModelData.DevicePublicName !== undefined && oModelData.DevicePublicName !== null) {
                    sap.m.MessageToast.show(oSapSplUtils.getBundle().getText("DEVICE_DEACTIVATED_SUCCESSFULLY_MSG", oModelData.DevicePublicName), {
                        width: "25em"
                    });
                }

            } else if (this.sModeTruckAction === "Deregister Truck") {

                sap.m.MessageToast.show(oSapSplUtils.getBundle().getText("VEHICLE_DEREGISTER_SUCCESSFULLY_MSG", oModelData.RegistrationNumber), {
                    width: "25em",
                    offset: "0 -115"
                });
                if (oModelData.DevicePublicName !== undefined && oModelData.DevicePublicName !== null) {
                    sap.m.MessageToast.show(oSapSplUtils.getBundle().getText("DEVICE_DEREGISTER_SUCCESSFULLY_MSG", oModelData.DevicePublicName), {
                        width: "25em"
                    });
                }

            } else if (this.sModeTruckAction === "Activate Truck") {

                sap.m.MessageToast.show(oSapSplUtils.getBundle().getText("VEHICLE_ACTIVATED_SUCCESSFULLY_MSG", oModelData.RegistrationNumber), {
                    width: "25em",
                    offset: "0 -115"
                });
                if (oModelData.DevicePublicName !== undefined && oModelData.DevicePublicName !== null) {
                    sap.m.MessageToast.show(oSapSplUtils.getBundle().getText("DEVICE_ACTIVATED_SUCCESSFULLY_MSG", oModelData.DevicePublicName), {
                        width: "25em"
                    });
                }

            }
            var modelData = sap.ui.getCore().getModel("SapSplMyVehicleDetailModel").getData();
            modelData["noData"] = true;
            modelData["isClicked"] = false;
            sap.ui.getCore().getModel("SapSplMyVehicleDetailModel").setData(modelData);
            sap.ui.getCore().getModel("myVehiclesListODataModel").refresh();

        } else {
            oSapSplBusyDialog.getBusyDialogInstance().close();
            sap.ui.getCore().getModel("myVehiclesListODataModel").refresh();
            if (data["Error"].length !== 0) {
                var errorDetails = oSapSplUtils.getErrorMessagesfromErrorPayload(data)["ufErrorObject"];
                var errorMessage = oSapSplUtils.getErrorMessagesfromErrorPayload(data)["errorWarningString"];

                sap.ca.ui.message.showMessageBox({
                    type: oSapSplUtils.getErrorMessagesfromErrorPayload(data)["messageTitle"],
                    message: errorMessage,
                    details: errorDetails
                });
            }
        }

    },
    onError: function (error) {
        var that = this;
        oSapSplBusyDialog.getBusyDialogInstance().close();
        if (that.getView().getParent()) {
            that.getView().getParent().close();
            that.getView().getParent().destroyContent();
        }
        if (error && error["status"] === 500) {
            sap.ca.ui.message.showMessageBox({
                type: sap.ca.ui.message.Type.ERROR,
                message: error["status"] + " " + error.statusText,
                details: error.responseText
            });
        } else {
            if (error.responseText.constructor === String) {
                error.responseText = JSON.parse(error.responseText);
            }
            var data = error.responseText;

            sap.ca.ui.message.showMessageBox({
                type: oSapSplUtils.getErrorMessagesfromErrorPayload(data)["messageTitle"],
                message: oSapSplUtils.getErrorMessagesfromErrorPayload(data)["errorWarningString"],
                details: oSapSplUtils.getErrorMessagesfromErrorPayload(data)["ufErrorObject"]
            });
        }
    },

    /**
     * @description Perform Deactivate, Activate or register based on the mode.
     * @returns null
     * @this splController.dialogs.SplTruckDeviceStatusDialog
     * @since 1.0
     */
    fnPerformActionBasedOnMode: function () {
        if (this.oViewData.mode === "Deactivate Truck") {
            this.fnTruckActionServieCall(this.oViewData.mode);
        } else if (this.oViewData.mode === "Activate Truck") {
            this.fnTruckActionServieCall(this.oViewData.mode);
        } else if (this.oViewData.mode === "Deregister Truck") {
            this.fnTruckActionServieCall(this.oViewData.mode);
        }
    },

    /**
     * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
     * This hook is the same one that SAPUI5 controls get after being rendered.
     */
    onAfterRendering: function () {}

    /**
     * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
     */
    //  onExit: function() {

    //  }

});
