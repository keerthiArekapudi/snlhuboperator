/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("opa5.Assertions.map_zoom_assertions");
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
    
    iSeeIconTabFilters : function(){
        return this.waitFor({
            controlType:"sap.m.IconTabFilter",
            success : function(oTabFilter){
                ok(true,"Tab filters found!")
            },
            errorMessage : "Didn't find the Tab filters"
        });
    },
    
    iSeeZoomOutButton : function(){
        return this.waitFor({
            id:"TourDetails--sapSplMapExitFullScreen",
            success : function(oBtn){
                
                ok(true,"Map is Zoomed out");
            },
            errorMessage : "Didn't find the Tab filters"
        });
    }
});