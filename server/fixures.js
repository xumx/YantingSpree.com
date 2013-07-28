console.time('loadData');

if (Meteor.users.find().count() === 0) {
	var id = Accounts.createUser({
		username: 'admin',
		password: 'apple1',
		profile: {
			email: 'deepthought@gmail.com'
		}
	});

	Roles.addUsersToRoles(id, 'admin');
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

console.timeEnd('loadData');