import { Op } from 'sequelize';
import model from '../models';
import moment from 'moment';

const { Contest, Participants } = model;

export default {
  createContest: async function (req, res) {
    const contest = req.body;
    const userId = req.id;

    try {
      const newContest = await Contest.create({
        name: contest?.name,
        category: contest?.category,
        pricePool: contest?.pricePool,
        createdBy: userId,
        slots: contest?.slots,
        startTime: contest?.startTime,
        endTime: contest?.endTime,
        priceDistribution: contest?.priceDistribution,
      });

      if (await newContest.get('id')) {
        return res.status(201).json({
          ...(await newContest.get()),
        });
      }
    } catch (error) {
      return res.status(500).json({
        error: 'Something went wrong while creating the contest',
        errorMessage: error.message,
      });
    }
  },

  getContestById: async function (req, res) {
    const { id } = req.body;

    try {
      const contest = await Contest.findOne({
        where: {
          id: id,
        },
      });

      if (contest) {
        return res.status(200).json({
          ...(await contest.get()),
        });
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

  getContestsByCategory: async function (req, res) {
    const { category } = req.body;

    try {
      const contest = await Contest.findAll({
        where: {
          category: category,
        },
      });

      if (contest) {
        return res.status(200).json(contest);
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

  joinContestById: async function (req, res) {
    const userId = req.id;
    const contestDetails = req.body;

    /*
     *  Check if there is any contest with the given id
     *  Check if the user has already joined the contest by checking the userId and contestId in the Participants table
     *  Add User to the contest as well as to the array of participants in the Contest table
     */

    try {
      if (contestDetails?.id) {
        const existingContest = await Contest.findByPk(contestDetails?.id);

        console.log('Existing Contest: ', existingContest);

        // * Check if contest exists
        if (existingContest) {
          const alreadyJoined = await Participants.findOne({
            where: { userId, contestId: contestDetails.id },
          });

          // * Check if user has already joined the contest
          if (alreadyJoined) {
            return res.status(400).json({
              message: 'User has already joined the contest',
            });
          }

          // * Add user to the contest
          const newParticipant = await Participants.create({
            userId,
            contestId: contestDetails.id,
            selectedStocks: contestDetails?.selectedStocks,
            joinedAt: moment().toISOString(),
          });

          // * Add user in the participants field of the Contest Schema as well
          if (newParticipant) {
            const result = await newParticipant.get();
            console.log('Result: ', result);
            const joinedContest = await existingContest.get('participants');
            console.log('Joined Contest: ', joinedContest);
            const newParticipants =
              joinedContest !== null ? [...joinedContest] : [];

            newParticipants.push(userId);

            console.log('Participants: ', newParticipants);

            await existingContest.update({
              participants: newParticipants,
            });

            return res.status(201).json({ ...result });
          }
        } else {
          return res.status(404).json({
            message: 'No Contest Found!',
          });
        }
      } else {
        return res.status(422).json({
          error: 'Provided a bad contest id!',
        });
      }
    } catch (error) {
      console.error('Error while joining the contest: ', error);
      return res.status(500).json({
        error: 'Something went wrong while joining the contest by id',
        errorMessage: error.message,
      });
    }
  },
};
