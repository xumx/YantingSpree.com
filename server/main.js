Meteor.startup(function() {
	// createUserAdminRoles();
	Meteor.publish('all', function() {

		if (Roles.userIsInRole(this.userId, ['admin'])) {

			return [Exchange.find(), Spree.find(), Merchant.find(), Order.find(), Payment.find()]

		} else {

			return [Exchange.find(), Spree.find(), Merchant.find(), Order.find({
				user: this.userId
			}), Payment.find({
				user: this.userId
			})];
			return;

		}
	});


	// Meteor.publish("userData", function () {
	// 	return Meteor.users.find({_id: this.userId},
	// 		{fields: {'other': 1, 'things': 1}});
	// });
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
	},
	resolvePostalCode: function(postalcode) {
		var code = _.find(POSTALCODE, function(row) {
			return (row[0] == parseInt(postalcode));
		});

		if (code) {
			return code[1];
		} else {
			return '';
		}
	}
});

new Meteor.Cron({
	events: {
		"0 0 * * *": function() {
			//Auto Close Sprees
			// Spree.find({status:"open"}).fetch();
		}
	}
});