/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.require("sap.ca.ui.message.message");
sap.ui.controller("splController.dialogs.SplAssignIncidenceToGeofence", {

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     */
    onInit: function () {
        this.navContainer = this.byId("sapSplAssignIncidenceToLocationNavContainer");

        // The details of the clicked location without incidents
        this.oViewData = this.getView().getViewData();

        // The details of the clicked location with incidents expand
        this.oClickedLocationDataWithIncidents = [];

        // List of incidence masterdata
        this.aIncidenceMasterdata = [];

        this.aIncidenceDataForBinding = [];

        if (!this.oSapSplAppModel) {
            var sApplUrl = oSapSplUtils.getServiceMetadata("app", true);
            this.oSapSplAppModel = new splModels.odata.ODataModel({
                url: sApplUrl,
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
            this.oSapSplAppModel.attachEvent("timeOut", function () {
                jQuery.sap.log.error("oData time out", "Failure of getLocationType() function's service call", "MapsDetailsView.controller.js");
            });
        }

        oSapSplBusyDialog.getBusyDialogInstance().open();
        this.getLocationDataWithIncidents();

        this.byId("sapSplAssignIncidenceToLocationViewIncidencePageContentList").setNoDataText(oSapSplUtils.getBundle().getText("NO_DATA_TEXT"));
        this.byId("sapSplAssignIncidenceToLocationAssignIncidencePageContentList").setNoDataText(oSapSplUtils.getBundle().getText("NO_DATA_TEXT"));


        //        this.byId( "sapSplAssignIncidenceToLocationViewIncidencePageContentList" ).getBinding("items").filter(new sap.ui.model.Filter("checked", sap.ui.model.FilterOperator.EQ, true));
        this.byId("sapSplAssignIncidenceToLocationViewIncidencePageTitle").setText(this.oViewData["Name"]);
        this.byId("sapSplAssignIncidenceToLocationAssignIncidencePageTitle").setText(this.oViewData["Name"]);
    },

    /**
     * Sets the state of parent dialog button based on the state
     * @param sPageIdentifier
     * @param dataLength
     * @since 1.0
     */
    setParentDialogButtonStateBasedOnCurrentPage: function (sPageIdentifier) {

        if (!this.oAssignIncidenceButton) {
            this.oAssignIncidenceButton = new sap.m.Button({
                press: jQuery.proxy(this.fnHandlePressOfAssignIncidenceButton, this)
            });
        }
        if (!this.oAssignIncidenceCloseButton) {
            this.oAssignIncidenceCloseButton = new sap.m.Button({
                press: jQuery.proxy(this.fnHandlePressOfAssignIncidenceCloseButton, this)
            });
        }

        // 
        if (sPageIdentifier === "ViewAssignedIncidenceForm") {
            this.oAssignIncidenceButton.setText(oSapSplUtils.getBundle().getText("SAVE"));
            this.oAssignIncidenceCloseButton.setText(oSapSplUtils.getBundle().getText("CANCEL"));
            this.oParentDialogInstance.setBeginButton(this.oAssignIncidenceButton);
            this.oParentDialogInstance.setEndButton(this.oAssignIncidenceCloseButton);
        } else {
            this.oAssignIncidenceButton.setText(oSapSplUtils.getBundle().getText("EDIT"));
            this.oAssignIncidenceCloseButton.setText(oSapSplUtils.getBundle().getText("CLOSE"));
            this.oParentDialogInstance.setBeginButton(this.oAssignIncidenceButton);
            this.oParentDialogInstance.setEndButton(this.oAssignIncidenceCloseButton);
        }
    },

    setParentDialogInstance: function (oParentDialog) {
        this.oParentDialogInstance = oParentDialog;
        this.setParentDialogButtonStateBasedOnCurrentPage("AssignIncidenceForm");
    },

    /**
     * Actions of buttons in the assign incidence page
     * @param oEvent
     * @since 1.0
     * @return void
     */
    fnHandlePressOfAssignIncidenceButton: function (oEvent) {

        // Click on Edit Button
        if (this.navContainer.getCurrentPage().getId().indexOf("sapSplAssignIncidenceToLocationNavContainerViewIncidencePage") > -1) {

            this.navContainer.to(this.navContainer.getPages()[1].sId, "slide");
            this.setParentDialogButtonStateBasedOnCurrentPage("ViewAssignedIncidenceForm");
            this.getIncidentMasterData();
            this.getDataForBinding();

            // Click on Save button
        } else {
            if (this.aIncidenceMasterdata.length !== 0) {
                var aModelData = oEvent.getSource().getParent().getContent()[0].getContent()[0].getModel().getData();
                this.saveAssignment(aModelData);
                oSapSplBusyDialog.getBusyDialogInstance().open();
            }
        }

    },

    /**
     * Actions of buttons in the view incidents page
     * @param oEvent
     * @since 1.0
     * @return void
     */
    fnHandlePressOfAssignIncidenceCloseButton: function () {

        // Click on Close button
        if (this.navContainer.getCurrentPage().getId().indexOf("sapSplAssignIncidenceToLocationNavContainerViewIncidencePage") > -1) {

            this.getView().getParent().getParent().close();

            this.getView().getParent().getParent().destroy();

            // Click on Cancel button
        } else {
            this.setParentDialogButtonStateBasedOnCurrentPage("AssignIncidenceForm");
            this.navContainer.to(this.navContainer.getPages()[0].sId, "slide");
            oSapSplBusyDialog.getBusyDialogInstance().open();
            this.getLocationDataWithIncidents();
        }
    },

    /**
     * Construct the final payload for post
     * @param aSelectedIncidence
     * @returns {___anonymous6133_6134}
     * @since 1.0
     */
    constructPayloadForPost: function (aModelData) {

        var aSelectedIncidence = aModelData;

        var hasLocation = false;
        var oFinalPayload = {},
            oRecipientObject, i, j;

        oFinalPayload["Object"] = "MessageTemplate";
        oFinalPayload["Header"] = [];
        oFinalPayload["Text"] = [];
        oFinalPayload["Recipient"] = [];

        for (i = 0; i < aSelectedIncidence.length; i++) {
            var oHeaderObject = {};
            oHeaderObject["UUID"] = aSelectedIncidence[i]["UUID"];
            oHeaderObject["Name"] = aSelectedIncidence[i]["Name"];
            oHeaderObject["Priority"] = aSelectedIncidence[i]["Priority"];
            oHeaderObject["Category"] = aSelectedIncidence[i]["Category"];
            oHeaderObject["SourceLocation"] = JSON.parse(aSelectedIncidence[i]["IncidentLocationGeometry"]);
            oHeaderObject["OwnerID"] = aSelectedIncidence[i]["OwnerID"];
            oHeaderObject["isDeleted"] = aSelectedIncidence[i]["isDeleted"];
            oHeaderObject["AuditTrail.CreatedBy"] = null;
            oHeaderObject["AuditTrail.ChangedBy"] = null;
            oHeaderObject["AuditTrail.CreationTime"] = null;
            oHeaderObject["AuditTrail.ChangeTime"] = null;
            oFinalPayload["Header"].push(oHeaderObject);

            var oTextObject = {};
            oTextObject["UUID"] = aSelectedIncidence[i]["UUID"];
            /* CSN FIX : 0120031469 682358 2014 Remove the Language attribute from the payload*/
            oTextObject["ShortText"] = aSelectedIncidence[i]["ShortText"];
            oTextObject["LongText"] = aSelectedIncidence[i]["LongText"];
            oFinalPayload["Text"].push(oTextObject);

            // Checked incidents in the list
            if (aSelectedIncidence[i]["checked"] === true) {

                // Checks if no locations are assigned to the incident
                if (aSelectedIncidence[i]["AssignedLocations"]["results"].length !== 0) {

                    // Loops through the assigned locations of an incident
                    for (j = 0; j < aSelectedIncidence[i]["AssignedLocations"]["results"].length; j++) {

                        // Checks if the incident already has the selected location
                        if (aSelectedIncidence[i]["AssignedLocations"]["results"][j]["LocationID"] === this.oViewData["LocationID"]) {
                            hasLocation = true;
                        }

                        oRecipientObject = {};
                        oRecipientObject["UUID"] = oSapSplUtils.getUUID();
                        oRecipientObject["ParentUUID"] = aSelectedIncidence[i]["UUID"];
                        oRecipientObject["RecipientType"] = "Location";
                        oRecipientObject["RecipientUUID"] = aSelectedIncidence[i]["AssignedLocations"]["results"][j]["LocationID"];
                        oRecipientObject["isDeleted"] = "0";
                        oRecipientObject["AuditTrail.CreatedBy"] = null;
                        oRecipientObject["AuditTrail.ChangedBy"] = null;
                        oRecipientObject["AuditTrail.CreationTime"] = null;
                        oRecipientObject["AuditTrail.ChangeTime"] = null;
                        oFinalPayload["Recipient"].push(oRecipientObject);
                    }

                    // If the incident doesnt have the selected location, it adds the selected location to the payload
                    if (!hasLocation) {
                        oRecipientObject = {};
                        oRecipientObject["UUID"] = oSapSplUtils.getUUID();
                        oRecipientObject["ParentUUID"] = aSelectedIncidence[i]["UUID"];
                        oRecipientObject["RecipientType"] = "Location";
                        oRecipientObject["RecipientUUID"] = this.oViewData["LocationID"];
                        oRecipientObject["isDeleted"] = "0";
                        oRecipientObject["AuditTrail.CreatedBy"] = null;
                        oRecipientObject["AuditTrail.ChangedBy"] = null;
                        oRecipientObject["AuditTrail.CreationTime"] = null;
                        oRecipientObject["AuditTrail.ChangeTime"] = null;
                        oFinalPayload["Recipient"].push(oRecipientObject);
                    }

                    // If the incident doesnt have any locations associated with it, adds the location to the incident
                } else {
                    oRecipientObject = {};
                    oRecipientObject["UUID"] = oSapSplUtils.getUUID();
                    oRecipientObject["ParentUUID"] = aSelectedIncidence[i]["UUID"];
                    oRecipientObject["RecipientType"] = "Location";
                    oRecipientObject["RecipientUUID"] = this.oViewData["LocationID"];
                    oRecipientObject["isDeleted"] = "0";
                    oRecipientObject["AuditTrail.CreatedBy"] = null;
                    oRecipientObject["AuditTrail.ChangedBy"] = null;
                    oRecipientObject["AuditTrail.CreationTime"] = null;
                    oRecipientObject["AuditTrail.ChangeTime"] = null;
                    oFinalPayload["Recipient"].push(oRecipientObject);
                }

                // Unchecked incidents in the list
            } else {

                // Loops through the assigned locations of an incident
                for (j = 0; j < aSelectedIncidence[i]["AssignedLocations"]["results"].length; j++) {

                    // Adds all the assigned locations except the selected location
                    if (aSelectedIncidence[i]["AssignedLocations"]["results"][j]["LocationID"] !== this.oViewData["LocationID"]) {
                        oRecipientObject = {};
                        oRecipientObject["UUID"] = oSapSplUtils.getUUID();
                        oRecipientObject["ParentUUID"] = aSelectedIncidence[i]["UUID"];
                        oRecipientObject["RecipientType"] = "Location";
                        oRecipientObject["RecipientUUID"] = aSelectedIncidence[i]["AssignedLocations"]["results"][j]["LocationID"];
                        oRecipientObject["isDeleted"] = "0";
                        oRecipientObject["AuditTrail.CreatedBy"] = null;
                        oRecipientObject["AuditTrail.ChangedBy"] = null;
                        oRecipientObject["AuditTrail.CreationTime"] = null;
                        oRecipientObject["AuditTrail.ChangeTime"] = null;
                        oFinalPayload["Recipient"].push(oRecipientObject);
                    }
                }
            }

        }
        return oFinalPayload;
    },

    saveAssignment: function (aModelData) {
        var that = this;

        var oFinalPayload = this.constructPayloadForPost(aModelData);

        var oSaveLocationUrl = oSapSplUtils.getServiceMetadata("message", true);

        oSapSplBusyDialog.getBusyDialogInstance().open();
        oSapSplAjaxFactory.fireAjaxCall({
            url: oSaveLocationUrl,
            method: "PUT",
            data: JSON.stringify(oFinalPayload),
            success: function (oResult, textStatus, xhr) {
                if (oResult.constructor === String) {
                    oResult = JSON.parse(oResult);
                }
                if (xhr.status === 200) {
                    oSapSplBusyDialog.getBusyDialogInstance().close();
                    sap.ca.ui.message.showMessageToast("Location saved successfully");
                    that.byId("sapSplAssignIncidenceToLocationNavContainer").back();
                    that.getLocationDataWithIncidents();
                    that.setParentDialogButtonStateBasedOnCurrentPage("AssignIncidenceForm");
                } else if (xhr.status === 202) {
                    var errorMessage = oSapSplUtils.getErrorMessagesfromErrorPayload(oResult);
                    sap.ca.ui.message.showMessageBox({
                        type: sap.ca.ui.message.Type.ERROR,
                        message: oSapSplUtils.getErrorMessagesfromErrorPayload(oResult)["errorWarningString"],
                        details: errorMessage
                    });
                    oSapSplBusyDialog.getBusyDialogInstance().close();
                }
            },

            error: function (xhr, textStatus, errorThrown) {
                if (xhr) {
                    sap.ca.ui.message.showMessageBox({
                        type: sap.ca.ui.message.Type.ERROR,
                        message: xhr["status"] + " " + xhr.statusText,
                        details: xhr.responseText
                    });
                }
                oSapSplBusyDialog.getBusyDialogInstance().close();
                jQuery.sap.log.error(errorThrown, textStatus, "SplAssignIncidenceToGeofence.controller.js");
            },
            complete: function () {}
        });
    },

    /**
     * Manipulates the location data to add counter and checked flag
     * @param void
     * @return void
     * @since 1.0
     */
    getDataForBinding: function () {
        var aIncidentMasterData = jQuery.extend([], this.aIncidenceMasterdata);
        var incidentMasterListLength = this.aIncidenceMasterdata.length;
        var assignedIncidentceLength = this.oClickedLocationDataWithIncidents.length;
        var iCounter = 0;

        for (var i = 0; i < incidentMasterListLength; i++) {
            if (assignedIncidentceLength !== 0) {
                for (var j = 0; j < assignedIncidentceLength; j++) {
                    if (aIncidentMasterData[i]["UUID"] === this.oClickedLocationDataWithIncidents[j]["UUID"]) {
                        iCounter++;
                        aIncidentMasterData[i]["checked"] = true;
                        aIncidentMasterData[i]["counter"] = iCounter;
                    } else {
                        aIncidentMasterData[i]["checked"] = false;
                        aIncidentMasterData[i]["counter"] = 0;
                    }
                }
            } else {
                aIncidentMasterData[i]["checked"] = false;
                aIncidentMasterData[i]["counter"] = 0;
            }
        }

        this.oIncidentsVisualizationModel.setData(jQuery.extend([], aIncidentMasterData));
        this.byId("sapSplAssignIncidenceToLocationAssignIncidencePageContentList").getBinding("items").sort(new sap.ui.model.Sorter("counter", true));
    },

    /**
     * oData call to get location details
     * @param void
     * @return void
     * @since 1.0
     */
    getLocationDataWithIncidents: function () {
        var that = this;

        function fnSuccess(oData) {
            var aAssignedIncidentsList = oData.results[0]["Incidents"].results;
            for (var i = 0; i < aAssignedIncidentsList.length; i++) {
                aAssignedIncidentsList[i]["selected"] = true;
            }
            that.oClickedLocationDataWithIncidents = oData.results[0]["Incidents"].results;
            oSapSplBusyDialog.getBusyDialogInstance().close();
            that.oIncidentsVisualizationModel = new sap.ui.model.json.JSONModel(that.oClickedLocationDataWithIncidents);
            that.getView().setModel(that.oIncidentsVisualizationModel);
        }

        function fnError() {
            oSapSplBusyDialog.getBusyDialogInstance().close();
        }

        var sFilter = "$filter=(" + encodeURIComponent("LocationID eq " + "X" + "\'" + this.oViewData["LocationID"] + "\'") + ")&$expand=Incidents";
        oSapSplBusyDialog.getBusyDialogInstance().open();
        this.oSapSplAppModel.read("/MyLocations", null, [sFilter], false, fnSuccess, fnError);
    },

    /**
     * oData call to get the incidence master data
     * @param void
     * @return void
     * @since 1.0
     */
    getIncidentMasterData: function () {
        var that = this;

        function fnSuccess(oData) {
            that.aIncidenceMasterdata = oData.results;
            oSapSplBusyDialog.getBusyDialogInstance().close();
        }

        function fnError() {
            oSapSplBusyDialog.getBusyDialogInstance().close();
        }

        var sFilter = "$expand=AssignedLocations";
        oSapSplBusyDialog.getBusyDialogInstance().open();
        this.oSapSplAppModel.read("/IncidentDetails", null, [sFilter], false, fnSuccess, fnError);
    }

});
