import { isAuthenticated, getUserRole, hasAnyRole, isAdmin, isManager } from '../services/auth.service';
import { UserRoleEnum } from '../schemas/schema';
const { ADMIN, MANAGER, STAFF_GUDANG, PICKER } = UserRoleEnum.enum;

export const useAuth = () => {
    return {
        isAuthenticated: isAuthenticated(),
        role: getUserRole(),
        isAdmin: isAdmin(),
        isManager: isManager(),
        isStaffGudang: hasAnyRole([STAFF_GUDANG]),
        isPicker: hasAnyRole([PICKER]),
        canAccessReports: hasAnyRole([ADMIN, MANAGER]),
        canManageStock: hasAnyRole([ADMIN, MANAGER, STAFF_GUDANG]),
    };
};