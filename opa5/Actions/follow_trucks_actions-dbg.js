/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("opa5.Actions.follow_trucks_actions");
jQuery.sap.require("sap.ui.test.Opa5");
jQuery.sap.require("sap.ui.test.matchers.PropertyStrictEquals");

new sap.ui.test.Opa5.extend("opa5.Actions.actions", {
    findHeaderUserItem :  function () {
        return this.waitFor({
            id : "sapSplBaseUnifiedShell",
            success : function(sContent)
            {
                sContent.getUser().firePress();
                ok(true,"clicked on User's Profile!");
            },
            errorMessage : "Did not find the sapSplBaseUnifiedShell"
        });
    },

    clickOnProfileAndSettings : function()
    {
        return this.waitFor({
            controlType : "sap.m.ActionSheet",
            success : function(sContent)
            {
                sContent[0].getButtons()[0].firePress();
                ok(true,"clicked on Profile and Settings!");
            },
            errorMessage : "Did not find My Profile Button"

        });
    },

    clickOnFollowTrucksFilter : function () {
        return this.waitFor({
            id: "splView.profile.UserProfile--sapSclIconTabFilterFollowTrucks",
            success : function (oContent)
            {
                oContent.getParent().getParent().setSelectedKey(oContent.getKey());
                oContent.getParent().getParent().fireSelect({
                    selectedKey: oContent.getKey()
                });
            },
            errorMessage : "Did not find Follow Trucks Filter"
        });           
    },

    openViewSettingsDialog : function () {
        return this.waitFor({
            controlType : "sap.m.Button",
            matchers : new sap.ui.test.matchers.PropertyStrictEquals({ name:"icon", value:"sap-icon://filter" }),
            success : function (oContent)
            {
                oContent[0].firePress();
            },
            errorMessage : "Did not find Filter button"
        });           
    },

    selectFilterByStatus : function () {
        return this.waitFor({
            controlType : "sap.m.Dialog",
            success : function (oContent)
            {
                /*                oContent[0].getButtons()[0].firePress();*/
                oContent[1].getContent()[0].getCurrentPage().getContent()[1].getItems()[0].firePress();
            },
            errorMessage : "Did not find status filter item"
        });           
    },

    iSelectActiveAndInactiveFilters : function() {
        return this.waitFor({
            controlType : "sap.m.Dialog",
            success : function(oDialog){
                oDialog[1].getContent()[0].getCurrentPage().getContent()[0].getItems()[0].setSelected(true);
                oDialog[1].getContent()[0].getCurrentPage().getContent()[0].getItems()[1].setSelected(true);
                ok(true,"clicked on the filters");
            },
            errorMessage : "Didn't find the filter list"
        });
    },

    iClickonOK : function(){
        return this.waitFor({
            controlType : "sap.m.Dialog",
            success : function (oDialog)
            {
                oDialog[1].getButtons()[0].firePress();

                ok(true,"clicked on OK");
            },
            errorMessage : "Did not find status filter item"
        });  
    },

    selectFilterActiveTruck : function () {
        return this.waitFor({
            controlType : "sap.m.NavContainer",
            success : function (oContent)
            {
                var listItem = oContent[0].getCurrentPage().getContent()[0].getItems()[0];
                oContent[0].getCurrentPage().getContent()[0].setSelectedItem(listItem);
                /*oContent[0].getParent().getButtons()[0].firePress({
                    mParameters : {[
                         new sap.ui.model.Filter("isDeleted", sap.ui.model.FilterOperator.EQ, "0")
                         ],

                    }
                });*/
            },
            errorMessage : "Did not find filter dialog"
        });           
    },

    iClickOnEdit : function(){
        return this.waitFor({
            controlType:"sap.m.Button",
            success : function(oButton){
                oButton[4].firePress();
                ok(true,"found the button!");
            },
            errorMessage : "Didn't find the button"

        });
    },

    iClickOnSubscribe : function(){
        return this.waitFor({
            controlType : "sap.m.Table",
            success : function(oTable){
                this.itemLength = oTable[0].getItems().length;
                for(var i =0;i<10;i++){
                    if(oTable[0].getItems()[i].getCells()[4].getEditable()){
                        if(oTable[0].getItems()[i].getCells()[4].getSelected()){
                            oTable[0].getItems()[i].getCells()[4].setSelected(false);
                        }
                        else{
                            oTable[0].getItems()[i].getCells()[4].setSelected(true);
                        }
                    }
                }
                ok(true,"subscribe checkbox checked!");
            },
            errorMessage : "Didn't click on the subscribe checkbox"
        });
    },

    iClickOnSave : function(){
        return this.waitFor({
            controlType : "sap.m.Button",
            success : function(oBtn){
                oBtn[4].firePress();
                ok(true,"save button pressed!");
            }
        })
    },

    iClickOnOKinDialog : function(){
        return this.waitFor({
            controlType:"sap.m.Dialog",
            success : function(oDialog){
                oDialog[0].getButtons()[0].firePress();
            },
            errorMessage : "Didn't find the dialog"
        });
    },

    iGetARandomTruckNumber : function(){
        return this.waitFor({
            controlType :"sap.m.Table",
            success : function(oTable){
                var randomNumber = Math.floor(Math.random() * (this.itemLength - 0 + 1));
                this.randomTruckNumber = oTable[0].getItems()[randomNumber].getCells()[0].getText();
            },
            errorMessage : "Didn't find the toolbar"
        });
    },

    iEnterATruckNumber : function(){
        return this.waitFor({
            controlType : "sap.m.Toolbar",
            success : function(oToolbar){
                oToolbar[0].getContent()[2].setValue(this.randomTruckNumber);
                oToolbar[0].getContent()[2].fireEvent("search",{query:this.randomTruckNumber});
            },
            errorMessage : "Couldn't enter a truck number!"
        });
    },
});
