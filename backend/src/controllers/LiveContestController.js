import { Op, Sequelize } from 'sequelize';
import model from '../../../database/models';
import moment from 'moment';
import { Pool } from "pg";

const pool = new Pool({
	user: process.env.PGUSER,
	host: process.env.PGHOST,
	database: process.env.PGDATABASE,
	password: process.env.PGPASSWORD,
	port: process.env.PGPORT,
  });

const { LiveContest, User, Stocks, MatchedLiveUser, LiveContestUserPool } = model;
const getStock = require('../../Stock-socket/getStocks');
export default {
	createLiveContest: async function (req, res) {
		const contest = req.body;
		const userId = req.id;

		try {
			const user = await User.findByPk(userId);
			const stock1 = await Stocks.findByPk(contest.stock1Id);
			const stock2 = await Stocks.findByPk(contest.stock2Id);

			console.log(stock1)
			if (user && !user?.isBot) {
				const newContest = await LiveContest.create({
					stock1Id: contest?.stock1Id,
					stock2Id: contest?.stock2Id,
					entryAmount: contest?.entryAmount,
					createdBy: userId,
					canJoin: true,
					contestDate: moment.tz('Asia/Calcutta'),
					entryAmount: [50, 100, 150]
					// stocktoken1: stock1?.token,
					// stocktoken2: stock2?.token,
				});

				const newContestId = await newContest.get('id');

				if (newContestId) {
					return res.status(201).json({
						...(await newContest.get()),
					});
				}
			} else {
				return res.status(400).json({
					message: 'Cannot create contest without non-existing user!',
				});
			}
		} catch (error) {
			return res.status(500).json({
				error: 'Something went wrong while creating the contest',
				errorMessage: error.message,
			});
		}
	},

	getLiveContestById: async function (req, res) {
		const { id } = req.body;

		try {
			// * Fetch the contest and the prize distribution
			const contest = await LiveContest.findByPk(id);

			console.log('Constest: ', contest);

			if (contest) {
				// * Fetch the stocks related to the subCategory

				const stock1 = await Stocks.findByPk(contest.stock1Id);
				const stock2 = await Stocks.findByPk(contest.stock2Id);


				const stocksArr = {
					company1: stock1,
					company2: stock2,
				};

				console.log(stock1)
				// console.log('Stocks Arr: ', stocksArr);

				const result = {
					...(await contest.get()),
					stocks: stocksArr,
				};
				return res.status(200).json(result);
			} else {
				return res.status(404).json({ error: 'No contest found!' });
			}
		} catch (error) {
			return res.status(500).json({
				error: 'Something went wrong while fetching contest by id',
				errorMessage: error.message,
			});
		}
	},

	getLiveContests: async function (req, res) {
		try {
			const contests = await LiveContest.findAll({
				where: {
					isActive: true,
					canJoin: true
				},
			});
			if (contests) {
				return res.status(200).json(contests);
			} else {
				return res.status(404).json({ error: 'No contest found!' });
			}
		} catch (error) {
			return res.status(500).json({
				error: 'Something went wrong while fetching contests',
				errorMessage: error.message,
			});
		}
	},


	// joinLiveContest: async function (req, res) {
	// 	const userId = req.id
	// 	const { id, contestId, matchRequestid, stockId, stockValue, contestEntryPrice} = req.body

	// 	// console.log(userId)
	// 	// console.log(id, contestId, matchRequestId, stockId, stockValue, contestEntryPrice)
	// 	const selectQuery = 'SELECT * FROM public."LiveContestUserPool" WHERE "LiveContestUserPool"."contestId" = $1 LIMIT 1'

	// 	const result = await pool.query(selectQuery, [contestId])
	// 	const opponent = result.rows[0];
	// 	if(opponent){
	// 		console.log("Found an opponent for you, need to do a match")
	// 	}
	// 	else{
	// 		console.log("No opponent found for you")
	// 	}

	// 	res.send("heyo")
	// }

	// getLiveContestHistoryById: async function (req, res) {
	//   const userId = req.id;
	//   try {
	//     const user = await User.findByPk(userId);
	//     if (user && !user?.isBot) {
	//       const history = await MatchedLiveUser.findAll({
	//         where: {
	//           [Op.or]: [{ selfId: userId }, { opponentId: userId }],
	//         },
	//       });
	//       return res.status(200).json(history);
	//     } else {
	//       return res.status(404).json({ error: 'No User found!' });
	//     }
	//   } catch (error) {
	//     return res.status(500).json({
	//       error: 'Something went wrong while fetching live contest history',
	//       errorMessage: error.message,
	//     });
	//   }
	// },



};

