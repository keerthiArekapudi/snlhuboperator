sap.ui.controller("splController.dialogs.SplNewLocationDialog", {

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     */
    onInit: function () {
        this.oViewData = this.getView().getViewData();
        this.oSplNewLocationItemModel = new sap.ui.model.json.JSONModel();
        this.oSplNewLocationItemModel.setData(this.oViewData);
        this.getView().setModel(this.oSplNewLocationItemModel);

        /*Localization*/
        this.fnDefineControlLabelsFromLocalizationBundle();

        this.saveDirtyFlag = oSapSplUtils.getIsDirty();
        oSapSplUtils.setIsDirty(false);

    },

    /**
     * @description Method to handle localization of all the hard code texts in the view.
     * @param void.
     * @returns void.
     * @since 1.0
     */
    fnDefineControlLabelsFromLocalizationBundle: function () {
        this.byId("SapSplNewLocationFormContainerAddress1Label").setText(oSapSplUtils.getBundle().getText("HOUSE_NUMBER"));
        this.byId("SapSplNewLocationFormContainerAddress2Label").setText(oSapSplUtils.getBundle().getText("STREET_NAME"));
        this.byId("SapSplNewLocationFormContainerCityLabel").setText(oSapSplUtils.getBundle().getText("NEW_LOCATION_CITY_LABEL"));
        this.byId("SapSplNewLocationFormContainerZipcodeLabel").setText(oSapSplUtils.getBundle().getText("POSTAL_CODE"));
        this.byId("SapSplNewLocationFormContainerCountryLabel").setText(oSapSplUtils.getBundle().getText("NEW_LOCATION_COUNRTY_LABEL"));
        this.byId("SapSplNewLocationFormContainerRegionLabel").setText(oSapSplUtils.getBundle().getText("NEW_LOCATION_REGION_LABEL"));
    },


    /**
     * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
     * This hook is the same one that SAPUI5 controls get after being rendered.
     */
    onAfterRendering: function () {},

    /**
     * @description Method to save dialog instance & set buttons for dialog.
     * @param {Object} oParentDialog.
     * @returns void.
     * @since 1.0
     */
    setParentDialogInstance: function (oParentDialog) {
        this.oParentDialogInstance = oParentDialog;
        this.setButtonForDialog();
    },

    /**
     * @description Method to set Begin & End Button for dialog & set localized text for it.
     * @param void.
     * @returns void.
     * @since 1.0
     */
    setButtonForDialog: function () {

        this.oSapSplNewLocationOkButton = new sap.m.Button({
            press: jQuery.proxy(this.fnHandlePressOfNewLocationDialogOk, this)
        });

        this.oSapSplNewLocationCancelButton = new sap.m.Button({
            press: jQuery.proxy(this.fnHandlePressOfNewLocationDialogCancel, this)
        });

        this.oSapSplNewLocationOkButton.setText(oSapSplUtils.getBundle().getText("OK_BUTTON_TEXT"));
        this.oSapSplNewLocationCancelButton.setText(oSapSplUtils.getBundle().getText("CANCEL"));
        this.oParentDialogInstance.setBeginButton(this.oSapSplNewLocationOkButton);
        this.oParentDialogInstance.setEndButton(this.oSapSplNewLocationCancelButton);
    },

    /**
     * @description Method to Check passed parameter empty or not.
     * @param {String} value Input String.
     * @returns {Boolean} True if not Empty else False.
     * @since 1.0
     */
    checkIfFieldIsNotEmpty: function (value) {
        return ((value.split(" ")).join("")).length !== 0 ? true : false;
    },

    fnCheckInputFields: function () {
        var flag = 0;

        if (this.byId("SapSplNewLocationFormContainerAddress1Input").getValue() !== null && this.checkIfFieldIsNotEmpty(this.byId("SapSplNewLocationFormContainerAddress1Input").getValue())) {

            this.byId("SapSplNewLocationFormContainerAddress1Input").setValueState("None");
        } else {
            flag++;
            this.byId("SapSplNewLocationFormContainerAddress1Input").setValueState("Error");
            this.byId("SapSplNewLocationFormContainerAddress1Input").setValueStateText(oSapSplUtils.getBundle().getText("EMPTY_ERROR_MESSAGE"));
        }

        if (this.byId("SapSplNewLocationFormContainerAddress2Input").getValue() !== null && this.checkIfFieldIsNotEmpty(this.byId("SapSplNewLocationFormContainerAddress2Input").getValue())) {

            this.byId("SapSplNewLocationFormContainerAddress2Input").setValueState("None");
        } else {
            flag++;
            this.byId("SapSplNewLocationFormContainerAddress2Input").setValueState("Error");
            this.byId("SapSplNewLocationFormContainerAddress2Input").setValueStateText(oSapSplUtils.getBundle().getText("EMPTY_ERROR_MESSAGE"));
        }

        if (this.byId("SapSplNewLocationFormContainerCityInput").getValue() !== null && this.checkIfFieldIsNotEmpty(this.byId("SapSplNewLocationFormContainerCityInput").getValue())) {

            this.byId("SapSplNewLocationFormContainerCityInput").setValueState("None");
        } else {
            flag++;
            this.byId("SapSplNewLocationFormContainerCityInput").setValueState("Error");
            this.byId("SapSplNewLocationFormContainerCityInput").setValueStateText(oSapSplUtils.getBundle().getText("EMPTY_ERROR_MESSAGE"));
        }

        if (this.byId("SapSplNewLocationFormContainerZipcodeInput").getValue() !== null && this.checkIfFieldIsNotEmpty(this.byId("SapSplNewLocationFormContainerZipcodeInput").getValue())) {

            this.byId("SapSplNewLocationFormContainerZipcodeInput").setValueState("None");
        } else {
            flag++;
            this.byId("SapSplNewLocationFormContainerZipcodeInput").setValueState("Error");
            this.byId("SapSplNewLocationFormContainerZipcodeInput").setValueStateText(oSapSplUtils.getBundle().getText("EMPTY_ERROR_MESSAGE"));
        }

        if (this.byId("SapSplNewLocationFormContainerCountryInput").getValue() !== null && this.checkIfFieldIsNotEmpty(this.byId("SapSplNewLocationFormContainerCountryInput").getValue())) {

            this.byId("SapSplNewLocationFormContainerCountryInput").setValueState("None");
        } else {
            flag++;
            this.byId("SapSplNewLocationFormContainerCountryInput").setValueState("Error");
            this.byId("SapSplNewLocationFormContainerCountryInput").setValueStateText(oSapSplUtils.getBundle().getText("EMPTY_ERROR_MESSAGE"));
        }

        if (this.byId("SapSplNewLocationFormContainerRegionInput").getValue() !== null && this.checkIfFieldIsNotEmpty(this.byId("SapSplNewLocationFormContainerRegionInput").getValue())) {

            this.byId("SapSplNewLocationFormContainerRegionInput").setValueState("None");
        } else {
            flag++;
            this.byId("SapSplNewLocationFormContainerRegionInput").setValueState("Error");
            this.byId("SapSplNewLocationFormContainerRegionInput").setValueStateText(oSapSplUtils.getBundle().getText("EMPTY_ERROR_MESSAGE"));
        }
        return flag;
    },

    /**
     * @description Method to handle press of Ok button of dialog.
     * @param void.
     * @returns void.
     * @since 1.0
     */
    fnHandlePressOfNewLocationDialogOk: function () {
        var flag = 0,
            modelData, that = this;

        flag = this.fnCheckInputFields();


        if (flag === 0) {

            modelData = $.extend(true, {}, sap.ui.getCore().getModel("SplCreateNewTourModel").getData());

            var oTempData = this.fnCreateEmptyPayloadForLocation();
            var address = oTempData.Address[0];
            var oViewData = this.getView().getModel().getData();
            address["BuildingID"] = oViewData["Address.Name1"];
            address["StreetName"] = oViewData["Address.Name2"];
            address["CityName"] = oViewData["Address.Town"];
            address["StreetPostalCode"] = oViewData["Address.PostalCode"];
            address["RegionName"] = oViewData["Address.Region"];
            address["CountryName"] = oViewData["Address.Country"];
            
            oTempData.Header[0]["Name"] = oViewData["Address.Name1"] + " " + oViewData["Address.Name2"] + " " + oViewData["Address.Town"] + " " + oViewData["Address.PostalCode"] + " " + oViewData["Address.Region"] + " " + oViewData["Address.Country"];
            
            // HOTFIX : Temporary fix for incident 1580147264 for integration testing
            if( oTempData.Header[0]["Name"].length > 40 ) {
            	 oTempData.Header[0]["Name"] = oTempData.Header[0]["Name"].substr(0, 39);
            }
            
            oSapSplAjaxFactory.fireAjaxCall({
                url: oSapSplUtils.getFQServiceUrl("/sap/spl/xs/app/services/locations.xsjs"),
                method: "PUT",
                data: JSON.stringify(oTempData),
                success: function (data) {

                    if (data.constructor === String) {
                        data = JSON.parse(data);
                    }
                    var temp = {};
                    temp["Planned.ArrivalTime"] = modelData.stopsRow[that.oSplNewLocationItemModel.getData().modelDataIndex]["Planned.ArrivalTime"];
                    temp["Planned.DepartureTime"] = modelData.stopsRow[that.oSplNewLocationItemModel.getData().modelDataIndex]["Planned.DepartureTime"];
                    temp["leavesTimeVisible"] = modelData.stopsRow[that.oSplNewLocationItemModel.getData().modelDataIndex]["leavesTimeVisible"];
                    temp["items"] = modelData.stopsRow[that.oSplNewLocationItemModel.getData().modelDataIndex]["items"];

                    if (data && data.Header && data.Header.length > 0) {
                        temp["LocationUUID"] = data.Header[0].LocationID;
                        temp["Name"] = data.Header[0].Name;
                    }
                    if (data && data.Address && data.Address.length > 0) {
                        temp["AddressUUID"] = data.Address[0].UUID;
                        temp["Address.Name1"] = data.Address[0].BuildingID;
                        temp["Address.Name2"] = data.Address[0].StreetName;
                        temp["Address.Town"] = data.Address[0].CityName;
                        temp["Address.Country"] = data.Address[0].CountryName;
                        temp["Address.PostalCode"] = data.Address[0].StreetPostalCode;
                        temp["Address.Region"] = data.Address[0].RegionName;
                    }

                    temp["labels"] = modelData.stopsRow[that.oSplNewLocationItemModel.getData().modelDataIndex]["labels"];
                    temp["pickup"] = modelData.stopsRow[that.oSplNewLocationItemModel.getData().modelDataIndex]["pickup"];
                    temp["drop"] = modelData.stopsRow[that.oSplNewLocationItemModel.getData().modelDataIndex]["drop"];
                    temp["labels"].newlocationlink = oSapSplUtils.getBundle().getText("EDIT_STOP");
                    modelData.stopsRow[that.oSplNewLocationItemModel.getData().modelDataIndex] = temp;

                    sap.ui.getCore().getModel("SplCreateNewTourModel").setData(modelData);
                    that.fnToCaptureLiveChangeToSetFlag();
                    that.getView().getParent().close();
                },
                error: function (error) {
                    jQuery.sap.log.error("fnGetDevicesFromTSystems", "ajax failed", "MyVehiclesDetailAddVehicle.controller.js");
                    oSapSplBusyDialog.getBusyDialogInstance().close();

                    if (error && error["status"] === 500) {
                        sap.ca.ui.message.showMessageBox({
                            type: sap.ca.ui.message.Type.ERROR,
                            message: error["status"] + " " + error.statusText,
                            details: error.responseText
                        });
                    } else {
                        sap.ca.ui.message.showMessageBox({
                            type: sap.ca.ui.message.Type.ERROR,
                            message: oSapSplUtils.getErrorMessagesfromErrorPayload(JSON.parse(error.responseText))["errorWarningString"],
                            details: oSapSplUtils.getErrorMessagesfromErrorPayload(JSON.parse(error.responseText))["ufErrorObject"]
                        });
                    }
                },
                complete: function () {}
            });
        }
    },

    /**
     * @description Called to set isDirtyFlag to true in Utils
     * @returns void.
     * @since 1.0
     * */
    fnToCaptureLiveChangeToSetFlag: function () {
        if (!oSapSplUtils.getIsDirty()) {
            oSapSplUtils.setIsDirty(true);
        }
    },

    /**
     * @description Method to handle press of Close button of dialog.
     * @param void.
     * @returns void.
     * @since 1.0
     */
    fnHandlePressOfNewLocationDialogCancel: function () {
        var that = this;
        if (oSapSplUtils.getIsDirty()) {
            sap.m.MessageBox.show(
                oSapSplUtils.getBundle().getText("DATA_LOSS_WARNING_TEXT"),
                sap.m.MessageBox.Icon.WARNING,
                oSapSplUtils.getBundle().getText("WARNING"), [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
                function (selection) {
                    if (selection === "YES") {
                        that.getView().getParent().close();
                        oSapSplUtils.setIsDirty(that.saveDirtyFlag);
                    }
                }
            );
        } else {
            that.getView().getParent().close();
            oSapSplUtils.setIsDirty(that.saveDirtyFlag);
        }
    },

    /**
     * @description Method to create empty payload for location.
     * @param void.
     * @returns {Object} Stop Empty payload.
     * @since 1.0
     */
    fnCreateEmptyPayloadForLocation: function () {

        var header = {},
            texts = {},
            address = {};
        var modelData = $.extend(true, {}, sap.ui.getCore().getModel("SplCreateNewTourModel").getData());

        header = {
            "Name": null,
            "OwnerID": oSapSplUtils.getCompanyDetails()["BasicInfo_CompanyID"],
            "Type": "L00004",
            "ParentLocationID": null,
            "Stacked": "0",
            "isPublic": "0",
            "isDeleted": "0",
            "ImageUrl": null,
            "Geometry":{type: "Point", coordinates: [-47.109375, -1.2328150305121146]},
            "PhoneNumber": null,
            "isAddressResolutionRequired": "0"
        };

        if (modelData.stopsRow[this.oSplNewLocationItemModel.getData().modelDataIndex].LocationUUID) {
            header.LocationID = modelData.stopsRow[this.oSplNewLocationItemModel.getData().modelDataIndex].LocationUUID;
        } else {
            header.LocationID = oSapSplUtils.getUUID();
        }
        texts = {
            "ObjectUUID": header["LocationID"],
            "Type": "T",
            /* CSN FIX : 0120031469 682358 2014 Remove the Language attribute from the payload*/
            "LocaleLanguage": null,
            "LocationID": header["LocationID"],
            "Text": "LC0005"
        };

        address = {
            "LocationID": header["LocationID"]
        };

        if (modelData.stopsRow[this.oSplNewLocationItemModel.getData().modelDataIndex].AddressUUID) {
            address.UUID = modelData.stopsRow[this.oSplNewLocationItemModel.getData().modelDataIndex].AddressUUID;
        } else {
            address.UUID = oSapSplUtils.getUUID();
        }
        return {
            Header: [header],
            Texts: [texts],
            Address: [address]
        };
    }

    /**
     * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
     */
    //	onExit: function() {

    //	}

});
