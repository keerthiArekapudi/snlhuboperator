/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("opa5.Assertions.profile_initialFocus_assertions");
jQuery.sap.require("sap.ui.test.Opa5");
jQuery.sap.require("sap.ui.test.matchers.PropertyStrictEquals");
//sap.ui.test.Opa5.getWindow().sap.ui.getCore();

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

    iseeFocus: function(){
        return this.waitFor({
            controlType : "sap.m.Input",
            success : function(oInput){
                var focusElement = $(sap.ui.test.Opa5.getWindow().document.activeElement).attr("id");
                var focusInstance = sap.ui.test.Opa5.getWindow().sap.ui.getCore().byId(focusElement);
                console.log(focusInstance);
                ok(true,"This has the focus : "+focusInstance);

            },
            errorMessage :"Focus is not in the right position"
        });
    },
    iSeeFocus : function(){
        return this.waitFor({
            id:"splView.profile.EditUserProfile--sapSplMyProfileEditModeFirstNameText",
            check: function(oInput){
                return sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()==='splView.profile.EditUserProfile--sapSplMyProfileEditModeFirstNameText';
            },
            success : function(oInput){
                ok(sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()==='splView.profile.EditUserProfile--sapSplMyProfileEditModeFirstNameText',"Focus is on the right input element"+sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId());
            },
            errorMessage : "Focus on the wrong input"+sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()
        });
    },

    iSeeFocusOnFollowTrucksSearch : function(){
        return this.waitFor({
            controlType : "sap.m.SearchField",
            check : function(oSearchField){
                return sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()==="splView.profile.UserProfile--sapSclFollowTrucksSearchField";
            },
            success : function(){
                ok(sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()==='splView.profile.UserProfile--sapSclFollowTrucksSearchField',"Focus is on the right input element"+sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId());
            },
            errorMessage : "Focus on the wrong input !"+sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()
        });
    },

    iSeeFocusOnEnabledRow : function(){
        return this.waitFor({
            controlType : "sap.m.SearchField",
            check : function(oSearchField){
                return sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()===$(($(".sapSclFollowTrucksColumnListItems").not(".SapSplTrucksListDisabled"))[0]).attr("id");
            },
            success : function(){
                ok(sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()===$(sap.ui.test.Opa5.getWindow().$(".sapSclFollowTrucksColumnListItems").not(".SapSplTrucksListDisabled")).attr("id"),"Focus is on the right element!");

            },
            errorMessage : "Focus on wrong control"+$(sap.ui.test.Opa5.getWindow().$(".sapSclFollowTrucksColumnListItems").not(".SapSplTrucksListDisabled")).attr("id")
        });
    },
    iSeeFocusOnNameField : function(){
        return this.waitFor({
            controlType : "sap.m.Input",
            check : function(oInput){
                return sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()==="splView.profile.EditProfile--sapSplCompanyProfileImageInput";
            },
            success : function(){
                ok(sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()==='splView.profile.EditProfile--sapSplCompanyProfileImageInput',"Focus is on the right input element"+sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId());
            },
            errorMessage : "Focus on the wrong Input"
        });
    },

    iSeeFocusOnTimeHorizon : function(){
        return this.waitFor({
            controlType : "sap.m.Select",
            check : function(oSelect){
                return sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()==="splView.profile.Profile--SapSplUsageTimeHorizon";
            },
            success : function(){
                ok(sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()==="splView.profile.Profile--SapSplUsageTimeHorizon","Focus is on the right input element"+sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId());
            },
            errorMessage : "Focus on the wrong Control"+sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()
        });
    },

});