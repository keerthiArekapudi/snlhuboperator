/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.require("sap.ca.ui.message.message");
jQuery.sap.require("sap.m.MessageBox");

sap.ui.controller("splController.registeration.NewContactRegistrationDetail", {

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     */
    onInit: function () {

        /*unified shell instance - which is the super parent of this view*/
        this.unifiedShell = null;

        /*SAPUI5 JSONModel - to be set to NewContactRegistrationDetail view*/
        var myContactsRegisterEditModel = new sap.ui.model.json.JSONModel({});

        /*
         * Making the myContactsRegister_EditModel as a named model.
         * 1. Easily accessible from other views and model data manipulation becomes easy.
         * 2. To enable multiple model setting on the view.
         * */
        sap.ui.getCore().setModel(myContactsRegisterEditModel, "myContactsRegisterEditModel");

        /*Method to bind the roles to the select control*/
        this.bindRoles();

        /*set the json Model to the view*/
        this.getView().setModel(sap.ui.getCore().getModel("myContactsRegisterEditModel"));

        /*Localization*/
        this.fnDefineControlLabelsFromLocalizationBundle();
    },

    /***
     * @description Method to create a JSONModel for the Select control which will display roles in edit mode.
     * @returns void.
     * @param void.
     */
    bindRoles: function () {
        if (!sap.ui.getCore().getModel("splNewContactRegistrationRoles")) {
            var rolesModel = new sap.ui.model.json.JSONModel();
            sap.ui.getCore().setModel(rolesModel, "splNewContactRegistrationRoles");
        }
        this.getView().byId("splNewContactRegistrationRoles").setModel(sap.ui.getCore().getModel("splNewContactRegistrationRoles"));
    },

    /**
     * @description Method to handle localization of all the hard code texts in the view.
     * @param void.
     * @returns void.
     * @since 1.0
     */
    fnDefineControlLabelsFromLocalizationBundle: function () {
        this.byId("NewContactRegistrationDetailPage").setTitle(oSapSplUtils.getBundle().getText("NEW_CONTACT_TITLE", oSapSplUtils.getCompanyDetails()["Organization_Name"]));
        //		this.byId("newContactInvite").setText(oSapSplUtils.getBundle().getText("NEW_CONTACT_INVITE"));
        this.byId("newContactCancel").setText(oSapSplUtils.getBundle().getText("MY_COLLEAGUES_CANCEL_BUTTON"));
        this.byId("sapSplMyUserEditFirstName").setText(oSapSplUtils.getBundle().getText("FIRST_NAME"));
        this.byId("sapSplMyUserEditLastName").setText(oSapSplUtils.getBundle().getText("LAST_NAME"));
        this.byId("sapSplMyUserEditRole").setText(oSapSplUtils.getBundle().getText("ROLE"));
        this.byId("sapSplMyUserEditEmail").setText(oSapSplUtils.getBundle().getText("EMAIL"));
        this.byId("sapSplMyUserEditPhone").setText(oSapSplUtils.getBundle().getText("PHONE"));
    },

    /**
     * @description listens to event handling channel which is previously subscribed. This is the default call back when any navigation happens to this view.
     * It is called even before the onBeforeRendering life cycle method of the view.
     * @param evt event object of the navigation event.
     * @returns void.
     * @since 1.0
     */
    onBeforeShow: function (evt) {
        if (evt.data.sMode && evt.data.sMode === "edit") {
            this.byId("NewContactRegistrationDetailPage").setTitle(oSapSplUtils.getBundle().getText("EDIT_CONTACT_TITLE", [":", evt.data.context["PersonName_GivenName"]]));
            this.isEditMyUser = 1;
            this.byId("sapSplMyUserEditEmailInput").setEnabled(false);
        } else {
            this.byId("NewContactRegistrationDetailPage").setTitle(oSapSplUtils.getBundle().getText("NEW_CONTACT_TITLE", oSapSplUtils.getCompanyDetails()["Organization_Name"]));
            this.isEditMyUser = 0;
            this.sRole = evt.data.context["MainUserRoles_Role1"];
            this.byId("sapSplMyUserEditEmailInput").setEnabled(true);
        }
        if (evt.data.selectEnabled && evt.data.selectEnabled === true) {
            this.getView().byId("splNewContactRegistrationRoles").setEnabled(true);
        } else {
            this.getView().byId("splNewContactRegistrationRoles").setEnabled(false);
        }


        oSapSplUtils.setIsDirty(false);

        /*Setting new contact data as the myContactsRegister_EditModel's data so that the view behaves as an edit screen for the respective contact.*/
        sap.ui.getCore().getModel("myContactsRegisterEditModel").setData(evt.data.context);
    },



    /**
     * @description triggered on click of invite button
     * Navigates back in the detail App.
     * @param evt event object of the click event.
     * @returns void.
     * @since 1.0
     * */
    fireInviteAction: function () {

        function __refreshModel__() {
            sap.ui.getCore().getModel("myContactListODataModel").refresh();
        }

        var oPayLoadForPost, that = this,
            sURL = oSapSplUtils.getFQServiceUrl("/sap/spl/xs/app/services/businessPartnerRegistration.xsjs");

        oSapSplBusyDialog.getBusyDialogInstance({
            title: oSapSplUtils.getBundle().getText("BUSY_DIALOG_MESSAGE")
        }).open();
        if (this.isEditMyUser === 0) {
            if (this.sRole === "Driver") {
                sURL = oSapSplUtils.getFQServiceUrl("/sap/spl/xs/app/services/businessPartner.xsjs");
            }
            oPayLoadForPost = this.preparePayLoadForPost();
            oSapSplAjaxFactory.fireAjaxCall({
                url: sURL,
                method: "POST",
                data: JSON.stringify(oPayLoadForPost),
                success: function (data, success, messageObject) {

                    oSapSplBusyDialog.getBusyDialogInstance().close();

                    oSapSplUtils.setIsDirty(false);

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

                        if (data.RoleAssignment && data.RoleAssignment.length > 0 && data.RoleAssignment[0].Role === "DRIVER") {
                            sap.ca.ui.message.showMessageToast(oSapSplUtils.getBundle().getText("DRIVER_ADDED_SUCCESSFULLY_MSG"));
                        } else {
                            sap.ca.ui.message.showMessageToast(oSapSplUtils.getBundle().getText("INVITATION_SENT_SUCCESSFULLY_MSG"));
                        }


                    } else {
                        sap.ca.ui.message.showMessageBox({
                            type: sap.ca.ui.message.Type.ERROR,
                            message: oSapSplUtils.getErrorMessagesfromErrorPayload(data)["errorWarningString"],
                            details: oSapSplUtils.getErrorMessagesfromErrorPayload(data)["ufErrorObject"]
                        });
                    }

                    oSapSplUtils.getCurrentMasterPage().byId("SapSplMyContactsList").addCustomData(new sap.ui.core.CustomData({
                        key: data.Header[0]["UUID"]
                    }));

                    __refreshModel__();

                },
                error: function (error) {
                    oSapSplBusyDialog.getBusyDialogInstance().close();

                    oSapSplUtils.setIsDirty(true);

                    if (error && error["status"] === 500) {
                        sap.ca.ui.message.showMessageBox({
                            type: sap.ca.ui.message.Type.ERROR,
                            message: error["status"] + "\t" + error.statusText,
                            details: error.responseText
                        });
                    } else {
                        sap.ca.ui.message.showMessageBox({
                            type: sap.ca.ui.message.Type.ERROR,
                            message: oSapSplUtils.getErrorMessagesfromErrorPayload(JSON.parse(error.responseText))["errorWarningString"],
                            details: oSapSplUtils.getErrorMessagesfromErrorPayload(JSON.parse(error.responseText))["ufErrorObject"]
                        });
                    }

                }
            });
        } else {
            if (this.isEditMyUser === 1) {

                /*
                 * Fix for CSN: 1122117 2014
                 */
                if (!oSapSplUtils.getIsDirty()) {
                    sap.ui.getCore().getModel("myContactListODataModel").refresh();
                    return;
                }

                oPayLoadForPost = this.preparePayLoadForPost();
                oSapSplAjaxFactory.fireAjaxCall({
                    url: oSapSplUtils.getFQServiceUrl("/sap/spl/xs/app/services/businessPartner.xsjs"),
                    method: "PUT",
                    data: JSON.stringify(oPayLoadForPost),
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

                            oSapSplUtils.setIsDirty(false);

                            sap.ca.ui.message.showMessageToast(oSapSplUtils.getBundle().getText("SUCCESSFUL_EDIT", data.Header[0]["PersonName.Surname"] + " ," + data.Header[0]["PersonName.GivenName"]));

                            that.fireCancelAction();
                        } else {
                            var errorMessage = oSapSplUtils.getErrorMessagesfromErrorPayload(data)["ufErrorObject"],
                                errorWarningString = oSapSplUtils.getErrorMessagesfromErrorPayload(data)["errorWarningString"];
                            if (errorWarningString.split(" errors")[0] < 1 && errorWarningString.split(" warnings")[0].split("and ")[1] > 0) {
                                sap.ca.ui.message.showMessageBox({
                                    type: sap.ca.ui.message.Type.ERROR,
                                    message: errorWarningString,
                                    details: errorMessage
                                });
                            } else {
                                sap.ca.ui.message.showMessageBox({
                                    type: sap.ca.ui.message.Type.ERROR,
                                    message: errorWarningString,
                                    details: errorMessage
                                });
                            }
                        }

                        oSapSplUtils.getCurrentMasterPage().byId("SapSplMyContactsList").addCustomData(new sap.ui.core.CustomData({
                            key: data.Header[0]["UUID"]
                        }));

                        __refreshModel__();

                    },
                    error: function (error) {

                        oSapSplBusyDialog.getBusyDialogInstance().close();

                        oSapSplUtils.setIsDirty(true);

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

                    }
                });
            }
        }

    },

    /**
     * @description triggered on click of cancel button
     * Navigates back in the detail App.
     * @param evt event object of the click event.
     * @returns void.
     * @since 1.0
     * */
    fireCancelAction: function () {
        /*instance of the SAPUI5 event bus - used to subscribe or publish events across the application*/

        var that = this,
            sdetailObject;
        sdetailObject = jQuery.extend(true, {}, sap.ui.getCore().getModel("myContactDetailModel").getData());

        if (oSapSplUtils.getIsDirty()) {
            sap.m.MessageBox.show(
                oSapSplUtils.getBundle().getText("DATA_LOSS_WARNING_TEXT"),
                sap.m.MessageBox.Icon.WARNING,
                oSapSplUtils.getBundle().getText("WARNING"), [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
                function (selection) {
                    if (selection === "YES") {
                        jQuery.proxy(that.callToNavInDetail(sdetailObject), that);
                        that.selectMasterListItemOnBackNavigation("myContactDetailModel");
                        oSapSplUtils.setIsDirty(false);
                    }
                }
            );
        } else {
            this.callToNavInDetail(sdetailObject);
            this.selectMasterListItemOnBackNavigation("myContactDetailModel");
        }

    },
    /**
     * @description Call to navInDetail function of event bus for navigating to detail page with model data
     * @param {object} modelData
     * @returns void
     * @since 1.0
     * */
    callToNavInDetail: function (modelData) {
        var bus = sap.ui.getCore().getEventBus();
        bus.publish("navInDetail", "to", {
            from: this.getView(),
            data: {
                context: modelData
            }
        });
    },

    /**
     * @description selects master list item on back navigation
     * @param {object} modelName
     * @returns void
     * @since 1.0
     * */
    selectMasterListItemOnBackNavigation: function (modelName) {
        var sIndex, currentBP, masterList;
        currentBP = sap.ui.getCore().getModel(modelName).getData();
        masterList = oSapSplUtils.getCurrentMasterPage().byId("SapSplMyContactsList");
        for (sIndex = 0; sIndex < masterList.getItems().length; sIndex++) {
            if (masterList.getItems()[sIndex].sId.indexOf("SapSplMyContactsListItem") !== -1) {
                if (masterList.getItems()[sIndex].getBindingContext().getProperty().UUID === currentBP.UUID) {
                    masterList.setSelectedItem(masterList.getItems()[sIndex]);
                    break;
                }
            }
        }
    },

    /***
     * @description Method to prepare the post payload as per the requirements for MyContacts invite.
     * @param void
     * @returns {object} oPayLoad object as per the requirement for MyContacts invite.
     * @since 1.0
     */
    preparePayLoadForPost: function () {
        var inviteDataForPost = [],
            oPayLoad = {},
            roleAssignment = [],
            data = {},
            i, UUID, roles = [];
        data = sap.ui.getCore().getModel("myContactsRegisterEditModel").getData();
        data = this.getDataInPostFormat(data);
        inviteDataForPost[0] = {};

        if (this.isEditMyUser === 0) {

            roles[0] = {};
            UUID = oSapSplUtils.getUUID();
            inviteDataForPost[0]["UUID"] = UUID;
            inviteDataForPost[0]["BasicInfo.ID"] = null;
            inviteDataForPost[0]["BasicInfo.CompanyID"] = oSapSplUtils.getCompanyDetails()["UUID"];
            inviteDataForPost[0]["BasicInfo.Type"] = "P";

            inviteDataForPost[0]["Organization.Name"] = null;
            inviteDataForPost[0]["Organization.RegistrationNumber"] = null;
            inviteDataForPost[0]["Organization.Registry"] = null;

            inviteDataForPost[0]["PersonName.GivenName"] = data["PersonName.GivenName"];
            inviteDataForPost[0]["PersonName.JobFunction"] = data["PersonName.JobFunction"];
            inviteDataForPost[0]["PersonName.Surname"] = data["PersonName.Surname"];
            inviteDataForPost[0]["PersonName.SurnamePrefix"] = data["PersonName.SurnamePrefix"];
            inviteDataForPost[0]["PersonName.Title"] = data["PersonName.Title"];

            inviteDataForPost[0]["PostalAddress.Street"] = data["PostalAddress.Street"];
            inviteDataForPost[0]["PostalAddress.StreetName"] = data["PostalAddress.StreetName"];
            inviteDataForPost[0]["PostalAddress.Town"] = data["PostalAddress.Town"];
            inviteDataForPost[0]["PostalAddress.District"] = data["PostalAddress.District"];
            inviteDataForPost[0]["PostalAddress.PostalCode"] = data["PostalAddress.PostalCode"];
            inviteDataForPost[0]["PostalAddress.Country"] = data["PostalAddress.Country"];

            inviteDataForPost[0]["CommunicationInfo.EmailAddress"] = data["CommunicationInfo.EmailAddress"];
            inviteDataForPost[0]["CommunicationInfo.Fax"] = data["CommunicationInfo.Fax"];
            inviteDataForPost[0]["CommunicationInfo.Phone"] = data["CommunicationInfo.Phone"];
            inviteDataForPost[0]["CommunicationInfo.Website"] = data["CommunicationInfo.Website"];

            if (this.sRole !== "Driver") {
                inviteDataForPost[0]["Owner"] = null;
                inviteDataForPost[0]["InvitedByOrganization"] = oSapSplUtils.getCompanyDetails()["UUID"];

                /* RequestType = 0 for Self registration & Request = 1 for Invite Scenario */
                inviteDataForPost[0]["RequestType"] = "1";
                inviteDataForPost[0]["RequestStatus"] = "0";
                inviteDataForPost[0]["isDeleted"] = "0";
            }

            if (this.sRole === "Driver") {
                roles[0]["Partner"] = UUID;
            } else {
                roles[0]["Request"] = UUID;
            }
            roles[0]["UUID"] = oSapSplUtils.getUUID();
            for (i = 0; i < sap.ui.getCore().getModel("splNewContactRegistrationRoles").getData().results.length; i++) {
                if (sap.ui.getCore().getModel("splNewContactRegistrationRoles").getData().results[i]["GrantableRole.description"] === data["MainUserRoles.Role1"]) {
                    roles[0]["Role"] = sap.ui.getCore().getModel("splNewContactRegistrationRoles").getData().results[i].GrantableRole;
                    break;
                }
            }

            oPayLoad["Header"] = inviteDataForPost;

            if (this.sRole === "Driver") {
                oPayLoad["RoleAssignment"] = roles;
            } else {
                oPayLoad["Roles"] = roles;
            }

            return oPayLoad;
        } else {
            if (this.isEditMyUser === 1) {

                inviteDataForPost[0]["UUID"] = data["UUID"];

                inviteDataForPost[0]["BasicInfo.CompanyID"] = data["BasicInfo.CompanyID"];
                inviteDataForPost[0]["BasicInfo.Type"] = data["BasicInfo.Type"];
                inviteDataForPost[0]["BasicInfo.ID"] = null;

                inviteDataForPost[0]["Organization.Name"] = data["Organization.Name"];
                inviteDataForPost[0]["Organization.RegistrationNumber"] = data["Organization.RegistrationNumber"];
                inviteDataForPost[0]["Organization.Registry"] = data["Organization.Registry"];

                inviteDataForPost[0]["PersonName.GivenName"] = data["PersonName.GivenName"];
                inviteDataForPost[0]["PersonName.JobFunction"] = data["PersonName.JobFunction"];
                inviteDataForPost[0]["PersonName.Surname"] = data["PersonName.Surname"];
                inviteDataForPost[0]["PersonName.SurnamePrefix"] = data["PersonName.SurnamePrefix"];
                inviteDataForPost[0]["PersonName.Title"] = data["PersonName.Title"];

                inviteDataForPost[0]["PostalAddress.Street"] = data["PostalAddress.Street"];
                inviteDataForPost[0]["PostalAddress.StreetName"] = data["PostalAddress.StreetName"];
                inviteDataForPost[0]["PostalAddress.Town"] = data["PostalAddress.Town"];
                inviteDataForPost[0]["PostalAddress.District"] = data["PostalAddress.District"];
                inviteDataForPost[0]["PostalAddress.PostalCode"] = data["PostalAddress.PostalCode"];
                inviteDataForPost[0]["PostalAddress.Country"] = data["PostalAddress.Country"];

                inviteDataForPost[0]["CommunicationInfo.EmailAddress"] = data["CommunicationInfo.EmailAddress"];
                inviteDataForPost[0]["CommunicationInfo.Fax"] = data["CommunicationInfo.Fax"];
                inviteDataForPost[0]["CommunicationInfo.Phone"] = data["CommunicationInfo.Phone"];
                inviteDataForPost[0]["CommunicationInfo.Website"] = data["CommunicationInfo.Website"];

                inviteDataForPost[0]["UserID"] = data["UserID"];
                inviteDataForPost[0]["RegistrationRequest"] = data["RegistrationRequest"];
                inviteDataForPost[0]["ImageUrl"] = data["ImageUrl"];
                inviteDataForPost[0]["InvitedByOrganization"] = data["InvitedByOrganization"];

                oPayLoad.inputHasChangeMode = false;

                if (data["MainUserRoles.Role1"] !== sap.ui.getCore().getModel("myContactDetailModel").getData()["Role.description"]) {
                    inviteDataForPost[0]["ChangeMode"] = "U";
                    oPayLoad.inputHasChangeMode = true;

                    roleAssignment[0] = {};
                    roleAssignment[1] = {};

                    roleAssignment[0].UUID = sap.ui.getCore().getModel("myContactDetailModel").getData().RoleUUID;
                    roleAssignment[1].UUID = oSapSplUtils.getUUID();

                    roleAssignment[0].Partner = data["UUID"];
                    roleAssignment[1].Partner = data["UUID"];

                    roleAssignment[0].Role = sap.ui.getCore().getModel("myContactDetailModel").getData().Role;
                    for (i = 0; i < sap.ui.getCore().getModel("splNewContactRegistrationRoles").getData().results.length; i++) {
                        if (sap.ui.getCore().getModel("splNewContactRegistrationRoles").getData().results[i]["GrantableRole.description"] === data["MainUserRoles.Role1"]) {
                            roleAssignment[1].Role = sap.ui.getCore().getModel("splNewContactRegistrationRoles").getData().results[i].GrantableRole;
                        }
                    }
                    roleAssignment[0].Role = sap.ui.getCore().getModel("myContactDetailModel").getData().Role;
                    roleAssignment[0].ChangeMode = "D";
                    roleAssignment[1].ChangeMode = "I";
                    oPayLoad["RoleAssignment"] = roleAssignment;
                }
                oPayLoad["Header"] = inviteDataForPost;

                return oPayLoad;
            }
        }
    },

    /***
     * @description Method to convert an object with keys containing "_" to an object with keys containing "."
     * @param data object with keys not in Post format.
     * @returns {object} new object with keys in required post format.
     */
    getDataInPostFormat: function (data) {
        var _data = {};
        $.each(data, function (key, value) {
            _data[key.replace("_", ".")] = value;
        });
        return _data;
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
     * @description Called when any Input fields is changes. sets ChangedFlag to true & update model
     * @returns void.
     * @since 1.0
     * */
    fnToCaptureLiveChangeToSetFlag: function () {
        if (!oSapSplUtils.getIsDirty()) {
            oSapSplUtils.setIsDirty(true);
        }
    }

});
