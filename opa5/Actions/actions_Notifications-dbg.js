/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("OPA5TestScript.Actions.actions_Notifications");
jQuery.sap.require("sap.ui.test.Opa5");
jQuery.sap.require("sap.ui.test.matchers.PropertyStrictEquals");

new sap.ui.test.Opa5.extend("opa5.Actions.actions", {

    clickUserProfile : function(){
        return this.waitFor({
            id : "sapSplBaseUnifiedShell",
            success : function(oShell){
                oShell.getUser().firePress();
                ok(true,"clicked on User's Profile!");
            },
            errorMessage : "Couldn't click on user's profile!"
        });
    },

    iClickMyProfile : function() {
        return this.waitFor({
            controlType : "sap.m.ActionSheet",
            success : function(sContent)
            {
                sContent[0].getButtons()[0].firePress();
                ok(true,"myProfile button clicked!");
            },
            errorMessage : "Did not find My Profile Button"

        });
    },

    iClickOnNotifications : function () {
        return this.waitFor({
            id : "splView.profile.UserProfile--sapSclProfileAndSettingIconTabBar",
            //controlType : "sap.m.IconTabFilter",
            success : function(sContent)
            {
                sContent[0].getButtons()[0].firePress();
                ok(true,"found My Profile Option");
            },
            errorMessage : "Did not find My Profile Button"

        });
    },

    IClickOnNotificationsTab : function () {
        return this.waitFor({
            controlType : "sap.m.IconTabBar",
            success : function (oIconTabBar){
//                oIconTabBar[0].fireSelect(oIconTabBar[0].getItems()[2],oIconTabBar[0].getItems()[2].getKey());
                oIconTabBar[0].setSelectedItem(oIconTabBar[0].getItems()[2]);
                ok(true,"Notifications and Themes Pressed!");
            }
        });
    },

    iClickOnEdit : function () {
        return this.waitFor({
            controlType : "sap.m.Button",
            success : function (oBtn){
                oBtn[1].firePress();
                ok(true,"Edit is pressed!");
            }
        });
    },

    iSelectTheme : function () {
        return this.waitFor({
            controlType : "sap.m.RadioButton",
            success : function (oBtn){
                for(var i = 0;i<oBtn.length;i++){
                    if(!oBtn[i].getSelected()){
                        oBtn[i].setSelected(true);
                    }
                }
                ok(true,"selecting new theme");
            }
        });
    },

    iClickCancel : function() {
        return this.waitFor({
            controlType : "sap.m.Button",
            success : function (oBtn){
                oBtn[2].firePress();
                ok(true,"click cancel");
            }
        });
    },

    iclickYes : function() {
        return this.waitFor({
            controlType : "sap.m.Button",
            success : function (oBtn){
                oBtn[0].firePress();
                ok(true,"Notifications and Themes Pressed!");
            }
        });
    },
    
    iClickSave : function() {
        return this.waitFor({
            controlType: "sap.m.Button",
            success : function (oBtn) {
                oBtn[1].firePress();
                ok(true,"Save Button Clicked!");
            }
        });
    },
    
    iclickNo :  function() {
        return this.waitFor({
            controlType : "sap.m.Button",
            success : function (oBtn){
                oBtn[1].firePress();
                ok(true,"Notifications and Themes Pressed!");
            }
        });
    }
});
