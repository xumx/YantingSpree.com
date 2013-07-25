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
});

Meteor.methods({
	sendMail: function(to, subject, body, from) {
		from = from || 'service@yantingspree.com';

		this.unblock();

		Email.send({
			from: from,
			to: to,
			subject: subject,
			html: body,
			cc: 'ffortunata.2011@sis.smu.edu.sg'
		});
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

Accounts.onCreateUser(function(options, user) {

	console.dir(options);
	user.profile = {
		"name": options.username
	}
	return user;
});