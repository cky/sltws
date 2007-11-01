/* Copyright (c) 2007 C. K. Jester-Young, GPLv3 */

var methods = ['init', 'start', 'paint', 'stop', 'destroy'];
var default_show = 'paint';
var extra_args = {'paint': ['g']};

var canvas = document.getElementById('canvas');
var content = document.getElementById('content');
var console = document.getElementById('console');
var run_button = document.getElementById('run_button');
var close_button = document.getElementById('close_button');
var clear_button = document.getElementById('clear_button');

function method_sig(name) {
    var args = ['applet'];
    if (extra_args[name])
        args.push(extra_args[name]);
    return name + '(' + args.join() + ')';
}

function radio_id(name) {
    return 'radio_' + name;
}

function textarea_id(name) {
    return 'text_' + name;
}

function get_radio(name) {
    return document.getElementById(radio_id(name));
}

function get_textarea(name) {
    return document.getElementById(textarea_id(name));
}

function showhide_item(name) {
    var radio = get_radio(name);
    var textarea = get_textarea(name);
    if (radio && textarea)
        textarea.style.display = radio.checked ? 'inline' : 'none';
}

function showhide_content() {
    for (var i in methods)
        showhide_item(methods[i]);
}

function make_textnode(text) {
    return document.createTextNode(text);
}

function make_br() {
    return document.createElement('br');
}

function make_radio(name, checked) {
    var result = document.createElement('input');
    result.type = 'radio';
    result.id = radio_id(name);
    result.name = 'method';
    result.checked = checked;
    result.addEventListener('change', function () {showhide_content()}, false);
    return result;
}

function make_textbox(name) {
    var result = document.createElement('textarea');
    result.id = textarea_id(name);
    result.name = result.id;
    result.rows = 16;
    result.cols = 64;
    return result;
}

function make_applet(params) {
    var result = document.createElement('applet');
    result.code = 'com.sun.scriptlet.Scriptlet';
    result.archive = 'scriptlet.jar';
    result.style.width = '100%';
    result.style.height = '100%';
    result.setAttribute('mayscript', 'true');
    for (var name in params) {
        var param = document.createElement('param');
        param.name = name;
        param.value = params[name];
        result.appendChild(param);
    }
    return result;
}

function populate_item(name) {
    var div = document.createElement('div');
    var label = document.createElement('label');
    label.appendChild(make_radio(name, name == default_show));
    label.appendChild(make_textnode('Edit ' + method_sig(name) + ':'));
    div.appendChild(label);
    div.appendChild(make_br());
    div.appendChild(make_textbox(name));
    content.appendChild(div);
}

function populate_content() {
    for (var i in methods)
        populate_item(methods[i]);
}

function onload() {
    populate_content();
    showhide_content();
}

function create_function(name) {
    var textarea = get_textarea(name);
    return textarea.value ? 'function ' + method_sig(name) + '{' + textarea.value + '}' : '';
}

function run_applet() {
    var script = '';
    for (var i in methods)
        script += create_function(methods[i]);
    var applet = make_applet({"script": script});
    if (canvas.hasChildNodes())
        canvas.replaceChild(applet, canvas.firstChild);
    else
        canvas.appendChild(applet);
}

function close_applet() {
    if (canvas.hasChildNodes())
        canvas.removeChild(canvas.firstChild);
}

function clear_field(name) {
    var textarea = get_textarea(name);
    textarea.value = '';
}

function clear_fields() {
    for (var i in methods)
        clear_field(methods[i]);
}

document.body.addEventListener('load', function () {onload()}, false);
run_button.addEventListener('click', function () {run_applet()}, false);
close_button.addEventListener('click', function () {close_applet()}, false);
clear_button.addEventListener('click', function () {clear_fields()}, false);
