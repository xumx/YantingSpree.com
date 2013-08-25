Exchange = new Meteor.Collection('rates');

Merchant = new Meteor.Collection('merchants');
Spree = new Meteor.Collection('sprees');
Order = new Meteor.Collection('orders');

Payment = new Meteor.Collection('payments');

YTCollections = {
  'rates': Exchange,
  'merchants': Merchant,
  'sprees': Spree,
  'orders': Order,
  'payments': Payment
}

Merchant.allow({
  insert: function(userId, doc) {
    return (Roles.userIsInRole(userId, ['admin']));
  },
  update: function(userId, doc, fields, modifier) {
    return (Roles.userIsInRole(userId, ['admin']));
  },
  remove: function(userId, doc) {
    return (Roles.userIsInRole(userId, ['admin']));
  }
});

Spree.allow({
  insert: function(userId, doc) {
    return (Roles.userIsInRole(userId, ['admin']));
  },
  update: function(userId, doc, fields, modifier) {
    return (Roles.userIsInRole(userId, ['admin']));
  },
  remove: function(userId, doc) {
    return (Roles.userIsInRole(userId, ['admin']));
  }
});

Order.allow({
  insert: function(userId, doc) {
    return (userId && doc.user === userId);
  },
  update: function(userId, doc, fields, modifier) {
    return (userId && (doc.user === userId || Roles.userIsInRole(userId, ['admin'])));
  },
  remove: function(userId, doc) {
    return (userId && (doc.user === userId || Roles.userIsInRole(userId, ['admin'])));
  }
});

Payment.allow({
  insert: function(userId, doc) {
    return (userId && doc.user === userId);
  },
  update: function(userId, doc, fields, modifier) {
    return (userId && (doc.user === userId || Roles.userIsInRole(userId, ['admin'])));
  },
  remove: function(userId, doc) {
    return (userId && (doc.user === userId || Roles.userIsInRole(userId, ['admin'])));
  }
});