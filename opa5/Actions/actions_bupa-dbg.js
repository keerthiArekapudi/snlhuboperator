/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.require("sap.ui.test.Opa5");
jQuery.sap.require("sap.ui.test.matchers.PropertyStrictEquals");
var fname = "First_Name" + Math.random();
new sap.ui.test.Opa5.extend("opa5.Actions.actions_bupa", {

    BusinessPartnersIsLoaded : function(){
        return this.waitFor({
            id : this.getContext().oUIAppsObject.myBusinessPartners.sId,
            check : function (userTile) {
                return userTile.getState() === "Loaded";
            },
            success : function (oTile) {
                oTile.firePress();
                ok(oTile, "Users tile is loaded and fired press" + oTile);
            },
            errorMessage : "The users tile did not load",});
    },
    
    iclickonBupaTile : function(){
        return this.waitFor({
        	controlType : "sap.m.Page",
        	check : function(opage)
        	{
        		return opage[1].getTitle() === "Business Partner";
        	},
            success : function(oPage)
            {
                ok(true, "The bupa app page is displayed" + oPage);
            },
            errorMessage : "The bupa app page didn't load!"
        });
    },
    
    iClickOnAddBupaButton : function(){
        return this.waitFor({
        	id : "MyBusinessPartnerMaster--sapSplAddBusinessPartnerButton",
            success : function(oButton)
            {
            	oButton.firePress();
                ok(true, "Add Business partner button is clicked" + oButton[1]);
            },
            errorMessage : "Did not find the add business partner button"
        });
    },
    
    iSelectCarrier : function(){
        return this.waitFor({
        id : "MyBusinessPartnerActionSheet",
            success : function(oSheet)
            {
            	oSheet.getButtons()[0].firePress();
                ok(true, "Carrier button is clicked" + oSheet.getButtons()[0]);
            },
            errorMessage : "Did not find the carrier button!!!"
        });
    },
    
    iSelectParkingOperator : function(){
        return this.waitFor({
        id : "MyBusinessPartnerActionSheet",
            success : function(oSheet)
            {
            	oSheet.getButtons()[1].firePress();
                ok(true, "Parking operator button is clicked" + oSheet.getButtons()[1]);
            },
            errorMessage : "Did not find the add parking operator button!!!"
        });
    },
    
    iSelectCT : function(){
        return this.waitFor({
        id : "MyBusinessPartnerActionSheet",
            success : function(oSheet)
            {
            	oSheet.getButtons()[2].firePress();
                ok(true, "Container terminal button is clicked" + oSheet.getButtons()[2]);
            },
            errorMessage : "Did not find the add container terminal button!!!"
        });
    },
    
    iClickOnBupaCarrier : function(){

        return this.waitFor({
            controlType : "sap.m.StandardListItem",
            success : function(oListItem){
            	oListItem[0].$().trigger("tap");
            	oTitle = oListItem[0].getTitle();
                ok(true,"List Item carrier of BP clicked!" + oListItem[0]);
            },
            errorMessage : "didn't click the list item carrier!"
        });
    },
    
    iClickOnIcon : function(){

        return this.waitFor({
            controlType : "sap.m.IconTabBar",
            success : function(oIconTabBar){
            	oIconTabBar[0].setSelectedItem(oIconTabBar[0].getItems()[i]);
                ok(true,"Clicked on the selected icon" + oIconTabBar[0].getItems()[i]);
            },
            errorMessage : "Didn't click on the selected icon"
        });
    },

});