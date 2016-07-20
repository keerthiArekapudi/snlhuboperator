/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.controller("splDemoController.SPLDemoAppSetup", {
 
    onInit: function() {
        this.oODataModel = new sap.ui.model.odata.ODataModel(oSapSplUtils.getFQServiceUrl("sap/spl/xs/demoSetup/services/demo.xsodata"), true);
        this.oODataModel.setSizeLimit(1000);
        this.oModelForVehicles = new sap.ui.model.json.JSONModel();
        this.oModelForPaths = new sap.ui.model.json.JSONModel();
        this.getPredefinedPaths();
        this.oMappingObject = {};
        this.getView().oOrgSelect.setModel(this.oODataModel);
        this.getView().oVehiclesTable.setModel(this.oModelForVehicles);
//        this.getView().oPathSelect.setModel(this.oModelForPaths);
    },
 
    getPredefinedPaths: function() {
        var that = this;
        this.oODataModel.read("/PredefinedPaths", null, null, false, function(oData) {
            oData.results.unshift({
                Name: "Select a Path",
                ID: "placeholder"
            });
            that.oModelForPaths.setData(oData.results);
        }, function() {
 
        });
    },
 
    fnHandleChangeEventOfOrgSelect: function(oEvent) {
        var that = this;
        var UUID = oEvent.getParameters().selectedItem.getBindingContext().getObject()["UUID"];
        UUID = oSapSplUtils.base64ToHex(UUID);
        var sFilter = "$filter=(" + encodeURIComponent("Organization_UUID eq " + "X" + "\'" + UUID + "\'") + ")";
        this.oODataModel.read("/Vehicles", null, [sFilter], false, function(oData) {
            that.oModelForVehicles.setData(oData.results);
        }, function() {});
    },
 
    fnHandleAssignAction: function() {
        var aPayLoad = [];
        jQuery.each(this.oMappingObject, function(key, value) {
            aPayLoad.push({
                DeviceUUID: key,
                Path: value
            });
 
        });
 
        if (aPayLoad.length > 0) {
 
            $.ajax({
                url: oSapSplUtils.getFQServiceUrl("/sap/spl/xs/demoSetup/services/movementSetup.xsjs"),
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
                        sap.m.MessageToast.show("Assignment Done");
                    }
                },
                error: function() {
                    sap.m.MessageToast.show("Assignment Error");
                },
                complete: function() {
 
                }
 
            });
 
        }
 
    },
 
    fnHandleChangeEventOfPathSelect: function(oEvent) {
 
        var oBoundObject = oEvent.getParameters().selectedItem.getBindingContext().getObject();
        var oParentObject = oEvent.getSource().getParent().getBindingContext().getObject();
        if (oBoundObject["ID"] === "placeholder") {
            this.oMappingObject[oParentObject["Device_UUID"]] = null;
        } else {
            this.oMappingObject[oParentObject["Device_UUID"]] = oBoundObject["Name"];
        }
 
    },
 
    onAfterRendering: function() {
 
    },
 
    onBeforeRendering: function() {
 
    },
 
    onBeforeShow: function() {
 
    }
 
});