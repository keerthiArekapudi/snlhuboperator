/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.controller("splController.dialogs.SplEditDisplayAreaSettings", {

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     * @memberOf mvc1.SplEditDisplayAreaSettings
     */
    onInit: function() {
        this.getView().setModel(sap.ui.getCore().getModel("LiveAppODataModel"));

        var oSorter = new sap.ui.model.Sorter("isMyCompanyView", false, function(oContext) {
            var sOwnerName = oContext.getProperty("OwnerName");
            var iIsMyCompanyView = oContext.getProperty("isMyCompanyView");
            if (iIsMyCompanyView === 1) {
                return {
                    key: "My Owner",
                    text: "{splI18NModel>MY_COMPANY_DISPLAY_AREAS}"
                };
            } else {
                return {
                    key: sOwnerName,
                    text: sOwnerName
                };
            }
        });

        this.oMainSettingsObject = {};

        this.byId("isPublicColumn").setVisible(splReusable.libs.SapSplModelFormatters.sapSplGetVisibilityBasedOnSubscriptionModel(sap.ui.getCore().getModel("sapSplAppConfigDataModel").getData()["canPublishDisplayArea"]));
        this.byId("SapSplEditDisplayAreaSettingsTable").getBinding("items").sort(oSorter);
    },

    fnHandleChangeOfName: function(oEvent) {
        this.fnMaintainMainSettingsObject(oEvent.getParameters().newValue, "Name", oEvent.getSource().getBindingContext().getProperty(), "Header");
    },

    fnHandleSelectOfFavourite: function(oEvent) {
        this.fnMaintainMainSettingsObject((oEvent.getParameters().selected === true) ? "1" : "0", "Favourite", oEvent.getSource().getBindingContext().getProperty(), "DisplayArea");
    },

    fnHandleSelectOfDefault: function(oEvent) {
        if (oEvent.getParameters().selected === true) {
            this.getView().getViewData().oMapInstance.defaultDisplayArea = oEvent.getSource().getBindingContext().getProperty();
        }
        this.fnMaintainMainSettingsObject((oEvent.getParameters().selected === true) ? "1" : "0", "isDefault", oEvent.getSource().getBindingContext().getProperty(), "DisplayArea");
    },

    fnHandleSelectOfPublic: function(oEvent) {
        this.fnMaintainMainSettingsObject((oEvent.getParameters().selected === true) ? "1" : "0", "isPublic", oEvent.getSource().getBindingContext().getProperty(), "Header");
    },

    fnHandleDeleteOfDisplayArea: function(oEvent) {
        var oObject = oEvent.getSource().getBindingContext().getProperty();
        this.oMainSettingsObject[oObject.LocationID] = {};
        this.oMainSettingsObject[oObject.LocationID]["Header"] = {
                "LocationID": oObject["LocationID"],
                "Name": oObject["Name"],
                "OwnerID": oObject["OwnerID"],
                "Geometry": JSON.parse(oObject["Geometry"]),
                "Type": "L00002",
                "ChangeMode": "D"
        };
        oEvent.getSource().getParent().$().css("display","none");
    },

    fnMaintainMainSettingsObject: function(sValue, sProperty, oObject, sPayloadProperty) {
        if (!this.oMainSettingsObject[oObject.LocationID]) {
            this.oMainSettingsObject[oObject.LocationID] = {};
        }
        if (!this.oMainSettingsObject[oObject.LocationID][sPayloadProperty]) {
            this.oMainSettingsObject[oObject.LocationID][sPayloadProperty] = {};
            if (sPayloadProperty === "Header") {
                this.oMainSettingsObject[oObject.LocationID][sPayloadProperty] = {
                        "LocationID": oObject["LocationID"],
                        "Name": oObject["Name"],
                        "OwnerID": oObject["OwnerID"],
                        "Type": "L00002",
                        "ChangeMode": "U",
                        "Geometry": JSON.parse(oObject["Geometry"]),
                        "isPublic": oObject["isPublic"].toString()
                };
            } else {
                this.oMainSettingsObject[oObject.LocationID][sPayloadProperty] = {
                        "UUID": sap.ui.getCore().getModel("loggedOnUserModel").getData().profile.UUID,
                        "LocationID": oObject["LocationID"],
                        "Favourite": oObject["Favourite"].toString(),
                        "isDefault": oObject["isDefault"].toString(),
                        "ChangeMode": "U"
                };
            }
        }

        this.oMainSettingsObject[oObject.LocationID][sPayloadProperty][sProperty] = sValue;
    },

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
        this.oSapSplDisplayAreaSettingsSaveButton = new sap.m.Button({
            text: "{splI18NModel>NEW_CONTACT_SAVE}",
            press: jQuery.proxy(this.fnHandlePressOfSaveDisplayAreaSettings, this)
        });

        this.oSapSplDisplayAreaSettingsCancelButton = new sap.m.Button({
            text: "{splI18NModel>CANCEL}",
            press: jQuery.proxy(this.fnHandlePressOfCancelDisplayAreaSettings, this)
        });

        this.oParentDialogInstance.setBeginButton(this.oSapSplDisplayAreaSettingsSaveButton);
        this.oParentDialogInstance.setEndButton(this.oSapSplDisplayAreaSettingsCancelButton);
    },

    fnHandlePressOfSaveDisplayAreaSettings: function () {
        
        var that = this;
        var oPayLoad = {}, aDisplayArea = [];
        oPayLoad["Header"] = [];
        oPayLoad["Personalization"] = {};
        
        jQuery.each(this.oMainSettingsObject, function (key, oObject) {
            if (oObject["Header"]) {
                oPayLoad["Header"].push(oObject["Header"]);
            }
            if (oObject["DisplayArea"]) {
                aDisplayArea.push(oObject["DisplayArea"]);
            }
        });
        
        oPayLoad["Personalization"].DisplayArea = aDisplayArea;
        oPayLoad["inputHasChangeMode"] = true;

        var oSaveLocationUrl = oSapSplUtils.getServiceMetadata("newLocation", true);
        oSapSplBusyDialog.getBusyDialogInstance({
            title: oSapSplUtils.getBundle().getText("BUSY_DIALOG_MESSAGE")
        }).open();
        
        oSapSplAjaxFactory.fireAjaxCall({
            url: oSaveLocationUrl,
            method: "PUT",
            data: JSON.stringify(oPayLoad),
            success: function (data, success, messageObject) {
                if (data.constructor === String) {
                    data = JSON.parse(data);
                }
                if (messageObject["status"] === 200 && data["Error"].length === 0) {
                    that.oParentDialogInstance.close();
                    oSapSplBusyDialog.getBusyDialogInstance().close();
                    sap.ca.ui.message.showMessageToast(oSapSplUtils.getBundle().getText("CHANGES_SAVED_SUCCESS"));
                    oSapSplUtils.setIsDirty(false);
                } else {
                    sap.ca.ui.message.showMessageBox({
                        type: sap.ca.ui.message.Type.ERROR,
                        message: oSapSplUtils.getErrorMessagesfromErrorPayload(data)["errorWarningString"],
                        details: oSapSplUtils.getErrorMessagesfromErrorPayload(data)["ufErrorObject"]
                    });

                    oSapSplBusyDialog.getBusyDialogInstance().close();
                }
            },
            error: function (error) {
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
                oSapSplBusyDialog.getBusyDialogInstance().close();
                jQuery.sap.log.error(error["status"], error.statusText, "CreateDisplayAreaDialog.controller.js");
            },
            complete: function () {
                
            }
        });
    },

    fnHandlePressOfCancelDisplayAreaSettings: function (oEvent) {
        oEvent.getSource().getParent().close();
        oEvent.getSource().getParent().destroy();
    }

});