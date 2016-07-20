/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("opa5.Actions.actions_Add_POI");
jQuery.sap.require("sap.ui.test.Opa5");
jQuery.sap.require("sap.ui.test.matchers.PropertyStrictEquals");
jQuery.sap.require("sap.m.InstanceManager");

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

    iCloseAllOpenedDialogs : function(){
        return this.waitFor({
            controlType : "sap.m.Dialog",
            /*check : function(){
                 return sap.ui.test.Opa5.getWindow().$(".sapMDialog").length > 0;
            },*/
            success:function(){
                sap.m.InstanceManager.closeAllDialogs();
                ok(true,"Dialogs closed!");
            },
            errorMessage : "Dialogs not found!"
        });
    },

    iClickOnLiveApp : function(){
        return this.waitFor({
            id : this.getContext().oUIAppsObject.liveApp.sId,
             check : function (LiveAppTile) {
                    return LiveAppTile.getState() === "Loaded";
                },
            success : function(oTile){
                console.log(this.getContext().oUIAppsObject.liveApp.sId);
                oTile.firePress();
                ok(true,"Clicked on Live App!");
            },
            errorMessage : "Couldn't find Live App"
        });
    },

    iClickOnContactBusinessPartners : function(){
        return this.waitFor({
            id:"splView.liveApp.liveApp--oContactBusinessPartnerButton",
            success : function(oBtn){
                oBtn.firePress();
                ok(true,"Clicked on the BuPa Button");
            },
            errorMessage : "Couldn't find the BuPa button"
        });
    },

    iClickOnF4Help : function(){
        return this.waitFor({
            id:"__xmlview0--SapSplValueHelpForSelectBusinessPartnerInput__vhi",
            success : function(oInput){
                oInput.firePress();
                ok(true,"Clicked on F4 help Icon");
            },
            errorMessage : "Couldn't find the icon"
        });
    },

    iClickOnBackFromF4Help : function(){
        return this.waitFor({
            controlType : "sap.m.Button",
            success : function(oBtn){
                oBtn[0].firePress();
                ok(true,"Clicked back from F4 help");
            },
            errorMessage : "Couldn't go back from F4 help"
        });
    },

    iClickOnCancelFromContactBuPa : function(){
        return this.waitFor({
            controlType : "sap.m.Button",
            success : function(oBtn){
                oBtn[1].firePress();
                ok(true,"Cancel Button clicked");
            },
            errorMessage : "Couldn't find the cancel button!"
        });
    },

    iClickOnSendMessageToTrucks : function(){
        return this.waitFor({
            id:"splView.liveApp.liveApp--oSendMessageToTruckButton",
            success : function(oBtn){
                oBtn.firePress();
                ok(true,"Send message to trucks Button clicked");
            },
            errorMessage : "Couldn't find the cancel button!"
        });
    },

    iSelectSendMessageToAllTrucks : function(){
        return this.waitFor({
            controlType : "sap.m.ActionSheet",
            success : function(oActionSheet){
                oActionSheet[0].getButtons()[0].firePress();
                ok(true,"Send Message to all Trucks Button clicked");
            },
            errorMessage : "Couldn't find the Send Message to all Trucks Button"
        });
    },

    iClickOnCancelFromSelectAllTrucks : function(){
        return this.waitFor({
            controlType : "sap.m.Button",
            success : function(oBtn){
                oBtn[1].firePress();
                ok(true,"Clicked on cancel");
            },
            errorMessage : "Couldn't find the cancel button on select all trucks!"
        });
    },

    iClickSelectTrucksOnMap : function(){
        return this.waitFor({
            controlType : "sap.m.ActionSheet",
            success : function(oActionSheet){
                oActionSheet[0].getButtons()[2].firePress();
                ok(true,"select trucks on map button clicked");
            },
            errorMessage : "select trucks on map button not found!"
        });
    },

    iClickOnSendMessageToTrucksMenu : function(){
        return this.waitFor({
            controlType :"sap.m.Button",
            success : function(oBtn){
                oBtn[18].firePress();
            },
            errorMessage : "Couldn't find the button!"
        });
    },

    iClickOnSendViaMap : function(){
        return this.waitFor({
            controlType:"sap.m.ActionSheet",
            check : function(oActionSheet){

            },
            success : function(oActionSheet){

            },
            errorMessage : "Couldn't find the truck via map option!"
        });
    },

    iClickOnCancelFromTrucksOnMap : function(){
        return this.waitFor({
            controlType : "sap.m.Button",
            success : function(oBtn){
                oBtn[1].firePress();
            },
            errorMessage : "Couldn't find the cancel button on trucks on maps!"
        });
    },

    iClickOnSendMessageToTrucksMenu2 : function(){
        return this.waitFor({
            controlType : "sap.m.Button",
            success : function(oBtn){
                oBtn[18].firePress();
            },
            errorMessage : "Couldn't find the cancel button on trucks on maps!"
        });
    },

    iClickSelectViaGeofence : function(){
        return this.waitFor({
            controlType : "sap.m.ActionSheet",
            success : function(oActionSheet){
                oActionSheet[0].getButtons()[3].firePress();
                ok(true,"select trucks on map button clicked");
            },
            errorMessage : "select trucks on map button not found!"
        });
    },

    iClickOnCancelFromGeofences : function(){
        return this.waitFor({
            controlType : "sap.m.Button",
            success : function(oBtn){
                oBtn[1].firePress();
                ok(true,"cancel button from geofences fired!");
            },
            errorMessage :"Cancel from geofence not found!"
        });
    },

    iClickOnSearchIcon : function(){
        return this.waitFor({
            controlType : "sap.m.Button",
            success : function(oBtn){
                oBtn[5].firePress();
            },
            errorMessage : "Couldn't find the search Icon"
        });
    }
});