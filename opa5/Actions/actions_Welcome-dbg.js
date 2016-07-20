/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.require("sap.ui.test.Opa5");
jQuery.sap.require("sap.ui.test.matchers.PropertyStrictEquals");
new sap.ui.test.Opa5.extend("opa5.Actions.actions_Welcome", {

    getRandomText: function() {
        var arr = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
        var sText = "";
        for (var i=0;i<Math.ceil(Math.random()*8); i++) {
            sText += arr[Math.ceil(Math.random()*26)];
        }
        console.log(sText);
        return sText;
    },
    
    LoadWelcomePage : function () {
      return this.waitFor({
          id : "baseForm--Layout",
          viewName : "views.WelcomePage",
          success : function (oPage) {
              ok(oPage, "Loaded the Welcome page : "+ oPage);
          },
          errorMessage : "Error in loading the Welcome page",
      });
  },
    
    iEnterUserDetails : function()
    {
        return this.waitFor({
        	id:"views.WelcomePage--baseRegistrationFragmentContainer",
            success: function(fItems){
            	fItems.getContent()[0].getContent()[1].setValue(this.getRandomText());
            	fItems.getContent()[0].getContent()[3].setValue(this.getRandomText());
            	fItems.getContent()[0].getContent()[5].setValue(this.getRandomText());
            	fItems.getContent()[0].getContent()[7].setValue(this.getRandomText()+"@yopmail.com");
            	 ok(fItems, "Entered the user details! ");
            },
            errorMessage : "Did not find input fields!"
        });
    },
    
    iSelectUserDetails : function()
    {
    	return this.waitFor({
       	controlType:"sap.m.Select",
           success: function(oSelect){
    
        	  oSelect[0].$().trigger("tap");
        	  oSelect[0].getItems()[1].$().trigger("tap");
        	  oSelect[0].setSelectedItem(oSelect[0].getItems()[1]);
        	
        	  oSelect[1].$().trigger("tap");
        	  oSelect[1].getItems()[1].$().trigger("tap");
        	  oSelect[1].setSelectedItem(oSelect[1].getItems()[1]);
        
        	  oSelect[2].$().trigger("tap");
        	  oSelect[2].getItems()[1].$().trigger("tap");
        	  oSelect[2].setSelectedItem(oSelect[2].getItems()[1]);
        	  ok(oSelect, "Selected the user details! ");
           },
           errorMessage : "Did not find select controls!"
       });
    },
    
    iClickOnRegisterButton : function()
    {
        return this.waitFor({
        	controlType:"sap.m.Panel",
            success: function(oPanel){
            	oPanel[0].getContent()[2].getContentRight()[0].firePress();
            	ok(oPanel, "clicked on the register button: "+ oPanel[0].getContent()[2].getContentRight()[0] );
            },
            errorMessage : "Register button not found"
        });
    },
    
});