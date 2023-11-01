require('dotenv').config();
const AWS = require('aws-sdk');
const fs = require('fs');
const csv = require('fast-csv');

const userPoolId = process.env.USER_POOL_ID; 
const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

AWS.config.update({
	region,
	accessKeyId,
	secretAccessKey
});

const CognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider();

const writeStream = fs.createWriteStream('user_list.csv');

writeStream.on('finish', () => {
	console.log('CSVファイルのエクスポートが完了しました。');
});

// 再起処理でユーザー一覧を取得する
async function paginateUsers(params, users = []) {
	try {
		const data = await CognitoIdentityServiceProvider.listUsers(params).promise();
		users = users.concat(data.Users);

	if (data.PaginationToken) {
		params.PaginationToken = data.PaginationToken;

		return paginateUsers(params, users);
	}

	return users;

	} catch (err) {
		console.error('エラー:', err);
			return null;
		}
	}

// 初回のリクエスト
(async () => {
	const users = await paginateUsers({ UserPoolId: userPoolId });
	if (users) {
		const userData = users.map(user => {
		const emailAttribute = user.Attributes.find(attr => attr.Name === 'email');
		const emailVerified = user.Attributes.find(attr => attr.Name === 'email_verified');

		return {
			name: '',
			given_name: '',
			family_name: '',
			middle_name: '',
			nickname: '',
			preferred_username: '',
			profile: '',
			picture: '',
			website: '',
			email: emailAttribute ? emailAttribute.Value : '',
			email_verified: emailVerified ? emailVerified.Value : false,
			gender: '',
			birthdate: '',
			zoneinfo: '',
			locale: '',
			phone_number: '',
			phone_number_verified: '',
			address: '',
			updated_at: '',

			// カスタム属性等があれば追加
		};
	});

		csv
		.write(userData, { headers: true })
		.pipe(writeStream);
	}
})();