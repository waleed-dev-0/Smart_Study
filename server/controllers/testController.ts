import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

export const testDb = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const state = mongoose.connection.readyState;
    const states: { [key: number]: string } = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };
    
    res.json({ 
      success: true, 
      message: 'MongoDB Connection Status',
      status: states[state]
    });
  } catch (error) {
    next(error);
  }
};

export const testRelations = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const models = mongoose.modelNames();
    res.json({
      success: true,
      registeredModels: models
    });
  } catch (error) {
    next(error);
  }
};
