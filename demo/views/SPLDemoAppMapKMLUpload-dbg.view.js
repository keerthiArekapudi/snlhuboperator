/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.jsview("splDemoView.SPLDemoAppMapKMLUpload", {
    getControllerName: function() {
        return "splDemoController.SPLDemoAppMapKMLUpload";
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
            text: "Upload",
            type: "Emphasized",
            press: jQuery.proxy(oController.fnHandleUploadAction, oController)
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
 
        this.oTextArea = new sap.m.TextArea({
            width: "100%",
            rows: 35
        });
 
        var oPage = new sap.m.Page({
            title: "Upload KML - Paste the KML file and click upload",
            content: [this.oTextArea],
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