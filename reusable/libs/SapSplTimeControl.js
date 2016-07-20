/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.require("sap.ui.layout.HorizontalLayout");jQuery.sap.require("sap.ui.commons.ComboBox");jQuery.sap.declare("splReusable.libs.SapSplTimeControl");sap.ui.layout.VerticalLayout.extend("splReusable.libs.SapSplTimeControl",{metadata:{properties:{format:{type:"string",defaultValue:"24"},value:{type:"string",defaultValue:"12"}},events:{"change":{}}},init:function(){var A=oSapSplUtils.getBundle().getText("ANTEMERIDIEM");var P=oSapSplUtils.getBundle().getText("POSTMERIDIEM");var c=new sap.ui.commons.ComboBox({width:"4rem",change:function(e){this.setValueState();this.getParent().getContent()[0].setValueState();this.getParent().getParent().isError=false;this.getParent().getParent().getContent()[1].setVisible(false);var r=null,R=null,V;if(this.getParent().getParent().getFormat()==="12"){r="^(0[0-9]|1[0-2]):[0-5][0-9][\" \"]*("+A+"|"+P+")$";}else{r="^([0-1][0-9]|2[0-3]):[0-5][0-9]$";}R=new RegExp(r,"i");if(new RegExp("^[0-9][:][0-9]*[.]*$","i").exec(this.getValue())){this.setValue("0"+this.getValue());}if(new RegExp("^[0-9][0-9][0-9][0-9].*$","i").exec(this.getValue())){V=this.getValue();V=V.substring(0,2)+":"+V.substring(2,V.length);this.setValue(V);}if(new RegExp("^[0-9][0-9][0-9].*$","i").exec(this.getValue())){V=this.getValue();V="0"+V.substring(0,1)+":"+V.substring(1,V.length);this.setValue(V);}if(!R.exec(this.getValue())){if(this.getParent().getParent().getFormat()==="24"){this.setValue(this.getModel().getData().data24[0]);}else{if(new RegExp("^(0[0-9]|1[0-2]):[0-5][0-9][\" \"]*$").exec(this.getValue())){if(new Date().getHours()<12){this.setValue(this.getValue()+A);}else{this.setValue(this.getValue()+P);}}else{this.setValueState(sap.ui.core.ValueState.Error);this.getParent().getContent()[0].setValueState(sap.ui.core.ValueState.Error);this.getParent().getParent().getContent()[1].setVisible(true);this.getParent().getParent().isError=true;}}}this.getParent().getParent()._setValueOnChange(e);}});if(this.getContent().length===0&&this.sId&&this.sId.indexOf("clone")===-1){var v=new sap.ui.layout.HorizontalLayout();v.addContent(new sap.ui.commons.DatePicker({locale:sap.ui.getCore().getConfiguration().getLanguage(),change:function(e){this.getParent().getParent()._setValueOnChange(e);}}));v.addContent(c);this.addContent(v);this.addContent(new sap.ui.commons.Label({text:oSapSplUtils.getBundle().getText("TIME_CONTROL_ERROR_MESSAGE"),visible:false}));}},_setValueOnChange:function(e){var t=this.getContent()[0].getContent()[0].getYyyymmdd();var P=oSapSplUtils.getBundle().getText("POSTMERIDIEM");var d=t.substring(6,8);var m=t.substring(4,6);var y=t.substring(0,4);var a=null;var h=null;if(!this.isError){var T=this.getContent()[0].getContent()[1].getValue();a=T.split(":")[1][0]+T.split(":")[1][1];if(a<10){a="0"+a;}if(this.getFormat()==="12"&&T.toLowerCase().indexOf(P.toLowerCase())>-1){h=parseInt(T.split(":")[0],10)+12;}else{h=T.split(":")[0];}if(this.getFormat()==="12"&&(String(h)==="12"||String(h)==="24")){h=h-12;}if(h<10){h="0"+h;}this.setValue(new Date(y,m-1,d,h,a,0,0));this.fireChange(e);}},renderer:{},getDateValue:function(){return this.getValue();},onBeforeRendering:function(){var c=this.getContent()[0].getContent()[1];var i;var m=new sap.ui.model.json.JSONModel();var A=oSapSplUtils.getBundle().getText("ANTEMERIDIEM");var P=oSapSplUtils.getBundle().getText("POSTMERIDIEM");var t,d;m.setData({data12:["12:30"+A,"01:00"+A,"01:30"+A,"02:00"+A,"02:30"+A,"03:00"+A,"03:30"+A,"04:00"+A,"04:30"+A,"05:00"+A,"05:30"+A,"06:00"+A,"06:30"+A,"07:00"+A,"07:30"+A,"08:00"+A,"08:30"+A,"09:00"+A,"09:30"+A,"10:00"+A,"10:30"+A,"11:00"+A,"11:30"+A,"12:00"+P,"12:30"+P,"01:00"+P,"01:30"+P,"02:00"+P,"02:30"+P,"03:00"+P,"03:30"+P,"04:00"+P,"04:30"+P,"05:00"+P,"05:30"+P,"06:00"+P,"06:30"+P,"07:00"+P,"07:30"+P,"08:00"+P,"08:30"+P,"09:00"+P,"09:30"+P,"10:00"+P,"10:30"+P,"11:00"+P,"11:30"+P,"12:00"+A],data24:["00:00","00:30","01:00","01:30","02:00","02:30","03:00","03:30","04:00","04:30","05:00","05:30","06:00","06:30","07:00","07:30","08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00","21:30","22:00","22:30","23:00","23:30"]});var I=new sap.ui.core.ListItem();var a=false;I.bindProperty("text","");if(this.getFormat()==="12"){c.bindItems("/data12",I);}else{a=true;c.bindItems("/data24",I);}c.setModel(m);var h=null,b=null;if(this.getValue()&&!this.isError){d=new Date(this.getValue());t=d;if(a){h=d.getHours();b=d.getMinutes();if(h<10){h="0"+h;}if(b<10){b="0"+b;}c.setValue(h+":"+b);}else{var e;if(d.getHours()>=12){e=P;}else{e=A;}if(String(h)!=="12"||String(h)!=="0"){h=d.getHours()%12;}if(String(h)==="0"){h="12";}if(h<10){h="0"+h;}b=d.getMinutes();if(b<10){b="0"+b;}e=h+":"+b+e;c.setValue(e);}}else{d=new Date();t=d;if(a){c.setValue(c.getModel().getData().data24[i]);}else{c.setValue(c.getModel().getData().data12[i]);}}i=d.getHours()*2+1;if(d.getMinutes()>30){i++;}this.index=i;var f="",y,M,D;y=(t.getYear()+1900).toString();if(t.getMonth()+1<10){M="0"+(t.getMonth()+1).toString();}else{M=(t.getMonth()+1).toString();}if(t.getDate()<10){D="0"+(t.getDate()).toString();}else{D=t.getDate().toString();}f=y+M+D;if(!this.isError){this.getContent()[0].getContent()[0].setYyyymmdd(f);}}});
