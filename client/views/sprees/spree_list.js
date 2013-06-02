Template.spreeList.helpers({
	sprees: function() {
		return Spree.find();
	},
	isAdmin: function() {
		return Session.get('isAdmin');
	},
	getMerchant: function(id, options) {
		return options.fn(Merchant.findOne(id));
	}
});
