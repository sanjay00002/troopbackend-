import { generateReferralCode } from '../lib/referralCode';
import model from '../../../database/models';

const { User, UserRole, Role, Wallet } = model;

export default {
  getUserById: async function (req, res) {
    const id = req?.body?.id ? req?.body?.id : req?.id;

    try {
      // const user = await User.findOne({
      //   where: { id: id },
      //   attributes: {
      //     exclude: ['accessToken', 'refreshToken', 'loggedInAt'],
      //   },
      //   include: [
      //     {
      //       model: UserRole,
      //       required: true,
      //       include: [
      //         {
      //           model: Role,
      //           required: true,
      //         },
      //       ],
      //     },
      //   ],
      // });

      const user = await User.findByPk(id, {
        attributes: { exclude: ['accessToken', 'refreshToken', 'loggedInAt'] },
        where: {
          '$UserRoles.userId$': id,
        },
        include: [
          {
            model: UserRole,
            required: true,
            include: {
              model: Role,
              required: true,
            },
          },
          {
            model: Wallet,
            required: true,
            attributes: { exclude: ['createdAt', 'updatedAt', 'userId'] },
          },
        ],
      });

      const userId = await user?.get('id');

      if (userId) {
        console.log('User: ', await user.get());
        console.log(
          'Role: ',
          await user.get('UserRoles')[0]?.Role?.get('role'),
        );
        const result = {
          id: await user.get('id'),
          username: await user.get('username'),
          phoneNumber: await user.get('phoneNumber'),
          email: await user.get('email'),
          gender: await user.get('gender'),
          dob: await user.get('dob'),
          firstName: await user.get('firstName'),
          lastName: await user.get('lastName'),
          isBot: await user.get('isBot'),
          profileImage: await user.get('profileImage'),
          points: await user.get('points'),
          tickets: await user.get('tickets'),
          referralCode: await user.get('referralCode'),
          referrer: await user.get('referrer'),
          referredAt: await user.get('referredAt'),
          createdAt: await user.get('createdAt'),
          updatedAt: await user.get('updatedAt'),
          role: await user.get('UserRoles')[0]?.Role?.get('role'),
          wallet: await user.get('wallet')?.get(),
        };
        return res.status(200).json(result);
      } else {
        return res.status(404).json({
          error: 'No User Found!',
        });
      }
    } catch (error) {
      return res.status(500).json({
        errorMessage: error.message,
        error: 'Something went wrong while fetching the user by ID!',
      });
    }
  },

  updateCurrentUser: async function (req, res) {
    const userDetails = req.body;
    const userId = req.id;
    try {
      const user = await User.findByPk(userId, {
        attributes: { exclude: ['accessToken', 'refreshToken', 'loggedInAt'] },
      });

      if (user && (await user.get('isBot')) === false) {
        const referralCode = await generateReferralCode();

        await user.update({
          username: userDetails?.username ?? user.username,
          phoneNumber: userDetails?.phoneNumber ?? user.phoneNumber,
          email: userDetails?.email ?? user.email,
          gender: userDetails?.gender ?? user.gender,
          dob: userDetails?.dob ?? user.dob,
          firstName: userDetails?.firstName ?? user.firstName,
          lastName: userDetails?.lastName ?? user.lastName,
          profileImage: userDetails?.profileImage ?? user.profileImage,
          referralCode:
            user.referralCode ?? userDetails?.referrer ? referralCode : null,
          referrer: user.referrer ?? userDetails?.referrer,
          referredAt:
            user?.referredAt ?? userDetails?.referrer
              ? moment().toISOString()
              : null,
        });

        const result = await user.get();

        return res.status(200).json(result);
      } else {
        if (await user?.get('isBot'))
          return res
            .status(400)
            .json({ error: 'Cannot update the details of a bot!' });
        return res.status(404).json({
          error: 'No User Found!',
        });
      }
    } catch (error) {
      console.error('Error while updating every user', error);
      return res.status(500).json({
        errorMessage: error.errors?.map((error) => error.message),
        error: 'Something went wrong while updating the user by ID!',
      });
    }
  },

  updateCurrentUserProfile: async function (req, res) {
    const userDetails = req.body;
    try {
      const user = await User.findByPk(userDetails.userId, {
        attributes: { exclude: ['accessToken', 'refreshToken', 'loggedInAt'] },
      });
      if (user && (await user.get('isBot')) === false) {
        await user.update({
          profileImage: userDetails?.profileImage ?? user.profileImage,
        });

        const result = await user.get();

        return res.status(200).json(result);
      } else {
        if (await user?.get('isBot'))
          return res
            .status(400)
            .json({ error: 'Cannot update the details of a bot!' });
        return res.status(404).json({
          error: 'No User Found!',
        });
      }
    } catch (error) {
      console.error('Error while updating every user', error);
      return res.status(500).json({
        errorMessage: error.errors?.map((error) => error.message),
        error: 'Something went wrong while updating the user by ID!',
      });
    }
  },

  getAllUsers: async function (req, res) {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['accessToken', 'refreshToken', 'loggedInAt'] },
      });

      if (users.length > 0) {
        return res.status(200).json(users);
      } else {
        return res.status(404).json({
          error: 'No Users Found!',
        });
      }
    } catch (error) {
      return res.status(500).json({
        errorMessage: error.message,
        error: 'Something went wrong while fetching the users!',
      });
    }
  },
};
