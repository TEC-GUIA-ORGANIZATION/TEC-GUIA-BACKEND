import * as express from 'express';
import { MulterFile } from 'multer';

declare global  {
  namespace Express {
    export interface Request {
        userId: string;
    }
  }
}

declare global {
  namespace Express {
    interface Request {
      file?: MulterFile;
    }
  }
}