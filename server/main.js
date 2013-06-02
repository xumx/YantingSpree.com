Meteor.startup(function() {
	Meteor.publish('all', function() {
		return [Exchange.find(), Spree.find(), Merchant.find(), Order.find({user:'122'})];
	});
});


