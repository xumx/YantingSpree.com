var cheerio = Npm.require('cheerio');

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
	},
	fetchImage: function(url) {
		var supportedSites = ['forever21.com', 'asos.com'];
		var matches = url.match(/^https?\:\/\/w*\.?([^\/:?#]+)(?:[\/:?#]|$)/i);
		var domain = matches && matches[1];
		var result = {};

		console.log(domain);

		if (_.contains(supportedSites, domain)) {
			$ = cheerio.load(Meteor.http.get(url).content);
			switch (domain) {
				case 'forever21.com':
					result.thumbnail = $('#ctl00_MainContent_productZoomLink').attr('href');
					result.name = $('.product-title').text();
					result.price = parseFloat($('.product-price').text().match(/\d+\.?\d*/));
					result.code = $('#product_overview').text().match(/Product Code\D+(\d+)/i)[1];
					break;
				case 'asos.com':
					result.thumbnail = $('#ctl00_ContentMainPage_imgMainImage').attr('src');
					result.name = $('.product_title').text();

					//Price in SGD?
					result.price = parseFloat($('.product_price_details').text().match(/\d+\.?\d*/));
					break;
			}
			return result;
		} else {
			console.log('not supported');
			return;
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