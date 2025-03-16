import BlacklistToken from '../models/BlacklistToken';
import { TokenTypeE } from '../types/Token';

export default {
  isTokenBlacklisted: async (token: string): Promise<boolean> => {
    const blacklistedToken = await BlacklistToken.findOne({
      where: {
        token,
        type: TokenTypeE.LOGGED_TOKEN,
      },
    });

    return !!blacklistedToken;
  },
};
