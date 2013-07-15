Meteor.startup(function() {
	Meteor.publish('all', function() {
		return [Exchange.find(), Spree.find(), Merchant.find(), Order.find({
			user: '122'
		})];
	});
});

Meteor.methods({
	sendMail: function(from, subject, body) {
		check([from, subject, body], [String]);

		// Let other method calls from the same client start running,
		// without waiting for the email sending to complete.
		this.unblock();

		Email.send({
			from: from,
			to: 'deepthought@gmail.com',
			cc: 'ffortunata.2011@sis.smu.edu.sg',
			// to: 'yanting_spree@hotmail.com',
			subject: 'Email from YantingSpree.com',
			html: body
		}, callback);
	}
});

new Meteor.Cron({
	events: {
		"0 0 * * *": function() {
			//Auto Close Sprees
			// Spree.find({status:"open"}).fetch();
		}
	}
})