/**
 * @fileOverview Роутер для субприложения Контакты
 */

'use strict';

ContactManager.module('ContactsApp', function(ContactsApp, ContactManager, Backbone, Marionette) {
  ContactsApp.Router = Marionette.AppRouter.extend({
    // объект appRoutes:
    // ключ: URL (hash),
    // значение: метод контроллера, который передается при инициализации роутера
    appRoutes: {
      'contacts(/filter/criterion::criterion)': 'listContacts',
      'contacts/:id': 'showContact',
      'contacts/:id/edit': 'editContact'
    }
  });

  var API = {
    listContacts: function(criterion) {
      ContactsApp.List.Controller.listContacts(criterion);
      ContactManager.execute('set:active:header', 'contacts');
    },
    showContact: function(id) {
      ContactsApp.Show.Controller.showContact(id);
      ContactManager.execute('set:active:header', 'contacts');
    },
    editContact: function(id) {
      ContactsApp.Edit.Controller.editContact(id);
      ContactManager.execute('set:active:header', 'contacts');
    }
  };

  // когда сработает триггер contacts:list в файле app.js,
  // вызовется эта функция, и отобразится список контактов
  ContactManager.on('contacts:list', function() {
    ContactManager.navigate('contacts');
    API.listContacts();
  });

  // когда сработает триггер contact:show в файле list_controller.js,
  // вызовется эта функция, и отобразится контакт с заданным id
  ContactManager.on('contact:show', function(id) {
    ContactManager.navigate('contacts/' + id);
    API.showContact(id);
  });

  ContactManager.on('contact:edit', function(id) {
    ContactManager.navigate('contacts/' + id + '/edit');
    API.editContact(id);
  });

  ContactManager.on('contacts:filter', function(criterion) {
    if (criterion) {
      ContactManager.navigate('contacts/filter/criterion:' + criterion);
    } else {
      ContactManager.navigate('contacts');
    }
  });

  // инициализация роутера
  // кроме этого необходимо запустить Backbone.history в файле app.js
  ContactManager.on('before:start', function() {
    new ContactsApp.Router({
      controller: API
    });
  });
});
