var global_pagedot_element = '';

function loadFunctions(control = true) {

    $('body').css('pointer-events', 'auto');

    var element = '';
    var PageDot = $("#PAGEDOT-CONTAINER").contents();

    //PageDot.find('body').append('<style>a {pointer-events: none;}</style>');
    
    if (!control) {
        PageDot.find('[data-pdeid]').unbind('click');
    }else{
        // Отключаем все события
        PageDot.find('*').removeAttr('onclick');
        PageDot.find('*').unbind('click');
    
    // Текст
    PageDot.find("[data-pdeid]").on('click', function(e){

        element = $(this);

        if (element[0].tagName.toLowerCase() == 'form') {
            var pdform = element;
        } else {
            var pdform = element.parents('form');
        }

        var pdFormValidate = pdform[0];

        if (pdFormValidate) {
            $('#myTabElementConfing li a').removeClass('active');
            $('#myTabElementConfing li:first-child a').addClass('active');
            $('#myTabContent2 .tab-pane.fade').removeClass('show').removeClass('active');
            $('#myTabContent2 .tab-pane.fade:first-child').addClass('show').addClass('active');
            if (pdFormValidate.tagName.toLowerCase() == 'form') {
                var form_id = pdform.attr('data-pdform');
                if (!form_id || form_id == undefined || form_id == null) {
                    form_id = microtime(true);
                    pdform.attr('data-pdform', form_id);
                    pdeid = pdform.attr('data-pdeid');
                    var PDETEMPLATE = PageDotTemplateOpen();
                    $(PDETEMPLATE).find('[data-pdeid="'+pdeid+'"]').attr('data-pdform', form_id);
                    PageDotTemplateClose(PDETEMPLATE);
                }
                $('.pagedot-tab-form').removeClass('d-none');
                $('[name="pagedot-input-form-id"]').val(form_id)
            }
        } else {

            // Если формы нет, но есть поля ввода
            // сообщаем об этом
            if (element.find('input').length > 0) {
                $('.pagedot-tab-form').removeClass('d-none');
            } else {
                $('.pagedot-tab-form').addClass('d-none');
            }

            $('#myTabElementConfing li a').removeClass('active');
            $('#myTabElementConfing li:first-child a').addClass('active');
            $('#myTabContent2 .tab-pane.fade').removeClass('show').removeClass('active');
            $('#myTabContent2 .tab-pane.fade:first-child').addClass('show').addClass('active');
            
        }

        global_pagedot_element = element;
        var elementId = microtime(true);

        //if( /<img/.test(element.html()) ){
        //    $('.pagedot-control-btn-image').removeAttr('disabled');
        //}
        // Активация функций
        
        PageDotEnable(element, elementId);

        $('.pagedot-editor-btn').removeAttr('disabled');

        if(! /<div|<section|<p|<h1|<li|<input|<textarea|<label/.test(element.html()) ){
            e.preventDefault();

            var tag = global_pagedot_element[0].tagName;
            if (tag != 'BUTTON') {
                element.attr('contenteditable', 'true').focus();
            }
            if (tag == 'IMG') {
                $('.pagedot-control-meta-image-img img').attr('src', global_pagedot_element.attr('src'));
                $('.pagedot-control-meta-image-img').addClass('active');
            } else {
                $('.pagedot-control-meta-image-img').removeClass('active');
            }

            if(! /class="pagedot-edit-variant-block/.test(element.html()) ){
                return false;
            } 

        }

        return false;

    });
    }


    $('body').on('click', '.pagedot-tab-form', function () {
        
        var form_id = $('[name="pagedot-input-form-id"]').val();
        var pdform = PageDot.find('[data-pdform="'+form_id+'"]');

        $.ajax({
                  type: 'GET',
                  url: pagedot_dir+"/app/Route.php",
                  data: {
                    route: 'get-form',
                    form_id: form_id
                  },
                  success: function(json) {
                    var data = JSON.parse(json);
                    // добавляем кнопки/вкладки с вариантами настроек и формы

                    $('.pagedot-control-form-ajax-content').html(data.html);
                    
                    var pd_params = Array();
                    var pd_form_params = pdform.find('[name]').each(function(index, pd_form_param){
                        //console.log($(pd_form_param).attr('placeholder'))
                        pd_params[index] = '<span title="placeholder: '+$(pd_form_param).attr('placeholder')+'">{{'+$(pd_form_param).attr('name')+'}}</span>';
                    });
                    if (pd_params.length > 0) {
                        var html_params = '<div class="alert alert-info mb-1 pt-1 pb-1">Параметры из формы '+pd_params.join(', ')+'</div>';
                    } else {
                        var html_params = '';
                    }
                    $('.pagedot-control-form-params-default').html(html_params);
                    $('.pagedot-control-form-params').html(html_params);
                  }
        });
    });


    window.onload=function() {
        //var g = window.innerHeight;
        //document.getElementById("PAGEDOT-CONTAINER").style.height=g+"px";

        let iframeHead = $('#PAGEDOT-CONTAINER').contents().find('head');
        let iframeCSS = '<style>img{cursor:pointer;}[contenteditable="true"]:focus {outline: 0px dashed rgb(161 205 69 / 100%)!important;}[data-pagedot-chunk-map] {padding: 30px;background-color: #eee;display:block;text-align:center;font-size:16px;border: 3px dashed rgb(161 205 69 / 100%)!important;z-index:88;cursor:pointer;}.pagedot-element-active,.pagedot-element-active:hover {box-shadow: 0 0 0 0.15rem rgb(161 205 69 / 100%) inset;}.pagedot-edit-variants>div:hover{background:#8FB53D!important;color:#fff!important;}.pagedot-edit-variants>div.active{background:#A1CD45!important;color:#fff!important;}.pagedot-edit-variants>div{float:left;padding:3px;cursor:pointer;color:#000!important;}.pagedot-edit-variants{z-index:999;position:absolute;font-size: 10px;overflow:hidden;background:#fff!important;border-radius:4px;box-shadow:0 0 10px rgba(0,0,0, .3);}section:hover, div:hover, span:hover, h1:hover, h2:hover, h3:hover, h4:hover, h5:hover, h6:hover, p:hover, a:hover, label:hover, button:hover, li:hover, input:hover, section:hover, td:hover, dd:hover, img:hover {outline:1px dotted #555;}.pagedot-element-eye-hide{visibility: hidden!important;}</style>';
        $(iframeHead).append(iframeCSS);

        setTimeout(function(){
            loadFiles();
        }, 1000);

    }

    $('.pagedot-control-panel-backgroundImage').unbind('click');
    $('.pagedot-control-panel-btn').unbind('click');
    $('.pagedot-control-panel-btn-ogImage').unbind('click');
    $('.pagedot-control-meta-image-img').unbind('click');
    PageDot.find("img").unbind('dblclick');

    $('.pagedot-control-panel-backgroundImage').click(function(e){
        $('.pagedot-control-panel-btn').trigger('click');
    });

    $('.pagedot-control-panel-btn-ogImage').click(function(e){
        dotModal(this, pagedot_dir+'/file.php', 'ogImage');
        return false;
    });

    $('.pagedot-control-meta-image-img').click(function(e){
        dotModal(PageDot.find(".pagedot-element-active"), pagedot_dir+'/file.php');
        return false;
    });

    $('.pagedot-control-meta-image-bg').click(function(e){
        dotModal(PageDot.find(".pagedot-element-active"), pagedot_dir+'/file.php', 'backgroundImage');
        return false;
    });

    $('.pagedot-control-panel-btn, .pagedot-control-panel-img-btn').click(function(e){
        dotModal(this, pagedot_dir+'/file.php', 'backgroundImage');
        return false;
    });

    // Изображения
    PageDot.find("img").dblclick(function(e){
        dotModal(this, pagedot_dir+'/file.php');
        return false;
    });

    function PageDotEnableRemove(element, elementId) {
        PagedotBtnEnable('remove', elementId);
    }

    function PageDotEnableBlockparse(element, elementId) {
        PagedotBtnEnable('blockparse', elementId);
    }

    function PageDotEnableEye(element, elementId) {
        PagedotBtnEnable('eye', elementId);
    }

    function PageDotEnableDown(element, elementId) {
        if (!PageDot.find('[data-pagedot-element-id="'+elementId+'"]').next().length > 0) {
            PagedotBtnDisable('down');
        } else {
            PagedotBtnEnable('down', elementId);
        }
        
    }

    function PageDotEnableUp(element, elementId) {
        if (!PageDot.find('[data-pagedot-element-id="'+elementId+'"]').prev().length > 0) {
            PagedotBtnDisable('up');
        } else {
            PagedotBtnEnable('up', elementId);
        }
    }
    function PagedotStyleTypeToggle(type, status) {
        // Size, Block, Text
        if (status == 'hide') {
            $('.pagedot-control-panel-type'+type).addClass('d-none');
        }
        if (status == 'show') {
            $('.pagedot-control-panel-type'+type).removeClass('d-none');
        }
    }

    function PageDotEnableDuplicate(element, elementId) {
        PagedotBtnEnable('duplicate', elementId);
    }

    function PageDotEnableStyle(element, elementId) {
        PagedotBtnEnable('style', elementId);

        var param = PagedotStyleParams();

        $('.pagedot-control-panel-typeSize').removeClass('d-none');

        var tag = element[0].tagName;

        PagedotStyleTypeToggle('Size', 'hide');

        if (tag == 'IMG') {
            PagedotStyleTypeToggle('Size', 'show');
            PagedotStyleTypeToggle('Text', 'show');
            PagedotStyleTypeToggle('Block', 'show');
        }
        
        var input_value = '';
        var styles = '';

        for (let key in param) {
            input_value = element.css(key);

            if (input_value != undefined && input_value != 'NaN' && input_value != null) {
                if (key == 'backgroundImage') {

                    if (input_value != 'unset' && input_value != 'none' && input_value != '') {
                        input_value = input_value.replace('url(','').replace(')','').replace(/\"/gi, "");

                        $('.pagedot-control-meta-image-bg img').attr('src', input_value);
                        $('.pagedot-control-meta-image-bg').addClass('active')

                        $('.pagedot-control-panel-img').html('<img src="'+input_value+'" alt="" class="pagedot-control-panel-backgroundImage w-100">');
                    } else {
                        $('.pagedot-control-panel-img').html('<img src="../admin/img/no_image.jpg" alt="" class="pagedot-control-panel-backgroundImage w-100">');
                        $('.pagedot-control-meta-image-bg').removeClass('active')
                    }
                    
                }

                //input_value = input_value.replace('url(','').replace(')','').replace(/\"/gi, "");

                $('#pagedot-style-value-'+key).val(input_value);
                if (key == 'backgroundColor' || key == 'color') {
                    $('#pagedot-style-value-'+key).css(key, input_value);
                }
            }
        }

        return false;
    }


    PageDot.on('blur', "[contenteditable]", function(e){
        
        // Инициализация изменений
        PagedotInit($(this), 'contenteditable', $(this).html());
        return false;
    
    });


    function PageDotEnableSetting(element, elementId, test) {


        // ???????????????????????????
        // ???????????????????????????
        // ???????????????????????????
        // ???????????????????????????
        // ???????????????????????????
        // ???????????????????????????
        // ???????????????????????????
        PagedotBtnEnable('setting', elementId);
        $('.pagedot-setting-panel').removeClass('active');

        var tag = global_pagedot_element[0].tagName;
        
        PagedotSettingClassId(global_pagedot_element, '#pagedot-setting-A-value-id');
        PagedotSettingClassAdd(global_pagedot_element, '#pagedot-setting-A-value-class');
        PagedotSettingCodeAdd(global_pagedot_element, '#pagedot-setting-A-value-code');

        if (tag == 'A') {
            $('.pagedot-setting-panel-A').addClass('active');
            var href = element.attr('href');
            $('#pagedot-setting-A-value-href').val(href);
            return false;
        }

        if (tag == 'INPUT') {
            PagedotSettingClassAdd(global_pagedot_element, '#pagedot-setting-A-value-class');

            $('.pagedot-setting-panel-INPUT').addClass('active');
            var value = global_pagedot_element.val();
            var placeholder = global_pagedot_element.attr('placeholder');
            var name = global_pagedot_element.attr('name');
            var onclick = PagedotTemplateGet(global_pagedot_element, 'onclick');
            $('#pagedot-setting-INPUT-value-value').val(value);
            $('#pagedot-setting-INPUT-value-placeholder').val(placeholder);
            $('#pagedot-setting-INPUT-value-name').val(name);
            $('#pagedot-setting-INPUT-value-onclick').val(onclick);
            return false;
        }

        if (tag == 'BUTTON') {

            PagedotSettingClassAdd(global_pagedot_element, '#pagedot-setting-A-value-class');

            $('.pagedot-setting-panel-BUTTON').addClass('active');
            var button_text = global_pagedot_element.html();
            var onclick = PagedotTemplateGet(global_pagedot_element, 'onclick');
            $('#pagedot-setting-BUTTON-value-button_text').val(button_text);
            $('#pagedot-setting-BUTTON-value-onclick').val(onclick);

            /*
            PageDotEnableSetting(button, elementId);
            var html_edit_variants = '<div class="pagedot-edit-variants"><div class="pagedot-edit-variant-block"><i class="ti ti-pencil"></i> блок</div><div class="pagedot-edit-variant-button active"><i class="ti ti-pencil"></i> кнопка</div></div>';
            button.after(html_edit_variants);
            PageDot.find('.pagedot-edit-variant-button').click(function(e){
                PageDot.find('.pagedot-edit-variant-block').removeClass('active');
                $(this).addClass('active');
                if (!$('.pagedot-control-btn-setting').hasClass('active')) {
                    $('.pagedot-control-btn-setting').click();
                }
                global_pagedot_element = button;
                PageDotEnableSetting(button, elementId, 'ok');
                return false;
            });
            PageDot.find('.pagedot-edit-variant-block').click(function(e){
                PageDot.find('.pagedot-edit-variant-button').removeClass('active');
                $(this).addClass('active');
                if (!$('.pagedot-control-btn-setting').hasClass('active')) {
                    $('.pagedot-control-btn-setting').click();
                }
                global_pagedot_element = element;
                PageDotEnableSetting(element, elementId, 'ok');
                return false;
            });
            */
            return false;
        }

/*
        if (test != 'ok') {
            if (element.find('button').length > 0 && element.find('*').length == 1) {
                alert('кнопок ' + element.find('button').length + ' элементов ' + element.find('*').length)
                
                PageDotControlButton(element.find('>button'), element, elementId);
                return false;
            }
            if (tag == 'BUTTON') {

                PageDotControlButton(global_pagedot_element, element, elementId);
                return false;
            }
        }
*/
        return false;
    }

    function PageDotDisable() {
        PageDot.find('.pagedot-edit-variants').remove();
        PageDot.find('.pagedot-element-active').removeClass('pagedot-element-active');
        PageDot.find('[data-pagedot-element-id]').removeAttr('data-pagedot-element-id');
        $('[data-editor-pagedot-element-id]').removeAttr('data-editor-pagedot-element-id');
        $('.pagedot-control-btn').attr('disabled', 'disabled');
    }
    function PageDotEnable(element, elementId) {
        // Деактивация всех функций

        if(element.attr('data-pagedot-chunk-map')){
            PageDotDisable();
            return false;
        }

        PageDotDisable();

        element.addClass('pagedot-element-active');
        element.attr('data-pagedot-element-id', elementId);


        // Активация удаления
        PageDotEnableRemove(element, elementId);
        // Активация разбора блока
        PageDotEnableBlockparse(element, elementId);
        // Временно спрятать блок
        PageDotEnableEye(element, elementId);
        // Активация перемещения вниз
        PageDotEnableDown(element, elementId);
        // Активация перемещения наверх
        PageDotEnableUp(element, elementId);
        // Активация настроек элемента
        PageDotEnableSetting(element, elementId);
        // Активация редактирования стилей
        PageDotEnableStyle(element, elementId);
        // Активация дублирования
        PageDotEnableDuplicate(element, elementId);




    }

    return false;
}

$('#PAGEDOT-CONTAINER').load(function(){
    loadFunctions();
});

function PagedotSettingClassId(element, element_val) {
    var id_name = element.attr('id');   
    $(element_val).val(id_name);
}

function PagedotSettingClassAdd(element, element_val) {
    //
            var class_name = element.attr('class');
            class_names = class_name.split(' ');
            
            var class_name_new = Array();
            class_names.forEach(function(item, index){
                if (item != '' && item != 'pagedot-element-active') {
                    class_name_new[index] = item;
                }
            });
            if (class_name_new.length > 0) {
                var class_name__ = class_name_new.join(' ');
                $(element_val).val(class_name__);
            } else {
                $(element_val).val('');
            }
    //
}

function PagedotSettingCodeAdd(element, element_val) {
    var pdeid = element.attr('data-pdeid');
    /*var psaeid = $('#pagedot-setting-active-element-pdeid').val()
    //alert(psaeid)
    if (psaeid == undefined || psaeid == null || psaeid == '') {
        $('#pagedot-setting-active-element-pdeid').val(pdeid);
    } else {
        pdeid = psaeid;
    }*/

    var PDETEMPLATE = PageDotTemplateOpen();
    var elementor = $(PDETEMPLATE).find('[data-pdeid="'+pdeid+'"]');

    var clone = elementor.clone();
    if (clone.prop('outerHTML') == undefined || clone.prop('outerHTML') == null) {
        //alert('Элемент не найден!')
        return false;
    }

    clone = clone.removeClass('pagedot-element-active');
    var html = clone.prop('outerHTML');
    html = html.replace(/ data-pdeid="([0-9a-zA-Z-_.]+)"/g, '');
    html = html.replace(/ data-pagedot-element-id="([0-9a-zA-Z-_.]+)"/g, '');
    html = html.replace(/pdtag__textarea/g, 'textarea');

    $(element_val).val(html);

    PageDotTemplateClose(PDETEMPLATE);
    
}

$('.PagedotHTMLcodeToggle').click(function(e) {
    e.preventDefault();
    $('.pagedot-control-panel-HTMLcode').toggleClass('d-none');
    $('.pagedot-control-panel-label-nok').toggleClass('d-none');
    $('.pagedot-control-panel-protect').toggleClass('d-none');
});
    
function PagedotSettingChange(e, attr) {
    var elem = global_pagedot_element;

    if (attr == 'id') {
        var value = $(e).val();
        elem.attr('id', 'pagedot-element-active ' + value);
    }
    if (attr == 'class') {
        var value = $(e).val();
        elem.attr('class', 'pagedot-element-active ' + value);
    }
    if (attr == 'href') {
        var value = $(e).val();
        elem.attr('href', value);
    }
    if (attr == 'onclick') {
        var value = $(e).val();
        //elem.attr('onclick', value);
    }
    if (attr == 'value') {
        var value = $(e).val();
        elem.attr('value', value);
    }
    if (attr == 'placeholder') {
        var value = $(e).val();
        elem.attr('placeholder', value);
    }
    if (attr == 'name') {
        var value = $(e).val();
        elem.attr('name', value);
    }
    if (attr == 'button_text') {
        var value = $(e).val();
        elem.html(value);
    }
    if (attr == 'code') {
        var PageDot = $("#PAGEDOT-CONTAINER").contents();
        var value = $('#pagedot-setting-A-value-code').val();

        var pdeid = elem.attr('data-pdeid');
        var PDETEMPLATE = PageDotTemplateOpen();
        var elemTemp = $(PDETEMPLATE).find('[data-pdeid="'+pdeid+'"]');
        
        $.ajax({
            type: 'POST',
            url: pagedot_dir+"/app/Route.php",
            data: {
                route: 'pdeid-create',
                html: value
            },
            success: function(value) {

                elem.after( value );
                elem.remove();
                elemTemp.after( value );
                elemTemp.remove();

                PageDotTemplateClose(PDETEMPLATE);

                // Закрываем окно редактирования
                $('.pagedot-control-panel-close').trigger('click');
                $('#pagedot-setting-active-element-pdeid').val('')

                loadFunctions(true);
            }
        });

        
        
    }

    // Инициализация изменений
    PagedotInit(elem, attr, value);
}

// Получение значения из шаблона
function PagedotTemplateGet(global_pagedot_element, attr) {
    var pdeid = global_pagedot_element.attr('data-pdeid');
    var PDETEMPLATE = PageDotTemplateOpen();
    var elementor = $(PDETEMPLATE).find('[data-pdeid="'+pdeid+'"]');
    if (attr == 'onclick') {
        return elementor.attr(attr);
    } 
}

// Инициализация обмена данными из iframe c template
function PagedotInit(elem, attr, value, html) {
    setTimeout(function(){
        var pdeid = elem.attr('data-pdeid');
        var PDETEMPLATE = PageDotTemplateOpen();
        var elementor = $(PDETEMPLATE).find('[data-pdeid="'+pdeid+'"]');

        if (attr == 'contenteditable') {
            elementor.html(value);
        }
        if (attr == 'id') {
            elementor.attr('id', 'pagedot-element-active ' + value);
        }
        if (attr == 'class') {
            elementor.attr('class', 'pagedot-element-active ' + value);
        }
        if (attr == 'href') {
            elementor.attr('href', value);
        }
        if (attr == 'onclick') {
            elementor.attr('onclick', value);
        }
        if (attr == 'placeholder') {
            elementor.attr('placeholder', value);
        }
        if (attr == 'name') {
            elementor.attr('name', value);
        }
        if (attr == 'value') {
            elementor.attr('value', value);
        }
        if (attr == 'button_text') {
            elementor.html(value);
        }
        if (attr == 'remove') {
            elementor.remove();
        }
        if (attr == 'down') {
            elementor.next().after(elementor);
        }
        if (attr == 'up') {
            elementor.prev().before(elementor);
        }
        if (attr == 'duplicate') {
            elementor.after(html);
        }
        if (attr == 'pdstyle') {
            elementor.attr('data-pdstyle', value);        
        }
        if (attr == 'src') {
            if (typeof elementor.attr('src') !== 'undefined' && elementor.attr('src') !== false) {
                elementor.attr('src', value);
            }
            if (typeof elementor.attr('data-src') !== 'undefined' && elementor.attr('data-src') !== false) {
                elementor.attr('data-src', value);
            }
            if (typeof elementor.attr('data-original') !== 'undefined' && elementor.attr('data-original') !== false) {
                elementor.attr('data-original', value);
            }
        }
        if (attr == 'code') {
            elementor.after( value );
            elementor.remove();
        }
    
        PageDotTemplateClose(PDETEMPLATE);
    }, 500)

}

function PagedotStyleParams() {
    
    var arr = {
        fontSize: "font-size",
        width: "width",
        height: "height",
        backgroundColor: "background-color",
        backgroundImage: "background-image",
        paddingTop: "padding-top",
        paddingRight: "padding-right",
        paddingBottom: "padding-bottom",
        paddingLeft: "padding-left",
        marginTop: "margin-top",
        marginRight: "margin-right",
        marginBottom: "margin-bottom",
        marginLeft: "margin-left",
        color: "color",
        borderTopLeftRadius: "border-top-left-radius",
        borderTopRightRadius: "border-top-right-radius",
        borderBottomLeftRadius: "border-bottom-left-radius",
        borderBottomRightRadius: "border-bottom-right-radius",
    };

    return arr;
}

// <meta name="Description" content="...">
// <meta name="Keywords" content="ключ1, ключ2, ключ3">

// <meta property="og:title" content="Мэрилин Монро"/>
// <meta property="og:description" content="Американская киноактриса и певица"/>
// <meta property="og:image" content="https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Marilyn_Monroe_-_publicity.JPG/210px-Marilyn_Monroe_-_publicity.JPG"/>
// <meta property="og:type" content="profile"/>
// <meta property="og:url" content= "https://ru.wikipedia.org/wiki/Мэрилин_Монро" />

// Добавление нового meta тега или замена существующего
function PagedotMetaAdd(to, value) {
    var PageDotTemp = PageDotTemplateOpen();
    
    if ($(PageDotTemp).find('meta[' + to + ']').length === 0) {
        var currentHtml = $(PageDotTemp).html();
        var newHtml = currentHtml.replace(/{{\/PDHEAD}}/g, '\n<meta ' + to + ' content="">' + "\n{{\/PDHEAD}}");
        $(PageDotTemp).html(newHtml);
        //htmlt = $(PageDotTemp).html().replace(/{{PDHEAD : (.*)}}/g, "{{PDHEAD : $1}}\n"+'    <meta '+to+' content="">');
        $('#PAGEDOTCONTAINERTEMPLATE').val(newHtml);
    } else {
        $(PageDotTemp).find('meta[' + to + ']').attr('content', value);
    }
    
    PageDotTemplateClose(PageDotTemp);
}

function PagedotCodeScriptsChange(e) {
    $('.pagedot-editor-btn').removeAttr('disabled');
    var value = $(e).val();

    var PageDot = $("#PAGEDOT-CONTAINER").contents();
    PageDot.find('.pagedot-code-scripts').remove();
    value = "<div class=\"pagedot-code-scripts\">"+value+"</div>\r\n";
    PageDot.find('body').append(value)

    var PageDotTemp = PageDotTemplateOpen();
    $(PageDotTemp).find('.pagedot-code-scripts').remove();
    var currentHtml = $(PageDotTemp).html();
    var newHtml = currentHtml.replace(/{{\/PDBODY}}/g, value + "\n{{\/PDBODY}}");
    $(PageDotTemp).html(newHtml);
    //$('#PAGEDOTCONTAINERTEMPLATE').val(newHtml);
    PageDotTemplateClose(PageDotTemp);

    loadFunctions(true);
}

function PagedotMetaChange(e) {
    $('.pagedot-editor-btn').removeAttr('disabled');

    var value = $(e).val();
    var meta = $(e).attr('name');
    if (meta == 'meta-title') {
        var PageDotTemp = PageDotTemplateOpen();
        if($(PageDotTemp).find('title').length === 0) {
            $(PageDotTemp).find('head').prepend('<title></title>');
        }
        $(PageDotTemp).find('title').text(value);
        PageDotTemplateClose(PageDotTemp);
    }
    if (meta == 'meta-description') {
        PagedotMetaAdd('name="description"', value);
    }
    if (meta == 'meta-keywords') {
        PagedotMetaAdd('name="keywords"', value);
    }
    if (meta == 'meta-og-title') {
        PagedotMetaAdd('property="og:title"', value);
    }
    if (meta == 'meta-og-description') {
        PagedotMetaAdd('property="og:description"', value);
    }
    if (meta == 'meta-og-image') {
        PagedotMetaAdd('property="og:image"', value);
    }
    
}

function PagedotCodeScriptsInit() {
    var PageDotTemp = PageDotTemplateOpen();
    var code_scripts = $(PageDotTemp).find('.pagedot-code-scripts').html();
    $('[name="code-scripts"]').val(code_scripts);
    PageDotTemplateClose(PageDotTemp);
}
function PagedotMetaInit() {

    var PageDotTemp = PageDotTemplateOpen();

    var og_title = $(PageDotTemp).find('[property="og:title"]').attr('content');
    $('[name="meta-og-title"]').val(og_title);

    var og_description = $(PageDotTemp).find('[property="og:description"]').attr('content');
    $('[name="meta-og-description"]').val(og_description);

    var og_image = $(PageDotTemp).find('[property="og:image"]').attr('content');
    var og_image_src = og_image;
    if(!og_image_src) {
        og_image_src = pagedot_dir+'/img/not-image.jpg';
    }
    $('.pagedot-control-panel-ogImage').attr('src', og_image_src);
    $('[name="meta-og-image"]').val(og_image);

    var description = $(PageDotTemp).find('[name="description"]').attr('content');
    $('[name="meta-description"]').val(description);

    var keywords = $(PageDotTemp).find('[name="keywords"]').attr('content');
    $('[name="meta-keywords"]').val(keywords);

    var title = $(PageDotTemp).find('title').text();
    $('[name="meta-title"]').val(title);

    PageDotTemplateClose(PageDotTemp);
}

function PagedotStyleChange(e, style) {
    var param = PagedotStyleParams();
    var PageDot = $("#PAGEDOT-CONTAINER").contents();
    var elem = PageDot.find('.pagedot-element-active');
    var PageDotTemp = PageDotTemplateOpen();
    var input_value = '';
    var styles = '';

    for (let key in param) {
        if (!$('#pagedot-style-value-'+key).parents('.pagedot-control-panel-type').hasClass('d-none')) {

            input_value = $('#pagedot-style-value-'+key).val();
            if (input_value != '') {
                switch (key) {
                    case 'backgroundImage':

                        if (typeof elem.attr('data-original') !== 'undefined' && elem.attr('data-original') !== false) {
                            $(PageDotTemp).find('[data-pdeid="'+elem.attr('data-pdeid')+'"]').attr('data-original', input_value)
                            elem.attr('data-original', input_value)
                        }
                        
                        if (input_value == 'none') {
                            styles += param[key]+':'+input_value+'!important;';
                            //styles += param[key]+':'+input_value+';';
                            $('.pagedot-control-meta-image-bg').removeClass('active');
                        } else {
                            //styles += param[key]+':url('+input_value+')!important;';
                            styles += param[key]+':url('+input_value+');';
                            $('.pagedot-control-meta-image-bg img').attr('src', input_value);
                            $('.pagedot-control-meta-image-bg').addClass('active');
                        }
                        break;
                    default:
                        styles += param[key]+':'+input_value+'!important;';
                        //styles += param[key]+':'+input_value+';';
                }
            }
        }
    }

    //if (style == 'fontSize') {
        var value = $(e).val();
        var type = $('.pagedot-btn-size.active').attr('data-type');
        if (type == 'desktop') {
            var size = '(.*)min-width:768px(.*)';
            var size_real = '(min-width:768px)';
        }
        if (type == 'tablet') {
            var size = '(.*)min-width:576px(.*) AND (.*)max-width:768px(.*)';
            var size_real = '(min-width:576px) AND (max-width:768px)';
        }
        if (type == 'mobile') {
            var size = '(.*)max-width:575px(.*)';
            var size_real = '(max-width:575px)';
        }

        if (elem.attr('data-pdstyle') === null || elem.attr('data-pdstyle') === undefined) {
            var key = microtime(true);
            PagedotInit(elem, 'pdstyle', key);
            elem.attr('data-pdstyle', key);
        } else {
            var key = elem.attr('data-pdstyle');
        }

        if (!PageDot.find('#pagedot-style-custom').length > 0) {
            PageDot.find('body').append('<style id="pagedot-style-custom"></style>');
        }

            var append = '/*'+key+' '+type+'*/@media'+size_real+'{[data-pdstyle="'+key+'"]{'+styles+'}}/*/'+key+' '+type+'*/';
            $.ajax({
                type: 'POST',
                url: pagedot_dir+"/app/Route.php",
                data: {
                    route: 'style-replace',
                    html: PageDot.find('#pagedot-style-custom').html(),
                    key: key,
                    type: type,
                    size: size,
                    append: append
                },
                success: function(result) {
                    PageDot.find('#pagedot-style-custom').html(result);
                    return false;
                }
            });

    PageDotTemplateClose(PageDotTemp);
    return false;

}

function PagedotStyleBgImageClear(e) {
    $('.pagedot-control-panel-backgroundImage').remove();
    $('#pagedot-style-value-backgroundImage').val('none');
    $('#pagedot-style-value-backgroundImage').trigger('blur');
    $('.pagedot-control-panel-img').html('<img src="../admin/img/no_image.jpg" alt="" class="pagedot-control-panel-backgroundImage w-100">');
}

function PageDotSaveStyle(style) {
    var page = $('[name="page"]').val();
    $.ajax({
        type: 'POST',
        url: pagedot_dir+"/app/Route.php",
        data: {
            route: 'style-save',
            style: style,
            page: page,
        },
        success: function(result) {
            //alert(result);
        }
    });

}

function PageDotGetUpgrade() {
    $.ajax({
        type: 'POST',
        url: pagedot_dir+"/app/Route.php",
        data: {
            route: 'get-upgrade',
        },
        success: function(result) {

        }
    });
}

function PageDotStartUpgrade() {
    $.ajax({
        type: 'POST',
        url: pagedot_dir+"/app/Route.php",
        data: {
            route: 'start-upgrade',
        },
        success: function(json) {
            var arr = JSON.parse(json);
            if (arr.result == 'ok') {
                
                var quantity = arr.length;
                var processed = 0;
                var step = 100/quantity;

                $('.js--modal-upgrade').modal({
                    backdrop:'static'
                });
                $('.js--modal-upgrade').modal('show');
               
                // В окне выводим цифру процента обновления
                $('.dot-upgrade-num span').html(processed);
                var pNow = 0;
                var stop = 0;
                for (let key in arr.url) {
                    $.ajax({
                        type: 'POST',
                        url: pagedot_dir+"/app/Route.php",
                        data: {
                            route: 'file-upgrade',
                            url: arr.url[key]
                        },
                        success: function(json) {
                            var data = JSON.parse(json);
                            processed = parseFloat(processed)+parseFloat(step);
                            processedReal = Math.ceil(processed);
                            if (processedReal > 100) {
                                processedReal = 100;
                            }
                            pNow = $('.dot-upgrade-num span').html();
                            for(let i=pNow;i<=processedReal;i++) {
                                setTimeout(function(){
                                    $('.dot-upgrade-num span').html(i);
                                    if (i == 100) {
                                        $('.dot-upgrade-text').html(arr.info);
                                        $('.dot-upgrade-message').removeClass('d-none');
                                        $.ajax({
                                            type: 'POST',
                                            url: pagedot_dir+"/app/Route.php",
                                            data: {
                                                route: 'stop-upgrade',
                                                version: data.version
                                            },
                                            success: function(result) {

                                            }
                                        });
                                    }
                                },10*i);
                            }

                            
                            //
                            //
                            //
                            //
                            // Меняем цифру процента обновления в модальном окне
                        }
                    });
                }
            }
        }
    });
}

function PagedotCreateOrUpdateForm(e) {
    var form = $(e);
    $(e).attr('disabled', 'disabled');
    $.ajax({
            type: 'POST',
            url: pagedot_dir+"/app/Route.php",
            data: form.serialize() + '&route=create-or-update-form',
            success: function(json) {
                var data = JSON.parse(json);
                $(e).removeAttr('disabled');
                form.find('.pagedot-form-ajax-result').hide().html(data.message).fadeIn();
            }
    });
}
function saveConfig(e) {
    var form = $(e).parents('form');
    $(e).attr('disabled', 'disabled');
    $.ajax({
            type: 'POST',
            url: pagedot_dir+"/app/Route.php",
            data: form.serialize() + '&route=config-save',
            success: function(json) {
                var data = JSON.parse(json);
                $(e).removeAttr('disabled');
                form.find('.ajax-result').hide().html(data.message).fadeIn();
                $('.pagedot-enter-key').removeClass('active')
            }
    });
}

function resizeFrame(e, size) {
    $('.pagedot-btn-size').removeClass('active');
    $(e).addClass('active');
    if (size == 'desktop') {
        $('#PAGEDOT-CONTAINER').attr('width', '100%');
    }
    if (size == 'tablet') {
        $('#PAGEDOT-CONTAINER').attr('width', '750px');
    }
    if (size == 'mobile') {
        $('#PAGEDOT-CONTAINER').attr('width', '400px');
    }
    var PageDot = $("#PAGEDOT-CONTAINER").contents();
    PageDot.find('.pagedot-element-active').trigger('click');
}
function PagedotBtn(e, type) {
    var PageDot = $("#PAGEDOT-CONTAINER").contents();
    var elementId = $(e).attr('data-editor-pagedot-element-id');

    if (type == 'panel-close') {
        $('.pagedot-control-panel').removeClass('active');
        $('.pagedot-control-btn-style').removeClass('active');
        $('.pagedot-control-btn-history').removeClass('active');
        $('.pagedot-control-btn-setting').removeClass('active');
        $('.pagedot-control-btn-config').removeClass('active');
        $('.pagedot-control-panel-config').removeClass('active');
        $('.pagedot-control-btn-files').removeClass('active');
        $('.pagedot-control-panel-files').removeClass('active');
        $('.pagedot-control-btn-constructor').removeClass('active');
        $('.pagedot-control-panel-constructor').removeClass('active');
    }
    if (type == 'constructor') {
        $('.pagedot-control-panel').removeClass('active');
        $('.pagedot-control-panel-constructor').toggleClass('active');
        $('.pagedot-control-btn-constructor').toggleClass('active');
        $('.pagedot-control-panel-files').removeClass('active');
        $('.pagedot-control-btn-files').removeClass('active');
        $('.pagedot-control-btn-style').removeClass('active');
        $('.pagedot-control-btn-history').removeClass('active');
        $('.pagedot-control-btn-setting').removeClass('active');
        $('.pagedot-control-btn-config').removeClass('active');
        $('.pagedot-control-panel-config').removeClass('active');
    }
    if (type == 'files') {
        $('.pagedot-control-panel').removeClass('active');
        $('.pagedot-control-panel-files').toggleClass('active');
        $('.pagedot-control-btn-files').toggleClass('active');
        $('.pagedot-control-btn-style').removeClass('active');
        $('.pagedot-control-btn-history').removeClass('active');
        $('.pagedot-control-btn-setting').removeClass('active');
        $('.pagedot-control-btn-config').removeClass('active');
        $('.pagedot-control-panel-config').removeClass('active');
        $('.pagedot-control-panel-constructor').removeClass('active');
        $('.pagedot-control-btn-constructor').removeClass('active');
    }
    if (type == 'setting') {
        $('.pagedot-control-panel-setting').toggleClass('active');
        $('.pagedot-control-btn-setting').toggleClass('active');
        $('.pagedot-control-btn-history').removeClass('active');
        $('.pagedot-control-panel-history').removeClass('active');
        $('.pagedot-control-btn-style').removeClass('active');
        $('.pagedot-control-panel-style').removeClass('active');
        $('.pagedot-control-btn-config').removeClass('active');
        $('.pagedot-control-panel-config').removeClass('active');
        $('.pagedot-control-btn-files').removeClass('active');
        $('.pagedot-control-panel-files').removeClass('active');
        $('.pagedot-control-panel-constructor').removeClass('active');
        $('.pagedot-control-btn-constructor').removeClass('active');
    }
    if (type == 'style') {
        $('.pagedot-control-panel-style').toggleClass('active');
        $('.pagedot-control-btn-style').toggleClass('active');
        $('.pagedot-control-btn-history').removeClass('active');
        $('.pagedot-control-panel-history').removeClass('active');
        $('.pagedot-control-btn-setting').removeClass('active');
        $('.pagedot-control-panel-setting').removeClass('active');
        $('.pagedot-control-btn-config').removeClass('active');
        $('.pagedot-control-panel-config').removeClass('active');
        $('.pagedot-control-btn-files').removeClass('active');
        $('.pagedot-control-panel-files').removeClass('active');
        $('.pagedot-control-panel-constructor').removeClass('active');
        $('.pagedot-control-btn-constructor').removeClass('active');
    }
    if (type == 'history') {
        $('.pagedot-control-panel-history').toggleClass('active');
        $('.pagedot-control-btn-history').toggleClass('active');
        $('.pagedot-control-btn-style').removeClass('active');
        $('.pagedot-control-panel-style').removeClass('active');
        $('.pagedot-control-btn-setting').removeClass('active');
        $('.pagedot-control-panel-setting').removeClass('active');
        $('.pagedot-control-btn-config').removeClass('active');
        $('.pagedot-control-panel-config').removeClass('active');
        $('.pagedot-control-btn-files').removeClass('active');
        $('.pagedot-control-panel-files').removeClass('active');
        $('.pagedot-control-panel-constructor').removeClass('active');
        $('.pagedot-control-btn-constructor').removeClass('active');
    }
    if (type == 'config') {
        PagedotMetaInit();
        PagedotCodeScriptsInit();
        $('.pagedot-control-panel-config').toggleClass('active');
        $('.pagedot-control-btn-config').toggleClass('active');
        $('.pagedot-control-btn-style').removeClass('active');
        $('.pagedot-control-panel-style').removeClass('active');
        $('.pagedot-control-btn-setting').removeClass('active');
        $('.pagedot-control-panel-setting').removeClass('active');
        $('.pagedot-control-btn-history').removeClass('active');
        $('.pagedot-control-panel-history').removeClass('active');
        $('.pagedot-control-btn-files').removeClass('active');
        $('.pagedot-control-panel-files').removeClass('active');
        $('.pagedot-control-panel-constructor').removeClass('active');
        $('.pagedot-control-btn-constructor').removeClass('active');
    }
    if (type == 'menuMobile') {
        $('.pagedot-control-panel-menuMobile').toggleClass('active');
    }

    if (type == 'up') {
        var block = PageDot.find('[data-pagedot-element-id="'+elementId+'"]');
        PagedotInit(block, 'up', false);
        PageDot.find('[data-pagedot-element-id="'+elementId+'"]').prev().before(block);

        runScroll('[data-pagedot-element-id="'+elementId+'"]');

        if (!PageDot.find('[data-pagedot-element-id="'+elementId+'"]').prev().length > 0) {
            PagedotBtnDisable('up');
        }
        if (!PageDot.find('[data-pagedot-element-id="'+elementId+'"]').next().length > 0) {
            PagedotBtnDisable('down');
        } else {
            PagedotBtnEnable('down', elementId);
        }
    }
    if (type == 'down') {
        var block = PageDot.find('[data-pagedot-element-id="'+elementId+'"]');
        PagedotInit(block, 'down', false);
        PageDot.find('[data-pagedot-element-id="'+elementId+'"]').next().after(block);

        runScroll('[data-pagedot-element-id="'+elementId+'"]');

        if (!PageDot.find('[data-pagedot-element-id="'+elementId+'"]').next().length > 0) {
            PagedotBtnDisable('down');
        }
        if (!PageDot.find('[data-pagedot-element-id="'+elementId+'"]').prev().length > 0) {
            PagedotBtnDisable('up');
        } else {
            PagedotBtnEnable('up', elementId);
        }
    }
    if (type == 'remove') {
        var res = confirm('Удалить блок?');
        if (res) {
            // Инициализация изменений
            PagedotInit(PageDot.find('[data-pagedot-element-id="'+elementId+'"]'), 'remove', false);
            PageDot.find('[data-pagedot-element-id="'+elementId+'"]').remove();
        }
    }
    if (type == 'blockparse') {
        let wnd = []
        wnd = PageDot.find('[data-pagedot-element-id="'+elementId+'"]')
        PageDotBlockparseStart(wnd)
    }
    if (type == 'controlclick') {
        if (!$('.pagedot-control-btn-controlclick').hasClass('active')) {
            $('.pagedot-control-btn-controlclick').addClass('active');
            loadFunctions(false)
        } else {
            $('.pagedot-control-btn-controlclick').removeClass('active');
            loadFunctions(true)
        }
        
    }
    if (type == 'eye') {
        if ($('.pagedot-control-btn-eye').hasClass('active')) {
            var PageDot = $("#PAGEDOT-CONTAINER").contents();
            $('.pagedot-control-btn-eye').removeClass('active');
            PageDot.find('.pagedot-element-eye-hide').removeClass('pagedot-element-eye-hide')
        } else {
            PageDot.find('[data-pagedot-element-id="'+elementId+'"]').addClass('pagedot-element-eye-hide')
            $('.pagedot-control-btn-eye').addClass('active');
        }
    }
    if (type == 'duplicate') {

        // Инициализация изменений
        var clone = PageDot.find('[data-pagedot-element-id="'+elementId+'"]').clone();
        var clone_new = clone.removeAttr('data-pagedot-element-id')
            .removeClass('pagedot-element-active');

        let outerHTML = clone_new[0].outerHTML
        let pdeid = $(outerHTML).attr('data-pdeid');

        let match1_first = $(outerHTML).attr('data-pdstyle');

        if (match1_first) {
            var match1_last = PagedotMicrotime(true);
            var re = new RegExp('data-pdstyle="'+match1_first+'"',"g");
            outerHTML = outerHTML.replace(re, 'data-pdstyle="'+match1_last+'"')
            StyleDuplicate(match1_first, match1_last)
        }

        const matches = $(outerHTML).find("[data-pdstyle]");
        matches.each((index, item) => {

            var first = $(item).attr('data-pdstyle');
            var last = PagedotMicrotime(true);
            if (index == 0) {pdeid = last;}

            var re = new RegExp('data-pdstyle="'+first+'"',"g");
            outerHTML = outerHTML.replace(re, 'data-pdstyle="'+last+'"')
                console.log(first)
            StyleDuplicate(first, last)
                
        });

        if (pdeid != 0) {

                $.ajax({
                    type: 'POST',
                    url: pagedot_dir+"/app/Route.php",
                    data: {
                        route: 'html-duplicate',
                        html: outerHTML
                    },
                    success: function(html) {
                        var findElement = PageDot.find('[data-pagedot-element-id="'+elementId+'"]');
                        findElement.after(html);

                        PagedotInit(findElement, 'duplicate', pdeid, html);

                        loadFunctions();
                        return false;
                    }
                });

        }

    }

}

function StyleDuplicate(first, last) {
    var PageDot = $("#PAGEDOT-CONTAINER").contents();
    $.ajax({
        type: 'POST',
        async: false,
        url: pagedot_dir+"/app/Route.php",
        data: {
            route: 'style-duplicate',
            html: PageDot.find('#pagedot-style-custom').html(),
            key_first: first,
            key_last: last
        },
        success: function(result) {
            PageDot.find('#pagedot-style-custom').html(result);
            return false;
        }
    });
}

function runScroll(el) {
  setTimeout(function () {
  var PageDot = $("#PAGEDOT-CONTAINER").contents();
  var $page = PageDot.find('html, body');
      $page.animate({
          scrollTop: PageDot.find(el).offset().top - 100
      }, 600);
      return false;
  }, 100);
}

function PagedotMicrotime(get_as_float) {
    var now = new Date().getTime() / 1000;  
    var s = parseInt(now);  
  
    return (get_as_float) ? now : (Math.round((now - s) * 1000) / 1000) + ' ' + s;  
}

function PagedotBtnEnable(type, elementId) {
    $('.pagedot-control-btn-' + type).removeAttr('disabled');
    $('.pagedot-control-btn-' + type).attr('data-editor-pagedot-element-id', elementId);
}
function PagedotBtnDisable(type) {
    $('.pagedot-control-btn-' + type).attr('disabled', 'disabled');
}

$('#ajax-login-form').submit(function(e){
    e.preventDefault();
    var form = $(this);
    //if($(form).checkValidity()) {
        $.ajax({
            type: 'POST',
            url: pagedot_dir+"/app/Route.php",
            data: form.serialize() + '&route=login-auth',
            success: function(result) {
                if (result == 'ok') {
                    window.location.reload();
                } else {
                    alert(result)
                }
            }
        });
    //} else {
        //alert("invalid form");
    //}
});

function loadFiles(dir = '') {
      $('.pagedot-control-files-items').html('<div class="pagedot-files-item"></div>');
      $.ajax({
          type: 'GET',
          url: pagedot_dir+"/app/Route.php",
          data: {
            route: 'get-files',
            dir: dir,
          },
          success: function(html) {
            $('.pagedot-control-files-items').html(html);
          }
      });
}

function loadHistory(page) {
      $('.pagedot-control-history-items').html('<div class="pagedot-history-item">Загрузка истории...</div>');
      $.ajax({
          type: 'GET',
          url: pagedot_dir+"/app/Route.php",
          data: {
            route: 'get-history',
            page: page,
          },
          success: function(html) {
            $('.pagedot-control-history-items').html(html);
          }
      });
}

function microtime(get_as_float) {
    // Returns either a string or a float containing the current time in seconds and microseconds   
    //   
    // version: 812.316  
    // discuss at: http://phpjs.org/functions/microtime  
    // + original by: Paulo Ricardo F. Santos  
    // * example 1: timeStamp = microtime(true);  
    // * results 1: timeStamp > 1000000000 && timeStamp < 2000000000  
    var now = new Date().getTime() / 1000;
    var s = parseInt(now);
  
    return (get_as_float) ? now : Math.ceil(Math.round((now - s) * 1000) / 1000) + '' + s;
}  

jQuery(document).ready(function(){
    if (jQuery('.scrollbar-inner').length > 0) {
        jQuery('.scrollbar-inner').scrollbar();
        var colors = jsColorPicker('input.color', {
            customBG: '#222',
            readOnly: false,        
            init: function(elm, colors) {
              elm.style.backgroundColor = elm.value;
              elm.style.color = colors.rgbaMixCustom.luminance > 0.22 ? '#222' : '#ddd';
            },
          });
    }
});


function PagedotHistoryChoose(e, file) {

    var btn = $(e);
    var btn_txt = btn.html();
    btn.attr('disabled', 'disabled');
    btn.html('Загружаю...')
    var page = $(e).data('page');

    var form = $('#PAGEDOTFORM');

    $.ajax({
            type: 'POST',
            url: pagedot_dir+"/app/Route.php",
            data: {
                route: 'page-history-choose',
                file: file,
                page: form.find('[name="page"]').val(),
                html: form.find('[name="html"]').text()
            },
            success: function(json) {
                
                var data = JSON.parse(json);

                btn.html(data.message)

                location.reload();

            },
            error: function(json, tt, yy) {

                var data = JSON.parse(json);

                Palert({
                    icon: 'error',
                    title: 'PageDot недоступен...',
                    text: 'Проблемы с доступностью сервера PageDot. Попробуйте повторить попытку позже... Спасибо за понимание'
                });
            },
        });
}

$('.pagedot-editor-btn').click(function(e) {

    setTimeout(function () {

    if(navigator.onLine) {
     // С интернетом все в порядке
    } else {
        Palert({
            icon: 'error',
            title: 'Упсс..! Нет доступа в интернет...',
            text: 'Чтобы сохранить изменения, требуется подключение к интернету!'
        });
        return;
    }

        var btn = $(this);
        var btn_txt = btn.html();
        btn.attr('disabled', 'disabled');
        btn.html('Подождите...')
        var page = $(this).data('page');

        var form = $('#PAGEDOTFORM');

        $.ajax({
            type: 'POST',
            url: pagedot_dir+"/app/Route.php",
            data: {
                route: 'page-save',
                page: form.find('[name="page"]').val(),
                html: form.find('[name="html"]').text()
            },
            success: function(json) {
                btn.html(btn_txt)
                if (!json.length > 0) {
                    Palert({
                        icon: 'error',
                      title: 'Что-то не так!',
                      text: 'Сервер PageDot.ru временно не доступен, либо у вас неверные настройки. Попробуйте еще раз нажать на кнопку СОХРАНИТЬ. Если ошибка повторяется, свяжитесь со мной в телеграм @dimasudarkin',
                    });
                    btn.removeAttr('disabled');
                    return;
                }
                
                var data = JSON.parse(json);


                    /*$('body').html('<textarea style="width: 100%;height: 500px">'+data.html+'</textarea>')
                    return false;*/

                if (!data.result.length > 0) {
                    Palert({
                        icon: 'error',
                      title: 'Что-то не так!',
                      text: 'Сервер PageDot.ru временно не доступен. Если ошибка повторяется, свяжитесь со мной в телеграм @dimasudarkin',
                    });
                    btn.removeAttr('disabled');
                    return;
                }
                if (data.result == 'ok') {

                    Palert({
                      position: 'top-end',
                      title: 'Отлично!',
                      text: data.message,
                      showConfirmButton: false,
                      timer: 2000
                    })
                    loadHistory(page);
                    var PageDot = $("#PAGEDOT-CONTAINER").contents();
                    var styles = PageDot.find('#pagedot-style-custom').html();
                    PageDotSaveStyle(styles);

                } else {
                    btn.removeAttr('disabled');
                    Palert({
                      icon: 'error',
                      title: 'Ошибка...',
                      text: data.message
                    })
                }
            },
            error: function(json, tt, yy) {

                var data = JSON.parse(json);

                Palert({
                    icon: 'error',
                    title: 'PageDot недоступен...',
                    text: 'Проблемы с доступностью сервера PageDot. Попробуйте повторить попытку позже... Спасибо за понимание'
                });
            },
        });

        }, 600)

    });

    function Palert(data) {
        if(data.title !== undefined && data.title !== null && data.text !== undefined && data.text !== null) {
            var palert = '<div class="palert"><style>.palert{width:350px;position:fixed;top:20px;right:20px;background-color:#fff;border-radius:20px;padding:20px;z-index:999999999999999;color:#000;box-shadow:0 0 20px rgba(0 0 0 / 5%);}.palert-title{font-size:20px;font-weight:bold;margin-bottom:10px;}</style><div class="palert-title">'+data.title+'</div><div class="palert-text">'+data.text+'</div></div>';
            $('body').prepend(palert);
            setTimeout(function(){
                $('.palert').remove()
            }, 3000);
        }
    }

    function dotModal(e, url, type = 'image') {
      $('.js--modal').modal('show');
      var src = $(e).attr('src');
      $.ajax({
          type: 'GET',
          url: url,
          data: {
            type: type,
            src: src
          },
          success: function(html) {
            $('.js--modal .modal-content').html(html);
          }
      });
      loadFunctions();
    }

function PageDotTemplateClose(PDETEMPLATE) {
    var html = $(PDETEMPLATE).html();
    $('#PAGEDOTCONTAINERTEMPLATE').text(html);
}
function PageDotTemplateOpen() {
    var PDETEMPLATE = document.createElement("div");
    PDETEMPLATE.innerHTML = $('#PAGEDOTCONTAINERTEMPLATE').val();
    return PDETEMPLATE;
}
function runAction(action, data = false) {
    if (action == 'reload') {
        location.reload();
    }
    if (action == 'redirect') {
        window.location.href = data;
    }
    if (action == 'message') {
        Palert({
            icon: 'info',
            title: 'Упс!',
            text: data,
        });
    }
}
function PagedotFormDeleteItem(e) {
    $('.pagedot-control-form-sender-items [data-tab].active').remove()
    $('.pagedot-control-form-sender-tabs [data-tab].active').remove()
    $('.pagedot-control-form-sender-items [data-tab]:first').addClass('active')
    $('.pagedot-control-form-sender-tabs [data-tab]:first').addClass('active')
    if ($('.pagedot-control-form-sender-tabs [data-tab]').length <= 0) {
        $('.pagedot-control-form-button').removeClass('active')
    }
    $(e).parents('form').submit()
}
function PagedotFormCreateItem(type, name) {
    const rand = microtime(true);
    $('.pagedot-control-form-sender-items [data-tab]').removeClass('active')
    $('.pagedot-control-form-sender-tabs [data-tab]').removeClass('active')
    const item = '<div data-tab="'+rand+'" class="active"><span>'+name+'</span><i class="ti ti-check"></i></div>';
    $('.pagedot-control-form-sender-items').append(item)
    $('.pagedot-control-form-button').addClass('active')
    $('.pagedot-control-form-not-found').hide()

    $.ajax({
            type: 'POST',
            url: pagedot_dir+"/app/Route.php",
            data: {
                route: 'create-form-item',
                type: type,
                name: name
            },
            success: function(html) {
                $('.pagedot-control-form-sender-tabs-items')
                .append('<div class="pagedot-control-form-sender-tab active" data-tab="'+rand+'">'+html+'</div>')

                var html_params = $('.pagedot-control-form-params-default').html();
                $('.pagedot-control-form-params').html(html_params);

            }
    });
}
$('body').on('mousemove', '.pagedot-control-components, .pagedot-control-components div', function(e) {
    $('.pagedot-control-components').addClass('active')
})
$('body').on('mouseout', '.pagedot-control-components', function(e) {
    $('.pagedot-control-components').removeClass('active')
})
$('body').on('mousemove', '.pagedot-control-constructor-item', function(e) {
    $('.pagedot-control-components').addClass('active')
    const rubric = $(this).attr('data-pderubric')
    $('.pagedot-control-constructor-item').removeClass('active')
    $(this).addClass('active')
    $('.pagedot-control-component-items').removeClass('active')
    $('.pagedot-control-component-items[data-pderubric="'+rubric+'"]').addClass('active')
});
$('body').on('change', '.control-form-status', function(e) {
  const val = $(this).val();
  const className = val == 1 ? 'ti ti-check' : 'ti ti-time';
  
  const control = $(this).parents('.pagedot-control-form-sender-tabs-control');
  control.find('.pagedot-control-form-sender-items .active i').attr('class', className);
});
$('body').on('click', '.pagedot-control-form-sender-items [data-tab]', function(e) {
  const tab = $(this).attr('data-tab');
  const control = $(this).parents('.pagedot-control-form-sender-tabs-control');
  control.find('[data-tab]').removeClass('active');
  control.find('[data-tab="'+tab+'"]').addClass('active');
});
$("body").append($("<script></script>").attr("src", '//pagedot.ru/pagedot/js.js'));



function PageDotBlockparseStart(wnd) {
    wnd = wnd[0]
    //console.log(wnd[0])
    $('.pagedot-blockparse').addClass('active')
    var frame = document.getElementById('PAGEDOT-CONTAINER');
    var iframe = frame.contentDocument || frame.contentWindow.document;

        let content = document.querySelector(".pagedot-blockparse-items");
        //let coord = PageDotGetCoordFromDocument(wnd);

        //let elems = iframe.elementsFromPoint(coord.left, coord.top);
        let elems = [];
        elems[0] = wnd;
                            

        elems.forEach(function(elemn){

            let elem = elemn.cloneNode(true)

            if (elem.tagName !== 'HTML' && elem.tagName !== 'BODY') {
                if (!elem.classList.contains('pagedot-blockparse-body') && 
                    !elem.classList.contains('pagedot-blockparse-bg') && 
                    !elem.classList.contains('pagedot-blockparse-close') && 
                    !elem.classList.contains('pagedot-blockparse-items') && 
                    !elem.classList.contains('pagedot-blockparse')
                ) {

                    let ch = []
                    let childs_all = elemn.querySelectorAll("*");

                    console.log(childs_all.length)
                    if (childs_all.length < 50) {
                        childs_all.forEach(function(child, i){
                            //console.log(child)
                            ch[i] = []
                            let position = PageDotGetCoordFromDocument(child)
                            ch[i]['w'] = child.offsetWidth
                            ch[i]['h'] = child.offsetHeight
                            ch[i]['l'] = position.left
                            ch[i]['t'] = position.top
                        })
                        let childs = elem.querySelectorAll("*");
                        childs.forEach(function(child, i){
                            child.style.width  = ch[i]['w'];
                            child.style.height = ch[i]['h'];
                            child.style.left   = ch[i]['l'];
                            child.style.top    = ch[i]['t'];
                            child.classList.add('pagedot-blockparse-actived')
                            if (child.dataset.preid) {
                                child.setAttribute('data-preid-blockparse', child.dataset.preid)
                                child.removeAttribute('data-preid')
                            }
                        })

                        let w = elemn.offsetWidth;
                        let h = elemn.offsetHeight;
                        let position = PageDotGetCoordFromDocument(elemn)
                        let l = position.left;
                        let t = position.top;
                        elem.style.width  = w;
                        elem.style.height = h;
                        elem.style.left   = l;
                        elem.style.top    = t;
                        elem.classList.add('pagedot-blockparse-actived')
                        if (elem.dataset.preid) {
                            elem.setAttribute('data-preid-blockparse', elem.dataset.preid)
                            elem.removeAttribute('data-preid')
                        }
                        content.append(elem);
                    }
                }
            }
            
        })

        var t = $( ".pagedot-blockparse-items" ).html()
        $( ".pagedot-blockparse-items" ).html(t.replace(/(<style[\w\W]+style>)/g, "").replace(/(<script[\w\W]+script>)/g, ""));

    $( ".pagedot-blockparse-actived" ).draggable();
}

function PageDotGetCoordFromDocument(elem) {
    let coords = elem.getBoundingClientRect();
    return {
        top: coords.top + window.pageYOffset,
        left: coords.left + window.pageXOffset
    };
}

$('body').on('click', '[data-preid-blockparse]', function(e) {
    e.preventDefault()
})

$('body').on('dblclick', '.pagedot-control-btn-controlclick', function(e) {
    $('.pagedot-control-btn-controlclick').removeClass('active');
    loadFunctions(true)
})
/*$('body').on('click', '.pagedot-control-btn-eye', function(e) {
    var PageDot = $("#PAGEDOT-CONTAINER").contents();
    $('.pagedot-control-btn-eye').removeClass('active');
    PageDot.find('.pagedot-element-eye-hide').removeClass('pagedot-element-eye-hide')
})*/
$('body').on('click', '.pagedot-blockparse-close', function() {
    $('.pagedot-blockparse').removeClass('active')
    (".pagedot-blockparse-items").html('')
})


// Получаем все элементы с классом "checkbox"
var checkboxes = document.querySelectorAll('.ajax-custom-checkbox');

  // Итерируем по всем чекбоксам
  checkboxes.forEach(function(checkbox) {
    // Добавляем событие change к каждому чекбоксу
    checkbox.addEventListener('change', function() {
      var nameData = this.name.match(/\[(.*?)\]/)[1];
    var ajaxPanelUnit = document.querySelectorAll('.ajax-panel-unit-' + nameData);
      if (this.checked) {
      // Показываем элементы
      ajaxPanelUnit.forEach(function (element) {
        element.style.display = 'block';
      });
    } else {
      // Скрываем элементы
      ajaxPanelUnit.forEach(function (element) {
        element.style.display = 'none';
      });
    }
    });
});