import {configureStore} from '@reduxjs/toolkit';
import CategorySlice from './CategorySlice';
// import ApplicationSlice from './ApplicationSlice';
import  loaderSlice  from './ApplicationSlice';
import TicketSlice from './TicketSlice';
import BranchSlice from './BranchSlice';
import UserSlice from './UserSlice';
import LoginSlice from './LoginSlice';
import ViewTicketSlice from './ViewTicketSlice';
import AccessSlice from './AccessSlice';
import DashboardSlice from './DashboardSlice';
import ReportSlice from './ReportSlice';
import FilterTicketSlice from './FilterTicketSlice';
import PredefinedSlice from './PredefinedSlice';
import EodSlice from './EodSlice';
import SeveritySlice from './SeveritySlice';
import FaqSlice from './FaqSlice';
import ManualSlice from './ManualSlice';
import LinkSlice from './LinkSlice';

const store = configureStore({
    reducer: {
        category: CategorySlice,
        application: loaderSlice,
        ticket: TicketSlice,
        branch: BranchSlice,
        user: UserSlice,
        login: LoginSlice,
        viewticket: ViewTicketSlice,
        accesscontrol: AccessSlice,
        dashboard: DashboardSlice,
        report: ReportSlice,
        filterticket: FilterTicketSlice,
        predefined: PredefinedSlice,
        eod: EodSlice,
        severity: SeveritySlice,
        faq: FaqSlice,
        manual: ManualSlice,
        link: LinkSlice
    }
});

export default store;