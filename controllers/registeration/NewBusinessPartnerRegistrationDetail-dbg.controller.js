/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.require("sap.ca.ui.message.message");
jQuery.sap.require("sap.m.MessageBox");

sap.ui.controller("splController.registeration.NewBusinessPartnerRegistrationDetail", {

    /**
     * @description Method to handle localization of all the hard code texts in the view.
     * @param void.
     * @returns void.
     * @since 1.0
     */
    fnDefineControlLabelsFromLocalizationBundle: function () {
        this.byId("NewBusinessPartnerRegistrationDetailPage").setTitle(oSapSplUtils.getBundle().getText("NEW_BUSINESS_PARTNER_TITLE"));
        this.byId("newBusinessPartnerCancel").setText(oSapSplUtils.getBundle().getText("MY_COLLEAGUES_CANCEL_BUTTON"));
        this.byId("MainContactInfoTitle").setText(oSapSplUtils.getBundle().getText("MAIN_CONTACT_INFO_TITLE"));
        this.byId("sapSplBusinessPartnerEditCompanyName").setText(oSapSplUtils.getBundle().getText("COMPANY_NAME"));
        this.byId("sapSplBusinessPartnerEditStreet").setText(oSapSplUtils.getBundle().getText("STREET"));
        this.byId("sapSplBusinessPartnerEditTown").setText(oSapSplUtils.getBundle().getText("TOWN"));
        this.byId("sapSplBusinessPartnerEditDistrict").setText(oSapSplUtils.getBundle().getText("DISTRICT"));
        this.byId("sapSplBusinessPartnerEditCountry").setText(oSapSplUtils.getBundle().getText("COUNTRY"));
        this.byId("sapSplBusinessPartnerEditPhone").setText(oSapSplUtils.getBundle().getText("PHONE"));
        this.byId("sapSplBusinessPartnerEditFirstName").setText(oSapSplUtils.getBundle().getText("FIRST_NAME"));
        this.byId("sapSplBusinessPartnerEditLastName").setText(oSapSplUtils.getBundle().getText("LAST_NAME"));
        this.byId("sapSplBusinessPartnerEditEmail").setText(oSapSplUtils.getBundle().getText("EMAIL"));
        this.byId("sapSplBusinessPartnerEditDesignation").setText(oSapSplUtils.getBundle().getText("DESIGNATION"));

        this.byId("newBusinessPartnerCancel").setTooltip(oSapSplUtils.getBundle().getText("MY_COLLEAGUES_CANCEL_BUTTON"));
        this.byId("newBusinessPartnerInvite").setTooltip(oSapSplUtils.getBundle().getText("NEW_CONTACT_INVITE"));
    },

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     */
    onInit: function () {

        /*unified shell instance - which is the super parent of this view*/
        this.unifiedShell = null;

        /*SAPUI5 JSONModel - to be set to NewBusinessPartnerRegistrationDetail view*/
        var myBusinessPartnerRegisterEditModel = new sap.ui.model.json.JSONModel();

        /*
         * Making the myBusinesspartnerRegisterEditModel as a named model.
         * 1. Easily accessible from other views and model data manipulation becomes easy.
         * 2. To enable multiple model setting on the view.
         * */
        sap.ui.getCore().setModel(myBusinessPartnerRegisterEditModel, "myBusinessPartnerRegisterEditModel");

        this.getView().setModel(sap.ui.getCore().getModel("myBusinessPartnerRegisterEditModel"));

        this.fnDefineControlLabelsFromLocalizationBundle();
    },

    /**
     * @description listens to event handling channel which is previously subscribed. This is the default call back when any navigation happens to this view.
     * It is called even before the onBeforeRendering life cycle method of the view.
     * @param evt event object of the navigation event.
     * @returns void.
     * @since 1.0
     */
    onBeforeShow: function (evt) {

        this.getView().byId("newBusinessPartnerInvite").setText(oSapSplUtils.getBundle().getText("NEW_CONTACT_INVITE"));

        /*Setting new Business Partner data as the myBusinessPartnerRegisterEditModel's data so that the view behaves as an edit screen for the respective Business Partner.*/

        oSapSplUtils.setIsDirty(false);
        //evt.data.context["ChangedFlag"] = false;
        evt.data.context["isCancel"] = false;
        sap.ui.getCore().getModel("myBusinessPartnerRegisterEditModel").setData(evt.data.context);

        if (oSapSplUtils.getCurrentDetailPageBP().sId === "MyBusinessPartnerDetail") {
            this.byId("NewBusinessPartnerRegistrationDetailPage").setShowNavButton();
        }

    },

    /**
     * @description Getter method to get the unified shell instance which is the super parent of this view.
     * @param void.
     * @returns this.unifiedShell the unified shell instance previously set to this view during instantiation.
     * @since 1.0
     */
    getUnifiedShellInstance: function () {
        return this.unifiedShell;
    },

    /**
     * @description Setter method to set the unified shell instance which is the super parent of this view.
     * @param void.
     * @returns void.
     * @since 1.0
     */
    setUnifiedShellInstance: function (oUnifiedShellInstance) {
        this.unifiedShell = oUnifiedShellInstance;
    },

    /**
     * @description removes all '_' with '.' required for to create Business Partner
     * @params {object} Data obtained from "myBusinessPartnerRegisterEditModel" model
     * @returns {object} Data for creating Business Partner
     * @since 1.0
     * */
    getDataInPostFormat: function (data) {
        var _data = {};
        $.each(data, function (key, value) {
            _data[key.replace("_", ".")] = value;
        });
        return _data;
    },

    /**
     * @description prepares payload in the format required to create Business Partner
     * @params {object} Data obtained from "myBusinessPartnerRegisterEditModel" model
     * @returns {object} Data for creating Business Partner
     * @since 1.0
     * */
    preparePayLoad: function (data) {
        var header = [],
            UUID, roles = [],
            payload = {};
        header[0] = {};
        roles[0] = {};

        data["POC"] = this.getDataInPostFormat(data["POC"]);

        UUID = oSapSplUtils.getUUID();
        header[0]["UUID"] = UUID;
        header[0]["BasicInfo.ID"] = null;
        header[0]["BasicInfo.CompanyID"] = null;
        header[0]["BasicInfo.Type"] = "O";
        header[0]["Organization.Name"] = data["Organization.Name"];
        header[0]["Organization.RegistrationNumber"] = data["Organization.RegistrationNumber"];
        header[0]["Organization.Registry"] = data["Organization.Registry"];
        header[0]["PersonName.GivenName"] = data["POC"]["PersonName.GivenName"];
        header[0]["PersonName.JobFunction"] = data["POC"]["PersonName.JobFunction"];
        header[0]["PersonName.Surname"] = data["POC"]["PersonName.Surname"];
        header[0]["PersonName.SurnamePrefix"] = data["PersonName.SurnamePrefix"];
        header[0]["PersonName.Title"] = data["PersonName.Title"];
        header[0]["PostalAddress.Street"] = data["PostalAddress.Street"];
        header[0]["PostalAddress.StreetName"] = data["PostalAddress.StreetName"];
        header[0]["PostalAddress.Town"] = data["PostalAddress.Town"];
        header[0]["PostalAddress.District"] = data["PostalAddress.District"];
        header[0]["PostalAddress.PostalCode"] = data["PostalAddress.PostalCode"];
        header[0]["PostalAddress.Country"] = data["PostalAddress.Country"];
        header[0]["CommunicationInfo.EmailAddress"] = data["POC"]["CommunicationInfo.EmailAddress"];
        header[0]["CommunicationInfo.Fax"] = data["CommunicationInfo.Fax"];
        header[0]["CommunicationInfo.Phone"] = data["CommunicationInfo.Phone"];
        header[0]["CommunicationInfo.Website"] = data["CommunicationInfo.Website"];

        header[0]["Owner"] = oSapSplUtils.getCompanyDetails().Owner.results[0].Owner;

        header[0]["InvitedByOrganization"] = oSapSplUtils.getCompanyDetails()["UUID"];

        /* RequestType = 0 for Self registration & Request = 1 for Invite Scenario */
        header[0]["RequestType"] = "1";
        header[0]["RequestStatus"] = "0";
        header[0]["isDeleted"] = "0";

        roles[0]["UUID"] = oSapSplUtils.getUUID();
        roles[0]["Request"] = UUID;
        roles[0]["Role"] = data["Role"];
        roles[0]["isDeleted"] = "0";

        payload["Header"] = header;
        payload["Roles"] = roles;

        return payload;

    },

    /**
     * @description triggered on click of invite/save button
     * Prepares payload required for invite/edit scenarios & Create/Update the Business Partner
     * @returns void.
     * @since 1.0
     * */
    fireInvite: function () {

        var oPayLoad;

        oSapSplBusyDialog.getBusyDialogInstance({
            title: oSapSplUtils.getBundle().getText("BUSY_DIALOG_MESSAGE")
        }).open();

        oPayLoad = this.preparePayLoad(this.getDataInPostFormat(sap.ui.getCore().getModel("myBusinessPartnerRegisterEditModel").getData()));
        if (oPayLoad.Header[0].Owner !== null) {
            window.setTimeout(function () {
            	oSapSplAjaxFactory.fireAjaxCall({
                    url: oSapSplUtils.getFQServiceUrl("/sap/spl/xs/app/services/businessPartnerRegistration.xsjs"),
                    method: "POST",
                    async: false,
                    data: JSON.stringify(oPayLoad),
                    success: function (data, success, messageObject) {
                        oSapSplBusyDialog.getBusyDialogInstance().close();
                        if (data.constructor === String) {
                            data = JSON.parse(data);
                        }
                        if (messageObject["status"] === 200 && data["Error"].length === 0) {

                            var oCustomData = new sap.ui.core.CustomData({
                                key: "bRefreshTile",
                                value: true
                            });
                            oSplBaseApplication.getAppInstance().getCurrentPage().destroyCustomData();
                            oSplBaseApplication.getAppInstance().getCurrentPage().addCustomData(oCustomData);

                            sap.ca.ui.message.showMessageToast(oSapSplUtils.getBundle().getText("INVITATION_SENT_SUCCESSFULLY_MSG"));
                        } else {
                            sap.ca.ui.message.showMessageBox({
                                type: oSapSplUtils.getErrorMessagesfromErrorPayload(data)["messageTitle"],
                                message: oSapSplUtils.getErrorMessagesfromErrorPayload(data)["errorWarningString"],
                                details: oSapSplUtils.getErrorMessagesfromErrorPayload(data)["ufErrorObject"]
                            });
                        }

                        oSapSplUtils.getCurrentMasterPageBP().byId("myBusinessPartnerList").addCustomData(new sap.ui.core.CustomData({
                            key: data.Header[0]["UUID"]
                        }));

                        sap.ui.getCore().getModel("myBusinessPartnerListODataModel").refresh();

                        oSapSplUtils.setIsDirty(false);
                    },
                    error: function (error) {
                        oSapSplBusyDialog.getBusyDialogInstance().close();
                        if (error && error["status"] === 500) {
                            sap.ca.ui.message.showMessageBox({
                                type: sap.ca.ui.message.Type.ERROR,
                                message: error["status"] + " " + error.statusText,
                                details: error.responseText
                            });
                        } else {
                            sap.ca.ui.message.showMessageBox({
                                type: oSapSplUtils.getErrorMessagesfromErrorPayload(JSON.parse(error.responseText))["messageTitle"],
                                message: oSapSplUtils.getErrorMessagesfromErrorPayload(JSON.parse(error.responseText))["errorWarningString"],
                                details: oSapSplUtils.getErrorMessagesfromErrorPayload(JSON.parse(error.responseText))["ufErrorObject"]
                            });
                        }
                        oSapSplUtils.setIsDirty(true);
                    },
                    complete: function () {

                    }

                });
            }, 20);
        } else {
            oSapSplBusyDialog.getBusyDialogInstance().close();
        }

    },

    /**
     * @description calls when cancel button is pressed & navigates back to detail page
     * @params void
     * @returns voidFwindow
     * @since 1.0
     * */
    navigationToDetailPage: function () {

        var that = this,
            sdetailObject, modelData;
        modelData = sap.ui.getCore().getModel("myBusinessPartnerRegisterEditModel").getData();
        modelData["isCancel"] = true;
        sap.ui.getCore().getModel("myBusinessPartnerRegisterEditModel").setData(modelData);
        sdetailObject = jQuery.extend(true, {}, sap.ui.getCore().getModel("myBusinessPartnerDetailModel").getData());

        if (oSapSplUtils.getIsDirty()) {
            sap.m.MessageBox.show(
                oSapSplUtils.getBundle().getText("DATA_LOSS_WARNING_TEXT"), sap.m.MessageBox.Icon.WARNING, oSapSplUtils.getBundle().getText("WARNING"), [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL], function (selection) {
                    if (selection === "YES") {
                        jQuery.proxy(that.callToNavInDetailBP(sdetailObject), that);
                        that.selectMasterListItemOnBackNavigation("myBusinessPartnerDetailModel");
                        oSapSplUtils.setIsDirty(false);
                    }
                }, null, oSapSplUtils.fnSyncStyleClass( "messageBox" ));
        } else {
            sdetailObject = jQuery.extend(true, {}, sap.ui.getCore().getModel("myBusinessPartnerDetailModel").getData());
            this.callToNavInDetailBP(sdetailObject);
            this.selectMasterListItemOnBackNavigation("myBusinessPartnerDetailModel");
        }
    },

    /**
     * @description Call to navInDetailBP function of event bus for navigating to detail page with model data
     * @params {object} modelData
     * @returns void
     * @since 1.0
     * */
    callToNavInDetailBP: function (modelData) {
        var bus = sap.ui.getCore().getEventBus();
        bus.publish("navInDetailBP", "to", {
            from: this.getView(),
            data: {
                context: modelData
            }
        });
    },

    /**
     * @description selects master list item on back navigation
     * @params {object} modelname
     * @returns void
     * @since 1.0
     * */
    selectMasterListItemOnBackNavigation: function (modelName) {
        var sIndex, currentBP, masterList;
        currentBP = sap.ui.getCore().getModel(modelName).getData();
        masterList = oSapSplUtils.getCurrentMasterPageBP().byId("myBusinessPartnerList");
        for (sIndex = 0; sIndex < masterList.getItems().length; sIndex++) {
            if (masterList.getItems()[sIndex].sId.indexOf("myBusinessPartnerListItem") !== -1) {
                if (masterList.getItems()[sIndex].getBindingContext().getProperty().UUID === currentBP.UUID) {
                    masterList.setSelectedItem(masterList.getItems()[sIndex]);
                    break;
                }
            }
        }
    },

    /**
     * @description Called when any Input fields is changes. sets isDirtyFlag to true in Utils
     * @returns void.
     * @since 1.0
     * */
    fnToCaptureLiveChangeToSetFlag: function () {
        if (!oSapSplUtils.getIsDirty()) {
            oSapSplUtils.setIsDirty(true);
        }
    },

    /**
     * @description called when button on Header bar is pressed. Navigated to previous page
     * @params {object} oEvent
     * @returns void
     * @since 1.0
     * */
    fnHandlePressOfBackButton: function () {
        var bus = sap.ui.getCore().getEventBus(),
            that = this;

        if (oSapSplUtils.getIsDirty()) {
            sap.m.MessageBox.show(
                oSapSplUtils.getBundle().getText("DATA_LOSS_WARNING_TEXT"), sap.m.MessageBox.Icon.WARNING, oSapSplUtils.getBundle().getText("WARNING"), [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL], function (selection) {
                    if (selection === "YES") {
                        bus.publish("navInDetailBP", "back", {
                            from: that.getView()
                        });
                    }
                }, null, oSapSplUtils.fnSyncStyleClass( "messageBox" ));
        } else {
            bus.publish("navInDetailBP", "back", {
                from: that.getView()
            });
        }

    }

});
