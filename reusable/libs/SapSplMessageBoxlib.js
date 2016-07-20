/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("splReusable.libs.SapSplMessageBoxlib");
splReusable.libs.SapSplMessageBoxlib=function(){if(splReusable.libs.SapSplMessageBoxlib.prototype._singletonInstance){return splReusable.libs.SapSplMessageBoxlib.prototype._singletonInstance;}splReusable.libs.SapSplMessageBoxlib.prototype._singletonInstance=this;this.oSapSplMessageBox=new sap.m.Dialog({endButton:new sap.m.Button({text:oSapSplUtils.getBundle().getText("ERROR_MESSAGE_HANDLING_OK_BUTTON"),tap:function(e){e.getSource().getParent().close();}})});};
splReusable.libs.SapSplMessageBoxlib.prototype.getMessageBoxInstance=function(e){if(this.oSapSplMessageBox.getContent().length!==0){this.oSapSplMessageBox.destroyContent();}if(e){this.oSapSplMessageBox.setTitle(oSapSplUtils.getBundle().getText("ERROR_MESSAGE_HANDLING_TITLE"));var c=[],i=0;if(e.message&&e.message.constructor===String){c[i++]=new sap.m.Label({text:e["message"]});}if(e.details&&e.details.constructor===String){c[i++]=new sap.m.TextArea({value:e.details,cols:60,rows:6});}if(i>0){this.oSapSplMessageBox.addContent(new sap.ui.layout.VerticalLayout({content:c}));}}return this.oSapSplMessageBox;};
var oSapSplErrorHandling=new splReusable.libs.SapSplMessageBoxlib();
