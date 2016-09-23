/**
 * @fileOverview Общие методы Views для создания нового и редактирования существующего контактов
 */

'use strict';

ContactManager.module('ContactsApp.Common.Views', function(Views, ContactManager, Backbone, Marionette, $, _) {
  Views.Form = Marionette.ItemView.extend({
    template: '#contact-form',

    events: {
      'click .js-submit': 'submitClicked'
    },

    submitClicked: function(e) {
      e.preventDefault();
      // используем библиотеку Backbone.Syphon для удобного извлечения
      // данных из полей формы (по атрибутам name у тегов input)
      var data = Backbone.Syphon.serialize(this);
      this.trigger('form:submit', data);
    },

    onFormDataInvalid: function(errors) {
      var $view = this.$el;

      // очищение формы от ошибок
      var clearFormErrors = function() {
        var $form = $view.find('form');
        $form.find('.help-block.has-error').each(function() {
          $(this).remove();
        });
        $form.find('.control-group.has-error').each(function() {
          $(this).removeClass('has-error');
        });
      };

      // выделение ошибок
      var markErrors = function(value, key) {
        var $controlGroup = $view.find('#contact-' + key).parent();
        var $errorEl = $('<span>', { class: 'help-block has-error', text: value });
        $controlGroup.append($errorEl).addClass('has-error');
      };

      clearFormErrors();

      _.each(errors, markErrors);
    }
  });
});
