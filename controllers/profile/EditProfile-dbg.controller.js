/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.controller("splController.profile.EditProfile", {

    bProfileIsModified: false,
    //IsDirtyFlag added--Amending this code
    oPayloadObject: {

        "inputHasChangeMode": true,

        "Header": []
    },

    localPersistency: {}, //Required to hold the value of the subscription and/or tour input type for the success toast

    //The final payload object to be sent for PUT
    oTransientPayload: {},
    //Holds the data being changed before pushing into master object
    oCompanyProfileModel: {},
    //Master JSON model for binding
    onInit: function () {
        //this.fnFetchOwnerServiceProducts();
        var oTourModel = new sap.ui.model.json.JSONModel();
        var that = this;

        oTourModel.setData({
            tours: [{
                tourName: oSapSplUtils.getBundle().getText("TOUR_CREATION_MANUAL_ONLY"),
                tourMode: "M",
                id: "M",
                selected: false
   }, {
                tourName: oSapSplUtils.getBundle().getText("TOUR_CREATION_BOTH"),
                tourMode: "",
                id: "B",
                selected: false
   }, {
                tourName: oSapSplUtils.getBundle().getText("TOUR_CREATION_AUTOMATED_ONLY"),
                tourMode: "I",
                id: "I",
                selected: false
   }]
        });
        sap.ui.getCore().setModel(oTourModel, "splTourAutomationModel");
        sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel({
            visible: true,
            subScriptionAccepted: false
        }), "splSearchVisibilityModel");
        this.getView().addEventDelegate({
        onAfterShow : function(){
        	window.setTimeout(function(){
        		that.byId("sapSplCompanyProfileImageInput").focus();
        	},100);
        }
        });

    },

    /*handleSearchVisibilityChange: function (oEvent) {
        this.bProfileIsModified = true;
        oSapSplUtils.setIsDirty(true);
        if (oEvent.getParameter("selected")) {
            this.byId("searchVisibilityTurnedOff").setProperty("text", oSapSplUtils.getBundle().getText("IMPACT_OF_TURNING_OFF_VISIBILITY"));
        } else {
            this.byId("searchVisibilityTurnedOff").setProperty("text", oSapSplUtils.getBundle().getText("IMPACT_OF_TURNING_ON_VISIBILITY"));
        }
        sap.ui.getCore().getModel("splSearchVisibilityModel").getData()["visible"] = oEvent.getParameter("selected");
        this.oTransientPayload["isVisibleOnSearch"] = (oEvent.getParameter("selected") ? 1 : 0);

    },*/

    tourOptionSelected: function (oEvent) {

        var oTourChangePromptDialog = null;

        function handleTourTypeChange(instance, tourObject, fnOKToPrompt, fnCancelPrompt) {
            oTourChangePromptDialog = new sap.m.Dialog({
                contentHeight: "320px",
                contentWidth: "690px",
                state: sap.ui.core.ValueState.Warning,
                title: "{splI18NModel>CONFIRMATION_DIALOG_HEADER_TITLE}",
                buttons: [new sap.m.Button({
                        text: "{splI18NModel>OK}",
                        press: [
                            function () {

                                fnOKToPrompt();

     },
                            instance]
                    }),
     new sap.m.Button({
                        text: "{splI18NModel>CANCEL}",
                        press: [
                            function () {


                                fnCancelPrompt();

      },
                            instance]
                    })],

                content: sap.ui.view({
                    viewName: "splView.dialogs.SplChangeTourPromptDialog",
                    id: "splView.dialogs.SplChangeTourPromptDialog",
                    type: sap.ui.core.mvc.ViewType.XML,
                    viewData: {
                        data: oEvent.getSource().getSelectedContexts()[0]
                    }
                }),
                afterClose: [
                    function () {
                        oTourChangePromptDialog.destroy();
      },
                    instance]
            });

            oTourChangePromptDialog.open().attachAfterOpen(function () {
                oSapSplUtils.fnSyncStyleClass(oTourChangePromptDialog);
            });
        }

        if (this.isTourDifferent(oEvent.getSource().getSelectedContexts()[0].getProperty("tourMode"))) {
            //Now display the dialog

            var instance = this;

            var sEvent = jQuery.extend(true, {}, oEvent);

            handleTourTypeChange(this, oEvent.getSource().getSelectedContexts()[0].getProperty("tourMode"), function () {

                instance.bProfileIsModified = true;
                oSapSplUtils.setIsDirty(instance.bProfileIsModified);
                instance.oTransientPayload["TourInputType"] = sEvent.getSource().getSelectedContexts()[0].getProperty("tourMode");
                $.sap.log.info("SAP SCL Event", "Event fired " + oEvent, "SAPSCL");

                oSapSplUtils.getStorageInstance("session").put("spl-change-prompt-tour", "x");

                instance.localPersistency["spl-change-prompt-tour"] = sEvent.getSource().getSelectedContexts()[0].getProperty("tourName");


                oTourChangePromptDialog.close();
            }, function () {
                if (oSapSplUtils.getStorageInstance("session").get("spl-change-prompt-tour")) {
                    oSapSplUtils.getStorageInstance("session").remove("spl-change-prompt-tour");
                }


                var tourModelData = sap.ui.getCore().getModel("splTourAutomationModel").getData()["tours"];

                for (var iCount = 0; iCount < tourModelData.length; iCount++) {
                    if (tourModelData[iCount]["tourMode"] === oSapSplUtils.getCompanyDetails()["TourInputType"]) {
                        sap.ui.getCore().getModel("splTourAutomationModel").getData()["tours"][iCount]["selected"] = true;
                        instance.localPersistency["spl-change-prompt-tour"] = null;
                        sap.ui.getCore().getModel("splTourAutomationModel").refresh();
                    }
                }

                instance.oTransientPayload["TourInputType"] = oSapSplUtils.getCompanyDetails()["TourInputType"];
                $.sap.log.info("SAP SCL Event", "Event fired " + oEvent, "SAPSCL");

                oTourChangePromptDialog.close();
            });

        }
    },



    /**
     * @since 1.0
     * @description Central method for localization
     * @private
     * @deprecated
     */
    defineControlLabelsFromLocalizationBundle: function () {


    },

    /**
     * @description A single live change. Just needed to set the dirty flag
     * @since 1.0
     * @private
     * @param oEvent
     */
    commonLiveChange: function () {

        if (!this.bProfileIsModified) {

            this.bProfileIsModified = true;

        }
    },

    handleRegNumberChange: function (oEvent) {
        this.bProfileIsModified = true;
        oSapSplUtils.setIsDirty(this.bProfileIsModified);
        $.sap.log.info("SAP SCL Event", "Event fired " + oEvent, "SAPSCL");
    },

    handleRegistryNumberChange: function (oEvent) {
        this.bProfileIsModified = true;
        oSapSplUtils.setIsDirty(this.bProfileIsModified);
        $.sap.log.info("SAP SCL Event", "Event fired " + oEvent, "SAPSCL");
    },

    /**
     * @description Individual input event handlers
     * @param oEvent
     */
    handleCompanyNameChange: function (oEvent) {
        this.bProfileIsModified = true;
        oSapSplUtils.setIsDirty(this.bProfileIsModified);
        $.sap.log.info("SAP SCL Event", "Event fired " + oEvent, "SAPSCL");
    },

    /**
     * @private
     * @since 1.0
     * @param oEvent
     */
    handleWebsiteChange: function (oEvent) {

        this.bProfileIsModified = true;

        oSapSplUtils.setIsDirty(this.bProfileIsModified);

        $.sap.log.info("SAP SCL Event", "Event fired " + oEvent, "SAPSCL");


    },

    /**
     * @private
     * @param oEvent
     */
    handleStreetChange: function (oEvent) {

        this.bProfileIsModified = true;

        oSapSplUtils.setIsDirty(this.bProfileIsModified);

        $.sap.log.info("SAP SCL Event", "Event fired " + oEvent, "SAPSCL");


    },


    /**
     * @private
     * @param oEvent
     */
    handleDistrictChange: function (oEvent) {

        this.bProfileIsModified = true;

        oSapSplUtils.setIsDirty(this.bProfileIsModified);

        $.sap.log.info("SAP SCL Event", "Event fired " + oEvent, "SAPSCL");


    },

    /**
     * @private
     * @param oEvent
     */
    handleCountryChange: function (oEvent) {

        this.bProfileIsModified = true;

        oSapSplUtils.setIsDirty(this.bProfileIsModified);

        $.sap.log.info("SAP SCL Event", "Event fired " + oEvent, "SAPSCL");


    },

    /**
     * @private
     * @param oEvent
     */
    handlePhoneChange: function (oEvent) {

        this.bProfileIsModified = true;

        oSapSplUtils.setIsDirty(this.bProfileIsModified);

        $.sap.log.info("SAP SCL Event", "Event fired " + oEvent, "SAPSCL");


    },

    /**
     * @private
     * @param oEvent
     */
    handleFaxChange: function (oEvent) {

        this.bProfileIsModified = true;

        oSapSplUtils.setIsDirty(this.bProfileIsModified);

        $.sap.log.info("SAP SCL Event", "Event fired " + oEvent, "SAPSCL");


    },

    /**
     * @private
     * @param oEvent
     */
    handleTownChange: function (oEvent) {

        this.bProfileIsModified = true;

        oSapSplUtils.setIsDirty(this.bProfileIsModified);

        $.sap.log.info("SAP SCL Event", "Event fired " + oEvent, "SAPSCL");


    },

    /**
     * @private
     * @param oEvent
     */
    onAfterRendering: function () {

        this.defineControlLabelsFromLocalizationBundle();

    },

    /**
     * @private
     * @param oEvent
     */
    handleProfileBackNavigation: function () {

        this.goBackToCaller(0);

    },

    /**
     * @private
     * @param oEvent
     */
    handleAddCompanyProfilePhoto: function () { /* CSNFIX : 0120061532 1325332    2014 */
        this.byId("sapSplCompanyProfileImage").setSrc(this.byId("sapSplCompanyProfileImageInput").getValue());
        this.byId("sapSplCompanyProfileImage").setVisible(true);
    },

    /**
     * @private
     * @param oEvent
     */
    handleImageUrlChange: function (oEvent) {

        /* CSNFIX : 0120061532 1325332    2014 */

        this.byId("sapSplEditProfileAddImage").setEnabled(oEvent.getParameter("newValue") !== "");

        this.bProfileIsModified = true;

        oSapSplUtils.setIsDirty(this.bProfileIsModified);

        this.oTransientPayload["ImageUrl"] = oEvent.getParameter("newValue");

    },
    /**
     * @private
     * @param oEvent
     */
    handleProductChange: function (oEvent) {

        var oProductChangeHandlerDialog = null;

        function handlePromptDialogLaunchForSubscriptionChange(instance, sourceEvent, fnOKToPrompt, fnCancelPrompt) {
            oProductChangeHandlerDialog = new sap.m.Dialog({
                contentHeight: "280px",
                contentWidth: "670px",
                state: sap.ui.core.ValueState.Warning,
                title: "{splI18NModel>CONFIRMATION_DIALOG_HEADER_TITLE}",
                buttons: [new sap.m.Button({
                        text: "{splI18NModel>OK}",
                        enabled: {
                            path: "splSearchVisibilityModel>/subScriptionAccepted"
                        },
                        press: [
                            function () {

                                fnOKToPrompt();

     },
                            instance]
                    }),
     new sap.m.Button({
                        text: "{splI18NModel>CANCEL}",
                        press: [
                            function () {

                                fnCancelPrompt();

      },
                            instance]
                    })],

                content: sap.ui.view({
                    viewName: "splView.dialogs.SplChangeSubScriptionPromptDialog",
                    id: "splView.dialogs.SplChangeSubScriptionPromptDialog",
                    type: sap.ui.core.mvc.ViewType.XML,
                    viewData: {
                        data: oEvent.getParameter("selectedItem")
                    }
                }),
                afterClose: [
                    function () {
                        oProductChangeHandlerDialog.destroy();
      },
                    instance]
            });

            oProductChangeHandlerDialog.open().attachAfterOpen(function () {
                oSapSplUtils.fnSyncStyleClass(oProductChangeHandlerDialog);
            });
        }

        /*Display the prompt ONLY if the subscription is changed. DO NOT display otherwise*/
        /*if (this.byId("sapSplCompanyProfileEditModeProduct").getSelectedKey() !== this.byId("profileEditPage").getModel().getData()["SubscriptionUUID"]) {
            var that = this;
            var sEvent = jQuery.extend(true, {}, oEvent);
            handlePromptDialogLaunchForSubscriptionChange(this, oEvent, function () {
                that.bProfileIsModified = true;
                that.bProductChanged = true;
                oSapSplUtils.setIsDirty(that.bProfileIsModified);
                that.oTransientPayload["SubscriptionUUID"] = sEvent.getParameter("selectedItem").getProperty("key");
                $.sap.log.info("SAP SCL Event", "Event fired " + oEvent, "SAPSCL");
                oSapSplUtils.getStorageInstance("session").put("spl-change-prompt-subscr", "x");
                that.localPersistency["spl-change-prompt-subscr"] = sEvent.getParameter("selectedItem").getProperty("text");
                oProductChangeHandlerDialog.close();
            }, function () {
                that.bProductChanged = false;
                that.byId("sapSplCompanyProfileEditModeProduct").setSelectedKey(that.byId("profileEditPage").getModel().getData()["SubscriptionUUID"]);
                $.sap.log.info("SAP SCL Event", "Event fired " + oEvent, "SAPSCL");
                if (oSapSplUtils.getStorageInstance("session").get("spl-change-prompt-subscr")) {
                    oSapSplUtils.getStorageInstance("session").remove("spl-change-prompt-subscr");
                }
                that.localPersistency["spl-change-prompt-subscr"] = null;
                oProductChangeHandlerDialog.close();
            });
        }*/

    },


    /**
     * @description Take the current page back to it's source with backData
     * @since 1.0
     * @param goBackWithData
     */
    goBackToCaller: function (goBackWithData) {

        oSplBaseApplication.getAppInstance().back({
            goBackWithData: goBackWithData
        });

    },

    /**
     * @description Save Profile handler
     * success and error callbacks are overridden as they are not needed.
     * We handle the situation in complete callback itself.
     * @private
     * @param oEvent
     * @since 1.0
     */
    handleProfileSaveButtonPressEvent: function () {

        var that = this;

        this.createBaseSkeletonPayloadObject();

        this.oPayloadObject.Header[0] = this.oTransientPayload;

        //this.checkSubscriptionProduct();

        this.constructPayloadForPost();
        oSapSplBusyDialog.getBusyDialogInstance({
            title: oSapSplUtils.getBundle().getText("BUSY_DIALOG_MESSAGE")
        }).open();

        oSapSplAjaxFactory.fireAjaxCall({
            url: oSapSplUtils.getServiceMetadata("bupa", true),
            method: "PUT",
            dataType: "json",
            data: JSON.stringify(this.oPayloadObject),
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
                xhr.setRequestHeader("X-CSRF-Token", oSapSplUtils.getCSRFToken());
            },
            success: function (oResult, textStatus, xhr) {
                if (xhr.status === 200 && xhr.status < 400) {

                    var oPositiveOffset = 0,
                        oNegativeOffset = -10,
                        _calculatedOffset = "'" + oPositiveOffset + " " + oNegativeOffset + "'";

                    function calculateOffset() {
                        oNegativeOffset = oNegativeOffset - 50;
                        var res = _calculatedOffset = "'" + oPositiveOffset + " " + oNegativeOffset + "'";
                        return res;
                    }

                    oSapSplUtils.setIsDirty(false);

                    sap.m.MessageToast.show(oSapSplUtils.getBundle().getText("PROFILE_UPDATE_SUCCESSFUL"), {
                        offset: _calculatedOffset
                    });

                    if (oSapSplUtils.getStorageInstance("session").get("spl-change-prompt-subscr") === "x") {
                        if ((that.localPersistency["spl-change-prompt-subscr"] !== undefined) || (that.localPersistency["spl-change-prompt-subscr"] !== null)) {
                            sap.m.MessageToast.show(oSapSplUtils.getBundle().getText("SUBSCRIPTION_CHANGE_OK_TOAST", [that.localPersistency["spl-change-prompt-subscr"]]), {
                                offset: calculateOffset()
                            });
                            that.localPersistency["spl-change-prompt-subscr"] = null;
                        }


                    }
                    if (oSapSplUtils.getStorageInstance("session").get("spl-change-prompt-tour") === "x") {
                        if ((that.localPersistency["spl-change-prompt-tour"] !== undefined) || (that.localPersistency["spl-change-prompt-tour"] !== null)) {
                            sap.m.MessageToast.show(oSapSplUtils.getBundle().getText("TOUR_CHANGE_OK_TOAST", [that.localPersistency["spl-change-prompt-tour"]]), {
                                offset: calculateOffset()
                            });
                            that.localPersistency["spl-change-prompt-tour"] = null;
                        }
                    }

                    that.goBackToCaller(1);

                }
            },
            error: function (xhr) {
                if (xhr.status >= 400 && xhr.status < 500) {
                    oSapSplAppErrorHandler.show(xhr, true, null, function (oDialogClosed) {
                        jQuery.sap.log.info("SAP Connected Logistics", "Dialog close Event fired " + oDialogClosed.m, "SAPSCL");
                        jQuery.sap.log.error("SPL User Profile", "Profile update failed. Toast rendered and closed", "SAPSCL");
                    });
                } else {
                    oSapSplAppErrorHandler.show(xhr, false, null, function (oDialogClosed) {
                        jQuery.sap.log.info("SAP Connected Logistics", "Dialog close Event fired " + oDialogClosed.m, "SAPSCL");
                        jQuery.sap.log.error("SPL User Profile", "Profile update failed. Toast rendered and closed", "SAPSCL");
                    });
                }
            },
            complete: function () {
                oSapSplBusyDialog.getBusyDialogInstance({
                    title: oSapSplUtils.getBundle().getText("BUSY_DIALOG_MESSAGE")
                }).close();
            }
        });

    },

    /**
     * @description For future compatibility. Handle onBeforeShow logic within getData().
     * @since 1.0
     * @private
     * @param oEvent
     */
    onBeforeShow: function () {
    },

    /**
     * @description The entry point to this page. Trigger from onBeforeShow closure in Profile view
     * @param oEvent
     * @private
     * @since 1.0
     */
    getData: function (oEvent) {

        var cDetails = oEvent.data.cDetails;
        var iCount = 0,
            iSelectedTourType = 0;
        var oModel = new sap.ui.model.json.JSONModel();

        /*To bind the various tour types with the List and then mark the current one as selected*/

        function __getSelectedTourInputType__() {
            var oTourInputTypeData = sap.ui.getCore().getModel("splTourAutomationModel").getData()["tours"];
            for (iCount = 0; iCount < oTourInputTypeData.length; iCount++) {
                if (cDetails["TourInputType"] === oTourInputTypeData[iCount]["tourMode"]) {
                    //Found the mode. Set the property of this object to selected
                    iSelectedTourType = iCount;
                    break;
                }
            }
            sap.ui.getCore().getModel("splTourAutomationModel").getData()["tours"][iSelectedTourType]["selected"] = true;
            sap.ui.getCore().getModel("splTourAutomationModel").refresh();
        }

        function __getVisibleOnSearchFlag__() {
            sap.ui.getCore().getModel("splSearchVisibilityModel").getData()["visible"] = (cDetails["isVisibleOnSearch"] === 1) ? true : false;
        }

        oModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay); /*HOTFIX Base model getting updated (on dirty and nav back use case)*/

        oModel.setData(cDetails);

        //this.byId("sapSplCompanyProfileEditModeProduct").setSelectedKey(oEvent.data.cDetails.SubscriptionUUID);

        this.byId("profileEditPage").setModel(oModel);

        __getSelectedTourInputType__();
        __getVisibleOnSearchFlag__();

    },

    /**
     * @description Cancel Profile Change handler
     * @private
     * @param oEvent
     * @since 1.0
     */
    handleProfileCancelButtonPressEvent: function () {
        this.goBackToCaller(0);

    },

    /**
     * @description Generate a Transient pay-load object to store the basic fields that don't undergo change
     * @since 1.0
     * @private
     */
    createBaseSkeletonPayloadObject: function () {

        this.oTransientPayload["UUID"] = oSapSplUtils.getCompanyDetails()["UUID"];

        this.oTransientPayload["BasicInfo.ID"] = oSapSplUtils.getCompanyDetails()["BasicInfo_ID"];

        this.oTransientPayload["BasicInfo.CompanyID"] = oSapSplUtils.getCompanyDetails()["BasicInfo_CompanyID"];

        this.oTransientPayload["BasicInfo.Type"] = oSapSplUtils.getCompanyDetails()["BasicInfo_Type"];

        //        this.oTransientPayload["Organization.RegistrationNumber"] = oSapSplUtils.getCompanyDetails()["Organization_RegistrationNumber"];
        //
        //        this.oTransientPayload["Organization.Registry"] = oSapSplUtils.getCompanyDetails()["Organization_Registry"];

        /*CSNFIX 676584 [LOD-SCL]*/
        this.oTransientPayload["ChangeMode"] = "U";

    },


    constructPayloadForPost: function () {
        this.oTransientPayload["Organization.Name"] = this.byId("sapSplCompanyProfileEditModeNameText").getValue();
        this.oTransientPayload["ImageUrl"] = this.byId("sapSplCompanyProfileImageInput").getValue();
        this.oTransientPayload["CommunicationInfo.Website"] = this.byId("sapSplCompanyProfileEditModeWebsiteText").getValue();
        this.oTransientPayload["PostalAddress.StreetName"] = this.byId("sapSplCompanyProfileEditModeStreetText").getValue();
        this.oTransientPayload["PostalAddress.Town"] = this.byId("sapSplCompanyProfileEditModeTownText").getValue();
        this.oTransientPayload["PostalAddress.District"] = this.byId("sapSplCompanyProfileEditModeDistrictText").getValue();
        this.oTransientPayload["CommunicationInfo.Phone"] = this.byId("sapSplCompanyProfileEditModePhoneText").getValue();
        this.oTransientPayload["CommunicationInfo.Fax"] = this.byId("sapSplCompanyProfileEditModeFaxText").getValue();
        this.oTransientPayload["PostalAddress.Country"] = this.byId("sapSplCompanyProfileEditModeCountryText").getValue();
        this.oTransientPayload["Organization.RegistrationNumber"] = this.byId("sapSplCompanyProfileEditRegistrationNumberText").getValue();
        this.oTransientPayload["Organization.Registry"] = this.byId("sapSplCompanyProfileEditModeRegistryText").getValue();
    },


    /**
     * @description Function to fetch the list of service products
     * @since 1.0
     * @private
     */
    /*fnFetchOwnerServiceProducts: function () {
        var that = this,
            oProductListModel = {};

        jQuery.ajax({

            url: oSapSplUtils.getServiceMetadata(SapSplEnums.RootApp, true) + "/ProductList/?$format=json",

            success: function (oResult) {
                oProductListModel = new sap.ui.model.json.JSONModel();
                oProductListModel.setData(oResult.d);
                //that.byId("sapSplCompanyProfileEditModeProduct").setModel(oProductListModel);

                CSNFIX 646894 2014
                if (oSapSplUtils.getCompanyDetails()["canMaintainWallet"] !== 1) {
                    that.byId("sapSplCompanyProfileEditModeProduct").setVisible(false);
                } else {
                    that.byId("sapSplCompanyProfileEditModeProduct").setVisible(true);
                    that.byId("sapSplCompanyProfileEditModeProduct").setSelectedKey(that.byId("profileEditPage").getModel().getData()["SubscriptionUUID"]);
                }
            },

            error: function (xhr) {
                sap.ca.ui.message.showMessageBox({
                    type: sap.ca.ui.message.Type.ERROR,
                    message: oSapSplUtils.getBundle().getText("GENERIC_ERROR_MESSAGE"),
                    details: oSapSplUtils.getErrorMessagesfromErrorPayload(xhr.responseText)
                }, function () {
                    //Handle close of the message box explicitly
                });

            }
        });



    },*/


    isTourDifferent: function (sTourId) {
        return (sTourId !== oSapSplUtils.getCompanyDetails()["TourInputType"]);
    }

    /**
     * @description Function to update the payload if the Subscription Product is changed
     * @since 1.0
     * @private
     *//*
    checkSubscriptionProduct: function () {
        var sOldSubscriptionProductUUID = null,
            oRelation = null,
            oOldRelation = null,
            oCompanyData = null,
            oNewRelation = null;

        sOldSubscriptionProductUUID = this.byId("profileEditPage").getModel().getData()["SubscriptionUUID"];
        if (this.bProductChanged && this.byId("sapSplCompanyProfileEditModeProduct").getSelectedKey() !== sOldSubscriptionProductUUID) {
            oCompanyData = this.byId("profileEditPage").getModel().getData();
            oRelation = [];
            oOldRelation = {};
            oNewRelation = {};
            Send only the relation UUID and Change mode for subscription change
            oOldRelation["UUID"] = oSapSplUtils.getCompanyDetails()["RelationUUID"];
            oOldRelation["ChangeMode"] = "D";
            oRelation.push(oOldRelation);

            oNewRelation["UUID"] = oSapSplUtils.getUUID();
            oNewRelation["FromPartner"] = oCompanyData["UUID"];
            oNewRelation["ToPartner"] = oCompanyData["SubscriptionOwnerID"];
            oNewRelation["Relation"] = oCompanyData["SubscriptionRelation"];
            oNewRelation["Text"] = oCompanyData["SubscriptionText"];
            oNewRelation["Status"] = "1";
            oNewRelation["ObjectType"] = oCompanyData["SubscriptionObjectType"];
            oNewRelation["InstanceUUID"] = this.byId("sapSplCompanyProfileEditModeProduct").getSelectedKey();
            oNewRelation["ChangeMode"] = "I";

            oRelation.push(oNewRelation);

            this.oPayloadObject.Relation = oRelation;

        }

    }*/

});
