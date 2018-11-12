const mongo = require('./db');

async function insertOne(tableName, document) {
	const db = mongo.getDb();
	const table = db.collection(tableName);

	try {
		const result = await table.insertOne(document)
		return (result)
	}
	catch (e) {
		console.error('ERROR ! #mongo-crud-insertone tableName = ', tableName, 'document', document);
		throw e;
	}
}

async function insert(tableName, documents) {
	const db = mongo.getDb();
	const table = db.collection(tableName);

	try {
		const result = await table.insertOne(documents)
		return (result)
	}
	catch (e) {
		console.error('ERROR ! #mongo-crud-insert tableName = ', tableName, 'document', documents);
		throw e;
	}
}

async function saveOne (tableName, obj) {
	
	const db = mongo.getDb();
	const table = db.collection(tableName);

	try {
		const mtime = Date.now();
		const updateOperation = await table.updateOne({
			id: obj.id,
		},
		{
			$set: {
				...obj,
				updatedAt: mtime
			}
		},
		{
			upsert: true
		});
		return updateOperation;
	}
	catch (e) {
		console.error('ERROR ! #mongo-crud-saveone tableName = ', tableName, 'object', obj);
		throw e;
	}
}

async function findOne (tableName, query, projection) {
	const db = mongo.getDb();
	const table = db.collection(tableName);

	try {
		const result = await table.findOne(query, projection)
		return (result)
	}
	catch (e) {
		console.error('ERROR ! #mongo-crud-findone tableName = ', tableName, 'query', query);
		throw e;
	}
}

async function deleteOne (tableName, filter) {
	const db = mongo.getDb();
	const table = db.collection(tableName);

	try {
		const result = await table.removeOne(filter)
		return (result)
	}
	catch (e) {
		console.error('ERROR ! #mongo-crud-deleteone tableName = ', tableName, 'filter', filter);
		throw e;
	}
}

async function find (tableName, query, projection) {
	const db = mongo.getDb();
	const table = db.collection(tableName);

	try {
		const result = await table.find(query, projection)
		return (result)
	}
	catch (e) {
		console.error('ERROR ! #mongo-crud-find tableName = ', tableName, 'query', query);
		throw e;
	}
}

async function countDocuments (tableName, query, options) {
	const db = mongo.getDb();
	const table = db.collection(tableName);

	try {
		const result = await table.countDocuments(query, options)
		return (result)
	}
	catch (e) {
		console.error('ERROR ! #mongo-crud-countdocuments tableName = ', tableName, 'query', query);
		throw e;
	}
}

exports.insert = insert
exports.insertOne = insertOne
exports.find = find
exports.findOne = findOne
exports.deleteOne = deleteOne
exports.countDocuments = countDocuments

exports.saveOne = saveOne