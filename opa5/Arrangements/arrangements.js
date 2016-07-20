/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("OPA5TestScript.Arrangements.arrangements");var arrangements=new sap.ui.test.Opa5.extend("opa5.Arrangements.arrangements",{iStartMyApp:function(){return this.iStartMyAppInAFrame("../index_test.html");},iStartMyWelcomeApp:function(){return this.iStartMyAppInAFrame("../welcome/index.html");},iStartMyBuPaApp:function(){return this.iStartMyAppInAFrame("../index.html?spl-mock-mode=true&goto=myBusinessPartners");}});
