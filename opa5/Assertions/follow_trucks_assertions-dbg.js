/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("OPA5TestScript.Assertions.follow_trucks_assertions");
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

    iShouldSeeFollowTrucks : function() {
        return this.waitFor({
            id : "sapSplBaseUnifiedShell",

            success : function (oPage) {
                ok(true,"follow trucks found");
            },
            errorMessage : "follow trucks found",
        });

    },

    iShouldSeeTable : function(){
        return this.waitFor({
            controlType : "sap.m.Table",

            success : function (oTable) {              
                ok(true,"table found");
            },
            errorMessage : "table not found",
        });

    },

    iShouldOnlyViewSettingsDialog : function(){
        return this.waitFor({
            controlType : "sap.m.Dialog",

            success : function (oTable) {              
                ok(true,"filter dialog found");
            },
            errorMessage : "filter dialog not found",
        });

    },

    iSeeToastMessage : function(){
        return this.waitFor({
            "class" : "sapMMessageToast",
            success : function(oMessageToast){
                ok(true,"Message Toast Successfully displayed!");
            },
            errorMessage : "Toast Message was not displayed!"
        });
    },

    iShouldSeeFilterByStatus : function(){

    },

    iShouldOnlyActiveTrucks : function() {

    },

    iShouldSeeTableWithMatchingResults : function(){
        return this.waitFor({
            controlType : "sap.m.Table",
            success : function(oTable){
                var tableSize = oTable[0].getItems().length;
                var arrHolder = [];
                for(var i=0;i<tableSize;i++){
                    arrHolder.push(oTable[0].getItems()[i].getCells()[0].getText());
                }
                ok(true,"The matching results are "+tableSize+" in number");
            },
            errorMessage: "Table is not found!"
        });
    }

});
