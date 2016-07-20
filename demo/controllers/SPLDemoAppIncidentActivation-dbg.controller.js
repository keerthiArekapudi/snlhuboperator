/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.controller("splDemoController.SPLDemoAppIncidentActivation", {
 
    onInit: function() {
        this.oODataModel = new sap.ui.model.odata.ODataModel(oSapSplUtils.getFQServiceUrl("sap/spl/xs/demoSetup/services/demo.xsodata"), true);
        this.oModelForVehicles = new sap.ui.model.json.JSONModel();
        this.oModelForPaths = new sap.ui.model.json.JSONModel();
        this.oODataModel.setSizeLimit(1000);
        this.oMappingObject = {};
        this.getView().oOrgSelect.setModel(this.oODataModel);
        this.getView().oVehiclesTable.setModel(this.oModelForVehicles);
//        this.getView().oPathSelect.setModel(this.oModelForPaths);
    },
 
    fnHandleChangeEventOfOrgSelect: function(oEvent) {
        var that = this;
        var UUID = oEvent.getParameters().selectedItem.getBindingContext().getObject()["UUID"];
        UUID = oSapSplUtils.base64ToHex(UUID);
        var sFilter = "$filter=(" + encodeURIComponent("OwnerID eq " + "X" + "\'" + UUID + "\'") + ")";
        this.oODataModel.read("/IncidentMaster", null, [sFilter], false, function(oData) {
            that.oModelForVehicles.setData(oData.results);
        }, function() {});
    },
 
    fnHandleAssignAction: function() {
        var aPayLoad = [];
        jQuery.each(this.oMappingObject, function(key, value) {
            aPayLoad.push({
                UUID: key,
                activate: value
            });
 
        });
 
        if (aPayLoad.length > 0) {
 
            $.ajax({
                url: oSapSplUtils.getFQServiceUrl("/sap/spl/xs/demoSetup/services/activateIncident.xsjs"),
                type: "POST",
 
                contentType: "json; charset=UTF-8",
                async: false,
                beforeSend: function() {
 
                },
                data: JSON.stringify({
                    data: aPayLoad
               }),
                success: function(data, success, messageObject) {
                    if (data.constructor === String) {
                        data = JSON.parse(data);
                    }
                    if (messageObject["status"] === 200 && data["Error"].length === 0) {
                        sap.m.MessageToast.show("Activation Done");
                    }
                },
                error: function() {
                    sap.m.MessageToast.show("Activation Error");
                },
                complete: function() {
 
                }
 
            });
 
        }
 
    },
 
    fnHandleSelectEventOfCheckBox: function(oEvent) {
        
        this.oMappingObject[oEvent.getSource().getBindingContext().getObject()["UUID"]] = oEvent.getParameters().selected;
        
    },
 
    onAfterRendering: function() {
 
    },
 
    onBeforeRendering: function() {
 
    },
 
    onBeforeShow: function() {
 
    }
 
});