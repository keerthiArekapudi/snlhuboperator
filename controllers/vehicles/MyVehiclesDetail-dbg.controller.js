/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.controller("splController.vehicles.MyVehiclesDetail", {

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     */
    onInit: function () {
        var oSapSplMyVehicleDetailModel = null;

        oSapSplMyVehicleDetailModel = new sap.ui.model.json.JSONModel({
            noData: true,
            isClicked: false,
            showFooterButtons: false
        });
        sap.ui.getCore().setModel(oSapSplMyVehicleDetailModel, "SapSplMyVehicleDetailModel");
        this.getView().setModel(sap.ui.getCore().getModel("SapSplMyVehicleDetailModel"));

        this.byId("vehicleDetailEdit").setEnabled(false);
        this.byId("vehicleDetailDeRegister").setEnabled(false);
        this.byId("vehicleDetailActivate_DeActicate").setEnabled(false);

        this.byId("sapSplSharePermissionsLayout").getBinding("content").filter(new sap.ui.model.Filter("showBupa", sap.ui.model.FilterOperator.EQ, true));
        this.byId("sapSplSharePermissionsLayout").addEventDelegate({
            onAfterRendering: jQuery.proxy(this.fnHandleOnAfterRenderingOfSharedPermissionsLayout, this)
        });

        /*Localization*/
        this.fnDefineControlLabelsFromLocalizationBundle();

    },

    fnHandleSelectOfIconTabBar: function (oEvent) {
    	/* Fix for Incident : 1580118388 1580121506 */
    	if (oEvent.getParameters().key !== "info") {
    		if (this.byId("vehicleDetailEdit").getEnabled() === false) {
    			this.byId("sapSplAddBupaSectionTitle").setText(oSapSplUtils.getBundle().getText("NOT_SHARED_YET_MESSAGE_DEREGISTERED"));
    		}
    	}
    },
    
    /**
     * @description Method to handle the onAfterRender event of the shared permission layout.
     * @param {object} oEvent event object.
     * @returns void.
     * @since 1.0
     */
    fnHandleOnAfterRenderingOfSharedPermissionsLayout: function (oEvent) {
        if (oEvent.srcControl.getBinding("content") && oEvent.srcControl.getContent().length > 0) {
            this.byId("sapSplAddBupaSectionTitle").setText(oSapSplUtils.getBundle().getText("SHARED_WITH"));
        } else {
            /* CSNFIX 0120031469 787816     2014 */
            if (sap.ui.getCore().getModel("SapSplMyVehicleDetailModel").getData()["isEdit"]) {
                this.byId("sapSplAddBupaSectionTitle").setText(oSapSplUtils.getBundle().getText("NOT_SHARED_YET_MESSAGE_IN_EDIT_MODE"));
            } else {
                this.byId("sapSplAddBupaSectionTitle").setText(oSapSplUtils.getBundle().getText("NOT_SHARED_YET_MESSAGE"));
            }
        }
    },

    /**
     * @description Method to handle localization of all the hard code texts in the view.
     * @param void.
     * @returns void.
     * @since 1.0
     */
    fnDefineControlLabelsFromLocalizationBundle: function () {
        this.byId("SapSplVehicleRegistrationNumberLabel").setText(oSapSplUtils.getBundle().getText("VEHICLE_REGISTRATION_NUMBER"));
        this.byId("SapSplVehicleVehicleTypeLabel").setText(oSapSplUtils.getBundle().getText("VEHICLE_TYPE"));
        this.byId("SapSplVehiclePublicName").setText(oSapSplUtils.getBundle().getText("VEHICLE_PUBLIC_NAME"));
        this.byId("SapSplVehicleDeviceType").setText(oSapSplUtils.getBundle().getText("DEVICE_TYPE"));
        this.byId("SapSplVehicleDeviceID").setText(oSapSplUtils.getBundle().getText("DEVICE_ID"));
        this.byId("MyVehiclesDetailTruckTitle").setText(oSapSplUtils.getBundle().getText("TRUCK_DETAILS_TITLE"));
        this.byId("MyVehiclesDetailDeviceTitle").setText(oSapSplUtils.getBundle().getText("DEVICE_DETAILS_TITLE"));
        this.byId("vehicleDetailEdit").setText(oSapSplUtils.getBundle().getText("MY_COLLEAGUES_EDIT_BUTTON"));
        this.byId("vehicleDetailActivate_DeActicate").setText(oSapSplUtils.getBundle().getText("MY_VEHICLES_ACTIVATE"));
        this.byId("vehicleDetailDeRegister").setText(oSapSplUtils.getBundle().getText("MY_VEHICLES_DEREGISTER"));
        this.byId("SapSplVehicleDriver").setText(oSapSplUtils.getBundle().getText("DRIVER_NAME"));
        this.byId("sapSplVehicleDetailNoDataLabel").setText(oSapSplUtils.getBundle().getText("NO_TRUCKS_TEXT"));
        this.byId("sapSplAddBupaForSharingButton").setText(oSapSplUtils.getBundle().getText("ADD_BUSINESS_PARTNER"));
        this.byId("vehicleSharePermissionsEditSave").setText(oSapSplUtils.getBundle().getText("NEW_CONTACT_SAVE"));
        this.byId("vehicleSharedPermissionEditCancel").setText(oSapSplUtils.getBundle().getText("MY_COLLEAGUES_CANCEL_BUTTON"));
        /* CSNFIX : 0120061532 0001323038 2014 */
        this.byId("MyVehiclesDetailPage").setTitle(oSapSplUtils.getBundle().getText("TRUCK"));
        this.byId("sapSplRemoveSharePermissionLink").setText(oSapSplUtils.getBundle().getText("VEHICLE_BUPA_PERMISSION_UNSHARE"));
    },

    /**
     * @description Method to handle the click of "Add Bupa for sharing" button.
     * @param void.
     * @returns void.
     * @since 1.0
     */
    handlePressOfAddBupaForSharing: function () {
        var aSharedBupaDetails = [];
        this.aSharedBupaDetails = [];
        if (!this.oAddBupaForSharingDialog) {
            this.oAddBupaForSharingDialog = new sap.m.Dialog({
                title: oSapSplUtils.getBundle().getText("ADD_BUSINESS_PARTNER_DIALOG_TITLE"),
                content: new sap.m.List({
                    mode: "MultiSelect",
                    items: {
                        path: "/",
                        template: new sap.m.StandardListItem("sapSplSelectBuPaListItem",{
                            title: "{Partner_Name}",
                            selected: "{showBupa}"
                        })
                    },
                    select: jQuery.proxy(this.fnHandleSelectOfListItemOfSharedPermissions, this)
                }),
                beginButton: new sap.m.Button({
                    text: oSapSplUtils.getBundle().getText("OK"),
                    press: jQuery.proxy(this.fnHandleOKOfAddBupaDialog, this)
                }),
                endButton: new sap.m.Button({
                    text: oSapSplUtils.getBundle().getText("CANCEL"),
                    press: jQuery.proxy(this.fnHandleCancelOfAddBupaDialog, this)
                })

            }).addStyleClass("SapSplFilterDialog");
        }

        this.oAddBupaForSharingDialog.attachAfterOpen(function (oEvent) {
            oSapSplUtils.fnSyncStyleClass(oEvent.getSource());
        });

        if (sap.ui.getCore().getModel("SapSplMyVehicleDetailModel").getData()["BupaPermissions"]) {
            aSharedBupaDetails = sap.ui.getCore().getModel("SapSplMyVehicleDetailModel").getData()["BupaPermissions"];
        }

        for (var i = 0; i < aSharedBupaDetails.length; i++) {
            this.aSharedBupaDetails.push(jQuery.extend(true, {}, aSharedBupaDetails[i]));
        }

        var oModel = new sap.ui.model.json.JSONModel(this.getDataForDialog(this.aSharedBupaDetails, this.byId("sapSplSharePermissionsLayout")));

        this.oAddBupaForSharingDialog.setModel(oModel);

        this.oAddBupaForSharingDialog.open();

    },

    /**
     * @description Method to handle the select event of the list items in shared permissions screen.
     * @param {object} oEvent event object.
     * @returns void.
     * @since 1.0
     */
    fnHandleSelectOfListItemOfSharedPermissions: function (oEvent) {
        oSapSplUtils.setIsDirty(true);
        var oBoundObject = null,
        oSharedPermInfo = null,
        oModelData = null;
        oBoundObject = oEvent.getParameters().listItem.getBindingContext().getObject();
        if (!oEvent.getParameters().listItem.getSelected()) {
            oModelData = sap.ui.getCore().getModel("SapSplMyVehicleDetailModel").getData();
            oSharedPermInfo = oModelData["oSharedPermissionInfo"];
            if (oBoundObject["RelationUUID"]) {
                oSharedPermInfo[oBoundObject["Partner"]] = this.getSharePermissionsPayLoad(oBoundObject, "D");
            } else {
                if (oSharedPermInfo[oBoundObject["Partner"]]) {
                    delete oSharedPermInfo[oBoundObject["Partner"]];
                }
            }
            oModelData["oSharedPermissionInfo"] = oSharedPermInfo;
            sap.ui.getCore().getModel("SapSplMyVehicleDetailModel").setData(oModelData);
        }
    },

    /**
     * @description Method to prepare the payload for share permissions scenario.
     * @param {object} oBoundObject object bound to the Bupa.
     * @param {string} sChangeMode changeMode for the relation object
     * @returns {object} oPayload payload for sharing permissions with the respective Bupa.
     * @since 1.0
     */
    getSharePermissionsPayLoad: function (oBoundObject, sChangeMode) {
        var oPayload = {};
        oPayload["FromPartner"] = oSapSplUtils.getCompanyDetails()["UUID"];
        oPayload["ToPartner"] = oBoundObject["Partner"];
        oPayload["Relation"] = this.getRelationValue(oSapSplUtils.getCompanyDetails()["Role"], oBoundObject["Role"]);
        oPayload["Text"] = "";

        oPayload["ObjectType"] = "Vehicle";
        oPayload["InstanceUUID"] = oBoundObject["UUID"];
        if (!oBoundObject["RelationUUID"]) {
            oPayload["UUID"] = oSapSplUtils.getUUID();
        } else {
            oPayload["UUID"] = oBoundObject["RelationUUID"];
        }
        if (sChangeMode === "I") {
            oPayload["Status"] = "1";
        } else {
            oPayload["Status"] = "0";
        }
        oPayload["ChangeMode"] = sChangeMode;
        return oPayload;
    },

    /**
     * @description Method to fetch the relation value for shared permissions post.
     * This fetch is based on the fromRole and toRole, for relation creation.
     * @param {string} sFromRole Role name for from Partner.
     * @param {string} sToRole Role name for to Partner.
     * @returns {string} sRelationName relation name for the relation between from role and to role.
     * @since 1.0
     */
    getRelationValue: function (sFromRole, sToRole) {
        var oModel = sap.ui.getCore().getModel("myConfigODataModel"),
        sRelationName = "";
        var oDataModelContext = null,
        oDataModelFilters = "$filter=FromRole eq '" + sFromRole + "' and ToRole eq '" + sToRole + "' and Scope eq 'SHARE_VEHICLE'",
        bIsAsync = false;
        var sUrl = "/BusinessPartnerRoleRelation";
        if (oModel) {
            oModel.read(sUrl, oDataModelContext, oDataModelFilters, bIsAsync,
                    function (data) {
                if (data.results.length > 0) {
                    sRelationName = data.results[0]["Name"];
                } else {
                    sRelationName = "";
                }
            }, jQuery.proxy(this.errorOfRolesOdata, this));
        }
        return sRelationName;
    },

    /**
     * @description Method to prepare data for the Bupa dialog, pre-checked with shared bupa's.
     * @param {array} aSharedBupaDetails array of all bupa's.
     * @param {array} aGridData data of the grid which contains the current selection of bups's
     * @returns {array} aSharedBupaDetails array of Bupa objects, with "showBupa" as true for already selected Bupas.
     * @since 1.0
     */
    getDataForDialog: function (aSharedBupaDetails, aGridData) {

        this.aSharedBupaDetailsPreviouslySelected = [];
        for (var k = 0; k < aSharedBupaDetails.length; k++) {
            aSharedBupaDetails[k]["showBupa"] = false;
        }

        for (var i = 0; i < aGridData.getContent().length; i++) {
            for (var j = 0; j < aSharedBupaDetails.length; j++) {
                if (aGridData.getContent()[i].getBindingContext().getObject()["Partner"] === aSharedBupaDetails[j]["Partner"]) {
                    aSharedBupaDetails[j]["showBupa"] = true;
                }
            }
        }

        for (var s = 0; s < aSharedBupaDetails.length; s++) {
            this.aSharedBupaDetailsPreviouslySelected.push(jQuery.extend(true, {}, aSharedBupaDetails[s]));
        }

        return aSharedBupaDetails;
    },

    /**
     * @description Method to handle click of OK button, in the add Bupa dialog.
     * @param void.
     * @returns void.
     * @since 1.0
     */
    fnHandleOKOfAddBupaDialog: function () {
        this.oAddBupaForSharingDialog.close();
        var oModelData = sap.ui.getCore().getModel("SapSplMyVehicleDetailModel").getData();
        oModelData["BupaPermissions"] = this.oAddBupaForSharingDialog.getModel().getData();
        sap.ui.getCore().getModel("SapSplMyVehicleDetailModel").setData(oModelData);
        this.byId("sapSplSharePermissionsLayout").getBinding("content").filter(new sap.ui.model.Filter("showBupa", sap.ui.model.FilterOperator.EQ, true));
    },

    /**
     * @description Method to handle click of Cancel button, in the add Bupa dialog.
     * @param void.
     * @returns void.
     * @since 1.0
     */
    fnHandleCancelOfAddBupaDialog: function () {
        this.oAddBupaForSharingDialog.close();
        var oModelData = sap.ui.getCore().getModel("SapSplMyVehicleDetailModel").getData();
        oModelData["BupaPermissions"] = this.aSharedBupaDetailsPreviouslySelected;
        sap.ui.getCore().getModel("SapSplMyVehicleDetailModel").setData(oModelData);
        this.byId("sapSplSharePermissionsLayout").getBinding("content").filter(new sap.ui.model.Filter("showBupa", sap.ui.model.FilterOperator.EQ, true));

    },

    /**
     * @description Method to handle click of remove permission button.
     * @param {object} oEvent event object.
     * @returns void.
     * @since 1.0
     */
    handlePressOfRemoveSharePermissionButton: function (oEvent) {

        var that = this;

        function fnHandleConfirmationOfUnShare(oBoundObject, that) {
            oSapSplUtils.setIsDirty(true);
            var aSharedPermissionsData = [],
            oSharedPermInfo = null,
            sDeletedUUID = "";

            sDeletedUUID = oBoundObject["Partner"];

            var oModelData = sap.ui.getCore().getModel("SapSplMyVehicleDetailModel").getData();

            aSharedPermissionsData = oModelData["BupaPermissions"];
            oSharedPermInfo = oModelData["oSharedPermissionInfo"];

            for (var i = 0; i < aSharedPermissionsData.length; i++) {
                if (aSharedPermissionsData[i]["Partner"] === sDeletedUUID) {
                    aSharedPermissionsData[i]["showBupa"] = false;
                    break;
                }
            }

            oModelData["BupaPermissions"] = aSharedPermissionsData;

            if (oBoundObject["RelationUUID"]) {
                oSharedPermInfo[oBoundObject["Partner"]] = that.getSharePermissionsPayLoad(oBoundObject, "D");
            } else {
                if (oSharedPermInfo[oBoundObject["Partner"]]) {
                    delete oSharedPermInfo[oBoundObject["Partner"]];
                }
            }
            oModelData["oSharedPermissionInfo"] = oSharedPermInfo;

            sap.ui.getCore().getModel("SapSplMyVehicleDetailModel").setData(jQuery.extend(true, {}, oModelData));
            that.byId("sapSplSharePermissionsLayout").getBinding("content").filter(new sap.ui.model.Filter("showBupa", sap.ui.model.FilterOperator.EQ, true));
        }

        var oBoundObject = oEvent.getSource().getBindingContext().getObject();

        if (oBoundObject["TourCount"] !== null) {
            sap.m.MessageBox.show(
                    oSapSplUtils.getBundle().getText("TRUCK_UNSHARE_CONFIRMATION_MESSAGE"),
                    sap.m.MessageBox.Icon.WARNING,
                    oSapSplUtils.getBundle().getText("PROMPT_FOR_DELETION_DIALOG_TITLE"), [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
                    function (selection) {
                        if (selection === "YES") {
                            fnHandleConfirmationOfUnShare(oBoundObject, that);
                        }
                    }, null, oSapSplUtils.fnSyncStyleClass( "messageBox" )
            );
        } else {
            fnHandleConfirmationOfUnShare(oBoundObject, that);
        }


    },

    /***
     * @description method to handle edit action on the vehicle data.
     * @param {object} oEvent event object of the edit button press.
     * @returns void.
     * @since 1.0
     */
    fireEditAction: function () {

        if (this.byId("sapSplVehiclesDetailViewIconTabBar").getSelectedKey() === "info") {
            var oContext = null;
            oContext = sap.ui.getCore().getModel("SapSplMyVehicleDetailModel").getData();

            /*instance of the SAPUI5 event bus - used to sunscribe or publish events accross the application*/
            var bus = sap.ui.getCore().getEventBus();
            bus.publish("navInDetailVehicle", "to", {
                from: this.getView(),
                data: {
                    /*The object bound to the selected listItem.*/
                    context: jQuery.extend({}, oContext),
                    mode: "Edit"
                }
            });
        } else {
            this.aSharedBupaDetailsBeforeEdit = [];
            this.byId("sapSplVehiclesDetailViewIconTabBar").getItems()[0].setEnabled(false);
            var oModelData = sap.ui.getCore().getModel("SapSplMyVehicleDetailModel").getData();
            oModelData["isEdit"] = true;

            if (oModelData["BupaPermissions"]) {
                for (var i = 0; i < oModelData["BupaPermissions"].length; i++) {
                    this.aSharedBupaDetailsBeforeEdit.push(jQuery.extend(true, {}, oModelData["BupaPermissions"][i]));
                }
            }

            sap.ui.getCore().getModel("SapSplMyVehicleDetailModel").setData(oModelData);
            /* CSNFIX for 1570043779 */
            this.byId("sapSplAddBupaForSharingButton").rerender();
            this.byId("vehicleDetailEdit").setVisible(false);
            this.byId("vehicleDetailActivate_DeActicate").setVisible(false);
            this.byId("vehicleDetailDeRegister").setVisible(false);
            this.byId("vehicleSharePermissionsEditSave").setVisible(true);
            this.byId("vehicleSharedPermissionEditCancel").setVisible(true);
            if ( oModelData["BupaPermissions"] && oModelData["BupaPermissions"].length > 0) {
                this.byId("sapSplAddBupaSectionTitle").setText(oSapSplUtils.getBundle().getText("SHARED_WITH"));
            } else {
                this.byId("sapSplAddBupaSectionTitle").setText(oSapSplUtils.getBundle().getText("NOT_SHARED_YET_MESSAGE_IN_EDIT_MODE"));
            }
        }
    },

    /**
     * @description Method to handle click of save button, in the shared permissions edit scenario.
     * @param void.
     * @returns void.
     * @since 1.0
     */
    fireSaveOfSharedPermissionsEdit: function () {
        var oModelData = null,
        oSharedPermissionsData = null,
        aBupaPermissions = null,
        aSharedPermissionsData = [];
        var that = this;
        oModelData = sap.ui.getCore().getModel("SapSplMyVehicleDetailModel").getData();
        oSharedPermissionsData = oModelData["oSharedPermissionInfo"];
        aBupaPermissions = oModelData["BupaPermissions"];

        for (var i = 0; i < aBupaPermissions.length; i++) {
            if (!aBupaPermissions[i]["RelationUUID"] && aBupaPermissions[i]["showBupa"] === true) {
                oSharedPermissionsData[aBupaPermissions[i]["Partner"]] = this.getSharePermissionsPayLoad(aBupaPermissions[i], "I");
            }
        }

        jQuery.each(oSharedPermissionsData, function (sKey, sValue) {
            aSharedPermissionsData.push(sValue);
        });

        if (aSharedPermissionsData.length > 0) {
            var sUrl = oSapSplUtils.getServiceMetadata("bupa", true);
            var sData = JSON.stringify({
                Relation: aSharedPermissionsData,
                inputHasChangeMode: true
            });
            var ajaxObjSettings = { url : sUrl,
                    method: "PUT",
                    contentType: "json; charset=UTF-8",
                    data:sData,
                    success:jQuery.proxy(that.successFuncSharedPerm,that),
                    error:jQuery.proxy(that.errorFuncSharedPerm,that)
            };

            oSapSplAjaxFactory.fireAjaxCall(ajaxObjSettings);
        } else {
            /* CSNFIX : 1570020255 */
            this.fireCancelOfSharedPermissionsEdit();
        }
    },

    successFuncSharedPerm: function(data, success, messageObject){
        var oModelData = sap.ui.getCore().getModel("SapSplMyVehicleDetailModel").getData();
        if (data.constructor === String) {
            data = JSON.parse(data);
        }
        oSapSplBusyDialog.getBusyDialogInstance().close();
        if (messageObject["status"] === 200) {
            sap.ca.ui.message.showMessageToast(oSapSplUtils.getBundle().getText("SUCCESSFUL_EDIT", oModelData.RegistrationNumber));
            sap.ui.getCore().getModel("myVehiclesListODataModel").refresh();
            oSapSplUtils.setIsDirty(false);
            oModelData["oSharedPermissionInfo"] = {};
            sap.ui.getCore().getModel("SapSplMyVehicleDetailModel").setData(oModelData);
        } else {
            if (data["Error"].length !== 0) {
                var errorMessage = oSapSplUtils.getErrorMessagesfromErrorPayload(data)["ufErrorObject"];
                sap.ca.ui.message.showMessageBox({
                    type: sap.ca.ui.message.Type.ERROR,
                    message: oSapSplUtils.getErrorMessagesfromErrorPayload(data)["errorWarningString"],
                    details: errorMessage
                });
            }
        }
    },

    errorFuncSharedPerm : function(error){
        jQuery.sap.log.error("fireSaveOfSharedPermissionsEdit", "ajax failed", "MyVehiclesDetail.controller.js");
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

    /**
     * @description Method to handle click of cancel button, in the shared permissions edit scenario.
     * @param void.
     * @returns void.
     * @since 1.0
     */
    fireCancelOfSharedPermissionsEdit: function () {
        var that = this;
        if (oSapSplUtils.getIsDirty()) {
            sap.m.MessageBox.show(
                    oSapSplUtils.getBundle().getText("DATA_LOSS_WARNING_TEXT"),
                    sap.m.MessageBox.Icon.WARNING,
                    oSapSplUtils.getBundle().getText("WARNING"), [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
                    function (selection) {
                        if (selection === "YES") {
                            that.byId("sapSplVehiclesDetailViewIconTabBar").getItems()[0].setEnabled(true);
                            var oModelData = sap.ui.getCore().getModel("SapSplMyVehicleDetailModel").getData();
                            oModelData["isEdit"] = false;
                            oModelData["BupaPermissions"] = that.aSharedBupaDetailsBeforeEdit;
                            oModelData["oSharedPermissionInfo"] = {};
                            sap.ui.getCore().getModel("SapSplMyVehicleDetailModel").setData(oModelData);
                            that.byId("vehicleDetailEdit").setVisible(true);
                            that.byId("vehicleDetailActivate_DeActicate").setVisible(true);
                            that.byId("vehicleDetailDeRegister").setVisible(true);
                            that.byId("vehicleSharePermissionsEditSave").setVisible(false);
                            that.byId("vehicleSharedPermissionEditCancel").setVisible(false);

                            if (that.byId("sapSplSharePermissionsLayout").getBinding("content") && that.byId("sapSplSharePermissionsLayout").getContent().length > 0) {
                                that.byId("sapSplAddBupaSectionTitle").setText(oSapSplUtils.getBundle().getText("SHARED_WITH"));
                            } else {
                                that.byId("sapSplAddBupaSectionTitle").setText(oSapSplUtils.getBundle().getText("NOT_SHARED_YET_MESSAGE"));
                            }
                            oSapSplUtils.setIsDirty(false);
                        }
                    }, null, oSapSplUtils.fnSyncStyleClass( "messageBox" )
            );
        } else {
            this.byId("sapSplVehiclesDetailViewIconTabBar").getItems()[0].setEnabled(true);
            var oModelData = sap.ui.getCore().getModel("SapSplMyVehicleDetailModel").getData();
            oModelData["isEdit"] = false;
            oModelData["BupaPermissions"] = this.aSharedBupaDetailsBeforeEdit;
            oModelData["oSharedPermissionInfo"] = {};
            sap.ui.getCore().getModel("SapSplMyVehicleDetailModel").setData(oModelData);
            /* CSNFIX for 1570043779 */
            this.byId("sapSplAddBupaForSharingButton").rerender();
            this.byId("vehicleDetailEdit").setVisible(true);
            this.byId("vehicleDetailActivate_DeActicate").setVisible(true);
            this.byId("vehicleDetailDeRegister").setVisible(true);
            this.byId("vehicleSharePermissionsEditSave").setVisible(false);
            this.byId("vehicleSharedPermissionEditCancel").setVisible(false);

            if (this.byId("sapSplSharePermissionsLayout").getBinding("content") && this.byId("sapSplSharePermissionsLayout").getContent().length > 0) {
                this.byId("sapSplAddBupaSectionTitle").setText(oSapSplUtils.getBundle().getText("SHARED_WITH"));
            } else {
                this.byId("sapSplAddBupaSectionTitle").setText(oSapSplUtils.getBundle().getText("NOT_SHARED_YET_MESSAGE"));
            }
        }


    },

    /***
     * @description method to handle activate / deactivate action of the vehicle data.
     * @param {object} oEvent event object of the edit button press.
     * @returns void.
     * @since 1.0
     */
    fireActivate_DeactiveAction: function (oEvent) {
        var oVehicleData = null,
        oViewData = null,
        oDialogContent = null;
        oVehicleData = sap.ui.getCore().getModel("SapSplMyVehicleDetailModel").getData();

        if (oEvent.getSource().getText() === oSapSplUtils.getBundle().getText("MY_VEHICLES_ACTIVATE")) {
            //Activate
            oSapSplBusyDialog.getBusyDialogInstance({
                title: oSapSplUtils.getBundle().getText("BUSY_DIALOG_MESSAGE")
            }).open();

            oViewData = {
                    "mode": "Activate Truck",
                    "data": oVehicleData
            };

            oDialogContent = new sap.ui.view({
                viewData: oViewData,
                viewName: "splView.dialogs.SplTruckDeviceStatusDialog",
                type: sap.ui.core.mvc.ViewType.XML
            });

            oDialogContent.getController().fnPerformActionBasedOnMode();

        } else if (oEvent.getSource().getText() === oSapSplUtils.getBundle().getText("MY_VEHICLES_DEACTIVATE")) {
            //DeActivate
            oViewData = {
                    "mode": "Deactivate Truck",
                    "data": oVehicleData,
                    "Title": oSapSplUtils.getBundle().getText("VEHICLE_DEACTIVATE_CONFIRMATION")
            };

            oDialogContent = new sap.ui.view({
                viewData: oViewData,
                id: "DialogContent",
                viewName: "splView.dialogs.SplTruckDeviceStatusDialog",
                type: sap.ui.core.mvc.ViewType.XML
            });
            this.oDialog = new sap.m.Dialog({
                title: oSapSplUtils.getBundle().getText("DEACTIVATE_TRUCK"),
                leftButton: new sap.m.Button({
                    text: oSapSplUtils.getBundle().getText("YES"),
                    press: function () {
                        oDialogContent.getController().fnPerformActionBasedOnMode();
                        this.getParent().close();
                    }
                }),
                rightButton: new sap.m.Button({
                    text: oSapSplUtils.getBundle().getText("NO"),
                    press: function () {
                        this.getParent().close();


                    }
                }),
                horizontalScrolling: false
            }).attachAfterClose(function () {
                this.destroy();
            }).attachAfterOpen(function (oEvent) {
                oSapSplUtils.fnSyncStyleClass(oEvent.getSource());
            });
            this.oDialog.addContent(oDialogContent);
            this.oDialog.open();
        }
    },

    /***
     * @description method to handle deregister action on the vehicle data.
     * @param {object} oEvent event object of the edit button press.
     * @returns void.
     * @since 1.0
     */
    fireDeregisterAction: function () {
        //Deregister
        var oVehicleData = null;
        oVehicleData = sap.ui.getCore().getModel("SapSplMyVehicleDetailModel").getData();
        var oViewData = {
                "mode": "Deregister Truck",
                "data": oVehicleData,
                "Title": oSapSplUtils.getBundle().getText("VEHICLE_DEREGISTER_CONFIRMATION")
        };

        var oDialogContent = new sap.ui.view({
            viewData: oViewData,
            id: "DialogContent",
            viewName: "splView.dialogs.SplTruckDeviceStatusDialog",
            type: sap.ui.core.mvc.ViewType.XML
        });
        this.oDialog = new sap.m.Dialog({
            title: oSapSplUtils.getBundle().getText("DEREGISTER_TRUCK"),
            leftButton: new sap.m.Button({
                text: oSapSplUtils.getBundle().getText("YES"),
                press: function () {
                    oDialogContent.getController().fnPerformActionBasedOnMode();
                    this.getParent().close();
                }
            }),
            rightButton: new sap.m.Button({
                text: oSapSplUtils.getBundle().getText("NO"),
                press: function () {

                    this.getParent().close();
                }
            }),
            horizontalScrolling: false
        }).attachAfterClose(function () {
            this.destroy();

        }).attachAfterOpen(function (oEvent) {
            oSapSplUtils.fnSyncStyleClass(oEvent.getSource());
        });
        this.oDialog.addContent(oDialogContent);
        this.oDialog.open();
    },

    /**
     * @description listens to event handling channel which is previously subscribed. This is the default call back when any navigation happens to this view.
     * It is called even before the onBeforeRendering life cycle method of the view.
     * @param evt event object of the navigation event.
     * @returns void.
     * @since 1.0
     */
    onBeforeShow: function (evt) {
        if (evt.data.context) {
            sap.ui.getCore().getModel("SapSplMyVehicleDetailModel").setData(evt.data.context);

            this.getView().getContent()[0].getFooter().getContentRight()[0].setVisible(true);
            this.getView().getContent()[0].getFooter().getContentRight()[1].setVisible(true);
            this.getView().getContent()[0].getFooter().getContentRight()[2].setVisible(true);
            this.getView().getContent()[0].getFooter().getContentRight()[3].setVisible(false);
            this.getView().getContent()[0].getFooter().getContentRight()[4].setVisible(false);

            if (evt.data.context["Status"] === "A") {
                this.getView().getContent()[0].getFooter().getContentRight()[1].setText(oSapSplUtils.getBundle().getText("MY_VEHICLES_DEACTIVATE"));
            } else if (evt.data.context["Status"] === "I") {
                this.getView().getContent()[0].getFooter().getContentRight()[1].setText(oSapSplUtils.getBundle().getText("MY_VEHICLES_ACTIVATE"));
            }
        }
    }

});
