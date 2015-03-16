var O365Libraries = [
    'services/office365/settings/settings.js',
    'services/office365/scripts/InAppBrowserOverride.js',
    'services/office365/scripts/utility.js',
    'services/office365/scripts/o365auth.js',
    'services/office365/scripts/o365discovery.js',
    'services/office365/scripts/aadgraph.js',
    'services/office365/scripts/exchange.js',
    'services/office365/scripts/sharepoint.js'
];

O365Libraries.forEach(function (path, index, array) {
    var scriptTag = document.createElement('script');
    scriptTag.setAttribute('src', path);
    document.head.appendChild(scriptTag).parentNode.removeChild(scriptTag);
});
