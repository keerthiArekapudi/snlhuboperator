/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("OPA5TestScript.Assertions.assertions_Notifications");
jQuery.sap.require("sap.ui.test.Opa5");
jQuery.sap.require("sap.ui.test.matchers.PropertyStrictEquals");


new sap.ui.test.Opa5.extend("opa5.Assertions.assertions",{

    iShouldSeeTiles : function () {
        return this.waitFor({
            id : "masterTileContainerPage",
            viewName : "splView.tileContainer.MasterTileContainer",
            check : function () {
                return this.getContext().oAppsPage && this.getContext().oAppsPage.getContent().length > 0;
            },
            success : function (oPage) {
                this.getContext().oShell = oPage.getParent().getParent().getParent().getParent();
                var aPageTiles = this.getContext().oAppsPage.getContent();
                var oObject = {};
                for (var i=0; i< aPageTiles.length; i++) {
                    oObject[aPageTiles[i].getBindingContext().getProperty().AppID] = aPageTiles[i];
                }

                this.getContext().oUIAppsObject = oObject;
                console.log(oObject);

                ok(oPage, "Found the apps tiles : "+this.getContext().oAppsPage.getContent().length+" tiles");
            },
            errorMessage : "The apps tiles did not contain entries",
        });
    },
    
    iShouldSeeSelectedThemeIcon : function(){
        return this.waitFor({
            controlType : "sap.m.Image",
            success : function (oImage){
                ok(true,"found the selected theme");
            },
            errorMessage : "The selected Theme didn't appear!"
        });
    },
    
    iShouldSeeEditButton : function(){
        return this.waitFor({
            controlType : "sap.m.Button",
            success : function (oBtn){
                ok(true,"Found Edit:" +oBtn[1].getText());
            },
            errorMessage : "Couldn't find the button"
        });
    },
    
    iShouldSeeTwoThemes : function () {
        return this.waitFor({
            controlType : "sap.m.RadioButton",
            success : function (oBtn){
                var arr = [];
                for(var i = 0;i<oBtn.length;i++){
                    arr[i] = oBtn[i].getText();
                }
                ok(true,"selecting new theme"+arr);
            }
        });
    }
});