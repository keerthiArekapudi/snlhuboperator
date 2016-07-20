/*
 * Copyright (C) 2009-2015 SAP SE or an SAP affiliate company. All rights reserved.
 */
jQuery.sap.declare("splReusable.exceptions.ExceptionsBase");
splReusable.exceptions.ExceptionsBase=function(e){this.sMessage=null;this.sSource=null;this.oOptions=null;if(e&&e!==null){this.sMessage=e[0]["message"]||"Default message";this.sSource=e[0]["source"];this.oOptions=e[0]["options"]["severity"];}};
splReusable.exceptions.ExceptionsBase.prototype=jQuery.sap.newObject(Error());
