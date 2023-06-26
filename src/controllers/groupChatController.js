import { Op } from 'sequelize';
import model from '../models';
import moment from 'moment';
import groupChat from '../models/groupChat';

const { GroupChat, User } = model;

export default {
  createGroup: async function (req, res) {
    const group = req.body;
    const userId = req.id;


    try {
      const newGroup = await GroupChat.create({
        name: group?.name,
        createdBy: userId,
        image: group?.image,
        description: group?.description,
        participants: group?.participants,
      });


      if (await newGroup.get('id')) {
        return res.status(201).json({
          ...(await newGroup.get()),
        });
      }
    } catch (error) {
      return res.status(500).json({
        error: 'Something went wrong while creating the Group',
        errorMessage: error.message,
      });
    }
  },

  addMembers: async function (req, res) {

    const userId = req.id;
    const groupDetails = req.body;
  
    try {
      // Find the group
      const group = await GroupChat.findByPk(groupDetails.id);
  
      if (!group) {
        return res.status(404).json({
          error: 'Group not found',
        });
      }
  
      // Check if the current user is the creator of the group
      if (group.createdBy !== userId) {
        return res.status(403).json({
          error: 'Only the group creator can add members',
        });
      }
  
      // Get the existing participants of the group
      const existingParticipants = group.participants || [];
  
      // Add the new members to the group
      const updatedParticipants = [...existingParticipants, ...groupDetails.members];
  
      // Update the group with the new participants
      const updatedGroup = await group.update({
        participants: updatedParticipants,
      });
  
      return res.status(200).json({
        group: updatedGroup,
      });

    } catch (error) {
      return res.status(500).json({
        error: 'Something went wrong while adding members to the group',
        errorMessage: error.message,
      });
    }
  },

  deleteMember: async function (req, res) {
    const userId = req.id;
    const groupDetails = req.body;
  
    try {
      // Find the group
      const group = await GroupChat.findByPk(groupDetails.id);
  
      if (!group) {
        return res.status(404).json({
          error: 'Group not found',
        });
      }
  
      // Check if the current user is the creator of the group
      if (group.createdBy !== userId) {
        return res.status(403).json({
          error: 'Only the group creator can delete members',
        });
      }
  
      // Get the existing participants of the group
      const existingParticipants = group.participants || [];
  
      // Find the index of the member to be deleted
      const memberIndex = existingParticipants.indexOf(groupDetails.memberId);
  
      if (memberIndex === -1) {
        return res.status(404).json({
          error: 'Member not found in the group',
        });
      }
  
      // Remove the member from the group
      existingParticipants.splice(memberIndex, 1);
  
      // Update the group with the updated participants
      const updatedGroup = await group.update({
        participants: existingParticipants,
      });
  
      return res.status(200).json({
        group: updatedGroup,
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Something went wrong while deleting the member from the group',
        errorMessage: error.message,
      });
    }
  },
};
