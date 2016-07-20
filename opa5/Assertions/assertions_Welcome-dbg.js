/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("OPA5TestScript.Assertions.assertions_Welcome");
jQuery.sap.require("sap.ui.test.Opa5");
jQuery.sap.require("sap.ui.test.matchers.PropertyStrictEquals");

new sap.ui.test.Opa5.extend("opa5.Assertions.assertions_Welcome",{
	
	  iCheckForInitialFocusFocus : function(){
        return this.waitFor({
        	id:"views.WelcomePage--baseRegistrationFragmentContainer",
               check: function(fItems){
                      return sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()=== fItems.getContent()[0].getContent()[1].getId();
               },
               success : function(oInput){
                      ok(sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId()=== oInput.getContent()[0].getContent()[1].getId() ,"Focus is on the right input element"+sap.ui.test.Opa5.getWindow().sap.ui.getCore().getCurrentFocusedControlId());
                      },
        errorMessage : "Focus on the wrong input"
        });
  },
  
  iSeeToastMessage : function(){
      return this.waitFor({
          "class" : "sapMMessageToast",
          success : function(oMessageToast){
              ok(true,"Message Toast Successfully displayed!");
          },
          errorMessage : "Toast Message was not displayed!"
      });
  },
});