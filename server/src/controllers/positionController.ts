// src/controllers/positionController.ts
import { Request, Response } from 'express';
import Position, { IPosition } from '../models/Position';

// Get all positions
export const getAllPositions = async (req: Request, res: Response): Promise<void> => {
  try {
    const positions = await Position.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: positions.length,
      data: positions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Create new position
export const createPosition = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title } = req.body;

    if (!title) {
      res.status(400).json({
        success: false,
        error: 'Please provide a title'
      });
      return;
    }

    const position = await Position.create({ title });
    
    res.status(201).json({
      success: true,
      data: position
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        error: 'Position with this title already exists'
      });
      return;
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get single position
export const getPosition = async (req: Request, res: Response): Promise<void> => {
  try {
    const position = await Position.findById(req.params.id);

    if (!position) {
      res.status(404).json({
        success: false,
        error: 'Position not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: position
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Update position
export const updatePosition = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, isActive } = req.body;
    
    const position = await Position.findByIdAndUpdate(
      req.params.id,
      { title, isActive },
      { new: true, runValidators: true }
    );

    if (!position) {
      res.status(404).json({
        success: false,
        error: 'Position not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: position
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        error: 'Position with this title already exists'
      });
      return;
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Delete position
export const deletePosition = async (req: Request, res: Response): Promise<void> => {
  try {
    const position = await Position.findByIdAndDelete(req.params.id);

    if (!position) {
      res.status(404).json({
        success: false,
        error: 'Position not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Toggle position status
export const togglePositionStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const position = await Position.findById(req.params.id);

    if (!position) {
      res.status(404).json({
        success: false,
        error: 'Position not found'
      });
      return;
    }

    position.isActive = !position.isActive;
    await position.save();

    res.status(200).json({
      success: true,
      data: position
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};