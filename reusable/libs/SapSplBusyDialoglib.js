/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("splReusable.libs.SapSplBusyDialoglib");
splReusable.libs.SapSplBusyDialoglib=function(){if(splReusable.libs.SapSplBusyDialoglib.prototype._singletonInstance){return splReusable.libs.SapSplBusyDialoglib.prototype._singletonInstance;}splReusable.libs.SapSplBusyDialoglib.prototype._singletonInstance=this;this.oSapSplDialog=new sap.m.BusyDialog();};
splReusable.libs.SapSplBusyDialoglib.prototype.getBusyDialogInstance=function(d){if(d&&d.title&&d.title.constructor===String){this.oSapSplDialog.setProperty("title",d["title"]);}else{this.oSapSplDialog.setProperty("title",oSapSplUtils.getBundle().getText("BUSY_DIALOG_MESSAGE"));}if(d&&d.text&&d.text.constructor===String){this.oSapSplDialog.setProperty("text",d["text"]);}this.oSapSplDialog.setCustomIcon("./resources/icons/spinner.gif").setCustomIconRotationSpeed(0);return this.oSapSplDialog;};
var oSapSplBusyDialog=new splReusable.libs.SapSplBusyDialoglib();
