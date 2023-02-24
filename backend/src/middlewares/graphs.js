const asyncHandler = require('express-async-handler');
const sql = require('sql-template-strings');

const db = require('../database');
const { newError } = require('../utls');
const Ajv = require('ajv');
const ajv = new Ajv();

module.exports.verifyCreateHealthGraph = asyncHandler(async (req, _res, next) => {
	const schema = {
		type: 'object',
		properties: {
            groupId: { type: 'number' },
			title: { type: 'string' },
			units: { type: 'string' }			
		},
		required: ['groupId','title', 'units']
	};
	const validate = ajv.compile(schema);
	if (!validate(req.body)) {
		return next(newError(JSON.stringify(validate.errors), 400));
	}
	next();
});

module.exports.createNewHealthGraph = asyncHandler(async (req, _res, next) => {
	var query = sql`INSERT INTO HealthGraphs(group_id, title, units) VALUES(${req.body.groupId}, ${req.body.title}, ${req.body.units});`;
	await db.query(query);
	next();
});

module.exports.getGraphsByGroupId = asyncHandler(async(req, _res, next) => {
	const query = sql`SELECT HG.id, HG.title, HG.units, HM.measurement, HM.date FROM \`Groups\`
						JOIN HealthGraphs HG on \`Groups\`.id = HG.group_id
						JOIN HealthMeasurements HM on HG.id = HM.graph_id
						WHERE Groups.id = ${req.params.groupId}
						ORDER BY HG.id, HM.date DESC;`;

	const result = await db.query(query);
	let graphs = {};
	
	for (const row of result) {
		if (!graphs[row.id]) {
			graphs[row.id] = {
				title: row.title,
				units: row.units,
				data: []
			}
		}
		if (!req.query.limit || graphs[row.id].data.length < parseInt(req.query.limit)) {
			graphs[row.id].data.push({
				timestamp: row.date,
				measurement: parseFloat(row.measurement)
			});
		}
	}

	for (const id of Object.keys(graphs)) {
		graphs[id].data = graphs[id].data.reverse();
	}

	req.result = graphs;
	next();
});

module.exports.checkIfGraphExists = asyncHandler(async (req, res, next) => {
	const query = sql`SELECT * FROM HealthGraphs
						WHERE HealthGraphs.id = ${req.params.graphId}`;
	const [result] = await db.query(query);

	if (!result) {
		return next(newError("This graph does not exist!", 404));
	}

	next();
});

module.exports.deleteGraph = asyncHandler(async (req, _res, next) => {
	let query = sql`DELETE FROM HealthGraphs WHERE id = ${req.params.graphId};`;
	await db.query(query);
	next();
});

module.exports.updateGraph = asyncHandler(async (req, _res, next) => {
	let query = sql`UPDATE HealthGraphs SET `;
	if (!req.body.title && !req.body.units) {
		return next(newError('Graph title or units must be provided!', 400));
	}
	if (req.body.title && req.body.units) {
		query.append(sql`title = ${req.body.title}, units = ${req.body.units}`);
	} else {
		if (req.body.title) {
			query.append(sql`title = ${req.body.title}`);
		}
		if (req.body.units) {
			query.append(sql`units = ${req.body.units}`);
		}
	}

	query.append(sql` WHERE id = ${req.params.graphId};`);
	await db.query(query);
	next();
});

module.exports.getGraphByGraphId = asyncHandler(async (req, _res, next) => {
	const query = sql`SELECT * FROM HealthGraphs WHERE id = ${req.params.graphId}`;
	const [result] = await db.query(query);

	if (!result) {
		return next(newError(`Graph (${req.params.graphId}) does not exist!`, 404));
	}

	req.result = result;
	next();
});