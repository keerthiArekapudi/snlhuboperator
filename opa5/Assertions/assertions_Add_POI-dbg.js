/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("opa5.Assertions.assertions_Add_POI");
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
    iSeeFocusOnTheInputField : function(){
        return this.waitFor({
            controlType:"sap.m.Dialog",
            check : function(oDialog){
                return sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()==="__xmlview0--SapSplValueHelpForSelectBusinessPartnerInput";
            },
            success : function(){
                ok(sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()==="__xmlview0--SapSplValueHelpForSelectBusinessPartnerInput","Focus is on the right input element"+sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId());
            },
            errorMessage : "Focus on the wrong control"+sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()
        });
    },

    iShouldSeeFocusOnSearchField : function(){
        return this.waitFor({
            controlType : "sap.m.SearchField",
            check : function(oSearchField){
                return sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()==="__xmlview0--SapSplSearchOfSelectBusinessPartnerPage";
            },
            success : function(){
                ok(sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()==="__xmlview0--SapSplSearchOfSelectBusinessPartnerPage","Focus is on the right input element"+sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId());
            },
            errorMessage : "Focus on the wrong control"+sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()
        });
    },

    iSeeFocusOnTheMessageTextArea : function(){
        return this.waitFor({
            controlType : "sap.m.TextArea",
            check : function(oSearchField){
                return sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()==="__xmlview1--SapSplMessageFromIncidentInput";
            },
            success : function(oTextArea){
                ok(sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()==="__xmlview1--SapSplMessageFromIncidentInput","Focus is on the right input element"+sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId());

            },
            errorMessage : "Couldn't find the focus on the Text Area"+sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()
        });
    },

    iSeeButtons : function(){
        return this.waitFor({
            controlType:"sap.m.Button",
            success : function(oBtn){
                ok(true,"Obtn found!");
            },
            errorMessage : "Button not found!"+sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()
        });
    },
    iSeeFocusOnTheMessageTextArea2 : function(){
        return this.waitFor({
            controlType : "sap.m.TextArea",
            check : function(oSearchField){
                return sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()==="__xmlview2--SapSplMessageFromIncidentInput";
            },
            success : function(oTextArea){
                ok(sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()==="__xmlview2--SapSplMessageFromIncidentInput","Focus is on the right input element"+sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId());

            },
            errorMessage : "Couldn't find the Text Area"
        });
    },

    iSeeFocusOnInputField : function(){
        return this.waitFor({
            controlType : "sap.m.TextArea",
            check : function(oSearchField){
                return sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()==="__xmlview3--SapSplValueHelpForSelectGeofencesInput";
            },
            success : function(oTextArea){
                ok(sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()==="__xmlview3--SapSplValueHelpForSelectGeofencesInput","Focus is on the right input element"+sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId());

            },
            errorMessage : "Couldn't find the focus on the Text Area"+sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()
        });
    },

    iSeeFocusOnSearchButtonSearchField : function(){
        return this.waitFor({
            controlType : "sap.m.SearchField",
            check : function(oSf){
                return sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()==="__field0";
            },
            success : function(oSf){
                ok(sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()==="__field0","Focus is on the right input element"+sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId());
            },
            errorMessage : "Couldn't find focus on search Field"+sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()
        });
    }
});