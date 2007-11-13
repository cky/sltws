/*
 * Copyright © 2007 Chris K. Jester-Young.
 *
 * This file is part of Scriptlet Workshop.
 *
 * Scriptlet Workshop is free software: you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Scriptlet Workshop is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with Scriptlet Workshop.  If not, see <http://www.gnu.org/licenses/>.
 */

var method_sigs = {
    init: ['applet'],
    start: ['applet'],
    paint: ['applet', 'g'],
    stop: ['applet'],
    destroy: ['applet']
};
var default_show = 'paint';

var canvas = document.getElementById('canvas');
var content = document.getElementById('content');
var console = document.getElementById('console');
var run_button = document.getElementById('run_button');
var close_button = document.getElementById('close_button');
var clear_button = document.getElementById('clear_button');

function method_sig(name) {
    return name + '(' + method_sigs[name].join() + ')';
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
    for (var method in method_sigs)
        showhide_item(method);
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
    result.addEventListener('change', showhide_content, false);
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

function make_param(name, value) {
    var result = document.createElement('param');
    result.name = name;
    result.value = value;
    return result;
}

function make_applet(params) {
    var result = document.createElement('applet');
    result.id = 'scriptlet';
    result.code = 'com.sun.scriptlet.Scriptlet';
    result.archive = 'scriptlet.jar';
    result.style.width = '100%';
    result.style.height = '100%';
    result.setAttribute('mayscript', 'true');
    result.appendChild(make_param('id', 'backend'));
    result.appendChild(make_param('scriptsrc', 'sltws-back.js'));
    for (var name in params)
        result.appendChild(make_param(name, params[name]));
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
    for (var method in method_sigs)
        populate_item(method);
}

function onload() {
    populate_content();
    showhide_content();
}

function run_applet() {
    var params = {};
    for (var method in method_sigs)
        params[method] = textarea_id(method);
    var applet = make_applet(params);
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
    for (var method in method_sigs)
        clear_field(method);
}

document.body.addEventListener('load', onload, false);
run_button.addEventListener('click', run_applet, false);
close_button.addEventListener('click', close_applet, false);
clear_button.addEventListener('click', clear_fields, false);
