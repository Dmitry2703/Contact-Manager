/**
 * @fileOverview Подмодуль View субприложения для отображения списка контактов
 */

'use strict';

ContactManager.module('ContactsApp.List', function(List, ContactManager, Backbone, Marionette) {
  List.Layout = Marionette.LayoutView.extend({
    template: '#contact-list-layout',

    regions: {
      panelRegion: '#panel-region',
      contactsRegion: '#contacts-region'
    }
  });

  List.Panel = Marionette.ItemView.extend({
    template: '#contact-list-panel',

    triggers: {
      'click .js-new': 'contact:new'
    },

    events: {
      'submit #filter-form': 'filterContacts'
    },

    ui: {
      criterion: 'input.js-filter-criterion'
    },

    filterContacts: function(e) {
      e.preventDefault();
      var criterion = this.$('.js-filter-criterion').val();
      this.trigger('contacts:filter', criterion);
    },

    onSetFilterCriterion: function(criterion) {
      this.ui.criterion.val(criterion);
    }
  });

  var NoContactsView = Marionette.ItemView.extend({
    template: '#contact-list-none',
    tagName: 'tr',
    className: 'warning'
  });

  List.Contact = Marionette.ItemView.extend({
    tagName: 'tr',
    template: '#contact-list-item',

    events: {
      'click .js-show': 'showClicked',
      'click .js-edit': 'editClicked',
      'click .js-delete': 'deleteClicked'
    },

    // подсвечиваем строку с измененным контактом зеленым цветом
    flash: function(cssClass) {
      var $view = this.$el;
      $view.hide().toggleClass(cssClass).fadeIn(800, function() {
        setTimeout(function() {
          $view.toggleClass(cssClass);
        }, 500);
      });
    },

    // вешаем триггер на удаление модели
    // Этот триггер будет срабатывать в контроллере,
    // в котором добавляется обработчик события
    deleteClicked: function() {
      this.trigger('contact:delete', this.model);
    },

    showClicked: function(e) {
      e.preventDefault();
      this.trigger('contact:show', this.model);
    },

    editClicked: function(e) {
      e.preventDefault();
      this.trigger('contact:edit', this.model);
    },

    // при удалении модели Marionette вызывает метод remove
    // на соответствующем ItemView
    remove: function() {
      var self = this;
      this.$el.fadeOut(function() {
        Marionette.ItemView.prototype.remove.call(self);
      });
    }
  });

  // // создаем View для коллекции
  // List.Contacts = Marionette.CollectionView.extend({
  //   tagName: 'table',
  //   className: 'table table-hover',
  //   childView: List.Contact
  // });

  // для того чтобы добавить шапку таблице, нужно использовать CompositeView
  // вместо CollectionView
  List.Contacts = Marionette.CompositeView.extend({
    tagName: 'table',
    className: 'table table-hover',
    template: '#contact-list',
    emptyView: NoContactsView,
    childView: List.Contact,
    childViewContainer: 'tbody',

    // для того чтобы не сломалась сортировка
    initialize: function() {
      this.listenTo(this.collection, 'reset', function() {
        this.attachHtml = function(collectionView, itemView, index) {
          collectionView.$el.prepend(itemView.el);
        };
      });
    },

    // вновь создаваемый контакт помещаем в начало списка
    onAttach: function() {
      this.attachHtml = function(collectionView, itemView, index) {
        collectionView.$el.prepend(itemView.el);
      };
    }
  });
});
