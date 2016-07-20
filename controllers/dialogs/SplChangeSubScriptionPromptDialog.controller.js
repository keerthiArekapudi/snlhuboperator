/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.controller("splController.dialogs.SplChangeSubScriptionPromptDialog",{onInit:function(){this.byId("sapSplSelectedSubscriptionValueLabel").setText(this.getView().getViewData()["data"].getProperty("text"));sap.ui.getCore().getModel("splSearchVisibilityModel").getData()["subScriptionAccepted"]=false;sap.ui.getCore().getModel("splSearchVisibilityModel").refresh();},onAfterRendering:function(){},handleSubScriptionWarningAccepted:function(e){sap.ui.getCore().getModel("splSearchVisibilityModel").getData()["subScriptionAccepted"]=e.getParameter("selected");sap.ui.getCore().getModel("splSearchVisibilityModel").refresh();}});
