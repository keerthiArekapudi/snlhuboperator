/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.jsview("splDemoView.SPLDemoAppIncidentActivation", {
    getControllerName: function() {
        return "splDemoController.SPLDemoAppIncidentActivation";
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
            text: "Save",
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
                        text: "incident"
                    }),
                    width: "70%"
 
                }), new sap.m.Column({
                    header: new sap.m.Label({
                        text: "Activate"
                    }),
                    hAlign: "Center",
                    width: "30%"
                })
            ]
        }).bindItems("/", function() {

            var oActiveCheckBox = new sap.m.CheckBox({
                selected: {
                    path: "isActive",
                    formatter: function (iValue) {
                        // Removed debugger frome the code
                        return ((iValue === 0) ? false : true);
                    }
                },
                select: jQuery.proxy(oController.fnHandleSelectEventOfCheckBox, oController)
            });
            
            return new sap.m.ColumnListItem({
                type: sap.m.ListType.InActive,
                cells: [
                    new sap.m.Text({
                        text: "{Name}"
                    }),
                    oActiveCheckBox
                ],

            });

        });
 
        var oPage = new sap.m.Page({
            title: "Activate Incident Master",
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