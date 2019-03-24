var mongoose = require('mongoose'),
		mongooseLocale = require('mongoose-locale'),
		mongooseBcrypt = require('mongoose-bcrypt');

var Schema = mongoose.Schema,
		ObjectId = Schema.ObjectId;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/' +  __app_name, {
	useCreateIndex: true,
	useNewUrlParser: true
});


// ------------------------
// *** Schema Block ***
// ------------------------


var userSchema = new Schema({
	login: String,
	password: String,
	email: String,
	status: String,
	date: {type: Date, default: Date.now},
});

var postSchema = new Schema({
	title: { type: String, trim: true, locale: true },
	s_title: { type: String, trim: true, locale: true },
	intro: { type: String, trim: true, locale: true },
	description: { type: String, trim: true, locale: true },
	categorys: [{ type: ObjectId, ref: 'Category' }],
	poster: { type: String },
	video: {
		provider: String,
		id: String
	},
	units: [{ type: ObjectId, ref: 'Unit' }],
	sym: { type: String, trim: true, index: true, unique: true, sparse: true },
	status: String,
	_short_id: { type: String, unique: true, index: true, sparse: true },
	date: { type: Date, default: Date.now },
});

var categorySchema = new Schema({
	title: { type: String, trim: true, locale: true },
	sym: { type: String, trim: true, index: true, unique: true, sparse: true },
	status: String,	// hidden
	_short_id: { type: String, unique: true, index: true, sparse: true },
	date: { type: Date, default: Date.now, index: true },
});

var memberSchema = new Schema({
	name: { type: String, trim: true, locale: true },
	intro: { type: String, trim: true, locale: true },
	photo: { type: String },
	status: String,	// hidden
	_short_id: { type: String, unique: true, index: true, sparse: true },
	date: { type: Date, default: Date.now, index: true },
});

var unitSchema = new Schema({
	title: { type: String, trim: true, locale: true },
	description: { type: String, trim: true, locale: true },
	attach: String,
	preview: String,
	status: String,	// hidden
	_short_id: { type: String, unique: true, index: true, sparse: true },
	date: { type: Date, default: Date.now, index: true },
});


// ------------------------
// *** Index Block ***
// ------------------------


postSchema.index({'title.value': 'text'}, {language_override: 'lg', default_language: 'ru'});
unitSchema.index({'title.value': 'text'}, {language_override: 'lg', default_language: 'ru'});
categorySchema.index({'title.value': 'text'}, {language_override: 'lg', default_language: 'ru'});
memberSchema.index({'name.value': 'text'}, {language_override: 'lg', default_language: 'ru'});


// ------------------------
// *** Plugins Block ***
// ------------------------


userSchema.plugin(mongooseBcrypt, { fields: ['password'] });

postSchema.plugin(mongooseLocale);
categorySchema.plugin(mongooseLocale);
memberSchema.plugin(mongooseLocale);
unitSchema.plugin(mongooseLocale);


// ------------------------
// *** Exports Block ***
// ------------------------


module.exports.User = mongoose.model('User', userSchema);

module.exports.Category = mongoose.model('Category', categorySchema);
module.exports.Post = mongoose.model('Post', postSchema);
module.exports.Member = mongoose.model('Member', memberSchema);
module.exports.Unit = mongoose.model('Unit', unitSchema);