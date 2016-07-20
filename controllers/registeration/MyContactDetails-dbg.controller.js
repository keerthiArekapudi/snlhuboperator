/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.controller("splController.registeration.MyContactDetails", {

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     */
    onInit: function () {

        /*unified shell instance - which is the super parent of this view*/
        this.unifiedShell = null;

        /*SAPUI5 JSONModel - to be set to MyContactDetails view*/
        var myContactDetailModel = new sap.ui.model.json.JSONModel({
            noData: true,
            isClicked: false,
            showFooterButtons: false
        });

        /*
         * Making the myContactDetailModel as a named model.
         * 1. Easily accessible from other views and model data manipulation becomes easy.
         * 2. To enable multiple model setting on the view.
         * */
        sap.ui.getCore().setModel(myContactDetailModel, "myContactDetailModel");

        /*setting the json Model to the view*/
        this.getView().setModel(sap.ui.getCore().getModel("myContactDetailModel"));

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
        this.byId("MyContactsDetailPage").setTitle(oSapSplUtils.getBundle().getText("MY_COLLEAGUES_DETAIL_TITLE", oSapSplUtils.getCompanyDetails()["Organization_Name"]));
        this.byId("MyContactDetailsEditButton").setProperty("text", oSapSplUtils.getBundle().getText("MY_COLLEAGUES_EDIT_BUTTON"));
        this.byId("MyContactDetailsDeleteButton").setProperty("text", oSapSplUtils.getBundle().getText("INCIDENTS_FOOTER_DELETE"));
        this.byId("sapSplMyUserDetailEmail").setText(oSapSplUtils.getBundle().getText("EMAIL"));
        this.byId("sapSplMyUserDetailPhone").setText(oSapSplUtils.getBundle().getText("PHONE"));
        this.byId("sapSplMyUserDetailAccountCreatedOn").setText(oSapSplUtils.getBundle().getText("ACCOUNT_CREATED_ON"));
        this.byId("sapSplUsersDetailNoDataLabel").setText(oSapSplUtils.getBundle().getText("NO_USERS_TEXT"));

        this.byId("MyContactDetailsEditButton").setTooltip(oSapSplUtils.getBundle().getText("MY_COLLEAGUES_EDIT_BUTTON"));
    },

    /**
     * Ajax call to delete the selected user
     * @param void
     * @return void
     * @since 1.0
     */
    fnDeleteUserServiceCall: function () {
        var selectedContactData = jQuery.extend(true, {}, sap.ui.getCore().getModel("myContactDetailModel").getData());
        var oFinalPayload = {
            "inputHasChangeMode": true,
            "Header": [{
                "UUID": selectedContactData["UUID"],
                "BasicInfo.Type": selectedContactData["BasicInfo_Type"],
                "ChangeMode": "D"
            }]
        };
        var encodedUrl = oSapSplUtils.getServiceMetadata("bupa", true);
        oSapSplBusyDialog.getBusyDialogInstance().open();

        oSapSplAjaxFactory.fireAjaxCall({
            method: "PUT",
            url: encodedUrl,
            data: JSON.stringify(oFinalPayload),
            success: function (oResult, textStatus, xhr) {
                if (oResult.constructor === String) {
                    oResult = JSON.parse(oResult);
                }

                if (xhr.status === 200) {
                    if (oResult["Error"].length > 0) {
                        sap.ca.ui.message.showMessageBox({
                            type: sap.ca.ui.message.Type.ERROR,
                            message: oSapSplUtils.getErrorMessagesfromErrorPayload(oResult)["errorWarningString"],
                            details: oSapSplUtils.getErrorMessagesfromErrorPayload(oResult)["ufErrorObject"]
                        });
                        oSapSplBusyDialog.getBusyDialogInstance().close();
                    } else {
                        oSapSplBusyDialog.getBusyDialogInstance().close();
                        sap.ca.ui.message.showMessageToast(oSapSplUtils.getBundle().getText("USER_DELETED_SUCCESSFULLY"));
                        /* CSNFIX : 0120031469 759669 2014 */
                        sap.ui.getCore().getModel("myContactListODataModel").refresh();
                    }
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                if (xhr) {
                    sap.ca.ui.message.showMessageBox({
                        type: oSapSplUtils.getErrorMessagesfromErrorPayload(xhr.responseJSON)["messageTitle"],
                        message: oSapSplUtils.getErrorMessagesfromErrorPayload(xhr.responseJSON)["errorWarningString"],
                        details: oSapSplUtils.getErrorMessagesfromErrorPayload(xhr.responseJSON)["ufErrorObject"]
                    	});
                }
                oSapSplBusyDialog.getBusyDialogInstance().close();
                jQuery.sap.log.error(errorThrown, textStatus, "MyContactDetails.controller.js");
            },
            complete: function () {
                oSapSplBusyDialog.getBusyDialogInstance().close();
            }
        });
    },

    /**
     * Throws an alert you try to delete a user. On confirmation, it makes a service call to delete the selected user.
     * @param void
     * @returns void
     * @since 1.0
     */
    fnHandleDeleteOfMyContacts: function () {
        var that = this;
        sap.m.MessageBox.show(
            oSapSplUtils.getBundle().getText("USER_DELETE_CONFIRMATION"), sap.m.MessageBox.Icon.WARNING, oSapSplUtils.getBundle().getText("WARNING"), [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL], function (selection) {
                if (selection === "YES") {
                    that.fnDeleteUserServiceCall();
                } else {
                	sap.ui.getCore().byId("MyContactsMaster--sapSplSearchMyUsersMasterList").focus();
                }
            });
    },

    /**
     * @description press event handler of the "edit contact" button. Results in navigation of the detail page - to edit Contact page.
     * @param evt event object of the press event.
     * @returns void.
     * @since 1.0
     */
    fnHandleEditOfMyContacts: function () {

        var selectedContactData = jQuery.extend(true, {}, sap.ui.getCore().getModel("myContactDetailModel").getData());
        selectedContactData["MainUserRoles_Role1"] = selectedContactData["Role.description"];
        if (selectedContactData["Role.description"] === "Driver") {
            selectedContactData["EmailVisible"] = false;
        } else {
            selectedContactData["EmailVisible"] = true;
        }
        selectedContactData["ActionName"] = oSapSplUtils.getBundle().getText("NEW_CONTACT_SAVE");
        /*instance of the SAPUI5 event bus - used to subscribe or publish events across the application*/

        /* CSNFIX : 0120031469 646823     2014 */
        var bSelectEnabled = null;
        if (selectedContactData["canChangeRole"] && selectedContactData["canChangeRole"] === 1) {
            bSelectEnabled = true;
        } else {
            bSelectEnabled = false;
        }

        /* FIX : 1482007658 */
        selectedContactData["Mode"] = "Edit";

        var bus = sap.ui.getCore().getEventBus();
        bus.publish("navInDetail", "to", {
            from: this.getView(),
            data: {
                selectEnabled: bSelectEnabled,
                sMode: "edit",
                /*The object bound to the selected listItem.*/
                context: selectedContactData
            }
        });
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
            sap.ui.getCore().getModel("myContactDetailModel").setData(evt.data.context);
        }
//		sap.ui.getCore().byId("MyContactsMaster--sapSplSearchMyUsersMasterList").focus();
        window.setTimeout(function() {
        	sap.ui.getCore().byId("MyContactsMaster--sapSplSearchMyUsersMasterList").focus();
        },1000);
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
    }

});