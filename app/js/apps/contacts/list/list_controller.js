/**
 * @fileOverview Подмодуль Controller субприложения для отображения списка контактов
 */

'use strict';

ContactManager.module('ContactsApp.List', function(List, ContactManager, Backbone, Marionette) {
  List.Controller = {
    listContacts: function(criterion) {
      // отображение индикатора загрузки
      var loadingView = new ContactManager.Common.Views.Loading();
      ContactManager.mainRegion.show(loadingView);

      // получаем коллекцию при помощи request
      var promise = ContactManager.request('contact:entities');

      var contactsListLayout = new List.Layout();
      var contactsListPanel = new List.Panel();

      promise.then(function(contacts) {
        // пропускаем контакты через фильтр
        var filteredContacts = ContactManager.Entities.FilteredCollection({
          collection: contacts,
          filterFunction: function(filterCriterion) {
            var criterion = filterCriterion.toLowerCase();
            return function(contact) {
              if (contact.get('firstName').toLowerCase().indexOf(criterion) !== -1
                || contact.get('lastName').toLowerCase().indexOf(criterion) !== -1
                || contact.get('phoneNumber').toLowerCase().indexOf(criterion) !== -1) {
                return contact;
              }
            };
          }
        });

        if (criterion) {
          filteredContacts.filter(criterion);
          contactsListPanel.once('show', function() {
            contactsListPanel.triggerMethod('set:filter:criterion', criterion);
          });
        }

        // создаем View для коллекции
        var contactsListView = new List.Contacts({
          collection: filteredContacts
        });

        contactsListLayout.on('show', function() {
          contactsListLayout.panelRegion.show(contactsListPanel);
          contactsListLayout.contactsRegion.show(contactsListView);
        });

        contactsListPanel.on('contact:new', function() {
          var newContact = new ContactManager.Entities.Contact();
          var view = new ContactManager.ContactsApp.New.Contact({
            model: newContact
          });

          view.on('form:submit', function(data) {
            var highestId = contacts.max(function(c) {
              return c.id;
            });
            highestId = highestId.get('id');
            data.id = highestId + 1;

            if (newContact.save(data)) {
              contacts.add(newContact);
              view.trigger('dialog:close');
              var newContactView = contactsListView.children.findByModel(newContact);
              if (newContactView) {
                newContactView.flash('success');
              }
            } else {
              view.triggerMethod('form:data:invalid', newContact.validationError);
            }
          });

          ContactManager.dialogRegion.show(view);
        });

        contactsListPanel.on('contacts:filter', function(filterCriterion) {
          filteredContacts.filter(filterCriterion);
          ContactManager.trigger('contacts:filter', filterCriterion);
        });

        contactsListView.on('childview:contact:delete', function(childView, model) {
          model.destroy();
        });

        contactsListView.on('childview:contact:show', function(childView, model) {
          ContactManager.trigger('contact:show', model.get('id'));
        });

        contactsListView.on('childview:contact:edit', function(childView, model) {
          var view = new ContactManager.ContactsApp.Edit.Contact({
            model: model
          });

          view.on('form:submit', function(data) {
            if (model.save(data)) {
              childView.render();
              view.trigger('dialog:close');
              childView.flash('success');
            } else {
              view.triggerMethod('form:data:invalid', model.validationError);
            }
          });

          ContactManager.dialogRegion.show(view);
        });

        // передаем Layout в регион
        ContactManager.mainRegion.show(contactsListLayout);
      });
    }
  };
});
