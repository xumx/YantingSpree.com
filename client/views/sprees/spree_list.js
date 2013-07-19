Template.spreeList.helpers({
	sprees: function() {
		return Spree.find();
	},
	getMerchant: function(id, options) {
		return options.fn(Merchant.findOne(id));
	}
});
