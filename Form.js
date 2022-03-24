var isNewFormjs;
var AppointmentId = "";
var strApptGroupId="";
var empId="";
var formid = "";
var baseUrl = "";
var source = "";
var guestName = "";
var therapistName = "";
var readonly = "";
var IsRequiredFilled = false;
var NameValuePair = [];
var MetaValuePair = [];
var _viewcontext;
var ActiveViewContext = 0;
var _HtmlMacros;
var htmlAuthoriazation;
var IsPreviewForm = 0;
var sigPads = [];
var createSignatures = [];
var annotatePads = [];
var AnnotationImages = [];
var strCenterId = '';
var strOrganization = '';
var recordsjson;
var _customFieldType=0;
var _OwnerId='';
var _VersionNo = '';
var _reviewRole = '0';
var useCatalogApi = false;
var aHideTabs = [];
var ImageJson = [];
var globalFileClickedId = "";
var oldAnnotation = [];
var _IsTagForm = false;
var tagId = "";
var IsMembershipForm = false;
var IsLoyaltyForm = false;
var UserMembershipId = "";
var InvoiceItemId = "";
var IsEntityForm = false;
var ServiceEntityPk = "";
var _dates = [];
var FormSubmitted = 0;
var isShineApp = false;
/* jshint bitwise: false */
var Base64 = {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdef" +
        "ghijklmnopqrstuvwxyz0123456789+/=",
    encode: function (e) {
        var t = "";
        var n, r, i, s, o, u, a;
        var f = 0;
        e = Base64._utf8_encode(e);
        while (f < e.length) {
            n = e.charCodeAt(f++);
            r = e.charCodeAt(f++);
            i = e.charCodeAt(f++);
            s = n >> 2;
            o = (n & 3) << 4 | r >> 4;
            u = (r & 15) << 2 | i >> 6;
            a = i & 63;
            if (isNaN(r)) {
                u = a = 64
            } else if (isNaN(i)) {
                a = 64
            }
            t = t +
                this._keyStr.charAt(s) +
                this._keyStr.charAt(o) +
                this._keyStr.charAt(u) +
                this._keyStr.charAt(a)
        }
        return t
    },
    decode: function (e) {
        var t = "";
        var n, r, i;
        var s, o, u, a;
        var f = 0;
        e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (f < e.length) {
            s = this._keyStr.indexOf(e.charAt(f++));
            o = this._keyStr.indexOf(e.charAt(f++));
            u = this._keyStr.indexOf(e.charAt(f++));
            a = this._keyStr.indexOf(e.charAt(f++));
            n = s << 2 | o >> 4;
            r = (o & 15) << 4 | u >> 2;
            i = (u & 3) << 6 | a;
            t = t + String.fromCharCode(n);
            if (u != 64) {
                t = t + String.fromCharCode(r)
            }
            if (a != 64) {
                t = t + String.fromCharCode(i)
            }
        }
        t = Base64._utf8_decode(t);
        return t
    },
    _utf8_encode: function (e) {
        e = e.replace(/\r\n/g, "\n");
        var t = "";
        for (var n = 0; n < e.length; n++) {
            var r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r)
            } else if (r > 127 && r < 2048) {
                t +=
                    String.fromCharCode(r >> 6 | 192);
                t +=
                    String.fromCharCode(r & 63 | 128)
            } else {
                t +=
                    String.fromCharCode(r >> 12 | 224);
                t +=
                    String.fromCharCode(r >> 6 & 63 | 128);
                t +=
                    String.fromCharCode(r & 63 | 128)
            }
        }
        return t
    },
    _utf8_decode: function (e) {
        var t = "";
        var n = 0;
        var r = c1 = c2 = 0;
        while (n < e.length) {
            r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r);
                n++
            } else if (r > 191 && r < 224) {
                c2 = e.charCodeAt(n + 1);
                t +=
                    String.fromCharCode(
                        (r & 31) << 6 | c2 & 63);
                n += 2
            } else {
                c2 = e.charCodeAt(n + 1);
                c3 = e.charCodeAt(n + 2);
                t +=
                    String.fromCharCode(
                        (r & 15) << 12 |
                        (c2 & 63) << 6 | c3 & 63);
                n += 3
            }
        }
        return t
    }
} 

function hideTabsForGuest(arrTabs) {
    aHideTabs = arrTabs;
}
function initialiseValues(obj) {
    if (IsPreviewForm == 0) {
        NameValuePair = $('#form').serializeArray();
        NameValuePair = NameValuePair.concat(
           jQuery('#form input[type=checkbox]:not(:checked)').map(
                   function () {
                       return { "name": this.name, "value": "" }
                   }).get());
        var radioButtons = jQuery('#form input[type=radio]');
        $.each(radioButtons, function () {
            var radobj = this;
            var newindex = NameValuePair.findIndex(function (e) { return (e.name).toLowerCase() == (radobj.name).toLowerCase(); });
            if (newindex == -1) {
                NameValuePair = NameValuePair.concat({ "name": radobj.name, "value": "" });
            }
        });
        _dates = jQuery('#form input[ztype=date]');
        $.each(_dates, function () {
            var selobj = this;
            var newindex = NameValuePair.findIndex(function (e) { return (e.name).toLowerCase() == (selobj.name).toLowerCase(); });
            if (newindex != -1) {
                var attr = selobj.attributes;
                var format = attr["zformat"];
                if (format != null && format != "undefined" && format != undefined) {
                    var date = getformatedDate(selobj.value, format.nodeValue);
                    if (date != null) {
                        NameValuePair.splice(newindex, 1);
                        NameValuePair = NameValuePair.concat({ "name": selobj.name, "value": selobj.value, "additionalData": date });
                    }
                }
                
            }
            
        });
        
        var seldropdowns = jQuery('#form select');
        $.each(seldropdowns, function () {
            var selobj = this;
            var newindex = NameValuePair.findIndex(function (e) { return (e.name).toLowerCase() == (selobj.name).toLowerCase(); });
            if (newindex == -1) {
                NameValuePair = NameValuePair.concat({ "name": selobj.name, "value": "" });
            }
        });


    }
}

function IframeCustomResize(height) {
  if (source == "web") {
      $('#ifrCustomDataRander', window.parent.document).height($("body")[0].scrollHeight + height);
  }
}


var r20 = /%20/g,
    rbracket = /\[\]$/,
    rCRLF = /\r?\n/g,
    rsubmitterTypes = /^(?:submit|button|image|reset)$/i,
    manipulation_rcheckableType = /^(?:radio)$/i,
    rsubmittable = /^(?:input|select|textarea|keygen)/i;


function saveMetadata() {
    var sigPadsArray = document.documentElement.innerHTML.match(/createSignature\s*\(\s*('|")\w+-signature('|")\s*,\s*({\s*(.|\n)*?\s*})*?\s*\)\s*;/g);
    var sigPadsReqd = {};
    for (i in sigPadsArray) {
        var id = sigPadsArray[i].match(/('|").+?('|")/)[0];
        id = id.substr(1, id.length - 2);
        sigPadsReqd[id]=JSON.parse(sigPadsArray[i].match(/{(.|\n)+}/g)[0]).required;
    }

    var annotaionPadsArray = document.documentElement.innerHTML.match(/createAnnotaions\s*\(\s*('|")\w+('|")/g)
    var annoPadsIds = [];
    for (i in annotaionPadsArray) {
        annoPadsIds.push(annotaionPadsArray[i].substring(18, annotaionPadsArray[i].length - 1));
    }

    jQuery.fn.extend({
        serialize: function () {
            return jQuery.param(this.serializeArray());
        },
        customSerializeArray: function () {
            return this.map(function () {
                // Can add propHook for "elements" to filter or add form elements
                var elements = jQuery.prop(this, "elements");
                
                return elements ? jQuery.makeArray(elements) : this;
            })
                .filter(function () {
                    var type = this.type;
                    // Use .is(":disabled") so that fieldset[disabled] works
                    return this.name && !jQuery(this).is(":disabled") &&
                        rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type) &&
                        (this.checked || !manipulation_rcheckableType.test(type));
                })
                .map(function (i, elem) {
                    if (elem.name !== null && elem.name !== "" && elem.type !== 'radio') {
                    var attributes = document.getElementsByName(elem.name)[0].attributes;
                    var elementvalue = elem.value;
                    var dropdownvalues = "";
                    var ztype = "";
                    if (attributes["ztype"] != null)
                        ztype = attributes["ztype"].value;

                    var k = 0;
                    if (ztype == "dropdown") {
                        
                        while (elem[k] != null) {
                            dropdownvalues = dropdownvalues + elem[k].text + "::" + elem[k].value;
                            k = k + 1;
                            if (elem[k] != null)
                                dropdownvalues = dropdownvalues + "$#$";
                        }
                        elementvalue = dropdownvalues;
                    }

                    var node = document.getElementsByName(elem.name)[0];

                    if (node.localName === 'textarea') {   // based on element (textarea)
                        ztype = 'textarea';
                    }
                    else if (node.localName === 'select') {   // based on element (select)
                        ztype = 'dropdown';
                    }
                    else if (node.attributes.type && node.attributes.type.nodeValue === 'img') {      // handling images
                        ztype = 'image';
                    }
                    else {
                        if (node.localName === 'input' && node.type.length > 0) {    // based on type attribute
                            if (node.type == 'img') {
                                ztype = 'image';
                            }
                            else {
                                ztype = node.type;
                            }
                        }
                    }
                    var node_format = node.zformat ? node.zformat : (node.format ? node.format : null);
                    var val = jQuery(this).val();
                    return val == null ?
                        null :
                        jQuery.isArray(val) ?
                            jQuery.map(val, function (val) {

                                return { id:elem.id, name: elem.name, value: elementvalue, Type: ztype, Required: node.required ? 1 : 0, ElementFormat: node_format, Exportable: node.is_exportable ? 1 : 0 };
                            }) :
                            { id:elem.id, name: elem.name, value: elementvalue, Type: ztype, Required: node.required ? 1 : 0, ElementFormat: node_format, Exportable: node.is_exportable ? 1 : 0 };
                    }
                }).get();
        }
    });
    
    MetaValuePair = $('#form').customSerializeArray();
    
    var radioButtons = jQuery('#form input[type=radio]');
    $.each(radioButtons, function () {
        var radobj = this;
        var newindex = MetaValuePair.findIndex(function (e) { return (e.name).toLowerCase() == (radobj.name).toLowerCase(); });
        if (newindex == -1) {
            MetaValuePair = MetaValuePair.concat({ "id": radobj.id, "name": radobj.name, "value": radobj.value,"Type" : "radio", Required: radobj.required ? 1 : 0, "Exportable": radobj.is_exportable ? 1 : 0 });
        }
        else if (newindex >= 0) {

            if (radobj.id) {
                MetaValuePair[newindex].id = MetaValuePair[newindex].id + "$#$" + radobj.id
            }
            MetaValuePair[newindex].value = MetaValuePair[newindex].value + "$#$" + radobj.value
        }

    });

    var sig_ids = jQuery("#form div[id*='-signature']");
    $.each(sig_ids, function () {
        var sigobj = this;
            MetaValuePair = MetaValuePair.concat({ "id": sigobj.id, "name": sigobj.id, "value": "", "Type": "signature", "Required": sigPadsReqd[sigobj.id] ? 1 : 0, "Exportable": 0 });
        
    });

    $.each(annoPadsIds, function() {
        MetaValuePair = MetaValuePair.concat({ "id": this, "name": 'annotationPad_' + this , "value": "", "Type": "annotation", "Required": 0, "Exportable": 0 });
    });
    
    //MetaValuePair = MetaValuePair.concat(
    //    jQuery('#form input[type=checkbox]:not(:checked)').map(
    //        function () {
    //            return { "name": this.name, "value": "" }
    //        }).get());
    //var radioButtons = jQuery('#form input[type=radio]');
    //$.each(radioButtons, function () {
    //    var radobj = this;
    //    var newindex = MetaValuePair.findIndex(function (e) { return (e.name).toLowerCase() == (radobj.name).toLowerCase(); });
    //    if (newindex == -1) {
    //        MetaValuePair = MetaValuePair.concat({ "name": radobj.name, "value": "" });
    //    }
    //});
    //var seldropdowns = jQuery('#form select');
    //$.each(seldropdowns, function () {
    //    var selobj = this;
    //    var newindex = MetaValuePair.findIndex(function (e) { return (e.name).toLowerCase() == (selobj.name).toLowerCase(); });
    //    if (newindex == -1) {
    //        MetaValuePair = MetaValuePair.concat({ "name": selobj.name, "value": "" });
    //    }
    //});
    

    var jsonStr = JSON.stringify(MetaValuePair);
    var DTO = "";
    DTO = { "HtmlData": jsonStr };
    var retval = false;
    $.ajax({
        url: globalWebApiUrl + 'api/Organizations/FormsMetadata/' + appHandlerId,
        type: 'POST',
        headers: { "X-AuthorizationToken": globalWebApiToken },
        data: DTO ,
        async: false,
        dataType: "json"
    }).done(function (data) {
        retval = true;
       
    }).fail(function (xhr, status, error) {
        retval = false;

        alert("There was some error saving the html.")
    });
    return retval;
}

var toastType = {
    Type: ['DataLoad', 'Save', 'Modified', 'Image Upload', 'File Upload'],
    Data: {
        Message: "Saved successfully"
    },
    Error: {
        StatusCode: "",
        Message: ""
    }
};
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.readAsDataURL(input.files[0]);
    }
}
function logFormError(errorMsg) {
    try {
        errorMsg = errorMsg + ': AppointmentId =' + AppointmentId + ' strOrganization =' + strOrganization + ' strCenterId =' + strCenterId + ' _OwnerId =' + _OwnerId + ' _customFieldType =' + _customFieldType
        var obj = new Object();
        obj.ErrMessage= errorMsg;
        $.ajax({
            type: "POST",
            url: baseUrl + 'api/Organizations/LogException',
            headers: htmlAuthoriazation,
            data: JSON.stringify(obj),
            async: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (msg) {
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                // alert(XMLHttpRequest.responseText); 
            }
        });
    } catch (ex) {

    }
}
var dist_moved=[];
function resizeSignatures() {
   $.each(sigPads, function (index,value) {
        var val = value["pad"].toData();
        var wrapper = document.getElementById(value["name"]);
        var canvasElement = wrapper.querySelector("canvas");
        var sliderId='jQSlider'+index;
        var parentWidth = $(canvasElement).parent().outerWidth();
        var parentheight = $(canvasElement).parent().height();
        canvasElement.setAttribute("width", parentWidth);
        canvasElement.setAttribute("height", parentheight);
        var sliderObj=document.getElementById(sliderId);
        sliderObj.value=0;
        if (val != undefined && val != null) {
            for (let i=0; i<val.length; i++) {
                for (let j=0; j<val[i].length; j++) {
                    val[i][j].x -= dist_moved[index];
                }
            }
            
            var sigPad = new SignaturePad(canvasElement);
            sigPad.fromData(val);
            sigPad._data = val;
            sigPad.on();
            enableSlider(value['pad'],sliderId,canvasElement,index,true);
            dist_moved[index]=0;
            last_position[index]=0;
        }
    });
}
function moveSign(signPad, canvasElement, offSet, ratio, index) {
    var dist = (ratio * offSet);
    dist_moved[index] += dist;
    var data = signPad.toData();
    for (let i=0; i<data.length; i++) {
        for (let j=0; j<data[i].length; j++) {
            data[i][j].x += dist;
        }
    }
    var sp = new SignaturePad(canvasElement);
    sp._data = data;
    sp.fromData(data);
    sp.on();
}
function getMinMaxXCoordinateOfSignPad(sigPad,index) {
    var x=[9999,0];
    var val=sigPads[index]['pad']._data;
    for (let i=0;i<val.length;i++) {
        for (let j=0;j<val[i].length;j++) {
            if (val[i][j].x) {
                x[1]=Math.max(x[1],val[i][j].x);
                x[0]=Math.min(x[0],val[i][j].x);
            }
        }
    }
    return x;
}
function enableSlider(sigPad,sliderId,canvasElement,index,changefn=false) {
    var x=getMinMaxXCoordinateOfSignPad(sigPad,index);
    var sliderObj=document.getElementById(sliderId);
    var v=sliderObj.value;
    if (!v) {
        v=0;
    }
    var farthestPoint;
    if (x[0]<0){
        farthestPoint=x[1]-dist_moved[index];
    } else {
        farthestPoint=x[1];
    }
    if (canvasElement.width < farthestPoint) {
        sliderObj.setAttribute('type','range');
        if (changefn) {
            sliderObj.oninput=function() {
                moveSign(sigPad,canvasElement,last_position[index]-sliderObj.value,(x[1]-canvasElement.width+10)/100,index);
                last_position[index]=sliderObj.value;
            }
        }
    }
    else {
        sliderObj.setAttribute('type','hidden');
    }
}
var last_position=[];
function createSignature(selector, options) {
    if (typeof(readyst1) == 'function' && sigPads.findIndex(i => i.name == selector) > -1) {
        return;
    }
    var sigpadvalue;
    $.each(createSignatures, function (index, item) {
        if (item.name.toLowerCase() == selector.toLowerCase()) {
            sigpadvalue = item.value;
         }
    });
    var opts = options || {};

    var jqElement = $('#' + selector);
    jqElement.addClass("m-signature-pad"); 
    var sliderId = 'jQSlider' + sigPads.length;
    var sigBody = '<div style="overflow: auto;" class="m-signature-pad--body"><canvas></canvas></div><div class="m-signature-pad--footer"><input type="hidden" min="0" max="100" value="0" class="slider" id="'+sliderId+'"><button type="button" class="button clear" data-action="clear">Clear</button></div>';
    jqElement.append($(sigBody));
    var sliderObj=document.getElementById(sliderId);
    last_position.push(0);

    var wrapper = document.getElementById(selector);
    var canvasElement = wrapper.querySelector("canvas");
    var sigPad = new SignaturePad(canvasElement);
    var ind=sigPads.length;
    sigPad.onEnd=function() {
        enableSlider(sigPad,sliderId,canvasElement,ind);
    };
    sliderObj.oninput=function(){
        last_position[sigPads.length]=this.value;
    }
    $('#'+sliderId).prop('disabled',false);
    wrapper.querySelector("[data-action=clear]").addEventListener("click", function (event) {
        sigPad.clear();
        var sigIndex = sigPads.findIndex(function (e) { return e.name.toLowerCase() == (selector).toLowerCase(); });
        sigPads[sigIndex].pad._data = [];
        sigPads[sigIndex].pad._isEmpty = true;
        $('#'+sliderId).attr('type', 'hidden');
        dist_moved[ind]=0;
        last_position[ind]=0;

    });
    resizeCanvas(canvasElement);

    if (sigpadvalue != undefined && sigpadvalue != null) {
        sigPad.fromData(sigpadvalue);
        sigPad._data = sigpadvalue;
        sigPad.on();
    }
    dist_moved.push(0);
    sigPads.push({ "pad": sigPad, "name": selector, "required": opts["required"], "reviewer": opts["ReviewNeeded"], "webstore": opts["webstore"], "Isdoctor": opts["Isdoctor"] });

    return sigPad;
}

/* Adjust canvas coordinate space taking into account pixel ratio, 
 to make it look crisp on mobile devices. 
 This also causes canvas to be cleared.*/
function resizeCanvas(canvas) {
/*   When zoomed out to less than 100%, for some very strange reason, 
     some browsers report devicePixelRatio as less than 1 
     and only part of the canvas is cleared then. */
    var ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext("2d").scale(ratio, ratio);
}

function makeSegmentedTabControl(inputName, options) {
    var input = $('input[name*="' + inputName + '"]');
    var idname = "div" + inputName;
    var div = $('<div class="segmentedControlBase" id="' + idname + '">');
    if (options["style"] != undefined) {
        div.attr("style", options["style"]);
    }

    options["values"].forEach(function (element) {
        var option = $('<div class="button segmentedControl"><span>' + element + '</span></div>');
        div.append(option);
        option.bind("click", function () {
            if (options["singleSelect"]) {
                $(this).siblings().removeClass('selected');
                input.val(element);
            }
            $(this).toggleClass('selected');
            if (!options["singleSelect"]) {
                /*if its multi select then we have to get all selected and add to the value.*/
                var sels = '';
                $(this).parent().children('.selected').each(function (index) {
                    return sels += $(this).text() + ',';
                });
                input.val(sels);
            }
            return true;
        });
    }, this);
    input.after(div);
    return false;
}


function parseJson(jsonString) {
    var parsedString = JSON.parse(Base64.decode(jsonString));
    AppointmentId = parsedString.appointmentId;
    formid = parsedString.formId;
    baseUrl = parsedString.baseUrl;
    source = parsedString.source;
    guestName = parsedString.guestName;
    therapistName = parsedString.therapistName;
    readonly = parsedString.readonly;
    _viewcontext = parsedString.ViewContext;
    _HtmlMacros = parsedString.HtmlMacros;
	isShineApp = parsedString.IsShineApp;
    
    strOrganization = parsedString._strOrganization;
    strCenterId = parsedString._strCenterId;
    if (parsedString.hasOwnProperty('customFieldType')) {
        _customFieldType = parsedString.customFieldType;
    }
    if (parsedString.hasOwnProperty('OwnerId')) {
        _OwnerId = parsedString.OwnerId;
    }
    if (parsedString.hasOwnProperty('VersionNo')) {
        _VersionNo = parsedString.VersionNo;
        if (_VersionNo == undefined || _VersionNo == null) {
            _VersionNo = '';
        }
    }
    if (parsedString.hasOwnProperty('IsPreviewForm')) {
        IsPreviewForm = parsedString.IsPreviewForm;
        if (IsPreviewForm == undefined || IsPreviewForm == null) {
            IsPreviewForm = 0;
        }
    }
    
    if (parsedString.hasOwnProperty('ReviewRole')) {
        _reviewRole = parsedString.ReviewRole;
        if (_reviewRole == undefined || _reviewRole == null) {
            _reviewRole = '0';
        }
    }
    if (parsedString.hasOwnProperty('IsTagForm')) {
        _IsTagForm = parsedString.IsTagForm;
        if (_IsTagForm == undefined || _IsTagForm == null) {
            _IsTagForm = false;
        }
    }
    if (parsedString.hasOwnProperty('TagId')) {
        tagId = parsedString.TagId;
        if (tagId == undefined || tagId == null) {
            tagId = '';
        }
    }  
    if (parsedString.hasOwnProperty('IsMembershipForm')) {
        IsMembershipForm = parsedString.IsMembershipForm;
        if (IsMembershipForm == undefined || IsMembershipForm == null) {
            IsMembershipForm = false;
        }
    }
    if (parsedString.hasOwnProperty('IsLoyaltyForm')) {
        IsLoyaltyForm = parsedString.IsLoyaltyForm;
        if (IsLoyaltyForm == undefined || IsLoyaltyForm == null) {
            IsLoyaltyForm = false;
        }
    }
    if (parsedString.hasOwnProperty('UserMembershipId')) {
        UserMembershipId = parsedString.UserMembershipId;
        if (UserMembershipId == undefined || UserMembershipId == null) {
            UserMembershipId = '';
        }
    }
    if (parsedString.hasOwnProperty('InvoiceItemId')) {
        InvoiceItemId = parsedString.InvoiceItemId;
        if (InvoiceItemId == undefined || InvoiceItemId == null) {
            InvoiceItemId = '';
        }
    }

    // Entity Form Values
    if (parsedString.hasOwnProperty('IsEntityForm')) {
        IsEntityForm = parsedString.IsEntityForm;
        if (!IsEntityForm) {
            IsEntityForm = false;
        }
    }
    if (parsedString.hasOwnProperty("ServiceEntityPk")) {
        ServiceEntityPk = parsedString.ServiceEntityPk;
        if (!ServiceEntityPk) {
            ServiceEntityPk = '';
        }
    }

    if (parsedString.hasOwnProperty('useCatalogApi')) {
        useCatalogApi = parsedString.useCatalogApi;
        if (useCatalogApi == undefined || useCatalogApi == null) {
            useCatalogApi = false;
        }
        if (useCatalogApi == true) {
            _viewcontext = '2';
        }
    }
     if (parsedString.hasOwnProperty('appointmentGroupId')) {
        strApptGroupId = parsedString.appointmentGroupId;
        if (strApptGroupId == undefined || strApptGroupId == null) {
            strApptGroupId = '';
        }
    }
        if (parsedString.hasOwnProperty('empId')) {
        empId = parsedString.empId;
        if (empId == undefined || empId == null) {
            empId = '';
        }
    }
	
	if (parsedString.hasOwnProperty('isNewForm')) {
        isNewFormjs = parsedString.isNewForm;
        if (!isNewFormjs)
        { 
            isNewFormjs = false; 
        }
    }
    
    if (source == "web") {
        htmlAuthoriazation = { "X-AuthorizationToken": parsedString.token };
    }
	else (isShineApp == true)
	{
		htmlAuthoriazation = { 'Authorization': "Bearer " + parsedString.token, 'AN' : parsedString.AccountName, 'OID': parsedString.OrgId, 'app-key': parsedString.ShineAppKey};
	}
    else {
        htmlAuthoriazation = { 'Authorization': "Bearer " + parsedString.token };
    }
}

function ChangeGuestMode(mode, viewmode) {
   /* if (mode == 1 && source == "web") {
        /*$('#btnHtmlFormSave').show();
        $('#btnHtmlFormSubmit').hide();
    }
    else {
        /*$('#btnHtmlFormSave').show();
        $('#btnHtmlFormSubmit').show();
    }*/
    if (_reviewRole + '' == '1') {
        $('.ReviewNeeded').show();
    }
    else {
        $('.ReviewNeeded').hide();
    }
    ActiveViewContext = 0;
    if (viewmode + '' == '2') {
        ActiveViewContext = 2;
        aHideTabs.forEach(function (value) {
            $("#form-t-" + value).hide();
        });
        if (mode == 1) {
            $('#btnSaveCD').hide();
        }
        NameValuePair.forEach(function (obj) {
            var a;
            
            a = document.getElementsByName(obj.name)[0].attributes;
            if (a["viewtype"] != undefined && a["viewtype"] != null && $.trim(a["viewtype"].value).toLowerCase() == 'viewfields') {
                document.getElementsByName(obj.name)[0].readOnly = true;
            }

            if (a["viewtype"] != undefined && a["viewtype"] != null && $.trim(a["viewtype"].value).toLowerCase() == 'hidefields') {
                document.getElementsByName(obj.name)[0].style.display = 'none';
            }
            $('#loadingimg').hide();

        });

        $(".hidefields > div").each(function () { $(this).css("display", "none"); });
        $(".viewfields").each(function () { $(this).css({"pointer-events": "none", "opacity": "1", "background-color": "#eee"}); });
    }
    else if (viewmode + '' == '1') { 
        ActiveViewContext = 0;
        aHideTabs.forEach(function (value) {
            $("#form-t-" + value).show();
        });

        if (mode == 1) {
            $('#btnSaveCD').hide();
        }
        NameValuePair.forEach(function (obj) {
            var a;
            
            a = document.getElementsByName(obj.name)[0].attributes;
            if (a["viewtype"] != undefined && a["viewtype"] != null && $.trim(a["viewtype"].value).toLowerCase() == 'viewfields') {
                document.getElementsByName(obj.name)[0].readOnly = false;
            }

            if (a["viewtype"] != undefined && a["viewtype"] != null && $.trim(a["viewtype"].value).toLowerCase() == 'hidefields') {
                document.getElementsByName(obj.name)[0].style.display = 'block';
            }
            $('#loadingimg').hide();

        });

        $(".hidefields > div").each(function () { $(this).css("display", "block"); });
        $(".viewfields").each(function () { $(this).css({"pointer-events": "inherit", "opacity": "inherit", "background-color": "inherit"}); });
    }
    if (source == "web") {
        $('#ifrCustomDataRander', window.parent.document).height($("body")[0].scrollHeight + 100);
    }
}

function EnableOrDisableForm(value) {/*1 Disabled,0 Enabled */
    if (value == 1) {
        /*$('input, select').attr('readonly',true); */
        NameValuePair.forEach(function (obj) {

            $('input[name=' + obj.name + ']').attr("disabled", "disabled");
            $('select[name=' + obj.name + ']').attr("disabled", "disabled");
        });
        $('.button.segmentedControl').on('click', function () {
            $(this).removeClass("selected");
        });
    }
    else {
        NameValuePair.forEach(function (obj) {

            $('input[name=' + obj.name + ']').removeAttr("disabled", "disabled");
            $('select[name=' + obj.name + ']').removeAttr("disabled", "disabled");
        });

        $('.button.segmentedControl').on('click', function () {
            $(this).addClass("selected");
        });
    }
}
/* Handle Text Area Auto Resize. */
function textAreaAdjust(o) {
    o.style.height = "1px";
    o.style.height = (25+o.scrollHeight)+"px";
}

function getformatedDate(date, format) {
    try {
        if (format && date) {
            date = date.split(' ')[0];
            format = format.split(' ')[0];
            if (format.includes('/')) {
                formatarray = format.split('/');
            }
            else if (format.includes('-')) {
                formatarray = format.split('-');
            }
            else {
                return date;
            }
            var dayindex, monthindex, yearindex, returndate;
            for (i = 0; i < 3; i++) {
                if (formatarray[i].includes('d')) {
                    dayindex = i;
                }
                else if (formatarray[i].includes('m')) {
                    monthindex = i;
                }
                else if (formatarray[i].includes('y')) {
                    yearindex = i;
                }
            }
            if (format.includes('/')) {
                returndate = (date.split('/')[yearindex] + '-' + date.split('/')[monthindex] + '-' + date.split('/')[dayindex]);
            }
            else if (format.includes('-')) {
                returndate = (date.split('-')[yearindex] + '-' + date.split('-')[monthindex] + '-' + date.split('-')[dayindex]);
            }
            else {
                returndate = date;
            }
            return returndate;
        }
        return date;
    }
    catch (e) {
        return date;
    }
}
function appendDataToForm(data) {
    initialiseValues(0);
    var mode = 0;
    if (IsMembershipForm && source=="web") {
        if (data.Data == null && data.GuestData == null) {
            readonly = false;
            
        }
        else {
            readonly = true;
            $("#btnHtmlFormSave").hide();
            $("#btnHtmlFormSaveAndGoToNext").hide();
        }
    }
    if (IsLoyaltyForm || Is_ClassForm)
    {
        if(data.IsFormSubmitted==1)
        {
            readonly = true;
           $("#btnHtmlFormSave").hide(); 
           $("#btnHtmlFormSaveForReview").hide(); 
        }
        if (Is_ClassForm) {
            if (data.fromWebstorev2 && data.IsReadOnly) {
                readonly = true;
                $("#btnHtmlFormSave").hide();
                $("#btnHtmlFormSaveForReview").hide();
            }
        }
    }
    if (readonly == true) {
        EnableOrDisableForm(1);
    }
    /*$('input[name="guestName"]').val(guestName);*/
    /*$('input[name="therapistName"]').val(therapistName);*/

    if (data.IsPreviousData == true) {
        $("#form").append('<br clear="both"><div id="banner" style="position: absolute;top: 0; right: 0; background-color: #8cadbf;; width: auto; box-shadow: 0 1px 3px rgba(0,0,0,0.5);border-radius:6px;"><div id="banner-content" style ="text-align: center;margin: 0 auto;padding: 10px;color: #ffffff;" >This form is loaded with data from previous visit</div></div>');
        
    }
    if (data.Data != null || data.GuestData != null) {
        if (isNewFormjs == true && data.PrefillOldVersionData == true) {
            $("#form").append('<br clear="both"><div id="banner" style="position: absolute;top: 0; right: 0; background-color: #8cadbf;; width: auto; box-shadow: 0 1px 3px rgba(0,0,0,0.5);border-radius:6px;"><div id="banner-content" style ="text-align: center;margin: 0 auto;padding: 10px;color: #ffffff;font-size: medium;" >We have pre-filled this form with the data from the last submission. Please make sure to go-through the entire form before saving or submitting it.</div></div>');          
        }
        toastType.Data.Message = "Loaded Successfully";
        var Obj = ((!IsLoyaltyForm) && (!Is_ClassForm)) ? JSON.parse(data.Data) : data.Data;
        var jsonObj = Obj;
        if (data.GuestData != null && data.GuestData != undefined) {
            var GuestjsonObj = ((!IsLoyaltyForm) && (!Is_ClassForm)) ? JSON.parse(data.GuestData) : data.GuestData ;
            $.each(GuestjsonObj, function (index, val) {
                if ((!IsLoyaltyForm) && (!Is_ClassForm))
                    { 
                        jsonObj.push(val);
                    } 
                    else
                        { 
                            jsonObj.push(val.value);
                        }
            });
        }

        for (i = 0; i <= jsonObj.length - 1; i++) {
            try {

                var type = jsonObj[i].type;
                if (!['dropdown', 'radio', 'checkbox', 'image', 'textarea'].includes(type)) {    // eliminating irregular types
                    type = '';
                }

                var obj = _HtmlMacros;
                var _value;
                
                var signtureIdCheck = '-signature';
           
                
                if (obj != undefined && obj != '' && jsonObj[i].value != undefined && jsonObj[i].value != null && jsonObj[i].name.indexOf(signtureIdCheck) == -1 && !(jsonObj[i].name.startsWith("annotationPad_"))) {
                    var Macrokeys = [];
                    
                    
                        for (var k in _HtmlMacros) 
                        {
                            if ((!IsLoyaltyForm) && (!Is_ClassForm))
                            {
                            Macrokeys.push(k);
                            }
                            else
                            {
                            Macrokeys.push(_HtmlMacros[k].name);    
                            }
                        }

                    if (_HtmlMacros != null && _HtmlMacros != undefined && _HtmlMacros != "") {
                        $.each(Macrokeys, function (key, value) {
                            var replacereg = new RegExp('\\[' + value + '\\]', "g");
                            var replacevalue = (!IsLoyaltyForm) ? obj[value] : obj.find(x=>x.name==value).value;
                            if (replacevalue + '' == 'null' || replacevalue == null || replacevalue == undefined) {
                                replacevalue = '';
                            }
                            _value = jsonObj[i].value.replace(replacereg, replacevalue);
                        });

                    }
             
                }
                else {
                    _value = jsonObj[i].value;
                }
                if (!type || type === 'textarea') {
                    $('textarea[name=' + jsonObj[i].name + ']').val(unescape(escape(_value)));
                }

                if (jsonObj[i].value != "") {
                    if ($('#' + jsonObj[i].name + ' div span:contains(\'' + jsonObj[i].value + '\')') && $('#' + jsonObj[i].name + ' div span:contains(\'' + jsonObj[i].value + '\')').parent()) {
                        $('#' + jsonObj[i].name + ' div span:contains(\'' + jsonObj[i].value + '\')').parent().addClass('selected');
                    }
                }

                if ((IsLoyaltyForm || Is_ClassForm) || ((isNewFormjs == false || data.PrefillOldVersionData == false) && data.IsPreviousData == false)) {
                    if (jsonObj[i].name.indexOf(signtureIdCheck) !== -1) {
                        var wrapper = document.getElementById(jsonObj[i].name);
                        if (wrapper != undefined && wrapper != null) {
                            var canvasElement = wrapper.querySelector("canvas");
                            if (canvasElement != undefined && canvasElement != null) {
                                if((IsLoyaltyForm || Is_ClassForm) || (typeof(_value) == 'string'))
                                {
                                _value=JSON.parse(_value);
                                }
                                var sigPad = new SignaturePad(canvasElement);
                                sigPad.fromData(_value);
                                sigPad._data = _value
                                sigPad.on();
                                var sigIndex = sigPads.findIndex(function (e) { return e.name.toLowerCase() == jsonObj[i].name.toLowerCase(); });
                                sigPads[sigIndex].pad = sigPad;
                            }
                            else {
                                var param = new Object();
                                param.name = jsonObj[i].name;
                                param.value = _value;
                                createSignatures.push(param);
                            }
                        }
                    
                    }
                }
                if (jsonObj[i].name.startsWith("annotationPad_")) {
                     
                     if((IsLoyaltyForm || Is_ClassForm) || typeof(jsonObj[i].value) == 'string')
                     {
                      jsonObj[i].value=JSON.parse(jsonObj[i].value);
                     }

                    var fill = jsonObj[i].value;
                
                    var sel = '#' + jsonObj[i].name.substr(14);
                    if (jsonObj[i].value != "on") {
                        var newindex = jsonObj.findIndex(function (e) { return e.name.toLowerCase() == (jsonObj[i].name.substr(14) + '_annotaionImage').toLowerCase(); });
                        if (newindex != -1) {
                            if (newindex * 1 <= jsonObj.length && jsonObj[newindex].value != undefined && jsonObj[newindex].value != null && jsonObj[newindex].value != '') {
                                var presignedUrl = PreSignedAccessURL(jsonObj[newindex].value);
                                $Annotation(sel).annotate("push", presignedUrl, function (event, fill) {  $Annotation(event.$el.selector).annotate("fill", fill); }, fill);
                           
                                var obj = new Object();
                                obj.name = jsonObj[i].name.substr(14) + '_annotaionImage';
                                obj.value = jsonObj[newindex].value;
                                AnnotationImages.push(obj);
                            }else{
                                // setTimeout(function () { $Annotation(sel).annotate("fill", fill); }, 5000);
                                $Annotation(sel).annotate("fill", fill);
                            }
                        }
                        else {
                            $Annotation(sel).annotate("fill", fill);
                        }
                    
                    }
                    var obj = new Object();
                    obj.name = jsonObj[i].name.substr(14);
                    obj.value = fill;
                    oldAnnotation.push(obj);
                
                }
                 /* Loading Input,TextArea, Select, Checkbox Data. */
                if (!type || type === 'dropdown') {
                    $('select[name=' + jsonObj[i].name + ']').val(_value);
                }
                /* Handling for Radio-Group. */
                if(type === 'radio' || (!type && $($('input[name=' + jsonObj[i].name + ']')).attr('type') === 'radio')){
                    $($('input[name=' + jsonObj[i].name + ']')).each(function(){
                        if($(this).attr('value') === _value){
                            $(this).attr('checked','checked');
                        }
                    });
                } else if(type === 'checkbox' || (!type && $($('input[name=' + jsonObj[i].name + ']')).attr('type') === 'checkbox')){
                    $($('input[name=' + jsonObj[i].name + ']')).each(function(){
                        if($(this).attr('value') === _value){
                            $(this).attr('checked','checked');
                        }
                    });
                }else {
                    $('input[name=' + jsonObj[i].name + ']').val(_value);
                }
                if ((type === 'image' || (!type && $($('input[name=' + jsonObj[i].name + ']')).attr('type') === 'img'))) {
                    $($('#' + jsonObj[i].name)).each(function () {
                    
                        var OriginalFileName = '';
                        if (_value != "" && _value != undefined) {
                            var filepath = _value.split('/');
                            if (filepath != '' && filepath != undefined) {
                                if (filepath.length > 0) {
                                    var fullname = filepath[filepath.length - 1];
                                    if (fullname != '' && fullname != undefined) {
                                        OriginalFileName = fullname.substr(0, fullname.lastIndexOf("_")) + '.' + fullname.split('.')[1];
                                    }
                                }
                            }
                    
                            var presignedUrl = PreSignedAccessURL(_value);
                            var checkImage = (_value.substr(_value.lastIndexOf('.') + 1)).toLowerCase();
                            if (checkImage === 'jpeg' || checkImage === 'jpg' || checkImage === 'png' || checkImage === 'gif') {
                                if($(this).next().is('input')) {
                                    $(this).next().next().attr('src', presignedUrl);
                                    $(this).next().next().show();
                                } else {
                                    $(this).next().attr('src', presignedUrl);
                                    $(this).next().show();
                                }
                    
                            }
                            var obj = new Object();
                            obj.name = OriginalFileName;
                            obj.extension = checkImage;
                            obj.url = _value;
                            obj.type = "upload";
                            obj.value = [];
                            ImageJson.push(obj);
                            if (OriginalFileName != '' && OriginalFileName != undefined) {
                                $('#a-' + jsonObj[i].name).text(OriginalFileName);
                                $('#a-' + jsonObj[i].name).show();
                                $('#del-' + jsonObj[i].name).show();
                                $('#a-' + jsonObj[i].name).attr("href", presignedUrl);
                                $('#a-' + jsonObj[i].name).attr("Target", '_blank');
                            }
                        }
                    });
                    if (source == "web") {
                        $('#ifrCustomDataRander', window.parent.document).height($("body")[0].scrollHeight + 100);
                    }
                }
                if (!type || type === 'dropdown') {
                    $('select[name=' + jsonObj[i].name + ']').val(_value);
                }
           
                if (jsonObj[i].value.indexOf(',') != -1) {
                    var stringArray = jsonObj[i].value.split(',');
                    var segId = jsonObj[i].name;
                    $('#' + segId).parent().find('span').each(function () {
                        for (j = 0; j < stringArray.length - 1; j++) {
                            if ($(this).text() == stringArray[j]) {
                                $(this).parent().addClass('selected');
                            }
                        }
                    })
                }
            }
            catch (e) {
                try { logFormError("AppendDataToForm Failed:" + e.toString()); } catch (ex) { };
                console.log(e);
            }
        }

        
        mode = (data.IsFormSubmitted) ? 1 : 0;

    }
    ChangeGuestMode(mode, _viewcontext);
}
/*
obj- file
selector -Id of the input tag
*/
function InitialiseImageUpload(obj, selector) {
    var uploadSource = selector;

    if (selector == 'android')
        selector = globalFileClickedId;
    else
        globalFileClickedId = selector;

    //readURL(obj);
    if ((source != 'android') || (uploadSource == 'android' && source == 'android')) {
       

        InitiateUpload(obj, function (url, ResourceURL) {


            var OriginalFileName = '';
            if (ResourceURL != "" && ResourceURL != undefined) {
                var filepath = ResourceURL.split('/');
                if (filepath != '' && filepath != undefined) {
                    if (filepath.length > 0) {
                        var fullname = filepath[filepath.length - 1];
                        if (fullname != '' && fullname != undefined) {
                            OriginalFileName = fullname.substr(0, fullname.lastIndexOf("_")) + '.' + fullname.split('.')[1];
                        }
                    }
                }

            }
            $('#' + selector).val(ResourceURL);
            var checkImage = (ResourceURL.substr(ResourceURL.lastIndexOf('.') + 1)).toLowerCase();
            if (checkImage === 'jpeg' || checkImage === 'jpg' || checkImage === 'png' || checkImage === 'gif') {
                if ($('#' + selector).next().is('input')) {
                    $('#' + selector).next().next().attr('src', url);
                    $('#' + selector).next().next().show();
                } else {
                    $('#' + selector).next().attr('src', url);
                    $('#' + selector).next().show();
                }

            }

            var obj = new Object();
            obj.name = OriginalFileName;
            obj.extension = checkImage;
            obj.url = ResourceURL;
            obj.type = "upload";
            obj.value = [];
            ImageJson.push(obj);
            if (OriginalFileName != '' && OriginalFileName != undefined) {
                $('#a-' + selector).text(OriginalFileName);
                $('#a-' + selector).show();
                $('#del-' + selector).show();
                $('#a-' + selector).attr("href", url);
                $('#a-' + selector).attr("Target", '_blank');
            }
        });

        // Resetting the value so that the same file can be uploaded continuously. 
        // This is relevant when we try to upload a large file exceeding org limit continuously. Without this, the file size exceeded alert is only shown the first time.
        obj.value = "";
    }
}
function getQuerystring(key, default_) {
    var res="";
    if (default_ == null) default_ = "";
    key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + key + "=([^&#]*)","gi");
    var qs = regex.exec(window.location.href);
    if (qs == null)
        return default_;
    else{
        try
            {
                return decodeURIComponent(unescape(qs[1]));
            }
        catch(err)
            {
                return qs[1];
            }
        }
}
function setData(jsonString, mode, isClassForm) {
    if (typeof(readyst1) == 'function') {
        readyst1();
    }
    var GuestIdForKiosk = "";
    try{
        var fromKiosk = getQuerystring("fromKiosk");
        var fromWebstorev2 = getQuerystring("fromWebstoreV2")

        if (fromKiosk == "true" || fromWebstorev2 == "true") {
            GuestIdForKiosk = getQuerystring("HandlerId");
        }
        if (typeof Is_ClassForm !== 'undefined') {}
        else {
            Is_ClassForm = typeof isClassForm !== 'undefined' ? true:false;
        }

    }
    catch(ex){

    }
    
    recordsjson = jsonString;
    parseJson(jsonString);
    initialiseValues(0);
    /*Get all the parameters from 'jsonString' and load the HTML with values
      i.e. call '/api/Appointments/{AppointmentId}/HtmlCustomData' API*/


    var iVewContext = _viewcontext;

    var url;
    var data = "";

    if (IsMembershipForm == true) {
        iVewContext = 0;
        data = { "ViewContext": iVewContext, "VersionNo": _VersionNo, "UserMembershipId": UserMembershipId };
    } 
    else if (IsLoyaltyForm == true) {
            data = {};
    }
    else if (Is_ClassForm == true) {
        data = {};
    }
        else if (IsEntityForm == true) {
        iViewContext = 0;
        data = { "GuestId": appHandlerId, "ViewContext": iViewContext };
        // appHandlerId defined in ServiceHtmlFom.aspx is stored in appointmentId (parsestring). Need to check if using this is fine, or if we need to use appointmentid instead
    }
    else
        data = { "ViewContext": iVewContext, "VersionNo": _VersionNo, "GuestIdForKiosk":GuestIdForKiosk };
    if (_customFieldType != 2) {
        
        if (IsMembershipForm == true) {
            url = baseUrl + '/api/Appointments/HtmlCustomData/' + InvoiceItemId + '/' + formid;
        }
        else if (IsLoyaltyForm == true) {
            url = baseUrl + '/v1/guests/'+ AppointmentId + '/loyalty_forms' ;
        }
        else if (IsEntityForm == true) {
            url = baseUrl + '/v1/entities/' + ServiceEntityPk + '/form_data';
            // GuestId sent as parameter. GuestId stored in appHandlerId
        }
        else if (Is_ClassForm == true) {
            url = baseUrl + '/v1/classes/appointments/' + AppointmentId + '/custom_forms/html_data?is_new_form=false&tag_id=' + tagId
        }
        else {
            if (useCatalogApi == true) {
                url = baseUrl + '/api/Catalog/Appointments/' + AppointmentId;
            }
            else {
                url = baseUrl + '/api/Appointments/' + AppointmentId;
            }
            if (_IsTagForm == true) {
                url = url + '/HtmlTagCustomData/' + tagId
            }
            else {
                url = url + '/HtmlCustomData'
            }
            if (isNewFormjs == true) {
                url = url + '?isNewForm=true';
            }
        }
    }
    else {
        if (useCatalogApi == true) {
            url = baseUrl + 'api/Catalog/Guests/GuestHtmlCustomData';
        }
        else {
            url = baseUrl + '/api/Appointments/' + _OwnerId + '/GuestHtmlCustomData'; // OwnerId is guest id. 
        }

    } 
   $.ajax({
        url: url,
        method: 'GET',
        headers: htmlAuthoriazation,
        data: data,
        async: false
    }).done(function (data) {
        
        FormSubmitted = data.IsFormSubmitted ? 1 : 0;

        if (IsLoyaltyForm)
        {
            var tempdata={};
            tempdata.Data = data.data;
            tempdata.GuestData = data.guest_data;
            tempdata.ImageJson =  data.image_json;
            tempdata.IsFormSubmitted = (data.form_filled_status == 2) ? 1 : 0;
            FormSubmitted = tempdata.IsFormSubmitted;
            data = tempdata;
        }
        else if (Is_ClassForm)
        {
            var tempdata = {};
            if (data.html_data != null) {
                tempdata.Data = data.html_data.form_data;
                tempdata.GuestData = data.html_data.guest_data;
                tempdata.ImageJson = data.html_data.img_data;
                tempdata.IsFormSubmitted = data.html_data.is_form_submitted;
                tempdata.IsReadOnly = data.html_data.is_readonly;
                tempdata.fromWebstorev2 = fromWebstorev2;
            }
            data = tempdata;
        }

        toastType.Type = "DataLoad";
        /* check if form has been opened in edit or readonly mode */
        if (isNewFormjs == true && data.PrefillOldVersionData == false)
        {
            data = { "Data": null, "GuestData": null, "IsFormSubmitted": false, "IsPreviousData": false, "Error": null }
        }
        appendDataToForm(data);
        resizeSignatures();
        AfterLoadCallback();
        toastType.Data.Message = "Loaded Successfully";
        toastType.Error = null;
        nativeAppCallback(toastType);
    }).fail(function (xhr, status, error) {
        try { logFormError("FormDataLoad Failed:" + xhr.responseText); } catch (ex) { };
        alert(error);
        toastType.Type = "DataLoad";
        var obj = new Object();
            obj.StatusCode = status;
            obj.Message = "Data is not loaded";
        toastType.Error = obj;
        toastType.Data = null;
        /* toastType.Type="DataLoad";
         toastType.Data = null;
         var err = JSON.parse(xhr.responseText);
         toastType.Error.StatusCode = status;
         toastType.Error.Message = err.message; */
        nativeAppCallback(toastType);
    });
}
function AfterLoadCallback() {

}
/* Once values in form fields are loaded, send a call back to app witha status (using nativeAppCallback) */
function nativeAppCallback(toast) {
    /*
      Types = [DataLoad, Save, Modified, Image Upload, File Upload]
       Data = message or andy other data.
       Error = send http errors, api errors, validation errors
     */
    if (source == "android") {
        Android.postMessage(JSON.stringify(toast));
    } else if (source == "ios") {
        webkit.messageHandlers.callbackHandler.postMessage(toast);
    } else {
        HtmlFormCallBack(toast); /* Sagar to work on this function */
    }
}
function alertMessage(msg,title) {
    /* Replace the alert below with jAlert once jQuery issue is fixed */
    alert(msg);
}
function HtmlFormCallBack(data) {
    if (data.Type == "Save" || data.Type == "Submit") {
		var fromKiosk =  getQuerystring("fromKiosk");
        var fromWebstorev2 = getQuerystring("fromWebstoreV2");
		var jsonString = JSON.stringify({formSaved : true})
		if((useCatalogApi || fromKiosk=="true") && (source == "web")){
			window.parent.postMessage(jsonString,window.origin);
		}
        try{
            if(window.parent && window.parent.showSpinner){
            window.parent.showSpinner(1);
        }
        }catch(ex){

        }
        if (source == "web" && !useCatalogApi && viewContext != "2") {
            try {
                parent.submit_success = true;

                if (!disable_alerts) {
                    if (data.Error) {
                        var action;
                        if (data.Type=='Save') {
                            action='save';
                        }
                        else {
                            action='submission';
                        }
                        alert('Form '+ action +' failed');
                    }
                    else if(fromWebstorev2 == "true" && data.Type == "Submit") {
                        alertMessage("Form submitted successfully.","Form submitted");
                    }
                    else {
                        if (data.Type=='Save') {
                            alertMessage("Changes saved as a draft. Please ensure you SUBMIT the form after all your changes.","Form saved as draft");
                        }
                        else {
                            if(IsLoyaltyForm && parent && parent.opener)
                            {
                                parent.opener.onLoyaltyFormSubmission();
                            }  
                            alertMessage("Form submitted successfully.","Form submitted");
                        }
                    }
                }
                if (!from_report && !IsSubmitAndGoToNext && data.Type!='Save' && !data.Error)
                    parent.window.close();
            }
            catch (ex) {

            }
        }
        else {
            if(!data.Error)
            {
                if(fromWebstorev2 == "true" && data.Type == "Submit"){
                    alertMessage("Form submitted successfully.","Form submitted");
                }
                else {
                    if (data.Type=='Save') {
                        alertMessage("Changes saved as a draft. Please ensure you SUBMIT the form after all your changes.","Form saved as draft");
                    }
                    else {
                        alertMessage("Form submitted successfully.","Form submitted");
                    }
                }
            }
            if (parent && top && parent != top) {
                window.top.postMessage(JSON.stringify({ formSaved: true }))
            }
            if (source == "web") {
                parent.submit_success = true;

                if (fromKiosk != "true" && fromWebstorev2!= "true") {
                    if (!IsSubmitAndGoToNext && data.Type!='Save' && !data.Error)
                        parent.window.close();   
                }
            }
        }
    }
    else {
        if (data.Type == "Modified") {

        }

        if (data.Error) {
            if (parent && top && parent != top) {
                window.top.postMessage(JSON.stringify({ formSaved: false }))
            }
        }
    }
}
function onSaveClicked(val, goToNext, fromWebStore, isClassForm) {
    var formsData =
    {

        formid : formid,
        AppointmentId : AppointmentId
    }
    if(window.trackApplicationEvent)
    {
        if(val == 1)
        {
            trackApplicationEvent('form-submitted',formsData)
        }
        else
        {
            trackApplicationEvent('form-saved',formsData)
        }
    }

    initialiseValues(1);

    SaveFormData(NameValuePair, val, goToNext, fromWebStore, isClassForm);
}

function InitiateUpload(_fileupload, cb,hideAlert) {
    parseJson(recordsjson);
    if (_fileupload.files && _fileupload.files[0]) {
        var reader = new FileReader();
        var centerid = strCenterId;
        var orgid = strOrganization;
        var timestamp = new Date();
        var FileName = _fileupload.files[0].name;
        var escapeFileName = FileName.replace(/[^A-Z0-9]+/ig, "_");
        var newFileName =  escapeFileName.substr(0, escapeFileName.lastIndexOf("_")) +'_' +timestamp.getDate().toString() + (timestamp.getMonth() + 1).toString() + timestamp.getFullYear().toString() + timestamp.getTime().toString() + '.' + escapeFileName.split('_').pop().trim();
        var PreSignedURLRequest = new Object();
        PreSignedURLRequest.OrgId = orgid;
        PreSignedURLRequest.CenterId = centerid;
        PreSignedURLRequest.Group = 'CustomForms';
        PreSignedURLRequest.FileName = newFileName;
        PreSignedURLRequest.FileSize = _fileupload.files[0].size ? _fileupload.files[0].size : 0;
        $.ajax({
            type: "POST",
            url: baseUrl + '/api/Assets/PreSignedURL',
            headers: htmlAuthoriazation,
            data: JSON.stringify(PreSignedURLRequest),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async:false,
            success: function (msg) {
                if ($.trim(msg.ResourceURL) != '' && $.trim(msg.PreSignedURL) != '' && $.trim(msg.PreSignedAccessURL) != '') {
                    var s3_accessURl = msg.ResourceURL;
                    uploadfile(_fileupload, msg.PreSignedURL, msg.ResourceURL, msg.PreSignedAccessURL, hideAlert);
                    cb(msg.PreSignedAccessURL, s3_accessURl);
                }

                if (msg && msg.Error && msg.Error.StatusCode == 7021) {
                    alert(msg.Error.Message);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                try { logFormError("InitiateUpload Failed:" + XMLHttpRequest.responseText) } catch (ex) { };
                if (hideAlert != 1) {
                    alert(XMLHttpRequest.responseText)
                   // alert("upload failed, Please try again");
                }
            }
        });
    }
}
function PreSignedAccessURL(ResourceUrl) {
    parseJson(recordsjson);
    var PreSignedAccessURL = "";
    if ($.trim(ResourceUrl) != '') {
        
        var PreSignedURLRequest = new Object();
        PreSignedURLRequest.ResourceURL = ResourceUrl;
        $.ajax({
            type: "POST",
            url: baseUrl + '/api/Assets/PreSignedAccessURL',
            headers: htmlAuthoriazation,
            data: JSON.stringify(PreSignedURLRequest),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (msg) {
                if ($.trim(msg.PreSignedAccessURL) != '') {
                    PreSignedAccessURL = msg.PreSignedAccessURL;
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                try { logFormError("PreSignedAccessURL Failed:" + XMLHttpRequest.responseText) } catch (ex) { }
                alert("failed, Please try again");
            }
        });
    }
    return PreSignedAccessURL;
}
function uploadfile(_fileupload, PreSignedURL, ResourceURL, PreSignedAccessURL, hideAlert) {
    var myFormData = new FormData();
    var file = _fileupload.files[0];
    myFormData.append('file', _fileupload.files[0]);
    doUploadFile(file, PreSignedURL, hideAlert);
    
}

function doUploadFile(file, PreSignedURL, hideAlert)
{
    if (file.dataURI)
    {
        file = dataURItoBlob(file.dataURI)
    }
    $.ajax({
        type: "PUT",
        processData: false,
        url: PreSignedURL,
        data: file,
        async: false,
        contentType: file.type,
        success: function (msg) {
            if (hideAlert != 1) {
                alert('uploaded successfully');
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
           try{ logFormError("doUploadFile Failed:" + XMLHttpRequest.responseText); } catch (ex) { };
            if (hideAlert != 1) {
                alert("upload failed, Please try again");
            }
        }
    });
}

   /* Validate Input Field. */
var errorMessage = function (e, reqAttr) {
    if(e.target.value === 'null'){
        e.target.value = '';
    }

    if ( $.trim(e.target.value).length !== 0) {
        $(e.target).css('border', '1px solid #ccc');
        if( $(e.target).attr('label') !== undefined) {
            $('#errorMessage_' + $(e.target).attr('label').replace(/\s+/g, '')).remove();
        } else {
            $('#errorMessage_' + $(e.target).attr('name').replace(/\s+/g, '')).remove();
        }
    } else if (typeof reqAttr !== typeof undefined && reqAttr !== false) {
        labelCheck = $(e.target).attr('label');
        if(typeof labelCheck === typeof undefined) {
            var errField = '<b>This Field</b> cannot be empty.';
            var html = '<span id=errorMessage_' + $(e.target).attr('name').replace(/\s+/g, '') + ' style="color:#EF5350 "> <i class="fa fa-exclamation" aria-hidden="true"></i> ' + errField + '</span>';
            if($("#errorMessage_" + $(e.target).attr('name').replace(/\s+/g, '')).length == 0) {
                $(e.target).parent().append(html);
            }
        }
        else {
            if ($('#errorMessage_' + $(e.target).attr('label').replace(/\s+/g, '')).length === 0) {
                $(e.target).css('border', '1px solid red');
                var errField = '<b>' + $(e.target).attr('label') + '</b> cannot be empty.';
                var html = '<span id=errorMessage_' + labelCheck.replace(/\s+/g, '') + ' style="color:#EF5350 "> <i class="fa fa-exclamation" aria-hidden="true"></i> ' + errField + '</span>';
                if($("#errorMessage_" + labelCheck.replace(/\s+/g, '')).length == 0) {
                    $(e.target).parent().append(html);
                }
            }
            
        }
    }

};

function SaveFormData(unindexed_array, val, goToNext, fromWebStore, isClassForm) {
    var GuestId = "";
    var fromKiosk;
    var fromWebstorev2;
    var strFormAction = (val == 1) ? "Submit" : "Save";
    try{
        fromKiosk =  getQuerystring("fromKiosk");
        fromWebstorev2 = getQuerystring("fromWebstoreV2")
        if (fromKiosk == "true" || fromWebstorev2 == "true") {
            GuestId = _OwnerId;
        }

        var strSource = fromKiosk == "true" ? "kiosk" : (fromWebstorev2 == "true" ? "webstorev2" : source);

        if (window && window.bLogDigitalFormsData == "True") {
            logFormError("SaveFormStep: OnSaveBegin , Source: " + strSource + " , Form_id:" + formid + " , Form Action :" + strFormAction);
        }

        if (typeof Is_ClassForm !== 'undefined') { } //if defined keep the same value
        else {
            Is_ClassForm = isClassForm !== 'undefined' ? true : false;
        }
        
        if (validateCustomForm(unindexed_array, val)) {

            var length = unindexed_array.length;
            sigPads.forEach(function (value, index) {

                var obj = new Object();
                obj.name = value["name"];
                obj.value = ((!IsLoyaltyForm) && (!Is_ClassForm)) ? value["pad"].toData() : JSON.stringify(value["pad"].toData());
                obj.additionalData = obj.value == "" ? 0 : 1;

                unindexed_array.push(obj);

            });
            annotatePads.forEach(function (value, index) {
                
                var aName = "annotationPad_" + value["name"].substr(1);
                var ind = unindexed_array.findIndex(function (e) { return e.name == aName; });
                if (ind == -1) {
                    var obj = new Object();
                    obj.name = aName;
                    obj.value = ((!IsLoyaltyForm) && (!Is_ClassForm)) ? $Annotation(value["name"]).annotate("export") : JSON.stringify($Annotation(value["name"]).annotate("export"));
                    unindexed_array.push(obj);
                }
                else {
                    unindexed_array[ind].value = ((!IsLoyaltyForm) && (!Is_ClassForm)) ? $Annotation(value["name"]).annotate("export") : JSON.stringify($Annotation(value["name"]).annotate("export"));
                }
                if (value.hasDrawn || FormSubmitted == 0) {
                    var obj = new Object();
                    var canvas = document.getElementById('baseLayer_' + value["name"].substr(1));
                    var dataUrl = canvas.toDataURL();
                    obj.name = value["name"].substr(1)+'.png';
                    obj.type = "Annotation";
                    obj.url = "";
                    InitiateUpload({ files: [{ name: value["name"].substr(1) + '.png', dataURI: dataUrl, type: 'image/png' }] }, function (url, resourceUrl) {
                        obj.url = resourceUrl;
                    },1);
                
                    ImageJson.push(obj);
                }
            });
            AnnotationImages.forEach(function (value, index) {
                var obj = new Object();
                obj.name = value["name"];
                obj.value = value["value"];
                unindexed_array.push(obj);

            });
            var requiredfilled = true;
            var TherapistArray = [];
            var GuestArray = [];
            unindexed_array.forEach(function (obj) {
                var a;
                var iframe = $('#ifrCustomDataPreview');
                if (document.getElementsByName(obj.name)[0] != undefined) {
                    
                        a = document.getElementsByName(obj.name)[0].attributes;
                    if (a["viewtype"] != undefined && a["viewtype"] != null && $.trim(a["viewtype"].value).toLowerCase() == 'hidefields') {
                        GuestArray.push(obj);
                    }
                    else {
                        TherapistArray.push(obj);
                    }
                }
                else {
                    TherapistArray.push(obj);
                }

            });

            var IsFormSubmitted = ((val == 1) ? true : false);

            var isReviewed = false; 
            var strTagId = null;
            if (_IsTagForm == true) {
                strTagId = tagId;
            }
 			

            var jsonStr = ((!IsLoyaltyForm) && (!Is_ClassForm)) ? JSON.stringify(TherapistArray) : TherapistArray;
            
            var GuestjsonStr = "";

            if (IsMembershipForm && _HtmlMacros!=null)
                GuestjsonStr = JSON.stringify(_HtmlMacros);
            else
            {
                var GuestjsonStr = ((!IsLoyaltyForm) && (!Is_ClassForm)) ? JSON.stringify(GuestArray) : GuestArray;
            }


            var imagedata = ((!IsLoyaltyForm) && (!Is_ClassForm)) ? JSON.stringify(ImageJson) : ImageJson;
            var url;
            if (_customFieldType != 2) {
                if (IsMembershipForm == true) {
                    url = baseUrl + '/api/Appointments/MembershipHtmlCustomData';
                } else if (IsLoyaltyForm == true) {
                    url = baseUrl + '/v1/guests/' + AppointmentId + '/loyalty_forms'
                }else if (IsEntityForm == true) {
                    url = baseUrl + '/v1/entities/' + ServiceEntityPk + '/form_data'
                } else if (Is_ClassForm == true) {
                   
                    url = baseUrl + '/v1/classes/appointments/' + AppointmentId + '/custom_forms/html_data?is_new_form=false&tag_id=' + strTagId
                }else {
                    if (useCatalogApi == true) {
                        url = baseUrl + '/api/Catalog/Appointments/' + AppointmentId + '/HtmlCustomData';
                    }
                    else {
                        url = baseUrl + '/api/Appointments/' + AppointmentId + '/HtmlCustomData';
                    }
                }
                isReviewed = ((_reviewRole+''=='1')?true:false);
            }
            else {
                if (useCatalogApi == true) {
                    url = baseUrl + 'api/Catalog/Guests/GuestHtmlCustomData';
                }
                else {
                url = baseUrl + '/api/Appointments/' + _OwnerId + '/GuestHtmlCustomData';
                }
                
            }
            try{
                if(window.parent && window.parent.showSpinner){
                    window.parent.showSpinner(0);
                }
            }catch(ex){}
            
            var DTO = "";
            if (IsMembershipForm == true)
                DTO = { "Data": jsonStr, "FormId": formid, "IsRequiredFilled": IsRequiredFilled, "GuestData": GuestjsonStr, "IsFormSubmitted": IsFormSubmitted, "Reviewed": isReviewed, "ImageJson": imagedata, "Source": strSource, "UserMembershipId": UserMembershipId, "InvoiceItemId": InvoiceItemId };
            else if (IsLoyaltyForm == true || Is_ClassForm)
            {
                var guestarr =[];
                for (var key in GuestjsonStr) 
                {
                    if (GuestjsonStr.hasOwnProperty(key)) 
                    {
                            var obj={};
                            obj.name=key ;
                            obj.value=GuestjsonStr[key];
                            guestarr.push(obj);
                    }
                }

                DTO = { "data": jsonStr, "guest_data": guestarr, "form_filled_status": val + 1, "image_json": imagedata };
                if (Is_ClassForm) {
                    DTO = { "form_data": jsonStr, "form_id": formid, "IsRequiredFilled": IsRequiredFilled, "guest_data": guestarr, "is_form_submitted": IsFormSubmitted, "is_reviewed": isReviewed, "img_data": imagedata, "source": source, "InvoiceItemId": InvoiceItemId };
                }
				DTO=JSON.stringify(DTO);
            }
            else if (IsEntityForm == true)
                DTO = { "Data": jsonStr, "FormId": formid, "IsRequiredFilled": IsRequiredFilled, "GuestData": GuestjsonStr, "IsFormSubmitted": IsFormSubmitted, "Reviewed": isReviewed, "ImageJson": imagedata, "Source": strSource, "GuestId": appHandlerId };
            else 
                {
                DTO = { "Data": jsonStr, "FormId": formid, "IsRequiredFilled": IsRequiredFilled, "GuestData": GuestjsonStr, "IsFormSubmitted": IsFormSubmitted, "Reviewed": isReviewed, "ImageJson": imagedata, "TagId": strTagId, "Source": strSource, "GuestId": GuestId, "FromWebstore": fromWebStore, "isNewForm": isNewFormjs };
                }

            if (window && window.bLogDigitalFormsData == "True") {
                logFormError("SaveFormStep: BeforeSaveAPICall , Source: " + strSource + " , Form_id:" + formid + " , Form Action :" + strFormAction);
            }
            $.ajax({
                url: url,
                method: 'POST',
                headers: htmlAuthoriazation,
                contentType: (IsLoyaltyForm || Is_ClassForm) ? "application/json" : "application/x-www-form-urlencoded",
                data: DTO,
                async: false
            }).done(function (data) {
                isNewFormjs = false;
                if (source == "web") {
                    if (_customFieldType != 2) {
                        try { trackEvent('appt-enter-scd-v2'); } catch (e) { }
                    }
                    else {
                        try { trackEvent('appt-enter-gcd-v2'); } catch (e) { }
                    }
                }

                if (window && window.bLogDigitalFormsData == "True") {
                    logFormError("SaveFormStep: OnSaveSuccess , Source: " + strSource + " , Form_id:" + formid + " , Form Action :" + strFormAction + " , Data : " + jsonStr);
                }

                toastType.Type = IsFormSubmitted ? "Submit" : "Save";
                if(IsFormSubmitted)
                {
                    $("#btnHtmlFormSave").hide(); 
                    $("#btnHtmlFormSaveForReview").hide();
                }
                var obj = new Object();
                if (data.Success || ((IsLoyaltyForm && !data.error)||(Is_ClassForm && !data.error))) {
                    obj.Message = "Saved Successfully";
                    toastType.Data = obj;
                    toastType.Error = null;
                } else {
                    try { logFormError("SaveFormData Failed:" + xhr.responseText); } catch (ex) { };
                    toastType.Data = null;
                    obj.StatusCode = status;
                    obj.Message = "Form save failed";
                    toastType.Error = obj;
                }
                nativeAppCallback(toastType);

            

                if(!goToNext){
                    if( window.parent && window.parent.opener && window.parent.opener.location && window.parent.opener.location.toString().indexOf('Appt') > 0 && window.parent.$signalR && window.parent.$signalR.reloadAppointmentBook){
                        window.parent.$signalR.reloadAppointmentBook(window.parent.appgroupid);
                    }
                }
            }).fail(function (xhr, status, error) {
                try { logFormError("SaveFormData Failed:" + xhr.responseText); } catch (ex) { };
                toastType.Type = IsFormSubmitted ? "Submit" : "Save";
                toastType.Data = null;
                var obj = new Object();
                obj.StatusCode = status;
                obj.Message = "Form save failed";
                toastType.Error = obj;
                nativeAppCallback(toastType);
            });
            /*  docSigPad.fromData(indexed_array["patientSig"]);
            patientSigPad.fromData(indexed_array["doctorSig"]); */
        
            return false;
        }
        else {
            try { logFormError("SaveFormStep: OnValidationFailed , Source: " + strSource + " , Form_id:" + formid + " , Form Action :" + strFormAction); } catch (ex) { };

            if (source != "web") {
                var IsFormSubmitted = ((val == 1) ? true : false);

                toastType.Type = IsFormSubmitted ? "Submit" : "Save";
                toastType.Data = null;

                var obj = new Object();
                obj.StatusCode = -1;
                obj.Message = "Form Validation Failed";
                toastType.Error = obj;
                nativeAppCallback(toastType);
            }
        }

    }catch(ex){
        try { logFormError("SaveFormStep: OnException: " + (ex ? (ex.message ? ex.message : ex) : '')  + " , Source: " + source + " , Form_id:" + formid + " , Form Action :" + strFormAction); } catch (ex) { };
        toastType.Type = (val == 1) ? "Submit" : "Save";
        toastType.Data = null;
        var obj = new Object();
        obj.StatusCode = status;
        obj.Message = "Form save failed";
        toastType.Error = obj;
        nativeAppCallback(toastType);
    }
}
    function validateCustomForm(unindexed_array, MandateReqFields) {

        if (window && window.bLogDigitalFormsData == "True") {
            logFormError("SaveFormStep: OnValidationBegin , Form_id:" + formid);
        }

        var consentPresent = true;
        var requiredfields = true;
        var retval = true;
        sigPads.forEach(function (value) {
            if ((ActiveViewContext != 2) || ((ActiveViewContext == 2) && (value["webstore"] == undefined || value["webstore"] == false))) {
                if (consentPresent == true) {
                    var val = value["pad"].toData();

                    consentPresent = ((value["required"] == undefined || value["required"] == false) || ((value["required"] == true && !(value["Isdoctor"] == undefined || (_reviewRole + '' == '1' && value["Isdoctor"] == true) || (_reviewRole + '' != '1' && value["Isdoctor"] == false)))));
                    consentPresent = consentPresent == false ? (val != [] && val != '' && val != undefined) : consentPresent;
                    //consentPresent = ((value["required"] == undefined || value["required"] == false) || ((value["required"] == true && ((_reviewRole + '' != '1') || (_reviewRole + '' == '1' && (value["reviewer"] != false && value["reviewer"] != undefined))) && (val != [] && val != '' && val != undefined))));


                }
            }
        });
        if (!reqfieldsFiled && MandateReqFields * 1 == 1) {
            if (source == "web" && !useCatalogApi && viewContext != "2") {
                try {
                    if (!consentPresent) {
                        if (!(disable_alerts == true)) {
                            alert("Signatures are missing");
  
                            if (window && window.bLogDigitalFormsData == "True") {
                                logFormError("SaveFormStep: SignaturesAreMissing , Form_id:" + formid);
                            }
                        }
                            

                        parent.submit_success = false;
                        retval = false;
                    }
                    else {
                        parent.submit_success = true;
                    }
                }
                catch (ex) {

                }
            }
            else {
                if (!consentPresent) {
                    if (source == "web") {
                        parent.submit_success = false;
                    }
                    alert("Signatures are missing");

                    if (window && window.bLogDigitalFormsData == "True") {
                        logFormError("SaveFormStep: SignaturesAreMissing , Form_id:" + formid);
                    }

                    retval = false;
                }
            }
        }

        var length = unindexed_array.length;
        var indexed_array = {};
        var reqfieldsFiled = true;
        var reqArr = [];
        NameValuePair.forEach(function (obj) {
            var a = document.getElementsByName(obj.name)[0];
            var att;
            att = document.getElementsByName(obj.name)[0].attributes;
            if ((ActiveViewContext != 2) || ((ActiveViewContext == 2) && !(att["viewtype"] != undefined && att["viewtype"] != null && ($.trim(att["viewtype"].value).toLowerCase() == 'hidefields' || $.trim(att["viewtype"].value).toLowerCase() == 'viewfields')))) {
                if (a != null && a != undefined) {
                    var req;
                    var name_list = document.getElementsByName(obj.name);
                    for (let iter in name_list) {
                        if (name_list[iter].required) {
                            req = true;
                        }
                    }
                    var _val = obj.value;
                    var type = document.getElementsByName(obj.name)[0].type;

                    if ((req && $.trim(_val) == "") || (req && $.trim(_val) == "none" && type === 'radio') || (req && $.trim(_val) == "Select" && type === 'select-one')) {
                        $("[name='" + obj.name + "']").css('border', '1px solid red');
                        if ($("[name='" + obj.name + "']").attr('label') !== undefined) {
                            var errField = '<b>' + $("[name='" + obj.name + "']").attr('label') + '</b> cannot be empty.';
                            var html = '<span id=errorMessage_' + $("[name='" + obj.name + "']").attr('label').replace(/\s+/g, '') + ' style="color:#EF5350 "> <i class="fa fa-exclamation" aria-hidden="true"></i> ' + errField + '</span>';
                            if ($("#errorMessage_" + $("[name='" + obj.name + "']").attr('label').replace(/\s+/g, '')).length == 0) {
                                if (type === 'radio') {
                                    var className = 'radioGroup_' + obj.name;
                                    $('.' + className).append(html);
                                } else {
                                    $("[name='" + obj.name + "']").parent().append(html);
                                }
                            }
                            reqArr.push(obj.name);
                            reqfieldsFiled = false;
                        } else if ($("[name='" + obj.name + "']").attr('label') === undefined) {
                            var errField = '<b> This Field </b> cannot be empty.';
                            var html = '<span id=errorMessage_' + $("[name='" + obj.name + "']").attr('name').replace(/\s+/g, '') + ' style="color:#EF5350 "> <i class="fa fa-exclamation" aria-hidden="true"></i> ' + errField + '</span>';
                            if ($("#errorMessage_" + $("[name='" + obj.name + "']").attr('name').replace(/\s+/g, '')).length == 0) {
                                if (type === 'radio') {
                                    var className = 'radioGroup_' + obj.name;
                                    $('.' + className).append(html);
                                } else {
                                    $("[name='" + obj.name + "']").parent().append(html);
                                }
                            }
                            reqArr.push(obj.name);
                            reqfieldsFiled = false;
                        }

                    }
                }
            }
        });
        if (!reqfieldsFiled && MandateReqFields * 1 == 1) {
            //if(reqArr.length > 0) {
            //    $('[name="'+ reqArr[0]+'"]').focus();
            //    reqArr = [];
            //}

            if (source == "web" && !useCatalogApi && viewContext != "2") { // Reports_BulkReview
                if (!(disable_alerts == true)) {
                    alert("Please fill required fields to continue");

                    if (window && window.bLogDigitalFormsData == "True") {
                        logFormError("SaveFormStep: ReqFieldsAreMissing , Form_id:" + formid);
                    }
                }
                parent.submit_success = false;
                retval = false;
            }
            else {
                if (source == "web") {
                    parent.submit_success = false;
                }
                alert("Please fill required fields to continue");
          
                if (window && window.bLogDigitalFormsData == "True") {
                    logFormError("SaveFormStep: ReqFieldsAreMissing , Form_id:" + formid);
                }

                retval = false;
            }
        }
        IsRequiredFilled = reqfieldsFiled;
        /*    $.map(unindexed_array, function (n, i) {
            indexed_array[i].Name = n['name'];
            indexed_array[i].Value = n['value'];
            });*/
        
        if (window && window.bLogDigitalFormsData == "True") {
            logFormError("SaveFormStep: OnValidationEnd , Form_id:" + formid);
        }

        return retval;
    }
function createAnnotaions(Selector, image, width, height, color, bootstrap, position) {
    
    if (width == null || width == undefined || $.trim(width)=='') {
        width = "350";
    }
    if (height == null || height == undefined || $.trim(height) == '') {
        height = "400";
    }

    if (color == null || color == undefined || $.trim(color) == '') {
        color = "red";
    }
    if (image == null || image == undefined || $.trim(image) == '' || image.length==0) {
        image = ["https://digital-forms.firebaseapp.com/images/injectableFacialBase.jpg"];
    }
    if (bootstrap == null || bootstrap == undefined || $.trim(bootstrap) == '') {
        bootstrap = true;
    }
    if (position == null || position == undefined || $.trim(position) == '') {
        position = "right";
    }
    $Annotation('#' + Selector).annotate({
        width: width,
        height: height,
        color: color,
        images: image,
        bootstrap: bootstrap,
        position: position
    });
    annotatePads.push({ 'name': '#' + Selector,'value':'','Image':image, 'hasDrawn': false });

}


function deleteImage(divId) {
     if($('#'+divId).val().length < 1) {
        alert("There is no image to delete!");
    } else {

         ImageJson = ImageJson.filter(function (e) { return (e.url).toLowerCase() != ($('#' + divId).val()).toLowerCase(); });
        
        $('#'+divId).removeAttr('readonly');
        $("#"+divId).val('');
        $('#'+divId).attr("readonly", true);
        $("#img-"+divId).removeAttr('src');
        $("#img-"+divId).css("display","none");
        $("#a-"+divId).css("display","none");
    }
    
    return;
};

function showPhotoForAnnotation(file, canvasElement) {
    var reader = new FileReader();

    reader.onload = function (e) {
        var dataURL = e.target.result;
        $Annotation(canvasElement).annotate("push", dataURL);
    };

    reader.readAsDataURL(file);
}
function AnnatoteImage(file, selector) {
    if (file != undefined && file != null) {
        if (file.name != undefined && file.name != null) {
            var selector = file.name;
            var name = selector.replace('_camera', '');
            InitiateUpload(file, function (url,resourceUrl) {
                if (url != undefined && url != null) {
                    

                    $Annotation('#' + name).annotate("push", url);

                    var AnnIndex = AnnotationImages.findIndex(function (e) { return e.name.toLowerCase() == (name + '_annotaionImage').toLowerCase(); });

                    if (AnnIndex == -1) {
                        var obj = new Object();
                        obj.name = name + '_annotaionImage';
                        obj.value = resourceUrl;
                        AnnotationImages.push(obj);
                    }
                    else {
                        AnnotationImages[AnnIndex].value = resourceUrl;
                    }
                }
            });
        }
    }
    
}

function displayCapturedPhotoAsImage(file, imgElement) {
    var imgURL = URL.createObjectURL(file),
        img = document.querySelector(imgElement);

    img.onload = function () {
        URL.revokeObjectURL(imgURL);
    };

    img.src = imgURL;
}

function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
}
///Image annotation



//Need to turn this into a method that acts on a data decoration of a div.
