'use strict';

// Script heavily based off of the scripts from json-server.
// Makes a request to fetch APIs, then builds a cute little table for them.

// Resource list
var db = {};

m.request('db').then(function(data) {
    db = data;
});

m.mount(document.getElementById('resources'), {
    view: function view() {
        var tableHeader = m('tr', [
            m('th', 'Name'), 
            m('th', 'Data'),
            m('th', 'Documentation'),
            m('th', 'Record Count')
        ]);
        var keys = Object.keys(db);
        var resourceList = m('table', [tableHeader, keys.map(function(key) {
            return m('tr', [
                m('td', key), 
                m('td', m('a', {href: key}, 'JSON Data')),
                m('td', m('a', {href: 'documentation/#/'+key}, 'Swagger Docs')),
                m('td', db[key].length)
            ]);
        })]);

        return [m('h4', 'Available APIs'), m('table', keys.length ? resourceList : m('table', m('tr', m('td', {colspan: 4}, 'No resources found'))))];
    }
});

// Custom routes
var customRoutes = {};

m.request('__rules').then(function(data) {
    customRoutes = data;
});

m.mount(document.getElementById('custom-routes'), {
    view: function view() {
        var rules = Object.keys(customRoutes);
        if (rules.length) {
            return [m('h4', 'Custom routes'), m('table', rules.map(function(rule) {
                return m('tr', [m('td', rule), m('td', '⇢ ' + customRoutes[rule])]);
            }))];
        }
    }
});