Meteor.startup(function() {
	Meteor.publish('all', function() {
		return [Exchange.find(), Spree.find(), Merchant.find(), Order.find({
			user: '122'
		})];
	});
});


new Meteor.Cron({
	events: {
		"0 0 * * *": function() {
			//Auto Close Sprees
			// Spree.find({status:"open"}).fetch();
		}
	}
})