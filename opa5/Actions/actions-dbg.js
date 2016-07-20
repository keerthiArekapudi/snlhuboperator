/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("opa5.Actions.actions");
jQuery.sap.require("sap.ui.test.Opa5");
jQuery.sap.require("sap.ui.test.matchers.PropertyStrictEquals");
//jQuery.sap.require("opa5.reusables.Utils");
var fname = "First_Name" + Math.random();
//["a", "b", "c", "d"]
//Math.ciel(Math.random()*26);
//var myProfileFName = null, myProfileLName, myProfileSalutation, myProfilePrefix, myProfileTelephone, myProfileDesignation  ;
new sap.ui.test.Opa5.extend("opa5.Actions.actions", {

    getRandomText: function() {
        var arr = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
        var sText = "";
        for (var i=0;i<Math.ceil(Math.random()*8); i++) {
            sText += arr[Math.ceil(Math.random()*26)];
        }
        console.log(sText);
        return sText;
    },

    /*getMyProfileDetails : function()
    {
        for(var i=0;i<Math.ceil(Math.random()*26);i++)
            {
            myProfileFName = myProfileFName+arr[i];
            myProfileLName = myProfileLName + arr[i];
            myProfileSalutation = myProfileSalutation + arr[i];
            myProfilePrefix = myProfilePrefix + arr[i];
            myProfileTelephone = myProfileTelephone + arr[i];
            myProfileDesignation = myProfileDesignation + arr[i];
            }
    },*/


    iLookAtTheScreen: function() {
        return this.waitFor();
    },
    checkTile : function () {
        return this.waitFor({
            id : this.getContext().oUIAppsObject.myUsers.sId,
            check : function (userTile) {
                return userTile.getState() === "Loaded";
            },
            success : function (oTile) {
                //    this.getContext().oUsersAppTileLoaded = true;
                /*if (this.getContext().oUsersAppTile && this.getContext().oUsersAppTileLoaded === true) {*/
                oTile.firePress();
                //}
                ok(oTile, "Users tile is loaded and fired press");
            },
            errorMessage : "The users tile did not load",
        });
    },

    iClickOnAddButton : function(){
        return this.waitFor({
            id : "MyContactsMaster--sapSplAddBusinessPartnerUserButton",
            controltype : "sap.m.Button",
            success : function(oButton)
            {
                oButton.firePress();
            },

            errorMessage : "did not find the button"
        });
    },


    iShouldSelect : function(){
        return this.waitFor({
            id : "MyContactsActionSheet",
            success : function(aItems)
            {
                aItems.getButtons()[0].firePress();
            },
            errorMessage : "did not find the button"
        });
    },

    iEnterFirstName : function()
    {
        return this.waitFor({
            id : "__input0",
            success: function(fItems){
                fItems.setValue(fname);
            },
            errorMessage : "did not find input field - First Name"
        });
    },

    iEnterLastName : function()
    {
        return this.waitFor({
            id : "__input1",
            success: function(fItems){
                fItems.setValue("Last_Name");
            },
            errorMessage : "did not find input field - Last Name"
        });
    },

    iClickAddButton : function()
    {
        return this.waitFor({
            id : "NewContactRegistrationDetail--newContactInvite",
            success: function(fItems){
                fItems.firePress();
            },
            errorMessage : "did not find Add Button"

        });
    },

    iClickOnOptions: function()
    {

        return this.waitFor({

            id: "__item0",
            success: function(oContent){

                oContent.firePress();


            },
            errorMessage : "did not find User Options Button"

        });

    },

    iClickOnLogout: function()
    {
        return this.waitFor({
            controlType : "sap.m.ActionSheet",
            success : function(sContent)
            {

                sContent[0].getButtons()[2].firePress();
            },
            errorMessage : "didnot find the Logout button"
        });
    },

    iClickOnYesButton : function()
    {
        return this.waitFor({
            searchOpenDialogs : true,
            controlType : "sap.m.Button",
            matchers : new sap.ui.test.matchers.PropertyStrictEquals({
                name : "text",
                value : "Yes"
            }),
            success : function (aButtons) {
                aButtons[0].$().trigger("tap");
                ok(true, "Yes button pressed");
            },
            errorMessage : "Did not find the yes button in dialog"
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

    iEditDetails : function()
    {
        return this.waitFor({
            id: "splView.profile.EditUserProfile--SimpleFormDisplay410",
            success : function(oItems){

                //this.getMyProfileDetails();
                console.log(1);

                oItems.getContent()[3].setValue(this.getRandomText());
                oItems.getContent()[5].setValue(this.getRandomText());
                oItems.getContent()[7].setValue(this.getRandomText());
                oItems.getContent()[9].setValue(this.getRandomText());
                oItems.getContent()[11].setValue(this.getRandomText());
                oItems.getContent()[13].setValue(this.getRandomText());


            },
            errorMessage : "Did not find the fields"
        });

    },

    iClickSave : function()
    {
        return this.waitFor({
            id : "splView.profile.EditUserProfile--btnSaveMyProfile",
            success : function(fButton)
            {
                fButton.firePress();
            },
            errorMessage : "Did not find the save button"
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

    iEditCompanyDetails : function()
    {
        return this.waitFor({
            id : "splView.profile.EditProfile--SimpleFormDisplay400",
            success : function(fItems)
            {
                fItems.getContent()[0].getContent()[0].getContent()[1].getItems()[0].getItems()[0].setValue("http://www.paulgassfamily.com/section2/ii3/ii3images/twohamburg00426uw.jpg");
                fItems.getContent()[0].getContent()[0].getContent()[1].getItems()[0].getItems()[1].firePress();
                fItems.getContent()[0].getContent()[0].getContent()[3].setValue(this.getRandomText());
                fItems.getContent()[0].getContent()[0].getContent()[5].setValue(this.getRandomText());
                fItems.getContent()[0].getContent()[0].getContent()[7].setValue(this.getRandomText());
                fItems.getContent()[0].getContent()[0].getContent()[9].setValue("http //www.trustworthyInc.com");
                fItems.getContent()[0].getContent()[0].getContent()[11].setValue(this.getRandomText());
                fItems.getContent()[0].getContent()[0].getContent()[13].setValue(this.getRandomText());
                fItems.getContent()[0].getContent()[0].getContent()[15].setValue(this.getRandomText());
                fItems.getContent()[0].getContent()[0].getContent()[17].setValue(this.getRandomText());
                fItems.getContent()[0].getContent()[0].getContent()[19].setValue(this.getRandomText());
                fItems.getContent()[0].getContent()[0].getContent()[21].setValue(this.getRandomText());

                //create Tour options
                if(fItems.getContent()[1].getContent()[0].getContent()[1].getItems()[0].isSelected())
                {
                    fItems.getContent()[1].getContent()[0].getContent()[1].getItems()[1].setSelected(true);
                }
                else{
                    fItems.getContent()[1].getContent()[0].getContent()[1].getItems()[0].setSelected(true);
                }

                /*a = ["a", "b", "c", "d"]
                ["a", "b", "c", "d"]
                Math.ciel(Math.random()*4)
                a[Math.ceil(Math.random()*4)]
                 */
            },
            errorMessage : "Didnot find the company details feilds"
        });
    },

    iClickSaveButton : function()
    {
        return this.waitFor({
            id : "splView.profile.EditProfile--btnSaveCompanyProfile",
            success : function(oButton)
            {
                oButton.firePress();
            },
            errorMessage : "Save button not found"

        });
    },
    // lso_admin
    iClickOnIncidentsTile : function () {
        return this.waitFor({
            id : this.getContext().oUIAppsObject.incidences.sId,
            check : function (incidentsTile) {
                return incidentsTile.getState() === "Loaded";
            },
            success : function (oTile) {
                //    this.getContext().oUsersAppTileLoaded = true;
                /*if (this.getContext().oUsersAppTile && this.getContext().oUsersAppTileLoaded === true) {*/
                oTile.firePress();
                //}
                ok(oTile, "Incidents tile is loaded and fired press");
            },
            errorMessage : "The Incidents tile did not load",
        });
    },

    iClickOnAddIncidentsButton : function()
    {
        return this.waitFor({
            id : "IncidentsMasters--SapSplAddIncidentButton",
            success : function(oButton)
            {
                oButton.firePress();
            },
            errorMessage : "Add Button not found"
        });
    },

    iEnterIncidentsDetails : function(incident)
    {
        return this.waitFor({
            id : "SapSplIncidentsDetailPageForm",
            viewName : "splView.incidents.IncidentsDetailView",
            success : function(fContent)
            {
                //oSapSplOpa5Utils.fnFillFormElements(fContent);
                fContent.getContent()[1].setValue(this.getRandomText());
                fContent.getContent()[3].setValue(this.getRandomText());
                //select Incident Type
                if(incident==="Container Terminal"){

                    fContent.getContent()[5].setSelectedItem(fContent.getContent()[5].getItems()[3]);
                    console.log("container");
                }
                else if(incident==="Parking")
                {
                    fContent.getContent()[5].setSelectedItem(fContent.getContent()[5].getItems()[2]);
                    console.log("Parking");
                }
                else if(incident==="Interference")
                {
                    fContent.getContent()[5].setSelectedItem(fContent.getContent()[5].getItems()[1]);
                    console.log("Interference");
                }
                fContent.getContent()[11].setSelectedItem(fContent.getContent()[11].getItems()[2]);

            },
            errorMessage : "Incidents fields not found"
        });
    },

    iClickSaveIncident : function(){
        return this.waitFor({
            id : "IncidentsDetails--SapSplIncidentsFooterSave",
            success : function(sButton){
                sButton.firePress();
            },
            errorMessage : "Save Button not found"
        });

    },

    // Help,Logout,add hub,edit subscription,deregister, help 

    checkHelpTile : function () {
        return this.waitFor({
            id : this.getContext().oUIAppsObject.help.sId,
            check : function (userTile) {
                return userTile.getState() === "Loaded";
            },
            success : function (oTile) {
                oTile.firePress();
                ok(oTile, "Users tile is loaded and fired press");
            },
            errorMessage : "The users tile did not load",
        });
    },



    homePage : function(){
        var homeIcon = sap.ui.getCore().byId("sapSplBaseUnifiedShell").getHeadItems()[0];
        return this.waitFor({
            id : homeIcon,
            success : function (oShellHeadItem) {
                oShellHeadItem.firePress();
                ok(true, "Hitting the back button");
            },
            errorMessage : "Didn't find the home icon"
        });
    },

    TrafficStatus:function(){
        return this.waitFor({
            id : this.getContext().oUIAppsObject.liveApp.sId,
            check : function (userTile) {
                return userTile.getState() === "Loaded";
            },
            success : function (oTile) {
                oTile.firePress();
                ok(oTile, "Users tile is loaded and fired press");
            },
            errorMessage : "The users tile did not load",});
    },

    clickOnBPButton : function(){
        return this.waitFor({
            id :"splView.liveApp.liveApp--oContactBusinessPartnerButton",
            success : function(oButton){
                oButton.firePress();
                ok(true,"Button is pressed!");
            },
            errorMessage : "Button not clicked!"
        });
    },

    openF4Help : function(){

        return this.waitFor({
            controlType: "sap.m.Dialog",
            success : function(oDialog){
                var helpIcon = oDialog[0].getContent()[0].getContent()[0].getContent()[0].getCurrentPage().getContent()[0].getContent()[1].getRows()[0].getCells()[0].getContent()[0];
                helpIcon.fireValueHelpRequest();
                ok(true,"select BP Dialog Found!");
            },
            errorMessage :"didn't find the BP dialog"

        });
    },

    clickListItem : function(){

        return this.waitFor({
            controlType : "sap.m.StandardListItem",
            success : function(oListItem){
                oListItem[0].setSelected(true);
                oListItem[0].firePress();
                var oBPDialogBeginButton = oListItem[0].getParent().getParent().getParent().getParent().getParent().getParent().getBeginButton();
                this.getContext().oBPDialogBeginButton = oBPDialogBeginButton;
                ok(true,"List Item of BP clicked!");
            },
            errorMessage : "didn't click the list item!"
        });
    },

    clickListCarrierItem : function(){
        return this.waitFor({
            controlType : "sap.m.StandardListItem",
            success : function(oListItem){
                oListItem[0].setSelected(true);
                oListItem[0].firePress();
                ok(true,"carrier list items clicked!");
            },
            errorMessage : "didn't click the carrier option!"
        });
    },

    iclickOK : function(){
        return this.waitFor({
            controlType : "sap.m.Dialog",
            success : function(){
                this.getContext().oBPDialogBeginButton.firePress();
                ok(true,"OK Clicked!");
            },
            errorMessage: "OK didn't get clicked!"
        });
    },

    iclickOKInBPDialog : function(){

        return this.waitFor({
            controlType : "sap.m.Dialog",
            success : function(oDialog){
                var oDialogOKBtn = oDialog[0].getBeginButton();
                oDialogOKBtn.firePress();
                ok(true,"OK Clicked!");
            },
            errorMessage : "OK button wasn't clicked!"
        });
    },

    iEnterMessage : function(){

        return this.waitFor({
            controlType : "sap.m.Dialog",
            success : function(oDialog1){
                var oMessageTA = oDialog1[0].getContent()[0].getContent()[0].getContent()[0].getCurrentPage().getContent()[0].getContent()[3].getContent()[0];
                oMessageTA.setValue("random Text for testing");
                ok(true, " random text entered!");
            },
            errorMessage : "Entering Random Text failed!"
        });
    },

    clickOnHomeButton : function(){
        return this.waitFor({
            controlType : "sap.ui.unified.ShellHeadItem",
            success : function(oShellHeadItem){
                oShellHeadItem[0].firePress();
                ok(true,"home button found and pressed!");
            },
            errorMessage : "Home button not clicked!"

        });
    },

    clickOnHomeIcon : function(){
        return this.waitFor({
            id : "sapSplBaseUnifiedShell",
            success :function(oShellInstance){
                oShellInstance.getHeadEndItems()[0].firePress();
                ok(true,"Clicked on the help icon");
            },
            errorMessage : "Couldn't click the help icon"
        });
    },

    clickOnCloseBtn : function(){
        return this.waitFor({
            controlType : "sap.m.Dialog" ,
            success : function(oDialog1){
                oDialog1[0].getEndButton().firePress();
                ok(true,"Close button clicked!");
            },
            errorMessage:"Close button wasn't clicked!"
        });
    },

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

    iClickOnAddHubButton : function(){
        return this.waitFor({
            id : "splView.profile.Profile--sapSplAddHubButton",
            success : function(oBtn){
                oBtn.firePress();
                ok(true,"Add Hub Button is pressed!");
            },
            errorMessage : "Add Hub button wasn't pressed!"
        });
    },

    iClickOnEditSubs : function(){
        return this.waitFor({
            controlType : "sap.m.Table",
            success : function(oTable){
                oTable[0].getItems()[0].getCells()[3].firePress();
                ok(true,"edit Button pressed!");
            },
            errorMessage: " Edit Button is pressed!"
        });
    },
    iClickOnEditDialogSubs:function(){
        return this.waitFor({
            id: "addEditDeregisterHubDialog",
            success : function(oDialog){
                var subCheckList = oDialog.getContent()[0].getContent()[0].getContent()[4];
                subCheckList.setSelectedItem(subCheckList.getItems()[0]);
                subCheckList.fireChange({selectedItem : subCheckList.getItems()[0]});
                ok(true,"Edit dialog has been opened!");
            },
            errorMessage : "Edit Dialog could not be opened!"
        });
    },

    iClickLogOut : function(){
        return this.waitFor({
            controlType : "sap.m.ActionSheet",
            success : function(sContent)
            {
                sContent[0].getButtons()[2].firePress();
                ok(true,"Log out pressed");
            },
            errorMessage : "Did not find the log out button"

        });
    },

    iClickOnYes : function(){
        return this.waitFor({
            controlType : "sap.m.Dialog",
            success : function(oDialog)
            {
                oDialog[0].getBeginButton().firePress();
                ok(true,"Yes option clicked");
            },
            errorMessage : "Did not find prompt dialog"

        });
    },

    iClickOnAgree : function(){
        return this.waitFor({
            controlType : "sap.m.Dialog",
            success : function(oDialog){
                var checkBox = oDialog[1].getContent()[0].getContent()[0].getContent()[0].getContent()[3].getContent()[0];
                checkBox.setSelected(true);
                checkBox.fireSelect();
                ok(true,"Checkbox for agree clicked!");
            },
            errorMessage : "Checkbox was not clicked!"
        });
    },

    iClickOnOKBtn : function(){
        return this.waitFor({
            controlType : "sap.m.Dialog",
            success : function(oDialog){
                var okBtn = oDialog[1].getButtons()[0];
                okBtn.firePress();
                ok(true,"OK button is pressed!");
            },
            errorMessage : "OK button was not pressed!"
        });
    },
    iClickOnSaveBtn : function(){
        return this.waitFor({
            controlType : "sap.m.Dialog",
            success : function(oDialog){
                var saveBtn = oDialog[0].getBeginButton();
                saveBtn.firePress();
                ok(true,"Save button was pressed!");
            },
            errorMessage : "Save Button was not pressed!"
        });
    },

    iSelectAHub : function(){
        return this.waitFor({
            controlType : "sap.m.Dialog",
            success : function(oDialog){
                var hubOption = oDialog[0].getContent()[0].getContent()[0].getContent()[1];
                hubOption.setSelectedItem(hubOption.getItems()[1]);
                hubOption.fireChange({selectedItem : hubOption.getItems()[1]});
                ok(true,"hub was selected!");
            },
            errorMessage : "Hub was successfully selected!"
        });
    },

    iClickOnAdd : function(){
        return this.waitFor({
            controlType : "sap.m.Dialog",
            success : function(oDialog){
                oDialog[0].getBeginButton().firePress();
                ok(true,"Hub is Added!");
            },
            errorMessage : "Add button wasn't clicked!"
        });
    },

    iAgreeToAgreement : function(){
        return this.waitFor({
            controlType : "sap.m.Dialog",
            success : function(oDialog){
                var oAgreeChkBox = oDialog[0].getContent()[0].getContent()[0].getContent()[7];
                oAgreeChkBox.setSelected(true);
                oAgreeChkBox.fireSelect();
            },
            errorMessage : "Couldn't check the Agree clause"
        });
    },

    iClickOnDeregister : function(){
        return this.waitFor({
            id : "splView.profile.Profile--sapSplDeregisterMyCompanyButton",
            success : function(oBtn){
                oBtn.firePress();
            },
            errorMessage : "Couldn't click on deregister"
        });
    },

    iSelectHubsToDeregister : function(){
        return this.waitFor({
            controlType : "sap.m.Dialog",
            success : function(oDialog){
                var hubSelect = oDialog[0].getContent()[0].getContent()[0].getContent()[8];
                var hubSelOption = hubSelect.getItems()[1];
                if (hubSelOption.getText() !== "Hub Admin"){
                    hubSelect.setSelectedItem(hubSelOption);
                    hubSelect.fireChange({selectedItem : hubSelOption});
                }
                ok(true,"Hub to deregister is selected!");
            },
            errorMessage : "hub to deregister is not selected!"
        });
    },

    iClickOnDeregisterWarning : function(){
        return this.waitFor({
            controlType: "sap.m.Dialog",
            success : function(oDialog){
                oDialog[0].getBeginButton().firePress();
                ok(true,"Deregister button clicked!");
            },
            errorMessage : "Deregister button couldn't be clicked!"
        });
    },

    comLogTileLoaded:function(){
        return this.waitFor({
            id : this.getContext().oUIAppsObject.communicationLog.sId,

            check : function (communicationTile) {
                return communicationTile.getState() === "Loaded";
            },
            success : function (oTile) {
                oTile.firePress();
                ok(oTile, "Communication Log is loaded and fired press");
            },
            errorMessage : "Communication Log tile did not load",});
    },


    iSelectCustomRange:function(){
        return this.waitFor({
            id : "splView.communicationLog.communicationLog--timeHorizonSelect",
            //id: "timeHorizonSelect",
            //contrylType: "sap.m.Select",
            success : function (aSelect) {
                aSelect.setSelectedItem(aSelect.getItems()[5]);
                aSelect.fireChange({
                    selectedItem: aSelect.getItems()[5]
                });
                ok(aSelect, "Custom Range Option selected from dropdown");
            },
            errorMessage : "Custom Range Option selected from dropdown",
        });
    },

    iEnterCustomRange: function(){
        return this.waitFor({
            controlType: "sap.m.DateRangeSelection",
            success : function(aDate){
                var date = new Date();
                date.setMonth(date.getMonth()-1);
                aDate[0].setDateValue(date);
                aDate[0].setSecondDateValue(new Date());
                ok(aDate, "Custom Range Dates entered");
            },
            errorMessage: "Custom Range Dates not entered",

        });
    },

    iSelectItems: function(){
        return this.waitFor({
            controlType: "sap.m.Select",
            success: function(oEvent){
                for(var i=0; i<oEvent.length; i++){
                    if(i===0){
                        oEvent[i].setSelectedItem(oEvent[i].getItems()[4]);
                    }
                    else{
                        oEvent[i].setSelectedItem(oEvent[i].getItems()[1]);
                    }
                    ok(true, "Value selected from the dropdown "+i);
                }
            },
            errorMessage: "Select not found"
        });
    },

    iClickonGo: function(){
        return this.waitFor({
            controlType: "sap.m.Button",
            matchers : new sap.ui.test.matchers.PropertyStrictEquals({
                name : "text",
                value : "Go"
            }),
            success : function (oButtons) {
                oButtons[0].$().trigger("tap");
                ok(true, "Go button pressed");
            },
            errorMessage: "Button not found"
        });
    },

    iSelectSortButton: function(){
        return this.waitFor({
            id: "splView.communicationLog.communicationLog--sapSplCommunicationLogSort",
            success: function(oButton){
                oButton.firePress();
                ok(true, "Sort Button is selected");
            },
            error: "Button not found",
        });
    },

    iSelectSortOrder: function(){
        return this.waitFor({
            id: "oSapSplSortFilterDialog",
            success: function(oDialog){
                oDialog.setSortDescending(false);
                oDialog.setSelectedSortItem(oDialog.getSortItems()[1]);
                ok(true, "Option for sorting is selected");
            },
            error: "Sort Order button not pressed"

        });
    },

    iSelectGroupButton: function(){
        return this.waitFor({
            id: "splView.communicationLog.communicationLog--sapSplCommunicationLogGroup",
            success: function(oButton){
                oButton.firePress();
                ok(true, "Group Button is selected");
            },
            error: "Group By Button not found",
        });
    },

    iSelectGroupOrder: function(){
        return this.waitFor({
            id: "oSapSplSortFilterDialog",
            success: function(oDialog){
                oDialog.setGroupDescending(false);
                oDialog.setSelectedGroupItem(oDialog.getGroupItems()[1]);
                ok(true, "Option for Grouping is selected");
            },
            error: "Group Order button not pressed"

        });
    },

    iPressOkButton : function (sText) {
        return this.waitFor({
            //searchOpenDialogs : true,
            controlType : "sap.m.Button",
            matchers : new sap.ui.test.matchers.PropertyStrictEquals({
                name : "text",
                value : sText
            }),
            success : function (aButtons) {
                aButtons[0].$().trigger("tap");
                ok(true, "OK button pressed");
            },
            errorMessage : "Did not find the ok button in dialog"
        });
    },

});