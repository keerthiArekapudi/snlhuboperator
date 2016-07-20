/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.require("sap.ca.ui.message.message");
sap.ui.controller("splController.dialogs.SplSendMessageBusinessPartnerDialog", {

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     */
    onInit: function () {
    	var that = this;
        this.navContainer = this.byId("SapSplSendMessageBusinessPartnerNavContainer");

        /*Localization*/
        this.fnDefineControlLabelsFromLocalizationBundle();
        this.businessPartnerSelected = [];
        this.businessPartnerExisting = {};
        this.incidentSelected = {};
        if (sap.ui.getCore().getModel("sapSplAppConfigDataModel").getData()["isIncidentEditable"] === 0) {
            this.byId("sapSplMessageToRecipientMessageFieldLayout").removeContent(1);
        } else {
            this.byId("sapSplAttachIncidentLink").setText(oSapSplUtils.getBundle().getText("ATTACH_INCIDENT_LINK"));
        }

        this.getView().addEventDelegate({
        
			onAfterRendering : function(){
				setTimeout(function(){
					that.getView().byId("SapSplValueHelpForSelectBusinessPartnerInput").focus();
				},200);
			}
		});

		this.byId("SapSplSendMessageSelectBusinessPartnerPage").addEventDelegate({
			onAfterShow : function(){
				that.getDataForBusinessPartners();
				if(that.byId("SapSplSearchOfSelectBusinessPartnerPage")){
					setTimeout(function(){
						that.byId("SapSplSearchOfSelectBusinessPartnerPage").focus();
					},10);

				}
			} 
		});

		this.byId("SapSplSendMessageSelectBusinessPartnerUsersPage").addEventDelegate({
			onAfterShow : function(oEvent){
							setTimeout(function(){
					that.byId("SapSplSearchOfSelectBusinessPartnerUsersPage").focus();
				},10);
			}
		});

		this.byId("SapSplSendMessageBusinessPartnerPage").addEventDelegate({
			onAfterShow : function(){
				setTimeout(function(){
					that.byId("SapSplValueHelpForSelectBusinessPartnerInput").focus();
				},10);
			}
		});

		this.byId("SapSplSendMessageSelectIncidentsPage").addEventDelegate({
			onAfterShow : function(){
				that.getDataForIncidents();
				if(that.byId("SapSplSearchOfSelectIncidentsPage")){
					setTimeout(function(){
						that.byId("SapSplSearchOfSelectIncidentsPage").focus();
					},10);

				}
			} 
		});

    },

    /**
     * @description method to make odata read to fetch the BusinessPartners
     * @param void.
     * @returns void.
     * @since 1.0
     */
    getDataForBusinessPartners: function () {
        if (!this.oSapSplApplModel) {
            this.oSapSplApplModel = new splModels.odata.ODataModel({
                url: oSapSplUtils.getServiceMetadata("app", true),
                json: true,
                user: undefined,
                password: undefined,
                headers: {
                    "Cache-Control": "max-age=0"
                },
                tokenHandling: true,
                withCredentials: false,
                loadMetadataAsync: true,
                handleTimeOut: true,
                numberOfSecondsBeforeTimeOut: 10000
            });
           
        }
        
        this.oSapSplApplModel.read("/DistinctRoles", null, [], true, jQuery.proxy(this.fnSuccessOfMyBusinessPartnersRead, this), jQuery.proxy(this.fnFailOfMyBusinessPartnersRead, this));
    },
    
    /**
     * @description method to make odata read to fetch the incident details
     * @param void.
     * @returns void.
     * @since 1.0
     */
    getDataForIncidents: function () {
        if (!this.oSapSplApplModel) {
            this.oSapSplApplModel = new splModels.odata.ODataModel({
                url: oSapSplUtils.getServiceMetadata("app", true),
                json: true,
                user: undefined,
                password: undefined,
                headers: {
                    "Cache-Control": "max-age=0"
                },
                tokenHandling: true,
                withCredentials: false,
                loadMetadataAsync: true,
                handleTimeOut: true,
                numberOfSecondsBeforeTimeOut: 10000
            });
        }

        this.oSapSplApplModel.read("/IncidentDetails", null, ["$filter=isDeleted eq '0'"], true, jQuery.proxy(this.fnSuccessOfIncidentsRead, this), jQuery.proxy(this.fnFailOfIncidentsRead, this));
    },

    fnSuccessOfMyBusinessPartnersRead: function (oResults) {
        var oModel = null;
        if (!sap.ui.getCore().getModel("SapSplValueHelpForSelectBusinessPartnersModel")) {
            oModel = new sap.ui.model.json.JSONModel({
                BusinessPartners: oResults.results
            });
            sap.ui.getCore().setModel(oModel, "SapSplValueHelpForSelectBusinessPartnersModel");
        } else {
            sap.ui.getCore().getModel("SapSplValueHelpForSelectBusinessPartnersModel").setData({
                BusinessPartners: oResults.results
            });
        }

        this.byId("SapSplSendMessageBusinessPartnerSelectDialogList").setModel(sap.ui.getCore().getModel("SapSplValueHelpForSelectBusinessPartnersModel"));
    },

    fnFailOfMyIncidentsRead: function () {

    },

    sapSplChangeDirtyFlag: function (oEvent) {
        oSapSplUtils.setIsDirty(true);
        if (oEvent.getParameters("newValue").length === 0) {
            this.byId("sapSplMessageToRecipientMessageFieldLayout").addStyleClass("redBorder");
        } else {
            this.byId("sapSplMessageToRecipientMessageFieldLayout").removeStyleClass("redBorder");
        }
    },

    fnSuccessOfIncidentsRead: function (oResults) {
        var oModel = null;
        if (!sap.ui.getCore().getModel("SapSplValueHelpForSelectIncidentModel")) {
            oModel = new sap.ui.model.json.JSONModel({
                Incidents: oResults.results
            });
            sap.ui.getCore().setModel(oModel, "SapSplValueHelpForSelectIncidentModel");
        } else {
            sap.ui.getCore().getModel("SapSplValueHelpForSelectIncidentModel").setData({
                Incidents: oResults.results
            });
        }

        this.byId("SapSplSendMessageIncidentSelectDialogList").setModel(sap.ui.getCore().getModel("SapSplValueHelpForSelectIncidentModel"));
    },

    fnFailOfMyBusinessPartnersRead: function () {

    },

    fnDefineControlLabelsFromLocalizationBundle: function () {
        this.byId("SapSplSendMessageBusinessPartnerPage").setTitle(oSapSplUtils.getBundle().getText("SEND_MESSAGE_DIALOG_TITLE"));
        this.byId("SapSplValueHelpForSelectBusinessPartnerInput").setPlaceholder(oSapSplUtils.getBundle().getText("SEND_MESSAGE_SELECT_BUSINESS_PARTNER_PAGE_TITLE"));
        this.byId("SapSplSendMessageBusinessPartnerSelectDialogList").setNoDataText(oSapSplUtils.getBundle().getText("NO_DATA_TEXT"));
        this.byId("SapSplSendMessageIncidentSelectDialogList").setNoDataText(oSapSplUtils.getBundle().getText("NO_DATA_TEXT"));
        this.byId("SapSplSendMessageBusinessPartnerSelectUserDialogList").setNoDataText(oSapSplUtils.getBundle().getText("NO_DATA_TEXT"));
        this.byId("SapSplMessageBusinessPartnerReceipientsLabel").setText(oSapSplUtils.getBundle().getText("RECIPIENTS"));
        this.byId("SapSplIncidentMessageBusinessPartnerLabel").setText(oSapSplUtils.getBundle().getText("INCIDENTS_MESSAGE"));
        this.byId("SapSplMessageBusinessPartnerPriorityLabel").setText(oSapSplUtils.getBundle().getText("INCIDENTS_PRIORITY"));
        this.byId("SapSplPriorityRadioButton_1").setText(oSapSplUtils.getBundle().getText("INCIDENTS_PRIORITY_1"));
        this.byId("SapSplPriorityRadioButton_2").setText(oSapSplUtils.getBundle().getText("INCIDENTS_PRIORITY_2"));
        this.byId("SapSplPriorityRadioButton_3").setText(oSapSplUtils.getBundle().getText("INCIDENTS_PRIORITY_3"));
        this.byId("SapSplPriorityRadioButton_4").setText(oSapSplUtils.getBundle().getText("INCIDENTS_PRIORITY_4"));

    },
    setParentDialogButtonStateBasedOnCurrentPage: function (sPageIdentifier) {

        if (!this.oSapSplSendMessageSendButton) {
            this.oSapSplSendMessageSendButton = new sap.m.Button({
                press: jQuery.proxy(this.fnHandlePressOfSendMessageDialog, this)
            });
        }
        if (!this.oSapSplSendMessageCancelButton) {
            this.oSapSplSendMessageCancelButton = new sap.m.Button({
                press: jQuery.proxy(this.fnHandlePressOfSendMessageDialogCancel, this)
            });
        }

        if (sPageIdentifier === "SendMessageForm") {
            this.oSapSplSendMessageSendButton.setText(oSapSplUtils.getBundle().getText("SEND_MESSAGE_ACTION_TEXT"));
            this.oSapSplSendMessageCancelButton.setText(oSapSplUtils.getBundle().getText("MY_COLLEAGUES_CANCEL_BUTTON"));
            this.oParentDialogInstance.setBeginButton(this.oSapSplSendMessageSendButton);
            this.oParentDialogInstance.setEndButton(this.oSapSplSendMessageCancelButton);
        } else if (sPageIdentifier === "BusinessPartners") {
            this.oSapSplSendMessageCancelButton.setText(oSapSplUtils.getBundle().getText("MY_COLLEAGUES_CANCEL_BUTTON"));
            this.oSapSplSendMessageSendButton.setText(oSapSplUtils.getBundle().getText("OK_BUTTON_TEXT"));
            this.oParentDialogInstance.setBeginButton(this.oSapSplSendMessageSendButton);
            this.oParentDialogInstance.setEndButton(this.oSapSplSendMessageCancelButton);

        } else if (sPageIdentifier === "Incidents") {
            this.oSapSplSendMessageCancelButton.setText(oSapSplUtils.getBundle().getText("MY_COLLEAGUES_CANCEL_BUTTON"));
            this.oParentDialogInstance.setBeginButton(this.oSapSplSendMessageCancelButton);
        } else {
            this.oSapSplSendMessageSendButton.setText(oSapSplUtils.getBundle().getText("OK_BUTTON_TEXT"));
            this.oSapSplSendMessageCancelButton.setText(oSapSplUtils.getBundle().getText("MY_COLLEAGUES_CANCEL_BUTTON"));
            this.oParentDialogInstance.setBeginButton(this.oSapSplSendMessageSendButton);
            this.oParentDialogInstance.setEndButton(this.oSapSplSendMessageCancelButton);
        }
    },

    fnValueHelpForSelectBusinessPartner: function () {
        var oModelData;
        if (sap.ui.getCore().getModel("SapSplValueHelpForSelectBusinessPartnersModel")) {
            oModelData = sap.ui.getCore().getModel("SapSplValueHelpForSelectBusinessPartnersModel").getData();
        } else {
            oModelData = {};
            oModelData["BusinessPartners"] = [];
        }

        this.fnOpenDialogForValueHelp(oSapSplUtils.getBundle().getText("SEND_MESSAGE_SELECT_BUSINESS_PARTNER_PAGE_TITLE"), "BusinessPartners", "MultiSelect", "Role.description", "", "Navigation", undefined, oModelData);
    },
    fnValueHelpForIncidentMessage: function () {
        var oModelData;
        if (sap.ui.getCore().getModel("SapSplValueHelpForSelectIncidentModel")) {
            oModelData = sap.ui.getCore().getModel("SapSplValueHelpForSelectIncidentModel").getData();
        } else {
            oModelData = {};
            oModelData["Incidents"] = [];
        }
        this.fnOpenDialogForValueHelp(oSapSplUtils.getBundle().getText("SEND_MESSAGE_SELECT_INCIDENT"), "Incidents", "SingleSelectMaster", "Name", "LongText", undefined, undefined, oModelData);
    },

    fnHandlePressOfSendMessageDialogCancel: function () {
        //if(this.navContainer.getCurrentPage().getId().indexOf("SapSplSendMessageBusinessPartnerPage")>-1) {
        var that = this;
        if (oSapSplUtils.getIsDirty()) {
            sap.m.MessageBox.show(
                oSapSplUtils.getBundle().getText("DATA_LOSS_WARNING_TEXT"),
                sap.m.MessageBox.Icon.WARNING,
                oSapSplUtils.getBundle().getText("WARNING"), [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.CANCEL],
                function (selection) {
                    if (selection === "YES") {
                        that.getView().getParent().getParent().close();
                        that.getView().getParent().getParent().destroy();
                        oSapSplUtils.setIsDirty(false);
                    }
                }, null, oSapSplUtils.fnSyncStyleClass( "messageBox" )
            );
        } else {
            this.getView().getParent().getParent().close();
            this.getView().getParent().getParent().destroy();
        }
    },

    fnHandlePressOfBackButtonToSendMessagePage: function () {
    	//Fix incident 1580111246
    	this.fnHandlePressOfSendMessageDialog();
    },

    fnHandlePressOfBusinessPartnerUsersBackButton: function () {
    	//Fix incident 1580111246
    	this.fnHandlePressOfSendMessageDialog();
    },

    fnHandlePressOfSendMessageDialog: function () {
        if (this.navContainer.getCurrentPage().getId().indexOf("SapSplSendMessageBusinessPartnerPage") > -1) {

            this.fnPreparePayloadToSendMessage();

        } else {

            var sSelectedItems, index, sRole, oModelData, event = {};

            if (this.navContainer.getCurrentPage().getId().indexOf("SapSplSendMessageSelectBusinessPartnerUsersPage") > -1) {


                event.mParameters = {};
                event.mParameters.query = "";
                //this.fnToHandleSearchOfSelectBusinessPartnerUsersPage(event);

                sSelectedItems = this.byId("SapSplSendMessageBusinessPartnerSelectUserDialogList").getSelectedItems();
                if (sSelectedItems.length > 0) {

                    //set isDirty flag
                    this.setIsDirtyFlagOfUtils();

                    sRole = this.byId("SapSplSendMessageBusinessPartnerSelectUserDialogList").getItems()[0].getBindingContext().getProperty()["Role.description"];
                    if (sRole) {
                        this.businessPartnerSelected[sRole] = [];
                        if (!this.businessPartnerExisting[sRole]) {
                            this.businessPartnerExisting[sRole] = sSelectedItems.length;
                        }
                    }
                    for (index = 0; index < sSelectedItems.length; index++) {
                        this.businessPartnerSelected[sRole][index] = {};
                        this.businessPartnerSelected[sRole][index]["UUID"] = sSelectedItems[index].getBindingContext().getProperty()["UUID"];
                        this.businessPartnerSelected[sRole][index]["Organization_Name"] = sSelectedItems[index].getBindingContext().getProperty()["Organization_Name"];
                    }

                } else {
                    if (this.byId("SapSplSendMessageBusinessPartnerSelectUserDialogList").getItems().length) {
                        this.businessPartnerSelected[this.byId("SapSplSendMessageBusinessPartnerSelectUserDialogList").getItems()[0].getBindingContext().getProperty()["Role.description"]] = [];
                    }

                }

                if (sap.ui.getCore().getModel("SapSplValueHelpForSelectBusinessPartnersModel")) {
                    oModelData = sap.ui.getCore().getModel("SapSplValueHelpForSelectBusinessPartnersModel").getData();
                } else {
                    oModelData = {};
                    oModelData["BusinessPartners"] = [];
                }

                this.fnOpenDialogForValueHelp(oSapSplUtils.getBundle().getText("SEND_MESSAGE_SELECT_BUSINESS_PARTNER_PAGE_TITLE"), "BusinessPartners", "MultiSelect", "Role.description", "", "Navigation", undefined, sap.ui.getCore().getModel("SapSplValueHelpForSelectBusinessPartnersModel").getData());

            } else {

                var sItems, fnSuccess, fnFailure, sFilter;

                event.mParameters = {};
                event.mParameters.query = "";
                //this.fnToHandleSearchOfSelectBusinessPartnerPage(event);

                sItems = this.byId("SapSplSendMessageBusinessPartnerSelectDialogList").getItems();
                //this.businessPartnerSelected = []

                for (index = 0; index < sItems.length; index++) {
                    if (sItems[index].getSelected() === true) {

                        //set isDirty flag
                        this.setIsDirtyFlagOfUtils();

                        fnSuccess = function (oResults) {

                            var oModel = new sap.ui.model.json.JSONModel(),
                                jIndex;
                            oModel.setData({
                                BusinessPartnerUsers: oResults.results
                            });
                            if (!this.businessPartnerExisting[sItems[index].getBindingContext().getProperty()["Role.description"]]) {
                                this.businessPartnerExisting[sItems[index].getBindingContext().getProperty()["Role.description"]] = oResults.results.length;
                            }
                            if (oModel.getData()["BusinessPartnerUsers"].length > 0) {
                                if (sItems[index].getBindingContext().getProperty()["Role.description"]) {
                                    this.businessPartnerSelected[sItems[index].getBindingContext().getProperty()["Role.description"]] = [];
                                    for (jIndex = 0; jIndex < oModel.getData()["BusinessPartnerUsers"].length; jIndex++) {
                                        this.businessPartnerSelected[sItems[index].getBindingContext().getProperty()["Role.description"]][jIndex] = {};
                                        this.businessPartnerSelected[sItems[index].getBindingContext().getProperty()["Role.description"]][jIndex]["UUID"] = oModel.getData()["BusinessPartnerUsers"][jIndex].UUID;
                                        this.businessPartnerSelected[sItems[index].getBindingContext().getProperty()["Role.description"]][jIndex]["Organization_Name"] = oModel.getData()["BusinessPartnerUsers"][jIndex]["Organization_Name"];
                                    }
                                }
                            } else {
                                this.businessPartnerSelected[sItems[index].getBindingContext().getProperty()["Role.description"]] = [];
                            }
                        };
                        fnFailure = function () {

                        };
                        sFilter = "$filter=Role eq \'" + sItems[index].getBindingContext().getProperty()["Role"] + "\' and RequestStatus eq '1'";

                        if (this.businessPartnerSelected[sItems[index].getBindingContext().getProperty()["Role.description"]]) {
                            if (this.businessPartnerSelected[sItems[index].getBindingContext().getProperty()["Role.description"]].length !== this.businessPartnerExisting[sItems[index].getBindingContext().getProperty()["Role.description"]]) {
                                this.oSapSplApplModel.read("/RecipientList", null, [sFilter], false, jQuery.proxy(fnSuccess, this), jQuery.proxy(fnFailure, this));
                            }
                        } else {
                            this.oSapSplApplModel.read("/RecipientList", null, [sFilter], false, jQuery.proxy(fnSuccess, this), jQuery.proxy(fnFailure, this));
                        }
                    } else {
                        if (this.businessPartnerSelected[sItems[index].getBindingContext().getProperty()["Role.description"]]) {
                            if (this.businessPartnerSelected[sItems[index].getBindingContext().getProperty()["Role.description"]].length === this.businessPartnerExisting[sItems[index].getBindingContext().getProperty()["Role.description"]]) {
                                this.businessPartnerSelected[sItems[index].getBindingContext().getProperty()["Role.description"]] = {};
                            }
                        }
                    }
                }

                this.setParentDialogButtonStateBasedOnCurrentPage("SendMessageForm");

                this.navContainer.to(this.navContainer.getPages()[0].sId, "slide");
                if (this.navContainer.getPreviousPage().getId().indexOf("SapSplSendMessageSelectBusinessPartnerPage") > -1) {
                    this.updateValueHelpControl("bupa");
                } else {
                    this.updateValueHelpControl("incident");
                }
            }
        }

    },

    getThreadUUID: function (sFilter) {

        var returnValue = null;

        oSapSplAjaxFactory.fireAjaxCall({
            url: oSapSplUtils.getFQServiceUrl("/sap/spl/xs/app/services/appl.xsodata/ThreadList?" + sFilter + "&$format=json"),
            method: "GET",
            async: false,
            success: function (oData) {
                if (oData.d.results.length > 0) {
                    returnValue = oData.d.results[0]["ThreadUUID"];
                } else {
                    returnValue = oSapSplUtils.getUUID();
                }
            },
            error: function () {
                returnValue = oSapSplUtils.getUUID();
            }
        });

        return returnValue;
    },

    fnPreparePayloadToSendMessage: function () {

        var oRolesList, index, payload = {},
            payloadText = {},
            payloadHeader = {},
            bSelectedItemsOfRole = [],
            sIndex, that = this,
            sUUID = "";
        payload["Header"] = [];
        payload["Recipient"] = [];
        payload["Text"] = [];
        sUUID = oSapSplUtils.getUUID();
        payloadHeader.UUID = sUUID;

        if (this.incidentSelected.UUID) {
            payloadHeader.TemplateUUID = this.incidentSelected.UUID;
        } else {
            payloadHeader.TemplateUUID = "";
        }
        payloadHeader.Priority = this.fnPriorityRadioButtonLayoutAccess("get");
        payloadHeader["OwnerID"] = oSapSplUtils.getCompanyDetails()["BasicInfo_CompanyID"];
        payloadHeader["SenderID"] = oSapSplUtils.getCompanyDetails()["BasicInfo_CompanyID"];

        payloadHeader["AuditTrail.CreatedBy"] = null;
        payloadHeader["AuditTrail.ChangedBy"] = null;
        payloadHeader["AuditTrail.CreationTime"] = null;
        payloadHeader["AuditTrail.ChangeTime"] = null;
        if (this.incidentSelected.SourceLocation) {
            payloadHeader["SourceLocation"] = JSON.parse(this.incidentSelected.SourceLocation);
        } else {
            payloadHeader["SourceLocation"] = null;
        }

        payloadText.UUID = sUUID;
        /* CSN FIX : 0120031469 682358 2014 Remove the Language attribute from the payload*/
        if (this.incidentSelected.ShortText) {
            payloadText.ShortText = this.incidentSelected.ShortText;
        } else {
            payloadText.ShortText = this.byId("SapSplMessageFromIncidentInput").getValue();
        }
        payloadText.LongText = this.byId("SapSplMessageFromIncidentInput").getValue();


        oRolesList = sap.ui.getCore().getModel("SapSplValueHelpForSelectBusinessPartnersModel").getData()["BusinessPartners"];
        for (index = 0; index < oRolesList.length; index++) {
            bSelectedItemsOfRole = this.businessPartnerSelected[oRolesList[index]["Role.description"]];
            if (bSelectedItemsOfRole && bSelectedItemsOfRole.length > 0) {
                for (sIndex = 0; sIndex < bSelectedItemsOfRole.length; sIndex++) {
                    payload["Recipient"].push(this.prepareMessagePayloadObject(bSelectedItemsOfRole[sIndex].UUID, payloadHeader.UUID));
                }
            }
        }

        if (payload["Recipient"].length === 1) {
            var sFilter = "$filter=(" + encodeURIComponent("RecipientUUID eq " + "X" + "\'" + oSapSplUtils.base64ToHex(payload["Recipient"][0]["RecipientUUID"]) + "\'") + " and " + encodeURIComponent("SenderID eq " + "X" + "\'" + oSapSplUtils.base64ToHex(oSapSplUtils.getCompanyDetails()["BasicInfo_CompanyID"]) + "\'") + ") or (" + encodeURIComponent("SenderID eq " + "X" + "\'" + oSapSplUtils.base64ToHex(payload["Recipient"][0]["RecipientUUID"]) + "\'") + " and " + encodeURIComponent("RecipientUUID eq " + "X" + "\'" + oSapSplUtils.base64ToHex(oSapSplUtils.getCompanyDetails()["BasicInfo_CompanyID"]) + "\')");
            payloadHeader["ThreadUUID"] = this.getThreadUUID(sFilter);
        } else {
            payloadHeader["ThreadUUID"] = oSapSplUtils.getUUID();
        }

        payload["Header"][0] = payloadHeader;
        payload["Text"][0] = payloadText;

        payload["Object"] = "MessageOccurrence";

        if (payload["Recipient"].length > 0 && payloadText.LongText.length !== 0) {
            oSapSplBusyDialog.getBusyDialogInstance({
                title: oSapSplUtils.getBundle().getText("BUSY_DIALOG_MESSAGE")
            }).open();
            window.setTimeout(function () {
                oSapSplAjaxFactory.fireAjaxCall({
                    url: oSapSplUtils.getServiceMetadata("message", true),
                    method: "POST",
                    // CSN FIX : 0120061532 1495872    2014
                    contentType: "json; charset=UTF-8",
                    async: false,
                    beforeSend: function (request) {
                        request.setRequestHeader("X-CSRF-Token", oSapSplUtils.getCSRFToken());
                        request.setRequestHeader("Cache-Control", "max-age=0");
                    },
                    data: JSON.stringify(payload),
                    success: function (data, success, messageObject) {
                        oSapSplBusyDialog.getBusyDialogInstance().close();
                        if (data.constructor === String) {
                            data = JSON.parse(data);
                        }
                        if (messageObject["status"] === 200 && data["Error"].length === 0) {
                            sap.ca.ui.message.showMessageToast(oSapSplUtils.getBundle().getText("MESSAGE_SENT_SUCCESSFULLY"));
                            //Close & Destroy Dialog

                            //set isDirty flag to false
                            oSapSplUtils.setIsDirty(false);

                            that.getView().getParent().getParent().close();
                            that.getView().getParent().getParent().destroy();
                        } else {
                            var errorMessage = oSapSplUtils.getErrorMessagesfromErrorPayload(data)["ufErrorObject"];
                            sap.ca.ui.message.showMessageBox({
                                type: sap.ca.ui.message.Type.ERROR,
                                message: oSapSplUtils.getErrorMessagesfromErrorPayload(data)["errorWarningString"],
                                details: errorMessage
                            });
                        }
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
                                type: sap.ca.ui.message.Type.ERROR,
                                message: oSapSplUtils.getErrorMessagesfromErrorPayload(JSON.parse(error.responseText))["errorWarningString"],
                                details: oSapSplUtils.getErrorMessagesfromErrorPayload(JSON.parse(error.responseText))["ufErrorObject"]
                            });
                        }
                    },
                    complete: function () {

                    }

                });
            }, 50);
        } else {
            if (payloadText.LongText.length === 0) {
                this.byId("sapSplMessageToRecipientMessageFieldLayout").addStyleClass("redBorder");
            } else {
                this.byId("sapSplMessageToRecipientMessageFieldLayout").removeStyleClass("redBorder");
            }

            if (payload["Recipient"].length === 0) {
                this.byId("SapSplBupaValueHelpLayout").addStyleClass("redBorder");
            } else {
                this.byId("SapSplBupaValueHelpLayout").removeStyleClass("redBorder");
            }
        }
    },

    prepareMessagePayloadObject: function (sUUID, mUUID) {
        var payloadObject = {};

        payloadObject.UUID = oSapSplUtils.getUUID();
        payloadObject.RecipientType = "BusinessPartner";
        payloadObject.RecipientUUID = sUUID;
        payloadObject.ParentUUID = mUUID;
        payloadObject.isRead = "0";

        return payloadObject;
    },

    /**
     * @description method to access the priority radio buttons layout
     * it can be used in 2 modes, "set"/"get".
     * In the set mode, one can set a priority on the radio buttons.
     * In the get mode, one can get the text of the selected radio button.
     * @param sMode {string} - either get or set
     * @param sPriority {string} optional (priority to be set)
     * @returns sText {string} in case of get mode.
     * @since 1.0
     */
    fnPriorityRadioButtonLayoutAccess: function (sMode, sPriority) {
        var aRadioButtons = this.byId("SapSplSendMessagePriorityRadioButtonHolder").getContent(),
            i, sButtonId;
        if (sMode === "set" && sPriority) {
            for (i = 0; i < aRadioButtons.length; i++) {
                sButtonId = aRadioButtons[i].sId.split("_");
                if (sButtonId[sButtonId.length - 1] === sPriority) {
                    aRadioButtons[i].setSelected(true);
                } else {
                    aRadioButtons[i].setSelected(false);
                }
            }
        } else if (sMode === "get") {
            for (i = 0; i < aRadioButtons.length; i++) {
                if (aRadioButtons[i].getSelected()) {
                    sButtonId = aRadioButtons[i].sId.split("_");
                    return sButtonId[sButtonId.length - 1];
                }
            }
        }
    },

    fnOpenDialogForValueHelp: function (sTitle, sPath, bIsMultiSelect, sTitlePath, sDescPath, sIsNavigation, sIsSelected, oModelData) {

        var oItemTemplate, oSapSplSendMessageSelectDialogList;
        var that = this,
            dataLength, index;
        this.tempSelectedItems = [];
        if (sPath === "BusinessPartners") {
            this.byId("SapSplSendMessageBusinessPartnerSelectDialogTitle").setText(sTitle);
            this.navContainer.to(this.navContainer.getPages()[1].sId, "slide");
            oSapSplSendMessageSelectDialogList = this.byId("SapSplSendMessageBusinessPartnerSelectDialogList");
            dataLength = oModelData["BusinessPartners"].length;
        } else if (sPath === "Incidents") {
            this.navContainer.to(this.navContainer.getPages()[2].sId, "slide");
            window.setTimeout(function () {
                that.byId("SapSplSendMessageIncidentSelectDialogTitle").setText(sTitle);
            }, 200);
            oSapSplSendMessageSelectDialogList = this.byId("SapSplSendMessageIncidentSelectDialogList");
            dataLength = oModelData["Incidents"].length;
        } else {
            this.navContainer.to(this.navContainer.getPages()[3].sId, "slide");
            this.byId("SapSplSendMessageBusinessPartnerSelectUserDialogTitle").setText(sTitle);
            oSapSplSendMessageSelectDialogList = this.byId("SapSplSendMessageBusinessPartnerSelectUserDialogList");
        }

        this.setParentDialogButtonStateBasedOnCurrentPage(sPath);
        oSapSplSendMessageSelectDialogList.setMode(bIsMultiSelect);
        if (sDescPath === "") {
            oItemTemplate = new sap.m.StandardListItem({
                title: "{" + sTitlePath + "}",
                type: sIsNavigation,
                selected: sIsSelected
            }).attachPress(jQuery.proxy(that.fnHandlePressOfListItem, that));
        } else {
            oItemTemplate = new sap.m.StandardListItem({
                title: "{" + sTitlePath + "}",
                description: "{" + sDescPath + "}",
                type: sIsNavigation,
                selected: sIsSelected
            }).attachPress(jQuery.proxy(that.fnHandlePressOfListItem, that));
        }

        function fnSuccess(oResults) {
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.setData({
                BusinessPartnerUsers: oResults.results
            });
            sap.ui.getCore().setModel(oModel, "SapSplBusinessPartnerUsersModel");
            this.byId("SapSplSendMessageBusinessPartnerSelectUserDialogList").setModel(sap.ui.getCore().getModel("SapSplBusinessPartnerUsersModel"));
        }

        function fnFailure() {

        }

        if (sPath === "BusinessPartnerUsers") {
            var sFilter = "$filter=Role.description eq \'" + oModelData + "\' and RequestStatus eq '1'";
            this.oSapSplApplModel.read("/RecipientList", null, [sFilter], false, jQuery.proxy(fnSuccess, this), jQuery.proxy(fnFailure, this));
        }
        oSapSplSendMessageSelectDialogList.unbindAggregation("items");
        oSapSplSendMessageSelectDialogList.bindAggregation("items", "/" + sPath, oItemTemplate);
        if (sPath === "BusinessPartnerUsers") {
            oSapSplSendMessageSelectDialogList.getModel().setData(sap.ui.getCore().getModel("SapSplBusinessPartnerUsersModel").getData());
            if (sap.ui.getCore().getModel("SapSplBusinessPartnerUsersModel").getData()["BusinessPartnerUsers"].length === 0) {
                //this.oParentDialogInstance.setBeginButton();
                this.oParentDialogInstance.setEndButton();
                this.oParentDialogInstance.setBeginButton(this.oSapSplSendMessageCancelButton);
            }
            if (sIsSelected === false) {

                if (!this.businessPartnerExisting[oModelData]) {
                    this.businessPartnerExisting[oModelData] = sap.ui.getCore().getModel("SapSplBusinessPartnerUsersModel").getData().BusinessPartnerUsers.length;
                }
                oSapSplSendMessageSelectDialogList.removeSelections();
                var oListItems = oSapSplSendMessageSelectDialogList.getModel().getData(),
                    jSelectedIndex;
                if (oListItems.length > 0) {
                    for (index = 0; index < oListItems.length; index++) {
                        if (this.businessPartnerSelected[oListItems[index]["Role.description"]] !== undefined) {
                            var toPartnerUUIDs = this.businessPartnerSelected[oListItems[0]["Role.description"]];
                            for (jSelectedIndex = 0; jSelectedIndex < toPartnerUUIDs.length; jSelectedIndex++) {
                                if (toPartnerUUIDs[jSelectedIndex]["UUID"] === oListItems[index]["UUID"]) {
                                    this.byId("SapSplSendMessageBusinessPartnerSelectUserDialogList").getItems()[index].setSelected(true);
                                    this.tempSelectedItems.push(toPartnerUUIDs[jSelectedIndex]["UUID"]);
                                    break;
                                }
                            }
                        }
                    }
                }
            } else {
                for (index = 0; index < sap.ui.getCore().getModel("SapSplBusinessPartnerUsersModel").getData().BusinessPartnerUsers.length; index++) {
                    this.tempSelectedItems.push(sap.ui.getCore().getModel("SapSplBusinessPartnerUsersModel").getData().BusinessPartnerUsers[index].UUID);
                }
            }
        } 
        if (sPath === "BusinessPartners") {
            var sItems = this.byId("SapSplSendMessageBusinessPartnerSelectDialogList").getItems();
            if (sItems.length > 0) {
                for (index = 0; index < sItems.length; index++) {
                    var totalBP, selectedBP;
                    if (sItems[index].getBindingContext() && this.businessPartnerExisting[sItems[index].getBindingContext().getProperty()["Role.description"]] && this.businessPartnerSelected[sItems[index].getBindingContext().getProperty()["Role.description"]]) {
                        totalBP = this.businessPartnerExisting[sItems[index].getBindingContext().getProperty()["Role.description"]];
                        selectedBP = this.businessPartnerSelected[sItems[index].getBindingContext().getProperty()["Role.description"]].length;
                        if (totalBP === selectedBP) {
                            sItems[index].setSelected(true);
                            this.tempSelectedItems.push(sItems[index].getBindingContext().getProperty()["Role.description"]);
                        } else {
                            sItems[index].setSelected(false);
                        }
                    } else {
                        sItems[index].setSelected(false);
                    }

                }

            }

        }

    },

    setParentDialogInstance: function (oParentDialog) {
        this.oParentDialogInstance = oParentDialog;
        this.setParentDialogButtonStateBasedOnCurrentPage("SendMessageForm");
    },

    fnHandlePressOfListItem: function (evt) {
        var title = oSapSplUtils.getBundle().getText("SEND_MESSAGE_SELECT_BUSINESS_PARTNER_USER_PAGE_TITLE", evt.getSource().getBindingContext().getObject()["Role.description"]);

        this.currentBusinessPartner = {};
        this.currentBusinessPartner["Role"] = evt.getSource().getBindingContext().getObject()["Role"];
        this.currentBusinessPartner["Role.description"] = evt.getSource().getBindingContext().getObject()["Role.description"];
        this.navContainer.to(this.navContainer.getPages()[3].sId, "slide");
        this.fnOpenDialogForValueHelp(title, "BusinessPartnerUsers", "MultiSelect", "Organization_Name", "", undefined, evt.getSource().getSelected(), evt.getSource().getTitle());
        
    },

    fnHandleSelectIncidentOfListItem: function () {
        var sSelectedItem;
        if (this.navContainer.getCurrentPage().getId().indexOf("SapSplSendMessageSelectIncidentsPage") > -1) {

            //set isDirty flag
            this.setIsDirtyFlagOfUtils();

            sSelectedItem = this.byId("SapSplSendMessageIncidentSelectDialogList").getSelectedItem();
            if (sSelectedItem) {
                this.incidentSelected.UUID = sSelectedItem.getBindingContext().getProperty()["UUID"];
                this.incidentSelected.Name = sSelectedItem.getBindingContext().getProperty()["Name"];
                this.incidentSelected.LongText = sSelectedItem.getBindingContext().getProperty()["LongText"];
                this.incidentSelected.ShortText = sSelectedItem.getBindingContext().getProperty()["ShortText"];
                this.incidentSelected.Priority = sSelectedItem.getBindingContext().getProperty()["Priority"];
                this.incidentSelected.SourceLocation = sSelectedItem.getBindingContext().getProperty()["IncidentLocationGeometry"];
            }
            this.setParentDialogButtonStateBasedOnCurrentPage("SendMessageForm");

            this.navContainer.to(this.navContainer.getPages()[0].sId, "slide");
            this.updateValueHelpControl("incident");
            this.fnPriorityRadioButtonLayoutAccess("set", this.incidentSelected.Priority);

            /* CSNFIX : 0120061532 1443215    2014 */
            this.byId("sapSplAttachIncidentLink").setText(this.incidentSelected.Name);

            this.byId("SapSplMessageFromIncidentInput").setValue(this.incidentSelected.LongText);
            this.byId("sapSplMessageToRecipientMessageFieldLayout").removeStyleClass("redBorder");
        }
    },

    /**
     * @description Method to instantiate a horizontal layout, which would represent the selected item from the select dialog list.
     * This would have 2 parts, one being the selected list item detail, other one being the "x" button, for deletion of this item.
     * @param oItemDetail {object} object of the selected item detail.
     * @pram sMode {string} mode to distinguish between the call from "geofence" context or from "incident" context.
     * @returns void.
     * @since 1.0
     */
    getSelectedItemLayout: function (oItemDetail, sMode) {
        var oDeleteButton = null,
            oItemDetailButton = null,
            oItemSelectedLayout = null,
            sItemDetail = "",
            sID = "",
            oCustomData = null,
            sBupaType = "";
        if (sMode && sMode === "bupa") {
            sItemDetail = oItemDetail["Organization_Name"];
            sID = oItemDetail["UUID"];
            sBupaType = oItemDetail["type"];
            oCustomData = new sap.ui.core.CustomData({
                key: "ID",
                value: {
                    id: sID,
                    mode: sMode,
                    type: sBupaType
                }
            });
        } else {
            sItemDetail = oItemDetail["Name"];
            sID = oItemDetail["UUID"];
            oCustomData = new sap.ui.core.CustomData({
                key: "ID",
                value: {
                    id: sID,
                    mode: sMode
                }
            });
        }


        var that = this;
        oDeleteButton = new sap.m.Button({
            text: "x",
            type: "Unstyled"
        }).addStyleClass("itemLayoutButton").addStyleClass("deleteItemButton");
        oItemDetailButton = new sap.m.Button({
            text: sItemDetail,
            type: "Unstyled"
        }).addStyleClass("itemLayoutButton").addStyleClass("itemDetailButton");
        oItemSelectedLayout = new sap.ui.commons.layout.HorizontalLayout({
            content: [oItemDetailButton, oDeleteButton]
        }).addStyleClass("itemLayout");
        oDeleteButton.attachPress(function (e) {
            var oSelectedItemLayout = e.getSource().getParent();
            that.fnDeleteTheSelectedBupaFromArray(oSelectedItemLayout.getCustomData()[0].getValue());

            oSelectedItemLayout.destroy();

        });
        return oItemSelectedLayout.addCustomData(oCustomData);

    },

    fnDeleteTheSelectedBupaFromArray: function (oDetails) {
        if (oDetails["mode"] === "bupa") {
            var aNewSelectedBupas = [];
            var aSelectedBupas = this.businessPartnerSelected[oDetails["type"]];
            for (var i = 0; i < aSelectedBupas.length; i++) {
                if (aSelectedBupas[i]["UUID"] !== oDetails["id"]) {
                    aNewSelectedBupas.push(aSelectedBupas[i]);
                }
            }
            this.businessPartnerSelected[oDetails["type"]] = aNewSelectedBupas;
        } else {
            this.incidentSelected = {};
            this.byId("SapSplSendMessageIncidentSelectDialogList").removeSelections();
        }
    },

    updateValueHelpControl: function (page) {
        var that = this,
            aAllSelections = [],
            oLayout, aContent, oInputValueHelp;
        if (page === "bupa") {

            jQuery.each(this.businessPartnerExisting, function (key) {
                var aSelectedBupas = that.businessPartnerSelected[key];
                if (aSelectedBupas) {
                    for (var index = 0; index < aSelectedBupas.length; index++) {
                        aSelectedBupas[index]["type"] = key;
                        aAllSelections.push(aSelectedBupas[index]);
                    }
                }
            });
            aContent = that.byId("SapSplBupaValueHelpCell").getContent();
            oInputValueHelp = aContent[aContent.length - 1];
            that.byId("SapSplBupaValueHelpCell").removeAllContent();
            that.byId("SapSplBupaValueHelpCell").addContent(oInputValueHelp);

            that.byId("SapSplValueHelpForSelectBusinessPartnerInput").addStyleClass("sapSplSendMessageToBuPaDisableInputField");

            for (var index = 0; index < aAllSelections.length; index++) {
                oLayout = that.getSelectedItemLayout(aAllSelections[index], "bupa");
                that.byId("SapSplBupaValueHelpCell").insertContent(oLayout, 0);
                this.byId("SapSplBupaValueHelpLayout").removeStyleClass("redBorder");
            }
        }

    },

    fnHandleSelectOfBusinessPartnerUsersListItem: function () {

    },

    setIsDirtyFlagOfUtils: function () {
        if (!oSapSplUtils.getIsDirty()) {
            oSapSplUtils.setIsDirty(true);
        }
    },

    fnToHandleSearchOfSelectBusinessPartnerUsersPage: function (oEvent) {
        var sFilter = "$filter=Role eq \'" + this.currentBusinessPartner.Role + "\' and RequestStatus eq '1'";
        var searchString = oEvent.mParameters.query;
        var oSapSplBusinessPartnerUsersList, payload, sIndex, jIndex, userList;

        oSapSplBusinessPartnerUsersList = this.getView().byId("SapSplSendMessageBusinessPartnerSelectUserDialogList");

        if (searchString.length > 2) {

            payload = this.prepareSearchPayload(searchString, "B");
            this.callSearchService(payload, "B");

        } else if (oSapSplBusinessPartnerUsersList.getBinding("items") !== undefined) {

            function fnSuccess(oResults) {

                sap.ui.getCore().getModel("SapSplBusinessPartnerUsersModel").setData({
                    BusinessPartnerUsers: oResults.results
                });
                userList = this.getView().byId("SapSplSendMessageBusinessPartnerSelectUserDialogList");
                userList.removeSelections();
                for (sIndex = 0; sIndex < this.tempSelectedItems.length; sIndex++) {
                    for (jIndex = 0; jIndex < userList.getItems().length; jIndex++) {
                        if (this.tempSelectedItems[sIndex] === userList.getItems()[jIndex].getBindingContext().getObject().UUID) {
                            userList.setSelectedItem(userList.getItems()[jIndex]);
                        }
                    }
                }
            }

            function fnFailure() {

            }
           
            this.oSapSplApplModel.read("/RecipientList", null, [sFilter], false, jQuery.proxy(fnSuccess, this), jQuery.proxy(fnFailure, this));
        }
    },

    fnToHandleSearchOfSelectBusinessPartnerPage: function (oEvent) {
        var searchString = oEvent.mParameters.query;
        var oSapSplBusinessPartnerList, payload, userList, sIndex, jIndex;

        oSapSplBusinessPartnerList = this.getView().byId("SapSplSendMessageBusinessPartnerSelectDialogList");

        if (searchString.length > 2) {

            payload = this.prepareSearchPayload(searchString, "R");
            this.callSearchService(payload, "R");

        } else if (oSapSplBusinessPartnerList.getBinding("items") !== undefined) {

            sap.ui.getCore().getModel("SapSplValueHelpForSelectBusinessPartnersModel").setData({
                BusinessPartners: []
            });

            this.oSapSplApplModel.read("/DistinctRoles", null, [], false, jQuery.proxy(this.fnSuccessOfMyBusinessPartnersRead, this), jQuery.proxy(this.fnFailOfMyBusinessPartnersRead, this));

            userList = this.getView().byId("SapSplSendMessageBusinessPartnerSelectDialogList");
            userList.removeSelections();
            for (sIndex = 0; sIndex < this.tempSelectedItems.length; sIndex++) {
                for (jIndex = 0; jIndex < userList.getItems().length; jIndex++) {
                    if (this.tempSelectedItems[sIndex] === userList.getItems()[jIndex].getBindingContext().getObject()["Role.description"]) {
                        userList.setSelectedItem(userList.getItems()[jIndex]);
                    }
                }
            }
        }
    },

    fnToHandleSearchOfIncidents: function (event) {
        var searchString = event.getParameters().query;
        var oSapSplIncidentsList, payload;

        oSapSplIncidentsList = this.getView().byId("SapSplSendMessageIncidentSelectDialogList");

        if (searchString.length > 2) {

            payload = this.prepareSearchPayload(searchString, "I");
            this.callSearchService(payload, "I");

        } else if (oSapSplIncidentsList.getBinding("items") !== undefined) {

            sap.ui.getCore().getModel("SapSplValueHelpForSelectIncidentModel").setData({
                Incidents: []
            });

            this.oSapSplApplModel.read("/IncidentDetails", null, ["$filter=isDeleted eq '0'"], true, jQuery.proxy(this.fnSuccessOfIncidentsRead, this), jQuery.proxy(this.fnFailOfIncidentsRead, this));
        }
    },

    prepareSearchPayload: function (searchTerm, pageFlag) {
        var payload = {};
        payload.UserID = oSapSplUtils.getLoggedOnUserDetails().userId;


        if (pageFlag === "I") {
            payload.AdditionalCriteria = {};
            payload.ObjectType = "Message";
            payload.AdditionalCriteria.MessageObjectType = "I";
        }
        if (pageFlag === "R") {
            payload.ObjectType = "Role";
        }
        if (pageFlag === "B") {
            payload.AdditionalCriteria = {};
            payload.ObjectType = "BusinessPartner";
            payload.AdditionalCriteria.BusinessPartnerType = "O";
            payload.AdditionalCriteria.SearchPending = false;
            payload.AdditionalCriteria.Role = [];
            payload.AdditionalCriteria.Role[0] = this.currentBusinessPartner.Role;
        }

        payload.SearchTerm = searchTerm;
        payload.FuzzinessThershold = SapSplEnums.fuzzyThreshold;
        payload.MaximumNumberOfRecords = SapSplEnums.numberOfRecords;
        payload.ProvideDetails = true;
        payload.SearchInNetwork = true;

        return payload;
    },

    callSearchService: function (payload, pageFlag) {

        var tempDetails = [],
            sIndex, jIndex, that = this,
            userList;

        oSapSplAjaxFactory.fireAjaxCall({
            url: oSapSplUtils.getFQServiceUrl("/sap/spl/xs/app/services/Search.xsjs"),
            // CSN FIX : 0120061532 1495872    2014
            method: "POST",
            async: false,
            data: JSON.stringify(payload),
            success: function (data, success, messageObject) {
                oSapSplBusyDialog.getBusyDialogInstance().close();
                if (data.constructor === String) {
                    data = JSON.parse(data);
                }
                if (messageObject["status"] === 200) {

                    if (data.length > 0) {

                        for (sIndex = 0; sIndex < data.length; sIndex++) {
                            tempDetails.push(data[sIndex].Details);
                        }

                        if (pageFlag === "I") {
                            sap.ui.getCore().getModel("SapSplValueHelpForSelectIncidentModel").setData({
                                Incidents: tempDetails
                            });
                        }
                        if (pageFlag === "R") {
                            sap.ui.getCore().getModel("SapSplValueHelpForSelectBusinessPartnersModel").setData({
                                BusinessPartners: tempDetails
                            });
                            userList = that.getView().byId("SapSplSendMessageBusinessPartnerSelectDialogList");
                            userList.removeSelections();
                            for (sIndex = 0; sIndex < that.tempSelectedItems.length; sIndex++) {
                                for (jIndex = 0; jIndex < userList.getItems().length; jIndex++) {
                                    if (that.tempSelectedItems[sIndex] === userList.getItems()[jIndex].getBindingContext().getObject()["Role.description"]) {
                                        userList.setSelectedItem(userList.getItems()[jIndex]);
                                    }
                                }
                            }
                        }
                        if (pageFlag === "B") {

                            sap.ui.getCore().getModel("SapSplBusinessPartnerUsersModel").setData({
                                BusinessPartnerUsers: tempDetails
                            });
                            userList = that.getView().byId("SapSplSendMessageBusinessPartnerSelectUserDialogList");
                            userList.removeSelections();
                            for (sIndex = 0; sIndex < that.tempSelectedItems.length; sIndex++) {
                                for (jIndex = 0; jIndex < userList.getItems().length; jIndex++) {
                                    if (that.tempSelectedItems[sIndex] === userList.getItems()[jIndex].getBindingContext().getObject().UUID) {
                                        userList.setSelectedItem(userList.getItems()[jIndex]);
                                    }
                                }
                            }

                        }

                    } else {
                        if (pageFlag === "I") {
                            sap.ui.getCore().getModel("SapSplValueHelpForSelectIncidentModel").setData({
                                Incidents: []
                            });
                        }
                        if (pageFlag === "R") {
                            sap.ui.getCore().getModel("SapSplValueHelpForSelectBusinessPartnersModel").setData({
                                BusinessPartners: tempDetails
                            });
                        }
                        if (pageFlag === "B") {
                            sap.ui.getCore().getModel("SapSplBusinessPartnerUsersModel").setData({
                                BusinessPartnerUsers: tempDetails
                            });
                        }
                    }

                } else if (data["Error"] && data["Error"].length > 0) {

                    var errorMessage = oSapSplUtils.getErrorMessagesfromErrorPayload(data)["ufErrorObject"];
                    sap.ca.ui.message.showMessageBox({
                        type: sap.ca.ui.message.Type.ERROR,
                        message: oSapSplUtils.getErrorMessagesfromErrorPayload(data)["errorWarningString"],
                        details: errorMessage
                    });
                }
            },
            error: function (error) {
                oSapSplBusyDialog.getBusyDialogInstance().close();

                if (pageFlag === "I") {
                    sap.ui.getCore().getModel("SapSplValueHelpForSelectIncidentModel").setData({
                        Incidents: []
                    });
                }
                if (pageFlag === "R") {
                    sap.ui.getCore().getModel("SapSplValueHelpForSelectBusinessPartnersModel").setData({
                        BusinessPartners: tempDetails
                    });
                }
                if (pageFlag === "B") {
                    sap.ui.getCore().getModel("SapSplBusinessPartnerUsersModel").setData({
                        BusinessPartnerUsers: tempDetails
                    });
                }
                if (error && error["status"] === 500) {
                    sap.ca.ui.message.showMessageBox({
                        type: sap.ca.ui.message.Type.ERROR,
                        message: error["status"] + "\t" + error.statusText,
                        details: error.responseText
                    });
                } else {
                    sap.ca.ui.message.showMessageBox({
                        type: sap.ca.ui.message.Type.ERROR,
                        message: oSapSplUtils.getBundle().getText("INCORRECT_ARGUMENTS_ERROR_MESSAGE"),
                        details: oSapSplUtils.getErrorMessagesfromErrorPayload(JSON.parse(error.responseText))["ufErrorObject"]
                    });
                }
            },
            complete: function () {

            }
        });
    },

    fnHandleSelectionChange: function (oEvent) {
        var sIndex;
        if (oEvent.getParameters().selected) {
            if (oEvent.getParameters().id.indexOf("SapSplSendMessageBusinessPartnerSelectDialogList") > -1) {
                this.tempSelectedItems.push(oEvent.getParameters().listItem.getBindingContext().getObject()["Role.description"]);
            } else {
                if (oEvent.getParameters().id.indexOf("SapSplSendMessageBusinessPartnerSelectUserDialogList") > -1) {
                    this.tempSelectedItems.push(oEvent.getParameters().listItem.getBindingContext().getObject().UUID);
                }
            }
        } else {
            for (sIndex = 0; sIndex < this.tempSelectedItems.length; sIndex++) {
                if (oEvent.getParameters().id.indexOf("SapSplSendMessageBusinessPartnerSelectDialogList") > -1) {
                    if (this.tempSelectedItems[sIndex] === oEvent.getParameters().listItem.getBindingContext().getObject()["Role.description"]) {
                        this.tempSelectedItems.splice(sIndex, 1);
                        break;
                    }
                } else {
                    if (oEvent.getParameters().id.indexOf("SapSplSendMessageBusinessPartnerSelectUserDialogList") > -1) {
                        if (this.tempSelectedItems[sIndex] === oEvent.getParameters().listItem.getBindingContext().getObject().UUID) {
                            this.tempSelectedItems.splice(sIndex, 1);
                            break;
                        }
                    }
                }
            }

        }
    }
});
