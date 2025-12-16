import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import {
  Home as HomeIcon} from '@mui/icons-material';
import TaskIcon from '@mui/icons-material/Task';
import StarIcon from '@mui/icons-material/Star';
export const sidebarData = {
    admin:[ 
        {
            title: 'الرئيسية',
            path:"/",
            icon: HomeIcon,
        },
        {
            title: 'الحسابات',
            path:"/accounts",
            icon: ManageAccountsIcon,
        },
        {
            title: 'الحكومات',
            path:"/governments",
            icon: StarIcon,
        },
        {
            title: 'الشكاوي',
            path:"/complaints",
            icon: TaskIcon
        },
  
    ],
    employee:[ 
        {
            title: 'الرئيسية',
            path:"/",
            icon: HomeIcon,
        },
        {
            title:  'الشكاوي الواردة',
            path:"/complaints",
            icon: TaskIcon
        },
        {
            title: 'الشكاوي المحجوزة',
            path:"/submittedcomplaints",
            icon: TaskIcon
        }
    ]
}

