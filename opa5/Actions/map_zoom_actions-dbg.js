/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("opa5.Actions.map_zoom_actions");
jQuery.sap.require("sap.ui.test.Opa5");
jQuery.sap.require("sap.ui.test.matchers.PropertyStrictEquals");

new sap.ui.test.Opa5.extend("opa5.Actions.actions", {

    iClickOnToursApp : function(){
        return this.waitFor({
            id : this.getContext().oUIAppsObject.manageTours.sId,
            check : function (userTile) {
                return userTile.getState() === "Loaded";
            },
            success : function (oTile) {
                oTile.firePress();
                ok(oTile, "Tours tile is loaded and fired press");
            },
            errorMessage : "The tours tile did not load"});

    },

    iClickOnCompletedTours : function(){
        return this.waitFor({
            controlType:"sap.m.IconTabBar",
            success : function(oTabBar){
                oTabBar[0].setSelectedItem(oTabBar[0].getItems()[4]);
                ok(true,"Tab filters found!")
            },
            errorMessage : "Didn't find the Tab filters"
        });
    },

    iClickOnSomeItem : function(){
        return this.waitFor({
            controlType:"sap.m.Table",
            success : function(oTable){
                oTable[0].getItems()[0].firePress();
                ok(true,"Item Clicked!");
            },
            errorMessage : "Didn't find the items"
        });
    },

    iClickOnMapButton : function(){
        return this.waitFor({
            id : "TourDetails--sapSplMapFullScreen",
            success : function(oBtn){
                oBtn.firePress();
                ok(true,"Zoom out button clicked!");
            },
            errorMessage : "Didn't find the zoom maximize button"
        });
    },
});