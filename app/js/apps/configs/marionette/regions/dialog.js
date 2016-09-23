/**
 * @fileOverview Расширение стандартного класса Marionette.Region
 */

'use strict';

Marionette.Region.Dialog = Marionette.Region.extend({
  onShow: function(view) {
    this.listenTo(view, 'dialog:close', this.closeDialog);

    var self = this;
    this.$el.dialog({
      modal: true,
      title: view.title,
      width: 'auto',
      close: function() {
        self.closeDialog();
      }
    });
  },

  closeDialog: function() {
    this.stopListening();
    this.$el.dialog('destroy');
    this.reset();
  }
});