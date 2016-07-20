/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.jsview("splDemoView.SPLDemoAppSetup", {
    getControllerName: function() {
        return "splDemoController.SPLDemoAppSetup";
    },
 
    createContent: function(oController) {
 
        this.oOrgSelect = new sap.m.Select({
            items: {
                path: "/Organizations",
                template: new sap.ui.core.Item({
                    text: "{Organization_Name}"
                }),
            },
            change: jQuery.proxy(oController.fnHandleChangeEventOfOrgSelect, oController)
        });
 
        this.oAssignButton = new sap.m.Button({
            text: "Assign",
            type: "Emphasized",
            press: jQuery.proxy(oController.fnHandleAssignAction, oController)
        });
 
        this.oOrgSelect.addEventDelegate({
            onAfterRendering: function(e) {
                if (e.srcControl.getItems().length > 0) {
                    if (!e.srcControl.first) {
                        e.srcControl.fireChange({
                            selectedItem: e.srcControl.getItems()[0]
                        });
                        e.srcControl.first = "true";
                    }
                }
            }
        });
 
        this.oVehiclesTable = new sap.m.Table({
            columns: [
                new sap.m.Column({
                    header: new sap.m.Label({
                        text: "Trucks"
                    }),
                    width: "70%"
 
                }), new sap.m.Column({
                    header: new sap.m.Label({
                        text: "Paths"
                    }),
                    hAlign: "Center",
                    width: "30%"
                })
            ]
        }).bindItems("/", function(sId, oObject) {

            var oPathSelect = new sap.m.Select({
                width: "100%",
                items: {
                    path: "/",
                    template: new sap.ui.core.Item({
                        text: "{Name}",
                        key: "{Name}"
                    })
                },
                change: jQuery.proxy(oController.fnHandleChangeEventOfPathSelect, oController)
            }).setSelectedKey(oObject.getObject()["Path"]).setModel(oController.oModelForPaths);
            
            return new sap.m.ColumnListItem({
                type: sap.m.ListType.InActive,
                cells: [
                    new sap.m.Text({
                        text: "{RegistrationNumber}"
                    }),
                    oPathSelect
                ],

            });

        });
 
        var oPage = new sap.m.Page({
            title: "Device Path - Assignment",
            content: [this.oVehiclesTable],
            subHeader: new sap.m.Toolbar({
                content: new sap.m.Bar({
                    contentLeft: [
                        new sap.m.Label({
                            text: "Select a Company : "
                        }),
                        this.oOrgSelect,
                    ],
                    contentRight: [this.oAssignButton],
                    design: "Header"
                })
            })
        });
 
 
        return oPage;
 
    }
});