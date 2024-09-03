import { Request } from '../types/expressOverride';

const AuthService = {
  getAuthorizationHeader(req: Request): string | undefined {
    const authHeader = req.headers.authorization;
    return authHeader;
  },
  getLoggedTokenPrefix(req: Request): string | undefined {
    const authHeader = AuthService.getAuthorizationHeader(req);
    return authHeader ? authHeader.split(' ')[0] as string : undefined;
  },

  getLoggedToken(req: Request): string | undefined {
    const authHeader = AuthService.getAuthorizationHeader(req);
    return authHeader ? authHeader.split(' ')[1] as string : undefined;
  },
};

export default AuthService;
