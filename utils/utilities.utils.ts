import { validationResult } from 'express-validator';
import { Response, Request } from 'express';

const Utilities = {
  handleExpressValidators: (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ msg: errors.array() });
    }
    return null;
  },
};

export default Utilities;
