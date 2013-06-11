console.time('loadData');

if (Meteor.users.find({username:"admin"}).count === 0) {
	Accounts.createUser({
		username: "admin",
		password: "admin",
		email: "",
		profile: {
			name: "Max Xu"
		}
	}, function (msg) {
		console.log(msg)
	});
}

if (Exchange.find().count() === 0) {
	Exchange.insert({
		currency: 'USD',
		rate: 1.33
	});
	Exchange.insert({
		currency: 'AUD',
		rate: 1.4
	});
	Exchange.insert({
		currency: 'GBP',
		rate: 2.13
	});
	Exchange.insert({
		currency: 'EUR',
		rate: 1.77
	});
	Exchange.insert({
		currency: 'HKD',
		rate: 1.38
	});
	Exchange.insert({
		currency: 'RMB',
		rate: 0.22
	});
	Exchange.insert({
		currency: 'NT',
		rate: 0.046
	});
	Exchange.insert({
		currency: 'KRW',
		rate: 0.00125
	});
}

if (Merchant.find().count() === 0) {
	Merchant.insert({
		_id: 'Forever 21',
		url: 'http://www.forever21.com',
		speed: '3~4 weeks',
		shipping: '$4.20 SGD per unit',
		currency: 'USD',
		cap: '$USD 300',
		open: true
	});

	Merchant.insert({
		_id: 'Victoria Secret',
		url: 'http://www.victoriassecret.com',
		speed: '2~4 weeks',
		shipping: '$3.20 SGD per unit',
		currency: 'AUD',
		cap: '$USD 300',
		open: false
	});

	Merchant.insert({
		_id: 'Coastal Scents',
		url: 'http://www.coastalscents.com/',
		speed: '2~4 weeks',
		shipping: '$3.20 SGD per unit',
		currency: 'EUR',
		cap: '$AUD 300',
		open: false
	});

	Merchant.insert({
		_id: 'Victoria 3',
		url: 'http://www.victoriassecret.com',
		speed: '2~4 weeks',
		shipping: '$3.20 SGD per unit',
		currency: 'EUR',
		cap: '$USD 300',
		open: false
	});

	Merchant.insert({
		_id: 'Victoria 4',
		url: 'http://www.victoriassecret.com',
		speed: '2~4 weeks',
		shipping: '$3.20 SGD per unit',
		currency: 'USD',
		cap: '$USD 300',
		open: false
	});
}


if (Spree.find().count() === 0) {
	var id = Spree.insert({
		merchant: 'Forever 21',
		status: 'close',
		startDate: new Date('20 May 2013'),
		endDate: new Date('30 May 2013'),
		counter: 11,
	});

	var id = Spree.insert({
		merchant: 'Forever 21',
		status: 'open',
		startDate: new Date('20 May 2013'),
		endDate: new Date('30 May 2013'),
		counter: 13,
	});

	Order.insert({
		spree: id,
		user: "122",
		status: 1,
		lastUpdate: new Date(),
		items: [{
				_id: Random.id(),
				name: 'Forever Sexy Unforgettable Demi Top',
				url: 'http://www.victoriassecret.com/swimwear/halter-top/unforgettable-demi-top-forever-sexy?ProductID=118695&CatalogueType=OLS&stop_mobi=yes',
				code: '',
				size: '38C',
				color: 'Coral Pink',
				quantity: 1,
				price: 24.20,
				SGD: 40
			}, {
				_id: Random.id(),
				name: 'Forever Top',
				url: 'http://www.victoriassecret.com/swimwear/halter-top/unforgettable-demi-top-forever-sexy?ProductID=118695&CatalogueType=OLS&stop_mobi=yes',
				code: '',
				size: '32a',
				color: 'Coral Blue',
				quantity: 1,
				price: 14,
				SGD: 50
			}
		]
	});

	Order.insert({
		spree: id,
		user: '122',
		status: 1,
		lastUpdate: new Date(),
		items: [{
				_id: Random.id(),
				name: 'Forever Sexy Unforgettable Demi Top',
				url: 'http://www.victoriassecret.com/swimwear/halter-top/unforgettable-demi-top-forever-sexy?ProductID=118695&CatalogueType=OLS&stop_mobi=yes',
				code: '',
				size: '38C',
				color: 'Coral Pink',
				quantity: 1,
				price: 24,
				SGD: 12
			}, {
				_id: Random.id(),
				name: 'Forever Top',
				url: 'http://www.victoriassecret.com/swimwear/halter-top/unforgettable-demi-top-forever-sexy?ProductID=118695&CatalogueType=OLS&stop_mobi=yes',
				code: '',
				size: '32',
				color: 'Coral Blue',
				quantity: 1,
				price: 14,
				SGD: 12
			}
		]
	});
}


console.timeEnd('loadData');