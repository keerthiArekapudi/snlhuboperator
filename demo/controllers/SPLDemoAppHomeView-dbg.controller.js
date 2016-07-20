/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.controller("splDemoController.SPLDemoAppHomeView",{

    demoODataModel : new sap.ui.model.odata.ODataModel(oSapSplUtils.getFQServiceUrl("/sap/spl/xs/demoSetup/services/demo.xsodata"), true),

    iInterval : null,

    selectedOrganizationId:null,

    selectedVehicleId : null,

    vehicleMessagePaths : {
        messagePath1 : null,
        messagePath2 : null
    },

    dateFormatter: function (sDate) {
        if (sDate) {
            return sap.ui.core.format.DateFormat.getDateInstance({
                pattern: "MMM dd, yyyy - HH:mm:ss",
                style: "short"
            }, sap.ui.getCore().getConfiguration().getLocale()).format(
                    new Date(sDate), true);

        }
    },
    
    onInit : function() {
        sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel({}), "demoDataModel");
        sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel({}), "demoVehicleListModel");
        sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel({}), "demoMessageListModel");
        sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel({}), "demoAllToursListModel");
        sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel({}), "demoCurrentToursListModel");
        this.demoODataModel.setSizeLimit(1000);
        this.getOrganizationList();
        this.bindStopsLayout();
        this.bindAllToursLayout();
    },
    onBeforeRendering:function() {

    },

    postEventData: function(oEvent) {
        var that = this;
        var oPayLoad = {
                "action":"stopEvent",
                "VehicleUUID": this.selectedVehicleId,
                "stopEvent": {
                    "BusinessPartnerUUID":this.oSelectedOrgUUID,
                    "TourUUID":oEvent.getSource().getBindingContext().getObject()["tourUUID"],
                    "StopUUID":oEvent.getSource().getBindingContext().getObject()["stopUUID"],
                    "EventCode":oEvent.getSource().getBindingContext().getObject()["name"],
                    "OccurranceTime":new Date().toJSON()
                }
        };
        $.ajax({
            url: oSapSplUtils.getFQServiceUrl("/sap/spl/xs/demoSetup/services/tours.xsjs"),
            async: true,
            type: "POST",
            contentType: "json; charset=UTF-8",
            beforeSend: function() {

            },
            data: JSON.stringify(oPayLoad),
            success: function(data) {
                if (data.constructor === String) {
                    data = JSON.parse(data);
                }
                that.getTourData(that.selectedVehicleId);
            },
            error: function() {
                sap.m.MessageToast.show("Stop Event Trigger Failed");
            },
            complete: function() {

            }
        });
    },
    
    postEventDataForTour: function(oEvent) {
        var that = this;
        var oPayLoad = {
                "action":"tourEvent",
                "VehicleUUID": this.selectedVehicleId,
                "tourEvent": {
                    "BusinessPartnerUUID":this.oSelectedOrgUUID,
                    "TourUUID":oEvent.getSource().getBindingContext().getObject()["tourUUID"],
                    "StopUUID":oEvent.getSource().getBindingContext().getObject()["stopUUID"],
                    "EventCode":oEvent.getSource().getBindingContext().getObject()["name"],
                    "OccurranceTime":new Date().toJSON(),
                }
        };
        $.ajax({
            url: oSapSplUtils.getFQServiceUrl("/sap/spl/xs/demoSetup/services/tours.xsjs"),
            async: true,
            type: "POST",
            contentType: "json; charset=UTF-8",
            beforeSend: function() {

            },
            data: JSON.stringify(oPayLoad),
            success: function(data) {
                if (data.constructor === String) {
                    data = JSON.parse(data);
                }
                that.getTourData(that.selectedVehicleId);
            },
            error: function() {
                sap.m.MessageToast.show("Stop Event Trigger Failed");
            },
            complete: function() {

            }
        });
    },
    
    bindAllToursLayout: function() {
        var that = this;
        this.byId("allToursList").bindAggregation("items", "/", function(sId, oObject) {
            return new sap.m.CustomListItem({
                content : new sap.m.Bar({
                    design: "Header",
                    contentLeft : new sap.m.Label({
                        text: "{Name}"
                    }),
                    contentRight : {
                        path: oObject.getPath()+"/actions",
                        template: new sap.m.Button({
                            text: "{description}",
                            type: "Emphasized",
                            visible: "{enabled}",
                            press: jQuery.proxy(that.postEventDataForTour, that)
                        })
                    }
                })
            });
        });
        this.byId("allToursList").setModel(sap.ui.getCore().getModel("demoAllToursListModel"));
    },
    
    bindStopsLayout: function() {
        var that = this;
        this.byId("sapSplDemoStopsLayout").bindAggregation("content", "/stops", function(sId, oObject) {
            if (oObject.getObject().Status === "A" || oObject.getObject().Status === "I") {
                return new sap.m.Panel({
                    headerText: "{Name}",
                    expanded: true,
                    expandable: ((oObject.getObject().actionGroups !== undefined && oObject.getObject().actionGroups.length > 0) ? true : false),
                }).addStyleClass("sapSplDemoPanelWithoutPadding").addStyleClass("currentStopPanel").bindAggregation("content", oObject.getPath()+"/actionGroups", function(sId1, oObject1) {
                    return new sap.m.Panel({
                        headerText: "{description}",
                        expanded: true,
                        expandable: ((oObject1.getObject().actions !== undefined && oObject1.getObject().actions.length > 0) ? true : false),
                        content :
                            new sap.ui.layout.Grid({
                                content:{
                                    path: oObject1.getPath()+"/actions",
                                    template: new sap.m.Button({
                                        text: "{description}",
                                        type: "Emphasized",
                                        enabled: "{enabled}",
                                        press: jQuery.proxy(that.postEventData, that)
                                    })
                                }
                            }).addStyleClass("gridClass")
                    }).addStyleClass("currentStopEventsPanel").addStyleClass("sapSplDemoPanelWithoutPadding");
                });
            } else {
                return new sap.m.Panel({
                    headerText: "{Name}",
                    expanded: false,
                    expandable: false
                }).addStyleClass("currentStopPanel");
            }
        });
        this.byId("sapSplDemoStopsLayout").setModel(sap.ui.getCore().getModel("demoCurrentToursListModel"));
        this.byId("sapSplDemoStopsLayout").getBinding("content").sort(new sap.ui.model.Sorter("Name",true));
    },

    readMessages : function (organizationId, vehicleId, messagePathObject, instance) {
        var sRequestPath1 = messagePathObject["messagePath1"];
        var sRequestPath2 = messagePathObject["messagePath2"];
        instance.demoODataModel.read(sRequestPath1, null, null, true, function(oResult){
            var oResult1 = oResult.results;
            instance.demoODataModel.read(sRequestPath2, null, null, true, function(oResult2){
                oResult2 = oResult1.concat(oResult2.results);
                sap.ui.getCore().getModel("demoMessageListModel").setSizeLimit(oResult2.length+1);
                sap.ui.getCore().getModel("demoMessageListModel").setData({messages:oResult2});
                sap.ui.getCore().getModel("demoMessageListModel").refresh();
                instance.byId("splDemoMessageList").getBinding("items").sort(new sap.ui.model.Sorter("demoMessageListModel>CreationTime", true));
            }, function(){

            });
        }, function(){

        });
    },

    startReadingMessages : function () {

        var that = this;
        window.setTimeout(function() {
            that.iInterval = window.setInterval(function(){
                that.readMessages(that.selectedOrganizationId, that.selectedVehicleId, that.vehicleMessagePaths, that);
            }, oSapSplDemoConfigurationBuilder.getConfiguration("messagePollingFrequence") || 10000);
        }, 1000 );

    },

    stopPollingMessages : function () {
        if (this.iInterval !== null || this.iInterval !== undefined) {
            clearInterval(this.iInterval);
        }
    },

    triggerManualRefresh : function () {
        this.readMessages(this.selectedOrganizationId, this.selectedVehicleId, this.vehicleMessagePaths, this);
    },

    onAfterRendering : function() {

        this.byId("splDemoOrganizationsSelect").addEventDelegate({
            onAfterRendering : function(oEvent) {
                if (oEvent.srcControl.getItems().length > 0) {
                    oEvent.srcControl.fireChange({
                        selectedItem: oEvent.srcControl.getItems()[0]
                    });
                    oEvent.srcControl.first = "true";
                }
            }
        });

        this.byId("splDemoVehiclesList").addEventDelegate({
            onAfterRendering : function(oEvent) {
                if (oEvent.srcControl.getItems().length > 0) {
                    oEvent.srcControl.fireChange({
                        selectedItem: oEvent.srcControl.getItems()[0]
                    });
                    oEvent.srcControl.first = "true";
                }
            }
        });

    },
    onBeforeShow : function () {

    },

    performServiceCalls : function() {

    },

    fnReplyToChat : function () {
        new sap.m.Dialog({
            title: "Reply",
            content: [
                      new sap.m.TextArea({
                          rows: 4,
                          width: "100%"
                      })
                      ],
                      beginButton: new sap.m.Button({
                          text: "Send",
                          press: function() {
                              //POST
                          }
                      }),
                      endButton: new sap.m.Button({
                          text: "Cancel",
                          press: function(oEvent) {
                              oEvent.getSource().getParent().close();
                          }
                      })
        }).open();
    },

    getOrganizationList : function() {
        this.demoODataModel.read("/Organizations", null, null, true, function(oResult){
            oResult.results.unshift({UUID:"ORGUUID", Organization_Name:"Select an organization"});
            sap.ui.getCore().getModel("demoDataModel").setSizeLimit(oResult.results.length+1);
            sap.ui.getCore().getModel("demoDataModel").setData({organizations:oResult.results});
            sap.ui.getCore().getModel("demoDataModel").refresh();
        }, function(){

        });
    },

    handleChangeOfOrganization : function (oEvent) {
        function getVehicleList(sOrgId, instance) {
            var sOrgHexId = oSapSplUtils.base64ToHex(sOrgId);
//            var sFilter = "$filter=(" + encodeURIComponent("Organization_UUID eq " + "X" + "\'" + sOrgHexId + "\'") + ")";
            var sRequestPath = "/Organizations(X'" + sOrgHexId + "')/Vehicles";
            instance.demoODataModel.read(sRequestPath, null, null, true, function(oResult){
                oResult.results.unshift({Device_UUID:"DEVICEUUID", RegistrationNumber:"Select a vehicle"});
                sap.ui.getCore().getModel("demoVehicleListModel").setSizeLimit(oResult.results.length+1);
                sap.ui.getCore().getModel("demoVehicleListModel").setData({vehicles:oResult.results});
                sap.ui.getCore().getModel("demoVehicleListModel").refresh();

            }, function(){

            });
        }

        this.selectedOrganizationId = oEvent.getParameter("selectedItem").getBindingContext("demoDataModel").getObject()["UUID"];
        this.byId("SplDemoSelectedVehicle").setText("");
        this.byId("SplDemoSelectedOrg").setText(oEvent.getParameter("selectedItem").getBindingContext("demoDataModel").getObject()["Organization_Name"]+" : ");
        getVehicleList(oEvent.getParameter("selectedItem").getBindingContext("demoDataModel").getObject()["UUID"], this);
        this.oSelectedOrgUUID = oEvent.getParameter("selectedItem").getBindingContext("demoDataModel").getObject()["UUID"];
    },

    getCurrentTour: function (UUID) {
        var that = this;
        $.ajax({
            url: oSapSplUtils.getFQServiceUrl("/sap/spl/xs/demoSetup/services/tours.xsjs"),
            async: true,
            type: "POST",
            contentType: "json; charset=UTF-8",
            beforeSend: function() {

            },
            data: JSON.stringify({
                VehicleUUID: UUID,
                action:"getCurrentTourData"
            }),
            success: function(data) {
                if (data.constructor === String) {
                    data = JSON.parse(data);
                }
                if (data.length > 0) {
                    that.byId("currentTourPanel").setVisible(true);
                    sap.ui.getCore().getModel("demoCurrentToursListModel").setData(data[0]);
                    that.bindStopsLayout();
                } else {
                    that.byId("currentTourPanel").setVisible(false);
                }
            },
            error: function() {
                sap.m.MessageToast.show("Current Tour Fetch Error");
            },
            complete: function() {

            }

        });
    },

    getTourData: function(UUID) {
        var that = this;
        $.ajax({
            url: oSapSplUtils.getFQServiceUrl("/sap/spl/xs/demoSetup/services/tours.xsjs"),
            async: true,
            type: "POST",
            contentType: "json; charset=UTF-8",
            beforeSend: function() {

            },
            data: JSON.stringify({
                VehicleUUID: UUID,
                action:"getTourListData"
            }),
            success: function(data) {
                if (data.constructor === String) {
                    data = JSON.parse(data);
                }
                if (data.length > 0) {
                    that.byId("AllToursPanel").setVisible(true);
                    sap.ui.getCore().getModel("demoAllToursListModel").setData(data);
                    that.bindAllToursLayout();
                    that.getCurrentTour(UUID);
                } else {
                    that.byId("AllToursPanel").setVisible(false);
                    that.byId("currentTourPanel").setVisible(false);
                }
            },
            error: function() {
                sap.m.MessageToast.show("Tours Fetch Error");
            },
            complete: function() {

            }

        });

    },

    handleSelectionOfVehicle : function (oEvent) {

        this.selectedVehicleId = oEvent.getParameter("selectedItem").getBindingContext("demoVehicleListModel").getObject()["Vehicle_UUID"];
        this.byId("SplDemoSelectedVehicle").setText(oEvent.getParameter("selectedItem").getBindingContext("demoVehicleListModel").getObject()["RegistrationNumber"]);
        this.getTourData(this.selectedVehicleId);
        this.vehicleMessagePaths.messagePath1 =  "/Vehicles(X'" + oSapSplUtils.base64ToHex(this.selectedVehicleId) + "')/DeviceMessagesFromGeofences";
        this.vehicleMessagePaths.messagePath2 =  "/Vehicles(X'" + oSapSplUtils.base64ToHex(this.selectedVehicleId) + "')/MessagesToDevices";

    },
});