import { FileRoute } from './file.route';
import { UserRoute } from './user.routes';

const AppRoutes = [new FileRoute(), new UserRoute()];

export default AppRoutes;
