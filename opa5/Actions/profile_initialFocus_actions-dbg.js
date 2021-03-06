/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("opa5.Actions.profile_initialFocus_actions");
jQuery.sap.require("sap.ui.test.Opa5");
jQuery.sap.require("sap.ui.test.matchers.PropertyStrictEquals");

new sap.ui.test.Opa5.extend("opa5.Actions.actions", {

    iClickOnOptions : function(){
        return this.waitFor({

            controlType : "sap.ui.unified.ShellHeadUserItem",
            success : function(oShellHeadItem){
                oShellHeadItem[0].firePress();
                ok(true, "account clicked!");
            }
        });

    },

    iClickOnMyProfile : function()
    {
        return this.waitFor({
            controlType : "sap.m.ActionSheet",
            success : function(sContent)
            {
                sContent[0].getButtons()[0].firePress();
            },
            errorMessage : "Did not find My Profile Button"
        });
    },
    iClickOnEdit : function()
    {
        return this.waitFor({
            id : "splView.profile.UserProfile--btnEditUserProfile",
            success : function(oContent)
            {
                oContent.firePress();
            },
            errorMessage : "Did not find the edit button"
        });
    },

    iClickOnCancelEditProfile : function(){
        return this.waitFor({
            controlType : "sap.m.Button",
            success : function(oBtn){
                oBtn[0].firePress();
                ok(true,"Cancel button clicked!");
            },
            errorMessage : "Couldn't find the button!"
        });
    },

    iClickOnFollowTrucksIconTab : function(){
        return this.waitFor({
            controlType : "sap.m.IconTabBar",
            success : function(oIconTabBar){
                oIconTabBar[0].setSelectedItem(oIconTabBar[0].getItems()[1]);
            },
            errorMessage : "Couldn't find Icon Tab filters!"
        });
    },

    iClickOnEditInFollowTrucks : function(){
        return this.waitFor({
            controlType : "sap.m.Button",
            success : function(oBtn){
                oBtn[3].firePress();
                ok(true,"Edit Button pressed");
            },
            errorMessage : "Couldn't find the Edit button"
        });
    },
    iClickOnCompanyProfile : function()
    {
        return this.waitFor({
            controlType : "sap.m.ActionSheet",
            success : function(sContent)
            {
                sContent[0].getButtons()[1].firePress();
            },
            errorMessage : "Did not find My Profile Button"

        });
    },

    iClickOnEditCompanyProfile : function(){
        return this.waitFor({
            id : "splView.profile.Profile--btnEditCompanyProfile",
            success : function(sContent)
            {
                sContent.firePress();
            }
        });
    },

    iClickOnEditTourSettings : function(){
        return this.waitFor({
            controlType : "sap.m.Button",
            success : function(oBtn){
                oBtn[9].firePress();
            },
            errorMessage : "Couldn't find the button"
        });
    },

    iClickOnUsageLogIconTabFilter : function(){
        return this.waitFor({
            controlType:"sap.m.IconTabBar",
            success : function(oIconTabBar){
                oIconTabBar[0].setSelectedItem(oIconTabBar[0].getItems()[1]);
                ok(true,"clicked on the Usage Log filter");
            },
            errorMessage : "couldn't find the icon tab filter"
        });
    },

    iClickOnToursSettingsIconTabFilter : function(){
        return this.waitFor({
            controlType:"sap.m.IconTabBar",
            success : function(oIconTabBar){
                oIconTabBar[0].setSelectedItem(oIconTabBar[0].getItems()[2]);
                ok(true,"clicked on the Tour setting filter");
            },
            errorMessage : "couldn't find the icon tab filter"
        });
    },

    iClickOnToursSettingsEditButton : function(){
        return this.waitFor({
            controlType : "sap.m.Button",
            success : function(oBtn){
                oBtn[1].firePress();
                ok(true,"Clicked on the Edit button!");
            },
            errorMessage : "Couldn't click on edit button"
        });
    },

});