/**
 * @fileOverview Объявление приложения
 * указываем регионы и действия, которые необходимо выполнить после инициализации приложения
 */

'use strict';

// создаем новое приложение
var ContactManager = new Marionette.Application();

// указываем регион для приложения.
// Это объект:
// имя свойства: название региона,
// значение: jQuery-селектор, куда вставляется View
ContactManager.addRegions({
  headerRegion: '#header-region',
  mainRegion: '#main-region',
  dialogRegion: Marionette.Region.Dialog.extend({
    el: '#dialog-region'
  })
});

ContactManager.navigate = function(route, options) {
  options || (options = {});
  Backbone.history.navigate(route, options);
};

ContactManager.getCurrentRoute = function() {
  return Backbone.history.fragment;
};

// запускаем приложение, вызывая метод контроллера из list_controller.js
// ContactManager.on('start', function() {
//   ContactManager.ContactsApp.List.Controller.listContacts();
// });

ContactManager.on('start', function() {
  if (Backbone.history) {
    Backbone.history.start();
  }

  // прописываем путь по умолчанию
  if (this.getCurrentRoute() === '') {
    ContactManager.trigger('contacts:list');
  }
});
