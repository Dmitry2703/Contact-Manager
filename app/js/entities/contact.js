/**
 * @fileOverview Сущность Контакты
 */

'use strict';

ContactManager.module('Entities', function(Entities, ContactManager, Backbone, Marionette, $, _) {

  // создаем модель
  Entities.Contact = Backbone.Model.extend({
    urlRoot: 'contacts', // в нашем случае совпадает с url коллекции

    // свойства по умолчанию
    defaults: {
      firstName: '',
      lastName: '',
      phoneNumber: ''
    },

    // встроенный в Backbone метод валидации форм
    validate: function(attrs, options) {
      var errors = {};
      if (!attrs.firstName) {
        errors.firstName = 'can\'t be blank';
      }
      if (!attrs.lastName) {
        errors.lastName = 'can\'t be blank';
      } else {
        if (attrs.lastName.length < 2) {
          errors.lastName = 'too short';
        }
      }
      if (!_.isEmpty(errors)) {
        return errors;
      }
    }
  });

  Entities.configureStorage(Entities.Contact);

  // создаем коллекцию
  Entities.ContactCollection = Backbone.Collection.extend({
    url: 'contacts', // фейковый урл, по которому Marionnete будет якобы подключаться к серверу
    model: Entities.Contact,

    // правило сортировки сущностей в коллекции
    comparator: function(contact) {
      return contact.get('firstName') + contact.get('lastName');
    }
  });

  Entities.configureStorage(Entities.ContactCollection);

  var contacts;

  // функция для наполнения контактов
  var initializeContacts = function() {
    contacts = new Entities.ContactCollection([
      {
        id: 1,
        firstName: 'Dmitry',
        lastName: 'Meshcheryakov',
        phoneNumber: '89529272725'
      },
      {
        id: 2,
        firstName: 'Anna',
        lastName: 'Meshcheryakova',
        phoneNumber: '89529272724'
      },
      {
        id: 3,
        firstName: 'Fantik',
        lastName: 'Meshcheryakov',
        phoneNumber: 'none'
      },
      {
        id: 4,
        firstName: 'Anna',
        lastName: 'Ivanova',
        phoneNumber: '89529272727'
      },
      {
        id: 5,
        firstName: 'Anna',
        lastName: 'Petrove',
        phoneNumber: '89529272728'
      },
      {
        id: 6,
        firstName: 'Anna',
        lastName: 'Sidorova',
        phoneNumber: '89529272729'
      }
    ]);
    contacts.forEach(function(contact) {
      contact.save();
    });

    return contacts;
  };

  // имитация API для модуля
  var API = {
    getContactEntities: function() {
      // if (contacts === undefined) {
      //   initializeContacts();
      // }
      var contacts = new Entities.ContactCollection();
      var promise = new Promise(function(resolve) {
        contacts.fetch({
          success: function(data) {
            resolve(data);
          }
        });
      });

      return promise.then(function(contacts) {
        // если контактов в localStorage нет, то наполняем его
        if (contacts.length === 0) {
          return initializeContacts();
        } else {
          return contacts;
        }
      });
    },

    getContactEntity: function(contactId) {
      var contact = new Entities.Contact({
        id: contactId
      });

      return new Promise(function(resolve) {
        // имитация серверной задержки
        setTimeout(function() {
          contact.fetch({
            success: function(data) {
              resolve(data);
            },
            error: function() {
              resolve(undefined);
            }
          });
        }, 500);
      });
    }
  };

  // регистрируем обработчик события
  ContactManager.reqres.setHandler('contact:entities', function() {
    return API.getContactEntities();
  });

  ContactManager.reqres.setHandler('contact:entity', function(id) {
    return API.getContactEntity(id);
  });
});
